-- RealismThrift inquiry persistence, email outbox, webhook audit, and retry RPCs.
-- Apply this migration to the Supabase project before enabling the website form.

create extension if not exists pgcrypto;

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  submission_key uuid not null unique,
  name text not null check (char_length(name) between 1 and 80),
  email text not null check (char_length(email) between 3 and 120),
  whatsapp text not null check (char_length(whatsapp) between 1 and 32),
  country text not null default '' check (char_length(country) <= 80),
  product text not null default '' check (char_length(product) <= 40),
  quantity text not null default '' check (char_length(quantity) <= 40),
  message text not null default '' check (char_length(message) <= 2000),
  source_path text not null default '/' check (char_length(source_path) <= 200),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  retention_until timestamptz not null default (now() + interval '24 months')
);

create table if not exists public.inquiry_email_jobs (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid not null references public.inquiries(id) on delete cascade,
  kind text not null check (kind in ('sales_notification', 'customer_ack')),
  status text not null default 'queued' check (
    status in (
      'queued', 'processing', 'accepted', 'sent', 'delivered', 'delayed',
      'failed', 'dead', 'bounced', 'complained', 'suppressed'
    )
  ),
  from_email text not null,
  to_email text not null,
  reply_to_email text not null,
  subject text not null,
  template_version text not null default 'v1',
  idempotency_key text not null unique,
  resend_email_id text unique,
  attempt_count smallint not null default 0 check (attempt_count between 0 and 5),
  next_attempt_at timestamptz not null default now(),
  locked_until timestamptz,
  last_error_code text,
  last_error_message text,
  last_event_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (inquiry_id, kind)
);

create table if not exists public.resend_webhook_events (
  svix_id text primary key,
  email_id text not null,
  job_id uuid references public.inquiry_email_jobs(id) on delete cascade,
  event_type text not null,
  event_created_at timestamptz not null,
  processed_at timestamptz not null default now()
);

create index if not exists inquiry_email_jobs_retry_idx
  on public.inquiry_email_jobs (next_attempt_at, created_at)
  where status in ('queued', 'failed', 'processing');

create index if not exists inquiry_email_jobs_ack_cooldown_idx
  on public.inquiry_email_jobs (lower(to_email), created_at desc)
  where kind = 'customer_ack';

create index if not exists resend_webhook_events_email_idx
  on public.resend_webhook_events (email_id, event_created_at desc);

create index if not exists inquiries_retention_idx
  on public.inquiries (retention_until);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists inquiries_set_updated_at on public.inquiries;
create trigger inquiries_set_updated_at
before update on public.inquiries
for each row execute function public.set_updated_at();

drop trigger if exists inquiry_email_jobs_set_updated_at on public.inquiry_email_jobs;
create trigger inquiry_email_jobs_set_updated_at
before update on public.inquiry_email_jobs
for each row execute function public.set_updated_at();

create or replace function public.create_inquiry_with_email_jobs(
  p_submission_key uuid,
  p_name text,
  p_email text,
  p_whatsapp text,
  p_country text,
  p_product text,
  p_quantity text,
  p_message text,
  p_source_path text,
  p_sales_to text,
  p_sales_from text,
  p_customer_from text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_inquiry public.inquiries%rowtype;
  v_created boolean := false;
  v_sales_subject text;
  v_customer_subject text;
begin
  insert into public.inquiries (
    submission_key, name, email, whatsapp, country, product, quantity, message, source_path
  ) values (
    p_submission_key, p_name, p_email, p_whatsapp, p_country, p_product,
    p_quantity, p_message, p_source_path
  )
  on conflict (submission_key) do nothing
  returning * into v_inquiry;

  if v_inquiry.id is not null then
    v_created := true;
  else
    select * into strict v_inquiry
    from public.inquiries
    where submission_key = p_submission_key;

    if v_inquiry.name is distinct from p_name
      or v_inquiry.email is distinct from p_email
      or v_inquiry.whatsapp is distinct from p_whatsapp
      or v_inquiry.country is distinct from p_country
      or v_inquiry.product is distinct from p_product
      or v_inquiry.quantity is distinct from p_quantity
      or v_inquiry.message is distinct from p_message
      or v_inquiry.source_path is distinct from p_source_path then
      raise exception using
        errcode = '22023',
        message = 'submission_key_conflict';
    end if;
  end if;

  v_sales_subject := format(
    '[Website Inquiry] %s · %s · %s',
    p_name,
    coalesce(nullif(p_country, ''), 'Unknown Country'),
    coalesce(nullif(p_product, ''), 'General Inquiry')
  );
  v_customer_subject := format('Thank you for your inquiry, %s — RealismThrift', p_name);

  insert into public.inquiry_email_jobs (
    inquiry_id, kind, from_email, to_email, reply_to_email, subject, idempotency_key
  ) values (
    v_inquiry.id,
    'sales_notification',
    p_sales_from,
    p_sales_to,
    p_email,
    v_sales_subject,
    format('inquiry/%s/sales/v1', v_inquiry.id)
  )
  on conflict (inquiry_id, kind) do nothing;

  -- Avoid repeatedly sending automated mail to the same third-party address.
  -- The inquiry and sales notification are still created for every valid submission.
  perform pg_advisory_xact_lock(hashtextextended(lower(p_email), 0));

  insert into public.inquiry_email_jobs (
    inquiry_id, kind, from_email, to_email, reply_to_email, subject, idempotency_key
  )
  select
    v_inquiry.id,
    'customer_ack',
    p_customer_from,
    p_email,
    p_sales_to,
    v_customer_subject,
    format('inquiry/%s/customer/v1', v_inquiry.id)
  where not exists (
    select 1
    from public.inquiry_email_jobs existing_ack
    where existing_ack.kind = 'customer_ack'
      and lower(existing_ack.to_email) = lower(p_email)
      and existing_ack.created_at >= now() - interval '24 hours'
  )
  on conflict (inquiry_id, kind) do nothing;

  return jsonb_build_object('id', v_inquiry.id, 'created', v_created);
end;
$$;

create or replace function public.claim_inquiry_email_jobs(
  p_limit integer default 20,
  p_inquiry_id uuid default null
)
returns table (
  job_id uuid,
  inquiry_id uuid,
  kind text,
  attempt_count smallint,
  from_email text,
  to_email text,
  reply_to_email text,
  subject text,
  template_version text,
  idempotency_key text,
  name text,
  email text,
  whatsapp text,
  country text,
  product text,
  quantity text,
  message text,
  source_path text,
  inquiry_created_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  with candidates as (
    select j.id
    from public.inquiry_email_jobs j
    where (p_inquiry_id is null or j.inquiry_id = p_inquiry_id)
      and (
        (
          j.status in ('queued', 'failed')
          and j.attempt_count < 5
          and j.next_attempt_at <= now()
        )
        or (
          j.status = 'processing'
          and j.attempt_count <= 5
          and j.locked_until <= now()
        )
      )
      and j.created_at >= now() - interval '23 hours'
    order by j.next_attempt_at, j.created_at
    for update skip locked
    limit greatest(1, least(coalesce(p_limit, 20), 50))
  ),
  claimed as (
    update public.inquiry_email_jobs j
    set
      status = 'processing',
      attempt_count = least(j.attempt_count + 1, 5),
      locked_until = now() + interval '2 minutes',
      last_error_code = null,
      last_error_message = null
    from candidates c
    where j.id = c.id
    returning j.*
  )
  select
    c.id,
    c.inquiry_id,
    c.kind,
    c.attempt_count,
    c.from_email,
    c.to_email,
    c.reply_to_email,
    c.subject,
    c.template_version,
    c.idempotency_key,
    i.name,
    i.email,
    i.whatsapp,
    i.country,
    i.product,
    i.quantity,
    i.message,
    i.source_path,
    i.created_at
  from claimed c
  join public.inquiries i on i.id = c.inquiry_id;
$$;

create or replace function public.apply_resend_email_state(p_email_id text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_job_id uuid;
  v_event_type text;
  v_event_created_at timestamptz;
  v_status text;
begin
  select id into v_job_id
  from public.inquiry_email_jobs
  where resend_email_id = p_email_id;

  if v_job_id is null then
    return;
  end if;

  update public.resend_webhook_events
  set job_id = v_job_id
  where email_id = p_email_id and job_id is null;

  select event_type, event_created_at
  into v_event_type, v_event_created_at
  from public.resend_webhook_events
  where email_id = p_email_id
  order by event_created_at desc, processed_at desc
  limit 1;

  if v_event_type is null then
    return;
  end if;

  v_status := case v_event_type
    when 'email.sent' then 'sent'
    when 'email.delivered' then 'delivered'
    when 'email.delivery_delayed' then 'delayed'
    when 'email.bounced' then 'bounced'
    when 'email.complained' then 'complained'
    when 'email.suppressed' then 'suppressed'
    else null
  end;

  if v_status is null then
    return;
  end if;

  update public.inquiry_email_jobs
  set
    status = v_status,
    last_event_at = v_event_created_at,
    locked_until = null
  where id = v_job_id
    and (last_event_at is null or last_event_at <= v_event_created_at)
    and (
      public.inquiry_email_jobs.status not in ('delivered', 'bounced', 'complained', 'suppressed')
      or public.inquiry_email_jobs.status = v_status
      or (public.inquiry_email_jobs.status = 'delivered' and v_status = 'complained')
    );
end;
$$;

create or replace function public.record_resend_webhook_event(
  p_svix_id text,
  p_email_id text,
  p_event_type text,
  p_event_created_at timestamptz
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_inserted integer;
begin
  insert into public.resend_webhook_events (
    svix_id, email_id, event_type, event_created_at
  ) values (
    p_svix_id, p_email_id, p_event_type, p_event_created_at
  )
  on conflict (svix_id) do nothing;

  get diagnostics v_inserted = row_count;
  if v_inserted = 0 then
    return false;
  end if;

  perform public.apply_resend_email_state(p_email_id);
  return true;
end;
$$;

create or replace function public.cleanup_expired_inquiries()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_inquiries integer;
  v_orphan_events integer;
begin
  delete from public.inquiries where retention_until <= now();
  get diagnostics v_inquiries = row_count;

  delete from public.resend_webhook_events
  where job_id is null and processed_at <= now() - interval '24 months';
  get diagnostics v_orphan_events = row_count;

  return v_inquiries + v_orphan_events;
end;
$$;

alter table public.inquiries enable row level security;
alter table public.inquiry_email_jobs enable row level security;
alter table public.resend_webhook_events enable row level security;

revoke all on public.inquiries from anon, authenticated;
revoke all on public.inquiry_email_jobs from anon, authenticated;
revoke all on public.resend_webhook_events from anon, authenticated;

grant select, insert, update, delete on public.inquiries to service_role;
grant select, insert, update, delete on public.inquiry_email_jobs to service_role;
grant select, insert, update, delete on public.resend_webhook_events to service_role;

revoke all on function public.create_inquiry_with_email_jobs(
  uuid, text, text, text, text, text, text, text, text, text, text, text
) from public, anon, authenticated;
revoke all on function public.claim_inquiry_email_jobs(integer, uuid)
  from public, anon, authenticated;
revoke all on function public.apply_resend_email_state(text)
  from public, anon, authenticated;
revoke all on function public.record_resend_webhook_event(text, text, text, timestamptz)
  from public, anon, authenticated;
revoke all on function public.cleanup_expired_inquiries()
  from public, anon, authenticated;

grant execute on function public.create_inquiry_with_email_jobs(
  uuid, text, text, text, text, text, text, text, text, text, text, text
) to service_role;
grant execute on function public.claim_inquiry_email_jobs(integer, uuid) to service_role;
grant execute on function public.apply_resend_email_state(text) to service_role;
grant execute on function public.record_resend_webhook_event(text, text, text, timestamptz)
  to service_role;
grant execute on function public.cleanup_expired_inquiries() to service_role;

create or replace view public.inquiry_delivery_overview
with (security_invoker = true)
as
select
  i.id,
  i.created_at,
  i.name,
  i.email,
  i.whatsapp,
  i.country,
  i.product,
  i.quantity,
  i.source_path,
  max(j.status) filter (where j.kind = 'sales_notification') as sales_email_status,
  max(j.status) filter (where j.kind = 'customer_ack') as customer_email_status,
  max(j.attempt_count) filter (where j.kind = 'sales_notification') as sales_attempts,
  max(j.attempt_count) filter (where j.kind = 'customer_ack') as customer_attempts
from public.inquiries i
left join public.inquiry_email_jobs j on j.inquiry_id = i.id
group by i.id;

revoke all on public.inquiry_delivery_overview from public, anon, authenticated;
grant select on public.inquiry_delivery_overview to service_role;

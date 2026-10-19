-- Safe Meta CAPI delivery diagnostics. Apply before deploying the logging code.
-- Each API decision has its own id; event_id deliberately is not unique.

create table if not exists public.meta_capi_delivery_logs (
  id uuid primary key,
  inquiry_id uuid not null references public.inquiries(id) on delete cascade,
  event_id uuid not null,
  pixel_id text check (pixel_id ~ '^[0-9]{1,32}$'),
  event_name text not null default 'Lead' check (event_name = 'Lead'),
  graph_api_version text not null check (graph_api_version ~ '^v[0-9]{1,3}\.[0-9]{1,3}$'),
  event_time_seconds bigint,
  status text not null check (status in ('started', 'sent', 'skipped', 'failed')),
  skip_reason text check (skip_reason in (
    'disabled', 'missing_token', 'missing_pixel', 'invalid_event_id', 'duplicate_submission'
  )),
  attempt_count smallint check (attempt_count between 0 and 2),
  attempts jsonb not null default '[]'::jsonb,
  http_status smallint check (http_status between 100 and 599),
  events_received integer check (events_received >= 0),
  error_name text check (error_name in (
    'HttpError', 'InvalidResponse', 'TypeError', 'AbortError', 'TimeoutError', 'UnknownError'
  )),
  meta_error_code integer,
  trace_id text check (trace_id ~ '^[A-Za-z0-9_-]{1,100}$'),
  has_email_hash boolean,
  has_phone_hash boolean,
  has_fbp boolean,
  has_fbc boolean,
  started_at timestamptz not null,
  completed_at timestamptz,
  duration_ms integer check (duration_ms >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null,
  check (case when jsonb_typeof(attempts) = 'array'
    then jsonb_array_length(attempts) <= 2
    else false end),
  check (octet_length(attempts::text) <= 16384),
  check (attempt_count is null or attempt_count = jsonb_array_length(attempts)),
  check ((status = 'started' and completed_at is null)
    or (status <> 'started' and completed_at is not null)),
  check ((status = 'skipped' and skip_reason is not null
      and attempt_count is not null and attempt_count = 0 and attempts = '[]'::jsonb)
    or (status <> 'skipped' and skip_reason is null)),
  check (status <> 'sent' or (
    events_received is not null and events_received = 1
    and http_status is not null and http_status between 200 and 299
    and attempt_count is not null and attempt_count between 1 and 2
  )),
  check (status <> 'started' or (attempt_count is null and attempts = '[]'::jsonb)),
  check (status = 'failed' or error_name is null)
);

create index if not exists meta_capi_delivery_logs_inquiry_idx
  on public.meta_capi_delivery_logs (inquiry_id, started_at desc);
create index if not exists meta_capi_delivery_logs_event_idx
  on public.meta_capi_delivery_logs (event_id, started_at desc);
create index if not exists meta_capi_delivery_logs_started_idx
  on public.meta_capi_delivery_logs (started_at desc);
create index if not exists meta_capi_delivery_logs_status_idx
  on public.meta_capi_delivery_logs (status, started_at desc);

alter table public.meta_capi_delivery_logs enable row level security;

revoke all on public.meta_capi_delivery_logs from PUBLIC, anon, authenticated;
-- Remove any wider default service grants before granting only required CRUD.
revoke all on public.meta_capi_delivery_logs from service_role;
grant select, insert, update, delete on public.meta_capi_delivery_logs to service_role;

-- No policies: this table is accessible only through the server admin client.

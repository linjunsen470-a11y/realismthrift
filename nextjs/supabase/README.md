# Inquiry pipeline deployment

The application code is build-safe without production secrets, but `/api/send` becomes active only after the Supabase migration and server-only environment variables are configured.

## 1. Create and migrate Supabase

1. In the Vercel Marketplace, create a Supabase project in Singapore and connect it to the production Vercel project.
2. Apply `migrations/202607100001_inquiry_pipeline.sql` first, then `migrations/202610190001_meta_capi_delivery_logs.sql` in the Supabase SQL Editor (or with the Supabase CLI). For an existing inquiry installation, apply only the new migration. Apply the new migration **before deploying the logging code**.
3. Confirm that RLS is enabled on `inquiries`, `inquiry_email_jobs`, `resend_webhook_events`, and `meta_capi_delivery_logs`, with no client policies. Verify the new table's grants as described below.
4. Keep `SUPABASE_URL` and `SUPABASE_SECRET_KEY` scoped to Vercel Production. The application does not use the public Supabase keys for inquiry processing.

## 2. Configure Resend and Vercel

Create a sending-only Resend API key in the workspace where `realismthrift.com` is verified. Add these Production environment variables and redeploy:

```text
RESEND_API_KEY
RESEND_WEBHOOK_SECRET
CONTACT_EMAIL=sales@realismthrift.com
CONTACT_FROM_EMAIL=website@realismthrift.com
AUTO_REPLY_FROM_EMAIL=sales@realismthrift.com
SUPABASE_URL
SUPABASE_SECRET_KEY
INQUIRY_RETRY_SECRET
APP_URL=https://www.realismthrift.com
```

Register `https://www.realismthrift.com/api/webhooks/resend` as a Resend webhook and subscribe to:

- `email.sent`
- `email.delivered`
- `email.delivery_delayed`
- `email.bounced`
- `email.complained`
- `email.suppressed`

Copy the signing secret into `RESEND_WEBHOOK_SECRET` and redeploy once more.

## 3. Configure Supabase Cron

Enable the Supabase Cron and Vault modules. Store the same value used for Vercel's `INQUIRY_RETRY_SECRET` in Vault, then create an HTTP Cron job every five minutes:

```sql
-- Run each create_secret call once, replacing the placeholder locally.
select vault.create_secret(
  'REPLACE_WITH_THE_SAME_RANDOM_VALUE_USED_IN_VERCEL',
  'inquiry_retry_secret'
);

select vault.create_secret(
  'https://www.realismthrift.com/api/internal/inquiry-email-retries',
  'inquiry_retry_url'
);

select cron.schedule(
  'retry-inquiry-emails',
  '*/5 * * * *',
  $$
  select net.http_post(
    url := (
      select decrypted_secret
      from vault.decrypted_secrets
      where name = 'inquiry_retry_url'
    ),
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (
        select decrypted_secret
        from vault.decrypted_secrets
        where name = 'inquiry_retry_secret'
      )
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 10000
  );
  $$
);

select cron.schedule(
  'cleanup-expired-inquiries',
  '17 2 * * *',
  $$select public.cleanup_expired_inquiries();$$
);
```

Use the Supabase Cron history and `inquiry_delivery_overview` view to audit retries and delivery failures. Never commit either secret value to this repository.

## Troubleshoot retry-worker 500 responses

The application logs a non-sensitive `storageOperation` and Supabase `providerCode` for storage failures. Start with the failing operation, then verify the migration and credentials instead of logging inquiry payloads.

Run these read-only checks in the Supabase SQL Editor:

```sql
select to_regclass('public.inquiry_email_jobs') as jobs_table;

select routine_name
from information_schema.routines
where routine_schema = 'public'
  and routine_name in (
    'create_inquiry_with_email_jobs',
    'claim_inquiry_email_jobs',
    'apply_resend_email_state',
    'record_resend_webhook_event'
  )
order by routine_name;
```

If a table or function is missing, apply `migrations/202607100001_inquiry_pipeline.sql`. If all objects exist, confirm that Vercel Production has the matching `SUPABASE_URL`, a server-only `SUPABASE_SECRET_KEY`, and the same `INQUIRY_RETRY_SECRET` stored in Supabase Vault. Redeploy only after correcting environment variables; never print their values in logs.

## Built-in abuse and retry boundaries

- Every valid submission is stored and creates a sales notification job.
- Email outbox processing runs with Next.js `after()` after the success response; slow delivery does not block the browser's inquiry confirmation or GA4 `generate_lead`. The scheduled retry worker recovers pending or failed jobs. A successful form response confirms persistence, not email delivery.
- A customer address receives at most one automated acknowledgement in a 24-hour window. Later inquiries are still stored and still notify sales.
- Email jobs stop being retried after 23 hours so a long worker outage cannot cross Resend's 24-hour idempotency window and unexpectedly send a duplicate message.
- The in-process IP limiter is only a best-effort burst control. If automated abuse is observed, add a managed CAPTCHA such as Turnstile rather than storing raw IP addresses or adding another database solely for rate limiting.

## Meta CAPI delivery logs

Deployment order:

1. Confirm the target project binding using the production `SUPABASE_URL` hostname without displaying credentials. The expected project is `supabase-realismthrift-lead` (`tjbeeackrjpojejxhnzq`); repository defaults alone do not establish the production runtime binding.
2. Review and validate `migrations/202610190001_meta_capi_delivery_logs.sql` in an authorized isolated database, including CHECK constraints, server CRUD, client denial, and inquiry deletion cascading to logs. Mock unit tests do not prove database permissions or constraints.
3. Apply the new migration to the confirmed target **before deploying application code**. No additional environment variable is needed; logs reuse the existing server-only admin client.
4. Verify RLS and privileges with the read-only metadata queries below. The table must have RLS enabled, zero policies, no PUBLIC/anon/authenticated privileges, and only SELECT/INSERT/UPDATE/DELETE for service_role. Do not create a client policy for Dashboard access.
5. Deploy the application through the normal release process and inspect logs from real inquiries. Do not inject synthetic Leads into the production Meta dataset. To roll back, revert application code and retain the table; no automatic CAPI replay is performed.

```sql
select relrowsecurity
from pg_catalog.pg_class
where oid = 'public.meta_capi_delivery_logs'::regclass;

select policyname, roles, cmd
from pg_catalog.pg_policies
where schemaname = 'public' and tablename = 'meta_capi_delivery_logs';

-- Includes explicit PUBLIC grants (grantee=0), as well as named roles.
select case when acl.grantee = 0 then 'PUBLIC' else role.rolname end as grantee,
       acl.privilege_type, acl.is_grantable
from pg_catalog.pg_class c
cross join lateral aclexplode(coalesce(c.relacl, acldefault('r', c.relowner))) acl
left join pg_catalog.pg_roles role on role.oid = acl.grantee
where c.oid = 'public.meta_capi_delivery_logs'::regclass
order by grantee, privilege_type;

-- Effective privileges also account for inherited grants.
select role_name, privilege,
       has_table_privilege(role_name, 'public.meta_capi_delivery_logs', privilege) as allowed
from (values ('anon'), ('authenticated'), ('service_role')) roles(role_name)
cross join (values ('SELECT'), ('INSERT'), ('UPDATE'), ('DELETE'),
                   ('TRUNCATE'), ('REFERENCES'), ('TRIGGER')) privileges(privilege);
```

Database owners and platform administrators retain their management access. In an isolated database, also verify that normal anon/authenticated requests cannot read or write the table, and that service_role can operate on it.

In Supabase Dashboard, select the confirmed project → Table Editor → public → `meta_capi_delivery_logs`. Sort `started_at` descending and filter by `event_id`, `inquiry_id`, `status` or `skip_reason`; expand `attempts` to inspect up to two HTTP attempts. SQL Editor can use this read-only query:

```sql
select started_at, completed_at, inquiry_id, event_id, pixel_id,
       status, skip_reason, attempt_count, http_status, events_received,
       error_name, meta_error_code, trace_id, attempts
from public.meta_capi_delivery_logs
order by started_at desc
limit 100;
```

`sent` means HTTP 2xx with exactly one event accepted, not proven attribution or deduplication. `skipped` has zero HTTP attempts; `created:false` always records `duplicate_submission` and never resends CAPI, even after an earlier failure or missing configuration. The response still returns the same event ID and email processing keeps its existing behavior.

`started` older than a minute deserves investigation but does not establish whether Meta received the event. A sender exception has `failed / UnknownError` with `attempt_count=null`; unknown attempts are not zero attempts. Storage errors can leave only started or no row. Logs are best effort, with a 500ms abort budget for each write, and are not a retry queue. Logs follow inquiry retention through ON DELETE CASCADE. Use explicit timezones when comparing reports; see [Meta tracking](../docs/meta-tracking.md).

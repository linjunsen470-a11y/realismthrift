# Inquiry pipeline deployment

The application code is build-safe without production secrets, but `/api/send` becomes active only after the Supabase migration and server-only environment variables are configured.

## 1. Create and migrate Supabase

1. In the Vercel Marketplace, create a Supabase project in Singapore and connect it to the production Vercel project.
2. Apply `migrations/202607100001_inquiry_pipeline.sql` in the Supabase SQL Editor (or with the Supabase CLI).
3. Confirm that RLS is enabled on `inquiries`, `inquiry_email_jobs`, and `resend_webhook_events`, with no `anon` or `authenticated` policies.
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

## Built-in abuse and retry boundaries

- Every valid submission is stored and creates a sales notification job.
- A customer address receives at most one automated acknowledgement in a 24-hour window. Later inquiries are still stored and still notify sales.
- Email jobs stop being retried after 23 hours so a long worker outage cannot cross Resend's 24-hour idempotency window and unexpectedly send a duplicate message.
- The in-process IP limiter is only a best-effort burst control. If automated abuse is observed, add a managed CAPTCHA such as Turnstile rather than storing raw IP addresses or adding another database solely for rate limiting.

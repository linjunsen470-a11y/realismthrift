# RealismThrift Cold Email gateway

Private, single-operator MCP at `https://www.realismthrift.com/api/mcp`, sending
from `jason@realismthriftglobal.com`. Use the existing Supabase OAuth client and
Gmail connection. The fourteen MCP tools cover contact lookup/import, history,
incoming-message processing, new drafts, existing-draft linking, review, sending,
reconciliation and service diagnosis. Daily agent instructions live in
`../../plugins/realismthrift-cold-email-app/skills/cold-email/SKILL.md`; both
private plugin wrappers use the same workflow and cloud App.

## Current behavior

- Draft-only and maintenance requests do not authorize mail. An explicit request
  can authorize a defined batch or standing automatic sends. Call
  `send_approved_outreach({outreach_id})` directly; the historical tool name is
  retained for compatibility. It validates and fingerprints the saved content
  internally. `review_outreach_draft` is an optional preview, and supplying a
  fingerprint is optional for callers that want to pin exact content. Edits
  during a send abort it. No separate READY/APPROVED transition is required;
  queue DRAFTED/PENDING are unsent bookkeeping states, not review gates. Explicit
  human HOLD/REJECTED, suppression and unknown-send reservations still apply.
  The service supports cold marketing only. Use ordinary email tools
  for conversational replies.
- Lookup checks suppression; history reads exact Gmail From/To correspondence
  and gateway records. Do not add their counts or assume incomplete history
  proves no previous contact.
- Existing Gmail drafts are linked idempotently by draft ID and fingerprint.
  When authorized, append the recipient-specific webpage preference footer to
  the same draft, preserving original text/HTML, bolding and attachment bytes.
  Inspect uncertain draft updates before retrying.
- Unsubscribe, complaint, permanent bounce, reply pause and unprocessed inbound
  checks remain active. Record actual incoming messages, not quoted instructions.
  Resubscription does not clear safety blocks or revive cancelled drafts.
- The 50-per-sender Shanghai-day quota counts all Gmail Sent conservatively plus
  unmatched gateway marketing reservations. The five-argument SQL claim locks
  reservations and rejects stale-day snapshots. External concurrent Gmail sends
  cannot share that lock. Unknown sends retain quota and must be reconciled.
- Gmail Sent proves submission, not delivery or reading. Native unsubscribe
  button display is controlled by the recipient provider.

## Runtime settings

Keep credentials server-side. Do not print or commit values. See `../.env.example`
for names. Production requires the outreach Neon URLs, credential/rate-limit
keys, Google OAuth client settings, operator ID and pinned Supabase OAuth client
ID. The encrypted Google refresh token is stored by `/outreach/connect`.
Existing Gmail plugin credentials are separate.

`OUTREACH_SENDING_ENABLED` controls sends. `OUTREACH_RFC8058_VERIFIED` records
received-message verification. `OUTREACH_DKIM_MODE` is `google` or `own`;
own mode requires its signing key. Optional `OUTREACH_TEST_RECIPIENTS` restricts
sends during authorized protocol checks; empty means no test-only restriction.
Use `get_cold_email_service_status` for current flags, connection and quota.
Ordinary mail tasks must not change these settings.

Before recording RFC8058 verification, inspect an actual received original:
aligned DKIM must cover both List-Unsubscribe headers, and the public one-click
POST must work without cookies or redirects. Conduct authorized protocol tests
through the existing draft/review/send tools to a controlled inbox; there is no
separate test-sending web page.

## Authentication and preference endpoints

Supabase uses `/oauth/consent` and the shared operator Google login callback.
MCP verifies signed access tokens, audience, expiry, fixed operator and pinned
client ID. `/outreach/authorize` remains a small redirect for old consent links.
Public preference endpoints:
- `/email-preferences?token=...`: reading does not unsubscribe.
- `/api/email-preferences/one-click?token=...`: RFC8058 POST.
- `/email-preferences/resubscribe`: explicit confirmation-mail request.
- `/email-preferences/confirm#token=...`: preview followed by affirmative confirmation.

Confirmation tokens are hashed in storage, expire after 24 hours and cannot
override a newer unsubscribe. Preference pages have no marketing tracking.
Provider failures must not be logged with email bodies, addresses or tokens.
Gmail HTTP failures log only the status and stage (`oauth_token` or `gmail_api`)
alongside the existing operation/code. Inspect these before suggesting a reconnect;
a missing draft, rate limit and failed token refresh need different responses.

The workspace pins `mailparser>nodemailer` to 10.1.4 to fix address parsing of
nested comments and quoted addresses. Keep this override until the upstream
dependency includes the fix; the MIME identity regression test must remain green.

## Maintenance and verification

### Neon recovery baseline (2026-11-06)

The `Realismthrift` Neon project remains on the free plan with a six-hour restore
window. Its single free manual snapshot was created from `production` at
2026-11-05 17:46:02 UTC (2026-11-06 01:46:02 Singapore time):
`audit-baseline-20261106`, ID `snap-cold-field-b5ry38dt`, approximately 34 MB.
The snapshot listing confirms it exists; no restore rehearsal was performed.
This is a fixed recovery point, not scheduled backup coverage for later writes.
No paid upgrade, backup scheduler, or extra infrastructure was introduced.

Before a risky database change, check the current restore window and snapshot
availability in Neon. Restore to a separate branch and validate before any
production cutover. Never replay email sends after restoring historical state:
reconcile Gmail Sent, suppressions and send reservations first. A longer restore
window or recurring snapshots requires a separate cost decision. Local test and
production owner credentials still need separation before running destructive
database tests; an environment flag alone is not isolation.

### Migrations and release checks

Run migrations explicitly with `node outreach/migrate.mjs`; do not edit applied
SQL or migration hashes. Migration 0004 supplies existing-draft import and the
mailbox-aware quota claim. Old database fields/functions remain for historical
compatibility, not an agent approval workflow. No cleanup migration deletes
contacts, suppression, consent or sending evidence.

Run unit tests, TypeScript and ESLint for changed code. The isolated database
and HTTP scripts require `OUTREACH_DATABASE_TEST_ALLOWED=true` and nonproduction
Neon URLs; they do not send real mail. The concurrency script exercises the
current five-argument claim. Login browser tests mock form submission.

Release the existing server and plugin IDs, preserving audience and OAuth
bindings. Refresh/rescan the existing cloud App after tool-definition changes;
a plugin package update alone does not refresh a conversation's tool directory.
Never create another App to work around stale discovery.

## Draft repair (server 1.7.0)

New drafts include both unsubscribe headers and escaped HTML product keyword
bolding before Gmail creation; the service reads saved MIME before returning
success. Failed save verification returns the known Draft/Outreach IDs and puts
the record on backend HOLD rather than asking the caller to recreate it.

1. `inspect_outreach_draft_maintenance({outreach_id})` reads actual Gmail MIME,
   message ID, body/MIME SHA-256, contact source and suppression, including drafts
   whose gateway state is cancelled. It does not restore sending permission.
2. Call `repair_outreach_draft` with the inspected Outreach ID, exact normalized
   email, Draft ID, Message ID, fingerprint, expected_source and corrected_source.
   Preserve external manual HOLD. This call claims a durable backend HOLD using
   the existing `cancelled` state, then rechecks identity/state and raw bytes.
3. The service PUTs raw MIME to the same Gmail Draft ID, adding the existing
   `/api/email-preferences/one-click` headers without rendering or changing body
   bytes, attachments, subject or sender. Gmail may prepend Received headers.
   It reads saved MIME, checks content/headers, then CAS-updates source metadata
   and fingerprints with an audit event. Preferences and blocks are never written.
4. Inspect/read back the first repaired item and contact before continuing the
   other items. Record the new Message ID and fingerprint in the existing queue.
   Neither success nor retry releases HOLD. No send endpoint is called.

A stale identity, source, fingerprint, status or update timestamp stops repair.
Gmail does not expose conditional draft PUT; the final prewrite read narrows but
cannot eliminate the external edit window. An ambiguous PUT stops with
`draft_update_uncertain_inspect_before_retry`, leaving HOLD in place. Inspect
before deciding whether any retry is needed. Never retry old pinned values.
Registration reports conflicting existing source instead of pretending to fix it.
This change requires no database migration or new secrets.

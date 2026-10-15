# RealismThrift Cold Email gateway

Private, single-operator MCP at `https://www.realismthrift.com/api/mcp`, sending
from `jason@realismthriftglobal.com`. Use the existing Supabase OAuth client and
Gmail connection. The twelve MCP tools cover contact lookup/import, history,
incoming-message processing, new drafts, existing-draft linking, review, sending,
reconciliation and service diagnosis. Daily agent instructions live in
`../../plugins/realismthrift-cold-email-app/skills/cold-email/SKILL.md`; both
private plugin wrappers use the same workflow and cloud App.

## Current behavior

- Draft-only and maintenance requests do not authorize mail. An explicit request
  can authorize a defined batch; saved-content fingerprints still apply to each
  recipient. The service supports cold marketing only. Use ordinary email tools
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

## Maintenance and verification

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

import { sql } from "drizzle-orm";
import { DAILY_MARKETING_LIMIT, OutreachError, OUTREACH_SENDER, OUTREACH_SERVER_VERSION, sendingEnabled } from "./config";
import { outreachDatabase } from "./database";
import { listGmailMessages, verifyGmailAccount } from "./gmail";

export function sendingConfiguration() {
  const restricted = !!process.env.OUTREACH_TEST_RECIPIENTS?.split(",").some(v => v.trim());
  const verified = process.env.OUTREACH_RFC8058_VERIFIED === "true";
  const dkim = process.env.OUTREACH_DKIM_MODE;
  return {
    sending_enabled: sendingEnabled(), rfc8058_verified: verified, test_recipients_restricted: restricted,
    dkim_configured: dkim === "google" || (dkim === "own" && !!process.env.OUTREACH_DKIM_PRIVATE_KEY?.trim()),
    blockers: [!sendingEnabled() && "sending_disabled", !verified && "rfc8058_not_verified", restricted && "test_recipient_restriction",
      !(dkim === "google" || (dkim === "own" && process.env.OUTREACH_DKIM_PRIVATE_KEY?.trim())) && "dkim_not_configured"].filter(Boolean),
  };
}

export function shanghaiDay(now = new Date()) {
  const day = new Date(now.getTime() + 8 * 3600_000).toISOString().slice(0, 10);
  const start = Date.parse(`${day}T00:00:00+08:00`) / 1000;
  return { day, start, end: start + 86400 };
}

// Count all Gmail Sent conservatively, including mail sent outside this gateway.
// Reservations not represented in Gmail remain occupied; never add both copies.
export async function readSendQuota() {
  const { day, start, end } = shanghaiDay();
  const gmail = await listGmailMessages(`in:sent after:${start - 1} before:${end}`);
  const gmailIds = [...new Set(gmail.map(m => m.id))];
  const result = await outreachDatabase().execute<{ gmail_message_id: string | null }>(sql`select gmail_message_id from outreach_messages where sender=${OUTREACH_SENDER} and send_day=${day}::date and purpose='cold_marketing' and status in ('sending','sent','send_unknown')`);
  const ids = new Set(gmailIds);
  const reserved = result.rows.filter(r => !r.gmail_message_id || !ids.has(r.gmail_message_id)).length;
  const used = gmailIds.length + reserved;
  return { day, timezone: "Asia/Shanghai", limit: DAILY_MARKETING_LIMIT, gmail_sent: gmailIds.length,
    gateway_not_in_gmail: reserved, used, remaining: Math.max(0, DAILY_MARKETING_LIMIT - used), gmailIds,
    scope: "All Gmail Sent messages conservatively count, plus unmatched gateway marketing reservations. External concurrent sends cannot be locked by this gateway." };
}

export async function getColdEmailServiceStatus() {
  const configuration = sendingConfiguration();
  try {
    await verifyGmailAccount();
    const snapshot = await readSendQuota();
    const { gmailIds, ...quota } = snapshot;
    void gmailIds;
    return { sender: OUTREACH_SENDER, server_version: OUTREACH_SERVER_VERSION, gmail_connected: true, ...configuration, quota,
      can_send: configuration.blockers.length === 0 && quota.remaining > 0, existing_draft_import: true, sends_performed: 0 };
  } catch (error) {
    return { sender: OUTREACH_SENDER, server_version: OUTREACH_SERVER_VERSION, ...configuration, gmail_or_quota_error: error instanceof OutreachError ? error.code : "service_unavailable",
      quota: null, can_send: false, existing_draft_import: true, sends_performed: 0 };
  }
}

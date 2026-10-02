import { sql } from "drizzle-orm";
import { simpleParser } from "mailparser";
import { outreachDatabase } from "./database";
import { gmailRequest, gmailHeader, verifyGmailAccount, type GmailMessage } from "./gmail";
import { logOutreachError, OutreachError, OUTREACH_SENDER } from "./config";
import { normalizeEmail } from "./tokens";

export async function readCorrespondencePage(email: string, limit: number, pageToken?: string) {
  await verifyGmailAccount();
  const quoted = email.replace(/["\\]/g, "\\$&");
  const exactQuery = `((from:"${OUTREACH_SENDER}" to:"${quoted}") OR (from:"${quoted}" to:"${OUTREACH_SENDER}")) -in:drafts`;
  const params = new URLSearchParams({ q: exactQuery, maxResults: String(limit), includeSpamTrash: "true" });
  if (pageToken) params.set("pageToken", pageToken);
  const page = await gmailRequest<{ messages?: { id: string }[]; nextPageToken?: string }>(`messages?${params}`);
  const entries = await Promise.all((page.messages || []).map(async candidate => {
    const metadata = new URLSearchParams({ format: "metadata" });
    for (const name of ["From", "To", "Subject", "Date"]) metadata.append("metadataHeaders", name);
    const message = await gmailRequest<GmailMessage>(`messages/${encodeURIComponent(candidate.id)}?${metadata}`);
    const headers = (message.payload?.headers || []).filter(h => ["from", "to"].includes(h.name.toLowerCase()))
      .map(h => `${h.name}: ${h.value.replace(/[\r\n]/g, " ")}`).join("\r\n");
    const parsed = await simpleParser(Buffer.from(`${headers}\r\n\r\n`));
    const from = parsed.from?.value.map(v => v.address?.toLowerCase()) || [];
    const to = (Array.isArray(parsed.to) ? parsed.to : parsed.to ? [parsed.to] : []).flatMap(a => a.value.map(v => v.address?.toLowerCase()));
    const outbound = from.includes(OUTREACH_SENDER) && to.includes(email);
    const inbound = from.includes(email) && to.includes(OUTREACH_SENDER);
    if (!outbound && !inbound || message.labelIds?.includes("DRAFT")) return null;
    const time = Number(message.internalDate);
    return {
      gmail_message_id: message.id, thread_id: message.threadId, direction: outbound ? "outbound" : "inbound",
      from: gmailHeader(message, "From"), to: gmailHeader(message, "To"), subject: gmailHeader(message, "Subject"),
      occurred_at: Number.isFinite(time) && time > 0 && time <= 8.64e15 ? new Date(time).toISOString() : null,
      evidence: "gmail_metadata", delivery_status: "not_determined",
    };
  }));
  return { available: true, messages: entries.filter(m => m !== null), next_page_token: page.nextPageToken || null,
    complete: !page.nextPageToken && !pageToken, scope: "Exact From/To correspondence in the connected Jason mailbox; excludes drafts. Does not include other mailboxes or aliases." };
}

export async function getColdEmailHistory(email: string, limit = 10, databaseOffset = 0, gmailPageToken?: string) {
  const normalized = normalizeEmail(email);
  if (!normalized || !Number.isInteger(limit) || limit < 1 || limit > 20 || !Number.isInteger(databaseOffset) || databaseOffset < 0 || databaseOffset > 10000) throw new OutreachError("invalid_request", 400);
  const db = outreachDatabase();
  const [counts, records, inbound] = await Promise.all([
    db.execute(sql`select m.status,count(*)::integer as count from outreach_messages m join outreach_contacts c on c.id=m.contact_id where c.email=${normalized} and m.sender=${OUTREACH_SENDER} and m.purpose in ('cold_marketing','requested_reply') group by m.status`),
    db.execute(sql`select m.id as outreach_id,m.purpose,m.status,m.draft_id,m.gmail_message_id,m.gmail_thread_id,m.created_at,m.updated_at from outreach_messages m join outreach_contacts c on c.id=m.contact_id where c.email=${normalized} and m.sender=${OUTREACH_SENDER} and m.purpose in ('cold_marketing','requested_reply') order by m.created_at desc,m.id desc limit ${limit + 1} offset ${databaseOffset}`),
    db.execute(sql`select e.kind,e.provider_key,e.created_at from outreach_events e join outreach_contacts c on c.id=e.contact_id where c.email=${normalized} and e.source='gmail' and e.kind in ('reply','auto_reply','unsubscribe','hard_bounce','complaint') order by e.created_at desc limit ${limit}`),
  ]);
  const byStatus = Object.fromEntries(counts.rows.map(row => [String(row.status), Number(row.count)]));
  let gmail;
  try { gmail = await readCorrespondencePage(normalized, limit, gmailPageToken); }
  catch (error) {
    logOutreachError("correspondence_history", error);
    gmail = { available: false as const, error_code: error instanceof OutreachError ? error.code : "gmail_history_unavailable", messages: [], complete: false, next_page_token: null };
  }
  return {
    sender: OUTREACH_SENDER, recipient: normalized,
    database: { counts_by_status: byStatus, messages: records.rows.slice(0, limit), inbound_events: inbound.rows,
      next_offset: records.rows.length > limit ? databaseOffset + limit : null,
      scope: "Messages created through the outreach gateway; sent is submission evidence, not delivery. Drafts and unknown sends are separate." },
    gmail,
    interaction: {
      previously_sent: (byStatus.sent || 0) > 0 || gmail.messages.some(m => m.direction === "outbound") ? true : gmail.available && gmail.complete && !(byStatus.sending || byStatus.send_unknown) ? false : null,
      received_inbound: inbound.rows.some(e => ["reply", "auto_reply", "unsubscribe"].includes(String(e.kind))) || gmail.messages.some(m => m.direction === "inbound") ? true : gmail.available && gmail.complete ? false : null,
      note: "Gmail and database rows may describe the same message; do not add their counts. A missing/unavailable page is not evidence of no previous interaction. Inbound correspondence does not prove marketing consent.",
    },
  };
}

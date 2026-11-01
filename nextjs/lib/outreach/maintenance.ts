import { sql } from "drizzle-orm";
import { outreachDatabase } from "./database";
import { OutreachError, OUTREACH_SENDER } from "./config";
import { gmailRequest, verifyGmailAccount, type GmailMessage } from "./gmail";
import { addOutreachHeaders, assertOutreachHeaders, mimeFingerprint, reviewMime, splitMime, unsubscribeFooter } from "./mime";

type Record = {
  id: string; contact_id: string; draft_id: string; status: string; purpose: string; sender: string;
  email: string; source: string; unsubscribe_token: string; preference_version: number; updated_at: string;
  marketing_status: string; safety_block: string | null; conversation_paused: boolean;
};
export type MaintenanceInput = {
  outreach_id: string; email: string; draft_id: string; message_id: string; fingerprint: string;
  expected_source: string; corrected_source: string;
};
async function recordFor(id: string) {
  const result = await outreachDatabase().execute<Record>(sql`select m.*,m.updated_at::text as updated_at,c.email,c.source,c.unsubscribe_token,c.preference_version,c.marketing_status,c.safety_block,c.conversation_paused
    from outreach_messages m join outreach_contacts c on c.id=m.contact_id where m.id=${id}::uuid and m.sender=${OUTREACH_SENDER} and m.purpose='cold_marketing'`);
  const record = result.rows[0];
  if (!record || !["draft", "cancelled"].includes(record.status) || !record.draft_id) throw new OutreachError("draft_not_maintainable", 409);
  return record;
}
async function savedDraft(draftId: string) {
  const draft = await gmailRequest<{ id: string; message: GmailMessage }>(`drafts/${encodeURIComponent(draftId)}?format=raw`);
  if (draft.id !== draftId || !draft.message.raw || !draft.message.id || !draft.message.labelIds?.includes("DRAFT") || draft.message.labelIds?.includes("SENT")) throw new OutreachError("not_a_saved_draft", 409);
  return { draft, raw: Buffer.from(draft.message.raw, "base64url") };
}
function preservedHeaders(raw: Buffer, gmailSaved = false) {
  return splitMime(raw).fields.filter(field => !(gmailSaved && /^received:/i.test(field)) && !/^(list-id|list-unsubscribe(?:-post)?|dkim-signature|x-realismthrift-outreach-id):/i.test(field)).join("\r\n");
}
function sameContent(before: Buffer, after: Buffer, gmailSaved = false) {
  // Gmail may prepend a new Received field on draft PUT. It must retain every original one.
  const beforeReceived = splitMime(before).fields.filter(field => /^received:/i.test(field));
  const afterReceived = splitMime(after).fields.filter(field => /^received:/i.test(field));
  if (gmailSaved && beforeReceived.some((field, i) => afterReceived.slice(-beforeReceived.length)[i] !== field)) throw new OutreachError("maintenance_content_changed", 409);
  if (!splitMime(before).body.equals(splitMime(after).body) || preservedHeaders(before, gmailSaved) !== preservedHeaders(after, gmailSaved)) throw new OutreachError("maintenance_content_changed", 409);
}
export async function inspectOutreachDraftMaintenance(id: string) {
  await verifyGmailAccount();
  const record = await recordFor(id);
  const { draft, raw } = await savedDraft(record.draft_id);
  const review = await reviewMime(raw, record.email, unsubscribeFooter(record.unsubscribe_token));
  let headersVerified = false;
  try { assertOutreachHeaders(raw, id, record.unsubscribe_token); headersVerified = true; } catch { /* Report the legacy draft without mutating it. */ }
  return { outreach_id: id, contact_id: record.contact_id, draft_id: record.draft_id, message_id: draft.message.id, email: record.email,
    source: record.source, status: record.status, ...review, unsubscribe_headers_verified: headersVerified,
    body_sha256: mimeFingerprint(splitMime(raw).body), marketing_status: record.marketing_status,
    safety_block: record.safety_block, conversation_paused: record.conversation_paused, sends_performed: 0 };
}

// No sends, preference writes, template rendering, registrations or new draft calls.
// A maintenance claim is a durable backend HOLD (existing non-sendable cancelled state).
// Gmail has no conditional draft PUT: re-read immediately before writing, and stop on ambiguity.
export async function repairOutreachDraft(input: MaintenanceInput) {
  await verifyGmailAccount();
  const db = outreachDatabase();
  const record = await recordFor(input.outreach_id);
  if (record.email !== input.email || record.draft_id !== input.draft_id || record.source !== input.expected_source) throw new OutreachError("maintenance_identity_or_source_changed", 409);
  const { draft, raw } = await savedDraft(record.draft_id);
  if (draft.message.id !== input.message_id || mimeFingerprint(raw) !== input.fingerprint) throw new OutreachError("draft_changed_review_again", 409);
  const footer = unsubscribeFooter(record.unsubscribe_token);
  await reviewMime(raw, record.email, footer);
  const modified = await addOutreachHeaders(raw, record.id, record.unsubscribe_token);
  sameContent(raw, modified);
  assertOutreachHeaders(modified, record.id, record.unsubscribe_token);
  const claim = await db.execute<{ id: string; updated_at: string }>(sql`with held as (
    update outreach_messages m set status='cancelled',updated_at=now()
    where m.id=${record.id}::uuid and m.draft_id=${record.draft_id} and m.status=${record.status} and m.updated_at=${record.updated_at}::timestamptz
    and exists(select 1 from outreach_contacts c where c.id=m.contact_id and c.email=${record.email} and c.source=${record.source} and c.preference_version=${record.preference_version})
    returning m.id,m.contact_id,m.updated_at
  ), audit as (
    insert into outreach_events(contact_id,message_id,kind,source,details)
    select contact_id,id,'draft_maintenance_started','operator',${JSON.stringify({ draft_id: record.draft_id, old_message_id: draft.message.id, before_fingerprint: input.fingerprint, body_sha256: mimeFingerprint(splitMime(raw).body), intended_fingerprint: mimeFingerprint(modified), hold: true })}::jsonb from held
  ) select id,updated_at::text as updated_at from held`);
  if (!claim.rows.length) throw new OutreachError("maintenance_concurrent_change", 409);
  const latest = await recordFor(record.id);
  if (latest.updated_at !== claim.rows[0].updated_at || latest.status !== "cancelled" || latest.source !== record.source || latest.preference_version !== record.preference_version) throw new OutreachError("maintenance_concurrent_change", 409);
  const final = await savedDraft(record.draft_id);
  if (final.draft.message.id !== input.message_id || !final.raw.equals(raw)) throw new OutreachError("draft_changed_review_again", 409);
  if (!modified.equals(raw)) {
    try {
      await gmailRequest(`drafts/${encodeURIComponent(record.draft_id)}`, { message: { raw: modified.toString("base64url"), threadId: draft.message.threadId } }, "PUT");
    } catch { throw new OutreachError("draft_update_uncertain_inspect_before_retry", 409, { draft_id: record.draft_id, hold: true }); }
  }
  const saved = await savedDraft(record.draft_id);
  sameContent(raw, saved.raw, true);
  const verified = await reviewMime(saved.raw, record.email, footer, { outreachId: record.id, token: record.unsubscribe_token });
  const audit = { draft_id: record.draft_id, old_message_id: draft.message.id, message_id: saved.draft.message.id, before_fingerprint: input.fingerprint,
    fingerprint: verified.fingerprint, body_sha256: mimeFingerprint(splitMime(saved.raw).body), old_source: record.source, source: input.corrected_source, hold: true };
  const committed = await db.execute<{ id: string; source: string }>(sql`with contact as (
    update outreach_contacts c set source=${input.corrected_source},updated_at=now()
    where c.id=${record.contact_id}::uuid and c.email=${record.email} and c.source=${input.expected_source} and c.preference_version=${record.preference_version}
    and exists(select 1 from outreach_messages m where m.id=${record.id}::uuid and m.draft_id=${record.draft_id} and m.status='cancelled' and m.updated_at=${latest.updated_at}::timestamptz)
    returning c.id,c.source
  ), message as (
    update outreach_messages m set fingerprint=${verified.fingerprint},gmail_message_id=${saved.draft.message.id},gmail_thread_id=${saved.draft.message.threadId},updated_at=now()
    where m.id=${record.id}::uuid and m.status='cancelled' and exists(select 1 from contact) returning m.id
  ), audit as (
    insert into outreach_events(contact_id,message_id,kind,source,details)
    select contact.id,message.id,'draft_maintenance_verified','operator',${JSON.stringify(audit)}::jsonb from contact,message
  ) select message.id,contact.source from message,contact`);
  if (!committed.rows.length) throw new OutreachError("maintenance_commit_conflict_inspect_before_retry", 409, { draft_id: record.draft_id, message_id: saved.draft.message.id, hold: true });
  return { ...audit, outreach_id: record.id, contact_id: record.contact_id, email: record.email, status: "cancelled", unsubscribe_headers_verified: true,
    content_unchanged: true, source_verified: committed.rows[0].source === input.corrected_source, sends_performed: 0, drafts_created: 0 };
}

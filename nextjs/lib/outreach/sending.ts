import { sql } from "drizzle-orm";
import { outreachDatabase } from "./database";
import { GmailError, gmailHeader, gmailRequest, listGmailMessages, verifyGmailAccount, type GmailMessage } from "./gmail";
import { addOutreachHeaders, reviewMime, unsubscribeFooter } from "./mime";
import { logOutreachError, OutreachError, OUTREACH_SENDER, sendingEnabled } from "./config";
import { simpleParser } from "mailparser";
import { coldEmailAllowed } from "./eligibility";
import { pendingInboundIds } from "./inbound";

type SendRecord = {
  id: string; contact_id: string; email: string; sender: string; draft_id: string;
  purpose: "cold_marketing" | "requested_reply"; status: string; unsubscribe_token: string;
  preference_version: number; marketing_status: string; safety_block: string | null;
  conversation_paused: boolean; eligibility_note: string | null; reply_to_message_id: string | null;
  gmail_message_id: string | null; gmail_thread_id: string | null;
};
async function getSendRecord(id: string) {
  const result = await outreachDatabase().execute<SendRecord>(sql`select m.*,c.email,c.unsubscribe_token,c.preference_version,c.marketing_status,c.safety_block,c.conversation_paused,c.eligibility_note from outreach_messages m join outreach_contacts c on c.id=m.contact_id where m.id=${id}::uuid`);
  const record = result.rows[0];
  if (!record || record.sender !== OUTREACH_SENDER || !["cold_marketing", "requested_reply"].includes(record.purpose)) throw new OutreachError("unknown_outreach_draft", 404);
  return record;
}
function checkEligibility(record: SendRecord) {
  if (record.safety_block) throw new OutreachError("contact_blocked", 409);
  if (record.purpose === "cold_marketing" && !coldEmailAllowed(record)) throw new OutreachError("marketing_not_eligible", 409);
}

async function checkInbound(record: SendRecord, threadId: string) {
  const pending = await pendingInboundIds({ id: record.contact_id, email: record.email }, threadId);
  if (pending.length) throw new OutreachError("inbound_review_required", 409, {
    contact_id: record.contact_id, outreach_id: record.id, pending_count: pending.length,
    next_step: "Call get_pending_cold_email_inbound with this contact_id and outreach_id, then record the reviewed messages with record_cold_email_inbound.",
  });
}

async function loadReviewedDraft(record: SendRecord) {
  if (!record.draft_id || record.status !== "draft") throw new OutreachError("draft_not_sendable", 409);
  checkEligibility(record);
  const draft = await gmailRequest<{ id: string; message: GmailMessage }>(`drafts/${encodeURIComponent(record.draft_id)}?format=raw`);
  if (!draft.message.raw) throw new OutreachError("invalid_mime", 400);
  const raw = Buffer.from(draft.message.raw, "base64url");
  const review = await reviewMime(raw, record.email, record.purpose === "cold_marketing" ? unsubscribeFooter(record.unsubscribe_token) : null);
  await checkInbound(record, draft.message.threadId);
  if (record.purpose === "requested_reply") {
    if (!record.reply_to_message_id) throw new OutreachError("reply_request_missing", 409);
    const event = await outreachDatabase().execute<{ id: string }>(sql`select id from outreach_events where contact_id=${record.contact_id}::uuid and provider_key=${`${OUTREACH_SENDER}:${record.reply_to_message_id}`} and kind='reply' limit 1`);
    if (!event.rows.length) throw new OutreachError("reply_request_missing", 409);
    const inbound = await gmailRequest<GmailMessage>(`messages/${encodeURIComponent(record.reply_to_message_id)}?format=raw`);
    const source = await simpleParser(Buffer.from(inbound.raw || "", "base64url"));
    if (source.from?.value[0]?.address?.toLowerCase() !== record.email || inbound.threadId !== draft.message.threadId || !source.messageId || review.inReplyTo !== source.messageId) throw new OutreachError("reply_request_mismatch", 409);
  }
  return { raw, review, threadId: draft.message.threadId };
}

export async function reviewOutreachDraft(id: string) {
  await verifyGmailAccount();
  const record = await getSendRecord(id);
  const draft = await loadReviewedDraft(record);
  return { outreach_id: id, draft_id: record.draft_id, purpose: record.purpose, ...draft.review, instructions: "Use this fingerprint to send the saved content only when the user requested sending to this recipient. A draft-only request does not authorize sending. Do not repeat confirmation when the exact send is already authorized." };
}

export async function sendApprovedOutreach(id: string, fingerprint: string) {
  if (!sendingEnabled()) throw new OutreachError("sending_disabled", 409);
  await verifyGmailAccount();
  const record = await getSendRecord(id);
  if (record.status === "sent") return { status: "sent", message_id: record.gmail_message_id, thread_id: record.gmail_thread_id };
  const allowed = process.env.OUTREACH_TEST_RECIPIENTS?.split(",").map(value => value.trim().toLowerCase()).filter(Boolean);
  if (allowed?.length && !allowed.includes(record.email)) throw new OutreachError("test_recipient_required", 409);
  // Explicitly allow self-owned test inboxes before received-message DKIM verification.
  if (record.purpose === "cold_marketing" && process.env.OUTREACH_RFC8058_VERIFIED !== "true" && !allowed?.includes(record.email)) throw new OutreachError("rfc8058_not_verified", 409);
  const draft = await loadReviewedDraft(record);
  if (draft.review.fingerprint !== fingerprint) throw new OutreachError("draft_changed_review_again", 409);
  const raw = await addOutreachHeaders(draft.raw, record.id, record.purpose === "cold_marketing" ? record.unsubscribe_token : null);
  const claim = await outreachDatabase().execute<{ result: { status: string; message_id?: string } }>(sql`select outreach_claim_send(${id}::uuid,${fingerprint},${record.preference_version}) as result`);
  if (claim.rows[0].result.status !== "claimed") {
    if (claim.rows[0].result.status === "sent") return claim.rows[0].result;
    throw new OutreachError(claim.rows[0].result.status, 409);
  }
  let submitted = false;
  try {
    // SQL and Gmail cannot form a distributed transaction. Recheck immediately before submission.
    const latest = await getSendRecord(id);
    checkEligibility(latest);
    if (latest.status !== "sending") throw new OutreachError("draft_not_sendable", 409);
    if (latest.preference_version !== record.preference_version) throw new OutreachError("preferences_changed", 409);
    await checkInbound(latest, draft.threadId);
    const finalDraft = await gmailRequest<{ message: GmailMessage }>(`drafts/${encodeURIComponent(record.draft_id)}?format=raw`);
    const finalReview = await reviewMime(Buffer.from(finalDraft.message.raw || "", "base64url"), record.email, record.purpose === "cold_marketing" ? unsubscribeFooter(record.unsubscribe_token) : null);
    if (finalReview.fingerprint !== fingerprint) throw new OutreachError("draft_changed_review_again", 409);
    submitted = true;
    const result = await gmailRequest<GmailMessage>("drafts/send", { id: record.draft_id, message: { raw: raw.toString("base64url"), threadId: draft.threadId } });
    await outreachDatabase().execute(sql`update outreach_messages set status='sent',gmail_message_id=${result.id},gmail_thread_id=${result.threadId},updated_at=now() where id=${id}::uuid and status='sending'`);
    return { status: "sent", message_id: result.id, thread_id: result.threadId };
  } catch (error) {
    const rejected = error instanceof GmailError && error.httpStatus >= 400 && error.httpStatus < 500;
    const status = submitted && !rejected ? "send_unknown" : submitted ? "failed" : "draft";
    try { await outreachDatabase().execute(sql`update outreach_messages m set status=case when ${status}='draft' and exists(select 1 from outreach_contacts c where c.id=m.contact_id and (c.preference_version<>${record.preference_version} or c.safety_block is not null or (m.purpose='cold_marketing' and c.marketing_status not in ('held','eligible')))) then 'cancelled' else ${status} end,updated_at=now() where m.id=${id}::uuid and m.status='sending'`); }
    catch (recordError) { logOutreachError("send_result_record", recordError); }
    if (status === "send_unknown") throw new OutreachError("send_unknown_reconcile_before_retry", 409);
    throw error;
  }
}

export async function reconcileOutreachSend(id: string) {
  await verifyGmailAccount();
  const record = await getSendRecord(id);
  if (!["send_unknown", "sending", "sent"].includes(record.status)) throw new OutreachError("not_pending_reconciliation", 409);
  if (record.status === "sent") return { status: "sent", message_id: record.gmail_message_id };
  const messages = await listGmailMessages(`in:sent to:"${record.email.replace(/"/g, "")}"`);
  for (const candidate of messages) {
    const message = await gmailRequest<GmailMessage>(`messages/${encodeURIComponent(candidate.id)}?format=metadata&metadataHeaders=X-RealismThrift-Outreach-ID&metadataHeaders=From&metadataHeaders=To&metadataHeaders=Cc&metadataHeaders=Bcc`);
    if (gmailHeader(message, "X-RealismThrift-Outreach-ID") !== id) continue;
    const metadata = (message.payload?.headers || []).map(header => `${header.name}: ${header.value}`).join("\r\n");
    try { await reviewMime(Buffer.from(`${metadata}\r\n\r\n`), record.email, null); }
    catch { continue; }
    await outreachDatabase().execute(sql`update outreach_messages set status='sent',gmail_message_id=${message.id},gmail_thread_id=${message.threadId},updated_at=now() where id=${id}::uuid and status in ('sending','send_unknown')`);
    return { status: "sent", message_id: message.id, thread_id: message.threadId };
  }
  return { status: "send_unknown", instructions: "No matching Sent message is visible yet. Keep this send reserved; do not resend." };
}

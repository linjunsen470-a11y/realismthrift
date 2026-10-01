import { sql } from "drizzle-orm";
import nodemailer from "nodemailer";
import { outreachDatabase } from "./database";
import { OutreachError, OUTREACH_SENDER } from "./config";
import { gmailRequest, verifyGmailAccount, type GmailMessage } from "./gmail";
import { renderColdEmail } from "./template";
import { normalizeEmail } from "./tokens";

export async function lookupColdEmailContact(email: string) {
  const normalized = normalizeEmail(email);
  if (!normalized) throw new OutreachError("invalid_request", 400);
  const rows = await outreachDatabase().execute(sql`select id,email,company,country,source,marketing_status,safety_block,conversation_paused,eligibility_note from outreach_contacts where email=${normalized}`);
  return { contact: rows.rows[0] || null, sending_enabled: process.env.OUTREACH_SENDING_ENABLED === "true" };
}

export async function requireColdEmailMessage(id: string) {
  const rows = await outreachDatabase().execute(sql`select id from outreach_messages where id=${id}::uuid and purpose='cold_marketing' and sender=${OUTREACH_SENDER}`);
  if (!rows.rows.length) throw new OutreachError("unknown_cold_email_draft", 404);
}

export async function createColdEmailDraft(contactId: string, subject: string, paragraphs: string[]) {
  if (!subject.trim() || subject.length > 160 || /[\r\n]/.test(subject)) throw new OutreachError("invalid_email_content", 400);
  // Validate content before creating a DB record or contacting Gmail.
  renderColdEmail(paragraphs, "A".repeat(43));
  const database = outreachDatabase();
  const contact = await database.execute<{ email: string; marketing_status: string; safety_block: string | null; conversation_paused: boolean; eligibility_note: string | null }>(sql`select email,marketing_status,safety_block,conversation_paused,eligibility_note from outreach_contacts where id=${contactId}::uuid`);
  const c = contact.rows[0];
  if (!c || c.safety_block || c.marketing_status !== "eligible" || c.conversation_paused || !c.eligibility_note?.trim()) throw new OutreachError("marketing_not_eligible", 409);
  await verifyGmailAccount();
  const prepared = await database.execute<{ result: { outreach_id: string; email: string; unsubscribe_token: string } }>(sql`select outreach_prepare_message(${contactId}::uuid,'cold_marketing') as result`);
  const record = prepared.rows[0].result;
  const content = renderColdEmail(paragraphs, record.unsubscribe_token);
  const transport = nodemailer.createTransport({ streamTransport: true, buffer: true, newline: "windows" });
  const mail = await transport.sendMail({ from: { name: "Jason | RealismThrift", address: OUTREACH_SENDER }, to: record.email, replyTo: OUTREACH_SENDER, subject: subject.trim(), ...content });
  const draft = await gmailRequest<{ id: string; message: GmailMessage }>("drafts", { message: { raw: (mail.message as Buffer).toString("base64url") } });
  const attached = await database.execute<{ ok: boolean }>(sql`select outreach_attach_draft(${record.outreach_id}::uuid,${draft.id}) as ok`);
  if (!attached.rows[0]?.ok) throw new OutreachError("draft_registration_failed", 409);
  return { outreach_id: record.outreach_id, draft_id: draft.id, status: "draft", to: record.email, subject: subject.trim(), ...content, next_step: "Review this saved draft with review_outreach_draft before requesting approval to send. No email has been sent." };
}


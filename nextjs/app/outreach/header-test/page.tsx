import { redirect } from "next/navigation";
import { sql } from "drizzle-orm";
import nodemailer from "nodemailer";
import { requireOperator } from "@/lib/outreach/auth";
import { outreachDatabase } from "@/lib/outreach/database";
import { gmailRequest, type GmailMessage } from "@/lib/outreach/gmail";
import { logOutreachError, OutreachError, OUTREACH_SENDER, requiredSetting } from "@/lib/outreach/config";
import { unsubscribeFooter } from "@/lib/outreach/mime";
import { reviewOutreachDraft, sendApprovedOutreach } from "@/lib/outreach/sending";
import { normalizeEmail } from "@/lib/outreach/tokens";

export const maxDuration = 60;

function testRecipient() {
  const value = requiredSetting("OUTREACH_TEST_RECIPIENTS").trim();
  const email = normalizeEmail(value);
  if (!email || value.includes(",")) throw new OutreachError("single_test_recipient_required", 409);
  return email;
}

async function requireTestMessage(id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) throw new OutreachError("invalid_request", 400);
  const result = await outreachDatabase().execute(sql`select m.id from outreach_messages m join outreach_contacts c on c.id=m.contact_id where m.id=${id}::uuid and c.email=${testRecipient()} and m.purpose='cold_marketing'`);
  if (!result.rows.length) throw new OutreachError("unknown_test_message", 404);
}

async function prepareTest() {
  "use server";
  await requireOperator();
  let id: string;
  try {
    const database = outreachDatabase();
    const contact = await database.execute<{ id: string }>(sql`select outreach_import_contact(${testRecipient()},'Operator-authorized protocol verification to own test inbox') as id`);
    const reviewed = await database.execute<{ ok: boolean }>(sql`select outreach_review_contact(${contact.rows[0].id}::uuid,'Operator explicitly requested a single protocol test to the configured test inbox; no customer campaign') as ok`);
    if (!reviewed.rows[0].ok) throw new OutreachError("contact_blocked", 409);
    const prepared = await database.execute<{ result: { outreach_id: string; unsubscribe_token: string } }>(sql`select outreach_prepare_message(${contact.rows[0].id}::uuid,'cold_marketing') as result`);
    id = prepared.rows[0].result.outreach_id;
    const transport = nodemailer.createTransport({ streamTransport: true, buffer: true, newline: "windows" });
    const mail = await transport.sendMail({
      from: OUTREACH_SENDER, to: testRecipient(), replyTo: OUTREACH_SENDER,
      subject: `RealismThrift RFC8058 verification ${id.slice(0, 8)}`,
      text: `This is the email-header verification test you requested. No purchase or action is required.\n\nRealismThrift\nFengyi Road, Yuanzhou, Boluo, Huizhou, Guangdong, China\n\nUnsubscribe: ${unsubscribeFooter(prepared.rows[0].result.unsubscribe_token)}`,
    });
    const draft = await gmailRequest<{ id: string; message: GmailMessage }>("drafts", { message: { raw: (mail.message as Buffer).toString("base64url") } });
    await database.execute(sql`select outreach_attach_draft(${id}::uuid,${draft.id})`);
  } catch (error) {
    logOutreachError("header_test_prepare", error);
    redirect(`/outreach/header-test?error=${error instanceof OutreachError ? error.code : "service_unavailable"}`);
  }
  redirect(`/outreach/header-test?id=${id}`);
}

async function sendTest(form: FormData) {
  "use server";
  await requireOperator();
  const id = String(form.get("id") || "");
  try {
    await requireTestMessage(id);
    await sendApprovedOutreach(id, String(form.get("fingerprint") || ""));
  } catch (error) {
    logOutreachError("header_test_send", error);
    // An uncertain send remains reserved; this page never retries automatically.
    redirect(`/outreach/header-test?error=${error instanceof OutreachError ? error.code : "service_unavailable"}`);
  }
  redirect("/outreach/header-test?sent=1");
}

export default async function HeaderTestPage({ searchParams }: { searchParams: Promise<{ id?: string; error?: string; sent?: string }> }) {
  try { await requireOperator(); } catch { redirect("/outreach/connect"); }
  const params = await searchParams;
  const recipient = testRecipient();
  let review: Awaited<ReturnType<typeof reviewOutreachDraft>> | undefined;
  let error = params.error;
  if (params.id) {
    try { await requireTestMessage(params.id); review = await reviewOutreachDraft(params.id); }
    catch (failure) { logOutreachError("header_test_review", failure); error = failure instanceof OutreachError ? failure.code : "service_unavailable"; }
  }
  return <>
    <h1 className="mb-4 text-2xl">Email header verification</h1>
    <p className="mb-4 text-sm">Test recipient: {recipient}</p>
    {error && <p role="alert" className="mb-4">Test paused: {error}. No automatic resend will occur.</p>}
    {params.sent === "1" ? <p role="status">Test submitted to Gmail. Verify the received original message before accepting RFC8058.</p> : review ? <>
      <p className="mb-2">From: {review.from}</p><p className="mb-2">Subject: {review.subject}</p>
      <pre className="mb-4 whitespace-pre-wrap break-words text-sm">{review.text}</pre>
      <form action={sendTest}><input type="hidden" name="id" value={params.id} /><input type="hidden" name="fingerprint" value={review.fingerprint} /><button className="rounded-lg bg-brand-dark p-3 text-white">Approve and send this test</button></form>
    </> : <form action={prepareTest}><button className="rounded-lg bg-brand-dark p-3 text-white">Prepare test draft</button></form>}
  </>;
}

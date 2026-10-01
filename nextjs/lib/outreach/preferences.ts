import { sql } from "drizzle-orm";
import { Resend } from "resend";
import { outreachDatabase } from "./database";
import { maskEmail, newPreferenceToken, rateKey, tokenHash, validPreferenceToken } from "./tokens";
import { logOutreachError, OutreachError, outreachOrigin, requiredSetting } from "./config";

type PreferenceResult = { status: string; email?: string; message_id?: string };
async function preferenceQuery(query: ReturnType<typeof sql>): Promise<PreferenceResult> {
  const rows = await outreachDatabase().execute<{ result: PreferenceResult }>(query);
  return rows.rows[0].result;
}

export async function unsubscribe(token: string, source: "one_click" | "website") {
  if (!validPreferenceToken(token)) throw new OutreachError("invalid_link", 404);
  const rows = await outreachDatabase().execute<{ ok: boolean }>(sql`select outreach_unsubscribe(${token},${source}) as ok`);
  if (!rows.rows[0].ok) throw new OutreachError("invalid_link", 404);
  return { status: "unsubscribed" };
}

export async function previewConfirmation(token: string) {
  if (!validPreferenceToken(token)) return { status: "invalid" };
  const value = await preferenceQuery(sql`select outreach_preview_confirmation(${tokenHash(token)}) as result`);
  return { status: value.status, ...(value.email ? { email: maskEmail(value.email) } : {}) };
}

export async function confirmResubscribe(token: string) {
  if (!validPreferenceToken(token)) return { status: "invalid" };
  const value = await preferenceQuery(sql`select outreach_confirm_resubscribe(${tokenHash(token)}) as result`);
  return { status: value.status };
}

export async function requestResubscribe(email: string, ip: string) {
  // Validate shared configuration before contact lookup to keep responses uniform.
  const resend = new Resend(requiredSetting("RESEND_API_KEY"));
  const secret = requiredSetting("OUTREACH_RATE_LIMIT_SECRET");
  const token = newPreferenceToken();
  const result = await preferenceQuery(sql`select outreach_request_resubscribe(${email},${rateKey(email,secret)},${rateKey(ip,secret)},${tokenHash(token)}) as result`);
  if (result.status === "rate_limited") throw new OutreachError("rate_limited", 429);
  if (result.email && result.message_id) {
    const link = `${outreachOrigin()}/email-preferences/confirm#token=${token}`;
    let status = "send_unknown";
    let providerId: string | null = null;
    try {
      const response = await resend.emails.send({
        from: process.env.AUTO_REPLY_FROM_EMAIL || "sales@realismthrift.com",
        to: result.email,
        replyTo: "jason@realismthriftglobal.com",
        subject: "Confirm your RealismThrift email preference",
        text: `You requested wholesale updates from RealismThrift.\n\nOpen this link and choose Confirm subscription:\n${link}\n\nThis link expires in 24 hours. If you didn't request it, you can ignore this email; your preferences will stay unchanged.\n\nRealismThrift\nFengyi Road, Yuanzhou, Boluo, Huizhou, Guangdong, China`,
      }, { idempotencyKey: `outreach-confirm-${result.message_id}` });
      if (response.error) { status = "failed"; logOutreachError("confirmation_delivery", response.error); }
      else { status = "sent"; providerId = response.data?.id || null; }
    } catch (error) { logOutreachError("confirmation_delivery", error); }
    try {
      await outreachDatabase().execute(sql`update outreach_messages set status=${status},provider_message_id=${providerId},updated_at=now() where id=${result.message_id}::uuid`);
    } catch (error) { logOutreachError("confirmation_delivery_record", error); }
  }
  return { status: "accepted" };
}

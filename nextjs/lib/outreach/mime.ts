import { createHash } from "node:crypto";
import { simpleParser } from "mailparser";
import nodemailer from "nodemailer";
import { OutreachError, OUTREACH_SENDER, outreachOrigin, requiredSetting } from "./config";

export function mimeFingerprint(raw: Buffer) {
  return createHash("sha256").update(raw).digest("hex");
}

export function splitMime(raw: Buffer) {
  const separator = raw.indexOf("\r\n\r\n");
  if (separator < 0) throw new OutreachError("invalid_mime", 400);
  const fields = raw.subarray(0, separator).toString("utf8").split(/\r\n(?![ \t])/);
  return { fields, body: raw.subarray(separator + 4) };
}

export async function reviewMime(raw: Buffer, recipient: string, footer: string | null) {
  const { fields } = splitMime(raw);
  const names = fields.map(field => field.split(":", 1)[0].toLowerCase());
  for (const field of ["from", "to", "subject", "reply-to", "mime-version", "content-type"]) {
    if (names.filter(name => name === field).length > 1) throw new OutreachError("ambiguous_headers", 400);
  }
  if (names.some(name => name === "bcc" || name === "cc" || name.startsWith("resent-"))) throw new OutreachError("single_recipient_required", 400);
  const parsed = await simpleParser(raw);
  const to = (Array.isArray(parsed.to) ? parsed.to.flatMap(value => value.value) : parsed.to?.value) || [];
  if (parsed.from?.value.length !== 1 || parsed.from.value[0].address?.toLowerCase() !== OUTREACH_SENDER || to.length !== 1 || to[0].address?.toLowerCase() !== recipient) throw new OutreachError("recipient_or_sender_changed", 409);
  if (parsed.cc || parsed.bcc) throw new OutreachError("single_recipient_required", 400);
  // Both alternatives are independently readable by recipients; require the footer in each present part.
  if (footer && ((parsed.text && !parsed.text.includes(footer)) || (parsed.html && !parsed.html.includes(footer)) || (!parsed.text && !parsed.html))) throw new OutreachError("unsubscribe_footer_missing", 409);
  return {
    fingerprint: mimeFingerprint(raw),
    to: recipient,
    from: OUTREACH_SENDER,
    subject: parsed.subject || "",
    text: parsed.text || "",
    html: parsed.html || null,
    attachments: parsed.attachments.map(attachment => ({ filename: attachment.filename || "attachment", size: attachment.size, sha256: mimeFingerprint(attachment.content) })),
    inReplyTo: parsed.inReplyTo,
    messageId: parsed.messageId,
  };
}

export function unsubscribeFooter(token: string) {
  return `${outreachOrigin()}/email-preferences?token=${token}`;
}

export async function addOutreachHeaders(raw: Buffer, messageId: string, token: string | null) {
  const { fields, body } = splitMime(raw);
  const clean = fields.filter(field => !/^(list-id|list-unsubscribe(?:-post)?|dkim-signature|x-realismthrift-outreach-id):/i.test(field));
  clean.push(`X-RealismThrift-Outreach-ID: ${messageId}`);
  if (token) {
    // The same mailbox also sends requested replies; identify its marketing list explicitly.
    clean.push("List-ID: RealismThrift wholesale updates <wholesale.realismthriftglobal.com>");
    clean.push(`List-Unsubscribe: <${outreachOrigin()}/api/email-preferences/one-click?token=${token}&m=${messageId}>`);
    clean.push("List-Unsubscribe-Post: List-Unsubscribe=One-Click");
  }
  const modified = Buffer.concat([Buffer.from(`${clean.join("\r\n")}\r\n\r\n`), body]);
  if (!token || process.env.OUTREACH_DKIM_MODE === "google") return modified;
  if (process.env.OUTREACH_DKIM_MODE !== "own") throw new OutreachError("dkim_not_configured");
  const transporter = nodemailer.createTransport({
    streamTransport: true, buffer: true, newline: "windows",
    dkim: {
      domainName: "realismthriftglobal.com",
      keySelector: process.env.OUTREACH_DKIM_SELECTOR || "outreach",
      privateKey: requiredSetting("OUTREACH_DKIM_PRIVATE_KEY").replace(/\\n/g, "\n"),
      headerFieldNames: "from:to:subject:reply-to:mime-version:content-type:content-transfer-encoding:list-id:list-unsubscribe:list-unsubscribe-post:x-realismthrift-outreach-id",
    },
  });
  const result = await transporter.sendMail({ raw: modified });
  return result.message as Buffer;
}

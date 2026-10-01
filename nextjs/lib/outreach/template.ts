import { companyAddress } from "@/data/siteData";
import { OutreachError } from "./config";
import { unsubscribeFooter } from "./mime";
import { validPreferenceToken } from "./tokens";

export function renderColdEmail(paragraphs: string[], token: string) {
  if (!validPreferenceToken(token) || paragraphs.length < 1 || paragraphs.length > 8 || paragraphs.some(p => !p.trim() || p.length > 1500) || paragraphs.join("").length > 6000) throw new OutreachError("invalid_email_content", 400);
  const body = paragraphs.map(p => p.trim());
  const footer = unsubscribeFooter(token);
  const escape = (value: string) => value.replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]!);
  const text = `${body.join("\n\n")}\n\nBest,\nJason\nRealismThrift\nWholesale used clothes, shoes & bags\nhttps://www.realismthrift.com\n\n${companyAddress}\nUnsubscribe: ${footer}`;
  const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;padding:0;background:#ffffff;color:#242424;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="padding:28px 20px;">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:560px;font-family:Arial,Helvetica,sans-serif;">
<tr><td style="padding:0 0 18px;border-bottom:2px solid #b38b45;font-size:14px;line-height:20px;font-weight:bold;letter-spacing:0.3px;color:#58472d;">RealismThrift</td></tr>
<tr><td style="padding:24px 0 8px;font-size:16px;line-height:26px;">${body.map(p => `<p style="margin:0 0 18px;">${escape(p).replace(/\n/g, "<br>")}</p>`).join("")}</td></tr>
<tr><td style="padding:0 0 24px;font-size:15px;line-height:23px;">Best,<br><strong>Jason</strong><br>RealismThrift<br><span style="color:#626262;font-size:13px;">Wholesale used clothes, shoes &amp; bags</span><br><a href="https://www.realismthrift.com" style="color:#58472d;text-decoration:underline;font-size:13px;">realismthrift.com</a></td></tr>
<tr><td style="padding:16px 0 0;border-top:1px solid #e8e4dc;font-size:12px;line-height:19px;color:#686868;">${escape(companyAddress)}<br><a href="${escape(footer)}" style="color:#58472d;text-decoration:underline;">Unsubscribe from wholesale emails</a></td></tr>
</table></td></tr></table></body></html>`;
  return { text, html };
}


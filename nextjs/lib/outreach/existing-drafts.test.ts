import { beforeEach, describe, expect, it, vi } from "vitest";
import nodemailer from "nodemailer";
import { simpleParser } from "mailparser";
import { appendGatewayFooter, importExistingGmailDraft } from "./existing-drafts";
import { mimeFingerprint, unsubscribeFooter } from "./mime";

const mocks = vi.hoisted(() => ({ execute: vi.fn(), gmailRequest: vi.fn(), verifyGmailAccount: vi.fn() }));
vi.mock("./database", () => ({ outreachDatabase: () => ({ execute: mocks.execute }) }));
vi.mock("./gmail", () => mocks);
const token = "A".repeat(43), email = "buyer@example.com";
let raw: Buffer;
beforeEach(async () => {
  vi.resetAllMocks();
  const mail = await nodemailer.createTransport({ streamTransport: true, buffer: true, newline: "windows" }).sendMail({
    from: "Jason <jason@realismthriftglobal.com>", to: email, subject: "Used Bags, Shoes & Clothes",
    text: "Original text", html: "<html><body><p>Original <strong>Bags</strong>, <strong>Shoes</strong> and <strong>Clothes</strong></p></body></html>",
    attachments: [{ filename: "sample.bin", content: Buffer.from([0, 255, 12, 40]) }],
  });
  raw = mail.message as Buffer;
  mocks.execute.mockResolvedValueOnce({ rows: [{ email, unsubscribe_token: token, marketing_status: "held", safety_block: null, conversation_paused: false }] })
    .mockResolvedValueOnce({ rows: [] }).mockResolvedValueOnce({ rows: [{ result: { outreach_id: "linked", status: "draft" } }] });
  mocks.gmailRequest.mockResolvedValue({ message: { id: "message", threadId: "thread", labelIds: ["DRAFT"], raw: raw.toString("base64url") } });
});
describe("existing Gmail draft import", () => {
  it("retains original HTML and attachment bytes when adding the preference footer", async () => {
    const result = await simpleParser(await appendGatewayFooter(raw, email, unsubscribeFooter(token)));
    expect(result.html).toContain("Original <strong>Bags</strong>, <strong>Shoes</strong> and <strong>Clothes</strong>");
    expect(result.text).toContain("Original text");
    expect(result.html).toContain(unsubscribeFooter(token));
    expect(result.text).toContain(unsubscribeFooter(token));
    expect(result.attachments[0].content).toEqual(Buffer.from([0, 255, 12, 40]));
  });
  it("requires explicit footer permission rather than silently rewriting mailto-only drafts", async () => {
    await expect(importExistingGmailDraft("contact", "draft", mimeFingerprint(raw))).rejects.toMatchObject({ code: "unsubscribe_footer_missing" });
    expect(mocks.gmailRequest.mock.calls.every(c => c.length === 1)).toBe(true);
  });
  it("does not overwrite a user edit made after discovery", async () => {
    await expect(importExistingGmailDraft("contact", "draft", "a".repeat(64), true)).rejects.toMatchObject({ code: "draft_changed_review_again" });
    expect(mocks.gmailRequest.mock.calls.every(c => c.length === 1)).toBe(true);
  });
  it("uses PUT on the same draft and records the fingerprint Gmail actually saved, never a send", async () => {
    let saved = raw;
    mocks.gmailRequest.mockImplementation(async (path: string, body?: { message: { raw: string } }, method?: string) => {
      expect(path).not.toBe("drafts/send");
      if (method === "PUT") { expect(path).toBe("drafts/draft"); saved = Buffer.from(body!.message.raw, "base64url"); }
      return { message: { id: "message", threadId: "thread", labelIds: ["DRAFT"], raw: saved.toString("base64url") } };
    });
    const result = await importExistingGmailDraft("contact", "draft", mimeFingerprint(raw), true);
    expect(result).toMatchObject({ outreach_id: "linked", draft_id: "draft", footer_added: true, sends_performed: 0, fingerprint: mimeFingerprint(saved) });
    expect(mocks.gmailRequest.mock.calls.filter(c => c[2] === "PUT")).toHaveLength(1);
  });
  it("rejects a recipient mismatch before linking or updating", async () => {
    raw = Buffer.from(raw.toString().replace("To: buyer@example.com", "To: other@example.com"));
    mocks.gmailRequest.mockResolvedValue({ message: { threadId: "thread", labelIds: ["DRAFT"], raw: raw.toString("base64url") } });
    await expect(importExistingGmailDraft("contact", "draft", mimeFingerprint(raw), true)).rejects.toMatchObject({ code: "recipient_or_sender_changed" });
    expect(mocks.execute).toHaveBeenCalledTimes(2);
  });
});

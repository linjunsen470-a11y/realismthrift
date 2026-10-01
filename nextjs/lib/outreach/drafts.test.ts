import { beforeEach, describe, expect, it, vi } from "vitest";
import { simpleParser } from "mailparser";
import { renderColdEmail } from "./template";
import { createColdEmailDraft } from "./drafts";

const mocks = vi.hoisted(() => ({ execute: vi.fn(), gmailRequest: vi.fn(), verifyGmailAccount: vi.fn() }));
vi.mock("./database", () => ({ outreachDatabase: () => ({ execute: mocks.execute }) }));
vi.mock("./gmail", () => ({ gmailRequest: mocks.gmailRequest, verifyGmailAccount: mocks.verifyGmailAccount }));
const token = "A".repeat(43);
beforeEach(() => { vi.clearAllMocks(); });
describe("cold email composition", () => {
  it("escapes supplied HTML and retains the exact preference link in both alternatives", () => {
    const content = renderColdEmail(["Hi Alex,", '<script>alert("x")</script> & wholesale'], token);
    expect(content.html).not.toContain("<script>");
    expect(content.html).toContain("&lt;script&gt;");
    expect(content.html).not.toMatch(/<img|<script|<form|<iframe/i);
    expect(content.text).toContain(`https://www.realismthrift.com/email-preferences?token=${token}`);
    expect(content.html).toContain(`https://www.realismthrift.com/email-preferences?token=${token}`);
    expect(content.text).toContain("Fengyi Road");
  });
  it("refuses an unsubscribed contact without creating a message or a Gmail draft", async () => {
    mocks.execute.mockResolvedValueOnce({ rows: [{ email: "buyer@example.com", marketing_status: "unsubscribed", safety_block: null, conversation_paused: false, eligibility_note: "old review" }] });
    await expect(createColdEmailDraft("contact-id", "Wholesale options", ["Hi"])).rejects.toMatchObject({ code: "marketing_not_eligible" });
    expect(mocks.execute).toHaveBeenCalledTimes(1);
    expect(mocks.verifyGmailAccount).not.toHaveBeenCalled();
    expect(mocks.gmailRequest).not.toHaveBeenCalled();
  });
  it("refuses a paused conversation and header injection before creating drafts", async () => {
    mocks.execute.mockResolvedValueOnce({ rows: [{ email: "buyer@example.com", marketing_status: "eligible", safety_block: null, conversation_paused: true, eligibility_note: "reviewed" }] });
    await expect(createColdEmailDraft("contact-id", "Wholesale", ["Hi"])).rejects.toMatchObject({ code: "marketing_not_eligible" });
    await expect(createColdEmailDraft("contact-id", "Wholesale\r\nBcc: victim@example.com", ["Hi"])).rejects.toMatchObject({ code: "invalid_email_content" });
    expect(mocks.gmailRequest).not.toHaveBeenCalled();
  });
  it("saves a multipart draft with one recipient and no send call", async () => {
    mocks.execute
      .mockResolvedValueOnce({ rows: [{ email: "buyer@example.com", marketing_status: "eligible", safety_block: null, conversation_paused: false, eligibility_note: "reviewed" }] })
      .mockResolvedValueOnce({ rows: [{ result: { outreach_id: "message-id", email: "buyer@example.com", unsubscribe_token: token } }] })
      .mockResolvedValueOnce({ rows: [{ ok: true }] });
    mocks.gmailRequest.mockResolvedValueOnce({ id: "saved-draft", message: { id: "gmail-message" } });
    const result = await createColdEmailDraft("contact-id", "Wholesale options", ["Hi Alex,", "Would a current product list be useful?"]);
    expect(result.status).toBe("draft");
    expect(mocks.gmailRequest).toHaveBeenCalledTimes(1);
    const [path, request] = mocks.gmailRequest.mock.calls[0];
    expect(path).toBe("drafts");
    const parsed = await simpleParser(Buffer.from(request.message.raw, "base64url"));
    expect(parsed.to && !Array.isArray(parsed.to) && parsed.to.value.map(v => v.address)).toEqual(["buyer@example.com"]);
    expect(parsed.cc || parsed.bcc || parsed.attachments.length).toBeFalsy();
    expect(parsed.text).toContain(`?token=${token}`);
    expect(parsed.html).toContain(`?token=${token}`);
  });
});


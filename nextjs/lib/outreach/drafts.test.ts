import { beforeEach, describe, expect, it, vi } from "vitest";
import { simpleParser } from "mailparser";
import { assertOutreachHeaders } from "./mime";
import { renderColdEmail } from "./template";
import { createColdEmailDraft, registerColdEmailContact } from "./drafts";

const mocks = vi.hoisted(() => ({ execute: vi.fn(), gmailRequest: vi.fn(), verifyGmailAccount: vi.fn() }));
vi.mock("./database", () => ({ outreachDatabase: () => ({ execute: mocks.execute }) }));
vi.mock("./gmail", () => ({ gmailRequest: mocks.gmailRequest, verifyGmailAccount: mocks.verifyGmailAccount }));
const token = "A".repeat(43);
beforeEach(() => { vi.clearAllMocks(); vi.stubEnv("OUTREACH_DKIM_MODE", "google"); });
describe("cold email composition", () => {
  it("escapes supplied HTML and retains the exact preference link in both alternatives", () => {
    const content = renderColdEmail(["Hi Alex,", '<script>alert("x")</script> & wholesale'], token);
    expect(content.html).not.toContain("<script>");
    expect(content.html).toContain("&lt;script&gt;");
    expect(content.html).not.toMatch(/<img|<script|<form|<iframe/i);
    expect(content.text).toContain(`https://www.realismthrift.com/email-preferences?token=${token}`);
    expect(content.html).toContain(`https://www.realismthrift.com/email-preferences?token=${token}`);
    expect(content.text).toContain("County Road 193");
  });
  it("bolds product keywords in the server-rendered HTML without accepting supplied HTML", () => {
    const content = renderColdEmail(["Wholesale Bags, Shoes & Clothes"], token);
    for (const word of ["Bags", "Shoes", "Clothes"]) expect(content.html).toContain(`<strong>${word}</strong>`);
  });
  it("stops conflicting source registration without changing existing metadata", async () => {
    mocks.execute.mockResolvedValueOnce({ rows: [{ source: "original-row-25" }] });
    await expect(registerColdEmailContact("buyer@example.com", "wrong-row-9")).rejects.toMatchObject({ code: "contact_source_conflict" });
    expect(mocks.execute).toHaveBeenCalledTimes(1);
  });
  it("refuses an unsubscribed contact without creating a message or a Gmail draft", async () => {
    mocks.execute.mockResolvedValueOnce({ rows: [{ email: "buyer@example.com", marketing_status: "unsubscribed", safety_block: null, conversation_paused: false }] });
    await expect(createColdEmailDraft("contact-id", "Wholesale options", ["Hi"])).rejects.toMatchObject({ code: "marketing_not_eligible" });
    expect(mocks.execute).toHaveBeenCalledTimes(1);
    expect(mocks.verifyGmailAccount).not.toHaveBeenCalled();
    expect(mocks.gmailRequest).not.toHaveBeenCalled();
  });
  it("refuses a paused conversation and header injection before creating drafts", async () => {
    mocks.execute.mockResolvedValueOnce({ rows: [{ email: "buyer@example.com", marketing_status: "eligible", safety_block: null, conversation_paused: true }] });
    await expect(createColdEmailDraft("contact-id", "Wholesale", ["Hi"])).rejects.toMatchObject({ code: "marketing_not_eligible" });
    await expect(createColdEmailDraft("contact-id", "Wholesale\r\nBcc: victim@example.com", ["Hi"])).rejects.toMatchObject({ code: "invalid_email_content" });
    expect(mocks.gmailRequest).not.toHaveBeenCalled();
  });
  it("saves a multipart draft with one recipient and no send call", async () => {
    mocks.execute
      .mockResolvedValueOnce({ rows: [{ email: "buyer@example.com", marketing_status: "held", safety_block: null, conversation_paused: false }] })
      .mockResolvedValueOnce({ rows: [{ result: { outreach_id: "message-id", email: "buyer@example.com", unsubscribe_token: token } }] })
      .mockResolvedValueOnce({ rows: [{ ok: true }] })
      .mockResolvedValueOnce({ rows: [] });
    let saved = "";
    mocks.gmailRequest.mockImplementation(async (path, body) => {
      if (path === "drafts") { saved = body.message.raw; return { id: "saved-draft", message: { id: "gmail-message" } }; }
      return { id: "saved-draft", message: { id: "gmail-message", threadId: "thread", labelIds: ["DRAFT"], raw: saved } };
    });
    const result = await createColdEmailDraft("contact-id", "Wholesale options", ["Hi Alex,", "Would a current product list be useful?"]);
    expect(result.status).toBe("draft");
    expect(mocks.gmailRequest).toHaveBeenCalledTimes(2);
    expect(result.unsubscribe_headers_verified).toBe(true);
    const [path, request] = mocks.gmailRequest.mock.calls[0];
    expect(path).toBe("drafts");
    const parsed = await simpleParser(Buffer.from(request.message.raw, "base64url"));
    expect(parsed.to && !Array.isArray(parsed.to) && parsed.to.value.map(v => v.address)).toEqual(["buyer@example.com"]);
    expect(parsed.cc || parsed.bcc || parsed.attachments.length).toBeFalsy();
    assertOutreachHeaders(Buffer.from(request.message.raw, "base64url"), "message-id", token);
    expect(parsed.text).toContain(`?token=${token}`);
    expect(parsed.html).toContain(`?token=${token}`);
  });
  it("registering an existing unsubscribed contact does not make it sendable", async () => {
    mocks.execute.mockResolvedValueOnce({ rows: [{ id: "contact-id" }] })
      .mockResolvedValueOnce({ rows: [{ id: "contact-id", marketing_status: "unsubscribed", safety_block: null, conversation_paused: false }] });
    expect(await registerColdEmailContact("buyer@example.com")).toMatchObject({ cold_email_allowed: false });
    expect(mocks.gmailRequest).not.toHaveBeenCalled();
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";
import { PgDialect } from "drizzle-orm/pg-core";
import { getPendingColdEmailInbound, recordColdEmailInbound } from "./inbound";

const mocks = vi.hoisted(() => ({ execute: vi.fn(), gmailRequest: vi.fn(), listGmailMessages: vi.fn(), verifyGmailAccount: vi.fn() }));
vi.mock("./database", () => ({ outreachDatabase: () => ({ execute: mocks.execute }) }));
vi.mock("./gmail", () => mocks);
const dialect = new PgDialect();
const contactId = "d6e07dc9-cb5a-4cb6-a9b7-e950a4d552d5";
const email = "buyer@example.com";
let contact: { id: string; email: string; marketing_status: string; safety_block: string | null; conversation_paused: boolean };
let events: Map<string, { contact_id: string; kind: string }>;
let source: ReturnType<typeof mail>;

function mail(from = email, extra = "", text = "Please tell me about used shoes.", labels: string[] = ["INBOX"]) {
  return { id: "incoming", threadId: "conversation", labelIds: labels, internalDate: "1790880000000", raw: Buffer.from(`From: ${from}\r\nTo: jason@realismthriftglobal.com\r\nSubject: Wholesale question\r\n${extra}Content-Type: text/plain; charset=utf-8\r\n\r\n${text}`).toString("base64url") };
}

function bounce(status = "5.1.1", recipient = email) {
  return { ...mail(), raw: Buffer.from(`From: mailer-daemon@googlemail.com\r\nTo: jason@realismthriftglobal.com\r\nSubject: Delivery failure\r\nMIME-Version: 1.0\r\nContent-Type: multipart/report; report-type=delivery-status; boundary=bounce\r\n\r\n--bounce\r\nContent-Type: text/plain\r\n\r\nDelivery to ${recipient} failed.\r\n--bounce\r\nContent-Type: message/delivery-status\r\n\r\nReporting-MTA: dns; mx.example.com\r\n\r\nFinal-Recipient: rfc822; ${recipient}\r\nAction: failed\r\nStatus: ${status}\r\n\r\n--bounce--\r\n`).toString("base64url") };
}

beforeEach(() => {
  vi.clearAllMocks();
  contact = { id: contactId, email, marketing_status: "held", safety_block: null, conversation_paused: false };
  events = new Map(); source = mail();
  mocks.verifyGmailAccount.mockResolvedValue(undefined);
  mocks.listGmailMessages.mockImplementation(async (query: string) => query.startsWith("from:") ? [{ id: "incoming", threadId: "conversation" }] : []);
  mocks.gmailRequest.mockImplementation(async (path: string) => {
    if (path.startsWith("messages/")) return source;
    if (path.startsWith("drafts/")) return { message: { threadId: "conversation" } };
    if (path.startsWith("threads/")) return { messages: [source] };
    throw new Error("Unexpected Gmail operation");
  });
  mocks.execute.mockImplementation(async query => {
    const { sql, params } = dialect.sqlToQuery(query);
    if (sql.startsWith("select id,email")) return { rows: [{ ...contact }] };
    if (sql.startsWith("select draft_id")) return { rows: [{ draft_id: "draft", gmail_thread_id: null }] };
    if (sql.startsWith("select provider_key")) return { rows: [...events.keys()].map(provider_key => ({ provider_key })) };
    if (sql.includes("outreach_record_inbound")) {
      const [id, key, kind] = params as string[];
      if (!events.has(key)) {
        events.set(key, { contact_id: id, kind });
        if (kind === "reply") contact.conversation_paused = true;
        if (kind === "unsubscribe") contact.marketing_status = "unsubscribed";
        if (["hard_bounce", "complaint"].includes(kind)) contact.safety_block = kind;
      }
      return { rows: [] };
    }
    if (sql.startsWith("select contact_id,kind")) return { rows: events.has(String(params[0])) ? [events.get(String(params[0]))] : [] };
    throw new Error("Unexpected database operation");
  });
});

describe("contact incoming-message processing", () => {
  it("reads current plain text and includes the blocked draft thread without duplicate messages", async () => {
    const pending = await getPendingColdEmailInbound(contactId, 10, contactId);
    expect(pending).toMatchObject({ pending_count: 1, more_pending: false, messages: [{ gmail_message_id: "incoming", text: "Please tell me about used shoes.", automatic: false }] });
    expect(mocks.execute.mock.calls.some(call => dialect.sqlToQuery(call[0]).sql.includes("outreach_record_inbound"))).toBe(false);
  });
  it("processes an automatic reply and removes it from the same pending list used by sending", async () => {
    source = mail(email, "Auto-Submitted: auto-replied\r\n", "I am on vacation.");
    expect((await getPendingColdEmailInbound(contactId)).messages[0].automatic).toBe(true);
    expect(await recordColdEmailInbound(contactId, "incoming", "auto_reply", "Vacation auto reply")).toMatchObject({ status: "recorded", cold_email_allowed: true });
    expect((await getPendingColdEmailInbound(contactId)).pending_count).toBe(0);
  });
  it("pauses real replies and never restores an unsubscribed contact", async () => {
    contact.marketing_status = "unsubscribed";
    expect(await recordColdEmailInbound(contactId, "incoming", "reply", "Buyer asked about shoes")).toMatchObject({ cold_email_allowed: false, contact: { marketing_status: "unsubscribed", conversation_paused: true } });
  });
  it.each(["unsubscribe", "complaint"] as const)("records a direct %s and keeps marketing blocked", async classification => {
    expect(await recordColdEmailInbound(contactId, "incoming", classification, "Reviewed the current buyer request")).toMatchObject({ cold_email_allowed: false });
  });
  it("records only a recipient-matched permanent delivery report as a hard bounce", async () => {
    source = bounce();
    expect((await getPendingColdEmailInbound(contactId)).messages[0].permanent_failure).toBe(true);
    await expect(recordColdEmailInbound(contactId, "incoming", "auto_reply", "Cannot dismiss a permanent bounce")).rejects.toMatchObject({ code: "inbound_classification_mismatch" });
    expect(await recordColdEmailInbound(contactId, "incoming", "hard_bounce", "Permanent 5.1.1 report for this buyer")).toMatchObject({ cold_email_allowed: false, contact: { safety_block: "hard_bounce" } });
  });
  it("does not convert a temporary delivery failure into a permanent block", async () => {
    source = bounce("4.2.2");
    await expect(recordColdEmailInbound(contactId, "incoming", "hard_bounce", "Mailbox temporarily full")).rejects.toMatchObject({ code: "inbound_classification_mismatch" });
    expect(await recordColdEmailInbound(contactId, "incoming", "auto_reply", "Temporary delivery notice, not a permanent failure")).toMatchObject({ cold_email_allowed: true });
  });
  it("cannot dismiss a human reply as automatic or bind another sender to this contact", async () => {
    await expect(recordColdEmailInbound(contactId, "incoming", "auto_reply", "Try to ignore a human reply")).rejects.toMatchObject({ code: "inbound_classification_mismatch" });
    source = mail("other@example.com");
    await expect(recordColdEmailInbound(contactId, "incoming", "reply", "Wrong sender")).rejects.toMatchObject({ code: "inbound_contact_mismatch" });
    source = bounce("5.1.1", "other@example.com");
    await expect(recordColdEmailInbound(contactId, "incoming", "hard_bounce", "Wrong failed recipient")).rejects.toMatchObject({ code: "inbound_contact_mismatch" });
  });
  it.each(["SENT", "DRAFT"])("rejects %s messages", async label => {
    source = mail(email, "", "Hello", [label]);
    await expect(recordColdEmailInbound(contactId, "incoming", "reply", "Not inbound")).rejects.toMatchObject({ code: "not_inbound_message" });
  });
  it("keeps repeated recording idempotent and refuses to overwrite a prior classification", async () => {
    await recordColdEmailInbound(contactId, "incoming", "unsubscribe", "Please stop email");
    expect(await recordColdEmailInbound(contactId, "incoming", "unsubscribe", "Same request again")).toMatchObject({ status: "recorded", cold_email_allowed: false });
    await expect(recordColdEmailInbound(contactId, "incoming", "reply", "Reclassify")).rejects.toMatchObject({ code: "inbound_already_classified" });
    expect(events.size).toBe(1);
    expect(contact.marketing_status).toBe("unsubscribed");
  });
});

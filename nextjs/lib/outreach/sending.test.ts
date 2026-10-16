import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PgDialect } from "drizzle-orm/pg-core";
import { reconcileOutreachSend, reviewOutreachDraft, sendApprovedOutreach } from "./sending";
import { mimeFingerprint, unsubscribeFooter } from "./mime";
import { newPreferenceToken } from "./tokens";

const mocks = vi.hoisted(() => ({ execute: vi.fn(), gmailRequest: vi.fn(), listGmailMessages: vi.fn(), verifyGmailAccount: vi.fn() }));
vi.mock("./database", () => ({ outreachDatabase: () => ({ execute: mocks.execute }) }));
vi.mock("./gmail", () => ({ ...mocks, gmailHeader: (message: { payload?: { headers?: { name: string; value: string }[] } }, name: string) => message.payload?.headers?.find(header => header.name.toLowerCase() === name.toLowerCase())?.value, GmailError: class extends Error { httpStatus = 403; } }));

const token = newPreferenceToken();
const raw = Buffer.from(`From: jason@realismthriftglobal.com\r\nTo: buyer@example.com\r\nSubject: Wholesale clothes\r\nContent-Type: text/plain\r\n\r\nHello\r\n${unsubscribeFooter(token)}\r\n`);
const id = "d6e07dc9-cb5a-4cb6-a9b7-e950a4d552d5";
let status: string;
let version: number;
let claim: string;
let accountReads: number;
let changeAfterClaim: boolean;
let purpose: string;
const dialect = new PgDialect();
afterEach(() => vi.unstubAllEnvs());

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("OUTREACH_SENDING_ENABLED", "true");
  vi.stubEnv("OUTREACH_RFC8058_VERIFIED", "true");
  vi.stubEnv("OUTREACH_DKIM_MODE", "google");
  vi.stubEnv("OUTREACH_TEST_RECIPIENTS", "");
  status = "draft"; version = 1; claim = "claimed"; accountReads = 0; changeAfterClaim = false; purpose = "cold_marketing";
  mocks.verifyGmailAccount.mockResolvedValue(undefined);
  mocks.listGmailMessages.mockResolvedValue([]);
  mocks.gmailRequest.mockImplementation(async (path: string) => {
    if (path.startsWith("drafts/fixture")) return { message: { id: "draft_message", threadId: "thread", raw: raw.toString("base64url") } };
    if (path.startsWith("threads/")) return { messages: [] };
    if (path === "drafts/send") return { id: "sent-message", threadId: "sent-thread" };
    throw new Error("Unexpected Gmail operation");
  });
  mocks.execute.mockImplementation(async query => {
    const text = dialect.sqlToQuery(query).sql;
    if (text.startsWith("select m.*")) {
      accountReads++;
      return { rows: [{ id, contact_id: id, email: "buyer@example.com", sender: "jason@realismthriftglobal.com", draft_id: "fixture", purpose, status, unsubscribe_token: token, preference_version: changeAfterClaim && accountReads > 1 ? 2 : version, marketing_status: "held", safety_block: null, conversation_paused: false, gmail_message_id: "already-sent", gmail_thread_id: "thread" }] };
    }
    if (text.includes("outreach_claim_send")) { if (claim === "claimed") status = "sending"; return { rows: [{ result: { status: claim } }] }; }
    if (text.startsWith("select provider_key")) return { rows: [] };
    return { rows: [] };
  });
});

describe("uncertain send reconciliation", () => {
  const headers = [
    { name: "X-RealismThrift-Outreach-ID", value: id },
    { name: "From", value: "jason@realismthriftglobal.com" },
    { name: "To", value: "buyer@example.com" },
  ];
  function sentMetadata(fields: typeof headers) {
    status = "send_unknown";
    mocks.listGmailMessages.mockResolvedValue([{ id: "candidate" }]);
    mocks.gmailRequest.mockResolvedValue({ id: "candidate", threadId: "thread", payload: { headers: fields } });
  }
  it("records a Sent message only when its identifier and addresses match", async () => {
    sentMetadata(headers);
    expect(await reconcileOutreachSend(id)).toMatchObject({ status: "sent", message_id: "candidate" });
    expect(mocks.execute.mock.calls.some(call => dialect.sqlToQuery(call[0]).sql.includes("set status='sent'"))).toBe(true);
  });
  it.each([
    headers.map(header => header.name === "To" ? { ...header, value: "other@example.com" } : header),
    headers.map(header => header.name === "From" ? { ...header, value: "other@example.com" } : header),
    [...headers, { name: "Cc", value: "other@example.com" }],
  ])("keeps an ambiguous or mismatched Sent message reserved (%#)", async (...fields) => {
    sentMetadata(fields);
    expect(await reconcileOutreachSend(id)).toMatchObject({ status: "send_unknown" });
    expect(mocks.execute.mock.calls.some(call => dialect.sqlToQuery(call[0]).sql.includes("set status='sent'"))).toBe(false);
  });
});

describe("authorized draft sending", () => {
  it("sends without a review call or supplied fingerprint and records the actual content fingerprint", async () => {
    expect(await sendApprovedOutreach(id)).toMatchObject({ status: "sent", message_id: "sent-message" });
    const query = mocks.execute.mock.calls.map(call => dialect.sqlToQuery(call[0])).find(query => query.sql.includes("outreach_claim_send"));
    expect(query?.params).toContain(mimeFingerprint(raw));
    expect(mocks.gmailRequest.mock.calls.filter(call => call[0] === "drafts/send")).toHaveLength(1);
  });
  it("stops a direct send if the saved content changes during the operation", async () => {
    let draftReads = 0;
    const implementation = mocks.gmailRequest.getMockImplementation()!;
    mocks.gmailRequest.mockImplementation(async (...args) => {
      if (args[0].startsWith("drafts/fixture") && ++draftReads > 1) {
        return { message: { threadId: "thread", raw: Buffer.from(raw.toString().replace("Hello", "Changed")).toString("base64url") } };
      }
      return implementation(...args);
    });
    await expect(sendApprovedOutreach(id)).rejects.toMatchObject({ code: "draft_changed_during_send" });
    expect(mocks.gmailRequest.mock.calls.some(call => call[0] === "drafts/send")).toBe(false);
    expect(mocks.execute.mock.calls.map(call => dialect.sqlToQuery(call[0]).params).some(params => params.includes("draft"))).toBe(true);
  });
  it.each(["sending", "send_unknown", "cancelled", "failed"])("never submits a %s record as a direct send", async value => {
    status = value;
    await expect(sendApprovedOutreach(id)).rejects.toMatchObject({ code: "draft_not_sendable" });
    expect(mocks.gmailRequest).not.toHaveBeenCalled();
  });
  it.each(["requested_reply", "resubscribe_confirmation"])("rejects %s at every cold-email entry point", async value => {
    purpose = value;
    for (const action of [reviewOutreachDraft, reconcileOutreachSend, (messageId: string) => sendApprovedOutreach(messageId, mimeFingerprint(raw))]) {
      await expect(action(id)).rejects.toMatchObject({ code: "unknown_cold_email_draft" });
    }
    expect(mocks.gmailRequest).not.toHaveBeenCalled();
  });
  it("is closed by default and never calls Gmail when disabled", async () => {
    vi.stubEnv("OUTREACH_SENDING_ENABLED", "false");
    await expect(sendApprovedOutreach(id, mimeFingerprint(raw))).rejects.toMatchObject({ code: "sending_disabled" });
    expect(mocks.gmailRequest).not.toHaveBeenCalled();
  });
  it("requires the delivered RFC 8058 validation flag", async () => {
    vi.stubEnv("OUTREACH_RFC8058_VERIFIED", "false");
    await expect(sendApprovedOutreach(id, mimeFingerprint(raw))).rejects.toMatchObject({ code: "rfc8058_not_verified" });
    expect(mocks.gmailRequest).not.toHaveBeenCalled();
  });
  it("refuses an edited draft without submitting it", async () => {
    await expect(sendApprovedOutreach(id, "a".repeat(64))).rejects.toMatchObject({ code: "draft_changed_review_again" });
    expect(mocks.gmailRequest.mock.calls.some(call => call[0] === "drafts/send")).toBe(false);
  });
  it("allows only configured self-owned inboxes before received-message verification", async () => {
    vi.stubEnv("OUTREACH_RFC8058_VERIFIED", "false");
    vi.stubEnv("OUTREACH_TEST_RECIPIENTS", "buyer@example.com");
    expect(await sendApprovedOutreach(id, mimeFingerprint(raw))).toMatchObject({ status: "sent" });
    expect(mocks.gmailRequest.mock.calls.filter(call => call[0] === "drafts/send")).toHaveLength(1);
  });
  it("cannot bypass the configured test recipient list", async () => {
    vi.stubEnv("OUTREACH_TEST_RECIPIENTS", "self@example.com");
    await expect(sendApprovedOutreach(id, mimeFingerprint(raw))).rejects.toMatchObject({ code: "test_recipient_required" });
    expect(mocks.gmailRequest).not.toHaveBeenCalled();
  });
  it("pauses when a new inbound message has not been reviewed", async () => {
    mocks.listGmailMessages.mockResolvedValue([{ id: "new-reply", threadId: "thread" }]);
    await expect(sendApprovedOutreach(id)).rejects.toMatchObject({ code: "inbound_review_required", details: { contact_id: id, outreach_id: id, pending_count: 1 } });
    expect(mocks.gmailRequest.mock.calls.some(call => call[0] === "drafts/send")).toBe(false);
  });
  it("refuses the 51st marketing reservation", async () => {
    claim = "daily_limit";
    await expect(sendApprovedOutreach(id, mimeFingerprint(raw))).rejects.toMatchObject({ code: "daily_limit" });
    expect(mocks.gmailRequest.mock.calls.some(call => call[0] === "drafts/send")).toBe(false);
  });
  it("rechecks preferences after the reservation", async () => {
    changeAfterClaim = true;
    await expect(sendApprovedOutreach(id, mimeFingerprint(raw))).rejects.toMatchObject({ code: "preferences_changed" });
    expect(mocks.gmailRequest.mock.calls.some(call => call[0] === "drafts/send")).toBe(false);
  });
  it("submits only the approved draft and adds protocol headers", async () => {
    const result = await sendApprovedOutreach(id, mimeFingerprint(raw));
    expect(result).toMatchObject({ message_id: "sent-message", thread_id: "sent-thread" });
    const sends = mocks.gmailRequest.mock.calls.filter(call => call[0] === "drafts/send");
    expect(sends).toHaveLength(1);
    expect(sends[0][1].id).toBe("fixture");
    expect(Buffer.from(sends[0][1].message.raw, "base64url").toString()).toContain("List-Unsubscribe-Post: List-Unsubscribe=One-Click");
  });
  it("reserves uncertain submissions and never retries", async () => {
    mocks.gmailRequest.mockImplementation(async path => {
      if (path.startsWith("drafts/fixture")) return { message: { threadId: "thread", raw: raw.toString("base64url") } };
      if (path.startsWith("threads/")) return { messages: [] };
      if (path === "drafts/send") throw new TypeError("Network connection lost");
    });
    await expect(sendApprovedOutreach(id, mimeFingerprint(raw))).rejects.toMatchObject({ code: "send_unknown_reconcile_before_retry" });
    const queryParams = mocks.execute.mock.calls.map(call => dialect.sqlToQuery(call[0]).params);
    expect(queryParams.some(values => values.includes("send_unknown"))).toBe(true);
    expect(mocks.gmailRequest.mock.calls.filter(call => call[0] === "drafts/send")).toHaveLength(1);
  });
  it("returns an already sent result without sending again", async () => {
    status = "sent";
    expect(await sendApprovedOutreach(id, mimeFingerprint(raw))).toMatchObject({ message_id: "already-sent" });
    expect(mocks.gmailRequest).not.toHaveBeenCalled();
  });
});

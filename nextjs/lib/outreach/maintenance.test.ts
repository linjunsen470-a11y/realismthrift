import { beforeEach, describe, expect, it, vi } from "vitest";
import { PgDialect } from "drizzle-orm/pg-core";
import nodemailer from "nodemailer";
import { repairOutreachDraft, inspectOutreachDraftMaintenance } from "./maintenance";
import { addOutreachHeaders, assertOutreachHeaders, mimeFingerprint, splitMime, unsubscribeFooter } from "./mime";

const mocks = vi.hoisted(() => ({ execute: vi.fn(), gmailRequest: vi.fn(), verifyGmailAccount: vi.fn() }));
vi.mock("./database", () => ({ outreachDatabase: () => ({ execute: mocks.execute }) }));
vi.mock("./gmail", () => mocks);
const id = "89333b78-eabc-4018-b265-b5e01b5c2a16", email = "buyer@example.com", token = "A".repeat(43);
const dialect = new PgDialect();
let record: { [key: string]: unknown }, raw: Buffer, initial: Buffer, messageId: string;
let input: Parameters<typeof repairOutreachDraft>[0];
let corruptSave = false;
let regenerateMetadata = false;
beforeEach(async () => {
  vi.resetAllMocks(); vi.stubEnv("OUTREACH_DKIM_MODE", "google");
  corruptSave = false; regenerateMetadata = false; messageId = "old-message";
  record = { id, contact_id: id, email, sender: "jason@realismthriftglobal.com", draft_id: "draft", status: "draft", source: "wrong-row-9", purpose: "cold_marketing", unsubscribe_token: token,
    preference_version: 4, updated_at: "before", marketing_status: "unsubscribed", safety_block: "complaint", conversation_paused: true };
  const mail = await nodemailer.createTransport({ streamTransport: true, buffer: true, newline: "windows" }).sendMail({
    from: "Jason <jason@realismthriftglobal.com>", to: email, subject: "Existing subject", text: `Existing text\n${unsubscribeFooter(token)}`,
    html: `<p><strong>Bags</strong> / <strong>Shoes</strong> / <strong>Clothes</strong></p><p>${unsubscribeFooter(token)}</p>`,
    attachments: [{ filename: "sample.bin", content: Buffer.from([0, 255, 10]) }],
  });
  raw = initial = mail.message as Buffer;
  input = { outreach_id: id, email, draft_id: "draft", message_id: messageId, fingerprint: mimeFingerprint(raw), expected_source: "wrong-row-9", corrected_source: "correct-row-25" };
  mocks.execute.mockImplementation(async query => {
    const q = dialect.sqlToQuery(query);
    if (q.sql.startsWith("select m.*")) return { rows: [{ ...record }] };
    if (q.sql.startsWith("with held")) { record = { ...record, status: "cancelled", updated_at: "claimed" }; return { rows: [{ id, updated_at: "claimed" }] }; }
    if (q.sql.startsWith("with contact")) { record.source = input.corrected_source; return { rows: [{ id, source: record.source }] }; }
    throw new Error("Unexpected SQL");
  });
  mocks.gmailRequest.mockImplementation(async (path, body, method) => {
    if (method === "PUT") { expect(path).toBe("drafts/draft"); raw = Buffer.from(body.message.raw, "base64url"); messageId = "new-message"; raw = Buffer.concat([Buffer.from("Received: from gmailapi.google.com with HTTPREST\r\n"), raw]); if (regenerateMetadata) raw = Buffer.from(raw.toString().replace(/^Message-ID:[^\r\n]*/mi, "Message-Id: <gmail-saved@example.com>").replace(/^Date:[^\r\n]*/mi, "Date: Sat, 31 Oct 2026 21:24:03 -0700")); if (corruptSave) raw = Buffer.from(raw.toString().replace("Existing subject", "Wrong subject")); }
    else expect(path).toBe("drafts/draft?format=raw");
    return { id: "draft", message: { id: messageId, threadId: "thread", labelIds: ["DRAFT"], raw: raw.toString("base64url") } };
  });
});
describe("identity-pinned draft maintenance", () => {
  it("inspects a suppressed draft without changing Gmail, metadata or preferences", async () => {
    expect(await inspectOutreachDraftMaintenance(id)).toMatchObject({ message_id: "old-message", source: "wrong-row-9", unsubscribe_headers_verified: false, safety_block: "complaint", conversation_paused: true });
    expect(mocks.execute).toHaveBeenCalledTimes(1);
    expect(mocks.gmailRequest.mock.calls.every(call => call.length === 1)).toBe(true);
  });
  it("repairs the same draft, keeps a durable HOLD and preserves MIME body, subject, attachment and suppression", async () => {
    const result = await repairOutreachDraft(input);
    expect(result).toMatchObject({ draft_id: "draft", old_message_id: "old-message", message_id: "new-message", source: "correct-row-25", content_unchanged: true, source_verified: true, hold: true, sends_performed: 0, drafts_created: 0 });
    expect(splitMime(raw).body).toEqual(splitMime(initial).body);
    assertOutreachHeaders(raw, id, token);
    expect(record).toMatchObject({ status: "cancelled", marketing_status: "unsubscribed", safety_block: "complaint", conversation_paused: true, preference_version: 4 });
    expect(mocks.gmailRequest.mock.calls.filter(call => call[2] === "PUT")).toHaveLength(1);
    const commit = mocks.execute.mock.calls.map(call => dialect.sqlToQuery(call[0])).find(q => q.sql.startsWith("with contact"))!;
    expect(commit.sql).not.toMatch(/set marketing_status|set safety_block|set conversation_paused|set preference_version/);
    expect(commit.params).toContain(mimeFingerprint(raw));
  });
  it.each(["sent", "sending", "send_unknown", "failed"])("refuses %s without modifying Gmail", async status => {
    record.status = status;
    await expect(repairOutreachDraft(input)).rejects.toMatchObject({ code: "draft_not_maintainable" });
    expect(mocks.gmailRequest).not.toHaveBeenCalled();
  });
  it("accepts Gmail-regenerated Message-Id and Date while preserving the body and subject", async () => {
    regenerateMetadata = true;
    await expect(repairOutreachDraft(input)).resolves.toMatchObject({ content_unchanged: true, hold: true });
    expect(splitMime(raw).body).toEqual(splitMime(initial).body);
    expect(raw.toString()).toContain("Message-Id: <gmail-saved@example.com>");
    expect(raw.toString()).toContain("Subject: Existing subject");
  });
  it("commits an inspected already-repaired draft without a second Gmail PUT", async () => {
    raw = await addOutreachHeaders(raw, id, token);
    record.status = "cancelled";
    input.fingerprint = mimeFingerprint(raw);
    await expect(repairOutreachDraft(input)).resolves.toMatchObject({ message_id: "old-message", source_verified: true, hold: true });
    expect(mocks.gmailRequest.mock.calls.filter(call => call[2] === "PUT")).toHaveLength(0);
  });
  it.each(["email", "draft_id", "expected_source", "message_id", "fingerprint"])("rejects a changed %s", async key => {
    await expect(repairOutreachDraft({ ...input, [key]: "changed" })).rejects.toBeTruthy();
    expect(mocks.gmailRequest.mock.calls.some(call => call[2] === "PUT")).toBe(false);
  });
  it("stops when the final Gmail read detects a concurrent edit, retaining backend HOLD", async () => {
    let reads = 0;
    const original = mocks.gmailRequest.getMockImplementation()!;
    mocks.gmailRequest.mockImplementation(async (...args) => {
      if (++reads === 2) raw = Buffer.from(raw.toString().replace("Existing subject", "User edit"));
      return original(...args);
    });
    await expect(repairOutreachDraft(input)).rejects.toMatchObject({ code: "draft_changed_review_again" });
    expect(record.status).toBe("cancelled");
    expect(mocks.gmailRequest.mock.calls.some(call => call[2] === "PUT")).toBe(false);
  });
  it("stops a concurrent database claim before Gmail PUT", async () => {
    const original = mocks.execute.getMockImplementation()!;
    mocks.execute.mockImplementation(async query => dialect.sqlToQuery(query).sql.startsWith("with held") ? { rows: [] } : original(query));
    await expect(repairOutreachDraft(input)).rejects.toMatchObject({ code: "maintenance_concurrent_change" });
    expect(mocks.gmailRequest.mock.calls.some(call => call[2] === "PUT")).toBe(false);
  });
  it("does not commit source correction when saved MIME changes other content", async () => {
    corruptSave = true;
    await expect(repairOutreachDraft(input)).rejects.toMatchObject({ code: "maintenance_content_changed" });
    expect(record.source).toBe("wrong-row-9"); expect(record.status).toBe("cancelled");
  });
  it("does not retry an uncertain Gmail PUT or release HOLD", async () => {
    const original = mocks.gmailRequest.getMockImplementation()!;
    mocks.gmailRequest.mockImplementation(async (...args) => { if (args[2] === "PUT") throw new Error("timeout"); return original(...args); });
    await expect(repairOutreachDraft(input)).rejects.toMatchObject({ code: "draft_update_uncertain_inspect_before_retry" });
    expect(record.status).toBe("cancelled"); expect(record.source).toBe("wrong-row-9");
    expect(mocks.gmailRequest.mock.calls.filter(call => call[2] === "PUT")).toHaveLength(1);
  });
});

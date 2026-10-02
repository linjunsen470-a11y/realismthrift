import { beforeEach, describe, expect, it, vi } from "vitest";
import { getColdEmailHistory } from "./history";
import { OutreachError } from "./config";
const mocks = vi.hoisted(() => ({ execute: vi.fn(), gmailRequest: vi.fn(), verifyGmailAccount: vi.fn() }));
vi.mock("./database", () => ({ outreachDatabase: () => ({ execute: mocks.execute }) }));
vi.mock("./gmail", () => ({ ...mocks, gmailHeader: (message: { payload?: { headers?: { name: string; value: string }[] } }, name: string) => message.payload?.headers?.find(h => h.name.toLowerCase() === name.toLowerCase())?.value || "" }));
const sender = "jason@realismthriftglobal.com";
const buyer = "buyer@example.com";
function message(id: string, from: string, to: string, labels: string[] = []) {
  return { id, threadId: "old-thread", internalDate: "1700000000000", labelIds: labels,
    payload: { headers: [{ name: "From", value: from }, { name: "To", value: to }, { name: "Subject", value: "Older mail" }] } };
}
beforeEach(() => {
  vi.clearAllMocks();
  mocks.verifyGmailAccount.mockResolvedValue(undefined);
  mocks.execute.mockResolvedValue({ rows: [] });
  mocks.gmailRequest.mockResolvedValue({ messages: [] });
});
describe("sender-recipient history", () => {
  it("finds pre-plugin mail in both directions and excludes unrelated and draft messages", async () => {
    const data = [message("out", sender, buyer), message("in", buyer, sender), message("other", "other@example.com", sender), message("draft", sender, buyer, ["DRAFT"])];
    mocks.gmailRequest.mockImplementation(async (path: string) => path.startsWith("messages?") ? { messages: data.map(m => ({ id: m.id })) } : data.find(m => path.startsWith(`messages/${m.id}?`)));
    const history = await getColdEmailHistory(buyer);
    expect(history.gmail.messages.map(m => m.gmail_message_id)).toEqual(["out", "in"]);
    expect(history.interaction).toMatchObject({ previously_sent: true, received_inbound: true });
    const params = new URLSearchParams(mocks.gmailRequest.mock.calls[0][0].split("?")[1]);
    expect(params.get("q")).toContain(`from:"${sender}" to:"${buyer}"`);
    expect(params.get("q")).toContain(`from:"${buyer}" to:"${sender}"`);
    expect(params.get("q")).toContain("-in:drafts");
    expect(history.database.messages).toEqual([]);
  });
  it("retains gateway history when Gmail is unavailable, without claiming no prior interaction", async () => {
    mocks.execute.mockResolvedValueOnce({ rows: [{ status: "sent", count: 2 }, { status: "draft", count: 3 }, { status: "send_unknown", count: 1 }] })
      .mockResolvedValueOnce({ rows: [{ outreach_id: "saved", status: "sent", gmail_message_id: "out" }] })
      .mockResolvedValueOnce({ rows: [] });
    mocks.verifyGmailAccount.mockRejectedValue(new OutreachError("gmail_not_connected"));
    const history = await getColdEmailHistory(buyer);
    expect(history.database.counts_by_status).toEqual({ sent: 2, draft: 3, send_unknown: 1 });
    expect(history.gmail).toMatchObject({ available: false, error_code: "gmail_not_connected" });
    expect(history.interaction).toMatchObject({ previously_sent: true, received_inbound: null });
  });
  it("does not count draft or uncertain sends as a successful prior send", async () => {
    mocks.execute.mockResolvedValueOnce({ rows: [{ status: "draft", count: 1 }, { status: "send_unknown", count: 1 }] })
      .mockResolvedValueOnce({ rows: [] }).mockResolvedValueOnce({ rows: [] });
    expect((await getColdEmailHistory(buyer)).interaction.previously_sent).toBeNull();
    mocks.execute.mockResolvedValueOnce({ rows: [{ status: "draft", count: 1 }] })
      .mockResolvedValueOnce({ rows: [] }).mockResolvedValueOnce({ rows: [] });
    expect((await getColdEmailHistory(buyer)).interaction.previously_sent).toBe(false);
  });
  it("returns unknown negative results for incomplete Gmail history and continuation pages", async () => {
    mocks.gmailRequest.mockResolvedValueOnce({ messages: [], nextPageToken: "next" });
    expect((await getColdEmailHistory(buyer)).interaction.previously_sent).toBeNull();
    mocks.gmailRequest.mockResolvedValueOnce({ messages: [] });
    expect((await getColdEmailHistory(buyer, 10, 0, "next")).interaction.received_inbound).toBeNull();
  });
  it("paginates gateway rows independently and rejects invalid email before network or SQL", async () => {
    mocks.execute.mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ outreach_id: "a" }, { outreach_id: "b" }, { outreach_id: "c" }] })
      .mockResolvedValueOnce({ rows: [] });
    expect((await getColdEmailHistory(buyer, 2, 4)).database.next_offset).toBe(6);
    vi.clearAllMocks();
    await expect(getColdEmailHistory("bad email")).rejects.toMatchObject({ code: "invalid_request" });
    expect(mocks.execute).not.toHaveBeenCalled();
    expect(mocks.gmailRequest).not.toHaveBeenCalled();
  });
});

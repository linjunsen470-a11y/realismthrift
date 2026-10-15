import { afterEach, describe, expect, it, vi } from "vitest";
import { readSendQuota, sendingConfiguration, shanghaiDay } from "./readiness";

const mocks = vi.hoisted(() => ({ execute: vi.fn(), listGmailMessages: vi.fn(), verifyGmailAccount: vi.fn() }));
vi.mock("./database", () => ({ outreachDatabase: () => ({ execute: mocks.execute }) }));
vi.mock("./gmail", () => mocks);
afterEach(() => vi.unstubAllEnvs());
describe("gateway diagnosis and actual-mailbox quota", () => {
  it("uses Shanghai midnight across the UTC date boundary", () => {
    expect(shanghaiDay(new Date("2026-10-15T16:00:00Z"))).toEqual({ day: "2026-10-16", start: 1792080000, end: 1792166400 });
    expect(shanghaiDay(new Date("2026-10-15T15:59:59Z")).day).toBe("2026-10-15");
  });
  it("counts external sent mail and unresolved reservations without counting the same Gmail ID twice", async () => {
    mocks.listGmailMessages.mockResolvedValue([{ id: "external" }, { id: "gateway-sent" }]);
    mocks.execute.mockResolvedValue({ rows: [{ gmail_message_id: "gateway-sent" }, { gmail_message_id: null }] });
    expect(await readSendQuota()).toMatchObject({ gmail_sent: 2, gateway_not_in_gmail: 1, used: 3, remaining: 47 });
  });
  it("fails closed if Gmail quota evidence is unavailable", async () => {
    mocks.listGmailMessages.mockRejectedValue(new Error("offline"));
    await expect(readSendQuota()).rejects.toThrow("offline");
  });
  it("distinguishes disabled sending, verification and test restrictions without exposing secrets", () => {
    vi.stubEnv("OUTREACH_SENDING_ENABLED", "false"); vi.stubEnv("OUTREACH_RFC8058_VERIFIED", "true");
    vi.stubEnv("OUTREACH_TEST_RECIPIENTS", "private@example.com"); vi.stubEnv("OUTREACH_DKIM_MODE", "google");
    const result = sendingConfiguration();
    expect(result.blockers).toEqual(["sending_disabled", "test_recipient_restriction"]);
    expect(JSON.stringify(result)).not.toContain("private@example.com");
  });
});

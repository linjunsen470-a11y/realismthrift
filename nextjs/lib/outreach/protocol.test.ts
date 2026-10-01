import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST, GET } from "../../app/api/email-preferences/one-click/route";
import { POST as humanPost } from "../../app/api/email-preferences/route";
import { OutreachError } from "./config";
import { newPreferenceToken, tokenHash, validPreferenceToken, normalizeEmail } from "./tokens";

const actions = vi.hoisted(() => ({ unsubscribe: vi.fn(), confirmResubscribe: vi.fn(), previewConfirmation: vi.fn(), requestResubscribe: vi.fn() }));
vi.mock("./preferences", () => actions);

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("OUTREACH_SITE_ORIGIN", "https://www.realismthrift.com");
  actions.unsubscribe.mockResolvedValue({ status: "unsubscribed" });
  actions.previewConfirmation.mockResolvedValue({ status: "ready", email: "a***@example.com" });
});

describe("RFC 8058", () => {
  const token = newPreferenceToken();
  const url = `https://www.realismthrift.com/api/email-preferences/one-click?token=${token}`;
  it("accepts a cookie-free, origin-free POST without a redirect", async () => {
    const response = await POST(new Request(url, { method: "POST", body: new URLSearchParams({ "List-Unsubscribe": "One-Click" }) }));
    expect(response.status).toBe(204);
    expect(response.headers.has("Location")).toBe(false);
    expect(actions.unsubscribe).toHaveBeenCalledWith(token, "one_click");
  });
  it("accepts multipart form data", async () => {
    const form = new FormData(); form.set("List-Unsubscribe", "One-Click");
    expect((await POST(new Request(url, { method: "POST", body: form }))).status).toBe(204);
  });
  it("GET only leads to the human page", () => {
    const response = GET(new Request(url));
    expect(response.status).toBe(303);
    expect(response.headers.get("Location")).toContain(`/email-preferences?token=${token}`);
    expect(actions.unsubscribe).not.toHaveBeenCalled();
  });
  it("rejects a malformed operation without changing preferences", async () => {
    const response = await POST(new Request(url, { method: "POST", body: new URLSearchParams({ "List-Unsubscribe": "Other" }) }));
    expect(response.status).toBe(400);
    expect(actions.unsubscribe).not.toHaveBeenCalled();
  });
  it("never claims success when storage fails", async () => {
    actions.unsubscribe.mockRejectedValue(new OutreachError("service_unavailable"));
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect((await POST(new Request(url, { method: "POST", body: new URLSearchParams({ "List-Unsubscribe": "One-Click" }) }))).status).toBe(503);
    vi.restoreAllMocks();
  });
  it("limits streamed bodies even without Content-Length", async () => {
    const response = await POST(new Request(url, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: "x".repeat(9000) }));
    expect(response.status).toBe(413);
    expect(actions.unsubscribe).not.toHaveBeenCalled();
  });
});

describe("human preferences", () => {
  function request(body: unknown, origin = "https://www.realismthrift.com") {
    return new Request("https://www.realismthrift.com/api/email-preferences", { method: "POST", headers: { "Content-Type": "application/json", Origin: origin }, body: JSON.stringify(body) });
  }
  it("requires an affirmative request checkbox", async () => {
    expect((await humanPost(request({ action: "request_resubscribe", email: "a@example.com", consent: false }))).status).toBe(400);
    expect(actions.requestResubscribe).not.toHaveBeenCalled();
  });
  it("only previews a confirmation token", async () => {
    const response = await humanPost(request({ action: "preview_confirmation", token: newPreferenceToken() }));
    expect(response.status).toBe(200);
    expect(actions.confirmResubscribe).not.toHaveBeenCalled();
  });
  it("requires the configured origin", async () => {
    expect((await humanPost(request({ action: "confirm_resubscribe", token: newPreferenceToken() }, "https://other.example"))).status).toBe(403);
    expect(actions.confirmResubscribe).not.toHaveBeenCalled();
  });
  it("uses high entropy, single-purpose tokens and preserves address identity", () => {
    const token = newPreferenceToken();
    expect(validPreferenceToken(token)).toBe(true);
    expect(tokenHash(token)).toMatch(/^[a-f0-9]{64}$/);
    expect(validPreferenceToken("../example")).toBe(false);
    expect(normalizeEmail(" A.B+sales@EXAMPLE.COM ")).toBe("a.b+sales@example.com");
  });
});

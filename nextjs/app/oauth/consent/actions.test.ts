import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { decideConnection } from "./actions";

const mocks = vi.hoisted(() => ({ requireOperator: vi.fn(), details: vi.fn(), approve: vi.fn(), deny: vi.fn() }));
vi.mock("@/lib/outreach/auth", async importOriginal => ({ ...await importOriginal<typeof import("@/lib/outreach/auth")>(), requireOperator: mocks.requireOperator }));
vi.mock("next/navigation", () => ({ redirect: (url: string) => { throw new Error(`redirect:${url}`); } }));

beforeEach(() => {
  vi.stubEnv("OUTREACH_OAUTH_CLIENT_ID", "approved-client");
  mocks.requireOperator.mockResolvedValue({ auth: { oauth: { getAuthorizationDetails: mocks.details, approveAuthorization: mocks.approve, denyAuthorization: mocks.deny } } });
  mocks.details.mockResolvedValue({ data: { client: { id: "approved-client" } }, error: null });
  mocks.approve.mockResolvedValue({ data: { redirect_url: "https://chatgpt.com/connector/oauth/test" }, error: null });
  mocks.deny.mockResolvedValue({ data: { redirect_url: "https://chatgpt.com/connector/oauth/test?error=access_denied" }, error: null });
});
afterEach(() => { vi.resetAllMocks(); vi.unstubAllEnvs(); });

describe("personal ChatGPT connection", () => {
  it("approves only the authenticated operator's pinned client then navigates", async () => {
    await expect(decideConnection("valid-request", true)).rejects.toThrow("redirect:https://chatgpt.com/connector/oauth/test");
    expect(mocks.approve).toHaveBeenCalledWith("valid-request", { skipBrowserRedirect: true });
    expect(mocks.deny).not.toHaveBeenCalled();
  });
  it("lets the operator cancel without approving access", async () => {
    await expect(decideConnection("valid-request", false)).rejects.toThrow("error=access_denied");
    expect(mocks.deny).toHaveBeenCalledOnce();
    expect(mocks.approve).not.toHaveBeenCalled();
  });
  it("rejects a different client and an unauthenticated caller before approval", async () => {
    mocks.details.mockResolvedValue({ data: { client: { id: "other-client" } }, error: null });
    await expect(decideConnection("valid-request", true)).rejects.toThrow("not allowed");
    mocks.requireOperator.mockRejectedValue(new Error("operator_required"));
    await expect(decideConnection("valid-request", true)).rejects.toThrow("operator_required");
    expect(mocks.approve).not.toHaveBeenCalled();
  });
  it("does not approve expired or malformed requests", async () => {
    mocks.details.mockResolvedValue({ data: null, error: { message: "expired" } });
    await expect(decideConnection("valid-request", true)).rejects.toThrow("expired");
    await expect(decideConnection("//untrusted.invalid", true)).rejects.toThrow("unavailable");
    expect(mocks.approve).not.toHaveBeenCalled();
  });
  it("reuses an existing consent without creating another grant", async () => {
    mocks.details.mockResolvedValue({ data: { redirect_url: "https://chatgpt.com/connector/oauth/test" }, error: null });
    await expect(decideConnection("valid-request", true)).rejects.toThrow("redirect:");
    expect(mocks.approve).not.toHaveBeenCalled();
  });
});

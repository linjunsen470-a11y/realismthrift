import { beforeAll, afterAll, describe, expect, it, vi } from "vitest";
import { exportJWK, generateKeyPair, SignJWT } from "jose";
import { verifyMcpToken } from "./auth";

let key: CryptoKey;
beforeAll(async () => {
  vi.stubEnv("SUPABASE_URL", "https://auth.example.invalid");
  vi.stubEnv("OUTREACH_OPERATOR_USER_ID", "operator-id");
  vi.stubEnv("OUTREACH_OAUTH_CLIENT_ID", "approved-client");
  vi.stubEnv("OUTREACH_SITE_ORIGIN", "https://www.realismthrift.com");
  const pair = await generateKeyPair("ES256"); key = pair.privateKey;
  const jwk = await exportJWK(pair.publicKey);
  vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ keys: [{ ...jwk, kid: "test", alg: "ES256", use: "sig" }] }), { headers: { "Content-Type": "application/json" } }));
});
afterAll(() => { vi.restoreAllMocks(); vi.unstubAllEnvs(); });
async function token(overrides: Record<string, unknown> = {}) {
  return new SignJWT({ client_id: "approved-client", ...overrides })
    .setProtectedHeader({ alg: "ES256", kid: "test" }).setSubject("operator-id")
    .setIssuer("https://auth.example.invalid/auth/v1").setAudience("authenticated")
    .setIssuedAt().setExpirationTime("1h").sign(key);
}
describe("private MCP authentication", () => {
  it("accepts a signed Supabase OAuth token for the pinned operator and client", async () => {
    expect(await verifyMcpToken(new Request("https://www.realismthrift.com/api/mcp"), await token())).toMatchObject({ clientId: "approved-client", extra: { userId: "operator-id" } });
  });
  it("rejects a different OAuth client", async () => {
    expect(await verifyMcpToken(new Request("https://www.realismthrift.com/api/mcp"), await token({ client_id: "other-client" }))).toBeUndefined();
  });
  it("rejects a regular Supabase session without an OAuth client claim", async () => {
    expect(await verifyMcpToken(new Request("https://www.realismthrift.com/api/mcp"), await token({ client_id: undefined }))).toBeUndefined();
  });
  it("rejects another operator even with the approved OAuth client", async () => {
    const other = await new SignJWT({ client_id: "approved-client" }).setProtectedHeader({ alg: "ES256", kid: "test" }).setSubject("other-user").setIssuer("https://auth.example.invalid/auth/v1").setAudience("authenticated").setIssuedAt().setExpirationTime("1h").sign(key);
    expect(await verifyMcpToken(new Request("https://www.realismthrift.com/api/mcp"), other)).toBeUndefined();
  });
  it("rejects unsigned or absent tokens", async () => {
    expect(await verifyMcpToken(new Request("https://www.realismthrift.com/api/mcp"), "fake.token.value")).toBeUndefined();
    expect(await verifyMcpToken(new Request("https://www.realismthrift.com/api/mcp"))).toBeUndefined();
  });
  it("rejects a valid token issued for a different resource", async () => {
    const other = await new SignJWT({ client_id: "approved-client" }).setProtectedHeader({ alg: "ES256", kid: "test" }).setSubject("operator-id").setIssuer("https://auth.example.invalid/auth/v1").setAudience("other-resource").setIssuedAt().setExpirationTime("1h").sign(key);
    expect(await verifyMcpToken(new Request("https://www.realismthrift.com/api/mcp"), other)).toBeUndefined();
  });
});

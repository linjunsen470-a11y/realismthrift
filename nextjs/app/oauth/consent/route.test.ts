import { afterEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";

afterEach(() => vi.unstubAllEnvs());

describe("Supabase consent entrypoint", () => {
  it("preserves the authorization ID and redirects only to the configured operator page", () => {
    vi.stubEnv("OUTREACH_SITE_ORIGIN", "https://www.realismthrift.com");
    const response = GET(new Request("https://internal.invalid/oauth/consent?authorization_id=valid-id_123&redirect_uri=https://untrusted.invalid"));
    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe("https://www.realismthrift.com/outreach/authorize?authorization_id=valid-id_123");
    expect(response.headers.get("cache-control")).toBe("no-store");
  });
  it("rejects a missing or malformed authorization ID before redirecting", () => {
    for (const query of ["", "?authorization_id=%2F%2Foutside.invalid", `?authorization_id=${"a".repeat(201)}`]) {
      const response = GET(new Request(`https://www.realismthrift.com/oauth/consent${query}`));
      expect(response.status).toBe(400);
      expect(response.headers.has("location")).toBe(false);
    }
  });
});

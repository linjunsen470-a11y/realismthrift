import { afterEach, describe, expect, it, vi } from "vitest";
import { createSupabaseAuthRetryFetch } from "./supabase-fetch";

function authRejection() {
  return Response.json({ code: "PGRST303", message: "JWT issued at future" }, { status: 401 });
}

const serviceRoleFallback = {
  origin: "https://supabase.example",
  secretKey: "sb_secret_test_only",
  serviceRoleKey: "test.service-role.jwt",
};
const adminHeaders = { apikey: serviceRoleFallback.secretKey, authorization: `Bearer ${serviceRoleFallback.secretKey}` };

afterEach(() => vi.restoreAllMocks());

describe("Supabase authentication recovery", () => {
  it.each(["POST", "PATCH"])("replays a rejected %s with its exact body and headers", async (method) => {
    const seen: { method: string; body: string; authorization: string | null }[] = [];
    const transport = vi.fn(async (input: RequestInfo | URL) => {
      const request = input as Request;
      seen.push({ method: request.method, body: await request.text(), authorization: request.headers.get("authorization") });
      return seen.length === 1 ? authRejection() : Response.json({ ok: true });
    });
    const wait = vi.fn().mockResolvedValue(undefined);
    const warning = vi.spyOn(console, "warn").mockImplementation(() => {});
    const body = JSON.stringify({ submission_key: "stable-id", email: "buyer@example.test" });
    const retryingFetch = createSupabaseAuthRetryFetch(transport as typeof fetch, wait);

    const response = await retryingFetch("https://supabase.example/rest/v1/rpc/create_inquiry_with_email_jobs", {
      method, headers: { authorization: "Bearer secret-sentinel", "content-type": "application/json" }, body,
    });

    expect(response.status).toBe(200);
    expect(seen).toEqual(Array(2).fill({ method, body, authorization: "Bearer secret-sentinel" }));
    expect(wait).toHaveBeenCalledTimes(1);
    expect(warning).toHaveBeenCalledWith("Supabase PostgREST authentication retry", expect.objectContaining({
      reason: "jwt_issued_in_future", outcome: "recovered", retries: 1,
    }));
    expect(JSON.stringify(warning.mock.calls)).not.toContain("secret-sentinel");
    expect(JSON.stringify(warning.mock.calls)).not.toContain("buyer@example.test");
  });

  it("does not expose an unrecognized provider error message in retry logs", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => {});
    const transport = vi.fn()
      .mockResolvedValueOnce(Response.json({ code: "PGRST303", message: "sensitive provider detail" }, { status: 401 }))
      .mockResolvedValueOnce(Response.json({ ok: true }));
    await createSupabaseAuthRetryFetch(transport as typeof fetch, vi.fn().mockResolvedValue(undefined))(
      "https://supabase.example/rest/v1/inquiry_email_jobs",
    );
    expect(warning).toHaveBeenCalledWith("Supabase PostgREST authentication retry", expect.objectContaining({ reason: "other" }));
    expect(JSON.stringify(warning.mock.calls)).not.toContain("sensitive provider detail");
  });

  it("stops after four retries and returns the original provider error", async () => {
    const transport = vi.fn(async () => authRejection());
    const wait = vi.fn().mockResolvedValue(undefined);
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const response = await createSupabaseAuthRetryFetch(transport as typeof fetch, wait)("https://supabase.example/rest/v1/inquiry_email_jobs");
    expect(transport).toHaveBeenCalledTimes(5);
    expect(wait.mock.calls.map((call) => call[0])).toEqual([250, 750, 1500, 2500]);
    expect(response.status).toBe(401);
    expect(await response.json()).toMatchObject({ code: "PGRST303" });
  });

  it("returns to the original credential when the service-role key is explicitly rejected", async () => {
    const attempts: (string | null)[] = [];
    const transport = vi.fn(async (request: Request) => {
      attempts.push(request.headers.get("apikey"));
      if (attempts.length === 2) return Response.json({ message: "Invalid API key" }, { status: 401 });
      return attempts.length < 4 ? authRejection() : Response.json({ ok: true });
    });
    const wait = vi.fn().mockResolvedValue(undefined);
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const retryingFetch = createSupabaseAuthRetryFetch(transport as typeof fetch, wait, serviceRoleFallback);

    const response = await retryingFetch("https://supabase.example/rest/v1/rpc/claim_inquiry_email_jobs", {
      method: "POST", headers: adminHeaders, body: "{}",
    });
    expect(response.status).toBe(200);
    expect(attempts).toEqual(["sb_secret_test_only", "test.service-role.jwt", "sb_secret_test_only", "sb_secret_test_only"]);
    expect(wait.mock.calls.map(([delay]) => delay)).toEqual([250, 750]);
  });

  it("does not replay an ambiguous response to the service-role attempt", async () => {
    const transport = vi.fn()
      .mockResolvedValueOnce(authRejection())
      .mockResolvedValueOnce(new Response(null, { status: 503 }));
    const wait = vi.fn().mockResolvedValue(undefined);
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const retryingFetch = createSupabaseAuthRetryFetch(transport as typeof fetch, wait, serviceRoleFallback);

    const response = await retryingFetch("https://supabase.example/rest/v1/rpc/claim_inquiry_email_jobs", {
      method: "POST", headers: adminHeaders,
    });
    expect(response.status).toBe(503);
    expect(transport).toHaveBeenCalledTimes(2);
    expect(wait).not.toHaveBeenCalled();
  });

  it.each([
    ["another origin", "https://other.example", adminHeaders.authorization],
    ["a different bearer token", serviceRoleFallback.origin, "Bearer user-token"],
  ])("keeps the original credential for %s", async (_case, origin, authorization) => {
    const transport = vi.fn()
      .mockResolvedValueOnce(authRejection())
      .mockResolvedValueOnce(Response.json({ ok: true }));
    const wait = vi.fn().mockResolvedValue(undefined);
    vi.spyOn(console, "warn").mockImplementation(() => {});
    await createSupabaseAuthRetryFetch(transport as typeof fetch, wait, serviceRoleFallback)(
      `${origin}/rest/v1/inquiry_email_jobs`,
      { headers: { ...adminHeaders, authorization } },
    );

    expect(transport.mock.calls.map(([request]) => request.headers.get("apikey"))).toEqual([
      adminHeaders.apikey, adminHeaders.apikey,
    ]);
    expect(wait).toHaveBeenCalledTimes(1);
  });

  it.each([
    ["another 401", () => Response.json({ code: "PGRST301" }, { status: 401 })],
    ["an invalid 401 body", () => new Response("invalid", { status: 401 })],
    ["a 403", () => Response.json({ code: "PGRST303" }, { status: 403 })],
    ["a 500", () => Response.json({ code: "PGRST303" }, { status: 500 })],
  ])("does not retry %s", async (_name, makeResponse) => {
    const transport = vi.fn(async () => makeResponse());
    const wait = vi.fn().mockResolvedValue(undefined);
    const response = await createSupabaseAuthRetryFetch(transport as typeof fetch, wait)("https://supabase.example/rest/v1/inquiry_email_jobs");
    expect(response.status).toBe(makeResponse().status);
    expect(transport).toHaveBeenCalledTimes(1);
    expect(wait).not.toHaveBeenCalled();
  });

  it("does not replay network failures or non-PostgREST endpoints", async () => {
    const network = vi.fn().mockRejectedValue(new TypeError("network unavailable"));
    await expect(createSupabaseAuthRetryFetch(network as typeof fetch)("https://supabase.example/rest/v1/rpc/claim_inquiry_email_jobs", { method: "POST" }))
      .rejects.toThrow("network unavailable");
    expect(network).toHaveBeenCalledTimes(1);

    const otherEndpoint = vi.fn(async () => authRejection());
    const result = await createSupabaseAuthRetryFetch(otherEndpoint as typeof fetch)("https://supabase.example/auth/v1/user");
    expect(result.status).toBe(401);
    expect(otherEndpoint).toHaveBeenCalledTimes(1);
  });

  it("cancels the delay and performs no retry when the caller aborts", async () => {
    const controller = new AbortController();
    const transport = vi.fn(async () => authRejection());
    const result = createSupabaseAuthRetryFetch(transport as typeof fetch)(
      "https://supabase.example/rest/v1/inquiry_email_jobs",
      { signal: controller.signal },
    );
    const rejection = expect(result).rejects.toMatchObject({ name: "AbortError" });
    await vi.waitFor(() => expect(transport).toHaveBeenCalledTimes(1));
    controller.abort();
    await rejection;
    expect(transport).toHaveBeenCalledTimes(1);
  });
});

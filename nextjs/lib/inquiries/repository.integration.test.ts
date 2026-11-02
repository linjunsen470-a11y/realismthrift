import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

function rejectedAuthentication() {
  return Response.json({ code: "PGRST303", message: "JWT issued at future" }, { status: 401 });
}

describe("inquiry repository with the Supabase client", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("SUPABASE_URL", "https://supabase.example.test");
    vi.stubEnv("SUPABASE_SECRET_KEY", "sb_secret_test_only");
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("saves one inquiry after an authentication rejection using the original submission key", async () => {
    const requests: Record<string, unknown>[] = [];
    let saved = 0;
    const transport = vi.fn(async (input: RequestInfo | URL) => {
      const request = input as Request;
      expect(new URL(request.url).pathname).toBe("/rest/v1/rpc/create_inquiry_with_email_jobs");
      requests.push(await request.json() as Record<string, unknown>);
      if (requests.length === 1) return rejectedAuthentication();
      saved += 1;
      return Response.json({ id: "inquiry-1", created: true });
    });
    vi.stubGlobal("fetch", transport);
    const { createInquiry } = await import("./repository");
    const result = createInquiry({
      submissionId: "9f74ef80-02ec-4f5c-9009-dfe01a6bf9d8",
      name: "Buyer", email: "buyer@example.test", whatsapp: "+12025550123", country: "Nigeria",
      product: "Used Brand Clothes", quantity: "20ft", message: "Price list", sourcePath: "/contact-us", website: "",
    }, { salesTo: "team@example.test", salesFrom: "web@example.test", customerFrom: "sales@example.test" });
    await vi.advanceTimersByTimeAsync(1000);
    expect(await result).toEqual({ id: "inquiry-1", created: true });
    expect(saved).toBe(1);
    expect(requests).toHaveLength(2);
    expect(requests[0]).toEqual(requests[1]);
    expect(requests[0].p_submission_key).toBe("9f74ef80-02ec-4f5c-9009-dfe01a6bf9d8");
  });

  it("recovers the email worker's rejected expiry update and claim without duplicating a claim", async () => {
    let pendingAttempts = 0;
    let processingAttempts = 0;
    let claimAttempts = 0;
    let claims = 0;
    const transport = vi.fn(async (input: RequestInfo | URL) => {
      const request = input as Request;
      const url = new URL(request.url);
      if (request.method === "PATCH" && url.pathname === "/rest/v1/inquiry_email_jobs") {
        if (url.searchParams.get("status")?.startsWith("in.")) {
          pendingAttempts += 1;
          return pendingAttempts === 1 ? rejectedAuthentication() : new Response(null, { status: 204 });
        }
        processingAttempts += 1;
        return new Response(null, { status: 204 });
      }
      if (request.method === "POST" && url.pathname === "/rest/v1/rpc/claim_inquiry_email_jobs") {
        claimAttempts += 1;
        if (claimAttempts === 1) return rejectedAuthentication();
        claims += 1;
        return Response.json([{ job_id: "job-1", idempotency_key: "stable-email-key" }]);
      }
      throw new Error("Unexpected test request");
    });
    vi.stubGlobal("fetch", transport);
    const { claimEmailJobs } = await import("./repository");
    const result = claimEmailJobs("inquiry-1", 2);
    await vi.advanceTimersByTimeAsync(2000);
    expect(await result).toEqual([{ job_id: "job-1", idempotency_key: "stable-email-key" }]);
    expect({ pendingAttempts, processingAttempts, claimAttempts, claims }).toEqual({
      pendingAttempts: 2, processingAttempts: 1, claimAttempts: 2, claims: 1,
    });
  });
});

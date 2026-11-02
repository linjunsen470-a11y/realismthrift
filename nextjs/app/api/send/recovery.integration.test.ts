import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  after: vi.fn(),
  sendEmail: vi.fn(),
  sendMeta: vi.fn(),
  startMetaLog: vi.fn(),
  finishMetaLog: vi.fn(),
  skipMetaLog: vi.fn(),
}));

vi.mock("next/server", async (importOriginal) => ({
  ...await importOriginal<typeof import("next/server")>(),
  after: mocks.after,
}));
vi.mock("resend", () => ({
  Resend: class { emails = { send: mocks.sendEmail }; },
}));
vi.mock("@/lib/meta-capi", async (importOriginal) => ({
  ...await importOriginal<typeof import("@/lib/meta-capi")>(),
  sendMetaCapiLead: mocks.sendMeta,
}));
vi.mock("@/lib/meta-capi-log", () => ({
  startMetaCapiLog: mocks.startMetaLog,
  finishMetaCapiLog: mocks.finishMetaLog,
  recordMetaCapiSkip: mocks.skipMetaLog,
}));

const submissionId = "9f74ef80-02ec-4f5c-9009-dfe01a6bf9d8";
const job = {
  job_id: "job-1", inquiry_id: "inquiry-1", kind: "sales_notification", attempt_count: 1,
  from_email: "web@example.test", to_email: "team@example.test", reply_to_email: "buyer@example.test",
  subject: "Inquiry", template_version: "v1", idempotency_key: "stable-email-key",
  name: "Buyer", email: "buyer@example.test", whatsapp: "+12025550123", country: "Nigeria",
  product: "Used Brand Clothes", quantity: "20ft", message: "Price list", source_path: "/contact-us",
  inquiry_created_at: "2026-11-01T00:00:00.000Z",
};

function rejectedAuthentication() {
  return Response.json({ code: "PGRST303", message: "JWT issued at future" }, { status: 401 });
}

describe("inquiry and email recovery without external services", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("SUPABASE_URL", "https://supabase.example.test");
    vi.stubEnv("SUPABASE_SECRET_KEY", "sb_secret_test_only");
    vi.stubEnv("RESEND_API_KEY", "re_test_only");
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.useFakeTimers();
    vi.clearAllMocks();
    mocks.sendEmail.mockResolvedValue({ data: { id: "resend-1" }, error: null });
    mocks.sendMeta.mockResolvedValue({ status: "skipped", reason: "disabled" });
    mocks.startMetaLog.mockResolvedValue(true);
    mocks.finishMetaLog.mockResolvedValue(true);
    mocks.skipMetaLog.mockResolvedValue(true);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("saves once and sends one email after simulated authentication rejections", async () => {
    let createAttempts = 0;
    let saves = 0;
    let expiryAttempts = 0;
    let claimAttempts = 0;
    let claims = 0;
    let acceptedUpdates = 0;
    const submittedKeys: unknown[] = [];
    const transport = vi.fn(async (input: RequestInfo | URL) => {
      const request = input as Request;
      const url = new URL(request.url);
      if (url.origin !== "https://supabase.example.test") throw new Error("Unexpected external request");
      if (url.pathname === "/rest/v1/rpc/create_inquiry_with_email_jobs") {
        createAttempts += 1;
        submittedKeys.push((await request.json() as Record<string, unknown>).p_submission_key);
        if (createAttempts === 1) return rejectedAuthentication();
        saves += 1;
        return Response.json({ id: "inquiry-1", created: true });
      }
      if (url.pathname === "/rest/v1/inquiry_email_jobs" && request.method === "PATCH") {
        if (url.searchParams.has("id")) {
          acceptedUpdates += 1;
          return Response.json({ id: "job-1" });
        }
        expiryAttempts += 1;
        return expiryAttempts === 1 ? rejectedAuthentication() : new Response(null, { status: 204 });
      }
      if (url.pathname === "/rest/v1/rpc/claim_inquiry_email_jobs") {
        claimAttempts += 1;
        if (claimAttempts === 1) return rejectedAuthentication();
        claims += 1;
        return Response.json([job]);
      }
      if (url.pathname === "/rest/v1/rpc/apply_resend_email_state") {
        return new Response(null, { status: 204 });
      }
      throw new Error("Unexpected test request");
    });
    vi.stubGlobal("fetch", transport);
    const { POST } = await import("./route");
    const request = new Request("https://www.realismthrift.com/api/send", {
      method: "POST",
      headers: { "content-type": "application/json", origin: "https://www.realismthrift.com", "x-forwarded-for": "198.51.100.5" },
      body: JSON.stringify({
        submissionId, name: "Buyer", email: "buyer@example.test", whatsapp: "+12025550123",
        country: "Nigeria", product: "Used Brand Clothes", quantity: "20ft", message: "Price list",
        sourcePath: "/contact-us", website: "",
      }),
    });

    const responsePromise = POST(request);
    await vi.advanceTimersByTimeAsync(1000);
    const response = await responsePromise;
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ ok: true, event_id: submissionId });
    expect({ createAttempts, saves, submittedKeys }).toEqual({ createAttempts: 2, saves: 1, submittedKeys: [submissionId, submissionId] });
    expect(mocks.sendEmail).not.toHaveBeenCalled();

    const background = mocks.after.mock.calls[0][0]();
    await vi.advanceTimersByTimeAsync(2000);
    await background;
    expect({ expiryAttempts, claimAttempts, claims, acceptedUpdates }).toEqual({
      expiryAttempts: 3, claimAttempts: 2, claims: 1, acceptedUpdates: 1,
    });
    expect(mocks.sendEmail).toHaveBeenCalledTimes(1);
    expect(mocks.sendEmail.mock.calls[0][1]).toEqual({ idempotencyKey: "stable-email-key" });
    expect(mocks.sendMeta).toHaveBeenCalledTimes(1);
  });

  it("does not report success or start email and advertising work if authentication keeps failing", async () => {
    const transport = vi.fn(async (input: RequestInfo | URL) => {
      const request = input as Request;
      if (new URL(request.url).origin !== "https://supabase.example.test") throw new Error("Unexpected external request");
      return rejectedAuthentication();
    });
    vi.stubGlobal("fetch", transport);
    const { POST } = await import("./route");
    const request = new Request("https://www.realismthrift.com/api/send", {
      method: "POST",
      headers: { "content-type": "application/json", origin: "https://www.realismthrift.com", "x-forwarded-for": "198.51.100.6" },
      body: JSON.stringify({
        submissionId, name: "Buyer", email: "buyer@example.test", whatsapp: "+12025550123",
        country: "Nigeria", product: "Used Brand Clothes", quantity: "20ft", message: "Price list",
        sourcePath: "/contact-us", website: "",
      }),
    });

    const responsePromise = POST(request);
    await vi.advanceTimersByTimeAsync(6000);
    const response = await responsePromise;
    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({ ok: false, code: "storage_failed" });
    expect(transport).toHaveBeenCalledTimes(5);
    expect(mocks.after).not.toHaveBeenCalled();
    expect(mocks.sendEmail).not.toHaveBeenCalled();
    expect(mocks.sendMeta).not.toHaveBeenCalled();
  });
});

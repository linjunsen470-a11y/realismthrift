import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildMetaCapiLogRow, finishMetaCapiLog, META_CAPI_LOG_BUDGET_MS, recordMetaCapiSkip, startMetaCapiLog } from "./meta-capi-log";
import type { MetaCapiLeadResult } from "./meta-capi";

const mocks = vi.hoisted(() => ({ admin: vi.fn(), from: vi.fn(), insert: vi.fn(), upsert: vi.fn(), abortSignal: vi.fn() }));
vi.mock("@/lib/inquiries/clients", () => ({ getSupabaseAdmin: mocks.admin }));
const context = {
  id: "ae5cda02-e692-4324-b61b-fb7856a508b5",
  inquiryId: "597cdb98-5d1e-4cc8-b87d-575d706fe573",
  eventId: "6f1e2c3a-4b5d-4e6f-8a7b-9c0d1e2f3a4b",
  startedAt: "2026-10-19T01:00:00.000Z",
};
const sent = (): MetaCapiLeadResult => ({
  status: "sent",
  diagnostics: {
    pixel_id: "1661409812003549", graph_api_version: "v21.0", event_time_seconds: 1_700_000_000,
    has_email_hash: true, has_phone_hash: false, has_fbp: true, has_fbc: false, duration_ms: 200,
    attempts: [{
      attempt_no: 1, started_at: context.startedAt, duration_ms: 199, status: "sent",
      http_status: 200, events_received: 1, error_name: null, meta_error_code: null, trace_id: "safe_trace",
      response_parse_status: "json", retryable: false,
    }],
  },
});
const secrets = ["buyer@example.com", "+16505551212", "fake-token-sentinel", "fake-db-secret-sentinel", "203.0.113.77", "private-agent", "fb.1.1700000000000.1234", "a".repeat(64)];
let errorSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  vi.clearAllMocks();
  errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  mocks.admin.mockReset().mockImplementation(() => ({ from: mocks.from }));
  mocks.from.mockReturnValue({ insert: mocks.insert, upsert: mocks.upsert });
  mocks.insert.mockReturnValue({ abortSignal: mocks.abortSignal });
  mocks.upsert.mockReturnValue({ abortSignal: mocks.abortSignal });
  mocks.abortSignal.mockReset().mockResolvedValue({ error: null });
});
afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("Meta CAPI log persistence", () => {
  it("starts and finishes the same log, preserving inquiry/event linkage and actual diagnostics", async () => {
    expect(await startMetaCapiLog(context)).toBe(true);
    expect(mocks.from).toHaveBeenCalledWith("meta_capi_delivery_logs");
    expect(mocks.insert).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({
      id: context.id, inquiry_id: context.inquiryId, event_id: context.eventId,
      status: "started", completed_at: null, attempt_count: null, attempts: [],
    }));
    expect(await finishMetaCapiLog(context, sent())).toBe(true);
    expect(mocks.upsert).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({
      id: context.id, inquiry_id: context.inquiryId, event_id: context.eventId, started_at: context.startedAt,
      status: "sent", attempt_count: 1, http_status: 200, events_received: 1, trace_id: "safe_trace",
      completed_at: expect.any(String), has_email_hash: true, has_phone_hash: false,
      duration_ms: 200, event_time_seconds: 1_700_000_000,
    }), { onConflict: "id" });
    expect(mocks.abortSignal.mock.calls[0][0]).toBeInstanceOf(AbortSignal);
  });

  it("repairs a resolved start error with a complete terminal row and never reverts to started", async () => {
    mocks.abortSignal.mockResolvedValueOnce({ error: { code: "42P01", message: secrets.join(" "), details: secrets } });
    expect(await startMetaCapiLog(context)).toBe(false);
    expect(await finishMetaCapiLog(context, sent())).toBe(true);
    expect(mocks.upsert.mock.calls[0]).toEqual([expect.objectContaining({ id: context.id, status: "sent", started_at: context.startedAt }), { onConflict: "id" }]);
    expect(errorSpy).toHaveBeenCalledWith("Meta CAPI log storage failed", { storageOperation: "start", errorName: "ProviderError", providerCode: "42P01" });
    for (const secret of secrets) expect(JSON.stringify(errorSpy.mock.calls)).not.toContain(secret);
  });

  it.each(["start", "finish", "skip"])("isolates resolved Supabase errors for %s", async operation => {
    mocks.abortSignal.mockResolvedValue({ error: { code: secrets[0], message: secrets.join(" ") } });
    const result = operation === "start" ? await startMetaCapiLog(context)
      : operation === "finish" ? await finishMetaCapiLog(context, sent()) : await recordMetaCapiSkip(context, "duplicate_submission");
    expect(result).toBe(false);
    expect(errorSpy.mock.calls[0][1]).toMatchObject({ providerCode: null });
    for (const secret of secrets) expect(JSON.stringify(errorSpy.mock.calls)).not.toContain(secret);
  });

  it.each(["client", "query", "rejection"])("isolates thrown %s errors without logging their contents", async where => {
    const error = Object.assign(new Error(secrets.join(" ")), { name: secrets[0] });
    if (where === "client") mocks.admin.mockImplementation(() => { throw error; });
    if (where === "query") mocks.insert.mockImplementationOnce(() => { throw error; });
    if (where === "rejection") mocks.abortSignal.mockRejectedValueOnce(error);
    expect(await startMetaCapiLog(context)).toBe(false);
    for (const secret of secrets) expect(JSON.stringify(errorSpy.mock.calls)).not.toContain(secret);
  });

  it.each(["start", "finish", "skip"])("aborts %s and returns within one budget even if transport ignores cancellation", async operation => {
    vi.useFakeTimers();
    let rejectLate!: (reason: unknown) => void;
    mocks.abortSignal.mockImplementation(() => new Promise((_resolve, reject) => { rejectLate = reject; }));
    const work = operation === "start" ? startMetaCapiLog(context)
      : operation === "finish" ? finishMetaCapiLog(context, sent()) : recordMetaCapiSkip(context, "duplicate_submission");
    const signal = mocks.abortSignal.mock.calls[0][0] as AbortSignal;
    await vi.advanceTimersByTimeAsync(META_CAPI_LOG_BUDGET_MS - 1);
    expect(signal.aborted).toBe(false);
    await vi.advanceTimersByTimeAsync(1);
    expect(await work).toBe(false);
    expect(signal.aborted).toBe(true);
    rejectLate(new Error(secrets.join(" ")));
    await Promise.resolve(); // Late rejection is consumed by the race, never unhandled.
    expect(mocks.insert.mock.calls.length + mocks.upsert.mock.calls.length).toBe(1);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("does not leak a timed-out late start over a successful terminal upsert", async () => {
    vi.useFakeTimers();
    let resolveStart!: (value: { error: null }) => void;
    mocks.abortSignal.mockImplementationOnce(() => new Promise(resolve => { resolveStart = resolve; }));
    const start = startMetaCapiLog(context);
    await vi.advanceTimersByTimeAsync(META_CAPI_LOG_BUDGET_MS);
    expect(await start).toBe(false);
    expect(await finishMetaCapiLog(context, sent())).toBe(true);
    resolveStart({ error: null });
    await Promise.resolve();
    expect(mocks.insert.mock.calls[0][0].status).toBe("started");
    expect(mocks.upsert.mock.calls[0][0].status).toBe("sent");
    expect(mocks.upsert).toHaveBeenCalledTimes(1);
  });

  it("records duplicate decisions as separate skipped rows without resolving event metadata", async () => {
    await recordMetaCapiSkip(context, "duplicate_submission");
    await recordMetaCapiSkip({ ...context, id: "5e88584b-679b-4c46-ae0b-5c9c571e2a5e" }, "duplicate_submission");
    const rows = mocks.insert.mock.calls.map(call => call[0]);
    expect(rows[0]).toMatchObject({ status: "skipped", skip_reason: "duplicate_submission", attempt_count: 0, attempts: [], pixel_id: null,
      event_time_seconds: null, has_email_hash: null, has_phone_hash: null, has_fbp: null, has_fbc: null });
    expect(rows[0].id).not.toBe(rows[1].id);
    expect(rows[0].event_id).toBe(rows[1].event_id);
    expect(mocks.upsert).not.toHaveBeenCalled();
  });
});

describe("safe log row construction", () => {
  it("writes only allowlisted fields even when every layer contains extra PII, hashes, tokens and raw objects", async () => {
    const extra = { email: secrets[0], phone: secrets[1], access_token: secrets[2], key: secrets[3], ip: secrets[4],
      userAgent: secrets[5], cookie: secrets[6], emailHash: secrets[7], raw_response: secrets, message: secrets };
    const original = sent();
    // Deliberately cross the runtime trust boundary with an invalid provider object.
    const tainted = { ...original, ...extra, diagnostics: { ...original.diagnostics, ...extra,
      attempts: [{ ...original.diagnostics.attempts[0], ...extra, attempt_no: secrets[0], error_name: secrets[0] }],
    } } as unknown as MetaCapiLeadResult;
    const row = buildMetaCapiLogRow({ ...context, ...extra }, tainted);
    await finishMetaCapiLog(context, tainted);
    for (const secret of secrets) {
      expect(JSON.stringify(row)).not.toContain(secret);
      expect(JSON.stringify(mocks.upsert.mock.calls)).not.toContain(secret);
    }
    expect(row.attempts[0].attempt_no).toBe(1);
    expect(Buffer.byteLength(JSON.stringify(row.attempts))).toBeLessThan(16_384);
  });

  it("maps unexpected sender exceptions to unknown attempts, never zero attempts", async () => {
    await finishMetaCapiLog(context, null, 55);
    expect(mocks.upsert.mock.calls[0][0]).toMatchObject({ status: "failed", error_name: "UnknownError", attempt_count: null, attempts: [], duration_ms: 55 });
  });

  it.each(["disabled", "missing_token", "missing_pixel", "invalid_event_id"] as const)("keeps skip reason %s", async reason => {
    await recordMetaCapiSkip(context, reason);
    expect(mocks.insert.mock.calls[0][0]).toMatchObject({ status: "skipped", skip_reason: reason, attempt_count: 0, attempts: [] });
  });

  it("preserves a zero count and the final response while retaining both attempts", () => {
    const result = sent();
    const first = { ...result.diagnostics.attempts[0], status: "failed" as const, http_status: 503, events_received: 0, error_name: "HttpError" as const, retryable: true };
    result.diagnostics.attempts.unshift(first);
    const row = buildMetaCapiLogRow(context, result);
    expect(row).toMatchObject({ status: "sent", attempt_count: 2, http_status: 200, events_received: 1 });
    expect(row.attempts[0].events_received).toBe(0);
    const failed = { ...result, status: "failed" as const, errorName: "HttpError" as const, diagnostics: { ...result.diagnostics, attempts: [first] } };
    expect(buildMetaCapiLogRow(context, failed)).toMatchObject({ status: "failed", attempt_count: 1, events_received: 0 });
  });

  it("discards invalid numbers, trace text and oversized arrays rather than persisting arbitrary data", () => {
    const result = sent();
    result.diagnostics.pixel_id = "9".repeat(33);
    result.diagnostics.attempts[0].trace_id = "x".repeat(101);
    result.diagnostics.attempts[0].meta_error_code = Number.MAX_SAFE_INTEGER;
    expect(buildMetaCapiLogRow(context, result)).toMatchObject({ pixel_id: null, meta_error_code: null, trace_id: null });
    result.diagnostics.attempts = Array(3).fill(result.diagnostics.attempts[0]);
    expect(buildMetaCapiLogRow(context, result)).toMatchObject({ status: "failed", attempt_count: null, attempts: [], error_name: "UnknownError" });
  });

  it("rejects invalid identifiers and timestamps safely before invoking storage", async () => {
    for (const invalid of [{ ...context, id: secrets[0] }, { ...context, startedAt: secrets[2] }]) {
      expect(await startMetaCapiLog(invalid)).toBe(false);
    }
    expect(mocks.from).not.toHaveBeenCalled();
    for (const secret of secrets) expect(JSON.stringify(errorSpy.mock.calls)).not.toContain(secret);
  });
});

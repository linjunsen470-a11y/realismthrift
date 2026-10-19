/** Server-only, best-effort storage of allowlisted CAPI diagnostics. */
import { getSupabaseAdmin } from "@/lib/inquiries/clients";
import {
  META_GRAPH_API_VERSION, metaCapiInteger, metaCapiTraceId,
  type MetaCapiAttempt, type MetaCapiErrorName, type MetaCapiLeadResult, type MetaCapiSkipReason,
} from "@/lib/meta-capi";

export const META_CAPI_LOG_BUDGET_MS = 1500;
const TABLE = "meta_capi_delivery_logs";
type SkipReason = MetaCapiSkipReason | "duplicate_submission";
type LogResult = MetaCapiLeadResult | { status: "skipped"; reason: SkipReason };
export type MetaCapiLogContext = { id: string; inquiryId: string; eventId: string; startedAt: string };

const ERROR_NAMES: readonly string[] = ["HttpError", "InvalidResponse", "TypeError", "AbortError", "TimeoutError", "UnknownError"];
const SKIP_REASONS: readonly string[] = ["disabled", "missing_token", "missing_pixel", "invalid_event_id", "duplicate_submission"];
function errorName(value: unknown): MetaCapiErrorName {
  return ERROR_NAMES.includes(value as string) ? value as MetaCapiErrorName : "UnknownError";
}
function record(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object" ? value as Record<string, unknown> : {};
}
function boolean(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null;
}
function timestamp(value: unknown): string {
  if (typeof value !== "string" || value.length !== 24 || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value) || !Number.isFinite(Date.parse(value))) {
    throw new Error("InvalidLogTimestamp");
  }
  return value;
}
function uuid(value: unknown): string {
  if (typeof value !== "string" || value.length !== 36 || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) {
    throw new Error("InvalidLogId");
  }
  return value;
}

function safeAttempt(value: unknown, index: number): MetaCapiAttempt {
  const a = record(value);
  const parse = a.response_parse_status;
  return {
    attempt_no: index + 1,
    started_at: timestamp(a.started_at),
    duration_ms: metaCapiInteger(a.duration_ms) ?? 0,
    status: a.status === "sent" ? "sent" : "failed",
    http_status: metaCapiInteger(a.http_status, 100, 599),
    events_received: metaCapiInteger(a.events_received),
    error_name: a.status === "sent" ? null : errorName(a.error_name),
    meta_error_code: metaCapiInteger(a.meta_error_code, -2_147_483_648),
    trace_id: metaCapiTraceId(a.trace_id),
    response_parse_status: parse === "json" || parse === "invalid_json" || parse === "body_error" ? parse : "no_response",
    retryable: a.retryable === true,
  };
}

/** Reconstruct every field; never spread a caller, inquiry, error, or provider object. */
export function buildMetaCapiLogRow(
  context: MetaCapiLogContext,
  result?: LogResult | null,
  unknownDurationMs?: number,
) {
  const outcome = record(result);
  const diagnostic = record(outcome.diagnostics);
  const isStarted = result === undefined;
  const isSkipped = outcome.status === "skipped" && SKIP_REASONS.includes(outcome.reason as string);
  const knownAttempts = !isStarted && !isSkipped && Array.isArray(diagnostic.attempts) && diagnostic.attempts.length <= 2;
  const attempts = knownAttempts ? (diagnostic.attempts as unknown[]).map(safeAttempt) : [];
  if (Buffer.byteLength(JSON.stringify(attempts), "utf8") > 16_384) throw new Error("LogTooLarge");
  const last = attempts.at(-1);
  const lastResponse = [...attempts].reverse().find(a => a.http_status !== null);
  const isSent = outcome.status === "sent" && last?.status === "sent" && last.events_received === 1
    && last.http_status !== null && last.http_status >= 200 && last.http_status <= 299;
  const status = isStarted ? "started" : isSkipped ? "skipped" : isSent ? "sent" : "failed";
  const constructedEvent = !isStarted && !isSkipped;
  const pixel = diagnostic.pixel_id;
  const now = new Date().toISOString();
  return {
    id: uuid(context.id),
    inquiry_id: uuid(context.inquiryId),
    event_id: uuid(context.eventId),
    pixel_id: typeof pixel === "string" && pixel.length >= 1 && pixel.length <= 32 && !/[^0-9]/.test(pixel) ? pixel : null,
    event_name: "Lead",
    graph_api_version: META_GRAPH_API_VERSION,
    event_time_seconds: constructedEvent ? metaCapiInteger(diagnostic.event_time_seconds, 0, Number.MAX_SAFE_INTEGER) : null,
    status,
    skip_reason: isSkipped ? outcome.reason as SkipReason : null,
    attempt_count: isStarted ? null : isSkipped ? 0 : knownAttempts ? attempts.length : null,
    attempts,
    http_status: lastResponse?.http_status ?? null,
    events_received: lastResponse?.events_received ?? null,
    error_name: status === "failed" ? errorName(outcome.errorName) : null,
    meta_error_code: lastResponse?.meta_error_code ?? null,
    trace_id: lastResponse?.trace_id ?? null,
    has_email_hash: constructedEvent ? boolean(diagnostic.has_email_hash) : null,
    has_phone_hash: constructedEvent ? boolean(diagnostic.has_phone_hash) : null,
    has_fbp: constructedEvent ? boolean(diagnostic.has_fbp) : null,
    has_fbc: constructedEvent ? boolean(diagnostic.has_fbc) : null,
    started_at: timestamp(context.startedAt),
    completed_at: isStarted ? null : now,
    duration_ms: isStarted ? null : isSkipped ? metaCapiInteger(diagnostic.duration_ms) ?? 0
      : metaCapiInteger(diagnostic.duration_ms) ?? metaCapiInteger(unknownDurationMs),
    updated_at: now,
  };
}

function reportStorageFailure(operation: "start" | "finish" | "skip", category: string, error?: unknown) {
  const code = record(error).code;
  console.error("Meta CAPI log storage failed", {
    storageOperation: operation,
    errorName: category,
    providerCode: typeof code === "string" && /^(?:[0-9A-Z]{5}|PGRST[0-9]{3})$/.test(code) ? code : null,
  });
}

async function writeLog(
  operation: "start" | "finish" | "skip",
  context: MetaCapiLogContext,
  result?: LogResult | null,
  unknownDurationMs?: number,
): Promise<boolean> {
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const row = buildMetaCapiLogRow(context, result, unknownDurationMs);
    const table = getSupabaseAdmin().from(TABLE);
    // INSERT cannot overwrite a terminal row if an aborted start arrives late.
    // Full-row terminal upsert also repairs a failed start, using only this log id.
    const query = (operation === "finish" ? table.upsert(row, { onConflict: "id" }) : table.insert(row))
      .abortSignal(controller.signal);
    const deadline = new Promise<null>(resolve => {
      timer = setTimeout(() => {
        controller.abort();
        resolve(null);
      }, META_CAPI_LOG_BUDGET_MS);
    });
    // The signal cancels real I/O; the race also bounds a transport that fails to settle on abort.
    const response = await Promise.race([Promise.resolve(query), deadline]);
    if (controller.signal.aborted || response === null) {
      reportStorageFailure(operation, "TimeoutError");
      return false;
    }
    if (response.error) {
      reportStorageFailure(operation, "ProviderError", response.error);
      return false;
    }
    return true;
  } catch {
    reportStorageFailure(operation, "UnknownError");
    return false;
  } finally {
    if (timer !== undefined) clearTimeout(timer);
  }
}

export function startMetaCapiLog(context: MetaCapiLogContext) {
  return writeLog("start", context);
}

export function finishMetaCapiLog(context: MetaCapiLogContext, result: MetaCapiLeadResult | null, unknownDurationMs?: number) {
  return writeLog("finish", context, result, unknownDurationMs);
}

export function recordMetaCapiSkip(context: MetaCapiLogContext, reason: SkipReason) {
  // Duplicate decisions never construct an event or resolve matching fields.
  return writeLog("skip", context, { status: "skipped", reason });
}

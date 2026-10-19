import { createHash } from "node:crypto";
import { parsePhoneNumberFromString } from "libphonenumber-js/max";
import { isMetaEventId, isMetaMeasurementEnabled, metaLeadParams, resolveFacebookPixelId } from "./meta-pixel";

/**
 * Server-only Meta Conversions API Lead.
 * Do not import this module from client components.
 * Accepts normalized SHA-256 email/phone hashes, never plaintext inquiry contact fields.
 * Never log the access token, the request body, IP addresses, or user agents.
 */

export const META_GRAPH_API_VERSION = "v21.0";
const DEFAULT_CAPI_TIMEOUT_MS = 4_000;

export type MetaCapiLeadInput = {
  eventId: string;
  productInterest?: string;
  eventSourceUrl?: string;
  clientIpAddress?: string;
  clientUserAgent?: string;
  eventTimeSeconds?: number;
  fbp?: string;
  fbc?: string;
  emailHash?: string;
  phoneHash?: string;
};

export type MetaCapiUserData = {
  client_ip_address?: string;
  client_user_agent?: string;
  fbp?: string;
  fbc?: string;
  em?: string[];
  ph?: string[];
};

export type MetaCapiLeadEvent = {
  event_name: "Lead";
  event_time: number;
  event_id: string;
  action_source: "website";
  event_source_url?: string;
  user_data: MetaCapiUserData;
  custom_data: ReturnType<typeof metaLeadParams>;
};

export type MetaCapiErrorName = "HttpError" | "InvalidResponse" | "TypeError" | "AbortError" | "TimeoutError" | "UnknownError";
export type MetaCapiSkipReason = "disabled" | "missing_token" | "missing_pixel" | "invalid_event_id";

export type MetaCapiAttempt = {
  attempt_no: number;
  started_at: string;
  duration_ms: number;
  status: "sent" | "failed";
  http_status: number | null;
  events_received: number | null;
  error_name: MetaCapiErrorName | null;
  meta_error_code: number | null;
  trace_id: string | null;
  response_parse_status: "json" | "invalid_json" | "body_error" | "no_response";
  retryable: boolean;
};

export type MetaCapiDiagnostics = {
  pixel_id: string | null;
  graph_api_version: typeof META_GRAPH_API_VERSION;
  event_time_seconds: number | null;
  has_email_hash: boolean | null;
  has_phone_hash: boolean | null;
  has_fbp: boolean | null;
  has_fbc: boolean | null;
  duration_ms: number;
  attempts: MetaCapiAttempt[];
};

type MetaCapiOutcome =
  | { status: "sent" }
  | { status: "skipped"; reason: MetaCapiSkipReason }
  | { status: "failed"; errorName: MetaCapiErrorName; httpStatus?: number; errorCode?: number; traceId?: string };

export type MetaCapiLeadResult = MetaCapiOutcome & { diagnostics: MetaCapiDiagnostics };

/** Only bounded numeric codes/counts and opaque trace identifiers may leave the transport. */
export function metaCapiInteger(value: unknown, minimum = 0, maximum = 2_147_483_647): number | null {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= minimum && value <= maximum ? value : null;
}

export function metaCapiTraceId(value: unknown): string | null {
  return typeof value === "string" && value.length >= 1 && value.length <= 100 && !/[^A-Za-z0-9_-]/.test(value) ? value : null;
}

export type MetaCapiLeadOptions = {
  /** Pass "" to skip. Omit to read the server env var. Never log this value. */
  accessToken?: string;
  /** Passed through resolveFacebookPixelId. Omit to read NEXT_PUBLIC_FB_PIXEL_ID. */
  pixelId?: string | null;
  fetchImpl?: typeof fetch;
  now?: () => Date;
  /** Total budget including both attempts and backoff. */
  timeoutMs?: number;
};

/** Server-side only. Call after the inquiry email has been validated and stored. */
export function hashMetaEmail(email: string): string {
  return createHash("sha256").update(email.trim().toLowerCase(), "utf8").digest("hex");
}

/** Optional matching only: never infer a country or block an inquiry on an invalid number. */
export function hashMetaPhone(value: string): string | undefined {
  const input = value.trim();
  // Permit formatting, but reject text, extensions, and multiple-number separators before parsing.
  if (input.length > 64 || !/^(?:\+|00)[0-9\s().-]+$/.test(input)) return undefined;
  try {
    const international = input.startsWith("00") ? `+${input.slice(2)}` : input;
    const phone = parsePhoneNumberFromString(international, { extract: false });
    if (!phone?.isValid() || phone.ext) return undefined;
    // Keep significant national zeros (e.g. Italy); remove only the E.164 leading plus.
    return createHash("sha256").update(phone.number.slice(1), "utf8").digest("hex");
  } catch {
    return undefined;
  }
}

function metaCookie(value: string | undefined, kind: "fbp" | "fbc"): string | undefined {
  if (!value || value.length > 1200) return undefined;
  const pattern = kind === "fbp" ? /^fb\.\d+\.\d{13}\.\d+$/ : /^fb\.\d+\.\d{13}\.[A-Za-z0-9_.-]+$/;
  return pattern.test(value) ? value : undefined;
}

/** Read existing first-party cookies only; never manufacture a click identifier. */
export function metaCapiCookies(cookieHeader: string | null): Pick<MetaCapiLeadInput, "fbp" | "fbc"> {
  const result: Pick<MetaCapiLeadInput, "fbp" | "fbc"> = {};
  for (const part of (cookieHeader ?? "").split(";")) {
    const separator = part.indexOf("=");
    const name = part.slice(0, separator).trim();
    if (name !== "_fbp" && name !== "_fbc") continue;
    const kind = name === "_fbp" ? "fbp" : "fbc";
    const value = metaCookie(part.slice(separator + 1).trim(), kind);
    if (value && !result[kind]) result[kind] = value;
  }
  return result;
}

export function metaCapiEventsUrl(pixelId: string): string {
  return `https://graph.facebook.com/${META_GRAPH_API_VERSION}/${pixelId}/events`;
}

function technicalIp(value: string | undefined): string | undefined {
  const ip = (value ?? "").trim();
  if (!ip || ip.toLowerCase() === "unknown" || ip.length > 64) return undefined;
  if (/^(?:\d{1,3}\.){3}\d{1,3}$/.test(ip)) {
    return ip.split(".").every((part) => Number(part) <= 255) ? ip : undefined;
  }
  if (ip.includes(":") && /^[0-9a-f:.]+$/i.test(ip)) return ip;
  return undefined;
}

function technicalUserAgent(value: string | undefined): string | undefined {
  // Drop ASCII controls. Stop before 512 code units so a surrogate pair is not split.
  let userAgent = "";
  for (const char of value ?? "") {
    if (userAgent.length + char.length > 512) break;
    const code = char.codePointAt(0) ?? 0;
    userAgent += code <= 31 || code === 127 ? " " : char;
  }
  userAgent = userAgent.trim();
  if (!userAgent || userAgent.includes("@")) return undefined;
  return userAgent;
}

/** Keeps an http(s) page address and drops query, hash, and credentials so contact data cannot ride along. */
function sanitizeEventSourceUrl(value: string | undefined): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return undefined;
    if (url.username || url.password) return undefined;
    url.search = "";
    url.hash = "";
    const href = url.toString();
    if (href.length > 300) return undefined;
    return href;
  } catch {
    return undefined;
  }
}

export function buildMetaCapiLeadEvent(
  input: MetaCapiLeadInput,
  now: () => Date = () => new Date(),
): MetaCapiLeadEvent {
  const userData: MetaCapiUserData = {};
  const clientIpAddress = technicalIp(input.clientIpAddress);
  const clientUserAgent = technicalUserAgent(input.clientUserAgent);
  if (clientIpAddress) userData.client_ip_address = clientIpAddress;
  if (clientUserAgent) userData.client_user_agent = clientUserAgent;
  const fbp = metaCookie(input.fbp, "fbp");
  const fbc = metaCookie(input.fbc, "fbc");
  if (fbp) userData.fbp = fbp;
  if (fbc) userData.fbc = fbc;
  if (input.emailHash && /^[a-f0-9]{64}$/.test(input.emailHash)) userData.em = [input.emailHash];
  if (input.phoneHash && /^[a-f0-9]{64}$/.test(input.phoneHash)) userData.ph = [input.phoneHash];

  const eventTime = input.eventTimeSeconds !== undefined && Number.isFinite(input.eventTimeSeconds)
    ? Math.floor(input.eventTimeSeconds)
    : Math.floor(now().getTime() / 1000);

  const event: MetaCapiLeadEvent = {
    event_name: "Lead",
    event_time: eventTime,
    event_id: input.eventId.trim(),
    action_source: "website",
    user_data: userData,
    custom_data: metaLeadParams(input.productInterest),
  };

  const eventSourceUrl = sanitizeEventSourceUrl(input.eventSourceUrl);
  if (eventSourceUrl) event.event_source_url = eventSourceUrl;
  return event;
}

/**
 * Sends one website Lead. Missing config and Graph failures return a result instead of throwing.
 */
export async function sendMetaCapiLead(
  input: MetaCapiLeadInput,
  options: MetaCapiLeadOptions = {},
): Promise<MetaCapiLeadResult> {
  const started = performance.now();
  const diagnostics: MetaCapiDiagnostics = {
    pixel_id: null, graph_api_version: META_GRAPH_API_VERSION, event_time_seconds: null,
    has_email_hash: null, has_phone_hash: null, has_fbp: null, has_fbc: null,
    duration_ms: 0, attempts: [],
  };
  const complete = (outcome: MetaCapiOutcome): MetaCapiLeadResult => ({
    ...outcome,
    diagnostics: { ...diagnostics, duration_ms: Math.max(0, Math.round(performance.now() - started)) },
  });
  if (!isMetaMeasurementEnabled(process.env.NEXT_PUBLIC_ANALYTICS_ENABLED, process.env.VERCEL_ENV)) {
    return complete({ status: "skipped", reason: "disabled" });
  }
  const pixelId = resolveFacebookPixelId(
    options.pixelId !== undefined ? options.pixelId : process.env.NEXT_PUBLIC_FB_PIXEL_ID,
  );
  if (!pixelId) return complete({ status: "skipped", reason: "missing_pixel" });
  diagnostics.pixel_id = pixelId;

  const accessToken = (
    options.accessToken !== undefined ? options.accessToken : process.env.META_CAPI_ACCESS_TOKEN ?? ""
  ).trim();
  if (!accessToken) return complete({ status: "skipped", reason: "missing_token" });

  const eventId = input.eventId.trim();
  if (!isMetaEventId(eventId)) return complete({ status: "skipped", reason: "invalid_event_id" });

  const event = buildMetaCapiLeadEvent({ ...input, eventId }, options.now ?? (() => new Date()));
  diagnostics.event_time_seconds = event.event_time;
  diagnostics.has_email_hash = Boolean(event.user_data.em);
  diagnostics.has_phone_hash = Boolean(event.user_data.ph);
  diagnostics.has_fbp = Boolean(event.user_data.fbp);
  diagnostics.has_fbc = Boolean(event.user_data.fbc);
  const fetchImpl = options.fetchImpl ?? fetch;
  const timeoutMs = Math.max(1, options.timeoutMs ?? DEFAULT_CAPI_TIMEOUT_MS);
  const deadline = performance.now() + timeoutMs;
  // Reuse the exact payload (including event id and time) across the two attempts.
  const body = JSON.stringify({ data: [event], access_token: accessToken });
  let result: MetaCapiOutcome = { status: "failed", errorName: "TimeoutError" };

  for (let attempt = 0; attempt < 2; attempt++) {
    let retryable = false;
    let retryDelayMs = 150;
    const remainingMs = Math.floor(deadline - performance.now());
    if (remainingMs <= 0) break;
    const attemptStarted = performance.now();
    const summary: MetaCapiAttempt = {
      attempt_no: attempt + 1, started_at: new Date().toISOString(), duration_ms: 0,
      status: "failed", http_status: null, events_received: null, error_name: null,
      meta_error_code: null, trace_id: null, response_parse_status: "no_response", retryable: false,
    };
    // Count only actual fetch calls, never a retry stopped by the shared deadline.
    diagnostics.attempts.push(summary);
    try {
      const response = await fetchImpl(metaCapiEventsUrl(pixelId), {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body,
        cache: "no-store",
        redirect: "error",
        signal: AbortSignal.timeout(attempt === 0 ? Math.max(1, Math.floor(remainingMs / 2)) : remainingMs),
      });
      summary.http_status = metaCapiInteger(response.status, 100, 599);
      let payload: { events_received?: unknown; fbtrace_id?: unknown; error?: { code?: unknown; fbtrace_id?: unknown } } | null = null;
      try {
        payload = await response.json();
        summary.response_parse_status = "json";
      } catch (error) {
        // Malformed JSON is an invalid response; interrupted body reads are transport failures.
        summary.response_parse_status = error instanceof SyntaxError ? "invalid_json" : "body_error";
        if (!(error instanceof SyntaxError)) throw error;
      }
      summary.events_received = metaCapiInteger(payload?.events_received);
      summary.meta_error_code = metaCapiInteger(payload?.error?.code, -2_147_483_648);
      summary.trace_id = metaCapiTraceId(response.ok ? payload?.fbtrace_id : payload?.error?.fbtrace_id);
      if (response.ok) {
        summary.status = payload?.events_received === 1 ? "sent" : "failed";
        summary.error_name = summary.status === "sent" ? null : "InvalidResponse";
        return complete(summary.status === "sent"
          ? { status: "sent" }
          : { status: "failed", errorName: "InvalidResponse", httpStatus: response.status });
      }
      summary.error_name = "HttpError";
      result = {
        status: "failed", errorName: "HttpError", httpStatus: response.status,
        ...(summary.meta_error_code !== null ? { errorCode: summary.meta_error_code } : {}),
        ...(summary.trace_id !== null ? { traceId: summary.trace_id } : {}),
      };
      retryable = response.status === 429 || response.status >= 500;
      const retryAfter = response.headers.get("retry-after");
      if (retryAfter) {
        const seconds = Number(retryAfter);
        const delay = Number.isFinite(seconds) ? seconds * 1000 : Date.parse(retryAfter) - Date.now();
        if (Number.isFinite(delay)) retryDelayMs = Math.max(retryDelayMs, delay);
      }
    } catch (error) {
      const name = error instanceof Error ? error.name : "UnknownError";
      retryable = name === "TypeError" || name === "AbortError" || name === "TimeoutError";
      summary.error_name = name === "TypeError" || name === "AbortError" || name === "TimeoutError" ? name : "UnknownError";
      result = { status: "failed", errorName: summary.error_name };
    } finally {
      summary.retryable = retryable;
      summary.duration_ms = Math.max(0, Math.round(performance.now() - attemptStarted));
    }
    if (attempt === 1 || !retryable || deadline - performance.now() <= retryDelayMs) break;
    await new Promise(resolve => setTimeout(resolve, retryDelayMs));
  }
  return complete(result);
}

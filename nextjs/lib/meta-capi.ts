import { isMetaEventId, metaLeadParams, resolveFacebookPixelId } from "./meta-pixel";

/**
 * Server-only Meta Conversions API Lead.
 * Do not import this module from client components.
 * Inquiry contact fields are never accepted: no name, email, phone, WhatsApp, company, country, or message.
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
};

export type MetaCapiUserData = {
  client_ip_address?: string;
  client_user_agent?: string;
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

export type MetaCapiLeadResult =
  | { status: "sent" }
  | { status: "skipped"; reason: "missing_token" | "missing_pixel" | "invalid_event_id" }
  | { status: "failed"; errorName: string; httpStatus?: number };

export type MetaCapiLeadOptions = {
  /** Pass "" to skip. Omit to read the server env var. Never log this value. */
  accessToken?: string;
  /** Passed through resolveFacebookPixelId. Omit to read NEXT_PUBLIC_FB_PIXEL_ID. */
  pixelId?: string | null;
  fetchImpl?: typeof fetch;
  now?: () => Date;
  timeoutMs?: number;
};

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

async function discardResponseBody(response: Response) {
  try {
    await response.arrayBuffer();
  } catch {
    // The status is already recorded. Response text is never logged.
  }
}

/**
 * Sends one website Lead. Missing config and Graph failures return a result instead of throwing.
 */
export async function sendMetaCapiLead(
  input: MetaCapiLeadInput,
  options: MetaCapiLeadOptions = {},
): Promise<MetaCapiLeadResult> {
  const pixelId = resolveFacebookPixelId(
    options.pixelId !== undefined ? options.pixelId : process.env.NEXT_PUBLIC_FB_PIXEL_ID,
  );
  if (!pixelId) return { status: "skipped", reason: "missing_pixel" };

  const accessToken = (
    options.accessToken !== undefined ? options.accessToken : process.env.META_CAPI_ACCESS_TOKEN ?? ""
  ).trim();
  if (!accessToken) return { status: "skipped", reason: "missing_token" };

  const eventId = input.eventId.trim();
  if (!isMetaEventId(eventId)) return { status: "skipped", reason: "invalid_event_id" };

  const event = buildMetaCapiLeadEvent({ ...input, eventId }, options.now ?? (() => new Date()));
  const fetchImpl = options.fetchImpl ?? fetch;
  const timeoutMs = options.timeoutMs ?? DEFAULT_CAPI_TIMEOUT_MS;

  try {
    const response = await fetchImpl(metaCapiEventsUrl(pixelId), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: [event],
        access_token: accessToken,
      }),
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(timeoutMs),
    });

    if (!response.ok) {
      await discardResponseBody(response);
      return { status: "failed", errorName: "HttpError", httpStatus: response.status };
    }

    await discardResponseBody(response);
    return { status: "sent" };
  } catch (error) {
    return {
      status: "failed",
      errorName: error instanceof Error ? error.name : "UnknownError",
    };
  }
}

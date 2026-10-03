export const OUTREACH_ORIGIN = "https://www.realismthrift.com";
export const OUTREACH_SENDER = "jason@realismthriftglobal.com";
export const CONSENT_TEXT = "I'd like to receive wholesale product updates from RealismThrift. I can unsubscribe at any time.";
export const CONFIRMATION_TTL_HOURS = 24;
export const DAILY_MARKETING_LIMIT = 50;

export class OutreachError extends Error {
  constructor(public code: string, public status = 503, public details?: Record<string, unknown>) {
    super(code);
    this.name = "OutreachError";
  }
}

export function requiredSetting(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new OutreachError("service_unavailable");
  return value;
}

export function outreachOrigin() {
  const origin = process.env.OUTREACH_SITE_ORIGIN?.trim() || OUTREACH_ORIGIN;
  const parsed = new URL(origin);
  if (parsed.protocol !== "https:" && !(process.env.NODE_ENV !== "production" && parsed.hostname === "localhost")) {
    throw new OutreachError("service_unavailable");
  }
  return parsed.origin;
}

export function sendingEnabled() {
  return process.env.OUTREACH_SENDING_ENABLED === "true";
}

export function isAllowedFormOrigin(request: Request) {
  return request.headers.get("origin") === outreachOrigin();
}

export function logOutreachError(operation: string, error: unknown) {
  // Provider errors can contain URLs, MIME, bearer tokens and recipient addresses.
  console.error("Outreach operation failed", {
    operation,
    code: error instanceof OutreachError ? error.code : "provider_error",
  });
}

import type { ErrorResponse } from "resend";

export const MAX_EMAIL_ATTEMPTS = 5;
const RETRY_DELAYS_MINUTES = [5, 15, 60, 360] as const;

const permanentErrorNames = new Set([
  "invalid_idempotency_key",
  "validation_error",
  "missing_api_key",
  "restricted_api_key",
  "invalid_api_key",
  "not_found",
  "method_not_allowed",
  "invalid_idempotent_request",
  "invalid_attachment",
  "invalid_from_address",
  "invalid_access",
  "invalid_parameter",
  "invalid_region",
  "missing_required_field",
  "monthly_quota_exceeded",
  "daily_quota_exceeded",
  "security_error",
]);

const transientErrorNames = new Set([
  "concurrent_idempotent_requests",
  "rate_limit_exceeded",
  "application_error",
  "internal_server_error",
]);

export function getRetryDelayMinutes(attemptCount: number) {
  const index = Math.max(0, Math.min(attemptCount - 1, RETRY_DELAYS_MINUTES.length - 1));
  return RETRY_DELAYS_MINUTES[index];
}

function redactErrorMessage(message: string) {
  return message
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[email redacted]")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 500);
}

export function classifyEmailError(error: unknown) {
  if (error && typeof error === "object" && "name" in error) {
    const resendError = error as Partial<ErrorResponse>;
    const code = String(resendError.name || "resend_error");
    const statusCode = resendError.statusCode ?? null;

    if (
      code !== "InquiryConfigurationError" &&
      !permanentErrorNames.has(code) &&
      !transientErrorNames.has(code) &&
      statusCode === null
    ) {
      return {
        code: "network_error",
        message: "A temporary network error prevented the email from being accepted.",
        transient: true,
      };
    }

    return {
      code,
      message: redactErrorMessage(String(resendError.message || "Resend rejected the email.")),
      transient:
        !permanentErrorNames.has(code) &&
        code !== "InquiryConfigurationError" &&
        (transientErrorNames.has(code) ||
          statusCode === 429 ||
          (typeof statusCode === "number" && statusCode >= 500)),
    };
  }

  return {
    code: "network_error",
    message: "A temporary network error prevented the email from being accepted.",
    transient: true,
  };
}

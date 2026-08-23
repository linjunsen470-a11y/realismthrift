import { NextResponse } from "next/server";
import { InquiryConfigurationError } from "@/lib/inquiries/clients";
import { getInquiryEmailSettings } from "@/lib/inquiries/config";
import { processPendingEmailJobs } from "@/lib/inquiries/email-jobs";
import { createInquiry, InquiryStorageError } from "@/lib/inquiries/repository";
import { validateInquiryPayload } from "@/lib/inquiries/validation";

export const preferredRegion = "sin1";

const MAX_REQUESTS_PER_WINDOW = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const PRODUCTION_SITE_ORIGIN = "https://www.realismthrift.com";

type ApiErrorCode =
  | "validation_error"
  | "rate_limited"
  | "storage_failed"
  | "config_error";

type RateLimitStore = Map<string, number[]>;

const globalRateLimitState = globalThis as typeof globalThis & {
  __inquiryRateLimitStore?: RateLimitStore;
};

const rateLimitStore = globalRateLimitState.__inquiryRateLimitStore ?? new Map<string, number[]>();
globalRateLimitState.__inquiryRateLimitStore ??= rateLimitStore;

function jsonError(code: ApiErrorCode, message: string, status: number) {
  return NextResponse.json({ ok: false, code, message }, { status });
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function getConfiguredAppOrigin() {
  const appUrl = process.env.APP_URL;
  if (!appUrl || appUrl === "MY_APP_URL") {
    return null;
  }

  try {
    return new URL(appUrl).origin;
  } catch {
    return null;
  }
}

function getRequestOrigin(request: Request) {
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost || request.headers.get("host")?.trim();
  if (!host) {
    return null;
  }

  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const protocol = forwardedProto || new URL(request.url).protocol.replace(":", "");
  return `${protocol}://${host}`;
}

function getSourceOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (origin) {
    return origin;
  }

  const referer = request.headers.get("referer");
  if (!referer) {
    return null;
  }

  try {
    return new URL(referer).origin;
  } catch {
    return null;
  }
}

function isAllowedRequestOrigin(request: Request) {
  const sourceOrigin = getSourceOrigin(request);
  if (!sourceOrigin) {
    return process.env.NODE_ENV !== "production";
  }

  const allowedOrigins = new Set(
    [PRODUCTION_SITE_ORIGIN, getRequestOrigin(request), getConfiguredAppOrigin()].filter(
      (origin): origin is string => Boolean(origin),
    ),
  );

  return allowedOrigins.has(sourceOrigin);
}

function isRateLimited(clientIp: string) {
  const now = Date.now();
  const attempts = rateLimitStore.get(clientIp) ?? [];
  const recentAttempts = attempts.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);

  if (recentAttempts.length >= MAX_REQUESTS_PER_WINDOW) {
    rateLimitStore.set(clientIp, recentAttempts);
    return true;
  }

  recentAttempts.push(now);
  rateLimitStore.set(clientIp, recentAttempts);
  return false;
}

export async function POST(request: Request) {
  if (!isAllowedRequestOrigin(request)) {
    return jsonError("validation_error", "Invalid request origin.", 403);
  }

  if (isRateLimited(getClientIp(request))) {
    return jsonError(
      "rate_limited",
      "Too many inquiries were submitted from this connection. Please wait a few minutes and try again.",
      429,
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("validation_error", "Invalid request payload.", 400);
  }

  const parsed = validateInquiryPayload(body);
  if (!parsed.data) {
    return jsonError("validation_error", parsed.error, 400);
  }

  let inquiryId: string;
  try {
    const settings = getInquiryEmailSettings();
    const inquiry = await createInquiry(parsed.data, settings);
    inquiryId = inquiry.id;
  } catch (error) {
    if (error instanceof InquiryConfigurationError) {
      console.error("Inquiry service configuration error", { errorName: error.name });
      return jsonError(
        "config_error",
        "Inquiry service is temporarily unavailable. Please contact us via WhatsApp or email directly.",
        500,
      );
    }

    console.error("Inquiry persistence failed", {
      errorName: error instanceof Error ? error.name : "UnknownError",
      storageError: error instanceof InquiryStorageError,
      storageOperation: error instanceof InquiryStorageError ? error.operation : undefined,
      providerCode: error instanceof InquiryStorageError ? error.providerCode : undefined,
    });
    return jsonError(
      "storage_failed",
      "We could not securely save your inquiry right now. Please try again or contact us via WhatsApp.",
      503,
    );
  }

  try {
    await processPendingEmailJobs({ inquiryId, limit: 2 });
  } catch (error) {
    // The inquiry and its outbox jobs already exist. The scheduled retry worker will recover them.
    console.error("Immediate inquiry email processing failed", {
      inquiryId,
      errorName: error instanceof Error ? error.name : "UnknownError",
    });
  }

  return NextResponse.json({
    ok: true,
    message: "Inquiry received. Our sales team will contact you within 12 hours.",
  });
}

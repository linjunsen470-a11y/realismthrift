import type { InquiryPayload } from "./types";

export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function normalizeText(value: unknown, maxLength: number) {
  return String(value ?? "").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function normalizeSourcePath(value: unknown) {
  const candidate = normalizeText(value, 200);
  if (!candidate.startsWith("/") || candidate.startsWith("//")) {
    return "/";
  }

  try {
    return new URL(candidate, "https://www.realismthrift.com").pathname.slice(0, 200) || "/";
  } catch {
    return "/";
  }
}

export function validateInquiryPayload(
  body: unknown,
): { data: InquiryPayload; error?: never } | { data?: never; error: string } {
  if (!body || typeof body !== "object") {
    return { error: "Invalid request payload." };
  }

  const record = body as Record<string, unknown>;
  const data: InquiryPayload = {
    submissionId: normalizeText(record.submissionId, 36).toLowerCase(),
    name: normalizeText(record.name, 80),
    email: normalizeText(record.email, 120).toLowerCase(),
    whatsapp: normalizeText(record.whatsapp, 32),
    country: normalizeText(record.country, 80),
    product: normalizeText(record.product, 40),
    quantity: normalizeText(record.quantity, 40),
    message: normalizeText(record.message, 2000),
    sourcePath: normalizeSourcePath(record.sourcePath),
    website: normalizeText(record.website, 80),
  };

  if (data.website) {
    return { error: "Invalid request payload." };
  }

  if (!data.submissionId || !uuidPattern.test(data.submissionId)) {
    return { error: "Invalid submission identifier." };
  }

  if (!data.name || !data.email || !data.whatsapp) {
    return { error: "Missing required fields." };
  }

  if (!emailPattern.test(data.email)) {
    return { error: "Invalid email address." };
  }

  return { data };
}


import { createHash, createHmac, randomBytes } from "node:crypto";

export function newPreferenceToken() {
  return randomBytes(32).toString("base64url");
}

export function validPreferenceToken(value: unknown): value is string {
  return typeof value === "string" && /^[A-Za-z0-9_-]{43}$/.test(value);
}

export function tokenHash(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function rateKey(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function normalizeEmail(value: unknown) {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  return email.length <= 254 && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email) ? email : null;
}

export function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  return `${local.slice(0, 1)}***@${domain}`;
}

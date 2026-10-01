import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { sql } from "drizzle-orm";
import { outreachDatabase } from "./database";
import { OutreachError, OUTREACH_SENDER, requiredSetting } from "./config";

type Token = { value: string; expires: number };
let accessToken: Token | undefined;
export class GmailError extends OutreachError {
  constructor(public httpStatus: number) { super("gmail_request_failed", 502); }
}

function credentialKey() {
  const key = Buffer.from(requiredSetting("OUTREACH_CREDENTIAL_KEY"), "base64");
  if (key.length !== 32) throw new OutreachError("service_unavailable");
  return key;
}
export function encryptCredential(token: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", credentialKey(), iv);
  return Buffer.concat([iv, cipher.update(token), cipher.final(), cipher.getAuthTag()]).toString("base64");
}
export function decryptCredential(value: string) {
  const buffer = Buffer.from(value, "base64");
  const cipher = createDecipheriv("aes-256-gcm", credentialKey(), buffer.subarray(0, 12));
  cipher.setAuthTag(buffer.subarray(-16));
  return Buffer.concat([cipher.update(buffer.subarray(12, -16)), cipher.final()]).toString();
}
async function refreshCredential() {
  if (process.env.OUTREACH_GOOGLE_REFRESH_TOKEN) return process.env.OUTREACH_GOOGLE_REFRESH_TOKEN;
  const rows = await outreachDatabase().execute<{ details: { ciphertext: string } }>(sql`select details from outreach_events where kind='gmail_connected' and source=${OUTREACH_SENDER} order by created_at desc limit 1`);
  if (!rows.rows[0]) throw new OutreachError("gmail_not_connected");
  return decryptCredential(rows.rows[0].details.ciphertext);
}
export async function googleTokenRequest(values: Record<string, string>) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ ...values, client_id: requiredSetting("OUTREACH_GOOGLE_CLIENT_ID"), client_secret: requiredSetting("OUTREACH_GOOGLE_CLIENT_SECRET") }),
    signal: AbortSignal.timeout(10_000), cache: "no-store",
  });
  if (!response.ok) throw new GmailError(response.status);
  return response.json() as Promise<{ access_token: string; expires_in: number; refresh_token?: string; scope?: string }>;
}
async function currentAccessToken() {
  if (accessToken && accessToken.expires > Date.now() + 60_000) return accessToken.value;
  const result = await googleTokenRequest({ grant_type: "refresh_token", refresh_token: await refreshCredential() });
  accessToken = { value: result.access_token, expires: Date.now() + result.expires_in * 1000 };
  return accessToken.value;
}
export function clearGmailTokenCache() { accessToken = undefined; }

export async function gmailRequest<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/${path}`, {
    method: body ? "POST" : "GET",
    headers: { Authorization: `Bearer ${await currentAccessToken()}`, ...(body ? { "Content-Type": "application/json" } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
    signal: AbortSignal.timeout(20_000), cache: "no-store",
  });
  if (!response.ok) throw new GmailError(response.status);
  return response.json() as Promise<T>;
}
export async function verifyGmailAccount() {
  const profile = await gmailRequest<{ emailAddress: string }>("profile");
  if (profile.emailAddress.toLowerCase() !== OUTREACH_SENDER) throw new OutreachError("wrong_gmail_account", 403);
}

export type GmailMessage = { id: string; threadId: string; raw?: string; labelIds?: string[]; payload?: { headers?: { name: string; value: string }[] } };
export function gmailHeader(message: GmailMessage, name: string) {
  return message.payload?.headers?.find(header => header.name.toLowerCase() === name.toLowerCase())?.value || "";
}

export async function listGmailMessages(query: string) {
  const messages: { id: string; threadId: string }[] = [];
  let nextPageToken: string | undefined;
  do {
    const params = new URLSearchParams({ q: query, maxResults: "100", includeSpamTrash: "true" });
    if (nextPageToken) params.set("pageToken", nextPageToken);
    const result = await gmailRequest<{ messages?: { id: string; threadId: string }[]; nextPageToken?: string }>(`messages?${params}`);
    messages.push(...result.messages || []);
    nextPageToken = result.nextPageToken;
    if (messages.length > 1000) throw new OutreachError("inbound_review_required", 409);
  } while (nextPageToken);
  return messages;
}

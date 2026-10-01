import { cookies } from "next/headers";
import { timingSafeEqual } from "node:crypto";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { requireOperator } from "@/lib/outreach/auth";
import { outreachDatabase } from "@/lib/outreach/database";
import { clearGmailTokenCache, encryptCredential, googleTokenRequest } from "@/lib/outreach/gmail";
import { OutreachError, outreachOrigin, OUTREACH_SENDER } from "@/lib/outreach/config";
import { preferenceError } from "@/lib/outreach/http";

export async function GET(request: Request) {
  try {
    await requireOperator();
    const params = new URL(request.url).searchParams;
    const store = await cookies();
    const expected = store.get("outreach_google_state")?.value || "";
    const state = params.get("state") || "";
    store.set("outreach_google_state", "", { maxAge: 0, path: "/api/outreach/google" });
    if (!expected || Buffer.byteLength(state) !== Buffer.byteLength(expected) || !timingSafeEqual(Buffer.from(state), Buffer.from(expected))) throw new OutreachError("invalid_state", 403);
    const code = params.get("code");
    if (!code) throw new OutreachError("invalid_request", 400);
    const tokens = await googleTokenRequest({ grant_type: "authorization_code", code, redirect_uri: `${outreachOrigin()}/api/outreach/google/callback` });
    if (tokens.scope && ["gmail.readonly", "gmail.compose"].some(scope => !tokens.scope!.split(" ").includes(`https://www.googleapis.com/auth/${scope}`))) throw new OutreachError("gmail_permissions_missing", 403);
    const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/profile", { headers: { Authorization: `Bearer ${tokens.access_token}` }, signal: AbortSignal.timeout(10_000), cache: "no-store" });
    if (!response.ok || (await response.json()).emailAddress?.toLowerCase() !== OUTREACH_SENDER) throw new OutreachError("wrong_gmail_account", 403);
    if (!tokens.refresh_token) throw new OutreachError("gmail_refresh_token_missing");
    const ciphertext = encryptCredential(tokens.refresh_token);
    await outreachDatabase().execute(sql`insert into outreach_events(kind,source,details) values('gmail_connected',${OUTREACH_SENDER},${JSON.stringify({ ciphertext })}::jsonb)`);
    clearGmailTokenCache();
    return NextResponse.redirect(`${outreachOrigin()}/outreach/connect?connected=1`, 303);
  } catch (error) { return preferenceError("gmail_connection", error); }
}

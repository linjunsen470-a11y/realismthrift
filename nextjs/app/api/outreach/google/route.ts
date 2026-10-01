import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { operatorAuthClient, requireOperator, validAuthorizationId } from "@/lib/outreach/auth";
import { isAllowedFormOrigin, OutreachError, outreachOrigin, requiredSetting } from "@/lib/outreach/config";
import { preferenceError } from "@/lib/outreach/http";

export async function POST(request: Request) {
  try {
    if (!isAllowedFormOrigin(request)) throw new OutreachError("invalid_origin", 403);
    const form = await request.formData();
    if (form.get("action") === "login") {
      const id = form.get("authorization_id");
      if (id !== null && !validAuthorizationId(id)) throw new OutreachError("invalid_request", 400);
      const callback = new URL("/api/outreach/google/login-callback", outreachOrigin());
      if (id) callback.searchParams.set("authorization_id", id);
      const client = await operatorAuthClient();
      const { data, error } = await client.auth.signInWithOAuth({ provider: "google", options: { redirectTo: callback.toString() } });
      if (error || !data.url) throw new OutreachError("service_unavailable");
      return NextResponse.redirect(data.url, 303);
    }
    await requireOperator();
    requiredSetting("OUTREACH_CREDENTIAL_KEY");
    const state = randomBytes(32).toString("base64url");
    const store = await cookies();
    store.set("outreach_google_state", state, { httpOnly: true, secure: outreachOrigin().startsWith("https:"), sameSite: "lax", maxAge: 600, path: "/api/outreach/google" });
    const params = new URLSearchParams({ client_id: requiredSetting("OUTREACH_GOOGLE_CLIENT_ID"), redirect_uri: `${outreachOrigin()}/api/outreach/google/callback`, response_type: "code", scope: "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.compose", access_type: "offline", prompt: "consent", state });
    return NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`, 303);
  } catch (error) { return preferenceError("google_authorization", error); }
}

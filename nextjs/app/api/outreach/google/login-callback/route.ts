import { NextResponse } from "next/server";
import { operatorAuthClient, validAuthorizationId } from "@/lib/outreach/auth";
import { OutreachError, outreachOrigin } from "@/lib/outreach/config";
import { preferenceError } from "@/lib/outreach/http";
export async function GET(request: Request) {
  try {
    const params = new URL(request.url).searchParams;
    const code = params.get("code");
    const id = params.get("authorization_id");
    if (id !== null && !validAuthorizationId(id)) throw new OutreachError("invalid_request", 400);
    if (!code) throw new OutreachError("invalid_request", 400);
    const client = await operatorAuthClient();
    if ((await client.auth.exchangeCodeForSession(code)).error) throw new OutreachError("operator_required", 403);
    const target = new URL(id ? "/oauth/consent" : "/outreach/connect", outreachOrigin());
    if (id) target.searchParams.set("authorization_id", id);
    return NextResponse.redirect(target, 303);
  } catch (error) { return preferenceError("operator_login", error); }
}

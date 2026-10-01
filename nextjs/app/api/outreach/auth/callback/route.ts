import { NextResponse } from "next/server";
import { operatorAuthClient, validAuthorizationId } from "@/lib/outreach/auth";
import { OutreachError, outreachOrigin } from "@/lib/outreach/config";
import { preferenceError } from "@/lib/outreach/http";

export async function GET(request: Request) {
  try {
    const params = new URL(request.url).searchParams;
    const id = params.get("authorization_id");
    const code = params.get("code");
    if (!code || !validAuthorizationId(id)) throw new OutreachError("invalid_request", 400);
    const client = await operatorAuthClient();
    const result = await client.auth.exchangeCodeForSession(code);
    if (result.error) throw new OutreachError("operator_required", 403);
    return NextResponse.redirect(`${outreachOrigin()}/outreach/authorize?authorization_id=${encodeURIComponent(id)}`, 303);
  } catch (error) { return preferenceError("operator_login", error); }
}

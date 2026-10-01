import { NextResponse } from "next/server";
import { operatorAuthClient } from "@/lib/outreach/auth";
import { OutreachError, outreachOrigin } from "@/lib/outreach/config";
import { preferenceError } from "@/lib/outreach/http";
export async function GET(request: Request) {
  try {
    const code = new URL(request.url).searchParams.get("code");
    if (!code) throw new OutreachError("invalid_request", 400);
    const client = await operatorAuthClient();
    if ((await client.auth.exchangeCodeForSession(code)).error) throw new OutreachError("operator_required", 403);
    return NextResponse.redirect(`${outreachOrigin()}/outreach/connect`, 303);
  } catch (error) { return preferenceError("operator_login", error); }
}

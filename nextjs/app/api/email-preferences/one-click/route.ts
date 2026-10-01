import { unsubscribe } from "@/lib/outreach/preferences";
import { OutreachError, outreachOrigin } from "@/lib/outreach/config";
import { limitedRequestText, preferenceError } from "@/lib/outreach/http";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.startsWith("application/x-www-form-urlencoded") && !contentType.startsWith("multipart/form-data")) throw new OutreachError("invalid_request", 400);
    if (Number(request.headers.get("content-length") || 0) > 8192) throw new OutreachError("invalid_request", 413);
    let form: FormData;
    const text = await limitedRequestText(request, 8192);
    try { form = await new Response(text, { headers: { "Content-Type": contentType } }).formData(); } catch { throw new OutreachError("invalid_request", 400); }
    if (form.get("List-Unsubscribe") !== "One-Click") throw new OutreachError("invalid_request", 400);
    await unsubscribe(new URL(request.url).searchParams.get("token") || "", "one_click");
    return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
  } catch (error) { return preferenceError("one_click", error); }
}

export function GET(request: Request) {
  const target = new URL("/email-preferences", outreachOrigin());
  target.searchParams.set("token", new URL(request.url).searchParams.get("token") || "");
  return NextResponse.redirect(target, { status: 303, headers: { "Cache-Control": "no-store" } });
}

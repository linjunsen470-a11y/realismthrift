import { confirmResubscribe, previewConfirmation, requestResubscribe, unsubscribe } from "@/lib/outreach/preferences";
import { isAllowedFormOrigin, OutreachError } from "@/lib/outreach/config";
import { normalizeEmail } from "@/lib/outreach/tokens";
import { limitedRequestText, preferenceError, preferenceResponse } from "@/lib/outreach/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    if (!isAllowedFormOrigin(request)) throw new OutreachError("invalid_origin", 403);
    if (!request.headers.get("content-type")?.startsWith("application/json")) throw new OutreachError("invalid_request", 400);
    const text = await limitedRequestText(request, 2048);
    let body: Record<string, unknown>;
    try { body = JSON.parse(text); } catch { throw new OutreachError("invalid_request", 400); }
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new OutreachError("invalid_request", 400);
    const token = typeof body.token === "string" ? body.token : "";
    if (body.action === "unsubscribe") return preferenceResponse(await unsubscribe(token, "website"));
    if (body.action === "preview_confirmation") return preferenceResponse(await previewConfirmation(token));
    if (body.action === "confirm_resubscribe") return preferenceResponse(await confirmResubscribe(token));
    if (body.action === "request_resubscribe") {
      const email = normalizeEmail(body.email);
      if (!email || body.consent !== true) throw new OutreachError("invalid_request", 400);
      const ip = request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
      return preferenceResponse(await requestResubscribe(email, ip), 202);
    }
    throw new OutreachError("invalid_request", 400);
  } catch (error) { return preferenceError("preferences", error); }
}

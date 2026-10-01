import { validAuthorizationId } from "@/lib/outreach/auth";
import { outreachOrigin } from "@/lib/outreach/config";

export const dynamic = "force-dynamic";

// Supabase's configured consent path predates the outreach authorization page.
// This GET only redirects; approval still requires the operator's explicit POST.
export function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("authorization_id");
  if (!validAuthorizationId(id)) return new Response("This authorization link is unavailable.", { status: 400, headers: { "Cache-Control": "no-store" } });
  const target = new URL("/outreach/authorize", outreachOrigin());
  target.searchParams.set("authorization_id", id);
  return new Response(null, { status: 303, headers: { Location: target.toString(), "Cache-Control": "no-store" } });
}

import { validAuthorizationId } from "@/lib/outreach/auth";
import { outreachOrigin } from "@/lib/outreach/config";

// Keep existing connection links working; Supabase now opens the consent page directly.
export function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("authorization_id");
  if (!validAuthorizationId(id)) return new Response("This authorization link is unavailable.", { status: 400 });
  const target = new URL("/oauth/consent", outreachOrigin());
  target.searchParams.set("authorization_id", id);
  return new Response(null, { status: 303, headers: { Location: target.toString(), "Cache-Control": "no-store" } });
}

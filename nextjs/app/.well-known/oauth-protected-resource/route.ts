import { authIssuer, mcpResource } from "@/lib/outreach/auth";
import { preferenceResponse, preferenceError } from "@/lib/outreach/http";
export const dynamic = "force-dynamic";
export function GET() {
  try {
    const response = preferenceResponse({ resource: mcpResource(), authorization_servers: [authIssuer()], scopes_supported: ["openid", "email"], resource_name: "RealismThrift Cold Email" });
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  } catch (error) { return preferenceError("oauth_metadata", error); }
}
export function OPTIONS() {
  return new Response(null, { status: 204, headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, OPTIONS" } });
}

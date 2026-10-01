import { NextResponse } from "next/server";
import { operatorAuthClient, requireOperator, validAuthorizationId } from "@/lib/outreach/auth";
import { isAllowedFormOrigin, OutreachError, outreachOrigin, requiredSetting } from "@/lib/outreach/config";
import { preferenceError } from "@/lib/outreach/http";

export async function POST(request: Request) {
  try {
    if (!isAllowedFormOrigin(request)) throw new OutreachError("invalid_origin", 403);
    const form = await request.formData();
    const id = form.get("authorization_id");
    if (!validAuthorizationId(id)) throw new OutreachError("invalid_request", 400);
    if (form.get("action") === "login") {
      const client = await operatorAuthClient();
      const { data, error } = await client.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${outreachOrigin()}/api/outreach/auth/callback?authorization_id=${encodeURIComponent(id)}` } });
      if (error || !data.url) throw new OutreachError("service_unavailable");
      return NextResponse.redirect(data.url, 303);
    }
    const client = await requireOperator();
    const details = await client.auth.oauth.getAuthorizationDetails(id);
    if (details.error || !details.data || !("client" in details.data) || details.data.client.id !== requiredSetting("OUTREACH_OAUTH_CLIENT_ID")) throw new OutreachError("invalid_request", 400);
    const action = form.get("action");
    if (action !== "approve" && action !== "deny") throw new OutreachError("invalid_request", 400);
    const response = action === "approve" ? await client.auth.oauth.approveAuthorization(id, { skipBrowserRedirect: true }) : await client.auth.oauth.denyAuthorization(id, { skipBrowserRedirect: true });
    if (response.error || !response.data) throw new OutreachError("service_unavailable");
    return NextResponse.redirect(response.data.redirect_url, 303);
  } catch (error) { return preferenceError("oauth_consent", error); }
}

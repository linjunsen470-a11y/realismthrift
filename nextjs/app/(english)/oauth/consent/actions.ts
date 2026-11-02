"use server";

import { redirect } from "next/navigation";
import { requireOperator, validAuthorizationId } from "@/lib/outreach/auth";
import { requiredSetting } from "@/lib/outreach/config";

// Next.js handles same-origin protection and navigation for these server actions.
export async function decideConnection(id: string, approve: boolean) {
  if (!validAuthorizationId(id)) throw new Error("This authorization link is unavailable.");
  const client = await requireOperator();
  const { data, error } = await client.auth.oauth.getAuthorizationDetails(id);
  if (error || !data) throw new Error("This authorization link has expired. Start the connection again.");
  if ("redirect_url" in data) redirect(data.redirect_url);
  if (data.client.id !== requiredSetting("OUTREACH_OAUTH_CLIENT_ID")) throw new Error("This connection is not allowed.");
  const result = approve
    ? await client.auth.oauth.approveAuthorization(id, { skipBrowserRedirect: true })
    : await client.auth.oauth.denyAuthorization(id, { skipBrowserRedirect: true });
  if (result.error || !result.data) throw new Error("Unable to connect. Please try again.");
  redirect(result.data.redirect_url);
}

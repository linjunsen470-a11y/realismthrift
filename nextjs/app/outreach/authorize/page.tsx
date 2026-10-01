import { operatorAuthClient, validAuthorizationId } from "@/lib/outreach/auth";
import { requiredSetting } from "@/lib/outreach/config";
import { redirect } from "next/navigation";

export default async function AuthorizePage({ searchParams }: { searchParams: Promise<{ authorization_id?: string }> }) {
  const { authorization_id: id } = await searchParams;
  if (!validAuthorizationId(id)) return <p>This authorization link is unavailable.</p>;
  let client;
  try { client = await operatorAuthClient(); } catch { return <p>The outreach connection is not configured yet.</p>; }
  const { data: { user } } = await client.auth.getUser();
  if (!user) return (
    <form action="/api/outreach/authorize" method="post">
      <h1 className="mb-4 font-montserrat text-2xl">Connect outreach tools</h1>
      <p className="mb-6 leading-7">Sign in with the authorized operator account.</p>
      <input type="hidden" name="authorization_id" value={id} /><input type="hidden" name="action" value="login" />
      <button className="w-full rounded-lg bg-brand-dark p-3 font-bold text-white">Sign in with Google</button>
    </form>
  );
  if (user.id !== requiredSetting("OUTREACH_OPERATOR_USER_ID")) return <p>This account cannot access the outreach tools.</p>;
  const { data, error } = await client.auth.oauth.getAuthorizationDetails(id);
  if (error || !data) return <p>This authorization link has expired. Start the connection again.</p>;
  if ("redirect_url" in data) redirect(data.redirect_url);
  if (data.client.id !== requiredSetting("OUTREACH_OAUTH_CLIENT_ID")) return <p>This client is not authorized for outreach tools.</p>;
  return (
    <form action="/api/outreach/authorize" method="post">
      <h1 className="mb-4 font-montserrat text-2xl">Connect {data.client.name || "outreach tools"}</h1>
      <p className="mb-6 leading-7">Allow your assistant to review registered drafts, send a draft after your explicit approval, and reconcile uncertain sends. Scheduled summaries must not send marketing emails.</p>
      <input type="hidden" name="authorization_id" value={id} />
      <button name="action" value="approve" className="w-full rounded-lg bg-brand-dark p-3 font-bold text-white">Allow connection</button>
      <button name="action" value="deny" className="mt-4 w-full text-sm underline">Cancel</button>
    </form>
  );
}

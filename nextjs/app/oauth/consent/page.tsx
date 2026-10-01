import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { operatorAuthClient, validAuthorizationId } from "@/lib/outreach/auth";
import { requiredSetting } from "@/lib/outreach/config";
import { decideConnection } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Connect RealismThrift Cold Email", robots: { index: false, follow: false }, referrer: "same-origin" };

export default async function ConsentPage({ searchParams }: { searchParams: Promise<{ authorization_id?: string }> }) {
  const { authorization_id: id } = await searchParams;
  if (!validAuthorizationId(id)) return <p>This authorization link is unavailable.</p>;
  const client = await operatorAuthClient();
  const { data: { user } } = await client.auth.getUser();
  let content;
  if (!user) content = (
    <form action="/api/outreach/google" method="post">
      <h1 className="mb-4 font-montserrat text-2xl">Connect RealismThrift Cold Email</h1>
      <p className="mb-6 leading-7">Sign in with your Jason account to connect.</p>
      <input type="hidden" name="authorization_id" value={id} /><input type="hidden" name="action" value="login" />
      <button className="w-full rounded-lg bg-brand-dark p-3 font-bold text-white">Sign in with Google</button>
    </form>
  );
  else if (user.id !== requiredSetting("OUTREACH_OPERATOR_USER_ID")) content = <p>Please use your authorized Jason account.</p>;
  else {
    const { data, error } = await client.auth.oauth.getAuthorizationDetails(id);
    if (error || !data) content = <p>This authorization link has expired. Start the connection again from ChatGPT.</p>;
    else if ("redirect_url" in data) redirect(data.redirect_url);
    else if (data.client.id !== requiredSetting("OUTREACH_OAUTH_CLIENT_ID")) content = <p>This connection is not allowed.</p>;
    else content = (
      <div>
        <h1 className="mb-4 font-montserrat text-2xl">Connect RealismThrift Cold Email</h1>
        <p className="mb-6 leading-7">Let ChatGPT check contacts and prepare your cold email drafts. Sending each email still needs your approval.</p>
        <form action={decideConnection.bind(null, id, true)}><button className="w-full rounded-lg bg-brand-dark p-3 font-bold text-white">Allow connection</button></form>
        <form action={decideConnection.bind(null, id, false)}><button className="mt-4 w-full text-sm underline">Cancel</button></form>
      </div>
    );
  }
  return <section className="w-full max-w-[480px] rounded-xl border border-[#e7e7df] bg-white p-8 shadow-sm">{content}</section>;
}

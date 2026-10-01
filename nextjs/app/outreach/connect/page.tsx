import { requireOperator } from "@/lib/outreach/auth";
import { operatorAuthClient } from "@/lib/outreach/auth";

export default async function ConnectPage({ searchParams }: { searchParams: Promise<{ connected?: string }> }) {
  const { connected } = await searchParams;
  try { await requireOperator(); } catch {
    let configured = true;
    try { await operatorAuthClient(); } catch { configured = false; }
    return configured ? <form action="/api/outreach/google" method="post"><h1 className="mb-4 font-montserrat text-2xl">Connect Gmail</h1><input type="hidden" name="action" value="login" /><button className="rounded-lg bg-brand-dark p-3 text-white">Sign in as operator</button></form> : <p>The outreach connection is not configured yet.</p>;
  }
  return (
    <form action="/api/outreach/google" method="post">
      <h1 className="mb-4 font-montserrat text-2xl">{connected === "1" ? "Gmail connected" : "Connect Gmail"}</h1>
      <p className="mb-6 leading-7">Authorize jason@realismthriftglobal.com to read messages and send reviewed drafts. Marketing sending stays disabled until RFC 8058 has been verified.</p>
      <button className="w-full rounded-lg bg-brand-dark p-3 font-bold text-white">{connected === "1" ? "Reconnect Gmail" : "Authorize Gmail access"}</button>
    </form>
  );
}

import type { Metadata } from "next";
export const metadata: Metadata = { title: "Outreach connection", robots: { index: false, follow: false }, referrer: "same-origin" };
export const dynamic = "force-dynamic";
export default function OutreachLayout({ children }: { children: React.ReactNode }) {
  return <section className="w-full max-w-[480px] rounded-xl border border-[#e7e7df] bg-white p-8 shadow-sm">{children}</section>;
}

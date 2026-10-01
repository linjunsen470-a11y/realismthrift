import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Email preferences",
  description: "Manage your RealismThrift email preferences.",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
  openGraph: { title: "Email preferences", description: "Manage your email preferences.", images: [] },
  twitter: { card: "summary", title: "Email preferences", images: [] },
};
export const dynamic = "force-dynamic";
export default function PreferencesLayout({ children }: { children: React.ReactNode }) {
  return <section className="w-full max-w-[480px] rounded-xl border border-[#e7e7df] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.035)] sm:p-8">{children}</section>;
}

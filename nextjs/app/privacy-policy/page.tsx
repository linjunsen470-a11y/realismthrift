import { createPageMetadata } from "@/lib/metadata";
import "../internal-pages.css";
import Link from "next/link";
import { ShieldCheck, Lock, Eye, Globe } from "lucide-react";
import { companyAddress, siteFooter } from "@/data/siteData";

export const metadata = createPageMetadata({
  title: "Privacy Policy",
  description: "Learn how RealismThrift handles and protects your personal information and data in our global wholesale operations.",
  openGraph: {
    title: "RealismThrift Privacy Policy",
    description: "Our commitment to data protection and privacy for our global wholesale partners.",
  },
  alternates: {
    canonical: "/privacy-policy",
  },
});

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#fcfcf9]">
      {/* PAGE HERO */}
      <section className="rt-legal-hero relative overflow-hidden bg-[#1a1a1a]">
        <div className="rt-container relative z-10">
          <div className="max-w-[800px]">
            <nav className="rt-breadcrumb mb-5 justify-start">
              <Link href="/">Home</Link>
              <span>›</span>
              <span className="text-white/70">Privacy Policy</span>
            </nav>
            <div className="rt-legal-tag">PRIVACY</div>
            <h1 className="rt-page-hero-title text-white mb-4">Privacy <span className="text-brand-gold">Policy</span></h1>
            <p className="text-white/60 text-lg leading-relaxed">
              Last updated: October 4, 2026. This policy explains how we protect your personal data in our global wholesale operations.
            </p>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="pb-24">
        <div className="rt-container">
          <div className="rt-legal-grid">
            {/* MAIN CONTENT */}
            <div className="rt-legal-content-shell">
              <div className="rt-prose max-w-none">
                <h2>1. Information We Collect</h2>
                <p>
                  We collect information to provide better services to all our users. The types of personal information we collect include:
                </p>
                <ul>
                  <li><strong>Contact Information:</strong> Name, email address, phone number, and WhatsApp ID when you fill out an inquiry form.</li>
                  <li><strong>Business Information:</strong> Company name, country, and specific product interests for wholesale purposes.</li>
                  <li><strong>Business Outreach:</strong> Relevant business contact details and their source, including company websites, business cards, and trade fair contacts, together with records of communication and email preferences.</li>
                  <li><strong>Technical Data:</strong> IP address and request information used for security and rate limits, and limited website analytics. Our private operator connection uses authentication cookies.</li>
                </ul>

                <h2>2. How We Use Information</h2>
                <p>
                  We use the information we collect for the following purposes:
                </p>
                <ul>
                  <li>To process and respond to your wholesale inquiries.</li>
                  <li>To provide customer support and send order updates.</li>
                  <li>To contact relevant wholesale businesses where permitted and honor their marketing preferences.</li>
                  <li>To improve our website functionality and user experience.</li>
                  <li>To comply with legal obligations and export regulations.</li>
                </ul>

                <h2>3. Data Security</h2>
                <p>
                  We implement a variety of security measures to maintain the safety of your personal information. Your personal information is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems.
                </p>
                <p>
                  Website inquiry records and their delivery history are normally retained for 24 months from submission and are then deleted automatically, unless a longer period is required for an active business relationship or by law.
                </p>
                <p>
                  Business outreach information and email metadata are normally retained for 24 months, subject to an active business relationship or legal requirements. We retain current permission evidence and the minimum information needed to honor unsubscribe and safety restrictions while operating our marketing program.
                </p>

                <h2>4. Disclosure to Third Parties</h2>
                <p>
                  We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information. This does not include website hosting partners and other parties who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential.
                </p>
                <p>
                  We use Vercel to host and operate the website, Resend to deliver inquiry notifications and automated confirmations, and Supabase to securely store inquiry records. These providers process only the information needed to perform those services on our behalf.
                </p>
                <p>
                  We use Google Workspace Gmail for business correspondence and Neon to store outreach records and email preferences. Supabase also authenticates our private operator tools. Resend delivers confirmation emails that you request when updating your email preferences.
                </p>

                <h2>5. Analytics</h2>
                <p>
                  We use Google Analytics 4 to understand basic website traffic, such as page views and general visitor location. We do not use Google Ads, Meta Pixel, advertising personalization, or remarketing technologies.
                </p>
                <p>
                  Google Analytics uses first-party analytics cookies to distinguish visitors and measure sessions, page views, and inquiry completion. Advertising storage, advertising user data, advertising personalization, and Google Signals are disabled. We do not send inquiry names, email addresses, phone numbers, or message contents to Google Analytics. You can block or delete analytics cookies through your browser settings. Google may process analytics information in accordance with its own privacy policy.
                </p>

                <h2>6. Your Rights</h2>
                <p>
                  You have the right to access, correct, or delete your personal data, including information submitted through our inquiry form. If you wish to exercise these rights, please contact us at <a href="mailto:privacy@realismthrift.com">privacy@realismthrift.com</a>.
                </p>
                <p>
                  You can stop marketing emails through the unsubscribe link in an email or by contacting us. Replying or submitting an inquiry does not restore marketing permission. Receiving marketing again requires a separate request and email confirmation. Email preference pages do not load analytics scripts.
                </p>

                <h2>7. Contact Us</h2>
                <p>
                  If there are any questions regarding this privacy policy, you may contact us using the information below:
                </p>
                <p className="font-bold">
                  Dongguan Huihe Realismthrift Trading Co., Ltd.<br />
                  {companyAddress}<br />
                  Email: {siteFooter.brand.email}
                </p>
              </div>
            </div>

            {/* SIDEBAR */}
            <aside className="space-y-6">
              <div className="rt-legal-sidebar-card p-8">
                <ShieldCheck className="text-brand-gold mb-4" size={32} />
                <h3 className="text-lg font-bold mb-3 font-montserrat">Data Trust</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  We restrict access to contact information and keep a record of email preference changes.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <Lock size={14} className="text-brand-gold" />
                    <span>SSL Encrypted</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <Eye size={14} className="text-brand-gold" />
                    <span>No Data Selling</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <Globe size={14} className="text-brand-gold" />
                    <span>Email Preferences</span>
                  </div>
                </div>
              </div>

              <div className="rt-legal-sidebar-card p-8 bg-brand-light">
                <h4 className="font-bold mb-3 font-montserrat text-brand-dark">Need Help?</h4>
                <p className="text-sm text-gray-500 mb-6">
                  Have questions about our terms or privacy?
                </p>
                <Link href="/contact-us" className="inline-block w-full text-center py-3 bg-brand-red text-white rounded-sm font-bold text-[0.8rem] hover:bg-brand-red-dark transition-colors">
                  Contact Support
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}

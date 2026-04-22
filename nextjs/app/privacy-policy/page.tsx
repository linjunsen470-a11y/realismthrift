import Link from "next/link";
import { ShieldCheck, Lock, Eye, Globe } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | RealismThrift Export Co., Ltd",
  description: "Learn how RealismThrift handles and protects your personal information and data in our global wholesale operations.",
  openGraph: {
    title: "RealismThrift Privacy Policy",
    description: "Our commitment to data protection and privacy for our global wholesale partners.",
  }
};

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-[#fcfcf9]">
      {/* PAGE HERO */}
      <section className="rt-legal-hero relative overflow-hidden bg-[#1a1a1a]">
        <div className="rt-container relative z-10">
          <div className="max-w-[800px]">
            <div className="rt-legal-tag">PRIVACY</div>
            <h1 className="rt-page-hero-title text-white mb-4">Privacy <span className="text-brand-gold">Policy</span></h1>
            <p className="text-white/60 text-lg leading-relaxed">
              Last updated: April 21, 2026. This policy explains how we protect your personal data in our global wholesale operations.
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
                  <li><strong>Technical Data:</strong> IP address, browser type, and usage patterns collected via cookies and similar technologies.</li>
                </ul>

                <h2>2. How We Use Information</h2>
                <p>
                  We use the information we collect for the following purposes:
                </p>
                <ul>
                  <li>To process and respond to your wholesale inquiries.</li>
                  <li>To provide customer support and send order updates.</li>
                  <li>To improve our website functionality and user experience.</li>
                  <li>To comply with legal obligations and export regulations.</li>
                </ul>

                <h2>3. Data Security</h2>
                <p>
                  We implement a variety of security measures to maintain the safety of your personal information. Your personal information is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems.
                </p>

                <h2>4. Disclosure to Third Parties</h2>
                <p>
                  We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information. This does not include website hosting partners and other parties who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential.
                </p>

                <h2>5. Cookies Policy</h2>
                <p>
                  Cookies are small files that a site or its service provider transfers to your computer&apos;s hard drive through your Web browser that enables the site&apos;s or service provider&apos;s systems to recognize your browser and capture and remember certain information. We use cookies to help us understand your preferences based on previous or current site activity.
                </p>

                <h2>6. Your Rights</h2>
                <p>
                  You have the right to access, correct, or delete your personal data. If you wish to exercise these rights, please contact us at <a href="mailto:privacy@realismthrift.com">privacy@realismthrift.com</a>.
                </p>

                <h2>7. Contact Us</h2>
                <p>
                  If there are any questions regarding this privacy policy, you may contact us using the information below:
                </p>
                <p className="font-bold">
                  RealismThrift Export Co., Ltd<br />
                  Fuyida Industrial Park, No. 52 Yida Road, Boluo County, Huizhou City, Guangdong Province, China<br />
                  Email: sales@realismthrift.com
                </p>
              </div>
            </div>

            {/* SIDEBAR */}
            <aside className="space-y-6">
              <div className="rt-legal-sidebar-card p-8">
                <ShieldCheck className="text-brand-gold mb-4" size={32} />
                <h3 className="text-lg font-bold mb-3 font-montserrat">Data Trust</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  We are committed to international data protection standards (GDPR/CCPA) for our global wholesale partners.
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
                    <span>Global Compliance</span>
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
    </main>
  );
}

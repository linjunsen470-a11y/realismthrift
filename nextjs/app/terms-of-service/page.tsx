import Link from "next/link";
import { Scale, FileText, CheckCircle, HelpCircle } from "lucide-react";

export const metadata = {
  title: "Terms of Service | RealismThrift Export Co., Ltd",
  description: "Read our terms and conditions for wholesale orders and website usage.",
};

export default function TermsOfServicePage() {
  return (
    <main className="bg-[#fcfcf9]">
      {/* PAGE HERO */}
      <section className="rt-legal-hero relative overflow-hidden bg-[#1a1a1a]">
        <div className="rt-container relative z-10">
          <div className="max-w-[800px]">
            <div className="rt-legal-tag">TERMS</div>
            <h1 className="rt-page-hero-title text-white mb-4">Terms of <span className="text-brand-gold">Service</span></h1>
            <p className="text-white/60 text-lg leading-relaxed">
              Effective Date: April 21, 2026. These terms govern your business relationship with RealismThrift Export Co., Ltd.
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
                <h2>1. Acceptance of Terms</h2>
                <p>
                  By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using this website&apos;s particular services, you shall be subject to any posted guidelines or rules applicable to such services.
                </p>

                <h2>2. Wholesale Account & Inquiries</h2>
                <p>
                  Our services are primarily intended for wholesale business entities. By submitting an inquiry, you represent that you are a business representative. You are responsible for maintaining the confidentiality of any account information and for all activities that occur under your business name.
                </p>

                <h2>3. Ordering & Payment</h2>
                <p>
                  All orders are subject to acceptance by RealismThrift Export Co., Ltd.
                </p>
                <ul>
                  <li><strong>Price Quotations:</strong> Valid for 15 days unless otherwise specified.</li>
                  <li><strong>Deposits:</strong> A 30% non-refundable deposit is required to initiate sorting and packing.</li>
                  <li><strong>Balance:</strong> Full payment of the remaining 70% is required before container loading and shipment.</li>
                  <li><strong>Currency:</strong> All transactions are processed in USD unless agreed otherwise.</li>
                </ul>

                <h2>4. Shipping & Export</h2>
                <p>
                  We handle the export process from China. However:
                </p>
                <ul>
                  <li>Delivery timelines are estimates and not guarantees.</li>
                  <li>RealismThrift is not responsible for delays caused by shipping lines or customs inspections at destination.</li>
                  <li>Import duties, taxes, and local clearance fees are the sole responsibility of the buyer.</li>
                </ul>

                <h2>5. Quality Standards & Claims</h2>
                <p>
                  We maintain A-Grade quality standards. If you receive goods that significantly deviate from the agreed specifications:
                </p>
                <ul>
                  <li>Claims must be submitted within 30 days of receiving the container.</li>
                  <li>High-quality photo and video evidence of the issues must be provided.</li>
                  <li>Approved claims will be compensated via credit on the subsequent order or replacement goods.</li>
                </ul>

                <h2>6. Intellectual Property</h2>
                <p>
                  The website and its original content, features, and functionality are owned by RealismThrift Export Co., Ltd and are protected by international copyright, trademark, and other intellectual property laws.
                </p>

                <h2>7. Limitation of Liability</h2>
                <p>
                  RealismThrift Export Co., Ltd shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of the service or products purchased.
                </p>

                <h2>8. Governing Law</h2>
                <p>
                  These terms shall be governed and construed in accordance with the laws of the People&apos;s Republic of China, without regard to its conflict of law provisions.
                </p>
              </div>
            </div>

            {/* SIDEBAR */}
            <aside className="space-y-6">
              <div className="rt-legal-sidebar-card p-8">
                <Scale className="text-brand-red mb-4" size={32} />
                <h3 className="text-lg font-bold mb-3 font-montserrat text-brand-dark">Business Compliance</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  Our terms are designed to ensure a transparent and fair trading environment for global wholesalers.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <CheckCircle size={14} className="text-brand-red" />
                    <span>Transparent Pricing</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <CheckCircle size={14} className="text-brand-red" />
                    <span>Clear Quality Grades</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <CheckCircle size={14} className="text-brand-red" />
                    <span>Secure Transactions</span>
                  </div>
                </div>
              </div>

              <div className="rt-legal-sidebar-card p-8 bg-brand-light">
                <HelpCircle className="text-brand-gold mb-4" size={32} />
                <h4 className="font-bold mb-3 font-montserrat">Have a Question?</h4>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                  If you have any doubts about our wholesale terms, our sales team is here to help.
                </p>
                <Link href="/contact-us" className="inline-block w-full text-center py-3 bg-brand-gold text-brand-dark rounded-sm font-bold text-[0.8rem] hover:transform hover:-translate-y-1 transition-all">
                  Contact Sales
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

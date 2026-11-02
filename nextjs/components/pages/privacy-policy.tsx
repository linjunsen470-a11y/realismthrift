import { TranslatedText } from "@/components/TranslatedText";
import { createPageMetadata } from "@/lib/metadata";
import "@/app/internal-pages.css";
import Link from "next/link";
import { ShieldCheck, Lock, Eye, Globe } from "lucide-react";
import {
  companyAddress,
  siteFooter as englishSiteFooter,
} from "@/data/siteData";
import {
  getTranslator,
  getLocalizedData,
  localizeMetadata,
} from "@/lib/i18n/server";
import { localePath, type Locale } from "@/lib/i18n/routing";

export function getPageMetadata(locale: Locale = "en") {
  const t = getTranslator(locale);
  return localizeMetadata(
    createPageMetadata({
      title: t("Privacy Policy"),
      description: t(
        "Learn how RealismThrift handles and protects your personal information and data in our global wholesale operations.",
      ),
      openGraph: {
        title: t("RealismThrift Privacy Policy"),
        description: t(
          "Our commitment to data protection and privacy for our global wholesale partners.",
        ),
      },
      alternates: {
        canonical: "/privacy-policy",
      },
    }),
    locale,
  );
}

export default function PrivacyPolicyPage({
  locale = "en",
}: { locale?: Locale } = {}) {
  const t = getTranslator(locale);
  const siteFooter = getLocalizedData(englishSiteFooter, locale);

  return (
    <div className="bg-[#fcfcf9]">
      {/* PAGE HERO */}
      <section className="rt-legal-hero relative overflow-hidden bg-[#1a1a1a]">
        <div className="rt-container relative z-10">
          <div className="max-w-[800px]">
            <nav className="rt-breadcrumb mb-5 justify-start">
              <Link href={localePath("/", locale)}>{t("Home")}</Link>
              <span>›</span>
              <span className="text-white/70">{t("Privacy Policy")}</span>
            </nav>
            <div className="rt-legal-tag">{t("PRIVACY")}</div>
            <h1 className="rt-page-hero-title text-white mb-4">
              {locale === "en" ? (
                <>
                  {t("Privacy ")}
                  <span className="text-brand-gold">{t("Policy")}</span>
                </>
              ) : (
                t("Privacy Policy")
              )}
            </h1>
            <p className="text-white/60 text-lg leading-relaxed">
              {t(
                "Last updated: November 3, 2026. This policy explains how we protect your personal data in our global wholesale operations.",
              )}
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
                <h2>{t("1. Information We Collect")}</h2>
                <p>
                  {t(
                    "We collect information to provide better services to all our users. The types of personal information we collect include:",
                  )}
                </p>
                <ul>
                  <li>
                    <strong>{t("Contact Information:")}</strong>
                    {t(
                      " Name, email address, phone number, and WhatsApp ID when you fill out an inquiry form.",
                    )}
                  </li>
                  <li>
                    <strong>{t("Business Information:")}</strong>
                    {t(
                      " Company name, country, and specific product interests for wholesale purposes.",
                    )}
                  </li>
                  <li>
                    <strong>{t("Business Outreach:")}</strong>
                    {t(
                      " Relevant business contact details and their source, including company websites, business cards, and trade fair contacts, together with records of communication and email preferences.",
                    )}
                  </li>
                  <li>
                    <strong>{t("Technical Data:")}</strong>
                    {t(
                      " IP address and request information used for security and rate limits, limited website analytics, and advertising measurement events for page views and successful inquiries. Our private operator connection uses authentication cookies.",
                    )}
                  </li>
                </ul>

                <h2>{t("2. How We Use Information")}</h2>
                <p>
                  {t(
                    "We use the information we collect for the following purposes:",
                  )}
                </p>
                <ul>
                  <li>
                    {t("To process and respond to your wholesale inquiries.")}
                  </li>
                  <li>
                    {t("To provide customer support and send order updates.")}
                  </li>
                  <li>
                    {t(
                      "To contact relevant wholesale businesses where permitted and honor their marketing preferences.",
                    )}
                  </li>
                  <li>
                    {t(
                      "To improve our website functionality and user experience.",
                    )}
                  </li>
                  <li>
                    {t(
                      "To measure page views and successful inquiry submissions for site analytics and advertising.",
                    )}
                  </li>
                  <li>
                    {t(
                      "To comply with legal obligations and export regulations.",
                    )}
                  </li>
                </ul>

                <p>
                  {t(
                    "We use your browser language and country inferred from your IP address to choose a website language. A session cookie prevents repeated automatic changes, and a language preference cookie remembers your manual choice for one year. You can delete these cookies through your browser settings.",
                  )}
                </p>

                <h2>{t("3. Data Security")}</h2>
                <p>
                  {t(
                    "We implement a variety of security measures to maintain the safety of your personal information. Your personal information is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems.",
                  )}
                </p>
                <p>
                  {t(
                    "Website inquiry records and their delivery history are normally retained for 24 months from submission and are then deleted automatically, unless a longer period is required for an active business relationship or by law.",
                  )}
                </p>
                <p>
                  {t(
                    "Business outreach information and email metadata are normally retained for 24 months, subject to an active business relationship or legal requirements. We retain current permission evidence and the minimum information needed to honor unsubscribe and safety restrictions while operating our marketing program.",
                  )}
                </p>

                <h2>{t("4. Disclosure to Third Parties")}</h2>
                <p>
                  {t(
                    "We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information. This does not include website hosting partners and other parties who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential.",
                  )}
                </p>
                <p>
                  {t(
                    "We use Vercel to host and operate the website, Resend to deliver inquiry notifications and automated confirmations, and Supabase to securely store inquiry records. These providers process only the information needed to perform those services on our behalf. Meta receives the browser Pixel events and the server-side Conversions API Lead described below. Browser Pixel events do not include inquiry contact details. Server-side Lead events include a hashed email and, when valid, a hashed international WhatsApp number for matching, as described below.",
                  )}
                </p>
                <p>
                  {t(
                    "We use Google Workspace Gmail for business correspondence and Neon to store outreach records and email preferences. Supabase also authenticates our private operator tools. Resend delivers confirmation emails that you request when updating your email preferences.",
                  )}
                </p>

                <h2>{t("5. Analytics and Advertising Measurement")}</h2>
                <p>
                  {t(
                    "We use Google Analytics 4 to understand basic website traffic, such as page views and general visitor location. We do not use Google Ads. Advertising storage, advertising user data, advertising personalization, and Google Signals are disabled for Google Analytics.",
                  )}
                </p>
                <p>
                  {t(
                    "Google Analytics uses first-party analytics cookies to distinguish visitors and measure sessions, page views, and inquiry completion. We do not send inquiry names, email addresses, phone numbers, WhatsApp numbers, or message contents to Google Analytics. You can block or delete analytics cookies through your browser settings. Google may process analytics information in accordance with its own privacy policy.",
                  )}
                </p>
                <p>
                  <TranslatedText
                    locale={locale}
                    text={
                      'We use the Meta Pixel to measure advertising and conversions. On public pages it records a PageView. When an inquiry form is submitted successfully, the browser records a Lead event with the product category you selected, or "not specified" if you left that field blank. Our server then sends the same Lead to Meta through the Conversions API, using one shared event id so Meta can deduplicate the browser and server events. The browser Pixel does not receive your inquiry contact details. After an inquiry is successfully saved, our server normalizes your email address and sends its SHA-256 hash to Meta through the Conversions API to help match the Lead to a Meta account. If your WhatsApp number includes an explicit international prefix and passes number validation, our server also sends its SHA-256 hash for matching. Numbers without a reliable country code or with an invalid format are omitted from phone matching; your inquiry is still saved. We do not send your plaintext email address, plaintext phone or WhatsApp number, name, company, country, or message to Meta. The server event may include technical information such as IP address, browser type, and page address. When available, the server also forwards the existing {browserId} browser identifier and {clickId} advertising click identifier to help match events. When a landing URL contains a real Meta advertising click identifier (fbclid), we save it in the first-party {clickCookie} cookie for up to 90 days so it remains available if you visit another page before submitting an inquiry. We preserve its original capture time for the same click and update it for a new advertising click. Visits without a click identifier do not create one. Meta may also receive technical information from the browser pixel, such as the {browserCookie} cookie, and may use that information to measure and optimize ads under {policy}. Email preference pages and private operator pages do not load Google Analytics or the Meta Pixel.'
                    }
                    values={{
                      browserId: <code dir="ltr">_fbp</code>,
                      clickId: <code dir="ltr">_fbc</code>,
                      clickCookie: <code dir="ltr">_fbc</code>,
                      browserCookie: <code dir="ltr">_fbp</code>,
                      policy: (
                        <a
                          href="https://www.facebook.com/privacy/policy/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {t("Meta's privacy policy")}
                        </a>
                      ),
                    }}
                  />
                </p>

                <h2>{t("6. Your Rights")}</h2>
                <p>
                  <TranslatedText
                    locale={locale}
                    text={
                      "You have the right to access, correct, or delete your personal data, including information submitted through our inquiry form. If you wish to exercise these rights, please contact us at {email}."
                    }
                    values={{
                      email: (
                        <a href="mailto:privacy@realismthrift.com">
                          privacy@realismthrift.com
                        </a>
                      ),
                    }}
                  />
                </p>
                <p>
                  {t(
                    "You can stop marketing emails through the unsubscribe link in an email or by contacting us. Replying or submitting an inquiry does not restore marketing permission. Receiving marketing again requires a separate request and email confirmation. Email preference pages do not load analytics or Meta Pixel scripts.",
                  )}
                </p>

                <h2>{t("7. Contact Us")}</h2>
                <p>
                  {t(
                    "If there are any questions regarding this privacy policy, you may contact us using the information below:",
                  )}
                </p>
                <p className="font-bold">
                  {t("Dongguan Huihe Realismthrift Trading Co., Ltd.")}
                  <br />
                  <span
                    className="rt-postal-address"
                    lang={locale}
                    dir={locale === "ar" ? "rtl" : "ltr"}
                  >
                    {t(companyAddress)}
                  </span>
                  <br />
                  {t("Email: {v0}", { v0: siteFooter.brand.email })}
                </p>
              </div>
            </div>

            {/* SIDEBAR */}
            <aside className="space-y-6">
              <div className="rt-legal-sidebar-card p-8">
                <ShieldCheck className="text-brand-gold mb-4" size={32} />
                <h3 className="text-lg font-bold mb-3 font-montserrat">
                  {t("Data Trust")}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  {t(
                    "We restrict access to contact information and keep a record of email preference changes.",
                  )}
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <Lock size={14} className="text-brand-gold" />
                    <span>{t("SSL Encrypted")}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <Eye size={14} className="text-brand-gold" />
                    <span>{t("No Data Selling")}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <Globe size={14} className="text-brand-gold" />
                    <span>{t("Email Preferences")}</span>
                  </div>
                </div>
              </div>

              <div className="rt-legal-sidebar-card p-8 bg-brand-light">
                <h4 className="font-bold mb-3 font-montserrat text-brand-dark">
                  {t("Need Help?")}
                </h4>
                <p className="text-sm text-gray-500 mb-6">
                  {t("Have questions about our terms or privacy?")}
                </p>
                <Link
                  href={localePath("/contact-us", locale)}
                  className="inline-block w-full text-center py-3 bg-brand-red text-white rounded-sm font-bold text-[0.8rem] hover:bg-brand-red-dark transition-colors"
                >
                  {t("Contact Support")}
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}

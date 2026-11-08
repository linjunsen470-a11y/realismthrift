import { createPageMetadata } from "@/lib/metadata";
import "@/app/internal-pages.css";
import Image from "next/image";
import Link from "next/link";
import { InquiryForm } from "@/components/InquiryForm";
import {
  companyStats as englishCompanyStats,
  companyAddress,
  companyLocation,
  siteFooter as englishSiteFooter,
} from "@/data/siteData";
import {
  Mail,
  Phone,
  MapPin,
  Building2,
  Clock,
  MessageCircle,
  Globe,
} from "lucide-react";
import {
  getClientMessages,
  getTranslator,
  getLocalizedData,
  localizeMetadata,
} from "@/lib/i18n/server";
import { localePath, type Locale } from "@/lib/i18n/routing";

export function getPageMetadata(locale: Locale = "en") {
  const t = getTranslator(locale);
  return localizeMetadata(
    createPageMetadata({
      title: t("Contact Us | Get Wholesale Used Clothes Quote"),
      description: t(
        "Get in touch for wholesale quotes and export information. Multilingual B2B sales support in English, French, Spanish, and Swahili during business hours.",
      ),
      openGraph: {
        title: t("Contact RealismThrift | Wholesale Sales & Support"),
        description: t(
          "Ready to start your wholesale order? Contact our multilingual sales team for direct factory pricing and shipping estimates.",
        ),
        images: ["/images/hero/contact-hero.webp"],
      },
      alternates: {
        canonical: "/contact-us",
      },
    }),
    locale,
  );
}

export default function ContactUsPage({
  locale = "en",
}: { locale?: Locale } = {}) {
  const t = getTranslator(locale);
  const companyStats = getLocalizedData(englishCompanyStats, locale);
  const siteFooter = getLocalizedData(englishSiteFooter, locale);

  return (
    <div className="bg-white">
      {/* 1. PAGE HERO */}
      <section className="relative py-16 md:py-24 bg-[#1A1A1A] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero/contact-hero.webp"
            alt={t(
              "RealismThrift Contact Center - Get Professional Wholesale Support for Used Clothes, Shoes, and Bags Export from China Factory",
            )}
            fill
            sizes="100vw"
            className="object-cover opacity-[0.08]"
            priority
          />
        </div>
        <div className="rt-container relative z-10 text-center">
          <nav className="rt-breadcrumb mb-5 justify-center">
            <Link href={localePath("/", locale)}>{t("Home")}</Link>
            <span>›</span>
            <span className="text-white/70">{t("Contact Us")}</span>
          </nav>
          <h1 className="font-montserrat text-[clamp(2.5rem,5vw,3rem)] font-extrabold text-white mb-4">
            {locale === "en" ? (
              <>
                {t("Contact ")}
                <span className="text-brand-gold">{t("Us")}</span>
              </>
            ) : (
              t("Contact Us")
            )}
          </h1>
          <p className="text-white/80 text-[1.0625rem] max-w-[600px] md:max-w-[850px] mx-auto mb-10 font-open-sans leading-[1.7]">
            {t(
              "Our sales team is available during business hours to answer your questions and provide price quotations. We speak English, French, Spanish, and Swahili.",
            )}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="mailto:sales@realismthrift.com"
              className="group bg-brand-gold text-brand-dark px-10 py-3 rounded-[3px] font-montserrat font-bold text-[0.875rem] transition-all hover:bg-brand-gold-dark hover:-translate-y-0.5 shadow-lg active:scale-95 flex items-center gap-2"
            >
              <Mail className="w-4 h-4 transition-transform group-hover:scale-110" />
              {t("Email Us")}
            </a>
            <a
              href="https://wa.me/8617279444062"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-[#137a3c] text-white px-10 py-3 rounded-[3px] font-montserrat font-bold text-[0.875rem] transition-all hover:bg-[#106631] hover:-translate-y-0.5 shadow-lg active:scale-95 flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 transition-transform group-hover:scale-110" />
              {t("WhatsApp")}
            </a>
          </div>
        </div>
      </section>

      {/* 2. CONTACT INFO CARDS - GRID OF 4 */}
      <div className="-mt-10 relative z-20 mb-12">
        <div className="rt-container">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {[
              {
                i: <Mail className="w-6 h-6 text-brand-red" />,
                t: t("Email"),
                s: t("Send us an email"),
                v: "sales@realismthrift.com",
                l: "mailto:sales@realismthrift.com",
                color: "bg-red-50",
              },
              {
                i: <MessageCircle className="w-6 h-6 text-[#25D366]" />,
                t: t("WhatsApp"),
                s: t("Chat with us now"),
                v: "+86 17279444062",
                l: "https://wa.me/8617279444062",
                color: "bg-green-50",
              },
              {
                i: <Phone className="w-6 h-6 text-brand-gold" />,
                t: t("Phone"),
                s: t("Call our sales team"),
                v: "+86 17279444062",
                l: "tel:+8617279444062",
                color: "bg-yellow-50",
              },
              {
                i: <MapPin className="w-6 h-6 text-brand-dark" />,
                t: t("Address"),
                s: t("Visit our factory"),
                v: t(companyAddress),
                l: companyLocation.mapsUrl,
                color: "bg-gray-100",
              },
            ].map((item) => (
              <div
                key={item.t}
                className="bg-white border border-[#eee] rounded-[12px] p-8 text-center shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all transform hover:-translate-y-1.5 group"
              >
                <div
                  className={`w-14 h-14 ${item.color} rounded-full flex items-center justify-center mx-auto mb-5 transition-transform group-hover:scale-110 group-hover:rotate-3`}
                >
                  {item.i}
                </div>
                <div className="font-montserrat text-[0.9375rem] font-bold text-brand-dark mb-1">
                  {item.t}
                </div>
                <div className="text-[0.8125rem] text-[#666] mb-5 font-open-sans">
                  {item.s}
                </div>
                <a
                  href={item.l}
                  target={
                    item.l === companyLocation.mapsUrl ? "_blank" : undefined
                  }
                  rel={
                    item.l === companyLocation.mapsUrl
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="text-brand-red text-[0.875rem] font-bold font-montserrat hover:text-brand-red-dark transition-colors break-words block"
                >
                  {item.v}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. MAIN CONTENT: Form + Sidebar Section */}
      <section className="pb-20 pt-8 bg-white">
        <div className="rt-container">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
            {/* INQUIRY FORM COLUMN */}
            <div>
              <div className="rt-subsection-heading">
                <h2>{t("Send Us an Inquiry")}</h2>
                <div className="rt-section-divider" />
              </div>
              <div className="bg-white border border-[#eee] rounded-[12px] p-8 md:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
                <InquiryForm
                  locale={locale}
                  messages={getClientMessages(locale, "form")}
                />
              </div>
            </div>

            {/* SIDEBAR */}
            <aside className="space-y-10">
              {/* FACTORY COMPANY INFO CARD */}
              <div className="bg-brand-dark rounded-[10px] p-7 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-red/10 rounded-bl-full -mr-12 -mt-12" />
                <h3 className="font-montserrat text-[0.9375rem] font-black text-brand-gold mb-6 uppercase tracking-[0.1em]">
                  {t("Company Profile")}
                </h3>
                <div className="space-y-5">
                  {[
                    {
                      i: <Building2 className="w-5 h-5 text-brand-gold" />,
                      l: t("Full Name"),
                      v: "Dongguan Huihe Realismthrift Trading Co., Ltd.",
                      dir: "ltr" as const,
                    },
                    {
                      i: <MapPin className="w-5 h-5 text-brand-gold" />,
                      l: t("Location"),
                      v: siteFooter.brand.address,
                    },
                    {
                      i: <Mail className="w-5 h-5 text-brand-gold" />,
                      l: t("Official Email"),
                      v: "sales@realismthrift.com",
                      dir: "ltr" as const,
                    },
                    {
                      i: <Phone className="w-5 h-5 text-brand-gold" />,
                      l: t("Sales Hotline"),
                      v: "+86 17279444062",
                      dir: "ltr" as const,
                    },
                    {
                      i: <Clock className="w-5 h-5 text-brand-gold" />,
                      l: t("Business Hours"),
                      v: t("Mon–Sat 8:00–20:00 (GMT+8)"),
                    },
                  ].map((item) => (
                    <div
                      key={item.l}
                      className="flex gap-4 text-[0.8125rem] border-b border-white/5 pb-4 last:border-0 last:pb-0"
                    >
                      <span className="shrink-0 opacity-80 pt-1">{item.i}</span>
                      <div>
                        <div className="text-white/70 text-[0.65rem] font-bold uppercase tracking-widest mb-1">
                          {item.l}
                        </div>
                        <div className="font-semibold text-white/95 leading-relaxed">
                          {item.dir ? <bdi dir={item.dir}>{item.v}</bdi> : item.v}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* 4. GLOBAL EXPORT MARKETS SECTION */}
      <section className="bg-brand-light py-20">
        <div className="rt-container">
          <div className="text-center mb-14">
            <span className="rt-section-badge inline-block">
              {t("Global Reach")}
            </span>
            <h2 className="font-montserrat text-[1.75rem] font-black text-brand-dark mb-3">
              {t("WE EXPORT TO {v0} COUNTRIES", {
                v0: companyStats.countriesCount,
              })}
            </h2>
            <div className="rt-section-divider center mb-6" />
            <p className="text-[#666] text-[0.9375rem] max-w-[640px] mx-auto font-open-sans italic">
              {t(
                "Our products reach buyers across 6 continents. Find your regional sales expertise below for localized wholesale solutions.",
              )}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              {
                r: t("Africa"),
                c: t(
                  "Nigeria, Ghana, Kenya, Tanzania, Ethiopia, Senegal, Ivory Coast, Cameroon, Uganda, Mozambique",
                ),
              },
              {
                r: t("Southeast Asia"),
                c: t(
                  "Vietnam, Thailand, Philippines, Indonesia, Malaysia, Cambodia, Myanmar, Laos",
                ),
              },
              {
                r: t("Middle East"),
                c: t("UAE, Saudi Arabia, Jordan, Lebanon, Yemen, Iraq"),
              },
              {
                r: t("Americas"),
                c: t(
                  "USA, Canada, Mexico, Brazil, Colombia, Peru, Chile, Ecuador",
                ),
              },
              {
                r: t("Europe"),
                c: t(
                  "UK, France, Germany, Poland, Romania, Ukraine, Bulgaria, Hungary",
                ),
              },
              {
                r: t("Oceania"),
                c: t(
                  "Australia, New Zealand, Papua New Guinea, Fiji, Solomon Islands",
                ),
              },
            ].map((market) => (
              <div
                key={market.r}
                className="bg-white p-7 rounded-[12px] shadow-sm hover:shadow-md transition-all border border-transparent hover:border-brand-red/10 group"
              >
                <div className="flex items-center gap-3 mb-4 border-b border-brand-light pb-3">
                  <Globe className="w-5 h-5 text-brand-red opacity-70 group-hover:opacity-100 transition-opacity" />
                  <div className="font-montserrat text-[1rem] font-bold text-brand-dark group-hover:text-brand-red transition-colors">
                    {market.r}
                  </div>
                </div>
                <p className="text-[0.8125rem] text-[#666] leading-relaxed font-open-sans">
                  {market.c}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. MAP SECTION */}
      <section className="py-20 bg-white">
        <div className="rt-container">
          <div className="max-w-[1000px] mx-auto">
            <div className="rt-subsection-heading">
              <h2>{t("Our Factory Location")}</h2>
              <div className="rt-section-divider" />
            </div>
            <div className="w-full h-[450px] rounded-[16px] overflow-hidden border border-[#eee] shadow-2xl relative">
              <iframe
                src={companyLocation.mapsEmbedUrl}
                width="100%"
                height="100%"
                title={t(
                  "Google Maps location of RealismThrift on County Road 193, Yuanzhou, Huizhou, China",
                )}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute w-full h-[calc(100%+85px)] -top-[85px] left-0 border-0"
              ></iframe>
            </div>
            <div className="mt-8 p-6 bg-brand-light rounded-[10px] border-s-4 border-brand-gold space-y-4">
              <div>
                <h3 className="font-montserrat font-bold text-brand-dark text-[1rem] mb-2 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-brand-red" />
                  {t("Factory Address")}
                </h3>
                <p
                  className="rt-postal-address text-[0.9375rem] text-[#444] font-open-sans leading-relaxed"
                  lang={locale}
                  dir={locale === "ar" ? "rtl" : "ltr"}
                >
                  {t(companyAddress)}
                </p>
                {locale !== "en" ? (
                  <p className="text-[0.875rem] text-[#666] font-open-sans mt-2">
                    {t("English address for navigation")}
                    <span
                      className="rt-postal-address block"
                      lang="en"
                      dir="ltr"
                    >
                      {companyAddress}
                    </span>
                  </p>
                ) : null}
                <p className="text-[0.875rem] text-[#666] font-open-sans mt-1">
                  {t("Chinese address for navigation")}
                  <span
                    className="rt-postal-address block"
                    lang="zh-CN"
                    dir="ltr"
                  >
                    {companyLocation.addressChinese}
                  </span>
                </p>
                <a
                  href={companyLocation.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-3 text-brand-red font-montserrat font-bold text-[0.875rem] hover:text-brand-red-dark transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                  {t("Open in Google Maps")}
                </a>
              </div>
              <div className="pt-4 border-t border-black/5">
                <h3 className="font-montserrat font-bold text-brand-dark text-[1rem] mb-2">
                  {t("DiDi Taxi Address")}
                </h3>
                <p
                  className="rt-postal-address text-[0.875rem] text-[#555] font-open-sans leading-relaxed"
                  lang={locale}
                  dir={locale === "ar" ? "rtl" : "ltr"}
                >
                  {t(companyLocation.didiAddress)}
                </p>
                {locale !== "en" ? (
                  <p className="text-[0.875rem] text-[#666] font-open-sans mt-2">
                    {t("English DiDi search address")}
                    <span
                      className="rt-postal-address block"
                      lang="en"
                      dir="ltr"
                    >
                      {companyLocation.didiAddress}
                    </span>
                  </p>
                ) : null}
                <p className="text-[0.875rem] text-[#666] font-open-sans mt-1">
                  {t("Chinese DiDi search address")}
                  <span
                    className="rt-postal-address block"
                    lang="zh-CN"
                    dir="ltr"
                  >
                    {companyLocation.didiAddressChinese}
                  </span>
                </p>
              </div>
              <div className="pt-4 border-t border-black/5">
                <p className="text-[0.875rem] text-[#555] font-open-sans leading-relaxed">
                  <strong className="text-brand-dark">
                    {t("Visiting our factory?")}
                  </strong>
                  {t(
                    " We welcome international buyers to visit our {v0} facility. Please contact your regional sales agent to schedule a tour and arrange airport pickup in Huizhou or Guangzhou.",
                    { v0: companyStats.facilitySize },
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

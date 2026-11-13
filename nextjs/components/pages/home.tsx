import { TranslatedText } from "@/components/TranslatedText";
import { createPageMetadata } from "@/lib/metadata";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  Clock3,
  ClipboardList,
  Globe2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Ship,
  ShieldCheck,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";
import {
  features as englishFeatures,
  orderSteps as englishOrderSteps,
  productsData as englishProductsData,
  companyStats as englishCompanyStats,
  companyAddress,
  siteFooter as englishSiteFooter,
} from "@/data/siteData";
import { InquiryForm } from "@/components/InquiryForm";
import { getLatestBlogPosts } from "@/lib/blog";
import { LatestBlogSection } from "@/components/blog/LatestBlogSection";

import {
  JsonLd,
  getOrganizationSchema,
  getWebsiteSchema,
  getFaqSchema,
} from "@/components/JsonLd";
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
      title: t("Wholesale Used Clothes, Shoes & Bags Supplier"),
      description: t(
        "RealismThrift supplies sorted second-hand clothes, shoes, and bags from China with wholesale packing, grading, and export support.",
      ),
      openGraph: {
        title: t(
          "RealismThrift | Global Wholesale Supplier of Used Clothes, Shoes & Bags",
        ),
        description: t(
          "Supplier of sorted second-hand clothes, shoes, and bags from China with grading and export support.",
        ),
        images: ["/img/og-realismthrift.webp"],
      },
      alternates: {
        canonical: "/",
      },
    }),
    locale,
  );
}

export default async function Home({
  locale = "en",
}: { locale?: Locale } = {}) {
  const t = getTranslator(locale);
  const features = getLocalizedData(englishFeatures, locale, {
    year: englishCompanyStats.foundedYear,
    count: englishCompanyStats.countriesCount,
  });
  const orderSteps = getLocalizedData(englishOrderSteps, locale);
  const productsData = getLocalizedData(englishProductsData, locale);
  const companyStats = getLocalizedData(englishCompanyStats, locale);
  const featureIconMap = {
    award: Award,
    "bar-chart-3": BarChart3,
    "check-circle-2": CheckCircle2,
    "clock-3": Clock3,
    "clipboard-list": ClipboardList,
    "globe-2": Globe2,
    "message-circle": MessageCircle,
    "shield-check": ShieldCheck,
    ship: Ship,
    zap: Zap,
  } as const;
  const heroTags = [
    { label: t("Strictly Inspected"), icon: CheckCircle2 },
    { label: t("Minimal Wear"), icon: CheckCircle2 },
    { label: t("Vibrant Colors"), icon: Sparkles },
    { label: t("A-Grade Quality"), icon: CheckCircle2 },
  ];
  const trustItems = [
    { label: t("Clearly Graded Stock"), icon: CheckCircle2 },
    { label: t("Exporting Since 2012"), icon: Zap },
    { label: t("Container Loading Support"), icon: Ship },
    { label: t("Repeat Buyer Support"), icon: BarChart3 },
    {
      label: t("{v0} Countries", { v0: companyStats.countriesCount }),
      icon: Globe2,
    },
  ];
  const productQualityBadges = [
    { label: t("Strict Quality Control"), icon: ShieldCheck },
    { label: t("Professional Sorting"), icon: CheckCircle2 },
    { label: t("Vibrant & Fashionable"), icon: Sparkles },
    { label: t("Checked for Resale"), icon: CheckCircle2 },
  ];
  const partnerRegions = [
    {
      name: t("Africa"),
      countries: t(
        "Nigeria, Ghana, Tanzania, Kenya, Uganda, Mozambique +5 more",
      ),
      icon: Globe2,
    },
    {
      name: t("Southeast Asia"),
      countries: t(
        "Philippines, Indonesia, Vietnam, Cambodia, Myanmar +4 more",
      ),
      icon: Globe2,
    },
    {
      name: t("Middle East"),
      countries: t("UAE, Saudi Arabia, Jordan, Yemen, Iraq +4 more"),
      icon: Globe2,
    },
    {
      name: t("Americas"),
      countries: t("Brazil, Chile, Colombia, Ecuador, Peru +4 more"),
      icon: Globe2,
    },
    {
      name: t("Europe"),
      countries: t("Poland, Ukraine, Romania, Bulgaria +3 more"),
      icon: Globe2,
    },
    {
      name: t("Oceania"),
      countries: t("Papua New Guinea, Fiji, Solomon Islands +1 more"),
      icon: Globe2,
    },
  ];
  const faqs = [
    {
      question: t("What is your monthly supply capacity?"),
      answer: t(
        "Our monthly supply capacity is over 200 tonnes (approx. 8-10 40ft containers). We can handle large orders efficiently with our {v0} facility and {v1} staff.",
        { v0: companyStats.facilitySize, v1: companyStats.staffCount },
      ),
    },
    {
      question: t("What products do you offer?"),
      answer: t(
        "We offer 200+ categories including used summer, winter, women’s, men’s, and brand clothes, used brand, mixed, and washed shoes, and used bags such as handbags, backpacks, and shoulder bags.",
      ),
    },
    {
      question: t("What is the minimum order quantity (MOQ)?"),
      answer: t(
        "Minimum quantities depend on the product category, grade, and packing. Contact us to confirm the minimum for clothes, shoes, bags, or a mixed order before planning shipment.",
      ),
    },
    {
      question: t("What are your payment methods?"),
      answer: t(
        "We accept T/T (bank transfer), L/C (letter of credit), and Western Union. Confirm the deposit and balance schedule in your pro forma invoice before payment.",
      ),
    },
    {
      question: t("How do you ensure quality?"),
      answer: t(
        "We use A-Grade sorting standards. Trained quality inspectors conduct random inspections on every batch to ensure minimal wear and high fashion relevance.",
      ),
    },
    {
      question: t("Can I get a sample before placing a bulk order?"),
      answer: t(
        "Yes, we offer sample orders so you can verify quality before committing to a full container. Contact us for sample pricing.",
      ),
    },
  ];
  const contactMethods = [
    {
      label: t("EMAIL"),
      value: "sales@realismthrift.com",
      href: "mailto:sales@realismthrift.com",
      icon: Mail,
    },
    {
      label: t("WHATSAPP"),
      value: "+86 17279444062",
      href: "https://wa.me/8617279444062",
      icon: MessageCircle,
    },
    {
      label: t("PHONE"),
      value: "+86 17279444062",
      href: "tel:+8617279444062",
      icon: Phone,
    },
    {
      label: t("ADDRESS"),
      value: t(companyAddress),
      icon: MapPin,
    },
  ];
  const latestPosts = await getLatestBlogPosts().catch(() => null);

  const organizationSchema = getOrganizationSchema();
  const websiteSchema = getWebsiteSchema();
  const faqSchema = getFaqSchema(
    faqs.map((f) => ({ q: f.question, a: f.answer })),
  );

  return (
    <div className="rt-home">
      <JsonLd data={organizationSchema} />
      <JsonLd data={websiteSchema} />
      <JsonLd data={faqSchema} />
      <section className="rt-hero" id="home" aria-label={t("Hero Section")}>
        <Image
          src="/images/hero-main.webp"
          alt={t(
            "Dongguan Huihe Realismthrift Trading Co., Ltd. - China Wholesale Supplier of Sorted Second Hand Branded Clothes, Shoes, and Bags",
          )}
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="rt-hero-bg"
        />
        <div className="rt-hero-overlay" />
        <div className="rt-container">
          <div className="rt-hero-content rt-fade-in">
            <div className="rt-hero-badge">
              {t("Second Hand Fashion Exporter in China")}
            </div>
            <h1 className="rt-hero-title">
              {t("Wholesale Used Clothes, Shoes & Bags from China")}
            </h1>
            <p className="rt-hero-subtitle">
              {t("Wholesale Packing | Graded Stock | Export Support")}
            </p>
            <div className="rt-hero-tags">
              {heroTags.map(({ label, icon: Icon }) => (
                <span key={label} className="rt-hero-tag">
                  <Icon size={14} strokeWidth={2.2} />
                  {label}
                </span>
              ))}
            </div>
            <div className="rt-hero-cta">
              <Link href="#contact" className="rt-btn-primary">
                {t("GET LATEST WHOLESALE PRICE LIST")}
              </Link>
              <Link href="#products" className="rt-btn-outline">
                {t("View Products ")}
                <ArrowRight size={16} strokeWidth={2.25} />
              </Link>
            </div>
            <div className="rt-hero-stats">
              <div className="rt-hero-stat">
                <span className="rt-hero-stat-value">
                  {companyStats.facilitySize}
                </span>
                <span className="rt-hero-stat-label">
                  {t("Modern Factory")}
                </span>
              </div>
              <div className="rt-hero-stat">
                <span className="rt-hero-stat-value">
                  {companyStats.countriesCount}
                </span>
                <span className="rt-hero-stat-label">
                  {t("Countries Served")}
                </span>
              </div>
              <div className="rt-hero-stat">
                <span className="rt-hero-stat-value">{t("Repeat")}</span>
                <span className="rt-hero-stat-label">{t("Buyer Support")}</span>
              </div>
              <div className="rt-hero-stat">
                <span className="rt-hero-stat-value">{t("A-Grade")}</span>
                <span className="rt-hero-stat-label">
                  {t("Quality Standard")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="rt-trust-banner">
        <div className="rt-container">
          <div className="rt-trust-items">
            {trustItems.map(({ label, icon: Icon }) => (
              <div key={label} className="rt-trust-item">
                <Icon size={16} strokeWidth={2.2} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section
        className="rt-home-section rt-products"
        id="products"
        aria-labelledby="products-title"
      >
        <div className="rt-container">
          <div className="rt-section-header center">
            <span className="rt-section-badge">{t("WHOLESALE PRODUCTS")}</span>
            <h2 className="rt-section-title" id="products-title">
              {t("SECOND HAND PRODUCT CATEGORIES")}
            </h2>
            <div className="rt-section-divider center" />
            <p className="rt-section-copy">
              {t(
                "Over 200 categories with practical grading. Stock is sorted by item type, brand level, condition, and market use.",
              )}
            </p>
          </div>

          <div className="rt-quality-badges">
            {productQualityBadges.map(({ label, icon: Icon }) => (
              <span key={label} className="rt-quality-badge">
                <Icon size={14} strokeWidth={2.2} />
                {label}
              </span>
            ))}
          </div>

          <div className="rt-products-grid">
            {productsData.map((product) => (
              <Link
                key={product.id}
                href={localePath(product.href, locale)}
                className="rt-product-card"
              >
                <Image
                  src={product.image}
                  alt={
                    product.alt ||
                    t(
                      "RealismThrift Wholesale {v0} - Sorted Bulk Inventory from China Sorting Facility",
                      { v0: product.title },
                    )
                  }
                  width={400}
                  height={260}
                  sizes="(min-width: 1100px) 25vw, (min-width: 768px) 50vw, 100vw"
                  className="rt-product-card-image"
                  style={{ height: "auto" }}
                />
                <span className="rt-product-card-badge">
                  {product.category}
                </span>
                <span className="rt-product-card-overlay">
                  <span className="rt-product-card-overlay-button">
                    {t("View Details ")}
                    <ArrowRight size={15} strokeWidth={2.25} />
                  </span>
                </span>
                <span className="rt-product-card-title">{product.title}</span>
              </Link>
            ))}
          </div>

          <div className="rt-products-cta">
            <Link href="#contact" className="rt-btn-primary">
              {t("GET WHOLESALE PRICE LIST ")}
              <ArrowRight size={16} strokeWidth={2.25} />
            </Link>
          </div>
        </div>
      </section>

      <section
        className="rt-home-section rt-about"
        id="about"
        aria-labelledby="about-title"
      >
        <div className="rt-container">
          <div className="rt-about-inner">
            <div className="rt-about-image-wrap">
              <Image
                src="/img/wholesale-inventory.webp"
                alt={t(
                  "RealismThrift 15,000m² Modern Sorting Facility in China - Industrial Scale Wholesale Export Operations for Used Branded Fashion",
                )}
                width={760}
                height={560}
                sizes="(min-width: 900px) 50vw, 100vw"
                className="rt-about-image"
                style={{ height: "auto" }}
              />
              <div className="rt-about-image-badge">
                {t("15,000m² Modern Facility")}
              </div>
              <div className="rt-about-deco rt-about-deco-dark" />
              <div className="rt-about-deco rt-about-deco-red" />

              <div className="absolute -bottom-6 right-0 hidden md:flex gap-3 bg-white p-3 rounded-[12px] shadow-xl z-20 border border-[#eee]">
                <div className="relative w-32 h-20 rounded-[6px] overflow-hidden">
                  <Image
                    src="/images/about/working-qc-shoes.webp"
                    alt={t(
                      "RealismThrift QC Inspection - Sorting Branded Used Shoes",
                    )}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative w-24 h-20 rounded-[6px] overflow-hidden">
                  <Image
                    src="/images/about/working-qc-clothes.webp"
                    alt={t(
                      "RealismThrift Quality Control - Inspecting Used Clothing",
                    )}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center pr-2">
                  <span className="text-[0.6rem] font-bold text-brand-red uppercase tracking-tighter">
                    {t("Quality Checks")}
                  </span>
                  <span className="text-[0.5rem] text-brand-dark font-semibold">
                    {t("Huizhou Facility")}
                  </span>
                </div>
              </div>
            </div>

            <div className="rt-about-copy">
              <span className="rt-section-badge">{t("ABOUT US")}</span>
              <h2 className="rt-section-title" id="about-title">
                {t("WHY CHOOSE US")}
              </h2>
              <div className="rt-section-divider" />
              <p className="rt-about-subtitle">
                {t("Your Most Reliable Partner in Used Clothing Export")}
              </p>
              <p className="rt-about-text">
                {t(
                  "Dongguan Huihe Realismthrift Trading Co., Ltd. supplies used fashion products for wholesale buyers in Africa, Southeast Asia, the Middle East, and the Americas. We focus on sorted stock, clear packing information, and export support.",
                )}
              </p>
              <p className="rt-about-text">
                {t(
                  "We operate from a {v0} facility with {v1} dedicated staff members. Our strict quality control ensures long-term partnerships with clients in {v2} countries.",
                  {
                    v0: companyStats.facilitySize,
                    v1: companyStats.staffCount,
                    v2: companyStats.countriesCount,
                  },
                )}
              </p>
              <div className="rt-about-stats">
                <div className="rt-stat-box">
                  <span className="rt-stat-value">{t("Repeat")}</span>
                  <span className="rt-stat-label">{t("Buyer Support")}</span>
                </div>
                <div className="rt-stat-box">
                  <span className="rt-stat-value">
                    {companyStats.countriesCount}
                  </span>
                  <span className="rt-stat-label">{t("Countries Served")}</span>
                </div>
                <div className="rt-stat-box">
                  <span className="rt-stat-value">2012</span>
                  <span className="rt-stat-label">{t("Founded")}</span>
                </div>
                <div className="rt-stat-box">
                  <span className="rt-stat-value">
                    {companyStats.staffCount}
                  </span>
                  <span className="rt-stat-label">{t("Staff Members")}</span>
                </div>
              </div>
              <Link
                href={localePath("/about-us", locale)}
                className="rt-btn-primary"
                aria-label={`${t("KNOW MORE ").trim()}: ${t("Know more about RealismThrift export services")}`}
              >
                {t("KNOW MORE ")}
                <ArrowRight size={16} strokeWidth={2.25} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        className="rt-home-section rt-features"
        id="why-choose-us"
        aria-labelledby="features-title"
      >
        <div className="rt-container">
          <div className="rt-section-header center">
            <span className="rt-section-badge">{t("OUR ADVANTAGES")}</span>
            <h2 className="rt-section-title" id="features-title">
              {t("WHY CHOOSE REALISMTHRIFT")}
            </h2>
            <div className="rt-section-divider center" />
          </div>

          <div className="rt-features-grid">
            {features.map((feature) => {
              const Icon =
                featureIconMap[feature.icon as keyof typeof featureIconMap] ??
                Trophy;

              return (
                <article
                  key={feature.title}
                  className="rt-feature-card rt-fade-in"
                >
                  <div className="rt-feature-icon">
                    <Icon size={22} strokeWidth={2.25} />
                  </div>
                  <h3 className="rt-feature-title">{feature.title}</h3>
                  <p className="rt-feature-desc">{feature.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="rt-home-section rt-partners" id="partners">
        <div className="rt-container">
          <div className="rt-section-header center">
            <span className="rt-section-badge light">{t("GLOBAL REACH")}</span>
            <h2 className="rt-section-title light">
              {t("OUR GLOBAL PARTNERS")}
            </h2>
            <div className="rt-section-divider center" />
          </div>

          <div className="rt-partners-grid">
            {partnerRegions.map(({ name, countries, icon: Icon }) => (
              <article key={name} className="rt-partner-card">
                <div className="rt-partner-region">
                  <Icon size={24} strokeWidth={2.1} />
                </div>
                <h3 className="rt-partner-name">{name}</h3>
                <p className="rt-partner-countries">{countries}</p>
              </article>
            ))}
          </div>

          <div className="rt-partners-count">
            <span>
              <Globe2 size={16} strokeWidth={2.2} />
              {t("Export Support for Global Wholesale Buyers")}
            </span>
          </div>
        </div>
      </section>

      <section
        className="rt-home-section rt-order"
        id="how-to-order"
        aria-labelledby="order-title"
      >
        <div className="rt-container">
          <div className="rt-section-header center">
            <span className="rt-section-badge">{t("SIMPLE PROCESS")}</span>
            <h2 className="rt-section-title" id="order-title">
              {t("HOW TO ORDER")}
            </h2>
            <div className="rt-section-divider center" />
          </div>

          <div className="rt-order-grid">
            {orderSteps.map((step) => {
              const Icon =
                featureIconMap[step.icon as keyof typeof featureIconMap] ??
                ClipboardList;

              return (
                <article
                  key={step.num}
                  className="rt-home-order-step rt-fade-in"
                >
                  <span className="rt-home-order-step-number">{step.num}</span>
                  <div className="rt-home-order-step-icon">
                    <Icon size={28} strokeWidth={2.25} />
                  </div>
                  <h3 className="rt-home-order-step-title">{step.title}</h3>
                  <p className="rt-home-order-step-desc">{step.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section
        className="rt-home-section rt-faq"
        id="faq"
        aria-labelledby="faq-title"
      >
        <div className="rt-container rt-faq-container">
          <div className="rt-section-header center">
            <span className="rt-section-badge">{t("FAQ")}</span>
            <h2 className="rt-section-title" id="faq-title">
              {t("FREQUENTLY ASKED QUESTIONS")}
            </h2>
            <div className="rt-section-divider center" />
          </div>

          <div className="rt-faq-list">
            {faqs.map((faq, index) => (
              <details
                key={faq.question}
                className="rt-faq-item"
                open={index === 0}
              >
                <summary className="rt-faq-question">
                  <span>{faq.question}</span>
                  <ChevronDown
                    className="rt-faq-arrow"
                    size={20}
                    strokeWidth={2.25}
                  />
                </summary>
                <div className="rt-faq-answer">{faq.answer}</div>
              </details>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href={localePath("/faq", locale)}
              className="rt-news-view-all"
            >
              {t("View All FAQs ")}
              <ArrowRight size={16} strokeWidth={2.25} />
            </Link>
          </div>
        </div>
      </section>

      <section
        className="rt-home-section rt-contact"
        id="contact"
        aria-labelledby="contact-title"
      >
        <div className="rt-container">
          <div className="rt-section-header center">
            <span className="rt-section-badge light">{t("CONTACT US")}</span>
            <h2 className="rt-section-title light" id="contact-title">
              {t("GET IN TOUCH")}
            </h2>
            <div className="rt-section-divider center" />
          </div>

          <div className="rt-contact-inner">
            <div className="rt-contact-info">
              <h3 className="rt-contact-info-title">
                {t("Consult your used clothing export specialist")}
              </h3>

              {contactMethods.map(({ label, value, href, icon: Icon }) => (
                <div key={label} className="rt-contact-info-item">
                  <span className="rt-contact-info-icon">
                    <Icon size={20} strokeWidth={2.25} />
                  </span>
                  <div>
                    <div className="rt-contact-info-label">{label}</div>
                    {href ? (
                      <a href={href} className="rt-contact-info-link">
                        {value}
                      </a>
                    ) : (
                      <span
                        className="rt-contact-info-link static rt-postal-address"
                        lang={locale}
                        dir={locale === "ar" ? "rtl" : "ltr"}
                      >
                        {value}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              <div className="rt-contact-online">
                <p>
                  <MessageCircle size={16} strokeWidth={2.2} />
                  <span>
                    <strong>{t("Sales Support")}</strong>
                    <br />
                    <TranslatedText
                      locale={locale}
                      text="Our sales team aims to reply within {time}."
                      values={{ time: <strong>{t("12 hours")}</strong> }}
                    />
                  </span>
                </p>
              </div>
            </div>

            <div className="rt-contact-form-shell">
              <div className="rt-contact-form-corner" />
              <InquiryForm
                locale={locale}
                messages={getClientMessages(locale, "form")}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="rt-seo-copy">
        <div className="rt-container">
          <div className="rt-seo-copy-inner">
            <h2>{t("About Dongguan Huihe Realismthrift Trading Co., Ltd.")}</h2>
            <p>
              <TranslatedText
                locale={locale}
                text={
                  "Dongguan Huihe Realismthrift Trading Co., Ltd. is a {supplier} based in Huizhou, China. We specialize in exporting sorted used clothes, used shoes, and used bags to wholesalers and importers worldwide. With experience since 2012 in the {industry} industry, we have built strong relationships with buyers in {count} countries across Africa, Southeast Asia, the Middle East, and the Americas."
                }
                values={{
                  supplier: (
                    <strong>
                      {t("second hand clothes wholesale supplier")}
                    </strong>
                  ),
                  industry: <strong>{t("used clothing export")}</strong>,
                  count: companyStats.countriesCount,
                }}
              />
            </p>
            <p>
              {t(
                "Contact us today to get our latest wholesale price list and start your profitable second-hand clothing business. Email:",
              )}{" "}
              <a href="mailto:sales@realismthrift.com">
                {englishSiteFooter.brand.email}
              </a>
            </p>
          </div>
        </div>
      </section>

      {latestPosts ? (
        <LatestBlogSection locale={locale} posts={latestPosts} />
      ) : null}
    </div>
  );
}

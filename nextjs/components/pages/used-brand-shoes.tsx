import { createPageMetadata } from "@/lib/metadata";
import "@/app/internal-pages.css";
import Image from "next/image";
import Link from "next/link";
import { InquiryForm } from "@/components/InquiryForm";
import { QualityStandards } from "@/components/product/QualityStandards";
import { ProductTrustSections } from "@/components/product/ProductTrustSections";
import { ProductCTA } from "@/components/product/ProductCTA";
import { companyStats as englishCompanyStats } from "@/data/siteData";
import {
  XCircle,
  CheckCircle2,
  Footprints,
  Sparkles,
  Package,
  Globe2,
  ShoppingBag,
  ClipboardList,
  Mail,
} from "lucide-react";
import {
  JsonLd,
  getWholesaleCatalogSchema,
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
      title: t("Used Brand Shoes Wholesale | Nike & Adidas"),
      description: t(
        "Wholesale supplier of sorted second-hand branded shoes. Nike, Adidas, Jordan, and 30+ brands. Paired, cleaned, graded, and packed for export.",
      ),
      openGraph: {
        title: t("Used Brand Shoes Wholesale | Sorted Export Supplier"),
        description: t(
          "Sorted second-hand branded shoes from China. Nike, Adidas, and more. Manual checks for pairing, condition, and packing.",
        ),
        images: ["/images/shoes/wholesale-sneakers-assorted-styles-grid.webp"],
      },
      alternates: {
        canonical: "/used-brand-shoes",
      },
    }),
    locale,
  );
}

export default function UsedBrandShoesPage({
  locale = "en",
}: { locale?: Locale } = {}) {
  const t = getTranslator(locale);
  const companyStats = getLocalizedData(englishCompanyStats, locale);
  const shoeStandards = [
    {
      icon: <XCircle className="w-5 h-5 text-brand-red" />,
      title: t("Strict Glue Inspection"),
      desc: t("Soles and uppers are checked for bonding integrity"),
      isNegative: true,
    },
    {
      icon: <XCircle className="w-5 h-5 text-brand-red" />,
      title: t("Surface Integrity"),
      desc: t("Inspected for layers peeling or major cracking"),
      isNegative: true,
    },
    {
      icon: <XCircle className="w-5 h-5 text-brand-red" />,
      title: t("Complete Parts Check"),
      desc: t("Ensuring laces, insoles, and tongues are present"),
      isNegative: true,
    },
    {
      icon: <XCircle className="w-5 h-5 text-brand-red" />,
      title: t("Persistent Odors Rejected"),
      desc: t("Shoes with persistent odors or mold are removed during sorting"),
      isNegative: true,
    },
    {
      icon: <XCircle className="w-5 h-5 text-brand-red" />,
      title: t("Sole Integrity"),
      desc: t("Checked for breakage or separation"),
      isNegative: true,
    },
    {
      icon: <XCircle className="w-5 h-5 text-brand-red" />,
      title: t("Shape Maintenance"),
      desc: t("Checking for crushing or major deformation"),
      isNegative: true,
    },
    {
      icon: <CheckCircle2 className="w-5 h-5 text-[#27AE60]" />,
      title: t("Carefully Paired"),
      desc: t("Every sack contains matched pairs"),
      isNegative: false,
    },
    {
      icon: <CheckCircle2 className="w-5 h-5 text-[#27AE60]" />,
      title: t("Visible Branding"),
      desc: t("Original brand label is clearly visible"),
      isNegative: false,
    },
    {
      icon: <CheckCircle2 className="w-5 h-5 text-[#27AE60]" />,
      title: t("Checked for Resale"),
      desc: t("Wearable pairs are sorted by condition and market requirements"),
      isNegative: false,
    },
  ];
  const shoeFeatures = [
    {
      icon: <Footprints className="w-6 h-6 text-brand-gold" />,
      title: t("Rigorous Pairing"),
      desc: t("Manual checking minimizes the risk of mismatched pairs."),
    },
    {
      icon: <Sparkles className="w-6 h-6 text-brand-gold" />,
      title: t("Condition Checks"),
      desc: t("Soles, lining, closures, and wear are checked before packing."),
    },
    {
      icon: <Package className="w-6 h-6 text-brand-gold" />,
      title: t("Secure Sacking"),
      desc: t(
        "Hydraulic compressed packing to maximize container space and protect shoes.",
      ),
    },
    {
      icon: <Globe2 className="w-6 h-6 text-brand-gold" />,
      title: t("{v0} Countries Served", { v0: companyStats.countriesCount }),
      desc: t(
        "Shipping coordination for ports in Africa, the Middle East, and Southeast Asia.",
      ),
    },
  ];
  const shoeFaqs = [
    {
      q: t("How many pairs fit in a 40HQ container?"),
      a: t(
        "A 40HQ container typically fits around 20,000 to 22,000 pairs of shoes depending on the mix of boots and sneakers.",
      ),
    },
    {
      q: t("Can I order just Nike or Adidas?"),
      a: t(
        "Yes, we offer brand-specific sorting. Brands like Nike/Adidas have a separate pricing tier and specific MOQ.",
      ),
    },
    {
      q: t("Do you provide the shoes in boxes?"),
      a: t(
        "To maximize shipping efficiency and lower your costs, we typically pack shoes in woven sacks. Box packing is available upon request for selected orders.",
      ),
    },
  ];
  const productSchema = getWholesaleCatalogSchema({
    language: locale,
    name: t("Used Brand Shoes Wholesale"),
    description: t(
      "Wholesale supplier of sorted second-hand branded shoes from China. Nike, Adidas, Jordan, and 30+ brands.",
    ),
    image:
      "https://www.realismthrift.com/images/shoes/wholesale-sneakers-assorted-styles-grid.webp",
    url: `https://www.realismthrift.com${localePath("/used-brand-shoes", locale)}`,
  });

  const faqSchema = getFaqSchema(shoeFaqs);

  return (
    <div className="bg-white">
      <JsonLd data={productSchema} />
      <JsonLd data={faqSchema} />
      {/* PAGE HERO */}
      <section className="rt-page-hero">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/shoes/wholesale-sneakers-assorted-styles-grid.webp"
            alt={t(
              "RealismThrift Shoe Export Hub - Industrial Scale Wholesale Branded Sneakers and Nike Adidas Jordan Supplier in China",
            )}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>
        <div className="rt-page-hero-overlay" />
        <div className="rt-container relative z-10 text-center md:text-left">
          <div className="rt-fade-in">
            <nav className="rt-breadcrumb mb-5 justify-center md:justify-start">
              <Link href={localePath("/", locale)}>{t("Home")}</Link>
              <span>›</span>
              <span className="text-white/70">{t("Used Brand Shoes")}</span>
            </nav>
            <div className="inline-block bg-brand-red text-white font-montserrat font-bold text-[0.65rem] tracking-[0.12em] px-[0.875rem] py-[0.3rem] rounded-[2px] mb-[1rem] uppercase">
              {t("Nike · Adidas · A-Grade Quality")}
            </div>
            <h1 className="rt-page-hero-title mb-5 text-[clamp(1.75rem,5vw,2.75rem)] leading-[1.1]">
              {locale === "en" ? (
                <>
                  {t("Used Brand Shoes ")}
                  <span className="text-brand-gold">{t("Wholesale")}</span>
                </>
              ) : (
                t("Used Brand Shoes Wholesale Supplier")
              )}
            </h1>
            <p className="rt-page-hero-sub max-w-[620px] mb-9 leading-[1.8] text-[1.05rem]">
              {t(
                "Wholesale second-hand branded shoes — Nike, Adidas, Jordan, and 30+ brands. Cleaning, pairing, grading, and export packing support.",
              )}
            </p>
            <div className="flex gap-4 justify-center md:justify-start">
              <a
                href="#inquiry"
                className="bg-brand-gold text-brand-dark px-6 md:px-10 py-3 md:py-4 rounded-[3px] font-bold font-montserrat text-[0.9rem] hover:bg-brand-gold-dark transition-all shadow-[0_10px_20px_rgba(240,180,41,0.2)] whitespace-nowrap"
              >
                {t("Get Price Now →")}
              </a>
              <a
                href="https://wa.me/8617279444062"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 border border-white/30 text-white px-6 md:px-10 py-3 md:py-4 rounded-[3px] font-semibold font-montserrat text-[0.9rem] hover:bg-white/20 transition-all whitespace-nowrap"
              >
                {t("WhatsApp")}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* KEY STATS BAR */}
      <div className="bg-brand-dark py-4">
        <div className="max-w-[1280px] mx-auto px-8 flex flex-wrap gap-6 justify-around items-center">
          {[
            { num: "30+", label: t("Shoe Brands") },
            { num: t("A-Grade"), label: t("Quality Standard") },
            { num: t("25–30kg"), label: t("Per Sack") },
            { num: "8,000+", label: t("Pairs/20ft") },
            { num: t("Cleaned"), label: t("Before Packing") },
          ].map((stat) => (
            <div key={stat.num} className="text-center text-white">
              <div className="font-montserrat font-black text-[1.25rem] text-brand-gold">
                {stat.num}
              </div>
              <div className="text-[0.65rem] opacity-85 uppercase tracking-[0.07em] mt-[0.15rem]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-[1280px] mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 items-start">
        <div className="min-w-0">
          {/* BRAND LIST */}
          <section className="mb-12">
            <div className="rt-subsection-heading">
              <h2>{t("Available Shoe Brands")}</h2>
              <div className="rt-section-divider" />
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                "Nike",
                "Adidas",
                "Jordan",
                t("New Balance"),
                "Puma",
                "Reebok",
                "Converse",
                "Vans",
                "Timberland",
                t("Under Armour"),
                "Skechers",
                "ASICS",
                "Salomon",
                "Merrell",
                "Clarks",
                t("Dr. Martens"),
                "UGG",
                "Birkenstock",
                t("Steve Madden"),
                t("Cole Haan"),
                "Guess",
                "Lacoste",
                t("Polo Ralph Lauren"),
                t("Tommy Hilfiger"),
                t("Calvin Klein"),
                "Fila",
                "Champion",
                "Kappa",
                "Ellesse",
                "Lotto",
              ].map((brand) => (
                <span
                  key={brand}
                  className="bg-[#F5F5F0] border border-[#e0e0e0] text-[#333] px-3.5 py-1.5 rounded-[2px] text-[0.8rem] font-montserrat font-semibold"
                >
                  {brand}
                </span>
              ))}
            </div>
          </section>

          {/* PRODUCT SHOWCASE */}
          <section className="mb-12">
            <div className="rt-subsection-heading">
              <h2>{t("Product Categories")}</h2>
              <div className="rt-section-divider" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  title: t("Used Nike Shoes"),
                  img: "/images/shoes/nike-air-jordan-1-high-mint-green-white.webp",
                  desc: t("Nike Air, Force 1, Jordan"),
                  spec: t("25kg/sack (~40 pairs)"),
                },
                {
                  title: t("Used Adidas Shoes"),
                  img: "/images/shoes/adidas-retropy-grey-white-classic-sneakers.webp",
                  desc: t("Ultraboost, Stan Smith, NMD"),
                  spec: t("25kg/sack (~40 pairs)"),
                },
                {
                  title: t("Used Brand Sneakers"),
                  img: "/images/shoes/designer-sneakers-assorted-wholesale-display.webp",
                  desc: t("Mixed branded shoes"),
                  spec: t("28kg/sack (~40 pairs)"),
                },
                {
                  title: t("Used Brand Boots"),
                  img: "/images/shoes/timberland-6-inch-premium-wheat-boots.webp",
                  desc: t("Timberland, Dr. Martens"),
                  spec: t("30kg/sack (~25 pairs)"),
                },
                {
                  title: t("Used Brand Sandals"),
                  img: "/images/shoes/cat-leather-sandals-brown-rugged-sole.webp",
                  desc: t("Birkenstock, Teva, UGG"),
                  spec: t("20kg/sack (~50 pairs)"),
                },
                {
                  title: t("Used Mixed Shoes"),
                  img: "/images/shoes/mixed-sports-shoes-nike-puma-display.webp",
                  desc: t("All brands mixed"),
                  spec: t("25kg/sack (~40 pairs)"),
                },
              ].map((prod) => (
                <div
                  key={prod.title}
                  className="bg-white border border-[#eee] rounded-[6px] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
                >
                  <div className="relative overflow-hidden h-[180px]">
                    <Image
                      src={prod.img}
                      alt={t(
                        "RealismThrift Wholesale {v0} - Sorted Branded Second-Hand Shoes Bulk Inventory from China Factory",
                        { v0: prod.title },
                      )}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-brand-dark text-brand-gold text-[0.65rem] font-bold px-2 py-1 rounded-[2px] font-montserrat">
                      {t("A-GRADE")}
                    </div>
                  </div>
                  <div className="p-3.5">
                    <h3 className="font-montserrat text-[0.875rem] font-bold text-brand-dark mb-1">
                      {prod.title}
                    </h3>
                    <p className="text-[0.75rem] text-[#888] mb-2">
                      {prod.desc}
                    </p>
                    <div className="flex justify-between items-center break-all gap-1">
                      <span className="text-[0.7rem] text-brand-red font-bold flex-1">
                        {prod.spec}
                      </span>
                      <a
                        href="#inquiry"
                        className="bg-brand-dark text-white text-[0.7rem] px-3 py-1.5 rounded-[2px] font-semibold font-montserrat shrink-0 hover:bg-brand-red transition-colors"
                        aria-label={t("Inquire about {v0}", { v0: prod.title })}
                      >
                        {t("Inquire")}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SHOE SORTING PROCESS */}
          <section className="mb-12">
            <div className="rt-subsection-heading">
              <h2>{t("Shoe Sorting & Cleaning Process")}</h2>
              <div className="rt-section-divider" />
            </div>
            <p className="text-[0.9375rem] text-[#555] leading-[1.75] mb-7">
              {t(
                "Used brand shoes require a more detailed sorting process than clothing. If you also need textiles, feel free to check our ",
              )}
              <Link
                href={localePath("/used-brand-clothes", locale)}
                className="text-[#C0392B] font-bold hover:underline"
              >
                {t("Used Brand Clothes")}
              </Link>
              {t(
                " sorting lines. Our dedicated shoe sorting team handles each pair individually to ensure quality and pairing accuracy.",
              )}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                {
                  step: "01",
                  title: t("Collection & Pairing Check"),
                  img: "/images/shoes/nike-dunk-low-assorted-colors-batch.webp",
                  desc: t(
                    "All incoming shoes are first checked for pairs. Unpaired shoes are immediately separated. We only export complete pairs. Each pair is tagged with a temporary ID for tracking through the sorting process.",
                  ),
                },
                {
                  step: "02",
                  title: t("Brand Identification"),
                  img: "/images/shoes/mixed-premium-sneakers-grid-display.webp",
                  desc: t(
                    "Trained sorters identify each brand and model. Nike, Adidas, Jordan, and other brands are sorted into dedicated lots. Brand labels, tongue tags, and sole markings are checked before grading.",
                  ),
                },
                {
                  step: "03",
                  title: t("Cleaning & Deodorizing"),
                  img: "/images/shoes/nike-air-max-dunk-low-white-black-display.webp",
                  desc: t(
                    "All shoes are cleaned using professional equipment. Soles are scrubbed, uppers are wiped down, and interiors are deodorized. Shoes with persistent odors or mold are rejected regardless of brand.",
                  ),
                },
                {
                  step: "04",
                  title: t("Quality Grading"),
                  img: "/images/shoes/nike-revolution-black-white-running-shoe-top.webp",
                  desc: t(
                    "Each pair is graded A, B, or C based on 8 quality criteria: sole condition, upper condition, lining integrity, zipper/lace completeness, odor level, structural shape, brand label clarity, and overall wearability.",
                  ),
                },
              ].map((process) => (
                <div
                  key={process.step}
                  className="bg-white border border-[#eee] rounded-[6px] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
                >
                  <div className="relative h-[160px]">
                    <Image
                      src={process.img}
                      alt={t(
                        "RealismThrift Shoe Quality Control Step {v0} - {v1} for Professional Bulk Branded Sneakers Export",
                        { v0: process.step, v1: process.title },
                      )}
                      fill
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <span className="bg-brand-dark text-brand-gold font-montserrat text-[0.75rem] font-extrabold px-2.5 py-1 rounded-[2px]">
                        {t("STEP {v0}", { v0: process.step })}
                      </span>
                      <h3 className="font-montserrat text-[0.9375rem] font-bold text-brand-dark m-0">
                        {process.title}
                      </h3>
                    </div>
                    <p className="text-[0.8125rem] text-[#666] leading-[1.7] m-0">
                      {process.desc}
                    </p>
                  </div>
                </div>
              ))}
              <div className="sm:col-span-2 bg-white border border-[#eee] rounded-[6px] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.05)] flex flex-col md:flex-row">
                <div className="relative md:w-[300px] h-[200px] md:h-auto shrink-0">
                  <Image
                    src="/images/shoes/timberland-6-inch-premium-wheat-boots-batch.webp"
                    alt={t(
                      "RealismThrift Export Logistics - Final Sorting and Labeling of Branded Shoes for Global Wholesale Distribution",
                    )}
                    fill
                    sizes="(min-width: 768px) 300px, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <span className="bg-brand-dark text-brand-gold font-montserrat text-[0.75rem] font-extrabold px-2.5 py-1 rounded-[2px]">
                      {t("STEP 05")}
                    </span>
                    <h3 className="font-montserrat text-[0.9375rem] font-bold text-brand-dark m-0">
                      {t("Packing by Category")}
                    </h3>
                  </div>
                  <p className="text-[0.8125rem] text-[#666] leading-[1.7] m-0">
                    {t(
                      "Graded shoes are packed by brand category into woven sacks. Each sack is labeled with brand, grade, weight, and pair count. Sacks are sealed and weighed to exact specifications before container loading.",
                    )}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* QUALITY STANDARDS */}
          <QualityStandards
            locale={locale}
            title={t("A-Grade Shoe Quality Standards")}
            standards={shoeStandards}
          />

          {/* TRUST SECTIONS */}
          <ProductTrustSections
            locale={locale}
            features={shoeFeatures}
            faqs={shoeFaqs}
          />

          {/* SPECS TABLE */}
          <section className="scroll-mt-24 mb-12">
            <div className="rt-subsection-heading">
              <h2>{t("Product Specifications")}</h2>
              <div className="rt-section-divider" />
            </div>
            <div className="rt-table-wrap overflow-x-auto rounded-[6px] shadow-[0_2px_8px_rgba(0,0,0,0.07)]">
              <table className="w-full border-collapse text-[0.8125rem] bg-white min-w-[650px]">
                <thead>
                  <tr className="bg-brand-dark text-white text-left font-montserrat">
                    <th className="p-3.5 px-4 font-semibold">
                      {t("Category")}
                    </th>
                    <th className="p-3.5 px-4 font-semibold">
                      {t("Sack Weight")}
                    </th>
                    <th className="p-3.5 px-4 font-semibold">
                      {t("Pairs/Sack")}
                    </th>
                    <th className="p-3.5 px-4 font-semibold">{t("MOQ")}</th>
                    <th className="p-3.5 px-4 font-semibold">
                      {t("20ft Load")}
                    </th>
                    <th className="p-3.5 px-4 font-semibold">
                      {t("40ft Load")}
                    </th>
                  </tr>
                </thead>
                <tbody className="font-open-sans">
                  {[
                    {
                      cat: t("Brand Sneakers (Nike/Adidas)"),
                      w: t("25–28 kg"),
                      p: t("~40 pairs"),
                      moq: t("≥200 pairs"),
                      l20: t("~8,000 pairs"),
                      l40: t("~20,000 pairs"),
                    },
                    {
                      cat: t("Brand Boots"),
                      w: t("28–30 kg"),
                      p: t("~25 pairs"),
                      moq: t("≥100 pairs"),
                      l20: t("~6,000 pairs"),
                      l40: t("~14,000 pairs"),
                    },
                    {
                      cat: t("Brand Sandals / Slippers"),
                      w: t("20–22 kg"),
                      p: t("~50 pairs"),
                      moq: t("≥200 pairs"),
                      l20: t("~10,000 pairs"),
                      l40: t("~22,000 pairs"),
                    },
                    {
                      cat: t("Mixed Brand Shoes"),
                      w: t("25 kg"),
                      p: t("~40 pairs"),
                      moq: t("≥500 pairs"),
                      l20: t("~8,500 pairs"),
                      l40: t("~19,000 pairs"),
                    },
                    {
                      cat: t("Jordan / Selected Brand"),
                      w: t("28–30 kg"),
                      p: t("~35 pairs"),
                      moq: t("≥100 pairs"),
                      l20: t("~7,500 pairs"),
                      l40: t("~17,000 pairs"),
                    },
                  ].map((row, i) => (
                    <tr
                      key={row.cat}
                      className={`${i % 2 === 1 ? "bg-[#fafafa]" : "bg-white"} border-b border-[#f0f0f0]`}
                    >
                      <td className="p-3 px-4 font-semibold text-brand-dark">
                        {row.cat}
                      </td>
                      <td className="p-3 px-4 text-[#555]">{row.w}</td>
                      <td className="p-3 px-4 text-[#555]">{row.p}</td>
                      <td className="p-3 px-4">
                        <span className="bg-brand-gold text-brand-dark px-2 py-0.5 rounded-[2px] text-[0.7rem] font-bold font-montserrat">
                          {row.moq}
                        </span>
                      </td>
                      <td className="p-3 px-4 text-[#555]">{row.l20}</td>
                      <td className="p-3 px-4 text-[#555]">{row.l40}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* SIDEBAR */}
        <aside>
          <div
            id="inquiry"
            className="sticky top-[100px] rt-sidebar-card rt-shoes-inquiry-card"
          >
            <div className="rt-sidebar-card-title">
              <h3 className="text-[1rem] font-extrabold m-0 uppercase tracking-wider">
                {t("Get Shoe Price Now")}
              </h3>
              <p className="text-[0.7rem] opacity-80 m-0 mt-0.5 font-open-sans normal-case tracking-normal">
                {t("We aim to reply within 12 hours · Samples available")}
              </p>
            </div>

            <div className="p-5">
              {/* INQUIRY FORM */}
              <InquiryForm
                locale={locale}
                messages={getClientMessages(locale, "form")}
                variant="sidebar"
              />

              <div className="mt-4 pt-4">
                <a
                  href="https://wa.me/8617279444062"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#137a3c] text-white py-3 rounded-[3px] font-montserrat font-bold text-[0.8125rem] uppercase tracking-wider hover:bg-[#106631] transition-all shadow-sm"
                >
                  {t("WhatsApp Us Directly")}
                </a>
              </div>
            </div>
          </div>

          {/* QUICK SPECS BOX */}
          <div className="bg-brand-dark rounded-[8px] p-6 mt-6 text-white font-open-sans">
            <h4 className="font-montserrat text-[0.9rem] font-extrabold m-0 mb-4 text-brand-gold">
              {t("Quick Specs")}
            </h4>
            <div className="flex justify-between py-2 border-b border-white/10 text-[0.8rem]">
              <span className="text-white/60">{t("MOQ")}</span>
              <span className="font-semibold">{t("200 pairs")}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/10 text-[0.8rem]">
              <span className="text-white/60">{t("Sack Weight")}</span>
              <span className="font-semibold">{t("25–30 kg")}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/10 text-[0.8rem]">
              <span className="text-white/60">{t("Pairs/Sack")}</span>
              <span className="font-semibold">{t("~40 pairs")}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/10 text-[0.8rem]">
              <span className="text-white/60">{t("Quality")}</span>
              <span className="font-semibold">{t("A/B Grade")}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/10 text-[0.8rem]">
              <span className="text-white/60">{t("Lead Time")}</span>
              <span className="font-semibold">{t("7–14 days")}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/10 text-[0.8rem]">
              <span className="text-white/60">{t("Shipping")}</span>
              <span className="font-semibold">{t("FOB Guangzhou")}</span>
            </div>
          </div>
        </aside>
      </div>

      {/* CTA BLOCK */}
      <ProductCTA
        locale={locale}
        title={t("Ready to Order Used Brand Shoes?")}
        description={t(
          "Request a free wholesale price quotation. Minimum order 200 pairs. Worldwide shipping available.",
        )}
        whatsappMessage={t(
          "Hi, I want to wholesale used brand shoes. Can I get a price list?",
        )}
      />
    </div>
  );
}

import { TranslatedText } from "@/components/TranslatedText";
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
  ArrowRight,
  XCircle,
  CheckCircle2,
  Factory,
  Package,
  Ship,
  Zap,
  ShoppingBag,
  Footprints,
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
      title: t("Used Brand Clothes Wholesale | China Supplier"),
      description: t(
        "Sorted second-hand branded clothing from China. Nike, Adidas, Zara and 200+ brands. 5-step sorting. MOQ 100 bales. Export shipping support available.",
      ),
      openGraph: {
        title: t("Used Brand Clothes Wholesale | China Export Supplier"),
        description: t(
          "Sorted second-hand branded clothes. Nike, Adidas, and more. Wholesale packing and export support from China.",
        ),
        images: [
          "/images/clothes/assorted-jeans-sweatpants-lee-fila-stack.webp",
        ],
      },
      alternates: {
        canonical: "/used-brand-clothes",
      },
    }),
    locale,
  );
}

export default function UsedBrandClothesPage({
  locale = "en",
}: { locale?: Locale } = {}) {
  const t = getTranslator(locale);
  const companyStats = getLocalizedData(englishCompanyStats, locale);
  const clothesStandards = [
    {
      icon: <XCircle className="w-5 h-5 text-[#C0392B]" />,
      title: t("Major Stains Rejected"),
      desc: t(
        "Items with obvious dirty patches or permanent discoloration are removed",
      ),
      isNegative: true,
    },
    {
      icon: <XCircle className="w-5 h-5 text-[#C0392B]" />,
      title: t("Major Tears Rejected"),
      desc: t(
        "Garments with large cuts, holes, or structural damage are removed",
      ),
      isNegative: true,
    },
    {
      icon: <XCircle className="w-5 h-5 text-[#C0392B]" />,
      title: t("Heavy Fading Rejected"),
      desc: t(
        "Washed-out or bleached garments are separated from higher grades",
      ),
      isNegative: true,
    },
    {
      icon: <XCircle className="w-5 h-5 text-[#C0392B]" />,
      title: t("Heavy Pilling Rejected"),
      desc: t(
        "Excessive fabric pilling is downgraded or removed during sorting",
      ),
      isNegative: true,
    },
    {
      icon: <XCircle className="w-5 h-5 text-[#C0392B]" />,
      title: t("Heavy Wear Rejected"),
      desc: t("Items with excessive use are not packed as higher-grade stock"),
      isNegative: true,
    },
    {
      icon: <XCircle className="w-5 h-5 text-[#C0392B]" />,
      title: t("Closure Issues Checked"),
      desc: t("Buttons, zippers, and snaps are checked and graded accordingly"),
      isNegative: true,
    },
    {
      icon: <CheckCircle2 className="w-5 h-5 text-[#27AE60]" />,
      title: t("Brand Label Intact"),
      desc: t("Original brand label clearly visible and attached"),
      isNegative: false,
    },
    {
      icon: <CheckCircle2 className="w-5 h-5 text-[#27AE60]" />,
      title: t("Clean & Odor-Free"),
      desc: t("Checked for heavy stains and persistent odors before packing"),
      isNegative: false,
    },
    {
      icon: <CheckCircle2 className="w-5 h-5 text-[#27AE60]" />,
      title: t("Photo Verified"),
      desc: t("Pre-shipment photos sent to buyer for approval"),
      isNegative: false,
    },
  ];
  const clothesFeatures = [
    {
      icon: <Factory className="w-6 h-6 text-[#C0392B]" />,
      title: t("Direct Factory Source"),
      desc: t(
        "15,000m² facility. No middlemen — you buy directly from the source.",
      ),
    },
    {
      icon: <Package className="w-6 h-6 text-[#C0392B]" />,
      title: t("Consistent Grading"),
      desc: t(
        "Standardized grading across all batches. What you see is what you get.",
      ),
    },
    {
      icon: <Ship className="w-6 h-6 text-[#C0392B]" />,
      title: t("Global Export"),
      desc: t(
        "Experience since 2012 exporting to {v0} countries with full documentation.",
        { v0: companyStats.countriesCount },
      ),
    },
    {
      icon: <Zap className="w-6 h-6 text-[#C0392B]" />,
      title: t("Fast Lead Time"),
      desc: t(
        "Orders ready in 7–14 days. Large ready-stock inventory for immediate dispatch.",
      ),
    },
  ];
  const clothesFaqs = [
    {
      q: t("What is the minimum order quantity?"),
      a: t(
        "Our minimum order is 100 bales (approximately 4,500 kg). For brand-specific orders, the MOQ is 200 bales.",
      ),
    },
    {
      q: t("Can I request a specific brand mix?"),
      a: t(
        "Yes. We offer custom brand mix orders for orders above 500 bales. A small custom sorting fee applies.",
      ),
    },
    {
      q: t("Do you provide samples?"),
      a: t(
        "Yes. We can send a 1–2 bale sample for a fee (deducted from your first bulk order).",
      ),
    },
    {
      q: t("What payment methods do you accept?"),
      a: t(
        "We accept T/T (30% deposit), Western Union, and L/C for large orders.",
      ),
    },
  ];
  const productSchema = getWholesaleCatalogSchema({
    language: locale,
    name: t("Used Brand Clothes Wholesale"),
    description: t(
      "Sorted second-hand branded clothes. Nike, Adidas, and more. Global export support from China.",
    ),
    image:
      "https://www.realismthrift.com/images/clothes/assorted-jeans-sweatpants-lee-fila-stack.webp",
    url: `https://www.realismthrift.com${localePath("/used-brand-clothes", locale)}`,
  });

  const faqSchema = getFaqSchema(clothesFaqs);

  return (
    <div className="bg-white">
      <JsonLd data={productSchema} />
      <JsonLd data={faqSchema} />
      {/* ═══════════════════════════════════════════════════════
          HERO — Full-width AI sorting facility photo
          ═══════════════════════════════════════════════════════ */}
      <section className="rt-page-hero">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/clothes/assorted-jeans-sweatpants-lee-fila-stack.webp"
            alt={t(
              "RealismThrift Sorting Facility - Wholesale Used Brand Clothes Inventory for Global B2B Export from China Factory",
            )}
            fill
            sizes="100vw"
            priority
            className="object-cover object-center"
          />
        </div>
        <div className="rt-page-hero-overlay" />
        <div className="relative z-10 w-full">
          <div className="max-w-[1280px] mx-auto px-8 w-full">
            <nav className="text-[0.75rem] text-white/45 mb-4 flex gap-[0.4rem] items-center flex-wrap">
              <Link
                href={localePath("/", locale)}
                className="text-white/45 no-underline hover:text-white/60 transition-colors"
              >
                {t("Home")}
              </Link>
              <span>›</span>
              <span className="text-white/70">{t("Used Brand Clothes")}</span>
            </nav>
            <div className="inline-block bg-[#C0392B] text-white font-montserrat font-bold text-[0.65rem] tracking-[0.12em] px-[0.875rem] py-[0.3rem] rounded-[2px] mb-[0.875rem] uppercase">
              {t("Wholesale · B2B Export · China Supplier")}
            </div>
            <h1 className="font-montserrat font-black text-[clamp(1.6rem,4.5vw,2.5rem)] text-white m-0 mb-4 leading-[1.15] max-w-[580px]">
              {locale === "en" ? (
                <>
                  {t("Used Brand Clothes")}
                  <br />
                  <span className="text-[#F0B429]">
                    {t("Wholesale Supplier")}
                  </span>
                </>
              ) : (
                t("Used Brand Clothes Wholesale Supplier")
              )}
            </h1>
            <p className="text-[0.9375rem] text-white/80 font-open-sans max-w-[500px] leading-[1.75] m-0 mb-[1.75rem]">
              {t(
                "Sorted and graded second-hand branded clothing from China. Nike, Adidas, H&M, Zara and 200+ brands. 5-step sorting. MOQ 100 bales. Export support available.",
              )}
            </p>
            <div className="flex gap-[0.875rem] flex-wrap">
              <a
                href="#inquiry"
                className="bg-[#F0B429] text-[#1A1A1A] font-montserrat font-extrabold text-[0.875rem] px-6 md:px-8 py-3 md:py-[0.875rem] rounded-[3px] no-underline tracking-[0.03em] hover:bg-[#d4a017] transition-colors whitespace-nowrap"
              >
                {t("GET PRICE NOW →")}
              </a>
              <a
                href="https://wa.me/8617279444062?text=Hi%2C+I+want+to+wholesale+used+brand+clothes"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#137a3c] text-white font-montserrat font-bold text-[0.875rem] px-6 md:px-8 py-3 md:py-[0.875rem] rounded-[3px] no-underline hover:bg-[#106631] transition-colors whitespace-nowrap"
              >
                {t("WhatsApp Now")}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <div className="bg-[#C0392B] py-4">
        <div className="max-w-[1280px] mx-auto px-8 flex flex-wrap gap-6 justify-around items-center">
          {[
            { num: "200+", label: t("Brands Available") },
            { num: t("A/B/C"), label: t("Quality Grades") },
            { num: t("100 bales"), label: t("Min. Order") },
            { num: t("7–14 days"), label: t("Lead Time") },
            { num: companyStats.countriesCount, label: t("Export Countries") },
            { num: t("Since 2012"), label: t("Experience") },
          ].map((stat, i) => (
            <div key={i} className="text-center text-white">
              <div className="font-montserrat font-black text-[1.25rem]">
                {stat.num}
              </div>
              <div className="text-[0.65rem] opacity-85 uppercase tracking-[0.07em] mt-[0.15rem]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN LAYOUT: Left Content + Right Sidebar */}
      <div className="max-w-[1280px] mx-auto py-[3.5rem] px-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-[3rem] items-start">
        {/* ─── LEFT CONTENT ─── */}
        <div className="min-w-0">
          {/* INTRO */}
          <section className="mb-[3rem]">
            <div className="flex items-center gap-[0.75rem] mb-[1rem]">
              <div className="w-[4px] h-[26px] bg-[#C0392B] rounded-[2px] shrink-0" />
              <h2 className="font-montserrat font-extrabold text-[1.4rem] text-[#1A1A1A] m-0">
                {t("What We Supply")}
              </h2>
            </div>
            <p className="font-open-sans text-[0.9375rem] text-[#555] leading-[1.8] m-0 mb-4">
              {t(
                "RealismThrift Export is a wholesale supplier of used branded clothing based in Huizhou, China. We operate a 15,000m² sorting facility with trained staff who process and grade second-hand garments from major Chinese cities. Each bale is packed through our standardized 5-step sorting and quality-control process.",
              )}
            </p>
            <p className="font-open-sans text-[0.9375rem] text-[#555] leading-[1.8] m-0">
              <TranslatedText
                locale={locale}
                text={
                  "We supply wholesale buyers, thrift store chains, market traders, and NGOs across Africa, Southeast Asia, the Middle East, Latin America, and Europe. To complement your clothing orders, we also supply wholesale {shoes} and {bags} directly from our specialized sorting lines. Whether you need a 100-bale trial order or a full 40HQ container, we coordinate sorting, packing, and export shipment planning."
                }
                values={{
                  shoes: (
                    <Link
                      href={localePath("/used-brand-shoes", locale)}
                      className="text-[#C0392B] font-bold hover:underline"
                    >
                      {t("Used Brand Shoes")}
                    </Link>
                  ),
                  bags: (
                    <Link
                      href={localePath("/used-brand-bag", locale)}
                      className="text-[#C0392B] font-bold hover:underline"
                    >
                      {t("Used Brand Bags")}
                    </Link>
                  ),
                }}
              />
            </p>
          </section>

          {/* BRAND SHOWCASE */}
          <section className="mb-[3rem]">
            <div className="flex items-center gap-[0.75rem] mb-[1.25rem]">
              <div className="w-[4px] h-[26px] bg-[#C0392B] rounded-[2px] shrink-0" />
              <h2 className="font-montserrat font-extrabold text-[1.4rem] text-[#1A1A1A] m-0">
                {t("Brands in Our Stock")}
              </h2>
            </div>

            {[
              {
                title: t("Sportswear"),
                colorClass: "bg-[#C0392B]",
                brands: [
                  "Nike",
                  "Adidas",
                  "Puma",
                  t("Under Armour"),
                  t("New Balance"),
                  "Reebok",
                  "Champion",
                  "Fila",
                  "Lululemon",
                  "Columbia",
                  t("The North Face"),
                  "Patagonia",
                ],
              },
              {
                title: t("Fast Fashion"),
                colorClass: "bg-[#1A1A1A]",
                brands: [
                  "H&M",
                  "Zara",
                  "Uniqlo",
                  "Mango",
                  "Gap",
                  t("Old Navy"),
                  t("Forever 21"),
                  "Primark",
                  "Topshop",
                  "ASOS",
                  "Shein",
                  "Next",
                ],
              },
              {
                title: t("Premium / Luxury"),
                colorClass: "bg-[#8B6914]",
                brands: [
                  t("Ralph Lauren"),
                  t("Tommy Hilfiger"),
                  t("Calvin Klein"),
                  "Lacoste",
                  t("Hugo Boss"),
                  "Armani",
                  "Burberry",
                  "Guess",
                  t("Michael Kors"),
                  "Coach",
                ],
              },
              {
                title: t("Denim & Casual"),
                colorClass: "bg-[#2C5F8A]",
                brands: [
                  "Levi's",
                  "Wrangler",
                  "Lee",
                  "Diesel",
                  t("G-Star Raw"),
                  t("True Religion"),
                  "Hollister",
                  t("American Eagle"),
                  t("Banana Republic"),
                  "J.Crew",
                ],
              },
            ].map((group) => (
              <div
                key={group.title}
                className="mb-[1rem] border border-[#eee] rounded-[4px] overflow-hidden"
              >
                <div className={`px-[1.25rem] py-[0.5rem] ${group.colorClass}`}>
                  <span className="font-montserrat font-bold text-[0.75rem] text-white tracking-[0.08em] uppercase">
                    {group.title}
                  </span>
                </div>
                <div className="p-[0.875rem_1.25rem] flex flex-wrap gap-[0.4rem] bg-white">
                  {group.brands.map((b) => (
                    <span
                      key={b}
                      className="bg-[#F5F5F0] border border-[#e5e5e5] text-[#444] font-open-sans text-[0.8rem] px-[0.75rem] py-[0.25rem] rounded-[2px] font-semibold"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            <p className="text-[0.8rem] text-[#aaa] font-open-sans italic mt-2">
              {t(
                "* Brand availability varies by season and batch. Contact us for current stock list and photos.",
              )}
            </p>
          </section>

          {/* ═══ SORTING PROCESS — CORE SECTION ═══ */}
          <section className="mb-[3.5rem]">
            <div className="flex items-center gap-[0.75rem] mb-[0.5rem]">
              <div className="w-[4px] h-[26px] bg-[#C0392B] rounded-[2px] shrink-0" />
              <h2 className="font-montserrat font-extrabold text-[1.4rem] text-[#1A1A1A] m-0">
                {t("Our 5-Step Sorting Process")}
              </h2>
            </div>
            <p className="font-open-sans text-[0.9375rem] text-[#555] leading-[1.8] m-0 mb-[2.5rem]">
              {t(
                "Our sorting process is designed to make each bale easier to evaluate before purchase. Bales are grouped by product type, grade, weight, and market use before leaving our facility.",
              )}
            </p>

            {/* STEP 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[2rem] items-center mb-[3rem]">
              <div>
                <div className="flex items-center gap-[0.875rem] mb-[1rem]">
                  <div className="w-[52px] h-[52px] bg-[#C0392B] rounded-full flex items-center justify-center shrink-0 shadow-[0_4px_16px_rgba(192,57,43,0.35)]">
                    <span className="font-montserrat font-black text-[1.25rem] text-white">
                      1
                    </span>
                  </div>
                  <div>
                    <div className="text-[0.7rem] text-[#C0392B] font-montserrat font-bold tracking-[0.08em] uppercase mb-[0.2rem]">
                      {t("Step 01")}
                    </div>
                    <h3 className="font-montserrat font-extrabold text-[1.1rem] text-[#1A1A1A] m-0">
                      {t("Raw Material Collection & Initial Separation")}
                    </h3>
                  </div>
                </div>
                <p className="font-open-sans text-[0.9rem] text-[#555] leading-[1.8] m-0 mb-[1rem]">
                  {t(
                    "Raw second-hand clothing arrives daily at our Huizhou facility from collection networks across Beijing, Shanghai, Shenzhen, and other first-tier cities. Upon arrival, all items are immediately separated by garment type — tops, bottoms, outerwear, sportswear, and accessories — before any further processing begins.",
                  )}
                </p>
                <div className="bg-[#F5F5F0] rounded-[4px] p-[1rem]">
                  <div className="font-montserrat font-bold text-[0.8rem] text-[#1A1A1A] mb-[0.625rem]">
                    {t("What happens at this stage:")}
                  </div>
                  <ul className="m-0 ps-[1.25rem] font-open-sans text-[0.8125rem] text-[#555] leading-[1.9] list-disc">
                    <li>
                      {t(
                        "Separated by type: tops / bottoms / outerwear / sportswear / accessories",
                      )}
                    </li>
                    <li>
                      {t(
                        "Immediate removal of non-clothing items, heavily soiled pieces, and non-exportable waste",
                      )}
                    </li>
                    <li>
                      {t("Initial rejection rate: 8–12% of incoming volume")}
                    </li>
                    <li>
                      {t(
                        "Daily processing capacity: 15–20 tons of raw material",
                      )}
                    </li>
                  </ul>
                </div>
              </div>
              <div className="rounded-[8px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.14)] relative h-[280px]">
                <Image
                  src="/images/clothes/adidas-kelme-athletic-shorts-pants-pile.webp"
                  alt={t(
                    "RealismThrift Sorting Process Step 1 - Raw Material Collection and Initial Separation of Bulk Second-Hand Clothing in China Factory",
                  )}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>

            {/* STEP 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[2rem] items-center mb-[3rem]">
              <div className="rounded-[8px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.14)] relative h-[280px] order-2 md:order-1">
                <Image
                  src="/images/clothes/assorted-designer-hats-caps-collection.webp"
                  alt={t(
                    "Assorted used caps and bucket hats arranged on a table",
                  )}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="order-1 md:order-2">
                <div className="flex items-center gap-[0.875rem] mb-[1rem]">
                  <div className="w-[52px] h-[52px] bg-[#C0392B] rounded-full flex items-center justify-center shrink-0 shadow-[0_4px_16px_rgba(192,57,43,0.35)]">
                    <span className="font-montserrat font-black text-[1.25rem] text-white">
                      2
                    </span>
                  </div>
                  <div>
                    <div className="text-[0.7rem] text-[#C0392B] font-montserrat font-bold tracking-[0.08em] uppercase mb-[0.2rem]">
                      {t("Step 02")}
                    </div>
                    <h3 className="font-montserrat font-extrabold text-[1.1rem] text-[#1A1A1A] m-0">
                      {t("Brand Label & Condition Checks")}
                    </h3>
                  </div>
                </div>
                <p className="font-open-sans text-[0.9rem] text-[#555] leading-[1.8] m-0 mb-[1rem]">
                  {t(
                    "Our sorters check brand labels, stitching and condition, and remove obvious counterfeit or unsuitable items from brand-focused batches. Items are grouped for further sorting; label checks are not a guarantee of professional authentication.",
                  )}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-[0.625rem]">
                  {[
                    t("Label verification (brand, origin, fabric)"),
                    t("Stitching & seam integrity check"),
                    t("Zipper and button function test"),
                    t("Brand-specific bin sorting"),
                    t("Label and logo condition checks"),
                    t("Counterfeit rejection protocol"),
                  ].map((chk) => (
                    <div
                      key={chk}
                      className="flex items-start gap-[0.4rem] font-open-sans text-[0.8rem] text-[#555]"
                    >
                      <span className="text-[#27AE60] text-[0.875rem] shrink-0 mt-[0.05rem]">
                        ✓
                      </span>
                      <span>{chk}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* STEP 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[2rem] items-center mb-[3rem]">
              <div>
                <div className="flex items-center gap-[0.875rem] mb-[1rem]">
                  <div className="w-[52px] h-[52px] bg-[#C0392B] rounded-full flex items-center justify-center shrink-0 shadow-[0_4px_16px_rgba(192,57,43,0.35)]">
                    <span className="font-montserrat font-black text-[1.25rem] text-white">
                      3
                    </span>
                  </div>
                  <div>
                    <div className="text-[0.7rem] text-[#C0392B] font-montserrat font-bold tracking-[0.08em] uppercase mb-[0.2rem]">
                      {t("Step 03")}
                    </div>
                    <h3 className="font-montserrat font-extrabold text-[1.1rem] text-[#1A1A1A] m-0">
                      {t("Quality Grading: A / B / C")}
                    </h3>
                  </div>
                </div>
                <p className="font-open-sans text-[0.9rem] text-[#555] leading-[1.8] m-0 mb-[1.25rem]">
                  {t(
                    "Each garment is assessed against our standardized 3-tier grading system. Graders evaluate fabric condition, color fastness, stain presence, pilling, and overall wearability using a 6-point checklist. This grading system is consistent across all batches — so buyers always know exactly what they're receiving.",
                  )}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-[0.75rem]">
                  <div className="border-2 border-[#27AE60] rounded-[4px] p-[0.875rem] text-center">
                    <div className="font-montserrat font-extrabold text-[0.875rem] text-[#27AE60] mb-[0.4rem]">
                      {t("Grade A")}
                    </div>
                    <p className="text-[0.75rem] text-[#666] font-open-sans leading-[1.6] m-0">
                      {t(
                        "Higher-grade resale stock. Minor wear may appear, while major stains, tears, or heavy fading are rejected.",
                      )}
                    </p>
                  </div>
                  <div className="border-2 border-[#F0B429] rounded-[4px] p-[0.875rem] text-center">
                    <div className="font-montserrat font-extrabold text-[0.875rem] text-[#F0B429] mb-[0.4rem]">
                      {t("Grade B")}
                    </div>
                    <p className="text-[0.75rem] text-[#666] font-open-sans leading-[1.6] m-0">
                      {t(
                        "Good condition. Minor signs of wear. Light marks. Regular resale quality.",
                      )}
                    </p>
                  </div>
                  <div className="border-2 border-[#C0392B] rounded-[4px] p-[0.875rem] text-center">
                    <div className="font-montserrat font-extrabold text-[0.875rem] text-[#C0392B] mb-[0.4rem]">
                      {t("Grade C")}
                    </div>
                    <p className="text-[0.75rem] text-[#666] font-open-sans leading-[1.6] m-0">
                      {t(
                        "Wearable. Visible wear or minor stains. Budget markets or upcycling.",
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-[8px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.14)] relative h-[300px]">
                <Image
                  src="/images/clothes/mixed-fila-puma-tshirts-polo-shirts.webp"
                  alt={t(
                    "RealismThrift Grading Standards Step 3 - Sorted Wholesale Clothing Batches from China",
                  )}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>

            {/* STEP 4 */}
            <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2d2020] rounded-[8px] p-6 sm:p-8 mb-[2rem] grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-[1.5rem] items-start">
              <div className="w-[52px] h-[52px] bg-[#C0392B] rounded-full flex items-center justify-center shrink-0">
                <span className="font-montserrat font-black text-[1.25rem] text-white">
                  4
                </span>
              </div>
              <div>
                <div className="text-[0.7rem] text-[#F0B429] font-montserrat font-bold tracking-[0.08em] uppercase mb-[0.3rem]">
                  {t("Step 04")}
                </div>
                <h3 className="font-montserrat font-extrabold text-[1.1rem] text-white m-0 mb-[0.75rem]">
                  {t("Condition Review & Packing Preparation")}
                </h3>
                <p className="font-open-sans text-[0.9rem] text-white/70 leading-[1.8] m-0 mb-[1.25rem]">
                  {t(
                    "Garments are reviewed for sellable used condition before packing. Light signs of use are acceptable when items remain wearable and functional.",
                  )}
                </p>
                <div className="flex flex-wrap gap-[0.625rem]">
                  {[
                    t("Wear and stain checks"),
                    t("Buttons and zipper checks"),
                    t("Unsuitable items removed"),
                    t("Category and grade confirmation"),
                    t("Final visual re-inspection"),
                  ].map((feat) => (
                    <span
                      key={feat}
                      className="bg-[#F0B429]/10 border border-[#F0B429]/25 text-[#F0B429] font-open-sans text-[0.8rem] px-[0.75rem] py-[0.3rem] rounded-[2px]"
                    >
                      ✓ {feat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* STEP 5 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[2rem] items-center mb-[2rem]">
              <div className="rounded-[8px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.14)] relative h-[280px] order-2 md:order-1">
                <Image
                  src="/images/clothes/athletic-track-jackets-lining-nike-stack.webp"
                  alt={t("Used athletic track jackets stacked by category")}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="order-1 md:order-2">
                <div className="flex items-center gap-[0.875rem] mb-[1rem]">
                  <div className="w-[52px] h-[52px] bg-[#C0392B] rounded-full flex items-center justify-center shrink-0 shadow-[0_4px_16px_rgba(192,57,43,0.35)]">
                    <span className="font-montserrat font-black text-[1.25rem] text-white">
                      5
                    </span>
                  </div>
                  <div>
                    <div className="text-[0.7rem] text-[#C0392B] font-montserrat font-bold tracking-[0.08em] uppercase mb-[0.2rem]">
                      {t("Step 05")}
                    </div>
                    <h3 className="font-montserrat font-extrabold text-[1.1rem] text-[#1A1A1A] m-0">
                      {t("Weighing, Compression Packing & Export QC")}
                    </h3>
                  </div>
                </div>
                <p className="font-open-sans text-[0.9rem] text-[#555] leading-[1.8] m-0 mb-[1rem]">
                  {t(
                    "Sorted garments are hydraulically compressed and packed into PP woven bales at precise weights. Each bale is labeled with grade, weight, content, and destination. Before container loading, the team checks the prepared batch and packing details. Photos and videos of your specific order are sent to you for approval before shipment.",
                  )}
                </p>
                <div className="bg-[#F5F5F0] rounded-[4px] p-[1rem]">
                  <div className="font-montserrat font-bold text-[0.8rem] text-[#1A1A1A] mb-[0.625rem]">
                    {t("Standard Packing Specs")}
                  </div>
                  <table className="w-full border-collapse font-open-sans text-[0.8rem]">
                    <tbody>
                      {[
                        [t("Bale weight"), t("25 / 45 / 70 kg options")],
                        [t("Bale size"), t("75×40×35 cm (standard)")],
                        [t("20GP capacity"), t("~280 bales (~13 tons)")],
                        [t("40HQ capacity"), t("~580 bales (~28 tons)")],
                        [t("Custom packing"), t("Available on request")],
                      ].map(([label, val], i) => (
                        <tr key={label} className="border-b border-[#e8e8e8]">
                          <td className="py-[0.375rem] px-[0.5rem] text-[#888]">
                            {label}
                          </td>
                          <td className="py-[0.375rem] px-[0.5rem] text-[#333] font-semibold">
                            {val}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          {/* BALE CONTENTS */}
          <section className="mb-[3rem]">
            <div className="flex items-center gap-[0.75rem] mb-[1.25rem]">
              <div className="w-[4px] h-[26px] bg-[#C0392B] rounded-[2px] shrink-0" />
              <h2 className="font-montserrat font-extrabold text-[1.4rem] text-[#1A1A1A] m-0">
                {t("What's Inside a Typical Bale")}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[2rem] items-center">
              <div className="rounded-[8px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.12)] relative h-[320px]">
                <Image
                  src="/images/clothes/adidas-sport-shorts-pink-white-stripes.webp"
                  alt={t(
                    "RealismThrift Typical Bale Composition - Sorted Second-Hand Sportswear for Retail Resale Markets",
                  )}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-open-sans text-[0.9rem] text-[#555] leading-[1.8] m-0 mb-[1.25rem]">
                  {t(
                    "A typical Grade A Mixed Brand bale (45kg) contains approximately 120–180 individual garments across multiple categories and brands. The exact composition varies by batch, but our standard mix ratio ensures a balanced assortment that appeals to a wide customer base.",
                  )}
                </p>
                <table className="w-full border-collapse font-open-sans text-[0.8125rem]">
                  <thead>
                    <tr className="bg-[#1A1A1A]">
                      <th className="p-[0.625rem_0.875rem] text-left text-[#F0B429] font-montserrat font-bold text-[0.75rem]">
                        {t("Category")}
                      </th>
                      <th className="p-[0.625rem_0.875rem] text-center text-[#F0B429] font-montserrat font-bold text-[0.75rem]">
                        {t("% of Bale")}
                      </th>
                      <th className="p-[0.625rem_0.875rem] text-center text-[#F0B429] font-montserrat font-bold text-[0.75rem]">
                        {t("Approx. Pieces")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      [
                        t("T-Shirts & Polo Shirts"),
                        "30%",
                        t("36–54 pcs"),
                        "bg-white",
                      ],
                      [
                        t("Hoodies & Sweatshirts"),
                        "20%",
                        t("24–36 pcs"),
                        "bg-[#F5F5F0]",
                      ],
                      [
                        t("Jeans & Trousers"),
                        "20%",
                        t("24–36 pcs"),
                        "bg-white",
                      ],
                      [
                        t("Jackets & Coats"),
                        "15%",
                        t("18–27 pcs"),
                        "bg-[#F5F5F0]",
                      ],
                      [
                        t("Dresses & Skirts"),
                        "10%",
                        t("12–18 pcs"),
                        "bg-white",
                      ],
                      [
                        t("Sportswear Sets"),
                        "5%",
                        t("6–9 pcs"),
                        "bg-[#F5F5F0]",
                      ],
                    ].map(([cat, pct, pcs, bg]) => (
                      <tr key={cat} className={`${bg} border-b border-[#eee]`}>
                        <td className="p-[0.5rem_0.875rem] text-[#444]">
                          {cat}
                        </td>
                        <td className="p-[0.5rem_0.875rem] text-center text-[#C0392B] font-bold">
                          {pct}
                        </td>
                        <td className="p-[0.5rem_0.875rem] text-center text-[#555]">
                          {pcs}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* PRODUCT GRID */}
          <section className="mb-[3rem]">
            <div className="flex items-center gap-[0.75rem] mb-[1.25rem]">
              <div className="w-[4px] h-[26px] bg-[#C0392B] rounded-[2px] shrink-0" />
              <h2 className="font-montserrat font-extrabold text-[1.4rem] text-[#1A1A1A] m-0">
                {t("Product Categories Available")}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[1.25rem]">
              {[
                {
                  title: t("Used Brand T-Shirts"),
                  img: "/images/clothes/champion-white-tshirt-green-script-logo.webp",
                  desc: t("Nike, Adidas, Puma mix"),
                  spec: t("25kg/bale"),
                },
                {
                  title: t("Used Brand Jeans"),
                  img: "/images/clothes/slim-fit-denim-jeans-classic-blue.webp",
                  desc: t("Levi's, Gap, Zara mix"),
                  spec: t("45kg/bale"),
                },
                {
                  title: t("Used Brand Jackets"),
                  img: "/images/clothes/balenciaga-graffiti-denim-jacket-light-blue.webp",
                  desc: t("North Face, Nike, Adidas"),
                  spec: t("30kg/bale"),
                },
                {
                  title: t("Used Brand Dresses"),
                  img: "/images/clothes/lacoste-green-polo-dress-crocodile-logo.webp",
                  desc: t("Zara, H&M, Mango mix"),
                  spec: t("25kg/bale"),
                },
                {
                  title: t("Used Brand Hoodies"),
                  img: "/images/clothes/celine-black-hoodie-white-embroidered-logo.webp",
                  desc: t("Champion, Nike, Adidas"),
                  spec: t("35kg/bale"),
                },
                {
                  title: t("Used Brand Sportswear"),
                  img: "/images/clothes/nike-pro-dri-fit-croatia-jersey-stack.webp",
                  desc: t("Nike, Adidas, Under Armour"),
                  spec: t("30kg/bale"),
                },
              ].map((prod) => (
                <div
                  key={prod.title}
                  className="bg-white border border-[#eee] rounded-[6px] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
                >
                  <div className="relative h-[170px]">
                    <Image
                      src={prod.img}
                      alt={t(
                        "RealismThrift Wholesale {v0} - Sorted Bulk Second-Hand Clothing Inventory from China",
                        { v0: prod.title },
                      )}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-[#C0392B] text-white text-[0.6rem] font-bold px-2 py-1 rounded-[2px] font-montserrat">
                      {t("A-GRADE")}
                    </div>
                  </div>
                  <div className="p-[0.875rem]">
                    <h3 className="font-montserrat text-[0.875rem] font-bold text-[#1A1A1A] m-0 mb-[0.3rem]">
                      {prod.title}
                    </h3>
                    <p className="text-[0.75rem] text-[#888] m-0 mb-[0.5rem]">
                      {prod.desc}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-[0.75rem] text-[#C0392B] font-bold">
                        {prod.spec}
                      </span>
                      <a
                        href="#inquiry"
                        className="bg-[#1A1A1A] text-white text-[0.7rem] px-[0.75rem] py-[0.3rem] rounded-[2px] no-underline font-montserrat font-semibold"
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

          {/* SPECS TABLE */}
          <section className="mb-[3rem]">
            <div className="flex items-center gap-[0.75rem] mb-[1.25rem]">
              <div className="w-[4px] h-[26px] bg-[#C0392B] rounded-[2px] shrink-0" />
              <h2 className="font-montserrat font-extrabold text-[1.4rem] text-[#1A1A1A] m-0">
                {t("Product Specifications & Pricing")}
              </h2>
            </div>
            <div className="rt-table-wrap overflow-x-auto rounded-[6px] shadow-[0_2px_8px_rgba(0,0,0,0.07)]">
              <table className="w-full border-collapse text-[0.8125rem] bg-white min-w-[700px]">
                <thead>
                  <tr className="bg-[#1A1A1A]">
                    <th className="p-[0.875rem_1rem] text-left text-[#F0B429] font-montserrat font-bold">
                      {t("Category")}
                    </th>
                    <th className="p-[0.875rem_1rem] text-center text-[#F0B429] font-montserrat font-bold">
                      {t("Grade")}
                    </th>
                    <th className="p-[0.875rem_1rem] text-center text-[#F0B429] font-montserrat font-bold">
                      {t("Bale Weight")}
                    </th>
                    <th className="p-[0.875rem_1rem] text-center text-[#F0B429] font-montserrat font-bold">
                      {t("MOQ")}
                    </th>
                    <th className="p-[0.875rem_1rem] text-center text-[#F0B429] font-montserrat font-bold">
                      {t("Price Range")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(
                    [
                      [
                        t("Mixed Brand Clothes"),
                        { label: t("A"), bg: "bg-[#27AE60]" },
                        t("45 kg"),
                        t("100 bales"),
                        "$1.8–$2.5/kg",
                        "bg-white",
                      ],
                      [
                        t("Nike / Adidas Specific"),
                        { label: t("A"), bg: "bg-[#27AE60]" },
                        t("45 kg"),
                        t("200 bales"),
                        "$3.5–$5.0/kg",
                        "bg-[#FAFAFA]",
                      ],
                      [
                        t("Denim & Jeans Mix"),
                        { label: t("A"), bg: "bg-[#27AE60]" },
                        t("45 kg"),
                        t("100 bales"),
                        "$2.0–$3.0/kg",
                        "bg-white",
                      ],
                      [
                        t("Jackets & Coats Mix"),
                        { label: t("A/B"), bg: "bg-[#C0392B]" },
                        t("30 kg"),
                        t("100 bales"),
                        "$2.5–$4.0/kg",
                        "bg-[#FAFAFA]",
                      ],
                      [
                        t("Children's Clothes Mix"),
                        { label: t("A"), bg: "bg-[#27AE60]" },
                        t("25 kg"),
                        t("100 bales"),
                        "$1.5–$2.2/kg",
                        "bg-white",
                      ],
                      [
                        t("Mixed Brand (B-Grade)"),
                        { label: t("B"), bg: "bg-[#F0B429]" },
                        t("45 kg"),
                        t("100 bales"),
                        "$0.8–$1.2/kg",
                        "bg-[#FAFAFA]",
                      ],
                      [
                        t("Bulk Mixed (C-Grade)"),
                        { label: t("C"), bg: "bg-[#C0392B]" },
                        t("45 kg"),
                        t("500 bales"),
                        "$0.3–$0.6/kg",
                        "bg-white",
                      ],
                    ] as [
                      string,
                      { label: string; bg: string },
                      string,
                      string,
                      string,
                      string,
                    ][]
                  ).map(([cat, grade, w, moq, price, rowBg]) => (
                    <tr
                      key={cat}
                      className={`${rowBg} border-b border-[#f0f0f0]`}
                    >
                      <td className="p-[0.75rem_1rem] font-semibold text-[#1A1A1A]">
                        {cat}
                      </td>
                      <td className="p-[0.75rem_1rem] text-center">
                        <span
                          className={`${grade.bg} text-white text-[0.65rem] font-montserrat font-bold p-[0.2rem_0.5rem] rounded-[2px]`}
                        >
                          {grade.label}
                        </span>
                      </td>
                      <td className="p-[0.75rem_1rem] text-center text-[#555]">
                        {w}
                      </td>
                      <td className="p-[0.75rem_1rem] text-center">
                        <span className="bg-[#F0B429] text-[#1A1A1A] text-[0.7rem] font-montserrat font-bold p-[0.2rem_0.5rem] rounded-[2px]">
                          {moq}
                        </span>
                      </td>
                      <td className="p-[0.75rem_1rem] text-center text-[#C0392B] font-bold">
                        {price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[0.75rem] text-[#aaa] font-open-sans italic mt-[0.625rem]">
              {t(
                "* Prices are indicative. Contact us for a current quote. Volume discounts for orders above 1,000 bales.",
              )}
            </p>
          </section>

          {/* QUALITY STANDARDS */}
          <QualityStandards locale={locale} standards={clothesStandards} />

          {/* TRUST SECTIONS (Why Choose Us & FAQ) */}
          <ProductTrustSections
            locale={locale}
            features={clothesFeatures}
            faqs={clothesFaqs}
          />
        </div>
        {/* END LEFT CONTENT */}

        {/* ─── RIGHT SIDEBAR ─── */}
        <aside>
          <div className="sticky top-[90px]">
            {/* Sticky Inquiry CTA */}
            <div
              id="inquiry"
              className="bg-white border border-[#eee] rounded-[8px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden mb-[1.5rem]"
            >
              <div className="bg-[#C0392B] p-[1.25rem_1.5rem]">
                <h3 className="font-montserrat text-[1rem] font-extrabold text-white m-0 mb-[0.25rem]">
                  {t("Get Wholesale Price")}
                </h3>
                <p className="text-[0.75rem] text-white/80 m-0">
                  {t(
                    "We aim to reply within 12 hours · Ask about sample pricing",
                  )}
                </p>
              </div>
              <div className="p-[1.5rem]">
                <InquiryForm
                  locale={locale}
                  messages={getClientMessages(locale, "form")}
                  variant="sidebar"
                />
                <a
                  href="https://wa.me/8617279444062?text=Hi%2C+I+want+used+brand+clothes+wholesale+price"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-[0.5rem] bg-[#137a3c] text-white p-[0.625rem] rounded-[3px] no-underline font-montserrat font-bold text-[0.8125rem] mt-[0.75rem] hover:bg-[#106631] transition-colors"
                >
                  {t("Chat on WhatsApp")}
                </a>
              </div>
            </div>

            {/* Quick Specs */}
            <div className="bg-[#1A1A1A] rounded-[8px] p-[1.5rem] mb-[1.5rem]">
              <h4 className="font-montserrat text-[0.875rem] font-extrabold text-[#F0B429] m-0 mb-[1rem]">
                {t("Quick Specs")}
              </h4>
              {[
                ["MOQ", t("100 bales (4,500 kg)")],
                [t("Bale Weight"), t("25–70 kg/bale")],
                [t("Quality"), t("A / B / C Grade")],
                [t("Lead Time"), t("7–14 days")],
                [t("Payment"), t("T/T, Western Union")],
                [t("Shipping"), t("FOB Guangzhou / CIF")],
                [t("Quality Check"), t("6-Point Inspection")],
              ].map(([key, val]) => (
                <div
                  key={key}
                  className="flex justify-between py-[0.4rem] border-b border-white/5 text-[0.8rem]"
                >
                  <span className="text-white/55">{key}</span>
                  <span className="text-white font-semibold">{val}</span>
                </div>
              ))}
            </div>

            {/* Related Products */}
            <div className="bg-white border border-[#eee] rounded-[8px] p-[1.5rem]">
              <h4 className="font-montserrat text-[0.875rem] font-extrabold text-[#1A1A1A] m-0 mb-[1rem]">
                {t("Also Available")}
              </h4>
              {[
                {
                  icon: <Footprints className="w-5 h-5 text-[#8B6914]" />,
                  title: t("Used Brand Shoes"),
                  href: "/used-brand-shoes",
                },
                {
                  icon: <ShoppingBag className="w-5 h-5 text-[#C0392B]" />,
                  title: t("Used Brand Bags"),
                  href: "/used-brand-bag",
                },
                {
                  icon: <ClipboardList className="w-5 h-5 text-[#1A1A1A]" />,
                  title: t("How To Order"),
                  href: "/how-to-order",
                },
                {
                  icon: <Mail className="w-5 h-5 text-brand-gold" />,
                  title: t("Contact Us"),
                  href: "/contact-us",
                },
              ].map((rel) => (
                <Link
                  key={rel.title}
                  href={localePath(rel.href, locale)}
                  className="flex items-center gap-[0.75rem] py-[0.625rem] border-b border-[#f5f5f5] no-underline group"
                >
                  <span className="shrink-0 group-hover:scale-110 transition-transform">
                    {rel.icon}
                  </span>
                  <span className="font-open-sans text-[0.8125rem] text-[#333] font-semibold group-hover:text-[#C0392B] transition-colors">
                    {rel.title}
                  </span>
                  <ArrowRight
                    aria-hidden="true"
                    size={12}
                    className="text-[#C0392B] ms-auto ltr:group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform"
                  />
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
      {/* END MAIN GRID */}

      {/* BOTTOM CTA BANNER */}
      <ProductCTA
        locale={locale}
        title={t("Ready to Order Used Brand Clothes?")}
        description={t(
          "Request a free wholesale price quotation. Our sales team speaks English, French, Spanish, and Swahili.",
        )}
        whatsappMessage={t(
          "Hi, I want to wholesale used brand clothes. Can I get a price list?",
        )}
      />
    </div>
  );
}

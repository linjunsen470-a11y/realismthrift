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
  XCircle,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Globe2,
  Camera,
  Footprints,
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
      title: t("Used Brand Bags Wholesale | Coach & MK Bags"),
      description: t(
        "Wholesale exporter of sorted second-hand branded handbags, backpacks, and luggage. Coach, Michael Kors, Kate Spade. 6-point inspection and export packing.",
      ),
      openGraph: {
        title: t("Used Brand Bags Wholesale | China Export Supplier"),
        description: t(
          "Sorted second-hand branded bags. 6-point quality check. Individually wrapped for protection. Global shipping support.",
        ),
        images: ["/images/bags/loewe-puzzle-bag-assorted-colors-display.webp"],
      },
      alternates: {
        canonical: "/used-brand-bag",
      },
    }),
    locale,
  );
}

export default function UsedBrandBagPage({
  locale = "en",
}: { locale?: Locale } = {}) {
  const t = getTranslator(locale);
  const companyStats = getLocalizedData(englishCompanyStats, locale);
  const bagStandards = [
    {
      icon: <XCircle className="w-5 h-5 text-[#C0392B]" />,
      title: t("Zippers Checked"),
      desc: t("Broken or stuck zippers are downgraded or removed"),
      isNegative: true,
    },
    {
      icon: <XCircle className="w-5 h-5 text-[#C0392B]" />,
      title: t("Straps Checked"),
      desc: t(
        "Torn straps or weak attachment points are rejected from higher grades",
      ),
      isNegative: true,
    },
    {
      icon: <XCircle className="w-5 h-5 text-[#C0392B]" />,
      title: t("Heavy Stains Rejected"),
      desc: t("Obvious permanent stains or mold are removed during sorting"),
      isNegative: true,
    },
    {
      icon: <XCircle className="w-5 h-5 text-[#C0392B]" />,
      title: t("Hardware Checked"),
      desc: t("Buckles, clasps, and rings are checked and graded accordingly"),
      isNegative: true,
    },
    {
      icon: <XCircle className="w-5 h-5 text-[#C0392B]" />,
      title: t("Lining Checked"),
      desc: t("Peeling, tearing, or separation is checked before packing"),
      isNegative: true,
    },
    {
      icon: <XCircle className="w-5 h-5 text-[#C0392B]" />,
      title: t("Shape Checked"),
      desc: t("Bags with major crushing or deformation are separated by grade"),
      isNegative: true,
    },
    {
      icon: <CheckCircle2 className="w-5 h-5 text-[#27AE60]" />,
      title: t("Complete Accessories"),
      desc: t(
        "Dust bags, straps, and original accessories included where available",
      ),
      isNegative: false,
    },
    {
      icon: <CheckCircle2 className="w-5 h-5 text-[#27AE60]" />,
      title: t("Brand Label Visible"),
      desc: t("Original brand label or embossing clearly present"),
      isNegative: false,
    },
    {
      icon: <CheckCircle2 className="w-5 h-5 text-[#27AE60]" />,
      title: t("Individually Wrapped"),
      desc: t("Each bag wrapped in plastic before packing"),
      isNegative: false,
    },
  ];
  const bagFeatures = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-brand-gold" />,
      title: t("6-Pt Hardware Check"),
      desc: t(
        "Zippers, clasps, and rings are tested before grading and packing.",
      ),
    },
    {
      icon: <Sparkles className="w-6 h-6 text-brand-gold" />,
      title: t("Deep Interior Cleaning"),
      desc: t(
        "Specialized cleaning for leather, canvas and nylon. Deodorized interiors.",
      ),
    },
    {
      icon: <Globe2 className="w-6 h-6 text-brand-gold" />,
      title: t("Worldwide Export"),
      desc: t(
        "Experience since 2012 in global logistics and exporting to {v0} countries.",
        { v0: companyStats.countriesCount },
      ),
    },
    {
      icon: <Camera className="w-6 h-6 text-brand-gold" />,
      title: t("Photo Verification"),
      desc: t(
        "Live photos and videos of your specific order sent before shipment.",
      ),
    },
  ];
  const bagFaqs = [
    {
      q: t("What is the minimum order quantity for bags?"),
      a: t(
        "Minimum order is 100 pieces for sorted brand categories, or 200 pieces for mixed lots.",
      ),
    },
    {
      q: t("Can I pick specific models or sizes?"),
      a: t(
        "You can specify categories (Handbags, Backpacks, etc.). For specific high-demand models, we offer custom sorting at custom rates.",
      ),
    },
    {
      q: t("How are the bags packed?"),
      a: t(
        "Each bag is individually wrapped in plastic to prevent scratching, then packed in woven sacks or cartons.",
      ),
    },
  ];
  const productSchema = getWholesaleCatalogSchema({
    language: locale,
    name: t("Used Brand Bags Wholesale"),
    description: t(
      "Wholesale exporter of sorted second-hand branded handbags, backpacks, and luggage from China.",
    ),
    image:
      "https://www.realismthrift.com/images/bags/loewe-puzzle-bag-assorted-colors-display.webp",
    url: `https://www.realismthrift.com${localePath("/used-brand-bag", locale)}`,
  });

  const faqSchema = getFaqSchema(bagFaqs);

  return (
    <div className="bg-white">
      <JsonLd data={productSchema} />
      <JsonLd data={faqSchema} />
      <section className="rt-page-hero">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/bags/loewe-puzzle-bag-assorted-colors-display.webp"
            alt={t(
              "RealismThrift Designer Bag Warehouse - Wholesale Supplier of Sorted Used Branded Handbags and Backpacks from China",
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
              <span className="text-white/70">{t("Used Brand Bags")}</span>
            </nav>
            <div className="inline-block bg-brand-red text-white font-montserrat font-bold text-[0.65rem] tracking-[0.12em] px-[0.875rem] py-[0.3rem] rounded-[2px] mb-[1rem] uppercase">
              {t("Coach · Michael Kors · Kate Spade")}
            </div>
            <h1 className="rt-page-hero-title mb-5 text-[clamp(1.75rem,5vw,2.75rem)] leading-[1.1]">
              {locale === "en" ? (
                <>
                  {t("Used Brand Bags ")}
                  <span className="text-brand-gold">{t("Wholesale")}</span>
                </>
              ) : (
                t("Used Brand Bags Wholesale Supplier")
              )}
            </h1>
            <p className="rt-page-hero-sub max-w-[620px] mb-9 leading-[1.8] text-[1.05rem]">
              {t(
                "Sorted second-hand branded handbags, backpacks, and luggage — Coach, Michael Kors, Kate Spade, and 20+ international brands.",
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

      {/* STATS BAR — gold/brown brand color */}
      <div className="bg-[#8B6914] py-4">
        <div className="max-w-[1280px] mx-auto px-8 flex flex-wrap gap-6 justify-around items-center">
          {[
            { num: "20+", label: t("Bag Brands") },
            { num: t("A-Grade"), label: t("Quality Standard") },
            { num: t("38kg"), label: t("Per Sack") },
            { num: t("100 PCS"), label: t("MOQ") },
            { num: t("Cleaned"), label: t("Before Packing") },
          ].map((stat) => (
            <div key={stat.num} className="text-center text-white">
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

      {/* MAIN CONTENT: Left + Right Sidebar */}
      <div className="max-w-[1280px] mx-auto px-6 py-[3rem] grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-[2.5rem] items-start">
        {/* ─── LEFT CONTENT ─── */}
        <div className="min-w-0">
          {/* BRAND LIST */}
          <section className="mb-[3rem]">
            <h2 className="font-montserrat text-[1.4rem] font-extrabold text-[#1A1A1A] border-s-4 border-[#C0392B] ps-[0.875rem] m-0 mb-[1.25rem]">
              {t("Available Bag Brands")}
            </h2>
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                "Coach",
                t("Michael Kors"),
                t("Kate Spade"),
                "Longchamp",
                t("Tory Burch"),
                "Guess",
                t("Calvin Klein"),
                t("Tommy Hilfiger"),
                t("Ralph Lauren"),
                "DKNY",
                "Fossil",
                "Kipling",
                "Samsonite",
                "Herschel",
                "JanSport",
                "Eastpak",
                t("The North Face"),
                "Fjällräven",
                "Tumi",
                t("Vera Bradley"),
              ].map((brand) => (
                <span
                  key={brand}
                  className="bg-[#F5F5F0] border border-[#e0e0e0] text-[#333] px-[0.875rem] py-[0.35rem] rounded-[2px] text-[0.8rem] font-montserrat font-semibold"
                >
                  {brand}
                </span>
              ))}
            </div>
          </section>

          {/* PRODUCT SHOWCASE */}
          <section className="mb-[3rem]">
            <h2 className="font-montserrat text-[1.4rem] font-extrabold text-[#1A1A1A] border-s-4 border-[#C0392B] ps-[0.875rem] m-0 mb-[1.25rem]">
              {t("Product Categories")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[1.25rem]">
              {[
                {
                  title: t("Used Brand Handbags"),
                  img: "/images/bags/abags.webp",
                  desc: t("Coach, MK, Kate Spade"),
                  spec: t("38kg/sack (~50 pcs)"),
                },
                {
                  title: t("Used Brand Backpacks"),
                  img: "/images/bags/bbags.webp",
                  desc: t("Herschel, JanSport, NF"),
                  spec: t("35kg/sack (~40 pcs)"),
                },
                {
                  title: t("Used Brand Shoulder Bags"),
                  img: "/images/bags/luxury-handbags-assorted-collection-display-1.webp",
                  desc: t("Longchamp, Tory Burch"),
                  spec: t("38kg/sack (~45 pcs)"),
                },
                {
                  title: t("Used Brand Crossbody Bags"),
                  img: "/images/bags/louis-vuitton-essential-trunk-black-monogram.webp",
                  desc: t("Calvin Klein, DKNY"),
                  spec: t("35kg/sack (~55 pcs)"),
                },
                {
                  title: t("Used Brand Luggage"),
                  img: "/images/bags/wholesale-luxury-bags-assorted-brands-pile.webp",
                  desc: t("Samsonite, Tumi"),
                  spec: t("40kg/sack (~15 pcs)"),
                },
                {
                  title: t("Mixed Brand Bags"),
                  img: "/images/bags/second-hand-designer-bags-warehouse-inventory-pile.webp",
                  desc: t("All brands mixed"),
                  spec: t("38kg/sack (~50 pcs)"),
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
                        "RealismThrift Wholesale {v0} - Luxury Branded Second-Hand Bags Bulk Inventory from China Factory",
                        { v0: prod.title },
                      )}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-brand-dark text-brand-gold text-[0.65rem] font-bold px-2 py-1 rounded-[2px] font-montserrat uppercase tracking-wider">
                      {t("Grade A")}
                    </div>
                  </div>
                  <div className="p-[0.875rem]">
                    <h3 className="font-montserrat text-[0.875rem] font-bold text-[#1A1A1A] m-0 mb-[0.35rem]">
                      {prod.title}
                    </h3>
                    <p className="text-[0.75rem] text-[#888] m-0 mb-2">
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

          {/* BAG INSPECTION & SORTING PROCESS */}
          <section className="mb-[3rem]">
            <h2 className="font-montserrat text-[1.4rem] font-extrabold text-[#1A1A1A] border-s-4 border-[#C0392B] ps-[0.875rem] m-0 mb-6">
              {t("Bag Inspection & Sorting Process")}
            </h2>
            <p className="text-[0.9375rem] text-[#555] leading-[1.75] mb-[1.75rem]">
              <TranslatedText
                locale={locale}
                text={
                  "Bags require the most detailed inspection of all our product categories. If you are ordering multiple categories, we can easily pack bags alongside {clothes} or {shoes} in a single container. Our dedicated bag sorting team checks every zipper, strap, clasp, and lining before grading. Only fully functional bags pass our A-grade standard."
                }
                values={{
                  clothes: (
                    <Link
                      href={localePath("/used-brand-clothes", locale)}
                      className="text-[#C0392B] font-bold hover:underline"
                    >
                      {t("Used Brand Clothes")}
                    </Link>
                  ),
                  shoes: (
                    <Link
                      href={localePath("/used-brand-shoes", locale)}
                      className="text-[#C0392B] font-bold hover:underline"
                    >
                      {t("Used Brand Shoes")}
                    </Link>
                  ),
                }}
              />
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[1.25rem]">
              {[
                {
                  step: "01",
                  title: t("Initial Sorting by Type"),
                  img: "/images/bags/mixed-designer-handbags-wholesale-batch-display.webp",
                  desc: t(
                    "Incoming bags are sorted by type: handbags, backpacks, shoulder bags, crossbody bags, and luggage. Each type follows a different inspection protocol. Brand identification happens simultaneously during this stage.",
                  ),
                },
                {
                  step: "02",
                  title: t("Hardware Inspection"),
                  img: "/images/bags/designer-bags-collection-display-dior-chanel-gucci.webp",
                  desc: t(
                    "Every zipper is opened and closed 3 times. All clasps, buckles, magnetic closures, and rings are tested for functionality. Any bag with broken or stuck hardware is immediately downgraded. Chain straps are checked link by link.",
                  ),
                },
                {
                  step: "03",
                  title: t("Interior & Exterior Cleaning"),
                  img: "/images/bags/premium-handbags-collection-mixed-brands-display.webp",
                  desc: t(
                    "Bags are cleaned inside and out using appropriate methods for each material type (leather, canvas, nylon, synthetic). Stubborn stains are treated. Bags with permanent staining or mold are rejected. Interiors are deodorized.",
                  ),
                },
                {
                  step: "04",
                  title: t("Structural Integrity Check"),
                  img: "/images/bags/designer-bags-collection-dior-mcm-coach-celine.webp",
                  desc: t(
                    "Straps are tested for strength and attachment points. Lining integrity is checked, and peeling, tearing, or separation is graded accordingly. Shape and base corners are checked for resale use.",
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
                        "RealismThrift Bag Quality Inspection Step {v0} - {v1} for Professional Global Wholesale Branded Bags",
                        { v0: process.step, v1: process.title },
                      )}
                      fill
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <span className="w-6 h-6 bg-brand-red text-white text-[0.75rem] font-bold flex items-center justify-center rounded-full shrink-0">
                        {process.step}
                      </span>
                      <h3 className="font-montserrat text-[0.875rem] font-bold text-brand-dark m-0">
                        {process.title}
                      </h3>
                    </div>
                    <p className="text-[0.75rem] text-[#666] leading-relaxed m-0">
                      {process.desc}
                    </p>
                  </div>
                </div>
              ))}

              {/* STEP 05 — full width */}
              <div className="sm:col-span-2 bg-white border border-[#eee] rounded-[6px] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.05)] grid grid-cols-1 md:grid-cols-[300px_1fr]">
                <div className="relative h-[200px] md:h-auto">
                  <Image
                    src="/images/bags/gucci-handbags-collection-marmont-dionysus-ophidia.webp"
                    alt={t(
                      "RealismThrift Final QC and Packing - Branded Second-Hand Bags Ready for Professional Wholesale Export Shipment from China",
                    )}
                    fill
                    sizes="(min-width: 768px) 300px, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-[1.25rem]">
                  <div className="flex items-center gap-[0.625rem] mb-[0.625rem]">
                    <span className="bg-[#8B6914] text-white font-montserrat text-[0.75rem] font-extrabold px-[0.625rem] py-[0.25rem] rounded-[2px]">
                      {t("STEP 05")}
                    </span>
                    <h3 className="font-montserrat text-[0.9375rem] font-bold text-[#1A1A1A] m-0">
                      {t("Brand Verification & Packing")}
                    </h3>
                  </div>
                  <p className="text-[0.8125rem] text-[#666] leading-[1.7] m-0">
                    {t(
                      "Brand labels, hardware, and condition are checked. Obvious counterfeits and unsuitable items are removed from brand-focused batches. Each bag is individually wrapped in plastic before being packed into woven sacks. Sacks are labeled with brand, type, grade, and piece count.",
                    )}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* QUALITY STANDARDS */}
          <QualityStandards
            locale={locale}
            title={t("A-Grade Bag Quality Standards")}
            standards={bagStandards}
          />

          {/* TRUST SECTIONS */}
          <ProductTrustSections
            locale={locale}
            features={bagFeatures}
            faqs={bagFaqs}
          />

          {/* SPECS TABLE */}
          <section className="mb-[3rem]">
            <h2 className="font-montserrat text-[1.4rem] font-extrabold text-[#1A1A1A] border-s-4 border-[#C0392B] ps-[0.875rem] m-0 mb-[1.25rem]">
              {t("Product Specifications")}
            </h2>
            <div className="rt-table-wrap overflow-x-auto rounded-[6px] shadow-[0_2px_8px_rgba(0,0,0,0.07)]">
              <table className="w-full border-collapse text-[0.8125rem] bg-white min-w-[650px]">
                <thead>
                  <tr className="bg-[#1A1A1A] text-white">
                    <th className="p-[0.875rem_1rem] text-left font-montserrat">
                      {t("Category")}
                    </th>
                    <th className="p-[0.875rem_1rem] text-left font-montserrat">
                      {t("Sack Weight")}
                    </th>
                    <th className="p-[0.875rem_1rem] text-left font-montserrat">
                      {t("PCS/Sack")}
                    </th>
                    <th className="p-[0.875rem_1rem] text-left font-montserrat">
                      {t("MOQ")}
                    </th>
                    <th className="p-[0.875rem_1rem] text-left font-montserrat">
                      {t("20ft Load")}
                    </th>
                    <th className="p-[0.875rem_1rem] text-left font-montserrat">
                      {t("40ft Load")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      cat: t("Brand Handbags"),
                      w: t("38 kg"),
                      pcs: t("~50 pcs"),
                      moq: t("≥100 pcs"),
                      c20: t("~6,000 pcs"),
                      c40: t("~14,000 pcs"),
                      bg: "bg-white",
                    },
                    {
                      cat: t("Brand Backpacks"),
                      w: t("35 kg"),
                      pcs: t("~40 pcs"),
                      moq: t("≥100 pcs"),
                      c20: t("~5,500 pcs"),
                      c40: t("~12,000 pcs"),
                      bg: "bg-[#fafafa]",
                    },
                    {
                      cat: t("Brand Shoulder Bags"),
                      w: t("38 kg"),
                      pcs: t("~45 pcs"),
                      moq: t("≥100 pcs"),
                      c20: t("~6,000 pcs"),
                      c40: t("~13,000 pcs"),
                      bg: "bg-white",
                    },
                    {
                      cat: t("Brand Crossbody Bags"),
                      w: t("35 kg"),
                      pcs: t("~55 pcs"),
                      moq: t("≥100 pcs"),
                      c20: t("~6,500 pcs"),
                      c40: t("~14,500 pcs"),
                      bg: "bg-[#fafafa]",
                    },
                    {
                      cat: t("Mixed Brand Bags"),
                      w: t("38 kg"),
                      pcs: t("~50 pcs"),
                      moq: t("≥200 pcs"),
                      c20: t("~6,000 pcs"),
                      c40: t("~14,000 pcs"),
                      bg: "bg-white",
                    },
                  ].map((row) => (
                    <tr
                      key={row.cat}
                      className={`${row.bg} border-b border-[#f0f0f0]`}
                    >
                      <td className="p-[0.75rem_1rem] font-semibold text-[#1A1A1A]">
                        {row.cat}
                      </td>
                      <td className="p-[0.75rem_1rem] text-[#555]">{row.w}</td>
                      <td className="p-[0.75rem_1rem] text-[#555]">
                        {row.pcs}
                      </td>
                      <td className="p-[0.75rem_1rem]">
                        <span className="bg-[#F0B429] text-[#1A1A1A] px-2 py-[0.15rem] rounded-[2px] text-[0.7rem] font-bold">
                          {row.moq}
                        </span>
                      </td>
                      <td className="p-[0.75rem_1rem] text-[#555]">
                        {row.c20}
                      </td>
                      <td className="p-[0.75rem_1rem] text-[#555]">
                        {row.c40}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
        {/* END LEFT CONTENT */}

        {/* ─── SIDEBAR ─── */}
        <aside>
          <div
            id="inquiry"
            className="bg-white border border-[#eee] rounded-[8px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-[1.75rem] sticky top-[80px]"
          >
            {/* Sidebar header — gold/brown */}
            <div className="bg-[#8B6914] text-white -mx-[1.75rem] -mt-[1.75rem] px-[1.75rem] py-[1.25rem] rounded-t-[8px] mb-6">
              <h3 className="font-montserrat text-[1rem] font-extrabold m-0 mb-[0.25rem]">
                {t("Get Bag Price Now")}
              </h3>
              <p className="text-[0.75rem] opacity-85 m-0">
                {t(
                  "We aim to reply within 12 hours · Ask about sample pricing",
                )}
              </p>
            </div>

            <InquiryForm
              locale={locale}
              messages={getClientMessages(locale, "form")}
              variant="sidebar"
            />

            <div className="mt-[1.25rem]">
              <a
                href="https://wa.me/8617279444062?text=Hi%2C+I+want+used+brand+bags+wholesale+price"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#137a3c] text-white py-3 rounded-[3px] no-underline font-montserrat font-bold text-[0.875rem] hover:bg-[#106631] transition-colors"
              >
                {t("Chat on WhatsApp")}
              </a>
            </div>
          </div>
        </aside>
      </div>
      {/* END MAIN GRID */}

      {/* CTA BLOCK */}
      <ProductCTA
        locale={locale}
        title={t("Ready to Order Used Brand Bags?")}
        description={t(
          "Minimum 100 pieces. Free pre-shipment photos and videos. Worldwide shipping available.",
        )}
        whatsappMessage={t(
          "Hi, I want to wholesale used brand bags. Can I get a price list?",
        )}
      />
    </div>
  );
}

import { createPageMetadata } from "@/lib/metadata";
import "@/app/internal-pages.css";
import Image from "next/image";
import Link from "next/link";
import { companyStats as englishCompanyStats } from "@/data/siteData";
import {
  Building2,
  Search,
  CheckCircle2,
  Brush,
  Box,
  Ship,
  MessageCircle,
  Mail,
} from "lucide-react";
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
      title: t("About Us | Used Clothes & Shoes China Supplier"),
      description: t(
        "Wholesale supplier of second-hand clothes, shoes, and bags based in Huizhou, China. A 15,000m² sorting facility with grading, packing, and export support.",
      ),
      openGraph: {
        title: t("About RealismThrift | Professional Wholesale Exporter"),
        description: t(
          "Learn about RealismThrift's sorting facility, grading process, and export support for second-hand goods.",
        ),
        images: ["/images/about/factory-hall.webp"],
      },
      alternates: {
        canonical: "/about-us",
      },
    }),
    locale,
  );
}

export default function AboutUsPage({
  locale = "en",
}: { locale?: Locale } = {}) {
  const t = getTranslator(locale);
  const companyStats = getLocalizedData(englishCompanyStats, locale);

  return (
    <div className="bg-white">
      <section className="rt-page-hero">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-main.webp"
            alt={t(
              "RealismThrift Professional Team and Sorting Facility in Huizhou China",
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
              <span className="text-white/70">{t("About Us")}</span>
            </nav>
            <div className="inline-block bg-brand-red text-white font-montserrat font-bold text-[0.65rem] tracking-[0.12em] px-[0.875rem] py-[0.3rem] rounded-[2px] mb-[1rem] uppercase">
              {t("China Supplier · Wholesale Export · Since {v0}", {
                v0: companyStats.foundedYear,
              })}
            </div>
            <h1 className="rt-page-hero-title mb-5 text-[clamp(2rem,5.5vw,3rem)] leading-[1.1]">
              {locale === "en" ? (
                <>
                  {t("About ")}
                  <span className="text-brand-gold">{t("RealismThrift")}</span>
                </>
              ) : (
                t("About RealismThrift")
              )}
            </h1>
            <p className="rt-page-hero-sub max-w-[700px] mb-9 leading-[1.8] text-[1.0625rem]">
              {t(
                "A wholesale exporter of used brand clothes, shoes, and bags with export experience since 2012, a {v0} sorting facility, and export support for international buyers.",
                { v0: companyStats.facilitySize },
              )}
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Link
                href={localePath("/contact-us", locale)}
                className="bg-brand-gold text-brand-dark px-6 md:px-10 py-3 md:py-4 rounded-[3px] font-bold font-montserrat text-[0.9rem] hover:bg-brand-gold-dark transition-all shadow-[0_10px_20px_rgba(240,180,41,0.2)] whitespace-nowrap"
              >
                {t("Contact Our Team")}
              </Link>
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

      {/* KEY STATS */}
      <div className="bg-brand-red py-8">
        <div className="rt-container max-w-[1280px]">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            <div className="text-white">
              <div className="font-montserrat text-[1.75rem] font-extrabold leading-none">
                10+
              </div>
              <div className="text-[0.75rem] opacity-100 mt-1.5 tracking-wider uppercase">
                {t("Years Experience")}
              </div>
            </div>
            <div className="text-white">
              <div className="font-montserrat text-[1.75rem] font-extrabold leading-none">
                {companyStats.facilitySize}
              </div>
              <div className="text-[0.75rem] opacity-100 mt-1.5 tracking-wider uppercase">
                {t("Sorting Facility")}
              </div>
            </div>
            <div className="text-white">
              <div className="font-montserrat text-[1.75rem] font-extrabold leading-none">
                {t("B2B")}
              </div>
              <div className="text-[0.75rem] opacity-100 mt-1.5 tracking-wider uppercase">
                {t("Wholesale Supply")}
              </div>
            </div>
            <div className="text-white">
              <div className="font-montserrat text-[1.75rem] font-extrabold leading-none">
                {companyStats.countriesCount}
              </div>
              <div className="text-[0.75rem] opacity-100 mt-1.5 tracking-wider uppercase">
                {t("Export Countries")}
              </div>
            </div>
            <div className="text-white">
              <div className="font-montserrat text-[1.75rem] font-extrabold leading-none">
                {t("Repeat")}
              </div>
              <div className="text-[0.75rem] opacity-100 mt-1.5 tracking-wider uppercase">
                {t("Buyer Support")}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* COMPANY STORY */}
      <section className="max-w-[1280px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-montserrat text-[1.75rem] font-extrabold text-brand-dark mb-5 leading-[1.3]">
              {t("Our Story: ")}
              <span className="text-brand-red">
                {t("From Guangzhou to the World")}
              </span>
            </h2>
            <p className="text-[0.9375rem] text-[#555] leading-[1.85] mb-5">
              {t(
                "RealismThrift started in Guangzhou, China, a major hub for used clothing trade. What began as a small sorting operation in {v0}  has grown into a Huizhou-based exporter serving wholesale buyers in multiple markets.",
                { v0: companyStats.foundedYear },
              )}
            </p>
            <p className="text-[0.9375rem] text-[#555] leading-[1.85] mb-5">
              {t(
                "The business expanded as overseas buyers asked for clearer grading, more consistent packing, and export documentation support. RealismThrift was built around those practical requirements.",
              )}
            </p>
            <p className="text-[0.9375rem] text-[#555] leading-[1.85] mb-7">
              {t(
                "Today, our {v0} facility in Huizhou processes over {v1} of used branded clothing, shoes, and bags every month. Our {v2} trained staff sort, grade, clean, and pack merchandise destined for wholesale markets across Africa, Southeast Asia, the Middle East, Europe, and the Americas.",
                {
                  v0: companyStats.facilitySize,
                  v1: companyStats.monthlyCapacity,
                  v2: companyStats.staffCount,
                },
              )}
            </p>
            <div className="flex gap-6 flex-wrap">
              <div className="text-center px-6 py-4 bg-[#F5F5F0] rounded-[6px]">
                <div className="font-montserrat text-[1.5rem] font-extrabold text-brand-red">
                  {t("200t")}
                </div>
                <div className="text-[0.75rem] text-[#666] mt-1 uppercase font-semibold">
                  {t("Monthly Processing")}
                </div>
              </div>
              <div className="text-center px-6 py-4 bg-[#F5F5F0] rounded-[6px]">
                <div className="font-montserrat text-[1.5rem] font-extrabold text-brand-red">
                  80+
                </div>
                <div className="text-[0.75rem] text-[#666] mt-1 uppercase font-semibold">
                  {t("Staff Members")}
                </div>
              </div>
              <div className="text-center px-6 py-4 bg-[#F5F5F0] rounded-[6px]">
                <div className="font-montserrat text-[1.5rem] font-extrabold text-brand-red">
                  50+
                </div>
                <div className="text-[0.75rem] text-[#666] mt-1 uppercase font-semibold">
                  {t("Brand Types")}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div className="relative h-[200px] w-full rounded-[6px] overflow-hidden">
              <Image
                src="/images/about/working-qc-shoes.webp"
                alt={t(
                  "RealismThrift QC Inspection - Expertly Checking Branded Sneakers for A-Grade Quality",
                )}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="relative h-[200px] w-full rounded-[6px] overflow-hidden">
              <Image
                src="/images/about/working-qc-clothes.webp"
                alt={t(
                  "RealismThrift Quality Control - Detailed Inspection of Used Branded Clothing",
                )}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="relative h-[200px] w-full col-span-2 rounded-[6px] overflow-hidden">
              <Image
                src="/images/about/story-3-clear.webp"
                alt={t(
                  "RealismThrift Professional Baling and Packing - Compressed Bales of Second Hand Clothes Ready for Global Wholesale Shipping",
                )}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* TEAM PHOTO SECTION */}
      <section className="bg-brand-dark py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="font-montserrat text-[1.75rem] font-extrabold text-white mb-3.5">
              {t("Meet Our Team")}
            </h2>
            <div className="rt-section-divider center mb-4" />
            <p className="text-white/65 text-[0.9375rem] max-w-[600px] mx-auto">
              {t(
                "Our team focuses on sorting, grading, packing, and export coordination for used branded merchandise.",
              )}
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[12px] overflow-hidden mb-12 flex flex-col md:flex-row items-center group relative hover:border-brand-gold/30 hover:shadow-[0_0_30px_rgba(240,180,41,0.1)] transition-all duration-500">
            {/* Image Side */}
            <div className="w-full md:w-5/12 relative overflow-hidden bg-[#1A1A1A]">
              <div className="absolute inset-0 bg-brand-gold/5 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none" />
              <Image
                src="/images/staff/sales-manager-leo.webp"
                alt={t(
                  "Leo - Professional Sales Manager at Dongguan Huihe Realismthrift Trading Co., Ltd. Expert in wholesale used clothing, shoes, and bags export support and A-grade quality assurance for global buyers.",
                )}
                width={500}
                height={900}
                sizes="(min-width: 768px) 40vw, 100vw"
                className="w-full h-auto object-cover object-center group-hover:scale-110 transition-transform duration-1000 ease-in-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent md:hidden z-20 pointer-events-none" />
            </div>

            {/* Text Side */}
            <div className="w-full md:w-7/12 p-8 md:p-12 relative z-30 -mt-20 md:mt-0">
              <div className="inline-block bg-brand-gold/15 border border-brand-gold/30 text-brand-gold font-montserrat font-bold text-[0.7rem] tracking-[0.15em] px-3 py-1.5 rounded-[3px] mb-5 uppercase shadow-[0_0_15px_rgba(240,180,41,0.15)]">
                {t("Leadership Team")}
              </div>
              <h3 className="font-montserrat text-[2.25rem] font-extrabold text-white mb-1">
                {t("Leo")}
              </h3>
              <p className="text-brand-gold font-semibold text-[1.1rem] mb-7">
                {t("Sales Manager")}
              </p>

              <div className="relative mb-8 ps-5 border-s-2 border-white/20">
                <span
                  aria-hidden="true"
                  className="absolute -top-3 -left-3 text-5xl text-brand-gold/20 font-serif"
                >
                  &quot;
                </span>
                <p className="text-white/80 text-[1rem] leading-[1.8] relative z-10 italic font-open-sans">
                  {t(
                    "Our goal is not just to sell used goods, but to build long-term partnerships with global wholesale buyers. We enforce strict A-grade quality control on our clothes, shoes, and bags to ensure your business thrives. From the first inquiry to container loading, our team is committed to your success.",
                  )}
                </p>
              </div>

              <div className="flex gap-4 flex-wrap">
                <a
                  href="https://wa.me/8617279444062"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#137a3c] text-white px-6 py-3.5 rounded-[3px] font-bold font-montserrat text-[0.875rem] hover:bg-[#106631] transition-all shadow-lg hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  {t("Chat on WhatsApp")}
                </a>
                <a
                  href="mailto:sales@realismthrift.com"
                  className="bg-white/10 text-white border border-white/20 px-6 py-3.5 rounded-[3px] font-bold font-montserrat text-[0.875rem] hover:bg-white/20 transition-all flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  {t("Email Leo")}
                </a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                img: "levi.webp",
                name: t("Levi"),
                role: t("Sales Consultant"),
                desc: t(
                  "Customer service professional assisting with category selection and pricing.",
                ),
              },
              {
                img: "luna.webp",
                name: t("Luna"),
                role: t("Sales Consultant"),
                desc: t(
                  "Sales coordinator managing inquiries and international trade logistics support.",
                ),
              },
              {
                img: "ahmad-akbar.webp",
                name: t("Ahmad Akbar"),
                role: t("Sales Consultant"),
                desc: t(
                  "Expert sales consultant providing professional export guidance for global buyers.",
                ),
              },
              {
                img: "lily.jpg",
                name: t("Lily"),
                role: t("Sales Consultant"),
                desc: t(
                  "Supports wholesale inquiries, product selection, and order planning.",
                ),
              },
              {
                img: "daniel.jpg",
                name: t("Daniel"),
                role: t("Bag Sorting Expert"),
                desc: t(
                  "Sorts used bags and checks straps, lining, and hardware.",
                ),
              },
              {
                img: "vincent.jpg",
                name: t("Vincent"),
                role: t("Bag Sorting Expert"),
                desc: t(
                  "Grades used bags by condition, including corners and zippers.",
                ),
              },
              {
                img: "adrian.jpg",
                name: t("Adrian"),
                role: t("Shoe Sorting Expert"),
                desc: t("Sorts used shoes and checks soles, lining, and wear."),
              },
              {
                img: "marcus.jpg",
                name: t("Marcus"),
                role: t("Clothing Sorting Expert"),
                desc: t(
                  "Sorts used clothes and checks fabrics, buttons, and zippers.",
                ),
              },
            ].map((staff) => (
              <div
                key={staff.name}
                className="group bg-white/5 border border-white/10 rounded-[12px] p-5 text-center hover:bg-white/[0.08] transition-all duration-300"
              >
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <div className="absolute inset-0 bg-brand-gold/20 rounded-full scale-110 group-hover:scale-125 transition-transform duration-500 blur-md"></div>
                  <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-brand-gold/30">
                    <Image
                      src={`/images/staff/${staff.img}`}
                      alt={t("RealismThrift {v0} - {v1}", {
                        v0: staff.role,
                        v1: staff.name,
                      })}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="font-montserrat text-[0.9375rem] font-bold text-white mb-1 group-hover:text-brand-gold transition-colors">
                  {staff.name}
                </div>
                <div className="text-[0.65rem] font-montserrat font-bold text-brand-gold uppercase tracking-wider mb-3 px-2 py-0.5 bg-brand-gold/10 inline-block rounded-[2px]">
                  {staff.role}
                </div>
                <div className="text-[0.75rem] text-white/60 leading-[1.6] px-2 line-clamp-2">
                  {staff.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FACTORY PHOTOS */}
      <section className="max-w-[1280px] mx-auto px-6 py-16">
        <div className="rt-subsection-heading">
          <h2>{t("Our Facility")}</h2>
          <div className="rt-section-divider" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 grid-rows-2 gap-3.5 md:h-[400px]">
          <div className="relative rounded-[8px] overflow-hidden lg:col-span-2 row-span-2 min-h-[200px]">
            <Image
              src="/images/about/factory-hall.webp"
              alt={t(
                "RealismThrift Main Sorting Hall - 15,000m² State-of-the-Art Used Clothing Facility",
              )}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="relative rounded-[8px] overflow-hidden min-h-[190px]">
            <Image
              src="/images/about/warehouse-inventory.webp"
              alt={t(
                "RealismThrift Massive Warehouse Inventory - Large Scale Stock of Sorted Second Hand Sneakers Ready for Wholesale Export",
              )}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="relative rounded-[8px] overflow-hidden min-h-[190px]">
            <Image
              src="/images/about/loading-dock-premium.webp"
              alt={t(
                "RealismThrift Efficient Loading Dock - Fast 7-Day Container Shipment and Export Logistics of Second Hand Goods to Global Ports",
              )}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="relative rounded-[8px] overflow-hidden min-h-[190px]">
            <Image
              src="/images/about/sorting-process.webp"
              alt={t(
                "RealismThrift Branded Shoe Sorting Station - Strict Grade A Quality Control for Export Sneakers and Footwear",
              )}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="relative rounded-[8px] overflow-hidden min-h-[190px]">
            <Image
              src="/images/about/bag-inspection.webp"
              alt={t(
                "RealismThrift Designer Bag Inspection Room - Professional Quality Verification for Wholesale Used Handbags and Backpacks",
              )}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
          <div className="bg-brand-light rounded-[6px] p-5">
            <div className="font-montserrat text-[0.875rem] font-bold text-brand-dark mb-1.5">
              {t("Main Sorting Hall")}
            </div>
            <div className="text-[0.75rem] text-[#666] leading-[1.6]">
              {t(
                "15,000 m² dedicated sorting space optimized for large-scale operations.",
              )}
            </div>
          </div>
          <div className="bg-brand-light rounded-[6px] p-5">
            <div className="font-montserrat text-[0.875rem] font-bold text-brand-dark mb-1.5">
              {t("Packing Area")}
            </div>
            <div className="text-[0.75rem] text-[#666] leading-[1.6]">
              {t(
                "Industrial packing area equipped for secure baling and weight control.",
              )}
            </div>
          </div>
          <div className="bg-brand-light rounded-[6px] p-5">
            <div className="font-montserrat text-[0.875rem] font-bold text-brand-dark mb-1.5">
              {t("Loading Dock")}
            </div>
            <div className="text-[0.75rem] text-[#666] leading-[1.6]">
              {t(
                "Integrated loading area designed for efficient container dispatch.",
              )}
            </div>
          </div>
          <div className="bg-brand-light rounded-[6px] p-5">
            <div className="font-montserrat text-[0.875rem] font-bold text-brand-dark mb-1.5">
              {t("Quality Control Station")}
            </div>
            <div className="text-[0.75rem] text-[#666] leading-[1.6]">
              {t(
                "Dedicated inspection station providing professional lighting for accurate grading.",
              )}
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTION PROCESS */}
      <section className="bg-brand-light py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="font-montserrat text-[1.5rem] font-extrabold text-brand-dark mb-3.5">
              {t("Our Production Process")}
            </h2>
            <div className="rt-section-divider center mb-4" />
            <p className="text-[#666] text-[0.9375rem] max-w-[600px] mx-auto">
              {t(
                "From raw material collection to container loading — every step is managed by our dedicated team.",
              )}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-10 relative">
            <div className="hidden lg:block absolute top-[2rem] left-[8.33%] right-[8.33%] h-[2px] bg-gradient-to-r from-brand-red to-brand-gold z-0"></div>
            {[
              {
                icon: <Building2 className="w-6 h-6 text-white" />,
                bg: "bg-brand-red",
                title: t("Source Collection"),
                desc: t("First-tier cities: Beijing, Shanghai, Guangzhou"),
              },
              {
                icon: <Search className="w-6 h-6 text-white" />,
                bg: "bg-brand-dark",
                title: t("Initial Sort"),
                desc: t("Separate by type: clothes, shoes, bags"),
              },
              {
                icon: <CheckCircle2 className="w-6 h-6 text-white" />,
                bg: "bg-brand-red",
                title: t("Quality Grade"),
                desc: t("A/B/C grading by trained inspectors"),
              },
              {
                icon: <Brush className="w-6 h-6 text-white" />,
                bg: "bg-brand-dark",
                title: t("Prep & Quality Check"),
                desc: t("Pre-packing preparation and final quality inspection"),
              },
              {
                icon: <Box className="w-6 h-6 text-white" />,
                bg: "bg-brand-red",
                title: t("Pack & Weigh"),
                desc: t("Secure compression and accurate weight labeling"),
              },
              {
                icon: <Ship className="w-6 h-6 text-white" />,
                bg: "bg-brand-dark",
                title: t("Load & Export"),
                desc: t("Container loading with full documentation"),
              },
            ].map((step) => (
              <div
                key={step.title}
                className="text-center px-2 relative z-10 w-full group"
              >
                <div
                  className={`w-16 h-16 ${step.bg} rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-brand-light shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-6`}
                >
                  {step.icon}
                </div>
                <div className="font-montserrat text-[0.8rem] font-bold text-brand-dark mb-1.5">
                  {step.title}
                </div>
                <div className="text-[0.7rem] text-[#666] leading-[1.5] max-w-[150px] mx-auto">
                  {step.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CERTIFICATIONS & TRUST */}
      <section className="max-w-[1280px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="rt-subsection-heading">
              <h2>{t("Certifications & Trust Signals")}</h2>
              <div className="rt-section-divider" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  title: t("Export License"),
                  desc: t(
                    "Official Chinese export license for used textile products.",
                  ),
                },
                {
                  title: t("12+ Years"),
                  desc: t(
                    "Established {v0}. Over a decade of wholesale export operations.",
                    { v0: companyStats.foundedYear },
                  ),
                },
                {
                  title: t("Wholesale Buyers"),
                  desc: t(
                    "Export support for used goods buyers across multiple regions.",
                  ),
                },
                {
                  title: t("Quality Inspection"),
                  desc: t(
                    "Batches are inspected before packing and labeled by product type, grade, and weight.",
                  ),
                },
                {
                  title: t("Secure Payment"),
                  desc: t(
                    "Standard 30% deposit and 70% balance payment terms via T/T or Western Union.",
                  ),
                },
                {
                  title: t("Fast Loading"),
                  desc: t(
                    "Container loading in as fast as 7 days after order confirmation.",
                  ),
                },
              ].map((cert) => (
                <div
                  key={cert.title}
                  className="bg-brand-light rounded-[6px] p-4 border-s-[3px] border-brand-red"
                >
                  <div className="font-montserrat text-[0.875rem] font-bold text-brand-dark mb-1.5">
                    {cert.title}
                  </div>
                  <div className="text-[0.75rem] text-[#666] leading-[1.5]">
                    {cert.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="rt-subsection-heading">
              <h2>{t("What Our Buyers Say")}</h2>
              <div className="rt-section-divider" />
            </div>
            {[
              {
                name: t("Emmanuel Osei"),
                country: t("Ghana"),
                quote: t(
                  "We've been importing summer clothes from RealismThrift for 3 years. The sorting is very clean compared to other factories we've tried. Very few 'waste' items in the bales, which really helps our profit margins.",
                ),
              },
              {
                name: t("Fatima Al-Hassan"),
                country: t("Nigeria"),
                quote: t(
                  "The used shoes and bags are always in high demand. I appreciate that they send photos of the actual container loading process. Their documentation is professional, making customs clearance in Lagos much smoother.",
                ),
              },
              {
                name: t("Nguyen Van Minh"),
                country: t("Vietnam"),
                quote: t(
                  "Consistent A-grade quality. Mostly brand name items with very little wear. It's hard to find a supplier in China who stays this reliable month after month. Good communication from the sales team.",
                ),
              },
            ].map((buyer) => (
              <div
                key={buyer.name}
                className="bg-white border border-[#eee] rounded-[8px] p-5 mb-4 shadow-[0_2px_6px_rgba(0,0,0,0.04)]"
              >
                <div className="text-[0.875rem] mb-2 text-brand-gold">
                  ★★★★★
                </div>
                <p className="text-[0.8125rem] text-[#555] leading-[1.7] italic mb-3">
                  {t('"{v0}"', { v0: buyer.quote })}
                </p>
                <div className="flex justify-between items-center">
                  <div className="font-montserrat text-[0.8rem] font-bold text-brand-dark">
                    {buyer.name}
                  </div>
                  <div className="text-[0.75rem] text-[#666]">
                    {buyer.country}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-16 text-center bg-gradient-to-br from-brand-dark to-[#2a1515]">
        <div className="max-w-[700px] mx-auto px-6">
          <h2 className="font-montserrat text-[1.75rem] font-extrabold text-white mb-4">
            {t("Ready to Partner with RealismThrift?")}
          </h2>
          <p className="text-white/70 text-[0.9375rem] leading-[1.7] mb-8">
            {t(
              "Contact our team for a wholesale quotation, product photos, and shipping guidance.",
            )}
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              href={localePath("/contact-us", locale)}
              className="bg-brand-gold text-brand-dark px-8 py-3.5 rounded-[3px] font-bold font-montserrat text-[0.9rem] hover:bg-brand-gold-dark transition-colors"
            >
              {t("Contact Us Now")}
            </Link>
            <a
              href="https://wa.me/8617279444062"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#137a3c] text-white px-8 py-3.5 rounded-[3px] font-bold font-montserrat text-[0.9rem] hover:bg-[#106631] transition-colors"
            >
              {t("WhatsApp")}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

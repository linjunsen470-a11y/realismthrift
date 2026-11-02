import { createPageMetadata } from "@/lib/metadata";
import "@/app/internal-pages.css";
import Link from "next/link";
import { FaqContent } from "@/components/faq/FaqContent";
import { JsonLd, getFaqSchema } from "@/components/JsonLd";
import { getTranslator, localizeMetadata } from "@/lib/i18n/server";
import { localePath, type Locale } from "@/lib/i18n/routing";

export function getPageMetadata(locale: Locale = "en") {
  const t = getTranslator(locale);
  return localizeMetadata(
    createPageMetadata({
      title: t("FAQ | Used Clothes Wholesale Common Questions"),
      description: t(
        "Answers to frequently asked questions about wholesale used clothes, shoes, and bags. Learn about MOQ, shipping, quality grades, and payment terms.",
      ),
      openGraph: {
        title: t("RealismThrift FAQ | Wholesale Used Goods Help Center"),
        description: t(
          "Everything you need to know about sourcing sorted second-hand goods from China, including grading, packing, payment, and export.",
        ),
      },
      alternates: {
        canonical: "/faq",
      },
    }),
    locale,
  );
}

export default function FAQPage({ locale = "en" }: { locale?: Locale } = {}) {
  const t = getTranslator(locale);
  const faqs = [
    {
      question: t("What is your minimum order quantity (MOQ)?"),
      answer: t(
        "Minimum quantities depend on the product category, grade, and packing. Contact us to confirm the minimum for clothes, shoes, bags, or a mixed order. Smaller trial shipments and container orders can be discussed for your destination.",
      ),
    },
    {
      question: t("How do you ensure the quality of the used goods?"),
      answer: t(
        "We sort goods by category, condition, and the agreed grade. Bales are inspected visually for holes, stains, and excessive wear, then packed according to the agreed grade.",
      ),
    },
    {
      question: t("Which countries do you ship to?"),
      answer: t(
        "We ship globally, with a strong focus on markets in Africa, Southeast Asia, South America, and the Middle East. We handle all export documentation and can assist with customs clearance advice.",
      ),
    },
    {
      question: t("Can I customize the items in my order?"),
      answer: t(
        "Yes! We specialize in customized sorting. You can specify the ratio of men's, women's, and children's items, or focus on specific categories like sports shoes, winter clothes, or luxury brands.",
      ),
    },
    {
      question: t("What are your payment terms?"),
      answer: t(
        "Payment methods and the deposit and balance schedule are confirmed in your pro forma invoice. Review the agreed terms with our sales team before making a payment.",
      ),
    },
  ];
  const faqSchema = getFaqSchema(
    faqs.map((f) => ({ q: f.question, a: f.answer })),
  );

  return (
    <div className="pb-20">
      <JsonLd data={faqSchema} />
      <section className="rt-page-hero">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-brand-dark opacity-90" />
        </div>
        <div className="rt-page-hero-overlay" />
        <div className="rt-container relative z-10 text-center md:text-left">
          <div className="rt-fade-in">
            <nav className="rt-breadcrumb mb-5 justify-center md:justify-start">
              <Link href={localePath("/", locale)}>{t("Home")}</Link>
              <span>›</span>
              <span className="text-white/70">{t("FAQ")}</span>
            </nav>
            <div className="inline-block bg-brand-red text-white font-montserrat font-bold text-[0.65rem] tracking-[0.12em] px-[0.875rem] py-[0.3rem] rounded-[2px] mb-[1rem] uppercase">
              {t("Help Center · Common Questions")}
            </div>
            <h1 className="rt-page-hero-title mb-5 text-[clamp(2rem,6vw,3.5rem)] leading-[1.1]">
              {locale === "en" ? (
                <>
                  {t("Frequently Asked ")}
                  <span className="text-brand-gold">{t("Questions")}</span>
                </>
              ) : (
                t("Frequently Asked Questions")
              )}
            </h1>
            <p className="rt-page-hero-sub max-w-[620px] mb-0 leading-relaxed text-[1.05rem]">
              {t(
                "Everything you need to know about sourcing sorted used goods from RealismThrift.",
              )}
            </p>
          </div>
        </div>
      </section>

      <FaqContent faqs={faqs} />
    </div>
  );
}

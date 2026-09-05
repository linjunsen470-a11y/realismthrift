import { createPageMetadata } from "@/lib/metadata";
import "../internal-pages.css";
import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { FaqContent } from "@/components/faq/FaqContent";
import { JsonLd, getFaqSchema } from "@/components/JsonLd";

export const metadata: Metadata = createPageMetadata({
  title: "FAQ | Used Clothes Wholesale Common Questions",
  description: "Answers to frequently asked questions about wholesale used clothes, shoes, and bags. Learn about MOQ, shipping, quality grades, and payment terms.",
  openGraph: {
    title: "RealismThrift FAQ | Wholesale Used Goods Help Center",
    description: "Everything you need to know about sourcing sorted second-hand goods from China, including grading, packing, payment, and export.",
  },
  alternates: {
    canonical: "/faq",
  },
});

const faqs = [
  {
    question: "What is your minimum order quantity (MOQ)?",
    answer: "Minimum quantities depend on the product category, grade, and packing. Contact us to confirm the minimum for clothes, shoes, bags, or a mixed order. Smaller trial shipments and container orders can be discussed for your destination.",
  },
  {
    question: "How do you ensure the quality of the used goods?",
    answer: "We sort goods by category, condition, and the agreed grade. Bales are inspected visually for holes, stains, and excessive wear, then packed according to the agreed grade.",
  },
  {
    question: "Which countries do you ship to?",
    answer: "We ship globally, with a strong focus on markets in Africa, Southeast Asia, South America, and the Middle East. We handle all export documentation and can assist with customs clearance advice.",
  },
  {
    question: "Can I customize the items in my order?",
    answer: "Yes! We specialize in customized sorting. You can specify the ratio of men's, women's, and children's items, or focus on specific categories like sports shoes, winter clothes, or luxury brands.",
  },
  {
    question: "What are your payment terms?",
    answer: "Payment methods and the deposit and balance schedule are confirmed in your pro forma invoice. Review the agreed terms with our sales team before making a payment.",
  },
];

export default function FAQPage() {
  const faqSchema = getFaqSchema(faqs.map(f => ({ q: f.question, a: f.answer })));

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
              <Link href="/">Home</Link>
              <span>›</span>
              <span className="text-white/70">FAQ</span>
            </nav>
            <div className="inline-block bg-brand-red text-white font-montserrat font-bold text-[0.65rem] tracking-[0.12em] px-[0.875rem] py-[0.3rem] rounded-[2px] mb-[1rem] uppercase">
              Help Center · Common Questions
            </div>
            <h1 className="rt-page-hero-title mb-5 text-[clamp(2rem,6vw,3.5rem)] leading-[1.1]">
              Frequently Asked <span className="text-brand-gold">Questions</span>
            </h1>
            <p className="rt-page-hero-sub max-w-[620px] mb-0 leading-relaxed text-[1.05rem]">
              Everything you need to know about sourcing sorted used goods from RealismThrift.
            </p>
          </div>
        </div>
      </section>

      <FaqContent faqs={faqs} />
    </div>
  );
}

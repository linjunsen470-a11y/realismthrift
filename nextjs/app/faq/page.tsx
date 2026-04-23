import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { FaqContent } from "@/components/faq/FaqContent";

export const metadata: Metadata = {
  title: "FAQ | Used Clothes Wholesale Common Questions",
  description: "Find answers to frequently asked questions about wholesale used clothes, shoes, and bags from RealismThrift. Learn about MOQ, shipping, quality grades, and payment terms.",
  openGraph: {
    title: "RealismThrift FAQ | Wholesale Used Goods Help Center",
    description: "Everything you need to know about sourcing premium second-hand goods from China. Reliable A-Grade quality and global export.",
  },
  alternates: {
    canonical: "/faq",
  },
};

const faqs = [
  {
    question: "What is your minimum order quantity (MOQ)?",
    answer: "Our standard MOQ is a 20ft container. However, for trial orders, we can discuss smaller quantities or LCL (Less than Container Load) shipping depending on the destination.",
  },
  {
    question: "How do you ensure the quality of the used goods?",
    answer: "We have a strictly controlled 3-stage sorting process. Every bale is inspected visually for holes, stains, and excessive wear. Only Grade A and Cream Grade items are included in our premium collections.",
  },
  {
    question: "Which countries do you ship to?",
    answer: "We ship globally, with a strong focus on markets in Africa, Southeast Asia, South America, and the Middle East. We handle all export documentation and can assist with custom clearance advice.",
  },
  {
    question: "Can I customize the items in my order?",
    answer: "Yes! We specialize in customized sorting. You can specify the ratio of men's, women's, and children's items, or focus on specific categories like sports shoes, winter clothes, or luxury brands.",
  },
  {
    question: "What are your payment terms?",
    answer: "Typically, we require a 30% deposit to begin sorting and production, with the remaining 70% balance due against the copy of the Bill of Lading (B/L).",
  },
];

export default function FAQPage() {
  return (
    <div className="pb-20">
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
              Everything you need to know about sourcing premium used goods from RealismThrift.
            </p>
          </div>
        </div>
      </section>

      <FaqContent faqs={faqs} />
    </div>
  );
}

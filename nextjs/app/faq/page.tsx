"use client";

import React, { useState } from "react";
import { Section } from "@/components/CommonUI";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

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
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

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
              <a href="/">Home</a>
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

      <Section>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm transition-all hover:border-blue-200">
              <button
                className="w-full flex items-center justify-between p-6 text-left bg-white"
                onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
              >
                <span className="text-lg font-bold text-gray-900">{faq.question}</span>
                {activeIndex === idx ? (
                  <Minus className="text-blue-600 flex-shrink-0" />
                ) : (
                  <Plus className="text-gray-400 flex-shrink-0" />
                )}
              </button>
              <AnimatePresence>
                {activeIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 text-gray-600 font-light border-t border-gray-50">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Section } from "@/components/CommonUI";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqContentProps {
  faqs: FaqItem[];
}

export function FaqContent({ faqs }: FaqContentProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <Section>
      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, idx) => (
          <div 
            key={idx} 
            className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm transition-all hover:border-blue-200"
          >
            <button
              className="w-full flex items-center justify-between p-6 text-left bg-white"
              onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
              aria-expanded={activeIndex === idx}
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
  );
}

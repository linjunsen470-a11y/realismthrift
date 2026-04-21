"use client";

import React from "react";
import { Section } from "@/components/CommonUI";
import { ShoppingCart, ClipboardCheck, PackageCheck, Ship, BadgeCheck } from "lucide-react";
import { motion } from "motion/react";

const steps = [
  {
    icon: ShoppingCart,
    title: "Step 1: Choose Products",
    description: "Browse our extensive catalog of used shoes, clothes, and bags. Select the items and grades that fit your market.",
  },
  {
    icon: ClipboardCheck,
    title: "Step 2: Get a Quote",
    description: "Contact us via WhatsApp or Email with your requirements. Our sales team will provide a comprehensive quote including shipping estimates.",
  },
  {
    icon: PackageCheck,
    title: "Step 3: Quality Control",
    description: "Once order is confirmed, our team begins sorting and quality checking every item according to your specific standards.",
  },
  {
    icon: Ship,
    title: "Step 4: Shipping & Logistics",
    description: "We handle the loading and documentation. We ship to over 50 countries worldwide with reliable freight partners.",
  },
  {
    icon: BadgeCheck,
    title: "Step 5: Receive Order",
    description: "Confirm receipt of your goods. We provide after-sales support to ensure you are satisfied with the quality.",
  },
];

export default function HowToOrderPage() {
  return (
    <div className="pb-20">
      <div className="bg-blue-600 py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">How To Order</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto font-light">
            Simple, transparent, and efficient ordering process for global wholesale.
          </p>
        </div>
      </div>

      <Section title="Ordering Process" subtitle="Easy steps to get premium used goods delivered to your doorstep.">
        <div className="max-w-4xl mx-auto space-y-8">
          {steps.map((step, idx) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex gap-8 items-start bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex-shrink-0 flex items-center justify-center">
                <step.icon size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                <p className="text-gray-600 font-light leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>
    </div>
  );
}

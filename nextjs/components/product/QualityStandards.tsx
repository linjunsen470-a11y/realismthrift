import React from "react";
import { type Locale } from "@/lib/i18n/routing";
import { getTranslator } from "@/lib/i18n/server";

interface StandardItem {
  icon: React.ReactNode;
  title: string;
  desc: string;
  isNegative?: boolean; // If true, uses red border, else green
}

interface QualityStandardsProps {
  locale?: Locale;
  /** Display-ready copy; omit to use the localized default heading. */
  title?: string;
  standards: StandardItem[];
}

export function QualityStandards({
  locale = "en",
  title,
  standards,
}: QualityStandardsProps) {
  const t = getTranslator(locale);
  return (
    <section className="bg-[#F5F5F0] rounded-[8px] p-6 md:p-8 mb-12">
      <h2 className="font-montserrat text-[1.25rem] font-extrabold text-[#1A1A1A] m-0 mb-6 uppercase tracking-tight">
        {title ?? t("A-Grade Quality Standards")}
      </h2>
      <p className="mb-6 text-sm leading-relaxed text-[#555]">
        {t(
          "A-grade describes sellable used goods. Light signs of use can be acceptable; major damage, heavy stains, and unsuitable pieces are removed. Brand availability varies by batch, and first-pick sourcing does not mean every item is branded.",
        )}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {standards.map((std, idx) => (
          <div
            key={idx}
            className={`bg-white rounded-[4px] p-4 border-l-[3px] shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow ${
              std.isNegative === false ? "border-[#27AE60]" : "border-[#C0392B]"
            }`}
          >
            <div className="text-[1.1rem] mb-1.5">{std.icon}</div>
            <div className="font-montserrat text-[0.85rem] font-bold text-[#1A1A1A] mb-1">
              {std.title}
            </div>
            <div className="text-[0.75rem] text-[#666] leading-[1.5] font-open-sans">
              {std.desc}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

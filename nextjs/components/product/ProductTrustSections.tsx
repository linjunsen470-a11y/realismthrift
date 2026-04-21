import React from "react";

interface TrustItem {
  icon: string;
  title: string;
  desc: string;
}

interface FaqItem {
  q: string;
  a: string;
}

interface ProductTrustSectionsProps {
  features?: TrustItem[];
  faqs?: FaqItem[];
}

export function ProductTrustSections({ features, faqs }: ProductTrustSectionsProps) {
  if (!features && !faqs) return null;

  return (
    <div className="space-y-12 mb-12">
      {/* WHY CHOOSE US - Compact Grid */}
      {features && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-[4px] h-[24px] bg-[#C0392B] rounded-[2px]" />
            <h2 className="font-montserrat font-extrabold text-[1.25rem] text-[#1A1A1A] m-0 uppercase tracking-tight">
              Why Choose RealismThrift
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((why, idx) => (
              <div 
                key={idx} 
                className="bg-white border border-[#eee] rounded-[4px] p-4 flex gap-4 items-start shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
              >
                <div className="text-[1.25rem] shrink-0 leading-none mt-1">{why.icon}</div>
                <div>
                  <h4 className="font-montserrat font-bold text-[0.875rem] text-[#1A1A1A] m-0 mb-1">
                    {why.title}
                  </h4>
                  <p className="font-open-sans text-[0.8rem] text-[#666] leading-[1.6] m-0">
                    {why.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FAQ - Clean Design */}
      {faqs && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-[4px] h-[24px] bg-[#C0392B] rounded-[2px]" />
            <h2 className="font-montserrat font-extrabold text-[1.25rem] text-[#1A1A1A] m-0 uppercase tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-2">
            {faqs.map((faq, idx) => (
              <details 
                key={idx} 
                className="group border border-[#eee] rounded-[4px] bg-white overflow-hidden"
              >
                <summary className="w-full bg-white p-4 text-left cursor-pointer flex justify-between items-center font-montserrat font-bold text-[0.85rem] text-[#1A1A1A] list-none focus:outline-none hover:bg-gray-50 transition-colors">
                  <span>{faq.q}</span>
                  <span className="text-[#C0392B] text-[0.75rem] transition-transform duration-200 group-open:rotate-180">
                    ▼
                  </span>
                </summary>
                <div className="px-4 pb-4 pt-1 bg-white">
                  <p className="font-open-sans text-[0.8125rem] text-[#555] leading-[1.7] m-0">
                    {faq.a}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

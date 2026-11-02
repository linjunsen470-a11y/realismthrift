import { Plus } from "lucide-react";

interface FaqContentProps {
  faqs: { question: string; answer: string }[];
}

export function FaqContent({ faqs }: FaqContentProps) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <details
              key={faq.question}
              open={index === 0}
              className="group border border-gray-200 rounded-xl bg-white"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6 text-left hover:bg-gray-50 rounded-xl">
                <span className="text-lg font-bold text-gray-900">
                  {faq.question}
                </span>
                <Plus
                  aria-hidden="true"
                  className="text-brand-red shrink-0 transition-transform group-open:rotate-45"
                />
              </summary>
              <p className="px-6 pb-6 text-gray-600 leading-relaxed">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

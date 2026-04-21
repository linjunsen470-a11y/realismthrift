import React from "react";

interface ProductCTAProps {
  title: string;
  description: string;
  whatsappNumber?: string;
  whatsappMessage?: string;
}

export function ProductCTA({ 
  title, 
  description, 
  whatsappNumber = "8618800000001",
  whatsappMessage = "Hi, I want to get a wholesale price list"
}: ProductCTAProps) {
  return (
    <section className="bg-gradient-to-br from-[#1A1A1A] to-[#2d1515] py-16 text-center rounded-[8px] overflow-hidden">
      <div className="max-w-[700px] mx-auto px-6">
        <h2 className="font-montserrat text-[1.5rem] md:text-[1.8rem] font-black text-white m-0 mb-4 leading-tight">
          {title}
        </h2>
        <p className="text-white/70 text-[0.9375rem] md:text-[1rem] leading-[1.7] m-0 mb-10 font-open-sans">
          {description}
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a 
            href="#inquiry" 
            className="bg-[#F0B429] shadow-[0_4px_14px_rgba(240,180,41,0.3)] text-[#1A1A1A] px-10 py-4 rounded-[4px] no-underline font-black font-montserrat text-[0.875rem] uppercase tracking-wider hover:bg-[#d4a017] transition-all hover:-translate-y-0.5"
          >
            Get Price Quote
          </a>
          <a 
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="bg-[#25D366] shadow-[0_4px_14px_rgba(37,211,102,0.3)] text-white px-10 py-4 rounded-[4px] no-underline font-black font-montserrat text-[0.875rem] uppercase tracking-wider hover:bg-[#1da851] transition-all hover:-translate-y-0.5"
          >
            💬 WhatsApp Now
          </a>
        </div>
        <p className="text-white/40 text-[0.75rem] mt-8 font-open-sans">
          * Our team usually replies within 12 hours.
        </p>
      </div>
    </section>
  );
}

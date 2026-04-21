"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter as SiteFooterType } from "@/types";

interface SiteFooterProps {
  data: SiteFooterType;
}

export const SiteFooter: React.FC<SiteFooterProps> = ({ data }) => {
  return (
    <footer className="bg-[#111111] text-white pt-16 pb-12">
      <div className="rt-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Image 
                src="/img/rt-icon.png" 
                alt="RT" 
                width={48} 
                height={48} 
                className="object-contain shrink-0 brightness-0 invert" 
              />
              <div className="flex flex-col leading-[1.1]">
                <span className="font-montserrat text-[1.2rem] font-bold text-white tracking-[0.02em]">RealismThrift</span>
                <span className="font-montserrat text-[0.6rem] font-semibold text-white/40 tracking-[0.15em] uppercase">Export Co., Ltd</span>
              </div>
            </div>
            <p className="text-[0.875rem] leading-[1.6] text-white/50 font-open-sans">
              RealismThrift Export Co., Ltd is a leading wholesale supplier of second-hand clothes, shoes and bags from China. Export to 100+ countries with A-Grade quality.
            </p>
            <div className="space-y-2 text-[0.875rem] text-white/70 font-open-sans">
              <div className="flex items-center gap-2"><span>✉</span> <a href="mailto:sales@realismthrift.com" className="hover:text-brand-gold transition-colors">sales@realismthrift.com</a></div>
              <div className="flex items-center gap-2"><span>💬</span> <a href="https://wa.me/8618800000001" className="hover:text-brand-gold transition-colors">+8618800000001</a></div>
              <div className="flex items-center gap-2"><span>📞</span> <a href="tel:+8618800000001" className="hover:text-brand-gold transition-colors">+86 188 0000 0001</a></div>
              <div className="flex items-center gap-2"><span>📍</span> <span>Guangzhou, Guangdong Province, China</span></div>
            </div>
          </div>

          {/* Quick Links */}
          {data.sections.map((section) => (
            <div key={section.title}>
              <h4 className="font-montserrat font-bold text-[0.875rem] text-white uppercase tracking-widest mb-6 border-l-[3px] border-brand-red pl-3">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link 
                      href={link.href}
                      className="text-white/50 hover:text-brand-gold text-[0.8125rem] font-open-sans transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Methods */}
          <div>
            <h4 className="font-montserrat font-bold text-[0.875rem] text-white uppercase tracking-widest mb-6 border-l-[3px] border-brand-red pl-3">
              Contact
            </h4>
            <ul className="space-y-3 mb-6">
              <li><a href="https://wa.me/8618800000001" className="text-white/50 hover:text-brand-gold text-[0.8125rem] font-open-sans transition-colors">💬 WhatsApp</a></li>
              <li><a href="mailto:sales@realismthrift.com" className="text-white/50 hover:text-brand-gold text-[0.8125rem] font-open-sans transition-colors">✉ Email Us</a></li>
              <li><Link href="#contact" className="text-white/50 hover:text-brand-gold text-[0.8125rem] font-open-sans transition-colors">📋 Inquiry Form</Link></li>
            </ul>
            <div className="bg-white/5 p-4 rounded-[4px] border border-white/10">
              <p className="text-[0.75rem] text-white/40 font-open-sans leading-[1.6]">
                Reply within <strong className="text-brand-gold">12 hours</strong>.<br />Urgent? Contact via WhatsApp.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[0.75rem] text-white/30 font-open-sans uppercase tracking-[0.05em]">
          <p>&copy; 2026 RealismThrift Export Co., Ltd. All Rights Reserved.</p>
          <div className="flex gap-6">
            {data.bottom.links.map(link => (
              <Link key={link.label} href={link.href} className="hover:text-white transition-colors">{link.label}</Link>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-[100]">
        <a 
          href="https://wa.me/8618800000001" 
          target="_blank" 
          className="w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center text-[2rem] shadow-[0_4px_12px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform"
          aria-label="WhatsApp"
        >
          💬
        </a>
        <button 
          onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
          className="w-12 h-12 bg-black/60 text-white rounded-full items-center justify-center text-[1.25rem] shadow-lg hover:bg-black transition-colors hidden md:flex"
          aria-label="Back to Top"
        >
          ▲
        </button>
      </div>
    </footer>
  );
};

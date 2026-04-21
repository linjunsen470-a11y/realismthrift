"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Mail, MapPin, Phone } from "lucide-react";
import { SiteFooter as SiteFooterType } from "@/types";

interface SiteFooterProps {
  data: SiteFooterType;
}

export const SiteFooter: React.FC<SiteFooterProps> = ({ data }) => {
  return (
    <footer className="bg-[#1A1A1A] text-white pt-20 pb-10">
      <div className="rt-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative w-14 h-14 brightness-0 invert">
                <Image src="/img/logo.png" alt="RT" fill className="object-contain" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-montserrat text-xl font-black text-[#F0B429] tracking-tight">RealismThrift</span>
                <span className="text-[9px] font-semibold text-white/50 tracking-[0.2em] uppercase">Export Co., Ltd</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed font-open-sans">
              {data.brand.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-montserrat font-bold text-sm uppercase tracking-widest mb-8 text-[#F0B429]">Quick Links</h4>
            <ul className="space-y-4">
              {data.sections[0].links.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-gray-400 hover:text-[#C0392B] transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-montserrat font-bold text-sm uppercase tracking-widest mb-8 text-[#F0B429]">Products</h4>
            <ul className="space-y-4">
              {data.sections[1].links.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-gray-400 hover:text-[#C0392B] transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-montserrat font-bold text-sm uppercase tracking-widest mb-8 text-[#F0B429]">Contact</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MessageCircle size={18} className="text-[#C0392B] shrink-0" />
                <a href={`https://wa.me/${data.brand.whatsapp?.replace(/\D/g, '')}`} className="hover:text-white">WhatsApp: {data.brand.whatsapp}</a>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-[#C0392B] shrink-0" />
                <a href={`mailto:${data.brand.email}`} className="hover:text-white">{data.brand.email}</a>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-[#C0392B] shrink-0" />
                <a href={`tel:${data.brand.phone}`} className="hover:text-white">{data.brand.phone}</a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-[#C0392B] shrink-0" />
                <span>{data.brand.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-open-sans">
          <p>{data.bottom.copyright}</p>
          <div className="flex gap-6">
            {data.bottom.links.map(link => (
              <Link key={link.label} href={link.href} className="hover:text-white">{link.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

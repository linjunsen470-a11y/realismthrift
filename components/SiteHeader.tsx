"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Mail, Phone, MessageCircle, Menu, X } from "lucide-react";
import { SiteHeader as SiteHeaderType } from "@/types";

interface SiteHeaderProps {
  data: SiteHeaderType;
}

export const SiteHeader: React.FC<SiteHeaderProps> = ({ data }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 150);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="w-full z-50">
      {/* 1. TOP BAR */}
      <div className="bg-[#1A1A1A] text-[#ccc] py-2 border-b-2 border-[#C0392B]">
        <div className="rt-container flex items-center justify-between text-[11px] font-bold">
          <span className="hidden md:block tracking-widest text-[#F0B429]">
            TOP SECOND HAND CLOTHES & SHOES SUPPLIER IN CHINA
          </span>
          
          <div className="flex-1 overflow-hidden whitespace-nowrap mx-4">
             <div className="ticker-text">
                Wholesale Used Clothes | Wholesale Used Shoes | Wholesale Used Bags | Brand Clothes Wholesale | Second Hand Shoes Export | Used Bags Wholesale China | &nbsp;
             </div>
          </div>

          <div className="flex items-center gap-4">
            <a href="mailto:sales@realismthrift.com" className="hover:text-[#F0B429] flex items-center gap-1">
              <Mail size={12} /> Email
            </a>
            <a href="https://wa.me/8618800000001" target="_blank" className="hover:text-[#F0B429] flex items-center gap-1">
              <MessageCircle size={12} /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* 2. LOGO BAR */}
      <div className="bg-white py-4 border-b border-gray-100">
        <div className="rt-container flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-12 h-12">
              <Image 
                src="/img/logo.png" 
                alt="RT" 
                fill 
                className="object-contain" 
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-montserrat text-xl font-black text-[#C9922A] tracking-tight">RealismThrift</span>
              <span className="text-[9px] font-semibold text-gray-400 tracking-[0.2em] uppercase">Export Co., Ltd</span>
            </div>
          </Link>

          <div className="hidden md:flex flex-1 max-w-md items-center border-2 border-gray-200 rounded overflow-hidden">
            <input 
              type="text" 
              placeholder="Search products..." 
              className="flex-1 px-4 py-2 text-sm outline-none font-open-sans"
            />
            <button className="bg-[#C0392B] text-white px-4 py-2 hover:bg-[#A93226] transition-colors">
              <Search size={18} />
            </button>
          </div>

          <Link 
            href="#contact" 
            className="bg-[#F0B429] text-[#1A1A1A] font-montserrat font-bold text-xs px-6 py-3 rounded-sm hover:bg-[#D4A017] transition-all transform hover:-translate-y-px shadow-sm"
          >
            INQUIRY
          </Link>

          <button 
            className="md:hidden text-[#C0392B]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* 3. MAIN NAVIGATION */}
      <nav 
        className={`bg-[#C0392B] transition-all duration-300 ${
          isSticky ? "fixed top-0 left-0 w-full shadow-lg" : "relative"
        }`}
      >
        <div className="rt-container">
          <ul className={`
            md:flex md:flex-row items-stretch
            ${isMenuOpen ? "flex flex-col absolute top-full left-0 w-full bg-[#C0392B] shadow-xl" : "hidden"}
          `}>
            {data.navItems.map((item) => (
              <li key={item.label} className="border-b border-white/10 md:border-none">
                <Link 
                  href={item.href}
                  className="inline-flex items-center px-5 py-4 text-white font-montserrat text-[13px] font-semibold tracking-wider hover:bg-black/20 border-b-4 border-transparent hover:border-[#F0B429] transition-all whitespace-nowrap"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
};

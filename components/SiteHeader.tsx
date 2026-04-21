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
      <div className="bg-[#1A1A1A] text-[#ccc] py-[0.4rem] border-b-2 border-[#C0392B]">
        <div className="rt-container flex items-center justify-between">
          <span className="hidden md:block font-montserrat font-bold text-[0.7rem] tracking-[0.05em] text-[#F0B429] uppercase">
            TOP SECOND HAND CLOTHES & SHOES SUPPLIER IN CHINA
          </span>
          
          <div className="flex-1 overflow-hidden whitespace-nowrap mx-4">
             <div className="ticker-text font-open-sans text-[0.7rem]">
                Wholesale Used Clothes &nbsp;|&nbsp; Wholesale Used Shoes &nbsp;|&nbsp; Wholesale Used Bags &nbsp;|&nbsp; Brand Clothes Wholesale &nbsp;|&nbsp; Second Hand Shoes Export &nbsp;|&nbsp; Used Bags Wholesale China &nbsp;|&nbsp;
             </div>
          </div>

          <div className="flex items-center gap-[0.75rem]">
            <a href="mailto:sales@realismthrift.com" className="hover:text-[#F0B429] flex items-center gap-1 text-[0.7rem] transition-colors">
              <span className="text-[0.8rem]">✉</span> Email
            </a>
            <a href="https://wa.me/8618800000001" target="_blank" className="hover:text-[#F0B429] flex items-center gap-1 text-[0.7rem] transition-colors">
              <span className="text-[0.8rem]">💬</span> WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* 2. LOGO BAR */}
      <div className="bg-white py-[0.75rem] border-b border-gray-100">
        <div className="rt-container flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-[0.75rem]">
            <Image 
              src="/img/rt-icon.png" 
              alt="RT" 
              width={48} 
              height={48} 
              className="object-contain shrink-0" 
            />
            <div className="flex flex-col leading-[1.1]">
              <span className="font-montserrat text-[1.2rem] font-[800] text-[#C9922A] tracking-[0.02em]">RealismThrift</span>
              <span className="font-montserrat text-[0.6rem] font-[600] text-[#888] tracking-[0.15em] uppercase mt-[1px]">Export Co., Ltd</span>
            </div>
          </Link>

          <form className="hidden md:flex flex-1 max-w-[320px] items-center border-2 border-[#ddd] rounded-[4px] overflow-hidden" action="/search">
            <input 
              type="search" 
              name="s"
              placeholder="Search products..." 
              className="flex-1 px-[0.75rem] py-[0.5rem] text-[0.875rem] outline-none font-open-sans"
            />
            <button className="bg-[#C0392B] text-white px-[0.875rem] py-[0.5rem] hover:bg-[#A93226] transition-colors flex items-center justify-center">
              <span className="text-[1rem]">🔍</span>
            </button>
          </form>

          <Link 
            href="#contact" 
            className="bg-[#F0B429] text-[#1A1A1A] font-montserrat font-bold text-[0.8rem] px-[1.25rem] py-[0.6rem] rounded-[3px] hover:bg-[#D4A017] transition-all transform hover:-translate-y-px shadow-sm tracking-[0.05em] uppercase"
          >
            INQUIRY
          </Link>

          <button 
            className="md:hidden text-[#C0392B] text-2xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* 3. MAIN NAVIGATION */}
      <nav 
        className={`bg-[#C0392B] transition-all duration-300 z-[999] ${
          isSticky ? "fixed top-0 left-0 w-full shadow-[0_2px_8px_rgba(192,57,43,0.35)]" : "relative shadow-[0_2px_8px_rgba(192,57,43,0.35)]"
        }`}
      >
        <div className="rt-container">
          <ul className={`
            md:flex md:flex-row items-stretch
            ${isMenuOpen ? "flex flex-col absolute top-full left-0 w-full bg-[#C0392B] shadow-xl" : "hidden"}
          `}>
            {data.navItems.map((item) => (
              <li key={item.label} className="flex items-stretch">
                <Link 
                  href={item.href}
                  className="inline-flex items-center px-[1.1rem] py-[0.875rem] text-white font-montserrat text-[0.82rem] font-[600] tracking-[0.03em] hover:bg-black/20 border-b-[3px] border-transparent hover:border-[#F0B429] transition-all whitespace-nowrap"
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

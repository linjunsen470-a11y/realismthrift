"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Menu, MessageCircle, Search, X } from "lucide-react";
import { SiteHeader as SiteHeaderType } from "@/types";

interface SiteHeaderProps {
  data: SiteHeaderType;
}

export function SiteHeader({ data }: SiteHeaderProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header>
      <div className="rt-topbar">
        <div className="rt-container">
          <span className="rt-topbar-brand">
            TOP SECOND HAND CLOTHES &amp; SHOES SUPPLIER IN CHINA
          </span>

          <div className="rt-topbar-ticker" aria-hidden="true">
            <span className="rt-topbar-ticker-text">
              Wholesale Used Clothes | Wholesale Used Shoes | Wholesale Used Bags |
              Brand Clothes Wholesale | Second Hand Shoes Export | Used Bags
              Wholesale China |
            </span>
          </div>

          <div className="rt-topbar-links">
            <a href="mailto:sales@realismthrift.com">
              <Mail size={14} strokeWidth={2.2} />
              Email
            </a>
            <a href="https://wa.me/8618800000001" target="_blank" rel="noreferrer">
              <MessageCircle size={14} strokeWidth={2.2} />
              WhatsApp
            </a>
            <Link href="/" className="rt-lang-pill" lang="es-PR">
              es
            </Link>
          </div>
        </div>
      </div>

      <div className="rt-logo-bar">
        <div className="rt-container">
          <Link href="/" className="rt-logo-link" onClick={() => setIsMenuOpen(false)}>
            <span className="rt-logo-combo">
              <Image
                src="/img/rt-icon.png"
                alt="RT"
                width={48}
                height={48}
                className="rt-logo-image"
              />
              <span className="rt-logo-combo-text">
                <span className="rt-logo-combo-name">RealismThrift</span>
                <span className="rt-logo-combo-sub">Export Co., Ltd</span>
              </span>
            </span>
          </Link>

          <form className="rt-search-form" role="search" action="/">
            <input type="search" name="s" placeholder="Search products..." />
            <button type="submit" aria-label="Search products">
              <Search size={16} strokeWidth={2.25} />
            </button>
          </form>

          <Link href="/#contact" className="rt-inquiry-btn">
            {data.inquiryCta}
          </Link>
        </div>
      </div>

      <nav className="rt-mainnav" id="rt-mainnav" aria-label="Main navigation">
        <div className="rt-container">
          <button
            type="button"
            className="rt-hamburger"
            aria-expanded={isMenuOpen}
            aria-controls="rt-nav-list"
            aria-label="Toggle navigation"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? <X size={24} strokeWidth={2.4} /> : <Menu size={24} strokeWidth={2.4} />}
          </button>

          <ul
            id="rt-nav-list"
            className={`rt-nav-list${isMenuOpen ? " is-open" : ""}`}
            role="menubar"
          >
            {data.navItems.map((item) => {
              const isActive =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={isActive ? "is-active" : undefined}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </header>
  );
}

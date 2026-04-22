"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { SiteFooter as SiteFooterType } from "@/types";

interface SiteFooterProps {
  data: SiteFooterType;
}

export function SiteFooter({ data }: SiteFooterProps) {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 320);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <footer className="rt-footer">
      <div className="rt-container">
        <div className="rt-footer-grid">
          <div>
            <div className="rt-footer-logo">
              <Image
                src="/img/rt-icon.png"
                alt="RT"
                width={56}
                height={56}
                className="rt-footer-logo-image"
              />
              <div className="rt-footer-logo-copy">
                <span className="rt-footer-logo-name">RealismThrift</span>
                <span className="rt-footer-logo-sub">Export Co., Ltd</span>
              </div>
            </div>

            <p className="rt-footer-desc">{data.brand.description}</p>

            <div className="rt-footer-contact-item">
              <Mail size={16} strokeWidth={2.2} />
              <a href={`mailto:${data.brand.email}`}>{data.brand.email}</a>
            </div>
            <div className="rt-footer-contact-item">
              <MessageCircle size={16} strokeWidth={2.2} />
              <a href={`https://wa.me/${data.brand.whatsapp}`} target="_blank" rel="noreferrer">
                {data.brand.whatsapp}
              </a>
            </div>
            <div className="rt-footer-contact-item">
              <Phone size={16} strokeWidth={2.2} />
              <a href="tel:+8613367481710">{data.brand.phone}</a>
            </div>
            <div className="rt-footer-contact-item">
              <MapPin size={16} strokeWidth={2.2} />
              <span>{data.brand.address}</span>
            </div>
          </div>

          {data.sections.map((section) => (
            <div key={section.title}>
              <h4 className="rt-footer-col-title">{section.title}</h4>
              <ul className="rt-footer-links">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="rt-footer-col-title">Contact</h4>
            <ul className="rt-footer-links">
              <li>
                <a href={`https://wa.me/${data.contact.whatsapp}`} target="_blank" rel="noreferrer">
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={`mailto:${data.contact.email}`}>Email Us</a>
              </li>
              <li>
                <Link href="/#contact">Inquiry Form</Link>
              </li>
            </ul>

            <div className="rt-footer-note">{data.contact.inquiryTime}</div>
          </div>
        </div>

        <div className="rt-footer-bottom">
          <p>{data.bottom.copyright}</p>
          <div className="rt-footer-bottom-links">
            {data.bottom.links.map((link) => (
              <Link key={link.label} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="rt-floating-actions">
        <a
          href={`https://wa.me/${data.contact.whatsapp}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Contact via WhatsApp"
          className="rt-floating-whatsapp"
        >
          <MessageCircle size={26} strokeWidth={2.2} />
        </a>
        <button
          type="button"
          aria-label="Back to top"
          aria-hidden={!showBackToTop}
          hidden={!showBackToTop}
          className={`rt-floating-top${showBackToTop ? " is-visible" : ""}`}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <span className="rt-floating-top-glyph">↑</span>
        </button>
      </div>
    </footer>
  );
}

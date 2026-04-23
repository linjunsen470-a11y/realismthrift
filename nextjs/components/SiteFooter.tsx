import Image from "next/image";
import Link from "next/link";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Twitter,
  Youtube,
  X,
} from "lucide-react";
import { SiteFooter as SiteFooterType } from "@/types";
import { FooterBackToTop } from "@/components/FooterBackToTop";

interface SiteFooterProps {
  data: SiteFooterType;
}

export function SiteFooter({ data }: SiteFooterProps) {
  return (
    <footer className="rt-footer">
      <div className="rt-container">
        <div className="rt-footer-grid">
          <div>
            <div className="rt-footer-logo">
              <Image
                src="/img/rt-icon.png"
                alt="RealismThrift Logo"
                width={56}
                height={56}
                sizes="56px"
                className="rt-footer-logo-image"
              />
              <div className="rt-footer-logo-copy">
                <span className="rt-footer-logo-name">RealismThrift</span>
                <span className="rt-footer-logo-sub">Export Co., Ltd</span>
              </div>
            </div>

            <p className="rt-footer-desc">{data.brand.description}</p>

            <div className="rt-footer-contact-item">
              <Mail size={18} strokeWidth={2.2} />
              <a href={`mailto:${data.brand.email}`}>{data.brand.email}</a>
            </div>
            {data.brand.whatsapp && (
              <div className="rt-footer-contact-item">
                <MessageCircle size={18} strokeWidth={2.2} />
                <a href={`https://wa.me/${data.brand.whatsapp.replace(/\s/g, "")}`} target="_blank" rel="noreferrer">
                  {data.brand.whatsapp}
                </a>
              </div>
            )}
            <div className="rt-footer-contact-item">
              <Phone size={18} strokeWidth={2.2} />
              <a href="tel:+8613367481710">{data.brand.phone}</a>
            </div>
            <div className="rt-footer-contact-item">
              <MapPin size={18} strokeWidth={2.2} />
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
                <a href={`https://wa.me/${data.contact.whatsapp.replace(/\s/g, "")}`} target="_blank" rel="noreferrer">
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

            <div className="rt-footer-note">
              {data.contact.inquiryTime.split(". ").map((text, idx) => (
                <div key={idx}>
                  {text.includes("12 hours") ? (
                    <>
                      Reply within <span className="rt-footer-note-gold">12 hours</span>.
                    </>
                  ) : (
                    text
                  )}
                </div>
              ))}
            </div>

            {data.brand.socials && (
              <div className="rt-footer-socials">
                {data.brand.socials.facebook && (
                  <a href={data.brand.socials.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="rt-footer-social-link">
                    <Facebook size={18} />
                  </a>
                )}
                {data.brand.socials.instagram && (
                  <a href={data.brand.socials.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="rt-footer-social-link">
                    <Instagram size={18} />
                  </a>
                )}
                {data.brand.socials.youtube && (
                  <a href={data.brand.socials.youtube} target="_blank" rel="noreferrer" aria-label="YouTube" className="rt-footer-social-link">
                    <Youtube size={18} />
                  </a>
                )}
                {data.brand.socials.twitter && (
                  <a href={data.brand.socials.twitter} target="_blank" rel="noreferrer" aria-label="X (Twitter)" className="rt-footer-social-link">
                    <X size={18} />
                  </a>
                )}
              </div>
            )}
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
          href={`https://wa.me/${data.contact.whatsapp.replace(/\s/g, "")}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Contact via WhatsApp"
          className="rt-floating-whatsapp"
        >
          <MessageCircle size={26} strokeWidth={2.2} />
        </a>
        <FooterBackToTop />
      </div>
    </footer>
  );
}

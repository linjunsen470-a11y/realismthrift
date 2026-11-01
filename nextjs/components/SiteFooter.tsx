import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { SiteFooter as SiteFooterType } from "@/types";
import { FooterBackToTop } from "@/components/FooterBackToTop";
import { localePath, type Locale } from "@/lib/i18n/routing";
import { getTranslator } from "@/lib/i18n/server";

interface SiteFooterProps {
  locale?: Locale;
  data: SiteFooterType;
}

export function SiteFooter({ locale = "en", data }: SiteFooterProps) {
  const t = getTranslator(locale);
  return (
    <footer className="rt-footer">
      <div className="rt-container">
        <div className="rt-footer-grid">
          <div>
            <div className="rt-footer-logo">
              <Image
                src="/img/logo.webp"
                alt={t(
                  "RealismThrift Logo - Used Fashion Export Supplier from Huizhou China",
                )}
                width={56}
                height={56}
                sizes="56px"
                className="rt-footer-logo-image"
              />
              <div className="rt-footer-logo-copy">
                <span className="rt-footer-logo-name">
                  {t("RealismThrift")}
                </span>
                <span className="rt-footer-logo-sub">
                  {t("Wholesale Export")}
                </span>
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
                <a
                  href={`https://wa.me/${data.brand.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {data.brand.whatsapp}
                </a>
              </div>
            )}
            <div className="rt-footer-contact-item">
              <Phone size={18} strokeWidth={2.2} />
              <a href="tel:+8617279444062">{data.brand.phone}</a>
            </div>
            <div className="rt-footer-contact-item">
              <MapPin size={18} strokeWidth={2.2} />
              <span>{data.brand.address}</span>
            </div>
          </div>

          {data.sections.map((section, index) => (
            <div key={section.title}>
              <p
                className="rt-footer-col-title"
                id={`footer-nav-section-${index}`}
              >
                {section.title}
              </p>
              <nav aria-labelledby={`footer-nav-section-${index}`}>
                <ul className="rt-footer-links">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href}>{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          ))}

          <div>
            <p className="rt-footer-col-title" id="footer-nav-contact">
              {t("Contact")}
            </p>
            <nav aria-labelledby="footer-nav-contact">
              <ul className="rt-footer-links">
                <li>
                  <a
                    href={`https://wa.me/${data.contact.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t("WhatsApp")}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${data.contact.email}`}>{t("Email Us")}</a>
                </li>
                <li>
                  <Link href={localePath("/#contact", locale)}>
                    {t("Inquiry Form")}
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="rt-footer-note">
              {locale !== "en"
                ? data.contact.inquiryTime
                : data.contact.inquiryTime.split(". ").map((text, idx) => (
                    <div key={idx}>
                      {text.includes("12 hours") ? (
                        <>
                          {t("We aim to reply within ")}
                          <span className="rt-footer-note-gold">
                            {t("12 hours")}
                          </span>
                          .
                        </>
                      ) : (
                        text
                      )}
                    </div>
                  ))}
            </div>
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
          href={`https://wa.me/${data.contact.whatsapp.replace(/\D/g, "")}`}
          target="_blank"
          rel="noreferrer"
          aria-label={t("Contact via WhatsApp")}
          className="rt-floating-whatsapp"
        >
          <MessageCircle size={26} strokeWidth={2.2} />
        </a>
        <FooterBackToTop label={t("Back to top")} />
      </div>
    </footer>
  );
}

"use client";

import { FormEvent, useRef, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SiteHeader as SiteHeaderType } from "@/types";
import { localePath, type Locale } from "@/lib/i18n/routing";
import { createTranslator, type Messages } from "@/lib/i18n/translate";

interface HeaderClientProps {
  locale?: Locale;
  messages?: Messages;
  data: SiteHeaderType;
}

export function HeaderClient({
  locale = "en",
  messages,
  data,
}: HeaderClientProps) {
  const t = createTranslator(messages);
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const value = String(formData.get("q") ?? "").trim();
    const target = value ? `/search?q=${encodeURIComponent(value)}` : "/search";

    startTransition(() => {
      router.push(target);
      closeMenu();
    });
  }

  return (
    <>
      <div className="rt-logo-bar">
        <div className="rt-container">
          <Link
            href={localePath("/", locale)}
            className="rt-logo-link"
            onClick={closeMenu}
          >
            <span className="rt-logo-combo">
              <Image
                src="/img/logo.webp"
                alt=""
                width={48}
                height={48}
                sizes="48px"
                className="rt-logo-image"
              />
              <span className="rt-logo-combo-text">
                <span className="rt-logo-combo-name">{t("RealismThrift")}</span>
                <span className="rt-logo-combo-sub">
                  {t("Wholesale Export")}
                </span>
              </span>
            </span>
          </Link>

          <div className="rt-header-actions flex items-center gap-3">
            <LanguageSwitcher locale={locale} label={t("Language")} />
            <form
              className="rt-search-form"
              role="search"
              onSubmit={handleSubmit}
            >
              <input
                type="search"
                name="q"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={t("Search products, shipping…")}
                maxLength={120}
                aria-label={t("Search catalog")}
                className="bg-transparent focus:ring-0 text-sm"
              />
              <button
                type="submit"
                aria-label={t("Search")}
                className="active:scale-95 transition-transform"
                disabled={isPending}
              >
                <Search size={16} strokeWidth={2.5} />
              </button>
            </form>

            <Link
              href={localePath("/#contact", locale)}
              className="rt-inquiry-btn"
              onClick={closeMenu}
            >
              {data.inquiryCta}
            </Link>
            <button
              type="button"
              className="rt-hamburger"
              ref={menuButtonRef}
              aria-expanded={isMenuOpen}
              aria-controls="rt-nav-list"
              aria-label={t("Toggle navigation")}
              onClick={() => setIsMenuOpen((open) => !open)}
              onKeyDown={(event) => {
                if (event.key === "Escape") closeMenu();
              }}
            >
              {isMenuOpen ? (
                <X size={24} strokeWidth={2.4} />
              ) : (
                <Menu size={24} strokeWidth={2.4} />
              )}
            </button>
          </div>
        </div>
      </div>

      <nav
        className="rt-mainnav"
        id="rt-mainnav"
        aria-label={t("Main navigation")}
        onKeyDown={(event) => {
          if (event.key === "Escape" && isMenuOpen) {
            closeMenu();
            menuButtonRef.current?.focus();
          }
        }}
      >
        <div className="rt-container">
          <ul
            id="rt-nav-list"
            className={`rt-nav-list${isMenuOpen ? " is-open" : ""}`}
          >
            <li className="rt-mobile-search-item">
              <Link href={localePath("/search", locale)} onClick={closeMenu}>
                <Search size={16} aria-hidden="true" />
                {t(" Search the Site")}
              </Link>
            </li>
            {data.navItems.map((item) => {
              const isActive =
                item.href === localePath("/", locale)
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={isActive ? "is-active" : undefined}
                    aria-current={isActive ? "page" : undefined}
                    onClick={closeMenu}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </>
  );
}

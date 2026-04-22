"use client";

import { FormEvent, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import { SiteHeader as SiteHeaderType } from "@/types";

interface SiteHeaderProps {
  data: SiteHeaderType;
}

export function SiteHeader({ data }: SiteHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const value = String(formData.get("q") ?? "").trim();
    const target = value ? `/search?q=${encodeURIComponent(value)}` : "/search";

    startTransition(() => {
      router.push(target);
    });
  }

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

          {/* Search bar - hidden on small mobile to prevent crowding, shown from tablet up */}
          <form className="hidden md:flex rt-search-form focus-within:border-brand-red focus-within:shadow-[0_0_0_1px_#c0392b] transition-all duration-300" role="search" onSubmit={handleSubmit}>
            <input 
              type="search" 
              name="q" 
              defaultValue={searchParams.get("q") ?? ""}
              placeholder="Search catalog..." 
              className="bg-transparent focus:ring-0 text-sm"
            />
            <button type="submit" aria-label="Search" className="active:scale-95 transition-transform" disabled={isPending}>
              <Search size={16} strokeWidth={2.5} />
            </button>
          </form>

          <div className="flex items-center gap-3">
            <Link href="/#contact" className="rt-inquiry-btn">
              {data.inquiryCta}
            </Link>
            <button
              type="button"
              className="rt-hamburger md:hidden"
              aria-expanded={isMenuOpen ? true : false}
              aria-controls="rt-nav-list"
              aria-label="Toggle navigation"
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              {isMenuOpen ? <X size={24} strokeWidth={2.4} /> : <Menu size={24} strokeWidth={2.4} />}
            </button>
          </div>
        </div>
      </div>

      <nav className="rt-mainnav" id="rt-mainnav" aria-label="Main navigation">
        <div className="rt-container">
          <ul
            id="rt-nav-list"
            className={`rt-nav-list${isMenuOpen ? " is-open" : ""}`}
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

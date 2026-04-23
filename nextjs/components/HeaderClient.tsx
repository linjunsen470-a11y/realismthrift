"use client";

import { FormEvent, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import { SiteHeader as SiteHeaderType } from "@/types";

interface HeaderClientProps {
  data: SiteHeaderType;
}

export function HeaderClient({ data }: HeaderClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");

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
          <Link href="/" className="rt-logo-link" onClick={closeMenu}>
            <span className="rt-logo-combo">
              <Image
                src="/img/rt-icon.png"
                alt="RealismThrift Logo"
                width={48}
                height={48}
                sizes="48px"
                className="rt-logo-image"
              />
              <span className="rt-logo-combo-text">
                <span className="rt-logo-combo-name">RealismThrift</span>
                <span className="rt-logo-combo-sub">Export Co., Ltd</span>
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <form
              className="hidden md:flex rt-search-form focus-within:border-brand-red focus-within:shadow-[0_0_0_1px_#c0392b] transition-all duration-300"
              role="search"
              onSubmit={handleSubmit}
            >
              <input
                type="search"
                name="q"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search catalog..."
                className="bg-transparent focus:ring-0 text-sm"
              />
              <button
                type="submit"
                aria-label="Search"
                className="active:scale-95 transition-transform"
                disabled={isPending}
              >
                <Search size={16} strokeWidth={2.5} />
              </button>
            </form>

            <Link href="/#contact" className="rt-inquiry-btn" onClick={closeMenu}>
              {data.inquiryCta}
            </Link>
            <button
              type="button"
              className="rt-hamburger md:hidden"
              aria-expanded={isMenuOpen}
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
          <ul id="rt-nav-list" className={`rt-nav-list${isMenuOpen ? " is-open" : ""}`}>
            {data.navItems.map((item) => {
              const isActive =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={isActive ? "is-active" : undefined}
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

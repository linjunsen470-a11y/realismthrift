"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { Globe2 } from "lucide-react";
import {
  languageNames,
  localePath,
  locales,
  localizedPaths,
  splitLocale,
  type Locale,
} from "@/lib/i18n/routing";

function syncLanguageLinks(
  details: HTMLDetailsElement | null,
  path: string,
  target: string,
) {
  const hash = target === path ? window.location.hash : "";
  for (const link of details?.querySelectorAll<HTMLAnchorElement>(
    "a[hreflang]",
  ) ?? [])
    link.href = `${localePath(target, link.hreflang as Locale)}${window.location.search}${hash}`;
}

export function LanguageSwitcher({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const { path } = splitLocale(usePathname());
  const target = localizedPaths.includes(
    path as (typeof localizedPaths)[number],
  )
    ? path
    : "/";
  function syncLinks() {
    syncLanguageLinks(detailsRef.current, path, target);
  }
  useEffect(() => {
    // Update real hrefs after hydration, including copied links and new-tab navigation.
    const updateLinks = () => {
      syncLanguageLinks(detailsRef.current, path, target);
    };
    updateLinks();
    function closeOutside(event: PointerEvent) {
      const details = detailsRef.current;
      if (
        details?.open &&
        event.target instanceof Node &&
        !details.contains(event.target)
      ) {
        details.open = false;
      }
    }
    document.addEventListener("pointerdown", closeOutside);
    window.addEventListener("hashchange", updateLinks);
    window.addEventListener("popstate", updateLinks);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      window.removeEventListener("hashchange", updateLinks);
      window.removeEventListener("popstate", updateLinks);
    };
  }, [path, target]);
  return (
    <details
      ref={detailsRef}
      className="rt-language-switcher"
      onPointerEnter={syncLinks}
      onPointerDown={syncLinks}
      onFocus={syncLinks}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.currentTarget.open = false;
          event.currentTarget.querySelector("summary")?.focus();
        }
      }}
    >
      <summary aria-label={label}>
        <Globe2 size={17} aria-hidden="true" />
        <span lang={locale} dir="auto">
          {languageNames[locale]}
        </span>
        <span className="rt-language-caret" aria-hidden="true">
          ▾
        </span>
      </summary>
      <ul aria-label={label}>
        {locales.map((language) => (
          <li key={language}>
            {/* Cross-root navigation updates HTML lang and dir before rendering. */}
            <a
              href={localePath(target, language)}
              hrefLang={language}
              lang={language}
              dir="auto"
              aria-current={language === locale ? "true" : undefined}
              onClick={syncLinks}
            >
              {languageNames[language]}
              {language === locale ? <span aria-hidden="true">✓</span> : null}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}

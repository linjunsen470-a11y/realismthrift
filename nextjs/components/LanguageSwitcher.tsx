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

export function LanguageSwitcher({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
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
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, []);
  const { path } = splitLocale(usePathname());
  // English-only blog/search pages switch to the selected language's homepage.
  const target = localizedPaths.includes(
    path as (typeof localizedPaths)[number],
  )
    ? path
    : "/";
  return (
    <details
      ref={detailsRef}
      className="rt-language-switcher"
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
              onClick={(event) => {
                // Campaign parameters survive fallback; section anchors only belong to the same page.
                const hash = target === path ? window.location.hash : "";
                event.currentTarget.href = `${localePath(target, language)}${window.location.search}${hash}`;
              }}
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

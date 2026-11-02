export const locales = ["en", "es", "fr", "ar", "vi", "id"] as const;
export type Locale = (typeof locales)[number];
export const translatedLocales = locales.filter((locale) => locale !== "en");
export const localizedPaths = [
  "/",
  "/used-brand-clothes",
  "/used-brand-shoes",
  "/used-brand-bag",
  "/about-us",
  "/how-to-order",
  "/faq",
  "/contact-us",
  "/privacy-policy",
  "/terms-of-service",
] as const;
export const languageNames: Record<Locale, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  ar: "العربية",
  vi: "Tiếng Việt",
  id: "Bahasa Indonesia",
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

/** The search UI remains English; carry the visitor's language to result links. */
export function searchHref(query: string, locale: Locale = "en") {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (locale !== "en") params.set("lang", locale);
  return `/search${params.size ? `?${params}` : ""}`;
}

export function splitLocale(pathname: string): {
  locale: Locale;
  path: string;
} {
  const segments = pathname.split("/");
  const prefix = segments[1];
  return prefix && prefix !== "en" && isLocale(prefix)
    ? {
        locale: prefix,
        path: `/${segments.slice(2).join("/")}`.replace(/\/$/, "") || "/",
      }
    : { locale: "en", path: pathname.replace(/\/$/, "") || "/" };
}

/** Only published translations get language URLs; blog and utility URLs stay English. */
export function localePath(href: string, locale: Locale): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  const suffixIndex = href.search(/[?#]/);
  const pathname = suffixIndex === -1 ? href : href.slice(0, suffixIndex);
  const suffix = suffixIndex === -1 ? "" : href.slice(suffixIndex);
  const { path } = splitLocale(pathname);
  if (!localizedPaths.includes(path as (typeof localizedPaths)[number]))
    return href;
  return `${locale === "en" ? "" : `/${locale}`}${path === "/" && locale !== "en" ? "" : path}${suffix}`;
}

export function languageAlternates(path: string) {
  return Object.fromEntries([
    ...locales.map((locale) => [
      locale,
      `https://www.realismthrift.com${localePath(path, locale)}`,
    ]),
    ["x-default", `https://www.realismthrift.com${path === "/" ? "" : path}`],
  ]);
}

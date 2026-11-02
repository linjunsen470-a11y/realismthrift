import type { Metadata } from "next";
import es from "./messages/es.json";
import fr from "./messages/fr.json";
import ar from "./messages/ar.json";
import vi from "./messages/vi.json";
import id from "./messages/id.json";
import clientKeys from "./client-keys.json";
import { createTranslator, type Messages } from "./translate";
import { languageAlternates, localePath, type Locale } from "./routing";

const dictionaries: Record<Locale, Messages> = { en: {}, es, fr, ar, vi, id };
export function getTranslator(locale: Locale) {
  return createTranslator(dictionaries[locale]);
}

export function getClientMessages(
  locale: Locale,
  component: keyof typeof clientKeys,
): Messages {
  if (locale === "en") return {};
  return Object.fromEntries(
    clientKeys[component].map((key) => [key, dictionaries[locale][key] ?? key]),
  );
}

/** Translate display copy, including the confirmed address; preserve IDs and contact identifiers. */
export function getLocalizedData<T>(value: T, locale: Locale): T {
  const t = getTranslator(locale);
  const visit = (item: unknown, key = ""): unknown => {
    if (typeof item === "string") {
      if (key === "href") return localePath(item, locale);
      if (
        ["id", "icon", "email", "phone", "whatsapp", "logo", "image"].includes(
          key,
        )
      )
        return item;
      return t(item);
    }
    if (Array.isArray(item)) return item.map((entry) => visit(entry));
    if (item && typeof item === "object")
      return Object.fromEntries(
        Object.entries(item).map(([key, entry]) => [key, visit(entry, key)]),
      );
    return item;
  };
  return visit(value) as T;
}

export function localizeMetadata(metadata: Metadata, locale: Locale): Metadata {
  const path = String(metadata.alternates?.canonical ?? "/");
  const canonical = localePath(path, locale);
  const ogLocales: Record<Locale, string> = {
    en: "en_US",
    es: "es_ES",
    fr: "fr_FR",
    ar: "ar_AR",
    vi: "vi_VN",
    id: "id_ID",
  };
  return {
    ...metadata,
    alternates: {
      ...metadata.alternates,
      canonical,
      languages: languageAlternates(path),
    },
    openGraph: {
      ...metadata.openGraph,
      url: canonical,
      locale: ogLocales[locale],
      alternateLocale: Object.entries(ogLocales)
        .filter(([key]) => key !== locale)
        .map(([, value]) => value),
    },
  };
}

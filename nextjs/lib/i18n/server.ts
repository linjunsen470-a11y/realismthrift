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

/** Only these display fields may be translated. Unknown fields remain source data. */
const localizedDataFields = new Set([
  "label",
  "title",
  "description",
  "alt",
  "category",
  "address",
  "inquiryCta",
  "inquiryTime",
  "copyright",
  "staffCount",
  "countriesCount",
  "facilitySize",
  "monthlyCapacity",
  "reorderRate",
  "buyersCount",
]);

/** Translate registered display fields and published links; preserve identifiers and unknown fields. */
export function getLocalizedData<T>(value: T, locale: Locale): T {
  const t = getTranslator(locale);
  const visit = (item: unknown, key = ""): unknown => {
    if (typeof item === "string") {
      if (key === "href") return localePath(item, locale);
      return localizedDataFields.has(key) ? t(item) : item;
    }
    if (Array.isArray(item)) return item.map((entry) => visit(entry, key));
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

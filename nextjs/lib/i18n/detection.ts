import { isLocale, type Locale } from "./routing";

const frenchBusinessMarkets = new Set(["SN", "ML", "NE", "CF", "MG", "BI"]);
const languageRange = /^[a-z]{1,8}(?:-[a-z0-9]{1,8})*$/i;
const quality = /^q=(0(?:\.\d{0,3})?|1(?:\.0{0,3})?)$/i;

/** Select the highest-weight supported primary language, retaining header order on ties. */
export function browserLanguage(header: string | null): Locale | undefined {
  let best: { locale: Locale; weight: number } | undefined;
  for (const range of (header ?? "").split(",")) {
    const [rawTag, ...parameters] = range.trim().split(";");
    const tag = rawTag.trim();
    if (!languageRange.test(tag) || parameters.length > 1) continue;
    const match = parameters.length ? quality.exec(parameters[0].trim()) : null;
    if (parameters.length && !match) continue;
    const weight = match ? Number(match[1]) : 1;
    const primary = tag.split("-")[0].toLowerCase();
    if (weight <= 0 || !isLocale(primary)) continue;
    if (!best || weight > best.weight) best = { locale: primary, weight };
  }
  return best?.locale;
}

/** Only the platform-provided country is needed; no IP address is retained. */
export function countryLanguage(country: string | null): Locale | undefined {
  const region = country?.trim().toUpperCase();
  if (!region || !/^[A-Z]{2}$/.test(region) || region === "XX") return undefined;
  if (frenchBusinessMarkets.has(region)) return "fr";
  try {
    const language = new Intl.Locale(`und-${region}`).maximize().language;
    return isLocale(language) ? language : undefined;
  } catch {
    return undefined;
  }
}

export function preferredLanguage({
  preference,
  acceptLanguage,
  country,
}: {
  preference?: string;
  acceptLanguage: string | null;
  country: string | null;
}): Locale {
  if (preference && isLocale(preference)) return preference;
  return browserLanguage(acceptLanguage) ?? countryLanguage(country) ?? "en";
}

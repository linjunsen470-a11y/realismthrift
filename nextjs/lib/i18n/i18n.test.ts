import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { QualityStandards } from "@/components/product/QualityStandards";
import { createTranslator } from "./translate";
import {
  languageAlternates,
  localePath,
  splitLocale,
  locales,
  localizedPaths,
} from "./routing";
import { getClientMessages, getLocalizedData, getTranslator } from "./server";
import sourceKeys from "./source-keys.json";
import es from "./messages/es.json";
import fr from "./messages/fr.json";
import ar from "./messages/ar.json";
import vi from "./messages/vi.json";
import { companyStats, productsData, siteHeader } from "@/data/siteData";

it("quality standards translate only the default heading, leaving supplied display copy intact", () => {
  const supplied = renderToStaticMarkup(
    createElement(QualityStandards, {
      locale: "fr",
      title: "Home",
      standards: [],
    }),
  );
  expect(supplied).toMatch(/<h2[^>]*>Home<\/h2>/);
  const defaultTitle = getTranslator("fr")("A-Grade Quality Standards");
  const defaultMarkup = renderToStaticMarkup(
    createElement(QualityStandards, { locale: "fr", standards: [] }),
  );
  expect(defaultMarkup).toContain(defaultTitle);
});

describe("published language URLs", () => {
  it("keeps English and all backend, utility and Sanity routes at their existing URLs", () => {
    expect(localePath("/used-brand-clothes", "en")).toBe("/used-brand-clothes");
    for (const path of [
      "/blog",
      "/blog/example",
      "/api/send",
      "/api/mcp",
      "/oauth/consent",
      "/outreach/connect",
      "/email-preferences",
      "/search?q=shoes",
    ]) {
      for (const locale of locales) expect(localePath(path, locale)).toBe(path);
    }
  });
  it("preserves page, query and anchor when switching languages", () => {
    expect(localePath("/es/used-brand-shoes?fbclid=click#inquiry", "ar")).toBe(
      "/ar/used-brand-shoes?fbclid=click#inquiry",
    );
    expect(localePath("/fr#contact", "en")).toBe("/#contact");
    expect(splitLocale("/vi/faq/")).toEqual({ locale: "vi", path: "/faq" });
    expect(localePath("https://wa.me/8617279444062", "es")).toBe(
      "https://wa.me/8617279444062",
    );
    expect(localePath("//external.example/faq", "fr")).toBe(
      "//external.example/faq",
    );
  });
  it("declares reciprocal alternates only for the ten published core pages", () => {
    expect(localizedPaths).toHaveLength(10);
    for (const path of localizedPaths) {
      const alternate = languageAlternates(path);
      expect(Object.keys(alternate)).toEqual([...locales, "x-default"]);
      expect(alternate["x-default"]).toMatch(
        /^https:\/\/www\.realismthrift\.com/,
      );
      for (const locale of locales)
        expect(alternate[locale]).toContain(localePath(path, locale));
    }
  });
});

describe("translation integrity and server/client boundaries", () => {
  for (const [locale, messages] of Object.entries({ es, fr, ar, vi })) {
    it(`${locale} covers all source copy and preserves interpolation tokens`, () => {
      for (const key of sourceKeys) {
        const translated = (messages as Record<string, string>)[key];
        expect(translated, key).toBeTruthy();
        expect(translated, key).not.toMatch(/ZXQ\d+QXZ/i);
        expect((translated.match(/\{\w+\}/g) ?? []).sort(), key).toEqual(
          (key.match(/\{\w+\}/g) ?? []).sort(),
        );
      }
    });
  }
  it("retains source spacing around links and substitutes company facts", () => {
    const t = createTranslator({
      " and ": "y",
      "{v0} countries": "{v0} países",
    });
    expect(t(" and ")).toBe(" y ");
    expect(t("{v0} countries", { v0: "100+" })).toBe("100+ países");
  });
  it("retains company facts and product IDs while localizing navigation", () => {
    const data = getLocalizedData(siteHeader, "fr");
    expect(data.brand).toEqual(siteHeader.brand);
    expect(data.navItems.find((item) => item.href === "/blog")).toBeTruthy();
    expect(data.navItems[1].href).toBe("/fr/used-brand-clothes");
    expect(getLocalizedData(productsData, "ar").map((item) => item.id)).toEqual(
      productsData.map((item) => item.id),
    );
    expect(getLocalizedData(companyStats, "vi").foundedYear).toBe(
      companyStats.foundedYear,
    );
    for (const locale of ["es", "fr", "ar", "vi"] as const) {
      const t = getTranslator(locale);
      expect(t("A/B/C")).toBe("A/B/C");
      expect(t("Michael Kors")).toBe("Michael Kors");
      expect(t("100 bales (4,500 kg)")).toContain("100");
    }
  });
  it("ships only the form/header copy to client components", () => {
    const messages = getClientMessages("ar", "form");
    expect(Object.keys(messages).length).toBeLessThan(60);
    expect(messages["Your Email *"]).toBeTruthy();
    expect(
      messages[
        "Inquiry received. Our sales team aims to reply within 12 hours."
      ],
    ).toBeTruthy();
    expect(messages["1. Acceptance of Terms"]).toBeUndefined();
    expect(getClientMessages("en", "form")).toEqual({});
  });
});

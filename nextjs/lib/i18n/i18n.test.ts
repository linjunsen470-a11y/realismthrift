import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { QualityStandards } from "@/components/product/QualityStandards";
import { TranslatedText } from "@/components/TranslatedText";
import PrivacyPolicyPage from "@/components/pages/privacy-policy";
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
import {
  companyAddress,
  companyLocation,
  companyPostalAddress,
  companyStats,
  productsData,
  siteHeader,
  siteFooter,
} from "@/data/siteData";

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
  it("preserves brand and service identifiers in every translation, including SEO copy", () => {
    const identifiers = [
      "RealismThrift",
      "Coach",
      "MK",
      "Michael Kors",
      "Kate Spade",
      "Champion",
      "Mango",
      "North Face",
      "Under Armour",
      "Gap",
      "Nike",
      "Herschel",
      "JanSport",
      "NF",
      "Western Union",
      "Samsonite",
      "Tumi",
      "Vera Bradley",
      "Calvin Klein",
      "DKNY",
      "Longchamp",
      "Tory Burch",
      "Ukay",
    ];
    for (const messages of [es, fr, ar, vi]) {
      for (const [key, value] of Object.entries(messages)) {
        for (const name of identifiers) {
          const pattern = new RegExp(`\\b${name}\\b`, "i");
          if (pattern.test(key)) expect(value, key).toMatch(pattern);
        }
      }
      expect(messages.Leo).toBe("Leo");
      expect(messages["FOB Guangzhou"]).toBe("FOB Guangzhou");
    }
    expect(sourceKeys).not.toContain("sales@realismthrift.com");
    expect(sourceKeys).not.toContain("privacy@realismthrift.com");
  });
  it("renders complete translated sentences with safe emphasis and unchanged privacy identifiers", () => {
    const text = "Our sales team aims to reply within {time}.";
    const markup = renderToStaticMarkup(
      createElement(TranslatedText, {
        locale: "ar",
        text,
        values: { time: createElement("strong", null, "12 ساعة") },
      }),
    );
    expect(markup).toContain("خلال <strong>12 ساعة</strong>");
    const escaped = renderToStaticMarkup(
      createElement(TranslatedText, {
        locale: "en",
        text: "{value}",
        values: { value: "<script>alert(1)</script>" },
      }),
    );
    expect(escaped).not.toContain("<script>");
    for (const locale of locales) {
      const policy = renderToStaticMarkup(PrivacyPolicyPage({ locale }));
      expect(policy).toContain(
        'href="mailto:privacy@realismthrift.com">privacy@realismthrift.com</a>',
      );
      expect(
        policy.match(/<code dir="ltr">_(?:fbp|fbc)<\/code>/g),
      ).toHaveLength(4);
      expect(policy).toContain("Lead");
      expect(policy).toContain("SHA-256");
      expect(policy).not.toMatch(
        /\{(?:browserId|clickId|clickCookie|browserCookie|policy|email)\}/,
      );
    }
  });
  it("uses the owner-confirmed address in every language while retaining canonical postal and navigation facts", () => {
    expect(companyAddress).toBe(
      "RealismThrift (Baisha Alley Weilitang), County Road 193, Yuanzhou Town, Boluo County, Huizhou City, Guangdong Province, China",
    );
    expect(companyLocation.addressChinese).toBe(
      "广东惠州博罗县园洲镇193县道RealismThrift（白沙巷尾礼堂）",
    );
    expect(companyLocation.didiAddress).toBe(
      "Baisha Elementary School 193xiandao, Yuanzhou Town, Boluo County, Huizhou City, Guangdong Province, China",
    );
    expect(companyPostalAddress.addressCountry).toBe("CN");
    expect(companyPostalAddress.mapsQuery).toBe(companyAddress);
    expect(companyLocation.mapsUrl).toContain(
      "mid=1tQMcpDr1wCiqu03ci3gFUnP7RlUudME",
    );
    for (const locale of ["es", "fr", "ar", "vi"] as const) {
      const t = getTranslator(locale);
      const display = getLocalizedData(siteFooter, locale).brand;
      expect(display.address).toBe(t(companyAddress));
      expect(display.address).not.toBe(companyAddress);
      for (const landmark of [
        "RealismThrift",
        "Baisha",
        "193",
        "Yuanzhou",
        "Boluo",
        "Huizhou",
        "Guangdong",
      ])
        expect(display.address).toContain(landmark);
      expect(t(companyLocation.didiAddress)).not.toBe(
        companyLocation.didiAddress,
      );
      expect(t(companyLocation.didiAddress)).toContain("193");
      expect(display.email).toBe(siteFooter.brand.email);
      expect(display.phone).toBe(siteFooter.brand.phone);
    }
  });
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

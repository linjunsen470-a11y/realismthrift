import { describe, expect, it } from "vitest";
import { browserLanguage, countryLanguage, preferredLanguage } from "./detection";

describe("browser language negotiation", () => {
  it("uses the highest supported weight and header order for ties", () => {
    expect(browserLanguage("zh-CN, es-MX;q=0.8, fr-FR;q=0.9, en;q=0.7")).toBe("fr");
    expect(browserLanguage("id-ID, fr;q=1, en;q=0.9")).toBe("id");
    expect(browserLanguage("zh-CN, zh;q=0.9, en;q=0.8")).toBe("en");
  });

  it("ignores unsupported, excluded, wildcard and malformed ranges", () => {
    expect(browserLanguage("fr;q=0, es;q=0.4, *;q=1")).toBe("es");
    expect(browserLanguage("fr;q=2, es;q=oops, ar;q=0.7")).toBe("ar");
    expect(browserLanguage("zh-CN, *;q=0.8, en;q=0")).toBeUndefined();
    expect(browserLanguage(null)).toBeUndefined();
  });
});

describe("visitor language selection", () => {
  it("uses country data and the selected French business-market overrides", () => {
    for (const country of ["SN", "ML", "NE", "CF", "MG", "BI", "FR", "CI", "CD"])
      expect(countryLanguage(country), country).toBe("fr");
    expect(countryLanguage("vn")).toBe("vi");
    expect(countryLanguage("ID")).toBe("id");
    expect(countryLanguage("MX")).toBe("es");
    expect(countryLanguage("EG")).toBe("ar");
    expect(countryLanguage("CN")).toBeUndefined();
    expect(countryLanguage("XX")).toBeUndefined();
    expect(countryLanguage("not-a-country")).toBeUndefined();
  });

  it("puts an explicit supported preference before browser language, country and English", () => {
    expect(preferredLanguage({ preference: "en", acceptLanguage: "fr", country: "ID" })).toBe("en");
    expect(preferredLanguage({ preference: "invalid", acceptLanguage: "es-MX", country: "ID" })).toBe("es");
    expect(preferredLanguage({ acceptLanguage: "zh", country: "ID" })).toBe("id");
    expect(preferredLanguage({ acceptLanguage: null, country: "CN" })).toBe("en");
  });
});

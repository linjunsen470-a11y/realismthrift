import { describe, expect, it } from "vitest";
import { metaLeadParams, metaPixelBaseCode, metaPixelNoscriptSrc, PRODUCTION_FB_PIXEL_ID, resolveFacebookPixelId } from "./meta-pixel";

describe("resolveFacebookPixelId", () => {
  it("uses the production pixel when the environment value is missing", () => {
    expect(resolveFacebookPixelId(undefined)).toBe(PRODUCTION_FB_PIXEL_ID);
    expect(resolveFacebookPixelId(null)).toBe(PRODUCTION_FB_PIXEL_ID);
    expect(resolveFacebookPixelId("  ")).toBe(PRODUCTION_FB_PIXEL_ID);
  });

  it("accepts an override that is only digits", () => {
    expect(resolveFacebookPixelId(" 123456789012345 ")).toBe("123456789012345");
  });

  it("rejects values that could break the snippet", () => {
    expect(resolveFacebookPixelId(`${PRODUCTION_FB_PIXEL_ID};alert(1)`)).toBe("");
    expect(resolveFacebookPixelId("G-TEST000001")).toBe("");
    expect(resolveFacebookPixelId("12345")).toBe("");
  });
});

describe("metaPixelBaseCode", () => {
  it("emits the official base code for the production pixel", () => {
    const code = metaPixelBaseCode(PRODUCTION_FB_PIXEL_ID);
    expect(code).toContain("https://connect.facebook.net/en_US/fbevents.js");
    expect(code).toContain(`fbq('init', '${PRODUCTION_FB_PIXEL_ID}')`);
    expect(code).toContain("fbq('track', 'PageView')");
    expect(code).toContain(`fbq('set', 'autoConfig', false, '${PRODUCTION_FB_PIXEL_ID}')`);
    expect(code.indexOf("fbq('init'")).toBeLessThan(code.indexOf("fbq('track', 'PageView')"));
    expect(code).toContain("n.disablePushState=!0");
  });

  it("refuses to build a snippet for an id that is not only digits", () => {
    expect(metaPixelBaseCode("")).toBe("");
    expect(metaPixelBaseCode(`${PRODUCTION_FB_PIXEL_ID};alert(1)`)).toBe("");
  });
});

describe("metaPixelNoscriptSrc", () => {
  it("points the image fallback at the same pixel and PageView", () => {
    expect(metaPixelNoscriptSrc(PRODUCTION_FB_PIXEL_ID)).toBe(
      `https://www.facebook.com/tr?id=${PRODUCTION_FB_PIXEL_ID}&ev=PageView&noscript=1`,
    );
  });
});

describe("metaLeadParams", () => {
  it("keeps an allowlisted product category and a fixed content name", () => {
    expect(metaLeadParams("Used Brand Shoes")).toEqual({
      content_name: "wholesale_inquiry",
      content_category: "Used Brand Shoes",
    });
  });

  it("drops free text instead of forwarding it", () => {
    expect(metaLeadParams("buyer@example.com +86 133 0000 0000")).toEqual({
      content_name: "wholesale_inquiry",
      content_category: "not_specified",
    });
    expect(metaLeadParams(undefined)).toEqual({
      content_name: "wholesale_inquiry",
      content_category: "not_specified",
    });
    expect(metaLeadParams("")).toEqual({
      content_name: "wholesale_inquiry",
      content_category: "not_specified",
    });
  });
});

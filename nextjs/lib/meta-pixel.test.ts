import { describe, expect, it } from "vitest";
import { runInNewContext } from "node:vm";
import { isMetaEventId, isMetaMeasurementEnabled, metaLeadEventOptions, metaLeadParams, metaPixelBaseCode, metaPixelNoscriptSrc, PRODUCTION_FB_PIXEL_ID, resolveFacebookPixelId } from "./meta-pixel";

describe("Meta environment isolation", () => {
  it("requires production and obeys the existing analytics switch", () => {
    expect(isMetaMeasurementEnabled(undefined, "production")).toBe(true);
    expect(isMetaMeasurementEnabled("true", "production")).toBe(true);
    expect(isMetaMeasurementEnabled("false", "production")).toBe(false);
    for (const env of [undefined, "preview", "development"]) {
      expect(isMetaMeasurementEnabled("true", env)).toBe(false);
    }
  });
});

describe("resolveFacebookPixelId", () => {
  it("uses the current production pixel when the environment value is missing", () => {
    expect(PRODUCTION_FB_PIXEL_ID).toBe("1661409812003549");
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

describe("landing fbclid capture", () => {
  function capture(search: string, cookie = "", now = 1_700_000_000_000, blocked = false) {
    const writes: string[] = [];
    const document = {
      get cookie() { if (blocked) throw new Error("cookies blocked"); return cookie; },
      set cookie(value: string) { if (blocked) throw new Error("cookies blocked"); writes.push(value); cookie = value.split(";")[0]; },
    };
    const calls: unknown[][] = [];
    const fbq = (...args: unknown[]) => calls.push(args);
    const window: { fbq: typeof fbq; __rtMetaFbc?: string; __rtCaptureMetaClick?: () => string | undefined } = { fbq };
    const location = { search, protocol: "https:", pathname: "/" };
    // fbq is present but no external SDK is loaded; execute the actual rendered head script.
    runInNewContext(metaPixelBaseCode(PRODUCTION_FB_PIXEL_ID), {
      document, window, fbq, URLSearchParams, Date: { now: () => now }, location,
    });
    return { writes, calls, window, recapture(nextSearch: string, nextCookie = cookie) {
      location.search = nextSearch;
      cookie = nextCookie;
      now += 1_000;
      return window.__rtCaptureMetaClick?.();
    } };
  }
  it("saves a real landing click for cross-page use before the SDK loads", () => {
    expect(capture("?fbclid=Real_Ad-Click").writes).toEqual([
      "_fbc=fb.1.1700000000000.Real_Ad-Click; Path=/; Max-Age=7776000; SameSite=Lax; Secure",
    ]);
  });
  it("keeps the original capture time for the same click, including an SDK appendix", () => {
    expect(capture("?fbclid=Real_Ad-Click", "_fbc=fb.1.1690000000000.Real_Ad-Click").writes).toEqual([]);
    expect(capture("?fbclid=Real_Ad-Click", "_fbc=fb.1.1690000000000.Real_Ad-Click.SDK").writes).toEqual([]);
  });
  it("updates the identifier and time only on a new advertising click", () => {
    expect(capture("?fbclid=NewClick", "_fbc=fb.1.1690000000000.OldClick").writes[0]).toContain("fb.1.1700000000000.NewClick;");
  });
  it("does not invent identifiers for ordinary visits or accept cookie injection", () => {
    for (const query of ["", "?utm_source=facebook", "?fbclid=", "?fbclid=bad%3BPath%3D%2F", "?fbclid=" + "x".repeat(1001)]) {
      expect(capture(query, "_fbc=fb.1.1690000000000.Previous").writes).toEqual([]);
    }
  });
  it("cookie restrictions do not prevent Pixel initialization", () => {
    const result = capture("?fbclid=RealClick", "", undefined, true);
    expect(result.writes).toEqual([]);
    expect(result.calls).toContainEqual(["track", "PageView"]);
    expect(result.window.__rtMetaFbc).toBe("fb.1.1700000000000.RealClick");
    expect(result.recapture("/contact-us")).toBe("fb.1.1700000000000.RealClick");
  });
  it("captures a new SPA query and retains the first timestamp on repeated reads", () => {
    const result = capture("");
    expect(result.recapture("?fbclid=SpaClick")).toBe("fb.1.1700000001000.SpaClick");
    expect(result.recapture("?fbclid=SpaClick")).toBe("fb.1.1700000001000.SpaClick");
    expect(result.recapture("")).toBe("fb.1.1700000001000.SpaClick");
  });
  it("selects the newest duplicate cookie in either order and preserves the SDK suffix", () => {
    const older = "_fbc=fb.1.1680000000000.OldClick";
    const newer = "_fbc=fb.1.1690000000000.NewClick.SDK";
    for (const cookie of [`${older}; ${newer}`, `${newer}; ${older}`]) {
      const result = capture("?fbclid=NewClick", cookie);
      expect(result.window.__rtMetaFbc).toBe("fb.1.1690000000000.NewClick.SDK");
      expect(result.writes).toEqual([]);
    }
  });
  it("does not turn an unchanged landing URL into a new click when another tab updates the cookie", () => {
    const result = capture("?fbclid=FirstClick");
    expect(result.recapture("?fbclid=FirstClick", "_fbc=fb.1.1700000000500.OtherTabClick"))
      .toBe("fb.1.1700000000500.OtherTabClick");
  });
  it("ignores future cookies and never truncates an invalid click into a valid one", () => {
    expect(capture("", "_fbc=fb.1.9999999999999.Future").window.__rtMetaFbc).toBeUndefined();
    expect(capture("?fbclid=" + "x".repeat(1001)).window.__rtMetaFbc).toBeUndefined();
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

describe("metaLeadEventOptions", () => {
  it("uses Meta's browser eventID key for a UUID", () => {
    expect(isMetaEventId(crypto.randomUUID())).toBe(true);
    expect(metaLeadEventOptions("6f1e2c3a-4b5d-4e6f-8a7b-9c0d1e2f3a4b")).toEqual({
      eventID: "6f1e2c3a-4b5d-4e6f-8a7b-9c0d1e2f3a4b",
    });
  });

  it("omits options when the server did not return an event id", () => {
    expect(metaLeadEventOptions(undefined)).toBeUndefined();
    expect(metaLeadEventOptions(null)).toBeUndefined();
    expect(metaLeadEventOptions("")).toBeUndefined();
    expect(metaLeadEventOptions("6f1e2c3a-4b5d-4e6f-8a7b-9c0d1e2f3a4b;alert(1)")).toBeUndefined();
  });
});

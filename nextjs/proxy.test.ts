import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "./proxy";
import { LANGUAGE_PREFERENCE_COOKIE, LANGUAGE_SESSION_COOKIE } from "@/lib/i18n/preference";

const browserHeaders = {
  "sec-fetch-mode": "navigate",
  "sec-fetch-dest": "document",
  "sec-fetch-site": "none",
};

function request(path: string, headers: Record<string, string> = {}, method = "GET") {
  return new NextRequest(`https://www.realismthrift.com${path}`, {
    method,
    headers: { ...browserHeaders, ...headers },
  });
}

afterEach(() => vi.unstubAllEnvs());

describe("language entry proxy", () => {
  it("redirects one new session with its original path and query without sharing the result", () => {
    const response = proxy(request("/used-brand-shoes?utm_source=ads&fbclid=real-click", {
      "accept-language": "fr-FR,fr;q=0.9,en;q=0.8",
      "x-vercel-ip-country": "ID",
    }));
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("https://www.realismthrift.com/fr/used-brand-shoes?utm_source=ads&fbclid=real-click");
    expect(response.headers.get("cache-control")).toContain("private, no-store");
    expect(response.headers.get("cdn-cache-control")).toBe("no-store");
    expect(response.cookies.get(LANGUAGE_SESSION_COOKIE)).toMatchObject({
      value: "1", httpOnly: true, secure: true, sameSite: "lax", path: "/",
    });
  });

  it("uses an explicit saved choice and never shares the English first response", () => {
    const response = proxy(request("/faq", {
      cookie: `${LANGUAGE_PREFERENCE_COOKIE}=en`,
      "accept-language": "fr",
    }));
    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(response.cookies.get(LANGUAGE_SESSION_COOKIE)?.value).toBe("1");
  });

  it("honors translated URLs and existing sessions, including a manual switch to English", () => {
    const explicit = proxy(request("/es/faq", { "accept-language": "fr" }));
    expect(explicit.status).toBe(200);
    expect(explicit.headers.get("location")).toBeNull();
    expect(explicit.cookies.get(LANGUAGE_SESSION_COOKIE)?.value).toBe("1");
    const existing = proxy(request("/faq", {
      cookie: `${LANGUAGE_SESSION_COOKIE}=1; ${LANGUAGE_PREFERENCE_COOKIE}=fr`,
      "accept-language": "fr",
    }));
    expect(existing.headers.get("location")).toBeNull();
    expect(existing.cookies.get(LANGUAGE_SESSION_COOKIE)).toBeUndefined();
    const blockedCookies = proxy(request("/faq", {
      "sec-fetch-site": "same-origin", "accept-language": "fr",
    }));
    expect(blockedCookies.headers.get("location")).toBeNull();
  });

  it("leaves English-only entry pages in English and marks the session", () => {
    for (const path of ["/blog", "/search?q=shoes"]) {
      const response = proxy(request(path, { "accept-language": "fr" }));
      expect(response.headers.get("location")).toBeNull();
      expect(response.cookies.get(LANGUAGE_SESSION_COOKIE)?.value).toBe("1");
    }
  });

  it("does not negotiate crawlers, prefetches, other methods or unknown paths", () => {
    const crawler = proxy(new NextRequest("https://www.realismthrift.com/faq", {
      headers: { "user-agent": "Googlebot", "x-vercel-ip-country": "FR" },
    }));
    for (const response of [
      crawler,
      proxy(request("/faq", { purpose: "prefetch", "accept-language": "fr" })),
      proxy(request("/faq", { "sec-fetch-mode": "cors", "accept-language": "fr" })),
      proxy(request("/faq", { "accept-language": "fr" }, "HEAD")),
      proxy(request("/fr/does-not-exist", { "accept-language": "fr" })),
      proxy(request("/api/send", { "accept-language": "fr" })),
    ]) {
      expect(response.status).toBe(200);
      expect(response.headers.get("location")).toBeNull();
      expect(response.cookies.get(LANGUAGE_SESSION_COOKIE)).toBeUndefined();
    }
  });

  it("allows automatic selection to be disabled", () => {
    vi.stubEnv("AUTO_LOCALE_DETECTION_ENABLED", "false");
    const response = proxy(request("/faq", { "accept-language": "fr" }));
    expect(response.headers.get("location")).toBeNull();
    expect(response.cookies.get(LANGUAGE_SESSION_COOKIE)).toBeUndefined();
  });
});

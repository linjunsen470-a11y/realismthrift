import { expect, test } from "@playwright/test";
import { LANGUAGE_PREFERENCE_COOKIE, LANGUAGE_SESSION_COOKIE } from "../lib/i18n/preference";

test.beforeEach(async ({ page }) => {
  await page.route("https://www.google.com/maps/**", (route) =>
    route.fulfill({ contentType: "text/html", body: "<p>Map preview</p>" }),
  );
  await page.route("https://www.googletagmanager.com/**", (route) =>
    route.fulfill({ contentType: "application/javascript", body: "" }),
  );
  await page.route(/https:\/\/[^/]*google-analytics\.com\//, (route) =>
    route.fulfill({ status: 204 }),
  );
  await page.route("https://connect.facebook.net/**", (route) =>
    route.fulfill({ contentType: "application/javascript", body: "" }),
  );
  await page.route(/https:\/\/www\.facebook\.com\/tr\/?/, (route) =>
    route.fulfill({ status: 204, body: "" }),
  );
});

test.describe("French browser entry", () => {
  test.use({ locale: "fr-FR" });

  test("redirects once while preserving the campaign, anchor and one landing page view", async ({ page }) => {
    await page.context().setExtraHTTPHeaders({ "x-vercel-ip-country": "ID" });
    const redirects: { status: number; cache: string | undefined }[] = [];
    page.on("response", (response) => {
      if (response.request().isNavigationRequest() && response.status() === 307)
        redirects.push({ status: response.status(), cache: response.headers()["cache-control"] });
    });
    const query = "utm_source=facebook&utm_medium=paid_social&utm_campaign=locale-test&fbclid=real-test-click";
    await page.goto(`/used-brand-shoes?${query}#inquiry`);
    await expect(page).toHaveURL(`/fr/used-brand-shoes?${query}#inquiry`);
    await expect(page.locator("html")).toHaveAttribute("lang", "fr");
    expect(redirects).toEqual([{ status: 307, cache: expect.stringContaining("no-store") }]);
    await page.waitForFunction(() =>
      (window.dataLayer ?? []).some((command) => Array.from(command as ArrayLike<unknown>)[1] === "page_view"),
    );
    const views = await page.evaluate(() =>
      (window.dataLayer ?? [])
        .map((command) => Array.from(command as ArrayLike<unknown>))
        .filter((command) => command[1] === "page_view"),
    );
    expect(views).toHaveLength(1);
    expect(views[0][2]).toMatchObject({ page_path: "/fr/used-brand-shoes" });
    expect(JSON.stringify(views)).not.toContain("fbclid");
    expect((await page.context().cookies()).find((cookie) => cookie.name === "_fbc")?.value)
      .toMatch(/^fb\.1\.\d+\.real-test-click$/);
    expect(await page.evaluate(() =>
      (window.fbq?.queue ?? []).filter((command) => Array.from(command as ArrayLike<unknown>)[1] === "PageView").length,
    )).toBe(1);
  });

  test("persists manual Spanish and English choices across new sessions", async ({ page }) => {
    await page.goto("/faq");
    await expect(page).toHaveURL("/fr/faq");
    await page.locator(".rt-language-switcher summary").click();
    await page.locator('.rt-language-switcher a[hreflang="es"]').click();
    await expect(page).toHaveURL("/es/faq");
    const preference = (await page.context().cookies()).find((cookie) => cookie.name === LANGUAGE_PREFERENCE_COOKIE);
    expect(preference?.value).toBe("es");
    expect(preference?.expires).toBeGreaterThan(Date.now() / 1000 + 360 * 24 * 60 * 60);

    await page.context().clearCookies({ name: LANGUAGE_SESSION_COOKIE });
    await page.goto("/faq");
    await expect(page).toHaveURL("/es/faq");
    await page.locator(".rt-language-switcher summary").click();
    await page.locator('.rt-language-switcher a[hreflang="en"]').click();
    await expect(page).toHaveURL("/faq");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");

    await page.context().clearCookies({ name: LANGUAGE_SESSION_COOKIE });
    await page.goto("/faq");
    await expect(page).toHaveURL("/faq");
    expect((await page.context().cookies()).find((cookie) => cookie.name === LANGUAGE_PREFERENCE_COOKIE)?.value).toBe("en");
  });

  test("respects explicit translated links and keeps an English blog entry in English", async ({ page }) => {
    await page.goto("/es/faq");
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    await page.context().clearCookies();
    const response = await page.goto("/blog");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    expect(response?.headers()["cache-control"]).toContain("no-store");
    expect((await page.context().cookies()).find((cookie) => cookie.name === LANGUAGE_SESSION_COOKIE)?.value).toBe("1");
    await page.locator('footer a[href="/used-brand-shoes"]').first().click();
    await expect(page).toHaveURL("/used-brand-shoes");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test("a visitor can switch to English when cookies are refused", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(Document.prototype, "cookie", { configurable: true, get: () => "", set: () => {} });
    });
    await page.goto("/faq");
    await expect(page).toHaveURL("/fr/faq");
    // Model a browser discarding the server's session cookie as well as refusing
    // the preference cookie written by the language menu.
    await page.context().clearCookies();
    await page.locator(".rt-language-switcher summary").click();
    await page.locator('.rt-language-switcher a[hreflang="en"]').click();
    await expect(page).toHaveURL("/faq");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });
});

test.describe("country fallback", () => {
  test.use({
    locale: "zh-CN",
    extraHTTPHeaders: { "accept-language": "zh-CN,zh;q=0.9", "x-vercel-ip-country": "SN" },
  });

  test("uses the French business-market override when no browser language is supported", async ({ page }) => {
    await page.goto("/contact-us");
    await expect(page).toHaveURL("/fr/contact-us");
    await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  });
});

test.describe("without JavaScript", () => {
  test.use({ locale: "fr-FR", javaScriptEnabled: false });

  test("automatically selects a language and leaves manual links usable", async ({ page }) => {
    await page.goto("/faq");
    await expect(page).toHaveURL("/fr/faq");
    await page.locator(".rt-language-switcher summary").click();
    await page.locator('.rt-language-switcher a[hreflang="en"]').click();
    await expect(page).toHaveURL("/faq");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });
});

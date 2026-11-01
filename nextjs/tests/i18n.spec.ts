import { expect, test } from "@playwright/test";
import { locales, localizedPaths, localePath } from "../lib/i18n/routing";
import { companyAddress, companyLocation } from "../data/siteData";
import { getTranslator } from "../lib/i18n/server";

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

test("all 50 core URLs have translated server HTML and reciprocal SEO", async ({
  request,
}) => {
  test.setTimeout(180_000);
  await Promise.all(
    locales.flatMap((locale) =>
      localizedPaths.map(async (path) => {
        const url = localePath(path, locale);
        const response = await request.get(url, {
          headers: { "User-Agent": "Googlebot" },
        });
        expect(response.status(), url).toBe(200);
        const html = await response.text();
        expect(html, url).toContain(`lang="${locale}"`);
        expect(html, url).toContain(`dir="${locale === "ar" ? "rtl" : "ltr"}"`);
        expect(html, url).not.toContain('content="noindex');
        expect(html, url).toMatch(/<h1\b/);
        const canonical = html.match(
          /<link rel="canonical" href="([^"]+)"/u,
        )?.[1];
        expect(canonical?.replace(/\/$/, ""), url).toBe(
          `https://www.realismthrift.com${url === "/" ? "" : url}`,
        );
        for (const language of [...locales, "x-default"])
          expect(html, url).toContain(`hrefLang="${language}"`);
        expect(html, url).toMatch(/<meta name="description" content="[^"]+"/u);
        expect(html, url).not.toMatch(/ZXQ\d+QXZ|\{v\d+\}/u);
        if (locale !== "en") {
          expect(html, url).not.toMatch(
            /(?:alt|aria-label)="(?:Inquire about|RealismThrift Wholesale )/u,
          );
        }
      }),
    ),
  );
});

test("language menu closes outside and drops page-specific anchors on homepage fallback", async ({
  page,
}) => {
  await page.goto(
    "/blog?utm_source=language-test&fbclid=test-click#article-section",
  );
  await page.waitForFunction(() => typeof window.gtag === "function");
  const menu = page.locator(".rt-language-switcher");
  await menu.locator("summary").click();
  await expect(menu).toHaveAttribute("open", "");
  await page.locator("main h1").click();
  await expect(menu).not.toHaveAttribute("open");
  await menu.locator("summary").click();
  await page.keyboard.press("Escape");
  await expect(menu).not.toHaveAttribute("open");
  await menu.locator("summary").click();
  await menu.getByRole("link", { name: "Français" }).click();
  await expect(page).toHaveURL(
    /\/fr\?utm_source=language-test&fbclid=test-click$/,
  );
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
});

test("language menu retains product path and updates document direction", async ({
  page,
  isMobile,
}) => {
  await page.goto("/es/used-brand-shoes?campaign=test#inquiry");
  const menu = page.locator(".rt-language-switcher");
  await menu.locator("summary").click();
  await expect(menu.getByRole("link")).toHaveCount(5);
  await menu.getByRole("link", { name: "العربية" }).click();
  await expect(page).toHaveURL(
    /\/ar\/used-brand-shoes\?campaign=test#inquiry$/,
  );
  await expect(page.locator("html")).toHaveAttribute("lang", "ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  if (isMobile)
    await page.getByRole("button", { name: "تبديل التنقل" }).click();
  await expect(
    page.locator('.rt-nav-list a[aria-current="page"]'),
  ).toHaveAttribute("href", "/ar/used-brand-shoes");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth + 1,
    ),
  ).toBe(true);
});

for (const locale of ["es", "fr", "ar", "vi"] as const) {
  test(`${locale} form keeps backend values and one deduplicated lead`, async ({
    page,
  }) => {
    const eventId = "6f1e2c3a-4b5d-4e6f-8a7b-9c0d1e2f3a4b";
    let requests = 0;
    await page.route("**/api/send", async (route) => {
      requests++;
      const data = route.request().postDataJSON();
      expect(data.product).toBe("Used Brand Clothes");
      expect(data.quantity).toBe("20ft");
      expect(data.sourcePath).toBe(`/${locale}/contact-us`);
      expect(data.submissionId).toMatch(/^[0-9a-f-]{36}$/i);
      await route.fulfill({
        json: {
          ok: true,
          event_id: eventId,
          message:
            "Inquiry received. Our sales team aims to reply within 12 hours.",
        },
      });
    });
    await page.goto(`/${locale}/contact-us`);
    await page.waitForFunction(() => typeof window.gtag === "function");
    const form = page.locator(".rt-inquiry-form").first();
    await form.locator('[name="name"]').fill("Test Buyer");
    await form.locator('[name="email"]').fill("buyer@example.com");
    await form.locator('[name="whatsapp"]').fill("+234 803 123 4567");
    await form.locator('[name="country"]').fill("Nigeria");
    await form.locator('[name="product"]').selectOption("Used Brand Clothes");
    await form.locator('[name="quantity"]').selectOption("20ft");
    await expect(form.locator('a[href$="/privacy-policy"]')).toHaveAttribute(
      "href",
      `/${locale}/privacy-policy`,
    );
    await form.locator('button[type="submit"]').click();
    await expect(page.locator(".rt-form-state-success")).toBeVisible();
    await expect(page.locator(".rt-form-state-success")).not.toContainText(
      "Inquiry received.",
    );
    expect(requests).toBe(1);
    const commands = await page.evaluate(() =>
      (window.dataLayer ?? []).map((command) =>
        Array.from(command as ArrayLike<unknown>),
      ),
    );
    const leads = commands.filter(
      (command) => command[0] === "event" && command[1] === "generate_lead",
    );
    expect(leads).toHaveLength(1);
    expect(leads[0][2]).toMatchObject({
      product_interest: "Used Brand Clothes",
      quantity: "20ft",
      page_path: `/${locale}/contact-us`,
    });
    expect(JSON.stringify(leads)).not.toContain("buyer@example.com");
    expect(JSON.stringify(leads)).not.toContain("Nigeria");
    const pixelCommands = await page.evaluate(() =>
      (window.fbq?.queue ?? []).map((command) =>
        Array.from(command as ArrayLike<unknown>),
      ),
    );
    const pixelLeads = pixelCommands.filter(
      (command) => command[0] === "track" && command[1] === "Lead",
    );
    expect(pixelLeads).toHaveLength(1);
    expect(pixelLeads[0][3]).toEqual({ eventID: eventId });
  });
}

test("English-only pages stay English and unpublished translations return 404", async ({
  request,
  page,
}) => {
  for (const path of [
    "/es/blog",
    "/fr/blog/not-a-translation",
    "/ar/oauth/consent",
    "/vi/email-preferences",
    "/de/faq",
    "/en/faq",
  ]) {
    expect((await request.get(path)).status(), path).toBe(404);
  }
  await page.goto("/blog");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  const menu = page.locator(".rt-language-switcher");
  await menu.locator("summary").click();
  await expect(menu.getByRole("link", { name: "Français" })).toHaveAttribute(
    "href",
    "/fr",
  );
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain(
    "https://www.realismthrift.com/ar/used-brand-clothes",
  );
  expect(sitemap).toContain('hreflang="x-default"');
  expect(sitemap).not.toMatch(/\/(es|fr|ar|vi)\/blog/);
});

test("translated navigation and content fit a 320px screen", async ({
  page,
}) => {
  test.setTimeout(180_000);
  await page.setViewportSize({ width: 320, height: 800 });
  for (const locale of ["es", "fr", "ar", "vi"] as const) {
    for (const path of [
      "/",
      "/used-brand-clothes",
      "/contact-us",
      "/privacy-policy",
    ]) {
      await page.goto(localePath(path, locale), {
        waitUntil: "domcontentloaded",
      });
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
        `${locale}${path}`,
      ).toBeLessThanOrEqual(321);
    }
  }
});

test("confirmed factory and DiDi addresses are localized and retain copyable English and Chinese navigation text", async ({
  page,
}) => {
  test.setTimeout(120_000);
  for (const locale of locales) {
    const t = getTranslator(locale);
    await page.goto(localePath("/contact-us", locale), {
      waitUntil: "domcontentloaded",
    });
    await expect(
      page
        .locator("p.rt-postal-address")
        .filter({ hasText: t(companyAddress) }),
    ).toHaveAttribute("lang", locale);
    await expect(
      page
        .locator("p.rt-postal-address")
        .filter({ hasText: t(companyLocation.didiAddress) }),
    ).toHaveAttribute("dir", locale === "ar" ? "rtl" : "ltr");
    await expect(
      page
        .locator('.rt-postal-address[lang="en"][dir="ltr"]')
        .filter({ hasText: companyAddress })
        .first(),
    ).toBeVisible();
    await expect(
      page
        .locator('.rt-postal-address[lang="zh-CN"][dir="ltr"]')
        .filter({ hasText: companyLocation.addressChinese }),
    ).toBeVisible();
    await expect(page.locator("iframe")).toHaveAttribute(
      "src",
      companyLocation.mapsEmbedUrl,
    );
    await expect(page.locator("footer")).toContainText(t(companyAddress));
    await expect(page.locator("main")).not.toContainText(/Fengyi|凤仪|凤怡/);
    await page.goto(localePath("/", locale), { waitUntil: "domcontentloaded" });
    await expect(page.locator("#contact")).toContainText(t(companyAddress));
  }
});

test("translated pages keep email labels and inline privacy identifiers intact", async ({
  page,
}) => {
  test.setTimeout(120_000);
  for (const locale of locales) {
    await page.goto(localePath("/", locale), { waitUntil: "domcontentloaded" });
    const emails = page.locator('a[href="mailto:sales@realismthrift.com"]');
    await expect(emails.first()).toBeVisible();
    for (const email of await emails.all()) {
      if ((await email.textContent())?.includes("@"))
        await expect(email).toHaveText("sales@realismthrift.com");
    }
    await expect(page.locator("body")).not.toContainText("realismothrift.com");
    await page.goto(localePath("/privacy-policy", locale), {
      waitUntil: "domcontentloaded",
    });
    await expect(
      page.locator('a[href="mailto:privacy@realismthrift.com"]'),
    ).toHaveText("privacy@realismthrift.com");
    await expect(page.locator("main code")).toHaveText([
      "_fbp",
      "_fbc",
      "_fbc",
      "_fbp",
    ]);
    for (const code of await page.locator("main code").all())
      await expect(code).toHaveAttribute("dir", "ltr");
    await expect(page.locator("main")).not.toContainText(
      /\{(?:browserId|clickId|clickCookie|browserCookie|policy|email)\}/,
    );
  }
});

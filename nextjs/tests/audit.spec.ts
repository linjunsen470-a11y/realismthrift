import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // No test inquiry may reach the live email/storage services.
  await page.route("**/api/send", route => route.fulfill({ status: 503, json: { ok: false, message: "Please try again." } }));
});

test("homepage has no cookie consent prompt or settings entry", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".rt-consent")).toHaveCount(0);
  await expect(page.getByText("Cookie Settings", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Privacy choices", { exact: true })).toHaveCount(0);
});

test("mobile navigation exposes search and closes with Escape", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Mobile navigation");
  await page.goto("/used-brand-clothes");
  const toggle = page.getByRole("button", { name: "Toggle navigation" });
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  const search = page.getByRole("link", { name: "Search the Site" });
  await search.focus();
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
  await expect(search).toBeHidden();
  await toggle.click();
  await search.click();
  await expect(page).toHaveURL(/\/search$/);
  await expect(page.getByLabel("Search the site", { exact: true })).toBeVisible();
});

test("search handles repeated query parameters and can be refined", async ({ page }) => {
  const response = await page.goto("/search?q=shoes&q=bags");
  expect(response?.status()).toBe(200);
  const input = page.getByLabel("Search the site", { exact: true });
  await expect(input).toHaveValue("shoes");
  await input.fill("bags");
  await page.locator(".rt-page-search-form").getByRole("button", { name: "Search", exact: true }).click();
  await expect(page).toHaveURL(/q=bags/);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});

test("category and help pages carry their own social previews", async ({ page }) => {
  for (const route of ["/used-brand-shoes", "/faq", "/contact-us"]) {
    await page.goto(route);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://www.realismthrift.com${route}`);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", `https://www.realismthrift.com${route}`);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /^https:\/\//);
    await expect(page.locator('meta[name="twitter:title"]')).not.toHaveAttribute("content", /Dongguan Huihe/);
    const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(schemas.join(" ")).not.toContain("AggregateOffer");
  }
});

test("footer WhatsApp links use international digits only", async ({ page }) => {
  await page.goto("/faq");
  const links = await page.locator('footer a[href*="wa.me"]').evaluateAll(elements => elements.map(element => element.getAttribute("href")));
  expect(links.length).toBeGreaterThan(0);
  for (const link of links) expect(link).toBe("https://wa.me/8613367481710");
});

test("inquiry retry preserves buyer input and the submission identifier", async ({ page }) => {
  const ids: string[] = [];
  await page.route("**/api/send", async route => {
    ids.push(route.request().postDataJSON().submissionId);
    await route.fulfill(ids.length === 1
      ? { status: 503, json: { ok: false, message: "Please try again." } }
      : { status: 200, json: { ok: true, message: "Inquiry received." } });
  });
  await page.goto("/contact-us");
  const form = page.locator("form.rt-inquiry-form");
  await form.getByLabel("Your Name *").fill("Local Test Buyer");
  await form.getByLabel("Your Email *").fill("buyer@example.com");
  await form.getByLabel("Your WhatsApp *").fill("+1 555 0100");
  await form.getByRole("button", { name: "SEND INQUIRY NOW" }).click();
  await expect(form.getByRole("alert")).toContainText("Please try again.");
  await expect(form.getByLabel("Your Name *")).toHaveValue("Local Test Buyer");
  await expect(form.getByRole("link", { name: "Contact us on WhatsApp" })).toBeVisible();
  await form.getByRole("button", { name: "SEND INQUIRY NOW" }).click();
  await expect(page.getByRole("heading", { name: "Inquiry Received" })).toBeVisible();
  expect(ids).toHaveLength(2);
  expect(ids[0]).toBe(ids[1]);
});

test("320px layouts do not scroll horizontally", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  for (const route of ["/about-us", "/privacy-policy", "/used-brand-clothes", "/contact-us"]) {
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    const width = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(width, `${route} overflow`).toBeLessThanOrEqual(321);
  }
});

test("FAQ answers work without JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${baseURL}/faq`);
  const question = page.locator("details").filter({ hasText: "Which countries do you ship to?" });
  await question.locator("summary").click();
  await expect(question.locator("p")).toBeVisible();
  await context.close();
});

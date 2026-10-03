import { expect, test, type Page } from "@playwright/test";

async function analyticsCommands(page: Page) {
  return page.evaluate(() => (window.dataLayer ?? []).map(command => Array.from(command as ArrayLike<unknown>)));
}

async function pageViews(page: Page) {
  return (await analyticsCommands(page)).filter(command => command[0] === "event" && command[1] === "page_view");
}

test.beforeEach(async ({ page }) => {
  // Exercise our real bootstrap and navigation without polluting the production GA4 property.
  await page.route("https://www.googletagmanager.com/**", route => route.fulfill({
    contentType: "application/javascript",
    body: "/* GA4 transport intercepted by the regression test. */",
  }));
  await page.route(/https:\/\/[^/]*google-analytics\.com\//, route => route.fulfill({ status: 204 }));
  await page.route("**/api/send", route => route.fulfill({ json: { ok: true, message: "Inquiry received." } }));
});

test("first visit and client navigation record page views with basic analytics enabled", async ({ page, isMobile }) => {
  await page.goto("/?email=private%40example.invalid");
  await expect.poll(() => pageViews(page)).toHaveLength(1);

  const commands = await analyticsCommands(page);
  expect(commands[0]).toEqual(["consent", "default", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  }]);
  const configuration = commands.find(command => command[0] === "config");
  expect(configuration?.[1]).toMatch(/^G-/);
  expect(configuration?.[2]).toMatchObject({
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
  const firstView = (await pageViews(page))[0][2] as Record<string, string>;
  expect(firstView.page_path).toBe("/");
  expect(firstView.page_location).not.toContain("?");
  expect(firstView.send_to).toBe(configuration?.[1]);

  // A retained marker proves this is Next.js client navigation, not a fresh document.
  await page.evaluate(() => { document.documentElement.dataset.analyticsTest = "retained"; });
  if (isMobile) await page.getByRole("button", { name: "Toggle navigation" }).click();
  await page.locator("header").getByRole("link", { name: "About Us", exact: true }).click();
  await expect(page).toHaveURL(/\/about-us$/);
  await expect.poll(() => pageViews(page)).toHaveLength(2);
  await expect(page.locator("html")).toHaveAttribute("data-analytics-test", "retained");
  expect((await pageViews(page))[1][2]).toMatchObject({ page_path: "/about-us" });

  await page.goBack();
  await expect.poll(() => pageViews(page)).toHaveLength(3);
  expect((await pageViews(page))[2][2]).toMatchObject({ page_path: "/" });
  expect((await analyticsCommands(page)).filter(command => command[0] === "config")).toHaveLength(1);
});

test("a delayed Google script does not lose the first page view or a successful inquiry", async ({ page }) => {
  let releaseScript!: () => void;
  const scriptGate = new Promise<void>(resolve => { releaseScript = resolve; });
  await page.route("https://www.googletagmanager.com/**", async route => {
    await scriptGate;
    await route.fulfill({ contentType: "application/javascript", body: "/* delayed GA4 transport */" });
  });
  try {
    await page.goto("/contact-us?token=private-token", { waitUntil: "domcontentloaded" });
    await expect.poll(() => pageViews(page)).toHaveLength(1);
    const form = page.locator("form.rt-inquiry-form");
    await form.getByLabel("Your Name *").fill("Private Analytics Test");
    await form.getByLabel("Your Email *").fill("private@example.invalid");
    await form.getByLabel("Your WhatsApp *").fill("+1 555 0199");
    await form.getByRole("button", { name: "SEND INQUIRY NOW" }).click();
    await expect(page.getByRole("heading", { name: "Inquiry Received" })).toBeVisible();
    const commands = await analyticsCommands(page);
    const leads = commands.filter(command => command[0] === "event" && command[1] === "generate_lead");
    expect(leads).toHaveLength(1);
    expect(leads[0][2]).toMatchObject({ form_name: "wholesale_inquiry", page_path: "/contact-us" });
    const serialized = JSON.stringify(commands);
    for (const privateValue of ["Private Analytics Test", "private@example.invalid", "+1 555 0199", "private-token"]) {
      expect(serialized).not.toContain(privateValue);
    }
  } finally {
    releaseScript();
  }
});

test("email preference pages do not initialize analytics", async ({ page }) => {
  await page.goto("/email-preferences/resubscribe?token=private-token");
  await expect(page.getByLabel("Email address")).toBeVisible();
  await expect(page.locator('script[src*="googletagmanager"], #google-analytics')).toHaveCount(0);
  expect(await analyticsCommands(page)).toEqual([]);
});

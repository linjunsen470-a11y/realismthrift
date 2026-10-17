import { expect, test, type Page } from "@playwright/test";

const META_LEAD_EVENT_ID = "6f1e2c3a-4b5d-4e6f-8a7b-9c0d1e2f3a4b";

async function analyticsCommands(page: Page) {
  return page.evaluate(() => (window.dataLayer ?? []).map(command => Array.from(command as ArrayLike<unknown>)));
}

async function pageViews(page: Page) {
  return (await analyticsCommands(page)).filter(command => command[0] === "event" && command[1] === "page_view");
}

async function metaCommands(page: Page) {
  return page.evaluate(() => (window.fbq?.queue ?? []).map(command => Array.from(command as ArrayLike<unknown>)));
}

async function metaPageViews(page: Page) {
  return (await metaCommands(page)).filter(command => command[0] === "track" && command[1] === "PageView");
}

async function metaLeads(page: Page) {
  return (await metaCommands(page)).filter(command => command[0] === "track" && command[1] === "Lead");
}

test.beforeEach(async ({ page }) => {
  // Exercise our real bootstrap and navigation without polluting production GA4 or Meta.
  await page.route("https://www.googletagmanager.com/**", route => route.fulfill({
    contentType: "application/javascript",
    body: "/* GA4 transport intercepted by the regression test. */",
  }));
  await page.route(/https:\/\/[^/]*google-analytics\.com\//, route => route.fulfill({ status: 204 }));
  await page.route("https://connect.facebook.net/**", route => route.fulfill({
    contentType: "application/javascript",
    body: "/* Meta Pixel transport intercepted by the regression test. */",
  }));
  await page.route(/https:\/\/www\.facebook\.com\/tr\/?/, route => route.fulfill({ status: 204, body: "" }));
  await page.route("**/api/send", route => route.fulfill({
    json: { ok: true, message: "Inquiry received.", event_id: META_LEAD_EVENT_ID },
  }));
});

function cspDirective(csp: string, name: string) {
  return csp.split(";").map(part => part.trim()).find(part => part === name || part.startsWith(`${name} `)) ?? "";
}

function documentHead(html: string) {
  const end = html.toLowerCase().indexOf("</head>");
  return end === -1 ? html : html.slice(0, end);
}

test("first visit and client navigation record page views with basic analytics enabled", async ({ page, isMobile }) => {
  const pixelScript = page.waitForRequest("https://connect.facebook.net/**");
  const response = await page.goto("/?email=private%40example.invalid");
  const html = await response?.text() ?? "";
  const head = documentHead(html);
  expect(head).toContain('id="meta-pixel"');
  expect(head).toContain("https://connect.facebook.net/en_US/fbevents.js");
  expect(head).toContain("fbq('init', '1661409812003549')");
  expect(head).toContain("fbq('track', 'PageView')");
  expect(head).toContain("https://www.facebook.com/tr?id=1661409812003549");
  expect(head).not.toContain("__next_s");
  await pixelScript;
  const csp = response?.headers()["content-security-policy"] ?? "";
  expect(cspDirective(csp, "script-src")).toContain("https://connect.facebook.net");
  expect(cspDirective(csp, "img-src")).toContain("https://www.facebook.com");
  expect(cspDirective(csp, "connect-src")).toContain("https://www.facebook.com");
  expect(cspDirective(csp, "connect-src")).toContain("https://connect.facebook.net");
  expect(csp).not.toContain("*.facebook.net");
  expect(csp).not.toContain("*.facebook.com");
  await expect.poll(() => pageViews(page)).toHaveLength(1);
  await expect.poll(() => metaPageViews(page)).toHaveLength(1);

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

  const pixel = await metaCommands(page);
  expect(pixel.find(command => command[0] === "set")).toEqual(["set", "autoConfig", false, "1661409812003549"]);
  expect(pixel.find(command => command[0] === "init")).toEqual(["init", "1661409812003549"]);
  expect(JSON.stringify(pixel)).not.toContain("private");
  expect(JSON.stringify(pixel)).not.toContain("example.invalid");
  await expect(page.locator("#meta-pixel, #meta-pixel-lib")).toHaveCount(2);
  expect(await page.content()).toContain("https://www.facebook.com/tr?id=1661409812003549");

  // A retained marker proves this is Next.js client navigation, not a fresh document.
  await page.evaluate(() => { document.documentElement.dataset.analyticsTest = "retained"; });
  if (isMobile) await page.getByRole("button", { name: "Toggle navigation" }).click();
  await page.locator("header").getByRole("link", { name: "About Us", exact: true }).click();
  await expect(page).toHaveURL(/\/about-us$/);
  await expect.poll(() => pageViews(page)).toHaveLength(2);
  await expect.poll(() => metaPageViews(page)).toHaveLength(2);
  await expect(page.locator("html")).toHaveAttribute("data-analytics-test", "retained");
  expect((await pageViews(page))[1][2]).toMatchObject({ page_path: "/about-us" });

  await page.goBack();
  await expect.poll(() => pageViews(page)).toHaveLength(3);
  await expect.poll(() => metaPageViews(page)).toHaveLength(3);
  expect((await pageViews(page))[2][2]).toMatchObject({ page_path: "/" });
  expect((await analyticsCommands(page)).filter(command => command[0] === "config")).toHaveLength(1);
  expect((await metaCommands(page)).filter(command => command[0] === "init")).toHaveLength(1);
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
    const pixelLeads = await metaLeads(page);
    expect(pixelLeads).toHaveLength(1);
    expect(pixelLeads[0][2]).toEqual({ content_name: "wholesale_inquiry", content_category: "not_specified" });
    expect(pixelLeads[0][3]).toEqual({ eventID: META_LEAD_EVENT_ID });
    const serialized = JSON.stringify({ ga: commands, meta: await metaCommands(page) });
    for (const privateValue of ["Private Analytics Test", "private@example.invalid", "+1 555 0199", "private-token"]) {
      expect(serialized).not.toContain(privateValue);
    }
  } finally {
    releaseScript();
  }
});

test("email preference pages do not initialize analytics", async ({ page }) => {
  const response = await page.goto("/email-preferences/resubscribe?token=private-token");
  const html = await response?.text() ?? "";
  expect(html).not.toContain("fbq(");
  expect(html).not.toContain("connect.facebook.net");
  expect(html).not.toContain("fbevents");
  expect(html).not.toContain("facebook.com/tr");
  await expect(page.getByLabel("Email address")).toBeVisible();
  await expect(page.locator('script[src*="googletagmanager"], #google-analytics, #meta-pixel, #meta-pixel-lib, script[src*="facebook.net"]')).toHaveCount(0);
  expect(await page.content()).not.toContain("facebook.com/tr");
  expect(await analyticsCommands(page)).toEqual([]);
  expect(await metaCommands(page)).toEqual([]);
});

test("privacy policy discloses the Meta Pixel and does not deny using it", async ({ page }) => {
  await page.goto("/privacy-policy");
  await expect(page.getByRole("heading", { name: "Analytics and Advertising Measurement" })).toBeVisible();
  const text = await page.locator("main").innerText();
  expect(text).toContain("Meta Pixel");
  expect(text).toContain("PageView");
  expect(text).toContain("Lead");
  expect(text).not.toContain("do not use Google Ads, Meta Pixel");
  expect(text.toLowerCase()).not.toContain("cookie settings");
  expect(text.toLowerCase()).not.toContain("consent banner");
});

test("only a successful inquiry records one Meta Lead", async ({ page }) => {
  await page.goto("/contact-us");
  const form = page.locator("form.rt-inquiry-form");
  await form.getByRole("button", { name: "SEND INQUIRY NOW" }).click();
  await expect(form).toBeVisible();
  expect(await metaLeads(page)).toHaveLength(0);

  await page.route("**/api/send", route => route.fulfill({ status: 503, json: { ok: false, message: "Please try again." } }));
  await form.getByLabel("Your Name *").fill("Private Analytics Test");
  await form.getByLabel("Your Email *").fill("private@example.invalid");
  await form.getByLabel("Your WhatsApp *").fill("+1 555 0199");
  await form.getByLabel("Your Message").fill("Call me about a private order");
  await form.getByLabel("Product Interest").selectOption("Used Brand Bags");
  await form.getByRole("button", { name: "SEND INQUIRY NOW" }).click();
  await expect(form.getByRole("alert")).toContainText("Please try again.");
  expect(await metaLeads(page)).toHaveLength(0);
  expect((await analyticsCommands(page)).filter(command => command[1] === "generate_lead")).toHaveLength(0);

  await page.unroute("**/api/send");
  await page.route("**/api/send", route => route.abort("failed"));
  await form.getByRole("button", { name: "SEND INQUIRY NOW" }).click();
  await expect(form.getByRole("alert")).toContainText("Network error");
  expect(await metaLeads(page)).toHaveLength(0);

  await page.unroute("**/api/send");
  await page.route("**/api/send", route => route.fulfill({
    json: { ok: true, message: "Inquiry received.", event_id: META_LEAD_EVENT_ID },
  }));
  await form.getByRole("button", { name: "SEND INQUIRY NOW" }).click();
  await expect(page.getByRole("heading", { name: "Inquiry Received" })).toBeVisible();
  const leads = await metaLeads(page);
  expect(leads).toHaveLength(1);
  expect(leads[0][2]).toEqual({ content_name: "wholesale_inquiry", content_category: "Used Brand Bags" });
  expect(leads[0][3]).toEqual({ eventID: META_LEAD_EVENT_ID });
  const serialized = JSON.stringify(await metaCommands(page));
  for (const privateValue of ["Private Analytics Test", "private@example.invalid", "+1 555 0199", "Call me about a private order"]) {
    expect(serialized).not.toContain(privateValue);
  }
});

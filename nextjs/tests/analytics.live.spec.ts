import { expect, test } from "@playwright/test";

// Opt-in only: this test creates one real visit in the production GA4 property.
test.skip(process.env.GA4_LIVE_CHECK !== "true", "Run the manual GA4 verification workflow to test the real Google endpoint.");

test("production sends a page view to the correct GA4 stream with advertising disabled", async ({ page, context }) => {
  const measurementId = "G-854G1RXBJM";
  const collection = page.waitForResponse(response => {
    const url = new URL(response.url());
    const payload = `${url.search.slice(1)}&${response.request().postData() ?? ""}`;
    return /(^|\.)google-analytics\.com$/.test(url.hostname)
      && url.pathname === "/g/collect"
      && url.searchParams.get("tid") === measurementId
      && /(^|[&\n])en=page_view(?:&|$)/.test(payload);
  }, { timeout: 25_000 });
  await page.goto("/faq", { waitUntil: "domcontentloaded" });
  const response = await collection;
  expect(response.status()).toBe(204);
  const url = new URL(response.url());
  expect(url.searchParams.get("gcs")).toBe("G101");
  expect(url.searchParams.get("dl")).toBe("https://www.realismthrift.com/faq");

  const commands = await page.evaluate(() => (window.dataLayer ?? []).map(command => Array.from(command as ArrayLike<unknown>)));
  expect(commands.find(command => command[0] === "config")?.[2]).toMatchObject({
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
  const cookieNames = (await context.cookies()).map(cookie => cookie.name);
  expect(cookieNames).toContain("_ga");
  expect(cookieNames.some(name => name.startsWith("_gcl"))).toBe(false);
  console.log(JSON.stringify({
    measurementId,
    event: "page_view",
    page: url.searchParams.get("dl"),
    googleResponse: response.status(),
    consent: url.searchParams.get("gcs"),
    analyticsCookiePresent: cookieNames.includes("_ga"),
    advertisingEnabled: false,
  }));
});

import { expect, test } from "@playwright/test";

const token = "a".repeat(43);

test("unsubscribe requires a click and offers a quiet preference link", async ({ page }, testInfo) => {
  const actions: string[] = [];
  await page.route("**/api/email-preferences", async route => {
    actions.push(route.request().postDataJSON().action);
    await route.fulfill({ json: { status: "unsubscribed" } });
  });
  const response = await page.goto(`/email-preferences?token=${token}`);
  await expect(page.getByRole("button", { name: "Unsubscribe", exact: true })).toBeVisible();
  expect(actions).toEqual([]);
  expect(response?.headers()["referrer-policy"]).toBe("no-referrer");
  expect(response?.headers()["x-robots-tag"]).toContain("noindex");
  // CI runs the production build; Next dev overrides this header with no-cache.
  expect(response?.headers()["cache-control"]).toMatch(process.env.CI ? /no-store/ : /no-store|no-cache/);
  expect(await page.locator("script[src*='googletagmanager'],script[src*='facebook.net']").count()).toBe(0);
  await page.getByRole("button", { name: "Unsubscribe", exact: true }).click();
  await expect(page.getByRole("heading", { name: "You're unsubscribed" })).toBeVisible();
  expect(actions).toEqual(["unsubscribe"]);
  await expect(page.getByRole("link", { name: "Update email preferences" })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("unsubscribe.png"), fullPage: true });
});

test("request form starts unchecked and uses a generic accepted response", async ({ page }, testInfo) => {
  const payloads: Record<string, unknown>[] = [];
  await page.route("**/api/email-preferences", async route => {
    payloads.push(route.request().postDataJSON());
    await route.fulfill({ status: 202, json: { status: "accepted" } });
  });
  await page.goto("/email-preferences/resubscribe");
  await expect(page.getByRole("checkbox")).not.toBeChecked();
  await expect(page.getByRole("navigation")).toHaveCount(0);
  await page.getByLabel("Email address").fill("buyer@example.invalid");
  await page.screenshot({ path: testInfo.outputPath("request.png"), fullPage: true });
  await page.getByRole("button", { name: "Send confirmation email" }).click();
  expect(payloads).toHaveLength(0);
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Send confirmation email" }).click();
  await expect(page.getByRole("heading", { name: "Check your inbox" })).toBeVisible();
  expect(payloads).toEqual([{ action: "request_resubscribe", token: "", email: "buyer@example.invalid", consent: true }]);
});

test("confirmation preview cannot resubscribe and explicit confirmation clears the fragment", async ({ page }, testInfo) => {
  const actions: string[] = [];
  await page.route("**/api/email-preferences", async route => {
    const body = route.request().postDataJSON();
    actions.push(body.action);
    expect(body.token).toBe(token);
    await route.fulfill({ json: body.action === "preview_confirmation" ? { status: "ready", email: "b***@example.invalid" } : { status: "confirmed" } });
  });
  await page.goto(`/email-preferences/confirm#token=${token}`);
  await expect(page.getByRole("button", { name: "Confirm subscription" })).toBeVisible();
  expect(actions.every(action => action === "preview_confirmation")).toBe(true);
  await expect(page.locator("main")).toContainText("b***@example.invalid");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("confirm.png"), fullPage: true });
  await page.getByRole("button", { name: "Confirm subscription" }).click();
  await expect(page.getByRole("heading", { name: "Preference confirmed" })).toBeVisible();
  expect(actions.filter(action => action === "confirm_resubscribe")).toHaveLength(1);
  expect(new URL(page.url()).hash).toBe("");
});

test("a newer unsubscribe prevents an old confirmation from offering a confirm button", async ({ page }) => {
  await page.route("**/api/email-preferences", route => route.fulfill({ json: { status: "changed" } }));
  await page.goto(`/email-preferences/confirm#token=${token}`);
  await expect(page.getByRole("heading", { name: "This link is no longer available" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Confirm subscription" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Request a new link" })).toBeVisible();
});

test("an unavailable database offers retry instead of claiming unsubscribe success", async ({ page }) => {
  let attempts = 0;
  await page.route("**/api/email-preferences", async route => {
    attempts++;
    await route.fulfill(attempts === 1 ? { status: 503, json: { code: "temporarily_unavailable" } } : { json: { status: "unsubscribed" } });
  });
  await page.goto(`/email-preferences?token=${token}`);
  await page.getByRole("button", { name: "Unsubscribe", exact: true }).click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText("try again");
  await expect(page.getByRole("heading", { name: "You're unsubscribed" })).toHaveCount(0);
  await page.getByRole("button", { name: "Unsubscribe", exact: true }).click();
  await expect(page.getByRole("heading", { name: "You're unsubscribed" })).toBeVisible();
});

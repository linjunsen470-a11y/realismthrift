import { expect, test } from "@playwright/test";

test.describe("RealismThrift smoke tests", () => {
  test("homepage renders the primary sales path", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/RealismThrift|Global Wholesale Supplier/i);
    await expect(
      page.getByRole("heading", {
        name: /Direct Second Hand Brand Clothes, Shoes & Bags Factory/i,
      }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /View Products/i })).toBeVisible();
    await expect(page.locator("#products")).toContainText("SECOND HAND PRODUCT CATEGORIES");
    await expect(page.locator("#contact")).toContainText("GET IN TOUCH");
  });

  test("core public pages respond without an error page", async ({ page }) => {
    const paths = [
      "/about-us",
      "/used-brand-clothes",
      "/used-brand-shoes",
      "/used-brand-bag",
      "/how-to-order",
      "/faq",
      "/contact-us",
    ];

    for (const path of paths) {
      const response = await page.goto(path);

      expect(response?.ok(), `${path} should return a successful response`).toBe(true);
      await expect(page.locator("body")).not.toContainText("Application error");
      await expect(page.locator("body")).toContainText(/RealismThrift|Used|Contact|FAQ|Order/i);
    }
  });

  test("inquiry form submits through the local API contract", async ({ page }) => {
    await page.route("**/api/send", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          ok: true,
          message: "Inquiry received. Our sales team will contact you within 12 hours.",
        }),
      });
    });

    await page.goto("/contact-us");

    const form = page.locator("form.rt-inquiry-form").first();
    await form.getByLabel("Your Name *").fill("Smoke Test Buyer");
    await form.getByLabel("Your Email *").fill("buyer@example.com");
    await form.getByLabel("Your WhatsApp *").fill("+1 555 0100");
    await form.getByLabel("Your Country").fill("Nigeria");
    await form.getByLabel("Product Interest").selectOption("Used Brand Clothes");
    await form.getByLabel("Your Quantity").selectOption("20ft");
    await form.getByLabel("Your Message").fill("Please send the latest wholesale price list.");
    await form.getByRole("button", { name: /SEND INQUIRY NOW/i }).click();

    await expect(page.getByRole("heading", { name: "Inquiry Received" })).toBeVisible();
    await expect(page.locator(".rt-form-state-success")).toContainText("12 hours");
  });
});

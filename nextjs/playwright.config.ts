import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [["github"], ["html", { open: "never" }]]
    : [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    // Smoke browsers must not deliver PageView or Lead hits to the production pixel.
    launchOptions: {
      args: ["--host-resolver-rules=MAP connect.facebook.net 127.0.0.1, MAP www.facebook.com 127.0.0.1"],
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chromium",
      use: { ...devices["Pixel 7"] },
    },
  ],
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        // CI already built the app; exercise production cache headers and routing.
        command: process.env.CI ? "pnpm start" : "pnpm dev",
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
        env: {
          // Exercise production Meta behavior with all event transports intercepted.
          VERCEL_ENV: "production",
          // Render signed-out login forms without production credentials or a session.
          // Login POSTs are intercepted by the tests; no Supabase login is performed.
          SUPABASE_URL: process.env.SUPABASE_URL || "https://tjbeeackrjpojejxhnzq.supabase.co",
          SUPABASE_PUBLISHABLE_KEY: process.env.SUPABASE_PUBLISHABLE_KEY || "sb_publishable_smoke_test_placeholder",
          NEXT_PUBLIC_ANALYTICS_ENABLED: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED || "true",
          NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID || "G-TEST000001",
          NEXT_PUBLIC_FB_PIXEL_ID: process.env.NEXT_PUBLIC_FB_PIXEL_ID || "1661409812003549",
        },
      },
});

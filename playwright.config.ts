import { defineConfig, devices } from "@playwright/test";

/**
 * Base URL is injected by CI (the Vercel preview URL) or falls back to localhost.
 * Set PLAYWRIGHT_BASE_URL in your environment to point at any deployment.
 */
const baseURL =
  process.env.PLAYWRIGHT_BASE_URL ??
  (process.env.CI ? "https://event-dashboard-xi.vercel.app" : "http://localhost:3000");

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "html",
  timeout: 60_000,

  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    // Auth setup runs first — saves session to file so tests can reuse it
    {
      name: "setup",
      testMatch: "**/auth.setup.ts",
    },
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // Reuse the authenticated session for all tests
        storageState: "tests/e2e/.auth/user.json",
      },
      dependencies: ["setup"],
    },
  ],
});

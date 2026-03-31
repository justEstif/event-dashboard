import { test as setup, expect } from "@playwright/test";
import path from "path";

const authFile = path.join(__dirname, ".auth/user.json");

/**
 * Auth setup — runs once before all tests.
 *
 * ⚠️  TRADEOFF: These tests run against the production Supabase project using the
 * demo user (demo@fastbreak.app). We accept this because:
 *   - The demo account is a dedicated test identity with no real user data
 *   - Tests clean up after themselves (delete any events they create)
 *   - The alternative (a separate staging Supabase project) adds operational
 *     overhead that isn't justified for this project stage
 *   - It makes deployment simpler — one set of env vars, one database to manage
 *
 * This is a deliberate choice, not an oversight.
 */
setup("authenticate as demo user", async ({ page }) => {
  await page.goto("/auth/login");
  await page.waitForLoadState("networkidle");

  await page.getByRole("button", { name: "Sign in as demo user" }).click({ timeout: 15_000 });

  await expect(page).toHaveURL("/dashboard", { timeout: 15_000 });

  // Save session so all tests can reuse it without re-logging in
  await page.context().storageState({ path: authFile });
});

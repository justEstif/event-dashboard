import { test, expect } from "@playwright/test";

/**
 * Event CRUD tests.
 *
 * These tests create and delete real records in the production Supabase database
 * using the demo user. Each test cleans up after itself.
 *
 * See auth.setup.ts for the rationale behind using the production DB.
 */

test.describe("Create event", () => {
  test("redirects to event detail page after creation", async ({ page }) => {
    const eventName = `[E2E] Test Event ${Date.now()}`;

    await page.goto("/events/new");
    await page.getByLabel("Event name").fill(eventName);

    await page.getByRole("combobox", { name: "Sport" }).click();
    await page.getByRole("option", { name: "Basketball" }).click();

    await page.locator('input[type="datetime-local"]').fill("2099-06-15T10:00");

    await page.getByLabel("Venue name").fill("E2E Test Arena");
    await page.getByLabel("Address (optional)").fill("1 Test Street");

    await page.getByRole("button", { name: "Create event" }).click();

    // Should redirect to /events/:id
    await expect(page).toHaveURL(/\/events\/[a-f0-9-]{36}$/, { timeout: 15_000 });
    await expect(page.getByRole("heading", { name: eventName })).toBeVisible();

    // Clean up — delete the event we just created
    await page.getByRole("button", { name: /delete/i }).click();
    await page.getByRole("alertdialog").waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Delete event" }).click();
    // Wait for deletion to process then navigate away
    await page.waitForTimeout(2000);
    await page.goto("/dashboard");
  });
});

test.describe("Event detail page", () => {
  test("shows all event fields", async ({ page }) => {
    await page.goto("/dashboard");
    await page.getByRole("link").filter({ hasText: /\d{4}/ }).first().click();
    await expect(page).toHaveURL(/\/events\/[a-f0-9-]{36}$/, { timeout: 10_000 });

    await expect(page.getByText(/date & time/i)).toBeVisible();
    await expect(page.getByText(/venues/i)).toBeVisible();
  });

  test("edit button navigates to edit page", async ({ page }) => {
    await page.goto("/dashboard");
    await page.getByRole("link").filter({ hasText: /\d{4}/ }).first().click();
    await expect(page).toHaveURL(/\/events\/[a-f0-9-]{36}$/, { timeout: 10_000 });

    await page.getByRole("link", { name: /edit/i }).click();
    await expect(page).toHaveURL(/\/events\/[a-f0-9-]{36}\/edit$/);
  });
});

test.describe("Edit event", () => {
  test("redirects to event detail page after update", async ({ page }) => {
    await page.goto("/dashboard");
    await page.getByRole("link").filter({ hasText: /\d{4}/ }).first().click();
    await expect(page).toHaveURL(/\/events\/[a-f0-9-]{36}$/, { timeout: 10_000 });

    const detailUrl = page.url();
    await page.getByRole("link", { name: /edit/i }).click();
    await expect(page).toHaveURL(/\/edit$/);

    await page.getByLabel(/description/i).fill(`Updated by E2E at ${new Date().toISOString()}`);

    await page.getByRole("button", { name: /save|update/i }).click();

    // Should redirect back to the detail page
    await expect(page).toHaveURL(detailUrl, { timeout: 15_000 });
  });
});

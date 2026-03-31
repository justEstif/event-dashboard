import { test, expect } from "@playwright/test";

/**
 * Event CRUD tests.
 *
 * These tests create and delete real records in the production Supabase database
 * using the demo user. Each test cleans up after itself.
 *
 * See auth.setup.ts for the rationale behind using the production DB.
 */

const TEST_EVENT_NAME = `[E2E] Test Event ${Date.now()}`;

test.describe("Create event", () => {
  let createdEventUrl: string;

  test("redirects to event detail page after creation", async ({ page }) => {
    await page.goto("/events/new");

    await page.getByLabel("Event name").fill(TEST_EVENT_NAME);

    // Select sport
    await page.getByRole("combobox", { name: "Sport" }).click();
    await page.getByRole("option", { name: "Basketball" }).click();

    // Fill datetime-local — Playwright's fill() triggers React's onChange correctly
    await page.locator('input[type="datetime-local"]').fill("2099-06-15T10:00");

    // Fill venue
    await page.getByLabel("Venue name").fill("E2E Test Arena");
    await page.getByLabel("Address (optional)").fill("1 Test Street");

    await page.getByRole("button", { name: "Create event" }).click();

    // Should redirect to the detail page — not /events/new or /dashboard
    await expect(page).not.toHaveURL("/events/new", { timeout: 15_000 });
    await expect(page).not.toHaveURL("/dashboard");
    await expect(page).toHaveURL(/\/events\/[a-f0-9-]{36}$/);

    createdEventUrl = page.url();

    // Detail page should show the event name
    await expect(page.getByRole("heading", { name: TEST_EVENT_NAME })).toBeVisible();
  });

  test.afterAll(async ({ browser }) => {
    if (!createdEventUrl) return;

    // Clean up — delete the event we created
    const page = await browser.newPage();
    await page.goto(createdEventUrl);
    await page.getByRole("button", { name: /delete/i }).click();
    // Confirm dialog if present
    const dialog = page.getByRole("dialog");
    if (await dialog.isVisible()) {
      await dialog.getByRole("button", { name: /delete|confirm/i }).click();
    }
    await page.close();
  });
});

test.describe("Event detail page", () => {
  test("shows all event fields", async ({ page }) => {
    await page.goto("/dashboard");

    // Click the first event card
    const firstCard = page.getByRole("link").filter({ hasText: /\d{4}/ }).first();
    await firstCard.click();

    await expect(page).toHaveURL(/\/events\/[a-f0-9-]{36}/);
    await expect(page.getByText(/date & time/i)).toBeVisible();
    await expect(page.getByText(/venues/i)).toBeVisible();
  });

  test("edit button navigates to edit page", async ({ page }) => {
    await page.goto("/dashboard");
    const firstCard = page.getByRole("link").filter({ hasText: /\d{4}/ }).first();
    await firstCard.click();

    await page.getByRole("link", { name: /edit/i }).click();
    await expect(page).toHaveURL(/\/events\/[a-f0-9-]{36}\/edit/);
  });
});

test.describe("Edit event", () => {
  test("redirects to event detail page after update", async ({ page }) => {
    await page.goto("/dashboard");

    // Navigate to edit page of the first event
    const firstCard = page.getByRole("link").filter({ hasText: /\d{4}/ }).first();
    await firstCard.click();

    const detailUrl = page.url();
    await page.getByRole("link", { name: /edit/i }).click();
    await expect(page).toHaveURL(/\/edit$/);

    // Make a trivial change to description
    const desc = page.getByLabel(/description/i);
    await desc.fill(`Updated by E2E at ${new Date().toISOString()}`);

    await page.getByRole("button", { name: /save|update/i }).click();

    // Should redirect back to the detail page
    await expect(page).toHaveURL(detailUrl, { timeout: 15_000 });
  });
});

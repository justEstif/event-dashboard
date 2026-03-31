import { test, expect } from "@playwright/test";

test.describe("Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard");
  });

  test("shows the events list", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /events/i })).toBeVisible();
    await expect(page.getByRole("link", { name: "New event" })).toBeVisible();
  });

  test("search filters events", async ({ page }) => {
    const search = page.getByPlaceholder("Search events…");
    await search.fill("soccer");
    // URL should reflect the search param
    await expect(page).toHaveURL(/search=soccer/);
  });

  test("sport filter updates URL", async ({ page }) => {
    await page.getByRole("combobox").click();
    await page.getByRole("option", { name: "Basketball" }).click();
    await expect(page).toHaveURL(/sport=basketball/i);
  });
});

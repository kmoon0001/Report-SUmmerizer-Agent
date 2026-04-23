import { test, expect } from "@playwright/test";

test.describe("App shell", () => {
  test("page exposes title for Moonie's portal", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Moonie's SNF Rehab Therapy Portal/i);
  });
});

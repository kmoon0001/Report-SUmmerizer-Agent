import { test, expect } from "@playwright/test";

test.describe("Visual Regression Testing - Clinical Hubs", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the portal
    await page.goto("/");
    // Wait for the hydration and animations
    await page.waitForTimeout(2000);
  });

  test("Geriatric Hub Visual Baseline", async ({ page }) => {
    // Navigate to Geriatric Hub via Sidebar or Direct Load if possible
    // Assuming we start on Dashboard and click Geriatric
    await page.click('[data-testid="sidebar-geriatric"]');
    await page.waitForSelector('[data-testid="tab-steadi"]');

    // Take a full-page screenshot for visual comparison
    await expect(page).toHaveScreenshot("geriatric-hub-baseline.png", {
      mask: [page.locator('[data-testid="real-time-clock"]')], // Mask dynamic elements like clock if any
      fullPage: true,
    });
  });

  test("Neurological Hub Visual Baseline", async ({ page }) => {
    await page.click('[data-testid="sidebar-neurological"]');
    await page.waitForSelector('[data-testid="tab-fugl-meyer"]');

    await expect(page).toHaveScreenshot("neurological-hub-baseline.png", {
      fullPage: true,
    });
  });

  test("Clinical Pathways Visual Baseline", async ({ page }) => {
    await page.click('[data-testid="sidebar-pathways"]');
    await page.waitForSelector('h1:has-text("Clinical Pathways")');

    await expect(page).toHaveScreenshot("clinical-pathways-baseline.png", {
      fullPage: true,
    });
  });
});

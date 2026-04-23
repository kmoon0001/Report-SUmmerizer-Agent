import { test, expect } from "@playwright/test";

test.describe("E2E Clinical Workflow", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto("/");

    // Select SLP to enter the portal
    console.log("Selecting SLP discipline...");
    await page.click('button:has-text("Speech-Language Pathology")');

    // Use a robust wait for the dashboard
    console.log("Waiting for dashboard identity...");
    await page.waitForSelector("text=Kevin Moon", { timeout: 15000 });
  });

  test("should navigate through assessment hubs and validate documentation", async ({
    page,
  }) => {
    // 1. Verify on Dashboard
    await expect(page.getByText(/Moonie's/i).first()).toBeVisible();

    // Debug: List all text in sidebar
    console.log("Sidebar Debug:");
    const sidebar = page.locator("aside");
    const texts = await sidebar.allInnerTexts();
    console.log("Sidebar contents:", texts);

    // 2. Navigate via Sidebar (using a more generic selector)
    console.log("Navigating to Documentation Studio...");
    const studioBtn = page.getByText("Documentation Studio").first();
    await studioBtn.waitFor({ state: "visible", timeout: 10000 });
    await studioBtn.click({ force: true });

    // Verify Studio loaded
    console.log("Waiting for studio content...");
    await expect(page.getByText(/DocuArchitect/i).first()).toBeVisible({
      timeout: 15000,
    });

    // Target the first clinical textarea
    console.log("Waiting for clinical textarea...");
    const textArea = page.locator("textarea").first();
    await textArea.waitFor({ state: "visible", timeout: 15000 });

    // 4. Enter a compliant SLP note
    console.log("Testing compliant note...");
    await textArea.fill(
      "Patient presented with dysphagia requiring skilled swallowing treatment for bolus management.",
    );

    // 5. Check compliance flags
    console.log("Checking for critical flags...");
    await page.waitForTimeout(2000);
    // We expect NO critical flags for this
    const flags = await page.getByText(/Critical/i).count();
    console.log(`Critical flags found: ${flags}`);
    expect(flags).toBe(0);

    // 6. Enter a poor note
    console.log("Testing poor note...");
    await textArea.fill("Patient did well today. Continue same.");

    // Should see flags
    console.log("Verifying skilled need flags...");
    await expect(
      page.getByText(/Vague language detected/i).first(),
    ).toBeVisible({ timeout: 10000 });
    await expect(
      page.getByText(/Missing skilled need justification/i),
    ).toBeVisible({ timeout: 10000 });

    // 7. Navigate back to Dashboard
    console.log("Navigating back to Dashboard...");
    await page.getByText("Dashboard").first().click();
    await expect(page.getByText(/Moonie's/i).first()).toBeVisible();
  });
});

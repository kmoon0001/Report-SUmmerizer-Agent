import { test, expect } from "@playwright/test";

test("slp sidebar audit of Moonie's SNF Rehab Therapy Portal", async ({
  page,
}) => {
  // Capture console logs
  page.on("console", (msg) => {
    console.log(`[BROWSER] ${msg.type().toUpperCase()}: ${msg.text()}`);
  });

  // 1. Navigate to the portal
  await page.goto("http://localhost:3000");

  // 2. Select SLP
  console.log("👆 Selecting SLP...");
  const slpButton = page.locator(
    'button:has(h2:has-text("Speech-Language Pathology"))',
  );
  await slpButton.waitFor({ state: "visible", timeout: 15000 });
  await slpButton.click();

  // Wait for transition
  await page.waitForTimeout(3000);

  // 3. Verify Sidebar
  console.log("🧐 Inspecting Sidebar...");

  const slpCorner = page.locator('button:has-text("SLP Corner")');
  console.log("SLP Corner visibility:", await slpCorner.isVisible());

  const resources = page.locator('button:has-text("SLP Resource Center")');
  console.log("SLP Resource Center visibility:", await resources.isVisible());

  const goalBuilder = page.locator('button:has-text("SLP Goal Builder")');
  console.log("SLP Goal Builder visibility:", await goalBuilder.isVisible());

  // Try to find them in the items list
  const sidebarItems = await page
    .locator(".flex-1 button span")
    .allTextContents();
  console.log("📜 Sidebar Text Items:", sidebarItems);
});

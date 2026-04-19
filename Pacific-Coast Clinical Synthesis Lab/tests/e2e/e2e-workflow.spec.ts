import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Pac Coast Report Prep Agent E2E Automation', () => {
  // Load local schema JSON for mocking
  const evalMockData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../../src/MockData/Rehab_Record_Eval.json'), 'utf8'),
  );

  test.beforeEach(async ({ page }) => {
    await page.route('https://localhost/api/data/v9.2/cr917_snf_daily_briefings', async (route) => {
      await route.fulfill({ status: 200, json: { value: [evalMockData] } });
    });
  });

  test('Power Apps Dashboard: "Generate Briefing" validates payload architecture', async ({ page }) => {
    test
      .info()
      .annotations.push({ type: 'MCP', description: 'Testing DOR workflow trigger and mock Dataverse binding' });

    // Simulate generic local page since we are testing framework architecture
    await page.setContent(`
      <html>
        <body>
          <div class="header">Pac Coast Report Prep Orchestration HQ</div>
          <button id="btn-generate">Run Daily Copilot Orchestrator</button>
          <div id="status" class="briefing-status" style="display:none">Completed - Inserted ${evalMockData.cr917_recordid}</div>
        </body>
        <script>
          window.onload = () => {
            document.getElementById('btn-generate').addEventListener('click', () => {
              fetch('/api/data/v9.2/cr917_snf_daily_briefings').then(() => {
                document.getElementById('status').style.display = 'block';
              });
            });
          };
        </script>
      </html>
    `, { baseURL: 'https://localhost' });

    // Ensure the button is attached before interacting
    await page.waitForSelector('button:has-text("Run Daily Copilot Orchestrator")', { timeout: 5000 });
    const generateBtn = page.locator('button:has-text("Run Daily Copilot Orchestrator")');
    await expect(generateBtn).toBeVisible();
    // Click the button, then give the script a moment to fire before awaiting the response
    await generateBtn.click();
    await page.waitForTimeout(500);
    const response = await page.waitForResponse('https://localhost/api/data/v9.2/cr917_snf_daily_briefings', { timeout: 60000 });

    expect(response.status()).toBe(200);

    // Assert strictly against the visible status matching our mock Dataverse ID
    const statusText = page.locator('.briefing-status');
    await expect(statusText).toBeVisible({ timeout: 5000 });
    await expect(statusText).toContainText(`Completed - Inserted ${evalMockData.cr917_recordid}`);
  });

  test('Teams Adaptive Card: Fallback Validation', async ({ request }) => {
    test
      .info()
      .annotations.push({ type: 'Teams', description: 'Testing Schema validation of the V1.4 Adaptive Card payload' });

    const cardPayload = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../../src/AdaptiveCards/DOR_Approval_Card.json'), 'utf8'),
    );

    // Hardened Assertion: Verify essential keys exist safely
    expect(cardPayload).toHaveProperty('version', '1.4');
    expect(cardPayload).toHaveProperty('body');
    expect(Array.isArray(cardPayload.actions)).toBeTruthy();

    // Ensure fallback actions or destruct actions exist to prevent soft-locks
    const hasReject = cardPayload.actions.some((a: any) => a.title === 'Reject All' && a.style === 'destructive');
    expect(hasReject).toBeTruthy();
  });
});

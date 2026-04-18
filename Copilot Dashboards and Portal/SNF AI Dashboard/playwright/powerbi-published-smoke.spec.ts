import { expect, test } from '@playwright/test';

const reportUrl = process.env.POWERBI_REPORT_URL;
const expectedMarkersRaw = process.env.POWERBI_EXPECTED_MARKERS
  ?? 'Current Resident Census|Outstanding Documentation Items|Residents With Therapy';
const disallowedMarkersRaw = process.env.POWERBI_DISALLOWED_MARKERS
  ?? "Something went wrong|Couldn't load the data for this visual|Error fetching data";

test('power bi published report smoke', async ({ page }) => {
  if (!reportUrl) {
    test.skip(true, 'POWERBI_REPORT_URL is not set.');
  }

  await page.goto(reportUrl!, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(5000);

  const body = await page.locator('body').innerText();

  for (const marker of expectedMarkersRaw.split('|').map((v) => v.trim()).filter(Boolean)) {
    expect(body).toContain(marker);
  }

  for (const marker of disallowedMarkersRaw.split('|').map((v) => v.trim()).filter(Boolean)) {
    expect(body).not.toContain(marker);
  }
});

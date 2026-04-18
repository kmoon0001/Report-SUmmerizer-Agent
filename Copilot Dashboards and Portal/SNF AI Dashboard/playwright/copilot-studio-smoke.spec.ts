import { expect, test } from '@playwright/test';

function splitEnvList(name: string): string[] {
  const raw = process.env[name]?.trim();
  if (!raw) {
    return [];
  }

  return raw
    .split('|')
    .map((value) => value.trim())
    .filter(Boolean);
}

const targetUrl = process.env.COPILOT_STUDIO_URL;
const titlePattern = new RegExp(
  process.env.COPILOT_STUDIO_EXPECTED_TITLE ?? 'Copilot Studio|Microsoft Copilot Studio|SNF AI Dashboard',
  'i',
);
const expectedMarkers = splitEnvList('COPILOT_EXPECTED_MARKERS');
const disallowedMarkers = splitEnvList('COPILOT_DISALLOWED_MARKERS');

test.describe('SNF Command Center browser smoke', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!targetUrl, 'Set COPILOT_STUDIO_URL to the published or preview experience you want to verify.');
    await page.goto(targetUrl!, { waitUntil: 'domcontentloaded' });
  });

  test('landing page is reachable', async ({ page }) => {
    await expect(page).toHaveTitle(titlePattern);
  });

  test('expected menu or experience markers are visible', async ({ page }) => {
    test.skip(
      expectedMarkers.length === 0,
      'Set COPILOT_EXPECTED_MARKERS as a | separated list to assert specific UI markers.',
    );

    for (const marker of expectedMarkers) {
      await expect(page.getByText(marker, { exact: false }).first()).toBeVisible();
    }
  });

  test('known bad markers are absent', async ({ page }) => {
    test.skip(
      disallowedMarkers.length === 0,
      'Set COPILOT_DISALLOWED_MARKERS as a | separated list to assert absent error or stale markers.',
    );

    const pageText = await page.locator('body').innerText();
    for (const marker of disallowedMarkers) {
      expect(pageText).not.toContain(marker);
    }
  });
});

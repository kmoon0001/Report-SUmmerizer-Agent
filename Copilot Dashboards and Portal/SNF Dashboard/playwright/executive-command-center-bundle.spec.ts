import { expect, test } from '@playwright/test';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const bundlePath = process.env.EXECUTIVE_BUNDLE_HTML_PATH
  ?? 'D:/SNF AI Dashboard/data/exports/executive-command-center/current/executive-command-center.html';

test('executive command center bundle renders expected sections', async ({ page }) => {
  const bundleUrl = pathToFileURL(path.resolve(bundlePath)).href;

  await page.goto(bundleUrl);

  await expect(page.getByRole('heading', { name: 'SNF Executive Command Center' })).toBeVisible();
  await expect(page.getByText('Current Residents', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Top Priority Residents' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Patient Insights' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Documentation by Discipline' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Therapy by Discipline' })).toBeVisible();

  const pageText = await page.locator('body').innerText();
  expect(pageText).not.toContain('The . operator cannot be used on Unknown values.');
  expect(pageText).not.toContain('Incompatible type comparison');
});

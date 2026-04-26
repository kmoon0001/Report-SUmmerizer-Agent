import { chromium } from 'playwright';
import path from 'node:path';

const ROOT = path.resolve('D:/my agents copilot studio/Sharepoint SLP Portal');
const SITE_URL = 'https://ensignservices.sharepoint.com/sites/PacificCoast_SLP';
const AUTH_STATE = path.join(ROOT, '.sharepoint-auth-state.json');

async function isLoggedIn(page) {
  try {
    await page.goto(SITE_URL, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
    return await page.evaluate(async () => {
      const response = await fetch('/sites/PacificCoast_SLP/_api/web?$select=Title,Url', {
        headers: { Accept: 'application/json;odata=nometadata' }
      });
      if (!response.ok) return false;
      const payload = await response.json();
      return Boolean(payload?.Title);
    });
  } catch {
    return false;
  }
}

const browser = await chromium.launch({
  headless: false,
  args: ['--start-maximized']
});

const context = await browser.newContext({
  storageState: AUTH_STATE,
  viewport: null
});

const page = await context.newPage();

if (await isLoggedIn(page)) {
  await context.storageState({ path: AUTH_STATE });
  console.log(JSON.stringify({
    ok: true,
    message: 'Existing SharePoint auth state is valid and has been re-saved.',
    authState: AUTH_STATE
  }, null, 2));
  await browser.close();
  process.exit(0);
}

await page.goto(SITE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });

console.log([
  'A browser window is open for Microsoft/SharePoint login.',
  'Complete password and MFA manually in that browser.',
  'This script will save the session after the Pacific Coast SLP site loads.'
].join('\n'));

const deadline = Date.now() + 10 * 60 * 1000;
let loggedIn = false;

while (Date.now() < deadline) {
  await page.waitForTimeout(3000);
  loggedIn = await isLoggedIn(page);
  if (loggedIn) break;
  if (!page.url().startsWith(SITE_URL)) {
    await page.goto(SITE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
  }
}

if (!loggedIn) {
  console.error(JSON.stringify({
    ok: false,
    message: 'Timed out waiting for manual Microsoft login/MFA to complete.',
    authState: AUTH_STATE
  }, null, 2));
  await browser.close();
  process.exit(1);
}

await context.storageState({ path: AUTH_STATE });
console.log(JSON.stringify({
  ok: true,
  message: 'SharePoint auth state refreshed.',
  authState: AUTH_STATE
}, null, 2));

await browser.close();

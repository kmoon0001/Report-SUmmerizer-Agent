import { chromium } from 'playwright';
import path from 'node:path';

const ROOT = path.resolve('D:/my agents copilot studio/Sharepoint SLP Portal');
const SITE_URL = 'https://ensignservices.sharepoint.com/sites/PacificCoast_SLP';
const AUTH_STATE = path.join(ROOT, '.sharepoint-auth-state.json');

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState: AUTH_STATE });
  const page = await context.newPage();

  try {
    await page.goto(SITE_URL, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    const payload = await page.evaluate(async () => {
      const response = await fetch('/sites/PacificCoast_SLP/_api/web?$select=Title,Url', {
        headers: { Accept: 'application/json;odata=nometadata' }
      });
      const text = await response.text();
      let json = null;
      try {
        json = JSON.parse(text);
      } catch {}
      return { ok: response.ok, status: response.status, json, text: text.slice(0, 300) };
    });

    const ok = Boolean(payload.ok && payload.json?.Title);
    const result = {
      ok,
      siteUrl: SITE_URL,
      title: payload.json?.Title || null,
      status: payload.status,
      currentUrl: page.url(),
      message: ok
        ? 'SharePoint auth state is valid.'
        : 'SharePoint auth state did not return the expected site payload.'
    };

    console.log(JSON.stringify(result, null, 2));
    if (!ok) process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

await main();

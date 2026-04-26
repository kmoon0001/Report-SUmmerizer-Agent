import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium, request } from 'playwright';

const ROOT = path.resolve('D:/my agents copilot studio/Sharepoint SLP Portal');
const SITE_URL = 'https://ensignservices.sharepoint.com/sites/PacificCoast_SLP';
const AUTH_STATE = path.join(ROOT, '.sharepoint-auth-state.json');
const OUT_DIR = path.join(ROOT, 'output/sharepoint-native-bridge');

function toAbsoluteSharePointUrl(href) {
  return href.startsWith('http') ? href : `https://ensignservices.sharepoint.com${href}`;
}

function isInternalSharePointLink(href) {
  return href.startsWith('/sites/PacificCoast_SLP/') || href.startsWith(SITE_URL);
}

function isExternalHttpLink(href) {
  return /^https?:\/\//i.test(href) && !href.startsWith(SITE_URL);
}

function looksLikeNotFound(text) {
  return /404|page cannot be found|page not found|not found|does not exist|sorry! that page cannot be found/i.test(text.slice(0, 4000));
}

async function collectBridgeHrefs() {
  const files = (await readdir(OUT_DIR)).filter((file) => file.endsWith('.html'));
  const hrefs = new Set();

  for (const file of files) {
    const html = await readFile(path.join(OUT_DIR, file), 'utf8');
    for (const match of html.matchAll(/href="([^"]+)"/g)) {
      const href = match[1];
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        continue;
      }
      hrefs.add(href);
    }
  }

  return {
    files,
    hrefs: [...hrefs].sort()
  };
}

async function checkLink(context, href, { internal = false } = {}) {
  const url = internal ? toAbsoluteSharePointUrl(href) : href;
  const item = { href, url };

  try {
    const response = await context.get(url, {
      timeout: 20000,
      maxRedirects: 8,
      failOnStatusCode: false
    });
    const contentType = response.headers()['content-type'] || '';
    const isDownload = /application\/pdf|application\/octet-stream|application\/vnd/i.test(contentType);
    const text = isDownload ? '' : await response.text().catch(() => '');

    return {
      ...item,
      finalUrl: response.url(),
      status: response.status(),
      ok: response.ok() && (isDownload || !looksLikeNotFound(text)),
      contentType,
      downloadLike: isDownload,
      notFoundText: isDownload ? false : looksLikeNotFound(text)
    };
  } catch (error) {
    return {
      ...item,
      status: null,
      ok: false,
      error: error.message
    };
  }
}

async function checkAll(context, links, options) {
  const results = [];
  const queue = [...links];
  const workers = Array.from({ length: Math.min(8, queue.length || 1) }, async () => {
    while (queue.length > 0) {
      const href = queue.shift();
      results.push(await checkLink(context, href, options));
    }
  });

  await Promise.all(workers);
  return results.sort((a, b) => a.href.localeCompare(b.href));
}

async function checkInternalBrowserLinks(links) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState: AUTH_STATE });
  const queue = [...links];
  const results = [];
  const workers = Array.from({ length: Math.min(6, queue.length || 1) }, async () => {
    const page = await context.newPage();
    while (queue.length > 0) {
      const href = queue.shift();
      const url = toAbsoluteSharePointUrl(href);
      const item = { href, url };

      try {
        const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 35000 });
        const title = await page.title().catch(() => '');
        const body = await page.locator('body').innerText({ timeout: 4000 }).catch(() => '');
        results.push({
          ...item,
          finalUrl: page.url(),
          status: response?.status() ?? null,
          ok: Boolean(response?.ok()) && !looksLikeNotFound(`${title}\n${body}`),
          title: title.slice(0, 120),
          notFoundText: looksLikeNotFound(`${title}\n${body}`)
        });
      } catch (error) {
        results.push({
          ...item,
          status: null,
          ok: false,
          error: error.message
        });
      }
    }
    await page.close();
  });

  await Promise.all(workers);
  await context.close();
  await browser.close();
  return results.sort((a, b) => a.href.localeCompare(b.href));
}

await mkdir(OUT_DIR, { recursive: true });

const { files, hrefs } = await collectBridgeHrefs();
const internal = hrefs.filter(isInternalSharePointLink);
const external = hrefs.filter(isExternalHttpLink);

const externalContext = await request.newContext();

const [internalResults, externalResults] = await Promise.all([
  checkInternalBrowserLinks(internal),
  checkAll(externalContext, external)
]);

await externalContext.dispose();

const report = {
  checkedAt: new Date().toISOString(),
  siteUrl: SITE_URL,
  bridgePages: files.length,
  totalLinks: hrefs.length,
  internalLinks: internal.length,
  externalLinks: external.length,
  internalResults,
  externalResults,
  failedInternal: internalResults.filter((item) => !item.ok),
  failedExternal: externalResults.filter((item) => !item.ok)
};
report.pass = report.failedInternal.length === 0 && report.failedExternal.length === 0;

const markdown = [
  '# SharePoint Bridge Link Audit',
  '',
  `Generated: ${report.checkedAt}`,
  '',
  `Overall pass: ${report.pass ? 'PASS' : 'FAIL'}`,
  '',
  `Bridge pages: ${report.bridgePages}`,
  `Internal links: ${report.internalLinks}`,
  `External links: ${report.externalLinks}`,
  '',
  '## Failures',
  '',
  ...[...report.failedInternal, ...report.failedExternal].map((item) => `- ${item.href} (${item.status ?? 'no status'}): ${item.error || item.contentType || 'failed'}`)
].join('\n');

await writeFile(path.join(OUT_DIR, 'link-audit-report.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
await writeFile(path.join(OUT_DIR, 'link-audit-report.md'), `${markdown}\n`, 'utf8');

console.log(JSON.stringify({
  pass: report.pass,
  bridgePages: report.bridgePages,
  internalLinks: report.internalLinks,
  externalLinks: report.externalLinks,
  failedInternal: report.failedInternal.length,
  failedExternal: report.failedExternal.length,
  outputs: [
    path.join(OUT_DIR, 'link-audit-report.json'),
    path.join(OUT_DIR, 'link-audit-report.md')
  ]
}, null, 2));

process.exit(report.pass ? 0 : 1);

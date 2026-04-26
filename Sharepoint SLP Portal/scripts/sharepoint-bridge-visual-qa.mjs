import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const ROOT = path.resolve('D:/my agents copilot studio/Sharepoint SLP Portal');
const SITE_URL = 'https://ensignservices.sharepoint.com/sites/PacificCoast_SLP';
const AUTH_STATE = path.join(ROOT, '.sharepoint-auth-state.json');
const OUT_DIR = path.join(ROOT, 'output/sharepoint-native-bridge/visual-qa');

const samplePages = [
  'SLP-Portal.aspx',
  'SLP-Dysphagia.aspx',
  'SLP-Documentation-Studio.aspx',
  'SLP-Clinical-Pathways.aspx',
  'SLP-Clinical-Library.aspx',
  'SLP-Knowledge-Source-Index.aspx',
  'SLP-SPFx-Production-Handoff.aspx',
  'SLP-Help-Support.aspx'
];

const viewports = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'mobile', width: 390, height: 844 }
];

function pageUrl(fileName) {
  return `${SITE_URL}/SitePages/${fileName}`;
}

function screenshotName(viewport, fileName) {
  return `${viewport.name}-${fileName.replace(/\.aspx$/i, '').toLowerCase()}.png`;
}

await mkdir(OUT_DIR, { recursive: true });

const browser = await chromium.launch({ headless: true });
const results = [];

for (const viewport of viewports) {
  const context = await browser.newContext({
    storageState: AUTH_STATE,
    viewport: { width: viewport.width, height: viewport.height }
  });
  const page = await context.newPage();

  for (const fileName of samplePages) {
    const url = pageUrl(fileName);
    const item = { fileName, viewport: viewport.name, url };
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(2500);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: path.join(OUT_DIR, screenshotName(viewport, fileName)), fullPage: true });

      const checks = await page.evaluate(() => {
        const body = document.body.innerText || '';
        const images = Array.from(document.images).filter((image) => image.src.includes('/SiteAssets/SLP-Portal-Migration/'));
        const forms = document.querySelectorAll('form,input,textarea');
        return {
          title: document.querySelector('h1')?.innerText || document.title,
          bodyLength: body.length,
          hasGuardrails: body.includes('No patient tracker') && body.includes('Do not paste patient-specific'),
          hasWorkflowSurfaces: body.includes('Generalized workflow surfaces'),
          hasTemplateShells: body.includes('Template-mode workflow shells'),
          formFieldCount: forms.length,
          imageCount: images.length,
          failedImages: images.filter((image) => image.naturalWidth === 0).map((image) => image.src),
          horizontalOverflowPx: Math.max(0, document.documentElement.scrollWidth - window.innerWidth),
          hasRenderedNullishText: /undefined|null/.test(body)
        };
      });

      Object.assign(item, checks, {
          screenshot: path.join(OUT_DIR, screenshotName(viewport, fileName)),
          pass: Boolean(checks.title)
            && checks.hasGuardrails
            && checks.hasWorkflowSurfaces
            && checks.hasTemplateShells
            && checks.imageCount > 0
            && checks.failedImages.length === 0
            && !checks.hasRenderedNullishText
      });
    } catch (error) {
      Object.assign(item, {
        pass: false,
        error: error.message
      });
    }
    results.push(item);
  }

  await page.close();
  await context.close();
}

await browser.close();

const report = {
  checkedAt: new Date().toISOString(),
  siteUrl: SITE_URL,
  samplePages,
  viewports,
  pass: results.every((item) => item.pass),
  results
};

const markdown = [
  '# SharePoint Bridge Visual QA',
  '',
  `Generated: ${report.checkedAt}`,
  '',
  `Overall pass: ${report.pass ? 'PASS' : 'FAIL'}`,
  '',
  '| Viewport | Page | Pass | Images | Overflow px | Screenshot |',
  '| --- | --- | --- | ---: | ---: | --- |',
  ...results.map((item) => `| ${item.viewport} | ${item.fileName} | ${item.pass ? 'PASS' : 'FAIL'} | ${item.imageCount ?? 0} | ${item.horizontalOverflowPx ?? 'n/a'} | ${item.screenshot || ''} |`)
].join('\n');

await writeFile(path.join(OUT_DIR, 'visual-qa-report.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
await writeFile(path.join(OUT_DIR, 'visual-qa-report.md'), `${markdown}\n`, 'utf8');

console.log(JSON.stringify({
  pass: report.pass,
  checked: results.length,
  failed: results.filter((item) => !item.pass).map((item) => ({
    viewport: item.viewport,
    fileName: item.fileName,
    error: item.error || null
  })),
  outputs: [
    path.join(OUT_DIR, 'visual-qa-report.json'),
    path.join(OUT_DIR, 'visual-qa-report.md')
  ]
}, null, 2));

if (!report.pass) {
  process.exitCode = 1;
}

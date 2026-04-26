import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const ROOT = path.resolve('D:/my agents copilot studio/Sharepoint SLP Portal');
const SITE_URL = 'https://ensignservices.sharepoint.com/sites/PacificCoast_SLP';
const AUTH_STATE = path.join(ROOT, '.sharepoint-auth-state.json');
const OUT_DIR = path.join(ROOT, 'output/sharepoint-native-bridge');

const expectedPages = [
  'SLP-Portal.aspx',
  'SLP-Dysphagia.aspx',
  'SLP-Aphasia.aspx',
  'SLP-Cognitive-Communication.aspx',
  'SLP-Motor-Speech.aspx',
  'SLP-Voice.aspx',
  'SLP-AAC.aspx',
  'SLP-Medicare-Compliance.aspx',
  'SLP-Documentation-Studio.aspx',
  'SLP-IDDSI.aspx',
  'SLP-Instrumentals.aspx',
  'SLP-Trach-Vent.aspx',
  'SLP-Anatomy-Neuro.aspx',
  'SLP-Goal-Bank.aspx',
  'SLP-Treatment-Ideas.aspx',
  'SLP-Quick-Reference.aspx',
  'SLP-Coding-Reference.aspx',
  'SLP-Clinical-Pathways.aspx',
  'SLP-Ensign-Corner.aspx',
  'SLP-Staff-Learning.aspx',
  'SLP-Document-Library-Guide.aspx',
  'SLP-Clinical-Calculators.aspx',
  'SLP-Clinical-Exams.aspx',
  'SLP-Meds-Labs-Imaging.aspx',
  'SLP-Outcome-Measures.aspx',
  'SLP-Handout-Reference.aspx',
  'SLP-AAC-Boards.aspx',
  'SLP-Quality-Evidence.aspx',
  'SLP-Clinical-Reference.aspx',
  'SLP-Medicare-Audit-Candidacy.aspx',
  'SLP-Trajectory-Analytics.aspx',
  'SLP-Clinical-Safety.aspx',
  'SLP-Life-Wellness.aspx',
  'SLP-Knowledge-Source-Index.aspx'
];

const blockedNavigationTitles = [
  'Remote learning',
  'Courses',
  'Learn a new language',
  'Learn a new skill',
  'Get involved',
  '/QM_Mock_Data',
  'SLP_Patients',
  'SLP_SessionNotes',
  'SLP_Goals',
  'SLP_ReviewQueue'
];

function evaluatePageFields(fileName, title, canvas, wiki) {
  const text = `${canvas || ''}\n${wiki || ''}`;
  return {
    fileName,
    title,
    exists: true,
    hasNoFormFields: !/<input|<textarea|<form/i.test(text),
    hasGuardrails: text.includes('No patient tracker') && text.includes('Do not paste patient-specific'),
    hasAuthoritativeLinks: /asha\.org|cms\.gov|medicare\.gov/.test(text),
    hasSpfxPending: /SPFx pending|SPFx-pending/.test(text),
    hasImages: /<img /i.test(text),
    hasCanvas: Boolean(canvas),
    hasWiki: Boolean(wiki)
  };
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  storageState: AUTH_STATE,
  viewport: { width: 1440, height: 1000 }
});
const page = await context.newPage();
await page.goto(`${SITE_URL}/SitePages/SLP-Portal.aspx`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(3000);

const rest = await page.evaluate(async ({ expectedPages, blockedNavigationTitles }) => {
  const api = '/sites/PacificCoast_SLP/_api';
  const web = await fetch(`${api}/web?$select=WelcomePage`, {
    headers: { Accept: 'application/json;odata=nometadata' }
  }).then((response) => response.json());

  const pageResults = [];
  for (const fileName of expectedPages) {
    const response = await fetch(`${api}/web/GetFileByServerRelativeUrl('/sites/PacificCoast_SLP/SitePages/${fileName}')/ListItemAllFields?$select=Title,CanvasContent1,WikiField`, {
      headers: { Accept: 'application/json;odata=nometadata' }
    });
    if (!response.ok) {
      pageResults.push({ fileName, exists: false, status: response.status, body: await response.text() });
      continue;
    }
    const item = await response.json();
    pageResults.push({
      fileName,
      title: item.Title,
      canvas: item.CanvasContent1,
      wiki: item.WikiField
    });
  }

  const top = await fetch(`${api}/web/navigation/QuickLaunch`, {
    headers: { Accept: 'application/json;odata=nometadata' }
  }).then((response) => response.json());
  const navNodes = [];
  for (const node of top.value || []) {
    const children = await fetch(`${api}/web/navigation/GetNodeById(${node.Id})/Children`, {
      headers: { Accept: 'application/json;odata=nometadata' }
    }).then((response) => response.json()).catch(() => ({ value: [] }));
    navNodes.push({ title: node.Title, url: node.Url, children: (children.value || []).map((child) => ({ title: child.Title, url: child.Url })) });
  }

  const blocked = [];
  const blockedSet = new Set(blockedNavigationTitles.map((title) => title.toLowerCase()));
  for (const node of navNodes) {
    if (blockedSet.has(String(node.title).toLowerCase())) blocked.push(node.title);
    for (const child of node.children) {
      if (blockedSet.has(String(child.title).toLowerCase())) blocked.push(child.title);
    }
  }

  return { web, pageResults, navNodes, blocked };
}, { expectedPages, blockedNavigationTitles });

const pageChecks = rest.pageResults.map((item) => {
  if (!item.exists && item.exists !== undefined) return item;
  return evaluatePageFields(item.fileName, item.title, item.canvas, item.wiki);
});

await page.goto(`${SITE_URL}/SitePages/SLP-Portal.aspx`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(6000);
for (let y = 0; y <= 4200; y += 700) {
  await page.evaluate((value) => window.scrollTo(0, value), y);
  await page.waitForTimeout(500);
}

const dom = await page.evaluate(async () => {
  const body = document.body.innerText;
  const imgs = Array.from(document.images).filter((img) => img.src.includes('/SiteAssets/SLP-Portal-Migration/'));
  await Promise.all(imgs.map((img) => img.decode?.().catch(() => {}) || Promise.resolve()));
  return {
    url: location.href,
    hasTitle: body.includes('Pacific Coast SLP Portal'),
    hasLaunchActions: body.includes('Launch actions'),
    hasServiceMap: body.includes('SLP service map'),
    hasPortalMap: body.includes('Portal map'),
    hasGuardrails: body.includes('No patient tracker'),
    imageCount: imgs.length,
    loadedImages: imgs.filter((img) => img.naturalWidth > 0).length,
    failedImages: imgs.filter((img) => img.naturalWidth === 0).map((img) => img.src)
  };
});

await browser.close();

const report = {
  checkedAt: new Date().toISOString(),
  siteUrl: SITE_URL,
  homepageOk: rest.web.WelcomePage === 'SitePages/SLP-Portal.aspx',
  blockedNavigationOk: rest.blocked.length === 0,
  pageChecks,
  dom,
  navNodes: rest.navNodes,
  pass: rest.web.WelcomePage === 'SitePages/SLP-Portal.aspx'
    && rest.blocked.length === 0
    && pageChecks.every((check) => check.exists && check.hasNoFormFields && check.hasGuardrails && check.hasAuthoritativeLinks && check.hasSpfxPending && check.hasImages && check.hasCanvas && check.hasWiki)
    && dom.hasTitle
    && dom.hasLaunchActions
    && dom.hasServiceMap
    && dom.hasPortalMap
    && dom.hasGuardrails
    && dom.imageCount >= 9
    && dom.loadedImages === dom.imageCount
};

await mkdir(OUT_DIR, { recursive: true });
await writeFile(path.join(OUT_DIR, 'validation-report.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');

console.log(JSON.stringify(report, null, 2));
if (!report.pass) {
  process.exitCode = 1;
}

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const ROOT = path.resolve('D:/my agents copilot studio/Sharepoint SLP Portal');
const OUT_DIR = path.join(ROOT, 'output/sharepoint-native-bridge');
const offline = process.argv.includes('--offline');

const expectedPageCount = 46;
const requiredTextChecks = [
  { key: 'hasGuardrails', pattern: /No patient tracker[\s\S]*Do not paste patient-specific/i },
  { key: 'hasWorkflowSurfaces', pattern: /Generalized workflow surfaces/i },
  { key: 'hasTemplateShells', pattern: /Template-mode workflow shells/i },
  { key: 'hasSpfxPending', pattern: /SPFx pending|SPFx-pending/i },
  { key: 'hasAuthoritativeLinks', pattern: /asha\.org|cms\.gov|medicare\.gov|learn\.microsoft\.com/i },
  { key: 'hasImages', pattern: /<img\s/i },
  { key: 'hasNoFormFields', pattern: /^(?![\s\S]*(<form|<input|<textarea))/i },
  { key: 'hasNoRenderedNullishText', pattern: /^(?![\s\S]*(undefined|null))/i }
];

async function runNodeScript(script, args = []) {
  try {
    const result = await execFileAsync('node', [script, ...args], {
      cwd: ROOT,
      timeout: 600000,
      maxBuffer: 1024 * 1024 * 40
    });
    return { ok: true, stdout: result.stdout, stderr: result.stderr };
  } catch (error) {
    return {
      ok: false,
      message: error.message,
      stdout: error.stdout || '',
      stderr: error.stderr || ''
    };
  }
}

function pagePreviewName(fileName) {
  return fileName.replace(/\.aspx$/i, '.html');
}

function evaluateHtml(fileName, html) {
  const checks = Object.fromEntries(requiredTextChecks.map((check) => [check.key, check.pattern.test(html)]));
  const failures = Object.entries(checks)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  return {
    fileName,
    ...checks,
    pass: failures.length === 0,
    failures
  };
}

async function readPreviewReport() {
  const manifest = JSON.parse(await readFile(path.join(OUT_DIR, 'manifest.json'), 'utf8'));
  const manifestPages = Array.isArray(manifest) ? manifest : manifest.pages || [];
  const pages = [];
  for (const page of manifestPages) {
    const html = await readFile(path.join(OUT_DIR, pagePreviewName(page.fileName)), 'utf8');
    pages.push(evaluateHtml(page.fileName, html));
  }

  const pageCountOk = pages.length === expectedPageCount;
  const allPagesPass = pages.every((page) => page.pass);
  return {
    expectedPageCount,
    actualPageCount: pages.length,
    pageCountOk,
    allPagesPass,
    failedPages: pages.filter((page) => !page.pass),
    pages
  };
}

async function readLiveValidationReport() {
  if (offline) return { skipped: true, reason: 'offline mode' };
  const validation = await runNodeScript('scripts/validate-sharepoint-native-bridge.mjs');
  let parsed = null;
  try {
    parsed = JSON.parse(validation.stdout.slice(validation.stdout.indexOf('{')));
  } catch {}
  return {
    skipped: false,
    commandOk: validation.ok,
    pass: Boolean(parsed?.pass),
    pages: parsed?.pageChecks?.length || 0,
    failedPages: (parsed?.pageChecks || [])
      .filter((page) => !(page.exists && page.hasNoFormFields && page.hasGuardrails && page.hasAuthoritativeLinks && page.hasSpfxPending && page.hasWorkflowSurfaces && page.hasTemplateShells && page.hasNoUndefinedText && page.hasImages && page.hasCanvas && page.hasWiki))
      .map((page) => page.fileName),
    dom: parsed?.dom || null,
    stdoutTail: validation.stdout.slice(-2000),
    stderrTail: validation.stderr.slice(-2000)
  };
}

function markdownReport(report) {
  const lines = [
    '# SharePoint Bridge QA Report',
    '',
    `Generated: ${report.checkedAt}`,
    '',
    '## Summary',
    '',
    `- Overall pass: ${report.pass ? 'PASS' : 'FAIL'}`,
    `- Preview dry run: ${report.dryRun.ok ? 'PASS' : 'FAIL'}`,
    `- Preview page count: ${report.preview.actualPageCount}/${report.preview.expectedPageCount}`,
    `- Preview content gates: ${report.preview.allPagesPass ? 'PASS' : 'FAIL'}`,
    `- Live validation: ${report.live.skipped ? `SKIPPED (${report.live.reason})` : report.live.pass ? 'PASS' : 'FAIL'}`,
    '',
    '## Gates',
    '',
    '- no form/input/textarea fields',
    '- PHI guardrail text present',
    '- authoritative ASHA/CMS/Medicare.gov/Microsoft Learn links present',
    '- SPFx pending boundary text present',
    '- generalized workflow surfaces present',
    '- template-mode workflow shells present',
    '- no rendered `undefined` or `null` text',
    '- SharePoint-hosted images present',
    ''
  ];

  if (report.preview.failedPages.length) {
    lines.push('## Failed Preview Pages', '');
    for (const page of report.preview.failedPages) {
      lines.push(`- ${page.fileName}: ${page.failures.join(', ')}`);
    }
    lines.push('');
  }

  if (!report.live.skipped && report.live.failedPages.length) {
    lines.push('## Failed Live Pages', '');
    for (const fileName of report.live.failedPages) lines.push(`- ${fileName}`);
    lines.push('');
  }

  if (report.live.dom) {
    lines.push('## Live DOM', '');
    lines.push(`- URL: ${report.live.dom.url}`);
    lines.push(`- Images loaded: ${report.live.dom.loadedImages}/${report.live.dom.imageCount}`);
    lines.push(`- Failed images: ${(report.live.dom.failedImages || []).length}`);
    lines.push('');
  }

  return `${lines.join('\n')}\n`;
}

const dryRun = await runNodeScript('scripts/sharepoint-native-bridge.mjs');
const preview = dryRun.ok
  ? await readPreviewReport()
  : {
      expectedPageCount,
      actualPageCount: 0,
      pageCountOk: false,
      allPagesPass: false,
      failedPages: [],
      pages: []
    };
const live = await readLiveValidationReport();

const report = {
  checkedAt: new Date().toISOString(),
  dryRun,
  preview,
  live,
  pass: dryRun.ok
    && preview.pageCountOk
    && preview.allPagesPass
    && (live.skipped || (live.commandOk && live.pass && live.failedPages.length === 0))
};

await mkdir(OUT_DIR, { recursive: true });
await writeFile(path.join(OUT_DIR, 'qa-report.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
await writeFile(path.join(OUT_DIR, 'qa-report.md'), markdownReport(report), 'utf8');

console.log(JSON.stringify({
  pass: report.pass,
  preview: {
    pages: report.preview.actualPageCount,
    failedPages: report.preview.failedPages.map((page) => ({ fileName: page.fileName, failures: page.failures }))
  },
  live: report.live.skipped
    ? { skipped: true, reason: report.live.reason }
    : {
        pass: report.live.pass,
        pages: report.live.pages,
        failedPages: report.live.failedPages,
        dom: report.live.dom
      },
  outputs: [
    path.join(OUT_DIR, 'qa-report.json'),
    path.join(OUT_DIR, 'qa-report.md')
  ]
}, null, 2));

if (!report.pass) {
  process.exitCode = 1;
}

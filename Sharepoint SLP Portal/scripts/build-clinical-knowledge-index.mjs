import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const ROOT = path.resolve('D:/my agents copilot studio/Sharepoint SLP Portal');
const OUT_DIR = path.join(ROOT, 'output/sharepoint-native-bridge');
const KNOWLEDGE_DIR = path.join(ROOT, 'knowledge-base');
const SITE_URL = 'https://ensignservices.sharepoint.com/sites/PacificCoast_SLP';
const SITE_API = '/sites/PacificCoast_SLP/_api';
const AUTH_STATE = path.join(ROOT, '.sharepoint-auth-state.json');

const includeSharePoint = process.argv.includes('--sharepoint');

const sourceLibraries = [
  'SLP_Portal_Source_PDFs',
  'SLP_ClinicalKnowledge'
];

const blockedLists = new Set([
  'SLP_Patients',
  'SLP_SessionNotes',
  'SLP_Goals',
  'SLP_ReviewQueue'
]);

const clinicalAreas = [
  { label: 'Dysphagia', terms: ['dysphagia', 'swallow', 'swallowing', 'iddsi', 'mbss', 'vfss', 'fees', 'aspiration', 'diet texture'] },
  { label: 'Aphasia', terms: ['aphasia', 'anomia', 'vnest', 'semantic', 'script training', 'language'] },
  { label: 'Cognitive-Communication', terms: ['cognitive', 'cognition', 'memory', 'attention', 'executive', 'problem solving'] },
  { label: 'Motor Speech', terms: ['motor speech', 'dysarthria', 'apraxia', 'lsvt', 'cueing'] },
  { label: 'Voice', terms: ['voice', 'vocal', 'phonation', 'respiratory', 'resonance'] },
  { label: 'AAC', terms: ['aac', 'augmentative', 'alternative communication', 'communication board'] },
  { label: 'Trach/Vent', terms: ['trach', 'tracheostomy', 'vent', 'cuff', 'speaking valve', 'decannulation'] },
  { label: 'Medicare/Compliance', terms: ['medicare', 'cms', 'billing', 'coding', 'cpt', 'medical necessity', 'compliance'] },
  { label: 'Goal Bank', terms: ['goal', 'smart goal', 'goal bank'] },
  { label: 'Treatment Ideas', terms: ['treatment', 'therapy activity', 'intervention', 'exercise'] },
  { label: 'Staff Learning', terms: ['quiz', 'learning', 'training', 'education'] }
];

const sourceTypes = [
  { label: 'Clinical Protocol', terms: ['protocol', 'guideline', 'standard', 'pathway'] },
  { label: 'Reference Table', terms: ['data', 'coding', 'calculator', 'norms', 'outcome'] },
  { label: 'Treatment Library', terms: ['treatment', 'intervention', 'exercise', 'activity'] },
  { label: 'Goal Template', terms: ['goal', 'smart'] },
  { label: 'Compliance Reference', terms: ['medicare', 'cms', 'billing', 'compliance', 'coding'] },
  { label: 'Learning Content', terms: ['quiz', 'learning', 'training', 'education'] }
];

const phiPatterns = [
  /\bMRN\b/i,
  /\bDOB\b/i,
  /\bdate of birth\b/i,
  /\broom\s*[#:]?\s*\d+/i,
  /\bresident name\b/i,
  /\bpatient name\b/i,
  /\bSSN\b/i,
  /\bmedical record\b/i
];

function detectDiscipline(text, relativePath) {
  const haystack = `${relativePath} ${text}`.toLowerCase();
  const fileName = path.basename(relativePath).toLowerCase();
  if (fileName.startsWith('pt-') || /physical therapy|\bpt\b/.test(haystack)) return 'PT-adjacent';
  if (fileName.startsWith('ot-') || /occupational therapy|\bot\b/.test(haystack)) return 'OT-adjacent';
  if (/slp|speech-language|speech language|aphasia|dysphagia|aac|voice|motor speech|trach|swallow/.test(haystack)) return 'SLP';
  return 'Cross-discipline';
}

function decodeBuffer(buffer) {
  if (buffer[0] === 0xff && buffer[1] === 0xfe) {
    return buffer.toString('utf16le').replace(/^\uFEFF/, '');
  }
  const sample = buffer.subarray(0, Math.min(buffer.length, 200));
  const zeroCount = sample.filter((byte) => byte === 0).length;
  if (zeroCount > sample.length * 0.2) {
    return buffer.toString('utf16le').replace(/^\uFEFF/, '');
  }
  return buffer.toString('utf8').replace(/^\uFEFF/, '');
}

function normalizeWhitespace(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function titleFromFile(relativePath, text) {
  const heading = text.match(/^#\s+(.+)$/m);
  if (heading) return normalizeWhitespace(heading[1]);
  return path.basename(relativePath, path.extname(relativePath))
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function classify(text, relativePath, candidates, fallback) {
  const haystack = `${relativePath} ${text}`.toLowerCase();
  const scores = candidates.map((candidate) => ({
    label: candidate.label,
    score: candidate.terms.reduce((total, term) => total + (haystack.includes(term.toLowerCase()) ? 1 : 0), 0)
  })).sort((a, b) => b.score - a.score);
  return scores[0]?.score > 0 ? scores[0].label : fallback;
}

function extractHighlights(text) {
  const bullets = text
    .split(/\r?\n/)
    .map((line) => line.match(/^\s*[-*]\s+(.+)$/)?.[1])
    .filter(Boolean)
    .map(normalizeWhitespace)
    .filter((line) => line.length >= 8 && line.length <= 180);

  if (bullets.length) return bullets.slice(0, 6);

  return text
    .split(/[.!?]\s+/)
    .map(normalizeWhitespace)
    .filter((line) => line.length >= 30 && line.length <= 180)
    .slice(0, 4);
}

function detectGuardrails(text) {
  const matches = phiPatterns.filter((pattern) => pattern.test(text)).map((pattern) => pattern.source);
  return {
    phiRisk: matches.length ? 'needs-review' : 'low',
    matchedPatterns: matches,
    recommendedUse: matches.length
      ? 'Do not publish into SharePoint/Copilot until manually reviewed for PHI.'
      : 'Eligible for non-PHI SharePoint reference indexing after clinical/source review.'
  };
}

function reviewStatusFor({ guardrails, discipline }) {
  if (guardrails.phiRisk !== 'low') return 'hold';
  if (discipline === 'PT-adjacent' || discipline === 'OT-adjacent') return 'adjacent-rehab-review';
  return 'candidate';
}

async function listFiles(dir) {
  const output = [];
  async function walk(current) {
    const entries = await readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (/\.(md|txt|json|ts|tsx)$/i.test(entry.name)) {
        output.push(fullPath);
      }
    }
  }
  await walk(dir);
  return output;
}

async function buildLocalIndex() {
  const files = await listFiles(KNOWLEDGE_DIR);
  const items = [];

  for (const fullPath of files) {
    const relativePath = path.relative(ROOT, fullPath).replaceAll('\\', '/');
    const info = await stat(fullPath);
    const text = decodeBuffer(await readFile(fullPath));
    const normalized = normalizeWhitespace(text);
    const area = classify(normalized, relativePath, clinicalAreas, 'General SLP Reference');
    const documentType = classify(normalized, relativePath, sourceTypes, 'Reference Content');
    const discipline = detectDiscipline(normalized, relativePath);
    const guardrails = detectGuardrails(normalized);
    const reviewStatus = reviewStatusFor({ guardrails, discipline });

    items.push({
      sourceKind: 'local-file',
      title: titleFromFile(relativePath, text),
      sourcePath: relativePath,
      fileName: path.basename(fullPath),
      extension: path.extname(fullPath).replace('.', '').toLowerCase(),
      clinicalArea: area,
      discipline,
      documentType,
      audience: area === 'Medicare/Compliance' ? 'SLP, Rehab Leadership, Billing Review' : 'SLP, Rehab Team',
      phiReviewed: guardrails.phiRisk === 'low' ? 'not-required-by-pattern-scan' : 'manual-review-required',
      reviewStatus,
      guardrails,
      highlights: extractHighlights(text),
      wordCount: normalized ? normalized.split(/\s+/).length : 0,
      sizeBytes: info.size
    });
  }

  return items.sort((a, b) => a.clinicalArea.localeCompare(b.clinicalArea) || a.title.localeCompare(b.title));
}

async function buildSharePointIndex() {
  if (!includeSharePoint) return [];

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState: AUTH_STATE });
  const page = await context.newPage();

  try {
    await page.goto(`${SITE_URL}/SitePages/SLP-Portal.aspx`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    return await page.evaluate(async ({ sourceLibraries, blockedLists }) => {
      const blocked = new Set(blockedLists);
      const results = [];

      for (const title of sourceLibraries) {
        if (blocked.has(title)) continue;

        const url = `${location.origin}/sites/PacificCoast_SLP/_api/web/lists/getbytitle('${encodeURIComponent(title).replace(/'/g, "''")}')/items?$select=Id,Title,FileLeafRef,FileRef,Modified,FSObjType&$top=5000`;
        const response = await fetch(url, { headers: { Accept: 'application/json;odata=nometadata' } });
        if (!response.ok) {
          results.push({ sourceKind: 'sharepoint-error', sourceLibrary: title, status: response.status, message: await response.text() });
          continue;
        }

        const json = await response.json();
        for (const item of json.value || []) {
          if (item.FSObjType === 1) continue;
          const fileName = item.FileLeafRef || item.Title || `item-${item.Id}`;
          results.push({
            sourceKind: 'sharepoint-library-item',
            sourceLibrary: title,
            title: item.Title || fileName,
            fileName,
            sourceUrl: item.FileRef,
            modified: item.Modified,
            extension: String(fileName).split('.').pop()?.toLowerCase() || '',
            clinicalArea: 'Unclassified Source Library Item',
            discipline: 'metadata-only',
            documentType: 'Source File',
            audience: 'SLP, Rehab Team',
            phiReviewed: 'manual-review-required',
            reviewStatus: 'source-metadata-only',
            guardrails: {
              phiRisk: 'unknown',
              recommendedUse: 'Metadata only. Review source file before using as Copilot knowledge or promoted page content.'
            }
          });
        }
      }

      return results;
    }, { sourceLibraries, blockedLists: [...blockedLists] });
  } finally {
    await browser.close();
  }
}

function summarize(items) {
  const summary = {
    total: items.length,
    bySourceKind: {},
    byClinicalArea: {},
    byDocumentType: {},
    byReviewStatus: {}
  };
  for (const item of items) {
    summary.bySourceKind[item.sourceKind] = (summary.bySourceKind[item.sourceKind] || 0) + 1;
    summary.byClinicalArea[item.clinicalArea] = (summary.byClinicalArea[item.clinicalArea] || 0) + 1;
    summary.byDocumentType[item.documentType] = (summary.byDocumentType[item.documentType] || 0) + 1;
    summary.byReviewStatus[item.reviewStatus] = (summary.byReviewStatus[item.reviewStatus] || 0) + 1;
  }
  return summary;
}

function renderMarkdown(index, summary) {
  const candidateItems = index.filter((item) => item.reviewStatus === 'candidate').slice(0, 80);
  const lines = [
    '# SLP Clinical Knowledge Index Preview',
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
    '## Safety Boundary',
    '',
    '- This is a non-PHI reference index.',
    '- It intentionally skips patient, session note, goal tracking, and review queue SharePoint lists.',
    '- Items flagged for manual review should not be promoted into SharePoint pages or Copilot Studio knowledge until reviewed.',
    '- Patient-specific clinical documentation remains in approved clinical systems only.',
    '',
    '## Summary',
    '',
    `- Total indexed items: ${summary.total}`,
    `- Candidate non-PHI local items: ${index.filter((item) => item.reviewStatus === 'candidate').length}`,
    `- Hold/manual review items: ${index.filter((item) => item.reviewStatus !== 'candidate').length}`,
    '',
    '## Clinical Area Counts',
    ''
  ];

  for (const [area, count] of Object.entries(summary.byClinicalArea).sort((a, b) => a[0].localeCompare(b[0]))) {
    lines.push(`- ${area}: ${count}`);
  }

  lines.push('', '## Candidate Items', '');
  for (const item of candidateItems) {
    lines.push(`### ${item.title}`);
    lines.push('');
    lines.push(`- Area: ${item.clinicalArea}`);
    lines.push(`- Type: ${item.documentType}`);
    lines.push(`- Source: ${item.sourcePath || item.sourceUrl || item.sourceLibrary}`);
    if (item.highlights?.length) {
      lines.push('- Highlights:');
      for (const highlight of item.highlights.slice(0, 4)) lines.push(`  - ${highlight}`);
    }
    lines.push('');
  }

  return `${lines.join('\n')}\n`;
}

await mkdir(OUT_DIR, { recursive: true });

const localItems = await buildLocalIndex();
const sharePointItems = await buildSharePointIndex();
  const index = [...localItems, ...sharePointItems];
for (const item of index) {
  if (item.sourceKind === 'sharepoint-library-item') {
    const text = `${item.fileName} ${item.sourceUrl}`;
    item.clinicalArea = classify(text, item.sourceUrl || item.fileName, clinicalAreas, 'General Source Library Item');
    item.documentType = classify(text, item.sourceUrl || item.fileName, sourceTypes, 'Source File');
    item.discipline = detectDiscipline(text, item.sourceUrl || item.fileName);
  }
}
const summary = summarize(index);

await writeFile(path.join(OUT_DIR, 'clinical-knowledge-index-preview.json'), `${JSON.stringify({ generatedAt: new Date().toISOString(), summary, index }, null, 2)}\n`, 'utf8');
await writeFile(path.join(OUT_DIR, 'clinical-knowledge-index-preview.md'), renderMarkdown(index, summary), 'utf8');

console.log(JSON.stringify({
  ok: true,
  includeSharePoint,
  outputJson: path.join(OUT_DIR, 'clinical-knowledge-index-preview.json'),
  outputMarkdown: path.join(OUT_DIR, 'clinical-knowledge-index-preview.md'),
  summary
}, null, 2));

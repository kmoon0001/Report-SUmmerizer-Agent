import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const ROOT = path.resolve('D:/my agents copilot studio/Sharepoint SLP Portal');
const SITE_URL = 'https://ensignservices.sharepoint.com/sites/PacificCoast_SLP';
const SITE_API = '/sites/PacificCoast_SLP/_api';
const AUTH_STATE = path.join(ROOT, '.sharepoint-auth-state.json');
const OUT_DIR = path.join(ROOT, 'output/sharepoint-native-bridge');
const INDEX_PATH = path.join(OUT_DIR, 'clinical-knowledge-index-preview.json');
const LIST_TITLE = 'SLP_Source_Index';

const fieldSchemas = [
  { internalName: 'SourceKey', xml: '<Field Type="Text" DisplayName="Source Key" Name="SourceKey" StaticName="SourceKey" Required="TRUE" MaxLength="255" Indexed="TRUE" />' },
  { internalName: 'SourceUrl', xml: '<Field Type="Note" DisplayName="Source URL" Name="SourceUrl" StaticName="SourceUrl" NumLines="3" RichText="FALSE" />' },
  { internalName: 'FileName', xml: '<Field Type="Text" DisplayName="File Name" Name="FileName" StaticName="FileName" MaxLength="255" />' },
  { internalName: 'SourceKind', xml: '<Field Type="Choice" DisplayName="Source Kind" Name="SourceKind" StaticName="SourceKind"><CHOICES><CHOICE>local-file</CHOICE><CHOICE>sharepoint-library-item</CHOICE><CHOICE>sharepoint-error</CHOICE></CHOICES></Field>' },
  { internalName: 'SourceLibrary', xml: '<Field Type="Text" DisplayName="Source Library" Name="SourceLibrary" StaticName="SourceLibrary" MaxLength="255" />' },
  { internalName: 'ClinicalArea', xml: '<Field Type="Choice" DisplayName="Clinical Area" Name="ClinicalArea" StaticName="ClinicalArea"><CHOICES><CHOICE>Dysphagia</CHOICE><CHOICE>Aphasia</CHOICE><CHOICE>Cognitive-Communication</CHOICE><CHOICE>Motor Speech</CHOICE><CHOICE>Voice</CHOICE><CHOICE>AAC</CHOICE><CHOICE>Trach/Vent</CHOICE><CHOICE>Medicare/Compliance</CHOICE><CHOICE>Goal Bank</CHOICE><CHOICE>Treatment Ideas</CHOICE><CHOICE>Staff Learning</CHOICE><CHOICE>General SLP Reference</CHOICE><CHOICE>General Source Library Item</CHOICE></CHOICES></Field>' },
  { internalName: 'Discipline', xml: '<Field Type="Choice" DisplayName="Discipline" Name="Discipline" StaticName="Discipline"><CHOICES><CHOICE>SLP</CHOICE><CHOICE>Cross-discipline</CHOICE><CHOICE>PT-adjacent</CHOICE><CHOICE>OT-adjacent</CHOICE><CHOICE>metadata-only</CHOICE></CHOICES></Field>' },
  { internalName: 'DocumentType', xml: '<Field Type="Choice" DisplayName="Document Type" Name="DocumentType" StaticName="DocumentType"><CHOICES><CHOICE>Clinical Protocol</CHOICE><CHOICE>Reference Table</CHOICE><CHOICE>Treatment Library</CHOICE><CHOICE>Goal Template</CHOICE><CHOICE>Compliance Reference</CHOICE><CHOICE>Learning Content</CHOICE><CHOICE>Reference Content</CHOICE><CHOICE>Source File</CHOICE></CHOICES></Field>' },
  { internalName: 'Audience', xml: '<Field Type="Text" DisplayName="Audience" Name="Audience" StaticName="Audience" MaxLength="255" />' },
  { internalName: 'ReviewStatus', xml: '<Field Type="Choice" DisplayName="Review Status" Name="ReviewStatus" StaticName="ReviewStatus"><CHOICES><CHOICE>candidate</CHOICE><CHOICE>adjacent-rehab-review</CHOICE><CHOICE>source-metadata-only</CHOICE><CHOICE>hold</CHOICE></CHOICES></Field>' },
  { internalName: 'PHIReviewed', xml: '<Field Type="Text" DisplayName="PHI Reviewed" Name="PHIReviewed" StaticName="PHIReviewed" MaxLength="255" />' },
  { internalName: 'CopilotReadiness', xml: '<Field Type="Choice" DisplayName="Copilot Readiness" Name="CopilotReadiness" StaticName="CopilotReadiness"><CHOICES><CHOICE>eligible-after-review</CHOICE><CHOICE>review-required</CHOICE><CHOICE>metadata-only</CHOICE><CHOICE>blocked</CHOICE></CHOICES></Field>' },
  { internalName: 'LastIndexed', xml: '<Field Type="DateTime" DisplayName="Last Indexed" Name="LastIndexed" StaticName="LastIndexed" Format="DateTime" />' },
  { internalName: 'Notes', xml: '<Field Type="Note" DisplayName="Notes" Name="Notes" StaticName="Notes" NumLines="6" RichText="FALSE" />' }
];

function escapeODataString(value) {
  return String(value).replaceAll("'", "''");
}

function truncate(value, length) {
  const text = String(value || '');
  return text.length > length ? text.slice(0, length) : text;
}

function sourceKey(item) {
  const raw = item.sourceUrl || item.sourcePath || `${item.sourceKind}:${item.title}:${item.fileName || ''}`;
  return truncate(raw, 255);
}

function copilotReadiness(item) {
  if (item.reviewStatus === 'candidate') return 'eligible-after-review';
  if (item.reviewStatus === 'source-metadata-only') return 'metadata-only';
  if (item.reviewStatus === 'hold') return 'blocked';
  return 'review-required';
}

function notesFor(item) {
  const parts = [
    'Non-PHI metadata index record.',
    item.guardrails?.recommendedUse,
    item.highlights?.length ? `Highlights: ${item.highlights.slice(0, 3).join(' | ')}` : null
  ].filter(Boolean);
  return parts.join('\n');
}

function toListPayload(item, listItemType, indexedAt) {
  return {
    __metadata: { type: listItemType },
    Title: truncate(item.title || item.fileName || sourceKey(item), 255),
    SourceKey: sourceKey(item),
    SourceUrl: item.sourceUrl || item.sourcePath || '',
    FileName: truncate(item.fileName || path.basename(item.sourcePath || '') || '', 255),
    SourceKind: item.sourceKind || '',
    SourceLibrary: truncate(item.sourceLibrary || '', 255),
    ClinicalArea: item.clinicalArea || 'General Source Library Item',
    Discipline: item.discipline || 'metadata-only',
    DocumentType: item.documentType || 'Source File',
    Audience: truncate(item.audience || 'SLP, Rehab Team', 255),
    ReviewStatus: item.reviewStatus || 'source-metadata-only',
    PHIReviewed: truncate(item.phiReviewed || 'manual-review-required', 255),
    CopilotReadiness: copilotReadiness(item),
    LastIndexed: indexedAt,
    Notes: notesFor(item)
  };
}

async function main() {
  const source = JSON.parse(await readFile(INDEX_PATH, 'utf8'));
  const indexedAt = new Date().toISOString();
  const index = source.index || [];

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState: AUTH_STATE });
  const page = await context.newPage();
  await page.goto(`${SITE_URL}/SitePages/SLP-Portal.aspx`, { waitUntil: 'domcontentloaded', timeout: 60000 });

  try {
    const result = await page.evaluate(async ({ SITE_API, LIST_TITLE, fieldSchemas, index, indexedAt }) => {
      function escapeODataString(value) {
        return String(value).replaceAll("'", "''");
      }

      function sourceKey(item) {
        const raw = item.sourceUrl || item.sourcePath || `${item.sourceKind}:${item.title}:${item.fileName || ''}`;
        return String(raw).slice(0, 255);
      }

      function truncate(value, length) {
        const text = String(value || '');
        return text.length > length ? text.slice(0, length) : text;
      }

      function copilotReadiness(item) {
        if (item.reviewStatus === 'candidate') return 'eligible-after-review';
        if (item.reviewStatus === 'source-metadata-only') return 'metadata-only';
        if (item.reviewStatus === 'hold') return 'blocked';
        return 'review-required';
      }

      function notesFor(item) {
        const parts = [
          'Non-PHI metadata index record.',
          item.guardrails?.recommendedUse,
          item.highlights?.length ? `Highlights: ${item.highlights.slice(0, 3).join(' | ')}` : null
        ].filter(Boolean);
        return parts.join('\n');
      }

      function toListPayload(item, listItemType, fieldMap) {
        return {
          __metadata: { type: listItemType },
          Title: truncate(item.title || item.fileName || sourceKey(item), 255),
          [fieldMap.SourceKey]: sourceKey(item),
          [fieldMap.SourceUrl]: item.sourceUrl || item.sourcePath || '',
          [fieldMap.FileName]: truncate(item.fileName || '', 255),
          [fieldMap.SourceKind]: item.sourceKind || '',
          [fieldMap.SourceLibrary]: truncate(item.sourceLibrary || '', 255),
          [fieldMap.ClinicalArea]: item.clinicalArea || 'General Source Library Item',
          [fieldMap.Discipline]: item.discipline || 'metadata-only',
          [fieldMap.DocumentType]: item.documentType || 'Source File',
          [fieldMap.Audience]: truncate(item.audience || 'SLP, Rehab Team', 255),
          [fieldMap.ReviewStatus]: item.reviewStatus || 'source-metadata-only',
          [fieldMap.PHIReviewed]: truncate(item.phiReviewed || 'manual-review-required', 255),
          [fieldMap.CopilotReadiness]: copilotReadiness(item),
          [fieldMap.LastIndexed]: indexedAt,
          [fieldMap.Notes]: notesFor(item)
        };
      }

      async function requestDigest() {
        const response = await fetch(`${SITE_API}/contextinfo`, {
          method: 'POST',
          headers: { Accept: 'application/json;odata=nometadata' }
        });
        if (!response.ok) throw new Error(`contextinfo failed ${response.status}: ${await response.text()}`);
        return (await response.json()).FormDigestValue;
      }

      async function getJson(url) {
        const response = await fetch(url, { headers: { Accept: 'application/json;odata=nometadata' } });
        return { response, json: response.ok ? await response.json() : null, text: response.ok ? '' : await response.text() };
      }

      const digest = await requestDigest();
      const escapedTitle = escapeODataString(LIST_TITLE);
      const existing = await getJson(`${SITE_API}/web/lists/getbytitle('${escapedTitle}')?$select=Id,Title,ListItemEntityTypeFullName,ItemCount`);
      let createdList = false;

      if (!existing.response.ok && existing.response.status !== 404) {
        throw new Error(`list lookup failed ${existing.response.status}: ${existing.text}`);
      }

      if (!existing.response.ok) {
        const createResponse = await fetch(`${SITE_API}/web/lists`, {
          method: 'POST',
          headers: {
            Accept: 'application/json;odata=verbose',
            'Content-Type': 'application/json;odata=verbose',
            'X-RequestDigest': digest
          },
          body: JSON.stringify({
            __metadata: { type: 'SP.List' },
            Title: LIST_TITLE,
            Description: 'Non-PHI source metadata index for the Pacific Coast SLP Portal. Patient/session/goal/review lists are intentionally excluded.',
            BaseTemplate: 100
          })
        });
        if (!createResponse.ok) throw new Error(`list create failed ${createResponse.status}: ${await createResponse.text()}`);
        createdList = true;
      }

      const listInfo = await getJson(`${SITE_API}/web/lists/getbytitle('${escapedTitle}')?$select=Id,Title,ListItemEntityTypeFullName,ItemCount`);
      if (!listInfo.response.ok) throw new Error(`list reload failed ${listInfo.response.status}: ${listInfo.text}`);
      const listItemType = listInfo.json.ListItemEntityTypeFullName;

      const fieldsResponse = await getJson(`${SITE_API}/web/lists/getbytitle('${escapedTitle}')/fields?$select=InternalName,StaticName`);
      if (!fieldsResponse.response.ok) throw new Error(`field lookup failed ${fieldsResponse.response.status}: ${fieldsResponse.text}`);
      const existingFields = new Set((fieldsResponse.json.value || []).flatMap((field) => [field.InternalName, field.StaticName]));
      const addedFields = [];

      for (const field of fieldSchemas) {
        if (existingFields.has(field.internalName)) continue;
        const response = await fetch(`${SITE_API}/web/lists/getbytitle('${escapedTitle}')/fields/CreateFieldAsXml`, {
          method: 'POST',
          headers: {
            Accept: 'application/json;odata=nometadata',
            'Content-Type': 'application/json;odata=nometadata',
            'X-RequestDigest': digest
          },
          body: JSON.stringify({
            parameters: {
              SchemaXml: field.xml,
              Options: 0
            }
          })
        });
        if (!response.ok) throw new Error(`add field ${field.internalName} failed ${response.status}: ${await response.text()}`);
        addedFields.push(field.internalName);
      }

      const reloadedFieldsResponse = await getJson(`${SITE_API}/web/lists/getbytitle('${escapedTitle}')/fields?$select=InternalName,StaticName`);
      if (!reloadedFieldsResponse.response.ok) throw new Error(`field reload failed ${reloadedFieldsResponse.response.status}: ${reloadedFieldsResponse.text}`);
      const fieldMap = {};
      for (const field of reloadedFieldsResponse.json.value || []) {
        if (field.StaticName) fieldMap[field.StaticName] = field.InternalName;
      }
      for (const field of fieldSchemas) {
        if (!fieldMap[field.internalName]) {
          throw new Error(`Expected field ${field.internalName} was not found after field provisioning.`);
        }
      }

      const existingItems = new Map();
      let nextUrl = `${SITE_API}/web/lists/getbytitle('${escapedTitle}')/items?$select=Id,${fieldMap.SourceKey}&$top=5000`;
      while (nextUrl) {
        const response = await fetch(nextUrl, { headers: { Accept: 'application/json;odata=nometadata' } });
        if (!response.ok) throw new Error(`existing items fetch failed ${response.status}: ${await response.text()}`);
        const json = await response.json();
        for (const item of json.value || []) {
          if (item[fieldMap.SourceKey]) existingItems.set(item[fieldMap.SourceKey], item.Id);
        }
        nextUrl = json['odata.nextLink'] || null;
      }

      const summary = { created: 0, updated: 0, failed: [] };
      for (const item of index) {
        const key = sourceKey(item);
        const payload = toListPayload(item, listItemType, fieldMap);
        const itemId = existingItems.get(key);
        const url = itemId
          ? `${SITE_API}/web/lists/getbytitle('${escapedTitle}')/items(${itemId})`
          : `${SITE_API}/web/lists/getbytitle('${escapedTitle}')/items`;
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            Accept: 'application/json;odata=verbose',
            'Content-Type': 'application/json;odata=verbose',
            'X-RequestDigest': digest,
            ...(itemId ? { 'IF-MATCH': '*', 'X-HTTP-Method': 'MERGE' } : {})
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          summary.failed.push({ key, status: response.status, body: (await response.text()).slice(0, 500) });
          continue;
        }
        if (itemId) summary.updated += 1;
        else summary.created += 1;
      }

      const finalInfo = await getJson(`${SITE_API}/web/lists/getbytitle('${escapedTitle}')?$select=Title,ItemCount,DefaultViewUrl`);
      return {
        createdList,
        addedFields,
        fieldMap,
        list: finalInfo.json,
        seeded: summary
      };
    }, { SITE_API, LIST_TITLE, fieldSchemas, index, indexedAt });

    await mkdir(OUT_DIR, { recursive: true });
    await writeFile(path.join(OUT_DIR, 'source-index-list-publish-report.json'), `${JSON.stringify({ publishedAt: indexedAt, listTitle: LIST_TITLE, ...result }, null, 2)}\n`, 'utf8');

    console.log(JSON.stringify({ ok: result.seeded.failed.length === 0, listTitle: LIST_TITLE, ...result }, null, 2));
    if (result.seeded.failed.length) process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

await main();

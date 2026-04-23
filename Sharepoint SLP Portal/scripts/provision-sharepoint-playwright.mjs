import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const DEFAULT_SITE_URL = "https://ensignservices.sharepoint.com/sites/PacificCoast_SLP";
const siteUrl = process.env.SHAREPOINT_SITE_URL || process.argv[2] || DEFAULT_SITE_URL;

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const schemaPath = path.join(projectRoot, "docs", "contracts", "sharepoint-list-schemas.json");

if (!fs.existsSync(schemaPath)) {
  console.error(`Schema file not found: ${schemaPath}`);
  process.exit(1);
}

const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
const sitePath = new URL(siteUrl).pathname;

const migrationLibrary = "SLP-Portal-Migration";
const knowledgeLibrary = "SLP_ClinicalKnowledge";
const migrationFolders = [
  "01-Architecture",
  "02-Data-Model",
  "03-PowerApps",
  "04-PowerAutomate",
  "05-CopilotStudio",
  "06-Validation-QA",
  "07-Release-Evidence",
  "Knowledge-Library"
];

function escSingleQuotes(value) {
  return String(value).replace(/'/g, "''");
}

function buildFieldXml(column) {
  const name = column.name;
  const required = column.required ? "TRUE" : "FALSE";

  switch (column.type) {
    case "Single line of text":
      return `<Field Type="Text" DisplayName="${name}" Name="${name}" StaticName="${name}" Required="${required}" />`;
    case "Multiple lines of text":
      return `<Field Type="Note" DisplayName="${name}" Name="${name}" StaticName="${name}" Required="${required}" NumLines="8" RichText="FALSE" AppendOnly="FALSE" />`;
    case "Number": {
      const min = Number.isFinite(column.minimum) ? ` Min="${column.minimum}"` : "";
      return `<Field Type="Number" DisplayName="${name}" Name="${name}" StaticName="${name}" Required="${required}"${min} />`;
    }
    case "Date and Time":
      return `<Field Type="DateTime" DisplayName="${name}" Name="${name}" StaticName="${name}" Required="${required}" Format="DateOnly" />`;
    case "Yes/No": {
      const def = column.defaultValue ? "1" : "0";
      return `<Field Type="Boolean" DisplayName="${name}" Name="${name}" StaticName="${name}" Required="${required}" Default="${def}" />`;
    }
    case "Choice": {
      const choices = (column.choices || []).map((c) => `<CHOICE>${c}</CHOICE>`).join("");
      const defaultNode = column.defaultValue ? `<Default>${column.defaultValue}</Default>` : "";
      return `<Field Type="Choice" DisplayName="${name}" Name="${name}" StaticName="${name}" Required="${required}"><CHOICES>${choices}</CHOICES>${defaultNode}</Field>`;
    }
    default:
      throw new Error(`Unsupported column type: ${column.type} (${name})`);
  }
}

async function waitForSharePointSession(page, targetSiteUrl) {
  const maxWaitMs = 10 * 60 * 1000;
  const start = Date.now();

  while (Date.now() - start < maxWaitMs) {
    const currentUrl = page.url();
    if (currentUrl.startsWith(targetSiteUrl)) {
      return true;
    }

    const hasLoginInputs =
      (await page.locator('input[type="email"]').count().catch(() => 0)) > 0 ||
      (await page.locator('input[type="password"]').count().catch(() => 0)) > 0;

    if (hasLoginInputs) {
      console.log("[ACTION REQUIRED] Complete Microsoft 365 sign-in in the browser window.");
    }

    await page.waitForTimeout(2000);
  }

  return false;
}

async function main() {
  const browser = await chromium.launch({ headless: false, slowMo: 100 });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log(`[INFO] Opening ${siteUrl}`);
  await page.goto(siteUrl, { waitUntil: "domcontentloaded" });

  const authed = await waitForSharePointSession(page, siteUrl);
  if (!authed) {
    throw new Error("Timed out waiting for authenticated SharePoint session.");
  }

  console.log("[INFO] Authenticated session confirmed.");

  async function spFetch(relativeOrAbsoluteUrl, options = {}) {
    return await page.evaluate(
      async ({ targetUrl, reqOptions }) => {
        const res = await fetch(targetUrl, reqOptions);
        const text = await res.text();
        let json = null;
        try {
          json = text ? JSON.parse(text) : null;
        } catch {
          json = null;
        }
        return { ok: res.ok, status: res.status, text, json };
      },
      {
        targetUrl: relativeOrAbsoluteUrl.startsWith("http")
          ? relativeOrAbsoluteUrl
          : `${siteUrl}${relativeOrAbsoluteUrl}`,
        reqOptions: options
      }
    );
  }

  async function getDigest() {
    const r = await spFetch("/_api/contextinfo", {
      method: "POST",
      headers: {
        Accept: "application/json;odata=verbose"
      }
    });
    if (!r.ok) {
      throw new Error(`Failed to get request digest: ${r.status} ${r.text}`);
    }
    return r.json?.d?.GetContextWebInformation?.FormDigestValue;
  }

  async function ensureList(title, baseTemplate) {
    const exists = await spFetch(`/_api/web/lists/getbytitle('${escSingleQuotes(title)}')?$select=Title,Id`, {
      headers: {
        Accept: "application/json;odata=verbose"
      }
    });

    if (exists.ok) {
      console.log(`[OK] List exists: ${title}`);
      return;
    }
    if (exists.status !== 404) {
      throw new Error(`List check failed (${title}): ${exists.status} ${exists.text}`);
    }

    const digest = await getDigest();
    const create = await spFetch("/_api/web/lists", {
      method: "POST",
      headers: {
        Accept: "application/json;odata=verbose",
        "Content-Type": "application/json;odata=verbose",
        "X-RequestDigest": digest
      },
      body: JSON.stringify({
        __metadata: { type: "SP.List" },
        BaseTemplate: baseTemplate,
        Title: title
      })
    });

    if (!create.ok) {
      throw new Error(`Create list failed (${title}): ${create.status} ${create.text}`);
    }
    console.log(`[CREATE] List created: ${title}`);
  }

  async function ensureFolder(serverRelativeUrl) {
    const exists = await spFetch(`/_api/web/GetFolderByServerRelativeUrl('${escSingleQuotes(serverRelativeUrl)}')?$select=Name`, {
      headers: {
        Accept: "application/json;odata=verbose"
      }
    });

    if (exists.ok) {
      console.log(`[OK] Folder exists: ${serverRelativeUrl}`);
      return;
    }
    if (exists.status !== 404) {
      throw new Error(`Folder check failed (${serverRelativeUrl}): ${exists.status} ${exists.text}`);
    }

    const digest = await getDigest();
    const create = await spFetch("/_api/web/folders", {
      method: "POST",
      headers: {
        Accept: "application/json;odata=verbose",
        "Content-Type": "application/json;odata=verbose",
        "X-RequestDigest": digest
      },
      body: JSON.stringify({
        __metadata: { type: "SP.Folder" },
        ServerRelativeUrl: serverRelativeUrl
      })
    });

    if (!create.ok) {
      throw new Error(`Create folder failed (${serverRelativeUrl}): ${create.status} ${create.text}`);
    }
    console.log(`[CREATE] Folder created: ${serverRelativeUrl}`);
  }

  async function ensureField(listTitle, column) {
    if (column.name === "Title") {
      return;
    }

    const exists = await spFetch(
      `/_api/web/lists/getbytitle('${escSingleQuotes(listTitle)}')/fields/getbyinternalnameortitle('${escSingleQuotes(column.name)}')?$select=Title,InternalName`,
      {
        headers: {
          Accept: "application/json;odata=verbose"
        }
      }
    );

    if (exists.ok) {
      console.log(`[OK] Field exists: ${listTitle}.${column.name}`);
      return;
    }
    if (exists.status !== 404) {
      throw new Error(`Field check failed (${listTitle}.${column.name}): ${exists.status} ${exists.text}`);
    }

    const digest = await getDigest();
    const schemaXml = buildFieldXml(column);
    const create = await spFetch(
      `/_api/web/lists/getbytitle('${escSingleQuotes(listTitle)}')/fields/createfieldasxml`,
      {
        method: "POST",
        headers: {
          Accept: "application/json;odata=verbose",
          "Content-Type": "application/json;odata=verbose",
          "X-RequestDigest": digest
        },
        body: JSON.stringify({
          parameters: {
            __metadata: { type: "SP.XmlSchemaFieldCreationInformation" },
            SchemaXml: schemaXml,
            Options: 0
          }
        })
      }
    );

    if (!create.ok) {
      throw new Error(`Create field failed (${listTitle}.${column.name}): ${create.status} ${create.text}`);
    }
    console.log(`[CREATE] Field created: ${listTitle}.${column.name}`);
  }

  await ensureList(migrationLibrary, 101);
  await ensureList(knowledgeLibrary, 101);

  const migrationLibraryRoot = `${sitePath}/${migrationLibrary}`;
  for (const folderName of migrationFolders) {
    await ensureFolder(`${migrationLibraryRoot}/${folderName}`);
  }

  for (const list of schema.lists) {
    await ensureList(list.name, 100);
    for (const column of list.columns) {
      await ensureField(list.name, column);
    }
  }

  console.log("[DONE] SharePoint provisioning completed.");
  console.log(`[SITE] ${siteUrl}`);
  await context.close();
  await browser.close();
}

main().catch((err) => {
  console.error(`[ERROR] ${err.message}`);
  process.exit(1);
});

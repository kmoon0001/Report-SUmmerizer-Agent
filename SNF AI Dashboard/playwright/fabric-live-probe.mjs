import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const projectRoot = "D:\\SNF AI Dashboard";
const outputDir = path.join(projectRoot, "data", "processed");
const screenshotPath = path.join(outputDir, "fabric_live_probe.png");
const outputJsonPath = path.join(outputDir, "fabric_live_probe.json");
const startUrl = "https://app.fabric.microsoft.com/onelake/explore?experience=fabric-developer";
const headed = process.argv.includes("--headed");
const waitForLoginMsArg = process.argv.find((a) => a.startsWith("--wait-ms="));
const waitForLoginMs = waitForLoginMsArg ? Number(waitForLoginMsArg.split("=")[1]) : 90000;

fs.mkdirSync(outputDir, { recursive: true });

let browser;
let context;
if (headed) {
  browser = await chromium.launch({ headless: false });
  context = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
} else {
  context = await chromium.launchPersistentContext(
    path.join(projectRoot, ".playwright-mcp", "fabric-live-probe-profile"),
    {
      headless: true,
      viewport: { width: 1600, height: 1000 },
    }
  );
}

const page = context.pages()[0] ?? (await context.newPage());

const result = {
  generatedAt: new Date().toISOString(),
  startUrl,
  finalUrl: "",
  title: "",
  error: "",
  permissionSignals: [],
  loginSignals: [],
  discoveredLinks: [],
  discoveredWorkspaceIds: [],
  discoveredItemIds: [],
  discoveredGuids: [],
  storageHints: [],
  screenshotPath,
};

try {
  await page.goto(startUrl, { waitUntil: "domcontentloaded", timeout: 120000 });
  if (headed) {
    console.log(`Headed mode active. Sign in and navigate to Fabric workspace now. Waiting ${waitForLoginMs} ms...`);
    await page.waitForTimeout(waitForLoginMs);
  } else {
    await page.waitForTimeout(8000);
  }

  result.finalUrl = page.url();
  result.title = await page.title();

  const bodyText = (await page.locator("body").innerText().catch(() => "")) || "";
  const signals = [
    "You need permission",
    "You don't have access",
    "Request access",
    "Ask your admin",
    "Sign in",
    "Pick an account",
    "Create",
    "Lakehouse",
    "Eventhouse",
    "KQL database",
  ];
  for (const s of signals) {
    if (bodyText.toLowerCase().includes(s.toLowerCase())) {
      if (s.toLowerCase().includes("sign in") || s.toLowerCase().includes("pick an account")) {
        result.loginSignals.push(s);
      } else {
        result.permissionSignals.push(s);
      }
    }
  }

  const links = await page.$$eval("a[href]", (nodes) =>
    nodes.map((n) => n.getAttribute("href")).filter(Boolean)
  );
  const baseOrigin = new URL(page.url()).origin;
  const normalized = [
    ...new Set(
      links
        .map((u) => (u.startsWith("http") ? u : new URL(u, baseOrigin).href))
        .slice(0, 500)
    ),
  ];
  result.discoveredLinks = normalized.filter((u) => u.includes("fabric.microsoft.com") || u.includes("powerbi.com/onelake/details"));

  const ws = new Set();
  const items = new Set();
  const allGuids = new Set();
  const patterns = [
    /\/groups\/([0-9a-f-]{36})\/(?:lakehouses?|eventhouses?|kqldatabases?|databases?)\/([0-9a-f-]{36})/gi,
    /\/onelake\/details\/([0-9a-f-]{36})\/(?:lakehouse|eventhouse|kqldatabase)\/([0-9a-f-]{36})/gi,
  ];
  for (const url of result.discoveredLinks) {
    for (const pattern of patterns) {
      let m;
      while ((m = pattern.exec(url)) !== null) {
        ws.add(m[1]);
        items.add(m[2]);
      }
    }
  }

  const html = await page.content();
  const guidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;
  let g;
  while ((g = guidRegex.exec(html)) !== null) {
    allGuids.add(g[0]);
  }

  const storageDump = await page.evaluate(() => {
    const collect = (obj) => {
      const out = {};
      try {
        for (let i = 0; i < obj.length; i += 1) {
          const k = obj.key(i);
          out[k] = obj.getItem(k);
        }
      } catch {
        return out;
      }
      return out;
    };
    return {
      localStorage: collect(window.localStorage),
      sessionStorage: collect(window.sessionStorage),
    };
  });

  const storagePairs = [];
  for (const [k, v] of Object.entries(storageDump.localStorage)) {
    storagePairs.push(`${k}=${String(v)}`);
  }
  for (const [k, v] of Object.entries(storageDump.sessionStorage)) {
    storagePairs.push(`${k}=${String(v)}`);
  }
  for (const pair of storagePairs) {
    let sm;
    while ((sm = guidRegex.exec(pair)) !== null) {
      allGuids.add(sm[0]);
    }
    if (/workspace|group|lakehouse|eventhouse|kql|database|item/i.test(pair)) {
      result.storageHints.push(pair.slice(0, 400));
    }
  }

  result.discoveredWorkspaceIds = [...ws];
  result.discoveredItemIds = [...items];
  result.discoveredGuids = [...allGuids].slice(0, 100);

  await page.screenshot({ path: screenshotPath, fullPage: true });
} catch (err) {
  result.error = String(err?.message ?? err ?? "Unknown error");
} finally {
  try {
    fs.writeFileSync(outputJsonPath, JSON.stringify(result, null, 2), "utf8");
  } catch {}
  try {
    result.finalUrl = result.finalUrl || page.url();
  } catch {}
  try {
    result.title = result.title || (await page.title());
  } catch {}
  try {
    await Promise.race([
      context.close(),
      new Promise((resolve) => setTimeout(resolve, 5000)),
    ]);
  } catch {}
  if (browser) {
    try {
      await Promise.race([
        browser.close(),
        new Promise((resolve) => setTimeout(resolve, 5000)),
      ]);
    } catch {}
  }
}

console.log(`Fabric live probe written to: ${outputJsonPath}`);
console.log(`Screenshot written to: ${screenshotPath}`);
console.log(`Final URL: ${result.finalUrl}`);
console.log(`Workspace IDs: ${result.discoveredWorkspaceIds.length}`);
console.log(`Item IDs: ${result.discoveredItemIds.length}`);
console.log(`Guids discovered: ${result.discoveredGuids.length}`);
if (result.error) {
  console.log(`Probe error: ${result.error}`);
  process.exitCode = 1;
}

param(
    [string]$StartUrl = 'https://efs.pointclickcare.com/home/home.jsp?ESOLnewlogin=Y',
    [string]$OutputPath = 'D:\SNF AI Dashboard\data\processed\pcc_visible_report_names.txt',
    [int]$WaitSeconds = 90
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$playwrightRoot = 'D:\SNF AI Dashboard\playwright'
if (-not (Test-Path -LiteralPath $playwrightRoot)) {
    throw "Playwright root not found: $playwrightRoot"
}

$outputDir = Split-Path -Parent $OutputPath
if ($outputDir -and -not (Test-Path -LiteralPath $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
}

$jsPath = Join-Path $playwrightRoot 'tmp-pcc-report-scrape.mjs'
$js = @"
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const startUrl = process.env.PCC_START_URL;
const outputPath = process.env.PCC_OUTPUT_PATH;
const waitMs = Number(process.env.PCC_WAIT_MS || '90000');

const browser = await chromium.launch({ headless: false });
const context = await browser.newContext();
const page = await context.newPage();
await page.goto(startUrl, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(waitMs);

const texts = await page.evaluate(() => {
  const nodes = Array.from(document.querySelectorAll('a, button, [role="menuitem"], [role="link"], h1, h2, h3'));
  const cleaned = nodes
    .map(n => (n.textContent || '').trim())
    .filter(t => t.length >= 3)
    .filter(t => !/^\\d+$/.test(t));
  return Array.from(new Set(cleaned)).sort((a, b) => a.localeCompare(b));
});

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, texts.join('\\n'), 'utf8');
console.log('Saved visible labels to: ' + outputPath);

await browser.close();
"@

$js | Set-Content -LiteralPath $jsPath -Encoding UTF8

Push-Location $playwrightRoot
try {
    $env:PCC_START_URL = $StartUrl
    $env:PCC_OUTPUT_PATH = $OutputPath
    $env:PCC_WAIT_MS = [string]($WaitSeconds * 1000)
    node $jsPath
}
finally {
    Pop-Location
    if (Test-Path -LiteralPath $jsPath) {
        Remove-Item -LiteralPath $jsPath -Force
    }
}

Write-Host "Visible labels export complete: $OutputPath"

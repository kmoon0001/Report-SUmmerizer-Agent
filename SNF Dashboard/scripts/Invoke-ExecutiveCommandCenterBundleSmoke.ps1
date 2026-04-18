param(
    [string]$PlaywrightRoot = 'D:\my agents copilot studio\SNF Dashboard\playwright',
    [string]$BundleHtmlPath = 'D:\my agents copilot studio\SNF Dashboard\data\exports\executive-command-center\current\executive-command-center.html'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath $PlaywrightRoot)) {
    throw "Playwright root not found: $PlaywrightRoot"
}

if (-not (Test-Path -LiteralPath $BundleHtmlPath)) {
    throw "Executive bundle HTML not found: $BundleHtmlPath"
}

$env:EXECUTIVE_BUNDLE_HTML_PATH = $BundleHtmlPath
Push-Location $PlaywrightRoot
try {
    npm test -- executive-command-center-bundle.spec.ts
}
finally {
    Pop-Location
}


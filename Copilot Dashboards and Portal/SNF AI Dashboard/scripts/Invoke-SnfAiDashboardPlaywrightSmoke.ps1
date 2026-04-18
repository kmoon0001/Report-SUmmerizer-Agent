Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$playwrightRoot = Join-Path $projectRoot "playwright"
$packageJsonPath = Join-Path $playwrightRoot "package.json"

Write-Host "SNF AI Dashboard Playwright smoke"
Write-Host ""

if (-not (Test-Path -LiteralPath $packageJsonPath)) {
  throw "Playwright package.json not found at $packageJsonPath"
}

if (-not $env:COPILOT_STUDIO_URL) {
  throw "Set COPILOT_STUDIO_URL before running the Playwright smoke suite."
}

Push-Location $playwrightRoot
try {
  & npm test
  if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
  }
}
finally {
  Pop-Location
}

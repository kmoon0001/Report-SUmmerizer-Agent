param(
    [string]$PlaywrightRoot = 'D:\my agents copilot studio\SNF Dashboard\playwright',
    [string]$ReportUrl = $env:POWERBI_REPORT_URL,
    [string]$ExpectedMarkers = $env:POWERBI_EXPECTED_MARKERS,
    [string]$DisallowedMarkers = $env:POWERBI_DISALLOWED_MARKERS
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath $PlaywrightRoot)) {
    throw "Playwright root not found: $PlaywrightRoot"
}
if ([string]::IsNullOrWhiteSpace($ReportUrl)) {
    throw 'POWERBI_REPORT_URL is required. Set it or pass -ReportUrl.'
}

$env:POWERBI_REPORT_URL = $ReportUrl
if (-not [string]::IsNullOrWhiteSpace($ExpectedMarkers)) {
    $env:POWERBI_EXPECTED_MARKERS = $ExpectedMarkers
}
if (-not [string]::IsNullOrWhiteSpace($DisallowedMarkers)) {
    $env:POWERBI_DISALLOWED_MARKERS = $DisallowedMarkers
}

Push-Location $PlaywrightRoot
try {
    npm test -- powerbi-published-smoke.spec.ts
}
finally {
    Pop-Location
}


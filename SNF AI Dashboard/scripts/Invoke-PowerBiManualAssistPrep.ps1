param(
    [string]$PackageRoot = 'D:\SNF AI Dashboard\integrations\powerbi\source-package\current',
    [string]$OutputPath = 'D:\SNF AI Dashboard\data\processed\powerbi_manual_assist_prep.md'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$requiredPaths = @(
    (Join-Path $PackageRoot 'source-package-manifest.json'),
    (Join-Path $PackageRoot 'model-tables\model-table-manifest.json'),
    (Join-Path $PackageRoot 'authoring-kit\authoring-kit-manifest.json'),
    (Join-Path $PackageRoot 'authoring-kit\executive-theme.json'),
    (Join-Path $PackageRoot 'authoring-kit\executive-measures.dax'),
    (Join-Path $PackageRoot 'authoring-kit\executive-page-layout.json')
)

$missing = @($requiredPaths | Where-Object { -not (Test-Path -LiteralPath $_) })
if ($missing.Count -gt 0) {
    throw "Power BI manual-assist prep missing required package files: $($missing -join ', ')"
}

$sourceManifest = Get-Content -LiteralPath (Join-Path $PackageRoot 'source-package-manifest.json') -Raw | ConvertFrom-Json
$tableManifest = Get-Content -LiteralPath (Join-Path $PackageRoot 'model-tables\model-table-manifest.json') -Raw | ConvertFrom-Json
$authoringManifest = Get-Content -LiteralPath (Join-Path $PackageRoot 'authoring-kit\authoring-kit-manifest.json') -Raw | ConvertFrom-Json

$tableLines = @()
foreach ($table in $tableManifest) {
    $tableLines += "- $($table.TableName): $($table.RowCount) rows"
}

$doc = @"
# Power BI Manual Assist Prep

Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')

## Package Root

- $PackageRoot

## Source Files Packaged

- Count: $($sourceManifest.Count)

## Model Tables

$($tableLines -join [Environment]::NewLine)

## Authoring Kit

- Measures: $($authoringManifest.MeasureCount)
- Relationships: $($authoringManifest.RelationshipCount)
- Files:
$(($authoringManifest.Files | ForEach-Object { "- $_" }) -join [Environment]::NewLine)

## Manual Desktop Steps (Short)

1. Open Power BI Desktop and create or open a PBIP project in a short local path.
2. Import all CSVs from `$PackageRoot\model-tables`.
3. Apply theme from `$PackageRoot\authoring-kit\executive-theme.json`.
4. Create measures from `$PackageRoot\authoring-kit\executive-measures.dax`.
5. Apply relationships from `$PackageRoot\authoring-kit\executive-command-center-relationships.csv`.
6. Build visuals using `$PackageRoot\authoring-kit\executive-page-layout.json`.
7. Validate KPI totals against `D:\SNF AI Dashboard\data\processed\command_center_operational_summary.json`.

## Publish And Verify

1. Publish to the intended workspace.
2. Run one manual refresh in Power BI Service.
3. Confirm row-level and KPI totals match the processed summary.
4. If published URL is available, run Playwright smoke against that URL.
"@

$outputDir = Split-Path -Parent $OutputPath
if ($outputDir -and -not (Test-Path -LiteralPath $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
}

$doc | Set-Content -LiteralPath $OutputPath -Encoding UTF8
Write-Host "Power BI manual assist prep written to: $OutputPath"

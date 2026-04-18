param(
    [string]$ProcessedRoot = 'D:\SNF AI Dashboard\data\processed',
    [string]$OutputRoot = 'D:\SNF AI Dashboard\integrations\powerbi\source-package\current'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$sourceFiles = @(
    'pcc_resident_list_current.active-only.csv',
    'command_center_documentation_queue.csv',
    'command_center_documentation_queue.by-unit.csv',
    'command_center_executive_unit_snapshot.csv',
    'command_center_therapy_coverage.csv',
    'command_center_therapy_coverage.by-unit.csv',
    'command_center_therapy_documentation_priority.csv',
    'command_center_therapy_documentation_priority.by-unit.csv',
    'command_center_shap_explanations.csv',
    'command_center_shap_feature_importance.csv',
    'command_center_shap_summary.md',
    'command_center_operational_summary.md',
    'command_center_operational_summary.json'
)

if (-not (Test-Path -LiteralPath $ProcessedRoot)) {
    throw "Processed root not found: $ProcessedRoot"
}

if (-not (Test-Path -LiteralPath $OutputRoot)) {
    New-Item -ItemType Directory -Path $OutputRoot -Force | Out-Null
}

Get-ChildItem -LiteralPath $OutputRoot -File -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -ne 'README.md' } |
    Remove-Item -Force -ErrorAction SilentlyContinue

$manifest = @()
foreach ($fileName in $sourceFiles) {
    $sourcePath = Join-Path $ProcessedRoot $fileName
    if (-not (Test-Path -LiteralPath $sourcePath)) { continue }

    $targetPath = Join-Path $OutputRoot $fileName
    Copy-Item -LiteralPath $sourcePath -Destination $targetPath -Force

    $rowCount = $null
    if ($fileName -like '*.csv') {
        $rows = @(Import-Csv -LiteralPath $sourcePath)
        $rowCount = $rows.Count
    }

    $item = Get-Item -LiteralPath $sourcePath
    $manifest += [pscustomobject]@{
        FileName      = $fileName
        SourcePath    = $sourcePath
        PackagedPath  = $targetPath
        RowCount      = $rowCount
        SizeBytes     = $item.Length
        LastWriteTime = $item.LastWriteTime.ToString('s')
    }
}

$manifestPath = Join-Path $OutputRoot 'source-package-manifest.json'
$manifest | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath $manifestPath -Encoding UTF8

Write-Host "Power BI executive source package written to: $OutputRoot"
Write-Host "Manifest: $manifestPath"
Write-Host "Files packaged: $($manifest.Count)"

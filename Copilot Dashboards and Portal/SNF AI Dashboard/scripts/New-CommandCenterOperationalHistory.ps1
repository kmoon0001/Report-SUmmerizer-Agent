param(
    [string]$SummaryJsonPath = 'D:\SNF AI Dashboard\data\processed\command_center_operational_summary.json',
    [string]$CsvOutputPath = 'D:\SNF AI Dashboard\data\processed\command_center_operational_history.csv',
    [string]$JsonOutputPath = 'D:\SNF AI Dashboard\data\processed\command_center_operational_history.json'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath $SummaryJsonPath)) {
    throw "Operational summary JSON not found: $SummaryJsonPath"
}

$summary = Get-Content -LiteralPath $SummaryJsonPath -Raw | ConvertFrom-Json
$metrics = $summary.metrics

$historyRow = [pscustomobject]@{
    GeneratedAt                      = [string]$summary.generatedAt
    SnapshotDateKey                  = [string]$summary.snapshotDateKey
    CurrentResidents                 = [int]$metrics.currentResidents
    ResidentsWithDocumentationItems  = [int]$metrics.residentsWithDocumentationItems
    OutstandingDocumentationItems    = [int]$metrics.outstandingDocumentationItems
    OverdueDocumentationItems        = [int]$metrics.overdueDocumentationItems
    ResidentsWithTherapy             = [int]$metrics.residentsWithTherapy
    TotalTherapyMinutes              = [int]$metrics.totalTherapyMinutes
    ResidentsInPriorityQueue         = [int]$metrics.residentsInPriorityQueue
}

$existingRows = @()
if (Test-Path -LiteralPath $CsvOutputPath) {
    $existingRows = @(Import-Csv -LiteralPath $CsvOutputPath)
}

$filteredExistingRows = @(
    $existingRows |
    Where-Object {
        $_.GeneratedAt -ne $historyRow.GeneratedAt -and
        $_.SnapshotDateKey -ne $historyRow.SnapshotDateKey
    }
)

$allRows = @($filteredExistingRows + $historyRow)
$sortedRows = @(
    $allRows |
    Sort-Object `
        @{ Expression = { [string]$_.SnapshotDateKey } }, `
        @{ Expression = { [string]$_.GeneratedAt } }
)

$csvDirectory = Split-Path -Parent $CsvOutputPath
if ($csvDirectory -and -not (Test-Path -LiteralPath $csvDirectory)) {
    New-Item -ItemType Directory -Path $csvDirectory -Force | Out-Null
}

$sortedRows | Export-Csv -LiteralPath $CsvOutputPath -NoTypeInformation -Encoding UTF8

$jsonPayload = [pscustomobject]@{
    GeneratedAt = (Get-Date).ToString('s')
    RowCount    = $sortedRows.Count
    Rows        = @($sortedRows)
}

$jsonPayload | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $JsonOutputPath -Encoding UTF8

Write-Host "Operational history CSV written to: $CsvOutputPath"
Write-Host "Operational history JSON written to: $JsonOutputPath"

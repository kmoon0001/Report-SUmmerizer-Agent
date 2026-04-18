param(
    [string]$Path = 'D:\SNF AI Dashboard\data\processed\pcc_resident_list_current.active-only.csv'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath $Path)) {
    throw "File not found: $Path"
}

$firstRow = Import-Csv -LiteralPath $Path | Select-Object -First 1
if (-not $firstRow) {
    throw "File has no rows: $Path"
}

if ('LoadBatchId' -notin $firstRow.PSObject.Properties.Name) {
    throw "LoadBatchId column not found in: $Path"
}

$loadBatchId = ([string]$firstRow.LoadBatchId).Trim()
if ([string]::IsNullOrWhiteSpace($loadBatchId)) {
    throw "LoadBatchId is blank in: $Path"
}

Write-Output $loadBatchId

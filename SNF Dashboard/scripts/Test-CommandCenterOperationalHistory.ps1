param(
    [string]$SummaryJsonPath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\command_center_operational_summary.json',
    [string]$HistoryCsvPath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\command_center_operational_history.csv',
    [string]$ArchiveRoot = 'D:\my agents copilot studio\SNF Dashboard\data\exports\executive-command-center\history'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

foreach ($path in @($SummaryJsonPath, $HistoryCsvPath)) {
    if (-not (Test-Path -LiteralPath $path)) {
        throw "Required history input not found: $path"
    }
}

$summary = Get-Content -LiteralPath $SummaryJsonPath -Raw | ConvertFrom-Json
$historyRows = @(Import-Csv -LiteralPath $HistoryCsvPath)
if ($historyRows.Count -lt 1) {
    throw 'Operational history CSV has no rows.'
}

$latestRow = $historyRows[-1]

if ([string]$latestRow.SnapshotDateKey -ne [string]$summary.snapshotDateKey) {
    throw "History latest SnapshotDateKey mismatch. History=$($latestRow.SnapshotDateKey) Summary=$($summary.snapshotDateKey)"
}

$expectedChecks = @(
    @{ Name = 'CurrentResidents'; Expected = [int]$summary.metrics.currentResidents },
    @{ Name = 'ResidentsWithDocumentationItems'; Expected = [int]$summary.metrics.residentsWithDocumentationItems },
    @{ Name = 'OutstandingDocumentationItems'; Expected = [int]$summary.metrics.outstandingDocumentationItems },
    @{ Name = 'OverdueDocumentationItems'; Expected = [int]$summary.metrics.overdueDocumentationItems },
    @{ Name = 'ResidentsWithTherapy'; Expected = [int]$summary.metrics.residentsWithTherapy },
    @{ Name = 'TotalTherapyMinutes'; Expected = [int]$summary.metrics.totalTherapyMinutes },
    @{ Name = 'ResidentsInPriorityQueue'; Expected = [int]$summary.metrics.residentsInPriorityQueue }
)

foreach ($check in $expectedChecks) {
    $actual = [int]$latestRow.($check.Name)
    if ($actual -ne [int]$check.Expected) {
        throw "History latest row mismatch for $($check.Name). History=$actual Summary=$($check.Expected)"
    }
}

if (-not (Test-Path -LiteralPath $ArchiveRoot)) {
    throw "Executive snapshot archive root not found: $ArchiveRoot"
}

$snapshotDirectories = @(Get-ChildItem -LiteralPath $ArchiveRoot -Directory | Sort-Object Name)
if ($snapshotDirectories.Count -lt 1) {
    throw 'Executive snapshot archive root has no snapshot directories.'
}

$latestSnapshot = $snapshotDirectories[-1].FullName
$requiredSnapshotFiles = @(
    'snapshot-manifest.json',
    'executive-command-center.html',
    'command_center_operational_summary.json'
)

foreach ($fileName in $requiredSnapshotFiles) {
    $path = Join-Path $latestSnapshot $fileName
    if (-not (Test-Path -LiteralPath $path)) {
        throw "Latest executive snapshot is missing required file: $path"
    }
}

Write-Host 'Operational history validation passed.'
Write-Host "Latest history row snapshot date: $($latestRow.SnapshotDateKey)"
Write-Host "Latest archive snapshot: $latestSnapshot"


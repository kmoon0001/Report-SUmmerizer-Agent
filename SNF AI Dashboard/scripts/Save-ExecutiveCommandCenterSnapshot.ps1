param(
    [string]$ProcessedRoot = 'D:\SNF AI Dashboard\data\processed',
    [string]$BundleRoot = 'D:\SNF AI Dashboard\data\exports\executive-command-center\current',
    [string]$ArchiveRoot = 'D:\SNF AI Dashboard\data\exports\executive-command-center\history'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$requiredPaths = @(
    (Join-Path $ProcessedRoot 'command_center_operational_summary.json'),
    (Join-Path $BundleRoot 'executive-command-center.html'),
    (Join-Path $BundleRoot 'report-bundle-manifest.json')
)

foreach ($path in $requiredPaths) {
    if (-not (Test-Path -LiteralPath $path)) {
        throw "Required snapshot source not found: $path"
    }
}

$summary = Get-Content -LiteralPath (Join-Path $ProcessedRoot 'command_center_operational_summary.json') -Raw | ConvertFrom-Json
$stamp = [string]$summary.snapshotDateKey
if ([string]::IsNullOrWhiteSpace($stamp)) {
    $stamp = (Get-Date).ToString('yyyyMMdd')
}

$runStamp = (Get-Date).ToString('yyyyMMdd-HHmmss')
$snapshotDirectory = Join-Path $ArchiveRoot ("snapshot-{0}-{1}" -f $stamp, $runStamp)
New-Item -ItemType Directory -Path $snapshotDirectory -Force | Out-Null

$filesToArchive = @(
    (Join-Path $ProcessedRoot 'command_center_operational_summary.md'),
    (Join-Path $ProcessedRoot 'command_center_operational_summary.json'),
    (Join-Path $ProcessedRoot 'command_center_operational_history.csv'),
    (Join-Path $ProcessedRoot 'command_center_operational_history.json'),
    (Join-Path $ProcessedRoot 'command_center_executive_unit_snapshot.csv'),
    (Join-Path $ProcessedRoot 'command_center_documentation_queue.csv'),
    (Join-Path $ProcessedRoot 'command_center_documentation_queue.by-unit.csv'),
    (Join-Path $ProcessedRoot 'command_center_therapy_coverage.csv'),
    (Join-Path $ProcessedRoot 'command_center_therapy_coverage.by-unit.csv'),
    (Join-Path $ProcessedRoot 'command_center_therapy_documentation_priority.csv'),
    (Join-Path $ProcessedRoot 'command_center_therapy_documentation_priority.by-unit.csv'),
    (Join-Path $ProcessedRoot 'command_center_cross_source_runlog.json'),
    (Join-Path $BundleRoot 'executive-command-center.html'),
    (Join-Path $BundleRoot 'report-bundle-manifest.json'),
    (Join-Path $BundleRoot 'command_center_operational_summary.md'),
    (Join-Path $BundleRoot 'command_center_operational_summary.json')
)

$includedFiles = @()
foreach ($path in $filesToArchive) {
    if (Test-Path -LiteralPath $path) {
        $destination = Join-Path $snapshotDirectory ([System.IO.Path]::GetFileName($path))
        Copy-Item -LiteralPath $path -Destination $destination -Force
        $includedFiles += [System.IO.Path]::GetFileName($path)
    }
}

$manifest = [pscustomobject]@{
    GeneratedAt      = (Get-Date).ToString('s')
    SnapshotDateKey  = $stamp
    SnapshotPath     = $snapshotDirectory
    IncludedFiles    = @($includedFiles | Sort-Object -Unique)
    Metrics          = $summary.metrics
}

$manifest | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath (Join-Path $snapshotDirectory 'snapshot-manifest.json') -Encoding UTF8
Write-Host "Executive snapshot archived to: $snapshotDirectory"

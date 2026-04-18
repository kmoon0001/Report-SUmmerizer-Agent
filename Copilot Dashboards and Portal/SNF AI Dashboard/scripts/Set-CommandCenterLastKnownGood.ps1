param(
    [string]$ProjectRoot = 'D:\SNF AI Dashboard',
    [string]$OutputJsonPath = 'D:\SNF AI Dashboard\data\processed\command_center_last_known_good.json'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$shareRoot = Join-Path $ProjectRoot 'data\exports\executive-command-center\share'
$historyRoot = Join-Path $ProjectRoot 'data\exports\executive-command-center\history'
$latestSharePointer = Join-Path $shareRoot 'latest-share-package.txt'

if (-not (Test-Path -LiteralPath $latestSharePointer)) {
    throw "Latest share package pointer not found: $latestSharePointer"
}

$shareZipPath = (Get-Content -LiteralPath $latestSharePointer -Raw).Trim()
if (-not (Test-Path -LiteralPath $shareZipPath)) {
    throw "Latest share package path does not exist: $shareZipPath"
}

$latestSnapshot = @(
    Get-ChildItem -LiteralPath $historyRoot -Directory -ErrorAction SilentlyContinue |
        Sort-Object LastWriteTime -Descending |
        Select-Object -First 1
)

$payload = [pscustomobject]@{
    UpdatedAt = (Get-Date).ToString('s')
    ShareZipPath = $shareZipPath
    SharePointerPath = $latestSharePointer
    SnapshotPath = if ($latestSnapshot.Count -gt 0) { $latestSnapshot[0].FullName } else { '' }
}

$outDir = Split-Path -Parent $OutputJsonPath
if ($outDir -and -not (Test-Path -LiteralPath $outDir)) {
    New-Item -ItemType Directory -Path $outDir -Force | Out-Null
}

$payload | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath $OutputJsonPath -Encoding UTF8
Write-Host "Last known good pointer written to: $OutputJsonPath"


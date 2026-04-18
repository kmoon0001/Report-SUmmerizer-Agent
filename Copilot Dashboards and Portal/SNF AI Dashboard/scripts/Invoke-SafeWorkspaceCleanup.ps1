param(
    [string]$ProjectRoot = 'D:\SNF AI Dashboard',
    [int]$KeepSharePackages = 3,
    [int]$KeepHistorySnapshots = 5,
    [switch]$RemoveToolCaches = $false
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Remove-IfExists {
    param([string]$Path)
    if (Test-Path -LiteralPath $Path) {
        Remove-Item -LiteralPath $Path -Recurse -Force
        Write-Host "Removed: $Path"
    }
}

$tmpPath = Join-Path $ProjectRoot 'tmp'
Remove-IfExists -Path $tmpPath

if ($RemoveToolCaches.IsPresent) {
    Remove-IfExists -Path (Join-Path $ProjectRoot '.playwright-mcp')
    Remove-IfExists -Path (Join-Path $ProjectRoot 'playwright\node_modules')
    Remove-IfExists -Path (Join-Path $ProjectRoot 'playwright\test-results')
}

$shareRoot = Join-Path $ProjectRoot 'data\exports\executive-command-center\share'
if (Test-Path -LiteralPath $shareRoot) {
    $zips = @(
        Get-ChildItem -LiteralPath $shareRoot -Filter 'executive-command-center-*.zip' -File |
            Sort-Object LastWriteTime -Descending
    )
    $toDelete = @($zips | Select-Object -Skip $KeepSharePackages)
    foreach ($f in $toDelete) {
        Remove-Item -LiteralPath $f.FullName -Force
        Write-Host "Removed old share package: $($f.FullName)"
    }
}

$historyRoot = Join-Path $ProjectRoot 'data\exports\executive-command-center\history'
if (Test-Path -LiteralPath $historyRoot) {
    $snapshots = @(
        Get-ChildItem -LiteralPath $historyRoot -Directory |
            Sort-Object LastWriteTime -Descending
    )
    $toDelete = @($snapshots | Select-Object -Skip $KeepHistorySnapshots)
    foreach ($d in $toDelete) {
        Remove-Item -LiteralPath $d.FullName -Recurse -Force
        Write-Host "Removed old history snapshot: $($d.FullName)"
    }
}

Write-Host 'Safe workspace cleanup completed.'


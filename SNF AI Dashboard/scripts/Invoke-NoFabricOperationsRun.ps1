param(
    [switch]$SkipQaSweep = $false
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$refreshArgs = @{}
if ($SkipQaSweep.IsPresent) {
    $refreshArgs['SkipQaSweep'] = $true
}

& 'D:\SNF AI Dashboard\scripts\Invoke-ExecutiveCommandCenterRefresh.ps1' @refreshArgs
& 'D:\SNF AI Dashboard\scripts\Validate-SnfAiDashboardProject.ps1'

$latestPointerPath = 'D:\SNF AI Dashboard\data\exports\executive-command-center\share\latest-share-package.txt'
if (-not (Test-Path -LiteralPath $latestPointerPath)) {
    throw "Latest share package pointer not found: $latestPointerPath"
}

$latestZipPath = (Get-Content -LiteralPath $latestPointerPath -Raw).Trim()
if (-not (Test-Path -LiteralPath $latestZipPath)) {
    throw "Latest share package path does not exist: $latestZipPath"
}

Write-Host ''
Write-Host 'No-Fabric operations run complete.'
Write-Host "Share package: $latestZipPath"

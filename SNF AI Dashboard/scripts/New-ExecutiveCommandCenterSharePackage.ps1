param(
    [string]$BundleRoot = 'D:\SNF AI Dashboard\data\exports\executive-command-center\current',
    [string]$ShareRoot = 'D:\SNF AI Dashboard\data\exports\executive-command-center\share'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$required = @(
    (Join-Path $BundleRoot 'executive-command-center.html'),
    (Join-Path $BundleRoot 'report-bundle-manifest.json'),
    (Join-Path $BundleRoot 'executive-command-center.data.json')
)

$missing = @($required | Where-Object { -not (Test-Path -LiteralPath $_) })
if ($missing.Count -gt 0) {
    throw "Cannot build share package. Missing bundle files: $($missing -join ', ')"
}

if (-not (Test-Path -LiteralPath $ShareRoot)) {
    New-Item -ItemType Directory -Path $ShareRoot -Force | Out-Null
}

$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$zipName = "executive-command-center-$timestamp.zip"
$zipPath = Join-Path $ShareRoot $zipName

if (Test-Path -LiteralPath $zipPath) {
    Remove-Item -LiteralPath $zipPath -Force
}

Compress-Archive -Path (Join-Path $BundleRoot '*') -DestinationPath $zipPath -Force

$latestPointerPath = Join-Path $ShareRoot 'latest-share-package.txt'
$zipPath | Set-Content -LiteralPath $latestPointerPath -Encoding UTF8

Write-Host "Executive share package created: $zipPath"
Write-Host "Latest pointer: $latestPointerPath"

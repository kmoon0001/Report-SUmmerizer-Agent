param(
    [string]$ProjectRoot = 'D:\my agents copilot studio\SNF Dashboard',
    [string]$PointerPath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\command_center_last_known_good.json',
    [string]$BundleRoot = 'D:\my agents copilot studio\SNF Dashboard\data\exports\executive-command-center\current'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath $PointerPath)) {
    throw "Last known good pointer not found: $PointerPath"
}

$pointer = Get-Content -LiteralPath $PointerPath -Raw | ConvertFrom-Json
$zipPath = [string]$pointer.ShareZipPath
if ([string]::IsNullOrWhiteSpace($zipPath) -or -not (Test-Path -LiteralPath $zipPath)) {
    throw "Last known good share zip not found: $zipPath"
}

if (-not (Test-Path -LiteralPath $BundleRoot)) {
    New-Item -ItemType Directory -Path $BundleRoot -Force | Out-Null
}

Get-ChildItem -LiteralPath $BundleRoot -Force -File -ErrorAction SilentlyContinue | Remove-Item -Force
Get-ChildItem -LiteralPath $BundleRoot -Force -Directory -ErrorAction SilentlyContinue | Remove-Item -Recurse -Force

Expand-Archive -LiteralPath $zipPath -DestinationPath $BundleRoot -Force
Write-Host "Restored current bundle from last known good zip: $zipPath"
Write-Host "Bundle root: $BundleRoot"



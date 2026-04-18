Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$mcsDir = Join-Path $projectRoot ".mcs"

if (-not (Test-Path $mcsDir)) {
  throw ".mcs directory not found at $mcsDir"
}

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupDir = Join-Path $projectRoot ".mcs-cache-backup-$timestamp"
$preserve = @(
  ".gitkeep",
  "README.md",
  "conn.json"
)

New-Item -ItemType Directory -Path $backupDir -Force | Out-Null

$moved = @()
Get-ChildItem -Path $mcsDir -Force | ForEach-Object {
  if ($preserve -contains $_.Name) {
    return
  }

  $destination = Join-Path $backupDir $_.Name
  Move-Item -LiteralPath $_.FullName -Destination $destination -Force
  $moved += $_.Name
}

Write-Host "Reset Copilot Studio workspace cache."
Write-Host "Preserved:" ($preserve -join ", ")
Write-Host "Backup:" $backupDir
Write-Host "Moved files:" ($moved -join ", ")

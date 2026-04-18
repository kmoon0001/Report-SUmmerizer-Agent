param(
  [Parameter(Mandatory = $true)]
  [string]$DestinationPath
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$source = Split-Path -Parent $PSScriptRoot
if (Test-Path $DestinationPath) {
  throw "Destination already exists: $DestinationPath"
}

New-Item -ItemType Directory -Path $DestinationPath | Out-Null

$excludeNames = @(
  'node_modules',
  'playwright-report',
  'test-results',
  '.git',
  '.qodo',
  '.env',
  '.mcs',
  'playwright'
)

Get-ChildItem -LiteralPath $source -Force | Where-Object {
  ($excludeNames -notcontains $_.Name) -and
  ($_.Name -notlike '.mcs-cache-backup-*')
} | ForEach-Object {
  $target = Join-Path $DestinationPath $_.Name
  if ($_.PSIsContainer) {
    Copy-Item -LiteralPath $_.FullName -Destination $target -Recurse -Force
  } else {
    Copy-Item -LiteralPath $_.FullName -Destination $target -Force
  }
}

$playwrightSource = Join-Path $source 'playwright'
$playwrightTarget = Join-Path $DestinationPath 'playwright'
if (Test-Path $playwrightSource) {
  New-Item -ItemType Directory -Path $playwrightTarget | Out-Null
  Get-ChildItem -LiteralPath $playwrightSource -Force | Where-Object {
    $_.Name -notin @('node_modules', 'playwright-report', 'test-results')
  } | ForEach-Object {
    $target = Join-Path $playwrightTarget $_.Name
    if ($_.PSIsContainer) {
      Copy-Item -LiteralPath $_.FullName -Destination $target -Recurse -Force
    } else {
      Copy-Item -LiteralPath $_.FullName -Destination $target -Force
    }
  }
}

$mcsSource = Join-Path $source '.mcs'
$mcsTarget = Join-Path $DestinationPath '.mcs'
New-Item -ItemType Directory -Path $mcsTarget | Out-Null
foreach ($name in @('.gitkeep', 'README.md')) {
  $src = Join-Path $mcsSource $name
  if (Test-Path $src) {
    Copy-Item -LiteralPath $src -Destination (Join-Path $mcsTarget $name) -Force
  }
}

Write-Host "Copied SNF AI Dashboard template to $DestinationPath"
Write-Host "Excluded extension cache, connection state, local .env, and nested dependency folders."

param(
  [string]$EnvironmentFile = '.env.example',
  [string]$OutputFile = '.env',
  [switch]$Force
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

if (-not (Test-Path $EnvironmentFile)) {
  throw "Missing environment template: $EnvironmentFile"
}

if ((Test-Path $OutputFile) -and -not $Force) {
  throw "Target already exists: $OutputFile. Re-run with -Force to overwrite."
}

Copy-Item -LiteralPath $EnvironmentFile -Destination $OutputFile -Force
Write-Host "Created $OutputFile from $EnvironmentFile"
Write-Host "Review and populate the copied environment file before using live integrations."

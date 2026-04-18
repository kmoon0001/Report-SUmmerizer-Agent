param(
  [string]$EnvFile = (Join-Path (Split-Path -Parent $PSScriptRoot) ".env"),
  [switch]$WarnOnly
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$manifestPath = Join-Path $projectRoot "integrations\integration-manifest.json"

if (-not (Test-Path $manifestPath)) {
  throw "Integration manifest not found: $manifestPath"
}

if (-not (Test-Path $EnvFile)) {
  $message = ".env file not found: $EnvFile"
  if ($WarnOnly) {
    Write-Warning $message
    exit 0
  }
  throw $message
}

$envValues = @{}
Get-Content -Path $EnvFile | ForEach-Object {
  $line = $_.Trim()
  if (-not $line -or $line.StartsWith("#")) { return }
  $parts = $line -split "=", 2
  if ($parts.Count -eq 2) {
    $envValues[$parts[0].Trim()] = $parts[1].Trim()
  }
}

$manifest = Get-Content -Raw $manifestPath | ConvertFrom-Json
$missing = [System.Collections.Generic.List[string]]::new()
$missingUnique = [System.Collections.Generic.HashSet[string]]::new()

Write-Host "SNF AI Dashboard environment check"
Write-Host ""

foreach ($integration in $manifest.integrations) {
  $required = @($integration.requiredEnv)
  $integrationMissing = @()
  foreach ($name in $required) {
    if (-not $envValues.ContainsKey($name) -or [string]::IsNullOrWhiteSpace($envValues[$name])) {
      $integrationMissing += $name
      $missing.Add($name)
      [void]$missingUnique.Add($name)
    }
  }

  if ($integrationMissing.Count -eq 0) {
    Write-Host "[OK] $($integration.name)"
  } else {
    Write-Host "[MISSING] $($integration.name): $($integrationMissing -join ', ')"
  }
}

Write-Host ""
if ($missing.Count -gt 0) {
  $uniqueNames = @($missingUnique | Sort-Object)
  $message = "Missing environment values ($($uniqueNames.Count)): $($uniqueNames -join ', ')"
  if ($WarnOnly) {
    Write-Warning $message
    exit 0
  }
  throw $message
}

Write-Host "Environment check passed."

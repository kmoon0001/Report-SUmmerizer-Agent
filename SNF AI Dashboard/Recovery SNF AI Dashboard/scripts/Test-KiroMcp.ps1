<#
  Smoke test for Kiro MCP prerequisites in this repo.

  Usage:
    powershell -ExecutionPolicy Bypass -File .\scripts\Test-KiroMcp.ps1
#>

$ErrorActionPreference = "Stop"

function Run-Check {
  param(
    [string]$Name,
    [scriptblock]$Action
  )

  Write-Host ""
  Write-Host "==> $Name" -ForegroundColor Cyan
  try {
    & $Action
    Write-Host "PASS: $Name" -ForegroundColor Green
    return $true
  } catch {
    Write-Host "FAIL: $Name" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    return $false
  }
}

$repoRoot = Split-Path -Parent $PSScriptRoot
$connPath = Join-Path $repoRoot "SNF AI Dashboard Recovery\.mcs\conn.json"

$ok = $true

$ok = (Run-Check -Name "dataverse cli present" -Action { dataverse --help | Out-Null }) -and $ok
$ok = (Run-Check -Name "playwright mcp package callable" -Action { npx -y @playwright/mcp@latest --help | Out-Null }) -and $ok
$ok = (Run-Check -Name "kiro workspace mcp config exists" -Action {
  $mcpConfig = Join-Path $repoRoot ".kiro\settings\mcp.json"
  if (-not (Test-Path $mcpConfig)) { throw "Missing $mcpConfig" }
  Get-Content $mcpConfig | ConvertFrom-Json | Out-Null
}) -and $ok
$ok = (Run-Check -Name "repo conn.json exists and has required ids" -Action {
  if (-not (Test-Path $connPath)) { throw "Missing $connPath" }
  $conn = Get-Content $connPath | ConvertFrom-Json
  if (-not $conn.EnvironmentId) { throw "EnvironmentId missing in conn.json" }
  if (-not $conn.AgentId) { throw "AgentId missing in conn.json" }
  Write-Host "EnvironmentId: $($conn.EnvironmentId)"
  Write-Host "AgentId: $($conn.AgentId)"
  Write-Host "DataverseEndpoint: $($conn.DataverseEndpoint)"
}) -and $ok

Write-Host ""
if ($ok) {
  Write-Host "MCP smoke test PASSED." -ForegroundColor Green
  exit 0
}

Write-Host "MCP smoke test FAILED." -ForegroundColor Red
exit 1

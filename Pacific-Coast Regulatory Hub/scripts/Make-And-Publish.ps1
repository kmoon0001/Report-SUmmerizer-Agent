<#
  One-command publish wrapper for Copilot Studio bots in this repo.

  Default behavior is safe preview (dry run).

  Usage examples:
    # Preview what would run:
    powershell -ExecutionPolicy Bypass -File .\scripts\Make-And-Publish.ps1

    # Publish using current PAC profile:
    powershell -ExecutionPolicy Bypass -File .\scripts\Make-And-Publish.ps1 -Execute

    # Select PAC profile index, then publish:
    powershell -ExecutionPolicy Bypass -File .\scripts\Make-And-Publish.ps1 -ProfileIndex 1 -Execute

    # Override env/bot id (rare):
    powershell -ExecutionPolicy Bypass -File .\scripts\Make-And-Publish.ps1 -EnvironmentId "<env-guid>" -AgentId "<bot-guid>" -Execute
#>

[CmdletBinding()]
param(
  [int]$ProfileIndex = -1,
  [string]$EnvironmentId,
  [string]$AgentId,
  [switch]$Execute
)

$ErrorActionPreference = "Stop"

function Write-Step {
  param([string]$Message)
  Write-Host ""
  Write-Host "==> $Message" -ForegroundColor Cyan
}

function Resolve-ConnJsonPath {
  param([string]$RepoRoot)

  $matches = @(Get-ChildItem -Path $RepoRoot -Recurse -Force -File -Filter conn.json |
      Where-Object { $_.FullName -match "\\\.mcs\\conn\.json$" } |
      Select-Object -ExpandProperty FullName)

  if ($matches.Count -eq 1) { return $matches[0] }
  if ($matches.Count -gt 1) {
    throw "Multiple .mcs/conn.json files found. Narrow to one project folder."
  }
  throw "No .mcs/conn.json found under repo root."
}

function Invoke-OrEcho {
  param([string]$CommandText, [switch]$DoExecute)

  if ($DoExecute) {
    Write-Host "RUN: $CommandText" -ForegroundColor Yellow
    Invoke-Expression $CommandText
  } else {
    Write-Host "DRY-RUN: $CommandText" -ForegroundColor Yellow
  }
}

$repoRoot = Split-Path -Parent $PSScriptRoot
$connPath = Resolve-ConnJsonPath -RepoRoot $repoRoot
$conn = Get-Content $connPath -Raw | ConvertFrom-Json

if (-not $EnvironmentId) { $EnvironmentId = $conn.EnvironmentId }
if (-not $AgentId) { $AgentId = $conn.AgentId }

if (-not $EnvironmentId) { throw "EnvironmentId is missing. Set in .mcs/conn.json or pass -EnvironmentId." }
if (-not $AgentId) { throw "AgentId is missing. Set in .mcs/conn.json or pass -AgentId." }

Write-Step "Context"
Write-Host "repoRoot: $repoRoot"
Write-Host "conn.json: $connPath"
Write-Host "EnvironmentId: $EnvironmentId"
Write-Host "AgentId: $AgentId"
Write-Host "Mode: $(if($Execute){'EXECUTE'}else{'DRY-RUN'})"

Write-Step "Auth"
Invoke-OrEcho -CommandText "pac auth list" -DoExecute:$Execute
if ($ProfileIndex -ge 0) {
  Invoke-OrEcho -CommandText "pac auth select --index $ProfileIndex" -DoExecute:$Execute
}

Write-Step "Publish + Verify"
Invoke-OrEcho -CommandText "pac copilot publish --environment $EnvironmentId --bot $AgentId" -DoExecute:$Execute
Invoke-OrEcho -CommandText "pac copilot status --environment $EnvironmentId --bot-id $AgentId" -DoExecute:$Execute
Invoke-OrEcho -CommandText "pac copilot list --environment $EnvironmentId" -DoExecute:$Execute

Write-Step "Done"
if (-not $Execute) {
  Write-Host "Dry run complete. Re-run with -Execute to perform publish." -ForegroundColor Green
} else {
  Write-Host "Publish flow completed." -ForegroundColor Green
}

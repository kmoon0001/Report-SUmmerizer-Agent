param(
  [switch]$RequireConnection
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$connPath = Join-Path $projectRoot ".mcs\conn.json"
$validatorPath = Join-Path $PSScriptRoot "Validate-SnfAiDashboardProject.ps1"
$buttonRoutingPath = Join-Path $PSScriptRoot "Test-ButtonOnlyQuestionRouting.ps1"

Write-Host "SNF AI Dashboard preflight"
Write-Host ""

if (-not (Test-Path $validatorPath)) {
  throw "Validator not found: $validatorPath"
}

Write-Host "1. Repo validation"
& powershell -ExecutionPolicy Bypass -File $validatorPath

Write-Host ""
Write-Host "2. Button-only routing validation"
if (-not (Test-Path $buttonRoutingPath)) {
  throw "Button-only routing validator not found: $buttonRoutingPath"
}
& powershell -ExecutionPolicy Bypass -File $buttonRoutingPath

Write-Host ""
Write-Host "3. PAC CLI check"
$pacCommand = Get-Command pac -ErrorAction SilentlyContinue
if ($null -eq $pacCommand) {
  Write-Warning "PAC CLI was not found on PATH. Local IDE Extension will be required for deploy."
} else {
  $pacHelp = & pac help 2>&1
  $pacNameLine = $pacHelp | Select-String -Pattern "^Microsoft PowerPlatform CLI$" | Select-Object -First 1
  $pacVersionLine = $pacHelp | Select-String -Pattern "^Version:" | Select-Object -First 1
  if ($null -eq $pacNameLine -or $null -eq $pacVersionLine) {
    Write-Warning "PAC CLI is installed but did not return expected help output."
  } else {
    Write-Host ($pacNameLine.Line.Trim())
    Write-Host ($pacVersionLine.Line.Trim())
  }
}

Write-Host ""
Write-Host "4. Workspace connection"
if (Test-Path $connPath) {
  $conn = Get-Content $connPath -Raw | ConvertFrom-Json
  Write-Host "EnvironmentId:" $conn.EnvironmentId
  Write-Host "AgentId:" $conn.AgentId
  if ($conn.PSObject.Properties.Name -contains "Path" -and $conn.Path) {
    Write-Host "Path:" $conn.Path
  }
} elseif ($RequireConnection) {
  throw ".mcs/conn.json was not found and -RequireConnection was set."
} else {
  Write-Host "No .mcs/conn.json found. Preview/apply/publish is not ready yet."
}

Write-Host ""
Write-Host "5. Recommended next step"
if (Test-Path $connPath) {
  Write-Host "- Run Copilot Studio: Preview changes in VS Code."
  Write-Host "- If the diff is correct, run Copilot Studio: Apply changes."
  Write-Host "- Then run scripts\\Publish-Copilot.ps1 and scripts\\Get-CopilotStatus.ps1."
} else {
  Write-Host "- Attach the workspace to a Copilot Studio agent and create .mcs/conn.json."
}

Write-Host ""
Write-Host "Preflight passed."

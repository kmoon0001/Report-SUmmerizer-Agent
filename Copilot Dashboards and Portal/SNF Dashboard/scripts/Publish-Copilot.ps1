param(
  [string]$EnvironmentId,
  [string]$BotId
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$connPath = Join-Path $PSScriptRoot '..\.mcs\conn.json'
if ((-not $EnvironmentId -or -not $BotId) -and (Test-Path $connPath)) {
  $conn = Get-Content $connPath -Raw | ConvertFrom-Json
  if (-not $EnvironmentId) { $EnvironmentId = $conn.EnvironmentId }
  if (-not $BotId) { $BotId = $conn.AgentId }
}

if (-not $EnvironmentId -or -not $BotId) {
  throw 'Set EnvironmentId and BotId or add .mcs/conn.json first.'
}

try {
  pac copilot publish --environment $EnvironmentId --bot $BotId
}
catch {
  Write-Warning "pac copilot publish threw an error. Verifying live state before treating publish as failed."
  $statusOutput = & pac copilot status --environment $EnvironmentId --bot-id $BotId 2>&1
  $listOutput = & pac copilot list --environment $EnvironmentId 2>&1
  $botLine = $listOutput | Select-String -Pattern ([regex]::Escape($BotId)) | Select-Object -First 1

  if (($statusOutput -join "`n") -match 'Provisioned' -and $null -ne $botLine -and $botLine.Line -match 'Published') {
    Write-Warning "Publish appears to have succeeded despite PAC CLI response parsing failure."
    Write-Host ($statusOutput -join "`n")
    Write-Host $botLine.Line
    exit 0
  }

  throw
}

param(
  [string]$EnvironmentId,
  [string]$BotId
)

$connPath = Join-Path $PSScriptRoot '..\.mcs\conn.json'
if ((-not $EnvironmentId -or -not $BotId) -and (Test-Path $connPath)) {
  $conn = Get-Content $connPath -Raw | ConvertFrom-Json
  if (-not $EnvironmentId) { $EnvironmentId = $conn.EnvironmentId }
  if (-not $BotId) { $BotId = $conn.AgentId }
}

if (-not $EnvironmentId -or -not $BotId) {
  throw 'Set EnvironmentId and BotId or add .mcs/conn.json first.'
}

pac copilot status --environment $EnvironmentId --bot-id $BotId


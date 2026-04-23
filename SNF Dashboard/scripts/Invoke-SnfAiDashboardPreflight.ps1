param(
  [switch]$RequireConnection
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$connPath = Join-Path $projectRoot ".mcs\conn.json"
$validatorPath = Join-Path $PSScriptRoot "Validate-SnfAiDashboardProject.ps1"
$buttonRoutingPath = Join-Path $PSScriptRoot "Test-ButtonOnlyQuestionRouting.ps1"

function Normalize-Url([string]$url) {
  if ([string]::IsNullOrWhiteSpace($url)) { return "" }
  return ($url.Trim().TrimEnd('/')).ToLowerInvariant()
}

function Parse-ValueFromMultiline([string[]]$lines, [string]$prefix) {
  $line = $lines | Where-Object { $_ -match "^\s*$([regex]::Escape($prefix))\s*:" } | Select-Object -First 1
  if ($null -eq $line) { return "" }
  return (($line -split ":", 2)[1]).Trim()
}

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
  if ($conn.PSObject.Properties.Name -contains "DataverseEndpoint" -and $conn.DataverseEndpoint) {
    Write-Host "DataverseEndpoint:" $conn.DataverseEndpoint
  }
  if ($conn.PSObject.Properties.Name -contains "Path" -and $conn.Path) {
    Write-Host "Path:" $conn.Path
  }

  if ($null -ne $pacCommand) {
    Write-Host ""
    Write-Host "5. Connection consistency checks"

    $orgListRaw = & pac org list --json 2>&1
    $orgListText = $orgListRaw | Out-String
    $orgList = $null
    try {
      $orgList = $orgListText | ConvertFrom-Json
    } catch {
      throw "Unable to parse 'pac org list --json' output. Ensure PAC auth is valid before sync."
    }

    $connEnvironmentId = "$($conn.EnvironmentId)"
    $connDataverseEndpoint = ""
    if ($conn.PSObject.Properties.Name -contains "DataverseEndpoint" -and $conn.DataverseEndpoint) {
      $connDataverseEndpoint = "$($conn.DataverseEndpoint)"
    }
    $normalizedConnEndpoint = Normalize-Url $connDataverseEndpoint

    $matchedOrgById = $orgList | Where-Object { $_.EnvironmentIdentifier.Id -eq $connEnvironmentId } | Select-Object -First 1
    if ($null -eq $matchedOrgById) {
      throw ".mcs/conn.json EnvironmentId '$connEnvironmentId' was not found in PAC org list."
    }
    $matchedOrgByIdUrl = Normalize-Url $matchedOrgById.EnvironmentUrl
    if ($normalizedConnEndpoint -and $matchedOrgByIdUrl -and $normalizedConnEndpoint -ne $matchedOrgByIdUrl) {
      throw ".mcs/conn.json is inconsistent: EnvironmentId '$connEnvironmentId' maps to '$($matchedOrgById.EnvironmentUrl)' but DataverseEndpoint is '$connDataverseEndpoint'. Reattach with Copilot Studio: Open agent."
    }

    $whoRaw = & pac org who 2>&1
    $whoLines = @($whoRaw | ForEach-Object { "$_" })
    $activeEnvironmentId = Parse-ValueFromMultiline -lines $whoLines -prefix "Environment ID"
    $activeOrgUrl = Parse-ValueFromMultiline -lines $whoLines -prefix "Org URL"
    $normalizedActiveUrl = Normalize-Url $activeOrgUrl

    if ($activeEnvironmentId -and $activeEnvironmentId -ne $connEnvironmentId) {
      throw "Active PAC environment '$activeEnvironmentId' does not match .mcs/conn.json EnvironmentId '$connEnvironmentId'. Run: pac auth select --index <matching profile>."
    }
    if ($normalizedConnEndpoint -and $normalizedActiveUrl -and $normalizedConnEndpoint -ne $normalizedActiveUrl) {
      throw "Active PAC Org URL '$activeOrgUrl' does not match .mcs/conn.json DataverseEndpoint '$connDataverseEndpoint'. Re-select profile and re-open agent."
    }

    $copilotListOutput = & pac copilot list --environment $connEnvironmentId 2>&1 | Out-String
    if ($copilotListOutput -notmatch [regex]::Escape("$($conn.AgentId)")) {
      throw ".mcs/conn.json AgentId '$($conn.AgentId)' was not found in environment '$connEnvironmentId'. This usually indicates environment drift."
    }
    Write-Host "Connection consistency: PASS"
  }
} elseif ($RequireConnection) {
  throw ".mcs/conn.json was not found and -RequireConnection was set."
} else {
  Write-Host "No .mcs/conn.json found. Preview/apply/publish is not ready yet."
}

Write-Host ""
Write-Host "6. Recommended next step"
if (Test-Path $connPath) {
  Write-Host "- Run Copilot Studio: Preview changes in VS Code."
  Write-Host "- If the diff is correct, run Copilot Studio: Apply changes."
  Write-Host "- Then run scripts\\Publish-Copilot.ps1 and scripts\\Get-CopilotStatus.ps1."
} else {
  Write-Host "- Attach the workspace to a Copilot Studio agent and create .mcs/conn.json."
}

Write-Host ""
Write-Host "Preflight passed."

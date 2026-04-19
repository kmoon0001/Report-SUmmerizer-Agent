<#
.SYNOPSIS
Bootstraps Kiro/Antigravity MCP setup into a separate repository.

.DESCRIPTION
Copies core setup assets from this repo into a target repo:
- AGENT.md
- KIRO_ANTIGRAVITY_SETUP.md
- scripts/Setup-IdeAutomationPrereqs.ps1
- scripts/Test-KiroMcp.ps1
- scripts/Bootstrap-NewRepoMcp.ps1
- .kiro/settings/mcp.json

Optionally updates target `.kiro/settings/mcp.json` and `.mcs/conn.json`
with new Dataverse endpoint/environment/agent values.

.EXAMPLE
powershell -ExecutionPolicy Bypass -File .\scripts\Bootstrap-NewRepoMcp.ps1 `
  -TargetRepoPath "D:\SimpleLTC QM Coach V2" `
  -DataverseEndpoint "https://orgxxxx.crm.dynamics.com/" `
  -EnvironmentId "00000000-0000-0000-0000-000000000000" `
  -AgentId "11111111-1111-1111-1111-111111111111" `
  -RunSetup
#>

[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)]
  [string]$TargetRepoPath,
  [string]$DataverseEndpoint,
  [string]$EnvironmentId,
  [string]$AgentId,
  [string]$ConnJsonPath,
  [switch]$RunSetup,
  [switch]$RunSmoke
)

$ErrorActionPreference = "Stop"

function Write-Step {
  param([string]$Message)
  Write-Host ""
  Write-Host "==> $Message" -ForegroundColor Cyan
}

function Resolve-PathSafe {
  param([string]$Path)
  if ([System.IO.Path]::IsPathRooted($Path)) {
    return $Path
  }
  return Join-Path -Path (Get-Location) -ChildPath $Path
}

function Ensure-Dir {
  param([string]$Path)
  if (-not (Test-Path $Path)) {
    New-Item -ItemType Directory -Path $Path -Force | Out-Null
  }
}

function Copy-FileEnsureParent {
  param(
    [string]$Source,
    [string]$Destination
  )
  Ensure-Dir -Path (Split-Path -Parent $Destination)
  Copy-Item -Path $Source -Destination $Destination -Force
  Write-Host "Copied: $Destination"
}

function Set-McpDataverseUrl {
  param(
    [string]$McpJsonPath,
    [string]$NewEndpoint
  )

  if (-not $NewEndpoint) { return }
  if (-not (Test-Path $McpJsonPath)) { return }

  $cfg = Get-Content $McpJsonPath -Raw | ConvertFrom-Json
  if (-not $cfg.mcpServers) { return }
  if (-not $cfg.mcpServers.dataverse_snf) { return }
  if (-not $cfg.mcpServers.dataverse_snf.args -or $cfg.mcpServers.dataverse_snf.args.Count -lt 2) { return }

  $cfg.mcpServers.dataverse_snf.args[1] = $NewEndpoint
  $cfg | ConvertTo-Json -Depth 10 | Set-Content -Path $McpJsonPath -Encoding UTF8
  Write-Host "Updated Dataverse URL in: $McpJsonPath"
}

function Find-ConnJson {
  param([string]$RepoRoot)
  $matches = Get-ChildItem -Path $RepoRoot -Recurse -File -Filter conn.json |
    Where-Object { $_.FullName -match "\\\.mcs\\conn\.json$" } |
    Select-Object -ExpandProperty FullName
  return @($matches)
}

function Update-OrCreateConnJson {
  param(
    [string]$RepoRoot,
    [string]$ExplicitConnPath,
    [string]$Endpoint,
    [string]$EnvId,
    [string]$BotId
  )

  if (-not $Endpoint -and -not $EnvId -and -not $BotId) {
    Write-Host "No conn.json overrides provided; skipping conn.json update."
    return
  }

  $targetConn = $null
  if ($ExplicitConnPath) {
    $targetConn = Resolve-PathSafe -Path $ExplicitConnPath
  } else {
    $found = Find-ConnJson -RepoRoot $RepoRoot
    if ($found.Count -eq 1) {
      $targetConn = $found[0]
    } elseif ($found.Count -gt 1) {
      Write-Host "Multiple .mcs/conn.json files found. Provide -ConnJsonPath to choose one:" -ForegroundColor Yellow
      $found | ForEach-Object { Write-Host "  $_" }
      return
    } else {
      $targetConn = Join-Path $RepoRoot ".mcs\conn.json"
      Ensure-Dir -Path (Split-Path -Parent $targetConn)
      @{} | ConvertTo-Json | Set-Content -Path $targetConn -Encoding UTF8
      Write-Host "Created new conn.json at $targetConn"
    }
  }

  $obj = @{}
  if (Test-Path $targetConn) {
    try {
      $obj = Get-Content $targetConn -Raw | ConvertFrom-Json
    } catch {
      $obj = @{}
    }
  }

  if ($Endpoint) { $obj | Add-Member -NotePropertyName DataverseEndpoint -NotePropertyValue $Endpoint -Force }
  if ($EnvId) { $obj | Add-Member -NotePropertyName EnvironmentId -NotePropertyValue $EnvId -Force }
  if ($BotId) { $obj | Add-Member -NotePropertyName AgentId -NotePropertyValue $BotId -Force }

  $obj | ConvertTo-Json -Depth 20 | Set-Content -Path $targetConn -Encoding UTF8
  Write-Host "Updated conn.json: $targetConn"
}

$sourceRepo = Split-Path -Parent $PSScriptRoot
$targetRepo = Resolve-PathSafe -Path $TargetRepoPath

Write-Step "Source/Target"
Write-Host "Source repo: $sourceRepo"
Write-Host "Target repo: $targetRepo"

Ensure-Dir -Path $targetRepo
Ensure-Dir -Path (Join-Path $targetRepo "scripts")
Ensure-Dir -Path (Join-Path $targetRepo ".kiro\settings")

Write-Step "Copying bootstrap assets"
Copy-FileEnsureParent -Source (Join-Path $sourceRepo "AGENT.md") -Destination (Join-Path $targetRepo "AGENT.md")
Copy-FileEnsureParent -Source (Join-Path $sourceRepo "KIRO_ANTIGRAVITY_SETUP.md") -Destination (Join-Path $targetRepo "KIRO_ANTIGRAVITY_SETUP.md")
Copy-FileEnsureParent -Source (Join-Path $sourceRepo "scripts\Setup-IdeAutomationPrereqs.ps1") -Destination (Join-Path $targetRepo "scripts\Setup-IdeAutomationPrereqs.ps1")
Copy-FileEnsureParent -Source (Join-Path $sourceRepo "scripts\Test-KiroMcp.ps1") -Destination (Join-Path $targetRepo "scripts\Test-KiroMcp.ps1")
Copy-FileEnsureParent -Source (Join-Path $sourceRepo "scripts\Bootstrap-NewRepoMcp.ps1") -Destination (Join-Path $targetRepo "scripts\Bootstrap-NewRepoMcp.ps1")
Copy-FileEnsureParent -Source (Join-Path $sourceRepo ".kiro\settings\mcp.json") -Destination (Join-Path $targetRepo ".kiro\settings\mcp.json")

Write-Step "Applying repo-specific overrides"
$targetMcp = Join-Path $targetRepo ".kiro\settings\mcp.json"
Set-McpDataverseUrl -McpJsonPath $targetMcp -NewEndpoint $DataverseEndpoint
Update-OrCreateConnJson -RepoRoot $targetRepo -ExplicitConnPath $ConnJsonPath -Endpoint $DataverseEndpoint -EnvId $EnvironmentId -BotId $AgentId

if ($RunSetup) {
  Write-Step "Running setup script in target repo"
  powershell -ExecutionPolicy Bypass -File (Join-Path $targetRepo "scripts\Setup-IdeAutomationPrereqs.ps1")
}

if ($RunSmoke) {
  Write-Step "Running MCP smoke test in target repo"
  powershell -ExecutionPolicy Bypass -File (Join-Path $targetRepo "scripts\Test-KiroMcp.ps1")
}

Write-Step "Done"
Write-Host "Next steps:"
Write-Host "1) Open target repo in Kiro and reload."
Write-Host "2) Confirm MCP servers: playwright, dataverse_snf."
Write-Host "3) Run: pac auth list; pac auth select --index <n>"
Write-Host "4) Verify target .mcs/conn.json EnvironmentId + AgentId before publish."

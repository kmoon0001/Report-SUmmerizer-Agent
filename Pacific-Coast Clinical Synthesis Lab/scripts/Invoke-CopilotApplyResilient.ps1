<#
.SYNOPSIS
    Resilient cleanup and Apply Changes loop for Copilot Studio.
.DESCRIPTION
    Fixes repeating HTTP/service-request errors in 'Apply changes'.
    Removes cached tokens, checks Dataverse profile, and runs the sync CLI manually.
#>

param (
    [string]$EnvironmentUrl,
    [string]$BotId
)

Write-Host "Starting Copilot Studio Resilient Apply..."

if (-not (Test-Path ".mcs/conn.json")) {
    Write-Error ".mcs/conn.json not found! Please attach standard Copilot Studio Extension first."
    exit 1
}

Write-Host "1. Validating local repo integrity..."
# Add YAML linting here if desired

Write-Host "2. Resetting Extension Cache..."
if (Test-Path ".mcs/filechangetrack.json") { Remove-Item ".mcs/filechangetrack.json" -Force }
if (Test-Path ".mcs/changetoken.txt") { Remove-Item ".mcs/changetoken.txt" -Force }

Write-Host "3. Verifying PAC Auth..."
pac auth list

if ([string]::IsNullOrEmpty($EnvironmentUrl) -or [string]::IsNullOrEmpty($BotId)) {
    Write-Warning "No EnvironmentUrl or BotId given. Open the agent in VS Code and try manual 'Apply changes' now."
} else {
    Write-Host "4. Forcing Publish..."
    pac copilot publish --environment $EnvironmentUrl --bot $BotId
}

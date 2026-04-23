<#
.SYNOPSIS
    Fleet-wide Copilot Studio sync recovery orchestrator.
    Validates all agents, switches PAC auth profiles, and guides through manual VS Code extension steps.

.DESCRIPTION
    Runs automated pre-checks for each agent in the Pacific Coast clinical swarm,
    then prints step-by-step manual instructions for the VS Code extension operations
    that cannot be automated from the terminal.

.NOTES
    Created: 2026-04-21
    Environments:
      [1] orgbd048f00 (Therapy AI Agents Dev)
      [2] pccapackage (PCCA Package)
#>

param(
    [switch]$SkipTheraDoc,
    [switch]$DashboardOnly
)

$ErrorActionPreference = 'Continue'
$pacCli = "C:\Users\kevin\AppData\Local\Microsoft\PowerAppsCLI\pac.cmd"

$agents = @(
    @{
        Name        = "TheraDoc"
        Path        = "D:\my agents copilot studio\TheraDoc"
        Environment = "https://pccapackage.crm.dynamics.com/"
        AgentGuid   = "09b002b6-ec3c-f111-88b5-000d3a5b0d6c"
        AuthIndex   = 2
        Status      = "HEALTHY"
        LiveName    = "AgentTheraDoc Hardened"
    },
    @{
        Name        = "SNF Dashboard"
        Path        = "D:\my agents copilot studio\SNF Dashboard"
        Environment = "https://orgbd048f00.crm.dynamics.com/"
        AgentGuid   = "b5d87f73-c34f-4eca-9405-29f8f7e62d71"
        AuthIndex   = 1
        Status      = "CACHE_RESET"
        LiveName    = "SNF AI Dashboard"
    },
    @{
        Name        = "Clinical Synthesis Lab"
        Path        = "D:\my agents copilot studio\Pacific-Coast Clinical Synthesis Lab"
        Environment = "https://pccapackage.crm.dynamics.com/"
        AgentGuid   = "60a37e9b-0e3d-f111-88b5-000d3a5b0d6c"
        AuthIndex   = 2
        Status      = "PARTIAL_SYNC"
        LiveName    = "SNF Rehab Agent"
    },
    @{
        Name        = "Regulatory Hub"
        Path        = "D:\my agents copilot studio\Pacific-Coast Regulatory Hub"
        Environment = "https://orgbd048f00.crm.dynamics.com/"
        AgentGuid   = "ea52ad9c-8233-f111-88b3-6045bd09a824"
        AuthIndex   = 1
        Status      = "NO_CACHE"
        LiveName    = "SimpleLTC QM Coach V2"
    },
    @{
        Name        = "SNF Command Center"
        Path        = "D:\my agents copilot studio\SNF Agent Command Center"
        Environment = "https://orgbd048f00.crm.dynamics.com/"
        AgentGuid   = "8c9b244f-073a-f111-88b3-000d3a5b95c6"
        AuthIndex   = 1
        Status      = "NO_CACHE"
        LiveName    = "SNF Command Center Agent"
    },
    @{
        Name        = "Denial Defense Agent"
        Path        = "D:\my agents copilot studio\Denial Defense Agent"
        Environment = "https://orgbd048f00.crm.dynamics.com/"
        AgentGuid   = $null
        AuthIndex   = 1
        Status      = "NOT_CREATED"
        LiveName    = $null
    }
)

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  FLEET SYNC RECOVERY - $(Get-Date -Format 'yyyy-MM-dd HH:mm')" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

foreach ($agent in $agents) {
    if ($SkipTheraDoc -and $agent.Name -eq "TheraDoc") { continue }
    if ($DashboardOnly -and $agent.Name -ne "SNF Dashboard") { continue }

    Write-Host "--- $($agent.Name) ---" -ForegroundColor Yellow
    Write-Host "  Live Name:   $(if ($agent.LiveName) { $agent.LiveName } else { 'NOT CREATED' })"
    Write-Host "  Environment: $($agent.Environment)"
    Write-Host "  Agent GUID:  $(if ($agent.AgentGuid) { $agent.AgentGuid } else { 'N/A' })"
    Write-Host "  Status:      $($agent.Status)"

    # Check .mcs cache state
    $mcsPath = Join-Path $agent.Path ".mcs"
    $connJson = Join-Path $mcsPath "conn.json"
    $botDef = Join-Path $mcsPath "botdefinition.json"

    $hasConn = Test-Path $connJson
    $hasBotDef = Test-Path $botDef

    Write-Host "  conn.json:        $(if ($hasConn) { 'EXISTS' } else { 'MISSING' })"
    Write-Host "  botdefinition:    $(if ($hasBotDef) { 'EXISTS' } else { 'MISSING' })"

    # Run validation if script exists
    $validateScript = Join-Path $agent.Path "scripts\Validate-SnfAiDashboardProject.ps1"
    if (Test-Path $validateScript) {
        Write-Host "  Running validation..." -ForegroundColor Gray
        try {
            $result = & powershell -ExecutionPolicy Bypass -File $validateScript 2>&1
            if ($LASTEXITCODE -eq 0 -or $result -match "Validation passed") {
                Write-Host "  Validation:       PASS" -ForegroundColor Green
            } else {
                Write-Host "  Validation:       FAIL" -ForegroundColor Red
                Write-Host "  $($result | Select-Object -Last 3)" -ForegroundColor Red
            }
        } catch {
            Write-Host "  Validation:       ERROR - $($_.Exception.Message)" -ForegroundColor Red
        }
    }

    # Print action needed
    Write-Host ""
    switch ($agent.Status) {
        "HEALTHY" {
            Write-Host "  ACTION: Preview changes to confirm no drift." -ForegroundColor Green
            Write-Host "    Ctrl+Shift+P > Copilot Studio: Preview Changes"
        }
        "CACHE_RESET" {
            Write-Host "  ACTION: Rebuild cache via extension." -ForegroundColor Magenta
            Write-Host "    1. Ctrl+Shift+P > Copilot Studio: Open Agent"
            Write-Host "       Select: Therapy AI Agents Dev > $($agent.LiveName)"
            Write-Host "    2. Wait for botdefinition.json to appear in .mcs/"
            Write-Host "    3. Ctrl+Shift+P > Copilot Studio: Get Changes"
            Write-Host "    4. Ctrl+Shift+P > Copilot Studio: Preview Changes"
            Write-Host "    5. If clean: Ctrl+Shift+P > Copilot Studio: Apply Changes"
            Write-Host "    6. Publish:"
            Write-Host "       pac copilot publish --environment $($agent.Environment) --bot $($agent.AgentGuid)"
        }
        "PARTIAL_SYNC" {
            Write-Host "  ACTION: Delete .mcs and clone fresh." -ForegroundColor Magenta
            Write-Host "    1. Delete .mcs folder"
            Write-Host "    2. Ctrl+Shift+P > Copilot Studio: Clone Agent"
            Write-Host "       Select: PCCA Package > $($agent.LiveName)"
            Write-Host "    3. Copy .mcs from clone into this workspace"
            Write-Host "    4. Ctrl+Shift+P > Copilot Studio: Get Changes"
            Write-Host "    5. Ctrl+Shift+P > Copilot Studio: Preview Changes"
            Write-Host "    6. Ctrl+Shift+P > Copilot Studio: Apply Changes"
            Write-Host "    7. Publish:"
            Write-Host "       pac copilot publish --environment $($agent.Environment) --bot $($agent.AgentGuid)"
        }
        "NO_CACHE" {
            Write-Host "  ACTION: Clone agent for first-time connection." -ForegroundColor Magenta
            Write-Host "    1. Ctrl+Shift+P > Copilot Studio: Clone Agent"
            Write-Host "       Select environment > $($agent.LiveName)"
            Write-Host "    2. Clone to temp folder, copy .mcs into this workspace"
            Write-Host "    3. Ctrl+Shift+P > Copilot Studio: Get Changes"
            Write-Host "    4. Ctrl+Shift+P > Copilot Studio: Preview Changes"
            Write-Host "    5. Ctrl+Shift+P > Copilot Studio: Apply Changes"
            Write-Host "    6. Publish:"
            Write-Host "       pac copilot publish --environment $($agent.Environment) --bot $($agent.AgentGuid)"
        }
        "NOT_CREATED" {
            Write-Host "  ACTION: Create agent in Copilot Studio first." -ForegroundColor Red
            Write-Host "    1. Go to https://copilotstudio.microsoft.com"
            Write-Host "    2. Select environment: Therapy AI Agents Dev"
            Write-Host "    3. Create new agent: 'Denial Defense Agent'"
            Write-Host "    4. Add instructions from AGENT.md"
            Write-Host "    5. Save and publish"
            Write-Host "    6. Clone to this workspace via VS Code extension"
        }
    }

    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  PUBLISH COMMANDS (after Apply succeeds)" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "# Switch to orgbd048f00 for Dashboard, Reg Hub, Command Center:" -ForegroundColor Gray
Write-Host "pac auth select --index 1"
Write-Host "pac copilot publish --environment https://orgbd048f00.crm.dynamics.com/ --bot b5d87f73-c34f-4eca-9405-29f8f7e62d71  # SNF Dashboard"
Write-Host "pac copilot publish --environment https://orgbd048f00.crm.dynamics.com/ --bot ea52ad9c-8233-f111-88b3-6045bd09a824  # Regulatory Hub"
Write-Host "pac copilot publish --environment https://orgbd048f00.crm.dynamics.com/ --bot 8c9b244f-073a-f111-88b3-000d3a5b95c6  # Command Center"
Write-Host ""
Write-Host "# Switch to pccapackage for TheraDoc, Clinical Synthesis Lab:" -ForegroundColor Gray
Write-Host "pac auth select --index 2"
Write-Host "pac copilot publish --environment https://pccapackage.crm.dynamics.com/ --bot 09b002b6-ec3c-f111-88b5-000d3a5b0d6c  # TheraDoc"
Write-Host "pac copilot publish --environment https://pccapackage.crm.dynamics.com/ --bot 60a37e9b-0e3d-f111-88b5-000d3a5b0d6c  # Clinical Synthesis Lab"
Write-Host ""
Write-Host "# Verify all agents:" -ForegroundColor Gray
Write-Host "pac auth select --index 1"
Write-Host "pac copilot list --environment https://orgbd048f00.crm.dynamics.com/"
Write-Host "pac auth select --index 2"
Write-Host "pac copilot list --environment https://pccapackage.crm.dynamics.com/"
Write-Host ""

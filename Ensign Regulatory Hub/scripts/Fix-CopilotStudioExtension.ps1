<#
.SYNOPSIS
    Troubleshoot and fix Copilot Studio extension "Apply Changes" issues
.DESCRIPTION
    Diagnoses why the extension isn't applying changes and provides fixes
#>

param(
    [Parameter()]
    [string]$AgentPath = "SimpleLTC QM Coach V2"
)

$ErrorActionPreference = "Continue"

Write-Host @"
================================================================
  COPILOT STUDIO EXTENSION TROUBLESHOOTING
================================================================
"@ -ForegroundColor Cyan

Write-Host ""

# Check 1: Extension installed
Write-Host "[1/7] Checking if extension is installed..." -ForegroundColor Yellow
$extensions = code --list-extensions 2>&1
if ($extensions -match "copilotstudio|CopilotStudio") {
    Write-Host "  FOUND: Extension is installed" -ForegroundColor Green
} else {
    Write-Host "  NOT FOUND: Extension may not be installed" -ForegroundColor Red
    Write-Host "  Install: Ctrl+Shift+X -> Search 'Copilot Studio'" -ForegroundColor Yellow
}

Write-Host ""

# Check 2: Agent folder structure
Write-Host "[2/7] Checking agent folder structure..." -ForegroundColor Yellow
if (Test-Path $AgentPath) {
    Write-Host "  FOUND: $AgentPath" -ForegroundColor Green
    
    $mcsFolder = Join-Path $AgentPath ".mcs"
    if (Test-Path $mcsFolder) {
        Write-Host "  FOUND: .mcs folder" -ForegroundColor Green
    } else {
        Write-Host "  MISSING: .mcs folder (extension needs this)" -ForegroundColor Red
    }
    
    $connFile = Join-Path $AgentPath ".mcs/conn.json"
    if (Test-Path $connFile) {
        Write-Host "  FOUND: conn.json" -ForegroundColor Green
        $conn = Get-Content $connFile | ConvertFrom-Json
        Write-Host "    Environment: $($conn.EnvironmentId)" -ForegroundColor Cyan
        Write-Host "    Agent: $($conn.AgentId)" -ForegroundColor Cyan
    } else {
        Write-Host "  MISSING: conn.json (extension needs this)" -ForegroundColor Red
    }
} else {
    Write-Host "  NOT FOUND: $AgentPath" -ForegroundColor Red
}

Write-Host ""

# Check 3: PAC authentication
Write-Host "[3/7] Checking PAC authentication..." -ForegroundColor Yellow
try {
    $authList = pac auth list 2>&1
    if ($authList -match "Index|Name") {
        Write-Host "  FOUND: PAC profiles exist" -ForegroundColor Green
        $authList | Select-String -Pattern "\*" | ForEach-Object {
            Write-Host "  Active: $_" -ForegroundColor Cyan
        }
    } else {
        Write-Host "  NO PROFILES: Run 'pac auth create'" -ForegroundColor Red
    }
} catch {
    Write-Host "  ERROR: Cannot check PAC auth" -ForegroundColor Red
}

Write-Host ""

# Check 4: VS Code workspace
Write-Host "[4/7] Checking VS Code workspace..." -ForegroundColor Yellow
$workspaceFiles = Get-ChildItem -Filter "*.code-workspace" -ErrorAction SilentlyContinue
if ($workspaceFiles) {
    Write-Host "  FOUND: Workspace file(s)" -ForegroundColor Green
    $workspaceFiles | ForEach-Object {
        Write-Host "    $($_.Name)" -ForegroundColor Cyan
    }
} else {
    Write-Host "  NO WORKSPACE: Extension works better with workspace" -ForegroundColor Yellow
    Write-Host "  Create: File -> Save Workspace As..." -ForegroundColor Cyan
}

Write-Host ""

# Check 5: Extension commands available
Write-Host "[5/7] Checking extension commands..." -ForegroundColor Yellow
Write-Host "  Open Command Palette (Ctrl+Shift+P) and look for:" -ForegroundColor Cyan
Write-Host "    - Copilot Studio: Attach Agent" -ForegroundColor White
Write-Host "    - Copilot Studio: Get Changes" -ForegroundColor White
Write-Host "    - Copilot Studio: Preview Changes" -ForegroundColor White
Write-Host "    - Copilot Studio: Apply Changes" -ForegroundColor White
Write-Host "    - Copilot Studio: Publish" -ForegroundColor White

Write-Host ""

# Check 6: Common issues
Write-Host "[6/7] Common 'Apply Changes' issues..." -ForegroundColor Yellow
Write-Host ""
Write-Host "  Issue 1: Not attached to agent" -ForegroundColor Red
Write-Host "    Fix: Ctrl+Shift+P -> 'Copilot Studio: Attach Agent'" -ForegroundColor Green
Write-Host "    Select: SimpleLTC QM Coach V2" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Issue 2: No changes to apply" -ForegroundColor Red
Write-Host "    Fix: Edit a .mcs.yml file first, then Apply" -ForegroundColor Green
Write-Host ""
Write-Host "  Issue 3: Not signed in" -ForegroundColor Red
Write-Host "    Fix: Click Copilot Studio icon -> Sign In" -ForegroundColor Green
Write-Host ""
Write-Host "  Issue 4: Wrong environment selected" -ForegroundColor Red
Write-Host "    Fix: Check environment in extension sidebar" -ForegroundColor Green
Write-Host ""
Write-Host "  Issue 5: Extension not activated" -ForegroundColor Red
Write-Host "    Fix: Open any .mcs.yml file to activate extension" -ForegroundColor Green
Write-Host ""

# Check 7: Workflow recommendation
Write-Host "[7/7] Recommended workflow..." -ForegroundColor Yellow
Write-Host ""
Write-Host "  Step 1: Attach to agent" -ForegroundColor Cyan
Write-Host "    Ctrl+Shift+P -> 'Copilot Studio: Attach Agent'" -ForegroundColor White
Write-Host "    Select: SimpleLTC QM Coach V2" -ForegroundColor White
Write-Host ""
Write-Host "  Step 2: Get latest from cloud" -ForegroundColor Cyan
Write-Host "    Ctrl+Shift+P -> 'Copilot Studio: Get Changes'" -ForegroundColor White
Write-Host ""
Write-Host "  Step 3: Edit local files" -ForegroundColor Cyan
Write-Host "    Edit any .mcs.yml file" -ForegroundColor White
Write-Host "    Save (Ctrl+S)" -ForegroundColor White
Write-Host ""
Write-Host "  Step 4: Preview changes" -ForegroundColor Cyan
Write-Host "    Ctrl+Shift+P -> 'Copilot Studio: Preview Changes'" -ForegroundColor White
Write-Host ""
Write-Host "  Step 5: Apply changes" -ForegroundColor Cyan
Write-Host "    Ctrl+Shift+P -> 'Copilot Studio: Apply Changes'" -ForegroundColor White
Write-Host ""
Write-Host "  Step 6: Publish" -ForegroundColor Cyan
Write-Host "    Ctrl+Shift+P -> 'Copilot Studio: Publish'" -ForegroundColor White
Write-Host ""

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "QUICK FIX:" -ForegroundColor Yellow
Write-Host "  1. Open VS Code" -ForegroundColor White
Write-Host "  2. Ctrl+Shift+P" -ForegroundColor White
Write-Host "  3. Type: 'Copilot Studio: Attach Agent'" -ForegroundColor White
Write-Host "  4. Select your agent" -ForegroundColor White
Write-Host "  5. Try 'Apply Changes' again" -ForegroundColor White
Write-Host ""


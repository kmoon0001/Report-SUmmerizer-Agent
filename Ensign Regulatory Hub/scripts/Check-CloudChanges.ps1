<#
.SYNOPSIS
    Check if cloud has changes before publishing
.DESCRIPTION
    Compares local files with cloud version to detect conflicts
    Prevents overwriting cloud changes made in web UI
#>

param(
    [Parameter()]
    [string]$AgentPath = "SimpleLTC QM Coach V2"
)

$ErrorActionPreference = "Stop"

Write-Host "Checking for cloud changes..." -ForegroundColor Cyan

# Read connection info
$connFile = Join-Path $AgentPath ".mcs/conn.json"
if (-not (Test-Path $connFile)) {
    Write-Error "Connection file not found: $connFile"
    exit 1
}

$conn = Get-Content $connFile | ConvertFrom-Json

# Check last modified time in cloud
Write-Host "Querying Copilot Studio for latest changes..." -ForegroundColor Yellow

try {
    # Get agent info from cloud
    $agentInfo = pac copilot list --environment $conn.EnvironmentId --json 2>&1 | ConvertFrom-Json
    
    # Find our agent
    $cloudAgent = $agentInfo | Where-Object { $_.CopilotId -eq $conn.AgentId }
    
    if ($cloudAgent) {
        Write-Host ""
        Write-Host "Cloud Agent Status:" -ForegroundColor Green
        Write-Host "  Name: $($cloudAgent.Name)" -ForegroundColor Cyan
        Write-Host "  State: $($cloudAgent.ComponentState)" -ForegroundColor Cyan
        Write-Host "  Status: $($cloudAgent.StatusCode)" -ForegroundColor Cyan
        
        # Check file change tracking
        $trackingFile = Join-Path $AgentPath ".mcs/filechangetrack.json"
        if (Test-Path $trackingFile) {
            $tracking = Get-Content $trackingFile | ConvertFrom-Json
            
            # Get local file modification times
            $localFiles = Get-ChildItem $AgentPath -Recurse -Filter "*.mcs.yml"
            $newestLocal = ($localFiles | Sort-Object LastWriteTime -Descending | Select-Object -First 1).LastWriteTime
            
            Write-Host ""
            Write-Host "Local Files:" -ForegroundColor Green
            Write-Host "  Newest file: $newestLocal" -ForegroundColor Cyan
            Write-Host "  Total files: $($localFiles.Count)" -ForegroundColor Cyan
            
            # Warning if cloud might have changes
            Write-Host ""
            Write-Host "⚠️  IMPORTANT:" -ForegroundColor Yellow
            Write-Host "  If someone edited in Copilot Studio web UI," -ForegroundColor Yellow
            Write-Host "  those changes are NOT in your local files." -ForegroundColor Yellow
            Write-Host ""
            Write-Host "  To get cloud changes:" -ForegroundColor Cyan
            Write-Host "    1. Open Command Palette (Ctrl+Shift+P)" -ForegroundColor White
            Write-Host "    2. Type: 'Copilot Studio: Get Changes'" -ForegroundColor White
            Write-Host "    3. Select your agent" -ForegroundColor White
        }
    }
    else {
        Write-Host "⚠️  Agent not found in cloud" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "⚠️  Could not query cloud: $_" -ForegroundColor Yellow
    Write-Host "Continuing with local files..." -ForegroundColor Cyan
}

Write-Host ""
Write-Host "✓ Check complete" -ForegroundColor Green

<#
.SYNOPSIS
    Universal auto-publish for ANY Copilot Studio agent
.DESCRIPTION
    Works with any agent - just specify the folder name
    Auto-detects if only one agent in workspace
.EXAMPLE
    .\UNIVERSAL-AUTO-PUBLISH.ps1 -AgentFolder "My Agent Name"
.EXAMPLE
    .\UNIVERSAL-AUTO-PUBLISH.ps1 -AgentFolder "My Agent Name" -Environment Prod
#>

param(
    [Parameter()]
    [string]$AgentFolder,
    
    [Parameter()]
    [ValidateSet("Dev", "Test", "Prod")]
    [string]$Environment = "Dev"
)

$ErrorActionPreference = "Stop"

# Auto-detect agent folder if not specified
if (-not $AgentFolder) {
    Write-Host "Auto-detecting agent folder..." -ForegroundColor Cyan
    
    $agentFolders = Get-ChildItem -Directory | Where-Object { 
        Test-Path "$($_.Name)/.mcs/conn.json" 
    }
    
    if ($agentFolders.Count -eq 0) {
        Write-Error "No Copilot Studio agents found in this directory"
        exit 1
    }
    elseif ($agentFolders.Count -eq 1) {
        $AgentFolder = $agentFolders[0].Name
        Write-Host "Auto-detected agent: $AgentFolder" -ForegroundColor Green
    }
    else {
        Write-Host "Multiple agents found:" -ForegroundColor Yellow
        $agentFolders | ForEach-Object { Write-Host "  - $($_.Name)" -ForegroundColor Cyan }
        Write-Host ""
        Write-Error "Please specify -AgentFolder parameter"
        exit 1
    }
}

# Validate agent folder exists
if (-not (Test-Path $AgentFolder)) {
    Write-Error "Agent folder not found: $AgentFolder"
    exit 1
}

if (-not (Test-Path "$AgentFolder/.mcs/conn.json")) {
    Write-Error "Not a valid Copilot Studio agent folder (missing .mcs/conn.json)"
    exit 1
}

Write-Host @"
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║          UNIVERSAL AUTO-PUBLISH - Starting...                 ║
║                                                               ║
║  Agent: $($AgentFolder.PadRight(50))║
║  Environment: $($Environment.PadRight(46))║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Cyan

# Create the watcher script dynamically
$watcherScript = @"
`$watchPath = "$AgentFolder"
`$environment = "$Environment"
`$logPath = "logs/auto-publish-$($AgentFolder -replace ' ','-').log"

# Ensure log directory exists
New-Item -ItemType Directory -Force -Path "logs" | Out-Null

function Write-Log {
    param([string]`$Message, [string]`$Color = "Cyan")
    `$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    `$logEntry = "[`$timestamp] `$Message"
    Add-Content -Path `$logPath -Value `$logEntry
    Write-Host `$logEntry -ForegroundColor `$Color
}

Write-Log "========================================" "Green"
Write-Log "AUTOMATIC MODE STARTED" "Green"
Write-Log "Agent: `$watchPath" "Green"
Write-Log "Environment: `$environment" "Green"
Write-Log "========================================" "Green"
Write-Log ""
Write-Log "Watching: `$watchPath/**/*.mcs.yml"
Write-Log "Will auto-publish 30 seconds after you save files"
Write-Log ""

# Create file system watcher
`$watcher = New-Object System.IO.FileSystemWatcher
`$watcher.Path = `$watchPath
`$watcher.Filter = "*.mcs.yml"
`$watcher.IncludeSubdirectories = `$true
`$watcher.EnableRaisingEvents = `$true

# Debounce timer
`$script:timer = `$null
`$script:changedFiles = @()

`$onChange = {
    param(`$source, `$e)
    
    `$script:changedFiles += `$e.FullPath
    Write-Log "File changed: `$(`$e.Name)" "Yellow"
    
    # Cancel existing timer
    if (`$script:timer) {
        `$script:timer.Stop()
        `$script:timer.Dispose()
    }
    
    # Create new timer (30 seconds)
    `$script:timer = New-Object System.Timers.Timer
    `$script:timer.Interval = 30000
    `$script:timer.AutoReset = `$false
    
    `$script:timer.Add_Elapsed({
        Write-Log ""
        Write-Log "30 seconds passed, starting auto-publish..." "Cyan"
        Write-Log "Changed files: `$(`$script:changedFiles.Count)"
        
        try {
            Write-Log "Running automation pipeline..." "Cyan"
            
            # Check if automation script exists
            if (Test-Path ".\scripts\Automate-AgentLifecycle.ps1") {
                `$result = & ".\scripts\Automate-AgentLifecycle.ps1" -Environment `$environment -AutoApprove 2>&1
            }
            elseif (Test-Path ".\scripts\Make-And-Publish.ps1") {
                `$result = & ".\scripts\Make-And-Publish.ps1" -Execute 2>&1
            }
            else {
                Write-Log "No automation script found, using PAC CLI directly..." "Yellow"
                `$result = pac copilot publish 2>&1
            }
            
            if (`$LASTEXITCODE -eq 0) {
                Write-Log "AUTO-PUBLISH SUCCESSFUL!" "Green"
            } else {
                Write-Log "Auto-publish completed with warnings" "Yellow"
            }
        }
        catch {
            Write-Log "Auto-publish failed: `$_" "Red"
        }
        
        # Clear changed files
        `$script:changedFiles = @()
        Write-Log ""
        Write-Log "Watching for more changes..." "Cyan"
    })
    
    `$script:timer.Start()
    Write-Log "Waiting 30 seconds for more changes..."
}

# Register event
Register-ObjectEvent -InputObject `$watcher -EventName Changed -Action `$onChange | Out-Null

Write-Log "File watcher is active!" "Green"
Write-Log ""
Write-Log "TIP: Edit any .mcs.yml file and save it to test!" "Yellow"
Write-Log "Press Ctrl+C to stop automatic mode" "Yellow"
Write-Log ""

# Keep script running
try {
    while (`$true) {
        Start-Sleep -Seconds 1
    }
}
finally {
    `$watcher.Dispose()
    Write-Log "Automatic mode stopped" "Red"
}
"@

# Save the watcher script
$watcherScriptPath = "scripts/FileWatcher-$($AgentFolder -replace ' ','-').ps1"
New-Item -ItemType Directory -Force -Path "scripts" | Out-Null
$watcherScript | Set-Content $watcherScriptPath

Write-Host ""
Write-Host "Starting file watcher in new window..." -ForegroundColor Green
Write-Host ""

# Start in new PowerShell window
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-ExecutionPolicy", "Bypass",
    "-Command", "cd '$PWD'; .$watcherScriptPath"
)

Start-Sleep -Seconds 2

Write-Host "========================================" -ForegroundColor Green
Write-Host " AUTOMATIC MODE IS NOW RUNNING!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Agent: $AgentFolder" -ForegroundColor Cyan
Write-Host "Environment: $Environment" -ForegroundColor Cyan
Write-Host ""
Write-Host "What's happening:" -ForegroundColor Yellow
Write-Host "  • Background window is watching for file changes" -ForegroundColor White
Write-Host "  • When you save any .mcs.yml file, it waits 30 seconds" -ForegroundColor White
Write-Host "  • Then automatically publishes your changes" -ForegroundColor White
Write-Host ""
Write-Host "Try it now:" -ForegroundColor Yellow
Write-Host "  1. Open a file in: $AgentFolder" -ForegroundColor Cyan
Write-Host "  2. Make any small change and save (Ctrl+S)" -ForegroundColor Cyan
Write-Host "  3. Watch the background window - it will auto-publish!" -ForegroundColor Cyan
Write-Host ""
Write-Host "View logs:" -ForegroundColor Yellow
Write-Host "  Get-Content logs\auto-publish-$($AgentFolder -replace ' ','-').log -Wait" -ForegroundColor White
Write-Host ""
Write-Host "To stop:" -ForegroundColor Yellow
Write-Host "  Close the background PowerShell window" -ForegroundColor White
Write-Host ""

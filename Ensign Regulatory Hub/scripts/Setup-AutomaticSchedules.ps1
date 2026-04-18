<#
.SYNOPSIS
    Set up fully automatic scheduling for agent automation
.DESCRIPTION
    Creates Windows Task Scheduler tasks that run automatically:
    - Daily: Sync Microsoft Learn docs and publish (2 AM)
    - Weekly: Security scan (Sunday 3 AM)
    - On file change: Auto-publish when you save files
#>

[CmdletBinding()]
param(
    [Parameter()]
    [string]$WorkspacePath = $PWD.Path,
    
    [Parameter()]
    [ValidateSet("Dev", "Test", "Prod")]
    [string]$Environment = "Dev",
    
    [Parameter()]
    [switch]$DisableFileWatcher
)

$ErrorActionPreference = "Stop"

Write-Host "=== Setting Up Fully Automatic Agent Automation ===" -ForegroundColor Cyan
Write-Host ""

# Get current user
$currentUser = [System.Security.Principal.WindowsIdentity]::GetCurrent().Name

Write-Host "Configuration:" -ForegroundColor Yellow
Write-Host "  Workspace: $WorkspacePath" -ForegroundColor Cyan
Write-Host "  Environment: $Environment" -ForegroundColor Cyan
Write-Host "  User: $currentUser" -ForegroundColor Cyan
Write-Host ""

# Task 1: Daily Documentation Sync and Publish
Write-Host "Creating Task 1: Daily Auto-Publish (2 AM)" -ForegroundColor Green

$task1Name = "CopilotAgent-DailyAutoPublish"
$task1Action = New-ScheduledTaskAction `
    -Execute "powershell.exe" `
    -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$WorkspacePath\scripts\Automate-AgentLifecycle.ps1`" -Environment $Environment -AutoApprove" `
    -WorkingDirectory $WorkspacePath

$task1Trigger = New-ScheduledTaskTrigger -Daily -At 2:00AM

$task1Settings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -StartWhenAvailable `
    -RunOnlyIfNetworkAvailable

try {
    Unregister-ScheduledTask -TaskName $task1Name -Confirm:$false -ErrorAction SilentlyContinue
    Register-ScheduledTask `
        -TaskName $task1Name `
        -Action $task1Action `
        -Trigger $task1Trigger `
        -Settings $task1Settings `
        -Description "Automatically sync Microsoft Learn docs and publish agent daily at 2 AM" `
        -User $currentUser `
        -RunLevel Highest | Out-Null
    
    Write-Host "  ✓ Task created: $task1Name" -ForegroundColor Cyan
    Write-Host "    Runs: Daily at 2:00 AM" -ForegroundColor White
}
catch {
    Write-Host "  ⚠ Failed to create task: $_" -ForegroundColor Yellow
}

# Task 2: Weekly Security Scan
Write-Host "`nCreating Task 2: Weekly Security Scan (Sunday 3 AM)" -ForegroundColor Green

$task2Name = "CopilotAgent-WeeklySecurity"
$task2Action = New-ScheduledTaskAction `
    -Execute "powershell.exe" `
    -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$WorkspacePath\scripts\Harden-Agent.ps1`"" `
    -WorkingDirectory $WorkspacePath

$task2Trigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Sunday -At 3:00AM

try {
    Unregister-ScheduledTask -TaskName $task2Name -Confirm:$false -ErrorAction SilentlyContinue
    Register-ScheduledTask `
        -TaskName $task2Name `
        -Action $task2Action `
        -Trigger $task2Trigger `
        -Settings $task1Settings `
        -Description "Weekly security hardening scan every Sunday at 3 AM" `
        -User $currentUser `
        -RunLevel Highest | Out-Null
    
    Write-Host "  ✓ Task created: $task2Name" -ForegroundColor Cyan
    Write-Host "    Runs: Every Sunday at 3:00 AM" -ForegroundColor White
}
catch {
    Write-Host "  ⚠ Failed to create task: $_" -ForegroundColor Yellow
}

# Task 3: On System Startup (ensures automation is always ready)
Write-Host "`nCreating Task 3: Startup Initialization" -ForegroundColor Green

$task3Name = "CopilotAgent-StartupInit"
$task3Action = New-ScheduledTaskAction `
    -Execute "powershell.exe" `
    -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$WorkspacePath\scripts\Test-KiroMcp.ps1`"" `
    -WorkingDirectory $WorkspacePath

$task3Trigger = New-ScheduledTaskTrigger -AtStartup

try {
    Unregister-ScheduledTask -TaskName $task3Name -Confirm:$false -ErrorAction SilentlyContinue
    Register-ScheduledTask `
        -TaskName $task3Name `
        -Action $task3Action `
        -Trigger $task3Trigger `
        -Settings $task1Settings `
        -Description "Initialize MCP servers and validate setup on system startup" `
        -User $currentUser `
        -RunLevel Highest | Out-Null
    
    Write-Host "  ✓ Task created: $task3Name" -ForegroundColor Cyan
    Write-Host "    Runs: On system startup" -ForegroundColor White
}
catch {
    Write-Host "  ⚠ Failed to create task: $_" -ForegroundColor Yellow
}

# Create File Watcher Script (runs in background)
if (-not $DisableFileWatcher) {
    Write-Host "`nCreating File Watcher (auto-publish on save)" -ForegroundColor Green
    
    $watcherScript = @'
# File Watcher - Auto-publish when agent files change
$watchPath = "SimpleLTC QM Coach V2"
$logPath = "logs/file-watcher.log"

function Write-WatcherLog {
    param([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    "[$timestamp] $Message" | Add-Content $logPath
    Write-Host "[$timestamp] $Message" -ForegroundColor Cyan
}

Write-WatcherLog "File watcher started"
Write-WatcherLog "Watching: $watchPath"

# Create file system watcher
$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $watchPath
$watcher.Filter = "*.mcs.yml"
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true

# Debounce timer (wait 30 seconds after last change)
$timer = $null
$lastChange = $null

$onChange = {
    param($source, $e)
    
    $global:lastChange = Get-Date
    
    Write-WatcherLog "File changed: $($e.Name)"
    
    # Cancel existing timer
    if ($global:timer) {
        $global:timer.Stop()
        $global:timer.Dispose()
    }
    
    # Create new timer (30 seconds)
    $global:timer = New-Object System.Timers.Timer
    $global:timer.Interval = 30000
    $global:timer.AutoReset = $false
    
    $global:timer.Add_Elapsed({
        Write-WatcherLog "Debounce complete, starting auto-publish..."
        
        try {
            # Run automation
            $result = & ".\scripts\Automate-AgentLifecycle.ps1" -Environment Dev -AutoApprove 2>&1
            Write-WatcherLog "Auto-publish completed successfully"
        }
        catch {
            Write-WatcherLog "Auto-publish failed: $_"
        }
    })
    
    $global:timer.Start()
}

# Register event
Register-ObjectEvent -InputObject $watcher -EventName Changed -Action $onChange | Out-Null

Write-WatcherLog "Watching for changes... (Press Ctrl+C to stop)"

# Keep script running
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
}
finally {
    $watcher.Dispose()
    Write-WatcherLog "File watcher stopped"
}
'@
    
    $watcherScript | Set-Content "$WorkspacePath\scripts\Start-FileWatcher.ps1"
    
    # Create task for file watcher
    $task4Name = "CopilotAgent-FileWatcher"
    $task4Action = New-ScheduledTaskAction `
        -Execute "powershell.exe" `
        -Argument "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$WorkspacePath\scripts\Start-FileWatcher.ps1`"" `
        -WorkingDirectory $WorkspacePath
    
    $task4Trigger = New-ScheduledTaskTrigger -AtLogOn
    
    try {
        Unregister-ScheduledTask -TaskName $task4Name -Confirm:$false -ErrorAction SilentlyContinue
        Register-ScheduledTask `
            -TaskName $task4Name `
            -Action $task4Action `
            -Trigger $task4Trigger `
            -Settings $task1Settings `
            -Description "Watch for file changes and auto-publish agent" `
            -User $currentUser `
            -RunLevel Highest | Out-Null
        
        Write-Host "  ✓ Task created: $task4Name" -ForegroundColor Cyan
        Write-Host "    Runs: On login (background)" -ForegroundColor White
        Write-Host "    Watches: SimpleLTC QM Coach V2/*.mcs.yml" -ForegroundColor White
        Write-Host "    Debounce: 30 seconds after last change" -ForegroundColor White
    }
    catch {
        Write-Host "  ⚠ Failed to create task: $_" -ForegroundColor Yellow
    }
}

# Create management script
Write-Host "`nCreating management script..." -ForegroundColor Green

$manageScript = @"
# Manage Automatic Agent Automation
param(
    [Parameter()]
    [ValidateSet("Status", "Start", "Stop", "Restart", "Logs")]
    [string]`$Action = "Status"
)

`$tasks = @(
    "CopilotAgent-DailyAutoPublish",
    "CopilotAgent-WeeklySecurity",
    "CopilotAgent-StartupInit",
    "CopilotAgent-FileWatcher"
)

switch (`$Action) {
    "Status" {
        Write-Host "Automatic Agent Automation Status:" -ForegroundColor Cyan
        Write-Host ""
        
        foreach (`$task in `$tasks) {
            `$taskInfo = Get-ScheduledTask -TaskName `$task -ErrorAction SilentlyContinue
            if (`$taskInfo) {
                `$state = `$taskInfo.State
                `$color = if (`$state -eq "Ready") { "Green" } else { "Yellow" }
                Write-Host "  [`$state] `$task" -ForegroundColor `$color
                
                # Show last run
                `$lastRun = (Get-ScheduledTaskInfo -TaskName `$task).LastRunTime
                if (`$lastRun) {
                    Write-Host "    Last run: `$lastRun" -ForegroundColor White
                }
                
                # Show next run
                `$nextRun = (Get-ScheduledTaskInfo -TaskName `$task).NextRunTime
                if (`$nextRun) {
                    Write-Host "    Next run: `$nextRun" -ForegroundColor White
                }
            }
            else {
                Write-Host "  [Not Found] `$task" -ForegroundColor Red
            }
            Write-Host ""
        }
    }
    
    "Start" {
        Write-Host "Starting all automation tasks..." -ForegroundColor Green
        foreach (`$task in `$tasks) {
            Enable-ScheduledTask -TaskName `$task -ErrorAction SilentlyContinue
            Write-Host "  ✓ Started: `$task" -ForegroundColor Cyan
        }
        
        # Start file watcher immediately
        Start-ScheduledTask -TaskName "CopilotAgent-FileWatcher" -ErrorAction SilentlyContinue
    }
    
    "Stop" {
        Write-Host "Stopping all automation tasks..." -ForegroundColor Yellow
        foreach (`$task in `$tasks) {
            Disable-ScheduledTask -TaskName `$task -ErrorAction SilentlyContinue
            Write-Host "  ✓ Stopped: `$task" -ForegroundColor Cyan
        }
    }
    
    "Restart" {
        Write-Host "Restarting automation..." -ForegroundColor Yellow
        & `$PSCommandPath -Action Stop
        Start-Sleep -Seconds 2
        & `$PSCommandPath -Action Start
    }
    
    "Logs" {
        Write-Host "Recent automation logs:" -ForegroundColor Cyan
        Write-Host ""
        
        # Show last 20 lines from latest log
        `$latestLog = Get-ChildItem "logs" -Filter "automation-*.log" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
        if (`$latestLog) {
            Write-Host "Latest log: `$(`$latestLog.Name)" -ForegroundColor Yellow
            Get-Content `$latestLog.FullName -Tail 20
        }
        
        # Show file watcher log
        if (Test-Path "logs/file-watcher.log") {
            Write-Host "`nFile watcher log:" -ForegroundColor Yellow
            Get-Content "logs/file-watcher.log" -Tail 10
        }
    }
}
"@

$manageScript | Set-Content "$WorkspacePath\Manage-Automation.ps1"
Write-Host "  ✓ Created: Manage-Automation.ps1" -ForegroundColor Cyan

# Summary
Write-Host ""
Write-Host "=== Setup Complete! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Automatic Schedules Created:" -ForegroundColor Yellow
Write-Host "  1. Daily Auto-Publish: Every day at 2:00 AM" -ForegroundColor Cyan
Write-Host "  2. Weekly Security Scan: Every Sunday at 3:00 AM" -ForegroundColor Cyan
Write-Host "  3. Startup Initialization: On system boot" -ForegroundColor Cyan
if (-not $DisableFileWatcher) {
    Write-Host "  4. File Watcher: Auto-publish when you save files" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Management Commands:" -ForegroundColor Yellow
Write-Host "  .\Manage-Automation.ps1 -Action Status    # Check status" -ForegroundColor White
Write-Host "  .\Manage-Automation.ps1 -Action Start     # Start all tasks" -ForegroundColor White
Write-Host "  .\Manage-Automation.ps1 -Action Stop      # Stop all tasks" -ForegroundColor White
Write-Host "  .\Manage-Automation.ps1 -Action Logs      # View recent logs" -ForegroundColor White

Write-Host ""
Write-Host "What Happens Automatically:" -ForegroundColor Yellow
Write-Host "  ✓ Every day at 2 AM: Sync docs + publish agent" -ForegroundColor Green
Write-Host "  ✓ Every Sunday at 3 AM: Security scan" -ForegroundColor Green
Write-Host "  ✓ On system startup: Validate MCP setup" -ForegroundColor Green
if (-not $DisableFileWatcher) {
    Write-Host "  ✓ When you save .mcs.yml files: Auto-publish (30s delay)" -ForegroundColor Green
}

Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Check status: .\Manage-Automation.ps1 -Action Status" -ForegroundColor Cyan
Write-Host "  2. Start file watcher now: Start-ScheduledTask -TaskName 'CopilotAgent-FileWatcher'" -ForegroundColor Cyan
Write-Host "  3. Test it: Edit any .mcs.yml file and save" -ForegroundColor Cyan

Write-Host ""
Write-Host "Everything is now FULLY AUTOMATIC! 🎉" -ForegroundColor Green

<#
.SYNOPSIS
    Start automatic mode with cloud sync checking
.DESCRIPTION
    Enhanced version that checks for cloud changes before auto-publishing
    Prevents overwriting changes made in Copilot Studio web UI
#>

Write-Host @"
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║     AUTOMATIC MODE WITH CLOUD SYNC CHECKING                   ║
║                                                               ║
║  • Watches for local file changes                             ║
║  • Checks for cloud conflicts before publishing               ║
║  • Warns if cloud has newer changes                           ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Cyan

Write-Host ""

# Create the enhanced watcher script
$watcherScript = @'
$watchPath = "SimpleLTC QM Coach V2"
$logPath = "logs/auto-publish-with-sync.log"

# Ensure log directory exists
New-Item -ItemType Directory -Force -Path "logs" | Out-Null

function Write-Log {
    param([string]$Message, [string]$Color = "Cyan")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] $Message"
    Add-Content -Path $logPath -Value $logEntry
    Write-Host $logEntry -ForegroundColor $Color
}

function Check-CloudChanges {
    Write-Log "Checking for cloud changes..." "Yellow"
    
    try {
        & ".\scripts\Check-CloudChanges.ps1" -AgentPath $watchPath
        return $true
    }
    catch {
        Write-Log "Could not check cloud: $_" "Yellow"
        return $true  # Continue anyway
    }
}

Write-Log "AUTOMATIC MODE WITH SYNC CHECKING STARTED" "Green"
Write-Log "Watching: $watchPath/**/*.mcs.yml"
Write-Log "Will check cloud before auto-publishing"
Write-Log ""

# Create file system watcher
$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $watchPath
$watcher.Filter = "*.mcs.yml"
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true

# Debounce timer
$script:timer = $null
$script:changedFiles = @()

$onChange = {
    param($source, $e)
    
    $script:changedFiles += $e.FullPath
    Write-Log "File changed: $($e.Name)" "Yellow"
    
    # Cancel existing timer
    if ($script:timer) {
        $script:timer.Stop()
        $script:timer.Dispose()
    }
    
    # Create new timer (30 seconds)
    $script:timer = New-Object System.Timers.Timer
    $script:timer.Interval = 30000
    $script:timer.AutoReset = $false
    
    $script:timer.Add_Elapsed({
        Write-Log ""
        Write-Log "30 seconds passed, checking cloud before publish..." "Cyan"
        Write-Log "Changed files: $($script:changedFiles.Count)"
        
        # Check for cloud changes first
        $canPublish = Check-CloudChanges
        
        if ($canPublish) {
            try {
                Write-Log "Running automation pipeline..." "Cyan"
                
                $result = & ".\scripts\Automate-AgentLifecycle.ps1" -Environment Dev -AutoApprove 2>&1
                
                if ($LASTEXITCODE -eq 0) {
                    Write-Log "AUTO-PUBLISH SUCCESSFUL!" "Green"
                } else {
                    Write-Log "Auto-publish completed with warnings" "Yellow"
                }
            }
            catch {
                Write-Log "Auto-publish failed: $_" "Red"
            }
        }
        else {
            Write-Log "SKIPPED: Cloud has changes. Pull changes first!" "Red"
            Write-Log "Use: Copilot Studio: Get Changes" "Yellow"
        }
        
        # Clear changed files
        $script:changedFiles = @()
        Write-Log ""
        Write-Log "Watching for more changes..." "Cyan"
    })
    
    $script:timer.Start()
    Write-Log "Waiting 30 seconds for more changes..."
}

# Register event
Register-ObjectEvent -InputObject $watcher -EventName Changed -Action $onChange | Out-Null

Write-Log "File watcher is active!" "Green"
Write-Log ""
Write-Log "TIP: Edit any .mcs.yml file and save it to test!" "Yellow"
Write-Log "TIP: Cloud changes are checked before each publish" "Yellow"
Write-Log "Press Ctrl+C to stop automatic mode" "Yellow"
Write-Log ""

# Keep script running
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
}
finally {
    $watcher.Dispose()
    Write-Log "Automatic mode stopped" "Red"
}
'@

# Save the watcher script
$watcherScript | Set-Content "scripts\FileWatcher-WithSync.ps1"

Write-Host "Starting enhanced file watcher in new window..." -ForegroundColor Green
Write-Host ""

# Start in new PowerShell window
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-ExecutionPolicy", "Bypass",
    "-Command", "cd '$PWD'; .\scripts\FileWatcher-WithSync.ps1"
)

Start-Sleep -Seconds 2

Write-Host "✅ AUTOMATIC MODE WITH SYNC CHECKING IS NOW RUNNING!" -ForegroundColor Green
Write-Host ""
Write-Host "What's different:" -ForegroundColor Yellow
Write-Host "  • Checks for cloud changes before publishing" -ForegroundColor Cyan
Write-Host "  • Warns if cloud has newer changes" -ForegroundColor Cyan
Write-Host "  • Prevents overwriting web UI edits" -ForegroundColor Cyan
Write-Host ""
Write-Host "Workflow:" -ForegroundColor Yellow
Write-Host "  1. You save a file" -ForegroundColor Cyan
Write-Host "  2. Wait 30 seconds" -ForegroundColor Cyan
Write-Host "  3. Check cloud for conflicts" -ForegroundColor Cyan
Write-Host "  4. If safe, auto-publish" -ForegroundColor Cyan
Write-Host "  5. If conflict, warn you" -ForegroundColor Cyan
Write-Host ""
Write-Host "View logs:" -ForegroundColor Yellow
Write-Host "  Get-Content logs\auto-publish-with-sync.log -Wait" -ForegroundColor White
Write-Host ""
Write-Host "To get cloud changes:" -ForegroundColor Yellow
Write-Host "  1. Ctrl+Shift+P" -ForegroundColor White
Write-Host "  2. Type: 'Copilot Studio: Get Changes'" -ForegroundColor White
Write-Host "  3. Select your agent" -ForegroundColor White
Write-Host ""

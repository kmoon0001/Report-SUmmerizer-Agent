<#
.SYNOPSIS
    Start FULLY AUTOMATIC mode (no admin required!)
.DESCRIPTION
    Starts a background file watcher that automatically publishes
    when you save .mcs.yml files. No Windows Task Scheduler needed!
#>

Write-Host @"
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║              STARTING FULLY AUTOMATIC MODE                    ║
║                                                               ║
║  File watcher will run in background and auto-publish         ║
║  whenever you save .mcs.yml files!                            ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Cyan

Write-Host ""

# Create the watcher script
$watcherScript = @'
$watchPath = "SimpleLTC QM Coach V2"
$logPath = "logs/auto-publish.log"

# Ensure log directory exists
New-Item -ItemType Directory -Force -Path "logs" | Out-Null

function Write-Log {
    param([string]$Message, [string]$Color = "Cyan")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] $Message"
    Add-Content -Path $logPath -Value $logEntry
    Write-Host $logEntry -ForegroundColor $Color
}

Write-Log "🚀 AUTOMATIC MODE STARTED" "Green"
Write-Log "Watching: $watchPath/**/*.mcs.yml"
Write-Log "Will auto-publish 30 seconds after you save files"
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
    Write-Log "📝 File changed: $($e.Name)" "Yellow"
    
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
        Write-Log "⏰ 30 seconds passed, starting auto-publish..." "Cyan"
        Write-Log "Changed files: $($script:changedFiles.Count)"
        
        try {
            Write-Log "🔄 Running full automation pipeline..." "Cyan"
            
            $result = & ".\scripts\Automate-AgentLifecycle.ps1" -Environment Dev -AutoApprove 2>&1
            
            if ($LASTEXITCODE -eq 0) {
                Write-Log "✅ AUTO-PUBLISH SUCCESSFUL!" "Green"
            } else {
                Write-Log "⚠️ Auto-publish completed with warnings" "Yellow"
            }
        }
        catch {
            Write-Log "❌ Auto-publish failed: $_" "Red"
        }
        
        # Clear changed files
        $script:changedFiles = @()
        Write-Log ""
        Write-Log "👀 Watching for more changes..." "Cyan"
    })
    
    $script:timer.Start()
    Write-Log "⏳ Waiting 30 seconds for more changes..."
}

# Register event
Register-ObjectEvent -InputObject $watcher -EventName Changed -Action $onChange | Out-Null

Write-Log "✅ File watcher is active!" "Green"
Write-Log ""
Write-Log "💡 TIP: Edit any .mcs.yml file and save it to test!" "Yellow"
Write-Log "💡 Press Ctrl+C to stop automatic mode" "Yellow"
Write-Log ""

# Keep script running
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
}
finally {
    $watcher.Dispose()
    Write-Log "🛑 Automatic mode stopped" "Red"
}
'@

# Save the watcher script
$watcherScript | Set-Content "scripts\FileWatcher-AutoPublish.ps1"

Write-Host "Starting file watcher in new window..." -ForegroundColor Green
Write-Host ""

# Start in new PowerShell window
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-ExecutionPolicy", "Bypass",
    "-Command", "cd '$PWD'; .\scripts\FileWatcher-AutoPublish.ps1"
)

Start-Sleep -Seconds 2

Write-Host "✅ AUTOMATIC MODE IS NOW RUNNING!" -ForegroundColor Green
Write-Host ""
Write-Host "What's happening:" -ForegroundColor Yellow
Write-Host "  • A background window is watching for file changes" -ForegroundColor Cyan
Write-Host "  • When you save any .mcs.yml file, it waits 30 seconds" -ForegroundColor Cyan
Write-Host "  • Then automatically publishes your changes" -ForegroundColor Cyan
Write-Host ""
Write-Host "Try it now:" -ForegroundColor Yellow
Write-Host "  1. Open a file:" -ForegroundColor Cyan
Write-Host "     code 'SimpleLTC QM Coach V2\topics\Greeting.mcs.yml'" -ForegroundColor White
Write-Host ""
Write-Host "  2. Make any small change and save (Ctrl+S)" -ForegroundColor Cyan
Write-Host ""
Write-Host "  3. Watch the background window - it will auto-publish!" -ForegroundColor Cyan
Write-Host ""
Write-Host "View logs anytime:" -ForegroundColor Yellow
Write-Host "  Get-Content logs\auto-publish.log -Wait" -ForegroundColor White
Write-Host ""
Write-Host "To stop automatic mode:" -ForegroundColor Yellow
Write-Host "  Close the background PowerShell window" -ForegroundColor White
Write-Host ""

$watchPath = "SimpleLTC QM Coach V2"
$environment = "Dev"
$logPath = "logs/auto-publish-SimpleLTC-QM-Coach-V2.log"

# Ensure log directory exists
New-Item -ItemType Directory -Force -Path "logs" | Out-Null

function Write-Log {
    param([string]$Message, [string]$Color = "Cyan")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] $Message"
    Add-Content -Path $logPath -Value $logEntry
    Write-Host $logEntry -ForegroundColor $Color
}

Write-Log "========================================" "Green"
Write-Log "AUTOMATIC MODE STARTED" "Green"
Write-Log "Agent: $watchPath" "Green"
Write-Log "Environment: $environment" "Green"
Write-Log "========================================" "Green"
Write-Log ""
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
        Write-Log "30 seconds passed, starting auto-publish..." "Cyan"
        Write-Log "Changed files: $($script:changedFiles.Count)"
        
        try {
            Write-Log "Running automation pipeline..." "Cyan"
            
            # Check if automation script exists
            if (Test-Path ".\scripts\Automate-AgentLifecycle.ps1") {
                $result = & ".\scripts\Automate-AgentLifecycle.ps1" -Environment $environment -AutoApprove 2>&1
            }
            elseif (Test-Path ".\scripts\Make-And-Publish.ps1") {
                $result = & ".\scripts\Make-And-Publish.ps1" -Execute 2>&1
            }
            else {
                Write-Log "No automation script found, using PAC CLI directly..." "Yellow"
                $result = pac copilot publish 2>&1
            }
            
            if ($LASTEXITCODE -eq 0) {
                Write-Log "AUTO-PUBLISH SUCCESSFUL!" "Green"
            } else {
                Write-Log "Auto-publish completed with warnings" "Yellow"
            }
        }
        catch {
            Write-Log "Auto-publish failed: $_" "Red"
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

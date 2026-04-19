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

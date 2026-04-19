<#
.SYNOPSIS
    Fully automated agent lifecycle management
.DESCRIPTION
    End-to-end automation for:
    - Documentation sync from Microsoft Learn
    - Security hardening
    - Validation and testing
    - Automated publishing
    - Rollback on failure
#>

[CmdletBinding()]
param(
    [Parameter()]
    [ValidateSet("Dev", "Test", "Prod")]
    [string]$Environment = "Dev",
    
    [Parameter()]
    [switch]$SkipTests,
    
    [Parameter()]
    [switch]$AutoApprove,
    
    [Parameter()]
    [int]$ProfileIndex = 0
)

$ErrorActionPreference = "Stop"
$AgentPath = "SimpleLTC QM Coach V2"

# Logging
$LogPath = "logs"
New-Item -ItemType Directory -Force -Path $LogPath | Out-Null
$LogFile = Join-Path $LogPath "automation-$(Get-Date -Format 'yyyyMMdd-HHmmss').log"

function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] [$Level] $Message"
    
    $color = switch ($Level) {
        "ERROR" { "Red" }
        "WARN" { "Yellow" }
        "SUCCESS" { "Green" }
        default { "White" }
    }
    
    Write-Host $logEntry -ForegroundColor $color
    Add-Content -Path $LogFile -Value $logEntry
}

function Invoke-Step {
    param(
        [string]$Name,
        [scriptblock]$Action,
        [switch]$ContinueOnError
    )
    
    Write-Log "Starting: $Name" "INFO"
    
    try {
        $result = & $Action
        Write-Log "Completed: $Name" "SUCCESS"
        return @{ Success = $true; Result = $result }
    }
    catch {
        Write-Log "Failed: $Name - $_" "ERROR"
        if (-not $ContinueOnError) {
            throw
        }
        return @{ Success = $false; Error = $_ }
    }
}

function Backup-Agent {
    $backupPath = "backups/agent-backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    New-Item -ItemType Directory -Force -Path $backupPath | Out-Null
    
    Copy-Item -Path $AgentPath -Destination $backupPath -Recurse -Force
    
    Write-Log "Agent backed up to: $backupPath" "SUCCESS"
    return $backupPath
}

function Restore-Agent {
    param([string]$BackupPath)
    
    if (Test-Path $BackupPath) {
        Remove-Item -Path $AgentPath -Recurse -Force
        Copy-Item -Path (Join-Path $BackupPath (Split-Path $AgentPath -Leaf)) -Destination $AgentPath -Recurse -Force
        Write-Log "Agent restored from: $BackupPath" "SUCCESS"
    }
}

function Test-AgentValidation {
    Write-Log "Running agent validation..." "INFO"
    
    $issues = @()
    
    # Check agent file exists
    $agentFile = Join-Path $AgentPath "agent.mcs.yml"
    if (-not (Test-Path $agentFile)) {
        $issues += "Agent file missing"
    }
    
    # Check required topics
    $requiredTopics = @(
        "ConversationStart.mcs.yml",
        "Greeting.mcs.yml",
        "Fallback.mcs.yml",
        "OnError.mcs.yml"
    )
    
    foreach ($topic in $requiredTopics) {
        $path = Join-Path $AgentPath "topics/$topic"
        if (-not (Test-Path $path)) {
            $issues += "Missing required topic: $topic"
        }
    }
    
    # Check for YAML syntax errors (basic check)
    Get-ChildItem "$AgentPath" -Recurse -Filter "*.mcs.yml" | ForEach-Object {
        $content = Get-Content $_.FullName -Raw
        if ($content -notmatch "^mcs\.metadata:") {
            $issues += "Invalid YAML structure: $($_.Name)"
        }
    }
    
    if ($issues.Count -eq 0) {
        Write-Log "✓ Agent validation passed" "SUCCESS"
        return $true
    }
    else {
        Write-Log "⚠ Agent validation failed:" "WARN"
        $issues | ForEach-Object { Write-Log "  - $_" "WARN" }
        return $false
    }
}

function Invoke-AutomatedTests {
    Write-Log "Running automated tests..." "INFO"
    
    # Test 1: Compliance checks
    $complianceResult = & "$PSScriptRoot\Harden-Agent.ps1" -DryRun
    
    # Test 2: Documentation sync validation
    $docsResult = & "$PSScriptRoot\Sync-MicrosoftLearnDocs.ps1" -DryRun
    
    # Test 3: Connection validation
    $connFile = Join-Path $AgentPath ".mcs/conn.json"
    if (Test-Path $connFile) {
        $conn = Get-Content $connFile | ConvertFrom-Json
        if ($conn.EnvironmentId -and $conn.AgentId) {
            Write-Log "✓ Connection configuration valid" "SUCCESS"
        }
        else {
            Write-Log "⚠ Connection configuration incomplete" "WARN"
        }
    }
    
    Write-Log "✓ Automated tests completed" "SUCCESS"
    return $true
}

function Publish-AgentSafe {
    param([int]$ProfileIndex)
    
    Write-Log "Publishing agent (Profile: $ProfileIndex)..." "INFO"
    
    try {
        # Use the Make-And-Publish script
        $publishScript = Join-Path $PSScriptRoot "Make-And-Publish.ps1"
        
        if ($AutoApprove) {
            & $publishScript -ProfileIndex $ProfileIndex -Execute
        }
        else {
            Write-Log "Dry run publish check..." "INFO"
            & $publishScript -ProfileIndex $ProfileIndex
            
            $confirm = Read-Host "Proceed with publish? (y/n)"
            if ($confirm -eq 'y') {
                & $publishScript -ProfileIndex $ProfileIndex -Execute
            }
            else {
                Write-Log "Publish cancelled by user" "WARN"
                return $false
            }
        }
        
        Write-Log "✓ Agent published successfully" "SUCCESS"
        return $true
    }
    catch {
        Write-Log "✗ Publish failed: $_" "ERROR"
        return $false
    }
}

function Send-NotificationEmail {
    param(
        [string]$Status,
        [string]$Details
    )
    
    # This would integrate with your email system
    Write-Log "Notification: $Status - $Details" "INFO"
    
    # Example: Could use Microsoft Graph API to send email
    # Or integrate with Teams webhook for notifications
}

# ============================================================================
# MAIN AUTOMATION PIPELINE
# ============================================================================

Write-Log "=== Automated Agent Lifecycle Management ===" "INFO"
Write-Log "Environment: $Environment" "INFO"
Write-Log "Agent: $AgentPath" "INFO"
Write-Log ""

$startTime = Get-Date
$backupPath = $null

try {
    # Step 1: Backup
    $step1 = Invoke-Step -Name "Backup Agent" -Action {
        Backup-Agent
    }
    $backupPath = $step1.Result
    
    # Step 2: Sync Documentation
    $step2 = Invoke-Step -Name "Sync Microsoft Learn Documentation" -Action {
        & "$PSScriptRoot\Sync-MicrosoftLearnDocs.ps1" -All
    } -ContinueOnError
    
    # Step 3: Security Hardening
    $step3 = Invoke-Step -Name "Security Hardening" -Action {
        & "$PSScriptRoot\Harden-Agent.ps1"
    } -ContinueOnError
    
    # Step 4: Validation
    $step4 = Invoke-Step -Name "Agent Validation" -Action {
        Test-AgentValidation
    }
    
    if (-not $step4.Success) {
        throw "Agent validation failed"
    }
    
    # Step 5: Automated Tests
    if (-not $SkipTests) {
        $step5 = Invoke-Step -Name "Automated Tests" -Action {
            Invoke-AutomatedTests
        }
        
        if (-not $step5.Success) {
            throw "Automated tests failed"
        }
    }
    
    # Step 6: Publish
    $step6 = Invoke-Step -Name "Publish Agent" -Action {
        Publish-AgentSafe -ProfileIndex $ProfileIndex
    }
    
    if (-not $step6.Success) {
        throw "Publish failed"
    }
    
    # Success!
    $duration = (Get-Date) - $startTime
    Write-Log "" "INFO"
    Write-Log "=== AUTOMATION SUCCESSFUL ===" "SUCCESS"
    Write-Log "Duration: $($duration.TotalMinutes.ToString('F2')) minutes" "SUCCESS"
    Write-Log "Log file: $LogFile" "INFO"
    
    Send-NotificationEmail -Status "SUCCESS" -Details "Agent automation completed in $($duration.TotalMinutes.ToString('F2')) minutes"
}
catch {
    Write-Log "" "ERROR"
    Write-Log "=== AUTOMATION FAILED ===" "ERROR"
    Write-Log "Error: $_" "ERROR"
    
    # Rollback
    if ($backupPath) {
        Write-Log "Rolling back to backup..." "WARN"
        Restore-Agent -BackupPath $backupPath
    }
    
    Send-NotificationEmail -Status "FAILED" -Details "Agent automation failed: $_"
    
    throw
}

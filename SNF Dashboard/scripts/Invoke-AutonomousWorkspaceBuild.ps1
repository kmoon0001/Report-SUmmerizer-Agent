param(
    [string]$ProjectRoot = 'D:\my agents copilot studio\SNF Dashboard',
    [switch]$RequireConnection = $false,
    [switch]$RequireWebhookReady = $false,
    [switch]$SkipQaSweep = $false,
    [switch]$RunSafeCleanup = $false
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
. (Join-Path $ProjectRoot 'scripts\CommandCenterRuntime.ps1')

$runLogPath = Join-Path $ProjectRoot 'data\processed\autonomous_workspace_runlog.json'
$triageMdPath = Join-Path $ProjectRoot 'data\processed\autonomous_failure_triage.md'
$runLog = New-CommandCenterRunLog

try {
    Invoke-CommandCenterStep -RunLog $runLog -Step 'Toolchain Check' -Action {
        & (Join-Path $ProjectRoot 'scripts\Test-DeveloperToolchain.ps1')
    } | Out-Null

    Invoke-CommandCenterStep -RunLog $runLog -Step 'Preflight' -Action {
        $args = @{}
        if ($RequireConnection.IsPresent) { $args['RequireConnection'] = $true }
        & (Join-Path $ProjectRoot 'scripts\Invoke-SnfAiDashboardPreflight.ps1') @args
    } | Out-Null

    if ($RequireWebhookReady.IsPresent) {
        Invoke-CommandCenterStep -RunLog $runLog -Step 'Webhook Readiness' -Action {
            & (Join-Path $ProjectRoot 'scripts\Test-HandoffWebhookReadiness.ps1')
        } | Out-Null
    }
    else {
        Invoke-CommandCenterStep -RunLog $runLog -Step 'Webhook Readiness' -Optional -Action {
            & (Join-Path $ProjectRoot 'scripts\Test-HandoffWebhookReadiness.ps1')
        } | Out-Null
    }

    Invoke-CommandCenterStep -RunLog $runLog -Step 'No-Fabric Operations Run' -Action {
        $args = @{}
        if ($SkipQaSweep.IsPresent) { $args['SkipQaSweep'] = $true }
        & (Join-Path $ProjectRoot 'scripts\Invoke-NoFabricOperationsRun.ps1') @args
    } | Out-Null

    Invoke-CommandCenterStep -RunLog $runLog -Step 'Set Last Known Good' -Action {
        & (Join-Path $ProjectRoot 'scripts\Set-CommandCenterLastKnownGood.ps1')
    } | Out-Null

    if ($RunSafeCleanup.IsPresent) {
        Invoke-CommandCenterStep -RunLog $runLog -Step 'Safe Cleanup' -Optional -Action {
            & (Join-Path $ProjectRoot 'scripts\Invoke-SafeWorkspaceCleanup.ps1')
        } | Out-Null
    }

    Write-Host 'Autonomous workspace build completed.'
    Write-Host "Run log: $runLogPath"
}
catch {
    $message = $_.Exception.Message
    Add-CommandCenterRunEvent -RunLog $runLog -Step 'Autonomous Build' -Status 'FAIL' -Message $message

    try {
        & (Join-Path $ProjectRoot 'scripts\Invoke-CommandCenterFailureTriage.ps1') | Out-Null
    }
    catch {}

    try {
        & (Join-Path $ProjectRoot 'scripts\Add-CommandCenterHumanActionItem.ps1') `
            -Title 'Autonomous build failed' `
            -Details $message `
            -Priority 'High' `
            -Owner 'User' `
            -SuggestedAction "Review triage report at $triageMdPath and resolve top blocking item." `
            -Source 'Invoke-AutonomousWorkspaceBuild'
    }
    catch {}

    throw
}
finally {
    Save-CommandCenterRunLog -RunLog $runLog -OutputPath $runLogPath
}



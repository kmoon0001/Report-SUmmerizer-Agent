param(
    [string]$RefreshRunLogPath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\executive_refresh_runlog.json',
    [string]$LockPath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\executive_refresh.lock',
    [switch]$SkipQaSweep = $false,
    [switch]$ContinueOnBundleFailure = $false
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
. 'D:\my agents copilot studio\SNF Dashboard\scripts\CommandCenterRuntime.ps1'

$runLog = New-CommandCenterRunLog
$lockAcquired = $false
try {
    Enter-CommandCenterRunLock -LockPath $LockPath
    $lockAcquired = $true
    Add-CommandCenterRunEvent -RunLog $runLog -Step 'Run Lock' -Status 'PASS' -Message 'Run lock acquired.' -ArtifactPath $LockPath

    Invoke-CommandCenterStep -RunLog $runLog -Step 'Power BI Executive Prep' -Action {
        & 'D:\my agents copilot studio\SNF Dashboard\scripts\Invoke-PowerBiExecutivePrep.ps1'
    } | Out-Null

    Invoke-CommandCenterStep -RunLog $runLog -Step 'Operational Summary JSON' -Action {
        & 'D:\my agents copilot studio\SNF Dashboard\scripts\New-CommandCenterOperationalSummaryJson.ps1'
    } | Out-Null

    Invoke-CommandCenterStep -RunLog $runLog -Step 'Operational History' -Action {
        & 'D:\my agents copilot studio\SNF Dashboard\scripts\New-CommandCenterOperationalHistory.ps1'
    } | Out-Null

    $bundleSucceeded = Invoke-CommandCenterStep -RunLog $runLog -Step 'Executive Report Bundle' -Optional:$ContinueOnBundleFailure -Action {
        & 'D:\my agents copilot studio\SNF Dashboard\scripts\New-ExecutiveCommandCenterReportBundle.ps1'
        & 'D:\my agents copilot studio\SNF Dashboard\scripts\Test-ExecutiveCommandCenterReportBundle.ps1'
    }

    if (-not $bundleSucceeded -and -not $ContinueOnBundleFailure) {
        throw 'Executive report bundle failed.'
    }

    if ($bundleSucceeded) {
        Invoke-CommandCenterStep -RunLog $runLog -Step 'Executive Snapshot Archive' -Action {
            & 'D:\my agents copilot studio\SNF Dashboard\scripts\Save-ExecutiveCommandCenterSnapshot.ps1'
        } | Out-Null

        Invoke-CommandCenterStep -RunLog $runLog -Step 'Executive Share Package' -Action {
            & 'D:\my agents copilot studio\SNF Dashboard\scripts\New-ExecutiveCommandCenterSharePackage.ps1'
        } | Out-Null
    }

    if ($SkipQaSweep.IsPresent) {
        Add-CommandCenterRunEvent -RunLog $runLog -Step 'QA Sweep' -Status 'WARN' -Message 'QA sweep was skipped by parameter.'
    }
    else {
        Invoke-CommandCenterStep -RunLog $runLog -Step 'QA Sweep' -Action {
            & 'D:\my agents copilot studio\SNF Dashboard\scripts\Invoke-SnfAiDashboardQaSweep.ps1'
        } | Out-Null
    }

    Write-Host 'Executive command center refresh completed.'
    Write-Host "Refresh run log: $RefreshRunLogPath"
}
finally {
    Save-CommandCenterRunLog -RunLog $runLog -OutputPath $RefreshRunLogPath
    if ($lockAcquired) {
        Exit-CommandCenterRunLock -LockPath $LockPath
    }
}


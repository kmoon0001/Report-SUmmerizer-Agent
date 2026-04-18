param(
    [string]$ProjectRoot = 'D:\SNF AI Dashboard',
    [string]$EnvironmentId = '',
    [string]$BotId = '',
    [ValidateSet('ExtensionFirst', 'PacCopilotFallback', 'PacSolutionFallback')]
    [string]$Mode = 'ExtensionFirst',
    [string]$ReportPath = 'D:\SNF AI Dashboard\data\processed\copilot_sync_fallback_report.md'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Add-Result {
    param(
        [System.Collections.Generic.List[object]]$Results,
        [string]$Step,
        [string]$Status,
        [string]$Details
    )
    $Results.Add([pscustomobject]@{
        Step = $Step
        Status = $Status
        Details = $Details
    }) | Out-Null
}

function Invoke-Capture {
    param(
        [string]$Command,
        [string]$Step,
        [System.Collections.Generic.List[object]]$Results,
        [switch]$FailOnError = $false
    )

    try {
        $output = & powershell -NoProfile -ExecutionPolicy Bypass -Command $Command 2>&1 | Out-String
        Add-Result -Results $Results -Step $Step -Status 'PASS' -Details (($output -replace '\s+', ' ').Trim())
        return $output
    }
    catch {
        Add-Result -Results $Results -Step $Step -Status 'FAIL' -Details $_.Exception.Message
        if ($FailOnError) { throw }
        return ''
    }
}

$results = [System.Collections.Generic.List[object]]::new()
$validateScript = Join-Path $ProjectRoot 'scripts\Validate-SnfAiDashboardProject.ps1'
$preflightScript = Join-Path $ProjectRoot 'scripts\Invoke-SnfAiDashboardPreflight.ps1'

if (-not (Test-Path -LiteralPath $validateScript)) { throw "Missing script: $validateScript" }
if (-not (Test-Path -LiteralPath $preflightScript)) { throw "Missing script: $preflightScript" }

Invoke-Capture -Command "& '$validateScript'" -Step 'Local Validation' -Results $results -FailOnError
Invoke-Capture -Command "& '$preflightScript'" -Step 'Local Preflight' -Results $results -FailOnError

if ($Mode -eq 'ExtensionFirst') {
    try {
        Start-Process 'vscode://command/microsoft-copilot-studio.getChanges'
        Start-Sleep -Seconds 2
        Start-Process 'vscode://command/microsoft-copilot-studio.previewChanges'
        Start-Sleep -Seconds 2
        Start-Process 'vscode://command/microsoft-copilot-studio.applyChanges'
        Add-Result -Results $results -Step 'Extension Sync Initiated' -Status 'PASS' -Details 'Triggered Get/Preview/Apply in VS Code extension command URIs.'
    }
    catch {
        Add-Result -Results $results -Step 'Extension Sync Initiated' -Status 'FAIL' -Details $_.Exception.Message
    }

    if ([string]::IsNullOrWhiteSpace($EnvironmentId) -or [string]::IsNullOrWhiteSpace($BotId)) {
        Add-Result -Results $results -Step 'PAC Publish/Status' -Status 'SKIP' -Details 'EnvironmentId/BotId not supplied. Provide -EnvironmentId and -BotId for publish/status fallback checks.'
    }
    else {
        Invoke-Capture -Command "pac copilot publish --environment $EnvironmentId --bot $BotId" -Step 'PAC Publish' -Results $results
        Invoke-Capture -Command "pac copilot status --environment $EnvironmentId --bot-id $BotId" -Step 'PAC Status' -Results $results
        Invoke-Capture -Command "pac copilot list --environment $EnvironmentId" -Step 'PAC List' -Results $results
    }
}
elseif ($Mode -eq 'PacCopilotFallback') {
    if ([string]::IsNullOrWhiteSpace($EnvironmentId) -or [string]::IsNullOrWhiteSpace($BotId)) {
        Add-Result -Results $results -Step 'PAC Fallback Prerequisites' -Status 'FAIL' -Details 'EnvironmentId and BotId are required for PacCopilotFallback mode.'
    }
    else {
        Invoke-Capture -Command "pac copilot status --environment $EnvironmentId --bot-id $BotId" -Step 'PAC Status' -Results $results
        Invoke-Capture -Command "pac copilot publish --environment $EnvironmentId --bot $BotId" -Step 'PAC Publish' -Results $results
        Invoke-Capture -Command "pac copilot list --environment $EnvironmentId" -Step 'PAC List' -Results $results
        Add-Result -Results $results -Step 'Fallback Limitation' -Status 'WARN' -Details 'PAC fallback does not provide the same extension-managed Get/Preview/Apply diff workflow.'
    }
}
elseif ($Mode -eq 'PacSolutionFallback') {
    Invoke-Capture -Command "pac solution list" -Step 'PAC Solution List' -Results $results
    Add-Result -Results $results -Step 'Fallback Limitation' -Status 'WARN' -Details 'Solution ALM fallback supports deployment lifecycle but does not replicate extension-managed workspace sync semantics.'
}

$reportLines = @()
$reportLines += '# Copilot Studio Sync Fallback Report'
$reportLines += ''
$reportLines += ('Generated: {0}' -f (Get-Date).ToString('yyyy-MM-dd HH:mm:ss'))
$reportLines += ('Mode: {0}' -f $Mode)
$reportLines += ''
foreach ($result in $results) {
    $reportLines += ('- [{0}] {1}: {2}' -f $result.Status, $result.Step, $result.Details)
}

$reportDir = Split-Path -Parent $ReportPath
if ($reportDir -and -not (Test-Path -LiteralPath $reportDir)) {
    New-Item -ItemType Directory -Path $reportDir -Force | Out-Null
}
$reportLines -join [Environment]::NewLine | Set-Content -LiteralPath $ReportPath -Encoding UTF8
Write-Host "Fallback report written to: $ReportPath"

$failed = @($results | Where-Object { $_.Status -eq 'FAIL' })
if ($failed.Count -gt 0) {
    throw "Fallback run completed with failures: $($failed.Count)"
}

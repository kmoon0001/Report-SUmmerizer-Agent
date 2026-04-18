param(
    [string]$ProjectRoot = 'D:\SNF AI Dashboard',
    [string]$ReportPath = 'D:\SNF AI Dashboard\data\processed\copilot_end_to_end_report.md',
    [switch]$RunSmoke
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Add-StepResult {
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
        Timestamp = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss')
    }) | Out-Null
}

function Invoke-Step {
    param(
        [System.Collections.Generic.List[object]]$Results,
        [string]$Step,
        [scriptblock]$Script
    )

    try {
        $output = & $Script 2>&1 | Out-String
        $details = ($output -replace '\s+', ' ').Trim()
        if ([string]::IsNullOrWhiteSpace($details)) {
            $details = 'Completed.'
        }
        Add-StepResult -Results $Results -Step $Step -Status 'PASS' -Details $details
    }
    catch {
        Add-StepResult -Results $Results -Step $Step -Status 'FAIL' -Details $_.Exception.Message
        throw
    }
}

$results = [System.Collections.Generic.List[object]]::new()

$validateScript = Join-Path $ProjectRoot 'scripts\Validate-SnfAiDashboardProject.ps1'
$preflightScript = Join-Path $ProjectRoot 'scripts\Invoke-SnfAiDashboardPreflight.ps1'
$buttonScript = Join-Path $ProjectRoot 'scripts\Test-ButtonOnlyQuestionRouting.ps1'
$authoringScript = Join-Path $ProjectRoot 'scripts\Test-CopilotAuthoringCompliance.ps1'
$applyScript = Join-Path $ProjectRoot 'scripts\Invoke-CopilotApplyResilient.ps1'
$publishScript = Join-Path $ProjectRoot 'scripts\Publish-Copilot.ps1'
$statusScript = Join-Path $ProjectRoot 'scripts\Get-CopilotStatus.ps1'
$smokeScript = Join-Path $ProjectRoot 'scripts\Invoke-SnfAiDashboardPlaywrightSmoke.ps1'
$connPath = Join-Path $ProjectRoot '.mcs\conn.json'

@(
    $validateScript,
    $preflightScript,
    $buttonScript,
    $authoringScript,
    $applyScript,
    $publishScript,
    $statusScript
) | ForEach-Object {
    if (-not (Test-Path -LiteralPath $_)) {
        throw "Missing required script: $_"
    }
}

if (-not (Test-Path -LiteralPath $connPath)) {
    throw "Missing Copilot connection file: $connPath"
}

$conn = Get-Content -LiteralPath $connPath -Raw | ConvertFrom-Json
$environmentId = [string]$conn.EnvironmentId
$botId = [string]$conn.AgentId

if ([string]::IsNullOrWhiteSpace($environmentId) -or [string]::IsNullOrWhiteSpace($botId)) {
    throw "EnvironmentId/AgentId missing in $connPath"
}

Invoke-Step -Results $results -Step 'Validate Project' -Script {
    & powershell -NoProfile -ExecutionPolicy Bypass -File $validateScript
}

Invoke-Step -Results $results -Step 'Preflight (Require Connection)' -Script {
    & powershell -NoProfile -ExecutionPolicy Bypass -File $preflightScript -RequireConnection
}

Invoke-Step -Results $results -Step 'Button-Only Routing Gate' -Script {
    & powershell -NoProfile -ExecutionPolicy Bypass -File $buttonScript
}

Invoke-Step -Results $results -Step 'Copilot Authoring Compliance' -Script {
    & powershell -NoProfile -ExecutionPolicy Bypass -File $authoringScript
}

Invoke-Step -Results $results -Step 'Resilient Apply' -Script {
    & powershell -NoProfile -ExecutionPolicy Bypass -File $applyScript
}

Invoke-Step -Results $results -Step 'Publish Copilot' -Script {
    & powershell -NoProfile -ExecutionPolicy Bypass -File $publishScript
}

Invoke-Step -Results $results -Step 'Verify Copilot Status' -Script {
    & powershell -NoProfile -ExecutionPolicy Bypass -File $statusScript
}

Invoke-Step -Results $results -Step 'Verify Copilot List Entry' -Script {
    $listOutput = & pac copilot list --environment $environmentId 2>&1 | Out-String
    $botLine = ($listOutput -split "`r?`n" | Where-Object { $_ -match [regex]::Escape($botId) } | Select-Object -First 1)
    if (-not $botLine) {
        throw "Could not find bot '$botId' in pac copilot list output."
    }
    $botLine
}

if ($RunSmoke) {
    if (-not (Test-Path -LiteralPath $smokeScript)) {
        Add-StepResult -Results $results -Step 'Playwright Smoke' -Status 'SKIP' -Details "Smoke script missing: $smokeScript"
    }
    else {
        Invoke-Step -Results $results -Step 'Playwright Smoke' -Script {
            & powershell -NoProfile -ExecutionPolicy Bypass -File $smokeScript
        }
    }
}

$reportDir = Split-Path -Parent $ReportPath
if ($reportDir -and -not (Test-Path -LiteralPath $reportDir)) {
    New-Item -ItemType Directory -Path $reportDir -Force | Out-Null
}

$report = @()
$report += '# Copilot End-To-End Automation Report'
$report += ''
$report += ('Generated: {0}' -f (Get-Date).ToString('yyyy-MM-dd HH:mm:ss'))
$report += ('ProjectRoot: {0}' -f $ProjectRoot)
$report += ('EnvironmentId: {0}' -f $environmentId)
$report += ('BotId: {0}' -f $botId)
$report += ''
foreach ($item in $results) {
    $report += ('- [{0}] {1} ({2}): {3}' -f $item.Status, $item.Step, $item.Timestamp, $item.Details)
}

$report -join [Environment]::NewLine | Set-Content -LiteralPath $ReportPath -Encoding UTF8
Write-Host "End-to-end report written to: $ReportPath"

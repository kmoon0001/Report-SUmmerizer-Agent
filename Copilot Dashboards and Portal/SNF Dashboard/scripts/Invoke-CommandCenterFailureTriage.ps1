param(
    [string]$ProjectRoot = 'D:\my agents copilot studio\SNF Dashboard',
    [string]$OutputMarkdownPath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\autonomous_failure_triage.md',
    [string]$OutputJsonPath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\autonomous_failure_triage.json'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Add-Finding {
    param(
        [System.Collections.Generic.List[object]]$Findings,
        [string]$Severity,
        [string]$Area,
        [string]$Summary,
        [string]$Action
    )
    $Findings.Add([pscustomobject]@{
        Severity = $Severity
        Area = $Area
        Summary = $Summary
        Action = $Action
    }) | Out-Null
}

$findings = [System.Collections.Generic.List[object]]::new()
$processed = Join-Path $ProjectRoot 'data\processed'

$webhookReadinessPath = Join-Path $processed 'handoff_webhook_readiness.md'
if (Test-Path -LiteralPath $webhookReadinessPath) {
    $text = Get-Content -LiteralPath $webhookReadinessPath -Raw
    $copilotNativeReady = ($text -match 'Delivery mode:\s+CopilotNative') -and ($text -match 'Status:\s+\*\*READY\*\*')
    if (-not $copilotNativeReady -and $text -match 'Status:\s+\*\*NOT READY\*\*') {
        Add-Finding -Findings $findings -Severity 'High' -Area 'Webhook' -Summary 'Handoff webhook readiness is NOT READY.' -Action 'Configure a valid signed Request trigger URL (contains sig=) or Teams incoming webhook URL in .env.'
    }
}

$dispatchLogPath = Join-Path $processed 'command_center_automated_handoff_dispatch_log.csv'
if (Test-Path -LiteralPath $dispatchLogPath) {
    $dispatch = @(Import-Csv -LiteralPath $dispatchLogPath)
    $errors = @($dispatch | Where-Object { [string]$_.DispatchStatus -eq 'DispatchError' })
    if ($errors.Count -gt 0) {
        $topError = [string]($errors[0].DispatchMessage)
        Add-Finding -Findings $findings -Severity 'High' -Area 'Dispatch' -Summary "Dispatch errors detected: $($errors.Count) rows. Example: $topError" -Action 'Verify endpoint type and permissions. Internal Power Platform direct endpoints commonly return 401/403 without tenant auth policy alignment.'
    }
}

$qaPath = Join-Path $processed 'snf_qa_sweep_report.md'
if (Test-Path -LiteralPath $qaPath) {
    $qaLines = @(Get-Content -LiteralPath $qaPath)
    $fails = @($qaLines | Where-Object { $_ -like '- [FAIL]*' })
    foreach ($line in $fails) {
        Add-Finding -Findings $findings -Severity 'Medium' -Area 'QA' -Summary $line -Action 'Address this QA failure before publish/apply.'
    }
}

$refreshRunLogPath = Join-Path $processed 'executive_refresh_runlog.json'
if (Test-Path -LiteralPath $refreshRunLogPath) {
    try {
        $refresh = Get-Content -LiteralPath $refreshRunLogPath -Raw | ConvertFrom-Json
        $events = @($refresh.Events)
        $failed = @($events | Where-Object { [string]$_.Status -eq 'FAIL' })
        foreach ($evt in $failed) {
            Add-Finding -Findings $findings -Severity 'Medium' -Area ([string]$evt.Step) -Summary ([string]$evt.Message) -Action 'Review run log event and fix upstream script/input for this step.'
        }
    }
    catch {
        Add-Finding -Findings $findings -Severity 'Low' -Area 'RunLog' -Summary 'Could not parse executive refresh run log.' -Action 'Validate run log JSON integrity.'
    }
}

$severityOrder = @{ High = 3; Medium = 2; Low = 1 }
$sorted = @($findings | Sort-Object @{ Expression = { $severityOrder[[string]$_.Severity] }; Descending = $true }, Area)

$outDir = Split-Path -Parent $OutputMarkdownPath
if ($outDir -and -not (Test-Path -LiteralPath $outDir)) {
    New-Item -ItemType Directory -Path $outDir -Force | Out-Null
}

$md = @(
    '# Autonomous Failure Triage',
    '',
    "Generated: $((Get-Date).ToString('yyyy-MM-dd HH:mm:ss'))",
    ''
)

if ($sorted.Count -eq 0) {
    $md += '- No actionable failures detected in current triage inputs.'
}
else {
    foreach ($f in $sorted) {
        $md += "- [$([string]$f.Severity)] $([string]$f.Area): $([string]$f.Summary)"
        $md += "  Action: $([string]$f.Action)"
    }
}

$md -join [Environment]::NewLine | Set-Content -LiteralPath $OutputMarkdownPath -Encoding UTF8

$payload = [pscustomobject]@{
    GeneratedAt = (Get-Date).ToString('s')
    FindingCount = $sorted.Count
    Findings = $sorted
}
$payload | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $OutputJsonPath -Encoding UTF8

Write-Host "Failure triage markdown written to: $OutputMarkdownPath"
Write-Host "Failure triage json written to: $OutputJsonPath"
Write-Host "Finding count: $($sorted.Count)"


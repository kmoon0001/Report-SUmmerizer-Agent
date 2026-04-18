param(
    [string]$ProjectRoot = 'D:\my agents copilot studio\SNF Dashboard',
    [string]$QaReportPath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\snf_qa_sweep_report.md'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$qaSweepScript = Join-Path $ProjectRoot 'scripts\Invoke-SnfAiDashboardQaSweep.ps1'
if (-not (Test-Path -LiteralPath $qaSweepScript)) {
    throw "QA sweep script not found: $qaSweepScript"
}

& powershell -ExecutionPolicy Bypass -File $qaSweepScript

if (-not (Test-Path -LiteralPath $QaReportPath)) {
    throw "QA report not found: $QaReportPath"
}

$report = Get-Content -LiteralPath $QaReportPath -Raw

$requiredLines = @(
    'Power BI Published Smoke (Non-Interactive)',
    'Groundedness Evaluation'
)

foreach ($name in $requiredLines) {
    if ($report -notmatch [regex]::Escape($name)) {
        throw "Required QA lane not found in report: $name"
    }
}

$blocked = [System.Collections.Generic.List[string]]::new()
$lines = $report -split "`r?`n"
foreach ($line in $lines) {
    if ($line -match 'Power BI Published Smoke \(Non-Interactive\)' -and $line -match '\[SKIP\]') {
        $blocked.Add('Power BI Published Smoke (Non-Interactive) is still SKIP. Configure POWERBI_CLIENT_ID and POWERBI_CLIENT_SECRET with authorized workspace/report access.') | Out-Null
    }
    if ($line -match 'Groundedness Evaluation' -and $line -match '\[SKIP\]') {
        $blocked.Add('Groundedness Evaluation is still SKIP. Configure AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_API_KEY, and AZURE_OPENAI_DEPLOYMENT.') | Out-Null
    }
}

if ($blocked.Count -gt 0) {
    $message = "Finalize gate blocked:`n- " + ($blocked -join "`n- ")
    throw $message
}

Write-Host 'Finalize gate passed. Credential-dependent QA lanes are active (not SKIP).'

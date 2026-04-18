param(
    [string]$ProjectRoot = 'D:\SNF AI Dashboard',
    [switch]$SkipQaSweep = $false
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$envPath = Join-Path $ProjectRoot '.env'
if (-not (Test-Path -LiteralPath $envPath)) {
    throw ".env not found: $envPath"
}

& (Join-Path $ProjectRoot 'scripts\Test-HandoffWebhookReadiness.ps1') -EnvPath $envPath | Out-Null

Write-Host 'Running full refresh with live handoff delivery...'

$refreshArgs = @{}
if ($SkipQaSweep.IsPresent) {
    $refreshArgs['SkipQaSweep'] = $true
}

& (Join-Path $ProjectRoot 'scripts\Invoke-ExecutiveCommandCenterRefresh.ps1') @refreshArgs
& (Join-Path $ProjectRoot 'scripts\Validate-SnfAiDashboardProject.ps1')

Write-Host ''
Write-Host 'Handoff go-live run completed.'
Write-Host "Dispatch log: $(Join-Path $ProjectRoot 'data\processed\command_center_automated_handoff_dispatch_log.csv')"
Write-Host "Lifecycle summary: $(Join-Path $ProjectRoot 'data\processed\command_center_automated_handoff_lifecycle_summary.md')"
Write-Host "QA report: $(Join-Path $ProjectRoot 'data\processed\snf_qa_sweep_report.md')"

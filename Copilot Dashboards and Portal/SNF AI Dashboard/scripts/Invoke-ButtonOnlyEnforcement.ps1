param(
    [switch]$RequireConnection = $false
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$scriptsRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host 'Button-only enforcement run'
Write-Host ''

Write-Host '1. Preflight (includes button-only validator)'
$preflightScript = Join-Path $scriptsRoot 'Invoke-SnfAiDashboardPreflight.ps1'
if ($RequireConnection) {
    & $preflightScript -RequireConnection
}
else {
    & $preflightScript
}

Write-Host ''
Write-Host '2. Button-only QA gate'
& powershell -ExecutionPolicy Bypass -File (Join-Path $scriptsRoot 'Test-ButtonOnlyQuestionRouting.ps1')

Write-Host ''
Write-Host '3. Full QA sweep'
& powershell -ExecutionPolicy Bypass -File (Join-Path $scriptsRoot 'Invoke-SnfAiDashboardQaSweep.ps1')

Write-Host ''
Write-Host 'Button-only enforcement completed.'

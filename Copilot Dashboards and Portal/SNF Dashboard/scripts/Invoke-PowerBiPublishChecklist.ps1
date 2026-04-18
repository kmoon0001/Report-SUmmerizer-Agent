param(
    [string]$ProjectRoot = 'D:\my agents copilot studio\SNF Dashboard',
    [string]$OutputPath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\powerbi_publish_readiness.md',
    [switch]$FailIfNotReady = $false
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Add-Check {
    param(
        [System.Collections.Generic.List[object]]$Checks,
        [string]$Name,
        [bool]$Passed,
        [string]$Details,
        [bool]$Critical = $true
    )
    $Checks.Add([pscustomobject]@{
        Name = $Name
        Passed = $Passed
        Critical = $Critical
        Details = $Details
    }) | Out-Null
}

$checks = [System.Collections.Generic.List[object]]::new()

$requiredPaths = @(
    'integrations\powerbi\source-package\current\source-package-manifest.json',
    'integrations\powerbi\source-package\current\model-tables\model-table-manifest.json',
    'integrations\powerbi\source-package\current\authoring-kit\README.md',
    'integrations\powerbi\source-package\current\authoring-kit\executive-measures.dax',
    'integrations\powerbi\source-package\current\authoring-kit\executive-command-center-relationships.csv',
    'integrations\powerbi\source-package\current\authoring-kit\executive-command-center-report-spec.md',
    'integrations\powerbi\source-package\current\authoring-kit\executive-theme.json',
    'integrations\powerbi\source-package\current\authoring-kit\executive-page-layout.json'
)

foreach ($relativePath in $requiredPaths) {
    $fullPath = Join-Path $ProjectRoot $relativePath
    Add-Check -Checks $checks -Name ("Artifact: {0}" -f $relativePath) -Passed:(Test-Path -LiteralPath $fullPath) -Details $fullPath
}

try {
    $packageResult = & powershell -ExecutionPolicy Bypass -File (Join-Path $ProjectRoot 'scripts\Test-PowerBiExecutivePackage.ps1') 2>&1 | Out-String
    Add-Check -Checks $checks -Name 'Power BI package reconciliation' -Passed $true -Details (($packageResult -replace '\s+', ' ').Trim())
}
catch {
    Add-Check -Checks $checks -Name 'Power BI package reconciliation' -Passed $false -Details $_.Exception.Message
}

$workspaceId = $env:POWERBI_WORKSPACE_ID
Add-Check -Checks $checks -Name 'Workspace id available' -Passed:(-not [string]::IsNullOrWhiteSpace($workspaceId)) -Critical $false -Details 'Advisory: set POWERBI_WORKSPACE_ID in environment or .env for consistent publish targeting.'

$nonInteractiveSmokeVars = @(
    'POWERBI_TENANT_ID',
    'POWERBI_CLIENT_ID',
    'POWERBI_CLIENT_SECRET',
    'POWERBI_WORKSPACE_ID',
    'POWERBI_REPORT_ID'
)
$missingNonInteractiveSmokeVars = @(
    foreach ($name in $nonInteractiveSmokeVars) {
        if ([string]::IsNullOrWhiteSpace([string]([Environment]::GetEnvironmentVariable($name)))) { $name }
    }
)
if ($missingNonInteractiveSmokeVars.Count -eq 0) {
    Add-Check -Checks $checks -Name 'Non-interactive published smoke prerequisites' -Passed $true -Critical $false -Details 'Service principal and report targeting variables are present.'
}
else {
    Add-Check -Checks $checks -Name 'Non-interactive published smoke prerequisites' -Passed $false -Critical $false -Details ('Advisory: missing {0}. Set these for CI-safe published smoke via Test-PowerBiPublishedSmokeNonInteractive.ps1.' -f ($missingNonInteractiveSmokeVars -join ', '))
}

$allPassed = @($checks | Where-Object { $_.Critical -and -not $_.Passed }).Count -eq 0
$statusText = if ($allPassed) { 'READY' } else { 'NOT READY' }

$lines = @()
$lines += '# Power BI Publish Readiness'
$lines += ''
$lines += ('Generated: {0}' -f (Get-Date).ToString('yyyy-MM-dd HH:mm:ss'))
$lines += ('Status: **{0}**' -f $statusText)
$lines += ''
foreach ($check in $checks) {
    $state = if ($check.Passed) { 'PASS' } elseif ($check.Critical) { 'FAIL' } else { 'WARN' }
    $lines += ('- [{0}] {1}: {2}' -f $state, $check.Name, $check.Details)
}
$lines += ''
$lines += '## Manual Publish Steps'
$lines += '1. Open Power BI Desktop and import model tables from `integrations\powerbi\source-package\current\model-tables`.'
$lines += '2. Apply `executive-theme.json` and `executive-measures.dax` from the authoring kit.'
$lines += '3. Confirm relationships using `executive-command-center-relationships.csv`.'
$lines += '4. Validate visuals against `executive-command-center-report-spec.md` and `executive-page-layout.json`.'
$lines += '5. Publish to the target workspace and run a post-publish smoke check.'

$outputDir = Split-Path -Parent $OutputPath
if ($outputDir -and -not (Test-Path -LiteralPath $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
}
$lines -join [Environment]::NewLine | Set-Content -LiteralPath $OutputPath -Encoding UTF8
Write-Host "Power BI publish readiness report written to: $OutputPath"
Write-Host "Status: $statusText"

if ($FailIfNotReady -and -not $allPassed) {
    throw "Power BI publish readiness failed. See: $OutputPath"
}


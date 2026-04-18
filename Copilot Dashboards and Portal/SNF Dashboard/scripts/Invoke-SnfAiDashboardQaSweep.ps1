param(
    [string]$ProjectRoot = 'D:\my agents copilot studio\SNF Dashboard',
    [string]$OutputPath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\snf_qa_sweep_report.md'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Add-Result {
    param(
        [System.Collections.Generic.List[object]]$Results,
        [string]$Name,
        [string]$Status,
        [string]$Details
    )

    $Results.Add([pscustomobject]@{
        Name    = $Name
        Status  = $Status
        Details = $Details
    }) | Out-Null
}

function Test-PowerShellScriptParse {
    param([string]$Path)

    $tokens = $null
    $errors = $null
    [void][System.Management.Automation.Language.Parser]::ParseFile($Path, [ref]$tokens, [ref]$errors)
    return @($errors)
}

$scriptsRoot = Join-Path $ProjectRoot 'scripts'
$processedRoot = Join-Path $ProjectRoot 'data\processed'
$results = [System.Collections.Generic.List[object]]::new()

$scriptPaths = @(Get-ChildItem -LiteralPath $scriptsRoot -Filter '*.ps1' -File | Sort-Object Name)
$parseErrors = @()
foreach ($script in $scriptPaths) {
    $errors = @(Test-PowerShellScriptParse -Path $script.FullName)
    if ($errors.Count -gt 0) {
        foreach ($error in $errors) {
            $parseErrors += ('{0}: {1}' -f $script.Name, $error.Message)
        }
    }
}
if ($parseErrors.Count -gt 0) {
    Add-Result -Results $results -Name 'PowerShell Parse' -Status 'FAIL' -Details ($parseErrors -join ' | ')
}
else {
    Add-Result -Results $results -Name 'PowerShell Parse' -Status 'PASS' -Details ("Parsed {0} scripts cleanly." -f $scriptPaths.Count)
}

try {
    $validationOutput = & powershell -ExecutionPolicy Bypass -File (Join-Path $scriptsRoot 'Validate-SnfAiDashboardProject.ps1') 2>&1 | Out-String
    Add-Result -Results $results -Name 'Project Validation' -Status 'PASS' -Details (($validationOutput -split "`r?`n" | Where-Object { $_ -match 'Topics:|Actions:|Workflow folders:|Warnings:|Errors:|Validation passed' }) -join ' ')
}
catch {
    Add-Result -Results $results -Name 'Project Validation' -Status 'FAIL' -Details $_.Exception.Message
}

try {
    $schemaOutput = & powershell -ExecutionPolicy Bypass -File (Join-Path $scriptsRoot 'Test-CommandCenterSourceSchemas.ps1') 2>&1 | Out-String
    Add-Result -Results $results -Name 'Source Schema Validation' -Status 'PASS' -Details (($schemaOutput -replace '\s+', ' ').Trim())
}
catch {
    Add-Result -Results $results -Name 'Source Schema Validation' -Status 'FAIL' -Details $_.Exception.Message
}

try {
    $buttonRoutingOutput = & powershell -ExecutionPolicy Bypass -File (Join-Path $scriptsRoot 'Test-ButtonOnlyQuestionRouting.ps1') 2>&1 | Out-String
    Add-Result -Results $results -Name 'Button-Only Routing' -Status 'PASS' -Details (($buttonRoutingOutput -replace '\s+', ' ').Trim())
}
catch {
    Add-Result -Results $results -Name 'Button-Only Routing' -Status 'FAIL' -Details $_.Exception.Message
}

try {
    $authoringComplianceOutput = & powershell -ExecutionPolicy Bypass -File (Join-Path $scriptsRoot 'Test-CopilotAuthoringCompliance.ps1') 2>&1 | Out-String
    Add-Result -Results $results -Name 'Copilot Authoring Compliance' -Status 'PASS' -Details (($authoringComplianceOutput -replace '\s+', ' ').Trim())
}
catch {
    Add-Result -Results $results -Name 'Copilot Authoring Compliance' -Status 'FAIL' -Details $_.Exception.Message
}

try {
    $actionContractSyncOutput = & powershell -ExecutionPolicy Bypass -File (Join-Path $scriptsRoot 'Test-ActionContractSync.ps1') 2>&1 | Out-String
    Add-Result -Results $results -Name 'Action Contract Sync' -Status 'PASS' -Details (($actionContractSyncOutput -replace '\s+', ' ').Trim())
}
catch {
    Add-Result -Results $results -Name 'Action Contract Sync' -Status 'FAIL' -Details $_.Exception.Message
}

try {
    $secretOutput = & powershell -ExecutionPolicy Bypass -File (Join-Path $scriptsRoot 'Test-RepositorySecretHygiene.ps1') 2>&1 | Out-String
    Add-Result -Results $results -Name 'Repository Secret Hygiene' -Status 'PASS' -Details (($secretOutput -replace '\s+', ' ').Trim())
}
catch {
    Add-Result -Results $results -Name 'Repository Secret Hygiene' -Status 'FAIL' -Details $_.Exception.Message
}

try {
    $driftOutput = & powershell -ExecutionPolicy Bypass -File (Join-Path $scriptsRoot 'Test-CommandCenterDataDrift.ps1') 2>&1 | Out-String
    Add-Result -Results $results -Name 'Data Drift Validation' -Status 'PASS' -Details (($driftOutput -replace '\s+', ' ').Trim())
}
catch {
    Add-Result -Results $results -Name 'Data Drift Validation' -Status 'FAIL' -Details $_.Exception.Message
}

$pccNormalizedPath = Join-Path $processedRoot 'pcc_resident_list_current.normalized.csv'
if (Test-Path -LiteralPath $pccNormalizedPath) {
    try {
        $pccOutput = & powershell -ExecutionPolicy Bypass -File (Join-Path $scriptsRoot 'Test-PccResidentCensusNormalizedCsv.ps1') -Path $pccNormalizedPath 2>&1 | Out-String
        Add-Result -Results $results -Name 'PCC Normalized Contract' -Status 'PASS' -Details (($pccOutput -replace '\s+', ' ').Trim())
    }
    catch {
        Add-Result -Results $results -Name 'PCC Normalized Contract' -Status 'FAIL' -Details $_.Exception.Message
    }
}
else {
    Add-Result -Results $results -Name 'PCC Normalized Contract' -Status 'SKIP' -Details 'pcc_resident_list_current.normalized.csv not present.'
}

$docNormalizedPath = Join-Path $processedRoot 'nethealth_documentation_due_dates.normalized.csv'
if (Test-Path -LiteralPath $docNormalizedPath) {
    try {
        $docOutput = & powershell -ExecutionPolicy Bypass -File (Join-Path $scriptsRoot 'Test-NetHealthDocumentationDueDatesNormalizedCsv.ps1') -Path $docNormalizedPath 2>&1 | Out-String
        Add-Result -Results $results -Name 'Documentation Normalized Contract' -Status 'PASS' -Details (($docOutput -replace '\s+', ' ').Trim())
    }
    catch {
        Add-Result -Results $results -Name 'Documentation Normalized Contract' -Status 'FAIL' -Details $_.Exception.Message
    }
}
else {
    Add-Result -Results $results -Name 'Documentation Normalized Contract' -Status 'SKIP' -Details 'nethealth_documentation_due_dates.normalized.csv not present.'
}

$vitalsNormalizedPath = Join-Path $processedRoot 'pcc_resident_vitals_current.csv'
if (Test-Path -LiteralPath $vitalsNormalizedPath) {
    try {
        $vitalsOutput = & powershell -ExecutionPolicy Bypass -File (Join-Path $scriptsRoot 'Test-PccResidentVitalsNormalizedCsv.ps1') -Path $vitalsNormalizedPath 2>&1 | Out-String
        Add-Result -Results $results -Name 'Vitals Normalized Contract' -Status 'PASS' -Details (($vitalsOutput -replace '\s+', ' ').Trim())
    }
    catch {
        Add-Result -Results $results -Name 'Vitals Normalized Contract' -Status 'FAIL' -Details $_.Exception.Message
    }
}
else {
    Add-Result -Results $results -Name 'Vitals Normalized Contract' -Status 'SKIP' -Details 'pcc_resident_vitals_current.csv not present.'
}

try {
    $flowNamingOutput = & powershell -ExecutionPolicy Bypass -File (Join-Path $scriptsRoot 'Test-PowerAutomateFlowNamingStandard.ps1') 2>&1 | Out-String
    $normalizedFlowNaming = ($flowNamingOutput -replace '\s+', ' ').Trim()
    if ($normalizedFlowNaming -match 'Status:\s*FAIL') {
        Add-Result -Results $results -Name 'Power Automate Naming Standard' -Status 'FAIL' -Details $normalizedFlowNaming
    }
    else {
        Add-Result -Results $results -Name 'Power Automate Naming Standard' -Status 'PASS' -Details $normalizedFlowNaming
    }
}
catch {
    Add-Result -Results $results -Name 'Power Automate Naming Standard' -Status 'FAIL' -Details $_.Exception.Message
}

try {
    & powershell -ExecutionPolicy Bypass -File (Join-Path $scriptsRoot 'Invoke-PowerBiExecutivePrep.ps1') | Out-Null
    Add-Result -Results $results -Name 'Power BI Executive Prep' -Status 'PASS' -Details 'Cross-source pipeline, package generation, and package validation completed.'
}
catch {
    Add-Result -Results $results -Name 'Power BI Executive Prep' -Status 'FAIL' -Details $_.Exception.Message
}

try {
    $publishChecklistOutput = & powershell -ExecutionPolicy Bypass -File (Join-Path $scriptsRoot 'Invoke-PowerBiPublishChecklist.ps1') -FailIfNotReady 2>&1 | Out-String
    Add-Result -Results $results -Name 'Power BI Publish Readiness' -Status 'PASS' -Details (($publishChecklistOutput -replace '\s+', ' ').Trim())
}
catch {
    Add-Result -Results $results -Name 'Power BI Publish Readiness' -Status 'FAIL' -Details $_.Exception.Message
}

try {
    $powerBiNonInteractiveSmokeOutput = & powershell -ExecutionPolicy Bypass -File (Join-Path $scriptsRoot 'Test-PowerBiPublishedSmokeNonInteractive.ps1') 2>&1 | Out-String
    $normalizedPowerBiNonInteractiveSmoke = ($powerBiNonInteractiveSmokeOutput -replace '\s+', ' ').Trim()
    if ($normalizedPowerBiNonInteractiveSmoke -match 'Status:\s*SKIP') {
        Add-Result -Results $results -Name 'Power BI Published Smoke (Non-Interactive)' -Status 'SKIP' -Details $normalizedPowerBiNonInteractiveSmoke
    }
    else {
        Add-Result -Results $results -Name 'Power BI Published Smoke (Non-Interactive)' -Status 'PASS' -Details $normalizedPowerBiNonInteractiveSmoke
    }
}
catch {
    Add-Result -Results $results -Name 'Power BI Published Smoke (Non-Interactive)' -Status 'FAIL' -Details $_.Exception.Message
}

try {
    $pesterOutput = & powershell -ExecutionPolicy Bypass -File (Join-Path $scriptsRoot 'Invoke-PesterHardeningSuite.ps1') 2>&1 | Out-String
    Add-Result -Results $results -Name 'Pester Hardening Suite' -Status 'PASS' -Details (($pesterOutput -replace '\s+', ' ').Trim())
}
catch {
    Add-Result -Results $results -Name 'Pester Hardening Suite' -Status 'FAIL' -Details $_.Exception.Message
}

try {
    & powershell -ExecutionPolicy Bypass -File (Join-Path $scriptsRoot 'New-CommandCenterOperationalSummaryJson.ps1') | Out-Null
    & powershell -ExecutionPolicy Bypass -File (Join-Path $scriptsRoot 'New-CommandCenterOperationalHistory.ps1') | Out-Null
    & powershell -ExecutionPolicy Bypass -File (Join-Path $scriptsRoot 'New-ExecutiveCommandCenterReportBundle.ps1') | Out-Null
    & powershell -ExecutionPolicy Bypass -File (Join-Path $scriptsRoot 'Save-ExecutiveCommandCenterSnapshot.ps1') | Out-Null
    & powershell -ExecutionPolicy Bypass -File (Join-Path $scriptsRoot 'Test-ExecutiveCommandCenterReportBundle.ps1') | Out-Null
    Add-Result -Results $results -Name 'Executive Report Bundle' -Status 'PASS' -Details 'Structured JSON summary, history, HTML bundle, and bundle validation completed.'
}
catch {
    Add-Result -Results $results -Name 'Executive Report Bundle' -Status 'FAIL' -Details $_.Exception.Message
}

try {
    $shapOutput = & powershell -ExecutionPolicy Bypass -File (Join-Path $scriptsRoot 'Test-CommandCenterShapExplanations.ps1') 2>&1 | Out-String
    Add-Result -Results $results -Name 'SHAP Explanations Contract' -Status 'PASS' -Details (($shapOutput -replace '\s+', ' ').Trim())
}
catch {
    Add-Result -Results $results -Name 'SHAP Explanations Contract' -Status 'FAIL' -Details $_.Exception.Message
}

try {
    $guardedResponseOutput = & powershell -ExecutionPolicy Bypass -File (Join-Path $scriptsRoot 'Test-CommandCenterGuardedResponseEvidence.ps1') 2>&1 | Out-String
    Add-Result -Results $results -Name 'Guarded Response Evidence Contract' -Status 'PASS' -Details (($guardedResponseOutput -replace '\s+', ' ').Trim())
}
catch {
    Add-Result -Results $results -Name 'Guarded Response Evidence Contract' -Status 'FAIL' -Details $_.Exception.Message
}

try {
    $groundednessEvalOutput = & powershell -ExecutionPolicy Bypass -File (Join-Path $scriptsRoot 'Test-CommandCenterGroundednessEvaluation.ps1') 2>&1 | Out-String
    $normalizedGroundednessEval = ($groundednessEvalOutput -replace '\s+', ' ').Trim()
    if ($normalizedGroundednessEval -match 'Status:\s*SKIP') {
        Add-Result -Results $results -Name 'Groundedness Evaluation' -Status 'SKIP' -Details $normalizedGroundednessEval
    }
    else {
        Add-Result -Results $results -Name 'Groundedness Evaluation' -Status 'PASS' -Details $normalizedGroundednessEval
    }
}
catch {
    Add-Result -Results $results -Name 'Groundedness Evaluation' -Status 'FAIL' -Details $_.Exception.Message
}

try {
    & powershell -ExecutionPolicy Bypass -File (Join-Path $scriptsRoot 'Invoke-ExecutiveCommandCenterBundleSmoke.ps1') | Out-Null
    Add-Result -Results $results -Name 'Executive Bundle Smoke' -Status 'PASS' -Details 'Playwright smoke validation passed for the generated executive HTML bundle.'
}
catch {
    Add-Result -Results $results -Name 'Executive Bundle Smoke' -Status 'FAIL' -Details $_.Exception.Message
}

try {
    $historyOutput = & powershell -ExecutionPolicy Bypass -File (Join-Path $scriptsRoot 'Test-CommandCenterOperationalHistory.ps1') 2>&1 | Out-String
    Add-Result -Results $results -Name 'Operational History And Snapshot Archive' -Status 'PASS' -Details (($historyOutput -replace '\s+', ' ').Trim())
}
catch {
    Add-Result -Results $results -Name 'Operational History And Snapshot Archive' -Status 'FAIL' -Details $_.Exception.Message
}

$requiredOutputChecks = @(
    @{ Label = 'command_center_documentation_queue.csv'; Path = (Join-Path $processedRoot 'command_center_documentation_queue.csv') },
    @{ Label = 'command_center_documentation_queue.by-unit.csv'; Path = (Join-Path $processedRoot 'command_center_documentation_queue.by-unit.csv') },
    @{ Label = 'command_center_executive_unit_snapshot.csv'; Path = (Join-Path $processedRoot 'command_center_executive_unit_snapshot.csv') },
    @{ Label = 'command_center_patient_insights.csv'; Path = (Join-Path $processedRoot 'command_center_patient_insights.csv') },
    @{ Label = 'command_center_shap_explanations.csv'; Path = (Join-Path $processedRoot 'command_center_shap_explanations.csv') },
    @{ Label = 'command_center_shap_feature_importance.csv'; Path = (Join-Path $processedRoot 'command_center_shap_feature_importance.csv') },
    @{ Label = 'command_center_shap_summary.md'; Path = (Join-Path $processedRoot 'command_center_shap_summary.md') },
    @{ Label = 'command_center_automated_handoff_queue.csv'; Path = (Join-Path $processedRoot 'command_center_automated_handoff_queue.csv') },
    @{ Label = 'command_center_automated_handoff_queue.by-unit.csv'; Path = (Join-Path $processedRoot 'command_center_automated_handoff_queue.by-unit.csv') },
    @{ Label = 'command_center_automated_handoff_dispatch_log.csv'; Path = (Join-Path $processedRoot 'command_center_automated_handoff_dispatch_log.csv') },
    @{ Label = 'command_center_automated_handoff_dispatch_summary.md'; Path = (Join-Path $processedRoot 'command_center_automated_handoff_dispatch_summary.md') },
    @{ Label = 'command_center_automated_handoff_queue.by-status.csv'; Path = (Join-Path $processedRoot 'command_center_automated_handoff_queue.by-status.csv') },
    @{ Label = 'command_center_automated_handoff_lifecycle_summary.md'; Path = (Join-Path $processedRoot 'command_center_automated_handoff_lifecycle_summary.md') },
    @{ Label = 'command_center_data_drift_report.md'; Path = (Join-Path $processedRoot 'command_center_data_drift_report.md') },
    @{ Label = 'powerbi_publish_readiness.md'; Path = (Join-Path $processedRoot 'powerbi_publish_readiness.md') },
    @{ Label = 'patient-insight-scoring.json'; Path = (Join-Path $ProjectRoot 'contracts\patient-insight-scoring.json') },
    @{ Label = 'command-center-data-drift-thresholds.json'; Path = (Join-Path $ProjectRoot 'contracts\command-center-data-drift-thresholds.json') },
    @{ Label = 'guarded-response-contract.json'; Path = (Join-Path $ProjectRoot 'contracts\guarded-response-contract.json') },
    @{ Label = 'command_center_operational_summary.md'; Path = (Join-Path $processedRoot 'command_center_operational_summary.md') },
    @{ Label = 'command_center_operational_summary.json'; Path = (Join-Path $processedRoot 'command_center_operational_summary.json') },
    @{ Label = 'command_center_operational_history.csv'; Path = (Join-Path $processedRoot 'command_center_operational_history.csv') },
    @{ Label = 'command_center_operational_history.json'; Path = (Join-Path $processedRoot 'command_center_operational_history.json') },
    @{ Label = 'command_center_cross_source_runlog.json'; Path = (Join-Path $processedRoot 'command_center_cross_source_runlog.json') },
    @{ Label = 'source-package-manifest.json'; Path = (Join-Path $ProjectRoot 'integrations\powerbi\source-package\current\source-package-manifest.json') },
    @{ Label = 'model-table-manifest.json'; Path = (Join-Path $ProjectRoot 'integrations\powerbi\source-package\current\model-tables\model-table-manifest.json') },
    @{ Label = 'executive-command-center.html'; Path = (Join-Path $ProjectRoot 'data\exports\executive-command-center\current\executive-command-center.html') },
    @{ Label = 'report-bundle-manifest.json'; Path = (Join-Path $ProjectRoot 'data\exports\executive-command-center\current\report-bundle-manifest.json') },
    @{ Label = 'executive-command-center-history'; Path = (Join-Path $ProjectRoot 'data\exports\executive-command-center\history') }
)

$missingOutputs = @(
    foreach ($check in $requiredOutputChecks) {
        if (-not (Test-Path -LiteralPath $check.Path)) { $check.Label }
    }
)

if ($missingOutputs.Count -gt 0) {
    Add-Result -Results $results -Name 'Required Outputs' -Status 'FAIL' -Details ($missingOutputs -join ', ')
}
else {
    Add-Result -Results $results -Name 'Required Outputs' -Status 'PASS' -Details 'Core processed outputs and Power BI package manifests exist.'
}

$reportLines = @()
$reportLines += '# SNF QA Sweep'
$reportLines += ''
$reportLines += ('Generated: {0}' -f (Get-Date).ToString('yyyy-MM-dd HH:mm:ss'))
$reportLines += ''
foreach ($result in $results) {
    $reportLines += ('- [{0}] {1}: {2}' -f $result.Status, $result.Name, $result.Details)
}

$outputDirectory = Split-Path -Parent $OutputPath
if ($outputDirectory -and -not (Test-Path -LiteralPath $outputDirectory)) {
    New-Item -ItemType Directory -Path $outputDirectory -Force | Out-Null
}

$reportLines -join [Environment]::NewLine | Set-Content -LiteralPath $OutputPath -Encoding UTF8
Write-Host "QA sweep report written to: $OutputPath"

$failed = @($results | Where-Object { $_.Status -eq 'FAIL' })
if ($failed.Count -gt 0) {
    throw "QA sweep found failures: $($failed.Count)"
}


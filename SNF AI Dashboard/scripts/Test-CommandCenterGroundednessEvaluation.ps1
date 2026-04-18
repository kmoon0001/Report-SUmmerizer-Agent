param(
    [string]$QueuePath = 'D:\SNF AI Dashboard\data\processed\command_center_automated_handoff_queue.csv',
    [string]$PatientInsightsPath = 'D:\SNF AI Dashboard\data\processed\command_center_patient_insights.csv',
    [string]$DatasetPath = 'D:\SNF AI Dashboard\data\processed\command_center_groundedness_eval_dataset.jsonl',
    [string]$ResultPath = 'D:\SNF AI Dashboard\data\processed\command_center_groundedness_eval.json',
    [string]$ReportPath = 'D:\SNF AI Dashboard\data\processed\command_center_groundedness_eval.md',
    [string]$PythonExecutable = '',
    [double]$Threshold = 3.0,
    [double]$MinAverageScore = 3.5,
    [double]$MinPassRate = 0.85
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$secureEnvScript = Join-Path $PSScriptRoot 'Import-SnfSecureEnv.ps1'
if (Test-Path -LiteralPath $secureEnvScript) {
    try {
        & $secureEnvScript | Out-Null
    }
    catch {
        Write-Warning "Secure env import skipped: $($_.Exception.Message)"
    }
}

function New-InsightLookupKey {
    param(
        [string]$SnapshotDateKey,
        [string]$ResidentSourceId
    )

    return '{0}|{1}' -f $SnapshotDateKey, $ResidentSourceId
}

function Get-ObjectPropertyValue {
    param(
        [psobject]$Object,
        [string]$PropertyName
    )

    if ($null -eq $Object) { return '' }
    $property = $Object.PSObject.Properties[$PropertyName]
    if ($null -eq $property) { return '' }
    return [string]$property.Value
}

if (-not (Test-Path -LiteralPath $QueuePath)) {
    throw "Queue file not found: $QueuePath"
}

if (-not (Test-Path -LiteralPath $PatientInsightsPath)) {
    throw "Patient insights file not found: $PatientInsightsPath"
}

$queueRows = @(Import-Csv -LiteralPath $QueuePath)
$patientInsightRows = @(Import-Csv -LiteralPath $PatientInsightsPath)

if ($queueRows.Count -eq 0) {
    throw "Queue file is empty: $QueuePath"
}

$insightByKey = @{}
foreach ($row in $patientInsightRows) {
    $key = New-InsightLookupKey -SnapshotDateKey ([string]$row.SnapshotDateKey) -ResidentSourceId ([string]$row.ResidentSourceId)
    $insightByKey[$key] = $row
}

$datasetRows = [System.Collections.Generic.List[object]]::new()
foreach ($row in $queueRows) {
    $response = ([string]$row.CopilotAgentInsight).Trim()
    if (-not $response) { continue }

    $key = New-InsightLookupKey -SnapshotDateKey ([string]$row.SnapshotDateKey) -ResidentSourceId ([string]$row.ResidentSourceId)
    $insight = if ($insightByKey.ContainsKey($key)) { $insightByKey[$key] } else { $null }

    $contextLines = [System.Collections.Generic.List[string]]::new()
    $contextLines.Add("ResidentName: $([string]$row.ResidentName)") | Out-Null
    $contextLines.Add("ResidentSourceId: $([string]$row.ResidentSourceId)") | Out-Null
    $contextLines.Add("UnitCode: $([string]$row.UnitCode)") | Out-Null
    $contextLines.Add("PriorityBand: $([string]$row.PriorityBand)") | Out-Null
    $contextLines.Add("PriorityScore: $([string]$row.PriorityScore)") | Out-Null
    $contextLines.Add("ProgressLevel: $([string]$row.ProgressLevel)") | Out-Null
    $contextLines.Add("OutstandingDocCount: $([string]$row.OutstandingDocCount)") | Out-Null
    $contextLines.Add("OverdueDocCount: $([string]$row.OverdueDocCount)") | Out-Null
    $contextLines.Add("VitalsSummary: $([string]$row.VitalsSummary)") | Out-Null
    $contextLines.Add("TriggerReason: $([string]$row.TriggerReason)") | Out-Null
    $contextLines.Add("EvidenceSources: $(Get-ObjectPropertyValue -Object $row -PropertyName 'EvidenceSources')") | Out-Null

    if ($null -ne $insight) {
        $contextLines.Add("InsightSummary: $(Get-ObjectPropertyValue -Object $insight -PropertyName 'InsightSummary')") | Out-Null
        $contextLines.Add("ThingsToLookOutFor: $(Get-ObjectPropertyValue -Object $insight -PropertyName 'ThingsToLookOutFor')") | Out-Null
        $contextLines.Add("TherapyMinutes: $(Get-ObjectPropertyValue -Object $insight -PropertyName 'TherapyMinutes')") | Out-Null
        $contextLines.Add("TherapyDisciplines: $(Get-ObjectPropertyValue -Object $insight -PropertyName 'TherapyDisciplines')") | Out-Null
        $contextLines.Add("LastTherapyDate: $(Get-ObjectPropertyValue -Object $insight -PropertyName 'LastTherapyDate')") | Out-Null
        $contextLines.Add("DocumentationDisciplines: $(Get-ObjectPropertyValue -Object $insight -PropertyName 'DocumentationDisciplines')") | Out-Null
        $contextLines.Add("NextDocumentationDueDate: $(Get-ObjectPropertyValue -Object $insight -PropertyName 'NextDocumentationDueDate')") | Out-Null
    }

    $datasetRows.Add([pscustomobject]@{
        ticket_id = [string]$row.HandoffTicketId
        resident_source_id = [string]$row.ResidentSourceId
        resident_name = [string]$row.ResidentName
        query = "What is the next recommended follow-up for resident $([string]$row.ResidentName) given the current operational and clinical context?"
        context = $contextLines -join "`n"
        response = $response
    }) | Out-Null
}

$datasetDirectory = Split-Path -Parent $DatasetPath
if ($datasetDirectory -and -not (Test-Path -LiteralPath $datasetDirectory)) {
    New-Item -ItemType Directory -Path $datasetDirectory -Force | Out-Null
}

$datasetLines = foreach ($row in $datasetRows) {
    $row | ConvertTo-Json -Compress
}
$datasetLines -join [Environment]::NewLine | Set-Content -LiteralPath $DatasetPath -Encoding UTF8

$pythonScriptPath = Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Path) 'Evaluate-CommandCenterGroundedness.py'
$resolvedPythonExecutable = $PythonExecutable
if ([string]::IsNullOrWhiteSpace($resolvedPythonExecutable)) {
    if (-not [string]::IsNullOrWhiteSpace($env:SNF_PYTHON_PATH)) {
        $resolvedPythonExecutable = [string]$env:SNF_PYTHON_PATH
    }
    else {
        $projectRoot = Split-Path -Parent $PSScriptRoot
        $venvPythonPath = Join-Path $projectRoot '.venv-codex-yaml\Scripts\python.exe'
        if (Test-Path -LiteralPath $venvPythonPath) {
            $resolvedPythonExecutable = $venvPythonPath
        }
        else {
            $resolvedPythonExecutable = 'python'
        }
    }
}

$pythonOutput = & $resolvedPythonExecutable $pythonScriptPath --input $DatasetPath --output $ResultPath --threshold $Threshold --min-average-score $MinAverageScore --min-pass-rate $MinPassRate 2>&1
$pythonText = ($pythonOutput | Out-String).Trim()
$pythonExitCode = $LASTEXITCODE
if (-not (Test-Path -LiteralPath $ResultPath)) {
    throw ("Groundedness evaluation result file was not created: {0}. Python='{1}'. PythonExitCode={2}. Output={3}" -f $ResultPath, $resolvedPythonExecutable, $pythonExitCode, $pythonText)
}

try {
    $result = Get-Content -LiteralPath $ResultPath -Raw | ConvertFrom-Json
}
catch {
    if (-not $pythonText) {
        throw ("Groundedness evaluation result was not parseable and python output was empty. PythonExitCode={0}" -f $pythonExitCode)
    }
    try {
        $result = $pythonText | ConvertFrom-Json
    }
    catch {
        throw ("Groundedness evaluation result JSON parse failed. Python='{0}'. PythonExitCode={1}. Output={2}" -f $resolvedPythonExecutable, $pythonExitCode, $pythonText)
    }
}

$statusCounts = @(
    $queueRows |
        Group-Object GroundednessStatus |
        Sort-Object Name |
        ForEach-Object { '{0}={1}' -f $_.Name, $_.Count }
) -join ', '

$reportLines = @(
    '# Command Center Groundedness Evaluation',
    '',
    ('Generated: {0}' -f (Get-Date).ToString('yyyy-MM-dd HH:mm:ss')),
    '',
    ('- Status: {0}' -f [string]$result.status),
    ('- Dataset rows: {0}' -f $datasetRows.Count),
    ('- Queue groundedness distribution: {0}' -f $statusCounts)
)

if ($result.PSObject.Properties.Name -contains 'mode') {
    $reportLines += ('- Mode: {0}' -f [string]$result.mode)
}
$reportLines += ('- Python executable: {0}' -f $resolvedPythonExecutable)

if ($result.PSObject.Properties.Name -contains 'reason' -and -not [string]::IsNullOrWhiteSpace([string]$result.reason)) {
    $reportLines += ('- Reason: {0}' -f [string]$result.reason)
}

if ($result.PSObject.Properties.Name -contains 'averageScore') {
    $reportLines += ('- Average score: {0}' -f [string]$result.averageScore)
}

if ($result.PSObject.Properties.Name -contains 'passRate') {
    $reportLines += ('- Pass rate: {0}' -f [string]$result.passRate)
}

$reportDirectory = Split-Path -Parent $ReportPath
if ($reportDirectory -and -not (Test-Path -LiteralPath $reportDirectory)) {
    New-Item -ItemType Directory -Path $reportDirectory -Force | Out-Null
}

$reportLines -join [Environment]::NewLine | Set-Content -LiteralPath $ReportPath -Encoding UTF8

if ([string]$result.status -eq 'SKIP') {
    Write-Host "Groundedness evaluation report written to: $ReportPath"
    Write-Host ('Status: SKIP')
    Write-Host ('Reason: {0}' -f [string]$result.reason)
    return
}

if ([string]$result.status -ne 'PASS') {
    throw ('Groundedness evaluation failed. Status={0}; AverageScore={1}; PassRate={2}; Python={3}; PythonExitCode={4}' -f [string]$result.status, [string]$result.averageScore, [string]$result.passRate, $resolvedPythonExecutable, $pythonExitCode)
}

Write-Host "Groundedness evaluation report written to: $ReportPath"
Write-Host ('Status: PASS')
Write-Host ('AverageScore: {0}' -f [string]$result.averageScore)
Write-Host ('PassRate: {0}' -f [string]$result.passRate)

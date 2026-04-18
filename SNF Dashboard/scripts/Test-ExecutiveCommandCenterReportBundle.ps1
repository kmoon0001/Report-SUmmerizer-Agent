param(
    [string]$BundleRoot = 'D:\my agents copilot studio\SNF Dashboard\data\exports\executive-command-center\current',
    [string]$ProcessedRoot = 'D:\my agents copilot studio\SNF Dashboard\data\processed'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$requiredFiles = @(
    'executive-command-center.html',
    'executive-command-center.data.json',
    'report-bundle-manifest.json',
    'command_center_operational_summary.md',
    'command_center_operational_summary.json',
    'command_center_executive_unit_snapshot.csv',
    'command_center_documentation_queue.csv',
    'command_center_documentation_queue.by-unit.csv',
    'command_center_patient_insights.csv',
    'command_center_automated_handoff_queue.csv',
    'pcc_resident_list_current.active-only.csv'
)

$missing = @(
    foreach ($fileName in $requiredFiles) {
        $path = Join-Path $BundleRoot $fileName
        if (-not (Test-Path -LiteralPath $path)) { $fileName }
    }
)
if ($missing.Count -gt 0) {
    throw "Executive report bundle missing files: $($missing -join ', ')"
}

$manifestPath = Join-Path $BundleRoot 'report-bundle-manifest.json'
$manifest = Get-Content -LiteralPath $manifestPath -Raw | ConvertFrom-Json

$censusRows = @(Import-Csv -LiteralPath (Join-Path $BundleRoot 'pcc_resident_list_current.active-only.csv'))
$docRows = @(Import-Csv -LiteralPath (Join-Path $BundleRoot 'command_center_documentation_queue.csv'))
$unitRows = @(Import-Csv -LiteralPath (Join-Path $BundleRoot 'command_center_executive_unit_snapshot.csv'))
$patientInsightRows = @(Import-Csv -LiteralPath (Join-Path $BundleRoot 'command_center_patient_insights.csv'))
$handoffRows = @(Import-Csv -LiteralPath (Join-Path $BundleRoot 'command_center_automated_handoff_queue.csv'))
$dashboardData = Get-Content -LiteralPath (Join-Path $BundleRoot 'executive-command-center.data.json') -Raw | ConvertFrom-Json

if ([int]$manifest.CensusRows -ne $censusRows.Count) {
    throw "Bundle manifest CensusRows mismatch. Manifest=$($manifest.CensusRows) Actual=$($censusRows.Count)"
}
if ([int]$manifest.DocumentationRows -ne $docRows.Count) {
    throw "Bundle manifest DocumentationRows mismatch. Manifest=$($manifest.DocumentationRows) Actual=$($docRows.Count)"
}
if ([int]$manifest.UnitRows -ne $unitRows.Count) {
    throw "Bundle manifest UnitRows mismatch. Manifest=$($manifest.UnitRows) Actual=$($unitRows.Count)"
}
if ([int]$manifest.PatientInsightRows -ne $patientInsightRows.Count) {
    throw "Bundle manifest PatientInsightRows mismatch. Manifest=$($manifest.PatientInsightRows) Actual=$($patientInsightRows.Count)"
}
if ([int]$manifest.AutomatedHandoffRows -ne $handoffRows.Count) {
    throw "Bundle manifest AutomatedHandoffRows mismatch. Manifest=$($manifest.AutomatedHandoffRows) Actual=$($handoffRows.Count)"
}
if ($dashboardData.metrics.currentResidents -ne $censusRows.Count) {
    throw "Dashboard data currentResidents mismatch. Dashboard=$($dashboardData.metrics.currentResidents) Actual=$($censusRows.Count)"
}
if (@($dashboardData.patientInsights).Count -ne $patientInsightRows.Count) {
    throw "Dashboard data patientInsights mismatch. Dashboard=$(@($dashboardData.patientInsights).Count) Actual=$($patientInsightRows.Count)"
}
if (@($dashboardData.automatedHandoffQueue).Count -ne $handoffRows.Count) {
    throw "Dashboard data automatedHandoffQueue mismatch. Dashboard=$(@($dashboardData.automatedHandoffQueue).Count) Actual=$($handoffRows.Count)"
}

$htmlPath = Join-Path $BundleRoot 'executive-command-center.html'
$html = Get-Content -LiteralPath $htmlPath -Raw
foreach ($requiredText in @('SNF Executive Command Center','Current Residents','Outstanding Docs','Top priority residents','Patient Insights','Automated Handoff Queue','Therapy by discipline')) {
    if ($html -notmatch [regex]::Escape($requiredText)) {
        throw "Executive HTML report is missing expected text: $requiredText"
    }
}

$processedSummaryJson = Join-Path $ProcessedRoot 'command_center_operational_summary.json'
if (Test-Path -LiteralPath $processedSummaryJson) {
    $bundleSummaryJson = Join-Path $BundleRoot 'command_center_operational_summary.json'
    if (-not (Test-Path -LiteralPath $bundleSummaryJson)) {
        throw 'Bundle is missing command_center_operational_summary.json even though processed JSON exists.'
    }
}

$processedHistoryCsv = Join-Path $ProcessedRoot 'command_center_operational_history.csv'
if (Test-Path -LiteralPath $processedHistoryCsv) {
    $bundleHistoryCsv = Join-Path $BundleRoot 'command_center_operational_history.csv'
    if (-not (Test-Path -LiteralPath $bundleHistoryCsv)) {
        throw 'Bundle is missing command_center_operational_history.csv even though processed history CSV exists.'
    }
}

Write-Host 'Executive command center report bundle validation passed.'
Write-Host "Bundle root: $BundleRoot"


param(
    [string]$PccActiveCensusPath = 'D:\SNF AI Dashboard\data\processed\pcc_resident_list_current.active-only.csv',
    [string]$DocumentationQueuePath = 'D:\SNF AI Dashboard\data\processed\command_center_documentation_queue.csv',
    [string]$DocumentationQueueByUnitPath = 'D:\SNF AI Dashboard\data\processed\command_center_documentation_queue.by-unit.csv',
    [string]$TherapyCoveragePath = 'D:\SNF AI Dashboard\data\processed\command_center_therapy_coverage.csv',
    [string]$TherapyCoverageByUnitPath = 'D:\SNF AI Dashboard\data\processed\command_center_therapy_coverage.by-unit.csv',
    [string]$PriorityQueuePath = 'D:\SNF AI Dashboard\data\processed\command_center_therapy_documentation_priority.csv',
    [string]$PriorityQueueByUnitPath = 'D:\SNF AI Dashboard\data\processed\command_center_therapy_documentation_priority.by-unit.csv',
    [string]$OutputPath = 'D:\SNF AI Dashboard\data\processed\command_center_operational_summary.md'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath $PccActiveCensusPath)) {
    throw "PCC active census file not found: $PccActiveCensusPath"
}

$pccRows = @(Import-Csv -LiteralPath $PccActiveCensusPath)
if ($pccRows.Count -eq 0) { throw "PCC active census file has no rows: $PccActiveCensusPath" }

$docRows = @(
    if (Test-Path -LiteralPath $DocumentationQueuePath) { Import-Csv -LiteralPath $DocumentationQueuePath }
)
$docUnitRows = @(
    if (Test-Path -LiteralPath $DocumentationQueueByUnitPath) { Import-Csv -LiteralPath $DocumentationQueueByUnitPath }
)
$therapyRows = @(
    if (Test-Path -LiteralPath $TherapyCoveragePath) { Import-Csv -LiteralPath $TherapyCoveragePath }
)
$therapyUnitRows = @(
    if (Test-Path -LiteralPath $TherapyCoverageByUnitPath) { Import-Csv -LiteralPath $TherapyCoverageByUnitPath }
)
$priorityRows = @(
    if (Test-Path -LiteralPath $PriorityQueuePath) { Import-Csv -LiteralPath $PriorityQueuePath }
)
$priorityUnitRows = @(
    if (Test-Path -LiteralPath $PriorityQueueByUnitPath) { Import-Csv -LiteralPath $PriorityQueueByUnitPath }
)

$unitCounts = @($pccRows | Group-Object UnitCode | Sort-Object Name | ForEach-Object { '{0}: {1}' -f $_.Name, $_.Count })
$residentsWithDocs = @($docRows | Select-Object -ExpandProperty ResidentSourceId -Unique).Count
$outstandingDocs = @($docRows | Where-Object { $_.IsOutstanding -in @('True','true') }).Count
$overdueDocs = @($docRows | Where-Object { $_.DocumentationStatus -eq 'Overdue' }).Count
$residentsWithTherapy = @($therapyRows | Select-Object -ExpandProperty ResidentSourceId -Unique).Count
$totalTherapyMinutes = 0
if ($therapyRows.Count -gt 0) {
    $therapyMeasure = $therapyRows | Measure-Object -Property Minutes -Sum
    if ($therapyMeasure -and $null -ne $therapyMeasure.Sum) {
        $totalTherapyMinutes = $therapyMeasure.Sum
    }
}

$lines = @()
$lines += '# Command Center Operational Summary'
$lines += ''
$lines += ('Generated: {0}' -f (Get-Date).ToString('yyyy-MM-dd HH:mm:ss'))
$lines += ''
$lines += '## Current State'
$lines += ''
$lines += ('- Current active PCC residents: {0}' -f $pccRows.Count)
$lines += ('- Residents with documentation items in queue: {0}' -f $residentsWithDocs)
$lines += ('- Outstanding documentation items: {0}' -f $outstandingDocs)
$lines += ('- Overdue documentation items: {0}' -f $overdueDocs)
$lines += ('- Residents with current therapy coverage file: {0}' -f $residentsWithTherapy)
$lines += ('- Total therapy minutes in current therapy coverage file: {0}' -f $totalTherapyMinutes)
$lines += ('- Residents in combined priority queue: {0}' -f $priorityRows.Count)
$lines += ''
$lines += '## Census By Unit'
$lines += ''
foreach ($entry in $unitCounts) { $lines += ('- {0}' -f $entry) }

$lines += ''
$lines += '## Documentation By Unit'
$lines += ''
if ($docUnitRows.Count -gt 0) {
    foreach ($row in $docUnitRows) {
        $lines += ('- {0}: {1} items, {2} outstanding, {3} due today or earlier' -f $row.UnitCode, $row.CurrentResidentDocItems, $row.OutstandingDocItems, $row.DueTodayOrEarlier)
    }
}
else {
    $lines += '- Documentation queue not available.'
}

$lines += ''
$lines += '## Therapy By Unit'
$lines += ''
if ($therapyUnitRows.Count -gt 0) {
    foreach ($row in $therapyUnitRows) {
        $lines += ('- {0}: {1} treatment lines, {2} residents treated, {3} minutes' -f $row.UnitCode, $row.CurrentResidentTreatments, $row.UniqueResidentsTreated, $row.TotalTreatmentMinutes)
    }
}
else {
    $lines += '- Therapy coverage not available yet. Land `nethealth_therapy_census.csv` to populate this section.'
}

$lines += ''
$lines += '## Priority Queue By Unit'
$lines += ''
if ($priorityUnitRows.Count -gt 0) {
    foreach ($row in $priorityUnitRows) {
        $lines += ('- {0}: {1} residents, {2} therapy minutes, {3} outstanding docs, highest score {4}' -f $row.UnitCode, $row.ResidentsInPriorityQueue, $row.TotalTherapyMinutes, $row.TotalOutstandingDocs, $row.HighestPriorityScore)
    }
}
else {
    $lines += '- Combined therapy/documentation priority queue not available yet.'
}

$lines += ''
$lines += '## Top Priority Residents'
$lines += ''
if ($priorityRows.Count -gt 0) {
    foreach ($row in @($priorityRows | Select-Object -First 10)) {
        $lines += ('- {0} ({1}) unit {2}: score {3}, therapy lines {4}, therapy minutes {5}, outstanding docs {6}, overdue docs {7}' -f $row.ResidentName, $row.ResidentSourceId, $row.UnitCode, $row.PriorityScore, $row.TherapyLineCount, $row.TherapyMinutes, $row.OutstandingDocCount, $row.OverdueDocCount)
    }
}
else {
    $lines += '- Combined therapy/documentation priority queue not available yet.'
}

$outputDirectory = Split-Path -Parent $OutputPath
if ($outputDirectory -and -not (Test-Path -LiteralPath $outputDirectory)) {
    New-Item -ItemType Directory -Path $outputDirectory -Force | Out-Null
}

$lines -join [Environment]::NewLine | Set-Content -LiteralPath $OutputPath -Encoding UTF8
Write-Host "Operational summary written to: $OutputPath"

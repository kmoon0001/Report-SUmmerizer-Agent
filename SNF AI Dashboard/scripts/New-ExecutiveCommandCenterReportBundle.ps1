param(
    [string]$ProcessedRoot = 'D:\SNF AI Dashboard\data\processed',
    [string]$OutputRoot = 'D:\SNF AI Dashboard\data\exports\executive-command-center\current'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Escape-Html {
    param([AllowNull()][string]$Value)
    return [System.Net.WebUtility]::HtmlEncode([string]$Value)
}

function Get-IntValue {
    param($Value)
    $parsed = 0
    if ([int]::TryParse([string]$Value, [ref]$parsed)) { return $parsed }
    return 0
}

function Get-BarWidthPercent {
    param(
        [int]$Value,
        [int]$MaxValue
    )

    if ($MaxValue -le 0) { return 0 }
    return [math]::Round(($Value / $MaxValue) * 100, 1)
}

$requiredFiles = @(
    'pcc_resident_list_current.active-only.csv',
    'command_center_documentation_queue.csv',
    'command_center_documentation_queue.by-unit.csv',
    'command_center_executive_unit_snapshot.csv',
    'command_center_operational_summary.md',
    'command_center_operational_summary.json'
)

foreach ($fileName in $requiredFiles) {
    $path = Join-Path $ProcessedRoot $fileName
    if (-not (Test-Path -LiteralPath $path)) {
        throw "Required processed file not found: $path"
    }
}

if (-not (Test-Path -LiteralPath $OutputRoot)) {
    New-Item -ItemType Directory -Path $OutputRoot -Force | Out-Null
}

Get-ChildItem -LiteralPath $OutputRoot -File -ErrorAction SilentlyContinue | Remove-Item -Force -ErrorAction SilentlyContinue

$censusPath = Join-Path $ProcessedRoot 'pcc_resident_list_current.active-only.csv'
$docQueuePath = Join-Path $ProcessedRoot 'command_center_documentation_queue.csv'
$docByUnitPath = Join-Path $ProcessedRoot 'command_center_documentation_queue.by-unit.csv'
$unitSnapshotPath = Join-Path $ProcessedRoot 'command_center_executive_unit_snapshot.csv'
$summaryPath = Join-Path $ProcessedRoot 'command_center_operational_summary.md'
$summaryJsonPath = Join-Path $ProcessedRoot 'command_center_operational_summary.json'
$therapyPath = Join-Path $ProcessedRoot 'command_center_therapy_coverage.csv'
$therapyByUnitPath = Join-Path $ProcessedRoot 'command_center_therapy_coverage.by-unit.csv'
$priorityPath = Join-Path $ProcessedRoot 'command_center_therapy_documentation_priority.csv'
$priorityByUnitPath = Join-Path $ProcessedRoot 'command_center_therapy_documentation_priority.by-unit.csv'
$patientInsightsPath = Join-Path $ProcessedRoot 'command_center_patient_insights.csv'
$shapExplanationsPath = Join-Path $ProcessedRoot 'command_center_shap_explanations.csv'
$shapFeatureImportancePath = Join-Path $ProcessedRoot 'command_center_shap_feature_importance.csv'
$handoffQueuePath = Join-Path $ProcessedRoot 'command_center_automated_handoff_queue.csv'
$handoffQueueByUnitPath = Join-Path $ProcessedRoot 'command_center_automated_handoff_queue.by-unit.csv'
$historyCsvPath = Join-Path $ProcessedRoot 'command_center_operational_history.csv'
$historyJsonPath = Join-Path $ProcessedRoot 'command_center_operational_history.json'

$filesToCopy = @(
    $censusPath,
    $docQueuePath,
    $docByUnitPath,
    $unitSnapshotPath,
    $summaryPath,
    $summaryJsonPath
)

if (Test-Path -LiteralPath $therapyPath) { $filesToCopy += $therapyPath }
if (Test-Path -LiteralPath $therapyByUnitPath) { $filesToCopy += $therapyByUnitPath }
if (Test-Path -LiteralPath $priorityPath) { $filesToCopy += $priorityPath }
if (Test-Path -LiteralPath $priorityByUnitPath) { $filesToCopy += $priorityByUnitPath }
if (Test-Path -LiteralPath $patientInsightsPath) { $filesToCopy += $patientInsightsPath }
if (Test-Path -LiteralPath $shapExplanationsPath) { $filesToCopy += $shapExplanationsPath }
if (Test-Path -LiteralPath $shapFeatureImportancePath) { $filesToCopy += $shapFeatureImportancePath }
if (Test-Path -LiteralPath $handoffQueuePath) { $filesToCopy += $handoffQueuePath }
if (Test-Path -LiteralPath $handoffQueueByUnitPath) { $filesToCopy += $handoffQueueByUnitPath }
if (Test-Path -LiteralPath $historyCsvPath) { $filesToCopy += $historyCsvPath }
if (Test-Path -LiteralPath $historyJsonPath) { $filesToCopy += $historyJsonPath }

foreach ($path in $filesToCopy) {
    Copy-Item -LiteralPath $path -Destination (Join-Path $OutputRoot ([System.IO.Path]::GetFileName($path))) -Force
}

$summary = Get-Content -LiteralPath $summaryJsonPath -Raw | ConvertFrom-Json
$metrics = $summary.metrics
$censusRows = @(Import-Csv -LiteralPath $censusPath)
$docRows = @(Import-Csv -LiteralPath $docQueuePath)
$docByUnitRows = @(Import-Csv -LiteralPath $docByUnitPath)
$unitRows = @(Import-Csv -LiteralPath $unitSnapshotPath)
$therapyRows = @(
    if (Test-Path -LiteralPath $therapyPath) { Import-Csv -LiteralPath $therapyPath }
)
$therapyByUnitRows = @(
    if (Test-Path -LiteralPath $therapyByUnitPath) { Import-Csv -LiteralPath $therapyByUnitPath }
)
$priorityRows = @(
    if (Test-Path -LiteralPath $priorityPath) { Import-Csv -LiteralPath $priorityPath }
)
$patientInsightRows = @(
    if (Test-Path -LiteralPath $patientInsightsPath) { Import-Csv -LiteralPath $patientInsightsPath }
)
$shapRows = @(
    if (Test-Path -LiteralPath $shapExplanationsPath) { Import-Csv -LiteralPath $shapExplanationsPath }
)
$shapFeatureRows = @(
    if (Test-Path -LiteralPath $shapFeatureImportancePath) { Import-Csv -LiteralPath $shapFeatureImportancePath }
)
$handoffQueueRows = @(
    if (Test-Path -LiteralPath $handoffQueuePath) { Import-Csv -LiteralPath $handoffQueuePath }
)
$historyRows = @(
    if (Test-Path -LiteralPath $historyCsvPath) { Import-Csv -LiteralPath $historyCsvPath }
)

$therapyActive = $therapyRows.Count -gt 0
$priorityActive = $priorityRows.Count -gt 0
$patientInsightsActive = $patientInsightRows.Count -gt 0
$shapActive = $shapRows.Count -gt 0
$handoffQueueActive = $handoffQueueRows.Count -gt 0
$therapyParseMethods = @($therapyByUnitRows | Select-Object -ExpandProperty SourceParseMethod -Unique | Where-Object { $_ })
$therapyParseMethodText = if ($therapyParseMethods.Count -gt 0) { $therapyParseMethods -join ', ' } else { 'Not available' }

$previousHistoryRow = $null
if ($historyRows.Count -ge 2) {
    $previousHistoryRow = $historyRows[$historyRows.Count - 2]
}

$deltaResidents = $null
$deltaOutstandingDocs = $null
$deltaTherapyMinutes = $null
if ($null -ne $previousHistoryRow) {
    $deltaResidents = (Get-IntValue $metrics.currentResidents) - (Get-IntValue $previousHistoryRow.CurrentResidents)
    $deltaOutstandingDocs = (Get-IntValue $metrics.outstandingDocumentationItems) - (Get-IntValue $previousHistoryRow.OutstandingDocumentationItems)
    $deltaTherapyMinutes = (Get-IntValue $metrics.totalTherapyMinutes) - (Get-IntValue $previousHistoryRow.TotalTherapyMinutes)
}

function Get-DeltaText {
    param(
        [AllowNull()][int]$Value,
        [string]$Suffix
    )

    if ($null -eq $Value) { return 'First recorded snapshot' }
    if ($Value -eq 0) { return "No change $Suffix" }
    if ($Value -gt 0) { return "+$Value $Suffix" }
    return "$Value $Suffix"
}

$maxTherapyMinutesByUnit = 0
foreach ($row in $unitRows) {
    $value = Get-IntValue $row.TherapyMinutes
    if ($value -gt $maxTherapyMinutesByUnit) { $maxTherapyMinutesByUnit = $value }
}

$maxOutstandingDocsByUnit = 0
foreach ($row in $unitRows) {
    $value = Get-IntValue $row.OutstandingDocumentationItemCount
    if ($value -gt $maxOutstandingDocsByUnit) { $maxOutstandingDocsByUnit = $value }
}

$unitCards = foreach ($row in $unitRows) {
    $unitCode = Escape-Html $row.UnitCode
    $residents = Get-IntValue $row.CurrentResidentCount
    $outstanding = Get-IntValue $row.OutstandingDocumentationItemCount
    $dueSoon = Get-IntValue $row.DueTodayOrEarlierCount
    $therapyMinutes = Get-IntValue $row.TherapyMinutes
    $priorityMax = Get-IntValue $row.PriorityHighestScore
    $therapyWidth = Get-BarWidthPercent -Value $therapyMinutes -MaxValue $maxTherapyMinutesByUnit
    $docWidth = Get-BarWidthPercent -Value $outstanding -MaxValue $maxOutstandingDocsByUnit
@"
    <article class="unit-card">
      <div class="unit-head">
        <h3>Unit $unitCode</h3>
        <span class="pill">Priority Max $priorityMax</span>
      </div>
      <div class="unit-metrics">
        <div><span class="metric-label">Residents</span><strong>$residents</strong></div>
        <div><span class="metric-label">Outstanding Docs</span><strong>$outstanding</strong></div>
        <div><span class="metric-label">Due Today+</span><strong>$dueSoon</strong></div>
        <div><span class="metric-label">Therapy Minutes</span><strong>$therapyMinutes</strong></div>
      </div>
      <div class="bar-block">
        <div class="bar-label">Documentation Pressure</div>
        <div class="bar-track"><div class="bar-fill doc" style="width:$docWidth%"></div></div>
      </div>
      <div class="bar-block">
        <div class="bar-label">Therapy Workload</div>
        <div class="bar-track"><div class="bar-fill therapy" style="width:$therapyWidth%"></div></div>
      </div>
    </article>
"@
}

$docByDisciplineRows = @(
    $docRows |
        Group-Object DisciplineCode |
        Sort-Object Name |
        ForEach-Object {
            [pscustomobject]@{
                DisciplineCode = if ([string]::IsNullOrWhiteSpace($_.Name)) { 'Unknown' } else { $_.Name }
                DocumentationItems = $_.Count
                OutstandingItems = @($_.Group | Where-Object { $_.IsOutstanding -in @('True', 'true') }).Count
            }
        }
)

$therapyByDisciplineRows = @(
    $therapyRows |
        Group-Object DisciplineCode |
        Sort-Object Name |
        ForEach-Object {
            [pscustomobject]@{
                DisciplineCode = if ([string]::IsNullOrWhiteSpace($_.Name)) { 'Unknown' } else { $_.Name }
                TreatmentLines = $_.Count
                TotalMinutes = Get-IntValue (($_.Group | Measure-Object -Property Minutes -Sum).Sum)
            }
        }
)

$priorityTableRows = foreach ($row in @($priorityRows | Sort-Object @{ Expression = { Get-IntValue $_.PriorityScore } ; Descending = $true }, @{ Expression = { Get-IntValue $_.OutstandingDocCount } ; Descending = $true }, @{ Expression = { Get-IntValue $_.TherapyMinutes } ; Descending = $true } | Select-Object -First 12)) {
@"
      <tr>
        <td>$(Escape-Html $row.ResidentName)</td>
        <td>$(Escape-Html $row.UnitCode)</td>
        <td>$(Get-IntValue $row.TherapyLineCount)</td>
        <td>$(Get-IntValue $row.TherapyMinutes)</td>
        <td>$(Get-IntValue $row.OutstandingDocCount)</td>
        <td>$(Get-IntValue $row.OverdueDocCount)</td>
        <td><strong>$(Get-IntValue $row.PriorityScore)</strong></td>
      </tr>
"@
}

$prioritySection = if ($priorityActive) {
@"
  <section class="panel detail-section hidden-by-default" id="priority-panel" data-section="priority">
    <div class="section-head">
      <h2>Top Priority Residents</h2>
      <p>Highest combined therapy and documentation follow-up need in the current snapshot.</p>
    </div>
    <table>
      <thead>
        <tr>
          <th>Resident</th>
          <th>Unit</th>
          <th>Therapy Lines</th>
          <th>Therapy Minutes</th>
          <th>Outstanding Docs</th>
          <th>Overdue Docs</th>
          <th>Priority Score</th>
        </tr>
      </thead>
      <tbody>
$($priorityTableRows -join [Environment]::NewLine)
      </tbody>
    </table>
  </section>
"@
} else {
@"
  <section class="panel detail-section hidden-by-default" id="priority-panel" data-section="priority">
    <div class="section-head">
      <h2>Top Priority Residents</h2>
      <p>Priority data is not available for this snapshot.</p>
    </div>
  </section>
"@
}

$patientPriorityHigh = @($patientInsightRows | Where-Object { [string]$_.PriorityBand -eq 'High' }).Count
$patientOutstanding = @($patientInsightRows | Where-Object { (Get-IntValue $_.OutstandingDocCount) -gt 0 }).Count
$patientWithTherapy = @($patientInsightRows | Where-Object { [string]$_.HasTherapy -in @('True', 'true') }).Count
$patientAtRisk = @($patientInsightRows | Where-Object { [string]$_.ProgressLevel -eq 'At Risk' }).Count
$patientWithVitals = @($patientInsightRows | Where-Object { [string]$_.VitalsAvailable -in @('True', 'true') }).Count

$patientInsightTableRows = foreach ($row in @($patientInsightRows | Sort-Object @{ Expression = { Get-IntValue $_.PriorityScore }; Descending = $true }, @{ Expression = { Get-IntValue $_.OutstandingDocCount }; Descending = $true }, @{ Expression = { Get-IntValue $_.TherapyMinutes }; Descending = $true }, ResidentName)) {
    $searchable = (
        @(
            [string]$row.ResidentName,
            [string]$row.UnitCode,
            [string]$row.RoomCode,
            [string]$row.PrimaryTherapyClinician,
            [string]$row.DocumentationDisciplines,
            [string]$row.TherapyDisciplines,
            [string]$row.PriorityBand,
            [string]$row.ProgressLevel,
            [string]$row.VitalsSummary,
            [string]$row.ThingsToLookOutFor,
            [string]$row.CopilotAgentInsight,
            [string]$row.InsightSummary
        ) -join ' '
    ).ToLowerInvariant()
    $rowPriorityBand = ([string]$row.PriorityBand).Trim()
    $rowProgressLevel = ([string]$row.ProgressLevel).Trim()
    $rowOverdue = Get-IntValue $row.OverdueDocCount
    $rowOutstanding = Get-IntValue $row.OutstandingDocCount
    $rowHasVitals = if ([string]$row.VitalsAvailable -in @('True', 'true')) { 'true' } else { 'false' }

@"
      <tr data-search="$(Escape-Html $searchable)" data-priority-band="$(Escape-Html $rowPriorityBand)" data-progress-level="$(Escape-Html $rowProgressLevel)" data-overdue="$rowOverdue" data-outstanding="$rowOutstanding" data-has-vitals="$rowHasVitals">
        <td>$(Escape-Html $row.ResidentName)</td>
        <td>$(Escape-Html $row.UnitCode) / $(Escape-Html $row.RoomCode)</td>
        <td>$(Escape-Html $row.VitalsSummary)</td>
        <td>$(Get-IntValue $row.OutstandingDocCount) outstanding, $(Get-IntValue $row.OverdueDocCount) overdue</td>
        <td>$(Get-IntValue $row.TherapyMinutes) min across $(Get-IntValue $row.TherapyLineCount) lines</td>
        <td>$(Escape-Html $row.ProgressLevel)</td>
        <td>$(Escape-Html $row.ThingsToLookOutFor)</td>
        <td>$(Escape-Html $row.CopilotAgentInsight)</td>
      </tr>
"@
}

$patientInsightsSection = if ($patientInsightsActive) {
@"
  <section class="panel detail-section hidden-by-default" id="patient-insights-panel" data-section="patient">
    <div class="section-head">
      <h2>Patient Insights</h2>
      <p>Cross-source resident detail from current PCC census plus documentation and therapy activity.</p>
    </div>
    <div class="table-tools">
      <div class="table-meta">Residents: <strong id="patient-visible-count">$($patientInsightRows.Count)</strong> of $($patientInsightRows.Count) | High priority: $patientPriorityHigh | At risk: $patientAtRisk | With outstanding docs: $patientOutstanding | With therapy: $patientWithTherapy | With vitals: $patientWithVitals</div>
      <input id="patient-search" class="search-input" type="search" placeholder="Search resident, unit, clinician, discipline, summary..." aria-label="Search patient insights">
    </div>
    <div class="quick-filters">
      <button type="button" class="filter-chip active" data-filter="all">All</button>
      <button type="button" class="filter-chip" data-filter="at-risk">At Risk</button>
      <button type="button" class="filter-chip" data-filter="overdue">Overdue Docs</button>
      <button type="button" class="filter-chip" data-filter="high-priority">High Priority</button>
      <button type="button" class="filter-chip" data-filter="with-vitals">With Vitals</button>
      <button type="button" class="filter-chip" data-filter="missing-vitals">Missing Vitals</button>
    </div>
    <table id="patient-insights-table">
      <thead>
        <tr>
          <th>Resident</th>
          <th>Location</th>
          <th>Vitals</th>
          <th>Documentation</th>
          <th>Therapy</th>
          <th>Progress Level</th>
          <th>Things To Look Out For</th>
          <th>Copilot Agent Insight</th>
        </tr>
      </thead>
      <tbody>
$($patientInsightTableRows -join [Environment]::NewLine)
      </tbody>
    </table>
  </section>
"@
} else {
@"
  <section class="panel detail-section hidden-by-default" id="patient-insights-panel" data-section="patient">
    <div class="section-head">
      <h2>Patient Insights</h2>
      <p>Patient-level cross-source insights are not available for this snapshot.</p>
    </div>
  </section>
"@
}

$shapTableRows = foreach ($row in @($shapRows | Select-Object -First 20)) {
@"
      <tr>
        <td>$(Escape-Html $row.ResidentName)</td>
        <td>$(Escape-Html $row.UnitCode)</td>
        <td>$(Escape-Html $row.TopFeature1) ($(Escape-Html $row.TopFeature1Contribution))</td>
        <td>$(Escape-Html $row.TopFeature2) ($(Escape-Html $row.TopFeature2Contribution))</td>
        <td>$(Escape-Html $row.TopFeature3) ($(Escape-Html $row.TopFeature3Contribution))</td>
        <td>$(Escape-Html $row.PredictedPriorityScore)</td>
        <td>$(Escape-Html $row.ObservedPriorityScore)</td>
      </tr>
"@
}

$shapTopFeatureText = if ($shapFeatureRows.Count -gt 0) {
    $top = @($shapFeatureRows | Sort-Object { [double]$_.MeanAbsShap } -Descending | Select-Object -First 5)
    ($top | ForEach-Object { "{0} ({1})" -f [string]$_.FeatureName, [string]$_.MeanAbsShap }) -join ', '
} else {
    'Not available'
}

$shapSection = if ($shapActive) {
@"
  <section class="panel detail-section hidden-by-default" id="shap-panel" data-section="shap">
    <div class="section-head">
      <h2>XAI SHAP Explanations</h2>
      <p>Resident-level feature attribution for priority scoring using tree-based SHAP explanations. Top global features: $shapTopFeatureText</p>
    </div>
    <table>
      <thead>
        <tr>
          <th>Resident</th>
          <th>Unit</th>
          <th>Top Feature 1</th>
          <th>Top Feature 2</th>
          <th>Top Feature 3</th>
          <th>Predicted Priority</th>
          <th>Observed Priority</th>
        </tr>
      </thead>
      <tbody>
$($shapTableRows -join [Environment]::NewLine)
      </tbody>
    </table>
  </section>
"@
} else {
@"
  <section class="panel detail-section hidden-by-default" id="shap-panel" data-section="shap">
    <div class="section-head">
      <h2>XAI SHAP Explanations</h2>
      <p>SHAP explanations are not available for this snapshot.</p>
    </div>
  </section>
"@
}

$handoffHighCount = @($handoffQueueRows | Where-Object { [string]$_.Severity -eq 'High' }).Count
$handoffMediumCount = @($handoffQueueRows | Where-Object { [string]$_.Severity -eq 'Medium' }).Count
$handoffTableRows = foreach ($row in @($handoffQueueRows | Select-Object -First 20)) {
@"
      <tr>
        <td>$(Escape-Html $row.HandoffTicketId)</td>
        <td>$(Escape-Html $row.ResidentName)</td>
        <td>$(Escape-Html $row.UnitCode)</td>
        <td>$(Escape-Html $row.Severity)</td>
        <td>$(Escape-Html $row.ResponsibleParty)</td>
        <td>$(Escape-Html $row.HandoffChannel)</td>
        <td>$(Escape-Html $row.SlaTarget)</td>
        <td>$(Escape-Html $row.TriggerReason)</td>
        <td>$(Escape-Html $row.GroundednessStatus)</td>
        <td>$(Escape-Html $row.VerificationStatus)</td>
        <td>$(Escape-Html $row.UncertaintyReason)</td>
        <td>$(Escape-Html $row.Citations)</td>
      </tr>
"@
}

$automatedHandoffSection = if ($handoffQueueActive) {
@"
  <section class="panel detail-section hidden-by-default" id="handoff-panel" data-section="handoff">
    <div class="section-head">
      <h2>Automated Handoff Queue</h2>
      <p>System-generated handoff tickets routed to owners with SLA targets, plus evidence and verification guardrails. High: $handoffHighCount | Medium: $handoffMediumCount | Total: $($handoffQueueRows.Count)</p>
    </div>
    <table>
      <thead>
        <tr>
          <th>Ticket</th>
          <th>Resident</th>
          <th>Unit</th>
          <th>Severity</th>
          <th>Owner</th>
          <th>Channel</th>
          <th>SLA</th>
          <th>Trigger</th>
          <th>Groundedness</th>
          <th>Verification</th>
          <th>Uncertainty</th>
          <th>Citations</th>
        </tr>
      </thead>
      <tbody>
$($handoffTableRows -join [Environment]::NewLine)
      </tbody>
    </table>
  </section>
"@
} else {
@"
  <section class="panel detail-section hidden-by-default" id="handoff-panel" data-section="handoff">
    <div class="section-head">
      <h2>Automated Handoff Queue</h2>
      <p>No handoff tickets were generated for this snapshot.</p>
    </div>
  </section>
"@
}

$therapyByUnitTableRows = foreach ($row in $therapyByUnitRows) {
@"
      <tr>
        <td>$(Escape-Html $row.UnitCode)</td>
        <td>$(Get-IntValue $row.UniqueResidentsTreated)</td>
        <td>$(Get-IntValue $row.CurrentResidentTreatments)</td>
        <td>$(Get-IntValue $row.TotalTreatmentMinutes)</td>
        <td>$(Escape-Html $row.SourceParseMethod)</td>
      </tr>
"@
}

$therapySection = if ($therapyActive) {
@"
  <section class="panel">
    <div class="section-head">
      <h2>Therapy Workload</h2>
      <p>Current therapy workload from the landed Net Health Daily Treatment Summary source.</p>
    </div>
    <table>
      <thead>
        <tr>
          <th>Unit</th>
          <th>Residents Treated</th>
          <th>Treatment Lines</th>
          <th>Minutes</th>
          <th>Parse Method</th>
        </tr>
      </thead>
      <tbody>
$($therapyByUnitTableRows -join [Environment]::NewLine)
      </tbody>
    </table>
  </section>
"@
} else {
@"
  <section class="panel">
    <div class="section-head">
      <h2>Therapy Workload</h2>
      <p>Therapy data is not active in this snapshot.</p>
    </div>
  </section>
"@
}

$historySection = if ($historyRows.Count -gt 1) {
@"
  <section class="panel">
    <div class="section-head">
      <h2>Snapshot Change</h2>
      <p>Compared with the previous recorded operational snapshot.</p>
    </div>
    <div class="change-grid">
      <div class="change-card"><span class="metric-label">Residents</span><strong>$(Escape-Html (Get-DeltaText -Value $deltaResidents -Suffix 'vs prior'))</strong></div>
      <div class="change-card"><span class="metric-label">Outstanding Docs</span><strong>$(Escape-Html (Get-DeltaText -Value $deltaOutstandingDocs -Suffix 'vs prior'))</strong></div>
      <div class="change-card"><span class="metric-label">Therapy Minutes</span><strong>$(Escape-Html (Get-DeltaText -Value $deltaTherapyMinutes -Suffix 'vs prior'))</strong></div>
    </div>
  </section>
"@
} else {
@"
  <section class="panel">
    <div class="section-head">
      <h2>Snapshot Change</h2>
      <p>Only one recorded snapshot is available, so change tracking starts with this refresh.</p>
    </div>
  </section>
"@
}

$docDisciplineTableRows = foreach ($row in $docByDisciplineRows) {
@"
      <tr>
        <td>$(Escape-Html $row.DisciplineCode)</td>
        <td>$(Get-IntValue $row.DocumentationItems)</td>
        <td>$(Get-IntValue $row.OutstandingItems)</td>
      </tr>
"@
}

$docDisciplineSection = @"
  <section class="panel">
    <div class="section-head">
      <h2>Documentation by Discipline</h2>
      <p>Current documentation queue distribution by discipline.</p>
    </div>
    <table>
      <thead>
        <tr>
          <th>Discipline</th>
          <th>Items</th>
          <th>Outstanding</th>
        </tr>
      </thead>
      <tbody>
$($docDisciplineTableRows -join [Environment]::NewLine)
      </tbody>
    </table>
  </section>
"@

$therapyDisciplineSection = if ($therapyByDisciplineRows.Count -gt 0) {
    $therapyDisciplineTableRows = foreach ($row in $therapyByDisciplineRows) {
@"
      <tr>
        <td>$(Escape-Html $row.DisciplineCode)</td>
        <td>$(Get-IntValue $row.TreatmentLines)</td>
        <td>$(Get-IntValue $row.TotalMinutes)</td>
      </tr>
"@
    }
@"
  <section class="panel">
    <div class="section-head">
      <h2>Therapy by Discipline</h2>
      <p>Current therapy distribution by discipline.</p>
    </div>
    <table>
      <thead>
        <tr>
          <th>Discipline</th>
          <th>Treatment Lines</th>
          <th>Minutes</th>
        </tr>
      </thead>
      <tbody>
$($therapyDisciplineTableRows -join [Environment]::NewLine)
      </tbody>
    </table>
  </section>
"@
} else {
@"
  <section class="panel">
    <div class="section-head">
      <h2>Therapy by Discipline</h2>
      <p>Therapy data is not active in this snapshot.</p>
    </div>
  </section>
"@
}

$html = @"
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>SNF Executive Command Center</title>
  <style>
    :root {
      --bg: #eef4ff;
      --ink: #0f1f3a;
      --muted: #5f6f8f;
      --line: #d6deee;
      --panel: #ffffff;
      --deep: #1f3c88;
      --teal: #0fb9b1;
      --gold: #ffb84d;
      --rose: #ff6b81;
      --violet: #7c5cff;
      --shadow: 0 16px 36px rgba(30, 63, 130, 0.14);
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "Segoe UI", Tahoma, sans-serif;
      color: var(--ink);
      background:
        radial-gradient(circle at 12% 8%, rgba(124, 92, 255, 0.2), transparent 32%),
        radial-gradient(circle at 88% 6%, rgba(15, 185, 177, 0.18), transparent 30%),
        linear-gradient(180deg, #f6f9ff 0%, #eaf1ff 100%);
      padding: 28px;
    }
    .shell { max-width: 1380px; margin: 0 auto; }
    .hero, .panel {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 20px;
      box-shadow: var(--shadow);
    }
    .hero {
      padding: 28px;
      margin-bottom: 22px;
      background:
        linear-gradient(130deg, rgba(124, 92, 255, 0.12), rgba(15, 185, 177, 0.08)),
        var(--panel);
    }
    h1, h2, h3, p { margin: 0; }
    h1 { font-size: 34px; letter-spacing: -0.02em; }
    .hero-top {
      display: flex;
      justify-content: space-between;
      gap: 18px;
      align-items: start;
      margin-bottom: 18px;
    }
    .hero p { color: var(--muted); margin-top: 8px; max-width: 860px; line-height: 1.45; }
    .status-stack { display: grid; gap: 8px; min-width: 260px; }
    .status-card {
      border: 1px solid var(--line);
      border-radius: 14px;
      padding: 12px 14px;
      background: linear-gradient(180deg, #ffffff, #f7faff);
    }
    .status-card strong { display: block; font-size: 15px; margin-bottom: 4px; }
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(6, minmax(0, 1fr));
      gap: 14px;
      margin-top: 22px;
    }
    .kpi {
      border: 1px solid var(--line);
      border-radius: 16px;
      padding: 16px;
      background: linear-gradient(180deg, #ffffff, #f8fbff);
    }
    .label, .metric-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--muted);
    }
    .kpi .value {
      display: block;
      margin-top: 8px;
      font-size: 30px;
      font-weight: 700;
      color: var(--deep);
    }
    .kpi .sub {
      display: block;
      margin-top: 8px;
      font-size: 13px;
      color: var(--muted);
    }
    .panel { padding: 22px; margin-bottom: 20px; }
    .detail-section.compact-collapsed > :not(.section-head) { display: none; }
    .detail-section.compact-collapsed .section-head { margin-bottom: 0; }
    .choice-meta {
      margin-top: 14px;
      color: var(--muted);
      font-size: 13px;
    }
    .section-head {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      align-items: end;
      margin-bottom: 16px;
    }
    .section-head p { color: var(--muted); line-height: 1.4; max-width: 760px; }
    .unit-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px;
    }
    .unit-card {
      border: 1px solid var(--line);
      border-radius: 18px;
      padding: 18px;
      background: linear-gradient(180deg, rgba(255,255,255,0.92), rgba(249,246,239,0.92));
    }
    .unit-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      margin-bottom: 14px;
    }
    .pill {
      font-size: 12px;
      color: var(--deep);
      background: rgba(10, 107, 97, 0.10);
      border: 1px solid rgba(10, 107, 97, 0.20);
      padding: 6px 10px;
      border-radius: 999px;
    }
    .unit-metrics {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 12px;
      margin-bottom: 14px;
    }
    .unit-metrics strong {
      display: block;
      margin-top: 6px;
      font-size: 22px;
      color: var(--deep);
    }
    .bar-block { margin-top: 12px; }
    .bar-label {
      color: var(--muted);
      font-size: 13px;
      margin-bottom: 6px;
    }
    .bar-track {
      height: 10px;
      border-radius: 999px;
      background: #e7dfd3;
      overflow: hidden;
    }
    .bar-fill { height: 100%; border-radius: 999px; }
    .bar-fill.doc { background: linear-gradient(90deg, var(--gold), #e6b150); }
    .bar-fill.therapy { background: linear-gradient(90deg, var(--teal), #35a097); }
    table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid var(--line);
      border-radius: 16px;
      overflow: hidden;
      background: #fffdfa;
    }
    th, td {
      padding: 12px 14px;
      border-bottom: 1px solid var(--line);
      text-align: left;
      vertical-align: top;
    }
    th {
      background: #f4ede1;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--muted);
    }
    .change-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 14px;
    }
    .change-card {
      padding: 16px;
      border: 1px solid var(--line);
      border-radius: 16px;
      background: rgba(255,255,255,0.72);
    }
    .change-card strong {
      display: block;
      margin-top: 8px;
      font-size: 22px;
      color: var(--deep);
    }
    .table-tools {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 14px;
      margin-bottom: 12px;
      flex-wrap: wrap;
    }
    .table-meta {
      color: var(--muted);
      font-size: 13px;
      line-height: 1.4;
    }
    .launcher-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 10px;
      margin-top: 12px;
    }
    .launcher-btn {
      border: 1px solid #cdd8f0;
      border-radius: 12px;
      background: linear-gradient(135deg, #f7f6ff, #eef8ff);
      color: #1a2f66;
      text-align: left;
      font-size: 13px;
      font-weight: 600;
      padding: 11px 13px;
      cursor: pointer;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }
    .launcher-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 8px 18px rgba(28, 57, 120, 0.15);
      border-color: #aebff0;
    }
    .launcher-btn.active {
      background: linear-gradient(135deg, #2f57d6, #7c5cff);
      color: #ffffff;
      border-color: transparent;
    }
    .quick-filters {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 12px;
    }
    .filter-chip {
      border: 1px solid var(--line);
      border-radius: 999px;
      padding: 7px 12px;
      background: #fffdfa;
      color: var(--deep);
      font-size: 12px;
      cursor: pointer;
    }
    .filter-chip.active {
      background: rgba(10, 107, 97, 0.12);
      border-color: rgba(10, 107, 97, 0.35);
    }
    .search-input {
      min-width: 320px;
      border: 1px solid var(--line);
      border-radius: 12px;
      padding: 9px 12px;
      font-size: 14px;
      background: #fffdfa;
      color: var(--ink);
    }
    .search-input:focus {
      outline: 2px solid rgba(10, 107, 97, 0.28);
      outline-offset: 1px;
    }
    tr.row-muted {
      display: none;
    }
    @media (max-width: 1120px) {
      .kpi-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      .launcher-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .unit-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 760px) {
      body { padding: 16px; }
      .hero-top, .section-head { flex-direction: column; align-items: start; }
      .kpi-grid, .unit-metrics, .change-grid { grid-template-columns: 1fr 1fr; }
      .status-stack { min-width: 0; width: 100%; }
    }
    @media (max-width: 560px) {
      .kpi-grid, .unit-metrics, .change-grid, .launcher-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="shell">
    <section class="hero">
      <div class="hero-top">
        <div>
          <h1>SNF Executive Command Center</h1>
          <p>Current-state executive dashboard built from live PCC census, Net Health documentation, and landed therapy workload sources. This bundle is self-contained and reconciles to the processed operational outputs in the repo.</p>
        </div>
        <div class="status-stack">
          <div class="status-card">
            <strong>Generated</strong>
            <span>$(Escape-Html $summary.generatedAt)</span>
          </div>
          <div class="status-card">
            <strong>Therapy Source</strong>
            <span>$(if ($therapyActive) { "Active ($therapyParseMethodText)" } else { 'Not active' })</span>
          </div>
          <div class="status-card">
            <strong>Priority Queue</strong>
            <span>$(if ($priorityActive) { 'Active' } else { 'Not active' })</span>
          </div>
        </div>
      </div>
      <div class="kpi-grid">
        <div class="kpi"><span class="label">Current Residents</span><span class="value">$(Get-IntValue $metrics.currentResidents)</span><span class="sub">$(Get-DeltaText -Value $deltaResidents -Suffix 'vs prior')</span></div>
        <div class="kpi"><span class="label">Residents With Docs</span><span class="value">$(Get-IntValue $metrics.residentsWithDocumentationItems)</span><span class="sub">Current residents in documentation queue</span></div>
        <div class="kpi"><span class="label">Outstanding Docs</span><span class="value">$(Get-IntValue $metrics.outstandingDocumentationItems)</span><span class="sub">$(Get-DeltaText -Value $deltaOutstandingDocs -Suffix 'vs prior')</span></div>
        <div class="kpi"><span class="label">Overdue Docs</span><span class="value">$(Get-IntValue $metrics.overdueDocumentationItems)</span><span class="sub">Due date already passed</span></div>
        <div class="kpi"><span class="label">Residents With Therapy</span><span class="value">$(Get-IntValue $metrics.residentsWithTherapy)</span><span class="sub">Current resident treatment coverage</span></div>
        <div class="kpi"><span class="label">Therapy Minutes</span><span class="value">$(Get-IntValue $metrics.totalTherapyMinutes)</span><span class="sub">$(Get-DeltaText -Value $deltaTherapyMinutes -Suffix 'vs prior')</span></div>
      </div>
      <div class="launcher-grid">
        <button type="button" class="launcher-btn active" data-view-id="overview">Executive Overview</button>
        <button type="button" class="launcher-btn" data-view-id="priority">Top Priority Residents</button>
        <button type="button" class="launcher-btn" data-view-id="at-risk">At-Risk Residents</button>
        <button type="button" class="launcher-btn" data-view-id="missing-vitals">Missing Vitals</button>
        <button type="button" class="launcher-btn" data-view-id="handoff">Handoff Queue</button>
        <button type="button" class="launcher-btn" data-view-id="shap">XAI Drivers</button>
        <button type="button" class="launcher-btn" data-view-id="full">Show Full Detail</button>
        <button type="button" class="launcher-btn" data-view-id="reset">Reset View</button>
      </div>
      <div class="choice-meta">Choose a view to reveal only the section you want to present. This keeps the story concise when patient volume is high.</div>
    </section>

    <section class="panel" id="unit-ops-panel">
      <div class="section-head">
        <h2>Unit Operations</h2>
        <p>Resident census, documentation pressure, therapy workload, and maximum priority score by unit.</p>
      </div>
      <div class="unit-grid">
$($unitCards -join [Environment]::NewLine)
      </div>
    </section>

$therapySection

$prioritySection

$patientInsightsSection

$shapSection

$automatedHandoffSection

$docDisciplineSection

$therapyDisciplineSection

$historySection
  </div>
  <script>
    (function () {
      const searchInput = document.getElementById('patient-search');
      const table = document.getElementById('patient-insights-table');
      const visibleCount = document.getElementById('patient-visible-count');
      const chips = Array.from(document.querySelectorAll('.filter-chip'));
      const launcherButtons = Array.from(document.querySelectorAll('.launcher-btn'));
      const detailSections = Array.from(document.querySelectorAll('.detail-section'));
      if (!searchInput || !table || !visibleCount) { return; }

      const rows = Array.from(table.querySelectorAll('tbody tr'));
      let activeFilter = 'all';
      const setActiveButton = function (viewId) {
        for (const button of launcherButtons) {
          button.classList.toggle('active', String(button.getAttribute('data-view-id') || '') === viewId);
        }
      };
      const showSections = function (sectionIds) {
        for (const section of detailSections) {
          const shouldShow = sectionIds.indexOf(String(section.id || '')) >= 0;
          section.classList.toggle('compact-collapsed', !shouldShow);
        }
      };
      const selectChip = function (name) {
        activeFilter = name;
        for (const c of chips) { c.classList.remove('active'); }
        const match = chips.find(function (chip) {
          return String(chip.getAttribute('data-filter') || 'all') === name;
        });
        if (match) { match.classList.add('active'); }
      };
      const scrollToPanel = function (id) {
        const panel = document.getElementById(id);
        if (panel) {
          panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };
      const filterRows = function () {
        const query = (searchInput.value || '').trim().toLowerCase();
        let shown = 0;
        for (const row of rows) {
          const haystack = (row.getAttribute('data-search') || '').toLowerCase();
          const queryMatched = query.length === 0 || haystack.indexOf(query) >= 0;
          const overdue = Number(row.getAttribute('data-overdue') || '0');
          const priorityBand = String(row.getAttribute('data-priority-band') || '').toLowerCase();
          const progressLevel = String(row.getAttribute('data-progress-level') || '').toLowerCase();
          const hasVitals = String(row.getAttribute('data-has-vitals') || 'false') === 'true';
          let chipMatched = true;
          if (activeFilter === 'at-risk') {
            chipMatched = progressLevel === 'at risk';
          } else if (activeFilter === 'overdue') {
            chipMatched = overdue > 0;
          } else if (activeFilter === 'high-priority') {
            chipMatched = priorityBand === 'high';
          } else if (activeFilter === 'with-vitals') {
            chipMatched = hasVitals;
          } else if (activeFilter === 'missing-vitals') {
            chipMatched = !hasVitals;
          }
          const matched = queryMatched && chipMatched;
          if (matched) {
            row.classList.remove('row-muted');
            shown += 1;
          } else {
            row.classList.add('row-muted');
          }
        }
        visibleCount.textContent = String(shown);
      };

      searchInput.addEventListener('input', filterRows);
      for (const chip of chips) {
        chip.addEventListener('click', function () {
          selectChip(String(chip.getAttribute('data-filter') || 'all'));
          filterRows();
        });
      }
      for (const btn of launcherButtons) {
        btn.addEventListener('click', function () {
          const viewId = String(btn.getAttribute('data-view-id') || 'overview');
          setActiveButton(viewId);
          if (viewId === 'overview') {
            searchInput.value = '';
            selectChip('all');
            filterRows();
            showSections(['priority-panel']);
            scrollToPanel('priority-panel');
          } else if (viewId === 'priority') {
            searchInput.value = '';
            selectChip('high-priority');
            filterRows();
            showSections(['priority-panel', 'patient-insights-panel']);
            scrollToPanel('patient-insights-panel');
          } else if (viewId === 'at-risk') {
            searchInput.value = '';
            selectChip('at-risk');
            filterRows();
            showSections(['patient-insights-panel']);
            scrollToPanel('patient-insights-panel');
          } else if (viewId === 'missing-vitals') {
            searchInput.value = '';
            selectChip('missing-vitals');
            filterRows();
            showSections(['patient-insights-panel']);
            scrollToPanel('patient-insights-panel');
          } else if (viewId === 'shap') {
            showSections(['shap-panel']);
            scrollToPanel('shap-panel');
          } else if (viewId === 'handoff') {
            showSections(['handoff-panel']);
            scrollToPanel('handoff-panel');
          } else if (viewId === 'full') {
            searchInput.value = '';
            selectChip('all');
            filterRows();
            showSections(['priority-panel', 'patient-insights-panel', 'shap-panel', 'handoff-panel']);
            scrollToPanel('priority-panel');
          } else if (viewId === 'reset') {
            searchInput.value = '';
            selectChip('all');
            filterRows();
            showSections(['priority-panel']);
            scrollToPanel('patient-insights-panel');
          }
        });
      }
      showSections(['priority-panel']);
      filterRows();
    }());
  </script>
</body>
</html>
"@

$htmlPath = Join-Path $OutputRoot 'executive-command-center.html'
$html | Set-Content -LiteralPath $htmlPath -Encoding UTF8

$dashboardData = [pscustomobject]@{
    generatedAt = [string]$summary.generatedAt
    metrics = $metrics
    therapyActive = $therapyActive
    priorityActive = $priorityActive
    therapySourceParseMethods = @($therapyParseMethods)
    unitSnapshot = $unitRows
    topPriorityResidents = @($priorityRows | Sort-Object @{ Expression = { Get-IntValue $_.PriorityScore } ; Descending = $true } | Select-Object -First 12)
    patientInsights = $patientInsightRows
    shapExplanations = $shapRows
    shapFeatureImportance = $shapFeatureRows
    automatedHandoffQueue = $handoffQueueRows
    documentationByDiscipline = $docByDisciplineRows
    therapyByDiscipline = $therapyByDisciplineRows
    recentHistory = $historyRows
}

$dashboardDataPath = Join-Path $OutputRoot 'executive-command-center.data.json'
$dashboardData | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $dashboardDataPath -Encoding UTF8

$manifest = [pscustomobject]@{
    GeneratedAt               = (Get-Date).ToString('s')
    OutputRoot                = $OutputRoot
    CensusRows                = $censusRows.Count
    DocumentationRows         = $docRows.Count
    DocumentationByUnitRows   = $docByUnitRows.Count
    UnitRows                  = $unitRows.Count
    TherapyRows               = $therapyRows.Count
    TherapyByUnitRows         = $therapyByUnitRows.Count
    PriorityRows              = $priorityRows.Count
    PatientInsightRows        = $patientInsightRows.Count
    ShapExplanationRows       = $shapRows.Count
    ShapFeatureRows           = $shapFeatureRows.Count
    AutomatedHandoffRows      = $handoffQueueRows.Count
    ResidentsWithTherapy      = Get-IntValue $metrics.residentsWithTherapy
    ResidentsInPriorityQueue  = Get-IntValue $metrics.residentsInPriorityQueue
    TherapyMinutes            = Get-IntValue $metrics.totalTherapyMinutes
    HtmlReportPath            = $htmlPath
    DashboardDataPath         = $dashboardDataPath
    IncludedFiles             = @($filesToCopy | ForEach-Object { [System.IO.Path]::GetFileName($_) })
}

$manifest | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath (Join-Path $OutputRoot 'report-bundle-manifest.json') -Encoding UTF8
Write-Host "Executive report bundle written to: $OutputRoot"

param(
    [string]$ProcessedRoot = 'D:\SNF AI Dashboard\data\processed',
    [string]$ThresholdsPath = 'D:\SNF AI Dashboard\contracts\command-center-data-drift-thresholds.json',
    [string]$OutputPath = 'D:\SNF AI Dashboard\data\processed\command_center_data_drift_report.md'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Get-IntValue {
    param($Value)
    $parsed = 0
    if ([int]::TryParse([string]$Value, [ref]$parsed)) { return $parsed }
    return 0
}

function Get-PercentChange {
    param(
        [int]$Current,
        [int]$Previous
    )
    if ($Previous -eq 0) {
        if ($Current -eq 0) { return 0.0 }
        return 100.0
    }
    return [math]::Round((([double]$Current - [double]$Previous) / [double]$Previous) * 100.0, 2)
}

function Get-NullRatePercent {
    param(
        [object[]]$Rows,
        [string]$Column
    )
    if ($Rows.Count -eq 0) { return 0.0 }
    $nullCount = @($Rows | Where-Object { [string]::IsNullOrWhiteSpace([string]$_.$Column) }).Count
    return [math]::Round(($nullCount / [double]$Rows.Count) * 100.0, 2)
}

if (-not (Test-Path -LiteralPath $ThresholdsPath)) {
    throw "Data drift thresholds file not found: $ThresholdsPath"
}

$thresholds = Get-Content -LiteralPath $ThresholdsPath -Raw | ConvertFrom-Json
$summaryPath = Join-Path $ProcessedRoot 'command_center_operational_summary.json'
$historyPath = Join-Path $ProcessedRoot 'command_center_operational_history.csv'
if (-not (Test-Path -LiteralPath $summaryPath)) {
    throw "Operational summary JSON not found: $summaryPath"
}
if (-not (Test-Path -LiteralPath $historyPath)) {
    throw "Operational history CSV not found: $historyPath"
}

$summary = Get-Content -LiteralPath $summaryPath -Raw | ConvertFrom-Json
$historyRows = @(Import-Csv -LiteralPath $historyPath)
if ($historyRows.Count -lt 2) {
    $reportLines = @(
        '# Command Center Data Drift Report',
        '',
        ('Generated: {0}' -f (Get-Date).ToString('yyyy-MM-dd HH:mm:ss')),
        '',
        '- [WARN] Not enough history rows for drift comparison. At least 2 snapshots are required.'
    )
    $reportLines -join [Environment]::NewLine | Set-Content -LiteralPath $OutputPath -Encoding UTF8
    Write-Host "Data drift report written to: $OutputPath"
    return
}

$current = $summary.metrics
$previous = $historyRows[$historyRows.Count - 2]

$changeChecks = @(
    @{ Name = 'currentResidents'; Current = (Get-IntValue $current.currentResidents); Previous = (Get-IntValue $previous.CurrentResidents); Max = (Get-IntValue $thresholds.percentChangeMax.currentResidents) },
    @{ Name = 'outstandingDocumentationItems'; Current = (Get-IntValue $current.outstandingDocumentationItems); Previous = (Get-IntValue $previous.OutstandingDocumentationItems); Max = (Get-IntValue $thresholds.percentChangeMax.outstandingDocumentationItems) },
    @{ Name = 'overdueDocumentationItems'; Current = (Get-IntValue $current.overdueDocumentationItems); Previous = (Get-IntValue $previous.OverdueDocumentationItems); Max = (Get-IntValue $thresholds.percentChangeMax.overdueDocumentationItems) },
    @{ Name = 'totalTherapyMinutes'; Current = (Get-IntValue $current.totalTherapyMinutes); Previous = (Get-IntValue $previous.TotalTherapyMinutes); Max = (Get-IntValue $thresholds.percentChangeMax.totalTherapyMinutes) }
)

$results = New-Object System.Collections.Generic.List[object]
foreach ($check in $changeChecks) {
    $pct = Get-PercentChange -Current $check.Current -Previous $check.Previous
    $status = if ([math]::Abs($pct) -le $check.Max) { 'PASS' } else { 'WARN' }
    $results.Add([pscustomobject]@{
        Type = 'PercentChange'
        Name = $check.Name
        Status = $status
        Details = ('Current={0}, Previous={1}, Change={2}%, Max={3}%' -f $check.Current, $check.Previous, $pct, $check.Max)
    }) | Out-Null
}

$nullRateConfig = $thresholds.nullRateMaxPercent
foreach ($fileProperty in $nullRateConfig.PSObject.Properties.Name) {
    $filePath = Join-Path $ProcessedRoot $fileProperty
    if (-not (Test-Path -LiteralPath $filePath)) { continue }
    $rows = @(Import-Csv -LiteralPath $filePath)
    foreach ($columnProperty in $nullRateConfig.$fileProperty.PSObject.Properties.Name) {
        $maxNullRate = [double]$nullRateConfig.$fileProperty.$columnProperty
        $nullRate = Get-NullRatePercent -Rows $rows -Column $columnProperty
        $status = if ($nullRate -le $maxNullRate) { 'PASS' } else { 'WARN' }
        $results.Add([pscustomobject]@{
            Type = 'NullRate'
            Name = ('{0}.{1}' -f $fileProperty, $columnProperty)
            Status = $status
            Details = ('NullRate={0}%, Max={1}%, Rows={2}' -f $nullRate, $maxNullRate, $rows.Count)
        }) | Out-Null
    }
}

$report = @()
$report += '# Command Center Data Drift Report'
$report += ''
$report += ('Generated: {0}' -f (Get-Date).ToString('yyyy-MM-dd HH:mm:ss'))
$report += ('Thresholds: {0}' -f $ThresholdsPath)
$report += ('SnapshotDateKey: {0}' -f [string]$summary.snapshotDateKey)
$report += ''
foreach ($r in $results) {
    $report += ('- [{0}] {1} ({2}): {3}' -f $r.Status, $r.Type, $r.Name, $r.Details)
}

$outputDir = Split-Path -Parent $OutputPath
if ($outputDir -and -not (Test-Path -LiteralPath $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
}
$report -join [Environment]::NewLine | Set-Content -LiteralPath $OutputPath -Encoding UTF8
Write-Host "Data drift report written to: $OutputPath"

$warnCount = @($results | Where-Object { $_.Status -eq 'WARN' }).Count
if ($warnCount -gt 0) {
    throw "Data drift checks exceeded threshold on $warnCount check(s). See: $OutputPath"
}

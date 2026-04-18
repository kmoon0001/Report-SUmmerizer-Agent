param(
    [Parameter(Mandatory = $true)]
    [string]$Path
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath $Path)) {
    throw "Normalized file not found: $Path"
}

$rows = Import-Csv -LiteralPath $Path
if (-not $rows -or $rows.Count -eq 0) {
    throw "Normalized file has no rows: $Path"
}

$requiredColumns = @('SourceFileName','LoadBatchId','SnapshotDateTime','SnapshotDateKey','FacilityName','ResidentSourceId','ResidentDisplayName','TherapyCaseSourceId','DisciplineCode','TherapyCaseStatus','CaseStartDate','CaseStartDateKey','ClinicianName','IsOpenCase','TreatmentDate','TreatmentDateKey','TreatmentReceived','Minutes','WingCode')
$actualColumns = @($rows[0].PSObject.Properties.Name)
$missingColumns = @($requiredColumns | Where-Object { $_ -notin $actualColumns })
if ($missingColumns.Count -gt 0) {
    throw "Normalized file is missing required columns: $($missingColumns -join ', ')"
}

$summary = [pscustomobject]@{
    FilePath               = $Path
    RowCount               = $rows.Count
    MissingRequiredColumns = $missingColumns.Count
    MissingResidentIds     = @($rows | Where-Object { [string]::IsNullOrWhiteSpace($_.ResidentSourceId) }).Count
    MissingResidentNames   = @($rows | Where-Object { [string]::IsNullOrWhiteSpace($_.ResidentDisplayName) }).Count
    MissingTherapyCaseIds  = @($rows | Where-Object { [string]::IsNullOrWhiteSpace($_.TherapyCaseSourceId) }).Count
    UnknownDisciplineCount = @($rows | Where-Object { $_.DisciplineCode -eq 'Unknown' }).Count
    MissingCaseStartDates  = @($rows | Where-Object { [string]::IsNullOrWhiteSpace($_.CaseStartDate) }).Count
    MissingTreatmentDates  = @($rows | Where-Object { [string]::IsNullOrWhiteSpace($_.TreatmentDate) }).Count
    MissingMinutes         = @($rows | Where-Object { [string]::IsNullOrWhiteSpace($_.Minutes) }).Count
}

$summary | ConvertTo-Json -Depth 4

if ($summary.MissingRequiredColumns -gt 0 -or $summary.MissingResidentIds -gt 0 -or $summary.MissingResidentNames -gt 0 -or $summary.MissingTherapyCaseIds -gt 0) {
    exit 1
}

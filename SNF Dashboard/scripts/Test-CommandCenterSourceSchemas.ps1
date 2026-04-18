param(
    [string]$ProcessedRoot = 'D:\my agents copilot studio\SNF Dashboard\data\processed',
    [switch]$RequireTherapy = $false,
    [switch]$RequirePriority = $false
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Get-CsvHeader {
    param([string]$Path)
    $row = Import-Csv -LiteralPath $Path | Select-Object -First 1
    if ($null -eq $row) { throw "CSV has no rows: $Path" }
    return @($row.PSObject.Properties.Name)
}

function Assert-Columns {
    param(
        [string]$Path,
        [string[]]$RequiredColumns
    )

    if (-not (Test-Path -LiteralPath $Path)) {
        throw "Required file missing: $Path"
    }

    $header = Get-CsvHeader -Path $Path
    $missing = @($RequiredColumns | Where-Object { $_ -notin $header })
    if ($missing.Count -gt 0) {
        throw "Schema mismatch for $Path. Missing columns: $($missing -join ', ')"
    }
}

$pccPath = Join-Path $ProcessedRoot 'pcc_resident_list_current.active-only.csv'
$docPath = Join-Path $ProcessedRoot 'command_center_documentation_queue.csv'
$therapyPath = Join-Path $ProcessedRoot 'command_center_therapy_coverage.csv'
$priorityPath = Join-Path $ProcessedRoot 'command_center_therapy_documentation_priority.csv'
$vitalsPath = Join-Path $ProcessedRoot 'pcc_resident_vitals_current.csv'

Assert-Columns -Path $pccPath -RequiredColumns @(
    'SnapshotDateKey','ResidentSourceId','ResidentName','UnitCode','RoomCode','AdmissionDate','IsCurrentResident'
)

Assert-Columns -Path $docPath -RequiredColumns @(
    'SnapshotDateKey','ResidentSourceId','ResidentName','UnitCode','DisciplineCode','DueDate','DocumentationStatus','IsOutstanding'
)

if (Test-Path -LiteralPath $therapyPath) {
    Assert-Columns -Path $therapyPath -RequiredColumns @(
        'SnapshotDateKey','ResidentSourceId','ResidentName','UnitCode','DisciplineCode','TreatmentDate','Minutes','ClinicianName'
    )
}
elseif ($RequireTherapy) {
    throw "Therapy schema check requested but file not found: $therapyPath"
}

if (Test-Path -LiteralPath $priorityPath) {
    Assert-Columns -Path $priorityPath -RequiredColumns @(
        'SnapshotDateKey','ResidentSourceId','ResidentName','UnitCode','TherapyLineCount','TherapyMinutes','OutstandingDocCount','OverdueDocCount','PriorityScore'
    )
}
elseif ($RequirePriority) {
    throw "Priority schema check requested but file not found: $priorityPath"
}

if (Test-Path -LiteralPath $vitalsPath) {
    Assert-Columns -Path $vitalsPath -RequiredColumns @(
        'SnapshotDateKey','ResidentSourceId','ResidentName','UnitCode','ObservedAt','HeartRate','SystolicBP','DiastolicBP','RespiratoryRate','TemperatureF','SpO2Percent','WeightLbs','PainScore','ResidentMatchMethod'
    )
}

Write-Host 'Command center source schema validation passed.'
Write-Host "Processed root: $ProcessedRoot"


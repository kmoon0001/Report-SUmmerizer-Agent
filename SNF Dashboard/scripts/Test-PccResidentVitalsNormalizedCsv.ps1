param(
    [string]$Path = 'D:\my agents copilot studio\SNF Dashboard\data\processed\pcc_resident_vitals_current.csv'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath $Path)) {
    throw "Vitals normalized CSV not found: $Path"
}

$rows = @(Import-Csv -LiteralPath $Path)
if ($rows.Count -eq 0) {
    throw "Vitals normalized CSV has no rows: $Path"
}

$requiredColumns = @(
    'SnapshotDateKey',
    'ResidentSourceId',
    'ResidentName',
    'UnitCode',
    'ObservedAt',
    'HeartRate',
    'SystolicBP',
    'DiastolicBP',
    'RespiratoryRate',
    'TemperatureF',
    'SpO2Percent',
    'WeightLbs',
    'PainScore',
    'ResidentMatchMethod'
)

$first = $rows[0]
$missingColumns = @($requiredColumns | Where-Object { $first.PSObject.Properties.Name -notcontains $_ })
if ($missingColumns.Count -gt 0) {
    throw "Vitals normalized CSV is missing required columns: $($missingColumns -join ', ')"
}

$missingResidentId = @($rows | Where-Object { [string]::IsNullOrWhiteSpace([string]$_.ResidentSourceId) }).Count
$missingResidentName = @($rows | Where-Object { [string]::IsNullOrWhiteSpace([string]$_.ResidentName) }).Count

$duplicateResidentIds = @(
    $rows |
        Group-Object ResidentSourceId |
        Where-Object { -not [string]::IsNullOrWhiteSpace([string]$_.Name) -and $_.Count -gt 1 }
).Count

$invalidSnapshotDate = @(
    $rows |
        Where-Object {
            $v = [string]$_.SnapshotDateKey
            if ($v -notmatch '^\d{8}$') { return $true }
            try { [void][datetime]::ParseExact($v, 'yyyyMMdd', $null); return $false } catch { return $true }
        }
).Count

$summary = [pscustomobject]@{
    FilePath                = $Path
    RowCount                = $rows.Count
    MissingRequiredColumns  = $missingColumns.Count
    MissingResidentIds      = $missingResidentId
    MissingResidentNames    = $missingResidentName
    DuplicateResidentIds    = $duplicateResidentIds
    InvalidSnapshotDateKey  = $invalidSnapshotDate
}

if ($summary.MissingResidentIds -gt 0 -or $summary.MissingResidentNames -gt 0 -or $summary.DuplicateResidentIds -gt 0 -or $summary.InvalidSnapshotDateKey -gt 0) {
    throw ($summary | ConvertTo-Json -Depth 3)
}

$summary | ConvertTo-Json -Depth 3 | Write-Output


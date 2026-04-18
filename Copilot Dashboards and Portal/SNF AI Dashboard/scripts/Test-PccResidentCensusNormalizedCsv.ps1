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

$requiredColumns = @(
    'SourceFileName',
    'LoadBatchId',
    'SnapshotDateTime',
    'SnapshotDateKey',
    'FacilityName',
    'ResidentDisplayName',
    'ResidentName',
    'ResidentSourceId',
    'AgeYears',
    'LocationRaw',
    'FloorCode',
    'UnitCode',
    'RoomCode',
    'BedCode',
    'AdmissionDate',
    'AdmissionDateKey',
    'StatusRaw',
    'ResidentStatusNormalized',
    'IsCurrentResident'
)

$actualColumns = @($rows[0].PSObject.Properties.Name)
$missingColumns = @($requiredColumns | Where-Object { $_ -notin $actualColumns })
if ($missingColumns.Count -gt 0) {
    throw "Normalized file is missing required columns: $($missingColumns -join ', ')"
}

$invalidStatuses = @($rows | Where-Object { $_.ResidentStatusNormalized -notin @('Active', 'Discharged', 'Unknown', 'Other') })
$missingResidentIds = @($rows | Where-Object { [string]::IsNullOrWhiteSpace($_.ResidentSourceId) })
$missingResidentNames = @($rows | Where-Object { [string]::IsNullOrWhiteSpace($_.ResidentName) })
$invalidCurrentFlags = @($rows | Where-Object { $_.IsCurrentResident -notin @('True', 'False', 'true', 'false') })
$activeWithoutLocation = @($rows | Where-Object { $_.ResidentStatusNormalized -eq 'Active' -and [string]::IsNullOrWhiteSpace($_.LocationRaw) })
$activeWithoutAdmissionDate = @($rows | Where-Object { $_.ResidentStatusNormalized -eq 'Active' -and [string]::IsNullOrWhiteSpace($_.AdmissionDate) })

$summary = [pscustomobject]@{
    FilePath                   = $Path
    RowCount                   = $rows.Count
    MissingRequiredColumns     = $missingColumns.Count
    InvalidStatuses            = $invalidStatuses.Count
    MissingResidentIds         = $missingResidentIds.Count
    MissingResidentNames       = $missingResidentNames.Count
    InvalidCurrentFlags        = $invalidCurrentFlags.Count
    ActiveWithoutLocation      = $activeWithoutLocation.Count
    ActiveWithoutAdmissionDate = $activeWithoutAdmissionDate.Count
}

$summary | ConvertTo-Json -Depth 4

if (
    $missingColumns.Count -gt 0 -or
    $invalidStatuses.Count -gt 0 -or
    $missingResidentIds.Count -gt 0 -or
    $missingResidentNames.Count -gt 0 -or
    $invalidCurrentFlags.Count -gt 0
) {
    exit 1
}

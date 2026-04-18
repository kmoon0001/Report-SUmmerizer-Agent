param(
    [Parameter(Mandatory = $true)]
    [string]$InputPath,

    [string]$OutputPath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\pcc_resident_list_current.normalized.csv',

    [string]$FacilityName = 'Sea Cliff Healthcare Center',

    [datetime]$SnapshotDateTime = (Get-Date)
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath $InputPath)) {
    throw "Input file not found: $InputPath"
}

$rows = Import-Csv -LiteralPath $InputPath
if (-not $rows -or $rows.Count -eq 0) {
    throw "Input file has no data rows: $InputPath"
}

$actualColumns = @($rows[0].PSObject.Properties.Name)
$isStructuredPccCsv =
    ('Resident Last Name' -in $actualColumns) -and
    ('Resident First Name' -in $actualColumns) -and
    ('Resident Id' -in $actualColumns) -and
    ('Location Floor' -in $actualColumns) -and
    ('Location Unit' -in $actualColumns) -and
    ('Location Room' -in $actualColumns) -and
    ('Location Bed' -in $actualColumns)

$isHtmlDerivedShape =
    ('Name' -in $actualColumns) -and
    ('Age' -in $actualColumns) -and
    ('Location (Fl Un Rm Bd)' -in $actualColumns) -and
    ('Admission Date' -in $actualColumns) -and
    ('Status' -in $actualColumns)

if (-not $isStructuredPccCsv -and -not $isHtmlDerivedShape) {
    throw "Input file does not match a supported PCC resident list shape."
}

$snapshotDateKey = [int]($SnapshotDateTime.ToString('yyyyMMdd'))
$loadBatchId = [guid]::NewGuid().Guid
$sourceFileName = Split-Path -Leaf $InputPath

$normalized = foreach ($row in $rows) {
    if ($isStructuredPccCsv) {
        $lastName = ([string]$row.'Resident Last Name').Trim()
        $firstName = ([string]$row.'Resident First Name').Trim()
        $residentSourceId = ([string]$row.'Resident Id').Trim()
        $residentDisplayName = if ($lastName -and $firstName) { "$lastName, $firstName ($residentSourceId)" } elseif ($lastName) { "$lastName ($residentSourceId)" } else { $residentSourceId }
        $residentName = if ($lastName -and $firstName) { "$lastName, $firstName" } elseif ($lastName) { $lastName } else { $residentDisplayName }
    } else {
        $residentDisplayName = [string]$row.Name
        $residentName = $residentDisplayName.Trim()
        $residentSourceId = $null

        $match = [regex]::Match($residentDisplayName, '^(.*)\(([^()]*)\)\s*$')
        if ($match.Success) {
            $residentName = $match.Groups[1].Value.Trim()
            $residentSourceId = $match.Groups[2].Value.Trim()
        }
    }

    $ageYears = $null
    if (-not [string]::IsNullOrWhiteSpace([string]$row.Age)) {
        $parsedAge = 0
        if ([int]::TryParse(([string]$row.Age).Trim(), [ref]$parsedAge)) {
            $ageYears = $parsedAge
        }
    }

    $floorCode = $null
    $unitCode = $null
    $roomCode = $null
    $bedCode = $null
    $locationRaw = $null

    if ($isStructuredPccCsv) {
        $floorCode = ([string]$row.'Location Floor').Trim()
        $unitCode = ([string]$row.'Location Unit').Trim()
        $roomCode = ([string]$row.'Location Room').Trim()
        $bedCode = ([string]$row.'Location Bed').Trim()
        $locationParts = @($floorCode, $unitCode, $roomCode, $bedCode) | Where-Object { -not [string]::IsNullOrWhiteSpace($_) }
        $locationRaw = ($locationParts -join ' ').Trim()
    } else {
        $locationRaw = ([string]$row.'Location (Fl Un Rm Bd)').Trim()
        if (-not [string]::IsNullOrWhiteSpace($locationRaw)) {
            $tokens = @($locationRaw -split '\s+' | Where-Object { $_ })
            if ($tokens.Count -ge 1) { $floorCode = $tokens[0] }
            if ($tokens.Count -ge 2) { $unitCode = $tokens[1] }
            if ($tokens.Count -ge 3) { $roomCode = $tokens[2] }
            if ($tokens.Count -ge 4) { $bedCode = $tokens[3] }
        }
    }

    $admissionDate = $null
    $admissionDateKey = $null
    $admissionText = ([string]$row.'Admission Date').Trim()
    if (-not [string]::IsNullOrWhiteSpace($admissionText)) {
        $parsedDate = [datetime]::MinValue
        if ([datetime]::TryParse($admissionText, [ref]$parsedDate)) {
            $admissionDate = $parsedDate.ToString('yyyy-MM-dd')
            $admissionDateKey = [int]$parsedDate.ToString('yyyyMMdd')
        }
    }

    $statusRaw = ([string]$row.Status).Trim()
    $residentStatusNormalized = switch -Regex ($statusRaw) {
        '^Active$' { 'Active'; break }
        '^Discharge$' { 'Discharged'; break }
        '^\s*$' { 'Unknown'; break }
        default { 'Other' }
    }

    [pscustomobject]@{
        SourceFileName            = $sourceFileName
        LoadBatchId               = $loadBatchId
        SnapshotDateTime          = $SnapshotDateTime.ToString('s')
        SnapshotDateKey           = $snapshotDateKey
        FacilityName              = $FacilityName
        ResidentDisplayName       = $residentDisplayName
        ResidentName              = $residentName
        ResidentSourceId          = $residentSourceId
        AgeYears                  = $ageYears
        LocationRaw               = $locationRaw
        FloorCode                 = $floorCode
        UnitCode                  = $unitCode
        RoomCode                  = $roomCode
        BedCode                   = $bedCode
        AdmissionDate             = $admissionDate
        AdmissionDateKey          = $admissionDateKey
        StatusRaw                 = $statusRaw
        ResidentStatusNormalized  = $residentStatusNormalized
        IsCurrentResident         = ($residentStatusNormalized -eq 'Active')
    }
}

$outputDirectory = Split-Path -Parent $OutputPath
if (-not [string]::IsNullOrWhiteSpace($outputDirectory) -and -not (Test-Path -LiteralPath $outputDirectory)) {
    New-Item -ItemType Directory -Path $outputDirectory -Force | Out-Null
}

$normalized | Export-Csv -LiteralPath $OutputPath -NoTypeInformation -Encoding UTF8

Write-Host "Normalized PCC resident list written to: $OutputPath"
Write-Host "Rows: $($normalized.Count)"


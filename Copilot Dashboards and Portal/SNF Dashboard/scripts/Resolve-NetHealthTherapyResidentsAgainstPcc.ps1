param(
    [string]$TherapyPath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\nethealth_therapy_census.normalized.csv',
    [string]$PccCensusPath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\pcc_resident_list_current.active-only.csv',
    [string]$OutputPath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\nethealth_therapy_census.resolved.csv'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath $TherapyPath)) { throw "Therapy file not found: $TherapyPath" }
if (-not (Test-Path -LiteralPath $PccCensusPath)) { throw "PCC census file not found: $PccCensusPath" }

function New-NameMatchKey {
    param(
        [AllowNull()]
        [string]$Value
    )

    if ([string]::IsNullOrWhiteSpace($Value)) { return $null }
    $parts = $Value.Split(',', 2)
    $last = ($parts[0] -replace '[^A-Za-z0-9 ]', '').Trim().ToUpperInvariant()
    $firstPart = if ($parts.Count -gt 1) { $parts[1].Trim() } else { '' }
    $firstToken = (($firstPart -split '\s+')[0] -replace '[^A-Za-z0-9]', '').Trim().ToUpperInvariant()
    if (-not $last -or -not $firstToken) { return $null }
    return ('{0}|{1}' -f ($last -replace '\s+', ''), $firstToken)
}

function New-AltNameMatchKey {
    param(
        [AllowNull()]
        [string]$Value
    )

    $primary = New-NameMatchKey -Value $Value
    if (-not $primary) { return $null }
    $parts = $primary.Split('|', 2)
    $last = $parts[0] -replace '(JR|SR|II|III|IV|V)$', ''
    if (-not $last) { return $primary }
    return ('{0}|{1}' -f $last, $parts[1])
}

$therapyRows = Import-Csv -LiteralPath $TherapyPath
$pccRows = Import-Csv -LiteralPath $PccCensusPath

if (-not $therapyRows -or $therapyRows.Count -eq 0) { throw "Therapy file has no rows: $TherapyPath" }
if (-not $pccRows -or $pccRows.Count -eq 0) { throw "PCC census file has no rows: $PccCensusPath" }

$pccByPrimary = @{}
$pccByAlt = @{}
foreach ($row in $pccRows) {
    $primaryKey = New-NameMatchKey -Value $row.ResidentName
    if ($primaryKey) {
        if (-not $pccByPrimary.ContainsKey($primaryKey)) { $pccByPrimary[$primaryKey] = @() }
        $pccByPrimary[$primaryKey] += $row
    }

    $altKey = New-AltNameMatchKey -Value $row.ResidentName
    if ($altKey) {
        if (-not $pccByAlt.ContainsKey($altKey)) { $pccByAlt[$altKey] = @() }
        $pccByAlt[$altKey] += $row
    }
}

$resolvedRows = foreach ($row in $therapyRows) {
    $displayName = if ($row.PSObject.Properties.Name -contains 'ResidentDisplayName') { [string]$row.ResidentDisplayName } else { [string]$row.ResidentSourceId }
    $primaryKey = New-NameMatchKey -Value $displayName
    $altKey = New-AltNameMatchKey -Value $displayName
    $matchMethod = 'Unresolved'
    $match = $null

    if ($primaryKey -and $pccByPrimary.ContainsKey($primaryKey) -and $pccByPrimary[$primaryKey].Count -eq 1) {
        $matchMethod = 'PrimaryNameKey'
        $match = $pccByPrimary[$primaryKey][0]
    }
    elseif ($altKey -and $pccByAlt.ContainsKey($altKey) -and $pccByAlt[$altKey].Count -eq 1) {
        $matchMethod = 'AlternateNameKey'
        $match = $pccByAlt[$altKey][0]
    }

    [pscustomobject]@{
        SourceFileName        = [string]$row.SourceFileName
        SourceFormat          = if ($row.PSObject.Properties.Name -contains 'SourceFormat') { [string]$row.SourceFormat } else { 'Unknown' }
        SourceParseMethod     = if ($row.PSObject.Properties.Name -contains 'SourceParseMethod') { [string]$row.SourceParseMethod } else { 'Unknown' }
        LoadBatchId           = [string]$row.LoadBatchId
        SnapshotDateTime      = [string]$row.SnapshotDateTime
        SnapshotDateKey       = [string]$row.SnapshotDateKey
        FacilityName          = [string]$row.FacilityName
        ResidentSourceId      = if ($match) { [string]$match.ResidentSourceId } else { [string]$row.ResidentSourceId }
        ResidentDisplayName   = $displayName
        ResidentName          = if ($match) { [string]$match.ResidentName } else { $displayName }
        ResidentMatchMethod   = $matchMethod
        IsCurrentPccResident  = if ($match) { 'True' } else { 'False' }
        FloorCode             = if ($match) { [string]$match.FloorCode } else { $null }
        UnitCode              = if ($match) { [string]$match.UnitCode } else { $null }
        RoomCode              = if ($match) { [string]$match.RoomCode } else { $null }
        BedCode               = if ($match) { [string]$match.BedCode } else { $null }
        TherapyCaseSourceId   = [string]$row.TherapyCaseSourceId
        DisciplineCode        = [string]$row.DisciplineCode
        TherapyCaseStatus     = [string]$row.TherapyCaseStatus
        CaseStartDate         = [string]$row.CaseStartDate
        CaseStartDateKey      = [string]$row.CaseStartDateKey
        CaseEndDate           = [string]$row.CaseEndDate
        CaseEndDateKey        = [string]$row.CaseEndDateKey
        ClinicianName         = [string]$row.ClinicianName
        IsOpenCase            = [string]$row.IsOpenCase
        TreatmentDate         = [string]$row.TreatmentDate
        TreatmentDateKey      = [string]$row.TreatmentDateKey
        TreatmentReceived     = [string]$row.TreatmentReceived
        ServiceCode           = [string]$row.ServiceCode
        Minutes               = [string]$row.Minutes
        WingCode              = [string]$row.WingCode
        ResponseToTreatment   = [string]$row.ResponseToTreatment
        DisciplineSourceValue = [string]$row.DisciplineSourceValue
    }
}

$outputDirectory = Split-Path -Parent $OutputPath
if ($outputDirectory -and -not (Test-Path -LiteralPath $outputDirectory)) {
    New-Item -ItemType Directory -Path $outputDirectory -Force | Out-Null
}

$resolvedRows | Export-Csv -LiteralPath $OutputPath -NoTypeInformation -Encoding UTF8
Write-Host "Resolved Net Health therapy file written to: $OutputPath"
Write-Host "Rows: $($resolvedRows.Count)"


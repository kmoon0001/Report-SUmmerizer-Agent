param(
    [string]$DocumentationPath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\nethealth_documentation_due_dates.normalized.csv',
    [string]$PccCensusPath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\pcc_resident_list_current.active-only.csv',
    [string]$OutputPath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\nethealth_documentation_due_dates.resolved.csv'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath $DocumentationPath)) { throw "Documentation file not found: $DocumentationPath" }
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

$documentationRows = Import-Csv -LiteralPath $DocumentationPath
$pccRows = Import-Csv -LiteralPath $PccCensusPath

if (-not $documentationRows -or $documentationRows.Count -eq 0) { throw "Documentation file has no rows: $DocumentationPath" }
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

$resolvedRows = foreach ($row in $documentationRows) {
    $displayName = if ($row.PSObject.Properties.Name -contains 'ResidentDisplayName') { [string]$row.ResidentDisplayName } else { $null }
    if ([string]::IsNullOrWhiteSpace($displayName)) { $displayName = [string]$row.ResidentSourceId }

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

    $resolvedResidentSourceId = if ($match) { [string]$match.ResidentSourceId } else { [string]$row.ResidentSourceId }
    $resolvedResidentName = if ($match) { [string]$match.ResidentName } else { $displayName }
    $resolvedUnitCode = if ($match) { [string]$match.UnitCode } else { $null }
    $resolvedFloorCode = if ($match) { [string]$match.FloorCode } else { $null }
    $resolvedRoomCode = if ($match) { [string]$match.RoomCode } else { $null }
    $resolvedBedCode = if ($match) { [string]$match.BedCode } else { $null }
    $currentResident = if ($match) { 'True' } else { 'False' }

    [pscustomobject]@{
        SourceFileName           = [string]$row.SourceFileName
        LoadBatchId              = [string]$row.LoadBatchId
        SnapshotDateTime         = [string]$row.SnapshotDateTime
        SnapshotDateKey          = [string]$row.SnapshotDateKey
        FacilityName             = [string]$row.FacilityName
        ResidentSourceId         = $resolvedResidentSourceId
        ResidentDisplayName      = $displayName
        ResidentName             = $resolvedResidentName
        ResidentMatchMethod      = $matchMethod
        IsCurrentPccResident     = $currentResident
        FloorCode                = $resolvedFloorCode
        UnitCode                 = $resolvedUnitCode
        RoomCode                 = $resolvedRoomCode
        BedCode                  = $resolvedBedCode
        TherapyCaseSourceId      = [string]$row.TherapyCaseSourceId
        ClinicianSourceId        = [string]$row.ClinicianSourceId
        ClinicianName            = [string]$row.ClinicianName
        DisciplineCode           = [string]$row.DisciplineCode
        DocumentTypeName         = [string]$row.DocumentTypeName
        DueDate                  = [string]$row.DueDate
        DueDateKey               = [string]$row.DueDateKey
        CompletedDate            = [string]$row.CompletedDate
        CompletedDateKey         = [string]$row.CompletedDateKey
        DocumentationStatus      = [string]$row.DocumentationStatus
        IsOutstanding            = [string]$row.IsOutstanding
    }
}

$outputDirectory = Split-Path -Parent $OutputPath
if ($outputDirectory -and -not (Test-Path -LiteralPath $outputDirectory)) {
    New-Item -ItemType Directory -Path $outputDirectory -Force | Out-Null
}

$resolvedRows | Export-Csv -LiteralPath $OutputPath -NoTypeInformation -Encoding UTF8
Write-Host "Resolved Net Health documentation file written to: $OutputPath"
Write-Host "Rows: $($resolvedRows.Count)"


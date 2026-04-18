param(
    [string]$ResolvedTherapyPath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\nethealth_therapy_census.resolved.csv',
    [string]$OutputPath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\command_center_therapy_coverage.csv',
    [string]$UnitSummaryPath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\command_center_therapy_coverage.by-unit.csv'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath $ResolvedTherapyPath)) {
    throw "Resolved therapy file not found: $ResolvedTherapyPath"
}

$rows = Import-Csv -LiteralPath $ResolvedTherapyPath
if (-not $rows -or $rows.Count -eq 0) {
    throw "Resolved therapy file has no rows: $ResolvedTherapyPath"
}

$detailRows = @($rows |
    Where-Object { $_.IsCurrentPccResident -in @('True','true') } |
    Sort-Object UnitCode, ResidentName, TreatmentDate, ClinicianName |
    ForEach-Object {
        [pscustomobject]@{
            SnapshotDateKey     = [string]$_.SnapshotDateKey
            ResidentSourceId    = [string]$_.ResidentSourceId
            ResidentName        = [string]$_.ResidentName
            UnitCode            = [string]$_.UnitCode
            SourceFormat        = if ($_.PSObject.Properties.Name -contains 'SourceFormat') { [string]$_.SourceFormat } else { 'Unknown' }
            SourceParseMethod   = if ($_.PSObject.Properties.Name -contains 'SourceParseMethod') { [string]$_.SourceParseMethod } else { 'Unknown' }
            DisciplineCode      = [string]$_.DisciplineCode
            TreatmentDate       = [string]$_.TreatmentDate
            TreatmentReceived   = [string]$_.TreatmentReceived
            Minutes             = [string]$_.Minutes
            ClinicianName       = [string]$_.ClinicianName
            WingCode            = [string]$_.WingCode
            ResidentMatchMethod = [string]$_.ResidentMatchMethod
        }
    })

$today = (Get-Date).Date
$unitSummaryRows = @($detailRows |
    Group-Object UnitCode |
    Sort-Object Name |
    ForEach-Object {
        $groupRows = @($_.Group)
        $minuteTotal = 0
        foreach ($minuteRow in @($groupRows | Where-Object { $_.Minutes })) {
            $minuteValue = 0
            if ([int]::TryParse([string]$minuteRow.Minutes, [ref]$minuteValue)) {
                $minuteTotal += $minuteValue
            }
        }

        [pscustomobject]@{
            UnitCode                  = $_.Name
            SourceParseMethod         = @($groupRows | Select-Object -ExpandProperty SourceParseMethod -Unique) -join ';'
            CurrentResidentTreatments = $groupRows.Count
            UniqueResidentsTreated    = @($groupRows | Select-Object -ExpandProperty ResidentSourceId -Unique).Count
            TotalTreatmentMinutes     = $minuteTotal
            UniqueClinicians          = @($groupRows | Select-Object -ExpandProperty ClinicianName -Unique).Count
            TreatmentsTodayOrEarlier  = @($groupRows | Where-Object { $_.TreatmentDate -and ([datetime]$_.TreatmentDate -le $today) }).Count
        }
    })

$detailDirectory = Split-Path -Parent $OutputPath
if ($detailDirectory -and -not (Test-Path -LiteralPath $detailDirectory)) {
    New-Item -ItemType Directory -Path $detailDirectory -Force | Out-Null
}

$summaryDirectory = Split-Path -Parent $UnitSummaryPath
if ($summaryDirectory -and -not (Test-Path -LiteralPath $summaryDirectory)) {
    New-Item -ItemType Directory -Path $summaryDirectory -Force | Out-Null
}

$detailRows | Export-Csv -LiteralPath $OutputPath -NoTypeInformation -Encoding UTF8
$unitSummaryRows | Export-Csv -LiteralPath $UnitSummaryPath -NoTypeInformation -Encoding UTF8

Write-Host "Command center therapy coverage written to: $OutputPath"
Write-Host "Unit summary written to: $UnitSummaryPath"
Write-Host "Coverage rows: $($detailRows.Count)"


param(
    [string]$InputPath = 'D:\my agents copilot studio\SNF Dashboard\data\incoming\pcc_resident_vitals.csv',
    [string]$PccActiveCensusPath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\pcc_resident_list_current.active-only.csv',
    [string]$OutputPath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\pcc_resident_vitals_current.csv',
    [string]$QualityReportPath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\pcc_resident_vitals_current.quality-report.md'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Get-Text {
    param(
        [psobject]$Row,
        [string[]]$Names
    )

    foreach ($name in $Names) {
        if ($Row.PSObject.Properties.Name -contains $name) {
            $value = ([string]$Row.$name).Trim()
            if ($value) { return $value }
        }
    }

    return ''
}

function Get-ParsedDateText {
    param([string]$Value)
    if ([string]::IsNullOrWhiteSpace($Value)) { return '' }
    try {
        return ([datetime]$Value).ToString('s')
    }
    catch {
        return ''
    }
}

function Get-NameKey {
    param([string]$Value)
    if ([string]::IsNullOrWhiteSpace($Value)) { return '' }
    return (($Value -replace '[^A-Za-z0-9]', '').ToUpperInvariant())
}

if (-not (Test-Path -LiteralPath $InputPath)) {
    throw "Vitals input file not found: $InputPath"
}
if (-not (Test-Path -LiteralPath $PccActiveCensusPath)) {
    throw "PCC active census file not found: $PccActiveCensusPath"
}

$censusRows = @(Import-Csv -LiteralPath $PccActiveCensusPath)
$inputRows = @(Import-Csv -LiteralPath $InputPath)
if ($inputRows.Count -eq 0) {
    throw "Vitals input CSV has no rows: $InputPath"
}

$censusByResidentId = @{}
$censusByNameKey = @{}
foreach ($row in $censusRows) {
    $residentId = ([string]$row.ResidentSourceId).Trim()
    if ($residentId -and -not $censusByResidentId.ContainsKey($residentId)) {
        $censusByResidentId[$residentId] = $row
    }

    $nameKey = Get-NameKey ([string]$row.ResidentName)
    if ($nameKey -and -not $censusByNameKey.ContainsKey($nameKey)) {
        $censusByNameKey[$nameKey] = $row
    }
}

$normalizedRows = foreach ($row in $inputRows) {
    $rawResidentId = Get-Text -Row $row -Names @('ResidentSourceId','ResidentId','PatientId','MRN')
    $rawResidentName = Get-Text -Row $row -Names @('ResidentName','PatientName','Name')
    $observedAt = Get-ParsedDateText (Get-Text -Row $row -Names @('ObservedAt','ObservationDateTime','RecordedAt','TakenAt','ObservationDate'))

    $match = $null
    $matchMethod = 'NoMatch'
    if ($rawResidentId -and $censusByResidentId.ContainsKey($rawResidentId)) {
        $match = $censusByResidentId[$rawResidentId]
        $matchMethod = 'ResidentSourceId'
    }
    elseif ($rawResidentName) {
        $nameKey = Get-NameKey $rawResidentName
        if ($nameKey -and $censusByNameKey.ContainsKey($nameKey)) {
            $match = $censusByNameKey[$nameKey]
            $matchMethod = 'ResidentNameKey'
        }
    }

    if ($null -eq $match) { continue }

    [pscustomobject]@{
        SnapshotDateKey     = [string]$match.SnapshotDateKey
        ResidentSourceId    = [string]$match.ResidentSourceId
        ResidentName        = [string]$match.ResidentName
        UnitCode            = [string]$match.UnitCode
        RoomCode            = [string]$match.RoomCode
        ObservedAt          = $observedAt
        HeartRate           = Get-Text -Row $row -Names @('HeartRate','Pulse')
        SystolicBP          = Get-Text -Row $row -Names @('SystolicBP','BloodPressureSystolic')
        DiastolicBP         = Get-Text -Row $row -Names @('DiastolicBP','BloodPressureDiastolic')
        RespiratoryRate     = Get-Text -Row $row -Names @('RespiratoryRate','RespRate')
        TemperatureF        = Get-Text -Row $row -Names @('TemperatureF','Temperature')
        SpO2Percent         = Get-Text -Row $row -Names @('SpO2Percent','SpO2','OxygenSaturation')
        WeightLbs           = Get-Text -Row $row -Names @('WeightLbs','Weight')
        PainScore           = Get-Text -Row $row -Names @('PainScore','Pain')
        ResidentMatchMethod = $matchMethod
        SourceFileName      = [System.IO.Path]::GetFileName($InputPath)
    }
}

$latestByResident = @(
    $normalizedRows |
        Group-Object ResidentSourceId |
        ForEach-Object {
            $_.Group |
                Sort-Object @{
                    Expression = {
                        try { [datetime]$_.ObservedAt } catch { [datetime]'1900-01-01' }
                    }
                    Descending = $true
                } |
                Select-Object -First 1
        } |
        Sort-Object ResidentName
)

$outputDir = Split-Path -Parent $OutputPath
if ($outputDir -and -not (Test-Path -LiteralPath $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
}
$latestByResident | Export-Csv -LiteralPath $OutputPath -NoTypeInformation -Encoding UTF8

$qualityLines = @()
$qualityLines += '# PCC Resident Vitals Quality Report'
$qualityLines += ''
$qualityLines += ('Generated: {0}' -f (Get-Date).ToString('yyyy-MM-dd HH:mm:ss'))
$qualityLines += ('Input file: {0}' -f $InputPath)
$qualityLines += ('Output file: {0}' -f $OutputPath)
$qualityLines += ''
$qualityLines += ('- Input rows: {0}' -f $inputRows.Count)
$qualityLines += ('- Current residents with vitals: {0}' -f $latestByResident.Count)
$qualityLines += ('- Unmatched input rows: {0}' -f ($inputRows.Count - $normalizedRows.Count))
$qualityLines += ('- Rows with missing ObservedAt: {0}' -f (@($latestByResident | Where-Object { [string]::IsNullOrWhiteSpace([string]$_.ObservedAt) }).Count))
$qualityLines += ('- Rows with missing HeartRate: {0}' -f (@($latestByResident | Where-Object { [string]::IsNullOrWhiteSpace([string]$_.HeartRate) }).Count))
$qualityLines += ('- Rows with missing SpO2Percent: {0}' -f (@($latestByResident | Where-Object { [string]::IsNullOrWhiteSpace([string]$_.SpO2Percent) }).Count))

$reportDir = Split-Path -Parent $QualityReportPath
if ($reportDir -and -not (Test-Path -LiteralPath $reportDir)) {
    New-Item -ItemType Directory -Path $reportDir -Force | Out-Null
}
$qualityLines -join [Environment]::NewLine | Set-Content -LiteralPath $QualityReportPath -Encoding UTF8

Write-Host "Normalized PCC resident vitals written to: $OutputPath"
Write-Host "Rows: $($latestByResident.Count)"
Write-Host "Quality report written to: $QualityReportPath"


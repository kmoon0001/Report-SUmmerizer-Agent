param(
    [Parameter(Mandatory = $true)]
    [string]$InputPath,
    [string]$OutputPath = 'D:\SNF AI Dashboard\data\processed\nethealth_therapy_census.normalized.csv',
    [string]$FacilityName = 'Sea Cliff Healthcare Center',
    [datetime]$SnapshotDateTime = (Get-Date),
    [string]$PatientNameColumn = 'Patient',
    [string]$DateOfServiceColumn = 'Date Of Service',
    [string]$TreatmentReceivedColumn = 'Treatment Received',
    [string]$ServiceCodeColumn = 'Service Code',
    [string]$DisciplineColumn = 'Discipline',
    [string]$MinutesColumn = 'Minutes',
    [string]$ClinicianColumn = 'Physician',
    [string]$WingColumn = 'Wing',
    [string]$ResponseToTreatmentColumn = 'Response To Treatment'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath $InputPath)) { throw "Input file not found: $InputPath" }
$actualInputPath = $InputPath
$tempExtractedCsv = 'D:\SNF AI Dashboard\tmp\nethealth_therapy_census.extracted.csv'
$sourceFormat = 'DelimitedText'
$sourceParseMethod = 'NativeCsv'

$fileStream = [System.IO.File]::OpenRead($InputPath)
try {
    $buffer = New-Object byte[] 5
    $bytesRead = $fileStream.Read($buffer, 0, $buffer.Length)
}
finally {
    $fileStream.Dispose()
}

$headerText = [System.Text.Encoding]::ASCII.GetString($buffer, 0, $bytesRead)
if ($headerText -eq '%PDF-') {
    & 'D:\SNF AI Dashboard\scripts\Convert-NetHealthTherapyPdfToCsv.ps1' -InputPath $InputPath -OutputPath $tempExtractedCsv
    $actualInputPath = $tempExtractedCsv
    $sourceFormat = 'PDF'
    $sourceParseMethod = 'PdfFallback'
}

function Convert-ReportStyleDailyTreatmentSummaryCsv {
    param(
        [string]$Path
    )

    $lines = Get-Content -LiteralPath $Path
    if ($lines.Count -lt 3) {
        throw "Daily Treatment Summary CSV is too short to parse: $Path"
    }

    $headerIndex = 1
    $header = $lines[$headerIndex]
    $dataLines = $lines[($headerIndex + 1)..($lines.Count - 1)]
    $csvBody = @($header) + @($dataLines) -join [Environment]::NewLine
    $parsedRows = ConvertFrom-Csv -InputObject $csvBody

    $flattenedRows = [System.Collections.Generic.List[object]]::new()
    $currentPatient = $null

    foreach ($parsedRow in $parsedRows) {
        $treatmentReceived = ([string]$parsedRow.'Treatment Received').Trim()
        $serviceCode = ([string]$parsedRow.'Service Code').Trim()
        $discipline = ([string]$parsedRow.'Discipline').Trim()
        $minutes = ([string]$parsedRow.'Minutes').Trim()
        $physician = ([string]$parsedRow.'Physician').Trim()
        $wing = ([string]$parsedRow.'Wing').Trim()
        $responseToTreatment = ([string]$parsedRow.'Response To Treatment').Trim()

        if ($treatmentReceived -eq 'Patient:') {
            $currentPatient = $serviceCode
            continue
        }

        if (-not $currentPatient) {
            continue
        }

        if (-not $treatmentReceived -or -not $minutes) {
            continue
        }

        $flattenedRows.Add([pscustomobject]@{
            Patient               = $currentPatient
            'Date Of Service'     = $SnapshotDateTime.ToString('yyyy-MM-dd')
            'Treatment Received'  = $treatmentReceived
            'Service Code'        = $serviceCode
            Discipline            = $discipline
            Minutes               = $minutes
            Physician             = $physician
            Wing                  = $wing
            'Response To Treatment' = $responseToTreatment
        }) | Out-Null
    }

    return @($flattenedRows)
}

$firstTwoLines = Get-Content -LiteralPath $actualInputPath -TotalCount 2
if ($firstTwoLines.Count -ge 2 -and $firstTwoLines[0].Trim() -eq 'Daily Treatment Summary' -and $firstTwoLines[1] -match '^Treatment Received,Service Code,Discipline,Minutes,Physician,Wing,Response To Treatment$') {
    $rows = @(Convert-ReportStyleDailyTreatmentSummaryCsv -Path $actualInputPath)
    $sourceParseMethod = 'ReportStyleDailyTreatmentSummaryCsv'
} else {
    $rows = Import-Csv -LiteralPath $actualInputPath
}
if (-not $rows -or $rows.Count -eq 0) { throw "Input file has no data rows: $InputPath" }

$actualColumns = @($rows[0].PSObject.Properties.Name)
$requiredColumns = @($PatientNameColumn, $DateOfServiceColumn, $TreatmentReceivedColumn, $MinutesColumn, $ClinicianColumn, $WingColumn)
$missingColumns = @($requiredColumns | Where-Object { $_ -notin $actualColumns })
if ($missingColumns.Count -gt 0) { throw "Input file is missing required columns: $($missingColumns -join ', ')" }

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

function Get-DisciplineCode {
    param(
        [AllowNull()]
        [string]$SourceValue,
        [AllowNull()]
        [string]$TreatmentCodes
    )

    $discipline = ([string]$SourceValue).Trim()
    if ($discipline -and $discipline -ne '-') {
        $mappedDiscipline = switch -Regex ($discipline) {
            '^(PT|Physical Therapy)$' { 'PT'; break }
            '^(OT|Occupational Therapy)$' { 'OT'; break }
            '^(ST|Speech Therapy|SLP)$' { 'ST'; break }
            '^(Nursing)$' { 'Nursing'; break }
            default { $discipline }
        }
        return $mappedDiscipline
    }

    $codes = @(([string]$TreatmentCodes).Split(',') | ForEach-Object { $_.Trim() } | Where-Object { $_ })
    if ($codes.Count -eq 0) { return 'Unknown' }
    if (@($codes | Where-Object { $_ -match '^925' }).Count -gt 0) { return 'ST' }
    if (@($codes | Where-Object { $_ -match '^(97165|97166|97167|97168|97535|97542)' }).Count -gt 0) { return 'OT' }
    if (@($codes | Where-Object { $_ -match '^(97161|97162|97163|97164|97110|97112|97116|97530)' }).Count -gt 0) { return 'PT' }
    return 'Unknown'
}

function New-DeterministicCaseId {
    param(
        [string]$Seed
    )

    $sha = [System.Security.Cryptography.SHA256]::Create()
    try {
        $bytes = [System.Text.Encoding]::UTF8.GetBytes($Seed)
        $hash = $sha.ComputeHash($bytes)
        return -join ($hash | ForEach-Object { $_.ToString('x2') })
    }
    finally {
        $sha.Dispose()
    }
}

$snapshotDateKey = [int]($SnapshotDateTime.ToString('yyyyMMdd'))
$loadBatchId = [guid]::NewGuid().Guid
$sourceFileName = Split-Path -Leaf $InputPath

$normalized = foreach ($row in $rows) {
    $residentDisplayName = ([string]$row.$PatientNameColumn).Trim()
    $treatmentReceived = ([string]$row.$TreatmentReceivedColumn).Trim()
    $serviceCode = if ($ServiceCodeColumn -in $actualColumns) { ([string]$row.$ServiceCodeColumn).Trim() } else { $null }
    $minutesText = ([string]$row.$MinutesColumn).Trim()
    $clinicianName = ([string]$row.$ClinicianColumn).Trim()
    $wing = ([string]$row.$WingColumn).Trim()
    $responseToTreatment = if ($ResponseToTreatmentColumn -in $actualColumns) { ([string]$row.$ResponseToTreatmentColumn).Trim() } else { $null }
    $disciplineSource = if ($DisciplineColumn -in $actualColumns) { ([string]$row.$DisciplineColumn).Trim() } else { $null }

    $disciplineCode = Get-DisciplineCode -SourceValue $disciplineSource -TreatmentCodes $treatmentReceived
    $therapyCaseStatus = 'Active'

    $startDate = $null
    $startDateKey = $null
    $startText = ([string]$row.$DateOfServiceColumn).Trim()
    if ($startText) {
        $parsed = [datetime]::MinValue
        if ([datetime]::TryParse($startText, [ref]$parsed)) {
            $startDate = $parsed.ToString('yyyy-MM-dd')
            $startDateKey = [int]$parsed.ToString('yyyyMMdd')
        }
    }

    $minutesValue = $null
    if ($minutesText) {
        $minutesParsed = 0
        if ([int]::TryParse($minutesText, [ref]$minutesParsed)) {
            $minutesValue = $minutesParsed
        }
    }

    $residentNameKey = New-NameMatchKey -Value $residentDisplayName
    $caseSeed = '{0}|{1}|{2}|{3}|{4}|{5}' -f $residentDisplayName, $startDate, $disciplineCode, $minutesText, $clinicianName, $treatmentReceived
    $therapyCaseSourceId = New-DeterministicCaseId -Seed $caseSeed

    [pscustomobject]@{
        SourceFileName        = $sourceFileName
        SourceFormat          = $sourceFormat
        SourceParseMethod     = $sourceParseMethod
        LoadBatchId           = $loadBatchId
        SnapshotDateTime      = $SnapshotDateTime.ToString('s')
        SnapshotDateKey       = $snapshotDateKey
        FacilityName          = $FacilityName
        ResidentSourceId      = $residentDisplayName
        ResidentDisplayName   = $residentDisplayName
        ResidentNameKey       = $residentNameKey
        TherapyCaseSourceId   = $therapyCaseSourceId
        DisciplineCode        = $disciplineCode
        TherapyCaseStatus     = $therapyCaseStatus
        CaseStartDate         = $startDate
        CaseStartDateKey      = $startDateKey
        CaseEndDate           = $null
        CaseEndDateKey        = $null
        ClinicianName         = $clinicianName
        IsOpenCase            = $true
        TreatmentDate         = $startDate
        TreatmentDateKey      = $startDateKey
        TreatmentReceived     = $treatmentReceived
        ServiceCode           = $serviceCode
        Minutes               = $minutesValue
        WingCode              = $wing
        ResponseToTreatment   = $responseToTreatment
        DisciplineSourceValue = $disciplineSource
    }
}

$outputDirectory = Split-Path -Parent $OutputPath
if ($outputDirectory -and -not (Test-Path -LiteralPath $outputDirectory)) { New-Item -ItemType Directory -Path $outputDirectory -Force | Out-Null }
$normalized | Export-Csv -LiteralPath $OutputPath -NoTypeInformation -Encoding UTF8
Write-Host "Normalized Net Health therapy census written to: $OutputPath"
Write-Host "Rows: $($normalized.Count)"

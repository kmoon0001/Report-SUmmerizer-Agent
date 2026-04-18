param(
    [Parameter(Mandatory = $true)]
    [string]$InputPath,
    [string]$OutputPath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\nethealth_documentation_due_dates.normalized.csv',
    [string]$FacilityName = 'Sea Cliff Healthcare Center',
    [datetime]$SnapshotDateTime = (Get-Date),
    [string]$PatientIdColumn = 'Patient ID',
    [string]$PatientNameColumn = 'Patient',
    [string]$CaseIdColumn = 'Case ID',
    [string]$ClinicianIdColumn = 'Clinician ID',
    [string]$ClinicianNameColumn = 'Author',
    [string]$DisciplineColumn = 'Disc.',
    [string]$DocumentTypeColumn = 'Document Type',
    [string]$DueDateColumn = 'Due Date',
    [string]$CompletionDateColumn = 'Completion Date',
    [string]$StatusColumn = 'Next Action'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath $InputPath)) { throw "Input file not found: $InputPath" }
$rows = Import-Csv -LiteralPath $InputPath
if (-not $rows -or $rows.Count -eq 0) { throw "Input file has no data rows: $InputPath" }

$actualColumns = @($rows[0].PSObject.Properties.Name)
$requiredColumns = @($DocumentTypeColumn, $DueDateColumn, $StatusColumn)
$missingColumns = @($requiredColumns | Where-Object { $_ -notin $actualColumns })
if ($missingColumns.Count -gt 0) { throw "Input file is missing required columns: $($missingColumns -join ', ')" }

if (($PatientIdColumn -notin $actualColumns) -and ($PatientNameColumn -notin $actualColumns)) {
    throw "Input file is missing both patient identifier columns: $PatientIdColumn, $PatientNameColumn"
}

if (($ClinicianIdColumn -notin $actualColumns) -and ($ClinicianNameColumn -notin $actualColumns)) {
    throw "Input file is missing both clinician identifier columns: $ClinicianIdColumn, $ClinicianNameColumn"
}

function New-MatchKey {
    param(
        [AllowNull()]
        [string]$Value
    )

    if ([string]::IsNullOrWhiteSpace($Value)) { return $null }
    $normalized = $Value.ToUpperInvariant()
    $normalized = [regex]::Replace($normalized, '[^A-Z0-9]+', '')
    if ([string]::IsNullOrWhiteSpace($normalized)) { return $null }
    return $normalized
}

$snapshotDateKey = [int]($SnapshotDateTime.ToString('yyyyMMdd'))
$loadBatchId = [guid]::NewGuid().Guid
$sourceFileName = Split-Path -Leaf $InputPath

$normalized = foreach ($row in $rows) {
    $patientId = if ($PatientIdColumn -in $actualColumns) { ([string]$row.$PatientIdColumn).Trim() } else { '' }
    $patientName = if ($PatientNameColumn -in $actualColumns) { ([string]$row.$PatientNameColumn).Trim() } else { '' }
    $residentSourceId = if ($patientId) { $patientId } else { New-MatchKey -Value $patientName }

    $clinicianId = if ($ClinicianIdColumn -in $actualColumns) { ([string]$row.$ClinicianIdColumn).Trim() } else { '' }
    $clinicianName = if ($ClinicianNameColumn -in $actualColumns) { ([string]$row.$ClinicianNameColumn).Trim() } else { $null }
    $clinicianSourceId = if ($clinicianId) { $clinicianId } else { New-MatchKey -Value $clinicianName }

    $discipline = if ($DisciplineColumn -in $actualColumns) { ([string]$row.$DisciplineColumn).Trim() } else { '' }
    $disciplineCode = switch -Regex ($discipline) {
        '^(PT|Physical Therapy)$' { 'PT'; break }
        '^(OT|Occupational Therapy)$' { 'OT'; break }
        '^(ST|Speech Therapy|SLP)$' { 'ST'; break }
        '^(Nursing)$' { 'Nursing'; break }
        default { if ($discipline) { $discipline } else { 'Unknown' } }
    }

    $status = ([string]$row.$StatusColumn).Trim()
    $documentationStatus = switch -Regex ($status) {
        '^(Completed|Done|Signed)$' { 'Completed'; break }
        '^(Complete)$' { 'Completed'; break }
        '^(Overdue|Past Due)$' { 'Overdue'; break }
        '^(Due|Open|Pending)$' { 'Due'; break }
        '^(Create)$' { 'Due'; break }
        default { if ($status) { $status } else { 'Unknown' } }
    }

    $dueDate = $null; $dueDateKey = $null
    $dueText = ([string]$row.$DueDateColumn).Trim()
    if ($dueText) {
        $parsed = [datetime]::MinValue
        if ([datetime]::TryParse($dueText, [ref]$parsed)) {
            $dueDate = $parsed.ToString('yyyy-MM-dd')
            $dueDateKey = [int]$parsed.ToString('yyyyMMdd')
        }
    }

    $completedDate = $null; $completedDateKey = $null
    if ($CompletionDateColumn -in $actualColumns) {
        $completedText = ([string]$row.$CompletionDateColumn).Trim()
        if ($completedText) {
            $parsed = [datetime]::MinValue
            if ([datetime]::TryParse($completedText, [ref]$parsed)) {
                $completedDate = $parsed.ToString('yyyy-MM-dd')
                $completedDateKey = [int]$parsed.ToString('yyyyMMdd')
            }
        }
    }

    [pscustomobject]@{
        SourceFileName      = $sourceFileName
        LoadBatchId         = $loadBatchId
        SnapshotDateTime    = $SnapshotDateTime.ToString('s')
        SnapshotDateKey     = $snapshotDateKey
        FacilityName        = $FacilityName
        ResidentSourceId    = $residentSourceId
        ResidentDisplayName = $patientName
        ResidentName        = $patientName
        TherapyCaseSourceId = if ($CaseIdColumn -in $actualColumns) { ([string]$row.$CaseIdColumn).Trim() } else { $null }
        ClinicianSourceId   = $clinicianSourceId
        ClinicianName       = $clinicianName
        DisciplineCode      = $disciplineCode
        DocumentTypeName    = ([string]$row.$DocumentTypeColumn).Trim()
        DueDate             = $dueDate
        DueDateKey          = $dueDateKey
        CompletedDate       = $completedDate
        CompletedDateKey    = $completedDateKey
        DocumentationStatus = $documentationStatus
        IsOutstanding       = ($documentationStatus -eq 'Due' -or $documentationStatus -eq 'Overdue')
    }
}

$outputDirectory = Split-Path -Parent $OutputPath
if ($outputDirectory -and -not (Test-Path -LiteralPath $outputDirectory)) { New-Item -ItemType Directory -Path $outputDirectory -Force | Out-Null }
$normalized | Export-Csv -LiteralPath $OutputPath -NoTypeInformation -Encoding UTF8
Write-Host "Normalized Net Health documentation due dates written to: $OutputPath"
Write-Host "Rows: $($normalized.Count)"


param(
    [string]$ProcessedRoot = 'D:\SNF AI Dashboard\data\processed',
    [string]$OutputRoot = 'D:\SNF AI Dashboard\integrations\powerbi\source-package\current\model-tables'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$censusPath = Join-Path $ProcessedRoot 'pcc_resident_list_current.active-only.csv'
$documentationPath = Join-Path $ProcessedRoot 'command_center_documentation_queue.csv'
$unitSnapshotPath = Join-Path $ProcessedRoot 'command_center_executive_unit_snapshot.csv'
$therapyPath = Join-Path $ProcessedRoot 'command_center_therapy_coverage.csv'
$priorityPath = Join-Path $ProcessedRoot 'command_center_therapy_documentation_priority.csv'
$shapPath = Join-Path $ProcessedRoot 'command_center_shap_explanations.csv'

if (-not (Test-Path -LiteralPath $censusPath)) {
    throw "Required census file not found: $censusPath"
}
if (-not (Test-Path -LiteralPath $documentationPath)) {
    throw "Required documentation queue file not found: $documentationPath"
}
if (-not (Test-Path -LiteralPath $unitSnapshotPath)) {
    throw "Required executive unit snapshot file not found: $unitSnapshotPath"
}

if (-not (Test-Path -LiteralPath $OutputRoot)) {
    New-Item -ItemType Directory -Path $OutputRoot -Force | Out-Null
}

Get-ChildItem -LiteralPath $OutputRoot -File -ErrorAction SilentlyContinue |
    Remove-Item -Force -ErrorAction SilentlyContinue

$censusRows = @(Import-Csv -LiteralPath $censusPath)
$documentationRows = @(Import-Csv -LiteralPath $documentationPath)
$unitSnapshotRows = @(Import-Csv -LiteralPath $unitSnapshotPath)
$therapyRows = @(
    if (Test-Path -LiteralPath $therapyPath) { Import-Csv -LiteralPath $therapyPath }
)
$priorityRows = @(
    if (Test-Path -LiteralPath $priorityPath) { Import-Csv -LiteralPath $priorityPath }
)
$shapRows = @(
    if (Test-Path -LiteralPath $shapPath) { Import-Csv -LiteralPath $shapPath }
)

$dimResident = @($censusRows |
    Sort-Object ResidentSourceId -Unique |
    ForEach-Object {
        [pscustomobject]@{
            ResidentSourceId         = [string]$_.ResidentSourceId
            ResidentName             = [string]$_.ResidentName
            ResidentDisplayName      = [string]$_.ResidentDisplayName
            AgeYears                 = [string]$_.AgeYears
            AdmissionDate            = [string]$_.AdmissionDate
            AdmissionDateKey         = [string]$_.AdmissionDateKey
            ResidentStatusNormalized = [string]$_.ResidentStatusNormalized
            SnapshotDateKey          = [string]$_.SnapshotDateKey
        }
    })

$dimUnit = @($censusRows |
    Sort-Object UnitCode -Unique |
    ForEach-Object {
        [pscustomobject]@{
            UnitCode     = [string]$_.UnitCode
            FloorCode    = [string]$_.FloorCode
            FacilityName = [string]$_.FacilityName
        }
    })

$dateMap = @{}
function Add-DateRow {
    param(
        [string]$DateKey,
        [string]$DateValue
    )

    if ([string]::IsNullOrWhiteSpace($DateKey) -or [string]::IsNullOrWhiteSpace($DateValue)) {
        return
    }
    if ($dateMap.ContainsKey($DateKey)) {
        return
    }

    $parsedDate = [datetime]$DateValue
    $dateMap[$DateKey] = [pscustomobject]@{
        DateKey       = [string]$DateKey
        Date          = $parsedDate.ToString('yyyy-MM-dd')
        YearNumber    = [string]$parsedDate.Year
        MonthNumber   = [string]$parsedDate.Month
        MonthName     = $parsedDate.ToString('MMMM')
        QuarterNumber = [string][math]::Ceiling($parsedDate.Month / 3)
        DayOfMonth    = [string]$parsedDate.Day
        DayOfWeekName = $parsedDate.ToString('dddd')
        IsWeekend     = [string]($parsedDate.DayOfWeek -in @([DayOfWeek]::Saturday, [DayOfWeek]::Sunday))
    }
}

foreach ($row in $censusRows) {
    if ([string]::IsNullOrWhiteSpace([string]$row.SnapshotDateKey) -eq $false -and [string]::IsNullOrWhiteSpace([string]$row.SnapshotDateTime) -eq $false) {
        Add-DateRow -DateKey ([string]$row.SnapshotDateKey) -DateValue (([datetime]$row.SnapshotDateTime).ToString('yyyy-MM-dd'))
    }
    if ([string]::IsNullOrWhiteSpace([string]$row.AdmissionDateKey) -eq $false -and [string]::IsNullOrWhiteSpace([string]$row.AdmissionDate) -eq $false) {
        Add-DateRow -DateKey ([string]$row.AdmissionDateKey) -DateValue ([string]$row.AdmissionDate)
    }
}
foreach ($row in $documentationRows) {
    if ([string]::IsNullOrWhiteSpace([string]$row.SnapshotDateKey) -eq $false) {
        $snapshotDateValue = [datetime]::ParseExact([string]$row.SnapshotDateKey, 'yyyyMMdd', $null).ToString('yyyy-MM-dd')
        Add-DateRow -DateKey ([string]$row.SnapshotDateKey) -DateValue $snapshotDateValue
    }
    if ([string]::IsNullOrWhiteSpace([string]$row.DueDate) -eq $false) {
        $dueDate = [datetime]$row.DueDate
        Add-DateRow -DateKey ($dueDate.ToString('yyyyMMdd')) -DateValue ($dueDate.ToString('yyyy-MM-dd'))
    }
}
foreach ($row in $therapyRows) {
    if ([string]::IsNullOrWhiteSpace([string]$row.SnapshotDateKey) -eq $false) {
        $snapshotDateValue = [datetime]::ParseExact([string]$row.SnapshotDateKey, 'yyyyMMdd', $null).ToString('yyyy-MM-dd')
        Add-DateRow -DateKey ([string]$row.SnapshotDateKey) -DateValue $snapshotDateValue
    }
    if ([string]::IsNullOrWhiteSpace([string]$row.TreatmentDate) -eq $false) {
        $treatmentDate = [datetime]$row.TreatmentDate
        Add-DateRow -DateKey ($treatmentDate.ToString('yyyyMMdd')) -DateValue ($treatmentDate.ToString('yyyy-MM-dd'))
    }
}

$dimDate = @($dateMap.Values | Sort-Object DateKey)

$factCensus = @($censusRows |
    ForEach-Object {
        [pscustomobject]@{
            SnapshotDateKey          = [string]$_.SnapshotDateKey
            ResidentSourceId         = [string]$_.ResidentSourceId
            UnitCode                 = [string]$_.UnitCode
            FloorCode                = [string]$_.FloorCode
            RoomCode                 = [string]$_.RoomCode
            BedCode                  = [string]$_.BedCode
            AdmissionDate            = [string]$_.AdmissionDate
            AdmissionDateKey         = [string]$_.AdmissionDateKey
            ResidentStatusNormalized = [string]$_.ResidentStatusNormalized
            AgeYears                 = [string]$_.AgeYears
        }
    })

$factDocumentation = @($documentationRows |
    ForEach-Object {
        [pscustomobject]@{
            SnapshotDateKey     = [string]$_.SnapshotDateKey
            ResidentSourceId    = [string]$_.ResidentSourceId
            UnitCode            = [string]$_.UnitCode
            DisciplineCode      = [string]$_.DisciplineCode
            DocumentTypeName    = [string]$_.DocumentTypeName
            DueDate             = [string]$_.DueDate
            DueDateKey          = if ([string]::IsNullOrWhiteSpace([string]$_.DueDate)) { '' } else { ([datetime]$_.DueDate).ToString('yyyyMMdd') }
            DocumentationStatus = [string]$_.DocumentationStatus
            IsOutstanding       = [string]$_.IsOutstanding
            ClinicianName       = [string]$_.ClinicianName
        }
    })

$factExecutiveUnit = @($unitSnapshotRows |
    ForEach-Object {
        [pscustomobject]@{
            SnapshotDateKey                   = [string]$_.SnapshotDateKey
            UnitCode                          = [string]$_.UnitCode
            CurrentResidentCount              = [string]$_.CurrentResidentCount
            DocumentationItemCount            = [string]$_.DocumentationItemCount
            OutstandingDocumentationItemCount = [string]$_.OutstandingDocumentationItemCount
            DueTodayOrEarlierCount            = [string]$_.DueTodayOrEarlierCount
            TherapyTreatmentLineCount         = [string]$_.TherapyTreatmentLineCount
            TherapyResidentsTreated           = [string]$_.TherapyResidentsTreated
            TherapyMinutes                    = [string]$_.TherapyMinutes
            PriorityResidentCount             = [string]$_.PriorityResidentCount
            PriorityOutstandingDocCount       = [string]$_.PriorityOutstandingDocCount
            PriorityHighestScore              = [string]$_.PriorityHighestScore
            HasTherapyData                    = [string]$_.HasTherapyData
            HasPriorityData                   = [string]$_.HasPriorityData
        }
    })

$tables = @(
    @{ Name = 'DimResidentCurrent.csv'; Rows = $dimResident },
    @{ Name = 'DimUnit.csv'; Rows = $dimUnit },
    @{ Name = 'DimDate.csv'; Rows = $dimDate },
    @{ Name = 'FactCurrentResidentCensus.csv'; Rows = $factCensus },
    @{ Name = 'FactDocumentationQueue.csv'; Rows = $factDocumentation },
    @{ Name = 'FactExecutiveUnitSnapshot.csv'; Rows = $factExecutiveUnit }
)

if ($therapyRows.Count -gt 0) {
    $factTherapy = @($therapyRows |
        ForEach-Object {
            [pscustomobject]@{
                SnapshotDateKey   = [string]$_.SnapshotDateKey
                ResidentSourceId  = [string]$_.ResidentSourceId
                UnitCode          = [string]$_.UnitCode
                DisciplineCode    = [string]$_.DisciplineCode
                TreatmentDate     = [string]$_.TreatmentDate
                TreatmentReceived = [string]$_.TreatmentReceived
                Minutes           = [string]$_.Minutes
                ClinicianName     = [string]$_.ClinicianName
                WingCode          = [string]$_.WingCode
            }
        })
    $tables += @{ Name = 'FactTherapyCoverage.csv'; Rows = $factTherapy }
}

if ($priorityRows.Count -gt 0) {
    $factPriority = @($priorityRows |
        ForEach-Object {
            [pscustomobject]@{
                SnapshotDateKey     = [string]$_.SnapshotDateKey
                ResidentSourceId    = [string]$_.ResidentSourceId
                UnitCode            = [string]$_.UnitCode
                TherapyLineCount    = [string]$_.TherapyLineCount
                TherapyMinutes      = [string]$_.TherapyMinutes
                OutstandingDocCount = [string]$_.OutstandingDocCount
                OverdueDocCount     = [string]$_.OverdueDocCount
                PriorityScore       = [string]$_.PriorityScore
            }
        })
    $tables += @{ Name = 'FactResidentPriority.csv'; Rows = $factPriority }
}

if ($shapRows.Count -gt 0) {
    $factShap = @($shapRows |
        ForEach-Object {
            [pscustomobject]@{
                SnapshotDateKey          = [string]$_.SnapshotDateKey
                ResidentSourceId         = [string]$_.ResidentSourceId
                UnitCode                 = [string]$_.UnitCode
                ModelName                = [string]$_.ModelName
                PredictedPriorityScore   = [string]$_.PredictedPriorityScore
                ObservedPriorityScore    = [string]$_.ObservedPriorityScore
                TopFeature1              = [string]$_.TopFeature1
                TopFeature1Contribution  = [string]$_.TopFeature1Contribution
                TopFeature2              = [string]$_.TopFeature2
                TopFeature2Contribution  = [string]$_.TopFeature2Contribution
                TopFeature3              = [string]$_.TopFeature3
                TopFeature3Contribution  = [string]$_.TopFeature3Contribution
                ExplanationGeneratedAt   = [string]$_.ExplanationGeneratedAt
            }
        })
    $tables += @{ Name = 'FactResidentShapExplanation.csv'; Rows = $factShap }
}

$manifest = @()
foreach ($table in $tables) {
    $path = Join-Path $OutputRoot $table.Name
    @($table.Rows) | Export-Csv -LiteralPath $path -NoTypeInformation -Encoding UTF8
    $item = Get-Item -LiteralPath $path
    $manifest += [pscustomobject]@{
        TableName      = [System.IO.Path]::GetFileNameWithoutExtension($table.Name)
        FileName       = $table.Name
        RowCount       = @($table.Rows).Count
        OutputPath     = $path
        LastWriteTime  = $item.LastWriteTime.ToString('s')
    }
}

$manifest | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath (Join-Path $OutputRoot 'model-table-manifest.json') -Encoding UTF8

Write-Host "Power BI model tables written to: $OutputRoot"
Write-Host "Tables: $($manifest.Count)"

param(
    [string]$TherapyCoveragePath = 'D:\SNF AI Dashboard\data\processed\command_center_therapy_coverage.csv',
    [string]$DocumentationQueuePath = 'D:\SNF AI Dashboard\data\processed\command_center_documentation_queue.csv',
    [string]$OutputPath = 'D:\SNF AI Dashboard\data\processed\command_center_therapy_documentation_priority.csv',
    [string]$UnitSummaryPath = 'D:\SNF AI Dashboard\data\processed\command_center_therapy_documentation_priority.by-unit.csv'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath $TherapyCoveragePath)) { throw "Therapy coverage file not found: $TherapyCoveragePath" }
if (-not (Test-Path -LiteralPath $DocumentationQueuePath)) { throw "Documentation queue file not found: $DocumentationQueuePath" }

$therapyRows = @(Import-Csv -LiteralPath $TherapyCoveragePath)
$documentationRows = @(Import-Csv -LiteralPath $DocumentationQueuePath)
if ($therapyRows.Count -eq 0) { throw "Therapy coverage file has no rows: $TherapyCoveragePath" }
if ($documentationRows.Count -eq 0) { throw "Documentation queue file has no rows: $DocumentationQueuePath" }

$therapyByResident = @{}
foreach ($row in $therapyRows) {
    $residentId = [string]$row.ResidentSourceId
    if (-not $therapyByResident.ContainsKey($residentId)) { $therapyByResident[$residentId] = @() }
    $therapyByResident[$residentId] += $row
}

$documentationByResident = @{}
foreach ($row in $documentationRows) {
    $residentId = [string]$row.ResidentSourceId
    if (-not $documentationByResident.ContainsKey($residentId)) { $documentationByResident[$residentId] = @() }
    $documentationByResident[$residentId] += $row
}

$residentIds = @($therapyByResident.Keys + $documentationByResident.Keys | Select-Object -Unique)

$detailRows = @(
    foreach ($residentId in $residentIds) {
        $therapySet = @(
            if ($therapyByResident.ContainsKey($residentId)) { $therapyByResident[$residentId] }
        )
        $docSet = @(
            if ($documentationByResident.ContainsKey($residentId)) { $documentationByResident[$residentId] }
        )

        $therapyMinutes = 0
        foreach ($therapyRow in $therapySet) {
            $minutes = 0
            if ([int]::TryParse([string]$therapyRow.Minutes, [ref]$minutes)) { $therapyMinutes += $minutes }
        }

        $overdueDocs = @($docSet | Where-Object { $_.DocumentationStatus -eq 'Overdue' }).Count
        $outstandingDocs = @($docSet | Where-Object { $_.IsOutstanding -in @('True','true') }).Count
        $therapyLines = $therapySet.Count
        $unitCode = if ($therapySet.Count -gt 0) { [string]$therapySet[0].UnitCode } elseif ($docSet.Count -gt 0) { [string]$docSet[0].UnitCode } else { $null }
        $residentName = if ($therapySet.Count -gt 0) { [string]$therapySet[0].ResidentName } elseif ($docSet.Count -gt 0) { [string]$docSet[0].ResidentName } else { $null }
        $snapshotDateKey = if ($therapySet.Count -gt 0) { [string]$therapySet[0].SnapshotDateKey } elseif ($docSet.Count -gt 0) { [string]$docSet[0].SnapshotDateKey } else { $null }
        $priorityScore = ($therapyLines * 2) + $outstandingDocs + ($overdueDocs * 3) + [math]::Floor($therapyMinutes / 30)

        [pscustomobject]@{
            SnapshotDateKey       = $snapshotDateKey
            ResidentSourceId      = $residentId
            ResidentName          = $residentName
            UnitCode              = $unitCode
            TherapyLineCount      = $therapyLines
            TherapyMinutes        = $therapyMinutes
            OutstandingDocCount   = $outstandingDocs
            OverdueDocCount       = $overdueDocs
            PriorityScore         = $priorityScore
            HasTherapy            = if ($therapyLines -gt 0) { 'True' } else { 'False' }
            HasDocumentationItems = if ($docSet.Count -gt 0) { 'True' } else { 'False' }
        }
    }
) | Sort-Object -Property @(
    @{ Expression = 'PriorityScore'; Descending = $true },
    'UnitCode',
    'ResidentName'
)

$unitSummaryRows = @($detailRows |
    Group-Object UnitCode |
    Sort-Object Name |
    ForEach-Object {
        $groupRows = @($_.Group)
        [pscustomobject]@{
            UnitCode                 = $_.Name
            ResidentsInPriorityQueue = $groupRows.Count
            ResidentsWithTherapy     = @($groupRows | Where-Object { $_.HasTherapy -eq 'True' }).Count
            ResidentsWithDocs        = @($groupRows | Where-Object { $_.HasDocumentationItems -eq 'True' }).Count
            TotalTherapyMinutes      = (@($groupRows | Measure-Object -Property TherapyMinutes -Sum).Sum)
            TotalOutstandingDocs     = (@($groupRows | Measure-Object -Property OutstandingDocCount -Sum).Sum)
            TotalOverdueDocs         = (@($groupRows | Measure-Object -Property OverdueDocCount -Sum).Sum)
            HighestPriorityScore     = (@($groupRows | Measure-Object -Property PriorityScore -Maximum).Maximum)
        }
    })

$detailDirectory = Split-Path -Parent $OutputPath
if ($detailDirectory -and -not (Test-Path -LiteralPath $detailDirectory)) { New-Item -ItemType Directory -Path $detailDirectory -Force | Out-Null }
$summaryDirectory = Split-Path -Parent $UnitSummaryPath
if ($summaryDirectory -and -not (Test-Path -LiteralPath $summaryDirectory)) { New-Item -ItemType Directory -Path $summaryDirectory -Force | Out-Null }

$detailRows | Export-Csv -LiteralPath $OutputPath -NoTypeInformation -Encoding UTF8
$unitSummaryRows | Export-Csv -LiteralPath $UnitSummaryPath -NoTypeInformation -Encoding UTF8

Write-Host "Therapy + documentation priority queue written to: $OutputPath"
Write-Host "Unit summary written to: $UnitSummaryPath"
Write-Host "Priority rows: $($detailRows.Count)"

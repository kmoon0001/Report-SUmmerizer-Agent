param(
    [string]$PccActiveCensusPath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\pcc_resident_list_current.active-only.csv',
    [string]$DocumentationQueuePath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\command_center_documentation_queue.csv',
    [string]$DocumentationQueueByUnitPath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\command_center_documentation_queue.by-unit.csv',
    [string]$ExecutiveUnitSnapshotPath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\command_center_executive_unit_snapshot.csv',
    [string]$TherapyCoveragePath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\command_center_therapy_coverage.csv',
    [string]$PriorityQueuePath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\command_center_therapy_documentation_priority.csv',
    [string]$OutputPath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\command_center_operational_summary.json'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath $PccActiveCensusPath)) {
    throw "PCC active census file not found: $PccActiveCensusPath"
}

$censusRows = @(Import-Csv -LiteralPath $PccActiveCensusPath)
$docRows = @(
    if (Test-Path -LiteralPath $DocumentationQueuePath) { Import-Csv -LiteralPath $DocumentationQueuePath }
)
$docUnitRows = @(
    if (Test-Path -LiteralPath $DocumentationQueueByUnitPath) { Import-Csv -LiteralPath $DocumentationQueueByUnitPath }
)
$unitSnapshotRows = @(
    if (Test-Path -LiteralPath $ExecutiveUnitSnapshotPath) { Import-Csv -LiteralPath $ExecutiveUnitSnapshotPath }
)
$therapyRows = @(
    if (Test-Path -LiteralPath $TherapyCoveragePath) { Import-Csv -LiteralPath $TherapyCoveragePath }
)
$priorityRows = @(
    if (Test-Path -LiteralPath $PriorityQueuePath) { Import-Csv -LiteralPath $PriorityQueuePath }
)

$residentsWithDocs = @($docRows | Select-Object -ExpandProperty ResidentSourceId -Unique).Count
$outstandingDocs = @($docRows | Where-Object { $_.IsOutstanding -in @('True', 'true') }).Count
$overdueDocs = @($docRows | Where-Object { $_.DocumentationStatus -eq 'Overdue' }).Count
$residentsWithTherapy = @($therapyRows | Select-Object -ExpandProperty ResidentSourceId -Unique).Count
$therapyMinutes = 0
if ($therapyRows.Count -gt 0) {
    $sum = $therapyRows | Measure-Object -Property Minutes -Sum
    if ($null -ne $sum.Sum) {
        $therapyMinutes = [int]$sum.Sum
    }
}

$snapshotDateKey = ''
if ($censusRows.Count -gt 0) {
    $snapshotDateKey = [string]$censusRows[0].SnapshotDateKey
}

$payload = [pscustomobject]@{
    generatedAt = (Get-Date).ToString('s')
    snapshotDateKey = $snapshotDateKey
    metrics = [pscustomobject]@{
        currentResidents = $censusRows.Count
        residentsWithDocumentationItems = $residentsWithDocs
        outstandingDocumentationItems = $outstandingDocs
        overdueDocumentationItems = $overdueDocs
        residentsWithTherapy = $residentsWithTherapy
        totalTherapyMinutes = $therapyMinutes
        residentsInPriorityQueue = $priorityRows.Count
    }
    censusByUnit = @(
        $censusRows |
        Group-Object UnitCode |
        Sort-Object Name |
        ForEach-Object {
            [pscustomobject]@{
                unitCode = [string]$_.Name
                residentCount = [int]$_.Count
            }
        }
    )
    documentationByUnit = @(
        foreach ($row in $docUnitRows) {
            [pscustomobject]@{
                unitCode = [string]$row.UnitCode
                currentResidentDocItems = [int]$row.CurrentResidentDocItems
                outstandingDocItems = [int]$row.OutstandingDocItems
                dueTodayOrEarlier = [int]$row.DueTodayOrEarlier
                uniqueResidents = [int]$row.UniqueResidents
            }
        }
    )
    executiveUnitSnapshot = @(
        foreach ($row in $unitSnapshotRows) {
            [pscustomobject]@{
                unitCode = [string]$row.UnitCode
                currentResidents = [int]$row.CurrentResidentCount
                outstandingDocs = [int]$row.OutstandingDocumentationItemCount
                dueTodayOrEarlier = [int]$row.DueTodayOrEarlierCount
                therapyMinutes = [int]$row.TherapyMinutes
                priorityHighestScore = [int]$row.PriorityHighestScore
                hasTherapyData = [bool]::Parse([string]$row.HasTherapyData)
                hasPriorityData = [bool]::Parse([string]$row.HasPriorityData)
            }
        }
    )
}

$outputDirectory = Split-Path -Parent $OutputPath
if ($outputDirectory -and -not (Test-Path -LiteralPath $outputDirectory)) {
    New-Item -ItemType Directory -Path $outputDirectory -Force | Out-Null
}

$payload | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $OutputPath -Encoding UTF8
Write-Host "Operational summary JSON written to: $OutputPath"


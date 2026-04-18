param(
    [string]$ResolvedDocumentationPath = 'D:\SNF AI Dashboard\data\processed\nethealth_documentation_due_dates.resolved.csv',
    [string]$OutputPath = 'D:\SNF AI Dashboard\data\processed\command_center_documentation_queue.csv',
    [string]$UnitSummaryPath = 'D:\SNF AI Dashboard\data\processed\command_center_documentation_queue.by-unit.csv'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath $ResolvedDocumentationPath)) {
    throw "Resolved documentation file not found: $ResolvedDocumentationPath"
}

$rows = Import-Csv -LiteralPath $ResolvedDocumentationPath
if (-not $rows -or $rows.Count -eq 0) {
    throw "Resolved documentation file has no rows: $ResolvedDocumentationPath"
}

$detailRows = @($rows |
    Where-Object { $_.IsCurrentPccResident -in @('True','true') } |
    Sort-Object UnitCode, DueDate, ResidentName, DisciplineCode, DocumentTypeName |
    ForEach-Object {
        [pscustomobject]@{
            SnapshotDateKey     = [string]$_.SnapshotDateKey
            ResidentSourceId    = [string]$_.ResidentSourceId
            ResidentName        = [string]$_.ResidentName
            UnitCode            = [string]$_.UnitCode
            DisciplineCode      = [string]$_.DisciplineCode
            DocumentTypeName    = [string]$_.DocumentTypeName
            DueDate             = [string]$_.DueDate
            DocumentationStatus = [string]$_.DocumentationStatus
            IsOutstanding       = [string]$_.IsOutstanding
            ClinicianName       = [string]$_.ClinicianName
            ResidentMatchMethod = [string]$_.ResidentMatchMethod
        }
    })

$unitSummaryRows = @($detailRows |
    Group-Object UnitCode |
    Sort-Object Name |
    ForEach-Object {
        $groupRows = @($_.Group)
        [pscustomobject]@{
            UnitCode                = $_.Name
            CurrentResidentDocItems = $groupRows.Count
            OutstandingDocItems     = @($groupRows | Where-Object { $_.IsOutstanding -in @('True','true') }).Count
            DueTodayOrEarlier       = @($groupRows | Where-Object { $_.DueDate -and ([datetime]$_.DueDate -le (Get-Date).Date) }).Count
            UniqueResidents         = @($groupRows | Select-Object -ExpandProperty ResidentSourceId -Unique).Count
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

Write-Host "Command center documentation queue written to: $OutputPath"
Write-Host "Unit summary written to: $UnitSummaryPath"
Write-Host "Queue rows: $($detailRows.Count)"

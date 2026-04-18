param(
    [string]$PccActiveCensusPath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\pcc_resident_list_current.active-only.csv',
    [string]$DocumentationQueueByUnitPath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\command_center_documentation_queue.by-unit.csv',
    [string]$TherapyCoverageByUnitPath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\command_center_therapy_coverage.by-unit.csv',
    [string]$PriorityQueueByUnitPath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\command_center_therapy_documentation_priority.by-unit.csv',
    [string]$OutputPath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\command_center_executive_unit_snapshot.csv'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Get-IntValue {
    param($Value)

    if ($null -eq $Value) { return 0 }
    if ([string]::IsNullOrWhiteSpace([string]$Value)) { return 0 }
    return [int]$Value
}

function Get-ObjectPropertyValue {
    param(
        $Object,
        [string]$PropertyName
    )

    if ($null -eq $Object) { return $null }
    $property = $Object.PSObject.Properties[$PropertyName]
    if ($null -eq $property) { return $null }
    return $property.Value
}

if (-not (Test-Path -LiteralPath $PccActiveCensusPath)) {
    throw "PCC active census file not found: $PccActiveCensusPath"
}

$censusRows = @(Import-Csv -LiteralPath $PccActiveCensusPath)
if ($censusRows.Count -eq 0) {
    throw "PCC active census file has no rows: $PccActiveCensusPath"
}

$docUnitRows = @(
    if (Test-Path -LiteralPath $DocumentationQueueByUnitPath) { Import-Csv -LiteralPath $DocumentationQueueByUnitPath }
)
$therapyUnitRows = @(
    if (Test-Path -LiteralPath $TherapyCoverageByUnitPath) { Import-Csv -LiteralPath $TherapyCoverageByUnitPath }
)
$priorityUnitRows = @(
    if (Test-Path -LiteralPath $PriorityQueueByUnitPath) { Import-Csv -LiteralPath $PriorityQueueByUnitPath }
)

$docByUnit = @{}
foreach ($row in $docUnitRows) {
    $docByUnit[[string]$row.UnitCode] = $row
}

$therapyByUnit = @{}
foreach ($row in $therapyUnitRows) {
    $therapyByUnit[[string]$row.UnitCode] = $row
}

$priorityByUnit = @{}
foreach ($row in $priorityUnitRows) {
    $priorityByUnit[[string]$row.UnitCode] = $row
}

$unitCodes = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)
foreach ($row in $censusRows) { [void]$unitCodes.Add([string]$row.UnitCode) }
foreach ($key in $docByUnit.Keys) { [void]$unitCodes.Add([string]$key) }
foreach ($key in $therapyByUnit.Keys) { [void]$unitCodes.Add([string]$key) }
foreach ($key in $priorityByUnit.Keys) { [void]$unitCodes.Add([string]$key) }

$snapshotDateKey = [string]($censusRows[0].SnapshotDateKey)
$rows = foreach ($unitCode in @($unitCodes) | Sort-Object) {
    $currentResidents = @($censusRows | Where-Object { $_.UnitCode -eq $unitCode }).Count
    $doc = $docByUnit[$unitCode]
    $therapy = $therapyByUnit[$unitCode]
    $priority = $priorityByUnit[$unitCode]

    [pscustomobject]@{
        SnapshotDateKey                   = $snapshotDateKey
        UnitCode                          = [string]$unitCode
        CurrentResidentCount              = [int]$currentResidents
        DocumentationItemCount            = Get-IntValue -Value (Get-ObjectPropertyValue -Object $doc -PropertyName 'CurrentResidentDocItems')
        OutstandingDocumentationItemCount = Get-IntValue -Value (Get-ObjectPropertyValue -Object $doc -PropertyName 'OutstandingDocItems')
        DueTodayOrEarlierCount            = Get-IntValue -Value (Get-ObjectPropertyValue -Object $doc -PropertyName 'DueTodayOrEarlier')
        TherapyTreatmentLineCount         = Get-IntValue -Value (Get-ObjectPropertyValue -Object $therapy -PropertyName 'CurrentResidentTreatments')
        TherapyResidentsTreated           = Get-IntValue -Value (Get-ObjectPropertyValue -Object $therapy -PropertyName 'UniqueResidentsTreated')
        TherapyMinutes                    = Get-IntValue -Value (Get-ObjectPropertyValue -Object $therapy -PropertyName 'TotalTreatmentMinutes')
        PriorityResidentCount             = Get-IntValue -Value (Get-ObjectPropertyValue -Object $priority -PropertyName 'ResidentsInPriorityQueue')
        PriorityOutstandingDocCount       = Get-IntValue -Value (Get-ObjectPropertyValue -Object $priority -PropertyName 'TotalOutstandingDocs')
        PriorityHighestScore              = Get-IntValue -Value (Get-ObjectPropertyValue -Object $priority -PropertyName 'HighestPriorityScore')
        HasTherapyData                    = [string]([bool]($null -ne $therapy))
        HasPriorityData                   = [string]([bool]($null -ne $priority))
    }
}

$outputDirectory = Split-Path -Parent $OutputPath
if ($outputDirectory -and -not (Test-Path -LiteralPath $outputDirectory)) {
    New-Item -ItemType Directory -Path $outputDirectory -Force | Out-Null
}

@($rows) | Export-Csv -LiteralPath $OutputPath -NoTypeInformation -Encoding UTF8
Write-Host "Executive unit snapshot written to: $OutputPath"


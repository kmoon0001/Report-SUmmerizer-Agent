param(
    [string]$ProcessedRoot = 'D:\my agents copilot studio\SNF Dashboard\data\processed',
    [string]$PackageRoot = 'D:\my agents copilot studio\SNF Dashboard\integrations\powerbi\source-package\current'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Get-RowCount {
    param([string]$Path)
    if (-not (Test-Path -LiteralPath $Path)) { return $null }
    return @(Import-Csv -LiteralPath $Path).Count
}

$requiredPackageFiles = @(
    'pcc_resident_list_current.active-only.csv',
    'command_center_documentation_queue.csv',
    'command_center_documentation_queue.by-unit.csv',
    'command_center_executive_unit_snapshot.csv',
    'command_center_operational_summary.md',
    'source-package-manifest.json',
    'authoring-kit\README.md',
    'authoring-kit\authoring-kit-manifest.json',
    'authoring-kit\executive-theme.json',
    'authoring-kit\executive-measures.dax',
    'authoring-kit\executive-page-layout.json',
    'model-tables\DimResidentCurrent.csv',
    'model-tables\DimUnit.csv',
    'model-tables\DimDate.csv',
    'model-tables\FactCurrentResidentCensus.csv',
    'model-tables\FactDocumentationQueue.csv',
    'model-tables\FactExecutiveUnitSnapshot.csv',
    'model-tables\model-table-manifest.json'
)

$missing = @(
    foreach ($relativePath in $requiredPackageFiles) {
        $path = Join-Path $PackageRoot $relativePath
        if (-not (Test-Path -LiteralPath $path)) { $relativePath }
    }
)

if ($missing.Count -gt 0) {
    throw "Power BI package missing required files: $($missing -join ', ')"
}

$censusSource = Join-Path $ProcessedRoot 'pcc_resident_list_current.active-only.csv'
$docSource = Join-Path $ProcessedRoot 'command_center_documentation_queue.csv'
$unitSnapshotSource = Join-Path $ProcessedRoot 'command_center_executive_unit_snapshot.csv'

$factCensus = Join-Path $PackageRoot 'model-tables\FactCurrentResidentCensus.csv'
$factDocs = Join-Path $PackageRoot 'model-tables\FactDocumentationQueue.csv'
$factUnit = Join-Path $PackageRoot 'model-tables\FactExecutiveUnitSnapshot.csv'
$dimResident = Join-Path $PackageRoot 'model-tables\DimResidentCurrent.csv'
$dimUnit = Join-Path $PackageRoot 'model-tables\DimUnit.csv'
$dimDate = Join-Path $PackageRoot 'model-tables\DimDate.csv'
$authoringManifestPath = Join-Path $PackageRoot 'authoring-kit\authoring-kit-manifest.json'

$censusSourceRows = @(Import-Csv -LiteralPath $censusSource)
$docSourceRows = @(Import-Csv -LiteralPath $docSource)
$unitSourceRows = @(Import-Csv -LiteralPath $unitSnapshotSource)
$factCensusRows = @(Import-Csv -LiteralPath $factCensus)
$factDocRows = @(Import-Csv -LiteralPath $factDocs)
$factUnitRows = @(Import-Csv -LiteralPath $factUnit)
$dimResidentRows = @(Import-Csv -LiteralPath $dimResident)
$dimUnitRows = @(Import-Csv -LiteralPath $dimUnit)
$dimDateRows = @(Import-Csv -LiteralPath $dimDate)

if ($censusSourceRows.Count -ne $factCensusRows.Count) {
    throw "FactCurrentResidentCensus row count mismatch. Source=$($censusSourceRows.Count) Fact=$($factCensusRows.Count)"
}
if ($docSourceRows.Count -ne $factDocRows.Count) {
    throw "FactDocumentationQueue row count mismatch. Source=$($docSourceRows.Count) Fact=$($factDocRows.Count)"
}
if ($unitSourceRows.Count -ne $factUnitRows.Count) {
    throw "FactExecutiveUnitSnapshot row count mismatch. Source=$($unitSourceRows.Count) Fact=$($factUnitRows.Count)"
}

$expectedResidentCount = @($censusSourceRows | Select-Object -ExpandProperty ResidentSourceId -Unique).Count
if ($expectedResidentCount -ne $dimResidentRows.Count) {
    throw "DimResidentCurrent row count mismatch. Expected=$expectedResidentCount Actual=$($dimResidentRows.Count)"
}

$expectedUnitCount = @($censusSourceRows | Select-Object -ExpandProperty UnitCode -Unique).Count
if ($expectedUnitCount -ne $dimUnitRows.Count) {
    throw "DimUnit row count mismatch. Expected=$expectedUnitCount Actual=$($dimUnitRows.Count)"
}

$requiredDateKeys = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)
foreach ($row in $censusSourceRows) {
    if ([string]::IsNullOrWhiteSpace([string]$row.SnapshotDateKey) -eq $false) { [void]$requiredDateKeys.Add([string]$row.SnapshotDateKey) }
    if ([string]::IsNullOrWhiteSpace([string]$row.AdmissionDateKey) -eq $false) { [void]$requiredDateKeys.Add([string]$row.AdmissionDateKey) }
}
foreach ($row in $docSourceRows) {
    if ([string]::IsNullOrWhiteSpace([string]$row.SnapshotDateKey) -eq $false) { [void]$requiredDateKeys.Add([string]$row.SnapshotDateKey) }
    if ([string]::IsNullOrWhiteSpace([string]$row.DueDate) -eq $false) {
        $dateKey = ([datetime]$row.DueDate).ToString('yyyyMMdd')
        [void]$requiredDateKeys.Add([string]$dateKey)
    }
}

$dimDateKeySet = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)
foreach ($row in $dimDateRows) { [void]$dimDateKeySet.Add([string]$row.DateKey) }

$missingDateKeys = @(
    foreach ($key in $requiredDateKeys) {
        if (-not $dimDateKeySet.Contains($key)) { $key }
    }
)
if ($missingDateKeys.Count -gt 0) {
    throw "DimDate is missing required date keys: $($missingDateKeys -join ', ')"
}

$therapyCoveragePath = Join-Path $PackageRoot 'model-tables\FactTherapyCoverage.csv'
$priorityPath = Join-Path $PackageRoot 'model-tables\FactResidentPriority.csv'
$processedTherapyPath = Join-Path $ProcessedRoot 'command_center_therapy_coverage.csv'
$processedPriorityPath = Join-Path $ProcessedRoot 'command_center_therapy_documentation_priority.csv'

if (Test-Path -LiteralPath $processedTherapyPath) {
    if (-not (Test-Path -LiteralPath $therapyCoveragePath)) {
        throw 'FactTherapyCoverage.csv is missing even though processed therapy coverage exists.'
    }
    $therapySourceRows = Get-RowCount -Path $processedTherapyPath
    $therapyFactRows = Get-RowCount -Path $therapyCoveragePath
    if ($therapySourceRows -ne $therapyFactRows) {
        throw "FactTherapyCoverage row count mismatch. Source=$therapySourceRows Fact=$therapyFactRows"
    }
}

if (Test-Path -LiteralPath $processedPriorityPath) {
    if (-not (Test-Path -LiteralPath $priorityPath)) {
        throw 'FactResidentPriority.csv is missing even though processed priority queue exists.'
    }
    $prioritySourceRows = Get-RowCount -Path $processedPriorityPath
    $priorityFactRows = Get-RowCount -Path $priorityPath
    if ($prioritySourceRows -ne $priorityFactRows) {
        throw "FactResidentPriority row count mismatch. Source=$prioritySourceRows Fact=$priorityFactRows"
    }
}

$authoringManifest = Get-Content -LiteralPath $authoringManifestPath -Raw | ConvertFrom-Json
if ([int]$authoringManifest.MeasureCount -lt 1) {
    throw 'Power BI authoring kit manifest reports zero measures.'
}
if ([int]$authoringManifest.RelationshipCount -lt 1) {
    throw 'Power BI authoring kit manifest reports zero relationships.'
}

Write-Host 'Power BI executive package validation passed.'
Write-Host "Package root: $PackageRoot"
Write-Host "Residents: $($dimResidentRows.Count)"
Write-Host "Units: $($dimUnitRows.Count)"
Write-Host "Dates: $($dimDateRows.Count)"


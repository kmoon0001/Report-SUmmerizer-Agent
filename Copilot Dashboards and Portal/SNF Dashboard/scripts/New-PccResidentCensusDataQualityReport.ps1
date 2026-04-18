param(
    [Parameter(Mandatory = $true)]
    [string]$Path,

    [string]$OutputPath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\pcc_resident_list_current.quality-report.md'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath $Path)) {
    throw "File not found: $Path"
}

$rows = Import-Csv -LiteralPath $Path
if (-not $rows -or $rows.Count -eq 0) {
    throw "File has no rows: $Path"
}

$columns = @($rows[0].PSObject.Properties.Name)
$isNormalized = 'ResidentStatusNormalized' -in $columns

if ($isNormalized) {
    $rowCount = $rows.Count
    $activeCount = @($rows | Where-Object { $_.ResidentStatusNormalized -eq 'Active' }).Count
    $dischargedCount = @($rows | Where-Object { $_.ResidentStatusNormalized -eq 'Discharged' }).Count
    $unknownStatusCount = @($rows | Where-Object { $_.ResidentStatusNormalized -eq 'Unknown' }).Count
    $missingResidentIdCount = @($rows | Where-Object { [string]::IsNullOrWhiteSpace($_.ResidentSourceId) }).Count
    $missingLocationCount = @($rows | Where-Object { [string]::IsNullOrWhiteSpace($_.LocationRaw) }).Count
    $missingAdmissionDateCount = @($rows | Where-Object { [string]::IsNullOrWhiteSpace($_.AdmissionDate) }).Count
    $activeMissingLocationCount = @($rows | Where-Object { $_.ResidentStatusNormalized -eq 'Active' -and [string]::IsNullOrWhiteSpace($_.LocationRaw) }).Count
    $activeMissingAdmissionDateCount = @($rows | Where-Object { $_.ResidentStatusNormalized -eq 'Active' -and [string]::IsNullOrWhiteSpace($_.AdmissionDate) }).Count
    $unitSummary = @($rows | Group-Object UnitCode | Sort-Object Count -Descending | Select-Object -First 10)
} else {
    $rowCount = $rows.Count
    $activeCount = @($rows | Where-Object { $_.Status -eq 'Active' }).Count
    $dischargedCount = @($rows | Where-Object { $_.Status -eq 'Discharge' }).Count
    $unknownStatusCount = @($rows | Where-Object { [string]::IsNullOrWhiteSpace($_.Status) }).Count
    $missingResidentIdCount = @($rows | Where-Object { ([string]$_.Name) -notmatch '\(([^()]*)\)\s*$' }).Count
    $missingLocationCount = @($rows | Where-Object { [string]::IsNullOrWhiteSpace($_.'Location (Fl Un Rm Bd)') }).Count
    $missingAdmissionDateCount = @($rows | Where-Object { [string]::IsNullOrWhiteSpace($_.'Admission Date') }).Count
    $activeMissingLocationCount = @($rows | Where-Object { $_.Status -eq 'Active' -and [string]::IsNullOrWhiteSpace($_.'Location (Fl Un Rm Bd)') }).Count
    $activeMissingAdmissionDateCount = @($rows | Where-Object { $_.Status -eq 'Active' -and [string]::IsNullOrWhiteSpace($_.'Admission Date') }).Count
    $unitSummary = @($rows | Group-Object 'Location (Fl Un Rm Bd)' | Sort-Object Count -Descending | Select-Object -First 10)
}

$lines = @()
$lines += '# PCC Resident Census Data Quality Report'
$lines += ''
$lines += "Source file: $Path"
$lines += ''
$lines += '## Summary'
$lines += ''
$lines += "- Rows: $rowCount"
$lines += "- Active: $activeCount"
$lines += "- Discharged: $dischargedCount"
$lines += "- Unknown status: $unknownStatusCount"
$lines += "- Missing resident identifier: $missingResidentIdCount"
$lines += "- Missing location: $missingLocationCount"
$lines += "- Missing admission date: $missingAdmissionDateCount"
$lines += "- Active with missing location: $activeMissingLocationCount"
$lines += "- Active with missing admission date: $activeMissingAdmissionDateCount"
$lines += ''
$lines += '## Top Unit Or Location Values'
$lines += ''

foreach ($entry in $unitSummary) {
    $name = if ([string]::IsNullOrWhiteSpace([string]$entry.Name)) { '<blank>' } else { [string]$entry.Name }
    $lines += "- ${name}: $($entry.Count)"
}

$lines += ''
$lines += '## Interpretation'
$lines += ''
if ($missingResidentIdCount -gt 0) {
    $lines += '- Missing resident identifiers block dependable conformed dimensions.'
} else {
    $lines += '- Resident identifiers are complete enough for a governed conformed resident dimension.'
}

if ($activeMissingLocationCount -gt 0) {
    $lines += '- Active residents without location should be treated as operational exceptions.'
} else {
    $lines += '- Active residents have complete location data in this file.'
}

if ($activeMissingAdmissionDateCount -gt 0) {
    $lines += '- Active residents without admission date weaken episode and length-of-stay analysis.'
} else {
    $lines += '- Active residents have complete admission dates for episode start analysis.'
}

$outputDirectory = Split-Path -Parent $OutputPath
if (-not [string]::IsNullOrWhiteSpace($outputDirectory) -and -not (Test-Path -LiteralPath $outputDirectory)) {
    New-Item -ItemType Directory -Path $outputDirectory -Force | Out-Null
}

$lines -join [Environment]::NewLine | Set-Content -LiteralPath $OutputPath -Encoding UTF8

Write-Host "Quality report written to: $OutputPath"


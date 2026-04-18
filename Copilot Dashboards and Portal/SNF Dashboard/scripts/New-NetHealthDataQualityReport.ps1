param(
    [Parameter(Mandatory = $true)]
    [string]$Path,

    [string]$OutputPath
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath $Path)) {
    throw "File not found: $Path"
}

if (-not $OutputPath) {
    $base = [System.IO.Path]::GetFileNameWithoutExtension($Path)
    $OutputPath = "D:\my agents copilot studio\SNF Dashboard\data\processed\$base.quality-report.md"
}

$rows = Import-Csv -LiteralPath $Path
if (-not $rows -or $rows.Count -eq 0) {
    throw "File has no rows: $Path"
}

$columns = @($rows[0].PSObject.Properties.Name)
$isTherapy = 'TherapyCaseStatus' -in $columns
$isDocumentation = 'DocumentationStatus' -in $columns

$lines = @()
$lines += '# Net Health Data Quality Report'
$lines += ''
$lines += "Source file: $Path"
$lines += ''
$lines += '## Summary'
$lines += ''
$lines += "- Rows: $($rows.Count)"

if ($isTherapy) {
    $lines += "- Open therapy cases: $(@($rows | Where-Object { $_.IsOpenCase -in @('True','true') }).Count)"
    $lines += "- Unknown discipline: $(@($rows | Where-Object { $_.DisciplineCode -eq 'Unknown' }).Count)"
    $lines += "- Missing resident IDs: $(@($rows | Where-Object { [string]::IsNullOrWhiteSpace($_.ResidentSourceId) }).Count)"
    $lines += "- Missing therapy case IDs: $(@($rows | Where-Object { [string]::IsNullOrWhiteSpace($_.TherapyCaseSourceId) }).Count)"
}

if ($isDocumentation) {
    $lines += "- Outstanding documentation items: $(@($rows | Where-Object { $_.IsOutstanding -in @('True','true') }).Count)"
    $lines += "- Overdue documentation items: $(@($rows | Where-Object { $_.DocumentationStatus -eq 'Overdue' }).Count)"
    $lines += "- Missing resident IDs: $(@($rows | Where-Object { [string]::IsNullOrWhiteSpace($_.ResidentSourceId) }).Count)"
    $lines += "- Missing clinician IDs: $(@($rows | Where-Object { [string]::IsNullOrWhiteSpace($_.ClinicianSourceId) }).Count)"
}

$outputDirectory = Split-Path -Parent $OutputPath
if ($outputDirectory -and -not (Test-Path -LiteralPath $outputDirectory)) {
    New-Item -ItemType Directory -Path $outputDirectory -Force | Out-Null
}

$lines -join [Environment]::NewLine | Set-Content -LiteralPath $OutputPath -Encoding UTF8
Write-Host "Quality report written to: $OutputPath"


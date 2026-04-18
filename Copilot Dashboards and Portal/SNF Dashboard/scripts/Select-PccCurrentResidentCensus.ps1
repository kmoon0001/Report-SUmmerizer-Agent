param(
    [Parameter(Mandatory = $true)]
    [string]$InputPath,

    [string]$OutputPath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\pcc_resident_list_current.active-only.csv'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath $InputPath)) {
    throw "Normalized PCC file not found: $InputPath"
}

$rows = Import-Csv -LiteralPath $InputPath
if (-not $rows -or $rows.Count -eq 0) {
    throw "Normalized PCC file has no rows: $InputPath"
}

if ('ResidentStatusNormalized' -notin $rows[0].PSObject.Properties.Name) {
    throw "Input file is not a supported normalized PCC resident file."
}

$currentRows = @($rows | Where-Object { $_.ResidentStatusNormalized -eq 'Active' })

$outputDirectory = Split-Path -Parent $OutputPath
if (-not [string]::IsNullOrWhiteSpace($outputDirectory) -and -not (Test-Path -LiteralPath $outputDirectory)) {
    New-Item -ItemType Directory -Path $outputDirectory -Force | Out-Null
}

$currentRows | Export-Csv -LiteralPath $OutputPath -NoTypeInformation -Encoding UTF8

Write-Host "Current resident census file written to: $OutputPath"
Write-Host "Rows: $($currentRows.Count)"


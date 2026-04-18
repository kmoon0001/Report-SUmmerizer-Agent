param(
    [Parameter(Mandatory = $true)]
    [string]$CandidateCsvPath,
    [string]$BaselineNormalizedPath = 'D:\SNF AI Dashboard\data\processed\nethealth_therapy_census.normalized.csv',
    [string]$OutputPath = 'D:\SNF AI Dashboard\data\processed\nethealth_therapy_source_comparison.md'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath $CandidateCsvPath)) {
    throw "Candidate CSV not found: $CandidateCsvPath"
}
if (-not (Test-Path -LiteralPath $BaselineNormalizedPath)) {
    throw "Baseline normalized file not found: $BaselineNormalizedPath"
}

$candidateRows = @(Import-Csv -LiteralPath $CandidateCsvPath)
$baselineRows = @(Import-Csv -LiteralPath $BaselineNormalizedPath)

$candidateColumns = if ($candidateRows.Count -gt 0) { @($candidateRows[0].PSObject.Properties.Name) } else { @() }
$baselineColumns = if ($baselineRows.Count -gt 0) { @($baselineRows[0].PSObject.Properties.Name) } else { @() }

$candidatePatients = @($candidateRows | ForEach-Object { [string]$_.Patient } | Where-Object { $_ } | Sort-Object -Unique)
$baselinePatients = @($baselineRows | ForEach-Object { [string]$_.ResidentDisplayName } | Where-Object { $_ } | Sort-Object -Unique)
$candidateMissingFromBaseline = @($candidatePatients | Where-Object { $_ -notin $baselinePatients })
$baselineMissingFromCandidate = @($baselinePatients | Where-Object { $_ -notin $candidatePatients })

$lines = @()
$lines += '# Net Health Therapy Source Comparison'
$lines += ''
$lines += ('Generated: {0}' -f (Get-Date).ToString('yyyy-MM-dd HH:mm:ss'))
$lines += ''
$lines += '## Row Counts'
$lines += ''
$lines += ('- Candidate CSV rows: {0}' -f $candidateRows.Count)
$lines += ('- Baseline normalized rows: {0}' -f $baselineRows.Count)
$lines += ''
$lines += '## Column Comparison'
$lines += ''
$lines += ('- Candidate CSV columns: {0}' -f ($candidateColumns -join ', '))
$lines += ('- Baseline normalized columns: {0}' -f ($baselineColumns -join ', '))
$lines += ''
$lines += '## Patient Coverage'
$lines += ''
$lines += ('- Candidate unique patients: {0}' -f $candidatePatients.Count)
$lines += ('- Baseline unique patients: {0}' -f $baselinePatients.Count)
$lines += ('- Candidate patients not in baseline: {0}' -f $candidateMissingFromBaseline.Count)
$lines += ('- Baseline patients not in candidate: {0}' -f $baselineMissingFromCandidate.Count)

if ($candidateMissingFromBaseline.Count -gt 0) {
    $lines += ''
    $lines += '## Candidate Patients Not In Baseline'
    $lines += ''
    foreach ($patient in $candidateMissingFromBaseline | Select-Object -First 20) {
        $lines += ('- {0}' -f $patient)
    }
}

if ($baselineMissingFromCandidate.Count -gt 0) {
    $lines += ''
    $lines += '## Baseline Patients Not In Candidate'
    $lines += ''
    foreach ($patient in $baselineMissingFromCandidate | Select-Object -First 20) {
        $lines += ('- {0}' -f $patient)
    }
}

$outputDirectory = Split-Path -Parent $OutputPath
if ($outputDirectory -and -not (Test-Path -LiteralPath $outputDirectory)) {
    New-Item -ItemType Directory -Path $outputDirectory -Force | Out-Null
}

$lines -join [Environment]::NewLine | Set-Content -LiteralPath $OutputPath -Encoding UTF8
Write-Host "Net Health therapy source comparison written to: $OutputPath"

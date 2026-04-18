param(
    [string]$InputPath = 'D:\my agents copilot studio\SNF Dashboard\data\incoming\nethealth_therapy_census.csv',
    [string]$NormalizedPath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\nethealth_therapy_census.normalized.csv',
    [string]$ResolvedPath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\nethealth_therapy_census.resolved.csv',
    [string]$CoveragePath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\command_center_therapy_coverage.csv',
    [string]$CoverageByUnitPath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\command_center_therapy_coverage.by-unit.csv',
    [string]$QualityReportPath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\nethealth_therapy_census.normalized.quality-report.md',
    [string]$PccCensusPath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\pcc_resident_list_current.active-only.csv'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath $InputPath)) { throw "Therapy source file not found: $InputPath" }

& 'D:\my agents copilot studio\SNF Dashboard\scripts\Convert-NetHealthTherapyCensusToNormalizedCsv.ps1' -InputPath $InputPath -OutputPath $NormalizedPath
& 'D:\my agents copilot studio\SNF Dashboard\scripts\Test-NetHealthTherapyCensusNormalizedCsv.ps1' -Path $NormalizedPath | Out-Null
& 'D:\my agents copilot studio\SNF Dashboard\scripts\New-NetHealthDataQualityReport.ps1' -Path $NormalizedPath -OutputPath $QualityReportPath | Out-Null
& 'D:\my agents copilot studio\SNF Dashboard\scripts\Resolve-NetHealthTherapyResidentsAgainstPcc.ps1' -TherapyPath $NormalizedPath -PccCensusPath $PccCensusPath -OutputPath $ResolvedPath
& 'D:\my agents copilot studio\SNF Dashboard\scripts\New-CommandCenterTherapyCoverage.ps1' -ResolvedTherapyPath $ResolvedPath -OutputPath $CoveragePath -UnitSummaryPath $CoverageByUnitPath

Write-Host "Net Health therapy pipeline completed."
Write-Host "Normalized: $NormalizedPath"
Write-Host "Resolved: $ResolvedPath"
Write-Host "Coverage: $CoveragePath"
Write-Host "Unit summary: $CoverageByUnitPath"


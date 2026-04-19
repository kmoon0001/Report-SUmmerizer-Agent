param(
    [string]$EnvironmentId = "a944fdf0-0d2e-e14d-8a73-0f5ffae23315",
    [string]$BotId = "ea52ad9c-8233-f111-88b3-6045bd09a824",
    [string]$OutputFile = "output/live-drift-check.yml"
)

$ErrorActionPreference = "Stop"

function Require-Command {
    param([string]$Name)

    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        throw "Required command not found: $Name"
    }
}

Require-Command "pac"

$workspace = (Get-Location).Path
$outPath = Join-Path $workspace $OutputFile
$outDir = Split-Path -Parent $outPath

if (-not (Test-Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir | Out-Null
}

if (Test-Path $outPath) {
    Remove-Item -Force $outPath
}

Write-Host "Extracting live copilot template..."
pac copilot extract-template `
    --environment $EnvironmentId `
    --bot $BotId `
    --templateFileName $outPath `
    --templateVersion 1.0.0 `
    --overwrite | Out-Host

if (-not (Test-Path $outPath)) {
    throw "Live export did not produce expected file: $outPath"
}

$content = Get-Content $outPath
$text = $content -join "`n"

$findings = @()

if ($text -match "flowId:\s*868e2c74-ed27-f111-8341-000d3a3363af") {
    $findings += "Live template still references retired Power BI flowId 868e2c74-ed27-f111-8341-000d3a3363af."
}

if ($text -match "outputs\('run_a_query_against_a_dataset_1'\)\['body'\]\['firsttablerows'\]\[0\]\['outlier_score'\]") {
    $findings += "Live template still contains expression-shaped output binding key from Power BI wrapper."
}

if ($text -match "schemaName:\s*template-content\.topic\.QMDriverAnalysis" -and $text -match "adl_score:\s*Topic\.adl_score") {
    $findings += "Live QMDriverAnalysis still uses legacy Power BI-shaped output contract."
}

if ($text -match "schemaName:\s*template-content\.topic\.FacilityQMAnalysis" -and $text -match "falls_risk:\s*Topic\.falls_risk") {
    $findings += "Live FacilityQMAnalysis still uses legacy Power BI-shaped output contract."
}

if ($text -match "schemaName:\s*template-content\.topic\.QMDataUploadDeclineDetection" -and $text -match "declining_metrics_text:\s*Topic\.DecliningMetricsText") {
    $findings += "Live QMDataUploadDeclineDetection already uses the repaired facility lookup contract."
}

Write-Host ""
Write-Host "Live drift check"
Write-Host "Output: $outPath"

if ($findings.Count -eq 0) {
    Write-Host "No known drift signatures found."
    exit 0
}

foreach ($finding in $findings) {
    Write-Host "- $finding"
}

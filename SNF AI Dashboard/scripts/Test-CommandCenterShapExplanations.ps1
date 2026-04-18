param(
    [string]$Path = 'D:\SNF AI Dashboard\data\processed\command_center_shap_explanations.csv'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath $Path)) {
    throw "SHAP explanations file not found: $Path"
}

$rows = @(Import-Csv -LiteralPath $Path)
if ($rows.Count -eq 0) {
    throw "SHAP explanations file is empty: $Path"
}

$requiredColumns = @(
    'ResidentSourceId',
    'ResidentName',
    'UnitCode',
    'ModelName',
    'PredictedPriorityScore',
    'ObservedPriorityScore',
    'TopFeature1',
    'TopFeature1Contribution',
    'TopFeature2',
    'TopFeature2Contribution',
    'TopFeature3',
    'TopFeature3Contribution',
    'ExplanationGeneratedAt'
)

$columns = @($rows[0].PSObject.Properties.Name)
$missing = @($requiredColumns | Where-Object { $columns -notcontains $_ })
if ($missing.Count -gt 0) {
    throw "SHAP explanations file is missing required columns: $($missing -join ', ')"
}

$invalidPredictions = @(
    $rows | Where-Object {
        $v = 0.0
        -not [double]::TryParse([string]$_.PredictedPriorityScore, [ref]$v)
    }
)
if ($invalidPredictions.Count -gt 0) {
    throw "PredictedPriorityScore contains non-numeric values."
}

$missingFeatures = @(
    $rows | Where-Object { [string]::IsNullOrWhiteSpace([string]$_.TopFeature1) }
)
if ($missingFeatures.Count -gt 0) {
    throw "TopFeature1 is empty for one or more rows."
}

$summary = [pscustomobject]@{
    FilePath = $Path
    RowCount = $rows.Count
    MissingRequiredColumns = $missing.Count
    InvalidPredictions = $invalidPredictions.Count
    EmptyTopFeature1 = $missingFeatures.Count
}

$summary | ConvertTo-Json -Depth 4

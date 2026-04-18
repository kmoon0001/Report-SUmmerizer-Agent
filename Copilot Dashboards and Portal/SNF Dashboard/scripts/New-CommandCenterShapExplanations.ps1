param(
    [string]$PatientInsightsPath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\command_center_patient_insights.csv',
    [string]$OutputPath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\command_center_shap_explanations.csv',
    [string]$FeatureImportancePath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\command_center_shap_feature_importance.csv',
    [string]$SummaryPath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\command_center_shap_summary.md',
    [string]$PythonPath = 'D:\my agents copilot studio\SNF Dashboard\.venv-codex-yaml\Scripts\python.exe',
    [switch]$InstallDependencies = $false,
    [switch]$AllowFallback = $true
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath $PatientInsightsPath)) {
    throw "Patient insights file not found: $PatientInsightsPath"
}

if (-not (Test-Path -LiteralPath $PythonPath)) {
    throw "Python executable not found: $PythonPath"
}

$scriptPath = 'D:\my agents copilot studio\SNF Dashboard\scripts\Build-CommandCenterShapExplanations.py'
if (-not (Test-Path -LiteralPath $scriptPath)) {
    throw "SHAP builder script not found: $scriptPath"
}

$outputDir = Split-Path -Parent $OutputPath
$featureDir = Split-Path -Parent $FeatureImportancePath
$summaryDir = Split-Path -Parent $SummaryPath
foreach ($dir in @($outputDir, $featureDir, $summaryDir)) {
    if (-not (Test-Path -LiteralPath $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
}

function Get-NumericValue {
    param(
        [psobject]$Row,
        [string]$Name
    )

    $value = 0.0
    [void][double]::TryParse([string]$Row.$Name, [ref]$value)
    return [double]$value
}

function New-FallbackShapOutputs {
    param(
        [string]$InputPath,
        [string]$ShapPath,
        [string]$FeaturePath,
        [string]$MarkdownPath,
        [string]$FailureReason
    )

    $rows = @(Import-Csv -LiteralPath $InputPath)
    if ($rows.Count -eq 0) {
        throw "Patient insights file is empty and fallback SHAP cannot run: $InputPath"
    }

    $timestamp = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ')
    $baseValue = 0.0
    $priorityValues = @($rows | ForEach-Object { Get-NumericValue -Row $_ -Name 'PriorityScore' })
    if ($priorityValues.Count -gt 0) {
        $baseValue = [Math]::Round((($priorityValues | Measure-Object -Average).Average), 6)
    }

    $explanations = [System.Collections.Generic.List[object]]::new()
    $importanceSums = @{}
    $importanceCounts = @{}

    foreach ($row in $rows) {
        $overdue = Get-NumericValue -Row $row -Name 'OverdueDocCount'
        $outstanding = Get-NumericValue -Row $row -Name 'OutstandingDocCount'
        $therapyMinutes = Get-NumericValue -Row $row -Name 'TherapyMinutes'
        $daysSinceTherapy = Get-NumericValue -Row $row -Name 'DaysSinceLastTherapy'
        $painScore = Get-NumericValue -Row $row -Name 'PainScore'
        $observedPriority = Get-NumericValue -Row $row -Name 'PriorityScore'

        $featureContributions = [ordered]@{
            'OverdueDocCount' = [Math]::Round($overdue * 2.0, 6)
            'OutstandingDocCount' = [Math]::Round($outstanding * 1.0, 6)
            'DaysSinceLastTherapy' = [Math]::Round($daysSinceTherapy * 0.75, 6)
            'PainScore' = [Math]::Round($painScore * 0.5, 6)
            'TherapyMinutes' = [Math]::Round($therapyMinutes * 0.05, 6)
        }

        $top = @(
            $featureContributions.GetEnumerator() |
                Sort-Object @{ Expression = { [Math]::Abs([double]$_.Value) }; Descending = $true } |
                Select-Object -First 3
        )

        if ($top.Count -lt 3) {
            throw 'Fallback SHAP feature ranking produced fewer than three entries.'
        }

        foreach ($item in $featureContributions.GetEnumerator()) {
            $name = [string]$item.Key
            $absValue = [Math]::Abs([double]$item.Value)
            if (-not $importanceSums.ContainsKey($name)) {
                $importanceSums[$name] = 0.0
                $importanceCounts[$name] = 0
            }
            $importanceSums[$name] = [double]$importanceSums[$name] + $absValue
            $importanceCounts[$name] = [int]$importanceCounts[$name] + 1
        }

        $predictedPriority = [Math]::Round($observedPriority, 4)
        $explanations.Add([pscustomobject]@{
            SnapshotDateKey = [string]$row.SnapshotDateKey
            ResidentSourceId = [string]$row.ResidentSourceId
            ResidentName = [string]$row.ResidentName
            UnitCode = [string]$row.UnitCode
            ModelName = 'HeuristicFallbackNoShap'
            PredictedPriorityScore = $predictedPriority
            ObservedPriorityScore = [Math]::Round($observedPriority, 4)
            BaseValue = $baseValue
            TopFeature1 = [string]$top[0].Key
            TopFeature1Contribution = [double]$top[0].Value
            TopFeature1RawValue = [string](Get-NumericValue -Row $row -Name ([string]$top[0].Key))
            TopFeature2 = [string]$top[1].Key
            TopFeature2Contribution = [double]$top[1].Value
            TopFeature2RawValue = [string](Get-NumericValue -Row $row -Name ([string]$top[1].Key))
            TopFeature3 = [string]$top[2].Key
            TopFeature3Contribution = [double]$top[2].Value
            TopFeature3RawValue = [string](Get-NumericValue -Row $row -Name ([string]$top[2].Key))
            ExplanationGeneratedAt = $timestamp
        }) | Out-Null
    }

    $explanations |
        Sort-Object @{ Expression = { [double]$_.PredictedPriorityScore }; Descending = $true }, ResidentName |
        Export-Csv -LiteralPath $ShapPath -NoTypeInformation -Encoding UTF8

    $importanceRows = [System.Collections.Generic.List[object]]::new()
    foreach ($name in @($importanceSums.Keys | Sort-Object)) {
        $count = [int]$importanceCounts[$name]
        $meanAbs = if ($count -gt 0) { [double]$importanceSums[$name] / $count } else { 0.0 }
        $importanceRows.Add([pscustomobject]@{
            FeatureName = [string]$name
            MeanAbsShap = [Math]::Round($meanAbs, 6)
            Rank = 0
            GeneratedAt = $timestamp
        }) | Out-Null
    }

    $rankedImportance = @(
        $importanceRows |
            Sort-Object @{ Expression = { [double]$_.MeanAbsShap }; Descending = $true } |
            ForEach-Object -Begin { $rank = 1 } -Process {
                $_.Rank = $rank
                $rank++
                $_
            }
    )
    $rankedImportance | Export-Csv -LiteralPath $FeaturePath -NoTypeInformation -Encoding UTF8

    $summaryLines = @(
        '# Command Center SHAP Summary',
        '',
        "Generated: $timestamp",
        '',
        'Model: HeuristicFallbackNoShap',
        "Input rows used: $($rows.Count)",
        "Output rows: $($explanations.Count)",
        '',
        'Top global SHAP features:',
        ($rankedImportance | Select-Object -First 10 | ForEach-Object {
            "- $([string]$_.Rank). $([string]$_.FeatureName) (mean_abs_shap=$([string]$_.MeanAbsShap))"
        }),
        '',
        'Fallback reason:',
        "- $FailureReason"
    )
    $summaryLines -join [Environment]::NewLine | Set-Content -LiteralPath $MarkdownPath -Encoding UTF8
}

$pythonResult = ''
$pythonSucceeded = $false
$pythonFailureReason = ''

try {
    if ($InstallDependencies) {
        & $PythonPath -m pip install --disable-pip-version-check --quiet shap scikit-learn pandas numpy | Out-Null
        if ($LASTEXITCODE -ne 0) {
            throw "Dependency install failed with exit code $LASTEXITCODE"
        }
    }

    $pythonResult = & $PythonPath $scriptPath `
        --input $PatientInsightsPath `
        --output $OutputPath `
        --feature-output $FeatureImportancePath `
        --summary-output $SummaryPath 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "SHAP generation failed with exit code $LASTEXITCODE"
    }
    $pythonSucceeded = $true
}
catch {
    $pythonFailureReason = $_.Exception.Message
    if (-not $AllowFallback) {
        throw
    }
    Write-Warning "SHAP python path failed. Generating deterministic fallback outputs. Reason: $pythonFailureReason"
    New-FallbackShapOutputs `
        -InputPath $PatientInsightsPath `
        -ShapPath $OutputPath `
        -FeaturePath $FeatureImportancePath `
        -MarkdownPath $SummaryPath `
        -FailureReason $pythonFailureReason
}

Write-Host "Command center SHAP explanations written to: $OutputPath"
Write-Host "Feature importance written to: $FeatureImportancePath"
Write-Host "Summary written to: $SummaryPath"
if ($pythonSucceeded -and $pythonResult) {
    Write-Host "Model run summary: $pythonResult"
}
if (-not $pythonSucceeded) {
    Write-Host 'Model run summary: {"status":"fallback","model":"HeuristicFallbackNoShap"}'
}


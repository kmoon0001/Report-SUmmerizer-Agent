param(
    [string]$ProjectRoot = 'D:\SNF AI Dashboard',
    [string]$MirrorRoot = 'D:\my agents copilot studio\SNF Dashboard'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$projectWorkflows = Join-Path $ProjectRoot 'workflows'
$mirrorWorkflows = Join-Path $MirrorRoot 'workflows'

if (-not (Test-Path -LiteralPath $projectWorkflows)) {
    throw "Project workflows folder not found: $projectWorkflows"
}
if (-not (Test-Path -LiteralPath $mirrorWorkflows)) {
    throw "Mirror workflows folder not found: $mirrorWorkflows"
}

$requiredFolders = @(
    'SNF-Command-Center-GenerateOnDemandPatientInsight-c147cf4b-777b-43b5-8d4a-e00e0c233b49',
    'SNF-Command-Center-SendClinicalAlert-18c14215-a5d0-4570-be82-3047d5fd0b22',
    'SNF-Command-Center-GenerateQualityMeasureReport-c2ed03e7-6fe4-44b3-a219-25d20cc36548',
    'SNF-Command-Center-ProcessClinicalFileIntake-bc1d9296-6ea5-4112-8e67-3a901196252c',
    'SNF-Command-Center-ProcessClinicalImageReview-5e616864-234a-44c7-adb6-748cf1f146df'
)

$restored = New-Object System.Collections.Generic.List[string]
$alreadyPresent = New-Object System.Collections.Generic.List[string]

foreach ($folder in $requiredFolders) {
    $target = Join-Path $projectWorkflows $folder
    if (Test-Path -LiteralPath $target) {
        $alreadyPresent.Add($folder) | Out-Null
        continue
    }

    $source = Join-Path $mirrorWorkflows $folder
    if (-not (Test-Path -LiteralPath $source)) {
        throw "Missing folder in mirror path: $source"
    }

    Copy-Item -LiteralPath $source -Destination $target -Recurse -Force
    $restored.Add($folder) | Out-Null
}

Write-Host "Workflow restore complete."
Write-Host "Restored count: $($restored.Count)"
if ($restored.Count -gt 0) {
    Write-Host "Restored folders:"
    $restored | ForEach-Object { Write-Host "- $_" }
}
Write-Host "Already present count: $($alreadyPresent.Count)"

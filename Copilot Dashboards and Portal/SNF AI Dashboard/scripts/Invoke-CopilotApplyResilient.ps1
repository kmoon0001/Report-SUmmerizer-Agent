param(
    [string]$ProjectRoot = 'D:\SNF AI Dashboard',
    [int]$RetryCount = 3,
    [int]$PostApplyWaitSeconds = 8
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$restoreScript = Join-Path $ProjectRoot 'scripts\Restore-WorkflowFoldersFromMirror.ps1'
$validateScript = Join-Path $ProjectRoot 'scripts\Validate-SnfAiDashboardProject.ps1'
$resetCacheScript = Join-Path $ProjectRoot 'scripts\Reset-CopilotStudioWorkspaceCache.ps1'

if (-not (Test-Path -LiteralPath $restoreScript)) {
    throw "Missing script: $restoreScript"
}
if (-not (Test-Path -LiteralPath $validateScript)) {
    throw "Missing script: $validateScript"
}
if (-not (Test-Path -LiteralPath $resetCacheScript)) {
    throw "Missing script: $resetCacheScript"
}

for ($attempt = 1; $attempt -le $RetryCount; $attempt++) {
    Write-Host "=== Resilient Apply Attempt $attempt of $RetryCount ==="

    & $restoreScript

    try {
        & $validateScript | Out-Null
    }
    catch {
        Write-Warning "Validation failed before Apply on attempt $attempt."
        if ($attempt -eq $RetryCount) { throw }
        continue
    }

    & $resetCacheScript

    Start-Process 'vscode://command/microsoft-copilot-studio.getChanges'
    Start-Sleep -Seconds 2
    Start-Process 'vscode://command/microsoft-copilot-studio.previewChanges'
    Start-Sleep -Seconds 2
    Start-Process 'vscode://command/microsoft-copilot-studio.applyChanges'
    Start-Sleep -Seconds $PostApplyWaitSeconds

    & $restoreScript
    try {
        & $validateScript | Out-Null
        Write-Host "Resilient apply attempt $attempt finished with clean validation."
        exit 0
    }
    catch {
        Write-Warning "Validation failed after Apply on attempt $attempt."
        if ($attempt -eq $RetryCount) { throw }
    }
}

throw "Resilient apply did not converge after $RetryCount attempts."

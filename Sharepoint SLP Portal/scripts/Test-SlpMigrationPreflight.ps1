Param(
    [string]$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
)

$ErrorActionPreference = "Stop"

function Add-Result {
    Param(
        [string]$Name,
        [bool]$Passed,
        [string]$Detail
    )
    [PSCustomObject]@{
        Check  = $Name
        Status = if ($Passed) { "PASS" } else { "FAIL" }
        Detail = $Detail
    }
}

$results = @()

$requiredFiles = @(
    "docs/sharepoint-migration-matrix.md",
    "docs/contracts/sharepoint-list-schemas.json"
)

foreach ($relPath in $requiredFiles) {
    $absPath = Join-Path $ProjectRoot $relPath
    $exists = Test-Path -LiteralPath $absPath
    $results += Add-Result -Name "File: $relPath" -Passed $exists -Detail $(if ($exists) { "Found" } else { "Missing" })
}

$commands = @("node", "npm", "pac")
foreach ($cmd in $commands) {
    $exists = $null -ne (Get-Command $cmd -ErrorAction SilentlyContinue)
    $results += Add-Result -Name "Command: $cmd" -Passed $exists -Detail $(if ($exists) { "Available" } else { "Not found in PATH" })
}

$venvCandidates = @(
    (Join-Path $ProjectRoot ".venv\Scripts\python.exe"),
    (Join-Path (Split-Path $ProjectRoot -Parent) ".venv\Scripts\python.exe")
)
$venvPath = $venvCandidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
$venvExists = $null -ne $venvPath
$results += Add-Result -Name "Python venv" -Passed $venvExists -Detail $(if ($venvExists) { $venvPath } else { "Missing .venv python executable (repo or workspace root)" })

$pacAuthOk = $false
$pacAuthDetail = "Skipped (pac not installed)"
if ($null -ne (Get-Command pac -ErrorAction SilentlyContinue)) {
    try {
        $authOutput = & pac auth list 2>&1
        $pacAuthOk = $LASTEXITCODE -eq 0
        $pacAuthDetail = if ($pacAuthOk) { "pac auth list succeeded" } else { "pac auth list failed: $authOutput" }
    } catch {
        $pacAuthOk = $false
        $pacAuthDetail = "pac auth list exception: $($_.Exception.Message)"
    }
}
$results += Add-Result -Name "PAC auth" -Passed $pacAuthOk -Detail $pacAuthDetail

Write-Host ""
Write-Host "SLP Migration Preflight" -ForegroundColor Cyan
Write-Host "Project: $ProjectRoot"
Write-Host ""
$results | Format-Table -AutoSize

$failed = @($results | Where-Object { $_.Status -eq "FAIL" })
Write-Host ""
if ($failed.Count -gt 0) {
    Write-Host "Preflight failed: $($failed.Count) check(s) need attention." -ForegroundColor Red
    exit 1
}

Write-Host "Preflight passed." -ForegroundColor Green
exit 0

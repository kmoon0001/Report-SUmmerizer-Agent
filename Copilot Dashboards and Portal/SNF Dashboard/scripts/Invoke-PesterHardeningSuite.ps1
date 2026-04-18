param(
    [string]$TestsPath = 'D:\my agents copilot studio\SNF Dashboard\tests',
    [switch]$FailIfPesterMissing = $false
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath $TestsPath)) {
    throw "Tests path not found: $TestsPath"
}

$pesterCommand = Get-Command Invoke-Pester -ErrorAction SilentlyContinue
if ($null -eq $pesterCommand) {
    if ($FailIfPesterMissing) {
        throw 'Pester is not installed. Install-Module Pester -Scope CurrentUser'
    }

    Write-Host 'Pester not installed; hardening suite skipped.'
    return
}

$tests = @(Get-ChildItem -LiteralPath $TestsPath -Filter '*.Tests.ps1' -File)
if ($tests.Count -eq 0) {
    throw "No Pester tests found in: $TestsPath"
}

$parameterNames = @($pesterCommand.Parameters.Keys)
if ($parameterNames -contains 'Path') {
    $paths = @($tests | Select-Object -ExpandProperty FullName)
    $result = Invoke-Pester -Path $paths -PassThru
}
else {
    $result = Invoke-Pester -Script $tests.FullName -PassThru
}

if ($result.FailedCount -gt 0) {
    throw "Pester hardening suite failed. FailedCount=$($result.FailedCount)"
}

Write-Host "Pester hardening suite passed. Tests=$($result.TotalCount)"


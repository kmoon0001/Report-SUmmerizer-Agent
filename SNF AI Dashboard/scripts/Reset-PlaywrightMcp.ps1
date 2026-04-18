Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$profileRoots = @(
    'D:\SNF AI Dashboard\.playwright-mcp',
    'D:\my agents copilot studio\.playwright-mcp'
)

foreach ($root in $profileRoots) {
    if (-not (Test-Path -LiteralPath $root)) {
        New-Item -ItemType Directory -Path $root -Force | Out-Null
    }

    $profilePath = Join-Path $root 'profile'
    if (-not (Test-Path -LiteralPath $profilePath)) {
        New-Item -ItemType Directory -Path $profilePath -Force | Out-Null
    }
}

$playwrightProcesses = Get-CimInstance Win32_Process |
    Where-Object {
        $_.Name -match '^node(\.exe)?$' -and
        $_.CommandLine -and
        $_.CommandLine -match '@playwright/mcp'
    }

foreach ($process in $playwrightProcesses) {
    try {
        Stop-Process -Id $process.ProcessId -Force -ErrorAction Stop
        Write-Host "Stopped Playwright MCP process $($process.ProcessId)"
    }
    catch {
        Write-Warning "Could not stop Playwright MCP process $($process.ProcessId): $($_.Exception.Message)"
    }
}

Write-Host 'Playwright MCP profile directories are ready.'
Write-Host 'Next step: reload VS Code so MCP restarts with the persisted profile.'

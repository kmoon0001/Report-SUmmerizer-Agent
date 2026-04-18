param(
    [ValidateSet('Headless', 'Headed')]
    [string]$Mode = 'Headless',
    [string]$McpPath = 'D:\SNF AI Dashboard\.vscode\mcp.json'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath $McpPath)) {
    throw "MCP profile not found: $McpPath"
}

$json = Get-Content -LiteralPath $McpPath -Raw | ConvertFrom-Json
if ($null -eq $json.servers -or $null -eq $json.servers.playwright) {
    throw "Playwright MCP server entry is missing in: $McpPath"
}

$args = @($json.servers.playwright.args)
$headlessIndex = -1
for ($i = 0; $i -lt $args.Count; $i++) {
    if ([string]$args[$i] -eq '--headless') {
        $headlessIndex = $i
        break
    }
}

if ($Mode -eq 'Headless' -and $headlessIndex -lt 0) {
    $args += '--headless'
}
elseif ($Mode -eq 'Headed' -and $headlessIndex -ge 0) {
    $args = @($args | Where-Object { [string]$_ -ne '--headless' })
}

$json.servers.playwright.args = $args

$backupPath = "$McpPath.bak"
Copy-Item -LiteralPath $McpPath -Destination $backupPath -Force

$json | ConvertTo-Json -Depth 20 | Set-Content -LiteralPath $McpPath -Encoding UTF8

Write-Host "Updated Playwright MCP mode to: $Mode"
Write-Host "MCP profile: $McpPath"
Write-Host "Backup created: $backupPath"
Write-Host "Reload VS Code (or restart MCP hosts) so the change takes effect."

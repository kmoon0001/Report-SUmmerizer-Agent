param(
    [string]$ProjectRoot = 'D:\SNF AI Dashboard',
    [string]$SourceMcpPath = 'D:\SNF AI Dashboard\.vscode\mcp.json',
    [string]$OutputRoot = 'D:\SNF AI Dashboard\data\exports\mcp-profiles\current',
    [switch]$WriteProjectFiles
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Convert-ToMcpServersShape {
    param(
        [pscustomobject]$Servers
    )

    $mcpServers = [ordered]@{}
    foreach ($property in $Servers.PSObject.Properties) {
        $name = [string]$property.Name
        $server = $property.Value
        $type = [string]$server.type

        if ($type -eq 'stdio') {
            $entry = [ordered]@{
                type = 'stdio'
                command = [string]$server.command
            }
            if ($server.PSObject.Properties.Name -contains 'args' -and $null -ne $server.args) {
                $entry.args = @($server.args)
            }
            if ($server.PSObject.Properties.Name -contains 'env' -and $null -ne $server.env) {
                $entry.env = $server.env
            }
            $mcpServers[$name] = $entry
            continue
        }

        if ($type -eq 'http' -or $type -eq 'sse') {
            $entry = [ordered]@{
                type = $type
                url = [string]$server.url
            }
            if ($server.PSObject.Properties.Name -contains 'headers' -and $null -ne $server.headers) {
                $entry.headers = $server.headers
            }
            $mcpServers[$name] = $entry
            continue
        }

        # Preserve unknown types as-is for forward compatibility.
        $mcpServers[$name] = $server
    }

    return $mcpServers
}

if (-not (Test-Path -LiteralPath $SourceMcpPath)) {
    throw "Source MCP profile not found: $SourceMcpPath"
}

$source = Get-Content -LiteralPath $SourceMcpPath -Raw | ConvertFrom-Json
if ($null -eq $source.servers) {
    throw "Source MCP profile is missing 'servers': $SourceMcpPath"
}

$servers = $source.servers
$mcpServers = Convert-ToMcpServersShape -Servers $servers

if (-not (Test-Path -LiteralPath $OutputRoot)) {
    New-Item -ItemType Directory -Path $OutputRoot -Force | Out-Null
}

$cursorOutputPath = Join-Path $OutputRoot 'cursor.mcp.json'
$kiroOutputPath = Join-Path $OutputRoot 'kiro.mcp.json'
$antigravityOutputPath = Join-Path $OutputRoot 'antigravity.mcp.json'
$claudeOutputPath = Join-Path $OutputRoot 'claude-code.mcp.json'
$continueOutputPath = Join-Path $OutputRoot 'continue.mcp.json'
$clineOutputPath = Join-Path $OutputRoot 'cline_mcp_settings.json'
$readmeOutputPath = Join-Path $OutputRoot 'README.md'

([ordered]@{ servers = $servers } | ConvertTo-Json -Depth 10) | Set-Content -LiteralPath $cursorOutputPath -Encoding UTF8
([ordered]@{ mcpServers = $mcpServers } | ConvertTo-Json -Depth 10) | Set-Content -LiteralPath $kiroOutputPath -Encoding UTF8
([ordered]@{ mcpServers = $mcpServers } | ConvertTo-Json -Depth 10) | Set-Content -LiteralPath $antigravityOutputPath -Encoding UTF8
([ordered]@{ mcpServers = $mcpServers } | ConvertTo-Json -Depth 10) | Set-Content -LiteralPath $claudeOutputPath -Encoding UTF8
([ordered]@{ mcpServers = $mcpServers } | ConvertTo-Json -Depth 10) | Set-Content -LiteralPath $continueOutputPath -Encoding UTF8
([ordered]@{ mcpServers = $mcpServers } | ConvertTo-Json -Depth 10) | Set-Content -LiteralPath $clineOutputPath -Encoding UTF8

$readmeLines = @(
    '# Cross-IDE MCP Profiles',
    '',
    ('Generated: {0}' -f (Get-Date).ToString('yyyy-MM-dd HH:mm:ss')),
    '',
    'Files:',
    '- `cursor.mcp.json` (Cursor IDE/CLI profile using `servers` shape)',
    '- `kiro.mcp.json` (Kiro profile using `mcpServers` shape)',
    '- `antigravity.mcp.json` (Antigravity/Gemini CLI style `mcpServers` profile)',
    '- `claude-code.mcp.json` (Claude Code `.mcp.json` shape)',
    '- `continue.mcp.json` (Continue MCP server shape)',
    '- `cline_mcp_settings.json` (Cline MCP settings shape)',
    '',
    'Notes:',
    '- These files are generated from `.vscode/mcp.json` to keep one source of truth.',
    '- Review local paths, credentials, and tenant-specific URLs before using outside this workspace.'
)
$readmeLines -join [Environment]::NewLine | Set-Content -LiteralPath $readmeOutputPath -Encoding UTF8

if ($WriteProjectFiles) {
    $projectCursorPath = Join-Path $ProjectRoot 'mcp.json'
    $projectClaudePath = Join-Path $ProjectRoot '.mcp.json'
    $projectKiroDir = Join-Path $ProjectRoot '.kiro\settings'
    $projectKiroPath = Join-Path $projectKiroDir 'mcp.json'
    $projectAntigravityDir = Join-Path $ProjectRoot '.antigravity'
    $projectAntigravityPath = Join-Path $projectAntigravityDir 'mcp_config.json'
    $projectContinueDir = Join-Path $ProjectRoot '.continue\mcpServers'
    $projectContinuePath = Join-Path $projectContinueDir 'mcp.json'
    $projectClineDir = Join-Path $ProjectRoot '.cline'
    $projectClinePath = Join-Path $projectClineDir 'cline_mcp_settings.json'

    ([ordered]@{ servers = $servers } | ConvertTo-Json -Depth 10) | Set-Content -LiteralPath $projectCursorPath -Encoding UTF8
    ([ordered]@{ mcpServers = $mcpServers } | ConvertTo-Json -Depth 10) | Set-Content -LiteralPath $projectClaudePath -Encoding UTF8

    if (-not (Test-Path -LiteralPath $projectKiroDir)) {
        New-Item -ItemType Directory -Path $projectKiroDir -Force | Out-Null
    }
    ([ordered]@{ mcpServers = $mcpServers } | ConvertTo-Json -Depth 10) | Set-Content -LiteralPath $projectKiroPath -Encoding UTF8

    if (-not (Test-Path -LiteralPath $projectAntigravityDir)) {
        New-Item -ItemType Directory -Path $projectAntigravityDir -Force | Out-Null
    }
    ([ordered]@{ mcpServers = $mcpServers } | ConvertTo-Json -Depth 10) | Set-Content -LiteralPath $projectAntigravityPath -Encoding UTF8

    if (-not (Test-Path -LiteralPath $projectContinueDir)) {
        New-Item -ItemType Directory -Path $projectContinueDir -Force | Out-Null
    }
    ([ordered]@{ mcpServers = $mcpServers } | ConvertTo-Json -Depth 10) | Set-Content -LiteralPath $projectContinuePath -Encoding UTF8

    if (-not (Test-Path -LiteralPath $projectClineDir)) {
        New-Item -ItemType Directory -Path $projectClineDir -Force | Out-Null
    }
    ([ordered]@{ mcpServers = $mcpServers } | ConvertTo-Json -Depth 10) | Set-Content -LiteralPath $projectClinePath -Encoding UTF8
}

Write-Host "Generated cross-IDE MCP profiles in: $OutputRoot"
if ($WriteProjectFiles) {
    Write-Host 'Project-level files updated: mcp.json, .mcp.json, .kiro\\settings\\mcp.json, .antigravity\\mcp_config.json, .continue\\mcpServers\\mcp.json, .cline\\cline_mcp_settings.json'
}

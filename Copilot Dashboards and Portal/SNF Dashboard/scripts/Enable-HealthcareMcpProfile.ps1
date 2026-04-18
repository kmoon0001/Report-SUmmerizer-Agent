param(
  [switch]$Force
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$workspaceRoot = Split-Path -Parent $PSScriptRoot
$source = Join-Path $workspaceRoot ".vscode\mcp.healthcare.template.json"
$target = Join-Path $workspaceRoot ".vscode\mcp.json"

if (-not (Test-Path $source)) {
  throw "Healthcare MCP template not found: $source"
}

if ((Test-Path $target) -and -not $Force) {
  throw "Target exists: $target. Re-run with -Force after reviewing tenant-specific MCP commands."
}

if (Test-Path $target) {
  $backupPath = "$target.bak"
  Copy-Item -LiteralPath $target -Destination $backupPath -Force
  Write-Host "Backed up existing MCP config to $backupPath"
}

Copy-Item -LiteralPath $source -Destination $target -Force
Write-Host "Copied healthcare MCP template to $target"
Write-Host "Review tenant-specific URLs, Dataverse org URL, FHIR/AHDS endpoints, and any workflow-engine commands before enabling the full healthcare profile."

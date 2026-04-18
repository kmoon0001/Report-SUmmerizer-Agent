<#
.SYNOPSIS
    Copy hardened MCP configuration to another directory
.DESCRIPTION
    Copies the enhanced, hardened MCP configuration to another project
    and automatically updates workspace paths
.EXAMPLE
    .\Copy-HardenedMCP-ToOtherDir.ps1 -DestinationPath "D:\other-project"
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$DestinationPath,
    
    [Parameter()]
    [switch]$IncludeAutomationScripts
)

$ErrorActionPreference = "Stop"

Write-Host "=== Copying Hardened MCP Configuration ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Source: $PWD" -ForegroundColor Yellow
Write-Host "Destination: $DestinationPath" -ForegroundColor Yellow
Write-Host ""

# Validate destination
if (-not (Test-Path $DestinationPath)) {
    Write-Error "Destination path does not exist: $DestinationPath"
    exit 1
}

# Create .kiro/settings directory if it doesn't exist
$destKiroSettings = Join-Path $DestinationPath ".kiro/settings"
New-Item -ItemType Directory -Force -Path $destKiroSettings | Out-Null

# Copy enhanced MCP config
Write-Host "[1/4] Copying hardened MCP configuration..." -ForegroundColor Green

$sourceConfig = ".kiro/settings/mcp-enhanced.json"
$destConfig = Join-Path $destKiroSettings "mcp.json"

if (Test-Path $sourceConfig) {
    Copy-Item $sourceConfig $destConfig -Force
    Write-Host "  ✓ Copied: mcp-enhanced.json → mcp.json" -ForegroundColor Cyan
}
else {
    Write-Error "Source config not found: $sourceConfig"
    exit 1
}

# Update workspace paths
Write-Host ""
Write-Host "[2/4] Updating workspace paths..." -ForegroundColor Green

$config = Get-Content $destConfig -Raw
$oldPath = $PWD.Path -replace '\\', '\\\\'
$newPath = (Resolve-Path $DestinationPath).Path -replace '\\', '\\\\'

$config = $config -replace [regex]::Escape($oldPath), $newPath
$config | Set-Content $destConfig

Write-Host "  ✓ Updated paths from:" -ForegroundColor Cyan
Write-Host "    $($PWD.Path)" -ForegroundColor White
Write-Host "  ✓ To:" -ForegroundColor Cyan
Write-Host "    $DestinationPath" -ForegroundColor White

# Copy automation scripts (optional)
if ($IncludeAutomationScripts) {
    Write-Host ""
    Write-Host "[3/4] Copying automation scripts..." -ForegroundColor Green
    
    $destScripts = Join-Path $DestinationPath "scripts"
    New-Item -ItemType Directory -Force -Path $destScripts | Out-Null
    
    $scriptsToCopy = @(
        "scripts/Make-And-Publish.ps1",
        "scripts/Automate-AgentLifecycle.ps1",
        "scripts/Harden-Agent.ps1",
        "scripts/Sync-MicrosoftLearnDocs.ps1"
    )
    
    foreach ($script in $scriptsToCopy) {
        if (Test-Path $script) {
            $destScript = Join-Path $destScripts (Split-Path $script -Leaf)
            Copy-Item $script $destScript -Force
            Write-Host "  ✓ Copied: $(Split-Path $script -Leaf)" -ForegroundColor Cyan
        }
    }
    
    # Copy universal auto-publish
    if (Test-Path "UNIVERSAL-AUTO-PUBLISH.ps1") {
        Copy-Item "UNIVERSAL-AUTO-PUBLISH.ps1" $DestinationPath -Force
        Write-Host "  ✓ Copied: UNIVERSAL-AUTO-PUBLISH.ps1" -ForegroundColor Cyan
    }
}
else {
    Write-Host ""
    Write-Host "[3/4] Skipping automation scripts (use -IncludeAutomationScripts to copy)" -ForegroundColor Yellow
}

# Create summary
Write-Host ""
Write-Host "[4/4] Creating configuration summary..." -ForegroundColor Green

$summary = @"
# Hardened MCP Configuration Summary
Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
Source: $($PWD.Path)
Destination: $DestinationPath

## What Was Copied

✅ Hardened MCP configuration (.kiro/settings/mcp.json)
$(if ($IncludeAutomationScripts) { "✅ Automation scripts (scripts/*.ps1)" } else { "⏸️ Automation scripts (not copied)" })

## Security Features Included

### Auto-Approve Lists
- Filesystem: read_file, read_multiple_files, list_directory, get_file_info
- Git: git_status, git_diff, git_log
- Memory: create_entities, add_observations, search_nodes
- Playwright: browser_navigate, browser_snapshot, browser_click
- GitHub: search_repositories, get_file_contents, list_commits

### Input Validation
- Max input length: 2000 characters
- Blocked patterns: SQL injection, XSS, script injection
- HTML sanitization enabled
- Special character escaping enabled

### PHI/PII Protection
- Detection patterns: SSN, MRN, DOB
- Redaction in logs: Enabled
- Secure workflow required: Yes

### Rate Limiting
- Max requests per hour: 100
- Max concurrent sessions: 10
- Bulk export throttling: Enabled

### Audit Logging
- PHI access logging: Enabled
- Action plan logging: Enabled
- Flow invocation logging: Enabled
- Retention: 7 years (2555 days)

### Quality Gates
- YAML validation
- HITL requirement check
- HIPAA compliance check
- Error handling verification
- Documentation freshness check
- Minimum passing score: 80%

## Next Steps

1. Review the configuration:
   code "$destConfig"

2. Customize for your project:
   - Update compliance requirements
   - Adjust rate limits
   - Configure notifications

3. Test the configuration:
   # Restart Kiro or reload MCP servers

$(if ($IncludeAutomationScripts) {
@"
4. Start automatic mode:
   cd "$DestinationPath"
   .\UNIVERSAL-AUTO-PUBLISH.ps1
"@
})

## Documentation

- Full hardening guide: HARDENING-PROMPT-TEMPLATE.md
- MCP configuration: .kiro/settings/mcp.json
- Auto-update mechanisms: AUTO-UPDATE-MECHANISMS.md

"@

$summaryPath = Join-Path $DestinationPath "MCP-HARDENING-SUMMARY.md"
$summary | Set-Content $summaryPath

Write-Host "  ✓ Summary saved: MCP-HARDENING-SUMMARY.md" -ForegroundColor Cyan

# Final summary
Write-Host ""
Write-Host "=== Copy Complete! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Hardened MCP configuration copied to:" -ForegroundColor Yellow
Write-Host "  $destConfig" -ForegroundColor Cyan
Write-Host ""
Write-Host "Security features included:" -ForegroundColor Yellow
Write-Host "  ✓ Auto-approve lists (safe operations)" -ForegroundColor Cyan
Write-Host "  ✓ Input validation (SQL injection, XSS)" -ForegroundColor Cyan
Write-Host "  ✓ PHI/PII protection" -ForegroundColor Cyan
Write-Host "  ✓ Rate limiting" -ForegroundColor Cyan
Write-Host "  ✓ Audit logging (7-year retention)" -ForegroundColor Cyan
Write-Host "  ✓ Quality gates" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Review: code `"$destConfig`"" -ForegroundColor White
Write-Host "  2. Customize for your project needs" -ForegroundColor White
Write-Host "  3. Restart Kiro or reload MCP servers" -ForegroundColor White
if ($IncludeAutomationScripts) {
    Write-Host "  4. Start automatic mode: cd `"$DestinationPath`"; .\UNIVERSAL-AUTO-PUBLISH.ps1" -ForegroundColor White
}
Write-Host ""
Write-Host "Read the summary: $summaryPath" -ForegroundColor Cyan
Write-Host ""

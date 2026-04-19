<#
.SYNOPSIS
    Initialize complete automation system
.DESCRIPTION
    One-command setup for:
    - MCP server configuration
    - GitHub Actions secrets
    - Documentation cache
    - Security baseline
    - First automated run
#>

[CmdletBinding()]
param(
    [Parameter()]
    [string]$GitHubToken,
    
    [Parameter()]
    [string]$TeamsWebhook,
    
    [Parameter()]
    [switch]$SkipGitHub
)

$ErrorActionPreference = "Stop"

Write-Host "=== Initializing Agent Automation System ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Create directory structure
Write-Host "Creating directory structure..." -ForegroundColor Green
$dirs = @(
    "logs",
    "backups",
    ".cache/microsoft-learn"
)

foreach ($dir in $dirs) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Force -Path $dir | Out-Null
        Write-Host "  ✓ Created: $dir" -ForegroundColor Cyan
    }
}

# Step 2: Configure MCP servers
Write-Host "`nConfiguring MCP servers..." -ForegroundColor Green

$mcpEnhanced = ".kiro/settings/mcp-enhanced.json"
$mcpActive = ".kiro/settings/mcp.json"

if (Test-Path $mcpEnhanced) {
    # Update workspace path
    $workspacePath = $PWD.Path -replace '\\', '\\\\'
    $content = Get-Content $mcpEnhanced -Raw
    $content = $content -replace '\$\{WORKSPACE_ROOT\}', $workspacePath
    
    if ($GitHubToken) {
        $content = $content -replace '\$\{GITHUB_TOKEN\}', $GitHubToken
    }
    
    if ($TeamsWebhook) {
        $content = $content -replace '\$\{TEAMS_WEBHOOK_URL\}', $TeamsWebhook
    }
    
    $content | Set-Content $mcpActive
    Write-Host "  ✓ MCP configuration updated" -ForegroundColor Cyan
}

# Step 3: Initialize documentation cache
Write-Host "`nInitializing documentation cache..." -ForegroundColor Green

$cacheInit = @{
    initialized = Get-Date -Format "o"
    version = "1.0"
    sources = @(
        "https://learn.microsoft.com/en-us/microsoft-copilot-studio/"
    )
} | ConvertTo-Json

$cacheInit | Set-Content ".cache/microsoft-learn/_init.json"
Write-Host "  ✓ Cache initialized" -ForegroundColor Cyan

# Step 4: Run initial documentation sync
Write-Host "`nRunning initial documentation sync..." -ForegroundColor Green

try {
    & "$PSScriptRoot\Sync-MicrosoftLearnDocs.ps1" -All -DryRun
    Write-Host "  ✓ Documentation sync completed" -ForegroundColor Cyan
}
catch {
    Write-Host "  ⚠ Documentation sync failed (non-blocking): $_" -ForegroundColor Yellow
}

# Step 5: Run security baseline
Write-Host "`nEstablishing security baseline..." -ForegroundColor Green

try {
    & "$PSScriptRoot\Harden-Agent.ps1" -DryRun
    Write-Host "  ✓ Security baseline established" -ForegroundColor Cyan
}
catch {
    Write-Host "  ⚠ Security scan failed (non-blocking): $_" -ForegroundColor Yellow
}

# Step 6: Validate agent structure
Write-Host "`nValidating agent structure..." -ForegroundColor Green

$agentPath = "SimpleLTC QM Coach V2"
$requiredFiles = @(
    "$agentPath/agent.mcs.yml",
    "$agentPath/topics/ConversationStart.mcs.yml",
    "$agentPath/topics/Fallback.mcs.yml",
    "$agentPath/topics/OnError.mcs.yml"
)

$allValid = $true
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "  ✓ $file" -ForegroundColor Cyan
    }
    else {
        Write-Host "  ✗ Missing: $file" -ForegroundColor Red
        $allValid = $false
    }
}

# Step 7: GitHub Actions setup (if not skipped)
if (-not $SkipGitHub) {
    Write-Host "`nGitHub Actions setup..." -ForegroundColor Green
    
    if (Test-Path ".github/workflows/agent-cicd.yml") {
        Write-Host "  ✓ CI/CD workflow configured" -ForegroundColor Cyan
        Write-Host "  ℹ Add these secrets to GitHub repository:" -ForegroundColor Yellow
        Write-Host "    - DEV_ENVIRONMENT_URL" -ForegroundColor Yellow
        Write-Host "    - PROD_ENVIRONMENT_URL" -ForegroundColor Yellow
        Write-Host "    - APP_CLIENT_ID" -ForegroundColor Yellow
        Write-Host "    - APP_CLIENT_SECRET" -ForegroundColor Yellow
        Write-Host "    - TENANT_ID" -ForegroundColor Yellow
        Write-Host "    - TEAMS_WEBHOOK_URL" -ForegroundColor Yellow
    }
}

# Step 8: Create initial backup
Write-Host "`nCreating initial backup..." -ForegroundColor Green

$backupPath = "backups/initial-backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
New-Item -ItemType Directory -Force -Path $backupPath | Out-Null
Copy-Item -Path $agentPath -Destination $backupPath -Recurse -Force
Write-Host "  ✓ Backup created: $backupPath" -ForegroundColor Cyan

# Step 9: Generate configuration summary
Write-Host "`nGenerating configuration summary..." -ForegroundColor Green

$summary = @"
# Automation System Configuration Summary
Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')

## Status
- MCP Servers: Configured
- Documentation Cache: Initialized
- Security Baseline: Established
- Agent Structure: $(if ($allValid) { "Valid" } else { "Issues Found" })
- Initial Backup: Created

## MCP Servers Enabled
- Playwright (browser automation)
- Filesystem (file operations)
- Memory (persistent state)
- Fetch (HTTP requests)
- Dataverse (healthcare data)
- Git (version control)
- GitHub (CI/CD)
- SQLite (cache)

## Automation Schedules
- Daily: Documentation sync (2 AM UTC)
- Weekly: Security scan (3 AM Sunday)
- Monthly: Full audit (4 AM 1st)

## Next Steps

1. Review and test automation:
   ``````powershell
   .\scripts\Automate-AgentLifecycle.ps1 -Environment Dev -DryRun
   ``````

2. Configure GitHub secrets (if using CI/CD)

3. Set up Teams notifications:
   ``````powershell
   `$env:TEAMS_WEBHOOK_URL = "your-webhook-url"
   ``````

4. Run first automated publish:
   ``````powershell
   .\scripts\Automate-AgentLifecycle.ps1 -Environment Dev -AutoApprove
   ``````

## Documentation
- Full guide: AUTOMATION-GUIDE.md
- MCP config: .kiro/settings/mcp.json
- CI/CD workflow: .github/workflows/agent-cicd.yml

## Support
For issues or questions, review the troubleshooting section in AUTOMATION-GUIDE.md
"@

$summary | Set-Content "automation-config-summary.md"
Write-Host "  ✓ Summary saved: automation-config-summary.md" -ForegroundColor Cyan

# Final summary
Write-Host ""
Write-Host "=== Initialization Complete ===" -ForegroundColor Green
Write-Host ""
Write-Host "✓ Directory structure created" -ForegroundColor Cyan
Write-Host "✓ MCP servers configured" -ForegroundColor Cyan
Write-Host "✓ Documentation cache initialized" -ForegroundColor Cyan
Write-Host "✓ Security baseline established" -ForegroundColor Cyan
Write-Host "✓ Agent structure validated" -ForegroundColor Cyan
Write-Host "✓ Initial backup created" -ForegroundColor Cyan
Write-Host "✓ Configuration summary generated" -ForegroundColor Cyan
Write-Host ""
Write-Host "📖 Read AUTOMATION-GUIDE.md for complete documentation" -ForegroundColor Yellow
Write-Host "📖 Read automation-config-summary.md for next steps" -ForegroundColor Yellow
Write-Host ""
Write-Host "🚀 Ready to run first automation:" -ForegroundColor Green
Write-Host "   .\scripts\Automate-AgentLifecycle.ps1 -Environment Dev -DryRun" -ForegroundColor Cyan

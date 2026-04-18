# Fleet_Nuclear_Cleanup.ps1
# Purges all obsolete diagnostic files, legacy backups, and confusing artifacts.

$obsoletePatterns = @(
    "Fix-*.ps1", "Patch-*.ps1", "*fix*.md", "*status*.md", "*plan*.md",
    "AGENTS.md", "AGENT-*.md", "ERROR-HANDLING-*.md", "*IMPLEMENTATION*.md",
    "*SUMMARY.md", "diagnostic.ps1", "prepare_orch.ps1", "restore_tools.ps1"
)

Get-ChildItem -Directory | ForEach-Object {
    $agentFolder = $_.FullName
    Write-Host "Cleaning Agent: $($_.Name)..." -ForegroundColor Cyan
    
    # 1. Remove Legacy Folders
    $legacy = Join-Path $agentFolder "scripts\legacy"
    if (Test-Path $legacy) { Remove-Item $legacy -Recurse -Force; Write-Host "  - Purged /scripts/legacy" }
    
    # 2. Remove Obsolete Root Files in Agent
    foreach ($pattern in $obsoletePatterns) {
        Remove-Item (Join-Path $agentFolder $pattern) -Force -ErrorAction SilentlyContinue
    }
    
    # 3. Specific Cleanup for TheraDoc (Removed old exported_agent.yaml if it's confusing)
    # (Decision: Keep it for now as it's a huge source file, only remove if user asked)
}

# 4. Root Workspace Cleanup
Write-Host "Cleaning Workspace Root..." -ForegroundColor Yellow
Remove-Item "D:\my agents copilot studio\scripts\Global_Fleet_Harden.ps1" -Force -ErrorAction SilentlyContinue
Remove-Item "D:\my agents copilot studio\scripts\Global_Fleet_Platinum_Upgrade.ps1" -Force -ErrorAction SilentlyContinue
Remove-Item "D:\my agents copilot studio\scripts\Global_Fleet_Localization.ps1" -Force -ErrorAction SilentlyContinue
Remove-Item "D:\my agents copilot studio\package-lock.json" -Force -ErrorAction SilentlyContinue

Write-Host "`nFLEET CLEANUP COMPLETE. Repository is now surgically pure." -ForegroundColor Green

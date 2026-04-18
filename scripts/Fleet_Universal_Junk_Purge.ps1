# Fleet_Universal_Junk_Purge.ps1
# A deep-cleaning loop for ALL agent folders and root workspace.

$junkPatterns = @(
    "*.log", "*.tmp", "*.temp", "*.bak", "*.old",
    "*_backup", "*_copy", "*_v1", "*_v2_attempt*",
    "check_zip_*", "deploy_hardened_*", "extracted_*",
    "unpacked_*", "solution_unpacked", "atomic_migration",
    "final_audit", "audit_flow_status", "diagnostic.ps1",
    "generate_payloads.ps1", "fix_*.ps1", "Patch-*.ps1",
    "nuclear_*.ps1", "apply_*.ps1", "Carrier_Solution_*.zip",
    "full_components.txt", "scratch_*.txt", "tall-viewport.md",
    "after-*.png", "before-*.png", "canvas-*.png", "screenshot*.png",
    "*-screenshot.png", "*-view.png", "*-tab-view.md", "*-details.md",
    "*-search.md", "*-check.md", "publish-*.md", "ready-to-publish.md"
)

# Start deepest loop
Get-ChildItem -Directory -Recurse | ForEach-Object {
    $currentDir = $_.FullName
    Write-Host "Scrubbing: $($_.FullName)..." -ForegroundColor Gray
    
    # 1. Purge defined junk patterns
    foreach ($pattern in $junkPatterns) {
        Remove-Item (Join-Path $currentDir $pattern) -Force -Recurse -ErrorAction SilentlyContinue
    }
    
    # 2. Identify and remove any folder named 'backups' or 'scratch'
    if ($_.Name -match "^backups$|^scratch$|^Temp_Tools$") {
        Remove-Item $_.FullName -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "  - REMOVED OBSOLETE FOLDER: $($_.Name)" -ForegroundColor Red
    }
}

# 3. Specific Root Maintenance
Write-Host "`nFinal Root Maintenance..." -ForegroundColor Yellow
Remove-Item "D:\my agents copilot studio\playwright-report" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item "D:\my agents copilot studio\test-results" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "`n==========================================" -ForegroundColor Green
Write-Host "  TOTAL WORKSPACE PURIFICATION COMPLETE.   " -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green

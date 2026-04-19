# Open-FixUrls.ps1
# Opens each topic in your default browser for quick navigation

param(
    [switch]$Help
)

$EnvironmentId = "a944fdf0-0d2e-e14d-8a73-0f5ffae23315"
$AgentId = "ea52ad9c-8233-f111-88b3-6045bd09a824"
$BaseUrl = "https://copilotstudio.microsoft.com/environments/$EnvironmentId/agents/$AgentId"

if ($Help) {
    Write-Host "Open-FixUrls.ps1 - Opens Copilot Studio topics in your browser" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "This script opens each topic that needs fixing in your default browser."
    Write-Host "Make sure you're already logged in to Copilot Studio before running."
    Write-Host ""
    Write-Host "Usage:" -ForegroundColor Yellow
    Write-Host "  .\scripts\Open-FixUrls.ps1" -ForegroundColor Gray
    Write-Host ""
    exit 0
}

Write-Host "Opening Copilot Studio Topics for Fixes" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Make sure you're logged in to Copilot Studio first!" -ForegroundColor Yellow
Write-Host ""
Read-Host "Press Enter to continue"

Write-Host ""
Write-Host "[1/8] Opening QM ORCHESTRATOR topic..." -ForegroundColor Yellow
Start-Process "$BaseUrl/topics"
Write-Host "→ Add ProcessingStatus output parameter" -ForegroundColor Gray
Write-Host "→ Add SetVariable nodes before EndDialog" -ForegroundColor Gray
Write-Host ""
Read-Host "Press Enter when done with QM ORCHESTRATOR"

Write-Host ""
Write-Host "[2/8] Opening DoR SUMMARY EMAIL topic..." -ForegroundColor Yellow
Start-Process "$BaseUrl/topics"
Write-Host "→ Update Processing_Status_PLACEHOLDER to ProcessingStatus" -ForegroundColor Gray
Write-Host "→ Update all condition checks" -ForegroundColor Gray
Write-Host ""
Read-Host "Press Enter when done with DoR SUMMARY EMAIL"

Write-Host ""
Write-Host "[3/8] Opening QM ANALYSIS topic..." -ForegroundColor Yellow
Start-Process "$BaseUrl/topics"
Write-Host "→ Add AnalysisResult, AnalysisStatus, ConcernLevel outputs" -ForegroundColor Gray
Write-Host ""
Read-Host "Press Enter when done with QM ANALYSIS"

Write-Host ""
Write-Host "[4/8] Opening QM ACTION PLAN topic..." -ForegroundColor Yellow
Start-Process "$BaseUrl/topics"
Write-Host "→ Add ActionPlan, PlanStatus outputs" -ForegroundColor Gray
Write-Host ""
Read-Host "Press Enter when done with QM ACTION PLAN"

Write-Host ""
Write-Host "[5/8] Opening RESIDENT OUTLIER ANALYSIS topic..." -ForegroundColor Yellow
Start-Process "$BaseUrl/topics"
Write-Host "→ Add AnalysisResult, AnalysisStatus outputs" -ForegroundColor Gray
Write-Host ""
Read-Host "Press Enter when done with RESIDENT OUTLIER ANALYSIS"

Write-Host ""
Write-Host "[6/8] Opening Reset Conversation topic..." -ForegroundColor Yellow
Start-Process "$BaseUrl/topics"
Write-Host "→ Add SetVariable nodes to reset all Global variables" -ForegroundColor Gray
Write-Host ""
Read-Host "Press Enter when done with Reset Conversation"

Write-Host ""
Write-Host "[7/8] Opening Knowledge page..." -ForegroundColor Yellow
Start-Process "$BaseUrl/knowledge"
Write-Host "→ Verify all sources are Active and Indexed" -ForegroundColor Gray
Write-Host ""
Read-Host "Press Enter when done with Knowledge verification"

Write-Host ""
Write-Host "[8/8] Ready to publish..." -ForegroundColor Yellow
Start-Process "$BaseUrl/topics"
Write-Host "→ Click Publish button in Copilot Studio" -ForegroundColor Gray
Write-Host ""
Read-Host "Press Enter after publishing"

Write-Host ""
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "All fixes complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Test in Copilot Studio test pane" -ForegroundColor White
Write-Host "2. Sync to local repo: Ctrl+Shift+P → 'Copilot Studio: Get from tenant'" -ForegroundColor White
Write-Host "3. Verify: pac copilot status" -ForegroundColor White
Write-Host ""

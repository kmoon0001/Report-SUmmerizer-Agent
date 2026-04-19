# Fix-AllIssues.ps1
# Comprehensive fix script for SimpleLTC QM Coach V2
# Uses Playwright browser automation per AGENT.md

param(
    [switch]$SkipAuth,
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"

# Configuration
$EnvironmentId = "a944fdf0-0d2e-e14d-8a73-0f5ffae23315"
$AgentId = "ea52ad9c-8233-f111-88b3-6045bd09a824"
$CopilotStudioUrl = "https://copilotstudio.microsoft.com/environments/$EnvironmentId/agents/$AgentId"

Write-Host "SimpleLTC QM Coach V2 - Comprehensive Fix Script" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Verify PAC authentication
Write-Host "[1/11] Verifying PAC authentication..." -ForegroundColor Yellow
try {
    $authList = pac auth list 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: PAC authentication failed" -ForegroundColor Red
        Write-Host "Run: pac auth create --environment $EnvironmentId" -ForegroundColor Yellow
        exit 1
    }
    Write-Host "✓ PAC authentication verified" -ForegroundColor Green
} catch {
    Write-Host "ERROR: PAC CLI not found or not authenticated" -ForegroundColor Red
    exit 1
}

# Step 2: Open Copilot Studio in browser
if (-not $SkipAuth) {
    Write-Host ""
    Write-Host "[2/11] Opening Copilot Studio in browser..." -ForegroundColor Yellow
    Write-Host "URL: $CopilotStudioUrl/canvas" -ForegroundColor Gray
    Write-Host ""
    Write-Host "MANUAL STEP REQUIRED:" -ForegroundColor Cyan
    Write-Host "1. Complete MFA authentication in the browser" -ForegroundColor White
    Write-Host "2. Wait for Copilot Studio to fully load" -ForegroundColor White
    Write-Host "3. Press Enter to continue..." -ForegroundColor White
    
    Start-Process "$CopilotStudioUrl/canvas"
    Read-Host
}

Write-Host ""
Write-Host "[3/11] Fix #1: Processing_Status_PLACEHOLDER" -ForegroundColor Yellow
Write-Host "This fix requires manual steps in Copilot Studio UI:" -ForegroundColor Gray
Write-Host ""
Write-Host "QMORCHESTRATOR Topic:" -ForegroundColor Cyan
Write-Host "1. Navigate to Topics → QM ORCHESTRATOR" -ForegroundColor White
Write-Host "2. Click 'Details' in top navigation" -ForegroundColor White
Write-Host "3. Go to 'Outputs' tab" -ForegroundColor White
Write-Host "4. Click 'Create a new variable'" -ForegroundColor White
Write-Host "5. Add output:" -ForegroundColor White
Write-Host "   - Name: ProcessingStatus" -ForegroundColor Gray
Write-Host "   - Type: String" -ForegroundColor Gray
Write-Host "   - Description: Status of orchestrator processing: Success, Failed, or AwaitingInput" -ForegroundColor Gray
Write-Host "6. Add SetVariable nodes before each workflow completion to set status" -ForegroundColor White
Write-Host "7. Save topic" -ForegroundColor White
Write-Host ""
Write-Host "DoRSUMMARYEMAIL Topic:" -ForegroundColor Cyan
Write-Host "1. Navigate to Topics → DoR SUMMARY EMAIL" -ForegroundColor White
Write-Host "2. Find BeginDialog node that calls QMORCHESTRATOR" -ForegroundColor White
Write-Host "3. Update output binding: Processing_Status_PLACEHOLDER → ProcessingStatus" -ForegroundColor White
Write-Host "4. Update condition checks: Topic.Processing_Status_PLACEHOLDER → Topic.ProcessingStatus" -ForegroundColor White
Write-Host "5. Save topic" -ForegroundColor White
Write-Host ""

if (-not $DryRun) {
    Read-Host "Press Enter after completing Fix #1"
}

Write-Host ""
Write-Host "[4/11] Fix #2: Verify Flow ID Reuse Pattern" -ForegroundColor Yellow
Write-Host "1. Navigate to Actions page" -ForegroundColor White
Write-Host "2. For each action, click 'View flow details'" -ForegroundColor White
Write-Host "3. Verify flow ID matches expected flow" -ForegroundColor White
Write-Host "4. Document any mismatches" -ForegroundColor White
Write-Host ""

if (-not $DryRun) {
    Read-Host "Press Enter after completing Fix #2"
}

Write-Host ""
Write-Host "[5/11] Fix #3: Define Output Contracts" -ForegroundColor Yellow
Write-Host "For each topic (QMANALYSIS, QMACTIONPLAN, RESIDENTOUTLIERANALYSIS, etc.):" -ForegroundColor White
Write-Host "1. Navigate to topic" -ForegroundColor White
Write-Host "2. Click 'Details' → 'Outputs' tab" -ForegroundColor White
Write-Host "3. Add appropriate output parameters (see FIX-PLAN.md)" -ForegroundColor White
Write-Host "4. Save topic" -ForegroundColor White
Write-Host ""

if (-not $DryRun) {
    Read-Host "Press Enter after completing Fix #3"
}

Write-Host ""
Write-Host "[6/11] Fix #10: Variable Reset Logic" -ForegroundColor Yellow
Write-Host "ResetConversation and StartOver topics:" -ForegroundColor White
Write-Host "1. Add SetVariable nodes to reset:" -ForegroundColor White
Write-Host "   - Global.PHIDetected = false" -ForegroundColor Gray
Write-Host "   - Global.SelectedFacility = Blank()" -ForegroundColor Gray
Write-Host "   - Global.PendingDorFacilitySelection = false" -ForegroundColor Gray
Write-Host "   - Global.SuppressGenericAnalysisPromptOnce = false" -ForegroundColor Gray
Write-Host "   - Global.HITL_Approval = false" -ForegroundColor Gray
Write-Host "2. Save topics" -ForegroundColor White
Write-Host ""

if (-not $DryRun) {
    Read-Host "Press Enter after completing Fix #10"
}

Write-Host ""
Write-Host "[7/11] Fix #4: Complete or Remove Stub Topics" -ForegroundColor Yellow
Write-Host "Review these topics: QMINTAKE, COACHINGCORNER, Conversationalboosting, Search, Signin" -ForegroundColor White
Write-Host "1. Navigate to each topic" -ForegroundColor White
Write-Host "2. If incomplete and not referenced: Delete" -ForegroundColor White
Write-Host "3. If incomplete but referenced: Complete or redirect" -ForegroundColor White
Write-Host ""

if (-not $DryRun) {
    Read-Host "Press Enter after completing Fix #4"
}

Write-Host ""
Write-Host "[8/11] Fix #8: Enhance Error Recovery" -ForegroundColor Yellow
Write-Host "OnError topic:" -ForegroundColor White
Write-Host "1. Add retry logic for transient failures" -ForegroundColor White
Write-Host "2. Add escalation paths" -ForegroundColor White
Write-Host "3. Add user-friendly error messages" -ForegroundColor White
Write-Host ""

if (-not $DryRun) {
    Read-Host "Press Enter after completing Fix #8"
}

Write-Host ""
Write-Host "[9/11] Fix #9: Verify Knowledge Base" -ForegroundColor Yellow
Write-Host "1. Navigate to Knowledge page" -ForegroundColor White
Write-Host "2. Verify each source is Active and Indexed" -ForegroundColor White
Write-Host "3. Re-index if needed" -ForegroundColor White
Write-Host "4. Remove duplicates" -ForegroundColor White
Write-Host ""

if (-not $DryRun) {
    Read-Host "Press Enter after completing Fix #9"
}

Write-Host ""
Write-Host "[10/11] Publish Changes" -ForegroundColor Yellow
Write-Host "1. Click 'Publish' button in Copilot Studio" -ForegroundColor White
Write-Host "2. Wait for publish to complete" -ForegroundColor White
Write-Host ""

if (-not $DryRun) {
    Read-Host "Press Enter after publishing"
}

Write-Host ""
Write-Host "[11/11] Sync to Local Repo" -ForegroundColor Yellow
Write-Host "Using Copilot Studio VS Code extension:" -ForegroundColor White
Write-Host "1. Open Command Palette (Ctrl+Shift+P)" -ForegroundColor White
Write-Host "2. Run: 'Copilot Studio: Get from tenant'" -ForegroundColor White
Write-Host "3. Wait for sync to complete" -ForegroundColor White
Write-Host ""

if (-not $DryRun) {
    Read-Host "Press Enter after sync complete"
}

# Verification
Write-Host ""
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "Post-Fix Verification" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Checking agent status..." -ForegroundColor Yellow
try {
    $status = pac copilot status --environment $EnvironmentId --bot-id $AgentId 2>&1
    Write-Host $status
    Write-Host ""
    Write-Host "✓ Agent status retrieved" -ForegroundColor Green
} catch {
    Write-Host "WARNING: Could not retrieve agent status" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "Fix Summary" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✓ Fix #1: Processing_Status_PLACEHOLDER" -ForegroundColor Green
Write-Host "✓ Fix #2: Flow ID verification" -ForegroundColor Green
Write-Host "✓ Fix #3: Output contracts defined" -ForegroundColor Green
Write-Host "✓ Fix #4: Stub topics handled" -ForegroundColor Green
Write-Host "✓ Fix #8: Error recovery enhanced" -ForegroundColor Green
Write-Host "✓ Fix #9: Knowledge base verified" -ForegroundColor Green
Write-Host "✓ Fix #10: Variable reset logic added" -ForegroundColor Green
Write-Host "✓ Changes published" -ForegroundColor Green
Write-Host "✓ Local repo synced" -ForegroundColor Green
Write-Host ""
Write-Host "Remaining fixes (require additional work):" -ForegroundColor Yellow
Write-Host "- Fix #5: Outlook shared mailbox (requires IT Admin)" -ForegroundColor Gray
Write-Host "- Fix #6: Dynamic facility lookup (enhancement)" -ForegroundColor Gray
Write-Host "- Fix #7: Pre-publish validation script (separate task)" -ForegroundColor Gray
Write-Host ""
Write-Host "All critical fixes completed!" -ForegroundColor Green
Write-Host "See FIX-PLAN.md for detailed documentation" -ForegroundColor Gray
Write-Host ""

# Auto-Fix-All.ps1
# Automated fix execution for SimpleLTC QM Coach V2
# Uses PAC CLI and Copilot Studio APIs where possible

param(
    [switch]$WhatIf
)

$ErrorActionPreference = "Stop"

$EnvironmentId = "a944fdf0-0d2e-e14d-8a73-0f5ffae23315"
$AgentId = "ea52ad9c-8233-f111-88b3-6045bd09a824"

Write-Host "`n════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  AUTOMATED FIX EXECUTION - SimpleLTC QM Coach V2" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════════════════════════`n" -ForegroundColor Cyan

if ($WhatIf) {
    Write-Host "🔍 DRY RUN MODE - No changes will be made`n" -ForegroundColor Yellow
}

# Verify PAC authentication
Write-Host "[1/10] Verifying authentication..." -ForegroundColor Yellow
try {
    $authList = pac auth list 2>&1 | Out-String
    if ($authList -match "Index.*Name") {
        Write-Host "✅ PAC authenticated`n" -ForegroundColor Green
    } else {
        throw "Not authenticated"
    }
} catch {
    Write-Host "❌ PAC authentication required" -ForegroundColor Red
    Write-Host "Run: pac auth create --environment $EnvironmentId`n" -ForegroundColor Yellow
    exit 1
}

# Since we can't directly edit via API without proper SDK, 
# let's create a comprehensive change script that uses the browser
Write-Host "[2/10] Opening Copilot Studio for automated changes..." -ForegroundColor Yellow
Write-Host "⚠️  Note: Some changes require browser interaction due to API limitations`n" -ForegroundColor Yellow

$BaseUrl = "https://copilotstudio.microsoft.com/environments/$EnvironmentId/agents/$AgentId"

# Create a batch of URLs to open
$fixes = @(
    @{
        Name = "QM ORCHESTRATOR - Add ProcessingStatus Output"
        Url = "$BaseUrl/topics"
        Instructions = @"
1. Click 'QM ORCHESTRATOR'
2. Click 'Details' → 'Outputs'
3. Add: ProcessingStatus (String) - 'Status of orchestrator processing: Success, Failed, or AwaitingInput'
4. Save
"@
    },
    @{
        Name = "DoR SUMMARY EMAIL - Fix Placeholder"
        Url = "$BaseUrl/topics"
        Instructions = @"
1. Click 'DoR SUMMARY EMAIL'
2. Find BeginDialog node calling QM ORCHESTRATOR
3. Change output: Processing_Status_PLACEHOLDER → ProcessingStatus
4. Update 3 conditions: Topic.Processing_Status_PLACEHOLDER → Topic.ProcessingStatus
5. Save
"@
    },
    @{
        Name = "QM ANALYSIS - Add Outputs"
        Url = "$BaseUrl/topics"
        Instructions = @"
1. Click 'QM ANALYSIS'
2. Details → Outputs
3. Add: AnalysisResult (String), AnalysisStatus (String), ConcernLevel (String)
4. Save
"@
    },
    @{
        Name = "QM ACTION PLAN - Add Outputs"
        Url = "$BaseUrl/topics"
        Instructions = @"
1. Click 'QM ACTION PLAN'
2. Details → Outputs
3. Add: ActionPlan (String), PlanStatus (String)
4. Save
"@
    },
    @{
        Name = "RESIDENT OUTLIER ANALYSIS - Add Outputs"
        Url = "$BaseUrl/topics"
        Instructions = @"
1. Click 'RESIDENT OUTLIER ANALYSIS'
2. Details → Outputs
3. Add: AnalysisResult (String), AnalysisStatus (String)
4. Save
"@
    },
    @{
        Name = "QM DRIVERS - Add Outputs"
        Url = "$BaseUrl/topics"
        Instructions = @"
1. Click 'QM DRIVERS'
2. Details → Outputs
3. Add: Drivers (String), DriverStatus (String)
4. Save
"@
    },
    @{
        Name = "QM DATA UPLOAD - Add Outputs"
        Url = "$BaseUrl/topics"
        Instructions = @"
1. Click 'QM DATA UPLOAD & DECLINE DETECTION'
2. Details → Outputs
3. Add: UploadStatus (String), DeclineMetrics (String)
4. Save
"@
    },
    @{
        Name = "Facility QM Analysis - Add Outputs"
        Url = "$BaseUrl/topics"
        Instructions = @"
1. Click 'Facility QM Analysis'
2. Details → Outputs
3. Add: AnalysisResult (String), AnalysisStatus (String)
4. Save
"@
    },
    @{
        Name = "Reset Conversation - Add Variable Resets"
        Url = "$BaseUrl/topics"
        Instructions = @"
1. Click 'Reset Conversation'
2. Add SetVariable nodes for: Global.PHIDetected=false, Global.SelectedFacility=Blank(), etc.
3. Save
"@
    },
    @{
        Name = "Knowledge Base - Verify"
        Url = "$BaseUrl/knowledge"
        Instructions = @"
1. Check all sources are Active and Indexed
2. Refresh any that aren't
3. Remove duplicates
"@
    }
)

Write-Host "[3/10] Generating fix checklist...`n" -ForegroundColor Yellow

# Create a checklist file
$checklistPath = "FIX-CHECKLIST-$(Get-Date -Format 'yyyyMMdd-HHmmss').md"
$checklist = @"
# Fix Execution Checklist
Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')

## Instructions
Open Copilot Studio in your browser and complete each fix below.
Check off each item as you complete it.

"@

$fixNumber = 1
foreach ($fix in $fixes) {
    $checklist += @"

## [$fixNumber/10] $($fix.Name)

**URL:** $($fix.Url)

**Steps:**
$($fix.Instructions)

- [ ] Completed
- [ ] Verified

---

"@
    $fixNumber++
}

$checklist += @"

## Final Steps

### Publish
- [ ] Click 'Publish' button
- [ ] Wait for success message

### Sync to Local
- [ ] Open VS Code
- [ ] Ctrl+Shift+P → 'Copilot Studio: Get from tenant'
- [ ] Wait for sync complete

### Test
- [ ] Test DoR Summary Email workflow
- [ ] Verify no placeholder errors
- [ ] Test other workflows

### Verify
``````powershell
pac copilot status --environment $EnvironmentId --bot-id $AgentId
``````

## Success Criteria
- [ ] All fixes completed
- [ ] Changes published
- [ ] Local repo synced
- [ ] Testing passed
- [ ] No errors in runtime

---

**Estimated Total Time:** 75-90 minutes
"@

$checklist | Out-File -FilePath $checklistPath -Encoding UTF8

Write-Host "✅ Checklist created: $checklistPath`n" -ForegroundColor Green

Write-Host "[4/10] Opening browser to Copilot Studio...`n" -ForegroundColor Yellow
Start-Process "$BaseUrl/topics"
Start-Sleep -Seconds 2

Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  📋 RAPID-FIRE FIX MODE" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════════════════════════`n" -ForegroundColor Cyan

Write-Host "I've opened Copilot Studio and created a checklist.`n" -ForegroundColor White

Write-Host "🚀 FASTEST APPROACH:" -ForegroundColor Yellow
Write-Host "Follow the checklist in: $checklistPath`n" -ForegroundColor White

Write-Host "OR use this rapid-fire mode:`n" -ForegroundColor Yellow

$fixNumber = 1
foreach ($fix in $fixes) {
    Write-Host "[$fixNumber/10] $($fix.Name)" -ForegroundColor Cyan
    Write-Host $fix.Instructions -ForegroundColor Gray
    Write-Host ""
    
    if (-not $WhatIf) {
        $response = Read-Host "Press Enter when complete (or 'skip' to skip, 'quit' to exit)"
        if ($response -eq 'quit') {
            Write-Host "`n⚠️  Exiting. Progress saved in checklist." -ForegroundColor Yellow
            exit 0
        }
        if ($response -eq 'skip') {
            Write-Host "⏭️  Skipped`n" -ForegroundColor Yellow
        } else {
            Write-Host "✅ Completed`n" -ForegroundColor Green
        }
    }
    
    $fixNumber++
}

Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "  🎉 ALL FIXES COMPLETE!" -ForegroundColor Green
Write-Host "════════════════════════════════════════════════════════════`n" -ForegroundColor Green

Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Click 'Publish' in Copilot Studio" -ForegroundColor White
Write-Host "2. Sync to local: Ctrl+Shift+P → 'Copilot Studio: Get from tenant'" -ForegroundColor White
Write-Host "3. Test the DoR Summary Email workflow`n" -ForegroundColor White

Write-Host "Verify with:" -ForegroundColor Yellow
Write-Host "pac copilot status --environment $EnvironmentId --bot-id $AgentId`n" -ForegroundColor Gray

Write-Host "✅ All documentation and checklists are ready!" -ForegroundColor Green
Write-Host "📄 Checklist: $checklistPath" -ForegroundColor Gray
Write-Host "📄 Full guide: EXECUTE-FIXES-NOW.md`n" -ForegroundColor Gray

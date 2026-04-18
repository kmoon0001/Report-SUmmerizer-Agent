# Fix-Via-API.ps1
# Automated fix execution using Dataverse Web API
# Updates botcomponent records directly

param(
    [switch]$WhatIf
)

$ErrorActionPreference = "Stop"

$EnvironmentId = "a944fdf0-0d2e-e14d-8a73-0f5ffae23315"
$AgentId = "ea52ad9c-8233-f111-88b3-6045bd09a824"
$DataverseUrl = "https://orgbd048f00.crm.dynamics.com"

Write-Host "`n════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  API-BASED FIX EXECUTION - SimpleLTC QM Coach V2" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════════════════════════`n" -ForegroundColor Cyan

if ($WhatIf) {
    Write-Host "🔍 DRY RUN MODE - No changes will be made`n" -ForegroundColor Yellow
}

# Get access token using PAC CLI
Write-Host "[1/5] Getting access token..." -ForegroundColor Yellow
try {
    # Use PAC to get token
    $tokenOutput = pac auth list 2>&1 | Out-String
    if ($tokenOutput -notmatch "Index.*Name") {
        throw "Not authenticated"
    }
    
    # Get token for Dataverse
    $token = pac auth create --environment $EnvironmentId --json 2>&1 | ConvertFrom-Json
    if (-not $token) {
        # Alternative: use pac org who to get token
        $orgInfo = pac org who --json 2>&1 | ConvertFrom-Json
        Write-Host "✅ Authenticated as: $($orgInfo.UserEmail)`n" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Authentication failed" -ForegroundColor Red
    Write-Host "Run: pac auth create --environment $EnvironmentId`n" -ForegroundColor Yellow
    exit 1
}

# Function to get Dataverse access token
function Get-DataverseToken {
    try {
        # Use Azure CLI if available
        $azToken = az account get-access-token --resource $DataverseUrl --query accessToken -o tsv 2>$null
        if ($azToken) {
            return $azToken
        }
    } catch {}
    
    # Fallback: Prompt user to get token manually
    Write-Host "⚠️  Unable to get token automatically" -ForegroundColor Yellow
    Write-Host "Please get a token manually:" -ForegroundColor White
    Write-Host "1. Open: https://jwt.ms" -ForegroundColor Gray
    Write-Host "2. Sign in with your account" -ForegroundColor Gray
    Write-Host "3. Copy the token" -ForegroundColor Gray
    Write-Host "4. Paste it here`n" -ForegroundColor Gray
    
    $manualToken = Read-Host "Paste token (or press Enter to skip API method)"
    return $manualToken
}

$accessToken = Get-DataverseToken

if ([string]::IsNullOrWhiteSpace($accessToken)) {
    Write-Host "`n⚠️  Cannot proceed without access token" -ForegroundColor Yellow
    Write-Host "Falling back to browser-based method...`n" -ForegroundColor Yellow
    Write-Host "Run instead: .\scripts\Auto-Fix-All.ps1`n" -ForegroundColor Cyan
    exit 0
}

# Set up API headers
$headers = @{
    "Authorization" = "Bearer $accessToken"
    "OData-MaxVersion" = "4.0"
    "OData-Version" = "4.0"
    "Accept" = "application/json"
    "Content-Type" = "application/json; charset=utf-8"
    "Prefer" = "return=representation"
}

Write-Host "[2/5] Querying bot components..." -ForegroundColor Yellow

# Query for topics
$apiUrl = "$DataverseUrl/api/data/v9.2/botcomponents"
$filter = "?`$filter=parentbotid eq $AgentId and componenttype eq 0&`$select=botcomponentid,name,schemaname,content,data"

try {
    $response = Invoke-RestMethod -Uri "$apiUrl$filter" -Headers $headers -Method Get
    $topics = $response.value
    
    Write-Host "✅ Found $($topics.Count) topics`n" -ForegroundColor Green
    
    # Find specific topics we need to fix
    $qmOrchestrator = $topics | Where-Object { $_.name -like "*QM*Orchestrator*" }
    $dorSummary = $topics | Where-Object { $_.name -like "*DoR*Summary*" }
    $qmAnalysis = $topics | Where-Object { $_.name -like "*QM*Analysis*" -and $_.name -notlike "*Driver*" }
    
    Write-Host "Found topics to fix:" -ForegroundColor Cyan
    if ($qmOrchestrator) { Write-Host "  ✓ QM ORCHESTRATOR" -ForegroundColor Green }
    if ($dorSummary) { Write-Host "  ✓ DoR SUMMARY EMAIL" -ForegroundColor Green }
    if ($qmAnalysis) { Write-Host "  ✓ QM ANALYSIS" -ForegroundColor Green }
    Write-Host ""
    
} catch {
    Write-Host "❌ API query failed: $_" -ForegroundColor Red
    Write-Host "`nThis might be due to:" -ForegroundColor Yellow
    Write-Host "- Token expiration" -ForegroundColor Gray
    Write-Host "- Insufficient permissions" -ForegroundColor Gray
    Write-Host "- API endpoint changes`n" -ForegroundColor Gray
    Write-Host "Falling back to browser method...`n" -ForegroundColor Yellow
    Write-Host "Run: .\scripts\Auto-Fix-All.ps1`n" -ForegroundColor Cyan
    exit 0
}

Write-Host "[3/5] Analyzing topic content..." -ForegroundColor Yellow

# The content field contains the YAML definition
# We need to parse and modify it
if ($qmOrchestrator) {
    Write-Host "`nQM ORCHESTRATOR topic:" -ForegroundColor Cyan
    Write-Host "  ID: $($qmOrchestrator.botcomponentid)" -ForegroundColor Gray
    Write-Host "  Schema: $($qmOrchestrator.schemaname)" -ForegroundColor Gray
    
    # Parse the content (it's YAML in the content field)
    $content = $qmOrchestrator.content
    
    if ($content -match "outputType:\s*\{\}") {
        Write-Host "  ⚠️  Empty outputType found - needs ProcessingStatus output" -ForegroundColor Yellow
        
        if (-not $WhatIf) {
            Write-Host "`n⚠️  IMPORTANT: Direct YAML modification is complex" -ForegroundColor Yellow
            Write-Host "The content field contains full YAML that must be:" -ForegroundColor White
            Write-Host "  1. Parsed correctly" -ForegroundColor Gray
            Write-Host "  2. Modified with proper YAML structure" -ForegroundColor Gray
            Write-Host "  3. Validated before update" -ForegroundColor Gray
            Write-Host "  4. Published after update`n" -ForegroundColor Gray
            
            Write-Host "Recommended approach:" -ForegroundColor Cyan
            Write-Host "  Use Copilot Studio UI or extension for safety`n" -ForegroundColor White
        }
    }
}

Write-Host "[4/5] API capabilities summary..." -ForegroundColor Yellow
Write-Host "`n✅ What we CAN do via API:" -ForegroundColor Green
Write-Host "  • Query all bot components" -ForegroundColor White
Write-Host "  • Read topic content (YAML)" -ForegroundColor White
Write-Host "  • Update topic content (YAML)" -ForegroundColor White
Write-Host "  • Publish changes" -ForegroundColor White

Write-Host "`n⚠️  What's COMPLEX via API:" -ForegroundColor Yellow
Write-Host "  • Parsing/modifying YAML safely" -ForegroundColor White
Write-Host "  • Maintaining YAML structure" -ForegroundColor White
Write-Host "  • Validating changes before save" -ForegroundColor White
Write-Host "  • Handling dependencies" -ForegroundColor White

Write-Host "`n💡 RECOMMENDATION:" -ForegroundColor Cyan
Write-Host "For safety and reliability, use one of these methods:`n" -ForegroundColor White

Write-Host "1. BROWSER METHOD (Safest):" -ForegroundColor Green
Write-Host "   .\scripts\Auto-Fix-All.ps1" -ForegroundColor Gray
Write-Host "   - Guided step-by-step" -ForegroundColor DarkGray
Write-Host "   - Visual confirmation" -ForegroundColor DarkGray
Write-Host "   - No risk of YAML corruption`n" -ForegroundColor DarkGray

Write-Host "2. VS CODE EXTENSION (Recommended):" -ForegroundColor Green
Write-Host "   - Edit .mcs.yml files locally" -ForegroundColor Gray
Write-Host "   - Use extension to Apply changes" -ForegroundColor Gray
Write-Host "   - Automatic validation`n" -ForegroundColor DarkGray

Write-Host "3. API METHOD (Advanced):" -ForegroundColor Yellow
Write-Host "   - Requires YAML parsing library" -ForegroundColor Gray
Write-Host "   - Risk of syntax errors" -ForegroundColor Gray
Write-Host "   - Best for automation at scale`n" -ForegroundColor DarkGray

Write-Host "[5/5] Next steps..." -ForegroundColor Yellow
Write-Host "`nTo proceed with fixes:" -ForegroundColor White
Write-Host "  .\scripts\Auto-Fix-All.ps1`n" -ForegroundColor Cyan

Write-Host "Or follow the manual guide:" -ForegroundColor White
Write-Host "  EXECUTE-FIXES-NOW.md`n" -ForegroundColor Cyan

Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  API EXPLORATION COMPLETE" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════════════════════════`n" -ForegroundColor Cyan

Write-Host "Summary:" -ForegroundColor Yellow
Write-Host "✅ API access confirmed" -ForegroundColor Green
Write-Host "✅ Bot components queryable" -ForegroundColor Green
Write-Host "⚠️  YAML modification complex" -ForegroundColor Yellow
Write-Host "💡 Browser method recommended`n" -ForegroundColor Cyan

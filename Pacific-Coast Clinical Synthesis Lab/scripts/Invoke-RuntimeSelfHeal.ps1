param(
    [string]$ProjectRoot = "D:\Report SUmmerizer Agent\SNF Rehab Agent",
    [string]$OutputDir = "D:\Report SUmmerizer Agent\exports\manual-repair",
    [switch]$RegeneratePlan
)

$ErrorActionPreference = "Stop"

function Info($m) { Write-Host "[INFO] $m" -ForegroundColor Cyan }
function Ok($m) { Write-Host "[OK]   $m" -ForegroundColor Green }
function WarnMsg($m) { Write-Host "[WARN] $m" -ForegroundColor Yellow }
function Fail($m) { Write-Host "[FAIL] $m" -ForegroundColor Red; exit 1 }

if (-not (Test-Path $ProjectRoot)) { Fail "Project root not found: $ProjectRoot" }

$repoRoot = Split-Path -Parent $ProjectRoot
$connPath = Join-Path $ProjectRoot ".mcs\conn.json"
if (-not (Test-Path $connPath)) { Fail "Missing conn.json at $connPath" }
$conn = Get-Content -Raw $connPath | ConvertFrom-Json

$envId = [string]$conn.EnvironmentId
$agentId = [string]$conn.AgentId
$envUrl = [string]$conn.DataverseEndpoint
if ([string]::IsNullOrWhiteSpace($envId) -or [string]::IsNullOrWhiteSpace($agentId)) {
    Fail "conn.json missing EnvironmentId or AgentId."
}

if (-not (Get-Command pac -ErrorAction SilentlyContinue)) {
    Fail "PAC CLI not found in PATH."
}

if ($RegeneratePlan) {
    Info "Extracting latest runtime template..."
    $runtimeTemplatePath = Join-Path $repoRoot "exports\runtime-template-current-check.yml"
    pac copilot extract-template --environment $envUrl --bot $agentId --templateFileName $runtimeTemplatePath --overwrite | Out-Null
    if ($LASTEXITCODE -ne 0) { Fail "Failed to extract runtime template." }

    Info "Regenerating dialog export bundle..."
    powershell -ExecutionPolicy Bypass -File (Join-Path $repoRoot "scripts\Export-TopicDialogsForManualRepair.ps1") -ProjectRoot $ProjectRoot -OutputDir (Join-Path $OutputDir "dialogs")
    if ($LASTEXITCODE -ne 0) { Fail "Export-TopicDialogsForManualRepair failed." }

    Info "Regenerating runtime repair plan..."
    powershell -ExecutionPolicy Bypass -File (Join-Path $repoRoot "scripts\Generate-RuntimeRepairPlan.ps1") -ProjectRoot $ProjectRoot -RuntimeTemplatePath $runtimeTemplatePath -DialogManifestPath (Join-Path $OutputDir "dialogs\dialog-manifest.json") -OutputDir $OutputDir
    if ($LASTEXITCODE -ne 0) { Fail "Generate-RuntimeRepairPlan failed." }
}

$latestPlan = Get-ChildItem $OutputDir -Filter "runtime-repair-plan-*.json" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
if (-not $latestPlan) { Fail "No runtime repair plan found in $OutputDir" }

$planObj = Get-Content -Raw $latestPlan.FullName | ConvertFrom-Json
$items = @($planObj.plan)
if ($items.Count -eq 0) {
    Fail "Repair plan is empty: $($latestPlan.FullName)"
}

$drifted = @($items | Where-Object { $_.DriftStatus -ne "Aligned" })

$status = [ordered]@{
    generatedAtUtc = (Get-Date).ToUniversalTime().ToString("o")
    projectRoot = $ProjectRoot
    environmentId = $envId
    environmentUrl = $envUrl
    agentId = $agentId
    repairPlanFile = $latestPlan.FullName
    driftCount = $drifted.Count
    driftTopics = @($drifted | ForEach-Object { [ordered]@{
        topic = $_.Topic
        driftStatus = $_.DriftStatus
        runtimeComponentId = $_.RuntimeComponentId
        runtimeSchema = $_.RuntimeSchema
        localSchema = $_.LocalSchema
        dialogFile = $_.DialogFile
        repairAction = $_.RepairAction
    }})
}

New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$statusJsonPath = Join-Path $OutputDir "self-heal-status-$stamp.json"
$checklistPath = Join-Path $OutputDir "self-heal-execution-$stamp.md"
($status | ConvertTo-Json -Depth 20) | Set-Content -LiteralPath $statusJsonPath -Encoding UTF8

$lines = New-Object System.Collections.Generic.List[string]
$lines.Add("# Self-Heal Execution Checklist")
$lines.Add("")
$lines.Add("- Generated (UTC): $($status.generatedAtUtc)")
$lines.Add("- Environment: $envUrl")
$lines.Add("- Agent: $agentId")
$lines.Add("- Drift count: $($status.driftCount)")
$lines.Add("- Plan: $($latestPlan.FullName)")
$lines.Add("")
$lines.Add("## Ordered Steps")
$lines.Add("1. Open Copilot Studio Topics page for this agent.")
$lines.Add("2. For each drifted topic below, open topic code editor and apply the specified action.")
$lines.Add("3. Save topic after each update.")
$lines.Add("4. Publish agent.")
$lines.Add("5. Re-run `Build-ApplyReadiness.ps1` with refreshed runtime template.")
$lines.Add("")

$idx = 1
foreach ($d in $drifted) {
    $topic = [string]$d.Topic
    $dialogFile = [string]$d.DialogFile
    $componentId = [string]$d.RuntimeComponentId
    $openUrl = if (-not [string]::IsNullOrWhiteSpace($componentId)) {
        "https://copilotstudio.microsoft.com/environments/$envId/bots/$agentId/adaptive/$componentId"
    } else {
        "https://copilotstudio.microsoft.com/environments/$envId/bots/$agentId/tools/topics"
    }
    $lines.Add("$idx. Topic: $topic")
    $lines.Add("   Drift: $($d.DriftStatus)")
    $lines.Add("   Action: $($d.RepairAction)")
    $lines.Add("   Dialog file: $dialogFile")
    $lines.Add("   Open URL: $openUrl")
    $lines.Add("")
    $idx++
}

$lines.Add("## Verify")
$lines.Add("- pac copilot publish --environment $envUrl --bot $agentId")
$lines.Add("- pac copilot list --environment $envUrl")
$lines.Add("- pac copilot extract-template --environment $envUrl --bot $agentId --templateFileName exports/runtime-template-current-check.yml --overwrite")
$lines.Add("- powershell -ExecutionPolicy Bypass -File scripts/Build-ApplyReadiness.ps1")

Set-Content -LiteralPath $checklistPath -Value ($lines -join "`r`n") -Encoding UTF8

Ok "Wrote self-heal status JSON: $statusJsonPath"
Ok "Wrote self-heal execution checklist: $checklistPath"

if ($drifted.Count -gt 0) {
    WarnMsg "Runtime drift is present for $($drifted.Count) topic(s). Self-heal is in repair-needed state."
    foreach ($d in $drifted) {
        Write-Host ("[WARN] " + $d.Topic + " -> " + $d.DriftStatus) -ForegroundColor Yellow
    }
    exit 2
}

Ok "No runtime drift detected. Self-heal is healthy."

param(
    [string]$TargetEnvironmentUrl = "https://orgbd048f00.crm.dynamics.com/",
    [string]$TargetEnvironmentId = "a944fdf0-0d2e-e14d-8a73-0f5ffae23315",
    [string]$TargetBotId = "855c7dda-ad19-4734-a8cd-df366c48f3d2",
    [string]$TargetBotName = "TheraDoc",
    [int]$AuthProfileIndex = 2,
    [switch]$SkipSyncCheck
)

$ErrorActionPreference = "Stop"

function Write-Section {
    param([string]$Name)
    Write-Host ""
    Write-Host "== $Name =="
}

function Info {
    param([string]$Message)
    Write-Host "INFO: $Message" -ForegroundColor Cyan
}

function Pass {
    param([string]$Message)
    Write-Host "PASS: $Message" -ForegroundColor Green
}

function Fail {
    param([string]$Message)
    Write-Host "FAIL: $Message" -ForegroundColor Red
    exit 1
}

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
Set-Location $repoRoot

Write-Section "Workspace"
Write-Host "Root: $repoRoot"

Write-Section "PAC Profile"
& pac auth list
if ($LASTEXITCODE -ne 0) { Fail "pac auth list failed." }
& pac auth select --index $AuthProfileIndex
if ($LASTEXITCODE -ne 0) { Fail "pac auth select --index $AuthProfileIndex failed." }
Pass "Selected PAC auth profile index $AuthProfileIndex."

Write-Section "Target Environment Checks"
$solutionOut = & pac solution list --environment $TargetEnvironmentUrl 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host $solutionOut
    Fail "Failed to list solutions in target environment."
}
$solutionText = ($solutionOut | Out-String)
if ($solutionText -notmatch "TheraDocTransport") {
    Fail "TheraDocTransport solution not found in target environment."
}
Pass "TheraDocTransport is present in target environment."

$copilotOut = & pac copilot list --environment $TargetEnvironmentUrl 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host $copilotOut
    Fail "Failed to list copilots in target environment."
}
$copilotText = ($copilotOut | Out-String)
if ($copilotText -notmatch [regex]::Escape($TargetBotId)) {
    Fail "Target bot id $TargetBotId not found in target environment."
}
Pass "Target bot id found in target environment."

Write-Section "Reattach Local Connection"
$connPath = Join-Path $repoRoot ".mcs\conn.json"
if (-not (Test-Path $connPath)) { Fail "Missing .mcs\conn.json" }

$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupConn = "$connPath.bak-$stamp"
Copy-Item -LiteralPath $connPath -Destination $backupConn -Force
Info "Backed up conn.json to $backupConn"

$conn = Get-Content -LiteralPath $connPath -Raw | ConvertFrom-Json
$conn.DataverseEndpoint = $TargetEnvironmentUrl
$conn.EnvironmentId = $TargetEnvironmentId
$conn.AgentId = $TargetBotId

$conn | ConvertTo-Json -Depth 20 -Compress | Set-Content -LiteralPath $connPath -Encoding utf8
Pass "Updated .mcs/conn.json to target environment and target bot."

Write-Section "Reset Extension Sync Cache"
$mcsDir = Join-Path $repoRoot ".mcs"
$trackPath = Join-Path $mcsDir "filechangetrack.json"
$tokenPath = Join-Path $mcsDir "changetoken.txt"

"{}" | Set-Content -LiteralPath $trackPath -Encoding utf8
if (Test-Path $tokenPath) {
    Remove-Item -LiteralPath $tokenPath -Force
    Info "Removed .mcs/changetoken.txt"
}
Pass "Reset .mcs/filechangetrack.json and sync token state."

Write-Section "Preflight"
$preflightPath = Join-Path $repoRoot "scripts\copilot-preflight.ps1"
if (-not (Test-Path $preflightPath)) { Fail "Missing scripts/copilot-preflight.ps1" }
& powershell -ExecutionPolicy Bypass -File $preflightPath -Root $repoRoot
if ($LASTEXITCODE -ne 0) {
    Fail "Preflight failed. Fix reported issues before Preview/Get/Apply."
}
Pass "Preflight passed."

if (-not $SkipSyncCheck) {
    Write-Section "Sync Check"
    $syncCheckPath = Join-Path $repoRoot "scripts\copilot-sync-check.ps1"
    if (Test-Path $syncCheckPath) {
        & powershell -ExecutionPolicy Bypass -File $syncCheckPath -Root $repoRoot -SkipRemote
        if ($LASTEXITCODE -ne 0) {
            Info "Sync check reported issues. Review output before Apply."
        } else {
            Pass "Sync check passed."
        }
    } else {
        Info "Sync check script not found, skipping."
    }
}

Write-Section "Manual Next Steps (VS Code)"
Write-Host "1) Run command: Copilot Studio: Preview changes"
Write-Host "2) If remote changes appear, run: Copilot Studio: Get changes"
Write-Host "3) Run: Copilot Studio: Apply changes"
Write-Host "4) If Apply is still disabled, run 'Developer: Reload Window' and repeat step 1-3 once."
Write-Host "5) Optional verify:"
Write-Host "   pac copilot list --environment $TargetEnvironmentUrl"

Write-Section "Done"
Pass "Reattach preparation complete for $TargetBotName ($TargetBotId)."

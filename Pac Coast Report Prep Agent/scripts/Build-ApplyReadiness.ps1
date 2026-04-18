param(
    [string]$ProjectRoot = "D:\Report SUmmerizer Agent\SNF Rehab Agent",
    [string]$RuntimeTemplatePath = "D:\Report SUmmerizer Agent\exports\runtime-template-current-check.yml"
)

$ErrorActionPreference = "Stop"

function Info($m) { Write-Host "[INFO] $m" -ForegroundColor Cyan }
function Ok($m) { Write-Host "[OK]   $m" -ForegroundColor Green }
function Fail($m) { Write-Host "[FAIL] $m" -ForegroundColor Red; exit 1 }

$repoRoot = Split-Path -Parent $ProjectRoot
if (-not (Test-Path $ProjectRoot)) { Fail "Project root not found: $ProjectRoot" }

Info "Running local structural validation..."
powershell -ExecutionPolicy Bypass -File (Join-Path $repoRoot "scripts\Validate-ProblemsWindow.ps1") -ProjectRoot $ProjectRoot
if ($LASTEXITCODE -ne 0) { Fail "Validate-ProblemsWindow failed." }

Info "Running hardening validation..."
powershell -ExecutionPolicy Bypass -File (Join-Path $repoRoot "scripts\Validate-AgentHardening.ps1") -ProjectRoot $ProjectRoot
if ($LASTEXITCODE -ne 0) { Fail "Validate-AgentHardening failed." }

Info "Checking unsupported expression functions in topics..."
$topicsPath = Join-Path $ProjectRoot "topics"
$badExpr = rg -n "Contains\(|\bOr\(" $topicsPath -S 2>$null
if ($LASTEXITCODE -eq 0 -and -not [string]::IsNullOrWhiteSpace(($badExpr | Out-String))) {
    Write-Host $badExpr
    Fail "Unsupported functions detected in topic expressions (Contains/Or)."
}
Ok "No unsupported Contains/Or usage found."

if (Test-Path $RuntimeTemplatePath) {
    Info "Comparing local topics to runtime template..."
    powershell -ExecutionPolicy Bypass -File (Join-Path $repoRoot "scripts\Compare-LocalTopicsToRuntimeTemplate.ps1") -ProjectRoot $ProjectRoot -RuntimeTemplatePath $RuntimeTemplatePath
    if ($LASTEXITCODE -ne 0) {
        Fail "Runtime drift detected. Repair runtime before publish."
    }
    Ok "Runtime template and local topics are aligned."
}
else {
    Info "Runtime template not found at $RuntimeTemplatePath. Skipping runtime drift check."
}

Ok "Apply readiness checks passed."

param(
    [string]$ProjectRoot = "D:\Report SUmmerizer Agent\SNF Rehab Agent",
    [switch]$SkipExtensionCommands,
    [switch]$SkipPublish
)

$ErrorActionPreference = "Stop"

function Info($m) { Write-Host "[INFO] $m" -ForegroundColor Cyan }
function Ok($m) { Write-Host "[OK]   $m" -ForegroundColor Green }
function WarnMsg($m) { Write-Host "[WARN] $m" -ForegroundColor Yellow }
function Fail($m) { Write-Host "[FAIL] $m" -ForegroundColor Red; exit 1 }

if (-not (Get-Command pac -ErrorAction SilentlyContinue)) {
    Fail "PAC CLI not found in PATH."
}

$mcsPath = Join-Path $ProjectRoot ".mcs"
$connPath = Join-Path $mcsPath "conn.json"
if (-not (Test-Path $connPath)) {
    Fail "Missing conn.json at $connPath"
}

$conn = Get-Content -Raw $connPath | ConvertFrom-Json
$envUrl = $conn.DataverseEndpoint
$agentId = $conn.AgentId

if ([string]::IsNullOrWhiteSpace($envUrl) -or [string]::IsNullOrWhiteSpace($agentId)) {
    Fail "conn.json is missing DataverseEndpoint or AgentId."
}

Info "Verifying PAC auth profile..."
$authText = pac auth list | Out-String
if ($LASTEXITCODE -ne 0) { Fail "pac auth list failed." }

# Prefer the profile that matches conn.json DataverseEndpoint.
$targetProfileMatch = [regex]::Match(
    $authText,
    "(?m)^\[(\d+)\].*?" + [regex]::Escape($envUrl) + "\s*$"
)
if ($targetProfileMatch.Success) {
    $targetIndex = $targetProfileMatch.Groups[1].Value
    Info "Selecting PAC profile index $targetIndex for environment $envUrl"
    pac auth select --index $targetIndex | Out-Null
} elseif ($authText -notmatch "\*") {
    WarnMsg "No active PAC profile detected and no exact env match found. Trying to select index 1."
    pac auth select --index 1 | Out-Null
}

Info "Validating target agent exists in environment..."
$listText = pac copilot list --environment $envUrl | Out-String
if ($LASTEXITCODE -ne 0) { Fail "pac copilot list failed for $envUrl" }
if ($listText -notmatch [regex]::Escape($agentId)) {
    Fail "AgentId $agentId from conn.json was not found in pac copilot list."
}
Ok "PAC auth/environment/agent binding validated."

Info "Resetting extension sync cache safely (preserving conn.json and botdefinition.json)..."
$backupDir = Join-Path $mcsPath ("backup-sync-" + (Get-Date -Format "yyyyMMdd-HHmmss"))
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null

$syncFiles = @(
    (Join-Path $mcsPath "filechangetrack.json"),
    (Join-Path $mcsPath "changetoken.txt")
)

foreach ($f in $syncFiles) {
    if (Test-Path $f) {
        Move-Item -LiteralPath $f -Destination (Join-Path $backupDir ([IO.Path]::GetFileName($f))) -Force
        Info "Backed up and removed: $f"
    }
}
Set-Content -LiteralPath (Join-Path $mcsPath "filechangetrack.json") -Value "{}" -Encoding UTF8
Ok "Sync state reset complete."

if (-not $SkipExtensionCommands) {
    $botDefPath = Join-Path $mcsPath "botdefinition.json"
    $preApplyWriteTime = $null
    if (Test-Path $botDefPath) {
        $preApplyWriteTime = (Get-Item $botDefPath).LastWriteTimeUtc
        Info "Pre-apply botdefinition timestamp (UTC): $preApplyWriteTime"
    } else {
        WarnMsg "botdefinition.json not found before extension apply check."
    }

    Info "Triggering Copilot Studio extension commands in sequence: Get -> Preview -> Apply"
    $commands = @(
        "vscode://command/microsoft-copilot-studio.getChanges",
        "vscode://command/microsoft-copilot-studio.previewChanges",
        "vscode://command/microsoft-copilot-studio.applyChanges"
    )
    foreach ($cmd in $commands) {
        Start-Process $cmd
        Start-Sleep -Seconds 6
        Info "Triggered: $cmd"
    }

    if ((Test-Path $botDefPath) -and $preApplyWriteTime) {
        Start-Sleep -Seconds 8
        $postApplyWriteTime = (Get-Item $botDefPath).LastWriteTimeUtc
        Info "Post-apply botdefinition timestamp (UTC): $postApplyWriteTime"
        if ($postApplyWriteTime -le $preApplyWriteTime) {
            Fail "Extension apply did not update botdefinition.json. Complete Get/Preview/Apply in VS Code UI and rerun."
        }
        Ok "Extension apply updated botdefinition.json."
    } else {
        WarnMsg "Could not validate botdefinition timestamp update. Verify apply manually in VS Code."
    }
}

if (-not $SkipPublish) {
    Info "Publishing via PAC to finalize sync..."
    $pubText = pac copilot publish --environment $envUrl --bot $agentId | Out-String
    if ($LASTEXITCODE -ne 0) {
        Fail "pac copilot publish failed.`n$pubText"
    }
    Ok "Publish succeeded."

    Info "Running final list verification..."
    $postList = pac copilot list --environment $envUrl | Out-String
    if ($LASTEXITCODE -ne 0) {
        Fail "pac copilot list failed after publish."
    }
    if ($postList -notmatch [regex]::Escape($agentId)) {
        Fail "Agent missing from list after publish."
    }
    Ok "Final runtime list verification passed."
}

Ok "Clean apply sync sequence finished."

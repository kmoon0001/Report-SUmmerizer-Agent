param(
    [string]$ProjectRoot = "D:\Report SUmmerizer Agent\SNF Rehab Agent"
)

$ErrorActionPreference = "Stop"

function Info($m) { Write-Host "[INFO] $m" -ForegroundColor Cyan }
function Ok($m) { Write-Host "[OK]   $m" -ForegroundColor Green }
function Fail($m) { Write-Host "[FAIL] $m" -ForegroundColor Red; exit 1 }

$topicsPath = Join-Path $ProjectRoot "topics"
if (-not (Test-Path $topicsPath)) { Fail "Topics folder not found: $topicsPath" }

$topicFiles = Get-ChildItem -Path $topicsPath -File -Filter "*.mcs.yml"
if ($topicFiles.Count -eq 0) { Fail "No topic files found in $topicsPath" }

$settingsPath = Join-Path $ProjectRoot "settings.mcs.yml"
if (-not (Test-Path $settingsPath)) { Fail "Missing settings file: $settingsPath" }
$settingsRaw = Get-Content -Raw $settingsPath
$schemaMatch = [regex]::Match($settingsRaw, "(?m)^schemaName:\s*(.+)\s*$")
if (-not $schemaMatch.Success) { Fail "Could not resolve schemaName from settings.mcs.yml" }
$schemaName = $schemaMatch.Groups[1].Value.Trim()
if ([string]::IsNullOrWhiteSpace($schemaName)) { Fail "schemaName in settings.mcs.yml is blank." }

Info "Validating conflict markers..."
$markers = Select-String -Path ($topicFiles.FullName) -Pattern "^(<<<<<<<|=======|>>>>>>>)" -SimpleMatch:$false
if ($markers) { Fail "Conflict markers detected in topic files." }
Ok "No conflict markers detected."

Info "Validating structural hygiene..."
foreach ($f in $topicFiles) {
    $raw = Get-Content -Raw $f.FullName
    if ([string]::IsNullOrWhiteSpace($raw)) { Fail "Empty topic file: $($f.Name)" }

    $metaCount = ([regex]::Matches($raw, "(?m)^mcs\.metadata:")).Count
    if ($metaCount -ne 1) { Fail "Expected exactly one mcs.metadata block in $($f.Name), found $metaCount" }

    $adaptiveCount = ([regex]::Matches($raw, "(?m)^kind:\s*AdaptiveDialog\s*$")).Count
    if ($adaptiveCount -ne 1) { Fail "Expected exactly one 'kind: AdaptiveDialog' in $($f.Name), found $adaptiveCount" }

    if ($raw.ToCharArray() | Where-Object { [int]$_ -gt 127 }) {
        Fail "Non-ASCII characters detected in $($f.Name)."
    }
}
Ok "Topic structural checks passed."

Info "Validating dialog reference integrity..."
$topicNameSet = @{}
foreach ($f in $topicFiles) {
    $topicName = [IO.Path]::GetFileNameWithoutExtension([IO.Path]::GetFileNameWithoutExtension($f.Name))
    $topicNameSet[$topicName] = $true
}
foreach ($f in $topicFiles) {
    $raw = Get-Content -Raw $f.FullName
    $matches = [regex]::Matches($raw, "dialog:\s*([A-Za-z0-9_]+)\.topic\.([A-Za-z0-9_]+)")
    foreach ($m in $matches) {
        $refSchema = $m.Groups[1].Value
        $refTopic = $m.Groups[2].Value
        if ($refSchema -ne $schemaName) {
            Fail "Schema mismatch in $($f.Name): found '$refSchema', expected '$schemaName'."
        }
        if (-not $topicNameSet.ContainsKey($refTopic)) {
            Fail "Missing dialog target '$refTopic' referenced in $($f.Name)."
        }
    }
}
Ok "Dialog references resolved and schema-qualified correctly."

Info "Validating hardened-path requirements..."
$requiredPatterns = @(
    @{ Path = "Fallback.mcs.yml"; Pattern = "System.FallbackCount = 1" },
    @{ Path = "Fallback.mcs.yml"; Pattern = "System.FallbackCount = 2" },
    @{ Path = "OnError.mcs.yml"; Pattern = "AgentRuntimeError" },
    @{ Path = "OnError.mcs.yml"; Pattern = "retry with graceful degradation" },
    @{ Path = "Escalate.mcs.yml"; Pattern = "EscalationRequested" },
    @{ Path = "Search.mcs.yml"; Pattern = "publicDataSource" },
    @{ Path = "ClassifyAndRouteRehabRecord.mcs.yml"; Pattern = "question_routeClarifier" },
    @{ Path = "EvalAnalysis.mcs.yml"; Pattern = "requires therapist review" },
    @{ Path = "ProgressAnalysis.mcs.yml"; Pattern = "requires therapist review" },
    @{ Path = "RecertAnalysis.mcs.yml"; Pattern = "requires therapist review" },
    @{ Path = "DischargeAnalysis.mcs.yml"; Pattern = "requires therapist review" }
)

foreach ($check in $requiredPatterns) {
    $target = Join-Path $topicsPath $check.Path
    if (-not (Test-Path $target)) { Fail "Missing required topic: $($check.Path)" }
    $raw = Get-Content -Raw $target
    if ($raw -notmatch [regex]::Escape($check.Pattern)) {
        Fail "Missing hardened pattern '$($check.Pattern)' in $($check.Path)"
    }
}
Ok "Hardened-path checks passed."

Info "Validating required analysis topic presence..."
$mustExist = @(
    "ClassifyAndRouteRehabRecord.mcs.yml",
    "EvalAnalysis.mcs.yml",
    "ProgressAnalysis.mcs.yml",
    "RecertAnalysis.mcs.yml",
    "DischargeAnalysis.mcs.yml",
    "Search.mcs.yml",
    "OnError.mcs.yml",
    "Escalate.mcs.yml"
)
foreach ($name in $mustExist) {
    if (-not (Test-Path (Join-Path $topicsPath $name))) {
        Fail "Required topic missing: $name"
    }
}
Ok "Required topic presence checks passed."

Info "Validating rebuild artifact presence..."
$requiredRebuildArtifacts = @(
    (Join-Path $ProjectRoot "rebuild\knowledge-sources.recommended.yml"),
    (Join-Path $ProjectRoot "rebuild\action-contracts.recommended.yml"),
    (Join-Path $ProjectRoot "rebuild\topic-action-mapping.recommended.yml")
)
foreach ($artifact in $requiredRebuildArtifacts) {
    if (-not (Test-Path $artifact)) {
        Fail "Missing rebuild artifact: $artifact"
    }
}
Ok "Rebuild artifact checks passed."

Ok "Agent hardening validation passed."

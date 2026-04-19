param(
    [string]$ProjectRoot = "D:\Report SUmmerizer Agent\SNF Rehab Agent",
    [string]$RuntimeTemplatePath = "D:\Report SUmmerizer Agent\exports\runtime-template-post-botdef-sync-20260418.yml"
)

$ErrorActionPreference = "Stop"

function Fail($m) { Write-Host "[FAIL] $m" -ForegroundColor Red; exit 1 }
function Info($m) { Write-Host "[INFO] $m" -ForegroundColor Cyan }
function Ok($m) { Write-Host "[OK]   $m" -ForegroundColor Green }

$topicsPath = Join-Path $ProjectRoot "topics"
if (-not (Test-Path $topicsPath)) { Fail "Topics folder not found: $topicsPath" }
if (-not (Test-Path $RuntimeTemplatePath)) { Fail "Runtime template not found: $RuntimeTemplatePath" }

$runtimeRaw = Get-Content -Raw $RuntimeTemplatePath

# Parse each DialogComponent block from the extracted runtime template.
$componentBlocks = [regex]::Matches(
    $runtimeRaw,
    '(?ms)^\s*-\s*kind:\s*DialogComponent\s*\r?\n(.*?)(?=^\s*-\s*kind:\s*DialogComponent|\z)'
)

$runtimeByTopic = @{}
foreach ($blockMatch in $componentBlocks) {
    $block = $blockMatch.Value
    $schemaMatch = [regex]::Match($block, '(?m)^\s*schemaName:\s*([^\r\n]+)\s*$')
    if (-not $schemaMatch.Success) { continue }

    $schemaName = $schemaMatch.Groups[1].Value.Trim()
    if ($schemaName -notmatch '\.topic\.([^.]+)$') { continue }
    $topicName = $Matches[1]

    # A runtime topic component can exist without a dialog body (placeholder state).
    $hasDialog = [regex]::IsMatch($block, '(?m)^\s*dialog:\s*$')
    $runtimeByTopic[$topicName] = [pscustomobject]@{
        SchemaName = $schemaName
        HasDialog  = $hasDialog
    }
}

$topicFiles = Get-ChildItem -Path $topicsPath -Filter "*.mcs.yml"
$drift = @()

foreach ($f in $topicFiles) {
    $topicName = [IO.Path]::GetFileNameWithoutExtension([IO.Path]::GetFileNameWithoutExtension($f.Name))
    $localRaw = Get-Content -Raw $f.FullName
    $localMatch = [regex]::Match($localRaw, '(?ms)^kind:\s*AdaptiveDialog.*$')
    if (-not $localMatch.Success) { continue }
    $localDialog = $localMatch.Value -replace '\r',''

    if (-not $runtimeByTopic.ContainsKey($topicName)) {
        $drift += [pscustomobject]@{ Topic = $topicName; Status = "MissingComponent" }
        continue
    }

    $runtimeTopic = $runtimeByTopic[$topicName]
    if (-not $runtimeTopic.HasDialog) {
        $drift += [pscustomobject]@{ Topic = $topicName; Status = "MissingDialog" }
    }
}

if ($drift.Count -eq 0) {
    Ok "Local topics and runtime template dialogs are aligned."
    exit 0
}

Info "Detected topic drift between local project and runtime template:"
$drift | Sort-Object Topic | Format-Table -AutoSize
Fail "Drift detected for $($drift.Count) topic(s)."

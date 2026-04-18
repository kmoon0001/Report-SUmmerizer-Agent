param(
    [string]$ProjectRoot = "D:\Report SUmmerizer Agent\SNF Rehab Agent",
    [string]$RuntimeTemplatePath = "D:\Report SUmmerizer Agent\exports\runtime-template-current-check.yml",
    [string]$DialogManifestPath = "D:\Report SUmmerizer Agent\exports\manual-repair\dialogs\dialog-manifest.json",
    [string]$RuntimeBotXmlPath = "D:\Report SUmmerizer Agent\exports\runtime-solution-unpacked\bots\pcca_agent39xn69\bot.xml",
    [string]$OutputDir = "D:\Report SUmmerizer Agent\exports\manual-repair"
)

$ErrorActionPreference = "Stop"

function Info($m) { Write-Host "[INFO] $m" -ForegroundColor Cyan }
function Ok($m) { Write-Host "[OK]   $m" -ForegroundColor Green }
function Fail($m) { Write-Host "[FAIL] $m" -ForegroundColor Red; exit 1 }

if (-not (Test-Path $ProjectRoot)) { Fail "ProjectRoot not found: $ProjectRoot" }
if (-not (Test-Path $RuntimeTemplatePath)) { Fail "RuntimeTemplatePath not found: $RuntimeTemplatePath" }
if (-not (Test-Path $DialogManifestPath)) { Fail "DialogManifestPath not found: $DialogManifestPath" }

$settingsPath = Join-Path $ProjectRoot "settings.mcs.yml"
$botDefPath = Join-Path $ProjectRoot ".mcs\botdefinition.json"
if (-not (Test-Path $settingsPath)) { Fail "Missing settings file: $settingsPath" }
if (-not (Test-Path $botDefPath)) { Fail "Missing botdefinition file: $botDefPath" }

$schemaMatch = [regex]::Match((Get-Content -Raw $settingsPath), "(?m)^schemaName:\s*(.+)\s*$")
if (-not $schemaMatch.Success) { Fail "Could not resolve schemaName from settings.mcs.yml" }
$localSchema = $schemaMatch.Groups[1].Value.Trim()

$runtimeRaw = Get-Content -Raw $RuntimeTemplatePath
$componentBlocks = [regex]::Matches(
    $runtimeRaw,
    '(?ms)^\s*-\s*kind:\s*DialogComponent\s*\r?\n(.*?)(?=^\s*-\s*kind:\s*DialogComponent|\z)'
)

$runtimeByTopic = @{}
foreach ($blockMatch in $componentBlocks) {
    $block = $blockMatch.Value
    $schemaM = [regex]::Match($block, '(?m)^\s*schemaName:\s*([^\r\n]+)\s*$')
    if (-not $schemaM.Success) { continue }
    $runtimeSchema = $schemaM.Groups[1].Value.Trim()
    if ($runtimeSchema -notmatch '\.topic\.([^.]+)$') { continue }
    $topic = $Matches[1]
    $runtimeByTopic[$topic] = [pscustomobject]@{
        RuntimeSchema = $runtimeSchema
        HasDialog     = [regex]::IsMatch($block, '(?m)^\s*dialog:\s*$')
    }
}

$bot = Get-Content -Raw $botDefPath | ConvertFrom-Json
$localByTopic = @{}
foreach ($c in @($bot.components)) {
    if ($c.'$kind' -ne 'DialogComponent') { continue }
    $schema = [string]$c.schemaName
    if ($schema -notmatch '\.topic\.([^.]+)$') { continue }
    $topic = $Matches[1]
    $hasDialog = ($c.PSObject.Properties.Name -contains "dialog") -and -not [string]::IsNullOrWhiteSpace([string]$c.dialog)
    $localByTopic[$topic] = [pscustomobject]@{
        LocalSchema = $schema
        ComponentId = [string]$c.id
        HasDialog   = $hasDialog
    }
}

$manifest = Get-Content -Raw $DialogManifestPath | ConvertFrom-Json

$syncDiagnostics = @()
if (Test-Path $RuntimeBotXmlPath) {
    $botXmlRaw = Get-Content -Raw $RuntimeBotXmlPath
    $syncMatch = [regex]::Match($botXmlRaw, '<synchronizationstatus>(.*?)</synchronizationstatus>', 'Singleline')
    if ($syncMatch.Success) {
        try {
            $syncJson = $syncMatch.Groups[1].Value
            $syncObj = $syncJson | ConvertFrom-Json
            $syncDiagnostics = @($syncObj.lastFinishedPublishOperation.diagnosticDetails)
        }
        catch {
            Info "Could not parse synchronizationstatus JSON in bot.xml; continuing without diagnostics block."
        }
    }
}

$planItems = New-Object System.Collections.Generic.List[object]

foreach ($m in @($manifest)) {
    $topic = [string]$m.Topic
    $runtime = $runtimeByTopic[$topic]
    $local = $localByTopic[$topic]

    $status = "Aligned"
    if (-not $runtime) {
        $status = "MissingComponent"
    } elseif (-not $runtime.HasDialog) {
        $status = "MissingDialog"
    }

    $topicDiagnostics = @()
    foreach ($d in @($syncDiagnostics)) {
        if (-not $d) { continue }
        $json = $d | ConvertTo-Json -Depth 20
        if ($json -match [regex]::Escape($topic)) {
            $topicDiagnostics += $d
        }
    }

    $planItems.Add([pscustomobject]@{
        Topic = $topic
        DriftStatus = $status
        DialogFile = [string]$m.Dialog
        LocalSource = [string]$m.Source
        LocalSchema = if ($local) { $local.LocalSchema } else { "$localSchema.topic.$topic" }
        RuntimeSchema = if ($runtime) { $runtime.RuntimeSchema } else { $null }
        RuntimeComponentId = if ($local) { $local.ComponentId } else { $null }
        RepairAction = if ($status -eq "MissingComponent") { "Create topic component, then paste dialog YAML from DialogFile." } elseif ($status -eq "MissingDialog") { "Open existing topic component by RuntimeComponentId and replace code with DialogFile content." } else { "No repair needed." }
        BlockingDiagnostics = $topicDiagnostics
    }) | Out-Null
}

$overall = [pscustomobject]@{
    generatedAtUtc = (Get-Date).ToUniversalTime().ToString("o")
    projectRoot = $ProjectRoot
    runtimeTemplatePath = $RuntimeTemplatePath
    dialogManifestPath = $DialogManifestPath
    runtimeBotXmlPath = if (Test-Path $RuntimeBotXmlPath) { $RuntimeBotXmlPath } else { $null }
    localSchema = $localSchema
    plan = $planItems
}

New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$jsonOut = Join-Path $OutputDir "runtime-repair-plan-$stamp.json"
$mdOut = Join-Path $OutputDir "runtime-repair-plan-$stamp.md"

$overall | ConvertTo-Json -Depth 25 | Set-Content -LiteralPath $jsonOut -Encoding UTF8

$md = New-Object System.Collections.Generic.List[string]
$md.Add("# Runtime Repair Plan")
$md.Add("")
$md.Add("- Generated (UTC): $($overall.generatedAtUtc)")
$md.Add("- Local schema: $localSchema")
$md.Add("")
$md.Add("| Topic | DriftStatus | RuntimeComponentId | RuntimeSchema | DialogFile |")
$md.Add("|---|---|---|---|---|")
foreach ($i in $planItems) {
    $md.Add("| $($i.Topic) | $($i.DriftStatus) | $($i.RuntimeComponentId) | $($i.RuntimeSchema) | $($i.DialogFile) |")
}
$md.Add("")
$md.Add("## Repair Actions")
foreach ($i in $planItems) {
    if ($i.DriftStatus -eq "Aligned") { continue }
    $md.Add("- $($i.Topic): $($i.RepairAction)")
}

Set-Content -LiteralPath $mdOut -Value ($md -join "`r`n") -Encoding UTF8

Ok "Wrote repair plan JSON: $jsonOut"
Ok "Wrote repair plan Markdown: $mdOut"

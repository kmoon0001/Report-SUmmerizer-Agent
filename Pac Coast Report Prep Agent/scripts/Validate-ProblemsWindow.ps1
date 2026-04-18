param(
    [string]$ProjectRoot = "D:\Report SUmmerizer Agent\SNF Rehab Agent"
)

$ErrorActionPreference = "Stop"

function Info($m) { Write-Host "[INFO] $m" -ForegroundColor Cyan }
function Ok($m) { Write-Host "[OK]   $m" -ForegroundColor Green }
function Fail($m) { Write-Host "[FAIL] $m" -ForegroundColor Red; exit 1 }

$topicsPath = Join-Path $ProjectRoot "topics"
$settingsPath = Join-Path $ProjectRoot "settings.mcs.yml"
$botDefPath = Join-Path $ProjectRoot ".mcs\botdefinition.json"

if (-not (Test-Path $topicsPath)) { Fail "Missing topics folder: $topicsPath" }
if (-not (Test-Path $settingsPath)) { Fail "Missing settings file: $settingsPath" }
if (-not (Test-Path $botDefPath)) { Fail "Missing botdefinition file: $botDefPath" }

$topicFiles = Get-ChildItem -Path $topicsPath -File -Filter "*.mcs.yml"
if ($topicFiles.Count -eq 0) { Fail "No topic files found." }

$settingsRaw = Get-Content -Raw $settingsPath
$schemaMatch = [regex]::Match($settingsRaw, "(?m)^schemaName:\s*(.+)\s*$")
if (-not $schemaMatch.Success) { Fail "schemaName not found in settings.mcs.yml" }
$schemaName = $schemaMatch.Groups[1].Value.Trim()

Info "Checking merge markers / placeholders..."
$markerMatches = Select-String -Path $topicFiles.FullName -Pattern "^(<<<<<<<|=======|>>>>>>>)|TODO|TBD|FIXME|BROKEN" -SimpleMatch:$false
if ($markerMatches) { Fail "Found unresolved markers or placeholders in topic files." }
Ok "No unresolved markers/placeholders."

Info "Checking topic structure / IDs / trigger kinds..."
$allowedTriggers = @(
    "OnRecognizedIntent",
    "OnConversationStart",
    "OnSelectIntent",
    "OnError",
    "OnUnknownIntent",
    "OnSignIn",
    "OnSystemRedirect",
    "OnEscalate"
)

$topicNames = @{}
foreach ($f in $topicFiles) {
    $topicName = [IO.Path]::GetFileNameWithoutExtension([IO.Path]::GetFileNameWithoutExtension($f.Name))
    $topicNames[$topicName] = $true

    $raw = Get-Content -Raw $f.FullName
    if ([string]::IsNullOrWhiteSpace($raw)) { Fail "Empty topic file: $($f.Name)" }
    if ($raw -notmatch "(?m)^mcs\.metadata:\s*$") { Fail "Missing mcs.metadata in $($f.Name)" }
    if ($raw -notmatch "(?m)^kind:\s*AdaptiveDialog\s*$") { Fail "Missing kind: AdaptiveDialog in $($f.Name)" }
    if ($raw -notmatch "(?m)^beginDialog:\s*$") { Fail "Missing beginDialog block in $($f.Name)" }
    if ($raw.ToCharArray() | Where-Object { [int]$_ -gt 127 }) { Fail "Non-ASCII detected in $($f.Name)" }

    $idLines = @([regex]::Matches($raw, "(?m)^\s*id:\s*(.+?)\s*$") | ForEach-Object { $_.Groups[1].Value.Trim() })
    $dupIds = @($idLines | Group-Object | Where-Object { $_.Count -gt 1 })
    if ($dupIds.Count -gt 0) {
        Fail "Duplicate id values in $($f.Name): $($dupIds.Name -join ', ')"
    }

    $triggerMatch = [regex]::Match($raw, "(?ms)^beginDialog:\s*\r?\n\s*kind:\s*([A-Za-z0-9_]+)")
    if (-not $triggerMatch.Success) { Fail "Could not resolve beginDialog.kind in $($f.Name)" }
    $triggerKind = $triggerMatch.Groups[1].Value
    if ($allowedTriggers -notcontains $triggerKind) {
        Fail "Unsupported beginDialog.kind '$triggerKind' in $($f.Name)"
    }
}
Ok "Topic structure and trigger checks passed."

Info "Checking dialog reference integrity..."
foreach ($f in $topicFiles) {
    $raw = Get-Content -Raw $f.FullName
    $matches = [regex]::Matches($raw, "dialog:\s*([A-Za-z0-9_]+)\.topic\.([A-Za-z0-9_]+)")
    foreach ($m in $matches) {
        $refSchema = $m.Groups[1].Value
        $refTopic = $m.Groups[2].Value
        if ($refSchema -ne $schemaName) { Fail "Schema mismatch in $($f.Name): $refSchema vs $schemaName" }
        if (-not $topicNames.ContainsKey($refTopic)) { Fail "Missing dialog target $refTopic referenced in $($f.Name)" }
    }
}
Ok "Dialog references are valid."

Info "Checking botdefinition integrity..."
$bot = Get-Content -Raw $botDefPath | ConvertFrom-Json
$dialogs = @($bot.components | Where-Object { $_.'$kind' -eq 'DialogComponent' })
if ($dialogs.Count -eq 0) { Fail "No DialogComponents in botdefinition.json" }

$dupSchemas = @($dialogs | Group-Object schemaName | Where-Object { $_.Count -gt 1 })
if ($dupSchemas.Count -gt 0) {
    Fail "Duplicate DialogComponent schemaName values found in botdefinition.json"
}

$orphans = @()
foreach ($d in $dialogs) {
    $schema = [string]$d.schemaName
    if ($schema -match "\.topic\.([^.]+)$") {
        $name = $Matches[1]
        if (-not $topicNames.ContainsKey($name)) {
            $orphans += $schema
        }
    }
}
if ($orphans.Count -gt 0) {
    Fail "Orphan dialog schemas in botdefinition.json: $($orphans -join ', ')"
}
Ok "botdefinition integrity checks passed."

Ok "Problems-window validation passed."

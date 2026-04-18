param(
    [string]$ProjectRoot = "D:\Report SUmmerizer Agent\SNF Rehab Agent",
    [switch]$PruneOrphans
)

$ErrorActionPreference = "Stop"

function Info($m) { Write-Host "[INFO] $m" -ForegroundColor Cyan }
function Ok($m) { Write-Host "[OK]   $m" -ForegroundColor Green }
function Fail($m) { Write-Host "[FAIL] $m" -ForegroundColor Red; exit 1 }

$botDefPath = Join-Path $ProjectRoot ".mcs\botdefinition.json"
$topicsPath = Join-Path $ProjectRoot "topics"

if (-not (Test-Path $botDefPath)) { Fail "Missing botdefinition: $botDefPath" }
if (-not (Test-Path $topicsPath)) { Fail "Missing topics folder: $topicsPath" }

$bot = Get-Content -Raw $botDefPath | ConvertFrom-Json
$dialogComponents = @($bot.components | Where-Object { $_.'$kind' -eq 'DialogComponent' })
if ($dialogComponents.Count -eq 0) { Fail "No DialogComponent entries found in botdefinition." }

$schemaPrefix = ($dialogComponents[0].schemaName -split "\.topic\.")[0]
if ([string]::IsNullOrWhiteSpace($schemaPrefix)) { Fail "Could not resolve schema prefix from botdefinition." }

$topicFiles = Get-ChildItem -Path $topicsPath -File -Filter "*.mcs.yml"
if ($topicFiles.Count -eq 0) { Fail "No topic files found in $topicsPath" }

$topicNameSet = @{}
foreach ($f in $topicFiles) {
    $topicName = [IO.Path]::GetFileNameWithoutExtension([IO.Path]::GetFileNameWithoutExtension($f.Name))
    $topicNameSet[$topicName] = $true
}

# Dedupe dialog components by schemaName while preserving first occurrence order.
$seenSchemas = @{}
$dedupedComponents = New-Object System.Collections.ArrayList
$droppedDuplicateCount = 0
foreach ($c in @($bot.components)) {
    if ($c.'$kind' -ne 'DialogComponent') {
        [void]$dedupedComponents.Add($c)
        continue
    }
    $schema = [string]$c.schemaName
    if ([string]::IsNullOrWhiteSpace($schema)) {
        [void]$dedupedComponents.Add($c)
        continue
    }
    if ($seenSchemas.ContainsKey($schema)) {
        $droppedDuplicateCount++
        continue
    }
    $seenSchemas[$schema] = $true
    [void]$dedupedComponents.Add($c)
}
if ($droppedDuplicateCount -gt 0) {
    Info "Removed $droppedDuplicateCount duplicate DialogComponent entries by schemaName."
}

$bot.components = @($dedupedComponents)
$dialogComponents = @($bot.components | Where-Object { $_.'$kind' -eq 'DialogComponent' })

$bySchema = @{}
foreach ($d in $dialogComponents) {
    $bySchema[$d.schemaName] = $d
}

$updated = @()
$added = @()

foreach ($f in $topicFiles) {
    $topicName = [IO.Path]::GetFileNameWithoutExtension([IO.Path]::GetFileNameWithoutExtension($f.Name))
    $schemaName = "$schemaPrefix.topic.$topicName"
    $raw = Get-Content -Raw $f.FullName
    $dialogMatch = [regex]::Match($raw, "(?ms)^kind:\s*AdaptiveDialog.*$")
    if (-not $dialogMatch.Success) { continue }
    $dialogText = $dialogMatch.Value

    $componentName = $topicName
    $metaName = [regex]::Match($raw, "(?m)^\s*componentName:\s*(.+)\s*$")
    if ($metaName.Success) {
        $componentName = $metaName.Groups[1].Value.Trim().Trim('"')
    }

    $description = "Synced from local topic file."
    $descMatch = [regex]::Match($raw, "(?m)^\s*description:\s*(.+)\s*$")
    if ($descMatch.Success) {
        $description = $descMatch.Groups[1].Value.Trim().Trim('"')
    }

    if ($bySchema.ContainsKey($schemaName)) {
        $comp = $bySchema[$schemaName]
        if ($comp.PSObject.Properties.Name -contains "displayName") {
            $comp.displayName = $componentName
        } else {
            $comp | Add-Member -NotePropertyName "displayName" -NotePropertyValue $componentName -Force
        }
        if ($comp.PSObject.Properties.Name -contains "description") {
            $comp.description = $description
        } else {
            $comp | Add-Member -NotePropertyName "description" -NotePropertyValue $description -Force
        }
        if ($comp.PSObject.Properties.Name -contains "dialog") {
            $comp.dialog = $dialogText
        } else {
            $comp | Add-Member -NotePropertyName "dialog" -NotePropertyValue $dialogText -Force
        }
        if ($comp.auditInfo -and $comp.auditInfo.PSObject.Properties.Name -contains "modifiedTimeUtc") {
            $comp.auditInfo.modifiedTimeUtc = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
        }
        $updated += $topicName
    }
    else {
        $sample = $dialogComponents[0]
        $new = [ordered]@{
            '$kind' = 'DialogComponent'
            version = 1
            managedProperties = [ordered]@{
                '$kind' = 'ManagedProperties'
                isCustomizable = $true
                solutionId = $sample.managedProperties.solutionId
            }
            auditInfo = [ordered]@{
                '$kind' = 'AuditInfo'
                createdTimeUtc = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
                modifiedTimeUtc = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
            }
            displayName = $componentName
            id = [guid]::NewGuid().ToString()
            parentBotId = $sample.parentBotId
            description = $description
            shareContext = [ordered]@{
                '$kind' = 'ContentShareContext'
            }
            state = 'Active'
            status = 'Active'
            publisherUniqueName = $sample.publisherUniqueName
            schemaName = $schemaName
            dialog = $dialogText
        }
        $bot.components += [pscustomobject]$new
        $added += $topicName
    }
}

$pruned = @()
if ($PruneOrphans) {
    $kept = New-Object System.Collections.ArrayList
    foreach ($c in @($bot.components)) {
        if ($c.'$kind' -ne 'DialogComponent') {
            [void]$kept.Add($c)
            continue
        }
        $schema = [string]$c.schemaName
        if ($schema -match "\.topic\.([^.]+)$") {
            $topicName = $Matches[1]
            if (-not $topicNameSet.ContainsKey($topicName)) {
                $pruned += $schema
                continue
            }
        }
        [void]$kept.Add($c)
    }
    $bot.components = @($kept)
}

$backup = "$botDefPath.bak-sync-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
Copy-Item -LiteralPath $botDefPath -Destination $backup -Force
$bot | ConvertTo-Json -Depth 60 | Set-Content -LiteralPath $botDefPath -Encoding UTF8

Ok "botdefinition sync complete."
Write-Host "[OK]   Updated topics: $($updated.Count)" -ForegroundColor Green
Write-Host "[OK]   Added topics: $($added.Count)" -ForegroundColor Green
Write-Host "[OK]   Pruned orphan dialogs: $($pruned.Count)" -ForegroundColor Green
Write-Host "[OK]   Backup: $backup" -ForegroundColor Green

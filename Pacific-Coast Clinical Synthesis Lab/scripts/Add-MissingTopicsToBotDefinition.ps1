param(
    [string]$ProjectRoot = "D:\Report SUmmerizer Agent\SNF Rehab Agent"
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

$sample = $dialogComponents[0]
$solutionId = $sample.managedProperties.solutionId
$parentBotId = $sample.parentBotId
$publisherUniqueName = $sample.publisherUniqueName
$schemaPrefix = ($sample.schemaName -split "\.topic\.")[0]

$existingSchema = @{}
foreach ($d in $dialogComponents) { $existingSchema[$d.schemaName] = $true }

$added = @()

Get-ChildItem -Path $topicsPath -File -Filter "*.mcs.yml" | ForEach-Object {
    $topicName = $_.BaseName -replace '\.mcs$',''
    $schemaName = "$schemaPrefix.topic.$topicName"
    if ($existingSchema.ContainsKey($schemaName)) { return }

    $raw = Get-Content -Raw $_.FullName
    $dialogStart = [regex]::Match($raw, '(?ms)^kind:\s*AdaptiveDialog.*$')
    if (-not $dialogStart.Success) { return }
    $dialogText = $dialogStart.Value

    $desc = "Auto-imported topic: $topicName."
    $descMatch = [regex]::Match($raw, '(?m)^\s*description:\s*(.+)$')
    if ($descMatch.Success) {
        $desc = $descMatch.Groups[1].Value.Trim().Trim('"')
    }

    $new = [ordered]@{
        '$kind' = 'DialogComponent'
        version = 1
        managedProperties = [ordered]@{
            '$kind' = 'ManagedProperties'
            isCustomizable = $true
            solutionId = $solutionId
        }
        auditInfo = [ordered]@{
            '$kind' = 'AuditInfo'
            createdTimeUtc = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
            modifiedTimeUtc = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
        }
        displayName = $topicName
        id = [guid]::NewGuid().ToString()
        parentBotId = $parentBotId
        description = $desc
        shareContext = [ordered]@{
            '$kind' = 'ContentShareContext'
        }
        state = 'Active'
        status = 'Active'
        publisherUniqueName = $publisherUniqueName
        schemaName = $schemaName
        dialog = $dialogText
    }

    $bot.components += [pscustomobject]$new
    $added += $topicName
}

if ($added.Count -eq 0) {
    Info "No missing topics were added."
} else {
    $backup = "$botDefPath.bak-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    Copy-Item -LiteralPath $botDefPath -Destination $backup -Force
    $bot | ConvertTo-Json -Depth 50 | Set-Content -LiteralPath $botDefPath -Encoding UTF8
    Ok "Added $($added.Count) topics to botdefinition."
    Write-Host ("[OK]   Added topics: " + ($added -join ", ")) -ForegroundColor Green
    Write-Host "[OK]   Backup: $backup" -ForegroundColor Green
}

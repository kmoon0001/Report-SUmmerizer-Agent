param(
    [string]$Root = (Get-Location).Path,
    [string]$ManifestPath = "scripts/alm/agent-alm.manifest.json",
    [string]$ArtifactsRoot = "artifacts/alm",
    [switch]$OnlyEnabled = $true,
    [switch]$PublishAfterImport = $true,
    [switch]$ForceOverwrite
)

$ErrorActionPreference = "Stop"

function Invoke-Pac {
    param([string]$Command)
    Write-Host "> $Command" -ForegroundColor DarkCyan
    Invoke-Expression $Command
    if ($LASTEXITCODE -ne 0) {
        throw "PAC command failed: $Command"
    }
}

function Slugify {
    param([string]$Text)
    if (-not $Text) { return "unknown" }
    return (($Text -replace '[^A-Za-z0-9._-]+','-').Trim('-')).ToLowerInvariant()
}

$rootPath = (Resolve-Path -LiteralPath $Root).Path
Set-Location $rootPath

$manifestFull = Join-Path $rootPath $ManifestPath
if (-not (Test-Path -LiteralPath $manifestFull)) {
    throw "Manifest not found: $manifestFull"
}
$manifest = Get-Content -LiteralPath $manifestFull -Raw | ConvertFrom-Json

$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$repackedRoot = Join-Path $rootPath "$ArtifactsRoot/repacked/$stamp"
$unpackRoot = Join-Path $rootPath "$ArtifactsRoot/unpacked"
$logRoot = Join-Path $rootPath "$ArtifactsRoot/logs"
New-Item -ItemType Directory -Path $repackedRoot,$logRoot -Force | Out-Null

$results = @()
$agents = $manifest.agents
if ($OnlyEnabled) {
    $agents = $agents | Where-Object { $_.enabled -eq $true }
}

foreach ($a in $agents) {
    $project = "$($a.projectPath)"
    $solutionName = "$($a.solutionName)"
    $environment = if ($a.dataverseEndpoint) { "$($a.dataverseEndpoint)" } else { "$($a.environmentId)" }
    $agentId = "$($a.agentId)"
    $slug = Slugify "$project"
    $sourceFolder = Join-Path $unpackRoot $slug

    $row = [ordered]@{
        projectPath = $project
        solutionName = $solutionName
        environment = $environment
        agentId = $agentId
        sourceFolder = $sourceFolder
        zipPath = ""
        status = "pending"
        error = ""
    }

    try {
        if (-not $solutionName) {
            $row.status = "skipped"
            $row.error = "solutionName missing in manifest"
            $results += [pscustomobject]$row
            continue
        }
        if (-not (Test-Path -LiteralPath $sourceFolder)) {
            $row.status = "skipped"
            $row.error = "unpacked source folder missing"
            $results += [pscustomobject]$row
            continue
        }

        $zipPath = Join-Path $repackedRoot ("{0}_{1}.zip" -f (Slugify $solutionName), $slug)
        $row.zipPath = $zipPath

        $packCmd = "pac solution pack --zipfile `"$zipPath`" --folder `"$sourceFolder`" --packagetype Unmanaged"
        Invoke-Pac -Command $packCmd

        $importCmd = "pac solution import --environment `"$environment`" --path `"$zipPath`" --async --max-async-wait-time $($manifest.defaults.maxAsyncWaitTimeMinutes)"
        if ($ForceOverwrite) {
            $importCmd += " --force-overwrite"
        }
        Invoke-Pac -Command $importCmd

        if ($PublishAfterImport -and $agentId) {
            $publishCmd = "pac copilot publish --environment `"$environment`" --bot `"$agentId`""
            Invoke-Pac -Command $publishCmd

            $listCmd = "pac copilot list --environment `"$environment`""
            Invoke-Pac -Command $listCmd
        }

        $row.status = "ok"
    } catch {
        $row.status = "failed"
        $row.error = $_.Exception.Message
    }

    $results += [pscustomobject]$row
}

$logPath = Join-Path $logRoot "pack-import-publish-$stamp.json"
$results | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $logPath -Encoding utf8
Write-Host "Wrote run log: $logPath"

$failed = @($results | Where-Object { $_.status -eq 'failed' }).Count
$ok = @($results | Where-Object { $_.status -eq 'ok' }).Count
$skipped = @($results | Where-Object { $_.status -eq 'skipped' }).Count
Write-Host "Summary => ok: $ok, skipped: $skipped, failed: $failed"
if ($failed -gt 0) { exit 1 }

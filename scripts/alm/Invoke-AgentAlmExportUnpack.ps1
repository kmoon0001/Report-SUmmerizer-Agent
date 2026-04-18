param(
    [string]$Root = (Get-Location).Path,
    [string]$ManifestPath = "scripts/alm/agent-alm.manifest.json",
    [string]$ArtifactsRoot = "artifacts/alm",
    [switch]$OnlyEnabled = $true,
    [switch]$CleanUnpack
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
$zipRoot = Join-Path $rootPath "$ArtifactsRoot/exports/$stamp"
$unpackRoot = Join-Path $rootPath "$ArtifactsRoot/unpacked"
$logRoot = Join-Path $rootPath "$ArtifactsRoot/logs"
New-Item -ItemType Directory -Path $zipRoot,$unpackRoot,$logRoot -Force | Out-Null

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

    $row = [ordered]@{
        projectPath = $project
        solutionName = $solutionName
        environment = $environment
        agentId = $agentId
        status = "pending"
        zipPath = ""
        unpackPath = ""
        error = ""
    }

    try {
        if (-not $solutionName) {
            $row.status = "skipped"
            $row.error = "solutionName missing in manifest"
            $results += [pscustomobject]$row
            continue
        }

        $zipPath = Join-Path $zipRoot ("{0}_{1}.zip" -f (Slugify $solutionName), $slug)
        $row.zipPath = $zipPath

        $exportCmd = "pac solution export --environment `"$environment`" --name `"$solutionName`" --path `"$zipPath`" --overwrite"
        if ($manifest.defaults.exportManaged -eq $true) {
            $exportCmd += " --managed"
        }
        Invoke-Pac -Command $exportCmd
        if (-not (Test-Path -LiteralPath $zipPath)) {
            throw "Expected export zip not found after export: $zipPath"
        }

        $targetUnpack = Join-Path $unpackRoot $slug
        $row.unpackPath = $targetUnpack
        if ($CleanUnpack -and (Test-Path -LiteralPath $targetUnpack)) {
            Remove-Item -LiteralPath $targetUnpack -Recurse -Force
        }
        New-Item -ItemType Directory -Path $targetUnpack -Force | Out-Null

        $unpackCmd = "pac solution unpack --zipfile `"$zipPath`" --folder `"$targetUnpack`" --packagetype Unmanaged --allowDelete --allowWrite --clobber"
        Invoke-Pac -Command $unpackCmd

        $row.status = "ok"
    } catch {
        $row.status = "failed"
        $row.error = $_.Exception.Message
    }

    $results += [pscustomobject]$row
}

$logPath = Join-Path $logRoot "export-unpack-$stamp.json"
$results | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $logPath -Encoding utf8
Write-Host "Wrote run log: $logPath"

$failed = @($results | Where-Object { $_.status -eq 'failed' }).Count
$ok = @($results | Where-Object { $_.status -eq 'ok' }).Count
$skipped = @($results | Where-Object { $_.status -eq 'skipped' }).Count
Write-Host "Summary => ok: $ok, skipped: $skipped, failed: $failed"
if ($failed -gt 0) { exit 1 }

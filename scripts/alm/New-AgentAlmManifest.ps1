param(
    [string]$Root = (Get-Location).Path,
    [string]$OutputPath = "scripts/alm/agent-alm.manifest.json",
    [switch]$IncludeArchived
)

$ErrorActionPreference = "Stop"

function Get-AgentDisplayName {
    param([string]$AgentFile)

    if (-not (Test-Path -LiteralPath $AgentFile)) { return "" }

    $raw = Get-Content -LiteralPath $AgentFile -Raw
    if ($raw -match '(?m)^displayName:\s*(.+)$') {
        return $Matches[1].Trim("`"`r`n ".ToCharArray())
    }
    if ($raw -match '(?m)^mcs\.metadata:\s*[\r\n]+\s*componentName:\s*(.+)$') {
        return $Matches[1].Trim("`"`r`n ".ToCharArray())
    }
    return ""
}

$rootPath = (Resolve-Path -LiteralPath $Root).Path
Set-Location $rootPath

$connFiles = Get-ChildItem -Path $rootPath -Recurse -Force -File -Filter conn.json |
    Where-Object { $_.FullName -like '*\.mcs\conn.json' }

$agents = @()
foreach ($connFile in $connFiles) {
    $projectDir = Split-Path (Split-Path $connFile.FullName -Parent) -Parent
    $projectRel = $projectDir.Substring($rootPath.Length + 1)

    if (-not $IncludeArchived -and $projectRel -like 'archived_agents*') {
        continue
    }

    try {
        $conn = Get-Content -LiteralPath $connFile.FullName -Raw | ConvertFrom-Json
    } catch {
        Write-Warning "Skipping unreadable conn.json: $($connFile.FullName)"
        continue
    }

    $environmentId = "$($conn.EnvironmentId)" -replace '^Default-',''
    $dataverseEndpoint = "$($conn.DataverseEndpoint)"
    $agentId = "$($conn.AgentId)"

    $displayName = Get-AgentDisplayName -AgentFile (Join-Path $projectDir 'agent.mcs.yml')

    $agents += [pscustomobject]@{
        enabled = $true
        projectPath = $projectRel
        sourceOfTruth = "local"
        mergeMode = "none"
        localDisplayName = $displayName
        agentId = $agentId
        environmentId = $environmentId
        dataverseEndpoint = $dataverseEndpoint
        solutionName = ""
        notes = "Set solutionName before running export/unpack."
    }
}

$manifest = [pscustomobject]@{
    generatedAtUtc = (Get-Date).ToUniversalTime().ToString('o')
    root = $rootPath
    defaults = [pscustomobject]@{
        exportManaged = $false
        overwriteExports = $true
        importAsync = $true
        maxAsyncWaitTimeMinutes = 60
    }
    agents = $agents | Sort-Object projectPath
}

$outPath = Join-Path $rootPath $OutputPath
$outDir = Split-Path $outPath -Parent
if (-not (Test-Path -LiteralPath $outDir)) {
    New-Item -ItemType Directory -Path $outDir -Force | Out-Null
}

$manifest | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $outPath -Encoding utf8
Write-Host "Wrote manifest: $outPath"
Write-Host "Agents discovered: $($manifest.agents.Count)"

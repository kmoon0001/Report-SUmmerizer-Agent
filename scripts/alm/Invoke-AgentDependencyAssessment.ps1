param(
    [string]$Root = (Get-Location).Path,
    [string]$ManifestPath = "scripts/alm/agent-alm.manifest.json"
)

$ErrorActionPreference = "Stop"

$rootPath = (Resolve-Path -LiteralPath $Root).Path
$manifestFull = Join-Path $rootPath $ManifestPath
if (-not (Test-Path -LiteralPath $manifestFull)) {
    throw "Manifest not found: $manifestFull"
}

$manifest = Get-Content -LiteralPath $manifestFull -Raw | ConvertFrom-Json
$agents = @($manifest.agents | Where-Object { $_.enabled -eq $true })

$rows = @()
$gaps = @()
foreach ($a in $agents) {
    $projectRel = "$($a.projectPath)"
    $projectPath = Join-Path $rootPath $projectRel
    if (-not (Test-Path -LiteralPath $projectPath)) { continue }

    $actionFiles = Get-ChildItem -Path (Join-Path $projectPath 'actions') -File -Filter '*.mcs.yml' -ErrorAction SilentlyContinue
    $flowIdMatches = foreach ($f in $actionFiles) {
        $raw = Get-Content -LiteralPath $f.FullName -Raw
        [regex]::Matches($raw, '(?im)^\s*flowId:\s*([0-9a-fA-F-]{36})\s*$') | ForEach-Object {
            [pscustomobject]@{ file = $f.FullName; flowId = $_.Groups[1].Value.ToLowerInvariant() }
        }
    }
    $flowIds = @($flowIdMatches | Select-Object -ExpandProperty flowId -Unique)

    $workflowFolders = Get-ChildItem -Path (Join-Path $projectPath 'workflows') -Directory -ErrorAction SilentlyContinue
    $workflowIds = @()
    foreach ($wf in $workflowFolders) {
        $metaPath = Join-Path $wf.FullName 'metadata.yml'
        if (Test-Path -LiteralPath $metaPath) {
            $raw = Get-Content -LiteralPath $metaPath -Raw
            $m = [regex]::Match($raw, '(?im)^\s*workflowId:\s*([0-9a-fA-F-]{36})\s*$')
            if ($m.Success) {
                $workflowIds += $m.Groups[1].Value.ToLowerInvariant()
            }
        }
    }
    $workflowIds = @($workflowIds | Sort-Object -Unique)

    $missingLocalWorkflow = @($flowIds | Where-Object { $_ -notin $workflowIds })

    $connRefsPath = Join-Path $projectPath 'connectionreferences.mcs.yml'
    $hasConnRefs = Test-Path -LiteralPath $connRefsPath

    $workflowJsonFiles = Get-ChildItem -Path (Join-Path $projectPath 'workflows') -Recurse -File -Filter 'workflow.json' -ErrorAction SilentlyContinue
    $placeholderHits = @()
    foreach ($wfJson in $workflowJsonFiles) {
        $raw = Get-Content -LiteralPath $wfJson.FullName -Raw
        if ($raw -match 'CLINICAL_TEAMS_GROUP_ID|NURSING_STATION_CHANNEL_ID|"contentVersion"\s*:\s*"undefined"|TODO|TBD|PLACEHOLDER') {
            $placeholderHits += $wfJson.FullName.Substring($rootPath.Length + 1)
        }
    }

    $rows += [pscustomobject]@{
        projectPath = $projectRel
        sourceOfTruth = $a.sourceOfTruth
        mergeMode = $a.mergeMode
        solutionName = $a.solutionName
        actionFiles = @($actionFiles).Count
        actionFlowIds = $flowIds.Count
        localWorkflowIds = $workflowIds.Count
        missingLocalWorkflowCount = $missingLocalWorkflow.Count
        hasConnectionReferencesFile = $hasConnRefs
        workflowPlaceholderFileCount = @($placeholderHits).Count
    }

    if ($missingLocalWorkflow.Count -gt 0) {
        $gaps += [pscustomobject]@{ projectPath=$projectRel; gapType='missing_local_workflow_bindings'; details=($missingLocalWorkflow -join ', ') }
    }
    if (-not $hasConnRefs) {
        $gaps += [pscustomobject]@{ projectPath=$projectRel; gapType='missing_connectionreferences_file'; details='connectionreferences.mcs.yml not found' }
    }
    if ($placeholderHits.Count -gt 0) {
        $gaps += [pscustomobject]@{ projectPath=$projectRel; gapType='workflow_placeholders_or_undefined_values'; details=($placeholderHits -join '; ') }
    }
    if (-not $a.solutionName) {
        $gaps += [pscustomobject]@{ projectPath=$projectRel; gapType='solution_mapping_missing'; details='Set solutionName in manifest for solution-first ALM' }
    }
}

$outDir = Join-Path $rootPath 'artifacts/alm/reports'
New-Item -ItemType Directory -Path $outDir -Force | Out-Null
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$summaryCsv = Join-Path $outDir "dependency-assessment-$stamp.csv"
$gapsCsv = Join-Path $outDir "dependency-gaps-$stamp.csv"
$rows | Export-Csv -LiteralPath $summaryCsv -NoTypeInformation -Encoding UTF8
$gaps | Export-Csv -LiteralPath $gapsCsv -NoTypeInformation -Encoding UTF8

Write-Host "ASSESSMENT_SUMMARY=$summaryCsv"
Write-Host "ASSESSMENT_GAPS=$gapsCsv"
Write-Host "PROJECTS=$($rows.Count)"
Write-Host "GAPS=$($gaps.Count)"

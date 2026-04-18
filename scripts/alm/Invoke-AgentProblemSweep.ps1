param(
    [string]$Root = (Get-Location).Path,
    [string]$ManifestPath = "scripts/alm/agent-alm.manifest.json",
    [string]$IgnorePath = "scripts/alm/problem-sweep.ignore.json",
    [switch]$AllProjects,
    [switch]$IncludeDisabled
)

$ErrorActionPreference = "Stop"

function Add-Issue {
    param(
        [ref]$Bucket,
        [string]$Project,
        [string]$Severity,
        [string]$Type,
        [string]$Path,
        [string]$Details
    )
    $Bucket.Value += [pscustomobject]@{
        project = $Project
        severity = $Severity
        type = $Type
        path = $Path
        details = $Details
    }
}

function Get-Projects {
    param(
        [string]$RootPath,
        [string]$ManifestFile,
        [switch]$UseAll,
        [switch]$UseDisabled
    )

    if ($UseAll) {
        return Get-ChildItem -Path $RootPath -Recurse -File -Filter agent.mcs.yml |
            ForEach-Object { Split-Path $_.FullName -Parent } |
            Sort-Object -Unique
    }

    if (-not (Test-Path -LiteralPath $ManifestFile)) {
        throw "Manifest not found: $ManifestFile"
    }

    $manifest = Get-Content -LiteralPath $ManifestFile -Raw | ConvertFrom-Json
    $agents = @($manifest.agents)
    if (-not $UseDisabled) {
        $agents = $agents | Where-Object { $_.enabled -eq $true }
    }

    return $agents | ForEach-Object { Join-Path $RootPath $_.projectPath } | Sort-Object -Unique
}

function Get-ActionFlowIds {
    param([string]$ProjectPath)

    $items = @()
    $actionFiles = Get-ChildItem -Path (Join-Path $ProjectPath 'actions') -File -Filter '*.mcs.yml' -ErrorAction SilentlyContinue
    foreach ($file in $actionFiles) {
        $raw = Get-Content -LiteralPath $file.FullName -Raw
        $matches = [regex]::Matches($raw, '(?im)^\s*flowId:\s*([0-9a-fA-F-]{36})\s*$')
        foreach ($m in $matches) {
            $items += [pscustomobject]@{
                file = $file.FullName
                flowId = $m.Groups[1].Value.ToLowerInvariant()
            }
        }
    }
    return $items
}

function Get-WorkflowMetadata {
    param([string]$ProjectPath)

    $workflowsRoot = Join-Path $ProjectPath 'workflows'
    $folders = Get-ChildItem -Path $workflowsRoot -Directory -ErrorAction SilentlyContinue
    $items = @()
    foreach ($folder in $folders) {
        $folderId = ''
        if ($folder.Name -match '([0-9a-fA-F-]{36})$') {
            $folderId = $Matches[1].ToLowerInvariant()
        }

        $metadataPath = Join-Path $folder.FullName 'metadata.yml'
        $metaId = ''
        if (Test-Path -LiteralPath $metadataPath) {
            $metaRaw = Get-Content -LiteralPath $metadataPath -Raw
            $m = [regex]::Match($metaRaw, '(?im)^\s*workflowId:\s*([0-9a-fA-F-]{36})\s*$')
            if ($m.Success) {
                $metaId = $m.Groups[1].Value.ToLowerInvariant()
            }
        }

        $items += [pscustomobject]@{
            folder = $folder.FullName
            folderName = $folder.Name
            folderId = $folderId
            metadataPath = $metadataPath
            metadataId = $metaId
            hasWorkflowJson = Test-Path -LiteralPath (Join-Path $folder.FullName 'workflow.json')
        }
    }
    return $items
}

$rootPath = (Resolve-Path -LiteralPath $Root).Path
$manifestFull = Join-Path $rootPath $ManifestPath
$projects = Get-Projects -RootPath $rootPath -ManifestFile $manifestFull -UseAll:$AllProjects -UseDisabled:$IncludeDisabled

$ignoreMap = @{}
$ignoreFull = Join-Path $rootPath $IgnorePath
if (Test-Path -LiteralPath $ignoreFull) {
    try {
        $ignoreDoc = Get-Content -LiteralPath $ignoreFull -Raw | ConvertFrom-Json
        foreach ($entry in @($ignoreDoc.projects)) {
            if ($entry.path) {
                $ignoreMap[$entry.path] = "$($entry.reason)"
            }
        }
    } catch {
        Write-Warning "Unable to parse ignore file: $ignoreFull"
    }
}

$issues = @()
foreach ($project in $projects) {
    if (-not (Test-Path -LiteralPath $project)) { continue }
    $projectRel = $project.Substring($rootPath.Length + 1)
    if ($ignoreMap.ContainsKey($projectRel)) { continue }

    # Merge marker scan
    $mergeHits = rg -n "^(<<<<<<<|=======|>>>>>>>)( .+)?$" "$project" --glob "!**/node_modules/**" --glob "!**/.git/**" 2>$null
    if ($LASTEXITCODE -eq 0) {
        foreach ($hit in $mergeHits) {
            Add-Issue -Bucket ([ref]$issues) -Project $projectRel -Severity 'critical' -Type 'merge_marker' -Path $projectRel -Details $hit
        }
    }

    # Connection state
    $connPath = Join-Path $project '.mcs\conn.json'
    if (-not (Test-Path -LiteralPath $connPath)) {
        Add-Issue -Bucket ([ref]$issues) -Project $projectRel -Severity 'high' -Type 'missing_conn' -Path (Join-Path $projectRel '.mcs/conn.json') -Details 'Missing .mcs/conn.json'
    } else {
        try {
            $conn = Get-Content -LiteralPath $connPath -Raw | ConvertFrom-Json
            if (-not $conn.AgentId -or ((-not $conn.EnvironmentId) -and (-not $conn.DataverseEndpoint))) {
                Add-Issue -Bucket ([ref]$issues) -Project $projectRel -Severity 'high' -Type 'incomplete_conn' -Path (Join-Path $projectRel '.mcs/conn.json') -Details 'AgentId or Environment binding missing'
            }
        } catch {
            Add-Issue -Bucket ([ref]$issues) -Project $projectRel -Severity 'high' -Type 'invalid_conn_json' -Path (Join-Path $projectRel '.mcs/conn.json') -Details 'Invalid JSON in conn.json'
        }
    }

    # Action flow bindings and workflow folders
    $flows = Get-ActionFlowIds -ProjectPath $project
    $workflowMeta = Get-WorkflowMetadata -ProjectPath $project
    $workflowIds = @{}
    foreach ($wf in $workflowMeta) {
        if ($wf.metadataId) { $workflowIds[$wf.metadataId] = $wf.folderName }
    }

    foreach ($f in $flows) {
        if (-not $workflowIds.ContainsKey($f.flowId)) {
            Add-Issue -Bucket ([ref]$issues) -Project $projectRel -Severity 'high' -Type 'missing_workflow_for_flowid' -Path ($f.file.Substring($rootPath.Length + 1)) -Details "flowId $($f.flowId) not found in workflows/*/metadata.yml"
        }
    }

    foreach ($wf in $workflowMeta) {
        if (-not (Test-Path -LiteralPath $wf.metadataPath)) {
            Add-Issue -Bucket ([ref]$issues) -Project $projectRel -Severity 'medium' -Type 'missing_workflow_metadata' -Path ($wf.folder.Substring($rootPath.Length + 1)) -Details 'Workflow folder missing metadata.yml'
            continue
        }
        if (-not $wf.hasWorkflowJson) {
            Add-Issue -Bucket ([ref]$issues) -Project $projectRel -Severity 'medium' -Type 'missing_workflow_json' -Path ($wf.folder.Substring($rootPath.Length + 1)) -Details 'Workflow folder missing workflow.json'
        }
        if (-not $wf.folderId) {
            Add-Issue -Bucket ([ref]$issues) -Project $projectRel -Severity 'low' -Type 'workflow_folder_no_guid_suffix' -Path ($wf.folder.Substring($rootPath.Length + 1)) -Details 'Folder name has no GUID suffix'
        } elseif (-not $wf.metadataId) {
            Add-Issue -Bucket ([ref]$issues) -Project $projectRel -Severity 'high' -Type 'workflow_metadata_missing_id' -Path ($wf.metadataPath.Substring($rootPath.Length + 1)) -Details 'metadata.yml missing workflowId'
        }
    }

    # Placeholder/stub markers on active paths
    $placeholderTargets = @(
        Join-Path $project 'actions'
        Join-Path $project 'topics'
        Join-Path $project 'workflows'
    ) | Where-Object { Test-Path -LiteralPath $_ }
    if ($placeholderTargets.Count -gt 0) {
        $placeholderHits = rg -n "\b(TODO|TBD|Untitled|BROKEN_PLACEHOLDER|DRAFT_ONLY)\b" @placeholderTargets --glob "!**/node_modules/**" --glob "!**/*.disabled" 2>$null
        if ($LASTEXITCODE -eq 0) {
            foreach ($hit in $placeholderHits) {
                Add-Issue -Bucket ([ref]$issues) -Project $projectRel -Severity 'medium' -Type 'placeholder_marker' -Path $projectRel -Details $hit
            }
        }
    }
}

$outDir = Join-Path $rootPath 'artifacts/alm/reports'
New-Item -ItemType Directory -Path $outDir -Force | Out-Null
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$jsonPath = Join-Path $outDir "problem-sweep-$stamp.json"
$csvPath = Join-Path $outDir "problem-sweep-$stamp.csv"
$issues | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $jsonPath -Encoding utf8
$issues | Export-Csv -LiteralPath $csvPath -NoTypeInformation -Encoding UTF8

$summary = $issues | Group-Object severity,type | Sort-Object Count -Descending
Write-Host "PROJECTS_SCANNED=$($projects.Count)"
Write-Host "TOTAL_ISSUES=$($issues.Count)"
Write-Host "REPORT_JSON=$jsonPath"
Write-Host "REPORT_CSV=$csvPath"
foreach ($s in $summary) {
    Write-Host ("{0}/{1}={2}" -f $s.Group[0].severity, $s.Group[0].type, $s.Count)
}
if ($issues.Count -gt 0) { exit 2 }

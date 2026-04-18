Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$topicsDir = Join-Path $projectRoot "topics"
$actionsDir = Join-Path $projectRoot "actions"
$workflowsDir = Join-Path $projectRoot "workflows"
$knowledgeDir = Join-Path $projectRoot "knowledge_sources"

$requiredSharedActionOutputs = @(
  "status",
  "summary",
  "confidence",
  "requireshumanreview",
  "datasource",
  "warnings"
)

$errors = [System.Collections.Generic.List[string]]::new()
$warnings = [System.Collections.Generic.List[string]]::new()

function Add-Error([string]$message) {
  $script:errors.Add($message)
}

function Add-Warning([string]$message) {
  $script:warnings.Add($message)
}

function Get-FileMap([string]$path, [string]$filter) {
  $map = @{}
  Get-ChildItem -Path $path -Filter $filter | ForEach-Object {
    $normalizedName = $_.Name -replace '\.mcs\.yml$', ''
    $map[$normalizedName] = $_.FullName
  }
  return $map
}

function Get-YamlValue([string]$content, [string]$key) {
  $match = [regex]::Match($content, "(?m)^\s*" + [regex]::Escape($key) + ":\s*(.+)$")
  if ($match.Success) { return $match.Groups[1].Value.Trim() }
  return $null
}

function Get-ActionOutputNames([string]$content) {
  $inOutputs = $false
  $names = New-Object System.Collections.Generic.List[string]
  $lines = $content -split "\r?\n"
  foreach ($line in $lines) {
    if ($line -match "^outputs:") {
      $inOutputs = $true
      continue
    }
    if ($inOutputs -and $line -match "^\S") {
      $inOutputs = $false
      continue
    }
    if ($inOutputs -and $line -match "propertyName:\s*(\S+)") {
      $names.Add($matches[1])
    }
  }
  return $names
}

function Get-DynamicClosedListVariables([string]$content) {
  $matches = [regex]::Matches(
    $content,
    '(?ms)-\s+kind:\s+Question.*?variable:\s+init:Topic\.([A-Za-z0-9_]+).*?entity:\s*\r?\n\s*kind:\s*DynamicClosedListEntity'
  )

  $names = [System.Collections.Generic.HashSet[string]]::new()
  foreach ($match in $matches) {
    [void]$names.Add($match.Groups[1].Value)
  }

  return @($names)
}

$topicFiles = Get-FileMap $topicsDir "*.mcs.yml"
$actionFiles = Get-FileMap $actionsDir "*.mcs.yml"
$workflowFolders = Get-ChildItem -Path $workflowsDir -Directory

$workflowIdByFolder = @{}
$workflowIdIndex = @{}
$workflowObjects = @{}
foreach ($folder in $workflowFolders) {
  $metadataPath = Join-Path $folder.FullName "metadata.yml"
  $workflowJsonPath = Join-Path $folder.FullName "workflow.json"
  if (-not (Test-Path $metadataPath)) {
    Add-Error "Workflow folder missing metadata.yml: $($folder.Name)"
    continue
  }
  if (-not (Test-Path $workflowJsonPath)) {
    Add-Error "Workflow folder missing workflow.json: $($folder.Name)"
    continue
  }
  $metadata = Get-Content -Raw $metadataPath
  $workflowId = Get-YamlValue $metadata "workflowId"
  if (-not $workflowId) {
    Add-Error "Workflow metadata missing workflowId: $($folder.Name)"
    continue
  }
  $workflowIdByFolder[$folder.Name] = $workflowId
  $workflowIdIndex[$workflowId] = $folder.Name
  try {
    $workflowObject = Get-Content -Raw $workflowJsonPath | ConvertFrom-Json
    $workflowObjects[$workflowId] = $workflowObject
  } catch {
    Add-Error "Workflow JSON failed to parse: $($folder.Name)"
    continue
  }

  $definition = $workflowObject.properties.definition
  if ($definition.triggers.manual.kind -ne "Skills") {
    Add-Error "Workflow manual trigger is not Skills kind: $($folder.Name)"
  }
  if (-not $definition.actions.Respond_to_the_agent) {
    Add-Error "Workflow missing Respond_to_the_agent action: $($folder.Name)"
    continue
  }
  if ($definition.actions.Respond_to_the_agent.kind -ne "Skills") {
    Add-Error "Workflow response action is not Skills kind: $($folder.Name)"
  }
}

foreach ($actionPath in $actionFiles.Values) {
  $actionFileName = [System.IO.Path]::GetFileName($actionPath)
  $actionName = $actionFileName -replace '\.mcs\.yml$', ''
  $content = Get-Content -Raw $actionPath
  $kind = Get-YamlValue $content "kind"
  if ($kind -ne "TaskDialog") {
    Add-Error "Action kind is not TaskDialog: $actionFileName"
  }
  $displayName = Get-YamlValue $content "modelDisplayName"
  if (-not $displayName) {
    Add-Error "Action missing modelDisplayName: $actionFileName"
  }
  $modelDescription = Get-YamlValue $content "modelDescription"
  if (-not $modelDescription) {
    Add-Warning "Action missing modelDescription: $actionFileName"
  } elseif ($modelDescription -notmatch '^(Use this action to|Use this action when)') {
    Add-Warning "Action modelDescription should start with 'Use this action to' or 'Use this action when' for clearer orchestration: $actionFileName"
  }
  $flowId = Get-YamlValue $content "flowId"
  if (-not $flowId) {
    Add-Error "Action missing flowId: $actionFileName"
    continue
  }
  if (-not $workflowIdIndex.ContainsKey($flowId)) {
    Add-Error "Action flowId has no matching workflow folder: $actionFileName -> $flowId"
    continue
  }

  $outputNames = @(Get-ActionOutputNames $content)
  foreach ($requiredOutput in $requiredSharedActionOutputs) {
    if ($outputNames -notcontains $requiredOutput) {
      Add-Error "Action missing shared output '$requiredOutput': $actionFileName"
    }
  }

  $workflowObject = $workflowObjects[$flowId]
  if ($null -eq $workflowObject) {
    continue
  }
  $responseInputs = $workflowObject.properties.definition.actions.Respond_to_the_agent.inputs
  $schemaProperties = @($responseInputs.schema.properties.PSObject.Properties.Name)
  $bodyProperties = @($responseInputs.body.PSObject.Properties.Name)
  foreach ($outputName in $outputNames) {
    if ($schemaProperties -notcontains $outputName) {
      Add-Error "Workflow response schema missing action output '$outputName': $actionFileName"
    }
    if ($bodyProperties -notcontains $outputName) {
      Add-Error "Workflow response body missing action output '$outputName': $actionFileName"
    }
  }
}

foreach ($topicPath in $topicFiles.Values) {
  $topicFileName = [System.IO.Path]::GetFileName($topicPath)
  $content = Get-Content -Raw $topicPath
  $componentName = Get-YamlValue $content "componentName"
  if (-not $componentName) {
    Add-Error "Topic missing componentName: $topicFileName"
  }
  $kind = Get-YamlValue $content "kind"
  if (-not $kind) {
    Add-Error "Topic missing kind: $topicFileName"
  }
  $modelDescription = Get-YamlValue $content "modelDescription"
  if (-not $modelDescription) {
    Add-Error "Topic missing modelDescription: $topicFileName"
  } elseif ($modelDescription -notmatch '^(Use this topic to|Use this topic when)') {
    Add-Warning "Topic modelDescription should start with 'Use this topic to' or 'Use this topic when' for clearer orchestration: $topicFileName"
  }

  if ($content -match '(?m)^\s*condition:\s*=.*Topic\.[A-Za-z0-9_]+\.Value\b') {
    Add-Error "Topic uses unsupported choice-routing pattern with Topic.*.Value in condition: $topicFileName"
  }

  $dynamicClosedListVariables = @(Get-DynamicClosedListVariables $content)
  foreach ($variableName in $dynamicClosedListVariables) {
    if ($content -match ('(?m)^\s*condition:\s*=.*\bTopic\.' + [regex]::Escape($variableName) + '\s*=\s*"')) {
      Add-Error "Topic compares DynamicClosedListEntity variable '$variableName' directly to a string. Use Text(Topic.$variableName) in conditions: $topicFileName"
    }
  }
}

$topicDialogRefs = Select-String -Path (Join-Path $topicsDir "*.mcs.yml") -Pattern 'dialog:\s+snf_ai_dashboard\.topic\.([A-Za-z0-9_]+)' -AllMatches
foreach ($matchInfo in $topicDialogRefs) {
  foreach ($match in $matchInfo.Matches) {
    $name = $match.Groups[1].Value
    if (-not $topicFiles.ContainsKey($name)) {
      Add-Error "Topic reference not found: $name (from $([System.IO.Path]::GetFileName($matchInfo.Path)))"
    }
  }
}

$actionDialogRefs = Select-String -Path (Join-Path $topicsDir "*.mcs.yml") -Pattern 'dialog:\s+snf_ai_dashboard\.action\.([A-Za-z0-9_]+)' -AllMatches
foreach ($matchInfo in $actionDialogRefs) {
  foreach ($match in $matchInfo.Matches) {
    $name = $match.Groups[1].Value
    if (-not $actionFiles.ContainsKey($name)) {
      Add-Error "Action reference not found: $name (from $([System.IO.Path]::GetFileName($matchInfo.Path)))"
    }
  }
}

$topicManifestPath = Join-Path $topicsDir "TopicManifest.csv"
if (Test-Path $topicManifestPath) {
  $manifestRows = Import-Csv $topicManifestPath
  foreach ($row in $manifestRows) {
    $path = Join-Path $topicsDir $row.TopicFile
    if (-not (Test-Path $path)) {
      Add-Error "TopicManifest entry missing file: $($row.TopicFile)"
    }
  }
  foreach ($topicName in $topicFiles.Keys) {
    $expectedFile = "$topicName.mcs.yml"
    if (-not ($manifestRows.TopicFile -contains $expectedFile)) {
      Add-Warning "Topic file is not listed in TopicManifest.csv: $expectedFile"
    }
  }
} else {
  Add-Warning "TopicManifest.csv not found."
}

$actionManifestPath = Join-Path $actionsDir "ActionManifest.csv"
if (Test-Path $actionManifestPath) {
  $manifestRows = Import-Csv $actionManifestPath
  foreach ($row in $manifestRows) {
    $path = Join-Path $actionsDir $row.ActionFile
    if (-not (Test-Path $path)) {
      Add-Error "ActionManifest entry missing file: $($row.ActionFile)"
    }
    if ($row.FlowId -and -not $workflowIdIndex.ContainsKey($row.FlowId)) {
      Add-Error "ActionManifest flowId has no matching workflow: $($row.ActionFile) -> $($row.FlowId)"
    }
    if (Test-Path $path) {
      $content = Get-Content -Raw $path
      $flowId = Get-YamlValue $content "flowId"
      if ($flowId -and $row.FlowId -and $flowId -ne $row.FlowId) {
        Add-Error "ActionManifest flowId does not match action file: $($row.ActionFile)"
      }
    }
  }
  foreach ($actionName in $actionFiles.Keys) {
    $expectedFile = "$actionName.mcs.yml"
    if (-not ($manifestRows.ActionFile -contains $expectedFile)) {
      Add-Warning "Action file is not listed in ActionManifest.csv: $expectedFile"
    }
  }
} else {
  Add-Warning "ActionManifest.csv not found."
}

$workflowManifestPath = Join-Path $workflowsDir "WorkflowManifest.csv"
if (Test-Path $workflowManifestPath) {
  $manifestRows = Import-Csv $workflowManifestPath
  foreach ($row in $manifestRows) {
    $path = Join-Path $workflowsDir $row.WorkflowFolder
    if (-not (Test-Path $path)) {
      Add-Error "WorkflowManifest entry missing folder: $($row.WorkflowFolder)"
    }
    if ($row.WorkflowId -and -not $workflowIdByFolder.ContainsKey($row.WorkflowFolder)) {
      Add-Error "WorkflowManifest folder has no parsed workflow metadata: $($row.WorkflowFolder)"
      continue
    }
    if ($row.WorkflowId -and $workflowIdByFolder[$row.WorkflowFolder] -ne $row.WorkflowId) {
      Add-Error "WorkflowManifest workflowId does not match metadata: $($row.WorkflowFolder)"
    }
  }
  foreach ($workflowFolder in @($workflowFolders | ForEach-Object { $_.Name })) {
    if (-not ($manifestRows.WorkflowFolder -contains $workflowFolder)) {
      Add-Warning "Workflow folder is not listed in WorkflowManifest.csv: $workflowFolder"
    }
  }
} else {
  Add-Warning "WorkflowManifest.csv not found."
}

$knowledgeReadmePath = Join-Path $knowledgeDir "README.md"
if (-not (Test-Path $knowledgeReadmePath)) {
  Add-Warning "knowledge_sources/README.md not found."
}
$knowledgeFiles = @(Get-ChildItem -Path $knowledgeDir -Filter "*.md" -File -ErrorAction SilentlyContinue | Where-Object { $_.Name -ne "README.md" })
if ($knowledgeFiles.Count -eq 0) {
  Add-Warning "No knowledge source markdown files found."
}

Write-Host "SNF AI Dashboard validation summary"
Write-Host "Topics:" $topicFiles.Count
Write-Host "Actions:" $actionFiles.Count
Write-Host "Workflow folders:" @($workflowFolders).Count
Write-Host "Warnings:" $warnings.Count
Write-Host "Errors:" $errors.Count

if ($warnings.Count -gt 0) {
  Write-Host ""
  Write-Host "Warnings:"
  $warnings | ForEach-Object { Write-Host "- $_" }
}

if ($errors.Count -gt 0) {
  Write-Host ""
  Write-Host "Errors:"
  $errors | ForEach-Object { Write-Host "- $_" }
  exit 1
}

Write-Host ""
Write-Host "Validation passed."

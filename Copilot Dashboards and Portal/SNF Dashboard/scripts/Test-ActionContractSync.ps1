param(
    [string]$ProjectRoot = 'D:\my agents copilot studio\SNF Dashboard'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Get-YamlValue {
    param(
        [string]$RawContent,
        [string]$Key
    )

    $match = [regex]::Match($RawContent, "(?m)^\s*" + [regex]::Escape($Key) + ":\s*(.+)$")
    if ($match.Success) { return $match.Groups[1].Value.Trim() }
    return ''
}

function Get-ActionOutputs {
    param([string]$RawContent)
    return @(
        [regex]::Matches($RawContent, '(?m)^\s*-\s+propertyName:\s*(.+)$') |
            ForEach-Object { $_.Groups[1].Value.Trim() } |
            Where-Object { -not [string]::IsNullOrWhiteSpace($_) }
    )
}

function Normalize-List {
    param([object[]]$Values)

    return @(
        $Values |
            ForEach-Object { ([string]$_).Trim().ToLowerInvariant() } |
            Where-Object { -not [string]::IsNullOrWhiteSpace($_) } |
            Sort-Object -Unique
    )
}

function Compare-Set {
    param(
        [string]$Label,
        [string[]]$Expected,
        [string[]]$Actual,
        [System.Collections.Generic.List[string]]$Errors
    )

    $missing = @($Expected | Where-Object { $Actual -notcontains $_ })
    $unexpected = @($Actual | Where-Object { $Expected -notcontains $_ })

    if ($missing.Count -gt 0 -or $unexpected.Count -gt 0) {
        $message = "$Label mismatch."
        if ($missing.Count -gt 0) {
            $message += " Missing: $($missing -join ', ')."
        }
        if ($unexpected.Count -gt 0) {
            $message += " Unexpected: $($unexpected -join ', ')."
        }
        $Errors.Add($message) | Out-Null
    }
}

$actionsDir = Join-Path $ProjectRoot 'actions'
$workflowsDir = Join-Path $ProjectRoot 'workflows'
$manifestPath = Join-Path $ProjectRoot 'contracts\ActionContractManifest.json'
$matrixPath = Join-Path $ProjectRoot 'contracts\ActionInputOutputMatrix.csv'
$workflowMatrixPath = Join-Path $ProjectRoot 'workflows\ActionContractMatrix.csv'

if (-not (Test-Path -LiteralPath $manifestPath)) {
    throw "Action contract manifest not found: $manifestPath"
}
if (-not (Test-Path -LiteralPath $matrixPath)) {
    throw "Action input/output matrix not found: $matrixPath"
}
if (-not (Test-Path -LiteralPath $workflowMatrixPath)) {
    throw "Workflow action contract matrix not found: $workflowMatrixPath"
}

$errors = [System.Collections.Generic.List[string]]::new()

$actionFiles = @(Get-ChildItem -LiteralPath $actionsDir -Filter '*.mcs.yml' -File | Sort-Object Name)
$manifest = Get-Content -LiteralPath $manifestPath -Raw | ConvertFrom-Json
$matrixRows = @(Import-Csv -LiteralPath $matrixPath)
$workflowMatrixRows = @(Import-Csv -LiteralPath $workflowMatrixPath)

$workflowById = @{}
foreach ($folder in @(Get-ChildItem -LiteralPath $workflowsDir -Directory)) {
    $metadataPath = Join-Path $folder.FullName 'metadata.yml'
    $workflowPath = Join-Path $folder.FullName 'workflow.json'
    if (-not (Test-Path -LiteralPath $metadataPath) -or -not (Test-Path -LiteralPath $workflowPath)) {
        continue
    }

    $metadataRaw = Get-Content -LiteralPath $metadataPath -Raw
    $workflowId = Get-YamlValue -RawContent $metadataRaw -Key 'workflowId'
    if ([string]::IsNullOrWhiteSpace($workflowId)) {
        continue
    }

    try {
        $workflowById[$workflowId] = @{
            FolderName = $folder.Name
            Json = Get-Content -LiteralPath $workflowPath -Raw | ConvertFrom-Json
        }
    }
    catch {
        $errors.Add("Workflow JSON parse failed for folder '$($folder.Name)'.") | Out-Null
    }
}

$manifestByAction = @{}
foreach ($action in @($manifest.actions)) {
    $manifestByAction[[string]$action.name] = $action
}

$matrixByAction = @{}
foreach ($row in $matrixRows) {
    $matrixByAction[[string]$row.ActionName] = $row
}

$workflowMatrixByAction = @{}
foreach ($row in $workflowMatrixRows) {
    $workflowMatrixByAction[[string]$row.ActionName] = $row
}

$actionsFromFiles = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)

foreach ($actionFile in $actionFiles) {
    $actionName = $actionFile.BaseName -replace '\.mcs$', ''
    [void]$actionsFromFiles.Add($actionName)
    $actionRaw = Get-Content -LiteralPath $actionFile.FullName -Raw
    $flowId = Get-YamlValue -RawContent $actionRaw -Key 'flowId'
    $actionOutputs = Normalize-List -Values (Get-ActionOutputs -RawContent $actionRaw)

    if (-not $manifestByAction.ContainsKey($actionName)) {
        $errors.Add("Action '$actionName' missing from ActionContractManifest.json.") | Out-Null
        continue
    }
    if (-not $matrixByAction.ContainsKey($actionName)) {
        $errors.Add("Action '$actionName' missing from ActionInputOutputMatrix.csv.") | Out-Null
        continue
    }
    if (-not $workflowMatrixByAction.ContainsKey($actionName)) {
        $errors.Add("Action '$actionName' missing from workflows/ActionContractMatrix.csv.") | Out-Null
        continue
    }

    $manifestAction = $manifestByAction[$actionName]
    $matrixRow = $matrixByAction[$actionName]
    $workflowMatrixRow = $workflowMatrixByAction[$actionName]

    $manifestFlowId = [string]$manifestAction.flowId
    $matrixFlowId = [string]$matrixRow.FlowId
    $workflowMatrixFlowId = [string]$workflowMatrixRow.FlowId

    if ($flowId -ne $manifestFlowId -or $flowId -ne $matrixFlowId -or $flowId -ne $workflowMatrixFlowId) {
        $errors.Add("FlowId mismatch for action '$actionName'. action=$flowId manifest=$manifestFlowId matrix=$matrixFlowId workflowMatrix=$workflowMatrixFlowId") | Out-Null
    }

    $manifestOutputs = Normalize-List -Values @($manifestAction.outputs)
    $matrixOutputs = Normalize-List -Values ([string]$matrixRow.OutputFields -split ';')
    $workflowMatrixOutputs = Normalize-List -Values (([string]$workflowMatrixRow.SharedFields -split ';') + ([string]$workflowMatrixRow.SpecializedFields -split ';'))

    Compare-Set -Label "Action outputs vs manifest for '$actionName'" -Expected $actionOutputs -Actual $manifestOutputs -Errors $errors
    Compare-Set -Label "Action outputs vs contract matrix for '$actionName'" -Expected $actionOutputs -Actual $matrixOutputs -Errors $errors
    Compare-Set -Label "Action outputs vs workflow matrix for '$actionName'" -Expected $actionOutputs -Actual $workflowMatrixOutputs -Errors $errors

    if (-not $workflowById.ContainsKey($flowId)) {
        $errors.Add("Workflow for flowId '$flowId' was not found for action '$actionName'.") | Out-Null
        continue
    }

    $workflowObject = $workflowById[$flowId].Json
    $responseInputs = $workflowObject.properties.definition.actions.Respond_to_the_agent.inputs
    if ($null -eq $responseInputs -or $null -eq $responseInputs.schema -or $null -eq $responseInputs.body) {
        $errors.Add("Workflow response inputs missing for action '$actionName' flowId '$flowId'.") | Out-Null
        continue
    }

    $schemaOutputs = Normalize-List -Values @($responseInputs.schema.properties.PSObject.Properties.Name)
    $bodyOutputs = Normalize-List -Values @($responseInputs.body.PSObject.Properties.Name)

    Compare-Set -Label "Action outputs vs workflow schema for '$actionName'" -Expected $actionOutputs -Actual $schemaOutputs -Errors $errors
    Compare-Set -Label "Action outputs vs workflow body for '$actionName'" -Expected $actionOutputs -Actual $bodyOutputs -Errors $errors
}

foreach ($manifestActionName in $manifestByAction.Keys) {
    if (-not $actionsFromFiles.Contains($manifestActionName)) {
        $errors.Add("Manifest action '$manifestActionName' has no matching action file.") | Out-Null
    }
}
foreach ($matrixActionName in $matrixByAction.Keys) {
    if (-not $actionsFromFiles.Contains($matrixActionName)) {
        $errors.Add("Contract matrix action '$matrixActionName' has no matching action file.") | Out-Null
    }
}
foreach ($workflowMatrixActionName in $workflowMatrixByAction.Keys) {
    if (-not $actionsFromFiles.Contains($workflowMatrixActionName)) {
        $errors.Add("Workflow matrix action '$workflowMatrixActionName' has no matching action file.") | Out-Null
    }
}

$summary = [pscustomobject]@{
    ActionsScanned = $actionFiles.Count
    ManifestActions = $manifestByAction.Count
    MatrixActions = $matrixByAction.Count
    WorkflowMatrixActions = $workflowMatrixByAction.Count
    ErrorCount = $errors.Count
}

$summary | ConvertTo-Json -Depth 4 | Write-Output

if ($errors.Count -gt 0) {
    throw ("Action contract sync validation failed: " + ($errors -join ' | '))
}


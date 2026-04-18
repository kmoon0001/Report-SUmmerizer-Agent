param(
    [string]$ProjectRoot = 'D:\SNF AI Dashboard'
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

function Get-ObjectPropertyNames {
    param([object]$Object)

    if ($null -eq $Object) {
        return @()
    }

    return @($Object.PSObject.Properties | ForEach-Object { $_.Name })
}

function Get-WorkflowResponseActions {
    param([object]$ActionsObject)

    $responses = [System.Collections.Generic.List[object]]::new()

    function Visit-Actions {
        param(
            [object]$Node,
            [System.Collections.Generic.List[object]]$Bucket
        )

        if ($null -eq $Node) {
            return
        }

        foreach ($actionProperty in @($Node.PSObject.Properties)) {
            $action = $actionProperty.Value
            if ($null -eq $action) {
                continue
            }

            if ([string]$action.type -eq 'Response') {
                $Bucket.Add($action) | Out-Null
            }

            $actionPropertyNames = @($action.PSObject.Properties | ForEach-Object { $_.Name })

            if ($actionPropertyNames -contains 'actions') {
                Visit-Actions -Node $action.actions -Bucket $Bucket
            }

            if ($actionPropertyNames -contains 'else') {
                $elseNode = $action.else
                if ($null -ne $elseNode) {
                    $elsePropertyNames = @($elseNode.PSObject.Properties | ForEach-Object { $_.Name })
                    if ($elsePropertyNames -contains 'actions') {
                        Visit-Actions -Node $elseNode.actions -Bucket $Bucket
                    }
                }
            }

            if ($actionPropertyNames -contains 'cases') {
                foreach ($caseProperty in @($action.cases.PSObject.Properties)) {
                    $caseNode = $caseProperty.Value
                    if ($null -eq $caseNode) {
                        continue
                    }
                    $casePropertyNames = @($caseNode.PSObject.Properties | ForEach-Object { $_.Name })
                    if ($casePropertyNames -contains 'actions') {
                        Visit-Actions -Node $caseNode.actions -Bucket $Bucket
                    }
                }
            }

            if ($actionPropertyNames -contains 'default') {
                $defaultNode = $action.default
                if ($null -ne $defaultNode) {
                    $defaultPropertyNames = @($defaultNode.PSObject.Properties | ForEach-Object { $_.Name })
                    if ($defaultPropertyNames -contains 'actions') {
                        Visit-Actions -Node $defaultNode.actions -Bucket $Bucket
                    }
                }
            }
        }
    }

    Visit-Actions -Node $ActionsObject -Bucket $responses
    return @($responses)
}

function Compare-Set {
    param(
        [string]$Label,
        [string[]]$Expected,
        [string[]]$Actual,
        [System.Collections.Generic.List[string]]$Errors
    )

    $normalizedExpected = @(
        $Expected |
            ForEach-Object { ([string]$_).Trim().ToLowerInvariant() } |
            Where-Object { -not [string]::IsNullOrWhiteSpace($_) } |
            Sort-Object -Unique
    )
    $normalizedActual = @(
        $Actual |
            ForEach-Object { ([string]$_).Trim().ToLowerInvariant() } |
            Where-Object { -not [string]::IsNullOrWhiteSpace($_) } |
            Sort-Object -Unique
    )

    $missing = @($normalizedExpected | Where-Object { $normalizedActual -notcontains $_ })
    $unexpected = @($normalizedActual | Where-Object { $normalizedExpected -notcontains $_ })

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
    $actionOutputs = @(Normalize-List -Values (Get-ActionOutputs -RawContent $actionRaw))

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

    if ($actionOutputs.Count -eq 0) {
        continue
    }

    $workflowObject = $workflowById[$flowId].Json
    $responseActions = @(Get-WorkflowResponseActions -ActionsObject $workflowObject.properties.definition.actions)
    $responseAction = @($responseActions | Select-Object -First 1)

    if ($responseAction.Count -eq 0 -or $null -eq $responseAction[0]) {
        $errors.Add("Workflow response action missing for action '$actionName' flowId '$flowId'.") | Out-Null
        continue
    }

    $responseInputs = $responseAction[0].inputs
    if ($null -eq $responseInputs) {
        $errors.Add("Workflow response inputs missing for action '$actionName' flowId '$flowId'.") | Out-Null
        continue
    }

    $schemaObject = $null
    if (@($responseInputs.PSObject.Properties | Where-Object { $_.Name -eq 'schema' }).Count -gt 0) {
        $schemaObject = $responseInputs.schema
    }

    $bodyObject = $null
    if (@($responseInputs.PSObject.Properties | Where-Object { $_.Name -eq 'body' }).Count -gt 0) {
        $bodyObject = $responseInputs.body
    }
    if ($null -eq $bodyObject) {
        $errors.Add("Workflow response body missing for action '$actionName' flowId '$flowId'.") | Out-Null
        continue
    }

    $schemaOutputs = @()
    if ($null -ne $schemaObject) {
        $schemaOutputs = @(Normalize-List -Values (Get-ObjectPropertyNames -Object $schemaObject.properties))
    }
    if ($schemaOutputs.Count -eq 0) {
        $schemaOutputs = @(Normalize-List -Values (Get-ObjectPropertyNames -Object $bodyObject))
    }
    $bodyOutputs = @(Normalize-List -Values (Get-ObjectPropertyNames -Object $bodyObject))

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

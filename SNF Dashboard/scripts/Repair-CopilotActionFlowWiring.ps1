param(
    [string[]]$EnvironmentIds = @(
        'a944fdf0-0d2e-e14d-8a73-0f5ffae23315',
        '077422cf-d088-e3d7-917e-5c9a9b64710c'
    ),
    [string]$ActionManifestPath = 'D:\my agents copilot studio\SNF Dashboard\actions\ActionManifest.csv',
    [string]$WorkflowRoot = 'D:\my agents copilot studio\SNF Dashboard\workflows',
    [string]$ReportJsonPath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\copilot_action_flow_wiring_repair.json',
    [string]$ReportMarkdownPath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\copilot_action_flow_wiring_repair.md'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Get-OrgUrlFromEnvironmentId {
    param([Parameter(Mandatory = $true)][string]$EnvironmentId)
    $orgsRaw = & pac org list --json 2>&1 | Out-String
    $orgs = $orgsRaw | ConvertFrom-Json
    $match = $orgs | Where-Object { $_.EnvironmentIdentifier.Id -eq $EnvironmentId } | Select-Object -First 1
    if ($null -eq $match) {
        throw "EnvironmentId '$EnvironmentId' not found in pac org list."
    }
    return [string]$match.EnvironmentUrl
}

function Get-AuthHeaders {
    param([Parameter(Mandatory = $true)][string]$OrgUrl)
    $token = & az account get-access-token --resource $OrgUrl --query accessToken -o tsv 2>$null
    if ([string]::IsNullOrWhiteSpace($token)) {
        throw "Unable to acquire access token for '$OrgUrl'."
    }
    return @{
        Authorization      = "Bearer $token"
        'OData-Version'    = '4.0'
        'OData-MaxVersion' = '4.0'
        Accept             = 'application/json'
        'Content-Type'     = 'application/json'
    }
}

function Invoke-DataverseGet {
    param(
        [Parameter(Mandatory = $true)][string]$OrgUrl,
        [Parameter(Mandatory = $true)][hashtable]$Headers,
        [Parameter(Mandatory = $true)][string]$RelativePath
    )
    $uri = "{0}/api/data/v9.2/{1}" -f $OrgUrl.TrimEnd('/'), $RelativePath.TrimStart('/')
    return Invoke-RestMethod -Method Get -Uri $uri -Headers $Headers
}

function Invoke-DataversePatch {
    param(
        [Parameter(Mandatory = $true)][string]$OrgUrl,
        [Parameter(Mandatory = $true)][hashtable]$Headers,
        [Parameter(Mandatory = $true)][string]$RelativePath,
        [Parameter(Mandatory = $true)]$BodyObject
    )
    $uri = "{0}/api/data/v9.2/{1}" -f $OrgUrl.TrimEnd('/'), $RelativePath.TrimStart('/')
    $body = $BodyObject | ConvertTo-Json -Depth 100 -Compress
    Invoke-RestMethod -Method Patch -Uri $uri -Headers $Headers -Body $body | Out-Null
}

function Invoke-DataversePost {
    param(
        [Parameter(Mandatory = $true)][string]$OrgUrl,
        [Parameter(Mandatory = $true)][hashtable]$Headers,
        [Parameter(Mandatory = $true)][string]$RelativePath,
        [Parameter(Mandatory = $true)]$BodyObject
    )
    $uri = "{0}/api/data/v9.2/{1}" -f $OrgUrl.TrimEnd('/'), $RelativePath.TrimStart('/')
    $body = $BodyObject | ConvertTo-Json -Depth 100 -Compress
    Invoke-RestMethod -Method Post -Uri $uri -Headers $Headers -Body $body | Out-Null
}

function Get-WorkflowFolderByFlowId {
    param(
        [Parameter(Mandatory = $true)][string]$WorkflowRoot,
        [Parameter(Mandatory = $true)][string]$FlowId
    )
    $hit = Get-ChildItem -LiteralPath $WorkflowRoot -Directory | Where-Object { $_.Name -like "*-$FlowId" } | Select-Object -First 1
    if ($null -eq $hit) { return $null }
    return $hit.FullName
}

function New-ClientDataFromWorkflowExport {
    param(
        [Parameter(Mandatory = $true)]$WorkflowJsonObject,
        [Parameter(Mandatory = $true)][string]$ActionDisplayName
    )

    $trigger = $WorkflowJsonObject.properties.definition.triggers.manual
    if ($null -eq $trigger) {
        throw "Workflow export is missing properties.definition.triggers.manual"
    }
    $respond = $WorkflowJsonObject.properties.definition.actions.Respond_to_the_agent
    if ($null -eq $respond) {
        throw "Workflow export is missing properties.definition.actions.Respond_to_the_agent"
    }

    $triggerSchema = $null
    $triggerInputs = $null
    if ($null -ne $trigger) {
        $triggerInputsProp = $trigger.PSObject.Properties['inputs']
        if ($null -ne $triggerInputsProp) {
            $triggerInputs = $triggerInputsProp.Value
        }
    }
    if ($null -ne $triggerInputs) {
        $triggerSchemaProp = $triggerInputs.PSObject.Properties['schema']
        if ($null -ne $triggerSchemaProp) {
            $triggerSchema = $triggerSchemaProp.Value
        }
    }
    if ($null -eq $triggerSchema) {
        $triggerSchema = [ordered]@{
            type = 'object'
            properties = @{}
        }
    }

    $manualTrigger = [ordered]@{
        type   = 'Request'
        kind   = 'Skills'
        inputs = [ordered]@{
            schema = $triggerSchema
        }
        metadata = [ordered]@{
            operationMetadataId = [guid]::NewGuid().ToString()
        }
    }

    $respondInputs = $null
    $respondInputsProp = $respond.PSObject.Properties['inputs']
    if ($null -ne $respondInputsProp) {
        $respondInputs = $respondInputsProp.Value
    }
    if ($null -eq $respondInputs) {
        throw "Respond_to_the_agent action is missing inputs."
    }

    function Normalize-FlowLiteralValue {
        param($Value)
        if ($null -eq $Value) { return '' }
        if ($Value -is [string]) {
            $trimmed = $Value.TrimStart()
            if ($trimmed.StartsWith('@')) { return '' }
            return $Value
        }
        if ($Value -is [bool] -or $Value -is [int] -or $Value -is [long] -or $Value -is [double] -or $Value -is [decimal]) {
            return $Value
        }
        if ($Value -is [psobject]) {
            $obj = [ordered]@{}
            foreach ($p in $Value.PSObject.Properties) {
                $obj[$p.Name] = Normalize-FlowLiteralValue -Value $p.Value
            }
            return $obj
        }
        return [string]$Value
    }

    $responseBody = $null
    $responseBodyProp = $respondInputs.PSObject.Properties['body']
    if ($null -ne $responseBodyProp) {
        $responseBody = Normalize-FlowLiteralValue -Value $responseBodyProp.Value
    }
    $responseSchema = $null
    $responseSchemaProp = $respondInputs.PSObject.Properties['schema']
    if ($null -ne $responseSchemaProp) {
        $responseSchema = $responseSchemaProp.Value
    }
    if ($null -eq $responseSchema) {
        $props = [ordered]@{}
        if ($null -ne $responseBody -and $responseBody -is [psobject]) {
            foreach ($p in $responseBody.PSObject.Properties) {
                $props[$p.Name] = [ordered]@{ type = 'string' }
            }
        }
        $responseSchema = [ordered]@{
            type = 'object'
            properties = $props
            additionalProperties = @{}
        }
    }

    $responseInputs = [ordered]@{
        schema = $responseSchema
        statusCode = 200
        body = $responseBody
    }

    $definition = [ordered]@{
        '$schema' = 'https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#'
        contentVersion = '1.0.0.0'
        parameters = [ordered]@{
            '$authentication' = [ordered]@{
                defaultValue = @{}
                type = 'SecureObject'
            }
            '$connections' = [ordered]@{
                defaultValue = @{}
                type = 'Object'
            }
        }
        triggers = [ordered]@{
            manual = $manualTrigger
        }
        actions = [ordered]@{
            Respond_to_the_agent = [ordered]@{
                type = 'Response'
                kind = 'Skills'
                inputs = $responseInputs
                runAfter = @{}
                metadata = [ordered]@{
                    operationMetadataId = [guid]::NewGuid().ToString()
                }
            }
        }
        outputs = @{}
        description = "Auto-repaired action backend for '$ActionDisplayName'."
    }

    $clientData = [ordered]@{
        properties = [ordered]@{
            connectionReferences = @{}
            definition = $definition
        }
        schemaVersion = '1.0.0.0'
    }

    return ($clientData | ConvertTo-Json -Depth 100 -Compress)
}

if (-not (Test-Path -LiteralPath $ActionManifestPath)) {
    throw "Action manifest not found: $ActionManifestPath"
}
if (-not (Test-Path -LiteralPath $WorkflowRoot)) {
    throw "Workflow root not found: $WorkflowRoot"
}

$actions = Import-Csv -LiteralPath $ActionManifestPath
$results = [System.Collections.Generic.List[object]]::new()

foreach ($envId in $EnvironmentIds) {
    $orgUrl = Get-OrgUrlFromEnvironmentId -EnvironmentId $envId
    $headers = Get-AuthHeaders -OrgUrl $orgUrl

    foreach ($action in $actions) {
        $flowId = [string]$action.FlowId
        $folder = Get-WorkflowFolderByFlowId -WorkflowRoot $WorkflowRoot -FlowId $flowId
        if ([string]::IsNullOrWhiteSpace($folder)) {
            $results.Add([pscustomobject]@{
                EnvironmentId = $envId
                EnvironmentUrl = $orgUrl
                ActionFile = [string]$action.ActionFile
                FlowId = $flowId
                Step = 'ResolveWorkflowFolder'
                Status = 'FAIL'
                Details = 'No local workflow folder matched this flowId.'
            }) | Out-Null
            continue
        }

        $workflowPath = Join-Path $folder 'workflow.json'
        if (-not (Test-Path -LiteralPath $workflowPath)) {
            $results.Add([pscustomobject]@{
                EnvironmentId = $envId
                EnvironmentUrl = $orgUrl
                ActionFile = [string]$action.ActionFile
                FlowId = $flowId
                Step = 'LoadWorkflowExport'
                Status = 'FAIL'
                Details = "Missing workflow.json at $workflowPath"
            }) | Out-Null
            continue
        }

        $workflowObj = Get-Content -LiteralPath $workflowPath -Raw | ConvertFrom-Json
        $clientdata = New-ClientDataFromWorkflowExport -WorkflowJsonObject $workflowObj -ActionDisplayName ([string]$action.DisplayName)

        $exists = $false
        try {
            $existing = Invoke-DataverseGet -OrgUrl $orgUrl -Headers $headers -RelativePath ("workflows({0})?`$select=workflowid,name,statecode,statuscode" -f $flowId)
            $exists = $true
        }
        catch {
            $exists = $false
        }

        if (-not $exists) {
            $createBody = [ordered]@{
                workflowid    = $flowId
                name          = [string]$action.DisplayName
                category      = 5
                type          = 1
                primaryentity = 'none'
                ondemand      = $false
                clientdata    = $clientdata
                description   = "Auto-created from local workflow export for action wiring repair."
            }
            Invoke-DataversePost -OrgUrl $orgUrl -Headers $headers -RelativePath 'workflows' -BodyObject $createBody
            $results.Add([pscustomobject]@{
                EnvironmentId = $envId
                EnvironmentUrl = $orgUrl
                ActionFile = [string]$action.ActionFile
                FlowId = $flowId
                Step = 'CreateFlow'
                Status = 'PASS'
                Details = 'Created missing workflow record.'
            }) | Out-Null
        }
        else {
            $updateBody = [ordered]@{
                clientdata = $clientdata
                description = "Auto-repaired from local workflow export for action wiring alignment."
            }
            Invoke-DataversePatch -OrgUrl $orgUrl -Headers $headers -RelativePath ("workflows({0})" -f $flowId) -BodyObject $updateBody
            $results.Add([pscustomobject]@{
                EnvironmentId = $envId
                EnvironmentUrl = $orgUrl
                ActionFile = [string]$action.ActionFile
                FlowId = $flowId
                Step = 'UpdateFlowClientData'
                Status = 'PASS'
                Details = 'Updated workflow clientdata from local export.'
            }) | Out-Null
        }

        try {
            Invoke-DataversePatch -OrgUrl $orgUrl -Headers $headers -RelativePath ("workflows({0})" -f $flowId) -BodyObject @{ statecode = 1; statuscode = 2 }
            $results.Add([pscustomobject]@{
                EnvironmentId = $envId
                EnvironmentUrl = $orgUrl
                ActionFile = [string]$action.ActionFile
                FlowId = $flowId
                Step = 'ActivateFlow'
                Status = 'PASS'
                Details = 'Flow is activated.'
            }) | Out-Null
        }
        catch {
            $results.Add([pscustomobject]@{
                EnvironmentId = $envId
                EnvironmentUrl = $orgUrl
                ActionFile = [string]$action.ActionFile
                FlowId = $flowId
                Step = 'ActivateFlow'
                Status = 'FAIL'
                Details = $_.Exception.Message
            }) | Out-Null
        }
    }
}

$report = [pscustomobject]@{
    GeneratedAt = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss')
    EnvironmentIds = $EnvironmentIds
    Results = $results
    Failures = @($results | Where-Object { $_.Status -eq 'FAIL' })
}

$jsonDir = Split-Path -Parent $ReportJsonPath
if (-not (Test-Path -LiteralPath $jsonDir)) { New-Item -ItemType Directory -Path $jsonDir -Force | Out-Null }
$report | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $ReportJsonPath -Encoding UTF8

$md = [System.Collections.Generic.List[string]]::new()
$md.Add('# Copilot Action Flow Wiring Repair') | Out-Null
$md.Add('') | Out-Null
$md.Add("Generated: $($report.GeneratedAt)") | Out-Null
$md.Add('') | Out-Null
$md.Add('| EnvironmentId | Action | FlowId | Step | Status | Details |') | Out-Null
$md.Add('|---|---|---|---|---|---|') | Out-Null
foreach ($row in $results) {
    $md.Add(('| {0} | {1} | {2} | {3} | {4} | {5} |' -f $row.EnvironmentId, $row.ActionFile, $row.FlowId, $row.Step, $row.Status, ($row.Details -replace '\|','/'))) | Out-Null
}
$md.Add('') | Out-Null
$md.Add("Failures: $(@($report.Failures).Count)") | Out-Null

$mdDir = Split-Path -Parent $ReportMarkdownPath
if (-not (Test-Path -LiteralPath $mdDir)) { New-Item -ItemType Directory -Path $mdDir -Force | Out-Null }
$md -join [Environment]::NewLine | Set-Content -LiteralPath $ReportMarkdownPath -Encoding UTF8

Write-Host "Repair JSON report: $ReportJsonPath"
Write-Host "Repair Markdown report: $ReportMarkdownPath"

if (@($report.Failures).Count -gt 0) {
    throw "Repair finished with $(@($report.Failures).Count) failure(s)."
}

Write-Host 'Repair completed without failures.'

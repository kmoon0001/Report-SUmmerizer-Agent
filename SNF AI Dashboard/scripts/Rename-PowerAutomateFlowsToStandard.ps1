param(
    [string]$OrgUrl = '',
    [string]$EnvironmentId = '',
    [switch]$WhatIf = $true
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Resolve-OrgUrl {
    param([string]$ExplicitOrgUrl)

    if (-not [string]::IsNullOrWhiteSpace($ExplicitOrgUrl)) {
        return $ExplicitOrgUrl.TrimEnd('/')
    }

    $envWho = pac env who 2>&1 | Out-String
    $match = [regex]::Match($envWho, 'Org URL:\s*(https?://[^\s]+)')
    if (-not $match.Success) {
        throw 'Unable to resolve Org URL from `pac env who`. Pass -OrgUrl explicitly.'
    }

    return $match.Groups[1].Value.TrimEnd('/')
}

function Resolve-EnvironmentId {
    param([string]$ExplicitEnvironmentId)

    if (-not [string]::IsNullOrWhiteSpace($ExplicitEnvironmentId)) {
        return $ExplicitEnvironmentId
    }

    $envWho = pac env who 2>&1 | Out-String
    $match = [regex]::Match($envWho, 'Environment ID:\s*([0-9a-f-]+)')
    if (-not $match.Success) {
        throw 'Unable to resolve Environment ID from `pac env who`. Pass -EnvironmentId explicitly.'
    }

    return $match.Groups[1].Value
}

function Get-AccessToken {
    param([string]$Resource)

    $json = az account get-access-token --resource $Resource --output json 2>$null
    if ([string]::IsNullOrWhiteSpace([string]$json)) {
        throw "Failed to get AAD token for resource: $Resource"
    }

    $parsed = $json | ConvertFrom-Json
    if ($null -eq $parsed -or [string]::IsNullOrWhiteSpace([string]$parsed.accessToken)) {
        throw "AAD token response did not contain accessToken for resource: $Resource"
    }

    return [string]$parsed.accessToken
}

function New-XrmHeaders {
    param([string]$Token)

    return @{
        Authorization = "Bearer $Token"
        Accept = 'application/json'
        'Content-Type' = 'application/json'
        'OData-Version' = '4.0'
        'OData-MaxVersion' = '4.0'
    }
}

function New-FlowHeaders {
    param([string]$Token)

    return @{
        Authorization = "Bearer $Token"
        Accept = 'application/json'
        'Content-Type' = 'application/json'
    }
}

function Publish-FlowDraft {
    param(
        [string]$OrgUrlValue,
        [hashtable]$Headers,
        [string]$WorkflowId
    )

    $xml = "<importexportxml><workflows><workflow>$WorkflowId</workflow></workflows></importexportxml>"
    $body = @{ ParameterXml = $xml } | ConvertTo-Json -Compress
    Invoke-RestMethod -Method Post -Uri "$OrgUrlValue/api/data/v9.2/PublishXml" -Headers $Headers -Body $body | Out-Null
}

function Set-FlowState {
    param(
        [string]$OrgUrlValue,
        [hashtable]$Headers,
        [string]$WorkflowId,
        [int]$StateCode,
        [int]$StatusCode
    )

    $body = @{ statecode = $StateCode; statuscode = $StatusCode } | ConvertTo-Json -Compress
    Invoke-RestMethod -Method Patch -Uri "$OrgUrlValue/api/data/v9.2/workflows($WorkflowId)" -Headers $Headers -Body $body | Out-Null
}

function Get-WorkflowState {
    param(
        [string]$OrgUrlValue,
        [hashtable]$Headers,
        [string]$WorkflowId
    )

    return Invoke-RestMethod -Method Get -Uri "$OrgUrlValue/api/data/v9.2/workflows($WorkflowId)?`$select=name,statecode,statuscode" -Headers $Headers
}

$script:ConnectionReferenceCache = @{}

function Get-ApiNameFromConnectorId {
    param([string]$ConnectorId)

    if ([string]::IsNullOrWhiteSpace($ConnectorId)) {
        return ''
    }

    $apiName = ($ConnectorId -split '/')[-1]
    if ($apiName.StartsWith('shared_')) {
        return $apiName.Substring(7)
    }

    return $apiName
}

function Get-PreferredConnectionReference {
    param(
        [string]$OrgUrlValue,
        [hashtable]$Headers,
        [string]$ConnectorId
    )

    if ([string]::IsNullOrWhiteSpace($ConnectorId)) {
        return $null
    }

    if ($script:ConnectionReferenceCache.ContainsKey($ConnectorId)) {
        return $script:ConnectionReferenceCache[$ConnectorId]
    }

    $escapedConnectorId = $ConnectorId.Replace("'", "''")
    $uri = "$OrgUrlValue/api/data/v9.2/connectionreferences?`$select=connectionid,connectorid,connectionreferencedisplayname,connectionreferencelogicalname,modifiedon&`$filter=connectorid eq '$escapedConnectorId' and statecode eq 0"
    $response = Invoke-RestMethod -Method Get -Uri $uri -Headers $Headers
    $candidate = @($response.value | Sort-Object { [datetime]$_.modifiedon } -Descending | Select-Object -First 1)[0]
    $script:ConnectionReferenceCache[$ConnectorId] = $candidate
    return $candidate
}

function Ensure-ConnectionReferenceForHost {
    param(
        [object]$Flow,
        [object]$HostNode,
        [string]$OrgUrlValue,
        [hashtable]$Headers
    )

    if ($null -eq $HostNode) {
        return
    }

    $connectionNameProperty = $HostNode.PSObject.Properties['connectionName']
    if ($null -eq $connectionNameProperty -or [string]::IsNullOrWhiteSpace([string]$connectionNameProperty.Value)) {
        return
    }

    $connectionReferenceNameProperty = $HostNode.PSObject.Properties['connectionReferenceName']
    if ($null -eq $connectionReferenceNameProperty) {
        Add-Member -InputObject $HostNode -NotePropertyName 'connectionReferenceName' -NotePropertyValue ([string]$connectionNameProperty.Value) -Force
    }
    elseif ([string]::IsNullOrWhiteSpace([string]$connectionReferenceNameProperty.Value)) {
        $HostNode.connectionReferenceName = [string]$connectionNameProperty.Value
    }

    if ($null -eq $Flow.properties.PSObject.Properties['connectionReferences'] -or $null -eq $Flow.properties.connectionReferences) {
        Add-Member -InputObject $Flow.properties -NotePropertyName 'connectionReferences' -NotePropertyValue ([pscustomobject]@{}) -Force
    }

    $referenceKey = [string]$HostNode.connectionReferenceName
    if ([string]::IsNullOrWhiteSpace($referenceKey)) {
        return
    }

    $existingReference = $Flow.properties.connectionReferences.PSObject.Properties[$referenceKey]
    if ($null -ne $existingReference -and $null -ne $existingReference.Value) {
        return
    }

    $apiIdProperty = $HostNode.PSObject.Properties['apiId']
    $connectorId = if ($null -ne $apiIdProperty) { [string]$apiIdProperty.Value } else { '' }
    $candidate = Get-PreferredConnectionReference -OrgUrlValue $OrgUrlValue -Headers $Headers -ConnectorId $connectorId
    $apiName = Get-ApiNameFromConnectorId -ConnectorId $connectorId

    $reference = [pscustomobject]@{
        connectionName = if ($null -ne $candidate) { [string]$candidate.connectionid } else { [string]$connectionNameProperty.Value }
        connectionReferenceLogicalName = if ($null -ne $candidate) { [string]$candidate.connectionreferencelogicalname } else { '' }
        source = 'Embedded'
        id = $connectorId
        displayName = if ($null -ne $candidate) { [string]$candidate.connectionreferencedisplayname } else { $referenceKey }
        brandColor = ''
        tier = ''
        apiName = $apiName
        isProcessSimpleApiReferenceConversionAlreadyDone = $false
        impersonation = [pscustomobject]@{}
    }

    Add-Member -InputObject $Flow.properties.connectionReferences -NotePropertyName $referenceKey -NotePropertyValue $reference -Force
}

function Repair-ConnectionReferences {
    param(
        [object]$Node,
        [object]$Flow,
        [string]$OrgUrlValue,
        [hashtable]$Headers
    )

    if ($null -eq $Node) { return }

    if ($Node -is [System.Collections.IEnumerable] -and -not ($Node -is [string])) {
        foreach ($item in $Node) {
            Repair-ConnectionReferences -Node $item -Flow $Flow -OrgUrlValue $OrgUrlValue -Headers $Headers
        }
        return
    }

    $hostProperty = $Node.PSObject.Properties['host']
    if ($null -ne $hostProperty -and $null -ne $hostProperty.Value) {
        Ensure-ConnectionReferenceForHost -Flow $Flow -HostNode $hostProperty.Value -OrgUrlValue $OrgUrlValue -Headers $Headers
    }

    foreach ($property in $Node.PSObject.Properties) {
        if ($null -eq $property.Value) { continue }
        if ($property.Value -is [string] -or $property.Value -is [ValueType]) { continue }
        Repair-ConnectionReferences -Node $property.Value -Flow $Flow -OrgUrlValue $OrgUrlValue -Headers $Headers
    }
}

$targetOrgUrl = Resolve-OrgUrl -ExplicitOrgUrl $OrgUrl
$targetEnvironmentId = Resolve-EnvironmentId -ExplicitEnvironmentId $EnvironmentId
$xrmToken = Get-AccessToken -Resource $targetOrgUrl
$flowToken = Get-AccessToken -Resource 'https://service.flow.microsoft.com/'
$xrmHeaders = New-XrmHeaders -Token $xrmToken
$flowHeaders = New-FlowHeaders -Token $flowToken

$renamePlan = @(
    [pscustomobject]@{ WorkflowId = '9d834a1f-1a18-f111-8341-000d3a5a5d47'; NewName = 'INTERNAL - Power BI QM Mock Data'; PublishAfterPatch = $true; EnsureActivated = $true; FixResponseSchema = $true }
    [pscustomobject]@{ WorkflowId = 'fcf035ad-af0c-f111-8406-0022480b6bd9'; NewName = 'SNF - Quality Measure Email Generator'; PublishAfterPatch = $false; EnsureActivated = $false; FixResponseSchema = $false }
    [pscustomobject]@{ WorkflowId = '51112488-9726-f111-8341-0022480b6bd9'; NewName = 'INTERNAL - Normalize Manual QM File V2'; PublishAfterPatch = $false; EnsureActivated = $false; FixResponseSchema = $false }
    [pscustomobject]@{ WorkflowId = '3a73a4c2-5a18-f111-8341-000d3a5a5d47'; NewName = 'INTERNAL - Power BI QM Mock Data Sync'; PublishAfterPatch = $false; EnsureActivated = $false; FixResponseSchema = $false }
    [pscustomobject]@{ WorkflowId = '0b930a15-2516-f111-8341-0022480b6bd9'; NewName = 'SNF - Quality Measure Decline Detection And Reporting'; PublishAfterPatch = $false; EnsureActivated = $false; FixResponseSchema = $false }
    [pscustomobject]@{ WorkflowId = 'f96d43dd-fd24-f111-8341-6045bd061151'; NewName = 'SNF - Therapy AI Resident Insight Intake'; PublishAfterPatch = $false; EnsureActivated = $false; FixResponseSchema = $false }
    [pscustomobject]@{ WorkflowId = 'db104008-d226-f111-8341-000d3a5b88c6'; NewName = 'SNF - Clinical Intake Handoff Router'; PublishAfterPatch = $false; EnsureActivated = $false; FixResponseSchema = $false }
)

$results = [System.Collections.Generic.List[object]]::new()

foreach ($item in $renamePlan) {
    if ($WhatIf) {
        $results.Add([pscustomobject]@{
            WorkflowId = $item.WorkflowId
            NewName = $item.NewName
            Status = 'WHATIF'
            Message = 'No change applied.'
        }) | Out-Null
        continue
    }

    $flowUri = "https://api.flow.microsoft.com/providers/Microsoft.ProcessSimple/environments/$targetEnvironmentId/flows/$($item.WorkflowId)?api-version=2016-11-01"

    try {
        $originalWorkflowState = Get-WorkflowState -OrgUrlValue $targetOrgUrl -Headers $xrmHeaders -WorkflowId $item.WorkflowId
        $wasActivated = ([int]$originalWorkflowState.statecode -eq 1 -and [int]$originalWorkflowState.statuscode -eq 2)

        if ($wasActivated) {
            Set-FlowState -OrgUrlValue $targetOrgUrl -Headers $xrmHeaders -WorkflowId $item.WorkflowId -StateCode 0 -StatusCode 1
        }

        $flow = Invoke-RestMethod -Method Get -Uri $flowUri -Headers $flowHeaders
        $flow.properties.displayName = $item.NewName
        Repair-ConnectionReferences -Node $flow.properties.definition -Flow $flow -OrgUrlValue $targetOrgUrl -Headers $xrmHeaders

        if ($item.FixResponseSchema) {
            $successSchema = $flow.properties.definition.actions.Try_Block.actions.Respond_to_the_agent.inputs.schema
            $flow.properties.definition.actions.Catch_Block.actions.Respond_to_the_agent_1.inputs.schema = $successSchema
            $catchBody = $flow.properties.definition.actions.Catch_Block.actions.Respond_to_the_agent_1.inputs.body
            if ($null -eq $catchBody.PSObject.Properties['qm_json_data_placeholder']) {
                Add-Member -InputObject $catchBody -NotePropertyName 'qm_json_data_placeholder' -NotePropertyValue '' -Force
            }
            else {
                $catchBody.qm_json_data_placeholder = ''
            }
        }

        $patchBody = $flow | ConvertTo-Json -Depth 100
        Invoke-RestMethod -Method Patch -Uri $flowUri -Headers $flowHeaders -Body $patchBody | Out-Null

        Publish-FlowDraft -OrgUrlValue $targetOrgUrl -Headers $xrmHeaders -WorkflowId $item.WorkflowId

        if ($wasActivated -or $item.EnsureActivated) {
            Set-FlowState -OrgUrlValue $targetOrgUrl -Headers $xrmHeaders -WorkflowId $item.WorkflowId -StateCode 1 -StatusCode 2
        }

        $results.Add([pscustomobject]@{
            WorkflowId = $item.WorkflowId
            NewName = $item.NewName
            Status = 'RENAMED'
            Message = 'Flow service definition updated.'
        }) | Out-Null
    }
    catch {
        $message = $_.Exception.Message
        if ($_.ErrorDetails -and -not [string]::IsNullOrWhiteSpace([string]$_.ErrorDetails.Message)) {
            $message = $_.ErrorDetails.Message
        }

        $results.Add([pscustomobject]@{
            WorkflowId = $item.WorkflowId
            NewName = $item.NewName
            Status = 'FAILED'
            Message = $message
        }) | Out-Null
    }
}

$results | Format-Table -AutoSize | Out-String | Write-Host

$failed = @($results | Where-Object { $_.Status -eq 'FAILED' })
if ($failed.Count -gt 0) {
    throw "Flow rename failures: $($failed.Count)"
}

Write-Host 'Flow rename plan completed.'

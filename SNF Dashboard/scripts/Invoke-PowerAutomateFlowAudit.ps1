param(
    [string]$OutputMarkdown = 'D:\my agents copilot studio\SNF Dashboard\data\processed\powerautomate_flow_audit.md',
    [string]$OutputJson = 'D:\my agents copilot studio\SNF Dashboard\data\processed\powerautomate_flow_audit.json'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$targetFlowNames = @(
    'INTERNAL - Resident Insight Dataverse Lookup',
    'SNF - Therapy AI Resident Insight Intake',
    'COPILOT V2 - Resident Insight Dataverse Lookup',
    'COPILOT V2 - Facility Insight Dataverse Lookup',
    'COPILOT V2 - Facility Insight Webhook Intake',
    'COPILOT V2 - Power BI Facility Insight Query',
    'SNF-Handoff-Webhook-Intake'
)

function Invoke-FetchRaw {
    param(
        [string]$Xml,
        [string]$TempFile
    )

    $dir = Split-Path -Parent $TempFile
    if (-not (Test-Path -LiteralPath $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }

    $Xml | Set-Content -LiteralPath $TempFile -Encoding UTF8
    return pac env fetch --xmlFile $TempFile 2>&1
}

function Get-FlowIdByName {
    param(
        [string]$FlowName
    )

    $safeName = $FlowName.Replace('&', '&amp;').Replace('<', '&lt;').Replace('>', '&gt;').Replace("'", '&apos;').Replace('"', '&quot;')
    $xml = @"
<fetch count="3">
  <entity name="workflow">
    <attribute name="workflowid"/>
    <attribute name="name"/>
    <filter>
      <condition attribute="name" operator="eq" value="$safeName"/>
    </filter>
  </entity>
</fetch>
"@
    $raw = Invoke-FetchRaw -Xml $xml -TempFile 'D:\my agents copilot studio\SNF Dashboard\data\processed\tmp.fetch.flowid.xml'
    $guidMatches = [regex]::Matches(($raw -join [Environment]::NewLine), '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}')
    if ($guidMatches.Count -eq 0) { return $null }
    return $guidMatches[0].Value
}

function Get-FlowStatusRow {
    param(
        [string]$WorkflowId
    )

    $xml = @"
<fetch count="1">
  <entity name="workflow">
    <attribute name="workflowid"/>
    <attribute name="statecode"/>
    <attribute name="statuscode"/>
    <attribute name="modifiedon"/>
    <filter>
      <condition attribute="workflowid" operator="eq" value="$WorkflowId"/>
    </filter>
  </entity>
</fetch>
"@
    $raw = Invoke-FetchRaw -Xml $xml -TempFile 'D:\my agents copilot studio\SNF Dashboard\data\processed\tmp.fetch.status.xml'
    $text = $raw -join [Environment]::NewLine
    $statusRegex = [regex]'([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\s+([A-Za-z]+)\s+([A-Za-z]+)\s+(\d{1,2}/\d{1,2}/\d{4}\s+\d{1,2}:\d{2}\s+[AP]M)'
    $match = $statusRegex.Match($text)
    if (-not $match.Success) {
        return [pscustomobject]@{
            StateCode  = 'Unknown'
            StatusCode = 'Unknown'
            ModifiedOn = ''
        }
    }

    return [pscustomobject]@{
        StateCode  = $match.Groups[2].Value
        StatusCode = $match.Groups[3].Value
        ModifiedOn = $match.Groups[4].Value
    }
}

function Get-FlowClientDataJson {
    param(
        [string]$WorkflowId
    )

    $xml = @"
<fetch count="1">
  <entity name="workflow">
    <attribute name="workflowid"/>
    <attribute name="name"/>
    <attribute name="clientdata"/>
    <filter>
      <condition attribute="workflowid" operator="eq" value="$WorkflowId"/>
    </filter>
  </entity>
</fetch>
"@
    $raw = Invoke-FetchRaw -Xml $xml -TempFile 'D:\my agents copilot studio\SNF Dashboard\data\processed\tmp.fetch.clientdata.xml'
    $text = $raw -join [Environment]::NewLine
    $jsonMatches = [regex]::Matches($text, '\{.*\}', [System.Text.RegularExpressions.RegexOptions]::Singleline)
    if ($jsonMatches.Count -eq 0) { return $null }
    return $jsonMatches[$jsonMatches.Count - 1].Value.Trim()
}

function Get-FlowSignals {
    param(
        [AllowNull()][string]$ClientDataJson
    )

    if ([string]::IsNullOrWhiteSpace($ClientDataJson)) {
        return [pscustomobject]@{
            TriggerType                 = 'Unknown'
            TriggerKind                 = 'Unknown'
            TriggerAuthenticationType   = 'Unknown'
            HasRespondToAgentAction     = $null
            HasResponseAction           = $null
            HasDataverseConnector       = $null
            HasPowerBiConnector         = $null
            HasPlaceholderComposeOnly   = $null
            ContentVersion              = ''
        }
    }

    try {
        $obj = $ClientDataJson | ConvertFrom-Json -Depth 100
    } catch {
        return [pscustomobject]@{
            TriggerType                 = 'Unknown'
            TriggerKind                 = 'Unknown'
            TriggerAuthenticationType   = 'Unknown'
            HasRespondToAgentAction     = $null
            HasResponseAction           = $null
            HasDataverseConnector       = $null
            HasPowerBiConnector         = $null
            HasPlaceholderComposeOnly   = $null
            ContentVersion              = ''
        }
    }
    $definition = $obj.properties.definition
    $manual = $definition.triggers.manual
    $actions = $definition.actions
    $connectionRefs = $obj.properties.connectionReferences
    $connectorNames = @($connectionRefs.PSObject.Properties.Name)

    $hasRespondToAgent = $false
    $hasResponse = $false
    $composeOnly = $false

    if ($actions) {
        $actionNames = @($actions.PSObject.Properties.Name)
        $hasRespondToAgent = $actionNames -contains 'Respond_to_the_agent'
        $hasResponse = $actionNames -contains 'Response'
        $composeOnly = ($actionNames.Count -eq 1 -and $actionNames[0] -eq 'Compose')
    } else {
        $hasRespondToAgent = $null
        $hasResponse = $null
        $composeOnly = $null
    }

    return [pscustomobject]@{
        TriggerType               = [string]$manual.type
        TriggerKind               = [string]$manual.kind
        TriggerAuthenticationType = [string]$manual.inputs.triggerAuthenticationType
        HasRespondToAgentAction   = $hasRespondToAgent
        HasResponseAction         = $hasResponse
        HasDataverseConnector     = if ($connectorNames.Count -eq 0) { $null } else { @($connectorNames | Where-Object { $_ -match 'commondataserviceforapps|dataverse' }).Count -gt 0 }
        HasPowerBiConnector       = if ($connectorNames.Count -eq 0) { $null } else { @($connectorNames | Where-Object { $_ -match 'powerbi' }).Count -gt 0 }
        HasPlaceholderComposeOnly = $composeOnly
        ContentVersion            = [string]$definition.contentVersion
    }
}

$rows = @()
$findings = @()

foreach ($flowName in $targetFlowNames) {
    $workflowId = Get-FlowIdByName -FlowName $flowName
    if (-not $workflowId) {
        $rows += [pscustomobject]@{
            FlowName                   = $flowName
            WorkflowId                 = ''
            StateCode                  = 'Missing'
            StatusCode                 = 'Missing'
            ModifiedOn                 = ''
            TriggerType                = 'Unknown'
            TriggerKind                = 'Unknown'
            TriggerAuthenticationType  = 'Unknown'
            HasRespondToAgentAction    = $false
            HasResponseAction          = $false
            HasDataverseConnector      = $false
            HasPowerBiConnector        = $false
            HasPlaceholderComposeOnly  = $false
            ContentVersion             = ''
        }
        $findings += [pscustomobject]@{
            Severity = 'High'
            FlowName = $flowName
            Issue    = 'Flow not found'
            Action   = 'Create or import the flow into the current environment.'
        }
        continue
    }

    $status = Get-FlowStatusRow -WorkflowId $workflowId
    $clientData = Get-FlowClientDataJson -WorkflowId $workflowId
    $signals = Get-FlowSignals -ClientDataJson $clientData

    $row = [pscustomobject]@{
        FlowName                   = $flowName
        WorkflowId                 = $workflowId
        StateCode                  = $status.StateCode
        StatusCode                 = $status.StatusCode
        ModifiedOn                 = $status.ModifiedOn
        TriggerType                = $signals.TriggerType
        TriggerKind                = $signals.TriggerKind
        TriggerAuthenticationType  = $signals.TriggerAuthenticationType
        HasRespondToAgentAction    = $signals.HasRespondToAgentAction
        HasResponseAction          = $signals.HasResponseAction
        HasDataverseConnector      = $signals.HasDataverseConnector
        HasPowerBiConnector        = $signals.HasPowerBiConnector
        HasPlaceholderComposeOnly  = $signals.HasPlaceholderComposeOnly
        ContentVersion             = $signals.ContentVersion
    }
    $rows += $row

    if ($row.StateCode -ne 'Activated') {
        $findings += [pscustomobject]@{
            Severity = 'High'
            FlowName = $flowName
            Issue    = "Flow state is $($row.StateCode)"
            Action   = 'Turn the flow on and republish.'
        }
    }

    if ($row.HasPlaceholderComposeOnly -eq $true) {
        $findings += [pscustomobject]@{
            Severity = 'High'
            FlowName = $flowName
            Issue    = 'Flow contains only a Compose action (placeholder behavior).'
            Action   = 'Replace placeholder actions with production logic and response schema.'
        }
    }

    if ($flowName -like '*Webhook*' -and $row.TriggerType -ne 'Unknown' -and $row.TriggerType -ne 'Request') {
        $findings += [pscustomobject]@{
            Severity = 'Medium'
            FlowName = $flowName
            Issue    = 'Webhook flow is not using Request trigger.'
            Action   = 'Use Request trigger for external intake compatibility.'
        }
    }

    if ($flowName -like '*Dataverse*' -and $row.HasDataverseConnector -eq $false) {
        $findings += [pscustomobject]@{
            Severity = 'High'
            FlowName = $flowName
            Issue    = 'Dataverse flow has no Dataverse connector reference.'
            Action   = 'Add Dataverse connector actions and reconnect connection references.'
        }
    }

    if ($flowName -like '*Power BI*' -and $row.HasPowerBiConnector -eq $false) {
        $findings += [pscustomobject]@{
            Severity = 'High'
            FlowName = $flowName
            Issue    = 'Power BI flow has no Power BI connector reference.'
            Action   = 'Bind Power BI connector and dataset query action.'
        }
    }

    if ($row.ContentVersion -eq 'undefined') {
        $findings += [pscustomobject]@{
            Severity = 'Low'
            FlowName = $flowName
            Issue    = 'ContentVersion is undefined.'
            Action   = 'Save flow in designer to normalize definition metadata.'
        }
    }
}

$summary = [pscustomobject]@{
    GeneratedAt = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss')
    TotalFlows  = $rows.Count
    Missing     = @($rows | Where-Object { $_.StateCode -eq 'Missing' }).Count
    Activated   = @($rows | Where-Object { $_.StateCode -eq 'Activated' }).Count
    Findings    = $findings.Count
}

$reportLines = @(
    '# Power Automate Flow Audit',
    '',
    "Generated: $($summary.GeneratedAt)",
    '',
    "Total targeted flows: $($summary.TotalFlows)",
    "Activated: $($summary.Activated)",
    "Missing: $($summary.Missing)",
    "Findings: $($summary.Findings)",
    '',
    '## Flow Inventory',
    '',
    '| Flow | State | Trigger | Kind | Auth | Dataverse | Power BI | Placeholder |',
    '|---|---|---|---|---|---|---|---|'
)

foreach ($r in $rows) {
    $reportLines += "| $($r.FlowName) | $($r.StateCode) | $($r.TriggerType) | $($r.TriggerKind) | $($r.TriggerAuthenticationType) | $($r.HasDataverseConnector) | $($r.HasPowerBiConnector) | $($r.HasPlaceholderComposeOnly) |"
}

$reportLines += ''
$reportLines += '## Findings'
$reportLines += ''

if ($findings.Count -eq 0) {
    $reportLines += '- No corrective findings detected for the targeted flow set.'
} else {
    foreach ($f in $findings) {
        $reportLines += "- [$($f.Severity)] $($f.FlowName): $($f.Issue) -> $($f.Action)"
    }
}

$reportDir = Split-Path -Parent $OutputMarkdown
if (-not (Test-Path -LiteralPath $reportDir)) {
    New-Item -ItemType Directory -Path $reportDir -Force | Out-Null
}

$reportLines | Set-Content -LiteralPath $OutputMarkdown -Encoding UTF8

$payload = [pscustomobject]@{
    Summary  = $summary
    Flows    = $rows
    Findings = $findings
}
$payload | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $OutputJson -Encoding UTF8

Write-Host "Power Automate flow audit report written to: $OutputMarkdown"
Write-Host "Power Automate flow audit JSON written to: $OutputJson"
Write-Host "Findings: $($summary.Findings)"


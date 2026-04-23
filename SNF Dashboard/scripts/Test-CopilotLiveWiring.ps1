param(
    [string]$EnvironmentId = '',
    [string]$BotId = '',
    [string]$ActionManifestPath = 'D:\my agents copilot studio\SNF Dashboard\actions\ActionManifest.csv',
    [string]$OutputMarkdownPath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\copilot_live_wiring_check.md',
    [string]$OutputJsonPath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\copilot_live_wiring_check.json'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Get-ConnDefaults {
    $connPath = 'D:\my agents copilot studio\SNF Dashboard\.mcs\conn.json'
    if (-not (Test-Path -LiteralPath $connPath)) { return $null }
    try {
        return Get-Content -LiteralPath $connPath -Raw | ConvertFrom-Json
    }
    catch {
        return $null
    }
}

function Normalize-Url([string]$Url) {
    if ([string]::IsNullOrWhiteSpace($Url)) { return '' }
    return $Url.Trim().TrimEnd('/').ToLowerInvariant()
}

function Get-OrgUrlFromEnvironmentId {
    param([Parameter(Mandatory = $true)][string]$EnvId)
    $orgsRaw = & pac org list --json 2>&1 | Out-String
    $orgs = $orgsRaw | ConvertFrom-Json
    $match = $orgs | Where-Object { $_.EnvironmentIdentifier.Id -eq $EnvId } | Select-Object -First 1
    if ($null -eq $match) {
        throw "EnvironmentId '$EnvId' not found in pac org list."
    }
    return [string]$match.EnvironmentUrl
}

function Invoke-DataverseGet {
    param(
        [Parameter(Mandatory = $true)][string]$OrgUrl,
        [Parameter(Mandatory = $true)][string]$RelativePath
    )

    $token = & az account get-access-token --resource $OrgUrl --query accessToken -o tsv 2>$null
    if ([string]::IsNullOrWhiteSpace($token)) {
        throw "Unable to acquire access token for '$OrgUrl'. Ensure az login is valid for this tenant."
    }
    $headers = @{
        Authorization    = "Bearer $token"
        'OData-Version'  = '4.0'
        'OData-MaxVersion' = '4.0'
        Accept           = 'application/json'
    }
    $uri = "{0}/api/data/v9.2/{1}" -f $OrgUrl.TrimEnd('/'), $RelativePath.TrimStart('/')
    return Invoke-RestMethod -Method Get -Uri $uri -Headers $headers
}

function Get-FlowRuntimeState {
    param(
        [Parameter(Mandatory = $true)][string]$OrgUrl,
        [Parameter(Mandatory = $true)][string]$FlowId
    )

    $select = '$select=workflowid,name,statecode,statuscode,category,type,ondemand,clientdata'
    try {
        $flow = Invoke-DataverseGet -OrgUrl $OrgUrl -RelativePath ("workflows({0})?{1}" -f $FlowId, $select)
    }
    catch {
        return [pscustomobject]@{
            Exists             = $false
            WorkflowId         = $FlowId
            Name               = ''
            StateCode          = $null
            StatusCode         = $null
            Category           = $null
            Type               = $null
            OnDemand           = $null
            ClientDataLength   = 0
            TriggerCount       = 0
            ActionCount        = 0
            HasRespondAction   = $false
            ParseError         = ''
        }
    }

    $clientDataRaw = [string]$flow.clientdata
    $clientDataLength = if ([string]::IsNullOrWhiteSpace($clientDataRaw)) { 0 } else { $clientDataRaw.Length }
    $triggerCount = 0
    $actionCount = 0
    $hasRespondAction = $false
    $parseError = ''

    if ($clientDataLength -gt 0) {
        try {
            $obj = $clientDataRaw | ConvertFrom-Json -Depth 100
            $definition = $obj.properties.definition
            if ($definition) {
                if ($definition.triggers) {
                    $triggerCount = @($definition.triggers.PSObject.Properties.Name).Count
                }
                if ($definition.actions) {
                    $actionNames = @($definition.actions.PSObject.Properties.Name)
                    $actionCount = $actionNames.Count
                    $hasRespondAction = $actionNames -contains 'Respond_to_the_agent'
                }
            }
        }
        catch {
            $parseError = $_.Exception.Message
        }
    }

    return [pscustomobject]@{
        Exists             = $true
        WorkflowId         = [string]$flow.workflowid
        Name               = [string]$flow.name
        StateCode          = $flow.statecode
        StatusCode         = $flow.statuscode
        Category           = $flow.category
        Type               = $flow.type
        OnDemand           = $flow.ondemand
        ClientDataLength   = $clientDataLength
        TriggerCount       = $triggerCount
        ActionCount        = $actionCount
        HasRespondAction   = $hasRespondAction
        ParseError         = $parseError
    }
}

$conn = Get-ConnDefaults
if ([string]::IsNullOrWhiteSpace($EnvironmentId) -and $null -ne $conn) { $EnvironmentId = [string]$conn.EnvironmentId }
if ([string]::IsNullOrWhiteSpace($BotId) -and $null -ne $conn) { $BotId = [string]$conn.AgentId }
if ([string]::IsNullOrWhiteSpace($EnvironmentId) -or [string]::IsNullOrWhiteSpace($BotId)) {
    throw 'Provide -EnvironmentId and -BotId, or ensure .mcs/conn.json contains both.'
}
if (-not (Test-Path -LiteralPath $ActionManifestPath)) {
    throw "Action manifest not found: $ActionManifestPath"
}

$orgUrl = Get-OrgUrlFromEnvironmentId -EnvId $EnvironmentId

$listOutput = & pac copilot list --environment $EnvironmentId 2>&1 | Out-String
$botInList = $listOutput -match [regex]::Escape($BotId)

$actions = Import-Csv -LiteralPath $ActionManifestPath
$rows = [System.Collections.Generic.List[object]]::new()
$findings = [System.Collections.Generic.List[object]]::new()

foreach ($action in $actions) {
    $flowId = [string]$action.FlowId
    $state = Get-FlowRuntimeState -OrgUrl $orgUrl -FlowId $flowId

    $isActive = $state.Exists -and ($state.StateCode -eq 1 -or $state.StateCode -eq 'Activated')
    $hasDefinition = $state.ClientDataLength -gt 0
    $appearsWired = $state.Exists -and $isActive -and $hasDefinition

    $rows.Add([pscustomobject]@{
        ActionFile        = [string]$action.ActionFile
        ActionDisplayName = [string]$action.DisplayName
        FlowId            = $flowId
        FlowExists        = $state.Exists
        FlowName          = $state.Name
        FlowActive        = $isActive
        StateCode         = $state.StateCode
        StatusCode        = $state.StatusCode
        ClientDataLength  = $state.ClientDataLength
        TriggerCount      = $state.TriggerCount
        ActionCount       = $state.ActionCount
        HasRespondAction  = $state.HasRespondAction
        AppearsWired      = $appearsWired
    }) | Out-Null

    if (-not $state.Exists) {
        $findings.Add([pscustomobject]@{
            Severity = 'High'
            Action   = [string]$action.ActionFile
            FlowId   = $flowId
            Issue    = 'Referenced flowId does not exist in target environment.'
            Fix      = 'Import or create the flow in this environment, then rerun this check.'
        }) | Out-Null
        continue
    }

    if (-not $isActive) {
        $findings.Add([pscustomobject]@{
            Severity = 'High'
            Action   = [string]$action.ActionFile
            FlowId   = $flowId
            Issue    = 'Flow exists but is not activated.'
            Fix      = 'Open flow connections if needed, turn on flow, then rerun this check.'
        }) | Out-Null
    }

    if (-not $hasDefinition) {
        $findings.Add([pscustomobject]@{
            Severity = 'High'
            Action   = [string]$action.ActionFile
            FlowId   = $flowId
            Issue    = 'Flow exists but has empty definition/clientdata.'
            Fix      = 'Re-import the flow definition and validate it has triggers/actions.'
        }) | Out-Null
    }
}

$summary = [pscustomobject]@{
    GeneratedAt        = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss')
    EnvironmentId      = $EnvironmentId
    EnvironmentUrl     = $orgUrl
    BotId              = $BotId
    BotPresentInList   = $botInList
    TotalActions       = $rows.Count
    WiredActions       = @($rows | Where-Object { $_.AppearsWired }).Count
    MissingFlows       = @($rows | Where-Object { -not $_.FlowExists }).Count
    InactiveFlows      = @($rows | Where-Object { $_.FlowExists -and -not $_.FlowActive }).Count
    EmptyDefinitions   = @($rows | Where-Object { $_.FlowExists -and $_.ClientDataLength -le 0 }).Count
    Findings           = $findings.Count
}

$payload = [pscustomobject]@{
    Summary  = $summary
    Rows     = $rows
    Findings = $findings
}

$jsonDir = Split-Path -Parent $OutputJsonPath
if (-not (Test-Path -LiteralPath $jsonDir)) { New-Item -ItemType Directory -Path $jsonDir -Force | Out-Null }
$payload | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $OutputJsonPath -Encoding UTF8

$md = [System.Collections.Generic.List[string]]::new()
$md.Add('# Copilot Live Wiring Check') | Out-Null
$md.Add('') | Out-Null
$md.Add("Generated: $($summary.GeneratedAt)") | Out-Null
$md.Add('') | Out-Null
$md.Add("EnvironmentId: $($summary.EnvironmentId)") | Out-Null
$md.Add("EnvironmentUrl: $($summary.EnvironmentUrl)") | Out-Null
$md.Add("BotId: $($summary.BotId)") | Out-Null
$md.Add("Bot present in `pac copilot list`: $($summary.BotPresentInList)") | Out-Null
$md.Add('') | Out-Null
$md.Add("Total actions: $($summary.TotalActions)") | Out-Null
$md.Add("Wired actions: $($summary.WiredActions)") | Out-Null
$md.Add("Missing flows: $($summary.MissingFlows)") | Out-Null
$md.Add("Inactive flows: $($summary.InactiveFlows)") | Out-Null
$md.Add("Empty definitions: $($summary.EmptyDefinitions)") | Out-Null
$md.Add("Findings: $($summary.Findings)") | Out-Null
$md.Add('') | Out-Null
$md.Add('## Wiring Matrix') | Out-Null
$md.Add('') | Out-Null
$md.Add('| Action | FlowId | Exists | Active | ClientDataLength | AppearsWired |') | Out-Null
$md.Add('|---|---|---|---|---|---|') | Out-Null
foreach ($row in $rows) {
    $md.Add(('| {0} | {1} | {2} | {3} | {4} | {5} |' -f $row.ActionFile, $row.FlowId, $row.FlowExists, $row.FlowActive, $row.ClientDataLength, $row.AppearsWired)) | Out-Null
}
$md.Add('') | Out-Null
$md.Add('## Findings') | Out-Null
$md.Add('') | Out-Null
if ($findings.Count -eq 0) {
    $md.Add('- No corrective findings detected.') | Out-Null
}
else {
    foreach ($f in $findings) {
        $md.Add(("- [{0}] {1} ({2}): {3} -> {4}" -f $f.Severity, $f.Action, $f.FlowId, $f.Issue, $f.Fix)) | Out-Null
    }
}

$mdDir = Split-Path -Parent $OutputMarkdownPath
if (-not (Test-Path -LiteralPath $mdDir)) { New-Item -ItemType Directory -Path $mdDir -Force | Out-Null }
$md -join [Environment]::NewLine | Set-Content -LiteralPath $OutputMarkdownPath -Encoding UTF8

Write-Host "Live wiring report written to: $OutputMarkdownPath"
Write-Host "Live wiring JSON written to: $OutputJsonPath"

if (-not $summary.BotPresentInList) {
    throw "BotId '$BotId' was not found in pac copilot list for environment '$EnvironmentId'."
}
if ($findings.Count -gt 0) {
    throw "Live wiring check failed with $($findings.Count) finding(s)."
}

Write-Host 'Live wiring check passed.'

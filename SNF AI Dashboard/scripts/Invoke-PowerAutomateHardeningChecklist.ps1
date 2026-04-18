param(
    [string]$AuditJsonPath = 'D:\SNF AI Dashboard\data\processed\powerautomate_flow_audit.json',
    [string]$OutputMarkdown = 'D:\SNF AI Dashboard\data\processed\powerautomate_hardening_checklist.md',
    [string]$OutputJson = 'D:\SNF AI Dashboard\data\processed\powerautomate_hardening_checklist.json'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Ensure-ParentDirectory {
    param([string]$Path)
    $parent = Split-Path -Parent $Path
    if (-not (Test-Path -LiteralPath $parent)) {
        New-Item -ItemType Directory -Path $parent -Force | Out-Null
    }
}

function Invoke-FetchRaw {
    param(
        [string]$Xml,
        [string]$TempFile
    )
    Ensure-ParentDirectory -Path $TempFile
    $Xml | Set-Content -LiteralPath $TempFile -Encoding UTF8
    return pac env fetch --xmlFile $TempFile 2>&1
}

if (-not (Test-Path -LiteralPath $AuditJsonPath)) {
    throw "Audit JSON not found. Run Invoke-PowerAutomateFlowAudit.ps1 first. Missing: $AuditJsonPath"
}

$audit = Get-Content -LiteralPath $AuditJsonPath -Raw | ConvertFrom-Json
$flowRows = @($audit.Flows)
$findings = @($audit.Findings)

$untitledFetch = @"
<fetch count="200">
  <entity name="workflow">
    <attribute name="workflowid"/>
    <attribute name="name"/>
    <attribute name="statecode"/>
    <attribute name="statuscode"/>
    <attribute name="modifiedon"/>
    <filter>
      <condition attribute="name" operator="like" value="Untitled%"/>
    </filter>
    <order attribute="modifiedon" descending="true"/>
  </entity>
</fetch>
"@

$untitledRaw = Invoke-FetchRaw -Xml $untitledFetch -TempFile 'D:\SNF AI Dashboard\data\processed\tmp.fetch.untitled.xml'
$untitledText = $untitledRaw -join [Environment]::NewLine
$untitledMatches = [regex]::Matches(
    $untitledText,
    '([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\s+(.+?)\s+(Activated|Draft)\s+(Activated|Draft)\s+(\d{1,2}/\d{1,2}/\d{4}\s+\d{1,2}:\d{2}\s+[AP]M)'
)

$untitledFlows = @()
foreach ($m in $untitledMatches) {
    $untitledFlows += [pscustomobject]@{
        WorkflowId = $m.Groups[1].Value
        Name       = $m.Groups[2].Value.Trim()
        StateCode  = $m.Groups[3].Value
        StatusCode = $m.Groups[4].Value
        ModifiedOn = $m.Groups[5].Value
    }
}

$actions = @()

foreach ($flow in $flowRows) {
    if ($flow.StateCode -ne 'Activated') {
        $actions += [pscustomobject]@{
            Priority = 'P1'
            Scope    = 'Corrective'
            FlowName = $flow.FlowName
            Action   = 'Activate flow and republish in solution.'
        }
    }

    if ($flow.TriggerType -eq 'Unknown') {
        $actions += [pscustomobject]@{
            Priority = 'P2'
            Scope    = 'Preventative'
            FlowName = $flow.FlowName
            Action   = 'Open flow in designer and save once to normalize metadata for deterministic audits.'
        }
    }

    if ($flow.HasPlaceholderComposeOnly -eq $true) {
        $actions += [pscustomobject]@{
            Priority = 'P1'
            Scope    = 'Corrective'
            FlowName = $flow.FlowName
            Action   = 'Replace placeholder Compose-only logic with production actions and structured response.'
        }
    }
}

foreach ($u in $untitledFlows) {
    $actions += [pscustomobject]@{
        Priority = 'P2'
        Scope    = 'Corrective'
        FlowName = $u.Name
        Action   = "Rename flow to production naming standard and update description. WorkflowId=$($u.WorkflowId)"
    }
}

$globalPreventative = @(
    'Enforce flow naming standard: DOMAIN - Capability - Channel - Version.',
    'Require explicit trigger auth mode review before publish (Tenant/AAD/anonymous only by policy).',
    'Require run-after coverage for failure and timeout on all external connector calls.',
    'Require deterministic response schema for all Copilot-invoked flows.',
    'Run Invoke-PowerAutomateFlowAudit.ps1 before each publish window.'
)

$summary = [pscustomobject]@{
    GeneratedAt      = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss')
    TargetedFlows    = $flowRows.Count
    ExistingFindings = $findings.Count
    UntitledFlows    = $untitledFlows.Count
    ChecklistItems   = $actions.Count
}

$md = @(
    '# Power Automate Hardening Checklist',
    '',
    "Generated: $($summary.GeneratedAt)",
    '',
    "Targeted flows: $($summary.TargetedFlows)",
    "Audit findings: $($summary.ExistingFindings)",
    "Untitled flows: $($summary.UntitledFlows)",
    "Checklist items: $($summary.ChecklistItems)",
    '',
    '## Corrective Actions',
    ''
)

$corrective = @($actions | Where-Object { $_.Scope -eq 'Corrective' })
if ($corrective.Count -eq 0) {
    $md += '- No corrective actions currently required.'
} else {
    foreach ($a in $corrective) {
        $md += "- [$($a.Priority)] $($a.FlowName): $($a.Action)"
    }
}

$md += ''
$md += '## Preventative Actions'
$md += ''

$preventative = @($actions | Where-Object { $_.Scope -eq 'Preventative' })
if ($preventative.Count -eq 0) {
    $md += '- No flow-specific preventative actions currently required.'
} else {
    foreach ($a in $preventative) {
        $md += "- [$($a.Priority)] $($a.FlowName): $($a.Action)"
    }
}

foreach ($p in $globalPreventative) {
    $md += "- [P2] Global: $p"
}

if ($untitledFlows.Count -gt 0) {
    $md += ''
    $md += '## Untitled Flows Detected'
    $md += ''
    foreach ($u in $untitledFlows) {
        $md += "- $($u.Name) | $($u.WorkflowId) | $($u.StateCode) | $($u.ModifiedOn)"
    }
}

$payload = [pscustomobject]@{
    Summary           = $summary
    ExistingFindings  = $findings
    UntitledFlows     = $untitledFlows
    ChecklistActions  = $actions
    GlobalPreventative = $globalPreventative
}

Ensure-ParentDirectory -Path $OutputMarkdown
Ensure-ParentDirectory -Path $OutputJson

$md | Set-Content -LiteralPath $OutputMarkdown -Encoding UTF8
$payload | ConvertTo-Json -Depth 10 | Set-Content -LiteralPath $OutputJson -Encoding UTF8

Write-Host "Power Automate hardening checklist written to: $OutputMarkdown"
Write-Host "Power Automate hardening checklist JSON written to: $OutputJson"
Write-Host "Checklist items: $($summary.ChecklistItems)"

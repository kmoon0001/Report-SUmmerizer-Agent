param(
    [string]$OutputReport = 'D:\SNF AI Dashboard\data\processed\powerautomate_flow_naming_standard.md'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$envFetch = @"
<fetch count="500">
  <entity name="workflow">
    <attribute name="workflowid"/>
    <attribute name="name"/>
    <attribute name="statecode"/>
    <attribute name="statuscode"/>
    <attribute name="modifiedon"/>
    <filter>
      <condition attribute="category" operator="eq" value="5"/>
    </filter>
    <order attribute="modifiedon" descending="true"/>
  </entity>
</fetch>
"@

$tempXml = 'D:\SNF AI Dashboard\data\processed\tmp.fetch.flow.naming.xml'
$reportDir = Split-Path -Parent $OutputReport
if (-not (Test-Path -LiteralPath $reportDir)) {
    New-Item -ItemType Directory -Path $reportDir -Force | Out-Null
}
$envFetch | Set-Content -LiteralPath $tempXml -Encoding UTF8
$raw = pac env fetch --xmlFile $tempXml 2>&1
$text = $raw -join [Environment]::NewLine

$pattern = [regex]'([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\s+(.+?)\s+(Activated|Draft)\s+(Activated|Draft)\s+(\d{1,2}/\d{1,2}/\d{4}\s+\d{1,2}:\d{2}\s+[AP]M)'
$matches = $pattern.Matches($text)

$rows = @()
foreach ($m in $matches) {
    $rows += [pscustomobject]@{
        WorkflowId = $m.Groups[1].Value
        Name       = $m.Groups[2].Value.Trim()
        StateCode  = $m.Groups[3].Value
        StatusCode = $m.Groups[4].Value
        ModifiedOn = $m.Groups[5].Value
    }
}

$nameRegex = '^(COPILOT V2|INTERNAL|SNF)(\s*-\s*.+)$'
$violations = @(
    $rows | Where-Object {
        $_.Name -match '^\s*Untitled' -or
        $_.Name -notmatch $nameRegex
    }
)

$status = if ($violations.Count -eq 0) { 'PASS' } else { 'FAIL' }
$lines = @(
    '# Power Automate Flow Naming Standard',
    '',
    "Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')",
    "Status: **$status**",
    "Total modern flows scanned: $($rows.Count)",
    "Violations: $($violations.Count)",
    '',
    '## Standard',
    '- Prefix must be one of: `COPILOT V2`, `INTERNAL`, `SNF`',
    '- Name must follow: `PREFIX - Capability`',
    '- `Untitled*` names are not allowed',
    ''
)

if ($violations.Count -gt 0) {
    $lines += '## Violations'
    foreach ($v in $violations) {
        $lines += "- $($v.Name) | $($v.WorkflowId) | $($v.StateCode) | $($v.ModifiedOn)"
    }
}

$lines | Set-Content -LiteralPath $OutputReport -Encoding UTF8
Write-Host "Flow naming report written to: $OutputReport"
Write-Host "Status: $status"
Write-Host "Violations: $($violations.Count)"

if ($violations.Count -gt 0) {
    exit 2
}

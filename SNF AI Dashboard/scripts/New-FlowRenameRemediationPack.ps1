param(
    [string]$EnvironmentId = 'a944fdf0-0d2e-e14d-8a73-0f5ffae23315',
    [string]$OutputPath = 'D:\SNF AI Dashboard\data\processed\flow_rename_remediation_pack.md'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$plan = @(
    [pscustomobject]@{ WorkflowId = '9d834a1f-1a18-f111-8341-000d3a5a5d47'; CurrentName = 'PBI QM Mock Data'; ProposedName = 'INTERNAL - Power BI QM Mock Data' }
    [pscustomobject]@{ WorkflowId = 'fcf035ad-af0c-f111-8406-0022480b6bd9'; CurrentName = 'QM Email Generator Flow'; ProposedName = 'SNF - Quality Measure Email Generator' }
    [pscustomobject]@{ WorkflowId = '51112488-9726-f111-8341-0022480b6bd9'; CurrentName = 'UPLOAD - Normalize Manual QM File V2'; ProposedName = 'INTERNAL - Normalize Manual QM File V2' }
    [pscustomobject]@{ WorkflowId = '3a73a4c2-5a18-f111-8341-000d3a5a5d47'; CurrentName = 'PBI QM Mock Data Sync'; ProposedName = 'INTERNAL - Power BI QM Mock Data Sync' }
    [pscustomobject]@{ WorkflowId = '0b930a15-2516-f111-8341-0022480b6bd9'; CurrentName = 'QM Decline Detection & Reporting Flow'; ProposedName = 'SNF - Quality Measure Decline Detection And Reporting' }
    [pscustomobject]@{ WorkflowId = 'f96d43dd-fd24-f111-8341-6045bd061151'; CurrentName = 'Therapy AI Resident Insight Intake'; ProposedName = 'SNF - Therapy AI Resident Insight Intake' }
    [pscustomobject]@{ WorkflowId = 'db104008-d226-f111-8341-000d3a5b88c6'; CurrentName = 'Untitled'; ProposedName = 'SNF - Clinical Intake Handoff Router' }
)

$lines = [System.Collections.Generic.List[string]]::new()
$lines.Add('# Flow Rename Remediation Pack') | Out-Null
$lines.Add('') | Out-Null
$lines.Add("Generated: $((Get-Date).ToString('yyyy-MM-dd HH:mm:ss'))") | Out-Null
$lines.Add('') | Out-Null
$lines.Add('Use the links below to open each flow directly in Power Automate designer and apply the proposed name.') | Out-Null
$lines.Add('') | Out-Null
$lines.Add('| Current Name | Flow ID | Proposed Name | Designer URL |') | Out-Null
$lines.Add('|---|---|---|---|') | Out-Null

foreach ($row in $plan) {
    $designerUrl = "https://make.powerautomate.com/environments/$EnvironmentId/flows/$($row.WorkflowId)/edit"
    $lines.Add("| $($row.CurrentName) | $($row.WorkflowId) | $($row.ProposedName) | $designerUrl |") | Out-Null
}

$dir = Split-Path -Parent $OutputPath
if (-not (Test-Path -LiteralPath $dir)) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
}

$lines -join [Environment]::NewLine | Set-Content -LiteralPath $OutputPath -Encoding UTF8
Write-Host "Flow rename remediation pack written to: $OutputPath"

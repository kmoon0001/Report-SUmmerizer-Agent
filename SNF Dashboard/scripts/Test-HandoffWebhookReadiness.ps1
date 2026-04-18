param(
    [string]$EnvPath = 'D:\my agents copilot studio\SNF Dashboard\.env',
    [string]$OutputPath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\handoff_webhook_readiness.md'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Get-DotEnvValue {
    param(
        [string]$Path,
        [string]$Key
    )

    if (-not (Test-Path -LiteralPath $Path)) { return '' }
    foreach ($line in (Get-Content -LiteralPath $Path)) {
        $trim = [string]$line
        if ([string]::IsNullOrWhiteSpace($trim)) { continue }
        if ($trim.StartsWith('#')) { continue }
        $idx = $trim.IndexOf('=')
        if ($idx -lt 1) { continue }
        $k = $trim.Substring(0, $idx).Trim()
        if ($k -ne $Key) { continue }
        return $trim.Substring($idx + 1).Trim()
    }
    return ''
}

$deliveryMode = Get-DotEnvValue -Path $EnvPath -Key 'HANDOFF_DELIVERY_MODE'
if ([string]::IsNullOrWhiteSpace($deliveryMode)) {
    $deliveryMode = 'CopilotNative'
}
$deliveryMode = [string]$deliveryMode

$handoff = Get-DotEnvValue -Path $EnvPath -Key 'HANDOFF_WEBHOOK_URL'
$teams = Get-DotEnvValue -Path $EnvPath -Key 'HANDOFF_TEAMS_WEBHOOK_URL'

$handoffLooksProtected = (-not [string]::IsNullOrWhiteSpace($handoff)) -and ($handoff -match 'triggers/manual/paths/invoke') -and ($handoff -notmatch 'sig=')

$projectRoot = Split-Path -Parent $EnvPath
$workflowManifestPath = Join-Path $projectRoot 'workflows\WorkflowManifest.csv'
$selectedType = ''

$status = 'NOT READY'
$details = ''
if ($deliveryMode -eq 'CopilotNative') {
    if (Test-Path -LiteralPath $workflowManifestPath) {
        $rows = @(Import-Csv -LiteralPath $workflowManifestPath)
        if ($rows.Count -gt 0) {
            $status = 'READY'
            $details = "Copilot-native delivery selected. Workflow manifest found with $($rows.Count) entries."
        }
        else {
            $details = 'Copilot-native delivery selected but workflow manifest is empty.'
        }
    }
    else {
        $details = "Copilot-native delivery selected but workflow manifest is missing: $workflowManifestPath"
    }
}
else {
    $selected = ''
    $selectedType = ''
    if ($handoffLooksProtected -and -not [string]::IsNullOrWhiteSpace($teams)) {
        $selected = $teams
        $selectedType = 'HANDOFF_TEAMS_WEBHOOK_URL'
    }
    elseif (-not [string]::IsNullOrWhiteSpace($handoff)) {
        $selected = $handoff
        $selectedType = 'HANDOFF_WEBHOOK_URL'
    }
    elseif (-not [string]::IsNullOrWhiteSpace($teams)) {
        $selected = $teams
        $selectedType = 'HANDOFF_TEAMS_WEBHOOK_URL'
    }

    if ([string]::IsNullOrWhiteSpace($selected)) {
        $details = 'No webhook URL configured in .env.'
    }
    else {
        if ($selected -match 'triggers/manual/paths/invoke' -and $selected -notmatch 'sig=') {
            $details = 'Configured URL appears to be a protected internal flow endpoint without signature token. It will likely return 401/403.'
        }
        elseif ($selected -match '^https://') {
            $status = 'READY'
            $details = 'Webhook URL format looks valid.'
        }
        else {
            $details = 'Configured webhook URL does not appear to be a valid HTTPS endpoint.'
        }
    }
}

$lines = @(
    '# Handoff Webhook Readiness',
    '',
    "Generated: $((Get-Date).ToString('yyyy-MM-dd HH:mm:ss'))",
    "Status: **$status**",
    '',
    "- Delivery mode: $deliveryMode",
    "- Selected variable: $selectedType",
    "- Details: $details"
)

$outDir = Split-Path -Parent $OutputPath
if ($outDir -and -not (Test-Path -LiteralPath $outDir)) {
    New-Item -ItemType Directory -Path $outDir -Force | Out-Null
}
$lines -join [Environment]::NewLine | Set-Content -LiteralPath $OutputPath -Encoding UTF8
Write-Host "Handoff webhook readiness written to: $OutputPath"
Write-Host "Status: $status"

if ($status -ne 'READY') {
    throw "Handoff webhook is not ready. See: $OutputPath"
}


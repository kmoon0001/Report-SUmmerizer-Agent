param(
    [string]$QueuePath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\command_center_automated_handoff_queue.csv',
    [string]$OutputPath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\command_center_automated_handoff_dispatch_log.csv',
    [string]$SummaryPath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\command_center_automated_handoff_dispatch_summary.md',
    [string]$DeliveryMode = '',
    [string]$WebhookUrl = '',
    [string]$WebhookBearerToken = '',
    [switch]$FailOnDispatchError = $false
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Get-DotEnvValue {
    param(
        [string]$Path,
        [string]$Key
    )

    if ([string]::IsNullOrWhiteSpace($Path) -or -not (Test-Path -LiteralPath $Path)) {
        return ''
    }

    $lines = Get-Content -LiteralPath $Path -ErrorAction SilentlyContinue
    foreach ($line in $lines) {
        $trim = [string]$line
        if ([string]::IsNullOrWhiteSpace($trim)) { continue }
        if ($trim.StartsWith('#')) { continue }

        $idx = $trim.IndexOf('=')
        if ($idx -lt 1) { continue }

        $k = $trim.Substring(0, $idx).Trim()
        if ($k -ne $Key) { continue }

        $v = $trim.Substring($idx + 1).Trim()
        if (($v.StartsWith('"') -and $v.EndsWith('"')) -or ($v.StartsWith("'") -and $v.EndsWith("'"))) {
            if ($v.Length -ge 2) {
                $v = $v.Substring(1, $v.Length - 2)
            }
        }
        return $v
    }

    return ''
}

function Get-AadTokenFromAzCli {
    param(
        [string]$Resource = 'https://service.powerapps.com'
    )

    try {
        $json = & az account get-access-token --resource $Resource --output json 2>$null
        if ([string]::IsNullOrWhiteSpace([string]$json)) { return '' }
        $parsed = $json | ConvertFrom-Json
        if ($null -eq $parsed) { return '' }
        return [string]$parsed.accessToken
    }
    catch {
        return ''
    }
}

if (-not (Test-Path -LiteralPath $QueuePath)) {
    throw "Automated handoff queue file not found: $QueuePath"
}

$queueRows = @(Import-Csv -LiteralPath $QueuePath)
if ($queueRows.Count -eq 0) {
    throw "Automated handoff queue has no rows: $QueuePath"
}

$effectiveDeliveryMode = [string]$DeliveryMode
if ([string]::IsNullOrWhiteSpace($effectiveDeliveryMode)) {
    $effectiveDeliveryMode = [string]$env:HANDOFF_DELIVERY_MODE
}
if ([string]::IsNullOrWhiteSpace($effectiveDeliveryMode)) {
    $effectiveDeliveryMode = Get-DotEnvValue -Path 'D:\my agents copilot studio\SNF Dashboard\.env' -Key 'HANDOFF_DELIVERY_MODE'
}
if ([string]::IsNullOrWhiteSpace($effectiveDeliveryMode)) {
    $effectiveDeliveryMode = 'CopilotNative'
}

$effectiveWebhookUrl = [string]$WebhookUrl
$candidateHandoff = ''
$candidateTeams = ''
if ([string]::IsNullOrWhiteSpace($effectiveWebhookUrl) -and $effectiveDeliveryMode -ne 'CopilotNative') {
    $candidateHandoff = [string]$env:HANDOFF_WEBHOOK_URL
    if ([string]::IsNullOrWhiteSpace($candidateHandoff)) {
        $candidateHandoff = Get-DotEnvValue -Path 'D:\my agents copilot studio\SNF Dashboard\.env' -Key 'HANDOFF_WEBHOOK_URL'
    }
    $candidateTeams = [string]$env:HANDOFF_TEAMS_WEBHOOK_URL
    if ([string]::IsNullOrWhiteSpace($candidateTeams)) {
        $candidateTeams = Get-DotEnvValue -Path 'D:\my agents copilot studio\SNF Dashboard\.env' -Key 'HANDOFF_TEAMS_WEBHOOK_URL'
    }

    $handoffProtected = (-not [string]::IsNullOrWhiteSpace($candidateHandoff)) -and ($candidateHandoff -match 'triggers/manual/paths/invoke') -and ($candidateHandoff -notmatch 'sig=')
    if ($handoffProtected -and -not [string]::IsNullOrWhiteSpace($candidateTeams)) {
        $effectiveWebhookUrl = $candidateTeams
    }
    elseif (-not [string]::IsNullOrWhiteSpace($candidateHandoff)) {
        $effectiveWebhookUrl = $candidateHandoff
    }
    elseif (-not [string]::IsNullOrWhiteSpace($candidateTeams)) {
        $effectiveWebhookUrl = $candidateTeams
    }
}

$effectiveBearerToken = [string]$WebhookBearerToken
if ([string]::IsNullOrWhiteSpace($effectiveBearerToken)) {
    $effectiveBearerToken = [string]$env:HANDOFF_WEBHOOK_BEARER_TOKEN
}
if ([string]::IsNullOrWhiteSpace($effectiveBearerToken)) {
    $effectiveBearerToken = Get-DotEnvValue -Path 'D:\my agents copilot studio\SNF Dashboard\.env' -Key 'HANDOFF_WEBHOOK_BEARER_TOKEN'
}

$isPowerPlatformDirectUrl = $false
if (-not [string]::IsNullOrWhiteSpace($effectiveWebhookUrl)) {
    $isPowerPlatformDirectUrl = ($effectiveWebhookUrl -match '\.environment\.api\.powerplatform\.com')
}

if ($isPowerPlatformDirectUrl -and [string]::IsNullOrWhiteSpace($effectiveBearerToken)) {
    $effectiveBearerToken = Get-AadTokenFromAzCli -Resource 'https://service.powerapps.com'
}

$timestampUtc = (Get-Date).ToUniversalTime().ToString('s')
$dispatchResults = @()

foreach ($row in $queueRows) {
    $status = [string]$row.Status
    if ($status -and $status -ne 'Queued') {
        continue
    }

    $ticketId = [string]$row.HandoffTicketId
    $severity = [string]$row.Severity
    $owner = [string]$row.ResponsibleParty
    $resident = [string]$row.ResidentName
    $unit = [string]$row.UnitCode
    $trigger = [string]$row.TriggerReason

    $resultStatus = 'PendingEndpoint'
    $resultMessage = 'No handoff webhook configured. Ticket remains queued.'
    $httpCode = ''

    if ($effectiveDeliveryMode -eq 'CopilotNative') {
        $resultStatus = 'CopilotNativeAccepted'
        $resultMessage = 'Ticket accepted for Copilot-native action/flow delivery. External webhook not required.'
    }
    elseif (-not [string]::IsNullOrWhiteSpace($effectiveWebhookUrl)) {
        try {
            $body = @{
                ticketId = $ticketId
                createdAtUtc = [string]$row.CreatedAtUtc
                severity = $severity
                owner = $owner
                residentName = $resident
                residentSourceId = [string]$row.ResidentSourceId
                unitCode = $unit
                roomCode = [string]$row.RoomCode
                slaTarget = [string]$row.SlaTarget
                handoffChannel = [string]$row.HandoffChannel
                triggerReason = $trigger
                priorityScore = [string]$row.PriorityScore
                progressLevel = [string]$row.ProgressLevel
                outstandingDocCount = [string]$row.OutstandingDocCount
                overdueDocCount = [string]$row.OverdueDocCount
                copilotAgentInsight = [string]$row.CopilotAgentInsight
                nextStep = [string]$row.NextStep
            } | ConvertTo-Json -Depth 6

            $headers = @{ 'Content-Type' = 'application/json' }
            if (-not [string]::IsNullOrWhiteSpace($effectiveBearerToken)) {
                $headers['Authorization'] = "Bearer $effectiveBearerToken"
            }

            $response = Invoke-WebRequest -Method Post -Uri $effectiveWebhookUrl -Headers $headers -Body $body -TimeoutSec 30 -UseBasicParsing
            $resultStatus = 'Delivered'
            $resultMessage = 'Ticket delivered to webhook endpoint.'
            $httpCode = [string]$response.StatusCode
        }
        catch {
            $resultStatus = 'DispatchError'
            $resultMessage = $_.Exception.Message
            if ($FailOnDispatchError) {
                throw "Dispatch failed for ${ticketId}: $resultMessage"
            }
        }
    }

    $dispatchResults += [pscustomobject]@{
        DispatchRunAtUtc = $timestampUtc
        HandoffTicketId = $ticketId
        DispatchStatus = $resultStatus
        DispatchMessage = $resultMessage
        HttpStatusCode = $httpCode
        Severity = $severity
        ResponsibleParty = $owner
        ResidentName = $resident
        UnitCode = $unit
    }
}

$outDir = Split-Path -Parent $OutputPath
if ($outDir -and -not (Test-Path -LiteralPath $outDir)) {
    New-Item -ItemType Directory -Path $outDir -Force | Out-Null
}

$dispatchResults | Export-Csv -LiteralPath $OutputPath -NoTypeInformation -Encoding UTF8

$deliveredCount = @($dispatchResults | Where-Object { [string]$_.DispatchStatus -eq 'Delivered' }).Count
$pendingCount = @($dispatchResults | Where-Object { [string]$_.DispatchStatus -eq 'PendingEndpoint' }).Count
$errorCount = @($dispatchResults | Where-Object { [string]$_.DispatchStatus -eq 'DispatchError' }).Count
$summaryLines = @(
    '# Automated Handoff Dispatch Summary',
    '',
    "Generated: $((Get-Date).ToString('yyyy-MM-dd HH:mm:ss'))",
    '',
    "- Delivery mode: $effectiveDeliveryMode",
    "- Queue rows considered: $($dispatchResults.Count)",
    "- Delivered: $deliveredCount",
    "- Copilot native accepted: $(@($dispatchResults | Where-Object { [string]$_.DispatchStatus -eq 'CopilotNativeAccepted' }).Count)",
    "- Pending endpoint: $pendingCount",
    "- Dispatch errors: $errorCount",
    "- Endpoint configured: $([string](-not [string]::IsNullOrWhiteSpace($effectiveWebhookUrl)))",
    "- Dispatch log: $OutputPath"
)
$summaryLines -join [Environment]::NewLine | Set-Content -LiteralPath $SummaryPath -Encoding UTF8

Write-Host "Automated handoff dispatch log written to: $OutputPath"
Write-Host "Dispatch summary written to: $SummaryPath"
Write-Host "Delivery mode: $effectiveDeliveryMode"
Write-Host "Delivered: $deliveredCount | Pending endpoint: $pendingCount | Errors: $errorCount"


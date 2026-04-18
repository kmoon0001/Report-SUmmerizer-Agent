param(
    [string]$QueuePath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\command_center_automated_handoff_queue.csv',
    [string]$DispatchLogPath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\command_center_automated_handoff_dispatch_log.csv',
    [string]$ResolutionSignalsPath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\command_center_handoff_resolution_signals.csv',
    [string]$OutputPath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\command_center_automated_handoff_queue.csv',
    [string]$StatusSummaryPath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\command_center_automated_handoff_queue.by-status.csv',
    [string]$SummaryPath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\command_center_automated_handoff_lifecycle_summary.md'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Get-OptionalPropertyValue {
    param(
        [psobject]$Row,
        [string]$Name
    )

    $property = $Row.PSObject.Properties[$Name]
    if ($null -eq $property) { return '' }
    return [string]$property.Value
}

if (-not (Test-Path -LiteralPath $QueuePath)) {
    throw "Automated handoff queue file not found: $QueuePath"
}

$queueRows = @(Import-Csv -LiteralPath $QueuePath)
if ($queueRows.Count -eq 0) {
    throw "Automated handoff queue has no rows: $QueuePath"
}

$dispatchByTicket = @{}
if (Test-Path -LiteralPath $DispatchLogPath) {
    foreach ($row in @(Import-Csv -LiteralPath $DispatchLogPath)) {
        $ticketId = [string]$row.HandoffTicketId
        if ([string]::IsNullOrWhiteSpace($ticketId)) { continue }
        $dispatchByTicket[$ticketId] = $row
    }
}

$resolutionByTicket = @{}
if (Test-Path -LiteralPath $ResolutionSignalsPath) {
    foreach ($row in @(Import-Csv -LiteralPath $ResolutionSignalsPath)) {
        $ticketId = [string]$row.HandoffTicketId
        if ([string]::IsNullOrWhiteSpace($ticketId)) { continue }
        $resolutionByTicket[$ticketId] = $row
    }
}

$nowUtc = (Get-Date).ToUniversalTime()
$updatedRows = foreach ($row in $queueRows) {
    $ticketId = [string]$row.HandoffTicketId
    $status = [string]$row.Status
    if ([string]::IsNullOrWhiteSpace($status)) { $status = 'Queued' }

    $createdAt = [DateTime]::MinValue
    $parsedCreatedAt = [DateTime]::TryParse([string]$row.CreatedAtUtc, [ref]$createdAt)
    if (-not $parsedCreatedAt) { $createdAt = $nowUtc }
    $ageMinutes = [int][Math]::Floor(($nowUtc - $createdAt.ToUniversalTime()).TotalMinutes)
    if ($ageMinutes -lt 0) { $ageMinutes = 0 }

    $severity = [string]$row.Severity
    $lastEvent = ''
    $lifecycleNote = ''
    $escalatedAtUtc = Get-OptionalPropertyValue -Row $row -Name 'EscalatedAtUtc'
    $dispatchedAtUtc = Get-OptionalPropertyValue -Row $row -Name 'DispatchedAtUtc'
    $resolvedAtUtc = Get-OptionalPropertyValue -Row $row -Name 'ResolvedAtUtc'

    if ($resolutionByTicket.ContainsKey($ticketId)) {
        $status = 'Resolved'
        $resolvedAtUtc = $nowUtc.ToString('s')
        $lastEvent = 'ResolutionSignal'
        $lifecycleNote = 'Marked resolved from external resolution signal.'
    }
    else {
        if ($dispatchByTicket.ContainsKey($ticketId)) {
            $dispatch = $dispatchByTicket[$ticketId]
            $dispatchStatus = [string]$dispatch.DispatchStatus
            if ($dispatchStatus -eq 'Delivered' -and $status -eq 'Queued') {
                $status = 'Dispatched'
                $dispatchedAtUtc = $nowUtc.ToString('s')
                $lastEvent = 'WebhookDelivered'
                $lifecycleNote = 'Auto-updated to Dispatched after successful webhook delivery.'
            }
            elseif ($dispatchStatus -eq 'CopilotNativeAccepted' -and $status -eq 'Queued') {
                $status = 'Dispatched'
                $dispatchedAtUtc = $nowUtc.ToString('s')
                $lastEvent = 'CopilotNativeAccepted'
                $lifecycleNote = 'Auto-updated to Dispatched after Copilot-native action/flow acceptance.'
            }
            elseif ($dispatchStatus -eq 'DispatchError') {
                $lifecycleNote = 'Dispatch error detected; ticket remains active.'
                if ([string]::IsNullOrWhiteSpace($lastEvent)) {
                    $lastEvent = 'DispatchError'
                }
            }
        }

        $highSlaBreach = ($severity -eq 'High' -and $ageMinutes -ge 15)
        $mediumSlaBreach = ($severity -eq 'Medium' -and $ageMinutes -ge 120)
        if (($status -eq 'Queued' -or $status -eq 'Dispatched') -and ($highSlaBreach -or $mediumSlaBreach)) {
            $status = 'Escalated'
            if ([string]::IsNullOrWhiteSpace($escalatedAtUtc)) {
                $escalatedAtUtc = $nowUtc.ToString('s')
            }
            $lastEvent = 'SlaBreachEscalation'
            $lifecycleNote = 'Auto-escalated because SLA breach threshold was reached.'
        }
    }

    [pscustomobject]@{
        SnapshotDateKey      = [string]$row.SnapshotDateKey
        HandoffTicketId      = $ticketId
        CreatedAtUtc         = [string]$row.CreatedAtUtc
        Status               = $status
        Severity             = $severity
        SlaTarget            = [string]$row.SlaTarget
        HandoffChannel       = [string]$row.HandoffChannel
        ResponsibleParty     = [string]$row.ResponsibleParty
        ResidentSourceId     = [string]$row.ResidentSourceId
        ResidentName         = [string]$row.ResidentName
        UnitCode             = [string]$row.UnitCode
        RoomCode             = [string]$row.RoomCode
        PriorityScore        = [string]$row.PriorityScore
        PriorityBand         = [string]$row.PriorityBand
        ProgressLevel        = [string]$row.ProgressLevel
        OutstandingDocCount  = [string]$row.OutstandingDocCount
        OverdueDocCount      = [string]$row.OverdueDocCount
        VitalsSummary        = [string]$row.VitalsSummary
        TriggerReason        = [string]$row.TriggerReason
        CopilotAgentInsight  = [string]$row.CopilotAgentInsight
        NextStep             = [string]$row.NextStep
        DispatchedAtUtc      = $dispatchedAtUtc
        EscalatedAtUtc       = $escalatedAtUtc
        ResolvedAtUtc        = $resolvedAtUtc
        AgeMinutes           = $ageMinutes
        LastLifecycleEvent   = $lastEvent
        LifecycleNote        = $lifecycleNote
        LastEvaluatedAtUtc   = $nowUtc.ToString('s')
    }
}

$statusSummary = @(
    $updatedRows |
        Group-Object Status |
        ForEach-Object {
            $g = $_.Group
            [pscustomobject]@{
                Status = [string]$_.Name
                Count = $g.Count
                HighSeverityCount = @($g | Where-Object { [string]$_.Severity -eq 'High' }).Count
                MediumSeverityCount = @($g | Where-Object { [string]$_.Severity -eq 'Medium' }).Count
            }
        } |
        Sort-Object Status
)

$outDir = Split-Path -Parent $OutputPath
if ($outDir -and -not (Test-Path -LiteralPath $outDir)) {
    New-Item -ItemType Directory -Path $outDir -Force | Out-Null
}

$updatedRows | Export-Csv -LiteralPath $OutputPath -NoTypeInformation -Encoding UTF8
$statusSummary | Export-Csv -LiteralPath $StatusSummaryPath -NoTypeInformation -Encoding UTF8

$summaryLines = @(
    '# Automated Handoff Lifecycle Summary',
    '',
    "Generated: $((Get-Date).ToString('yyyy-MM-dd HH:mm:ss'))",
    '',
    "- Queue rows evaluated: $($updatedRows.Count)",
    "- Dispatch log present: $([string](Test-Path -LiteralPath $DispatchLogPath))",
    "- Resolution signal file present: $([string](Test-Path -LiteralPath $ResolutionSignalsPath))"
)
foreach ($row in $statusSummary) {
    $summaryLines += "- Status $([string]$row.Status): $([string]$row.Count)"
}
$summaryLines += "- Status summary CSV: $StatusSummaryPath"
$summaryLines -join [Environment]::NewLine | Set-Content -LiteralPath $SummaryPath -Encoding UTF8

Write-Host "Automated handoff lifecycle updated queue: $OutputPath"
Write-Host "Status summary written to: $StatusSummaryPath"
Write-Host "Lifecycle summary written to: $SummaryPath"


param(
    [string]$PatientInsightsPath = 'D:\SNF AI Dashboard\data\processed\command_center_patient_insights.csv',
    [string]$PccActiveCensusPath = 'D:\SNF AI Dashboard\data\processed\pcc_resident_list_current.active-only.csv',
    [string]$DocumentationQueuePath = 'D:\SNF AI Dashboard\data\processed\command_center_documentation_queue.csv',
    [string]$TherapyCoveragePath = 'D:\SNF AI Dashboard\data\processed\command_center_therapy_coverage.csv',
    [string]$VitalsPath = 'D:\SNF AI Dashboard\data\processed\pcc_resident_vitals_current.csv',
    [string]$OutputPath = 'D:\SNF AI Dashboard\data\processed\command_center_automated_handoff_queue.csv',
    [string]$UnitSummaryPath = 'D:\SNF AI Dashboard\data\processed\command_center_automated_handoff_queue.by-unit.csv'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Get-IntValue {
    param($Value)
    $parsed = 0
    if ([int]::TryParse([string]$Value, [ref]$parsed)) { return $parsed }
    return 0
}

function Get-BoolValue {
    param($Value)

    $text = ([string]$Value).Trim()
    if ([string]::IsNullOrWhiteSpace($text)) { return $false }
    return $text -in @('True', 'true', '1', 'Yes', 'yes')
}

function Get-FirstTextValue {
    param(
        [psobject]$Row,
        [string[]]$PropertyNames
    )

    foreach ($name in $PropertyNames) {
        if ($Row.PSObject.Properties.Name -contains $name) {
            $value = ([string]$Row.$name).Trim()
            if ($value) { return $value }
        }
    }

    return ''
}

function Get-ExpectedInsightForProgressLevel {
    param([string]$ProgressLevel)

    switch ($ProgressLevel) {
        'At Risk' { return 'Escalate now: clear overdue docs, verify therapy continuity, and perform same-shift clinical review.' }
        'Monitor' { return 'Monitor: verify next due documentation date and reassess if no new therapy or documentation updates post-shift.' }
        'Stable' { return 'Maintain current plan: keep documentation current and confirm next therapy sessions stay on schedule.' }
        default { return 'Maintain momentum: continue current therapy cadence and preserve documentation completeness.' }
    }
}

function Add-Citation {
    param(
        [System.Collections.Generic.List[object]]$Citations,
        [System.Collections.Generic.HashSet[string]]$SourceSet,
        [string]$SourceId,
        [string]$Location,
        [string]$SnapshotDateKey,
        [string]$Detail
    )

    if ([string]::IsNullOrWhiteSpace($SourceId) -or [string]::IsNullOrWhiteSpace($Location)) {
        return
    }

    $dedupeKey = '{0}|{1}' -f $SourceId, $Location
    if (-not $SourceSet.Add($dedupeKey)) {
        return
    }

    $citation = [ordered]@{
        sourceId = $SourceId
        location = $Location
    }

    if (-not [string]::IsNullOrWhiteSpace($SnapshotDateKey)) {
        $citation.snapshotDateKey = $SnapshotDateKey
    }

    if (-not [string]::IsNullOrWhiteSpace($Detail)) {
        $citation.detail = $Detail
    }

    $Citations.Add([pscustomobject]$citation) | Out-Null
}

if (-not (Test-Path -LiteralPath $PatientInsightsPath)) {
    throw "Patient insights file not found: $PatientInsightsPath"
}

$rows = @(Import-Csv -LiteralPath $PatientInsightsPath)
if ($rows.Count -eq 0) {
    throw "Patient insights file has no rows: $PatientInsightsPath"
}

$censusByResident = @{}
if (Test-Path -LiteralPath $PccActiveCensusPath) {
    foreach ($row in @(Import-Csv -LiteralPath $PccActiveCensusPath)) {
        $residentId = [string]$row.ResidentSourceId
        if ([string]::IsNullOrWhiteSpace($residentId)) { continue }
        $censusByResident[$residentId] = $row
    }
}

$documentationByResident = @{}
if (Test-Path -LiteralPath $DocumentationQueuePath) {
    foreach ($row in @(Import-Csv -LiteralPath $DocumentationQueuePath)) {
        $residentId = [string]$row.ResidentSourceId
        if ([string]::IsNullOrWhiteSpace($residentId)) { continue }
        if (-not $documentationByResident.ContainsKey($residentId)) {
            $documentationByResident[$residentId] = [pscustomobject]@{
                Count = 0
                DueDate = ''
                Discipline = ''
            }
        }

        $bucket = $documentationByResident[$residentId]
        $bucket.Count++
        if ([string]::IsNullOrWhiteSpace([string]$bucket.DueDate) -and -not [string]::IsNullOrWhiteSpace([string]$row.DueDate)) {
            $bucket.DueDate = [string]$row.DueDate
        }
        if ([string]::IsNullOrWhiteSpace([string]$bucket.Discipline) -and -not [string]::IsNullOrWhiteSpace([string]$row.DisciplineCode)) {
            $bucket.Discipline = [string]$row.DisciplineCode
        }
    }
}

$therapyByResident = @{}
if (Test-Path -LiteralPath $TherapyCoveragePath) {
    foreach ($row in @(Import-Csv -LiteralPath $TherapyCoveragePath)) {
        $residentId = [string]$row.ResidentSourceId
        if ([string]::IsNullOrWhiteSpace($residentId)) { continue }
        if (-not $therapyByResident.ContainsKey($residentId)) {
            $therapyByResident[$residentId] = [pscustomobject]@{
                Count = 0
                TreatmentDate = ''
                Discipline = ''
            }
        }

        $bucket = $therapyByResident[$residentId]
        $bucket.Count++
        if ([string]::IsNullOrWhiteSpace([string]$bucket.TreatmentDate) -and -not [string]::IsNullOrWhiteSpace([string]$row.TreatmentDate)) {
            $bucket.TreatmentDate = [string]$row.TreatmentDate
        }
        if ([string]::IsNullOrWhiteSpace([string]$bucket.Discipline) -and -not [string]::IsNullOrWhiteSpace([string]$row.DisciplineCode)) {
            $bucket.Discipline = [string]$row.DisciplineCode
        }
    }
}

$vitalsByResident = @{}
if (Test-Path -LiteralPath $VitalsPath) {
    foreach ($row in @(Import-Csv -LiteralPath $VitalsPath)) {
        $residentId = Get-FirstTextValue -Row $row -PropertyNames @('ResidentSourceId', 'ResidentId', 'PatientId')
        if ([string]::IsNullOrWhiteSpace($residentId)) { continue }
        if (-not $vitalsByResident.ContainsKey($residentId)) {
            $vitalsByResident[$residentId] = $row
        }
    }
}

$generatedAt = (Get-Date).ToString('s')
$queue = foreach ($row in $rows) {
    $priorityBand = [string]$row.PriorityBand
    $progressLevel = [string]$row.ProgressLevel
    $overdue = Get-IntValue $row.OverdueDocCount
    $outstanding = Get-IntValue $row.OutstandingDocCount
    $priorityScore = Get-IntValue $row.PriorityScore
    $hasInsight = -not [string]::IsNullOrWhiteSpace([string]$row.CopilotAgentInsight)
    $residentId = [string]$row.ResidentSourceId
    $snapshotDateKey = [string]$row.SnapshotDateKey
    $expectedInsight = Get-ExpectedInsightForProgressLevel -ProgressLevel $progressLevel
    $insightRuleValidated = $hasInsight -and ([string]$row.CopilotAgentInsight -eq $expectedInsight)

    $citations = [System.Collections.Generic.List[object]]::new()
    $citationKeys = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)
    $objectiveSourceIds = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)

    Add-Citation -Citations $citations -SourceSet $citationKeys -SourceId 'command_center_patient_insights.csv' -Location ("ResidentSourceId:{0}" -f $residentId) -SnapshotDateKey $snapshotDateKey -Detail ([string]$row.InsightSummary)

    if ($censusByResident.ContainsKey($residentId)) {
        [void]$objectiveSourceIds.Add('pcc_resident_list_current.active-only.csv')
        Add-Citation -Citations $citations -SourceSet $citationKeys -SourceId 'pcc_resident_list_current.active-only.csv' -Location ("ResidentSourceId:{0}" -f $residentId) -SnapshotDateKey $snapshotDateKey -Detail ([string]$censusByResident[$residentId].ResidentName)
    }

    if ($documentationByResident.ContainsKey($residentId)) {
        $docBucket = $documentationByResident[$residentId]
        [void]$objectiveSourceIds.Add('command_center_documentation_queue.csv')
        $docDetail = '{0} doc item(s)' -f $docBucket.Count
        if ($docBucket.Discipline) { $docDetail = '{0}; discipline={1}' -f $docDetail, $docBucket.Discipline }
        if ($docBucket.DueDate) { $docDetail = '{0}; due={1}' -f $docDetail, $docBucket.DueDate }
        Add-Citation -Citations $citations -SourceSet $citationKeys -SourceId 'command_center_documentation_queue.csv' -Location ("ResidentSourceId:{0}" -f $residentId) -SnapshotDateKey $snapshotDateKey -Detail $docDetail
    }

    if ($therapyByResident.ContainsKey($residentId)) {
        $therapyBucket = $therapyByResident[$residentId]
        [void]$objectiveSourceIds.Add('command_center_therapy_coverage.csv')
        $therapyDetail = '{0} therapy line(s)' -f $therapyBucket.Count
        if ($therapyBucket.Discipline) { $therapyDetail = '{0}; discipline={1}' -f $therapyDetail, $therapyBucket.Discipline }
        if ($therapyBucket.TreatmentDate) { $therapyDetail = '{0}; lastTreatment={1}' -f $therapyDetail, $therapyBucket.TreatmentDate }
        Add-Citation -Citations $citations -SourceSet $citationKeys -SourceId 'command_center_therapy_coverage.csv' -Location ("ResidentSourceId:{0}" -f $residentId) -SnapshotDateKey $snapshotDateKey -Detail $therapyDetail
    }

    if ($vitalsByResident.ContainsKey($residentId) -or (Get-BoolValue $row.VitalsAvailable)) {
        [void]$objectiveSourceIds.Add('pcc_resident_vitals_current.csv')
        $vitalsLocation = "ResidentSourceId:$residentId"
        $vitalsDetail = [string]$row.VitalsSummary
        Add-Citation -Citations $citations -SourceSet $citationKeys -SourceId 'pcc_resident_vitals_current.csv' -Location $vitalsLocation -SnapshotDateKey $snapshotDateKey -Detail $vitalsDetail
    }

    $objectiveEvidenceCount = $objectiveSourceIds.Count
    $evidenceSources = @($objectiveSourceIds | Sort-Object)

    if (-not $hasInsight) {
        $groundednessStatus = 'NotAvailable'
        $verificationStatus = 'NotAvailable'
        $uncertaintyReason = 'No agent insight text was present for evidence evaluation.'
    }
    elseif (-not $insightRuleValidated) {
        $groundednessStatus = 'NotGrounded'
        $verificationStatus = 'Failed'
        $uncertaintyReason = "Insight text did not match the expected backend rule for ProgressLevel '$progressLevel'."
    }
    elseif ($objectiveEvidenceCount -ge 2) {
        $groundednessStatus = 'Grounded'
        $verificationStatus = 'Verified'
        $uncertaintyReason = ''
    }
    elseif ($objectiveEvidenceCount -eq 1) {
        $groundednessStatus = 'Grounded'
        $verificationStatus = 'NeedsReview'
        $uncertaintyReason = 'The insight matched the backend rule, but only one primary source record was attached for verification.'
    }
    else {
        $groundednessStatus = 'NeedsVerification'
        $verificationStatus = 'NeedsReview'
        $uncertaintyReason = 'The insight matched the backend rule, but no primary source records were attached for verification.'
    }

    $create = $false
    $reason = ''
    $owner = ''
    $severity = ''
    $sla = ''
    $channel = ''

    if ($progressLevel -eq 'At Risk' -or $priorityBand -eq 'High') {
        $create = $true
        $reason = 'High priority / at-risk patient signal'
        $owner = 'Clinical Supervisor'
        $severity = 'High'
        $sla = '15m'
        $channel = 'Urgent Clinical Escalation'
    }
    elseif ($overdue -gt 0) {
        $create = $true
        $reason = 'Overdue documentation'
        $owner = 'Unit Documentation Lead'
        $severity = 'Medium'
        $sla = '2h'
        $channel = 'Documentation Follow-up'
    }
    elseif ($outstanding -ge 3) {
        $create = $true
        $reason = 'Documentation pressure threshold reached'
        $owner = 'Unit Charge Nurse'
        $severity = 'Medium'
        $sla = '4h'
        $channel = 'Operational Follow-up'
    }

    if (-not $create) { continue }

    $ticketId = 'SNF-HO-{0}-{1}' -f $row.SnapshotDateKey, $row.ResidentSourceId
    [pscustomobject]@{
        SnapshotDateKey      = [string]$row.SnapshotDateKey
        HandoffTicketId      = $ticketId
        CreatedAtUtc         = $generatedAt
        Status               = 'Queued'
        Severity             = $severity
        SlaTarget            = $sla
        HandoffChannel       = $channel
        ResponsibleParty     = $owner
        ResidentSourceId     = $residentId
        ResidentName         = [string]$row.ResidentName
        UnitCode             = [string]$row.UnitCode
        RoomCode             = [string]$row.RoomCode
        PriorityScore        = $priorityScore
        PriorityBand         = $priorityBand
        ProgressLevel        = $progressLevel
        OutstandingDocCount  = $outstanding
        OverdueDocCount      = $overdue
        VitalsSummary        = [string]$row.VitalsSummary
        TriggerReason        = $reason
        CopilotAgentInsight  = [string]$row.CopilotAgentInsight
        Citations            = $citations | ConvertTo-Json -Compress
        GroundednessStatus   = $groundednessStatus
        VerificationStatus   = $verificationStatus
        UncertaintyReason    = $uncertaintyReason
        InsightRuleValidated = [string]$insightRuleValidated
        EvidenceSourceCount  = $objectiveEvidenceCount
        EvidenceSources      = ($evidenceSources -join ';')
        NextStep             = 'Auto-routed to responsible owner queue; confirm completion and close ticket.'
    }
}

$sorted = @(
    $queue |
        Sort-Object @{ Expression = { if ([string]$_.Severity -eq 'High') { 2 } else { 1 } }; Descending = $true },
                    @{ Expression = { Get-IntValue $_.PriorityScore }; Descending = $true },
                    ResidentName
)

$byUnit = @(
    $sorted |
        Group-Object UnitCode |
        ForEach-Object {
            $g = $_.Group
            [pscustomobject]@{
                SnapshotDateKey = if ($g.Count -gt 0) { [string]$g[0].SnapshotDateKey } else { '' }
                UnitCode = [string]$_.Name
                QueueCount = $g.Count
                HighSeverityCount = @($g | Where-Object { [string]$_.Severity -eq 'High' }).Count
                MediumSeverityCount = @($g | Where-Object { [string]$_.Severity -eq 'Medium' }).Count
            }
        } |
        Sort-Object UnitCode
)

$outDir = Split-Path -Parent $OutputPath
if ($outDir -and -not (Test-Path -LiteralPath $outDir)) {
    New-Item -ItemType Directory -Path $outDir -Force | Out-Null
}

$sorted | Export-Csv -LiteralPath $OutputPath -NoTypeInformation -Encoding UTF8
$byUnit | Export-Csv -LiteralPath $UnitSummaryPath -NoTypeInformation -Encoding UTF8

Write-Host "Automated handoff queue written to: $OutputPath"
Write-Host "Rows: $($sorted.Count)"
Write-Host "Verified rows: $(@($sorted | Where-Object { [string]$_.VerificationStatus -eq 'Verified' }).Count)"
Write-Host "Unit summary written to: $UnitSummaryPath"

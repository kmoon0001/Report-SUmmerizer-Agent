param(
    [string]$PccActiveCensusPath = 'D:\SNF AI Dashboard\data\processed\pcc_resident_list_current.active-only.csv',
    [string]$DocumentationQueuePath = 'D:\SNF AI Dashboard\data\processed\command_center_documentation_queue.csv',
    [string]$TherapyCoveragePath = 'D:\SNF AI Dashboard\data\processed\command_center_therapy_coverage.csv',
    [string]$PriorityQueuePath = 'D:\SNF AI Dashboard\data\processed\command_center_therapy_documentation_priority.csv',
    [string]$VitalsPath = 'D:\SNF AI Dashboard\data\processed\pcc_resident_vitals_current.csv',
    [string]$ScoringConfigPath = 'D:\SNF AI Dashboard\contracts\patient-insight-scoring.json',
    [string]$OutputPath = 'D:\SNF AI Dashboard\data\processed\command_center_patient_insights.csv'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Get-IntValue {
    param($Value)
    $parsed = 0
    if ([int]::TryParse([string]$Value, [ref]$parsed)) { return $parsed }
    return 0
}

function Get-DoubleValue {
    param($Value)
    $parsed = 0.0
    if ([double]::TryParse([string]$Value, [ref]$parsed)) { return $parsed }
    return 0.0
}

function Get-FirstTextValue {
    param(
        [psobject]$Row,
        [string[]]$PropertyNames
    )
    foreach ($name in $PropertyNames) {
        if ($Row.PSObject.Properties.Name -contains $name) {
            $text = ([string]$Row.$name).Trim()
            if ($text) { return $text }
        }
    }
    return ''
}

function Get-ConfigInt {
    param(
        [hashtable]$Map,
        [string]$Key,
        [int]$DefaultValue
    )
    if ($null -eq $Map -or -not $Map.ContainsKey($Key)) { return $DefaultValue }
    return Get-IntValue $Map[$Key]
}

function ConvertTo-LocalHashtable {
    param($InputObject)
    if ($null -eq $InputObject) { return $null }
    if ($InputObject -is [hashtable]) { return $InputObject }
    if ($InputObject -is [ValueType]) { return $InputObject }
    if ($InputObject -is [System.Collections.IDictionary]) {
        $map = @{}
        foreach ($key in $InputObject.Keys) {
            $map[[string]$key] = ConvertTo-LocalHashtable -InputObject $InputObject[$key]
        }
        return $map
    }
    if ($InputObject -is [psobject]) {
        $props = @($InputObject.PSObject.Properties | Where-Object { $_.MemberType -eq 'NoteProperty' -or $_.MemberType -eq 'Property' })
        $map = @{}
        foreach ($prop in $props) {
            $map[$prop.Name] = ConvertTo-LocalHashtable -InputObject $prop.Value
        }
        if ($map.Count -gt 0) { return $map }
    }
    if ($InputObject -is [System.Collections.IEnumerable] -and -not ($InputObject -is [string])) {
        $items = @()
        foreach ($item in $InputObject) {
            $items += ,(ConvertTo-LocalHashtable -InputObject $item)
        }
        return $items
    }
    return $InputObject
}

if (-not (Test-Path -LiteralPath $PccActiveCensusPath)) {
    throw "PCC active census file not found: $PccActiveCensusPath"
}

$pccRows = @(Import-Csv -LiteralPath $PccActiveCensusPath)
if ($pccRows.Count -eq 0) {
    throw "PCC active census file has no rows: $PccActiveCensusPath"
}

$docRows = @()
if (Test-Path -LiteralPath $DocumentationQueuePath) {
    $docRows = @(Import-Csv -LiteralPath $DocumentationQueuePath)
}

$therapyRows = @()
if (Test-Path -LiteralPath $TherapyCoveragePath) {
    $therapyRows = @(Import-Csv -LiteralPath $TherapyCoveragePath)
}

$priorityRows = @()
if (Test-Path -LiteralPath $PriorityQueuePath) {
    $priorityRows = @(Import-Csv -LiteralPath $PriorityQueuePath)
}

$vitalsRows = @()
if (Test-Path -LiteralPath $VitalsPath) {
    $vitalsRows = @(Import-Csv -LiteralPath $VitalsPath)
}

$scoringConfig = @{}
if (Test-Path -LiteralPath $ScoringConfigPath) {
    $rawScoringConfig = Get-Content -LiteralPath $ScoringConfigPath -Raw | ConvertFrom-Json
    $scoringConfig = ConvertTo-LocalHashtable -InputObject $rawScoringConfig
}

$priorityBands = if ($scoringConfig.ContainsKey('priorityBands')) { $scoringConfig['priorityBands'] } else { @{} }
$progressRules = if ($scoringConfig.ContainsKey('progressRules')) { $scoringConfig['progressRules'] } else { @{} }
$watchOutRules = if ($scoringConfig.ContainsKey('watchOutRules')) { $scoringConfig['watchOutRules'] } else { @{} }
$watchVitals = if ($watchOutRules.ContainsKey('vitals')) { $watchOutRules['vitals'] } else { @{} }

$priorityHighMin = Get-ConfigInt -Map $priorityBands -Key 'highMin' -DefaultValue 14
$priorityMediumMin = Get-ConfigInt -Map $priorityBands -Key 'mediumMin' -DefaultValue 10
$priorityLowMin = Get-ConfigInt -Map $priorityBands -Key 'lowMin' -DefaultValue 1

$advancingMinTherapyMinutes = Get-ConfigInt -Map $(if ($progressRules.ContainsKey('advancing')) { $progressRules['advancing'] } else { @{} }) -Key 'minTherapyMinutes' -DefaultValue 180
$advancingMaxOverdueDocs = Get-ConfigInt -Map $(if ($progressRules.ContainsKey('advancing')) { $progressRules['advancing'] } else { @{} }) -Key 'maxOverdueDocs' -DefaultValue 0
$stableMinTherapyMinutes = Get-ConfigInt -Map $(if ($progressRules.ContainsKey('stable')) { $progressRules['stable'] } else { @{} }) -Key 'minTherapyMinutes' -DefaultValue 1
$stableMaxOverdueDocs = Get-ConfigInt -Map $(if ($progressRules.ContainsKey('stable')) { $progressRules['stable'] } else { @{} }) -Key 'maxOverdueDocs' -DefaultValue 1
$atRiskMinOverdueDocs = Get-ConfigInt -Map $(if ($progressRules.ContainsKey('atRisk')) { $progressRules['atRisk'] } else { @{} }) -Key 'minOverdueDocs' -DefaultValue 2
$atRiskMinPriorityScore = Get-ConfigInt -Map $(if ($progressRules.ContainsKey('atRisk')) { $progressRules['atRisk'] } else { @{} }) -Key 'minPriorityScore' -DefaultValue 14

$highOutstandingDocsMin = Get-ConfigInt -Map $watchOutRules -Key 'highOutstandingDocsMin' -DefaultValue 3
$staleTherapyDaysMin = Get-ConfigInt -Map $watchOutRules -Key 'staleTherapyDaysMin' -DefaultValue 3
$newAdmissionDaysMax = Get-ConfigInt -Map $watchOutRules -Key 'newAdmissionDaysMax' -DefaultValue 7

$systolicBpHighMin = Get-ConfigInt -Map $watchVitals -Key 'systolicBpHighMin' -DefaultValue 180
$systolicBpLowMax = Get-ConfigInt -Map $watchVitals -Key 'systolicBpLowMax' -DefaultValue 89
$spo2LowMax = Get-ConfigInt -Map $watchVitals -Key 'spo2LowMax' -DefaultValue 91
$temperatureHighMinF = Get-DoubleValue $(if ($watchVitals.ContainsKey('temperatureHighMinF')) { $watchVitals['temperatureHighMinF'] } else { 100.4 })
$temperatureLowMaxF = Get-DoubleValue $(if ($watchVitals.ContainsKey('temperatureLowMaxF')) { $watchVitals['temperatureLowMaxF'] } else { 96.8 })

$docByResident = @{}
foreach ($row in $docRows) {
    $residentId = [string]$row.ResidentSourceId
    if ([string]::IsNullOrWhiteSpace($residentId)) { continue }
    if (-not $docByResident.ContainsKey($residentId)) {
        $docByResident[$residentId] = [pscustomobject]@{
            Total = 0
            Outstanding = 0
            Overdue = 0
            Disciplines = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)
            NextDueDate = $null
        }
    }

    $bucket = $docByResident[$residentId]
    $bucket.Total++
    if ([string]$row.IsOutstanding -in @('True', 'true')) {
        $bucket.Outstanding++
    }
    if ([string]$row.DocumentationStatus -eq 'Overdue') {
        $bucket.Overdue++
    }

    $discipline = ([string]$row.DisciplineCode).Trim()
    if ($discipline) { [void]$bucket.Disciplines.Add($discipline) }

    $dueDateText = ([string]$row.DueDate).Trim()
    if ($dueDateText) {
        $dueDate = [datetime]$dueDateText
        if ($null -eq $bucket.NextDueDate -or $dueDate -lt $bucket.NextDueDate) {
            $bucket.NextDueDate = $dueDate
        }
    }
}

$therapyByResident = @{}
foreach ($row in $therapyRows) {
    $residentId = [string]$row.ResidentSourceId
    if ([string]::IsNullOrWhiteSpace($residentId)) { continue }
    if (-not $therapyByResident.ContainsKey($residentId)) {
        $therapyByResident[$residentId] = [pscustomobject]@{
            LineCount = 0
            Minutes = 0
            Disciplines = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)
            LastTreatmentDate = $null
            ClinicianCounts = @{}
        }
    }

    $bucket = $therapyByResident[$residentId]
    $bucket.LineCount++
    $bucket.Minutes += Get-IntValue $row.Minutes

    $discipline = ([string]$row.DisciplineCode).Trim()
    if ($discipline) { [void]$bucket.Disciplines.Add($discipline) }

    $treatmentDateText = ([string]$row.TreatmentDate).Trim()
    if ($treatmentDateText) {
        $treatmentDate = [datetime]$treatmentDateText
        if ($null -eq $bucket.LastTreatmentDate -or $treatmentDate -gt $bucket.LastTreatmentDate) {
            $bucket.LastTreatmentDate = $treatmentDate
        }
    }

    $clinician = ([string]$row.ClinicianName).Trim()
    if ($clinician) {
        if (-not $bucket.ClinicianCounts.ContainsKey($clinician)) {
            $bucket.ClinicianCounts[$clinician] = 0
        }
        $bucket.ClinicianCounts[$clinician]++
    }
}

$priorityByResident = @{}
foreach ($row in $priorityRows) {
    $residentId = [string]$row.ResidentSourceId
    if ([string]::IsNullOrWhiteSpace($residentId)) { continue }
    $priorityByResident[$residentId] = [pscustomobject]@{
        PriorityScore = Get-IntValue $row.PriorityScore
        OutstandingDocCount = Get-IntValue $row.OutstandingDocCount
        OverdueDocCount = Get-IntValue $row.OverdueDocCount
    }
}

$vitalsByResident = @{}
foreach ($row in $vitalsRows) {
    $residentId = [string](Get-FirstTextValue -Row $row -PropertyNames @('ResidentSourceId', 'ResidentId', 'PatientId'))
    if ([string]::IsNullOrWhiteSpace($residentId)) { continue }

    $observedText = Get-FirstTextValue -Row $row -PropertyNames @('ObservedAt', 'ObservationDateTime', 'RecordedAt', 'TakenAt', 'SnapshotDateTime', 'ObservationDate')
    $observedAt = $null
    if ($observedText) {
        try { $observedAt = [datetime]$observedText } catch { $observedAt = $null }
    }

    if (-not $vitalsByResident.ContainsKey($residentId)) {
        $vitalsByResident[$residentId] = [pscustomobject]@{
            ObservedAt = $observedAt
            HeartRate = Get-FirstTextValue -Row $row -PropertyNames @('HeartRate', 'Pulse')
            SystolicBP = Get-FirstTextValue -Row $row -PropertyNames @('SystolicBP', 'BloodPressureSystolic')
            DiastolicBP = Get-FirstTextValue -Row $row -PropertyNames @('DiastolicBP', 'BloodPressureDiastolic')
            RespiratoryRate = Get-FirstTextValue -Row $row -PropertyNames @('RespiratoryRate', 'RespRate')
            TemperatureF = Get-FirstTextValue -Row $row -PropertyNames @('TemperatureF', 'Temperature')
            SpO2Percent = Get-FirstTextValue -Row $row -PropertyNames @('SpO2Percent', 'SpO2', 'OxygenSaturation')
            WeightLbs = Get-FirstTextValue -Row $row -PropertyNames @('WeightLbs', 'Weight')
            PainScore = Get-FirstTextValue -Row $row -PropertyNames @('PainScore', 'Pain')
        }
        continue
    }

    $current = $vitalsByResident[$residentId]
    $replace = $false
    if ($null -ne $observedAt) {
        if ($null -eq $current.ObservedAt -or $observedAt -gt $current.ObservedAt) {
            $replace = $true
        }
    }

    if ($replace) {
        $vitalsByResident[$residentId] = [pscustomobject]@{
            ObservedAt = $observedAt
            HeartRate = Get-FirstTextValue -Row $row -PropertyNames @('HeartRate', 'Pulse')
            SystolicBP = Get-FirstTextValue -Row $row -PropertyNames @('SystolicBP', 'BloodPressureSystolic')
            DiastolicBP = Get-FirstTextValue -Row $row -PropertyNames @('DiastolicBP', 'BloodPressureDiastolic')
            RespiratoryRate = Get-FirstTextValue -Row $row -PropertyNames @('RespiratoryRate', 'RespRate')
            TemperatureF = Get-FirstTextValue -Row $row -PropertyNames @('TemperatureF', 'Temperature')
            SpO2Percent = Get-FirstTextValue -Row $row -PropertyNames @('SpO2Percent', 'SpO2', 'OxygenSaturation')
            WeightLbs = Get-FirstTextValue -Row $row -PropertyNames @('WeightLbs', 'Weight')
            PainScore = Get-FirstTextValue -Row $row -PropertyNames @('PainScore', 'Pain')
        }
    }
}

$snapshotDateKey = [string]$pccRows[0].SnapshotDateKey
$snapshotDate = $null
try {
    $snapshotDate = [datetime]::ParseExact($snapshotDateKey, 'yyyyMMdd', [System.Globalization.CultureInfo]::InvariantCulture)
}
catch {
    $snapshotDate = Get-Date
}

$insights = foreach ($resident in $pccRows) {
    $residentId = [string]$resident.ResidentSourceId
    $doc = if ($docByResident.ContainsKey($residentId)) { $docByResident[$residentId] } else { $null }
    $therapy = if ($therapyByResident.ContainsKey($residentId)) { $therapyByResident[$residentId] } else { $null }
    $priority = if ($priorityByResident.ContainsKey($residentId)) { $priorityByResident[$residentId] } else { $null }
    $vitals = if ($vitalsByResident.ContainsKey($residentId)) { $vitalsByResident[$residentId] } else { $null }

    $docDisciplines = if ($null -ne $doc) { @($doc.Disciplines | Sort-Object) -join ', ' } else { '' }
    $therapyDisciplines = if ($null -ne $therapy) { @($therapy.Disciplines | Sort-Object) -join ', ' } else { '' }

    $primaryClinician = ''
    if ($null -ne $therapy -and $therapy.ClinicianCounts.Keys.Count -gt 0) {
        $primaryClinician = ($therapy.ClinicianCounts.GetEnumerator() | Sort-Object Value -Descending | Select-Object -First 1).Key
    }

    $priorityScore = if ($null -ne $priority) { $priority.PriorityScore } else { 0 }
    $outstandingCount = if ($null -ne $doc) { $doc.Outstanding } else { 0 }
    $overdueCount = if ($null -ne $doc) { $doc.Overdue } else { 0 }
    $therapyMinutes = if ($null -ne $therapy) { $therapy.Minutes } else { 0 }
    $daysSinceLastTherapy = $null
    if ($null -ne $therapy -and $null -ne $therapy.LastTreatmentDate) {
        $daysSinceLastTherapy = [int]([TimeSpan]($snapshotDate.Date - $therapy.LastTreatmentDate.Date)).TotalDays
    }
    $admissionDate = $null
    try {
        $admissionDate = [datetime]$resident.AdmissionDate
    }
    catch {
        $admissionDate = $null
    }
    $daysSinceAdmission = if ($null -ne $admissionDate) { [int]([TimeSpan]($snapshotDate.Date - $admissionDate.Date)).TotalDays } else { -1 }

    $priorityBand = if ($priorityScore -ge $priorityHighMin) {
        'High'
    } elseif ($priorityScore -ge $priorityMediumMin) {
        'Medium'
    } elseif ($priorityScore -ge $priorityLowMin) {
        'Low'
    } else {
        'Watch'
    }

    $insightSummary = if ($therapyMinutes -gt 0 -and $outstandingCount -gt 0) {
        "Therapy active ($therapyMinutes min) with $outstandingCount outstanding documentation item(s)."
    } elseif ($therapyMinutes -gt 0) {
        "Therapy active ($therapyMinutes min) and documentation currently controlled."
    } elseif ($outstandingCount -gt 0) {
        "$outstandingCount outstanding documentation item(s) with no current therapy lines."
    } else {
        'No active therapy or outstanding documentation signals.'
    }

    $vitalsSummary = 'Not available'
    if ($null -ne $vitals) {
        $vitalParts = [System.Collections.Generic.List[string]]::new()
        if ($vitals.SystolicBP -and $vitals.DiastolicBP) { $vitalParts.Add("BP $($vitals.SystolicBP)/$($vitals.DiastolicBP)") }
        if ($vitals.HeartRate) { $vitalParts.Add("HR $($vitals.HeartRate)") }
        if ($vitals.SpO2Percent) { $vitalParts.Add("SpO2 $($vitals.SpO2Percent)%") }
        if ($vitals.TemperatureF) { $vitalParts.Add("Temp $($vitals.TemperatureF)F") }
        if ($vitals.RespiratoryRate) { $vitalParts.Add("RR $($vitals.RespiratoryRate)") }
        if ($vitals.PainScore) { $vitalParts.Add("Pain $($vitals.PainScore)") }
        if ($vitals.WeightLbs) { $vitalParts.Add("Wt $($vitals.WeightLbs)lb") }
        if ($vitalParts.Count -gt 0) {
            $vitalsSummary = $vitalParts -join ', '
        }
    }

    $progressLevel = if ($therapyMinutes -ge $advancingMinTherapyMinutes -and $overdueCount -le $advancingMaxOverdueDocs) {
        'Advancing'
    } elseif ($therapyMinutes -ge $stableMinTherapyMinutes -and $overdueCount -le $stableMaxOverdueDocs) {
        'Stable'
    } elseif ($overdueCount -ge $atRiskMinOverdueDocs -or $priorityScore -ge $atRiskMinPriorityScore) {
        'At Risk'
    } else {
        'Monitor'
    }

    $watchOutList = [System.Collections.Generic.List[string]]::new()
    if ($overdueCount -gt 0) { $watchOutList.Add("$overdueCount overdue documentation item(s)") }
    if ($outstandingCount -ge $highOutstandingDocsMin) { $watchOutList.Add("$outstandingCount outstanding documentation item(s)") }
    if ($therapyMinutes -eq 0 -and $outstandingCount -gt 0) { $watchOutList.Add('Outstanding documentation with no current therapy activity') }
    if ($null -ne $daysSinceLastTherapy -and $daysSinceLastTherapy -gt $staleTherapyDaysMin -and $therapyMinutes -gt 0) { $watchOutList.Add("No recent therapy entry in $daysSinceLastTherapy days") }
    if ($daysSinceAdmission -ge 0 -and $daysSinceAdmission -le $newAdmissionDaysMax) { $watchOutList.Add("New admission ($daysSinceAdmission day(s))") }

    if ($null -ne $vitals) {
        $systolic = Get-DoubleValue $vitals.SystolicBP
        $spo2 = Get-DoubleValue $vitals.SpO2Percent
        $temp = Get-DoubleValue $vitals.TemperatureF
        if ($systolic -gt 0 -and ($systolic -ge $systolicBpHighMin -or $systolic -le $systolicBpLowMax)) { $watchOutList.Add("BP systolic out-of-range ($systolic)") }
        if ($spo2 -gt 0 -and $spo2 -le $spo2LowMax) { $watchOutList.Add("Low oxygen saturation ($spo2%)") }
        if ($temp -gt 0 -and ($temp -ge $temperatureHighMinF -or $temp -le $temperatureLowMaxF)) { $watchOutList.Add("Temperature out-of-range ($temp F)") }
    }

    $thingsToLookOutFor = if ($watchOutList.Count -gt 0) { $watchOutList -join '; ' } else { 'No immediate high-risk signals from current sources' }

    $copilotAgentInsight = if ($progressLevel -eq 'At Risk') {
        'Escalate now: clear overdue docs, verify therapy continuity, and perform same-shift clinical review.'
    } elseif ($progressLevel -eq 'Monitor') {
        'Monitor: verify next due documentation date and reassess if no new therapy or documentation updates post-shift.'
    } elseif ($progressLevel -eq 'Stable') {
        'Maintain current plan: keep documentation current and confirm next therapy sessions stay on schedule.'
    } else {
        'Maintain momentum: continue current therapy cadence and preserve documentation completeness.'
    }

    [pscustomobject]@{
        SnapshotDateKey = $snapshotDateKey
        ResidentSourceId = $residentId
        ResidentName = [string]$resident.ResidentName
        ResidentDisplayName = [string]$resident.ResidentDisplayName
        UnitCode = [string]$resident.UnitCode
        RoomCode = [string]$resident.RoomCode
        BedCode = [string]$resident.BedCode
        AgeYears = [string]$resident.AgeYears
        AdmissionDate = [string]$resident.AdmissionDate
        HasDocumentationItems = [string]($null -ne $doc)
        DocumentationItemCount = if ($null -ne $doc) { $doc.Total } else { 0 }
        OutstandingDocCount = $outstandingCount
        OverdueDocCount = $overdueCount
        DocumentationDisciplines = $docDisciplines
        NextDocumentationDueDate = if ($null -ne $doc -and $null -ne $doc.NextDueDate) { $doc.NextDueDate.ToString('yyyy-MM-dd') } else { '' }
        HasTherapy = [string]($null -ne $therapy)
        TherapyLineCount = if ($null -ne $therapy) { $therapy.LineCount } else { 0 }
        TherapyMinutes = $therapyMinutes
        TherapyDisciplines = $therapyDisciplines
        LastTherapyDate = if ($null -ne $therapy -and $null -ne $therapy.LastTreatmentDate) { $therapy.LastTreatmentDate.ToString('yyyy-MM-dd') } else { '' }
        DaysSinceLastTherapy = if ($null -ne $daysSinceLastTherapy) { $daysSinceLastTherapy } else { '' }
        PrimaryTherapyClinician = $primaryClinician
        VitalsAvailable = [string]($null -ne $vitals)
        VitalsObservedAt = if ($null -ne $vitals -and $null -ne $vitals.ObservedAt) { $vitals.ObservedAt.ToString('s') } else { '' }
        HeartRate = if ($null -ne $vitals) { [string]$vitals.HeartRate } else { '' }
        SystolicBP = if ($null -ne $vitals) { [string]$vitals.SystolicBP } else { '' }
        DiastolicBP = if ($null -ne $vitals) { [string]$vitals.DiastolicBP } else { '' }
        RespiratoryRate = if ($null -ne $vitals) { [string]$vitals.RespiratoryRate } else { '' }
        TemperatureF = if ($null -ne $vitals) { [string]$vitals.TemperatureF } else { '' }
        SpO2Percent = if ($null -ne $vitals) { [string]$vitals.SpO2Percent } else { '' }
        WeightLbs = if ($null -ne $vitals) { [string]$vitals.WeightLbs } else { '' }
        PainScore = if ($null -ne $vitals) { [string]$vitals.PainScore } else { '' }
        VitalsSummary = $vitalsSummary
        DaysSinceAdmission = if ($daysSinceAdmission -ge 0) { $daysSinceAdmission } else { '' }
        PriorityScore = $priorityScore
        PriorityBand = $priorityBand
        ProgressLevel = $progressLevel
        ThingsToLookOutFor = $thingsToLookOutFor
        CopilotAgentInsight = $copilotAgentInsight
        InsightSummary = $insightSummary
    }
}

$sorted = @(
    $insights |
        Sort-Object @{ Expression = { Get-IntValue $_.PriorityScore }; Descending = $true },
                    @{ Expression = { Get-IntValue $_.OutstandingDocCount }; Descending = $true },
                    @{ Expression = { Get-IntValue $_.TherapyMinutes }; Descending = $true },
                    ResidentName
)

$outputDir = Split-Path -Parent $OutputPath
if ($outputDir -and -not (Test-Path -LiteralPath $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
}

$sorted | Export-Csv -LiteralPath $OutputPath -NoTypeInformation -Encoding UTF8
Write-Host "Command center patient insights written to: $OutputPath"
Write-Host "Rows: $($sorted.Count)"

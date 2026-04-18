param(
    [string]$PccActiveCensusPath = 'D:\SNF AI Dashboard\data\processed\pcc_resident_list_current.active-only.csv',
    [string]$DocumentationResolvedPath = 'D:\SNF AI Dashboard\data\processed\nethealth_documentation_due_dates.resolved.csv',
    [string]$DocumentationQueuePath = 'D:\SNF AI Dashboard\data\processed\command_center_documentation_queue.csv',
    [string]$DocumentationQueueByUnitPath = 'D:\SNF AI Dashboard\data\processed\command_center_documentation_queue.by-unit.csv',
    [string]$TherapyInputPath = 'D:\SNF AI Dashboard\data\incoming\nethealth_therapy_census.csv',
    [string]$VitalsInputPath = 'D:\SNF AI Dashboard\data\incoming\pcc_resident_vitals.csv',
    [string]$VitalsCurrentPath = 'D:\SNF AI Dashboard\data\processed\pcc_resident_vitals_current.csv',
    [string]$VitalsQualityReportPath = 'D:\SNF AI Dashboard\data\processed\pcc_resident_vitals_current.quality-report.md',
    [string]$TherapyCoveragePath = 'D:\SNF AI Dashboard\data\processed\command_center_therapy_coverage.csv',
    [string]$TherapyCoverageByUnitPath = 'D:\SNF AI Dashboard\data\processed\command_center_therapy_coverage.by-unit.csv',
    [string]$PriorityQueuePath = 'D:\SNF AI Dashboard\data\processed\command_center_therapy_documentation_priority.csv',
    [string]$PriorityQueueByUnitPath = 'D:\SNF AI Dashboard\data\processed\command_center_therapy_documentation_priority.by-unit.csv',
    [string]$PatientInsightsPath = 'D:\SNF AI Dashboard\data\processed\command_center_patient_insights.csv',
    [string]$ShapExplanationsPath = 'D:\SNF AI Dashboard\data\processed\command_center_shap_explanations.csv',
    [string]$ShapFeatureImportancePath = 'D:\SNF AI Dashboard\data\processed\command_center_shap_feature_importance.csv',
    [string]$ShapSummaryPath = 'D:\SNF AI Dashboard\data\processed\command_center_shap_summary.md',
    [string]$AutomatedHandoffQueuePath = 'D:\SNF AI Dashboard\data\processed\command_center_automated_handoff_queue.csv',
    [string]$AutomatedHandoffQueueByUnitPath = 'D:\SNF AI Dashboard\data\processed\command_center_automated_handoff_queue.by-unit.csv',
    [string]$AutomatedHandoffDispatchLogPath = 'D:\SNF AI Dashboard\data\processed\command_center_automated_handoff_dispatch_log.csv',
    [string]$AutomatedHandoffDispatchSummaryPath = 'D:\SNF AI Dashboard\data\processed\command_center_automated_handoff_dispatch_summary.md',
    [string]$AutomatedHandoffByStatusPath = 'D:\SNF AI Dashboard\data\processed\command_center_automated_handoff_queue.by-status.csv',
    [string]$AutomatedHandoffLifecycleSummaryPath = 'D:\SNF AI Dashboard\data\processed\command_center_automated_handoff_lifecycle_summary.md',
    [string]$ExecutiveUnitSnapshotPath = 'D:\SNF AI Dashboard\data\processed\command_center_executive_unit_snapshot.csv',
    [string]$OperationalSummaryPath = 'D:\SNF AI Dashboard\data\processed\command_center_operational_summary.md',
    [string]$RunLogPath = 'D:\SNF AI Dashboard\data\processed\command_center_cross_source_runlog.json',
    [string]$LockPath = 'D:\SNF AI Dashboard\data\processed\command_center_cross_source.lock',
    [string]$CheckpointPath = 'D:\SNF AI Dashboard\data\processed\command_center_cross_source.checkpoint.json',
    [int]$CheckpointCorruptKeepLatest = 5,
    [int]$CheckpointCorruptKeepDays = 14,
    [switch]$ResumeFromCheckpoint = $true,
    [switch]$SkipSecretHygieneScan = $false,
    [switch]$ResetMissingOptionalOutputs = $true,
    [switch]$StrictTherapy = $false,
    [switch]$SkipAutomatedHandoffDispatch = $false
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
. 'D:\SNF AI Dashboard\scripts\CommandCenterRuntime.ps1'

$runLog = New-CommandCenterRunLog
$lockAcquired = $false

try {
    Enter-CommandCenterRunLock -LockPath $LockPath
    $lockAcquired = $true
    Add-CommandCenterRunEvent -RunLog $runLog -Step 'Run Lock' -Status 'PASS' -Message 'Run lock acquired.' -ArtifactPath $LockPath

    $checkpoint = Initialize-CommandCenterCheckpoint -CheckpointPath $CheckpointPath
    Add-CommandCenterRunEvent -RunLog $runLog -Step 'Checkpoint' -Status 'INFO' -Message 'Checkpoint initialized.' -ArtifactPath $CheckpointPath
    $removedBackups = Remove-CommandCenterCheckpointCorruptBackups `
        -CheckpointPath $CheckpointPath `
        -KeepLatest $CheckpointCorruptKeepLatest `
        -KeepDays $CheckpointCorruptKeepDays `
        -RunLog $runLog
    Add-CommandCenterRunEvent -RunLog $runLog -Step 'Checkpoint Cleanup' -Status 'INFO' -Message "Corrupt backup cleanup complete. Removed $removedBackups file(s)."

    function Invoke-TrackedStep {
        param(
            [string]$Step,
            [scriptblock]$Action,
            [switch]$Optional
        )

        if ($ResumeFromCheckpoint -and (Test-CommandCenterCheckpointStepCompleted -Checkpoint $checkpoint -Step $Step)) {
            Add-CommandCenterRunEvent -RunLog $runLog -Step $Step -Status 'INFO' -Message 'Skipped because checkpoint marks this step complete.'
            return $true
        }

        $result = Invoke-CommandCenterStep -RunLog $runLog -Step $Step -Action $Action -Optional:$Optional
        if ($result) {
            Set-CommandCenterCheckpointStep -Checkpoint $checkpoint -Step $Step -Completed $true
            Save-CommandCenterCheckpoint -Checkpoint $checkpoint -CheckpointPath $CheckpointPath
        }

        return $result
    }

    Invoke-TrackedStep -Step 'Source Schema Validation' -Action {
        & 'D:\SNF AI Dashboard\scripts\Test-CommandCenterSourceSchemas.ps1'
    } | Out-Null

    if ($SkipSecretHygieneScan) {
        Add-CommandCenterRunEvent -RunLog $runLog -Step 'Secret Hygiene Scan' -Status 'WARN' -Message 'Secret hygiene scan skipped by parameter.'
    }
    else {
        Invoke-TrackedStep -Step 'Secret Hygiene Scan' -Action {
            & 'D:\SNF AI Dashboard\scripts\Test-RepositorySecretHygiene.ps1'
        } | Out-Null
    }

    if (-not (Test-Path -LiteralPath $PccActiveCensusPath)) {
        Add-CommandCenterRunEvent -RunLog $runLog -Step 'PCC Census' -Status 'FAIL' -Message 'PCC active census file is missing.' -ArtifactPath $PccActiveCensusPath
        throw "PCC active census file not found: $PccActiveCensusPath"
    }
    Add-CommandCenterRunEvent -RunLog $runLog -Step 'PCC Census' -Status 'PASS' -Message 'PCC active census file found.' -ArtifactPath $PccActiveCensusPath

    if (Test-Path -LiteralPath $DocumentationResolvedPath) {
        Invoke-TrackedStep -Step 'Documentation Queue Build' -Action {
            & 'D:\SNF AI Dashboard\scripts\New-CommandCenterDocumentationQueue.ps1' `
                -ResolvedDocumentationPath $DocumentationResolvedPath `
                -OutputPath $DocumentationQueuePath `
                -UnitSummaryPath $DocumentationQueueByUnitPath
        } | Out-Null
    }
    elseif (-not (Test-Path -LiteralPath $DocumentationQueuePath)) {
        Add-CommandCenterRunEvent -RunLog $runLog -Step 'Documentation Queue Build' -Status 'FAIL' -Message 'Neither resolved documentation nor documentation queue file exists.'
        throw "Neither resolved documentation nor documentation queue file exists."
    }
    else {
        Add-CommandCenterRunEvent -RunLog $runLog -Step 'Documentation Queue Build' -Status 'WARN' -Message 'Using existing documentation queue because resolved documentation input was not present.' -ArtifactPath $DocumentationQueuePath
    }

    if (Test-Path -LiteralPath $TherapyInputPath) {
        $therapySucceeded = Invoke-TrackedStep -Step 'Therapy Pipeline' -Optional:(-not $StrictTherapy) -Action {
            & 'D:\SNF AI Dashboard\scripts\Invoke-NetHealthTherapyPipeline.ps1' `
                -InputPath $TherapyInputPath `
                -CoveragePath $TherapyCoveragePath `
                -CoverageByUnitPath $TherapyCoverageByUnitPath `
                -PccCensusPath $PccActiveCensusPath
        }

        if (-not $therapySucceeded) {
            Remove-CommandCenterArtifacts -Paths @($TherapyCoveragePath, $TherapyCoverageByUnitPath, $PriorityQueuePath, $PriorityQueueByUnitPath) -RunLog $runLog -Step 'Therapy Cleanup'
        }
    }
    elseif ($ResetMissingOptionalOutputs) {
        Add-CommandCenterRunEvent -RunLog $runLog -Step 'Therapy Pipeline' -Status 'WARN' -Message 'Therapy input file not present. Removing optional therapy and priority artifacts.'
        Remove-CommandCenterArtifacts -Paths @($TherapyCoveragePath, $TherapyCoverageByUnitPath, $PriorityQueuePath, $PriorityQueueByUnitPath) -RunLog $runLog -Step 'Therapy Cleanup'
    }
    else {
        Add-CommandCenterRunEvent -RunLog $runLog -Step 'Therapy Pipeline' -Status 'WARN' -Message 'Therapy input file not present. Existing optional artifacts were left unchanged.'
    }

    if (Test-Path -LiteralPath $VitalsInputPath) {
        $vitalsSucceeded = Invoke-TrackedStep -Step 'Vitals Normalize' -Optional -Action {
            & 'D:\SNF AI Dashboard\scripts\Convert-PccResidentVitalsToNormalizedCsv.ps1' `
                -InputPath $VitalsInputPath `
                -PccActiveCensusPath $PccActiveCensusPath `
                -OutputPath $VitalsCurrentPath `
                -QualityReportPath $VitalsQualityReportPath
            & 'D:\SNF AI Dashboard\scripts\Test-PccResidentVitalsNormalizedCsv.ps1' `
                -Path $VitalsCurrentPath | Out-Null
        }

        if (-not $vitalsSucceeded) {
            Remove-CommandCenterArtifacts -Paths @($VitalsCurrentPath, $VitalsQualityReportPath) -RunLog $runLog -Step 'Vitals Cleanup'
        }
    }
    elseif ($ResetMissingOptionalOutputs) {
        Add-CommandCenterRunEvent -RunLog $runLog -Step 'Vitals Normalize' -Status 'WARN' -Message 'Vitals input file not present. Removing optional vitals artifacts.'
        Remove-CommandCenterArtifacts -Paths @($VitalsCurrentPath, $VitalsQualityReportPath) -RunLog $runLog -Step 'Vitals Cleanup'
    }
    else {
        Add-CommandCenterRunEvent -RunLog $runLog -Step 'Vitals Normalize' -Status 'WARN' -Message 'Vitals input file not present. Existing optional vitals artifacts were left unchanged.'
    }

    if ((Test-Path -LiteralPath $TherapyCoveragePath) -and (Test-Path -LiteralPath $DocumentationQueuePath)) {
        $prioritySucceeded = Invoke-TrackedStep -Step 'Priority Queue Build' -Optional -Action {
            & 'D:\SNF AI Dashboard\scripts\New-CommandCenterTherapyDocumentationPriority.ps1' `
                -TherapyCoveragePath $TherapyCoveragePath `
                -DocumentationQueuePath $DocumentationQueuePath `
                -OutputPath $PriorityQueuePath `
                -UnitSummaryPath $PriorityQueueByUnitPath
        }

        if (-not $prioritySucceeded) {
            Remove-CommandCenterArtifacts -Paths @($PriorityQueuePath, $PriorityQueueByUnitPath) -RunLog $runLog -Step 'Priority Cleanup'
        }
    }
    else {
        Add-CommandCenterRunEvent -RunLog $runLog -Step 'Priority Queue Build' -Status 'WARN' -Message 'Priority queue skipped because both therapy coverage and documentation queue were not available.'
    }

    Invoke-TrackedStep -Step 'Patient Insights' -Action {
        & 'D:\SNF AI Dashboard\scripts\New-CommandCenterPatientInsights.ps1' `
            -PccActiveCensusPath $PccActiveCensusPath `
            -DocumentationQueuePath $DocumentationQueuePath `
            -TherapyCoveragePath $TherapyCoveragePath `
            -PriorityQueuePath $PriorityQueuePath `
            -OutputPath $PatientInsightsPath
    } | Out-Null

    $shapSucceeded = Invoke-TrackedStep -Step 'SHAP Explanations' -Optional -Action {
        & 'D:\SNF AI Dashboard\scripts\New-CommandCenterShapExplanations.ps1' `
            -PatientInsightsPath $PatientInsightsPath `
            -OutputPath $ShapExplanationsPath `
            -FeatureImportancePath $ShapFeatureImportancePath `
            -SummaryPath $ShapSummaryPath
        & 'D:\SNF AI Dashboard\scripts\Test-CommandCenterShapExplanations.ps1' `
            -Path $ShapExplanationsPath | Out-Null
    }
    if (-not $shapSucceeded) {
        Remove-CommandCenterArtifacts -Paths @($ShapExplanationsPath, $ShapFeatureImportancePath, $ShapSummaryPath) -RunLog $runLog -Step 'SHAP Cleanup'
    }

    Invoke-TrackedStep -Step 'Automated Handoff Queue' -Action {
        & 'D:\SNF AI Dashboard\scripts\New-CommandCenterAutomatedHandoffQueue.ps1' `
            -PatientInsightsPath $PatientInsightsPath `
            -OutputPath $AutomatedHandoffQueuePath `
            -UnitSummaryPath $AutomatedHandoffQueueByUnitPath
    } | Out-Null

    if ($SkipAutomatedHandoffDispatch) {
        Add-CommandCenterRunEvent -RunLog $runLog -Step 'Automated Handoff Dispatch' -Status 'WARN' -Message 'Automated handoff dispatch skipped by parameter.'
    }
    else {
        Invoke-TrackedStep -Step 'Automated Handoff Dispatch' -Optional -Action {
            & 'D:\SNF AI Dashboard\scripts\Invoke-CommandCenterAutomatedHandoffDispatch.ps1' `
                -QueuePath $AutomatedHandoffQueuePath `
                -OutputPath $AutomatedHandoffDispatchLogPath `
                -SummaryPath $AutomatedHandoffDispatchSummaryPath
        } | Out-Null
    }

    Invoke-TrackedStep -Step 'Automated Handoff Lifecycle' -Action {
        & 'D:\SNF AI Dashboard\scripts\Invoke-CommandCenterAutomatedHandoffLifecycle.ps1' `
            -QueuePath $AutomatedHandoffQueuePath `
            -DispatchLogPath $AutomatedHandoffDispatchLogPath `
            -OutputPath $AutomatedHandoffQueuePath `
            -StatusSummaryPath $AutomatedHandoffByStatusPath `
            -SummaryPath $AutomatedHandoffLifecycleSummaryPath
    } | Out-Null

    Invoke-TrackedStep -Step 'Executive Unit Snapshot' -Action {
        & 'D:\SNF AI Dashboard\scripts\New-CommandCenterExecutiveUnitSnapshot.ps1' `
            -PccActiveCensusPath $PccActiveCensusPath `
            -DocumentationQueueByUnitPath $DocumentationQueueByUnitPath `
            -TherapyCoverageByUnitPath $TherapyCoverageByUnitPath `
            -PriorityQueueByUnitPath $PriorityQueueByUnitPath `
            -OutputPath $ExecutiveUnitSnapshotPath
    } | Out-Null

    Invoke-TrackedStep -Step 'Operational Summary' -Action {
        & 'D:\SNF AI Dashboard\scripts\New-CommandCenterOperationalSummary.ps1' `
            -PccActiveCensusPath $PccActiveCensusPath `
            -DocumentationQueuePath $DocumentationQueuePath `
            -DocumentationQueueByUnitPath $DocumentationQueueByUnitPath `
            -TherapyCoveragePath $TherapyCoveragePath `
            -TherapyCoverageByUnitPath $TherapyCoverageByUnitPath `
            -PriorityQueuePath $PriorityQueuePath `
            -PriorityQueueByUnitPath $PriorityQueueByUnitPath `
            -OutputPath $OperationalSummaryPath
    } | Out-Null

    Write-Host "Cross-source command center pipeline completed."
    Write-Host "Operational summary: $OperationalSummaryPath"
    Write-Host "Run log: $RunLogPath"
}
finally {
    Save-CommandCenterRunLog -RunLog $runLog -OutputPath $RunLogPath
    if ($lockAcquired) {
        Exit-CommandCenterRunLock -LockPath $LockPath
    }
}

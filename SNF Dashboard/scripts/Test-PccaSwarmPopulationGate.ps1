param(
    [string]$EnvironmentId = "077422cf-d088-e3d7-917e-5c9a9b64710c",
    [string]$OutputJsonPath = "D:\my agents copilot studio\SNF Dashboard\data\processed\pcca_swarm_population_gate.json",
    [string]$OutputMarkdownPath = "D:\my agents copilot studio\SNF Dashboard\data\processed\pcca_swarm_population_gate.md"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Get-Count {
    param(
        [string]$Text,
        [string]$Pattern
    )

    if ([string]::IsNullOrWhiteSpace($Text)) { return 0 }
    return ([regex]::Matches($Text, $Pattern)).Count
}

$projectRoot = Split-Path -Parent $PSScriptRoot
$verifyRoot = Join-Path $projectRoot "data\processed\ts0421_verify"
New-Item -ItemType Directory -Force -Path $verifyRoot | Out-Null

$targets = @(
    @{ Name = "SNF Cmd Center (TS0421)"; BotId = "f3b4edac-89fe-4fda-8be6-a53c297c29e2"; SourceTemplate = "data\processed\swarm_sync_templates\snf_command_center_agent_sync_20260421.yml" },
    @{ Name = "Compliance_Auditor (TS0421)"; BotId = "a6b92380-b6c5-4103-b744-d5c88ef10e11"; SourceTemplate = "data\processed\swarm_sync_templates\compliance_auditor_sync_20260421.yml" },
    @{ Name = "Synthesis_Orch (TS0421)"; BotId = "c693fc36-1f91-422d-81e3-07c385bdfb49"; SourceTemplate = "data\processed\swarm_sync_templates\synthesis_orchestrator_sync_20260421.yml" },
    @{ Name = "Rules_Engine_MCR_Ch15(TS0421)"; BotId = "63f1e675-2f03-41bd-b9bc-7953a8a75714"; SourceTemplate = "data\processed\swarm_sync_templates\rules_engine_medicare_ch15_sync_20260421.yml" },
    @{ Name = "Consensus_Engine (TS0421)"; BotId = "ebcd4eb2-47da-40af-b767-0401297b61b9"; SourceTemplate = "data\processed\swarm_sync_templates\consensus_engine_sync_20260421.yml" },
    @{ Name = "Escalation_Router (TS0421)"; BotId = "4bc4fab1-f334-4d52-a945-5fee71c3d414"; SourceTemplate = "data\processed\swarm_sync_templates\escalation_router_sync_20260421.yml" },
    @{ Name = "Regulatory_Validator(TS0421)"; BotId = "e611b51b-0598-4e80-bb6e-52321a29e282"; SourceTemplate = "data\processed\swarm_sync_templates\regulatory_validator_sync_20260421.yml" },
    @{ Name = "Prior_Auth_Validator(TS0421)"; BotId = "9e4838dd-1d85-4c45-adea-d498a2ab278c"; SourceTemplate = "data\processed\swarm_sync_templates\prior_auth_validator_sync_20260421.yml" },
    @{ Name = "Interdisciplinary_Coord(TS0421)"; BotId = "198568b4-c569-49f1-8995-f93cb0f5f142"; SourceTemplate = "data\processed\swarm_sync_templates\interdisciplinary_coordinator_sync_20260421.yml" },
    @{ Name = "Risk_Assessment_Agent(TS0421)"; BotId = "ae7a2bbf-d1b5-4d16-be62-6fc4085b5f5b"; SourceTemplate = "data\processed\swarm_sync_templates\risk_assessment_agent_sync_20260421.yml" },
    @{ Name = "Documentation_Processor(TS0421)"; BotId = "4ba514ec-0785-487d-b131-5d578936c6d8"; SourceTemplate = "data\processed\swarm_sync_templates\documentation_processor_sync_20260421.yml" }
)

$results = @()

foreach ($target in $targets) {
    $sourcePath = Join-Path $projectRoot $target.SourceTemplate
    if (-not (Test-Path -LiteralPath $sourcePath)) {
        throw "Source template missing: $sourcePath"
    }

    $livePath = Join-Path $verifyRoot "$($target.BotId).yml"
    $extractOutput = & pac copilot extract-template --environment $EnvironmentId --bot $target.BotId --templateFileName $livePath --overwrite 2>&1 | Out-String

    if (-not (Test-Path -LiteralPath $livePath)) {
        $results += [pscustomobject]@{
            Name = $target.Name
            BotId = $target.BotId
            Status = "fail"
            Reason = "extract_failed"
            SourceTemplate = $sourcePath
            LiveTemplate = $livePath
            ExtractOutput = $extractOutput.Trim()
        }
        continue
    }

    $sourceText = Get-Content -Raw -LiteralPath $sourcePath
    $liveText = Get-Content -Raw -LiteralPath $livePath

    $srcDialog = Get-Count -Text $sourceText -Pattern "kind:\s+DialogComponent"
    $liveDialog = Get-Count -Text $liveText -Pattern "kind:\s+DialogComponent"
    $srcFile = Get-Count -Text $sourceText -Pattern "kind:\s+FileKnowledgeSourceComponent"
    $liveFile = Get-Count -Text $liveText -Pattern "kind:\s+FileKnowledgeSourceComponent"
    $srcKnowledge = Get-Count -Text $sourceText -Pattern "kind:\s+KnowledgeSourceComponent"
    $liveKnowledge = Get-Count -Text $liveText -Pattern "kind:\s+KnowledgeSourceComponent"
    $srcInstructions = Get-Count -Text $sourceText -Pattern "(?m)^\s*instructions\s*:"
    $liveInstructions = Get-Count -Text $liveText -Pattern "(?m)^\s*instructions\s*:"

    $issues = @()
    if ($liveDialog -lt $srcDialog) { $issues += "dialog_components_missing" }
    if ($liveFile -lt $srcFile) { $issues += "file_knowledge_components_missing" }
    if ($liveKnowledge -lt $srcKnowledge) { $issues += "knowledge_components_missing" }
    if ($liveInstructions -lt $srcInstructions) { $issues += "instructions_missing" }

    $results += [pscustomobject]@{
        Name = $target.Name
        BotId = $target.BotId
        Status = if ($issues.Count -eq 0) { "pass" } else { "warn" }
        Issues = $issues
        SourceTemplate = $sourcePath
        LiveTemplate = $livePath
        SourceDialogComponents = $srcDialog
        LiveDialogComponents = $liveDialog
        SourceFileKnowledgeComponents = $srcFile
        LiveFileKnowledgeComponents = $liveFile
        SourceKnowledgeComponents = $srcKnowledge
        LiveKnowledgeComponents = $liveKnowledge
        SourceInstructionBlocks = $srcInstructions
        LiveInstructionBlocks = $liveInstructions
    }
}

$summary = [pscustomobject]@{
    TimestampUtc = (Get-Date).ToUniversalTime().ToString("o")
    EnvironmentId = $EnvironmentId
    Total = $results.Count
    Passed = @($results | Where-Object { $_.Status -eq "pass" }).Count
    Warned = @($results | Where-Object { $_.Status -eq "warn" }).Count
    Failed = @($results | Where-Object { $_.Status -eq "fail" }).Count
    Results = $results
}

$jsonDir = Split-Path -Parent $OutputJsonPath
$mdDir = Split-Path -Parent $OutputMarkdownPath
if ($jsonDir) { New-Item -ItemType Directory -Force -Path $jsonDir | Out-Null }
if ($mdDir) { New-Item -ItemType Directory -Force -Path $mdDir | Out-Null }

$summary | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $OutputJsonPath -Encoding UTF8

$md = [System.Collections.Generic.List[string]]::new()
$md.Add("# PCCA Swarm Population Gate") | Out-Null
$md.Add("") | Out-Null
$md.Add("- Timestamp (UTC): $($summary.TimestampUtc)") | Out-Null
$md.Add("- Environment: $EnvironmentId") | Out-Null
$md.Add("- Total: $($summary.Total)") | Out-Null
$md.Add("- Pass: $($summary.Passed)") | Out-Null
$md.Add("- Warn: $($summary.Warned)") | Out-Null
$md.Add("- Fail: $($summary.Failed)") | Out-Null
$md.Add("") | Out-Null
$md.Add("| Agent | Status | Dialog (src/live) | File Knowledge (src/live) | Knowledge (src/live) | Instructions (src/live) | Issues |") | Out-Null
$md.Add("|---|---|---:|---:|---:|---:|---|") | Out-Null

foreach ($row in $results) {
    if ($row.Status -eq "fail") {
        $md.Add("| $($row.Name) | fail | - | - | - | - | $($row.Reason) |") | Out-Null
        continue
    }

    $issueText = if ($row.Issues -and $row.Issues.Count -gt 0) { ($row.Issues -join ", ") } else { "" }
    $md.Add("| $($row.Name) | $($row.Status) | $($row.SourceDialogComponents)/$($row.LiveDialogComponents) | $($row.SourceFileKnowledgeComponents)/$($row.LiveFileKnowledgeComponents) | $($row.SourceKnowledgeComponents)/$($row.LiveKnowledgeComponents) | $($row.SourceInstructionBlocks)/$($row.LiveInstructionBlocks) | $issueText |") | Out-Null
}

$md | Set-Content -LiteralPath $OutputMarkdownPath -Encoding UTF8

Write-Host "Population gate JSON: $OutputJsonPath"
Write-Host "Population gate Markdown: $OutputMarkdownPath"

$agentPaths = @(
    "d:\my agents copilot studio\TheraDoc",
    "d:\my agents copilot studio\SNF Agent Command Center\SNF Command Center Agent",
    "d:\my agents copilot studio\Pacific-Coast Clinical Synthesis Lab\SNF Rehab Agent"
)

Write-Host "--- Performing Deep Audit on Swarm Ecosystem ---"

foreach ($agentPath in $agentPaths) {
    if (-not (Test-Path $agentPath)) {
        Write-Host "Path not found: $agentPath"
        continue
    }
    
    $agentName = (Get-Item $agentPath).Name
    Write-Host "`nScanning Agent: $agentName"
    $issues = @()

    $topics = Get-ChildItem -Path "$agentPath\topics\*.yml" -ErrorAction SilentlyContinue
    $actionFiles = Get-ChildItem -Path "$agentPath\actions\*.yml" -ErrorAction SilentlyContinue
    $workflowDirs = Get-ChildItem -Path "$agentPath\workflows" -Directory -ErrorAction SilentlyContinue
    
    if (-not $topics) { Write-Host "  No topics found."; continue }

    # 1. Topic -> Action References
    $referencedActions = @()
    foreach ($topic in $topics) {
        if ($topic.Name -match "\s|-|_") { $issues += "[Naming] Invalid Topic Name: $($topic.Name)" }
        
        $content = Get-Content $topic.FullName -Raw
        $matches = [regex]::Matches($content, 'dialog:\s+pcca_agent\.action\.([a-zA-Z0-9-]+)')
        foreach ($match in $matches) {
            $actionName = $match.Groups[1].Value
            $referencedActions += $actionName
            if (-not (Test-Path "$agentPath\actions\$actionName.mcs.yml")) {
                $issues += "[Broken Upstream] Topic $($topic.Name) calls missing action '$actionName'"
            }
        }
    }

    # 2. Action -> Topic (Orphaned Actions) & Action -> Flow (Broken Downstream)
    if ($referencedActions.Count -gt 0) {
        $uniqueActions = $referencedActions | Select-Object -Unique
    } else {
        $uniqueActions = @()
    }
    
    foreach ($action in $actionFiles) {
        $baseName = $action.Name -replace '\.mcs\.yml$', ''
        if ($uniqueActions -notcontains $baseName) {
            $issues += "[Orphaned Action] '$baseName' is defined but never called by any topic."
        }
        
        $content = Get-Content $action.FullName -Raw
        if ($content -match 'flowId:\s+"?([a-zA-Z0-9-]+)"?') {
            $flowId = $matches[1]
            $flowExists = $false
            foreach ($wf in $workflowDirs) {
                if ($wf.Name -match $flowId) { $flowExists = $true; break }
            }
            if (-not $flowExists) {
                $issues += "[Broken Downstream] Action '$baseName' calls missing flowId '$flowId'"
            }
        }
    }

    # 3. Workflows -> Actions (Orphaned Workflows)
    foreach ($wf in $workflowDirs) {
        if ($wf.Name -eq "archive") { continue }
        
        $wfIdMatch = [regex]::Match($wf.Name, '-([a-fA-F0-9-]+)$')
        if ($wfIdMatch.Success) {
            $wfId = $wfIdMatch.Groups[1].Value
            $linked = $false
            foreach ($action in $actionFiles) {
                if ((Get-Content $action.FullName -Raw) -match $wfId) { $linked = $true; break }
            }
            if (-not $linked) {
                if ($wf.Name -notmatch "CrossAgentAuditLog|NormalizeManual|TheraDoc-ComplianceAuditFlow") {
                   $issues += "[Orphaned Workflow] '$($wf.Name)' has no Action wrapper binding."
                }
            }
        }
    }

    if ($issues.Count -eq 0) {
        Write-Host "  ✅ CLEAN: Zero regressions or broken linkages found."
    } else {
        Write-Host "  ⚠️ Found $($issues.Count) issues:"
        foreach ($issue in $issues) { Write-Host "    - $issue" }
    }
}

$repoPath = "d:\my agents copilot studio"
$agents = @("TheraDoc", "SNF Agent Command Center\SNF Command Center Agent", "Pacific-Coast Clinical Synthesis Lab\SNF Rehab Agent", "Pacific-Coast Regulatory Hub\SimpleLTC QM Coach V2")

Write-Host "--- Performing Deep QA Scan for Bad Code ---"
$issues = @()

foreach ($agent in $agents) {
    $fullPath = Join-Path $repoPath $agent
    if (-not (Test-Path $fullPath)) { continue }
    
    $yamlFiles = Get-ChildItem -Path $fullPath -Include *.yml, *.yaml, *.json -Recurse
    
    foreach ($file in $yamlFiles) {
        # Skip archive directories
        if ($file.FullName -match "archive") { continue }
        
        $lines = Get-Content $file.FullName
        $lineNum = 1
        foreach ($line in $lines) {
            # 1. Search for TODOs, FIXMEs, or PLACEHOLDER strings in active code
            if ($line -match "(TODO|FIXME|PLACEHOLDER_)(?!\w)") {
                $issues += "[$agent] Suspicious Comment in $($file.Name) (Line $lineNum): $line"
            }
            
            # 2. Check for empty Power Fx expressions or malformed logic (e.g. condition: = )
            if ($line -match "condition:\s*=\s*$") {
                $issues += "[$agent] Empty PowerFx Condition in $($file.Name) (Line $lineNum): $line"
            }
            
            # 3. Check for raw GUIDs in text blocks (often a sign of hardcoding environment IDs)
            if ($line -match "[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}") {
                # Ignore flowId and workflow.json standard bindings
                if ($line -notmatch "flowId:" -and $file.Name -notmatch "workflow.json" -and $line -notmatch "dialog" -and $line -notmatch "id:" -and $line -notmatch "bot" -and $file.Name -notmatch "conn.json" -and $file.Name -notmatch "agent.mcs.yml") {
                    $issues += "[$agent] Hardcoded GUID detected in string in $($file.Name) (Line $lineNum): $line"
                }
            }
            
            $lineNum++
        }
        
        # 4. Check for known Copilot Studio UI errors left in YAML
        $rawText = Get-Content $file.FullName -Raw
        if ($rawText -match "kind:\s*Unknown") {
            $issues += "[$agent] CRITICAL - 'Unknown' Node type detected in $($file.Name). Yaml compilation will fail."
        }
        if ($rawText -match "kind:\s*ErrorNode") {
            $issues += "[$agent] CRITICAL - UI Syntax Error node left in $($file.Name)."
        }
    }
}

if ($issues.Count -eq 0) {
    Write-Host "`n✅ SUCCESS: Zero 'bad code' patterns, empty expressions, or unrecognized nodes found."
} else {
    Write-Host "`n⚠️ Found $($issues.Count) Bad Code / QA Warnings:"
    foreach ($issue in $issues) { Write-Host "- $issue" }
}

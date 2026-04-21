$agentPath = "d:\my agents copilot studio\Pacific-Coast Regulatory Hub\SimpleLTC QM Coach V2"
$issues = @()

Write-Host "--- Scanning Naming Inconsistencies ---"
$topics = Get-ChildItem -Path "$agentPath\topics\*.yml"
foreach ($topic in $topics) {
    if ($topic.Name -match "\s|-|_") {
        $issues += "Invalid Topic Naming (Contains spaces, hyphens, or underscores): $($topic.Name)"
    }
}

$actions = Get-ChildItem -Path "$agentPath\actions\*.yml"
foreach ($action in $actions) {
    if ($action.Name -notmatch "^[a-zA-Z0-9-]+\.mcs\.yml$") {
        $issues += "Invalid Action Naming (Should generally be alphanumeric with hyphens): $($action.Name)"
    }
}

Write-Host "--- Scanning Upstream/Downstream References ---"
foreach ($topic in $topics) {
    $content = Get-Content $topic.FullName -Raw
    
    # Check for Dialog/Action references
    $matches = [regex]::Matches($content, 'dialog:\s+pcca_agent\.action\.([a-zA-Z0-9-]+)')
    foreach ($match in $matches) {
        $actionName = $match.Groups[1].Value
        $expectedActionFile = "$agentPath\actions\$actionName.mcs.yml"
        if (-not (Test-Path $expectedActionFile)) {
            $issues += "Broken Action Reference in $($topic.Name): Target '$actionName.mcs.yml' not found in actions directory."
        }
    }
    
    # Check KnowledgeBase references
    $kbMatches = [regex]::Matches($content, 'src/KnowledgeBase/([a-zA-Z0-9_.]+\.md)')
    foreach ($kbMatch in $kbMatches) {
        $kbFile = $kbMatch.Groups[1].Value
        $expectedKbFile = "$agentPath\src\KnowledgeBase\$kbFile"
        if (-not (Test-Path $expectedKbFile)) {
            $issues += "Broken KnowledgeBase Reference in $($topic.Name): Target '$kbFile' not found in src/KnowledgeBase."
        }
    }
}

if ($issues.Count -eq 0) {
    Write-Host "No major inconsistencies found across topics, actions, or knowledge base references!"
} else {
    Write-Host "Found $($issues.Count) Potential Inconsistencies:"
    foreach ($issue in $issues) {
        Write-Host "- $issue"
    }
}

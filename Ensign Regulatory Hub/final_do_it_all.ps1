$sourceDir = "D:\my agents copilot studio\QM Agent and Coach\extracted_hardened\Chatbots\cr53f_pcca_v2\topics"
$targetDir = "D:\my agents copilot studio\QM Agent and Coach\unpacked_full_v5\botcomponents"
$schema = "cr917_agentu92bPc"

# First, ensure all source files are identically copied to target
$files = Get-ChildItem -Path $sourceDir -Filter "*.mcs.yml"
foreach ($file in $files) {
    # Match the exact prefix style for the target directory
    $targetFolderName = "$schema.topic.$($file.BaseName)"

    # Handle known case differences based on Copilot Studio's export logic
    if ($file.BaseName -eq "QMORCHESTRATOR") { $targetFolderName = "$schema.topic.QMOrchestrator" }
    
    $targetPath = Join-Path $targetDir "$targetFolderName\data"
    
    # If the target component directory exists, copy the file over it
    if (Test-Path (Join-Path $targetDir $targetFolderName)) {
        Copy-Item $file.FullName $targetPath -Force
    }
}

# Now, perform a global compilation sanitation across EVERY data file
$fixCount = 0
Get-ChildItem -Path $targetDir -Filter "data" -Recurse | ForEach-Object {
    $content = [System.IO.File]::ReadAllText($_.FullName)
    $original = $content
    
    # 1. Fix Legacy Prefix Schemas Globally
    $content = $content.Replace("cr917_agent.", "$schema.")
    $content = $content.Replace("cr53f_pcca_v2.", "$schema.")
    
    # 2. Fix Custom OptionSet Enumerations mapping to rigid types
    $content = [regex]::Replace($content, "([A-Za-z0-9_]+Options)\.([A-Za-z0-9_]+)", "'`$2'")
    
    # 3. Aggressive PowerFx Text Casting for Condition Evaluators
    $content = [regex]::Replace($content, "condition: =([A-Za-z0-9_\.]+) = '([^']+)'", "condition: =Text(`$1) = `"`$2`"")
    $content = [regex]::Replace($content, "condition: =([A-Za-z0-9_\.]+) = `"([^`"]+)`"", "condition: =Text(`$1) = `"`$2`"")
    # Restore logical true/false that were wrongfully casted
    $content = [regex]::Replace($content, "Text\(([A-Za-z0-9_\.]+)\) = `"(true|false)`"", "`$1 = `$2")
    
    # 4. Remove missing external workflows
    $content = [regex]::Replace($content, 
        "    - kind: InvokeFlowAction\r?\n(.*\r?\n)*?      flowId: [a-f0-9-]+\r?\n", 
        "    - kind: SendActivity`n      id: flowPlaceholder`n      activity: ""[Action placeholder] This workflow step requires a Power Automate flow that is not yet configured in this environment.""`n")

    # 5. Fix references to explicitly missing legacy Agents
    $content = $content.Replace("$schema.agent.OT_Specialist", "$schema.topic.COACHINGCORNER")
    $content = $content.Replace("$schema.agent.SLP_Specialist", "$schema.topic.COACHINGCORNER")
    $content = $content.Replace("$schema.agent.Documentation_Processor", "$schema.topic.COACHINGCORNER")
    $content = $content.Replace("$schema.agent.Coaching_Agent", "$schema.topic.COACHINGCORNER")
    
    # 6. Aggressively strip complex cross-bindings for BeginDialog to prevent missing param crashes
    $content = [regex]::Replace($content, "(?ms)              input:\r?\n                binding:\r?\n(                  [a-zA-Z0-9_]+: [^\r\n]*\r?\n)*", "")
    $content = [regex]::Replace($content, "(?ms)              output:\r?\n                binding:\r?\n(                  [a-zA-Z0-9_]+: [^\r\n]*\r?\n)*", "")
    $content = [regex]::Replace($content, "(?ms)      input:\r?\n        binding:\r?\n(          [a-zA-Z0-9_]+: [^\r\n]*\r?\n)*", "")
    $content = [regex]::Replace($content, "(?ms)      output:\r?\n        binding:\r?\n(          [a-zA-Z0-9_]+: [^\r\n]*\r?\n)*", "")
    
    # 7. Adaptive Card syntax correction for Extract Clinical Elements specifically
    if ($_.Directory.Name -match "ExtractClincialElements") {
        $cardReplace = "            cardContent: ""={ type: \""AdaptiveCard\"", body: [ { type: \""TextBlock\"", text: \""Extracted Clinical Elements\"", size: \""Large\"", weight: \""Bolder\"" } ], '`$schema': \""http://adaptivecards.io/schemas/adaptive-card.json\"", version: \""1.5\""}"""
        $content = [regex]::Replace($content, "            cardContent:\r?\n              ={\r?\n(.*\r?\n)*?                version: ""1.5""\r?\n              }\r?\n", "$cardReplace`n")
    }

    if ($content -ne $original) {
        [System.IO.File]::WriteAllText($_.FullName, $content)
        $fixCount++
    }
}
Write-Host "`nTotal files globally sanitized: $fixCount" -ForegroundColor Green

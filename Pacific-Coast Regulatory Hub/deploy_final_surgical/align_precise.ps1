$path = "D:\my agents copilot studio\QM Agent and Coach\deploy_final_surgical\Chatbots\cr917_agent"
# The exact schema name from the Studio is cr917_agentu92bPc
$targetSchema = "cr917_agentu92bPc"
$oldSchemas = @("cr53f_pcca_v2", "cr53f_agentOptimizationAssistant", "cr917_agent")

Get-ChildItem -Path $path -Filter "*.yml" -Recurse | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $newContent = $content
    foreach ($old in $oldSchemas) {
        $newContent = $newContent -replace $old, $targetSchema
    }
    if ($content -ne $newContent) {
        $newContent | Set-Content $_.FullName
        Write-Host "Precisely Aligned: $($_.Name)"
    }
}

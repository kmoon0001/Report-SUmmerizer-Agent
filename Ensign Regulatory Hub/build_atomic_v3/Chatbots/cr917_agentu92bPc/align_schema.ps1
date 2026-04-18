$path = "D:\my agents copilot studio\QM Agent and Coach\extracted_hardened\Chatbots\cr917_agentu92bPc"
Get-ChildItem -Path $path -Filter "*.yml" -Recurse | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $newContent = $content -replace "cr917_agentu92bPc", "cr917_agentu92bPc"
    if ($content -ne $newContent) {
        $newContent | Set-Content $_.FullName
        Write-Host "Updated: $($_.Name)"
    }
}


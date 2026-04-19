$botPrefix = "cr917_agentu92bPc"
$unpackedDir = ".\solution_unpacked\botcomponents"
$payloadsDir = ".\sanitized_editor_payloads"
$outputZip = ".\Carrier_Solution_Hardened.zip"

Write-Host "Starting injection of hardened payloads into Carrier Solution..." -ForegroundColor Cyan

# 1. Get all sanitized payloads
$payloadFiles = Get-ChildItem -Path $payloadsDir -Filter "*.mcs_SANITIZED.txt"

$matchCount = 0
$missCount = 0

foreach ($file in $payloadFiles) {
    # Extract TopicName (e.g., QMINTAKE)
    $topicName = $file.Name -replace '\.mcs_SANITIZED\.txt$', ''
    
    # Find all topics in the unpacked solution
    $botComponentDirs = Get-ChildItem -Path $unpackedDir -Filter "$botPrefix.topic.*" -Directory
    
    # Try case-insensitive exact match
    $targetDir = $botComponentDirs | Where-Object { $_.Name -match "(?i)\.topic\.$topicName$" }
    
    # In case there are multiple matches or weird spacing, just grab the first valid one
    if ($targetDir) {
        # Select the first match if multiple
        if ($targetDir -is [array]) { $targetDir = $targetDir[0] }
        
        $dataFile = Join-Path $targetDir.FullName "data"
        Write-Host "[SUCCESS] Injecting $topicName -> data" -ForegroundColor Green
        
        # We use Set-Content to preserve encoding and make sure we don't mess up BOM
        $content = Get-Content -Path $file.FullName -Raw
        Set-Content -Path $dataFile -Value $content -NoNewline
        $matchCount++
    } else {
        Write-Host "[WARNING] Target directory not found for: $topicName" -ForegroundColor Yellow
        $missCount++
    }
}

Write-Host "`nInjection complete. Matches: $matchCount | Misses: $missCount" -ForegroundColor Cyan

# 2. Pack the solution using PAC CLI
Write-Host "`nPacking Carrier Solution... Please wait." -ForegroundColor Cyan
pac solution pack --folder ".\solution_unpacked" --zipfile $outputZip

if ($LASTEXITCODE -eq 0 -or (Test-Path $outputZip)) {
    Write-Host "`n[SUCCESS] Carrier Solution Packaged: $outputZip" -ForegroundColor Green
    Write-Host "Ready for import via solutions portal!" -ForegroundColor Green
} else {
    Write-Host "`n[ERROR] PAC CLI failed to pack the solution. Ensure you have PAC installed and paths are correct." -ForegroundColor Red
}

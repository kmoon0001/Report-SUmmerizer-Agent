# Fleet_Health_Linter.ps1
# Static Analysis for universal agent compliance and health (Hardened V2)

Write-Host "==========================================" -ForegroundColor Yellow
Write-Host "  ENSIGN AI FLEET HEALTH REPORT (v2.0)    " -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Yellow

$agents = Get-ChildItem -Directory | Where-Object { $_.Name -match "Agent|Assistant|Analzyer|TheraDoc|Dashboard|Portal" }
$totalAgents = $agents.Count
$passedAgents = 0

foreach ($agent in $agents) {
    $name = $agent.Name
    $path = $agent.FullName
    $issues = @()
    
    Write-Host "`n[Checking $name]..." -NoNewline
    
    # 1. Documentation Check (Top Level)
    if (-not (Test-Path (Join-Path $path "AGENT.md")) -and -not (Test-Path (Join-Path $path "AGENTS.md"))) {
        $issues += "Missing AGENT.md / AGENTS.md"
    }
    
    # 2. Hardening Check (Search throughout the repo)
    $hardenedCount = (Get-ChildItem $path -Recurse -Include "*.md", "*.yml", "*.yaml" | ForEach-Object { Get-Content $_.FullName -Raw } | Where-Object { $_ -match "GLOBAL SAFETY GUARDRAILS|IRONCLAD" } | Measure-Object).Count
    if ($hardenedCount -eq 0) {
        $issues += "NOT HARDENED (Ironclad block missing in all examined files)"
    }
    
    # 3. Schema Check (Search for prefix)
    $prefixCount = (Get-ChildItem $path -Recurse -Include "*.yaml", "*.yml", "*.json" | ForEach-Object { Get-Content $_.FullName -Raw } | Where-Object { $_ -match "cr917_" } | Measure-Object).Count
    if ($prefixCount -eq 0) {
        $issues += "SCHEMA GAP (No cr917_ logical names detected)"
    }

    # Reporting
    if ($issues.Count -eq 0) {
        Write-Host " [HEALTHY ($hardenedCount files secured)]" -ForegroundColor Green
        $passedAgents++
    } else {
        Write-Host " [FAILED]" -ForegroundColor Red
        foreach ($issue in $issues) {
            Write-Host "   - $issue" -ForegroundColor Gray
        }
    }
}

Write-Host "`n==========================================" -ForegroundColor Yellow
Write-Host "  SUMMARY: $passedAgents / $totalAgents AGENTS HEALTHY" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Yellow

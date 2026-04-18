# Global_Fleet_Localization.ps1
# Ensures each agent is "Self-Contained" and portable by localizing shared knowledge.

$globalFiles = @(
    "SharedKnowledge\GLOBAL_CMS_COMPLIANCE.md",
    "SharedKnowledge\PLATINUM_PROMPT_PATTERNS.md",
    "SharedKnowledge\PLATINUM_ADVANCED_STABILITY.md",
    "SharedKnowledge\AUTHORITATIVE_URLS.md",
    "SharedKnowledge\ADVERSARIAL_INJECTION_FIREWALL.md",
    "GLOBAL_AGENT_RULES.md"
)

Get-ChildItem -Directory | Where-Object { $_.Name -match "Agent|Assistant|Analzyer|TheraDoc|Dashboard|Portal" } | ForEach-Object {
    $agentFolder = $_.FullName
    $localKB = Join-Path $agentFolder "src\KnowledgeBase"
    
    if (-not (Test-Path $localKB)) { New-Item -ItemType Directory -Path $localKB -Force | Out-Null }
    
    foreach ($file in $globalFiles) {
        $sourcePath = Join-Path "d:\my agents copilot studio" $file
        if (Test-Path $sourcePath) {
            Copy-Item $sourcePath -Destination $localKB -Force
            Write-Host "Localizing $($file) for $($_.Name)..." -ForegroundColor Green
        }
    }
}

param(
    [string]$VaultName = 'SNFSecretStore'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

Import-Module Microsoft.PowerShell.SecretManagement -ErrorAction Stop
Import-Module Microsoft.PowerShell.SecretStore -ErrorAction Stop

$vault = Get-SecretVault -Name $VaultName -ErrorAction SilentlyContinue
if ($null -eq $vault) {
    throw "Secret vault '$VaultName' not found. Run Initialize-SnfSecretStore.ps1 first."
}

$secretNames = @(
    'AZURE_OPENAI_ENDPOINT',
    'AZURE_OPENAI_API_KEY',
    'AZURE_OPENAI_DEPLOYMENT',
    'POWERBI_TENANT_ID',
    'POWERBI_CLIENT_ID',
    'POWERBI_CLIENT_SECRET',
    'POWERBI_WORKSPACE_ID',
    'POWERBI_REPORT_ID',
    'COPILOT_STUDIO_ENVIRONMENT_ID',
    'COPILOT_STUDIO_BOT_ID'
)

foreach ($name in $secretNames) {
    $prompt = "Enter value for $name (leave blank to skip)"
    $value = Read-Host -Prompt $prompt
    if ([string]::IsNullOrWhiteSpace($value)) { continue }
    Set-Secret -Name $name -Vault $VaultName -Secret $value
    Write-Host "Stored secret: $name"
}

Write-Host "Secret entry complete."

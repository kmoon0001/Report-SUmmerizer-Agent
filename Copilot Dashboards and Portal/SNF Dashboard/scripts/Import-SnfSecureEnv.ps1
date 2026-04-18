param(
    [string]$VaultName = 'SNFSecretStore',
    [string]$EnvPath = 'D:\my agents copilot studio\SNF Dashboard\.env'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Set-EnvFromDotEnv {
    param([string]$Path)

    if (-not (Test-Path -LiteralPath $Path)) { return }
    foreach ($line in Get-Content -LiteralPath $Path) {
        $trim = [string]$line
        if ([string]::IsNullOrWhiteSpace($trim)) { continue }
        if ($trim.StartsWith('#')) { continue }
        $idx = $trim.IndexOf('=')
        if ($idx -lt 1) { continue }
        $key = $trim.Substring(0, $idx).Trim()
        $val = $trim.Substring($idx + 1).Trim()
        if (-not [string]::IsNullOrWhiteSpace($key) -and -not [string]::IsNullOrWhiteSpace($val)) {
            [Environment]::SetEnvironmentVariable($key, $val)
        }
    }
}

Set-EnvFromDotEnv -Path $EnvPath

Import-Module Microsoft.PowerShell.SecretManagement -ErrorAction Stop
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

$loaded = @()
foreach ($name in $secretNames) {
    $secret = Get-Secret -Name $name -Vault $VaultName -ErrorAction SilentlyContinue
    if ($null -eq $secret) { continue }
    $value = [string]$secret
    if ([string]::IsNullOrWhiteSpace($value)) { continue }
    [Environment]::SetEnvironmentVariable($name, $value)
    $loaded += $name
}

Write-Host "Loaded secure environment variables: $($loaded.Count)"
if ($loaded.Count -gt 0) {
    Write-Host ($loaded -join ', ')
}


param(
    [switch]$InstallModules,
    [switch]$UnlockSecretStore
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Ensure-Module {
    param(
        [string]$Name,
        [switch]$Install
    )

    $module = Get-Module -ListAvailable -Name $Name | Select-Object -First 1
    if ($null -ne $module) { return }
    if (-not $Install) {
        throw "Required module '$Name' is missing. Re-run with -InstallModules."
    }
    Install-Module -Name $Name -Scope CurrentUser -Force -AllowClobber
}

Ensure-Module -Name 'Microsoft.PowerShell.SecretManagement' -Install:$InstallModules
Ensure-Module -Name 'Microsoft.PowerShell.SecretStore' -Install:$InstallModules

Import-Module Microsoft.PowerShell.SecretManagement -ErrorAction Stop
Import-Module Microsoft.PowerShell.SecretStore -ErrorAction Stop

$vaultName = 'SNFSecretStore'
$vault = Get-SecretVault -Name $vaultName -ErrorAction SilentlyContinue
if ($null -eq $vault) {
    Register-SecretVault -Name $vaultName -ModuleName Microsoft.PowerShell.SecretStore -DefaultVault
}

if ($UnlockSecretStore) {
    Unlock-SecretStore | Out-Null
}

$setting = Get-SecretStoreConfiguration
Write-Host "Secret vault ready: $vaultName"
Write-Host "Authentication mode: $($setting.Authentication)"
Write-Host "Interaction mode: $($setting.Interaction)"
Write-Host "Use Set-SnfCredentialSecrets.ps1 to store credentials securely."

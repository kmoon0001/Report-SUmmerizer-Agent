param(
    [string]$EnvFile = 'D:\SNF AI Dashboard\.env',
    [string]$OutputPath = 'D:\SNF AI Dashboard\data\processed\fabric_one_time_connection_prep.md'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Get-EnvMap {
    param([string]$Path)

    $map = @{}
    if (-not (Test-Path -LiteralPath $Path)) { return $map }
    foreach ($line in Get-Content -LiteralPath $Path) {
        $trimmed = $line.Trim()
        if (-not $trimmed -or $trimmed.StartsWith('#')) { continue }
        $parts = $trimmed -split '=', 2
        if ($parts.Count -eq 2) {
            $map[$parts[0].Trim()] = $parts[1].Trim()
        }
    }
    return $map
}

function Has-Value {
    param([AllowNull()][string]$Value)
    return -not [string]::IsNullOrWhiteSpace($Value)
}

$envMap = Get-EnvMap -Path $EnvFile
$requiredVars = @(
    'FABRIC_WORKSPACE_ID',
    'FABRIC_EVENTHOUSE_ID',
    'FABRIC_LAKEHOUSE_ID',
    'FABRIC_KQL_DATABASE',
    'POWERBI_TENANT_ID',
    'POWERBI_WORKSPACE_ID'
)

$missingVars = @()
foreach ($name in $requiredVars) {
    if (-not $envMap.ContainsKey($name) -or -not (Has-Value $envMap[$name])) {
        $missingVars += $name
    }
}

$azInstalled = $null -ne (Get-Command az -ErrorAction SilentlyContinue)
$azSignedIn = $false
if ($azInstalled) {
    try {
        $null = az account show 2>$null
        if ($LASTEXITCODE -eq 0) {
            $azSignedIn = $true
        }
    } catch {
        $azSignedIn = $false
    }
}

$workspaceId = if ($envMap.ContainsKey('FABRIC_WORKSPACE_ID')) { $envMap['FABRIC_WORKSPACE_ID'] } else { '' }
$tenantId = if ($envMap.ContainsKey('POWERBI_TENANT_ID')) { $envMap['POWERBI_TENANT_ID'] } else { '' }

$status = if ($missingVars.Count -eq 0 -and $azInstalled -and $azSignedIn) { 'READY_FOR_PERMISSION_CONNECT' } else { 'NOT_READY' }

$lines = @()
$lines += '# Fabric One-Time Connection Prep'
$lines += ''
$lines += "Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
$lines += ''
$lines += '## Status'
$lines += ''
$lines += "- Result: $status"
$lines += "- Env file: $EnvFile"
$lines += "- Azure CLI installed: $azInstalled"
$lines += "- Azure CLI signed in: $azSignedIn"
$lines += "- Fabric workspace ID: $(if (Has-Value $workspaceId) { $workspaceId } else { 'MISSING' })"
$lines += "- Power BI tenant ID: $(if (Has-Value $tenantId) { $tenantId } else { 'MISSING' })"
$lines += ''
$lines += '## Missing Environment Values'
$lines += ''
if ($missingVars.Count -eq 0) {
    $lines += '- None'
} else {
    foreach ($name in $missingVars) {
        $lines += "- $name"
    }
}
$lines += ''
$lines += '## One-Time Manual Actions'
$lines += ''
$lines += '1. Ensure you can open the target Fabric workspace in the browser.'
$lines += '2. Confirm your role is `Contributor` or higher for the workspace.'
$lines += '3. Ask admin to grant API/app permissions required for your org policy (Fabric + Power BI publish/admin paths).'
$lines += '4. Fill missing `.env` Fabric/Power BI values listed above.'
$lines += '5. Sign in with Azure CLI once on this machine: `az login`.'
$lines += '6. Re-run this script and confirm status becomes `READY_FOR_PERMISSION_CONNECT`.'
$lines += ''
$lines += '## After Permissions Are Granted'
$lines += ''
$lines += '1. Run: `powershell -ExecutionPolicy Bypass -File "D:\SNF AI Dashboard\scripts\Invoke-PowerBiExecutivePrep.ps1"`'
$lines += '2. Run Desktop publish/checklist: `docs\powerbi-desktop-manual-publish-checklist.md`'
$lines += '3. Run published smoke test after URL exists: `Invoke-PowerBiPublishedSmoke.ps1`'

$outputDir = Split-Path -Parent $OutputPath
if ($outputDir -and -not (Test-Path -LiteralPath $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
}

$lines -join [Environment]::NewLine | Set-Content -LiteralPath $OutputPath -Encoding UTF8
Write-Host "Fabric one-time connection prep written to: $OutputPath"
Write-Host "Status: $status"
if ($missingVars.Count -gt 0) {
    Write-Host "Missing env values: $($missingVars -join ', ')"
}

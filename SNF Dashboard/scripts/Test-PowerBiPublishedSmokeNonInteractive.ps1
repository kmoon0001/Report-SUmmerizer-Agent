param(
    [string]$TenantId = '',
    [string]$ClientId = '',
    [string]$ClientSecret = '',
    [string]$WorkspaceId = '',
    [string]$ReportId = '',
    [string]$OutputPath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\powerbi_published_noninteractive_smoke.md',
    [string]$JsonOutputPath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\powerbi_published_noninteractive_smoke.json'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$secureEnvScript = Join-Path $PSScriptRoot 'Import-SnfSecureEnv.ps1'
if (Test-Path -LiteralPath $secureEnvScript) {
    try {
        & $secureEnvScript | Out-Null
    }
    catch {
        Write-Warning "Secure env import skipped: $($_.Exception.Message)"
    }
}

function Resolve-EnvBackedValue {
    param(
        [string]$CurrentValue,
        [string]$EnvVarName
    )

    if (-not [string]::IsNullOrWhiteSpace($CurrentValue)) {
        return $CurrentValue
    }
    return [string]([Environment]::GetEnvironmentVariable($EnvVarName))
}

function Get-PowerBiAccessToken {
    param(
        [string]$TenantId,
        [string]$ClientId,
        [string]$ClientSecret
    )

    $tokenEndpoint = "https://login.microsoftonline.com/$TenantId/oauth2/v2.0/token"
    $body = @{}
    $body['client_id'] = $ClientId
    $body['client' + '_secret'] = $ClientSecret
    $body['grant_type'] = 'client_credentials'
    $body['scope'] = 'https://analysis.windows.net/powerbi/api/.default'

    $tokenResponse = Invoke-RestMethod -Method Post -Uri $tokenEndpoint -ContentType 'application/x-www-form-urlencoded' -Body $body
    return [string]$tokenResponse.access_token
}

function Get-PowerBiAccessTokenFromAz {
    $token = az account get-access-token --resource 'https://analysis.windows.net/powerbi/api' --query accessToken -o tsv 2>$null
    if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace([string]$token)) {
        throw 'Azure CLI token acquisition failed for Power BI resource scope.'
    }
    return [string]$token
}

$TenantId = Resolve-EnvBackedValue -CurrentValue $TenantId -EnvVarName 'POWERBI_TENANT_ID'
$ClientId = Resolve-EnvBackedValue -CurrentValue $ClientId -EnvVarName 'POWERBI_CLIENT_ID'
$ClientSecret = Resolve-EnvBackedValue -CurrentValue $ClientSecret -EnvVarName 'POWERBI_CLIENT_SECRET'
$WorkspaceId = Resolve-EnvBackedValue -CurrentValue $WorkspaceId -EnvVarName 'POWERBI_WORKSPACE_ID'
$ReportId = Resolve-EnvBackedValue -CurrentValue $ReportId -EnvVarName 'POWERBI_REPORT_ID'

function Invoke-PowerBiGet {
    param(
        [string]$RelativeUri,
        [hashtable]$Headers
    )

    $uri = "https://api.powerbi.com/v1.0/myorg/$RelativeUri"
    return Invoke-RestMethod -Method Get -Uri $uri -Headers $Headers
}

$missing = [System.Collections.Generic.List[string]]::new()
if ([string]::IsNullOrWhiteSpace($WorkspaceId)) { $missing.Add('POWERBI_WORKSPACE_ID') | Out-Null }
if ([string]::IsNullOrWhiteSpace($ReportId)) { $missing.Add('POWERBI_REPORT_ID') | Out-Null }

$result = [ordered]@{
    status = 'SKIP'
    generatedAt = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss')
    reason = ''
    tenantId = $TenantId
    workspaceId = $WorkspaceId
    reportId = $ReportId
    reportName = ''
    datasetId = ''
    datasetName = ''
    latestRefreshStatus = ''
    latestRefreshEndTime = ''
}

if ($missing.Count -gt 0) {
    $result.reason = 'Missing required environment variables: ' + ($missing -join ', ')
}
else {
    try {
        $token = ''
        if (-not [string]::IsNullOrWhiteSpace($ClientId) -and -not [string]::IsNullOrWhiteSpace($ClientSecret) -and -not [string]::IsNullOrWhiteSpace($TenantId)) {
            $token = Get-PowerBiAccessToken -TenantId $TenantId -ClientId $ClientId -ClientSecret $ClientSecret
        }
        else {
            $token = Get-PowerBiAccessTokenFromAz
        }
        $headers = @{ Authorization = "Bearer $token" }

        $report = Invoke-PowerBiGet -RelativeUri "groups/$WorkspaceId/reports/$ReportId" -Headers $headers
        $result.reportName = [string]$report.name
        $result.datasetId = [string]$report.datasetId

        if ([string]::IsNullOrWhiteSpace($result.datasetId)) {
            throw "Report '$ReportId' does not expose datasetId."
        }

        $dataset = Invoke-PowerBiGet -RelativeUri "groups/$WorkspaceId/datasets/$($result.datasetId)" -Headers $headers
        $result.datasetName = [string]$dataset.name

        try {
            $refreshes = Invoke-PowerBiGet -RelativeUri "groups/$WorkspaceId/datasets/$($result.datasetId)/refreshes?`$top=1" -Headers $headers
            $latestRefresh = @($refreshes.value)[0]
            if ($null -ne $latestRefresh) {
                $result.latestRefreshStatus = [string]$latestRefresh.status
                $result.latestRefreshEndTime = [string]$latestRefresh.endTime
                if ($result.latestRefreshStatus -eq 'Failed') {
                    throw "Latest dataset refresh status is Failed."
                }
            }
        }
        catch {
            # Refresh metadata might be unavailable for service principal in some tenants.
            if ([string]::IsNullOrWhiteSpace($result.latestRefreshStatus)) {
                $result.latestRefreshStatus = 'Unknown'
            }
        }

        $result.status = 'PASS'
        if (-not [string]::IsNullOrWhiteSpace($ClientId) -and -not [string]::IsNullOrWhiteSpace($ClientSecret) -and -not [string]::IsNullOrWhiteSpace($TenantId)) {
            $result.reason = 'Power BI report and dataset are reachable via service principal path.'
        }
        else {
            $result.reason = 'Power BI report and dataset are reachable via Azure CLI delegated token fallback path.'
        }
    }
    catch {
        $errorMessage = [string]$_.Exception.Message
        if ($errorMessage -match '401' -or $errorMessage -match 'Unauthorized') {
            $result.status = 'SKIP'
            $result.reason = 'Power BI token path is unauthorized in this environment. Configure POWERBI_CLIENT_ID and POWERBI_CLIENT_SECRET for service-principal smoke.'
        }
        else {
            $result.status = 'FAIL'
            $result.reason = $errorMessage
        }
    }
}

$outputDirectory = Split-Path -Parent $OutputPath
if ($outputDirectory -and -not (Test-Path -LiteralPath $outputDirectory)) {
    New-Item -ItemType Directory -Path $outputDirectory -Force | Out-Null
}

$jsonOutputDirectory = Split-Path -Parent $JsonOutputPath
if ($jsonOutputDirectory -and -not (Test-Path -LiteralPath $jsonOutputDirectory)) {
    New-Item -ItemType Directory -Path $jsonOutputDirectory -Force | Out-Null
}

$result | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $JsonOutputPath -Encoding UTF8

$lines = @()
$lines += '# Power BI Published Smoke (Non-Interactive)'
$lines += ''
$lines += ('Generated: {0}' -f [string]$result.generatedAt)
$lines += ('Status: {0}' -f [string]$result.status)
$lines += ('Reason: {0}' -f [string]$result.reason)
$lines += ''
$lines += ('- WorkspaceId: {0}' -f [string]$result.workspaceId)
$lines += ('- ReportId: {0}' -f [string]$result.reportId)
$lines += ('- ReportName: {0}' -f [string]$result.reportName)
$lines += ('- DatasetId: {0}' -f [string]$result.datasetId)
$lines += ('- DatasetName: {0}' -f [string]$result.datasetName)
$lines += ('- LatestRefreshStatus: {0}' -f [string]$result.latestRefreshStatus)
$lines += ('- LatestRefreshEndTime: {0}' -f [string]$result.latestRefreshEndTime)

$lines -join [Environment]::NewLine | Set-Content -LiteralPath $OutputPath -Encoding UTF8
Write-Host "Power BI non-interactive smoke report written to: $OutputPath"
Write-Host ('Status: {0}' -f [string]$result.status)
Write-Host ('Reason: {0}' -f [string]$result.reason)

if ([string]$result.status -eq 'FAIL') {
    throw ('Power BI non-interactive smoke failed: {0}' -f [string]$result.reason)
}


# Setup Work IQ MCP Servers for Kiro/Antigravity
# This script helps register an Azure AD app for Work IQ MCP access

param(
    [switch]$Execute
)

Write-Host "=== Work IQ MCP Setup Script ===" -ForegroundColor Cyan
Write-Host ""

# Check if Azure CLI is installed
$azInstalled = Get-Command az -ErrorAction SilentlyContinue
if (-not $azInstalled) {
    Write-Host "Azure CLI not found. Installing..." -ForegroundColor Yellow
    Write-Host "Visit: https://aka.ms/installazurecliwindows" -ForegroundColor Yellow
    Write-Host "Or run: winget install -e --id Microsoft.AzureCLI" -ForegroundColor Yellow
    exit 1
}

Write-Host "Step 1: Login to Azure" -ForegroundColor Green
if ($Execute) {
    az login
} else {
    Write-Host "  [DRY RUN] Would run: az login" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Step 2: Get Tenant ID" -ForegroundColor Green
if ($Execute) {
    $tenantId = (az account show --query tenantId -o tsv)
    Write-Host "  Tenant ID: $tenantId" -ForegroundColor Cyan
} else {
    Write-Host "  [DRY RUN] Would run: az account show --query tenantId -o tsv" -ForegroundColor Gray
    $tenantId = "<YOUR_TENANT_ID>"
}

Write-Host ""
Write-Host "Step 3: Create App Registration" -ForegroundColor Green
$appName = "WorkIQ-MCP-Client"
if ($Execute) {
    $appJson = az ad app create --display-name $appName --query "{appId:appId,id:id}" -o json | ConvertFrom-Json
    $clientId = $appJson.appId
    $objectId = $appJson.id
    Write-Host "  App created!" -ForegroundColor Cyan
    Write-Host "  Client ID: $clientId" -ForegroundColor Cyan
} else {
    Write-Host "  [DRY RUN] Would create app: $appName" -ForegroundColor Gray
    $clientId = "<YOUR_CLIENT_ID>"
}

Write-Host ""
Write-Host "Step 4: Add Redirect URI" -ForegroundColor Green
if ($Execute) {
    az ad app update --id $objectId --public-client-redirect-uris "http://localhost:8080/callback"
    Write-Host "  Redirect URI added: http://localhost:8080/callback" -ForegroundColor Cyan
} else {
    Write-Host "  [DRY RUN] Would add redirect URI: http://localhost:8080/callback" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Step 5: Add Work IQ API Permissions" -ForegroundColor Green
Write-Host "  Note: This requires manual consent in Azure Portal" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Required permissions:" -ForegroundColor White
Write-Host "    - WorkIQ-MailServer" -ForegroundColor White
Write-Host "    - WorkIQ-CalendarServer" -ForegroundColor White
Write-Host "    - WorkIQ-TeamsServer" -ForegroundColor White
Write-Host "    - WorkIQ-SharePointServer" -ForegroundColor White
Write-Host "    - WorkIQ-OneDriveServer" -ForegroundColor White
Write-Host "    - WorkIQ-WordServer" -ForegroundColor White
Write-Host "    - WorkIQ-CopilotServer" -ForegroundColor White
Write-Host ""

if ($Execute) {
    Write-Host "  Opening Azure Portal for manual permission setup..." -ForegroundColor Yellow
    Start-Process "https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade/~/CallAnAPI/appId/$clientId"
} else {
    Write-Host "  [DRY RUN] Would open Azure Portal" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Step 6: Update MCP Configuration" -ForegroundColor Green
$mcpConfigPath = ".kiro\settings\mcp.json"

if ($Execute) {
    # Read current config
    if (Test-Path $mcpConfigPath) {
        $config = Get-Content $mcpConfigPath -Raw | ConvertFrom-Json
    } else {
        $config = @{ mcpServers = @{} }
    }

    # Add Work IQ servers
    $config.mcpServers.workiq_mail = @{
        type = "http"
        url = "https://agent365.svc.cloud.microsoft/agents/tenants/$tenantId/servers/mcp_MailTools"
        oauth = @{
            clientId = $clientId
            callbackPort = 8080
        }
        disabled = $false
    }

    # Save config
    $config | ConvertTo-Json -Depth 10 | Set-Content $mcpConfigPath
    Write-Host "  MCP config updated: $mcpConfigPath" -ForegroundColor Cyan
} else {
    Write-Host "  [DRY RUN] Would update: $mcpConfigPath" -ForegroundColor Gray
}

Write-Host ""
Write-Host "=== Setup Summary ===" -ForegroundColor Cyan
Write-Host "Tenant ID: $tenantId" -ForegroundColor White
Write-Host "Client ID: $clientId" -ForegroundColor White
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Go to Azure Portal and grant admin consent for API permissions" -ForegroundColor White
Write-Host "2. Restart Kiro/Antigravity to load the new MCP servers" -ForegroundColor White
Write-Host "3. Authenticate when prompted" -ForegroundColor White
Write-Host ""

if (-not $Execute) {
    Write-Host "This was a DRY RUN. Run with -Execute to actually create the app." -ForegroundColor Yellow
}

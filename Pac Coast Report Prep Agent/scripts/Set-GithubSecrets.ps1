<#
.SYNOPSIS
Securely provisions GitHub Actions API secrets without persisting strings to disk or logging to local LLM traces.
#>
Write-Host "Authenticating GH CLI scopes..." -ForegroundColor Cyan
gh auth refresh -s workflow

$repo = "kmoon0001/SNF-Rehab-Agent"
Write-Host "Please provide the deployment Service Principal keys." -ForegroundColor Yellow

$appId = Read-Host "Enter POWER_APPS_APP_ID"
gh secret set POWER_APPS_APP_ID -b $appId --repo $repo

$tenantId = Read-Host "Enter POWER_APPS_TENANT_ID"
gh secret set POWER_APPS_TENANT_ID -b $tenantId --repo $repo

$envUrl = Read-Host "Enter PROD_ENVIRONMENT_URL (e.g., https://org3353a370.crm.dynamics.com/)"
gh secret set PROD_ENVIRONMENT_URL -b $envUrl --repo $repo

$secret = Read-Host -AsSecureString "Enter POWER_APPS_CLIENT_SECRET (Input is masked)"
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secret)
$plainTextSecret = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
gh secret set POWER_APPS_CLIENT_SECRET -b $plainTextSecret --repo $repo
[System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($BSTR)

Write-Host "✅ Azure Secrets securely pushed to $repo" -ForegroundColor Green
Write-Host "Attempting to push CI/CD Deployment Action..." -ForegroundColor Cyan
git push -u origin master

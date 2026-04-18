<#
  Installs and verifies tools used for IDE -> browser automation workflows:
  - Git
  - Node.js + npm + npx
  - .NET SDK (for pac)
  - Power Platform CLI (pac)
  - Dataverse CLI
  - Playwright CLI
  - Playwright MCP
  - Playwright browser binaries

  Usage:
    powershell -ExecutionPolicy Bypass -File .\scripts\Setup-IdeAutomationPrereqs.ps1
#>

$ErrorActionPreference = "Stop"

function Write-Step {
  param([string]$Message)
  Write-Host ""
  Write-Host "==> $Message" -ForegroundColor Cyan
}

function Test-CommandExists {
  param([string]$Name)
  return [bool](Get-Command $Name -ErrorAction SilentlyContinue)
}

function Install-WithWingetIfMissing {
  param(
    [string]$CommandName,
    [string]$WingetId
  )

  if (Test-CommandExists $CommandName) {
    Write-Host "$CommandName already installed."
    return
  }

  if (-not (Test-CommandExists "winget")) {
    throw "winget is not available. Install App Installer from Microsoft Store, then re-run."
  }

  Write-Host "Installing $WingetId via winget..."
  winget install --id $WingetId -e --accept-source-agreements --accept-package-agreements
}

function Ensure-GlobalNpmPackage {
  param([string]$PackageName)

  $exists = npm list -g --depth=0 2>$null | Select-String -SimpleMatch $PackageName
  if ($exists) {
    Write-Host "$PackageName already installed globally."
    return
  }

  Write-Host "Installing npm package: $PackageName"
  npm install -g $PackageName
}

function Ensure-PacInstalled {
  $hasPac = Test-CommandExists "pac"
  if ($hasPac) {
    Write-Host "pac already installed."
    return
  }

  if (-not (Test-CommandExists "dotnet")) {
    throw ".NET SDK is required to install pac. Install dotnet first."
  }

  Write-Host "Installing Microsoft Power Platform CLI (pac)..."
  dotnet tool install --global microsoft.powerapps.cli.tool
}

function Ensure-DataverseLatest {
  if (-not (Test-CommandExists "dataverse")) {
    throw "dataverse command not found after npm global install."
  }

  Write-Host "Updating Dataverse CLI to latest..."
  dataverse install latest
}

function Install-PlaywrightBrowser {
  if (Test-CommandExists "playwright-cli") {
    Write-Host "Installing Playwright Chromium via playwright-cli..."
    playwright-cli install-browser chromium
    return
  }

  throw "playwright-cli command not found. Ensure @playwright/cli is installed globally."
}

function Show-Verify {
  Write-Step "Verification"

  $checks = @(
    @{ Name = "git"; Command = "git --version" },
    @{ Name = "node"; Command = "node -v" },
    @{ Name = "npm"; Command = "npm -v" },
    @{ Name = "dotnet"; Command = "dotnet --version" },
    @{ Name = "pac"; Command = "pac help" },
    @{ Name = "dataverse"; Command = "dataverse --help" },
    @{ Name = "playwright"; Command = "npx playwright --version" },
    @{ Name = "playwright mcp"; Command = "npm view @playwright/mcp version" }
  )

  foreach ($check in $checks) {
    Write-Host ""
    Write-Host "[$($check.Name)] $($check.Command)" -ForegroundColor Yellow
    try {
      Invoke-Expression $check.Command | Out-Host
    } catch {
      Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
    }
  }
}

Write-Step "Installing base tools if missing"
Install-WithWingetIfMissing -CommandName "git" -WingetId "Git.Git"
Install-WithWingetIfMissing -CommandName "node" -WingetId "OpenJS.NodeJS.LTS"
Install-WithWingetIfMissing -CommandName "dotnet" -WingetId "Microsoft.DotNet.SDK.8"

Write-Step "Installing Power Platform CLI"
Ensure-PacInstalled

Write-Step "Installing npm global tools"
Ensure-GlobalNpmPackage -PackageName "@microsoft/dataverse"
Ensure-GlobalNpmPackage -PackageName "@playwright/cli"
Ensure-GlobalNpmPackage -PackageName "@playwright/mcp"
Ensure-DataverseLatest

Write-Step "Installing Playwright browsers"
Install-PlaywrightBrowser

Show-Verify

Write-Step "Next manual checks for Copilot Studio workflows"
Write-Host "Run these before apply/publish:"
Write-Host "  pac auth list"
Write-Host "  pac auth select --index <n>"
Write-Host "Then verify .mcs/conn.json has correct EnvironmentId and AgentId for the target tenant."

# Kiro MCP Setup (SNF AI Dashboard)

Date: 2026-04-07

## Goal

Run the same MCP stack used in VS Code from Kiro for repo ops, docs lookup, Azure/Power BI context, and Playwright automation.

## 1) Use the generated Kiro profile

This repo already contains:

- `.kiro/settings/mcp.json`

It is generated from `.vscode/mcp.json` and includes:

- `pac-cli`
- `filesystem`
- `git`
- `github`
- `learn-docs`
- `azure-mcp`
- `powerbi-remote`
- `playwright`

## 2) Refresh MCP profiles when `.vscode/mcp.json` changes

```powershell
powershell -ExecutionPolicy Bypass -File scripts\Export-CrossIdeMcpConfigs.ps1 -WriteProjectFiles
```

This re-generates `.kiro/settings/mcp.json` from the VS Code source profile.

## 3) Prerequisites on your machine

- `pac` CLI installed and authenticated
- Node.js + `npx`
- Azure auth available (`az login` recommended for Azure MCP)
- GitHub token available if using GitHub MCP (`GITHUB_PERSONAL_ACCESS_TOKEN`)

## 4) Playwright mode selection

Headless:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\Set-PlaywrightMcpMode.ps1 -Mode Headless
```

Headed:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\Set-PlaywrightMcpMode.ps1 -Mode Headed
```

Then regenerate Kiro profile:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\Export-CrossIdeMcpConfigs.ps1 -WriteProjectFiles
```

## 5) Validate after Kiro setup

```powershell
powershell -ExecutionPolicy Bypass -File scripts\Validate-SnfAiDashboardProject.ps1
powershell -ExecutionPolicy Bypass -File scripts\Invoke-SnfAiDashboardQaSweep.ps1
```

## 6) Important boundary

Kiro + MCP can run most automation paths, but the Copilot Studio extension sync loop (`Get changes` / `Preview changes` / `Apply changes`) remains extension-owned in VS Code for highest reliability in this project.

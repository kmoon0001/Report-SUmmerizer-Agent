# Cross-IDE MCP And Playwright Setup

Date: 2026-04-06

This runbook lets you reuse this repo's MCP stack across multiple AI IDEs/providers and switch Playwright between headless and headed modes.

## What Is Actually Headless vs Headed Here

- Headless-capable:
  - repo validation and QA scripts
  - MCP servers (filesystem/git/learn/azure/powerbi/playwright)
  - Playwright browser automation in headless mode
- Headed-required in this project:
  - final `Copilot Studio: Apply changes` + publish verification flow is still extension-owned UI workflow in VS Code for reliable tenant sync

## 1) Generate Cross-IDE MCP Profiles

Run:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\Export-CrossIdeMcpConfigs.ps1 -WriteProjectFiles
```

Generated export bundle:

- `data\exports\mcp-profiles\current\cursor.mcp.json`
- `data\exports\mcp-profiles\current\kiro.mcp.json`
- `data\exports\mcp-profiles\current\antigravity.mcp.json`
- `data\exports\mcp-profiles\current\claude-code.mcp.json`
- `data\exports\mcp-profiles\current\continue.mcp.json`
- `data\exports\mcp-profiles\current\cline_mcp_settings.json`

Project-level helper files also written:

- `mcp.json` (Cursor-style)
- `.mcp.json` (Claude Code-style)
- `.kiro\settings\mcp.json`
- `.antigravity\mcp_config.json`
- `.continue\mcpServers\mcp.json`
- `.cline\cline_mcp_settings.json`

## 2) Headless/Headed Playwright MCP Switch

Headless mode:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\Set-PlaywrightMcpMode.ps1 -Mode Headless
```

Headed mode:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\Set-PlaywrightMcpMode.ps1 -Mode Headed
```

Then reload VS Code (or restart MCP hosts) so the MCP server restarts with updated args.

## 3) Per-IDE Notes

- VS Code Copilot extension:
  - keep `.vscode\mcp.json` as the MCP source of truth for this repo
- Kiro:
  - use `.kiro\settings\mcp.json` (generated from the same source profile)
- Antigravity:
  - use `.antigravity\mcp_config.json` (generated `mcpServers` profile)
- Claude Code:
  - use repo `.mcp.json` for project-scoped MCP servers
- Continue:
  - import/use `.continue\mcpServers\mcp.json`
- Cline:
  - import/use `.cline\cline_mcp_settings.json` in Cline MCP settings

## 4) Validation After Setup

Run:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\Validate-SnfAiDashboardProject.ps1
powershell -ExecutionPolicy Bypass -File scripts\Invoke-SnfAiDashboardQaSweep.ps1
```

Check:

- `data\processed\snf_qa_sweep_report.md`


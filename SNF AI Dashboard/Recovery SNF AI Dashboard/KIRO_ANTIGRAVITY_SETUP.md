# Kiro + Antigravity Setup For This Repo

## 5-Minute Checklist

1. Install prerequisites:

```powershell
cd "D:\SNF AI Dashboard\Recovery SNF AI Dashboard"
powershell -ExecutionPolicy Bypass -File ".\scripts\Setup-IdeAutomationPrereqs.ps1"
```

2. Smoke test MCP prerequisites:

```powershell
powershell -ExecutionPolicy Bypass -File ".\scripts\Test-KiroMcp.ps1"
```

3. Open this repo in Kiro and reload.

4. Confirm Kiro sees workspace MCP config:
- `.kiro/settings/mcp.json`
- Servers: `playwright`, `dataverse_snf`

5. Set PAC profile before any publish/apply:

```powershell
pac auth list
pac auth select --index <n>
```

6. Verify connection source of truth:
- `SNF AI Dashboard Recovery\.mcs\conn.json`
- `EnvironmentId` = `a944fdf0-0d2e-e14d-8a73-0f5ffae23315`
- `AgentId` = `9e93bb85-97a2-4d5d-bbfe-0748a1dafbbb`

7. Publish/status check:

```powershell
pac copilot publish --environment a944fdf0-0d2e-e14d-8a73-0f5ffae23315 --bot 9e93bb85-97a2-4d5d-bbfe-0748a1dafbbb
pac copilot status --environment a944fdf0-0d2e-e14d-8a73-0f5ffae23315 --bot-id 9e93bb85-97a2-4d5d-bbfe-0748a1dafbbb
```

This guide is specific to:

- Repo root: `D:\SNF AI Dashboard\Recovery SNF AI Dashboard`
- Copilot project folder: `SNF AI Dashboard Recovery`
- Environment: `a944fdf0-0d2e-e14d-8a73-0f5ffae23315`
- Agent: `9e93bb85-97a2-4d5d-bbfe-0748a1dafbbb`
- Dataverse org URL: `https://orgbd048f00.crm.dynamics.com/`

AGENT policy source for this project family:

- [AGENT.md](d:/SNF AI Dashboard/AGENT.md)

## 1. Install Required Tools

From repo root:

```powershell
cd "D:\SNF AI Dashboard\Recovery SNF AI Dashboard"
powershell -ExecutionPolicy Bypass -File ".\scripts\Setup-IdeAutomationPrereqs.ps1"
```

That script installs and verifies:

- `git`
- `node`, `npm`, `npx`
- `.NET SDK`
- `pac` (Power Platform CLI)
- `@microsoft/dataverse`
- `@playwright/cli`
- `@playwright/mcp`
- Playwright Chromium browser runtime

## 2. Verify Repo Runtime Source Of Truth

Confirm local connection cache:

```powershell
Get-Content ".\SNF AI Dashboard Recovery\.mcs\conn.json"
```

Expected values in this repo:

- `EnvironmentId` = `a944fdf0-0d2e-e14d-8a73-0f5ffae23315`
- `AgentId` = `9e93bb85-97a2-4d5d-bbfe-0748a1dafbbb`

## 3. Configure MCP Servers In Kiro

This repo now includes a prebuilt Kiro MCP workspace config at:

- `.kiro/settings/mcp.json`

Current content:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    },
    "dataverse_snf": {
      "command": "dataverse",
      "args": ["mcp", "https://orgbd048f00.crm.dynamics.com/"]
    }
  }
}
```

If your Kiro build supports workspace MCP config files, open this repo in Kiro and reload the window.
If your Kiro build requires manual UI/server registration, enter the same command + args values in Kiro MCP settings.

## 4. Configure MCP Servers In Antigravity

Add the same MCP server definitions in Antigravity's MCP config:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    },
    "dataverse_snf": {
      "command": "dataverse",
      "args": ["mcp", "https://orgbd048f00.crm.dynamics.com/"]
    }
  }
}
```

If Antigravity has a UI for server registration, enter the same command + args values there.

## 5. Validate CLI Layer Before IDE Work

```powershell
pac help
dataverse --help
playwright-cli --help
npx playwright --version
```

## 6. Required PAC Auth Gate (Per Project Protocol)

Before any Copilot apply/publish in either IDE:

```powershell
pac auth list
pac auth select --index <n>
```

Then re-check:

- `SNF AI Dashboard Recovery\.mcs\conn.json`
- Environment and agent still match target tenant.

## 7. Publish Verification Gate (Per Project Protocol)

Use exact IDs from this repo:

```powershell
pac copilot publish --environment a944fdf0-0d2e-e14d-8a73-0f5ffae23315 --bot 9e93bb85-97a2-4d5d-bbfe-0748a1dafbbb
pac copilot status --environment a944fdf0-0d2e-e14d-8a73-0f5ffae23315 --bot-id 9e93bb85-97a2-4d5d-bbfe-0748a1dafbbb
pac copilot list --environment a944fdf0-0d2e-e14d-8a73-0f5ffae23315
```

## 8. Browser Automation Smoke Test

```powershell
playwright-cli open https://demo.playwright.dev/todomvc/ --headed
playwright-cli type "SNF setup test"
playwright-cli press Enter
playwright-cli screenshot
playwright-cli close
```

## 9. Failure Protocol

If you hit HTTP 400/500 or `Workflow ... Does Not Exist`:

1. Stop feature edits.
2. Repair PAC profile + tenant selection.
3. Repair flow ID bindings and output contracts.
4. Re-run validation gates.
5. Re-run publish/status/list checks in order.

## References

- Microsoft Learn: Power Platform CLI install
  - https://learn.microsoft.com/en-us/power-platform/developer/howto/install-cli-net-tool
- Microsoft Learn: `pac auth` reference
  - https://learn.microsoft.com/en-us/power-platform/developer/cli/reference/auth
- Microsoft Learn: `pac copilot` reference
  - https://learn.microsoft.com/en-us/power-platform/developer/cli/reference/copilot
- Playwright docs: CLI
  - https://playwright.dev/docs/getting-started-cli
- Playwright docs: MCP
  - https://playwright.dev/docs/getting-started-mcp

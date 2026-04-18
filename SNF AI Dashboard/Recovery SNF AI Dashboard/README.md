# SNF AI Dashboard Recovery Repo

## Setup Guides

- IDE/browser prerequisites installer:
  - [scripts/Setup-IdeAutomationPrereqs.ps1](d:/SNF AI Dashboard/Recovery SNF AI Dashboard/scripts/Setup-IdeAutomationPrereqs.ps1)
- Kiro + Antigravity MCP setup for this repo:
  - [KIRO_ANTIGRAVITY_SETUP.md](d:/SNF AI Dashboard/Recovery SNF AI Dashboard/KIRO_ANTIGRAVITY_SETUP.md)

## Quick Start

```powershell
cd "D:\SNF AI Dashboard\Recovery SNF AI Dashboard"
powershell -ExecutionPolicy Bypass -File ".\scripts\Setup-IdeAutomationPrereqs.ps1"
```

Then follow:

```powershell
pac auth list
pac auth select --index <n>
```

And verify:

- `SNF AI Dashboard Recovery\.mcs\conn.json`
- Correct `EnvironmentId` and `AgentId` before any `pac copilot publish`.

## AGENT.md Alignment Notes

Primary project rules live in:

- [AGENT.md](d:/SNF AI Dashboard/AGENT.md)

This recovery repo follows the same core order:

1. Extension-first path (attach/get/preview/apply) when Copilot Studio extension is available.
2. PAC auth/env binding check before apply/publish.
3. Contract/flow/output sync checks before publish.
4. Publish verification with `publish` -> `status` -> `list`.

Current recovery repo scope:

- Present scripts:
  - `scripts/Setup-IdeAutomationPrereqs.ps1`
  - `scripts/Test-KiroMcp.ps1`
- Not currently present here (referenced in root `AGENT.md`):
  - `scripts/Validate-SnfAiDashboardProject.ps1`
  - `scripts/Invoke-SnfAiDashboardPreflight.ps1`
  - `scripts/Get-CopilotStatus.ps1`

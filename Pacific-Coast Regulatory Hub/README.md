# QM Agent and Coach Repo

## Quick Setup

```powershell
cd "D:\my agents copilot studio\QM Agent and Coach"
powershell -ExecutionPolicy Bypass -File ".\scripts\Setup-IdeAutomationPrereqs.ps1"
powershell -ExecutionPolicy Bypass -File ".\scripts\Test-KiroMcp.ps1"
```

## Core Files

- [AGENT.md](d:/my agents copilot studio/QM Agent and Coach/AGENT.md)
- [KIRO_ANTIGRAVITY_SETUP.md](d:/my agents copilot studio/QM Agent and Coach/KIRO_ANTIGRAVITY_SETUP.md)
- [mcp.json](d:/my agents copilot studio/QM Agent and Coach/.kiro/settings/mcp.json)
- [agent.mcs.yml](d:/my agents copilot studio/QM Agent and Coach/SimpleLTC QM Coach V2/agent.mcs.yml)
- [conn.json](d:/my agents copilot studio/QM Agent and Coach/SimpleLTC QM Coach V2/.mcs/conn.json)

## Publish Gate

Before apply/publish:

```powershell
pac auth list
pac auth select --index <n>
```

Then verify:
- `SimpleLTC QM Coach V2\.mcs\conn.json` has expected `EnvironmentId` and `AgentId`.

Or use one command wrapper:

```powershell
# Dry run
powershell -ExecutionPolicy Bypass -File ".\scripts\Make-And-Publish.ps1"

# Real publish
powershell -ExecutionPolicy Bypass -File ".\scripts\Make-And-Publish.ps1" -Execute
```

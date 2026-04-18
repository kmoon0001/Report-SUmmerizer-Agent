# Copilot Studio Fallback Runbook

Date: 2026-04-07

Use this when the VS Code Copilot Studio extension path is unavailable or unstable.

## Primary Rule

- Preferred path remains extension-first:
  - `Open agent` -> `Get changes` -> `Preview changes` -> `Apply changes` -> publish
- Fallback paths are operational alternatives, not exact semantic replacements.

## One-Command Entry Point

```powershell
powershell -ExecutionPolicy Bypass -File scripts\Invoke-CopilotStudioSyncWithFallback.ps1 -Mode ExtensionFirst -EnvironmentId <envId> -BotId <botId>
```

Output report:

- `data\processed\copilot_sync_fallback_report.md`

## Fallback Modes

### 1) PAC Copilot Fallback

Use when extension sync/apply commands cannot execute:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\Invoke-CopilotStudioSyncWithFallback.ps1 -Mode PacCopilotFallback -EnvironmentId <envId> -BotId <botId>
```

What it does:

- local validation + preflight
- `pac copilot status`
- `pac copilot publish`
- `pac copilot list`

### 2) PAC Solution Fallback

Use for ALM-style deployment workflows:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\Invoke-CopilotStudioSyncWithFallback.ps1 -Mode PacSolutionFallback
```

What it does:

- local validation + preflight
- `pac solution list`

## Consequences When `Get/Preview/Apply` Cannot Run

- You lose extension-managed workspace diff confidence for tenant sync.
- You cannot rely on equivalent local-vs-tenant preview semantics.
- Drift risk increases between repo assets and live tenant state.
- Publish can succeed while unresolved authoring-sync differences remain.
- Manual tenant verification burden increases after fallback deployment.

## Required Compensating Controls In Fallback Mode

- run:
  - `scripts/Validate-SnfAiDashboardProject.ps1`
  - `scripts/Invoke-SnfAiDashboardQaSweep.ps1`
- run tenant checks:
  - flow naming/status checks
  - connection references/bindings checks
  - live Copilot behavior verification for changed paths
- update:
  - `docs/todo.md`
  - `docs/not-completely-best-practice-checklist.md`
  with fallback evidence and any residual risk.


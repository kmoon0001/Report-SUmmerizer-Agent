# Agent Solution ALM Runbook

This folder provides a solution-first ALM workflow for Copilot Studio agents without relying on the VS Code Copilot extension.

## Microsoft Learn Alignment

- Export/import agents through solutions:
  - https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-solutions-import-export
- Use `pac solution` for source control packaging:
  - https://learn.microsoft.com/en-us/power-platform/developer/cli/reference/solution
- YAML source-control format guidance:
  - https://learn.microsoft.com/en-us/power-platform/alm/solution-source-control-yaml-format
- CI/CD with GitHub Actions for Power Platform:
  - https://learn.microsoft.com/en-us/power-platform/alm/devops-github-actions

## Scripts

- `New-AgentAlmManifest.ps1`
  - Discovers local attached agents (`.mcs/conn.json`) and creates a manifest.
- `Invoke-AgentAlmExportUnpack.ps1`
  - Exports each configured solution from Dataverse and unpacks to local folders.
- `Invoke-AgentAlmPackImportPublish.ps1`
  - Packs local folders back to solution zip, imports to Dataverse, then publishes agents.

## First-Time Setup

1. Generate manifest:
   - `powershell -ExecutionPolicy Bypass -File scripts/alm/New-AgentAlmManifest.ps1 -Root "d:\my agents copilot studio" -IncludeArchived`
2. Edit `scripts/alm/agent-alm.manifest.json`:
   - Set `solutionName` for each agent.
   - Set `enabled` only for agents you want in the current wave.
   - Set `sourceOfTruth` / `mergeMode` according to policy.

## Export + Unpack (Pull from Studio)

- `powershell -ExecutionPolicy Bypass -File scripts/alm/Invoke-AgentAlmExportUnpack.ps1 -Root "d:\my agents copilot studio" -CleanUnpack`

Artifacts:
- `artifacts/alm/exports/<timestamp>/`
- `artifacts/alm/unpacked/<project-slug>/`
- `artifacts/alm/logs/export-unpack-<timestamp>.json`

## Pack + Import + Publish (Push to Studio)

- `powershell -ExecutionPolicy Bypass -File scripts/alm/Invoke-AgentAlmPackImportPublish.ps1 -Root "d:\my agents copilot studio" -ForceOverwrite`

Artifacts:
- `artifacts/alm/repacked/<timestamp>/`
- `artifacts/alm/logs/pack-import-publish-<timestamp>.json`

## Quality Gates Before Push

- Binding complete (`agentId`, `environmentId`/`dataverseEndpoint` present)
- Agent exists live in target environment
- `solutionName` set for each enabled agent
- Duplicates resolved (multiple folders bound to same live agent)

## Notes

- This workflow is intentionally solution-first.
- Playwright should be used for UI validation and smoke testing, not as the primary deployment mechanism.
- Direct headless edits of Copilot Studio internals are not recommended; deploy via supported solution APIs/CLI.

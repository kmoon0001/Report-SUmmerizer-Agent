# Future Project Copy

Use this workspace as the template for new SNF agent projects.

## Recommended Copy Method

1. Use `scripts/New-SnfAiDashboardProject.ps1` instead of manually copying the whole folder.
2. Rename the new workspace folder if needed.
3. Attach the new project with `Copilot Studio: Open agent` instead of copying old connection or cache state.
4. Update `agent.mcs.yml`, `settings.mcs.yml`, and `AGENT.md` for the new project name.
5. Reuse the `docs`, `knowledge_sources`, `scripts`, and `playwright` scaffolding.
6. Keep `.vscode/mcp.json`, `.vscode/mcp.healthcare.template.json`, and `.vscode/mcp.manifest.json` together so the new project inherits both the runnable base profile and the full healthcare target profile.
7. Keep `SNF_Command_Center_Starter_Bundle/` intact so new projects inherit the healthcare file and folder convention bundle.
8. Keep the Copilot Studio bootstrap and recovery docs so the new project inherits the extension-safe setup path.
9. Keep `.mcs` minimal until the extension creates fresh cache files.
10. If you intentionally reattach the same workspace, add or refresh only `.mcs/conn.json`.
11. Keep the official MCP split intact:
   - Learn MCP for docs
   - Playwright MCP for UI
   - Power BI MCP for semantic model queries
   - APIs and workflows for actual Fabric/Power BI operations
12. Do not re-add generic MCP servers like `fetch` or `memory` unless the new project has a concrete, repeated need for them.

## What To Keep

- `AGENT.md`
- `.vscode/mcp.json`
- `.vscode/mcp.healthcare.template.json`
- `.vscode/mcp.manifest.json`
- `docs/mcp-stack-and-tool-boundaries.md`
- `docs/`
- `knowledge_sources/`
- `playwright/`
- `scripts/`
- `SNF_Command_Center_Starter_Bundle/`
- `docs/copilot-studio-bootstrap-and-cache-hygiene.md`
- `docs/copilot-studio-sync-recovery.md`

## What To Replace

- `.mcs/conn.json` only after attaching or reattaching the new project
- `agent.mcs.yml`
- `settings.mcs.yml`
- any project-specific topic, action, or workflow exports
- tenant-specific URLs and access settings in `.vscode/mcp.healthcare.template.json`
- any starter-bundle manifests that need facility-specific names, policies, or document sets
- any stale `.mcs` cache files if the project was copied manually instead of with the script

# SNF Command Center

 Starter workspace for a healthcare operations platform with Copilot Studio, Fabric, Power BI, Dataverse, Graph, SQL/Postgres, SharePoint/OneDrive, Codex, and Playwright support. The architecture docs also cover optional Fabric MCP plus workflow, BI-tool API, and data-store API MCP patterns.

## What Is Here

- Root project rules in `AGENT.md`
- Copilot Studio agent metadata in `agent.mcs.yml`
- Project settings in `settings.mcs.yml`
- Knowledge base starter documents in `knowledge_sources/`
- Workflow, topic, action, and design folders ready for export/import
- Manual-review backend actions and workflows for patient insight, clinical alerting, quality reporting, care-summary export, and governed file/image intake
- Live topic paths stay in structured intake and explicit manual handoff mode until each backend is validated in Copilot Studio
- Project validation script in `scripts/Validate-SnfAiDashboardProject.ps1`
- Project preflight script in `scripts/Invoke-SnfAiDashboardPreflight.ps1`
- Helper scripts for status, publish, and workspace launch
- VS Code tasks in `.vscode/tasks.json`
- VS Code MCP configuration in `.vscode/mcp.json`
- Official Microsoft Learn MCP, Azure MCP, and remote Power BI MCP endpoints in the default VS Code MCP profile
- Environment variables template in `.env.example`
- Action and integration contracts in `contracts/` and `integrations/integration-manifest.json`
- Integration notes in `integrations/`
- Clinical behavior and topic mapping in `docs/clinical-assistant-behavior-spec.md` and `docs/clinical-topic-map.md`
- Workflow, dashboard, data model, governance, privacy, and validation specs in `docs/`
- Copilot Studio sync and preview/apply recovery runbook in `docs/copilot-studio-sync-recovery.md`
- Copilot Studio bootstrap and cache-hygiene guide in `docs/copilot-studio-bootstrap-and-cache-hygiene.md`
- Copilot Studio apply root-cause analysis in `docs/copilot-studio-apply-root-cause-analysis.md`
- Power BI MCP enablement guide in `docs/powerbi-mcp-enablement.md`
- Active project TODO list in `docs/todo.md`
- MCP orchestration and server inventory templates in `docs/mcp-orchestration-blueprint.md`, `docs/mcp-server-template.md`, and `.vscode/mcp.healthcare.template.json`
- MCP profile activation script in `scripts/Enable-HealthcareMcpProfile.ps1`
- Copilot Studio cache reset helper in `scripts/Reset-CopilotStudioWorkspaceCache.ps1`
- Executive bundle share-package helper in `scripts/New-ExecutiveCommandCenterSharePackage.ps1`
- Reusable healthcare file and folder bundle in `SNF_Command_Center_Starter_Bundle/`

## Recommended Setup

1. Open this folder in VS Code.
2. Install the Copilot Studio extension.
3. Sign in with the target tenant account.
4. Open or create the agent in Copilot Studio.
5. Keep the local export files in sync with the live tenant by using preview, apply, and publish.
6. Use Microsoft Learn MCP for current Microsoft docs, release notes, and official implementation guidance.
7. Use Playwright for live browser checks when you need to verify Copilot Studio, Fabric, or Power BI UI behavior.
8. Use the built-in PAC CLI MCP server to surface Power Platform and Copilot Studio tooling inside the editor.
9. Use Azure MCP for Azure-side context and operations when the task crosses into Azure resources.
10. Use the remote Power BI MCP endpoint for semantic model querying, not for report publishing or tenant administration.
11. Use GitHub MCP, git MCP, filesystem MCP, and PAC CLI for repo and platform work.
12. Copy this workspace with `scripts/New-SnfAiDashboardProject.ps1` when you want a new project with the same scaffold.
13. Use the integration notes to wire Power BI, Fabric, Dataverse, Graph, SQL/Postgres, SharePoint, and OneDrive.
14. Use `scripts/Test-SnfAiDashboardEnvironment.ps1` to verify required environment values before binding live integrations.
15. Use `scripts/Test-DeveloperToolchain.ps1` to confirm required local CLIs are installed before relying on Azure or GitHub MCP-related workflows.

## Copilot Studio Baseline Setup

Use this order for every new project:

1. Open the workspace in VS Code.
2. Install and update the Copilot Studio extension.
3. Sign in to the correct tenant.
4. Attach with `Copilot Studio: Open agent`.
5. Let the extension build the `.mcs` snapshot through `Open agent` or `Get changes`.
6. Run:
   - `powershell -ExecutionPolicy Bypass -File .\scripts\Validate-SnfAiDashboardProject.ps1`
   - `powershell -ExecutionPolicy Bypass -File .\scripts\Invoke-SnfAiDashboardPreflight.ps1 -RequireConnection`
   - `powershell -ExecutionPolicy Bypass -File .\scripts\Get-CopilotStatus.ps1`
7. Run `Copilot Studio: Get changes`.
8. Run `Copilot Studio: Preview changes`.
9. Run `Copilot Studio: Apply changes`.
10. Publish and verify.

Important:

- Do not seed `.mcs` cache files from another project.
- Keep `.mcs` minimal until the extension creates its own cache.
- If the cache gets corrupted, use `scripts/Reset-CopilotStudioWorkspaceCache.ps1` and then rebuild through `Get changes`.
- Do not paste tokens or secrets into chat, docs, or repo files. Put them in environment variables or the platform's secure credential store instead.

## MCP Operating Model

- Use the Copilot Studio extension first for attach, get, preview, apply, and live agent sync.
- Use Microsoft Learn MCP for up-to-date Microsoft guidance and setup validation.
- Use Playwright MCP for browser automation and UI verification.
- Use Power BI MCP for querying semantic models and validating model-connected agent scenarios.
- Use Fabric REST APIs, Power BI REST APIs, workflows, or backend services for actual deployment, publish, refresh, or administrative operations.
- Use Fabric Pro-Dev MCP for local Fabric development workflows after it is installed and authenticated.
- Use Dataverse MCP after the environment allows the Dataverse client or remote endpoint.
- Do not keep generic MCP servers in the default profile unless they are part of the normal Microsoft-first workflow for this project family.

## Expected Workflow

- Edit agent logic in the repo.
- Run the project preflight script.
- If Preview/Get/Apply fails, use `docs/copilot-studio-sync-recovery.md` and `docs/copilot-studio-bootstrap-and-cache-hygiene.md`.
- Preview changes in Copilot Studio.
- Apply changes through the extension.
- Publish with `pac copilot publish`.
- Validate with `pac copilot status` and browser checks when needed.

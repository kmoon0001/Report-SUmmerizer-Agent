# Project TODO

## Active

- Keep operating in no-Fabric mode using the HTML executive bundle while Fabric creation permissions are blocked.
- Keep using the auto-generated executive share ZIP after each refresh for stakeholder distribution.
- Prepare and send the Fabric access request to tenant admins.
- Keep `HANDOFF_DELIVERY_MODE=CopilotNative` as the default until tenant-side webhook/connector authorization is approved.
- Provide Azure OpenAI groundedness-eval environment variables (`AZURE_OPENAI_ENDPOINT`, `AZURE_OPENAI_API_KEY`, `AZURE_OPENAI_DEPLOYMENT`) to turn groundedness QA from `SKIP` into enforced PASS/FAIL scoring.
- Configure service-principal environment variables (`POWERBI_TENANT_ID`, `POWERBI_CLIENT_ID`, `POWERBI_CLIENT_SECRET`, `POWERBI_WORKSPACE_ID`, `POWERBI_REPORT_ID`) so the new non-interactive published smoke lane can move from `SKIP` to `PASS`.
- Complete SecretStore module bootstrap on this machine (`Microsoft.PowerShell.SecretManagement` + `Microsoft.PowerShell.SecretStore`) so secure env auto-load can run without module warnings.

## Blocked By Tenant Permissions

- Fabric item creation in workspace `0b0fa563-4e46-4bbe-93de-a6b4d4711fc4`:
  - `Lakehouse`
  - `Eventhouse`
  - `KQL Database`
- Power BI Desktop publish rights and/or license path for direct report publishing.
- Playwright published-report smoke in CI/non-interactive runs:
  - currently lands on Power BI sign-in page without an authenticated browser session
  - requires interactive login or service-principal/API-based smoke path
- Best-path handoff authorization:
  - Teams incoming webhook creation permission (or admin-created webhook for the target channel)
  - and/or signed Power Automate request-trigger endpoint (`sig=` URL) for external delivery mode
  - and/or Copilot action -> tenant flow connector permissions and connection references for direct in-tenant delivery
- Power BI/Fabric automation best-path permissions:
  - Service principal + workspace role for REST/API driven publish/refresh/deployment
  - Deployment pipeline permissions for Dev -> Test -> Prod promotion

### Admin Request Text

`I need access to Fabric workspace 0b0fa563-4e46-4bbe-93de-a6b4d4711fc4 to build SNF dashboard infrastructure. Please grant me Contributor (or Member) and allow creating/viewing Lakehouse, Eventhouse, and KQL Database. Also confirm I can publish Power BI from Desktop in this workspace (license/role path).`

`Please also enable best-path handoff and automation permissions: either (a) Teams incoming webhook creation for the clinical channel, (b) a signed Power Automate HTTP request trigger URL for automated handoff delivery, or (c) Copilot action-to-flow connector permissions with approved connection references. Additionally, grant service-principal workspace access and deployment-pipeline permissions for Power BI/Fabric CI/CD promotion.`

## Completed

- Added one-click share packaging of the executive bundle after each refresh.
- Added one-command no-Fabric operations run that refreshes, validates, and prints the latest share ZIP path.
- Added default `CopilotNative` handoff mode so autonomous runs are no longer blocked by webhook auth.
- Implemented SHAP + XAI guardrails lane core controls:
  - guarded response evidence contract
  - citations/groundedness/verification/uncertainty fields in automated handoff outputs
  - QA release gate for guarded response evidence contract
- Enforced guardrail evidence outputs across all six Copilot actions and their workflow response schemas.
- Hardened SHAP generation path with deterministic fallback output creation so required SHAP artifacts exist even when python SHAP/sklearn dependencies are unavailable.
- Renamed all tenant Power Automate flows to Microsoft Learn-aligned naming standards and hardened `Rename-PowerAutomateFlowsToStandard.ps1` to repair missing connection-reference bindings automatically before publish/reactivate.
- Cleared the tenant flow naming blocker so `Test-PowerAutomateFlowNamingStandard.ps1` now passes with zero violations and the full QA sweep is green in the default non-interactive path.
- Replaced placeholder automated-handoff evidence statuses with backend-derived groundedness and verification outputs based on deterministic insight-rule validation plus attached source coverage.
- Added a groundedness-evaluation QA hook that builds a JSONL dataset and calls Azure AI Evaluation when the Python package and Azure OpenAI model configuration are present; otherwise it emits a documented `SKIP` report without breaking the default QA path.
- Added `Test-ActionContractSync.ps1` and wired it into QA to fail on drift between action outputs, workflow response schema/body fields, and contract manifest/matrix files.
- Hardened `Test-CommandCenterGroundednessEvaluation.ps1` to parse machine-written result JSON first and include Python exit-code context on failures.
- Added `Test-PowerBiPublishedSmokeNonInteractive.ps1` and wired it into QA so published smoke now has a deterministic service-principal/API path with explicit `PASS/SKIP/FAIL`.
- Updated groundedness evaluation runner to auto-prefer repo virtualenv Python (`.venv-codex-yaml`) or `SNF_PYTHON_PATH`, reducing interpreter drift in QA.
- Installed `azure-ai-evaluation` in repo virtualenv (`.venv-codex-yaml`) so groundedness evaluation now skips only on missing Azure OpenAI configuration, not missing package.
- Added `Export-CrossIdeMcpConfigs.ps1` and generated cross-IDE MCP profiles plus project-ready MCP files for Cursor, Kiro, Antigravity, Claude Code, Continue, and Cline from `.vscode/mcp.json`.
- Added `Set-PlaywrightMcpMode.ps1` to switch Playwright MCP between headless and headed modes without manual JSON edits.
- Added fallback orchestration and runbook for extension outages:
  - `scripts/Invoke-CopilotStudioSyncWithFallback.ps1`
  - `docs/copilot-studio-fallback-runbook.md`
  - `AGENT.md` now includes explicit fallback rule + consequences when `Get changes`/`Preview changes`/`Apply changes` are unavailable.
- Updated `Invoke-PowerAutomateFlowAudit.ps1` target flow names to current standardized tenant names; audit findings now clear (0 findings on latest run).
- Added secure credential scripts and runbook:
  - `scripts/Initialize-SnfSecretStore.ps1`
  - `scripts/Set-SnfCredentialSecrets.ps1`
  - `scripts/Import-SnfSecureEnv.ps1`
  - `docs/secure-credential-bootstrap.md`
- Added premium SNF all-departments Power BI authoring assets:
  - `snf-departments-theme.json`
  - `snf-departments-page-layout.json`
  - `snf-departments-report-spec.md`
  - `snf-departments-copilot-prompts.md`
  in `integrations/powerbi/source-package/current/authoring-kit`.

## Resume When Unblocked

1. Create Fabric `Lakehouse`, `Eventhouse`, and `KQL Database`.
2. Populate `.env` with:
   - `FABRIC_EVENTHOUSE_ID`
   - `FABRIC_LAKEHOUSE_ID`
   - `FABRIC_KQL_DATABASE`
3. Re-run:
   - `Invoke-FabricOneTimeConnectionPrep.ps1`
4. Continue normal workflow:
   - `Invoke-PowerBiExecutivePrep.ps1`
   - Desktop publish checklist
   - `Invoke-PowerBiPublishedSmoke.ps1`
5. Enable best-path handoff delivery (choose one):
   - Teams webhook URL in `.env` as `HANDOFF_TEAMS_WEBHOOK_URL`
   - or signed HTTP request URL in `.env` as `HANDOFF_WEBHOOK_URL`
   - or direct Copilot action->flow connector path in tenant solution
6. Switch delivery mode from `CopilotNative` only after step 5 is validated:
   - set `HANDOFF_DELIVERY_MODE` to webhook mode
   - run `Test-HandoffWebhookReadiness.ps1`
   - run `Invoke-HandoffGoLive.ps1`
7. Enable API-driven promotion path:
   - configure service principal permissions
   - wire deployment pipeline promotion and post-deploy smoke checks
8. Unblock published smoke automation:
   - either run one interactive sign-in in the Playwright browser profile before smoke
   - or move published smoke to service-principal/API health checks where supported

# World-Class Delivery Runbook (Non-UI)

Date: 2026-04-06

Use this runbook to execute the full non-UI path from development through release readiness.

## 1) Where To Work

- VS Code:
  - repo authoring (`topics`, `actions`, `workflows`, `contracts`, `docs`, `scripts`)
  - Copilot Studio extension workflow (`Get changes` -> `Preview changes` -> `Apply changes` -> publish)
- PowerShell terminal (repo root):
  - validation, QA, packaging, reports
- Tenant portals:
  - Copilot Studio for live publish/verification
  - Power Automate for flow state/connection checks
  - Power BI/Fabric for publish/promotion readiness

## 2) Baseline Commands (Run In Repo Root)

```powershell
powershell -ExecutionPolicy Bypass -File scripts\Validate-SnfAiDashboardProject.ps1
powershell -ExecutionPolicy Bypass -File scripts\Test-ActionContractSync.ps1
powershell -ExecutionPolicy Bypass -File scripts\Invoke-SnfAiDashboardQaSweep.ps1
```

Primary report:

- `data\processed\snf_qa_sweep_report.md`

## 3) Gate Expectations

Required release gates must be `PASS`:

- project validation
- source schema validation
- button-only routing
- authoring compliance
- action contract sync
- secret hygiene
- data drift validation
- guarded response evidence
- packaging/bundle validation

Allowed `SKIP` only when explicitly documented:

- groundedness evaluation (`azure-ai-evaluation` or Azure OpenAI eval config missing)

## 4) Make Groundedness Mandatory

Install and configure:

```powershell
pip install azure-ai-evaluation
```

Set environment variables:

- `AZURE_OPENAI_ENDPOINT`
- `AZURE_OPENAI_API_KEY`
- `AZURE_OPENAI_DEPLOYMENT`
- optional: `AZURE_OPENAI_API_VERSION`

Then run:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\Test-CommandCenterGroundednessEvaluation.ps1
```

Success target: `Status: PASS` (not `SKIP`).

## 5) Tenant-Readiness To Close Remaining Gaps

- live-validate automated handoff delivery path in tenant (not local-only)
- configure and validate deterministic non-interactive published smoke:
  - `powershell -ExecutionPolicy Bypass -File scripts\Test-PowerBiPublishedSmokeNonInteractive.ps1`
- finalize Fabric/Power BI/service-principal permissions for CI/CD promotion

Track status in:

- `docs\not-completely-best-practice-checklist.md`
- `docs\todo.md`

## 6) Memory/Context Loop After Each Major Job

After every major feature or fix:

1. Re-read `AGENT.md` requirements.
2. Re-run validation + QA sweep.
3. Update `docs\todo.md` and `docs\not-completely-best-practice-checklist.md`.
4. Save a concise current-state summary in `data\processed` outputs and reports.

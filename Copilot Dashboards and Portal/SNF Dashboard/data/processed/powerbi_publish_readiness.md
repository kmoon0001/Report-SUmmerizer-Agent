# Power BI Publish Readiness

Generated: 2026-04-10 23:05:11
Status: **READY**

- [PASS] Artifact: integrations\powerbi\source-package\current\source-package-manifest.json: D:\my agents copilot studio\SNF Dashboard\integrations\powerbi\source-package\current\source-package-manifest.json
- [PASS] Artifact: integrations\powerbi\source-package\current\model-tables\model-table-manifest.json: D:\my agents copilot studio\SNF Dashboard\integrations\powerbi\source-package\current\model-tables\model-table-manifest.json
- [PASS] Artifact: integrations\powerbi\source-package\current\authoring-kit\README.md: D:\my agents copilot studio\SNF Dashboard\integrations\powerbi\source-package\current\authoring-kit\README.md
- [PASS] Artifact: integrations\powerbi\source-package\current\authoring-kit\executive-measures.dax: D:\my agents copilot studio\SNF Dashboard\integrations\powerbi\source-package\current\authoring-kit\executive-measures.dax
- [PASS] Artifact: integrations\powerbi\source-package\current\authoring-kit\executive-command-center-relationships.csv: D:\my agents copilot studio\SNF Dashboard\integrations\powerbi\source-package\current\authoring-kit\executive-command-center-relationships.csv
- [PASS] Artifact: integrations\powerbi\source-package\current\authoring-kit\executive-command-center-report-spec.md: D:\my agents copilot studio\SNF Dashboard\integrations\powerbi\source-package\current\authoring-kit\executive-command-center-report-spec.md
- [PASS] Artifact: integrations\powerbi\source-package\current\authoring-kit\executive-theme.json: D:\my agents copilot studio\SNF Dashboard\integrations\powerbi\source-package\current\authoring-kit\executive-theme.json
- [PASS] Artifact: integrations\powerbi\source-package\current\authoring-kit\executive-page-layout.json: D:\my agents copilot studio\SNF Dashboard\integrations\powerbi\source-package\current\authoring-kit\executive-page-layout.json
- [PASS] Power BI package reconciliation: Power BI executive package validation passed. Package root: D:\my agents copilot studio\SNF Dashboard\integrations\powerbi\source-package\current Residents: 162 Units: 4 Dates: 141
- [WARN] Workspace id available: Advisory: set POWERBI_WORKSPACE_ID in environment or .env for consistent publish targeting.
- [WARN] Non-interactive published smoke prerequisites: Advisory: missing POWERBI_TENANT_ID, POWERBI_CLIENT_ID, POWERBI_CLIENT_SECRET, POWERBI_WORKSPACE_ID, POWERBI_REPORT_ID. Set these for CI-safe published smoke via Test-PowerBiPublishedSmokeNonInteractive.ps1.

## Manual Publish Steps
1. Open Power BI Desktop and import model tables from `integrations\powerbi\source-package\current\model-tables`.
2. Apply `executive-theme.json` and `executive-measures.dax` from the authoring kit.
3. Confirm relationships using `executive-command-center-relationships.csv`.
4. Validate visuals against `executive-command-center-report-spec.md` and `executive-page-layout.json`.
5. Publish to the target workspace and run a post-publish smoke check.

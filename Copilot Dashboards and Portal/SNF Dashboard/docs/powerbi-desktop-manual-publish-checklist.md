# Power BI Desktop Manual Publish Checklist

Use this when you are ready to do the small manual part that cannot be completed headlessly.

## Before Desktop

1. Run:
   - `powershell -ExecutionPolicy Bypass -File "D:\my agents copilot studio\SNF Dashboard\scripts\Invoke-PowerBiExecutivePrep.ps1"`
   - `powershell -ExecutionPolicy Bypass -File "D:\my agents copilot studio\SNF Dashboard\scripts\Invoke-PowerBiManualAssistPrep.ps1"`
2. Confirm package artifacts exist:
   - `integrations/powerbi/source-package/current/model-tables/model-table-manifest.json`
   - `integrations/powerbi/source-package/current/authoring-kit/authoring-kit-manifest.json`
3. Confirm current metrics:
   - `data/processed/command_center_operational_summary.json`

## Desktop Authoring

1. Open Power BI Desktop.
2. Create or open PBIP in a short local path (example: `D:\pbip\snf-exec`).
3. Import all CSVs from:
   - `D:\my agents copilot studio\SNF Dashboard\integrations\powerbi\source-package\current\model-tables`
4. Apply theme:
   - `authoring-kit/executive-theme.json`
5. Create measures from:
   - `authoring-kit/executive-measures.dax`
6. Apply relationships from:
   - `authoring-kit/executive-command-center-relationships.csv`
7. Build visuals using:
   - `authoring-kit/executive-page-layout.json`
8. Reconcile KPI totals with:
   - `data/processed/command_center_operational_summary.json`

## Publish

1. Publish to the intended workspace.
2. Run one manual refresh in Power BI Service.
3. Recheck KPI totals against the same summary JSON.
4. Capture publish evidence:
   - report URL
   - workspace name
   - refresh success timestamp

## Post-Publish Smoke

1. If you have a report URL, set:
   - `POWERBI_REPORT_URL`
2. Run Playwright smoke:
   - `powershell -ExecutionPolicy Bypass -File "D:\my agents copilot studio\SNF Dashboard\scripts\Invoke-PowerBiPublishedSmoke.ps1"`

## Stop Conditions

- If KPI totals do not reconcile, do not share the report yet.
- If refresh fails, do not treat publish as complete.
- If visuals show blanks where source tables have rows, check relationships and measure bindings first.


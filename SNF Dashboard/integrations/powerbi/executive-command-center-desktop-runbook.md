# Executive Command Center Desktop Runbook

## Purpose

Take the source-controlled SNF executive package and move it into a Power BI Desktop / PBIP implementation using the current processed operational files.

## Microsoft Learn Basis

- Power BI Desktop projects and PBIP:
  - https://learn.microsoft.com/power-bi/developer/projects/projects-overview
- TMDL view and semantic model authoring:
  - https://learn.microsoft.com/power-bi/transform-model/desktop-tmdl-view
- Star schema guidance:
  - https://learn.microsoft.com/power-bi/guidance/star-schema
- Model relationships:
  - https://learn.microsoft.com/power-bi/transform-model/desktop-create-and-manage-relationships
- Measures:
  - https://learn.microsoft.com/power-bi/transform-model/desktop-measures

## Current Package Inputs

Run:

```powershell
powershell -ExecutionPolicy Bypass -File "D:\my agents copilot studio\SNF Dashboard\scripts\Invoke-PowerBiExecutivePrep.ps1"
powershell -ExecutionPolicy Bypass -File "D:\my agents copilot studio\SNF Dashboard\scripts\Invoke-PowerBiManualAssistPrep.ps1"
```

That produces:

- `integrations/powerbi/source-package/current/source-package-manifest.json`
- `integrations/powerbi/source-package/current/model-tables/model-table-manifest.json`
- `integrations/powerbi/source-package/current/authoring-kit/authoring-kit-manifest.json`
- model tables in `integrations/powerbi/source-package/current/model-tables`
- authoring helpers in `integrations/powerbi/source-package/current/authoring-kit`

## Power BI Desktop Project Guardrails

Microsoft Learn currently calls out several PBIP rules that matter here:

- save PBIP projects in a short local path to reduce Windows path-length failures
- do not save PBIP projects directly into OneDrive or SharePoint locations from Desktop
- keep externally edited project files in UTF-8 without BOM
- expect CRLF line endings for Desktop-authored project files

Use a short local working root such as `D:\pbip\snf-exec\` and keep the generated SNF source package separate from the live Desktop project folder.

## Import Sequence

1. Open or create a PBIP project in Power BI Desktop.
2. Import these CSV tables from `model-tables`:
   - `DimResidentCurrent.csv`
   - `DimUnit.csv`
   - `DimDate.csv`
   - `FactCurrentResidentCensus.csv`
   - `FactDocumentationQueue.csv`
   - `FactExecutiveUnitSnapshot.csv`
   - `FactTherapyCoverage.csv` when present
   - `FactResidentPriority.csv` when present
3. Apply relationships from `executive-command-center-relationships.csv`.
4. Apply the theme from `authoring-kit\executive-theme.json`.
5. Create measures from `authoring-kit\executive-measures.dax`.
6. Use `authoring-kit\executive-page-layout.json` as the page-build checklist.
7. Validate totals against:
   - `command_center_operational_summary.md`
   - `command_center_executive_unit_snapshot.csv`

## Recommended Model Pattern

- Use `DimResidentCurrent`, `DimUnit`, and `DimDate` as conformed dimensions.
- Use `FactCurrentResidentCensus` for census cards and resident-level census detail.
- Use `FactDocumentationQueue` for documentation backlog and due-date analytics.
- Use `FactExecutiveUnitSnapshot` for fast unit-level tiles and executive strip visuals.
- Add therapy and priority facts only when the real therapy extract has been landed and processed.

## Validation Checks

- Census resident total must equal `FactCurrentResidentCensus` row count.
- Documentation item total must equal `FactDocumentationQueue` row count.
- Unit rollups must match `FactExecutiveUnitSnapshot`.
- If therapy is absent, therapy visuals should display blank or hidden states, not zero-filled fake data.

## Current Limitation

The repo now produces a validated source package and model-table package, but it does not yet generate a live `.pbip` or `.tmdl` project directly from Desktop. The remaining step is Power BI Desktop authoring against the generated files.


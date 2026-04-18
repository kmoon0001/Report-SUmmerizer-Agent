# Power BI Manual Assist Prep

Generated: 2026-04-05 12:15:44

## Package Root

- D:\my agents copilot studio\SNF Dashboard\integrations\powerbi\source-package\current

## Source Files Packaged

- Count: 10

## Model Tables

- DimResidentCurrent: 162 rows
- DimUnit: 4 rows
- DimDate: 141 rows
- FactCurrentResidentCensus: 162 rows
- FactDocumentationQueue: 129 rows
- FactExecutiveUnitSnapshot: 4 rows
- FactTherapyCoverage: 139 rows
- FactResidentPriority: 82 rows

## Authoring Kit

- Measures: 15
- Relationships: 16
- Files:
- README.md
- executive-theme.json
- executive-measures.dax
- executive-command-center-measures.csv
- executive-command-center-relationships.csv
- executive-page-layout.json
- executive-command-center-report-spec.md

## Manual Desktop Steps (Short)

1. Open Power BI Desktop and create or open a PBIP project in a short local path.
2. Import all CSVs from $PackageRoot\model-tables.
3. Apply theme from $PackageRoot\authoring-kit\executive-theme.json.
4. Create measures from $PackageRoot\authoring-kit\executive-measures.dax.
5. Apply relationships from $PackageRoot\authoring-kit\executive-command-center-relationships.csv.
6. Build visuals using $PackageRoot\authoring-kit\executive-page-layout.json.
7. Validate KPI totals against D:\my agents copilot studio\SNF Dashboard\data\processed\command_center_operational_summary.json.

## Publish And Verify

1. Publish to the intended workspace.
2. Run one manual refresh in Power BI Service.
3. Confirm row-level and KPI totals match the processed summary.
4. If published URL is available, run Playwright smoke against that URL.


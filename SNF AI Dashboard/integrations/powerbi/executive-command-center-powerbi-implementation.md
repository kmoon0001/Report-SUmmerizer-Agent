# Executive Command Center Power BI Implementation

## Purpose

Define the source-controlled Power BI implementation path for the executive command-center page using the current SNF processed-source outputs.

## Microsoft Learn Basis

This implementation follows Microsoft Learn guidance for:

- Power BI Desktop projects and source-controlled artifacts:
  - https://learn.microsoft.com/power-bi/developer/projects/projects-overview
- star schema modeling in Power BI:
  - https://learn.microsoft.com/power-bi/guidance/star-schema
- model relationships in Power BI:
  - https://learn.microsoft.com/power-bi/transform-model/desktop-create-and-manage-relationships
- DAX measures and model calculations:
  - https://learn.microsoft.com/power-bi/transform-model/desktop-measures

## Current Source Files

The executive page should be built from these current processed outputs:

- `pcc_resident_list_current.active-only.csv`
- `command_center_documentation_queue.csv`
- `command_center_documentation_queue.by-unit.csv`
- `command_center_executive_unit_snapshot.csv`
- `command_center_therapy_coverage.csv`
- `command_center_therapy_coverage.by-unit.csv`
- `command_center_therapy_documentation_priority.csv`
- `command_center_therapy_documentation_priority.by-unit.csv`

## Modeling Direction

### Preferred approach

- keep one semantic model for the executive page
- use a star-schema shape where possible
- treat resident-level files as fact-like operational snapshots
- treat unit-level rollups as derived views or convenience imports, not the only source of truth

### Initial tables

- `DimResidentCurrent`
- `DimUnit`
- `DimDate`
- `FactCurrentResidentCensus`
- `FactDocumentationQueue`
- `FactExecutiveUnitSnapshot`
- `FactTherapyCoverage`
- `FactResidentPriority`

## Current Build Constraint

The project does not yet generate a live PBIP/TMDL project from Power BI Desktop. Until that exists, the repo should keep:

- the processed-source package
- semantic-model table/measure contracts
- relationship contracts
- report-page specifications

## Build Sequence

1. Generate the current Power BI source package with `New-PowerBiExecutiveSourcePackage.ps1`
2. Generate semantic-model-ready dimension and fact tables with `New-PowerBiExecutiveModelTables.ps1`
3. Validate the package with `Test-PowerBiExecutivePackage.ps1`
4. Open or create the PBIP project in Power BI Desktop
5. Import the packaged model-table CSVs
6. Apply the relationship contract
7. Create measures from the measure library
8. Build the executive report page and validate card totals against the processed-source outputs

## Validation Rules

- census total must match `pcc_resident_list_current.active-only.csv`
- documentation totals must match `command_center_documentation_queue.csv`
- unit-level executive strip totals must match `command_center_executive_unit_snapshot.csv`
- therapy totals must match `command_center_therapy_coverage.csv` when that file exists
- priority queue totals must match `command_center_therapy_documentation_priority.csv` when that file exists

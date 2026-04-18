# Net Health Daily Treatment Summary Source Profile

## Status

This report is the current real therapy source path for the SNF Command Center build.

The report was verified live in Net Health under:

- `Reports -> Daily Treatment Summary`

## Confirmed Runtime Shape

The report renders:

- `Date Of Service`
- resident display name under `Patient`
- `Treatment Received`
- `Service Code`
- `Discipline`
- `Minutes`
- `Physician`
- `Wing`
- `Response To Treatment`

The viewer is paged and supports multiple report pages.

## Current Build Assumption

The project treats this report as:

- one row per resident treatment line
- current operational therapy workload
- a source that does not reliably expose governed resident IDs in the visible export surface

Because of that, the implementation path is:

1. normalize source-facing resident names and treatment fields
2. derive deterministic therapy-case IDs from stable treatment-line content
3. resolve residents against the current PCC census in a separate reproducible step
4. exclude unresolved residents from the current-state therapy coverage queue

## Expected Landed File

- `D:\SNF AI Dashboard\data\incoming\nethealth_therapy_census.csv`

The landed file should preserve the report headers as exported from Net Health.
The preferred main path is a true native CSV export.

The therapy normalizer now supports both of these CSV shapes:

- flat CSV with one treatment row per resident line and an explicit `Date Of Service` column
- report-style CSV that starts with `Daily Treatment Summary`, then uses `Patient:` header rows followed by treatment detail rows

## Fallback Path

If Net Health only provides the browser print/export PDF layout, the project can now process that format as a fallback.

Supported fallback:

- PDF Daily Treatment Summary saved locally and then converted with:
  - `scripts/Convert-NetHealthTherapyPdfToCsv.ps1`

The canonical source remains native CSV whenever available.

## Compatible Columns

The current therapy normalizer supports these headers:

- `Patient`
- `Date Of Service`
- `Treatment Received`
- `Service Code`
- `Discipline`
- `Minutes`
- `Physician`
- `Wing`
- `Response To Treatment`

## Processing Chain

```powershell
powershell -ExecutionPolicy Bypass -File "D:\SNF AI Dashboard\scripts\Convert-NetHealthTherapyCensusToNormalizedCsv.ps1" -InputPath "D:\SNF AI Dashboard\data\incoming\nethealth_therapy_census.csv"
powershell -ExecutionPolicy Bypass -File "D:\SNF AI Dashboard\scripts\Test-NetHealthTherapyCensusNormalizedCsv.ps1" -Path "D:\SNF AI Dashboard\data\processed\nethealth_therapy_census.normalized.csv"
powershell -ExecutionPolicy Bypass -File "D:\SNF AI Dashboard\scripts\Resolve-NetHealthTherapyResidentsAgainstPcc.ps1"
powershell -ExecutionPolicy Bypass -File "D:\SNF AI Dashboard\scripts\New-CommandCenterTherapyCoverage.ps1"
```

## Expected Outputs

- `D:\SNF AI Dashboard\data\processed\nethealth_therapy_census.normalized.csv`
- `D:\SNF AI Dashboard\data\processed\nethealth_therapy_census.resolved.csv`
- `D:\SNF AI Dashboard\data\processed\command_center_therapy_coverage.csv`
- `D:\SNF AI Dashboard\data\processed\command_center_therapy_coverage.by-unit.csv`

## Known Constraints

- Net Health browser sessions can expire mid-capture.
- The report viewer is paged, so browser scraping is a fallback, not the preferred operational path.
- Browser-print PDF exports can wrap treatment code lines and should be treated as second-choice input compared with native CSV.
- Resident resolution is currently governed by deterministic name matching to the active PCC census. That is acceptable for current operational review, but a direct shared identifier remains the preferred long-term join path.

# Processed Source Files

Normalized source outputs go here after raw intake files are profiled and transformed.

Current first implementation target:

- raw input:
  - `D:\SNF AI Dashboard\data\incoming\pcc_resident_list_current.csv`
- normalized output:
  - `D:\SNF AI Dashboard\data\processed\pcc_resident_list_current.normalized.csv`
- resolved cross-source outputs:
  - `D:\SNF AI Dashboard\data\processed\nethealth_therapy_census.normalized.csv`
  - `D:\SNF AI Dashboard\data\processed\nethealth_therapy_census.resolved.csv`
  - `D:\SNF AI Dashboard\data\processed\command_center_therapy_coverage.csv`
  - `D:\SNF AI Dashboard\data\processed\command_center_therapy_coverage.by-unit.csv`
  - `D:\SNF AI Dashboard\data\processed\nethealth_documentation_due_dates.normalized.csv`
  - `D:\SNF AI Dashboard\data\processed\nethealth_documentation_due_dates.resolved.csv`
  - `D:\SNF AI Dashboard\data\processed\command_center_documentation_queue.csv`
  - `D:\SNF AI Dashboard\data\processed\command_center_documentation_queue.by-unit.csv`
  - `D:\SNF AI Dashboard\data\processed\command_center_therapy_documentation_priority.csv`
  - `D:\SNF AI Dashboard\data\processed\command_center_therapy_documentation_priority.by-unit.csv`
  - `D:\SNF AI Dashboard\data\processed\command_center_operational_summary.md`

Rules:

- keep raw source files in `data\incoming`
- do not overwrite the landed source extract
- generated files in this folder should be reproducible from a raw input file and a script
- when a source extract lacks governed resident IDs, preserve the source-facing display name in normalization and resolve to PCC resident IDs in a separate reproducible step

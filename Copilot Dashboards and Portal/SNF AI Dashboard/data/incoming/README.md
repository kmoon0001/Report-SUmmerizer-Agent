# Incoming Source Files

Drop real source extracts here for profiling and source-to-model implementation work.

## First Priority Source

Use PCC to export the first real source for the resident census base model.

Preferred file order:

1. `pcc_resident_list_current.csv`
2. `nethealth_therapy_census.csv`
3. `nethealth_documentation_due_dates.csv`

## File Rules

- Prefer `CSV` over `XLSX`.
- Keep original column names.
- Do not rename or reorder columns before intake.
- If PHI is present, keep the file local in this workspace and do not move it into chat or external docs.
- If you export multiple tabs or reports, keep one file per report.

## What To Tell The Agent

After you place a file here, provide:

- filename
- source system
- what one row represents
- refresh cadence
- any known sensitive columns

## Recommended First Question

For the first implementation, the preferred business question is:

`Who is in the facility right now, where are they located, and what current-state census gaps need attention before enrichment?`

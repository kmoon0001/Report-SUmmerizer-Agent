# Net Health Documentation Resolution Report

## Summary

- Source file: `D:\SNF AI Dashboard\data\incoming\nethealth_documentation_due_dates.csv`
- Normalized rows: `133`
- Resolved to current PCC residents: `129`
- Unresolved rows: `4`

## Resolution Method

- Net Health documentation rows were normalized first.
- Where the source extract did not expose governed resident IDs, the normalization step preserved resident display names and created a deterministic name key.
- The resolution step matched those rows against the current PCC active census using last-name plus first-token matching.
- Matched rows inherited PCC `ResidentSourceId`, unit, floor, room, and bed metadata.

## Unresolved Rows

The unresolved rows were:

- `HAMPTON, CHRISTOPHER K` `D/C Summary` due `2026-04-01` status `Completed`
- `HAMPTON, CHRISTOPHER K` `D/C Summary` due `2026-04-01` status `Completed`
- `TIU, JOYCE P` `D/C Summary` due `2026-04-03` status `Completed`
- `TIU, JOYCE P` `D/C Summary` due `2026-04-03` status `Completed`

These did not resolve because they were not present in the current PCC active census at extraction time.

## Operational Impact

- The current-state command-center queue is safe to drive from the `129` resolved rows.
- Unresolved rows should remain outside the active queue until a historical census or discharge crosswalk is introduced.

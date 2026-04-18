# Therapy And Documentation Command Center Spec

## Purpose

Define the first cross-source operational page that combines the real PCC resident census base with Net Health therapy and documentation enrichment.

## Audience

- therapy leadership
- clinical operations
- documentation owners
- executive operations

## Core Questions

- which current residents have active therapy cases
- where are therapy cases concentrated by unit and discipline
- where are daily treatment minutes concentrated by unit and clinician
- where are overdue documentation items accumulating
- which residents need immediate therapy or documentation follow-up

## Data Sources

- PCC current resident census:
  - `mart.vw_CurrentResidentCensusDetail`
- Net Health therapy enrichment:
  - `mart.vw_CurrentResidentTherapyCoverage`
  - intermediate current-state file workflow:
    - `nethealth_therapy_census.normalized.csv`
    - `nethealth_therapy_census.resolved.csv`
    - `command_center_therapy_coverage.csv`
    - `command_center_therapy_coverage.by-unit.csv`
- Net Health documentation enrichment:
  - `mart.vw_DocumentationOverdueByDiscipline`
  - `mart.vw_CommandCenterResidentTherapyDocumentation`
  - intermediate current-state file workflow:
    - `nethealth_documentation_due_dates.normalized.csv`
    - `nethealth_documentation_due_dates.resolved.csv`
    - `command_center_documentation_queue.csv`
    - `command_center_documentation_queue.by-unit.csv`

## Visuals

### KPI cards

- current residents with active therapy
- active therapy case count
- overdue documentation count
- residents with both therapy and overdue documentation
- current-resident documentation queue count

### Unit by therapy coverage matrix

- rows:
  - `UnitCode`
- values:
  - current resident count
  - active therapy case count
  - residents with active therapy

### Overdue documentation by discipline

- axis:
  - discipline
- values:
  - overdue document count

### Resident priority queue

- columns:
  - resident name
  - resident source ID
  - unit
  - active therapy case count
  - total treatment minutes
  - overdue document count
  - priority score

## Initial Acceptance Logic

- residents shown must exist in current PCC census
- no resident should appear without a governed resident source ID
- documentation and therapy counts must tie back to their Net Health load batch
- if a Net Health documentation row cannot resolve to a current PCC resident, it must stay out of the current-state queue and be reviewed separately

## Current Real-Data Findings

- first live Net Health documentation extract produced `133` normalized rows
- `129` rows resolved to active PCC residents using deterministic name-key matching
- `4` unresolved rows were all completed discharge-summary items for residents not present in the current PCC census
- unit distribution of the current-resident documentation queue:
  - `A: 54`
  - `B: 23`
  - `C: 22`
  - `D: 30`
- the combined resident-priority queue is generated from:
  - `command_center_therapy_coverage.csv`
  - `command_center_documentation_queue.csv`

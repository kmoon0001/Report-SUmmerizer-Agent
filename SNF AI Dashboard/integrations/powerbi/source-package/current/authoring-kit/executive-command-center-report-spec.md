# Executive Command Center Report Spec

## Purpose

Define the first executive-facing page that rolls PCC census, Net Health documentation, and Net Health therapy into one operational command-center summary.

## Audience

- executive operations
- administrator
- director of nursing
- rehab director
- quality leadership

## Core Questions

- what is the current resident census and how is it distributed by unit
- where are documentation burdens accumulating
- where is therapy workload concentrated
- which residents are highest priority for combined therapy and documentation follow-up

## Source Files And Views

### Current landed files

- `pcc_resident_list_current.active-only.csv`
- `command_center_documentation_queue.csv`
- `command_center_documentation_queue.by-unit.csv`
- `command_center_therapy_coverage.csv`
- `command_center_therapy_coverage.by-unit.csv`
- `command_center_therapy_documentation_priority.csv`
- `command_center_therapy_documentation_priority.by-unit.csv`
- `command_center_patient_insights.csv`
- `command_center_automated_handoff_queue.csv`
- `command_center_automated_handoff_queue.by-unit.csv`

### SQL views

- `mart.vw_CurrentResidentCensusByUnit`
- `mart.vw_CurrentResidentTherapyCoverage`
- `mart.vw_CurrentResidentTherapyCoverageByUnit`
- `mart.vw_DocumentationOverdueByDiscipline`
- `mart.vw_CommandCenterResidentTherapyDocumentation`

## KPI Cards

- current resident census
- outstanding documentation items
- overdue documentation items
- residents with therapy activity
- total therapy minutes
- residents in combined priority queue

## Visuals

### Unit operations matrix

- rows:
  - `UnitCode`
- values:
  - current residents
  - outstanding docs
  - overdue docs
  - residents with therapy
  - total therapy minutes

### Discipline documentation chart

- axis:
  - discipline
- values:
  - overdue documentation count

### Therapy workload by unit

- axis:
  - unit
- values:
  - treatment line count
  - total therapy minutes
  - unique residents treated

### Resident priority table

- columns:
  - resident name
  - resident source ID
  - unit
  - therapy line count
  - therapy minutes
  - outstanding doc count
  - overdue doc count
  - priority score

### Patient insight table

- columns:
  - resident name
  - location (unit / room)
  - latest vitals summary (when vitals source is present)
  - documentation status (outstanding and overdue)
  - therapy workload (minutes and lines)
  - progress level
  - things to look out for
  - copilot agent insight
  - priority score and band

### Executive HTML bundle

- the repo-generated HTML bundle should show:
  - the six KPI cards
  - a unit intensity section
  - top priority residents
  - patient insights with search
  - automated handoff queue
  - documentation by discipline
  - therapy by discipline
  - recent operational history
- the bundle should also emit a machine-readable JSON payload for downstream apps and future dashboard surfaces

## Operational Rules

- if therapy is not landed yet, the report still renders with census and documentation sections populated
- combined priority queue should only render when both therapy coverage and documentation queue are available
- unit totals must reconcile to the underlying landed files or matching SQL snapshot
- patient-scoring thresholds must be controlled by `contracts/patient-insight-scoring.json`, not hard-coded in script logic

## First Acceptance Criteria

- census matches the PCC active-only file row count
- documentation totals match `command_center_documentation_queue.csv`
- therapy totals match `command_center_therapy_coverage.csv`
- top resident priority rows match `command_center_therapy_documentation_priority.csv`

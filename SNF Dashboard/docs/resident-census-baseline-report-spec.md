# Resident Census Baseline Report Spec

## Purpose

Define the first report-ready output built from the real PCC resident census implementation.

## Audience

- executive operations
- admissions and case management leadership
- unit-level nursing and operational supervisors

## Primary Questions

- who is currently in the facility
- how is census distributed across units
- who was admitted recently
- are there any current-state data quality exceptions that block safe operational use

## Data Sources

- PCC resident census active-only processed file
- SQL objects:
  - `mart.vw_CurrentResidentCensusDetail`
  - `mart.vw_CurrentResidentCensusByUnit`
  - `mart.vw_CurrentResidentRecentAdmissions`
  - `mart.vw_CurrentResidentCensusQualityExceptions`

## Visuals

### KPI cards

- current resident census
- units with active residents
- recent admissions in last 7 days
- current quality exceptions

### Unit census matrix

- rows:
  - `UnitCode`
- columns:
  - `CurrentResidentCount`
  - `AverageAgeYears`
  - `EarliestAdmissionDate`
  - `LatestAdmissionDate`

### Recent admissions table

- columns:
  - resident name
  - resident source ID
  - unit
  - admission date
  - length of stay days

### Quality exception table

- columns:
  - resident name
  - resident source ID
  - unit
  - room
  - bed
  - exception type

## Slicers

- snapshot date
- unit
- floor

## Operational Rules

- default page state should show the latest snapshot date
- exception visuals must remain visible even when count is zero
- current resident census must always reconcile to the active-only processed file row count for the selected snapshot

## Initial Acceptance Criteria

- total census equals `162` for the current extracted snapshot
- unit distribution equals:
  - `D = 54`
  - `A = 41`
  - `B = 34`
  - `C = 33`
- quality exception count equals `0`

## Next Extension

After this baseline report is stable:

1. add Net Health therapy census enrichment
2. add recent-admission drillthrough to therapy case detail
3. add documentation due-date exceptions

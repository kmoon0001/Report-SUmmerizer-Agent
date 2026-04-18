# PCC Resident Census First Implementation

## Objective

Build the first real source-to-model implementation from PointClickCare `Resident Listing Report`.

This is the base operational census layer for the SNF Command Center and the first conformed resident and episode model.

## Why This Is First

- live source already verified in browser
- facility-wide report, not a single-resident workflow
- output supports operational filtering and export
- source grain is stable enough to build the first dimensional layer
- Net Health can enrich this base later for therapy and documentation

## Live Observations From Current PCC Output

- report:
  - `Resident Listing Report`
- facility:
  - `Sea Cliff Healthcare Center`
- filters observed:
  - `Resident: All`
  - `Unit: All`
  - `Floor: All`
- output columns observed:
  - `Name`
  - `Age`
  - `Location (Fl Un Rm Bd)`
  - `Admission Date`
  - `Status`
- total rows reported in current HTML output:
  - `8731 resident(s)`
- status values observed:
  - `Active`
  - `Discharge`
- data quality behaviors observed:
  - some rows have missing location
  - some rows have missing admission date
  - some rows have missing status
  - resident identifier is embedded in the name field in parentheses

## First Source File Contract

- expected filename:
  - `pcc_resident_list_current.csv`
- landing folder:
  - `D:\my agents copilot studio\SNF Dashboard\data\incoming`
- source system:
  - `PointClickCare EFS`
- source report:
  - `Resident Listing Report`
- required output format:
  - `CSV`
- recommended source filter:
  - `Status = Current`

Observed behavior from actual export:

- the downloaded PCC CSV still included non-current rows
- therefore the implementation derives the current-state census from `ResidentStatusNormalized = Active`
- the active-only processed file is the operational first-load source

Operational processed outputs:

- normalized full extract:
  - `D:\my agents copilot studio\SNF Dashboard\data\processed\pcc_resident_list_current.normalized.csv`
- current-state active-only extract:
  - `D:\my agents copilot studio\SNF Dashboard\data\processed\pcc_resident_list_current.active-only.csv`

## Source Grain

- one row per resident returned by the PCC report at extract time

If the file is filtered to `Current`, the business grain becomes:

- one row per current resident at facility snapshot time

## Target Model Scope

### Target dimensions

- `DimResident`
- `DimEpisode`
- `DimUnit`
- `DimDate`

### Target fact

- `FactResidentCensusSnapshot`

## Core Transformations

### Resident identifier parsing

Source example:

- `ABARCA, ARMIDA (23401)`

Rules:

- `ResidentDisplayName` = full source text before parsing
- `ResidentName` = text before the last `(` trimmed
- `ResidentSourceId` = text inside the final parentheses

### Location parsing

Source example:

- `1 A 001 C`

Rules:

- split by whitespace
- map to:
  - `FloorCode`
  - `UnitCode`
  - `RoomCode`
  - `BedCode`
- if fewer than four tokens are present:
  - keep raw value
  - set parsed components only where present

### Status normalization

Rules:

- `Active` -> `Active`
- `Discharge` -> `Discharged`
- blank -> `Unknown`
- any other value -> preserve raw value and set normalized status to `Other`

### Date handling

- parse `Admission Date` as local facility date
- invalid or blank dates remain null
- load `SnapshotDateKey` and `SnapshotDateTime` from extract runtime, not the report row

## Initial Reporting Questions Supported

Once this table is loaded, the system can answer:

- how many current residents are in facility today
- how many by unit, floor, room, and bed
- which residents have missing location or missing admission date
- which current residents were admitted most recently
- how census changes when compared across snapshot dates

## Known Limits Of First Implementation

- no therapy discipline detail yet
- no Section GG or functional outcomes yet
- no payer detail from this minimal column set yet
- no real clinical risk score yet
- no episode close/open logic beyond current source status

## Immediate Enrichment After Base Load

Use Net Health next for:

- `therapyCensus`
- `clinicalOutcomesByDiagnosticCategory`
- `functionalOutcomeMeasuresTable`
- `documentationDueDates`

That second step should attach therapy episode and documentation detail to the PCC resident base.

## Implementation Sequence

1. Export `pcc_resident_list_current.csv`
2. Profile the file in `data/incoming`
3. Load to `stg.PccResidentList`
4. Normalize to `DimResident`, `DimEpisode`, `DimUnit`
5. Derive active-only current census
6. Load `FactResidentCensusSnapshot`
7. Add daily snapshot retention
8. Add Net Health enrichment once the first therapy extract is available


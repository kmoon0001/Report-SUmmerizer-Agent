# PCC Resident List Report Source Profile

## Purpose

Document the first real PCC source candidate for the SNF Command Center source-to-model build.

## Report Identity

- Source system: `PointClickCare EFS`
- Report name: `Resident List Report *NEW*`
- Setup page title: `Resident Listing Report - Report Setup`
- Current facility observed:
  - `Sea Cliff Healthcare Center`
  - PCC facility ID `223`
  - internal facility ID `58`
- Organization UUID:
  - `50B2F434-D827-403C-ADA6-74F4B2D0A59B`

## Why This Is The Best First Source

- facility-wide rather than single-resident
- export-oriented
- supports `CSV`, `HTML`, and `EXCEL`
- exposes operational filters that align to command-center reporting
- exposes a broad field catalog that can seed the first dimensions and facts

## Observed Filter Surface

- unit
  - `All`, `A`, `B`, `C`, `D`
- floor
  - `All`, `1`
- status
  - `All`, `Current`, `Discharged`, `Other`
- gender
  - `All`, `Female`, `Male`, `Unknown`
- waiting list
- admission date range
- admission date in quarter
- discharge date range
- deceased date range
- primary physician
- include inactive UDF
- excluded from late fee charges
- rate type

## Observed Output Format Surface

- `HTML`
- `CSV`
- `EXCEL`

## Observed Sort Surface

- resident name
- resident number
- location
- age
- discharge date
- admission date

## High-Value Field Families

### Resident Core

- name
- preferred name
- resident status
- age
- gender
- location

### Dates

- birth date
- original admission date
- initial admission date (MDS)
- admission date
- estimated discharge date
- discharge date
- deceased date

### Clinical / Operational

- primary physician
- primary diagnosis
- allergies
- weight
- height
- admission from type
- admission from location

### Identity / Coverage

- Medicare number
- Medicaid number
- social security number
- medical record tracking number
- Medicare beneficiary ID
- primary insurance ID
- secondary insurance ID

### Utilization / Placement

- waiting list
- rate type
- desired location
- facility relationships
- home health / hospice
- rehab consultant group
- acute rehab
- rehabilitation hospital

### User-Defined / Site-Specific

- DRG diagnosis-related group
- telehealth consent
- pre-auth waived
- reason for readmission
- transfer-in date
- wound care physician
- admitting physician
- referrals
- readmission flags
- Medicaid recertification date
- veterans / military service

## Recommended First Extract Settings

- format:
  - `CSV`
- unit:
  - `All`
- floor:
  - `All`
- status:
  - `Current`

Rationale:
- gives a current-state resident census grain
- limits the first model to active operational residents
- avoids mixing discharged and historical records on the first pass

## Recommended First Model Grain

- one row per current resident at facility snapshot time

## Recommended First Dimensions

- `DimResident`
- `DimUnit`
- `DimPhysician`
- `DimRateType`
- `DimDate`

## Recommended First Fact

- `FactResidentCensusSnapshot`

## Fields To Prioritize In The First Build

- resident identifier
- resident number / MRN
- resident name
- unit
- location
- resident status
- gender
- age
- birth date
- admission date
- original admission date
- estimated discharge date
- primary physician
- primary diagnosis
- rate type
- waiting list flag

## Fields To Exclude Or Govern Tightly

- social security number
- Medicare number
- Medicaid number
- insurance IDs
- direct personal contact details
- email address

These should not be brought into broad analytics unless there is a clear operational need and governance approval.

## Build Implication

This report should be the first real extract placed into:

- `D:\my agents copilot studio\SNF Dashboard\data\incoming`

Preferred filename:

- `pcc_resident_list_current.csv`

## Follow-On Source After This One

After the resident list extract is modeled:

1. therapy-focused PCC report if a facility-wide therapy extract is available
2. Power BI therapy/outcomes semantic model for alignment and enrichment
3. documentation or action summary report for operational follow-up metrics


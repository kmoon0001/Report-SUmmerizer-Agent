# Net Health Therapy And Documentation Enrichment Plan

## Objective

Define the second-source implementation path that enriches the PCC resident census base with therapy and documentation operations from Net Health.

## Why These Two Extracts Come First

### `DailyTreatmentSummary`

This is the fastest way to add:

- real daily treatment detail
- discipline-level operational visibility
- current-day therapy workload
- a clearer bridge from census to outcomes

### `documentationDueDates`

This is the fastest way to add:

- overdue document visibility
- role-based remediation queues
- therapy documentation timeliness
- operational workload and compliance tracking

## Expected Files

- `D:\my agents copilot studio\SNF Dashboard\data\incoming\nethealth_therapy_census.csv`
- `D:\my agents copilot studio\SNF Dashboard\data\incoming\nethealth_documentation_due_dates.csv`

## Required Join Strategy

Preferred matching order:

1. direct resident or patient identifier shared across extracts
2. medical record number or facility resident number
3. resident name plus admission or episode date under controlled review

Operational rule:

- do not silently join Net Health to PCC on name only in production logic
- if direct identifiers are not available, the enrichment must stay in review status until a governed crosswalk is established

## Net Health Therapy Census Target Model

### Source grain

- one row per resident treatment line on the Net Health Daily Treatment Summary report

### Target dimensions

- `DimDiscipline`
- `DimTherapyCase`

### Target facts

- `FactTherapyCaseSnapshot`

### Required fields

- resident display name
- derived treatment-case identifier
- discipline
- service date
- minutes
- physician or assigned clinician
- wing or location indicator if present
- treatment code list

## Net Health Documentation Due Dates Target Model

### Source grain

- one row per document due item

### Target dimensions

- `DimClinician`
- `DimDocumentType`

### Target facts

- `FactDocumentationTask`

### Required fields

- patient or resident identifier
- case identifier if present
- clinician identifier
- clinician discipline or role
- document type
- due date
- completion date if present
- document status

## Reporting Outcomes Enabled

After these enrichments land, the project can support:

- therapy census by discipline and unit
- therapy caseload exceptions by resident
- overdue documentation by discipline and clinician
- therapy documentation timeliness
- resident drillthrough from census -> therapy case -> documentation task

## Load Order

1. PCC resident census base load
2. Net Health daily treatment load
3. Net Health documentation due dates load
4. resident-to-therapy enrichment views
5. documentation exception views


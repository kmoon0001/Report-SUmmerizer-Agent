# Reporting Data Model And Priority Plan

## Current Data We Actually Have

The current project now has a verified first operational source path, not just planned reporting entities.

Verified live source surfaces:

- PCC `Resident Listing Report`
- Net Health Sea Cliff therapy environment with report and export permissions
- Power BI therapy/outcomes workspace and report IDs

### Core grain candidates

- `PatientId`
  Patient-level grain for risk, safety, care plan, and individual overview reporting.
- `EpisodeOfCare`
  Stay-level grain for admissions, discharge, readmission, and episode outcomes.
- `EncounterId`
  Event-level grain for contact, documentation, and audit workflows.
- `Unit`
  Operational grain for staffing, patient flow, and surveillance dashboards.
- `RoomBed`
  Bed-management and environmental safety grain.

### High-value domains already modeled

- Identity and context
  `PatientId`, `EpisodeOfCare`, `EncounterId`, `Unit`, `RoomBed`
- Security and privacy
  `AssignedRole`, `ConsentFlag`
- Clinical safety
  `CodeStatus`, `AllergyList`, `MedicationList`, `ActiveProblems`, `VitalSignsTrend`
- Analytics and workflow state
  `RiskScore`, `CarePlanPhase`, `AlertSeverity`, `DocumentationStatus`

Authoritative local sources:
- [Clinical_Data_Dictionary.csv](D:\my agents copilot studio\SNF Dashboard\SNF_Command_Center_Starter_Bundle\00_ReadMe_and_Governance\Clinical_Data_Dictionary.csv)
- [Quality_Measure_Specification_Library.csv](D:\my agents copilot studio\SNF Dashboard\SNF_Command_Center_Starter_Bundle\00_ReadMe_and_Governance\Quality_Measure_Specification_Library.csv)
- [Clinical_Page_Specifications.csv](D:\my agents copilot studio\SNF Dashboard\SNF_Command_Center_Starter_Bundle\03_Clinical_Dashboard_and_Visualization_Specs\Clinical_Page_Specifications.csv)
- [ActionContractManifest.json](D:\my agents copilot studio\SNF Dashboard\contracts\ActionContractManifest.json)

## Reporting Architecture That Fits This Data

### Recommended semantic layers

1. `DimResident`
   Stable resident identity, demographics, assigned unit, room/bed, and PCC source identifier.
2. `DimEpisode`
   Admission, discharge, payer, care phase, diagnosis grouping, service line.
3. `DimDate`
   Daily, weekly, monthly, quarter-to-date, rolling 30-day logic.
4. `DimUnit`
   Facility, unit, building, bed zone, staffing region.
5. `DimMeasure`
   Measure family, owner, cadence, numerator, denominator, target, benchmark.
6. `FactResidentCensusSnapshot`
   Resident census state by resident, episode, unit, room, bed, and snapshot date.
7. `FactRiskSnapshot`
   Risk score by resident, episode, unit, date, model version.
8. `FactClinicalEvent`
   Falls, infection events, medication events, pressure injuries, alerts.
9. `FactDocumentationTask`
   Documentation completeness, overdue status, remediation, signer role.
10. `FactWorkflowAlert`
   Alert creation, severity, escalation path, completion, acknowledgement.
11. `FactQualityMeasurePeriod`
    Period-based measure results with numerator, denominator, rate, target gap.

### Best report grain by page

- Executive Operations Command Center
  Unit-day and facility-day
- Patient Safety And Risk Surveillance
  Patient-day and patient-event
- Therapy Productivity And Outcomes
  Episode-day and discipline-day
- Infection Control And Surveillance
  Unit-day and patient-event
- Medication Safety And Stewardship
  Medication order and patient-event
- Staffing Optimization And Workload Balance
  Unit-shift
- Quality Measures And Regulatory Compliance
  Measure-period and unit-period
- Patient Flow And Bed Management
  Bed-day and discharge-readiness event
- Clinical Documentation Completeness
  Document-task and patient-day
- Individual Patient Clinical Overview
  Patient current-state and event timeline

## Most Actionable First Reports

These are the highest-value reports based on the data already modeled and the operational questions already defined.

### 0. Resident Census Baseline

Why now:
- first source is directly evidenced in PCC
- required before risk, quality, documentation, and flow reporting become trustworthy
- supports real operational bed, unit, and census tracking immediately

Core visuals:
- current resident census by unit
- current resident census by room and bed
- new admissions by day
- missing-location and missing-admission-date exception queue

Minimum required fields:
- resident source ID
- resident name
- unit
- floor
- room
- bed
- admission date
- resident status
- snapshot datetime

### 1. Patient Safety And Risk Surveillance

Why first:
- strong clinical value
- aligns with existing `RiskScore`, vitals trend, active problems, alert severity
- immediately usable for nurse managers and clinical leads

Core visuals:
- high-risk patient queue
- patient-by-risk heatmap by unit
- trend of rising-risk patients over 7 and 30 days
- drillthrough to individual patient overview

Minimum required fields:
- `PatientId`
- `EpisodeOfCare`
- `Unit`
- `RiskScore`
- `VitalSignsTrend`
- `ActiveProblems`
- `AlertSeverity`
- `CarePlanPhase`

### 2. Clinical Documentation Completeness

Why second:
- defined in the data dictionary and page specification
- directly actionable
- easier to implement than predictive/real-time pages

Core visuals:
- incomplete note funnel by discipline
- overdue documentation heatmap by unit and role
- remediation queue by owner
- signature compliance trend

Minimum required fields:
- `PatientId`
- `EncounterId`
- `Unit`
- `AssignedRole`
- `DocumentationStatus`
- note type
- due datetime
- completion datetime

### 3. Quality Measures And Regulatory Compliance

Why third:
- already has starter measure library
- executive and survey-readiness value
- ties to monthly and weekly cadence already modeled

Core visuals:
- off-target measure scorecard
- numerator/denominator trend by period
- variance-to-target table
- unit-level outlier drillthrough

Minimum required fields:
- `MeasureName`
- period start/end
- `Unit`
- numerator
- denominator
- calculated rate
- target
- owner

### 4. Patient Flow And Bed Management

Why fourth:
- strong operational leverage
- creates visible command-center value quickly

Core visuals:
- bed status board
- discharge readiness blockers
- transfer bottlenecks by unit
- time-to-placement trend

Minimum required fields:
- `PatientId`
- `EpisodeOfCare`
- `Unit`
- `RoomBed`
- readiness status
- blocker category
- expected discharge date

## Current Data Gaps Blocking Better Reports

These are the biggest missing fields, not just missing integrations.

### Missing dimensions

- patient demographics and payer
- discipline and staff identity model
- facility hierarchy beyond `Unit`
- document type taxonomy
- medication order detail

### Missing timestamps

- event occurrence datetime
- alert acknowledgement datetime
- documentation due/completed datetime
- discharge-ready datetime
- transfer requested/completed datetime

### Missing benchmarks

- measure targets
- unit baselines
- peer comparison benchmark
- alert thresholds

### Missing lineage fields

- source extraction timestamp
- model version
- refresh batch ID
- record provenance

## Recommended Build Order

1. Build the resident census base:
   `DimResident`, `DimEpisode`, `DimDate`, `DimUnit`, `FactResidentCensusSnapshot`
2. Add Net Health enrichment for therapy and documentation:
   therapy census, outcomes, documentation due dates
3. Build next facts:
   `FactRiskSnapshot`, `FactDocumentationTask`, `FactQualityMeasurePeriod`
4. Deliver first four reports:
   Resident Census Baseline, Patient Safety, Documentation Completeness, Quality/Compliance
5. Add drillthrough:
   unit -> patient -> timeline
6. Add alert/action tables:
   acknowledgement, remediation owner, next step, due date

## What Will Make Reports Actually Actionable

- Every red tile needs an owner.
- Every outlier needs a drillthrough path.
- Every predictive score needs a next-step recommendation.
- Every delayed metric needs refresh timestamp and source label.
- Every executive KPI needs the queue behind it.

## Immediate Data Collection Priority

To move from scaffold to real reporting, prioritize collecting these fields first:

1. PCC resident census extract with resident ID, admission date, unit, room, bed, and status
2. Net Health therapy census extract with resident and discipline episode fields
3. Net Health documentation due dates extract with due/completion/signer fields
4. risk or alert snapshot with resident/date/score/severity
5. quality measure extract with numerator/denominator/period/unit

## Current Cross-Source Rollup Layer

The project now has a real cross-source operational rollup path even before every downstream dashboard is finished.

Current cross-source artifacts:

- `command_center_documentation_queue.csv`
- `command_center_documentation_queue.by-unit.csv`
- `command_center_therapy_coverage.csv`
- `command_center_therapy_coverage.by-unit.csv`
- `command_center_therapy_documentation_priority.csv`
- `command_center_therapy_documentation_priority.by-unit.csv`
- `command_center_operational_summary.md`

This layer is intended to give executive, rehab, and operations leadership a current-state command-center summary while the deeper semantic model, SQL deployment, and final Power BI pages continue to mature.

## Recommended Next Build Artifact

Create a source-controlled semantic model crosswalk that maps:
- source system table
- target dimension or fact
- business grain
- join key
- refresh cadence
- PHI classification

That should become the implementation contract for Fabric and Power BI.


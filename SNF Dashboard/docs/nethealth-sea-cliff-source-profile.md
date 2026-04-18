# Net Health Sea Cliff Source Profile

## Purpose

Document the live Net Health therapy environment that can supply real source data, metadata, report inventory, and export candidates for the SNF Command Center build.

## Environment Identity

- product:
  - `Net Health Therapy / Optima Unity`
- base URL:
  - `https://ensg.optima-unity.nethealth.com/`
- organization code:
  - `ensg`
- facility:
  - `Sea Cliff Healthcare Center`
- Net Health facility ID:
  - `333`
- facility code:
  - `SE`
- external facility ID:
  - `223`
- build version:
  - `26.04.02.304`

## Facility Metadata

- healthcare setting:
  - `Skilled Nursing Facility`
- primary healthcare setting:
  - `SkilledNursingFacility`
- address:
  - `18811 Florida Street, Huntington Beach, CA 92648`
- time zone:
  - `America/Los_Angeles`
- chain ID:
  - `5`
- NPI:
  - present and verified

## Facility Disciplines Enabled

- `Nursing`
- `Physical Therapy`
- `Occupational Therapy`
- `Speech Therapy`

## Active Applications

- `Patient Management`
- `Rehab Optima`
- `Billing`
- `Advanced Clinical Documentation`
- `ADT Integration`
- `Electronic Signatures for Charges`
- `Electronic Signatures for Clinical Documents`
- `Appointment Book`
- `Customer Portal`
- `Customer Portal Patient Info`
- `Appeals Management`
- `Clinical Outcomes`
- `Business Intelligence`
- `CliniSign`
- `NPI Verification`
- `Labor Import`

## User-Level Role Surface Observed

- `Hotlist`
- `Resident`
- `TherapyTracks`
- `Labor`
- `E-Signatures`
- `Scheduling`
- `Reports`
- `DailyActivityLog`
- `TimeClock`
- `Exports`
- `BI-Roles`
- `Scheduling - Point of Care`
- `OrdersManagement`

## Workplace Parts Observed

- `My Day`
- `Messages`
- `Announcements`
- `Favorites`
- `My Performance`
- `Web Site`

## High-Value Report And Data Surfaces Enabled

### Therapy / Outcomes

- `clinicalOutcomesByDiagnosticCategory`
- `functionalOutcomeMeasuresChart`
- `functionalOutcomeMeasuresPatientWorksheet`
- `functionalOutcomeMeasuresTable`
- `sectionGGAssessmentsByPatient`
- `sectionGGOutcomeDetail`
- `sectionGGOutcomeSummary`
- `pdpmCalculationWorksheet`
- `therapyCensus`
- `partAGroup`
- `partAGroupByFacility`
- `partBCapManagement`
- `mdsRehabData`
- `mdsRehabDataList`

### Scheduling / Caseload / Service Delivery

- `careProviderDailySchedule`
- `dailyTherapySchedule`
- `patientAppointmentsRpt`
- `patientScheduleForStaff`
- `caseloadManager`
- `serviceLogMatrix`
- `therapistVisitReq`

### Documentation / Compliance

- `documentationDueDates`
- `missingSectionGGAssessmentsReport`
- `missingSignatures`
- `missingVisit`
- `dailyTreatmentLog`
- `dailyTreatmentSummary`
- `dailyTENSummary`
- `weeklyTENDetail`
- `goalStatus`

### Labor / Productivity

- `laborActivity`
- `laborActivity_ByDateRange`
- `myLaborLog`
- `logLabor`
- `logDriveTime`
- `logMileage`
- `logBenefitTime`
- `logNPCData`

### Resident / Case / Encounter

- `patientCase`
- `patientList`
- `patientDetails`
- `patientEncountersReport`
- `residentDiagnosis`
- `residentPayer`
- `stay`
- `hospitalStay`
- `newAdmit`
- `readmit`

### Export Surface

- `billingDataExportAllowReviewAndSaveAs`

## Clinical Documentation Surface

The environment has enabled advanced clinical documentation rights for therapy disciplines, including:

- PT documents
- OT documents
- ST documents
- Section GG clinical documentation
- evaluation
- progress note
- recertification
- reassessment
- resumption
- transfer
- discharge

This makes Net Health a strong source for documentation timeliness and completeness reporting in addition to therapy outcomes.

## Configuration Signals Relevant To Modeling

- `evalOnlyEnabled = true`
- `ggInterimEnabled = true`
- `ggEnabledOnPatientCase = true`
- `ggCopyFromCareEnabled = true`
- `ggIncludeInMDSResponse = true`
- `allowConcurrentCases = true`
- `roTrackRequireEndReason = true`
- `icd10CollectImmediately = true`
- `reportsForceRemote = false`

These imply that:

- Section GG is materially present in the workflow
- therapy case progression and discharge logic are important model elements
- documentation and report outputs likely reflect active SNF rehab operations rather than a minimal deployment

## Build Recommendation

Net Health should be treated as a first-class source for:

1. therapy census
2. clinical outcomes
3. Section GG and functional outcomes
4. documentation due dates and missing signatures
5. labor and productivity

## Best First Net Health Extract Candidates

1. `therapyCensus`
2. `clinicalOutcomesByDiagnosticCategory`
3. `functionalOutcomeMeasuresTable`
4. `documentationDueDates`
5. `dailyTreatmentLog`
6. `patientEncountersReport`

## Relationship To PCC

Use PCC first for:

- broad resident census
- facility-wide resident and stay context
- resident demographics and placement

Use Net Health next for:

- therapy episode detail
- functional outcomes
- Section GG
- documentation due-date and signature gaps
- labor/productivity

## Immediate Next Step

Find the Net Health route or export path for one of these first:

- `therapyCensus`
- `clinicalOutcomesByDiagnosticCategory`
- `documentationDueDates`

Then export the result to:

- `D:\my agents copilot studio\SNF Dashboard\data\incoming`


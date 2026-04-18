# SNF Command Center Clinical Data Model Diagram

```text
Facility
  |
  +-- Unit
  |     |
  |     +-- Room
  |           |
  |           +-- Bed
  |
  +-- StaffAssignment
  |     |
  |     +-- StaffMember
  |           |
  |           +-- Role
  |
  +-- Patient
        |
        +-- ConsentFlag
        +-- EpisodeOfCare
        |     |
        |     +-- Encounter
        |     |     |
        |     |     +-- Observation
        |     |     +-- Procedure
        |     |     +-- Assessment
        |     |     +-- SafetyEvent
        |     |     +-- InfectionEvent
        |     |     +-- TherapySession
        |     |     +-- DocumentationItem
        |     |
        |     +-- CarePlan
        |     |     |
        |     |     +-- CareGoal
        |     |     +-- Intervention
        |     |     +-- CarePlanVariance
        |     |
        |     +-- MedicationOrder
        |     |     |
        |     |     +-- MedicationAdministration
        |     |     +-- MedicationReconciliation
        |     |
        |     +-- LabResult
        |     +-- ImagingResult
        |     +-- RiskScore
        |     +-- Alert
        |     +-- WorkflowRun
        |
        +-- FamilyContact
        +-- SDOHFactor

Reference dimensions
  |
  +-- DiagnosisTerminology
  +-- ProcedureTerminology
  +-- MedicationDictionary
  +-- MeasureDefinition
  +-- ClinicalPathway
  +-- RegulatoryRequirement
```

## Relationship Notes

- One patient can have many episodes of care.
- One episode can have many encounters, observations, meds, care plans, alerts, and workflow runs.
- Risk scores are computed from episode-level and encounter-level facts.
- Staff assignments connect users, roles, units, and patients for dynamic security.
- Consent flags and care-team assignment are first-class security drivers.
- Gold-layer patient summaries should be derived from episode, encounter, medication, assessment, and care-plan facts.

## Medallion Mapping

- Bronze: raw FHIR resources, exports, logs, notifications, and file drops.
- Silver: conformed Patient, EpisodeOfCare, Encounter, Observation, MedicationOrder, Procedure, Assessment, CarePlan, and Alert entities.
- Gold: patient summaries, unit dashboards, risk scores, quality measures, staffing views, and workflow backlog aggregates.
- Platinum: de-identified quality-improvement and research-ready datasets when policy permits.

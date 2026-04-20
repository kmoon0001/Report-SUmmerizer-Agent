# Resident Outlier Review Protocol

## Purpose

This document defines the protocol and required data fields for resident-specific outlier analysis within the SimpleLTC QM Coach agent. It governs the RESIDENT OUTLIER ANALYSIS topic workflow, ensuring HIPAA compliance, minimum necessary data use, and structured clinical review.

## Authoritative Sources

- CMS Medicare Benefit Policy Manual, Pub. 100-02, Ch. 15, §220.2
- Jimmo v. Sebelius Settlement Agreement
- HIPAA Privacy Rule, 45 CFR §164.502(b) (Minimum Necessary Standard)
- CMS MDS 3.0 RAI Manual (assessment scheduling and data elements)
- CMS State Operations Manual, Appendix PP

## Scope and HIPAA Guardrails

### What This Protocol Covers
- Identifying residents who are outliers on specific quality measures
- Reviewing resident-level QM data from approved secure workflow artifacts
- Generating therapy and nursing coaching recommendations for individual residents

### HIPAA Compliance Requirements
- The agent NEVER requests free-text PHI (DOB, MRN, SSN, chart excerpts) in chat
- Resident data enters the workflow ONLY through approved secure artifacts:
  - SimpleLTC resident export files (CSV/Excel)
  - Power BI resident-level dashboard queries
  - Dataverse resident records retrieved via approved flow actions
- The agent uses minimum necessary data elements only
- The agent does not store, log, or surface PHI in conversation history
- If unapproved PHI is detected, the agent sets Global.PHIDetected = true and redirects to the HIPAA Guardrail topic

## Required Data Fields for Outlier Review

### Minimum Required Fields (must be present to proceed)

| Field | Source | Purpose |
|-------|--------|---------|
| Resident Identifier | SimpleLTC export (facility-assigned ID, not SSN/MRN) | Unique identification within the facility context |
| Facility Name | Global.SelectedFacility | Facility context for the review |
| QM Domain | Global.QMDomain | Which quality measure(s) the resident triggered |
| Assessment Date | MDS target assessment date | Temporal context for the data |
| QM Trigger Status | Numerator flag (yes/no) for the target QM | Whether the resident is in the numerator |

### Clinical Context Fields (used when available)

| Field | Source | Purpose |
|-------|--------|---------|
| Primary Diagnoses | MDS Section I | Clinical context for intervention planning |
| Functional Status (ADL scores) | MDS Section G | Baseline and trend for therapy planning |
| Cognitive Status | MDS Section C (BIMS) | Determines communication approach and goal-setting capacity |
| Pain Status | MDS Section J | Pain management context |
| Fall History | MDS Section J | Fall risk context |
| Skin Integrity | MDS Section M | Wound/pressure injury context |
| Medications (relevant) | MDS Section N | Medication-related risk factors |
| Therapy Minutes | MDS Section O | Current therapy utilization |
| Restorative Nursing | MDS Section O | Current restorative program status |
| Discharge Plan | MDS Section Q | Discharge goals and timeline |

### Fields the Agent Must NOT Request
- Social Security Number
- Medicare Beneficiary Identifier (MBI)
- Date of Birth (exact)
- Home address
- Family member names or contact information
- Free-text clinical notes or chart excerpts

## Outlier Identification Criteria

A resident is classified as an outlier when:

| Criteria | Definition |
|----------|-----------|
| **QM Trigger** | Resident is in the numerator for a QM where the facility rate exceeds the benchmark |
| **Repeated Trigger** | Resident has triggered the same QM on 2+ consecutive assessments |
| **Multi-QM Trigger** | Resident triggers 3+ different QMs simultaneously |
| **Functional Decline** | Resident's ADL self-performance scores worsened by 2+ points between assessments |
| **New Admission Risk** | Resident admitted within 14 days with high-risk profile for the target QM |
| **Post-Hospital Return** | Resident returned from hospitalization with new or worsened QM triggers |

## Review Workflow

### Step 1: Data Validation
- Confirm all minimum required fields are present
- Verify the data source is an approved secure artifact
- Check that the assessment date is within the active lookback period
- If data is incomplete, request the missing fields through the approved workflow

### Step 2: Clinical Context Assessment
- Review primary diagnoses for clinical relevance to the triggered QM
- Assess functional status baseline and trend
- Identify medication-related risk factors
- Review current therapy and restorative nursing utilization

### Step 3: Intervention Mapping
- Map the QM trigger to the appropriate ONE Clinical Protocol
- Identify therapy-specific interventions (OT, PT, ST as applicable)
- Identify nursing-specific interventions
- Identify IDT collaboration opportunities
- Apply Jimmo v. Sebelius standards if maintenance therapy is relevant

### Step 4: Output Generation

The agent generates a structured resident outlier report:

```
RESIDENT OUTLIER REVIEW
Facility: [Name]
Resident ID: [Facility-assigned ID]
Review Date: [Date]
QM Domain: [Domain]
Assessment Date: [Date]

CLINICAL SUMMARY
[2-3 sentence summary of the resident's QM trigger and clinical context]

PRIMARY PROTOCOL: [ONE Clinical Protocol name]

THERAPY FOCUS
- [OT/PT/ST specific recommendations]
- [Frequency and duration recommendations]
- [Functional goals]

NURSING FOCUS
- [Nursing-specific interventions]
- [Monitoring requirements]
- [Care plan updates needed]

DOCUMENTATION CHECKPOINTS
- [MDS items to verify]
- [Care plan elements to update]
- [Physician orders needed]

ESCALATION TRIGGER
- [Conditions that require escalation to physician or IDT]

⚠️ HITL Required: This review requires licensed clinician approval before implementation.
```

## Coaching Recommendations by QM Domain

### Falls Outlier Coaching
- Therapy: Balance and gait training, environmental assessment, assistive device evaluation
- Nursing: Toileting schedule alignment, medication review coordination, post-fall protocol
- IDT: Pharmacy review of fall-risk medications, vision/hearing referral

### Pressure Ulcer Outlier Coaching
- Therapy: Seating and positioning assessment, mobility program, nutrition screening referral
- Nursing: Repositioning schedule, wound care protocol adherence, support surface evaluation
- IDT: Dietitian referral, wound care specialist consultation

### ADL Decline Outlier Coaching
- Therapy: Restorative program design, maintenance therapy evaluation per Jimmo standards
- Nursing: Restorative nursing aide training and supervision, ADL cueing protocols
- IDT: Goal-setting conference, discharge planning review

### Antipsychotic Outlier Coaching
- Therapy: Behavioral management interventions, sensory integration, structured activities
- Nursing: Behavioral trigger identification, non-pharmacological intervention log
- IDT: Pharmacy GDR review, psychiatric consultation if indicated

## How the Agent Uses This Document

During resident outlier analysis:
1. Validate that data entered the workflow through an approved secure artifact
2. Confirm minimum required fields are present before proceeding
3. Never request prohibited PHI fields
4. Follow the 4-step review workflow in order
5. Generate the structured output format for every resident review
6. Apply domain-specific coaching recommendations
7. Always require HITL approval before finalizing

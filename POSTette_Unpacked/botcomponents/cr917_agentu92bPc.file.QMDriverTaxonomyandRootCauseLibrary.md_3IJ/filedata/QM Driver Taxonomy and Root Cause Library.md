# QM Driver Taxonomy and Root-Cause Library

## Purpose

This document provides the structured taxonomy of root-cause drivers the SimpleLTC QM Coach agent uses when performing QM driver analysis. Drivers are categorized into Clinical, Process, and Documentation categories for each QM domain. This library gives the agent concrete, facility-actionable hypotheses rather than generic suggestions.

## Authoritative Sources

- CMS Medicare Benefit Policy Manual, Pub. 100-02, Ch. 15, §220.2
- CMS State Operations Manual, Appendix PP (F-tag guidance)
- CMS QAPI at 42 CFR §483.75
- Jimmo v. Sebelius Settlement Agreement
- ONE Clinical Protocols (referenced by protocol name)

## Driver Categories

| Category | Definition | Examples |
|----------|-----------|---------|
| **Clinical** | Root causes related to clinical assessment, intervention selection, or treatment execution | Inadequate pain assessment frequency, wrong splinting schedule, missed fall risk screening |
| **Process** | Root causes related to workflow design, communication, handoffs, or system gaps | No therapy-nursing handoff protocol, missing IDT conference documentation, delayed referral process |
| **Documentation** | Root causes related to MDS coding accuracy, care plan documentation, or regulatory record-keeping | Incorrect MDS item coding, care plan not updated after status change, missing physician orders |

## Falls Domain (LS-12, SS-related)

### Clinical Drivers
- Inadequate balance and gait assessment at admission or readmission
- Failure to reassess fall risk after a change in condition (medication change, acute illness, post-hospitalization)
- Insufficient individualized fall prevention interventions (generic care plan vs. resident-specific)
- Medication-related fall risk not addressed (psychotropics, antihypertensives, sedatives)
- Vision or hearing deficits not incorporated into fall prevention plan
- Orthostatic hypotension not screened or managed
- Footwear assessment not completed or not addressed
- Assistive device not properly fitted or not available at point of use

### Process Drivers
- No standardized fall risk screening tool in use (e.g., Morse Fall Scale, Timed Up and Go)
- Therapy-nursing communication gap on fall risk status changes
- Post-fall huddle not conducted or not documented within required timeframe
- Environmental rounds not completed on schedule (wet floors, clutter, lighting)
- Call light response time exceeding facility standard
- Toileting schedule not aligned with resident mobility and continence status
- Night shift fall prevention protocols differ from day shift

### Documentation Drivers
- MDS Section J (Health Conditions) fall items coded incorrectly
- Fall not documented in the medical record within 24 hours
- Care plan not updated after a fall event
- Physician notification of fall not documented
- Fall investigation root cause not recorded
- Interventions implemented post-fall not reflected in the care plan

### Regulatory References
- F-689: Free from Accident Hazards/Supervision/Devices
- ONE Clinical Protocol: Fall Prevention, Falls System Review

## Pressure Ulcers / Wounds Domain (SS-02, LS-related)

### Clinical Drivers
- Inadequate skin assessment frequency or thoroughness
- Braden Scale not completed or not used to drive interventions
- Repositioning schedule not individualized to resident risk level
- Nutrition and hydration status not addressed as part of wound prevention
- Support surface selection not matched to risk level
- Wound treatment protocol not evidence-based or not followed
- Therapy seating and positioning assessment not completed for wheelchair-bound residents

### Process Drivers
- No standardized wound care protocol across shifts
- Therapy-nursing handoff on positioning and mobility status not occurring
- Wound care rounds not scheduled or not attended by therapy
- Pressure-relieving equipment not available or not maintained
- Admission skin assessment not completed within required timeframe
- Wound measurements not standardized across clinicians

### Documentation Drivers
- MDS Section M (Skin Conditions) items coded incorrectly
- Wound staging discrepancy between clinical record and MDS
- Present-on-admission documentation missing or incomplete
- Care plan not updated when wound status changes
- Wound photography not completed per protocol

### Regulatory References
- F-686: Treatment/Services to Prevent/Heal Pressure Ulcers
- ONE Clinical Protocol: Wounds, Seating and Positioning

## ADL Decline Domain (LS-09, LS-10)

### Clinical Drivers
- Restorative nursing program not initiated for residents with decline potential
- Therapy discharge without restorative nursing handoff
- Maintenance therapy not considered per Jimmo v. Sebelius standards
- Functional goals not individualized or not progressive
- Pain limiting ADL participation not addressed
- Deconditioning after acute illness not addressed with reconditioning program
- Assistive device needs not reassessed after functional change

### Process Drivers
- No systematic ADL monitoring between therapy episodes
- Restorative nursing aides not trained or not supervised by therapy
- IDT conference not reviewing ADL trends for long-stay residents
- Therapy referral criteria too narrow (only accepting residents with improvement potential)
- No process to identify residents transitioning from short-stay to long-stay

### Documentation Drivers
- MDS Section G (Functional Status) self-performance vs. support provided coding errors
- ADL coding not reflecting actual observed performance
- Restorative nursing program documentation incomplete
- Care plan functional goals not updated after reassessment
- Therapy discharge summary not reflecting maintenance recommendations

### Regulatory References
- F-688: Increase/Prevent Decrease in ADL Function
- CMS Ch. 15 §220.2: Skilled therapy for maintenance programs
- Jimmo v. Sebelius: Coverage based on need for skilled care, not improvement potential
- ONE Clinical Protocol: Contracture Management

## Antipsychotic Use Domain (LS-02, LS-11)

### Clinical Drivers
- Behavioral symptoms not assessed for non-pharmacological alternatives first
- Gradual dose reduction (GDR) not attempted or not documented
- Psychiatric diagnosis not confirmed or not current
- Behavioral triggers not identified through structured assessment
- Therapy behavioral management interventions not trialed

### Process Drivers
- No interdisciplinary behavioral management team
- Pharmacy consultant recommendations not followed up
- GDR protocol not standardized
- Behavioral intervention log not maintained
- Therapy not included in behavioral management planning

### Documentation Drivers
- MDS Section N (Medications) antipsychotic items coded incorrectly
- Exclusion diagnoses (schizophrenia, Tourette, Huntington) not properly documented
- PRN antipsychotic use documentation incomplete
- Behavioral intervention attempts not documented before medication initiation
- Physician rationale for continued use not documented

### Regulatory References
- F-758: Free from Unnecessary Psychotropic Medications
- ONE Clinical Protocol: Behavior Management

## Incontinence Domain (LS-05)

### Clinical Drivers
- Bladder assessment not completed at admission
- Toileting program not individualized
- Pelvic floor strengthening not offered by therapy
- Fluid management not addressed
- Catheter use not reassessed for removal candidacy

### Process Drivers
- Toileting schedule not communicated across shifts
- CNA toileting compliance not monitored
- Therapy-nursing collaboration on bladder program not occurring
- Incontinence supplies used as default instead of active management

### Documentation Drivers
- MDS Section H (Bladder and Bowel) items coded incorrectly
- Toileting program documentation incomplete
- Continence care plan not individualized
- Catheter medical necessity not re-documented at required intervals

### Regulatory References
- F-690: Bowel/Bladder Incontinence, Catheter, UTI
- ONE Clinical Protocol: Bladder Health

## How the Agent Uses This Document

During QM driver analysis:
1. Identify the QM domain from the analysis context
2. Present the top 3-5 most likely drivers from the appropriate domain section
3. Categorize each driver as Clinical, Process, or Documentation
4. Present drivers as hypotheses, not confirmed facts
5. Reference the specific F-tag and ONE Clinical Protocol for each domain
6. Recommend validation audits the facility should run to confirm or disprove each hypothesis

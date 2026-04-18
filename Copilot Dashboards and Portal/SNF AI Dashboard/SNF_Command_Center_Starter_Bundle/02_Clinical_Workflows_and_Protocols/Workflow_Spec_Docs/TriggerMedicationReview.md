# TriggerMedicationReview

## Purpose

Route medication-related risk to pharmacist or clinician review before harm occurs.

## Trigger

- medication risk rule
- assistant request
- med reconciliation variance

## Primary Owner

- Medication_Safety_Owner

## Escalation Owner

- Medical_Director

## Inputs

- patient identifier
- medication list
- allergy list
- active problems
- severity

## Outputs

- review request
- consultation request
- responsible party
- alert identifier

## Logic

1. Gather current med, allergy, and problem data.
2. Check duplication, interaction, mismatch, and high-risk combinations.
3. Prioritize by severity.
4. Notify the reviewer with structured findings.
5. Track completion and unresolved issues.

## Validation

- current reconciled medication list is confirmed
- allergy and contraindication checks pass
- result remains advisory until human review


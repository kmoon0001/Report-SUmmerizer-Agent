# ExportCareSummary

## Purpose

Generate a controlled patient care summary for approved handoff, review, or family communication use.

## Trigger

- assistant request
- dashboard export request
- discharge or communication workflow

## Primary Owner

- Case_Manager_or_Equivalent

## Escalation Owner

- Compliance_Owner

## Inputs

- patient identifier
- episode of care
- audience
- export type
- date range
- consent flags

## Outputs

- file URL
- PDF URL when applicable
- disclosure flags
- audit reference

## Logic

1. Validate audience and consent.
2. Retrieve approved summary content.
3. Exclude restricted content based on policy.
4. Generate and label the export.
5. Log the disclosure event.

## Validation

- consent and minimum-necessary rules pass
- medication and care-plan sections are current
- export labeling matches sensitivity requirements


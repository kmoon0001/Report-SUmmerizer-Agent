# UpdateCarePlanFromInsights

## Purpose

Propose care-plan changes when current risks, outcomes, or care variance indicate the active plan needs revision.

## Trigger

- validated insight signal
- documented care variance
- clinician-requested review

## Primary Owner

- Assigned_Clinician

## Escalation Owner

- Clinical_Sponsor

## Inputs

- patient identifier
- care plan phase
- current care plan
- insight payload
- role and unit context

## Outputs

- suggested care plan updates
- action items
- review owner

## Logic

1. Retrieve active plan, goals, and interventions.
2. Compare current state to expected plan performance.
3. Generate proposed changes and rationale.
4. Route changes for clinician acceptance.
5. Record accepted or rejected changes.

## Validation

- recommendations align with diagnoses and orders
- restrictions and precautions are respected
- no plan change activates without clinician approval


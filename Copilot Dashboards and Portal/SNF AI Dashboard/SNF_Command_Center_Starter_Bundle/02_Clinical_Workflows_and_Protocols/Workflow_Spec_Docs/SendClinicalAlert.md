# SendClinicalAlert

## Purpose

Route an urgent clinical or safety alert to the correct owner using policy-approved severity paths.

## Trigger

- clinical rule breach
- assistant request
- manual escalation

## Primary Owner

- Charge_Nurse_or_Equivalent

## Escalation Owner

- Nursing_Director

## Inputs

- patient or unit context
- severity
- alert type
- message
- recommended actions

## Outputs

- alert identifier
- sent timestamp
- responsible party
- acknowledgment state

## Logic

1. Classify severity and scope.
2. Choose the route from the alert routing matrix.
3. Dispatch the alert with minimum necessary context.
4. Track acknowledgment and re-escalate if overdue.

## Validation

- routing matches facility escalation policy
- duplicate suppression logic reviewed
- PHI minimized for the destination channel


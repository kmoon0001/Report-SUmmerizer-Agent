# InitializeInfectionControlProtocol

## Purpose

Start infection prevention and containment workflows when surveillance or lab signals suggest infection transmission risk.

## Trigger

- outbreak rule
- lab event
- assistant request

## Primary Owner

- Infection_Prevention_Owner

## Escalation Owner

- Medical_Director

## Inputs

- patient or unit context
- organism when known
- symptoms
- isolation status
- case count

## Outputs

- containment action set
- responsible owner
- timeline
- alert reference

## Logic

1. Gather cases, symptoms, labs, isolation state, and room status.
2. Determine patient-specific or unit-wide scope.
3. Trigger infection prevention and environmental actions.
4. Notify the right owners and deadlines.
5. Monitor unresolved containment steps.

## Validation

- outbreak criteria checked against policy
- isolation and cleaning steps verified
- mismatches between lab and room state flagged


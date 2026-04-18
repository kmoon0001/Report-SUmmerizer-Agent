# InitiateFallResponseProtocol

## Purpose

Launch the facility fall response or prevention protocol after a fall or near-fall signal.

## Trigger

- fall event
- near-fall signal
- assistant request

## Primary Owner

- Nursing_Director

## Escalation Owner

- Clinical_Sponsor

## Inputs

- patient identifier
- event time
- location
- mobility status
- recent meds
- recent vitals

## Outputs

- protocol launch status
- action items
- reassessment timing
- care plan update suggestions

## Logic

1. Gather fall history, mobility, vitals, and sedating medication context.
2. Apply fall assessment rules.
3. Trigger nursing and interdisciplinary follow-up when thresholds are met.
4. Generate prevention or post-fall actions.
5. Log follow-up tasks and reassessment time.

## Validation

- response matches facility post-fall policy
- medication and orthostatic risk checks reviewed
- reassessment timing meets policy


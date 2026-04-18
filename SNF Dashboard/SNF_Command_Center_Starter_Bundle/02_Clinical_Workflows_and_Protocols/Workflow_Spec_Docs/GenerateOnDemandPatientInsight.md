# GenerateOnDemandPatientInsight

## Purpose

Create a concise, role-aware, patient-specific insight summary with explicit uncertainty and escalation cues.

## Trigger

- assistant request with sufficient confidence
- dashboard drillthrough launch

## Primary Owner

- Assigned_Clinical_Owner

## Escalation Owner

- Clinical_Sponsor

## Inputs

- patient identifier
- episode of care
- care plan phase
- role
- unit
- timeframe
- recent observations
- medication list
- active problems

## Outputs

- risk or status summary
- contributing factors
- recommended actions
- responsible role
- follow-up timing

## Logic

1. Retrieve current patient summary and care context.
2. Select topic-specific scoring or summary path.
3. Check for missing or conflicting data.
4. Generate concise output with action owner and timing.
5. Escalate if ambiguity or high risk remains.

## Validation

- guidance aligns with active pathway and goals of care
- contraindications checked against meds and allergies
- no unsupported certainty is emitted


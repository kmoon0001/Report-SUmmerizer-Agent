# Clinical Validation Protocol

## Goal

Verify that workflows, dashboards, and assistant outputs are clinically meaningful, operationally useful, safe, explainable, and compliant.

## Universal Validation Steps

1. Validate one role at a time: Exec, Nursing, Therapy, CNA, Maintenance, Activities, Compliance.
2. Validate that each score, tile, and alert has a clear source, timestamp, and ownership path.
3. Validate that risk signals remain explainable and distinguish fact from recommendation.
4. Validate that high-risk outputs route to the correct clinician or operational owner.
5. Validate that the assistant and workflows do not fabricate certainty, diagnoses, or unsupported next steps.
6. Validate that source data matches the expected EHR, workflow, or reference feed.
7. Validate that clinicians can override, annotate, or reject false positives where appropriate.
8. Validate that audit logs capture sensitive views, exports, and workflow actions.

## Workflow Validation

For each workflow:

1. Confirm trigger criteria match policy and clinical thresholds.
2. Confirm required inputs are present and correctly typed.
3. Confirm missing-data behavior degrades safely.
4. Confirm the output identifies owner, timeline, and follow-up action.
5. Confirm contraindication and conflict checks run before recommendations are emitted.
6. Confirm escalation is mandatory for ambiguous or high-risk scenarios.

## Dashboard Validation

For each page:

1. Confirm the page answers a clear clinical or operational question.
2. Confirm visuals use the correct grain, timeframe, and role-specific measure logic.
3. Confirm patient drillthrough preserves context and does not leak unauthorized PHI.
4. Confirm AI visuals do not overstate causal interpretation or predictive certainty.
5. Confirm filters, field parameters, and calculation groups produce expected results.

## Data Model Validation

1. Validate entity joins across patient, episode, encounter, observation, medication, and care-plan tables.
2. Validate terminology mappings and observation windows.
3. Validate denominator logic for quality measures and risk scores.
4. Validate source freshness, null rates, and duplicate rates for high-value fields.

## Clinical Review Questions

- Does the alert or recommendation reflect a real and relevant clinical or operational risk?
- Is the signal actionable by the intended role?
- Is there an explicit escalation owner and timing expectation?
- Is the wording safe, non-diagnostic, and consistent with facility policy?
- Would a clinician understand why the system produced this result?

## Release Gate

- Clinical sponsor review complete
- Workflow owner review complete
- Compliance and privacy review complete
- Security review complete
- Live smoke test complete
- High-risk alert paths tested end to end
- Dashboard security trimming validated
- Critical workflow latency validated

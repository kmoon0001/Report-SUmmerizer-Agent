# Action Contracts

This document defines the current backend contract shape for the six synchronous SNF Command Center actions.

## Shared Output Fields

Every action should return these fields:

- `status`
- `summary`
- `confidence`
- `requireshumanreview`
- `datasource`
- `warnings`
- `citations`
- `groundedness_status`
- `verification_status`
- `uncertainty_reason`

These fields let the agent explain result readiness consistently while the backend runs in automated handoff mode.

## GenerateOnDemandPatientInsight

Action file:
- `actions/GenerateOnDemandPatientInsight.mcs.yml`

Workflow folder:
- `workflows/SNF-Command-Center-GenerateOnDemandPatientInsight-c147cf4b-777b-43b5-8d4a-e00e0c233b49`

Primary purpose:
- Return a concise patient or unit insight summary for risk, therapy, care-plan, or reconciliation review.

Current additional outputs:
- `risklevel`
- `clinicalrecommendation`
- `actionitems`
- `responsibleparty`
- `timeline`

## SendClinicalAlert

Action file:
- `actions/SendClinicalAlert.mcs.yml`

Workflow folder:
- `workflows/SNF-Command-Center-SendClinicalAlert-18c14215-a5d0-4570-be82-3047d5fd0b22`

Primary purpose:
- Return a controlled alert acknowledgement for urgent routing and escalation support.

Current additional outputs:
- `alertid`
- `sentat`
- `responsibleparty`
- `escalationpath`
- `nextstep`

## GenerateQualityMeasureReport

Action file:
- `actions/GenerateQualityMeasureReport.mcs.yml`

Workflow folder:
- `workflows/SNF-Command-Center-GenerateQualityMeasureReport-c2ed03e7-6fe4-44b3-a219-25d20cc36548`

Primary purpose:
- Return a governed reporting response for quality, compliance, documentation, staffing, flow, or utilization review.

Current additional outputs:
- `fileurl`
- `recordcount`
- `refreshedat`

## ProcessClinicalFileIntake

Action file:
- `actions/ProcessClinicalFileIntake.mcs.yml`

Workflow folder:
- `workflows/SNF-Command-Center-ProcessClinicalFileIntake-bc1d9296-6ea5-4112-8e67-3a901196252c`

Primary purpose:
- Return governed file-triage metadata for CSV, PDF, policy, survey, or source-document uploads before a downstream workflow is chosen.

Current additional outputs:
- `extractedsignal`
- `recommendedroute`
- `nextstep`

## ProcessClinicalImageReview

Action file:
- `actions/ProcessClinicalImageReview.mcs.yml`

Workflow folder:
- `workflows/SNF-Command-Center-ProcessClinicalImageReview-5e616864-234a-44c7-adb6-748cf1f146df`

Primary purpose:
- Return governed image-triage metadata for wound, safety, medication, or mobility-related image uploads before a downstream workflow is chosen.

Current additional outputs:
- `observedconcern`
- `recommendedroute`
- `nextstep`

## Current Constraints

- These are automated-handoff backends that can route and track queue state locally.
- Tenant-side delivery still depends on endpoint permissions (for example Teams/Dataverse/Power Platform connectors).
- Treat these as operationally useful in-repo automation until live tenant integrations are connected and validated in Copilot Studio.

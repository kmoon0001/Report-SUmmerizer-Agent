# Workflows

Power Automate and skill workflow exports live here.

Current workflow layer:
- `SNF-Command-Center-GenerateOnDemandPatientInsight-c147cf4b-777b-43b5-8d4a-e00e0c233b49`
- `SNF-Command-Center-SendClinicalAlert-18c14215-a5d0-4570-be82-3047d5fd0b22`
- `SNF-Command-Center-GenerateQualityMeasureReport-c2ed03e7-6fe4-44b3-a219-25d20cc36548`
- `SNF-Command-Center-ProcessClinicalFileIntake-bc1d9296-6ea5-4112-8e67-3a901196252c`
- `SNF-Command-Center-ProcessClinicalImageReview-5e616864-234a-44c7-adb6-748cf1f146df`
- `WorkflowManifest.csv`

Recommended pattern:
- Canonical folder names
- Descriptive workflow names
- Explicit `When an agent calls the flow` trigger schemas
- Synchronous `Respond to the agent` outputs
- Controlled failure or integration-required responses

Current status:
- These are synchronous automated-handoff backends.
- They remain available as the first importable action layer for Copilot Studio; endpoint delivery to tenant systems is enabled once webhook or connector permissions are configured.

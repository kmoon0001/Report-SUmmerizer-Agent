# Actions

Copilot Studio action and skill exports live here.

Current action layer:
- `GenerateOnDemandPatientInsight.mcs.yml`
- `SendClinicalAlert.mcs.yml`
- `GenerateQualityMeasureReport.mcs.yml`
- `ExportCareSummary.mcs.yml`
- `ProcessClinicalFileIntake.mcs.yml`
- `ProcessClinicalImageReview.mcs.yml`
- `ActionManifest.csv`

Recommended pattern:
- Canonical display names
- Clear descriptions tied to one workflow purpose
- Small, reusable actions
- Synchronous outputs for agent-friendly composition
- Graceful fallback handling in the backing workflow

Current status:
- These actions are automated-handoff backends backed by synchronous skill flows.
- They are ready for local automated queue orchestration now, and for tenant-side endpoint delivery once connector permissions are available.

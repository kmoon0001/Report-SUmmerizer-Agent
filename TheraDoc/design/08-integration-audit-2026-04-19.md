# TheraDoc Integration Audit (2026-04-19)

## Scope
Compared local project `TheraDoc/` against live Copilot Studio templates extracted from Dev environment (`a944fdf0-0d2e-e14d-8a73-0f5ffae23315`) for:
- Managed bot: `855c7dda-ad19-4734-a8cd-df366c48f3d2`
- Source bot: `2c20b02f-61e6-4435-837d-90654a04353c`

## Result
Local changes are **not fully integrated** into Copilot Studio yet.

## Evidence
- Local topics: 61
- Live topics (managed): 55
- Live topics (source): 55

### Local topics missing in both live bots
- GenerateNoteOrchestration.mcs
- Greeting.mcs
- PlanOfCareGeneration.mcs
- RecertificationIntake.mcs
- Search.mcs
- SessionClose.mcs

### Action drift
Local actions:
- TheraDoc-AuditNote.mcs
- TheraDoc-GenerateNote.mcs
- TheraDoc-ParseBrainDump.mcs
- TheraDoc-PTGenerateNote.mcs

Live actions (both bots):
- template-content.action.TheraDocPTGenerateNote
- template-content.action.Untitled
- template-content.action.Untitled1

Notes:
- `Untitled` maps to flowId `347faa50-782c-4ad7-a313-ee501e0de3fe` (audit flow)
- `Untitled1` maps to flowId `e0feb36e-8d2f-f111-88b4-000d3a37eba2` (parse flow)
- Local uses explicit action names for these, but those named actions are not present in live templates.

## Current conclusion
- Browser gateway/auth is working.
- Copilot Studio has not yet absorbed all local topic/action deltas.
- Publish/list health does not prove local-to-live parity.

# TheraDoc Three-Way Merge Report

Date: 2026-04-18  
Workspace: `D:\my agents copilot studio\TheraDoc`

## Source Selection

- Dev env template extracted from:
  - Environment: `a944fdf0-0d2e-e14d-8a73-0f5ffae23315` (`Therapy AI Agents Dev`)
  - Bot: `855c7dda-ad19-4734-a8cd-df366c48f3d2`
  - Components loaded: `93`
- Default env template extracted from:
  - Environment: `03cc92c3-986c-4cf4-ae27-1478cf99d17f` (`Pacific Coast Services (default)`)
  - Bot: `f0a91e13-4b2f-f111-88b4-000d3a37eba2`
  - Components loaded: `70`

Decision: use Dev template as cloud source for merge because it is the richer/latest branch.

## Merge Policy Used

- Preserve existing local TheraDoc implementation.
- Add missing cloud-dev topics not present locally.
- Do not remove local-only topics.
- Normalize cross-topic references to local schema namespace (`pcca_agent.topic.*`).

## Added Cloud Topics

- `Conversationalboosting`
- `GenerateDocumentation`
- `NoteIntakeRouter`
- `NoteReviewandFinalize`
- `OTDischargeIntake`
- `OTEvaluationIntake`
- `OTProgressNoteIntake`
- `OTRecertificationIntake`
- `PTDischargeIntake`
- `PTEvaluationIntake`
- `PTProgressNoteIntake`
- `PTRecertificationIntake`
- `SLPDailyNoteIntake`
- `SLPDischargeIntake`
- `SLPEvaluationIntake`
- `SLPProgressNoteIntake`
- `SLPRecertificationIntake`
- `STDischargeIntake`
- `STEvaluationIntake`
- `STProgressNoteIntake`
- `STRecertificationIntake`

## Post-Merge Validation

- `scripts/alm/Invoke-AgentProblemSweep.ps1`: `TOTAL_ISSUES=0`
- `scripts/alm/Invoke-AgentDependencyAssessment.ps1`: `GAPS=0`
- Topic inventory check:
  - Cloud dev topics: `55`
  - Local topics after merge: `61`
  - Missing local vs cloud dev: `0`

## Notes

- Local retains additional orchestration topics (`GenerateNoteOrchestration`, `PlanOfCareGeneration`, etc.) to preserve local enhancements.
- A dedicated TheraDoc preflight script call timed out in this session; deterministic sweep/dependency gates passed.


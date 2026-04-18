# Topics

Copilot Studio topic exports live here.

Current topic architecture:
- `WelcomeStart.mcs.yml` is the progressive top-level menu.
- `ExecutiveQuickActions.mcs.yml` provides no-typing executive shortcut routing with button-only choices.
- Category menus split the experience into `ClinicalInsightsMenu`, `SafetyAndSurveillanceMenu`, `QualityAndOperationsMenu`, and `CommunicationAndTransitionsMenu`.
- System topics cover fallback, ambiguity, reset, timeout recovery, urgent escalation, data FAQ, and file/image guidance.
- System topics also cover on-error recovery, goodbye, and end-of-conversation feedback.
- Leaf topics collect structured intake, then bind to one of four draft actions:
  - `GenerateOnDemandPatientInsight`
  - `SendClinicalAlert`
  - `GenerateQualityMeasureReport`
- `TopicManifest.csv` is the current routing inventory.

Recommended pattern:
- One topic per file
- Canonical topic names
- Category-first progressive disclosure
- Button-first branching
- Narrow scope per leaf topic
- One primary binding target per operational topic

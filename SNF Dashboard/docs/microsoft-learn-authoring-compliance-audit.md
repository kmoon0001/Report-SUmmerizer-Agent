# Microsoft Learn Authoring Compliance Audit

Date: 2026-04-06

Scope checked:

- topic names, descriptions, model descriptions, and trigger phrases
- action names, descriptions, and shared guardrail outputs
- workflow naming conventions
- handoff instruction phrasing consistency in active topics/actions

## Microsoft Learn Sources Used

- Write agent instructions:
  - https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-instructions
- Topic authoring best practices:
  - https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/topic-authoring-best-practices
- Create and edit topics (naming, descriptions, trigger phrases):
  - https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-create-edit-topics
- Ask a question authoring:
  - https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-ask-a-question
- Conditions authoring:
  - https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-using-conditions
- Topics code editor guidance:
  - https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/topics-code-editor
- File groups guidance:
  - https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-file-groups

## Findings And Fixes Applied

### Fixed in repo

- Replaced single-word trigger phrases with short multi-word phrases in:
  - `topics/WelcomeStart.mcs.yml`
  - `topics/StartOver.mcs.yml`
  - `topics/ResetConversation.mcs.yml`
  - `topics/HelpAndQuickStart.mcs.yml`
  - `topics/Goodbye.mcs.yml`
  - `topics/ErrorTimeoutRecovery.mcs.yml`
  - `topics/InfectionControlSurveillance.mcs.yml`
  - `topics/StaffingOptimizationAndWorkloadBalance.mcs.yml`
- Added automated compliance gate:
  - `scripts/Test-CopilotAuthoringCompliance.ps1`
  - wired into `scripts/Invoke-SnfAiDashboardQaSweep.ps1`

### Current repo status

- Topic descriptions: present.
- Topic model descriptions: start with `Use this topic when...` or `Use this topic to...`.
- Trigger phrases: no single-word or overly long phrases detected by compliance gate.
- Action model descriptions: start with `Use this action to...` or `Use this action when...`.
- Action shared guardrail outputs: present on all six actions.
- Workflow folder naming: follows `SNF-Command-Center-*` convention.

## Current Naming Compliance State

Latest validation indicates tenant and repo flow naming is compliant:

- `scripts/Test-PowerAutomateFlowNamingStandard.ps1`: `Status: PASS`, `Violations: 0`
- Verified as part of:
  - `scripts/Invoke-SnfAiDashboardQaSweep.ps1`
  - `data/processed/snf_qa_sweep_report.md`
  - `data/processed/powerautomate_flow_naming_standard.md`

Historical flow-rename remediation notes remain in:

- `data/processed/flow_rename_remediation_pack.md`

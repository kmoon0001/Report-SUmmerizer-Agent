# Global Variables Inventory

Last updated: 2026-04-10

## Core Workflow Variables

| Variable | Type | Purpose | Set By | Used By |
|----------|------|---------|--------|---------|
| `Global.SelectedFacility` | String | Currently selected facility name | QM Orchestrator, DoR Summary Email, Facility QM Analysis | All workflow topics |
| `Global.PHIDetected` | Boolean | Flag set when PHI keywords detected in user input | QM Orchestrator, HIPAA Guardrail | All topics (blocks processing when true) |
| `Global.HITL_Approval` | Boolean | Human-in-the-loop approval status | HITL Approval | QM Orchestrator, DoR Summary Email |
| `Global.TopicVar1` | String | Normalized upload content (facility QM data text) | QM Orchestrator (after normalization) | QM Analysis, Decline Detection |

## QM Analysis Variables

| Variable | Type | Purpose | Set By | Used By |
|----------|------|---------|--------|---------|
| `Global.QMDomain` | Choice/String | Selected QM domain focus area | QM Intake, QM Analysis | Action Plan, Driver Analysis |
| `Global.QMDomainString` | String | String representation of QMDomain for flow inputs | HITL Approval | DoR Summary Email |
| `Global.QMAnalysisResult` | String | Result text from QM analysis | QM Analysis | Action Plan, DoR Summary |
| `Global.TopicQMAnalysisResulttext` | String | Extended QM analysis result text | QM Analysis | DoR Summary Email |
| `Global.QMDrivers` | String | Identified QM driver categories | QM Driver Analysis | Action Plan |
| `Global.QMActionPlan` | String | Generated action plan text | QM Action Plan | HITL Approval, DoR Summary |
| `Global.LookbackPeriod` | Choice/String | Selected lookback period | QM Intake | QM Analysis, Decline Detection |

## Workflow Control Variables

| Variable | Type | Purpose | Set By | Used By |
|----------|------|---------|--------|---------|
| `Global.PendingDorFacilitySelection` | Boolean | Flag indicating DoR workflow is waiting for facility selection | DoR Summary Email | QM Orchestrator |
| `Global.SuppressGenericAnalysisPromptOnce` | Boolean | Prevents duplicate analysis prompts after DoR workflow returns | DoR Summary Email | QM Orchestrator |
| `Global.CustomDateRange` | String | Custom date range for analysis | QM Intake | QM Analysis |
| `Global.FallbackCount` | Number | Tracks consecutive unrecognized utterances | Fallback (system) | Fallback → Escalate |

## Approval Variables

| Variable | Type | Purpose | Set By | Used By |
|----------|------|---------|--------|---------|
| `Global.ApprovalComments` | String | Rejection comments from HITL reviewer | HITL Approval | Escalation |

## Declared Variable Files

| File | Variable | Scope |
|------|----------|-------|
| `variables/FacilityName.mcs.yml` | FacilityName | User |

## Notes

- Global variables persist across topic transitions within a conversation session
- Topic variables (Topic.*) are scoped to the active topic and reset on topic change
- The `Global.PHIDetected` flag is a safety circuit breaker — once set, it blocks all processing until the conversation resets
- `Global.TopicVar1` is a general-purpose buffer used by the QM Orchestrator to pass normalized upload content to downstream analysis topics

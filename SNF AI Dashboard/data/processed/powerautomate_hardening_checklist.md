# Power Automate Hardening Checklist

Generated: 2026-04-06 13:41:19

Targeted flows: 7
Audit findings: 0
Untitled flows: 1
Checklist items: 8

## Corrective Actions

- [P2] Untitled: Rename flow to production naming standard and update description. WorkflowId=db104008-d226-f111-8341-000d3a5b88c6

## Preventative Actions

- [P2] INTERNAL_ResidentInsightDataverseLookupFlow: Open flow in designer and save once to normalize metadata for deterministic audits.
- [P2] Therapy AI Resident Insight Intake: Open flow in designer and save once to normalize metadata for deterministic audits.
- [P2] COPILOT V2 - Resident Insight Dataverse Lookup: Open flow in designer and save once to normalize metadata for deterministic audits.
- [P2] COPILOT V2 - Facility Insight Dataverse Lookup: Open flow in designer and save once to normalize metadata for deterministic audits.
- [P2] COPILOT V2 - Facility Insight Webhook Intake: Open flow in designer and save once to normalize metadata for deterministic audits.
- [P2] COPILOT V2 - Power BI Facility Insight Query: Open flow in designer and save once to normalize metadata for deterministic audits.
- [P2] SNF-Handoff-Webhook-Intake: Open flow in designer and save once to normalize metadata for deterministic audits.
- [P2] Global: Enforce flow naming standard: DOMAIN - Capability - Channel - Version.
- [P2] Global: Require explicit trigger auth mode review before publish (Tenant/AAD/anonymous only by policy).
- [P2] Global: Require run-after coverage for failure and timeout on all external connector calls.
- [P2] Global: Require deterministic response schema for all Copilot-invoked flows.
- [P2] Global: Run Invoke-PowerAutomateFlowAudit.ps1 before each publish window.

## Untitled Flows Detected

- Untitled | db104008-d226-f111-8341-000d3a5b88c6 | Activated | 3/23/2026 4:12 PM

# Power Automate Orchestration Framework

This document provides the reference framework for Power Automate integration used by the SimpleLTC Clinical Strategy Copilot.

## Trigger Principles

- Automation may only occur when a trigger variable is present.
- HITL approval must be explicit before any automation is initiated.
- The Copilot must not imply automation unless the trigger variable exists.

## Required Variables

- **PA_TRIGGER_SEND_DOR** (boolean)
- **ApproverDecision** (approve/revise)
- **ApproverName**
- **ApproverEmail**

## Automation Safety

- No PHI beyond minimal identifiers may be passed to flows.
- All automation must follow organizational RBAC and security policies.
- The Copilot does not store or persist data.

## Downstream Structure

Provide structured summaries for flows:

- Risks
- Drivers
- Action Plan
- Coaching Question
- Accountability Matrix
- Confidence Level

## HITL Enforcement

Automation only proceeds when:

- `PA_TRIGGER_SEND_DOR = true`
- `ApproverDecision = approve`

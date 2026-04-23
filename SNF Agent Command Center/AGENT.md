# SNF Agent Command Center (Platinum Standard Orchestrator)

## Mission
Serve as the primary orchestration hub and routing engine for the Pacific Coast clinical agent swarm. Handle all cross-agent context transfers, error escalations, and centralized auditing.

## Swarm Routing Contract
The Command Center manages inter-agent handoffs using a strict JSON schema. All payload passing must adhere to this schema to prevent PHI sprawl and ensure deterministic transitions.

### Unified Cross-Agent Handoff Schema
When routing to or from ANY worker agent (TheraDoc, SNF-Dashboard, PCRH, PCCSL, Denial Defense), the payload MUST be structured as:

```json
{
  "patient_id":     "{{PATIENT_ID}}",
  "record_id":      "{{RECORD_ID}}",
  "document_type":  "TherapyNote | EvalAnalysis | QMAnalysis | KPIReport | ...",
  "current_stage":  "Intake | Draft | Analysis | Audit | Complete | Error",
  "user_intent":    "GenerateNote | RunQMAnalysis | BuildAppeal | ...",
  "status":         "pending | success | error",
  "reason":         "Human-readable outcome or contextual instruction",
  "next_agent":     "TheraDoc | SNF-Dashboard | Regulatory-Hub | Clinical-Synthesis-Lab | Denial-Defense"
}
```

## Hardening Standards
1. **Rule 1 (No PHI Payloads)**: Do NOT pass raw patient strings (names, DOBS, clinical narrative text). Use `record_id` as a pointer to the Dataverse record.
2. **Rule 2 (Mandatory Telemetry)**: The Command Center must invoke `CommandCenter-CrossAgentAuditLog` on every agent handoff. The log must capture: `AgentName`, `Timestamp`, `RecordID`, `OperationType`, `InputHash`, `OutputHash`, and `RunID`.
3. **Rule 3 (Max-Hop Limit)**: Implement a hop counter in `Topic.HopCounter`. If it reaches `>= 3`, hard-abort and escalate to a human supervisor to prevent infinite loops.
4. **Rule 4 (Parallel Execution)**: Dispatch dependent synthesis tasks in parallel via `CommandCenter-SwarmRouter` (e.g., triggering a QM driver analysis while simultaneously running an external audit check) to reduce user latency.
5. **Rule 5 (Fallback Ticket Creation)**: If a max hop is reached or an error cannot be recovered, invoke `Fleet-FallbackEscalationTicket` to generate an ITSM issue for `clinical-leadership`.

## Error Recovery
If a worker agent returns `"status": "error"`, the Command Center MUST intercept the payload, log the failure to `cr917_snf_telemetry_logs`, and route the error message directly to the human user for graceful degradation, while simultaneously capturing the event via `Fleet-FallbackEscalationTicket`.

## Live Studio Sync & Recovery (Personalized — SNF Agent Command Center)

### Current State (as of 2026-04-21)

- **Environment**: Not bound — no `.mcs` directory exists
- **Agent ID**: Unknown — no documented GUID
- **Sync Status**: DESIGN-ONLY — this workspace contains the orchestration blueprint but has never been connected to a live Copilot Studio agent
- **Scripts**: None

### Architectural Decision Required

The Command Center is documented as the swarm orchestrator that dispatches work to the 5 worker
agents. Before syncing, answer this question:

**Does a live Command Center agent exist in Copilot Studio, or is it purely a design blueprint?**

If the Command Center runs as a live Copilot Studio agent (routing user requests to workers),
it needs its own live sync. If cross-agent orchestration is handled entirely by Power Automate
flows without a conversational agent front-end, this workspace may remain design-only.

### Step 1: Check If a Live Agent Exists

```
pac copilot list --environment https://org3353a370.crm.dynamics.com/
pac copilot list --environment https://orgbd048f00.crm.dynamics.com/
pac copilot list --environment https://pccapackage.crm.dynamics.com/
```

Look for an agent matching "Command Center" or "SNF Agent Command Center" in the output.

### Step 2A: If It Exists — Clone and Sync

Per [Clone your agent](https://learn.microsoft.com/microsoft-copilot-studio/visual-studio-code-extension-clone-agent):

1. `Ctrl+Shift+P` > `Copilot Studio: Clone Agent`
2. Select the environment and agent
3. Clone to a temporary folder
4. Copy `.mcs` folder into `SNF Agent Command Center/`
5. Merge cloned files with existing repo files (keep the repo's hardened routing contracts)
6. `Get Changes` > `Preview Changes` > `Apply Changes`
7. Publish and verify:
   ```
   pac copilot publish --environment <env-url> --bot <agent-guid>
   pac copilot list --environment <env-url>
   ```

### Step 2B: If It Does NOT Exist — Decide Whether to Create It

Options:
- **Create a live Copilot Studio agent**: If the Command Center should be a conversational
  front-end that receives user requests and dispatches them. Create in Copilot Studio web UI,
  then clone and sync as above.
- **Keep as design-only**: If orchestration is handled by Power Automate flows and the worker
  agents handle their own user conversations. In this case, no `.mcs` sync is needed — this
  workspace is the contract/documentation source of truth.

### Post-Sync: Update AGENT.md

If a live agent is connected, add:

```markdown
## Environment Binding
- **Environment**: <name> (`<url>`)
- **Environment ID**: `<guid>`
- **Agent ID**: `<guid>`
```

### What NOT To Do

- Do not create a live agent just to have one — the Command Center should only be a live agent if the architecture requires a conversational orchestrator
- Do not duplicate routing logic that belongs in Power Automate flows
- Do not create `.mcs` cache files manually

## Discovered Live Agent Binding (2026-04-21)

Discovered via `pac copilot list`:

**In orgbd048f00 (Therapy AI Agents Dev)**:
- **Live Agent Name**: `SNF Command Center Agent`
- **Agent GUID**: `8c9b244f-073a-f111-88b3-000d3a5b95c6`
- **Status**: Published, Active, Provisioned

**In pccapackage (PCCA Package)**:
- `SNF Command Center Agent`: `76183e60-0e3d-f111-88b5-000d3a5b0d6c`
- `SNF Cmd Center (TS0421)`: `f3b4edac-89fe-4fda-8be6-a53c297c29e2`

**Resolution**: The Command Center IS a live agent (not design-only). It exists in both environments.
**Primary target**: orgbd048f00 agent `8c9b244f-073a-f111-88b3-000d3a5b95c6`

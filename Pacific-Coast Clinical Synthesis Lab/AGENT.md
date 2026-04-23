# AGENT.md

This file defines repo-level operating rules for:

`D:\my agents copilot studio\Pacific-Coast Clinical Synthesis Lab`

If a deeper local `AGENT.md` exists in a child folder, that file overrides this one for that subtree.

## Mission

Synthesize clinical documentation (Recert, Discharge, Eval, Progress) into audit-ready SBAR briefs
grounded in CMS Chapter 15, APTA/AOTA/ASHA professional standards, and Jimmo compliance.
All outputs support IDT reviews and Medicare defensibility audits.

## Repo Context

- Primary local project path: `D:\my agents copilot studio\Pacific-Coast Clinical Synthesis Lab\SNF Rehab Agent`
- Bound Dataverse endpoint: `https://org3353a370.crm.dynamics.com/`
- Bound environment ID: `fd140aae-4df4-11dd-bd17-0019b9312238`
- Bound agent ID: `c030a53a-4839-f111-88b4-000d3a37eba2` (`Therapy_Report_Prep_Assistant`)
- Schema prefix: `pcca_agent39xn69`

## Handoff Contract (Cross-Agent JSON Schema)

Clinical Synthesis Lab is a **Worker Agent**. When dispatching to or receiving from the
SNF-Agent-Command-Center, ONLY the following fields are exchanged. Raw clinical note text
MUST NOT appear in any cross-agent payload — store in Dataverse first and pass `record_id`.

### Inbound (what CSL accepts from the Command Center)

```json
{
  "patient_id":     "{{PATIENT_ID}}",
  "record_id":      "{{RECORD_ID}}",
  "document_type":  "RecertAnalysis | DischargeAnalysis | EvalAnalysis | ProgressAnalysis",
  "current_stage":  "Intake | Synthesis | Review | Complete",
  "user_intent":    "GenerateSBAR | ReviewRecert | ReviewDischarge | ReviewEval | ReviewProgress"
}
```

### Outbound (what CSL returns to the Command Center)

```json
{
  "patient_id":     "{{PATIENT_ID}}",
  "record_id":      "{{RECORD_ID}}",
  "document_type":  "RecertAnalysis | DischargeAnalysis | EvalAnalysis | ProgressAnalysis",
  "current_stage":  "Synthesis | Review | Complete | Error",
  "status":         "success | error",
  "reason":         "Human-readable outcome or error description",
  "next_agent":     "SNF-Agent-Command-Center"
}
```

### Hard Rules

- Topics that make cross-agent calls MUST pass only the fields above.
- Raw clinical note text (e.g., `AppealNoteText`, inline SBAR concatenations) MUST be
  stored in Dataverse via a pre-write action and referenced via `record_id` before handoff.
- Every Dataverse write action MUST logCustomTelemetry with:
  `{agent: "Clinical-Synthesis-Lab", timestamp: utcNow(), record_id, operation_type}`.

## PHI & HIPAA Guardrails

- No topic may store free-text PHI (name, DOB, MRN, SSN) in persistent variables.
- A PHI scrub check MUST execute before any Dataverse write that contains session text.
- The `agent.mcs.yml` instructions block MUST contain the PHI negative constraints block.
  (The current instructions block is empty — see the targeted edit for that file.)

## Error Handling Standard

Every topic that calls an external action or workflow MUST include an error branch that:
1. Sets `Topic.ErrorEnvelope` = `{"status":"error","reason":"<message>","next_agent":"SNF-Agent-Command-Center"}`
2. Logs telemetry via `LogCustomTelemetryEvent`.
3. Offers retry once; on retry failure, calls `BeginDialog: pcca_agent39xn69.topic.Escalate`.

## Real Production Path First

- Start by identifying the real production path, not a temporary shortcut path.
- Read local instructions first:
  - `AGENT.md`
  - `AGENTS.md` (if present)
  - linked runbooks and standards
- Establish source of truth before editing:
  - repo files
  - live runtime/tenant state
  - current QA and run-log artifacts

## Quality Gates Before Build

Define and enforce these gates before apply/publish:

1. Contract validation
2. Runtime validation
3. Packaging/bundle validation
4. Release QA
5. Environment and permission prerequisites

Rules:
- Prefer deterministic validation first, model-based evaluation second.
- Treat placeholders, stubs, and unverifiable claims as unfinished work.
- Keep implementation, validation, and docs synchronized in one pass.

## Copilot Studio HTTP Error Prevention Protocol

Before any apply/publish:

1. Verify active PAC profile and tenant:
   - `pac auth list`
   - `pac auth select --index <n>`
2. Verify workspace binding:
   - `.mcs/conn.json` has expected `EnvironmentId` and `AgentId`
3. Use real environment target:
   - never use `public` as an environment target
   - use environment GUID or absolute Dataverse URL
4. Keep tenant/runtime as source of truth for flow bindings:
   - every action `flowId` must exist in target environment
   - keep `actions`, `workflows`, and `contracts` in sync when flow IDs/schemas change
5. Prevent output-contract drift:
   - action outputs must exactly match live flow response schema
   - if no stable output exists, keep outputs empty and avoid references

Required gates before apply:
- project validation
- contract sync validation
- preflight with connection checks

Required verification after publish:
- `pac copilot publish`
- `pac copilot status`
- `pac copilot list`

When HTTP/runtime errors occur (`Workflow ... Does Not Exist`, `status not found`, HTTP 400/500):

1. Stop feature edits.
2. Repair auth/environment/profile binding first.
3. Repair flow ID bindings and output contracts.
4. Re-run full validation gates.
5. Re-run publish verification in order.

## Repeated Failure Repair Path

If failures repeat, build and use a scripted repair path immediately rather than ad hoc retries. Prefer one deterministic recovery workflow over manual one-off fixes.

## Major-Job Reset Loop

After every major job:

1. Refresh instructions (`AGENT.md`, `AGENTS.md`).
2. Refresh project/runtime state.
3. Compress context into a short durable summary.
4. Only then start the next major task.


If a deeper local `AGENT.md` exists in a child folder, that file overrides this one for that subtree.

## Mission

Maintain and deploy the Copilot Studio agent safely to production paths with deterministic validation and explicit runtime verification.

## Repo Context

- Primary local project path: `D:\Report SUmmerizer Agent\SNF Rehab Agent`
- Bound Dataverse endpoint: `https://org3353a370.crm.dynamics.com/`
- Bound environment ID: `fd140aae-4df4-11dd-bd17-0019b9312238`
- Bound agent ID: `c030a53a-4839-f111-88b4-000d3a37eba2` (`Therapy_Report_Prep_Assistant`)

## Real Production Path First

- Start by identifying the real production path, not a temporary shortcut path.
- Read local instructions first:
  - `AGENT.md`
  - `AGENTS.md` (if present)
  - linked runbooks and standards
- Establish source of truth before editing:
  - repo files
  - live runtime/tenant state
  - current QA and run-log artifacts

## Quality Gates Before Build

Define and enforce these gates before apply/publish:

1. Contract validation
2. Runtime validation
3. Packaging/bundle validation
4. Release QA
5. Environment and permission prerequisites

Rules:
- Prefer deterministic validation first, model-based evaluation second.
- Treat placeholders, stubs, and unverifiable claims as unfinished work.
- Keep implementation, validation, and docs synchronized in one pass.

## Copilot Studio HTTP Error Prevention Protocol

Before any apply/publish:

1. Verify active PAC profile and tenant:
   - `pac auth list`
   - `pac auth select --index <n>`
2. Verify workspace binding:
   - `.mcs/conn.json` has expected `EnvironmentId` and `AgentId`
3. Use real environment target:
   - never use `public` as an environment target
   - use environment GUID or absolute Dataverse URL
4. Keep tenant/runtime as source of truth for flow bindings:
   - every action `flowId` must exist in target environment
   - keep `actions`, `workflows`, and `contracts` in sync when flow IDs/schemas change
5. Prevent output-contract drift:
   - action outputs must exactly match live flow response schema
   - if no stable output exists, keep outputs empty and avoid references

Required gates before apply:
- project validation
- contract sync validation
- preflight with connection checks

Required verification after publish:
- `pac copilot publish`
- `pac copilot status`
- `pac copilot list`

When HTTP/runtime errors occur (`Workflow ... Does Not Exist`, `status not found`, HTTP 400/500):

1. Stop feature edits.
2. Repair auth/environment/profile binding first.
3. Repair flow ID bindings and output contracts.
4. Re-run full validation gates.
5. Re-run publish verification in order.

## Repeated Failure Repair Path

If failures repeat, build and use a scripted repair path immediately rather than ad hoc retries. Prefer one deterministic recovery workflow over manual one-off fixes.

## Major-Job Reset Loop

After every major job:

1. Refresh instructions (`AGENT.md`, `AGENTS.md`).
2. Refresh project/runtime state.
3. Compress context into a short durable summary.
4. Only then start the next major task.


## Platinum Orchestration & Security Rules (v2.0)
1. **HIPAA Guardrails (PHI Scrubbing)**: Do not pass raw strings (name, DOB, MRN). Use ecord_id pointers. Ensure cross-agent triggers utilize TheraDoc-PHIScrubAction patterns.
2. **Column-Level Security (CLS)**: The connectionreferences.mcs.yml enforces Dataverse restricted profiles (_phi_restricted).
3. **Context Efficiency**: Bloated prompt windows are avoided by keeping payloads focused on the ecord_id and standardized JSON keys.
4. **Self-Healing Error Topology**: All OnError topics return {"status":"error", "reason":"...", "next_agent":"SNF-Agent-Command-Center"}.
5. **Fleet Fallback Escalation Ticket**: Graceful failures that hit Max-Hop limits (>3) or unrecoverable exceptions escalate to human oversight via Fleet-FallbackEscalationTicket flow.

## Live Studio Sync & Recovery (Personalized — Clinical Synthesis Lab)

### Current State (as of 2026-04-21)

- **Environment**: PCCA Package (`pccapackage.crm.dynamics.com` per conn.json env ID `077422cf-d088-e3d7-917e-5c9a9b64710c`)
- **AGENT.md documents**: `org3353a370.crm.dynamics.com` / env `fd140aae-4df4-11dd-bd17-0019b9312238`
- **Agent ID**: `c030a53a-4839-f111-88b4-000d3a37eba2` (Therapy_Report_Prep_Assistant)
- **Sync Status**: PARTIAL — `conn.json` exists (older schema using `botId`/`tenantId` format) but `botdefinition.json`, `changetoken.txt`, and `filechangetrack.json` are all missing
- **Cache**: Incomplete. The extension started a connection but never downloaded the full bot definition.

### Diagnosis

The `conn.json` uses the older short format (`botId`, `environmentId`, `tenantId`) instead of the
newer full format (with `DataverseEndpoint`, `AccountInfo`, `SolutionVersions`, etc.). This suggests
the initial clone/attach was done with an older version of the extension or was interrupted.

The `botdefinition.json` is missing, which means the extension cannot diff local vs. remote.
Additionally, `conn.json` points to environment `077422cf` (pccapackage) while the AGENT.md
documents environment `fd140aae` (org3353a370). This discrepancy must be resolved.

### Environment Discrepancy Resolution

Before syncing, confirm which environment actually hosts this agent:

```
pac copilot list --environment https://pccapackage.crm.dynamics.com/
pac copilot list --environment https://org3353a370.crm.dynamics.com/
```

Look for agent ID `c030a53a-4839-f111-88b4-000d3a37eba2` in the output. Whichever environment
lists it is the correct target. Update `conn.json` or the AGENT.md environment binding accordingly.

### Path 1: Fresh Clone (Recommended — cleanest path for partial sync)

Per [Clone your agent](https://learn.microsoft.com/microsoft-copilot-studio/visual-studio-code-extension-clone-agent),
when the cache is incomplete the cleanest recovery is a fresh clone:

1. **Back up current `.mcs/conn.json`** (for reference):
   ```
   copy ".mcs\conn.json" ".mcs\conn.json.bak"
   ```

2. **Delete the incomplete `.mcs` folder**:
   ```
   rmdir /s /q .mcs
   ```

3. **Clone the agent fresh** (in VS Code):
   - `Ctrl+Shift+P` > `Copilot Studio: Clone Agent`
   - Select the correct environment (confirmed from the resolution step above)
   - Select **Therapy Report Prep Assistant** (agent ID `c030a53a-...`)
   - Clone to a temporary folder

4. **Adopt the new `.mcs` cache**:
   - Copy the `.mcs` folder from the fresh clone into this workspace
   - Or adopt the fresh clone as the new workspace and port repo files over

5. **Verify sync**:
   - `Copilot Studio: Get Changes`
   - `Copilot Studio: Preview Changes`
   - Resolve any conflicts between local repo files and live agent state
   - `Copilot Studio: Apply Changes`

6. **Publish and verify**:
   ```
   pac copilot publish --environment <confirmed-env-url> --bot c030a53a-4839-f111-88b4-000d3a37eba2
   pac copilot list --environment <confirmed-env-url>
   ```

### Path 2: Solution Transport (Fallback)

If the clone path fails or the agent is not discoverable in the extension:

1. **Export backup**:
   ```
   pac solution export --environment <confirmed-env-url> --name "ClinicalSynthLabBackup" --path ./artifacts/CSL_backup.zip
   ```

2. **Pack and import**:
   ```
   pac solution pack --zipfile ./artifacts/CSL_transport.zip --folder . --processCanvasApps
   pac solution import --environment <confirmed-env-url> --path ./artifacts/CSL_transport.zip --publish-changes --max-async-wait-time 120
   ```

3. **Verify and reattach**:
   ```
   pac copilot list --environment <confirmed-env-url>
   ```
   Then: `Copilot Studio: Clone Agent` for a fresh workspace cache.

### What NOT To Do

- Do not assume the old `conn.json` environment is correct without verifying
- Do not manually create `botdefinition.json` or `changetoken.txt`
- Do not use the older `conn.json` format as a template — let the extension generate the new format

## Discovered Live Agent Binding (2026-04-21)

Discovered via `pac copilot list`:

The original GUID `c030a53a-4839-f111-88b4-000d3a37eba2` was NOT found in either environment.
This agent may have been deleted or recreated under a different ID.

**Best candidate in pccapackage**:
- **Live Agent Name**: `SNF Rehab Agent`
- **Agent GUID**: `60a37e9b-0e3d-f111-88b5-000d3a5b0d6c`
- **Environment**: PCCA Package (`pccapackage.crm.dynamics.com`)
- **Rationale**: AGENT.md names this as `Therapy_Report_Prep_Assistant` doing SBAR synthesis for rehab.

Also found: `Pacific Coast Case Historian` (`946aefde-cb3a-f111-88b3-6045bd05af7a`) in orgbd048f00.

**Action required**: Confirm which live agent maps to this repo before cloning.
- If `SNF Rehab Agent` is correct: clone from pccapackage with GUID `60a37e9b`
- If `Pacific Coast Case Historian` is correct: clone from orgbd048f00 with GUID `946aefde`
- Current conn.json points to env `077422cf` (pccapackage) — aligns with SNF Rehab Agent

# AGENT.md: Pacific-Coast Regulatory Hub — QM & CMS Compliance (Ironclad Standard)

## Mission

To provide autonomous, clinical-grade coaching to Directors of Nursing (DON) and Rehab (DOR)
regarding Quality Measure (QM) improvement, MDS 3.0 compliance, PDPM, QAPI, Five-Star, and
CMS Chapter 15. All outputs are grounded in authoritative CMS and ONE Clinical knowledge sources.

## Environment Binding (V3)

- **Environment ID**: `fd140aae-4df4-11dd-bd17-0019b9312238` (Production)
- **Agent ID**: `qm-coach-v2-hardened`
- **Schema Prefix**: `cr917_`
- **Tenant**: `org3353a370`

## Intelligence Layer (V3)

- **Core Knowledge**: Uses **MDS 3.0 QM Specs** and **ONE Clinical Protocols**.
- **Shared Knowledge**: Inherits `GLOBAL_CMS_COMPLIANCE.md` from workspace root.
- **Audit Logic**: Implements the `ComplianceAuditor` topic for QA-safe recommendations.

## Technical Safeguards

1. **Schema**: All Dataverse logical names must use `cr917_`.
2. **Hardening**: Every prompt must include the **GLOBAL SAFETY GUARDRAILS** block.
3. **Telemetry**: All coach interactions are logged to `cr917_snf_telemetry_logs`.
4. **Edit Distance**: Tracks human override of AI-suggested QM Action Plans.

## Done Criteria

- ✅ All prompts contain Ironclad guardrails.
- ✅ Knowledge Source matches MDS 3.0 v18.0 standards.
- ✅ Telemetry writes are confirmed in Dataverse.
- ✅ "All Green" fleet health check passed.

## Handoff Contract (Cross-Agent JSON Schema)

Regulatory Hub is a **Worker Agent**. When dispatching work to or receiving from the
SNF-Agent-Command-Center, ONLY the following fields are exchanged. Raw PHI text and
facility QM data MUST NOT appear in any cross-agent payload.

### Inbound (what Regulatory Hub accepts from the Command Center)

```json
{
  "patient_id":     "{{PATIENT_ID}}",
  "record_id":      "{{RECORD_ID}}",
  "document_type":  "QMAnalysis | PDPMCalc | QAPIReport | FiveStarReview | ComplianceAudit",
  "current_stage":  "Intake | Analysis | Review | Complete",
  "user_intent":    "RunQMAnalysis | BuildQAPIReport | CheckFiveStar | PDPMHIPPSCalc | ReviewCompliance"
}
```

### Outbound (what Regulatory Hub returns to the Command Center)

```json
{
  "patient_id":     "{{PATIENT_ID}}",
  "record_id":      "{{RECORD_ID}}",
  "document_type":  "QMAnalysis | PDPMCalc | QAPIReport | FiveStarReview | ComplianceAudit",
  "current_stage":  "Analysis | Review | Complete | Error",
  "status":         "success | error",
  "reason":         "Human-readable outcome or error description",
  "next_agent":     "SNF-Agent-Command-Center"
}
```

### Hard Rules

- Topics that make cross-agent calls MUST pass only the fields above.
- QM data arrays and resident outlier records MUST be stored in Dataverse and referenced
  via `record_id` before cross-agent handoff — never emitted as inline text.
- Every Dataverse write action MUST logCustomTelemetry with:
  `{agent: "Regulatory-Hub", timestamp: utcNow(), record_id, operation_type}`.

## PHI & HIPAA Guardrails

- No topic may collect or store free-text PHI (name, DOB, MRN, SSN) in session variables.
- The `HIPAAGuardrail` topic MUST be called before any Dataverse write that involves
  resident-level data.
- Dataverse write actions MUST log an audit entry to `cr917_snf_telemetry_logs` with:
  `agent_name`, `timestamp_utc`, `record_id`, `operation_type`.
- Column-level security profile `cr917_phi_restricted` MUST restrict `cr917_residentname`,
  `cr917_dateofbirth`, `cr917_mrn` to the `cr917_qmcoach_clinician` role only.
  See `connectionreferences.mcs.yml` for the suggested annotation.

## Error Handling Standard

Every topic that calls an external action or workflow MUST include an `OnError` branch that:
1. Sets `Topic.ErrorEnvelope` = `{"status":"error","reason":"<message>","next_agent":"SNF-Agent-Command-Center"}`
2. Logs telemetry via `LogCustomTelemetryEvent`.
3. Offers retry once; on retry failure, calls `BeginDialog: cr917_agentu92bPc.topic.Escalate`.


## Environment Binding (V3)
- **Environment ID**: `fd140aae-4df4-11dd-bd17-0019b9312238` (Production)
- **Agent ID**: `qm-coach-v2-hardened`
- **Tenant**: `org3353a370`

## Intelligence Layer (V3)
- **Core Knowledge**: Uses **MDS 3.0 QM Specs** and **ONE Clinical Protocols**.
- **Shared Knowledge**: Inherits `GLOBAL_CMS_COMPLIANCE.md` from workspace root.
- **Audit Logic**: Implements the `ComplianceAuditor` topic for QA-safe recommendations.

## Technical Safeguards
1. **Schema**: All Dataverse logical names must use `cr917_`.
2. **Hardening**: Every prompt must include the **GLOBAL SAFETY GUARDRAILS** block.
3. **Telemetry**: All coach interactions are logged to `cr917_snf_telemetry_logs`.
4. **Edit Distance**: Tracks human override of AI-suggested QM Action Plans.

## Done Criteria
- ✅ All prompts contain Ironclad guardrails.
- ✅ Knowledge Source matches MDS 3.0 v18.0 standards.
- ✅ Telemetry writes are confirmed in Dataverse.
- ✅ "All Green" fleet health check passed.

## Platinum Orchestration & Security Rules (v2.0)
1. **HIPAA Guardrails (PHI Scrubbing)**: Do not pass raw strings (name, DOB, MRN). Use ecord_id pointers. Ensure cross-agent triggers utilize TheraDoc-PHIScrubAction patterns.
2. **Column-Level Security (CLS)**: The connectionreferences.mcs.yml enforces Dataverse restricted profiles (_phi_restricted).
3. **Context Efficiency**: Bloated prompt windows are avoided by keeping payloads focused on the ecord_id and standardized JSON keys.
4. **Self-Healing Error Topology**: All OnError topics return {"status":"error", "reason":"...", "next_agent":"SNF-Agent-Command-Center"}.
5. **Fleet Fallback Escalation Ticket**: Graceful failures that hit Max-Hop limits (>3) or unrecoverable exceptions escalate to human oversight via Fleet-FallbackEscalationTicket flow.

## Live Studio Sync & Recovery (Personalized — Regulatory Hub)

### Current State (as of 2026-04-21)

- **Environment (documented)**: `org3353a370.crm.dynamics.com`
- **Environment ID (documented)**: `fd140aae-4df4-11dd-bd17-0019b9312238`
- **Agent ID (documented)**: `qm-coach-v2-hardened`
- **Sync Status**: NEVER SYNCED — no `.mcs` directory exists at all
- **Scripts**: 13+ PowerShell scripts exist (including `Fix-CopilotStudioExtension.ps1`, `Auto-Fix-All.ps1`), suggesting previous troubleshooting without a successful sync

### Diagnosis

This agent has never had a successful VS Code extension connection in this workspace. The AGENT.md
documents environment and agent bindings, but no `.mcs/conn.json` was ever created. The extensive
scripts directory suggests multiple prior recovery attempts that never reached the "extension builds
its own cache" state.

The documented agent ID (`qm-coach-v2-hardened`) appears to be a logical name, not the GUID that
the extension needs. The actual agent GUID must be discovered from the live environment.

### Pre-Sync: Discover the Agent GUID

Before connecting, find the actual agent GUID:

```
pac copilot list --environment https://org3353a370.crm.dynamics.com/
```

Look for the agent matching "QM Coach" or "SimpleLTC QM Coach V2" in the output. Record the GUID.

If the agent is not in `org3353a370`, check the Therapy AI Agents Dev environment:
```
pac copilot list --environment https://orgbd048f00.crm.dynamics.com/
```

### Path 1: Initial Clone (Primary — per Microsoft Learn)

Per [Clone your agent](https://learn.microsoft.com/microsoft-copilot-studio/visual-studio-code-extension-clone-agent),
the first-time setup for an agent that has never been cloned:

1. **Ensure PAC auth is set to the correct environment**:
   ```
   pac auth list
   pac auth select --index <n>
   ```

2. **Clone the agent** (in VS Code):
   - `Ctrl+Shift+P` > `Copilot Studio: Clone Agent`
   - Select the environment where the agent was found
   - Select the QM Coach agent from the list
   - Clone to a temporary folder

3. **Merge with existing repo**:
   - The clone creates a fresh workspace with full `.mcs` cache
   - Copy the `.mcs` folder from the clone into `Pacific-Coast Regulatory Hub/`
   - Compare cloned topic/action files with existing repo files
   - Keep repo versions where they are more current; keep cloned versions where they reflect live state
   - Resolve differences

4. **Verify sync**:
   - `Copilot Studio: Preview Changes`
   - `Copilot Studio: Get Changes`
   - `Copilot Studio: Apply Changes` (only after preview is clean)

5. **Publish and verify**:
   ```
   pac copilot publish --environment <env-url> --bot <discovered-agent-guid>
   pac copilot list --environment <env-url>
   ```

### Path 2: Reattach (If Agent Was Previously Cloned Elsewhere)

If the agent was previously cloned to a different folder and you want to connect this existing
repo to the live agent:

1. Open this workspace in VS Code
2. `Ctrl+Shift+P` > `Copilot Studio: Reattach Agent`
3. Select the environment and agent
4. The extension will create `.mcs/conn.json` and begin building the cache
5. Run `Get Changes` > `Preview Changes` > `Apply Changes`

### Path 3: Solution Transport (Fallback)

If the extension cannot discover or connect to the agent:

1. **Pack and import**:
   ```
   pac solution pack --zipfile ./artifacts/RegHub_transport.zip --folder . --processCanvasApps
   pac solution import --environment <env-url> --path ./artifacts/RegHub_transport.zip --publish-changes --max-async-wait-time 120
   ```

2. **Verify and clone**:
   ```
   pac copilot list --environment <env-url>
   ```
   Then clone fresh for a clean cache.

### Post-Sync: Update AGENT.md

Once the actual agent GUID is discovered and sync succeeds, update the "Environment Binding" section
above with the real GUID instead of the logical name `qm-coach-v2-hardened`.

### What NOT To Do

- Do not create `.mcs/conn.json` manually — let the extension generate it via Clone or Reattach
- Do not assume `qm-coach-v2-hardened` is the actual agent GUID
- Do not run `Apply Changes` before `Get Changes` on a first-time connection

## Discovered Live Agent Binding (2026-04-21)

Discovered via `pac copilot list`:
- **Live Agent Name**: `SimpleLTC QM Coach V2`
- **Agent GUID**: `ea52ad9c-8233-f111-88b3-6045bd09a824`
- **Environment**: Therapy AI Agents Dev (`orgbd048f00.crm.dynamics.com`)
- **Environment ID**: `a944fdf0-0d2e-e14d-8a73-0f5ffae23315`
- **Status**: Published, Active, Provisioned

Also found in pccapackage (`077422cf`):
- `SimpleLTC QM Coach V2`: `ee5ef79d-073d-f111-88b5-000d3a5b0d6c`
- `SimpleLTC QM Coach V2 Hardened`: `cfbf6064-e234-4b3b-ba4c-676e7c54d398`

**Primary target**: orgbd048f00 agent `ea52ad9c-8233-f111-88b3-6045bd09a824`

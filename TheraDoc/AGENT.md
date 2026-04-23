# AGENT.md

This file defines repo-specific operating rules for:

`D:\my agents copilot studio\TheraDoc`

It refines the global workspace rules for this repo and should not contradict them.

## Project Identity

- Project: `TheraDoc`
- Type: Microsoft Copilot Studio agent for SNF therapy documentation (PT/OT/ST)
- Primary runtime schema: `pcca_agent`

## Handoff Contract (Cross-Agent JSON Schema)

TheraDoc is a **Worker Agent**. When it dispatches work to or receives work from the
SNF-Agent-Command-Center, ONLY the following fields are exchanged. Raw PHI text MUST
NOT appear in any cross-agent payload.

### Inbound (what TheraDoc accepts from the Command Center)

```json
{
  "patient_id":     "{{PATIENT_ID}}",
  "record_id":      "{{RECORD_ID}}",
  "document_type":  "DailyNote | Evaluation | Recertification | Discharge | ProgressNote",
  "current_stage":  "Intake | Draft | Audit | Finalize | Complete",
  "user_intent":    "GenerateNote | ReviseNote | AuditNote | ParseBrainDump | NursingHandoff"
}
```

### Outbound (what TheraDoc returns to the Command Center)

```json
{
  "patient_id":     "{{PATIENT_ID}}",
  "record_id":      "{{RECORD_ID}}",
  "document_type":  "DailyNote | Evaluation | Recertification | Discharge | ProgressNote",
  "current_stage":  "Draft | Audit | Finalize | Complete | Error",
  "status":         "success | error",
  "reason":         "Human-readable outcome or error description",
  "next_agent":     "SNF-Agent-Command-Center"
}
```

### Hard Rules

- Topics that make cross-agent calls MUST first invoke the `CommandCenter-CrossAgentAuditLog` flow to record the handoff.
- `FinalNoteText` or any raw clinical narrative MUST be stored in Dataverse and referenced
  via `record_id` before handoff — never concatenated inline in a cross-agent payload.
- Every Dataverse write action MUST logCustomTelemetry to the `cr917_snf_telemetry_logs` table with:
  `{agent: "TheraDoc", timestamp: utcNow(), record_id, operation_type}`.
- Generated clinical narratives MUST adhere to the **P-O-S-T-E-TE-E 6-Dimension Framework** (Priority, Objective, Subjective, Time-Bound, Treatment Plan, Evaluation).
- Any note failing the P-O-S-T-E-TE-E check is categorized as **SEV-1 (Blocker)** and prevents the `Finalize` handoff to the Command Center.

## Platinum Orchestration & Security Rules (v2.0)

1. **HIPAA Guardrails (PHI Scrubbing)**
   - Do not pass raw strings (name, DOB, MRN, SSN) into Dataverse trace logs or cross-agent contexts.
   - You MUST utilize the `TheraDoc-PHIScrubAction-8843b42d-4c3c-f111-88b3-7ced8d6e69f5` Power Automate flow to safely redact inputs before cross-agent routing.

2. **Column-Level Security (CLS)**
   - The `connectionreferences.mcs.yml` file restricts `new_sharedcommondataserviceforapps_af899` access to the `theradoc_phi_restricted` profile and `theradoc_clinician` role. Do not alter these bindings without compliance authorization.

3. **Context Efficiency (RecordID Focus)**
   - Instead of bloating prompt windows with concatenated documents, use pointer-based logic (`record_id`). The SwarmCommandRouter manages contexts optimally if agents operate strictly on these deterministic identifiers.

4. **Self-Healing Error Topology**
   - The `OnError` topic MUST return a structured JSON packet: `{"status":"error", "agent":"TheraDoc", "reason":"[...]", "next_agent":"SNF-Agent-Command-Center"}` instead of conversational filler.

5. **Fleet Fallback Escalation Ticket**
   - If clinical oversight is required and the agent fails gracefully, it must trigger an action that results in a service ticket generated for the `clinical-leadership` distribution list.

6. **POSTette Documentation Standards**
   TheraDoc applies the **6-Dimension POSTette Audit** to all generated and revised notes to ensure Ensign Services compliance:
   1. **P (Priority):** Validates skilled necessity, medical complexity, and PLOF.
   2. **O (Objective):** Ensures standardized tests/measures (Gait speed, Berg, etc.) include specific scale interpretations.
   3. **S (Subjective):** Maps resident-reported pain/fatigue directly to observed functional deficits.
   4. **T (Time):** Justifies the rationale for session duration and continued frequency vs. maintenance.
   5. **TE (Treatment):** Replaces passive "assist" with skilled intervention verbs (e.g., *facilitated*, *inhibited*, *graded*).
   6. **E (Evaluation):** Links treatment response directly to functional impact and progress toward goals.

   **Severity Tagging Rules:**
   - 🔴 **SEV-1 (Critical):** Missing skilled necessity or objective metrics. **ACTION: Block Release.**
   - 🟡 **SEV-2 (Moderate):** Weak functional linking or unclear scale meaning. **ACTION: Suggest Revision.**
   - 🔵 **SEV-3 (Minor):** Non-standardized phrasing or style alignment. **ACTION: Auto-Optimize.**

## Real Production Path

Use this order for all production-impacting work:

1. Validate local repo integrity.
2. Verify environment/profile binding (`pac auth list`, `pac auth select`, `.mcs/conn.json`).
3. Preview and reconcile drift (`Get changes` / `Preview changes`).
4. Apply changes.
5. Publish.
6. Verify live runtime (`pac copilot status`, `pac copilot list`).

Do not normalize temporary shortcuts (manual cache edits, placeholder bindings, ad hoc reroutes) as the default path.

## Source Of Truth

- Repo files are the editable source of truth for:
  - `agent.mcs.yml`
  - `topics/*.mcs.yml`
  - `actions/*.mcs.yml`
  - `workflows/*/workflow.json`
  - knowledge and design docs
- Live tenant/runtime is the source of truth for:
  - action flow availability
  - environment and bot identity
  - publish status and invocation behavior

When local and live disagree, resolve against live exports/status before marking work complete.

## Startup Sequence (Every Session)

1. Read:
   - this `AGENT.md`
   - repo `AGENTS.md` if present
2. Confirm working path is this repo root.
3. Verify active tenant/environment mapping:
   - `pac auth list`
   - `pac auth select --index <n>`
   - inspect `.mcs/conn.json` (`EnvironmentId`, `AgentId`, `DataverseEndpoint`)
4. Validate that every action `flowId` exists and has a matching workflow folder in `workflows/`.

## MCP Setup (TheraDoc)

Required for normal work in this repo:

- Copilot Studio MCP
- Power Platform MCP

Recommended when needed:

- Microsoft Learn MCP (official guidance checks)
- Playwright MCP (UI verification/fallback validation)

Rules:

- Keep Copilot Studio extension sync (`Get changes` / `Preview changes` / `Apply changes`) as the primary path.
- Do not replace apply/publish with browser automation when supported CLI/extension paths exist.
- Verify MCP auth before declaring a server or workflow broken.

## Copilot Studio Contract Rules

- Keep `actions`, `workflows`, and topic usage synchronized in the same change pass.
- Action outputs must match live flow response schema exactly.
- If a flow returns no stable output, keep action outputs empty and avoid downstream references.
- Never target `public` as environment; always use a real environment GUID.
- Prefer `DynamicClosedListEntity` or boolean questions for operational paths.
- For closed-list conditions, use the safe expression pattern:
  - `Text(Topic.ChoiceVariable) = "OptionValue"`
  - avoid direct `.Value` comparisons in conditions.

## TheraDoc Workflow Intent

Primary user goals:

- Generate note
- Revise note
- Audit note
- Parse brain dump
- Create nursing handoff
- Create nursing handoff
- Get documentation guidance (via POSTette 6-Dimension Framework)

Design guardrails:

- Button-first routing and intake.
- Ask one highest-value follow-up at a time.
- Minimize free text; reserve it for measurable metrics, unusual findings, and custom details.
- Reuse prior session context and avoid redundant questions.
- Preserve context on failure and offer retry/manual continue/start over.

## Quality Gates (Required Before Apply)

1. Contract validation
   - topic variables referenced must exist in topic flow
   - called dialogs must resolve locally
   - action outputs referenced by topics must exist in action contracts
2. Runtime validation
   - `pac copilot list` includes target agent
   - active profile points to intended tenant/environment
3. Packaging validation
   - no unresolved topic/action/workflow references
   - no placeholder/stub artifacts on active path
4. Release QA
   - core paths tested: generate, revise, audit, parse, handoff, guidance
   - error/recovery topic path tested

## Required Verification After Publish

Run in order:

1. `pac copilot publish --environment <env-guid> --bot <agent-id-or-schema>`
2. `pac copilot status --environment <env-guid> --bot-id <agent-guid>`
3. `pac copilot list --environment <env-guid>`

If publish/status outputs conflict, treat runtime state as authoritative and re-check with `list` and a live invocation.

## Copilot Studio Extension Stuck FAQ

Use this section whenever `Get changes`, `Preview changes`, or `Apply changes` fails, hangs, returns HTTP errors, or shows unexpected large change counts.

### Standard Auto-Recovery Path

Run in this exact order:

1. Local integrity gates:
   - `powershell -ExecutionPolicy Bypass -File scripts\copilot-preflight.ps1`
2. Full sync check and local state reset:
   - `powershell -ExecutionPolicy Bypass -File scripts\copilot-sync-check.ps1 -ResetSyncState`
3. In VS Code extension:
   - `Copilot Studio: Get changes`
   - `Copilot Studio: Preview changes`
   - `Copilot Studio: Apply changes`
4. Publish and live verify:
   - `pac copilot publish --environment <dataverse-url> --bot <agent-id>`
   - `pac copilot list --environment <dataverse-url>`
5. Re-run remote verification:
   - `powershell -ExecutionPolicy Bypass -File scripts\copilot-sync-check.ps1`

### FAQ

- Q: Why is `Apply changes` disabled or grayed out?
  - A: Usually extension state drift or pending unresolved preview drift. Run the auto-recovery path above.

- Q: Why do I see many pending changes (for example 20-100) after reset?
  - A: Resetting `.mcs` tracking intentionally invalidates incremental state; the next `Get/Preview/Apply` re-establishes baseline.

- Q: Why does `Preview/Get` show `404 Not Found`?
  - A: Environment/profile mismatch, stale attachment, or missing runtime artifacts (flow IDs/components). Verify `.mcs/conn.json`, active `pac auth` profile, and remote flow existence.

- Q: Why does the extension server say `Server was requested to shut down`?
  - A: Most often malformed YAML, unresolved merge markers, or parser-breaking repo state. Preflight first, then reload VS Code window, then retry.

- Q: `pac copilot status` errors but publish/list look healthy. Is that a failure?
  - A: Not necessarily. Treat `publish + list + direct runtime checks` as authoritative when `status` is unreliable in the tenant/CLI build.

- Q: What must be true before retrying `Apply`?
  - A:
    - No unresolved merge markers
    - YAML parses cleanly
    - Every referenced `flowId` has a local `workflows/*-<flowId>` folder
    - No placeholder secret/endpoint patterns in workflow JSON
    - Active profile and `.mcs/conn.json` point to the intended environment/agent

### Do Not Do

- Do not normalize manual cache hacks as the primary workflow.
- Do not keep placeholder flow bindings or `Untitled` artifacts on active path.
- Do not skip publish/list verification after a successful apply.

## Repair-First Protocol (HTTP/Flow Errors)

If errors occur (`Workflow ... Does Not Exist`, status lookup failures, HTTP 400/500):

1. Stop feature edits.
2. Repair auth/environment/profile binding first.
3. Repair action `flowId` mappings and output contracts.
4. Re-run validation gates.
5. Re-attempt apply/publish/verification in sequence.

## Repo Hygiene

- Keep topic count and branching complexity as low as practical.
- Prefer reusable shared intake patterns over near-duplicate topics.
- Keep names/descriptions explicit and aligned to purpose (`Use this topic when...` / `Use this action to...`).
- Keep design docs synchronized with implemented behavior in the same pass.
- Treat placeholder markers (`TODO`, `TBD`, `BROKEN`, stub-only files) on active runtime paths as defects.

## Done Criteria

Work is complete only when:

- Local references and contracts are consistent.
- Live tenant checks were executed, or an explicit validation gap is documented.
- Active user paths are automation-first and button-first where feasible.
- No unresolved runtime risks are hidden behind assumptions.

## Live Studio Sync & Recovery (Personalized — TheraDoc)

### Current State (as of 2026-04-21)

- **Environment**: PCCA Package (`pccapackage.crm.dynamics.com`)
- **Environment ID**: `077422cf-d088-e3d7-917e-5c9a9b64710c`
- **Agent ID**: `09b002b6-ec3c-f111-88b5-000d3a5b0d6c`
- **Sync Status**: HEALTHY — full cache present (`conn.json` + `botdefinition.json` + `filechangetrack.json`)
- **Cache**: `botdefinition.json` (2.3 MB, Apr 13). `filechangetrack.json` is `{}` (clean, no pending changes).
- **Note**: `changetoken.txt` has been reset/rolled back; multiple `.bak` backups exist from Apr 3-13.

### What Worked (Solution Transport — April 13, 2026)

TheraDoc is the reference success case for the fleet. When the VS Code extension sync path was
stuck (Apply grayed out, cache corruption, HTTP errors after 15+ recovery attempts), solution
transport via `pac CLI` was the path that succeeded:

1. Export live state backup: `pac solution export`
2. Pack local repo: `pac solution pack`
3. Import to tenant: `pac solution import --publish-changes`
4. Verify: `pac copilot list`
5. Reattach workspace: `Copilot Studio: Clone Agent` (fresh cache)

This is now the proven fallback for any agent in the fleet that gets stuck.

### Ongoing Maintenance Path (Extension-First)

Per [Synchronize your changes](https://learn.microsoft.com/microsoft-copilot-studio/visual-studio-code-extension-synchronization):

Since TheraDoc is healthy, use the standard extension path for ongoing work:

1. **Start of session**: `Copilot Studio: Preview Changes` to check for remote drift
2. **Get remote changes**: `Copilot Studio: Get Changes`
3. **Local edits**: edit topics/actions/workflows in repo
4. **Before apply**: run `powershell -ExecutionPolicy Bypass -File scripts\copilot-preflight.ps1`
5. **Apply**: `Copilot Studio: Apply Changes`
6. **Publish**:
   ```
   pac copilot publish --environment https://pccapackage.crm.dynamics.com/ --bot 09b002b6-ec3c-f111-88b5-000d3a5b0d6c
   ```
7. **Verify**:
   ```
   pac copilot list --environment https://pccapackage.crm.dynamics.com/
   powershell -ExecutionPolicy Bypass -File scripts\copilot-sync-check.ps1
   ```

### If Extension Breaks Again

1. Run the auto-recovery path documented in the "Copilot Studio Extension Stuck FAQ" section above.
2. If auto-recovery fails after 2 attempts, use solution transport (the proven fallback).
3. After solution transport, reattach with `Copilot Studio: Clone Agent` or `Copilot Studio: Reattach Agent`.

### Fleet Reference

TheraDoc scripts (`copilot-preflight.ps1`, `copilot-sync-check.ps1`, `reattach-and-sync.ps1`) are
the template for other agents. When building recovery scripts for other agents, adapt these.

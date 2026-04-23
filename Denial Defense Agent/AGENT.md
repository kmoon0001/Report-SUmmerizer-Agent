# Denial Defense Agent (Platinum Standard V3)

**Metadata:**
- **Status**: IRONCLAD HARDENED
- **XAI Integration**: 7-Layer SHAP/LIME Stack Active
- **Compliance Foundation**: CMS Ch. 15, CFR Part 483, ASHA/AOTA/APTA

---

## ðŸ›¡ï¸ PLATINUM HARDENING & GUARDRAILS (IRONCLAD)

### 1. Confidence & Boundaries
- **Logic**: Every audit must report a **Confidence Scale (0-100)**.
- **Rule**: If confidence is < 85%, the agent MUST escalate to the **Supervisory Compliance Hub**.
- **Error Handling**: On tool failure, return the **"Framework Backup"** (Lines 31-34 of legacy PCCA) instead of a null error.

### 2. 7-Layer XAI Governance (FDA/NIST Compliant)
1. **SHAP Intensity**: Identify the primary mathematical driver of the denial risk.
2. **Counterfactuals**: Provide "What-If" scenarios to fix the note.
3. **Confidence Intervals**: Display [Upper/Lower] bounds of AI certainty.
4. **Attention Weights**: Focus on specific skilled terminology in the clinical narrative.
5. **Anchoring**: Ensure the core claim matches the ASHA/AOTA/APTA scope.
6. **Concept Activation**: Link audit findings back to direct CMS Chapter 15 requirements.
7. **LIME Sensitivity**: Local approximation of clinical necessity.

---

## ðŸ“ MICROSOFT LEARN: IMPLEMENTATION SOURCE OF TRUTH
- **Reference**: [Designing Agentic Workflows in Copilot Studio](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/agentic-workflows)
- **Constraint**: Strict use of **Portable Solution Structures** (src/Topics, /KB, /Cards).
- **Automation**: Use **Action.Submit** JSON payloads to eliminate conversational friction.

---

## ðŸ©º CLINICAL PREFLIGHT AUDIT CHECKLIST
- [x] **ASHA/AOTA/APTA Neutrality**: Verified.
- [x] **CFR Part 483 Alignment**: Verified.
- [x] **7-30-90 Framework**: Integrated.
- [x] **Adversarial Injection Firewall**: Active in `src/KnowledgeBase`.

---

## Handoff Contract (Cross-Agent JSON Schema)

Denial Defense is a **Worker Agent**. When dispatching work to or receiving from the
SNF-Agent-Command-Center, ONLY the following fields are exchanged. Raw clinical note text
MUST NOT appear in any cross-agent payload — store in Dataverse first and pass `record_id`.

### Inbound (what Denial Defense accepts from the Command Center)

```json
{
  "patient_id":     "{{PATIENT_ID}}",
  "record_id":      "{{RECORD_ID}}",
  "document_type":  "TherapyNote | DenialLetter | AppealDraft",
  "current_stage":  "Intake | Audit | Rebuttal | Complete",
  "user_intent":    "AuditNote | BuildAppeal | ReviewAppeal"
}
```

### Outbound (what Denial Defense returns to the Command Center)

```json
{
  "patient_id":     "{{PATIENT_ID}}",
  "record_id":      "{{RECORD_ID}}",
  "document_type":  "TherapyNote | DenialLetter | AppealDraft",
  "current_stage":  "Audit | Rebuttal | Complete | Error",
  "status":         "success | error",
  "reason":         "Human-readable outcome or error description",
  "next_agent":     "SNF-Agent-Command-Center"
}
```

### Hard Rules

- Topics that make cross-agent calls MUST pass only the fields above.
- The `AppealNoteText` or any raw text used in appeal generation MUST be
  stored in Dataverse via a pre-write action and referenced via `record_id`.
- Every Dataverse write action MUST logCustomTelemetry with:
  `{agent: "Denial-Defense", timestamp: utcNow(), record_id, operation_type}`.

---
*Pacific Coast Services: World-Class Clinical Intelligence Infrastructure.*


## Platinum Orchestration & Security Rules (v2.0)
1. **HIPAA Guardrails (PHI Scrubbing)**: Do not pass raw strings (name, DOB, MRN). Use ecord_id pointers. Ensure cross-agent triggers utilize TheraDoc-PHIScrubAction patterns.
2. **Column-Level Security (CLS)**: The connectionreferences.mcs.yml enforces Dataverse restricted profiles (_phi_restricted).
3. **Context Efficiency**: Bloated prompt windows are avoided by keeping payloads focused on the ecord_id and standardized JSON keys.
4. **Self-Healing Error Topology**: All OnError topics return {"status":"error", "reason":"...", "next_agent":"SNF-Agent-Command-Center"}.
5. **Fleet Fallback Escalation Ticket**: Graceful failures that hit Max-Hop limits (>3) or unrecoverable exceptions escalate to human oversight via Fleet-FallbackEscalationTicket flow.

## Live Studio Sync & Recovery (Personalized — Denial Defense Agent)

### Current State (as of 2026-04-21)

- **Environment**: Not bound — no `.mcs` directory exists
- **Agent ID**: Unknown — no `conn.json`, no documented GUID
- **Sync Status**: NEVER SYNCED — no cache, no scripts, no prior connection artifacts
- **Scripts**: None — this agent has the least recovery tooling in the fleet

### Diagnosis

This is a clean-slate agent. It has comprehensive AGENT.md documentation (handoff contracts,
XAI governance, clinical audit rules) but has never been connected to a live Copilot Studio
environment from this workspace. Before any sync can happen, the agent must be either:
(a) discovered in an existing environment, or (b) created as a new agent in Copilot Studio.

### Step 1: Determine If the Agent Exists Live

Check all known environments for a Denial Defense agent:

```
pac copilot list --environment https://org3353a370.crm.dynamics.com/
pac copilot list --environment https://orgbd048f00.crm.dynamics.com/
pac copilot list --environment https://pccapackage.crm.dynamics.com/
```

Look for an agent matching "Denial Defense" in any environment output. Record the GUID and environment.

### Step 2A: If the Agent Exists — Clone It

Per [Clone your agent](https://learn.microsoft.com/microsoft-copilot-studio/visual-studio-code-extension-clone-agent):

1. **Set PAC auth**:
   ```
   pac auth list
   pac auth select --index <n>
   ```

2. **Clone** (in VS Code):
   - `Ctrl+Shift+P` > `Copilot Studio: Clone Agent`
   - Select the environment where the agent was found
   - Select the Denial Defense agent
   - Clone to a temporary folder

3. **Merge with existing repo**:
   - Copy `.mcs` folder from clone into `Denial Defense Agent/`
   - Compare cloned files with repo files; resolve differences
   - Keep repo versions where they have more complete contracts/hardening

4. **Sync and publish**:
   - `Copilot Studio: Get Changes`
   - `Copilot Studio: Preview Changes`
   - `Copilot Studio: Apply Changes`
   - Publish:
     ```
     pac copilot publish --environment <env-url> --bot <agent-guid>
     pac copilot list --environment <env-url>
     ```

### Step 2B: If the Agent Does NOT Exist — Create It

If no Denial Defense agent exists in any environment, create one:

1. **In Copilot Studio web UI** (`https://copilotstudio.microsoft.com`):
   - Navigate to the target environment
   - Create a new agent named "Denial Defense Agent"
   - Add initial instructions from the AGENT.md mission and XAI governance rules
   - Save and publish

2. **Clone to local** (in VS Code):
   - `Ctrl+Shift+P` > `Copilot Studio: Clone Agent`
   - Select the newly created agent
   - Clone to a temporary folder

3. **Merge with existing repo**:
   - Copy `.mcs` folder into `Denial Defense Agent/`
   - Apply the repo topic/action files on top of the blank agent
   - `Copilot Studio: Apply Changes` to push repo content to live

4. **Publish and verify**:
   ```
   pac copilot publish --environment <env-url> --bot <new-agent-guid>
   pac copilot list --environment <env-url>
   ```

### Post-Sync: Update AGENT.md

Once connected, add the environment binding section:

```markdown
## Environment Binding
- **Environment**: <name> (`<url>`)
- **Environment ID**: `<guid>`
- **Agent ID**: `<guid>`
- **Schema Prefix**: `cr917_`
```

### Post-Sync: Create Recovery Scripts

This agent has no scripts. After first successful sync, create at minimum:
- `scripts/copilot-preflight.ps1` — adapted from TheraDoc's version
- `scripts/copilot-sync-check.ps1` — adapted from TheraDoc's version

### What NOT To Do

- Do not create `.mcs/conn.json` manually
- Do not assume the agent exists — verify first
- Do not apply repo content to a live agent without first running `Get Changes` to understand current live state

## Discovery Results (2026-04-21)

Searched all 3 environments for a Denial Defense agent:
- `orgbd048f00.crm.dynamics.com` (Therapy AI Agents Dev): **NOT FOUND**
- `pccapackage.crm.dynamics.com` (PCCA Package): **NOT FOUND**
- `org3353a370.crm.dynamics.com` (Production): Not checked (no PAC auth profile)

**Action required**: Create a new Denial Defense Agent in Copilot Studio.

Recommended creation environment: **Therapy AI Agents Dev** (`orgbd048f00.crm.dynamics.com`)
- This is where the SNF Dashboard and Command Center live
- Consistent with the hub-and-spoke deployment topology

Steps:
1. Go to https://copilotstudio.microsoft.com
2. Select environment: Therapy AI Agents Dev
3. Create new agent: "Denial Defense Agent"
4. Add initial instructions from AGENT.md (XAI governance, handoff contract)
5. Save and publish
6. Clone to this workspace via VS Code extension

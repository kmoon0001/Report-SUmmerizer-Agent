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

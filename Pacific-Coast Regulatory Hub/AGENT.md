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

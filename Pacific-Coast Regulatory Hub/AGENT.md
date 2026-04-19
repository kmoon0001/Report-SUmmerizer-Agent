# AGENT.md: QM Agent and Coach (Ironclad Standard)

## Mission
To provide autonomous, clinical-grade coaching to Directors of Nursing (DON) and Rehab (DOR) regarding Quality Measure (QM) improvement and MDS 3.0 compliance.

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

# FLEET_TELEMETRY_MAP.md

**Metadata:**
- **Role**: Operational Visibility Map
- **Description**: Defines the unified telemetry schema for viewing all agent performance from the Command Center.

## Unified Log Tables
- **Pac Coast Logs**: `cr917_snf_telemetry_logs` (Filter by `BotID`)
- **QM Coach Logs**: `cr917_snf_telemetry_logs` (Filter by `ActionName` like 'QM_')
- **TheraDoc Logs**: `cr917_snf_telemetry_logs` (Filter by `BotID` == 'TheraDoc')

## Key Performance Indicators (KPIs)
- **Edit Distance**: `cr917_ai_edit_distance` (Lower is better)
- **XAI Accuracy**: `cr917_xai_factors` (Completeness check)
- **Compliance Score**: `cr917_compliance_audit_score` (Target: 100)

---
*Enforced Dataverse Mapping for Pacific Coast AI Command Center.*


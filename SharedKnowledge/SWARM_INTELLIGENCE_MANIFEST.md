# SWARM_INTELLIGENCE_MANIFEST.md

**Metadata:**
- **Role**: Hub-and-Spoke Swarm Architecture
- **Orchestrator**: PENDING (Waiting for User to Clone Command Center)
- **Specialists**: `Prep Agent`, `QM Coach`, `TheraDoc`

## 1. The Central Command Hub (Orchestrator)
**Location**: `SNF AI Dashboard\topics\GlobalOrchestrator.topic.yaml`
**Mission**: Listen to User, classify request complexity, and dispatch to the specialized "Worker" bot.
**Orchestration Logic**:
- IF request == "Urgent Review" -> Dispatch to `Pac Coast Prep Agent`.
- IF request == "Quality Decline" -> Dispatch to `QM Coach`.
- IF request == "Note Audit" -> Dispatch to `TheraDoc`.

## 2. Workerbot Individualization
### A. Pac Coast Prep Agent (The Synthesis Expert)
- **Unique Feature**: **Dynamic Chaining** of Evaluation and Progress notes into a single Platinum Briefing.
- **Trigger**: `cr917_request_type` == "DeepSynthesis".

### B. QM Coach (The Regulatory Expert)
- **Unique Feature**: **SHAP-driven Root Cause** analysis of MDS 3.0 triggers.
- **Trigger**: `cr917_request_type` == "RegulatoryCompliance".
### D. Case Historian (The Longitudinal Expert)
- **Unique Feature**: **Clinical Timeline Synthesis** across PCC and Optima.
- **Trigger**: `cr917_request_type` == "HistorySynthesis".
### C. TheraDoc (The Documentation Expert)
- **Unique Feature**: **Real-time Note Refinement** via Platinum Adaptive Cards.
- **Trigger**: `cr917_request_type` == "DocumentationRefinement".

## 3. Communication Layer (The "Nervous System")
**Table**: `cr917_agent_swarm_queue`
- `cr917_message_id` (Primary)
- `cr917_sender_bot` (Source Bot)
- `cr917_target_bot` (Specialist Bot)
- `cr917_payload_json` (Clinical Context)
- `cr917_status` (Pending, Active, Resolved)

---
*Enterprise-grade clinical swarm intelligence for Pacific Coast Services.*

## 4. Universal Fleet XAI Standards
- **XAI Stack**: 7-Layer SHAP/LIME logic enforced.
- **Confidence Gate**: 85% minimum required for clinical sign-off.
- **Audit Trace**: Escalation required for low-certainty predictions.


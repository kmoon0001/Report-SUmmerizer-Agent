# PLATINUM SOURCE: PLATINUM PROMPT PATTERNS

**Metadata:**
- **Role**: Primary Source of Truth
- **Category**: Clinical Governance
- **Description**: Primary clinical and operational governance source for Pacific Coast Services AI Fleet. Reference this for all PLATINUM_PROMPT_PATTERNS logic.

---
# PLATINUM_PROMPT_PATTERNS.md

This global reference defines the few-shot learning patterns required for Microsoft Learn Platinum Standard agents.

## 1. The "Insight -> Justification" Pattern
**Goal**: Move from simple summary to medical-grade justification.
- **Bad**: "Patient is doing better in therapy."
- **Platinum**: "Patient demonstrates a 20% gain in functional reach, justifying continued skilled intervention to achieve independent ADL status as per the APTA Clinical Practice Guidelines."

## 2. The "Hallucination-Proof" Input Validation
**Goal**: Early exit on bad data.
- **Pattern**: `IF (input.RecordId == null) THEN return { "error": "CRITICAL_MISSING_ID", "status": "Fail" }`

## 3. The "Dynamic Chaining" Descriptor
**Goal**: Enable Generative Orchestration.
- **Standard**: "Handles note analysis."
- **Platinum**: "Specialized clinical analyzer for [Discipline] records; extracts functional measures, identifies Medicare Chapter 15 compliance gaps, and generates editable medical necessity justifications for EHR sync."

## 4. Specificity for "Pac Coast" Fleet
- Use HSL-curated color palettes.
- Reference the `GLOBAL_CMS_COMPLIANCE.md` in every response.
- Prioritize "Inline Editing" in Adaptive Cards to maximize DOR efficiency.


## 5. SHAP-Style Explainability (XAI)
**Goal**: Provide mathematical justification for scores.
- **Pattern**: [Score] achieved. Primary driver: [Feature] contributing [Value] to the deviation from baseline.
- **Implementation**: The Urgency Score of 85 is driven primarily by the 'Cert Expires in 3 days' feature, which represents the strongest contributor to the clinical risk profile according to the SHAP interpreter.


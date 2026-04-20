# PLATINUM_XAI_GOVERNANCE.md

**Metadata:**
- **Role**: FDA/NIST Compliant Explainability Standard (V3.1)
- **Status**: COMPLETE
- **Description**: Defines the 7-layer explainability stack for clinical intelligence.

## 1. SHAP & LIME (Feature Importance)
- **logic**: Identify primary drivers of the urgency score.
- **Pattern**: "Confidence in this Urgency Score (85) is driven by [Feature A] and [Feature B] as verified by Shapley marginal contribution and LIME local linear approximation."

## 2. Counterfactuals (The "What-If" Analysis)
- **logic**: Identify the minimal change required to change a score.
- **Pattern**: "If the patient's [Clinical Factor X] was [State Y] instead of [Current State], the Urgency Score would drop from [Current %] to [New %] (Stable)."
- **Application**: Crucial for identifying specifically which missing skilled justification is driving the risk.

## 3. Anchors & Confidence Intervals
- **logic**: Statistical upper/lower bounds of AI certainty.
- **Pattern**: "Urgency Score Check: 85 [CI: 82-88]. The prediction is 'Anchored' in the presence of Fall History."

## 4. Attention Weights & Concept Activation
- **logic**: Visualizing model focus on clinical text segments.
- **Pattern**: "The model's Attention Weights are concentrated on the 'Skilled Progress' section of the therapy note."

## 5. Layer-wise Relevance Propagation (LRP)
- **logic**: Deep-tissue credit assignment from output back to input features.
- **Pattern**: "LRP Trace confirms that [X%] of the risk relevance is derived from the '[Concept Mapping]' path."
- **Application**: Used for forensic validation of complex clinical denial triggers.

---
*Enforced for all Pacific Coast Services agents to ensure FDA/NIST compliant transparency.*


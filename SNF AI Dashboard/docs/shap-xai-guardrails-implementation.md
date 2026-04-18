# SHAP + XAI Guardrails Implementation Plan

## Decision

Yes, this is possible and recommended.

- Use **SHAP** for tabular/risk models (resident risk, falls, therapy workload drivers).
- Use **grounding + citation + claim verification** guardrails for Copilot text responses.
- Do not treat SHAP as a hallucination control for LLM text by itself.

## Why this split is correct

- SHAP explains model feature contribution for predictions.
- Hallucination control for generative answers is primarily a grounding/verification problem.

## Authoritative references

- SHAP documentation: https://shap.readthedocs.io/en/latest/
- SHAP paper (Lundberg & Lee): https://proceedings.neurips.cc/paper_files/paper/2017/file/8a20a8621978632d76c43dfd28b67767-Paper.pdf
- Copilot Studio RAG guidance: https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/retrieval-augmented-generation
- Azure OpenAI on your data grounding/citations: https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/use-your-data
- Azure AI evaluation and groundedness: https://learn.microsoft.com/en-us/azure/ai-foundry/how-to/develop/evaluate-sdk
- Azure ML Responsible AI model explanations: https://learn.microsoft.com/en-us/azure/machine-learning/concept-responsible-ai-dashboard
- NIST AI RMF 1.0 (trustworthiness principles): https://nvlpubs.nist.gov/nistpubs/ai/nist.ai.100-1.pdf
- NIST GenAI profile (hallucination/confabulation risk): https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf

## Target architecture for this app

### 1) Predictive model explainability (SHAP lane)

- Model host: Fabric/Azure ML batch scoring for resident-level risk flags.
- Output columns per prediction:
  - `prediction_score`
  - `top_feature_1`, `top_feature_1_shap`
  - `top_feature_2`, `top_feature_2_shap`
  - `top_feature_3`, `top_feature_3_shap`
  - `explanation_generated_utc`
- Surface in dashboard:
  - “Why flagged” panel per resident and per unit.

### 2) Copilot hallucination/fact-check lane

- Retrieval-first answer path against approved sources only.
- Response contract requires:
  - `answer`
  - `citations[]` (source id + location)
  - `groundedness_status`
  - `verification_status`
  - `uncertainty_reason`
- Gate behavior:
  - If evidence missing or conflicting -> no definitive answer.
  - Return safe fallback and escalation route.

## Corrective + preventative controls

### Corrective

- Add a claim-verification step before final answer emit for high-impact topics.
- Block “final clinical recommendation” when citation list is empty.
- Force structured “unknown/needs review” when verification fails.

### Preventative

- Enforce source allow-list and freshness checks.
- Add regression evaluations for groundedness in release QA.
- Track hallucination incidents and feed into weekly rule updates.

## Implementation sequence in this repo

1. Add `xai_explanations` table/file to processed outputs and Power BI package.
2. Add Copilot action output fields for citations + verification status.
3. Add flow-level contract checks in QA scripts.
4. Add dashboard panels:
   - `Resident Explanation (SHAP)`
   - `Evidence & Verification`
5. Add release gate:
   - Build fails if guarded response contract is missing required evidence fields.

## Implementation status in repo (2026-04-06)

Implemented in this workspace:

- Guarded response contract:
  - `contracts/guarded-response-contract.json`
- Action output fields added for on-demand insight action:
  - `actions/GenerateOnDemandPatientInsight.mcs.yml`
  - `workflows/SNF-Command-Center-GenerateOnDemandPatientInsight-c147cf4b-777b-43b5-8d4a-e00e0c233b49/workflow.json`
- Processed output evidence fields now propagated through handoff queue and lifecycle:
  - `scripts/New-CommandCenterAutomatedHandoffQueue.ps1`
  - `scripts/Invoke-CommandCenterAutomatedHandoffDispatch.ps1`
  - `scripts/Invoke-CommandCenterAutomatedHandoffLifecycle.ps1`
- QA gate added to fail when evidence fields are missing or invalid:
  - `scripts/Test-CommandCenterGuardedResponseEvidence.ps1`
  - invoked by `scripts/Invoke-SnfAiDashboardQaSweep.ps1`
- Executive HTML bundle now surfaces evidence fields in the handoff panel:
  - `scripts/New-ExecutiveCommandCenterReportBundle.ps1`

## Microsoft Learn update notes

- Copilot Studio RAG guidance explicitly includes citation generation and grounding validation as part of the runtime path.
- Azure AI Evaluation SDK includes `GroundednessEvaluator` and related RAG evaluators for regression gating.
- Azure OpenAI On Your Data (classic) is now deprecated and approaching retirement; prefer migration planning to Foundry Agent Service + Foundry IQ for long-term grounded-answer architecture.

## Current blocker to note

- One flow remains untitled: `db104008-d226-f111-8341-000d3a5b88c6`.
- Dataverse reports an `ActiveUnpublished` conflict tied to invalid flow template content.
- Resolve by opening that flow in Power Automate designer, fixing template validation error, saving, then renaming.

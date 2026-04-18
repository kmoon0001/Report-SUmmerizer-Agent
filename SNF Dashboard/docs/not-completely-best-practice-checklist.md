# Not-Completely-Best-Practice Checklist (Current State)

Date: 2026-04-06

Any unchecked item means the project is not yet "completely best practice."

## A) AI Guardrails and Evidence

- [x] Guarded evidence contract is enforced for every high-impact action path.
- [x] Citations in automated handoff outputs are now structured JSON objects with source/location metadata.
- [x] Verification status is derived from real backend verification outputs rather than default placeholder values.
- [ ] Groundedness regression evaluation is automated in release QA using Azure AI Evaluation SDK metrics.

## B) SHAP / XAI Lane Reliability

- [x] SHAP lane output generation is deterministic in normal QA runs (python path with deterministic fallback).
- [x] `command_center_shap_explanations.csv` is generated consistently in normal QA runs.
- [x] `command_center_shap_feature_importance.csv` is generated consistently in normal QA runs.
- [x] `command_center_shap_summary.md` is generated consistently in normal QA runs.
- [x] QA sweep no longer fails due SHAP dependency/network exceptions.

## C) Release Gate Determinism

- [x] Full QA sweep is green in the default non-interactive path.
- [ ] Browser/published smoke path is deterministic in CI/non-interactive contexts (service-principal/API lane implemented but not yet fully configured in environment).
- [x] Required gate failures block release consistently; waivers are explicit and documented.

## D) Copilot/Workflow Integrity

- [x] Topic trigger phrases are short and multi-word (single-word trigger phrase anti-pattern removed from active topics).
- [x] Every flow in tenant and repo follows naming standards (no untitled or invalid-template conflict states).
- [x] Action outputs, workflow response schema/body, and contract manifests remain fully synchronized after every change.
- [ ] All automated-handoff backends are live-validated in Copilot Studio tenant path, not just locally validated.

## E) Environment and Permissions

- [ ] Fabric item creation permissions are in place for the intended production architecture path.
- [ ] Power BI publish and promotion permissions are in place for intended CI/CD path.
- [ ] Best-path handoff endpoint permissions (webhook/flow connector strategy) are finalized and validated.

## F) Completion Rule

- [ ] This checklist is fully checked with evidence links in run logs or reports.

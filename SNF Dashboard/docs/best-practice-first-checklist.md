# Best-Practice-First Checklist

Use this checklist at project start, during implementation, and before every release. The target is zero open items in the active production path.

## 1) Architecture and Delivery Path

- [ ] The intended end state is defined before implementation starts (automation path, validation path, publish path, rollback path).
- [ ] The active path uses one supported method, not mixed ad hoc methods.
- [ ] Manual handling is explicitly tagged as exception-only with reason logging.
- [ ] Every workflow has machine-readable inputs and outputs.
- [ ] Queue owner, SLA, retry behavior, and degraded behavior are defined.

## 2) Copilot Studio Authoring Quality

- [ ] Authoring is extension-first (`Open agent` -> `Get changes` -> `Preview` -> `Apply` -> `Publish` -> live verification).
- [ ] Topic and action manifests are synchronized with authored files in the same change.
- [ ] Topic descriptions and model descriptions reflect current behavior and begin with clear orchestration phrasing.
- [ ] Dynamic closed-list conditions use `Text(Topic.ChoiceVariable)` comparisons.
- [ ] Active menu and recovery paths are button-only.
- [ ] No placeholder/stub/todo runtime paths exist in active production content.

## 3) AI Guardrails and Evidence Quality

- [ ] High-impact responses enforce a guarded evidence contract.
- [ ] Contract includes `citations`, `groundedness_status`, `verification_status`, and `uncertainty_reason`.
- [ ] Citation values include source identity and location metadata (not unlabeled text).
- [ ] If evidence is missing or conflicting, the response must not issue definitive recommendations.
- [ ] Verification failures force structured `NeedsReview` or equivalent safe fallback.
- [ ] Groundedness and verification statuses are persisted in operational outputs for auditability.

## 4) Data Contracts and Drift Controls

- [ ] Every core source and derived file has an explicit contract test.
- [ ] Schema validation runs before transforms and packaging.
- [ ] Optional-source absence triggers cleanup of stale derived artifacts.
- [ ] Drift thresholds are defined and enforced in QA.
- [ ] Derived metrics preserve fact vs recommendation boundaries.

## 5) Security, Secrets, and Compliance

- [ ] No secrets/tokens are stored in source files, docs, manifests, or logs.
- [ ] Repository secret-hygiene scan is clean before release.
- [ ] PHI handling follows least privilege and minimum necessary access.
- [ ] Sensitive telemetry/logging is reviewed for PHI leakage.
- [ ] Human escalation path is defined for ambiguous or high-risk cases.

## 6) Test and Release Gates

- [ ] Project integrity validation passes.
- [ ] Button-only routing validation passes.
- [ ] Source schema tests pass.
- [ ] Action contract sync test passes (actions/workflows/contracts/docs in lockstep).
- [ ] SHAP/XAI contract tests pass when SHAP lane is enabled.
- [ ] Guarded-response evidence contract test passes.
- [ ] Package/build reconciliation tests pass.
- [ ] Browser smoke passes for current bundle path.
- [ ] QA sweep is green or has explicit approved waivers.
- [ ] Gate skips are explicit, intentional, and documented with prerequisites to convert to PASS/FAIL.

## 7) Reliability and Operations

- [ ] Top-level scripts use run locks to prevent overlap.
- [ ] Checkpoint/resume behavior is defined where runs can be long.
- [ ] Run logs are always persisted, including failure paths.
- [ ] Cleanup logic is safe, path-validated, and logged.
- [ ] Re-runs converge to current truth and do not retain stale artifacts.
- [ ] Last-known-good rollback pointer is maintained after successful runs.

## 8) Documentation and Source-of-Truth Hygiene

- [ ] `AGENT.md` reflects current required path and quality rules.
- [ ] `docs/todo.md` reflects true active blockers and true completed work.
- [ ] Contract docs match implemented output fields.
- [ ] Tooling docs reference current supported scripts and commands only.
- [ ] Deprecated platform guidance is tracked with migration path notes.

## 9) CI/CD and Environment Readiness

- [ ] Build/test environment includes required dependencies (for example SHAP/sklearn path) or explicitly marks that lane as not enabled.
- [ ] Network/auth dependencies for gates are handled deterministically (interactive vs non-interactive path is explicit).
- [ ] Publish and smoke checks have a reliable non-interactive strategy where required.
- [ ] Deployment and promotion permissions are validated before go-live windows.

## 10) Definition of Done (Best-Practice-First)

Release is best-practice-ready only when all are true:

- [ ] No active-path placeholders or unvalidated backend claims.
- [ ] All required quality gates are green.
- [ ] Guardrail and evidence contracts are implemented and enforced.
- [ ] Operational logs and rollback path are verified.
- [ ] Documentation, manifests, and runtime behavior are synchronized.

# Ensign Platinum Swarm Unified Punch List

Last updated: 2026-04-18
Source: User architectural audit + automated repo/ALM scans.

## A. User-Reported Architecture Gaps

| Area | Gap | Status | Owner Track |
|---|---|---|---|
| Synthesis Lab | Manual Intake Form topic for OCR failure fallback | DONE (local, 2026-04-18) | Topics & Node Logic |
| Denial Defense | Appeal Template Generator from high-risk output | DONE (local, 2026-04-18) | Topics & Node Logic |
| TheraDoc | Progress Visualizer adaptive card (goal % bar) | DONE (local, 2026-04-18) | Topics & Node Logic |
| Global Settings | KnowledgeBoost threshold to 0.85 | DONE (local, 2026-04-18) | Settings & Optimization |
| Denial Defense | Small-note bypass (<150 chars) for heavy 7-layer audit | DONE (local, 2026-04-18) | Settings & Optimization |
| TheraDoc | Jimmo excellence grounding examples | DONE (local, 2026-04-18) | Knowledge & Grounding |
| Regulatory Hub / SimpleLTC | Environment variable + secure API key storage | DONE (local runbook + flow parameterization, 2026-04-18) | Knowledge & Grounding |
| Global | Friday DOR Pulse scheduled flow | DONE (local, 2026-04-18) | Workflows & Connective Tissue |
| Global | Escalation Beacon flow (3x human-assistance/critical errors) | DONE (local, 2026-04-18) | Workflows & Connective Tissue |
| Fleet UX | Naming harmonization to Ensign [Specialist] Hub | PARTIAL (requires tenant display-name publish pass) | Operational |

## B. Automated ALM / Dependency Gaps

| Project | Gap | Status | Notes |
|---|---|---|---|
| TheraDoc | Source solution in Dev is managed (TheraDocTransport) and not exportable as unmanaged | BLOCKED | Must place TheraDoc in unmanaged source solution for solution-first export/unpack |
| Ensign Regulatory Hub/deployment/src/Chatbots/cr917_agent | Workflow contains placeholder/undefined values in `SNF-ClinicalIntakeHandoffRouter-.../workflow.json` | DONE (2026-04-18) | Current router workflow has concrete schema/contentVersion values |
| Ensign Regulatory Hub/SimpleLTC QM Coach V2 | Workflow contains placeholder/undefined values in `SNF-ClinicalIntakeHandoffRouter-.../workflow.json` | DONE (2026-04-18) | Current router workflow has concrete schema/contentVersion values |
| Pac Coast Report Prep Agent/SNF Rehab Agent | Missing `connectionreferences.mcs.yml` | DONE (2026-04-18) | Added `connectionreferences.mcs.yml` with explicit placeholder map |
| Enabled agents except TheraDoc | Missing `solutionName` mappings in ALM manifest | DONE (provisional, 2026-04-18) | Added solution names; run export validation to confirm tenant alignment |
| SNF Dashboard | Placeholder constants in workflow JSON (`CLINICAL_TEAMS_GROUP_ID`, `NURSING_STATION_CHANNEL_ID`) | DONE (2026-04-18) | Replaced with workflow parameters and trigger overrides |

## C. Completed During This Pass

- Added deterministic structural scanner: `scripts/alm/Invoke-AgentProblemSweep.ps1`
- Added dependency-gaps scanner: `scripts/alm/Invoke-AgentDependencyAssessment.ps1`
- Active-wave structural issues reduced to zero.
- Workspace-wide structural issues reduced from 28 to 0 (after explicit non-runtime ignore list).
- Added ALM runbook and scripts under `scripts/alm/`.

## D. Recommended Execution Order (Best-Practice)

1. Finalize solution mappings in `scripts/alm/agent-alm.manifest.json`.
2. Unblock TheraDoc unmanaged source-solution path in Dev.
3. Resolve workflow placeholder/undefined values + missing connection references.
4. Implement user-reported topic/logic/grounding gaps.
5. Implement global scheduled/escalation flows.
6. Run ALM pack/import/publish scripts and post-publish smoke verification.

## E. Guardrails

- Solution-first ALM only for deployment transport.
- No direct unsupported headless mutation of Studio internals.
- Browser automation (Playwright) for validation/smoke, not primary deployment path.
- Keep runtime dependencies in solution: flows, connection refs, env vars, bot components.

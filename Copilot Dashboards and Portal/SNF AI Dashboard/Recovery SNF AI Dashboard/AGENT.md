# AGENT.md

This file defines the working rules for the SNF AI Dashboard project family. It applies to:
- `D:\SNF AI Dashboard`
- `D:\SNF AI Dashboard\Recovery SNF AI Dashboard`

If a deeper local `AGENT.md` exists, that deeper file overrides this one.

## Mission

Build and operate a production-grade, healthcare-safe, automation-first command center for skilled nursing workflows.

Required outcomes:
- reliable operational automation
- clinically safe behavior boundaries
- deterministic validation
- explicit runtime verification in tenant
- synchronized code, contracts, manifests, docs, and run logs

## Non-Negotiable Principles

1. Best-practice-first delivery. Do not normalize shortcuts.
2. Build toward the real production path, not a temporary path.
3. Treat placeholders, stubs, and unverifiable claims as unfinished work.
4. Keep automation-first as default; manual handling is an exception path.
5. Use repo files as editable source of truth and tenant/runtime as validation source of truth.
6. Keep implementation, validation, and docs synchronized in the same pass.
7. Prefer deterministic verification first, model-based evaluation second.

## Future Project Start Sequence

Use this sequence at project start and after major drift:

1. Identify the real production path first.
2. Read local instructions first:
   - `AGENT.md`
   - `AGENTS.md` (if present)
   - linked standards/runbooks
3. Establish source of truth before editing:
   - repo files
   - runtime/tenant state
   - current QA and run logs
4. Define quality gates before building:
   - contract validation
   - runtime validation
   - packaging/bundle validation
   - release QA
   - environment/permission prerequisites
5. Build the repair path as soon as repeated failure patterns appear.
6. Keep implementation, validation, and docs synchronized.
7. After every major job:
   - refresh instructions
   - refresh project state
   - compress context into a short durable summary
   - then start next major task

## Copilot Studio Authoring Rules

1. Put core behavior in agent instructions first; use topics/actions/knowledge to refine.
2. Prefer extension-first workflow:
   - attach/open agent
   - get changes
   - preview changes
   - apply changes
   - publish
   - verify
3. Keep topic scope narrow, reusable, and button-driven.
4. Enforce button-only interaction on active menu/recovery/operational paths.
5. If user sends free text while a button flow exists, route back to button flow.
6. Do not fabricate clinical or operational facts.
7. Route high-risk or ambiguous requests to appropriate human owner.
8. Keep `.mcs` cache extension-generated; do not copy cache artifacts from other projects.
9. Keep `topics`, `actions`, `workflows`, `contracts`, and manifests synchronized.
10. Prefer supported canvas patterns first; YAML refinement second.

## Copilot Studio HTTP Error Prevention Protocol

Before any apply/publish:

1. Verify active PAC profile and tenant:
   - `pac auth list`
   - `pac auth select --index <n>`
2. Verify workspace `.mcs/conn.json` has expected binding:
   - `EnvironmentId`
   - `AgentId`
3. Always target real environment ID GUID. Never use `public` as environment target.
4. Keep tenant/runtime as flow-binding source of truth:
   - each action `flowId` must exist in target environment
   - update actions/workflows/contracts together when flow ID or schema changes
5. Prevent output-contract drift:
   - action outputs must match live flow response schema exactly
   - if flow returns no usable outputs, keep action outputs empty
6. Required gates before apply:
   - project validation
   - contract sync validation
   - preflight with connection checks
7. Required verification after publish:
   - `pac copilot publish`
   - `pac copilot status`
   - `pac copilot list`
8. If HTTP errors occur (`Workflow ... Does Not Exist`, `status not found`, HTTP 400/500):
   - stop feature edits
   - repair environment/profile, flow ID bindings, outputs/contracts first
   - rerun full validation and publish verification in order

## Standard Validation Gates

Run before preview/apply/publish when scripts are available:

1. Project validation
2. Contract sync validation
3. Preflight/connection checks
4. Packaging/bundle integrity checks
5. QA sweep/report generation
6. Browser smoke for affected UI/runtime paths (Playwright)

Rules:
- required gates fail hard
- optional gates must report explicit `SKIP` with reason
- never allow silent skip or implied success

## Publish And Runtime Verification

After apply/publish:

1. Verify publish state (`publish` -> `status` -> `list`).
2. Verify runtime behavior against real tenant state.
3. Verify action outputs against live flow response fields.
4. Verify docs and run logs reflect current live behavior.

Do not mark complete if any required gate is failing, skipped without waiver, or unverifiable.

## Quality Definition

"Not completely best practice" includes any of:
- contracts/manifests/actions/workflows/docs drift
- unverifiable evidence or placeholder guardrail fields in active path
- active runtime depends on stubs/placeholders/draft-only components
- QA gates fail or are bypassed
- runtime validation missing for publishable paths
- missing/incomplete run logs on failure paths

If timeline pressure exists, reduce scope while preserving quality.

## Data, Safety, And Compliance

1. Treat PHI as sensitive by default.
2. Use least privilege, auditability, and secure secret handling.
3. Prefer masked/de-identified test data in development.
4. Keep clear boundary between operational support and clinical judgment.
5. Never present AI output as diagnosis or certainty.
6. Escalate when uncertain rather than guessing.

## Tooling Standards

Default tool priorities:
- Copilot Studio extension for attach/get/preview/apply
- PAC CLI for auth/publish/status/list
- Playwright for browser verification
- Microsoft Learn and official docs for platform behavior

Operational notes:
- Playwright verifies UI/runtime paths; it is not deployment-state truth by itself.
- Tenant/runtime state is required for final verification of Copilot and flow bindings.

## Run Logs And State Management

1. Persist machine-readable run logs for major workflows.
2. Record step, timestamp, status, message, and artifact path.
3. Keep current-state summary plus durable history/archive snapshots.
4. Clean up stale generated artifacts safely; never delete source-of-truth authoring assets in routine cleanup.

## Memory Refresh And Context Compression Loop

After each major feature/bugfix/release task:

1. Instruction refresh:
   - re-read `AGENT.md` (and `AGENTS.md` if present)
2. Project-state refresh:
   - update TODO/checklists/reports/run logs
3. Context compression:
   - concise snapshot of changes, validation status, blockers, next steps, prerequisites
4. Next-task handoff check:
   - start next major task only after steps 1-3 are complete

Never rely on long chat history as primary memory source.

## Hard Rules

1. Do not claim complete when best-practice gaps remain in active path.
2. Do not normalize workaround paths as the default build path.
3. Do not leave unresolved TODO/placeholders in intended final path.
4. Do not copy synthetic `.mcs` snapshots or stale cache files between projects.
5. Do not skip tenant/profile/environment verification before publish.

## Repo-Specific Binding For Recovery Workspace

When working in `D:\SNF AI Dashboard\Recovery SNF AI Dashboard`:
- read `SNF AI Dashboard Recovery\.mcs\conn.json`
- confirm expected `EnvironmentId` and `AgentId`
- ensure PAC selected profile matches that tenant before apply/publish

## Completion Standard

Work is complete only when all are true:
1. implementation is in repo and coherent
2. required validation gates pass
3. tenant/runtime checks pass for affected assets
4. publish verification is complete when publishable assets changed
5. docs/contracts/manifests/run logs are synchronized

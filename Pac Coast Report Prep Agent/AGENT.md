# AGENT.md

This file defines repo-level operating rules for:

`D:\Report SUmmerizer Agent`

If a deeper local `AGENT.md` exists in a child folder, that file overrides this one for that subtree.

## Mission

Maintain and deploy the Copilot Studio agent safely to production paths with deterministic validation and explicit runtime verification.

## Repo Context

- Primary local project path: `D:\Report SUmmerizer Agent\SNF Rehab Agent`
- Bound Dataverse endpoint: `https://org3353a370.crm.dynamics.com/`
- Bound environment ID: `fd140aae-4df4-11dd-bd17-0019b9312238`
- Bound agent ID: `c030a53a-4839-f111-88b4-000d3a37eba2` (`Therapy_Report_Prep_Assistant`)

## Real Production Path First

- Start by identifying the real production path, not a temporary shortcut path.
- Read local instructions first:
  - `AGENT.md`
  - `AGENTS.md` (if present)
  - linked runbooks and standards
- Establish source of truth before editing:
  - repo files
  - live runtime/tenant state
  - current QA and run-log artifacts

## Quality Gates Before Build

Define and enforce these gates before apply/publish:

1. Contract validation
2. Runtime validation
3. Packaging/bundle validation
4. Release QA
5. Environment and permission prerequisites

Rules:
- Prefer deterministic validation first, model-based evaluation second.
- Treat placeholders, stubs, and unverifiable claims as unfinished work.
- Keep implementation, validation, and docs synchronized in one pass.

## Copilot Studio HTTP Error Prevention Protocol

Before any apply/publish:

1. Verify active PAC profile and tenant:
   - `pac auth list`
   - `pac auth select --index <n>`
2. Verify workspace binding:
   - `.mcs/conn.json` has expected `EnvironmentId` and `AgentId`
3. Use real environment target:
   - never use `public` as an environment target
   - use environment GUID or absolute Dataverse URL
4. Keep tenant/runtime as source of truth for flow bindings:
   - every action `flowId` must exist in target environment
   - keep `actions`, `workflows`, and `contracts` in sync when flow IDs/schemas change
5. Prevent output-contract drift:
   - action outputs must exactly match live flow response schema
   - if no stable output exists, keep outputs empty and avoid references

Required gates before apply:
- project validation
- contract sync validation
- preflight with connection checks

Required verification after publish:
- `pac copilot publish`
- `pac copilot status`
- `pac copilot list`

When HTTP/runtime errors occur (`Workflow ... Does Not Exist`, `status not found`, HTTP 400/500):

1. Stop feature edits.
2. Repair auth/environment/profile binding first.
3. Repair flow ID bindings and output contracts.
4. Re-run full validation gates.
5. Re-run publish verification in order.

## Repeated Failure Repair Path

If failures repeat, build and use a scripted repair path immediately rather than ad hoc retries. Prefer one deterministic recovery workflow over manual one-off fixes.

## Major-Job Reset Loop

After every major job:

1. Refresh instructions (`AGENT.md`, `AGENTS.md`).
2. Refresh project/runtime state.
3. Compress context into a short durable summary.
4. Only then start the next major task.

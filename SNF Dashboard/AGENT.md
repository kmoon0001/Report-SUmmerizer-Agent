This file defines the working rules for the `SNF Command Center` project unless a deeper `AGENT.md` overrides it.

## Scope

- Applies to the full workspace by default.
- Applies to feature subprojects unless they add a more specific local `AGENT.md`.

## Project Intent

SNF Command Center is a live, AI-powered operating system for skilled nursing facilities. The goal is to combine conversational AI, real-time data, predictive analytics, and healthcare compliance into a single command-and-control experience for executive, nursing, therapy, CNA, maintenance, and activities roles.

## Architecture Priorities

- Prefer event-driven and streaming-first designs for live operational data.
- Use Microsoft Fabric Real-Time Intelligence for sub-second ingestion, processing, and alerting where live telemetry matters.
- Use Power BI Direct Lake and OneLake for low-latency semantic modeling and reporting.
- Use Dataverse-equivalent structured storage for master patient, unit, user, role, and policy data.
- Use Graph, SharePoint, OneDrive, SQL, Postgres, PCC, and NetHealth integrations only where they improve operational fidelity and can be secured appropriately.
- Prefer role-specific experiences instead of one generic dashboard for all users.

## Data And Insight Rules

- Keep live tiles under 5 seconds refresh where practical.
- Keep assistant responses under 2 seconds for routine queries when data is already indexed or precomputed.
- Use predictive scores, but never present them as diagnosis or certainty.
- Preserve the distinction between raw facts, derived metrics, and AI recommendations.
- Route high-risk events to alerting and human review, not silent automation.

## Copilot Studio And Automation Rules

- Put core behavior in agent instructions first, then use topics, tools, flows, and knowledge to refine that behavior.
- Automation-first design is the default:
  - design for automated routing, automated handoff, and automated status tracking from the first implementation
  - treat manual handling as a controlled exception path, not the primary path
  - require an explicit reason in notes/run logs whenever a step falls back to manual handling
- Use the repo as the editable source of truth and the live tenant as the validation source.
- Prefer solution-aware Copilot Studio work and round-trip validation.
- Use the Copilot Studio extension as the first and primary authoring and sync path.
- Use the correct best-practice path first time and every time. Do not build the local workflow around shortcuts.
- Keep the topic count as low as practical. Reuse topics, entities, slot filling, and branching before cloning near-duplicate topics.
- Keep topic scope narrow, reusable, and button-driven.
- Preserve context on failures and offer retry, manual continue, or start over.
- Do not fabricate clinical or operational facts.
- If Preview/Get/Apply breaks, follow the repo runbook in `docs/copilot-studio-sync-recovery.md` and prefer extension-driven cache rebuild over manual `.mcs` edits.
- Keep `.mcs` cache files extension-generated. Only `conn.json`, `.gitkeep`, and lightweight local metadata should exist before the first healthy sync.
- Do not copy `botdefinition.json`, `changetoken.txt`, `filechangetrack.json`, or synthetic live snapshots from another project into a new project.
- Treat the Copilot Studio extension as the owner of the workspace snapshot. Use the repo for authored files and the live tenant for validation.
- Do not paste tokens, PATs, client secrets, or access keys into chat, source files, docs, or manifests. Use environment variables, secure prompts, or platform credential stores.
- Keep `topics`, `actions`, `workflows`, and their manifests synchronized so Preview/Get/Apply does not fail on local referential integrity issues.
- Prefer quoted string values for closed-list menu `Value` fields in topic YAML.
- When a topic question uses `DynamicClosedListEntity`, compare the selected option with `Text(Topic.ChoiceVariable)` in conditions. Do not use `Topic.ChoiceVariable.Value` and do not compare `Topic.ChoiceVariable` directly to a string.
- Prefer built-in entities first, then closed lists or option sets, then custom or regex-style recognition only when the built-in patterns cannot safely represent the input.
- Use file groups when role, workflow, region, or policy context should cause the agent to choose one subset of knowledge files instead of another.
- Prefer canvas-authored question, routing, condition, and action-call patterns first and YAML editing second. Use YAML to inspect or refine exported shapes, not to normalize unsupported authoring patterns into the main workflow.
- Enforce button-only interaction in active workflows:
  - use closed-list or boolean question entities for user choices
  - do not add open text question nodes in active menu/recovery/operational paths
  - if user sends free text, route back to a button menu instead of collecting free text
- If `pac copilot publish` throws a response parsing error, verify the bot with `pac copilot status` and `pac copilot list` before treating the publish as failed.
- No shortcuts:
  - do not copy `.mcs` cache files from another project
  - do not treat a stub-only action/workflow layer as production-ready
  - do not leave placeholder names, TODO markers, or unfinished bind points in the intended final path
  - do not make a one-off cache workaround the standard setup path
- Always drive toward the correct end state:
  - extension-built workspace cache
  - locally valid repo
  - clean Preview/Get/Apply sequence
  - explicit publish
  - explicit live verification

## Build And Development Lifecycle Rules

- These standards apply during the whole build process, not just at the end.
- Start with the intended automated end state and build toward it from day one.
- Build to production quality from the first commit. Do not use a "build first, quality later" approach on the active path.
- Treat quality requirements as design-time requirements, not post-build cleanup tasks.
- Extension-first is the default method:
  - attach
  - get changes
  - preview
  - apply
  - publish
  - verify
- Do not treat recovery paths as equal alternatives to the primary method.
- If the extension fails, the fallback path must aim to restore the extension-first method, not replace it.
- If automation fails, recovery must restore the automated path instead of normalizing manual-only operation.
- Do not keep placeholders, TODO markers, draft-only bind points, or stub-only workflow pieces in the active intended build path.
- If a component is not real yet, isolate it as draft-only and keep it out of the active production path.
- Prefer correct omission over fake completion.
- Prefer one correct supported method over multiple ad hoc methods.
- "Not yet best practice" is treated as unfinished work. Do not mark work complete while any release-gate quality gap remains open.

## Best-Practice-First Delivery Standard

- Always design and implement with highest-quality end-state expectations from the beginning.
- Do not intentionally introduce temporary low-quality patterns into the active runtime path.
- Every implementation decision must preserve:
  - correctness
  - safety
  - observability
  - repeatability
  - recoverability
- If timeline pressure exists, reduce scope while preserving quality; do not reduce quality to preserve scope.
- If a capability cannot yet meet required quality gates, keep it in draft mode or disable it from the active path.
- Use [best-practice-first-checklist.md](/d:/SNF%20AI%20Dashboard/docs/best-practice-first-checklist.md) at design start, before publish, and during post-change review.
- Track open quality gaps in [not-completely-best-practice-checklist.md](/d:/SNF%20AI%20Dashboard/docs/not-completely-best-practice-checklist.md) and close them before claiming best-practice completion.

## "Not Completely Best Practice" Means

The implementation is not completely best practice when any of the following is true:

- evidence/guardrail contract exists in docs but is not enforced in runtime outputs
- high-impact paths can return recommendations without citations or verification status
- action contracts, workflow response schemas, manifests, and docs are out of sync
- required QA gates fail, are skipped without explicit waiver, or are non-deterministic in normal execution
- active runtime path depends on placeholder, stub-only, or draft-only behavior
- optional-source failures leave stale artifacts that can be mistaken as current truth
- run logs are missing, incomplete, or not persisted on failure
- docs claim capabilities that have not been live-validated
- validation is green only because a critical lane silently failed or was bypassed
- environment/dependency prerequisites for required gates are missing in the intended run path

## Copilot Studio Bootstrap Sequence

1. Open the workspace in VS Code.
2. Confirm the Copilot Studio extension is installed and updated.
3. Confirm MCP config is present and Playwright/PAC tooling is available.
4. Attach with `Copilot Studio: Open agent`.
5. Let the extension create or rebuild `.mcs` cache files through `Open agent` or `Get changes`.
6. Run:
   - `scripts/Validate-SnfAiDashboardProject.ps1`
   - `scripts/Invoke-SnfAiDashboardPreflight.ps1 -RequireConnection`
   - `scripts/Get-CopilotStatus.ps1`
7. Run `Copilot Studio: Get changes`.
8. Run `Copilot Studio: Preview changes`.
9. Run `Copilot Studio: Apply changes` only after preview is clean.
10. Publish and verify live status.

This is the required path forward for new projects and existing projects. Do not replace it with a faster but less reliable sequence.

## Known Copilot Studio Failure Patterns

- Missing `.mcs/botdefinition.json`
  - fix: reload the window, reopen the agent, and run `Get changes`
- `The input string '1033>>>>>>> ' was not in a correct format`
  - fix: clear corrupted `.mcs` cache files, keep `conn.json`, and let the extension rebuild the snapshot
- `Unknown bot component`
  - fix: stop using synthetic `.mcs` snapshots and rebuild through extension sync
- apply blocked by remote drift
  - fix: `Get changes`, reconcile, preview again, then apply
- preview/apply parser failures
  - fix: check for malformed YAML, merge markers, unresolvable dialog references, missing workflow folders, or flow IDs with no matching workflow folder
  - also check for invalid `DynamicClosedListEntity` condition expressions, especially `Topic.*.Value = "..."` and direct `Topic.* = "..."` string comparisons
- repeated apply loop with `HTTP 400 Bad Request` + `Service request failed`
  - likely cause in this project: workflow subfolders under `workflows/` were removed while actions/manifests still reference their flow IDs
  - fix sequence:
    1. `powershell -ExecutionPolicy Bypass -File "scripts/Restore-WorkflowFoldersFromMirror.ps1"`
    2. `powershell -ExecutionPolicy Bypass -File "scripts/Validate-SnfAiDashboardProject.ps1"`
    3. `powershell -ExecutionPolicy Bypass -File "scripts/Reset-CopilotStudioWorkspaceCache.ps1"`
    4. run extension commands in order: `Get changes` -> `Preview changes` -> `Apply changes`
    5. re-run validation and restore workflow folders again if the extension removed them
  - standard one-command path:
    - `powershell -ExecutionPolicy Bypass -File "scripts/Invoke-CopilotApplyResilient.ps1"`

## Preventive Checks From Lessons Learned

- Do not treat validator success as full correctness. This project can validate cleanly while still containing wrong `Topic.*` references, stale summaries, or stale action descriptions.
- On every substantial topic edit, compare declared `init:Topic.*` variables against later `Topic.*` references in the same file.
- On every routing change, verify that the topic description, `modelDescription`, summary text, and next-step text still describe the current path.
- Keep the active project path separate from the starter-bundle path during quality review:
  - the active project path must stay free of unfinished bind points
  - the starter bundle may contain starter-state content, but it should use explicit starter-state labels instead of raw placeholder language
- If a backend action is not live-validated in Copilot Studio, keep the live topic in structured-intake and manual-review mode rather than leaving an unvalidated backend on the active path.
- After any bulk text replacement, spot-check:
  - action YAML descriptions
  - workflow response bodies
  - manifest CSV text
  - project docs
  Bulk replacement can leave awkward or misleading prose even when files still parse.
- Treat manifests as operational files. If a topic, action, or workflow changes, update the matching manifest in the same pass.
- Exclude `playwright/node_modules` and other vendored directories from project defect scans so real issues stay visible.
- If a problem appears in both the active project and the reusable scaffold, fix the active project first and then propagate the correction into the scaffold.

## Lessons Learned And Reusable Tactics

- Treat tenant state as part of the implementation surface, not an afterthought:
  - local files can be correct while tenant flows, connections, permissions, publish state, or naming still block release
  - include tenant naming, publish, activation, and connection-reference checks in the normal path early
- Automate the fix path, not just the detection path:
  - if a QA gate catches a recurring issue, add a repair script or repair logic instead of relying on a manual runbook
  - prefer scripts that can detect, repair, re-validate, and report in one pass
- For Power Automate and Copilot-linked backends, assume three layers must agree:
  - repo contract and manifest
  - workflow definition and response schema
  - tenant runtime object state
  If one layer drifts, release quality is not complete.
- For flow repair work, always check these first:
  - naming standard compliance
  - draft vs active vs active-unpublished state
  - missing `connectionReferences`
  - missing `host.connectionReferenceName`
  - response-schema/body mismatches between success and error branches
- When a cloud flow fails publish, do not stop at the first error string:
  - inspect the full flow definition
  - inspect Dataverse workflow state
  - inspect `clientdata`
  - inspect tenant `connectionreferences`
  - repair the real bind point, then publish and reactivate
- Evidence fields should be derived, not decorative:
  - do not emit `groundedness_status`, `verification_status`, `citations`, or `uncertainty_reason` as placeholders in active paths
  - compute them from actual source coverage, backend rules, or evaluator output
- Prefer deterministic verification before model-based verification:
  - if a recommendation is generated from rule logic, first verify it against the rule inputs and expected output
  - then add model-based groundedness scoring as a higher-order regression gate
- Build QA gates with a strict dependency model:
  - required local gates should fail hard
  - optional advanced gates should emit explicit `SKIP` with reason when environment prerequisites are missing
  - never allow a silent skip
- Design advanced evaluation hooks to be activation-ready:
  - generate the evaluation dataset even when the evaluator is unavailable
  - persist machine-readable results and markdown summaries
  - make it easy to move from `SKIP` to enforced `PASS/FAIL` by supplying credentials or packages
- Secret scanners can flag implementation text, not just real secrets:
  - avoid variable names or inline patterns that look like embedded credentials when possible
  - re-run secret hygiene after adding auth-related code paths
- Parallel execution is useful, but do not run steps in parallel when one consumes the output of another freshly written artifact.
- When fixing mirrored problems across active project and scaffold/bundle assets:
  - fix active runtime first
  - validate active runtime
  - then propagate the correction to reusable artifacts
- Keep generated reports honest:
  - if a gate is not active because the package, credential, or tenant permission is missing, say `SKIP` and name the exact prerequisite
  - do not report implied compliance from incomplete execution
- For future projects, standardize these from day one:
  - naming gates
  - contract sync checks
  - source-backed citation requirements
  - deterministic verification rules where available
  - model-based groundedness hook with explicit prerequisites
  - tenant-state validation for publishable assets

## Future Project Start Sequence

Use this sequence at the beginning of any new healthcare/Copilot/automation-heavy project so the project starts on the correct path instead of being repaired later.

### Global Start Sequence

- Identify the intended production runtime first:
  - live platform surfaces
  - real backend path
  - real deployment path
  - real QA and release gates
- Read the instruction stack before planning:
  - global Codex instructions
  - local `AGENT.md` or `AGENTS.md`
  - linked standards, runbooks, and design rules
- Define the source-of-truth stack explicitly:
  - repo source files
  - tenant/runtime state
  - generated artifacts
  - run logs and QA reports
- Define mandatory gates before implementation starts:
  - contract integrity
  - runtime integrity
  - evidence/guardrail integrity
  - packaging integrity
  - release QA
  - environment and permission prerequisites
- Reduce scope if necessary, but keep the active path at production quality.
- Add repair automation as soon as a failure pattern becomes repeatable.

### Local Project Start Sequence

For this project specifically, use this order:

1. Read:
   - [AGENT.md](/d:/SNF%20AI%20Dashboard/AGENT.md)
   - [best-practice-first-checklist.md](/d:/SNF%20AI%20Dashboard/docs/best-practice-first-checklist.md)
   - [not-completely-best-practice-checklist.md](/d:/SNF%20AI%20Dashboard/docs/not-completely-best-practice-checklist.md)
   - [world-class-delivery-runbook.md](/d:/SNF%20AI%20Dashboard/docs/world-class-delivery-runbook.md)
   - [cross-ide-mcp-and-playwright-setup.md](/d:/SNF%20AI%20Dashboard/docs/cross-ide-mcp-and-playwright-setup.md)
   - [kiro-mcp-setup.md](/d:/SNF%20AI%20Dashboard/docs/kiro-mcp-setup.md)
   - [copilot-studio-fallback-runbook.md](/d:/SNF%20AI%20Dashboard/docs/copilot-studio-fallback-runbook.md)
   - [secure-credential-bootstrap.md](/d:/SNF%20AI%20Dashboard/docs/secure-credential-bootstrap.md)
   - [todo.md](/d:/SNF%20AI%20Dashboard/docs/todo.md)
2. Confirm local and tenant state:
   - current repo files
   - current generated artifacts under `data/processed`
   - current tenant flow status, naming status, and connection-reference state when changing flows
3. Run baseline validation before major edits:
   - [Validate-SnfAiDashboardProject.ps1](/d:/SNF%20AI%20Dashboard/scripts/Validate-SnfAiDashboardProject.ps1)
   - [Invoke-SnfAiDashboardQaSweep.ps1](/d:/SNF%20AI%20Dashboard/scripts/Invoke-SnfAiDashboardQaSweep.ps1)
4. Identify whether the task changes:
   - Copilot topics/instructions
   - action/workflow contracts
   - tenant flows
   - evidence/guardrail logic
   - Power BI/Fabric/report packaging
5. If the task touches any of those areas, update implementation, validation, and docs in the same pass.
6. Re-run the full implemented path after changes, not just parser checks.
7. Refresh the memory/context loop before starting the next major task.

## Microsoft Learn Audit Standard

Treat this section as the end-to-end build method for world-class Copilot Studio and healthcare automation projects. Use it from project start through release, not only during cleanup.

### Core Rule

- Build the agent the way Microsoft Learn expects it to operate:
  - instructions first
  - clear topic, tool, and knowledge descriptions
  - grounded capabilities only
  - reusable topics instead of duplicated routing chains
  - explicit evaluation and validation
  - explicit publish and live verification

### What This Means In This Environment

In this project, "doing it correctly" means using:

- Codex for implementation, repo validation, runbook execution, and repair automation
- VS Code as the primary authoring environment
- the Microsoft Copilot Studio extension as the primary attach/get/preview/apply/publish path
- MCP servers for Microsoft-first documentation, Azure context, Power BI context, filesystem access, and safe browser validation
- Playwright/browser automation for UI verification, smoke testing, and authenticated flow checks
- repo scripts for repeatable validation, packaging, and QA

Do not treat any one of these in isolation as the product. World-class quality requires all of them to agree.

### Rules We Follow From Beginning To End

#### 1. Instructions And Resource Design First

- Start with agent instructions before adding complexity in topics or flows.
- Keep instructions behavioral and operational, not verbose or stylistic.
- Only instruct the agent to use resources that are actually configured.
- Keep tool, topic, workflow, and knowledge-source descriptions explicit enough that orchestration can choose correctly.

Example in this repo:
- Do not say "use the clinical tools when needed."
- Do say:
  - which action handles a patient insight request
  - which topic handles escalation or recovery
  - which knowledge/file group is for policy, compliance, or operational workflow

#### 2. Build Supported Authoring Paths First

- Use the Copilot Studio extension as the primary authoring and sync path.
- Use YAML/code edits to refine supported shapes, not to normalize unsupported patterns into the main path.
- Keep topic logic small and reusable.
- If the same node sequence repeats across topics, convert it into a reusable topic.

Example in this repo:
- if multiple topics call the same Power Automate flow chain, move that chain into one dedicated topic instead of copying the same nodes into multiple topics

#### 3. Use MCP And Microsoft Learn Before Guessing

- Use Learn MCP or Microsoft Learn web lookups before making design claims about:
  - Copilot Studio behavior
  - tool and knowledge-source guidance
  - evaluation guidance
  - Azure AI or Foundry evaluator behavior
  - Power Platform or tenant authoring rules
- Use Azure/PBI MCP for real environment context when the task depends on live state.
- Use filesystem/git for repo truth.

Example in this repo:
- before changing groundedness behavior, check Learn for `GroundednessEvaluator` guidance and tool-output evaluation expectations rather than inventing a scoring model

#### 4. Build Automation And Repair Paths Together

- Every repeated failure mode should get:
  - a detector
  - a repair path when safe
  - a validation pass after repair
- Do not leave a known failure mode as "manual tribal knowledge."

Example in this repo:
- flow naming drift and missing connection references should be handled by scripts, not just documented in markdown

#### 5. Keep Evidence Real

- Do not use placeholder evidence fields in active runtime paths.
- `citations`, `groundedness_status`, `verification_status`, and `uncertainty_reason` must come from:
  - actual backend rules
  - actual source coverage
  - actual evaluator output
  - or explicit `NotAvailable` / `NeedsReview` states with real reasons

Example in this repo:
- if the queue says `Verified`, it must include citations and real evidence-source coverage
- if groundedness scoring is not configured, QA must say `SKIP` with the exact missing prerequisite

#### 6. Prefer Deterministic Verification Before Model-Based Verification

- First verify what can be checked exactly:
  - expected output text for a rule path
  - schema presence
  - evidence-source attachment
  - tenant object state
- Then use model-based evaluation for groundedness, quality, or RAG scoring.

Example in this repo:
- handoff insight text is first checked against the deterministic progress-level rule
- then the Azure AI Evaluation groundedness lane is used as a higher-order QA hook

#### 7. Treat Tenant State As Part Of The Product

- Repo correctness is not enough.
- Validate:
  - flow naming
  - flow publishability
  - connection references
  - active/draft state
  - permissions
  - delivery path readiness

Example in this repo:
- a flow can be correct in source control and still fail in tenant because of `ActiveUnpublished` state or missing `connectionReferenceName`

#### 8. Use Browser Automation Only For The Right Jobs

- Use Playwright/browser automation for:
  - UI verification
  - smoke tests
  - regression checks
  - authenticated workflow observation when needed
- Do not use browser automation as the only source of truth for deployment or publish state when an API or tenant object model exists.

Example in this repo:
- use Playwright to confirm the executive bundle renders correctly
- use Dataverse/flow APIs to verify flow state, names, and publish behavior

#### 9. Make QA Layered And Honest

- QA should have layers:
  - parse and structural validation
  - contract validation
  - runtime artifact validation
  - tenant/platform validation
  - evaluation gates
  - browser smoke
- Optional advanced gates must report `SKIP` with reason, never silent success.

Example in this repo:
- groundedness evaluation is wired into QA, but reports `SKIP` until `azure-ai-evaluation` and Azure OpenAI config are present

#### 10. Sync Docs, Code, Contracts, And Runtime Together

- When changing a capability, update in the same pass:
  - topic/action/workflow logic
  - contract/manifest files
  - QA gates
  - docs and runbooks
  - tenant validation if applicable

Example in this repo:
- if action outputs change, update:
  - action YAML
  - workflow response schema/body
  - contract manifest
  - matrix files
  - QA tests
  - docs

### Step-By-Step Directions For How To Work This Way

#### Phase 1: Start In VS Code

Where:
- VS Code in the repo root

What to do:
1. Open the repo in VS Code.
2. Read:
   - `AGENT.md`
   - `docs/best-practice-first-checklist.md`
   - `docs/not-completely-best-practice-checklist.md`
   - `docs/todo.md`
3. Confirm MCP profile/tools are available.
4. Confirm the Copilot Studio extension is installed and attached if the task touches Copilot assets.

#### Phase 2: Establish Current Truth

Where:
- terminal
- repo files
- tenant if flows or live Copilot assets are involved

What to do:
1. Run local validation:
   - `scripts/Validate-SnfAiDashboardProject.ps1`
2. Run QA sweep:
   - `scripts/Invoke-SnfAiDashboardQaSweep.ps1`
3. Review:
   - `data/processed/snf_qa_sweep_report.md`
   - `docs/not-completely-best-practice-checklist.md`
   - `docs/todo.md`
4. If tenant assets are involved, inspect tenant state before editing assumptions.

#### Phase 3: Research Before Design Decisions

Where:
- Learn MCP or Microsoft Learn

What to do:
1. Look up the relevant Microsoft Learn guidance before changing:
   - instructions
   - topics
   - tools/actions
   - file groups/knowledge
   - evaluation
   - Azure/Power Platform behavior
2. Base the design on official supported behavior, not memory or guessed platform behavior.

#### Phase 4: Implement In The Repo

Where:
- repo source files
- scripts

What to do:
1. Make the code/config change.
2. Add or update the validation gate for that change.
3. Add repair logic if the failure is known and repeatable.
4. Update docs and manifests in the same pass.

#### Phase 5: Validate The Real Path

Where:
- terminal
- tenant
- browser

What to do:
1. Re-run validation and QA.
2. If the task touches Copilot Studio assets, use:
   - extension `Get changes`
   - `Preview changes`
   - `Apply changes`
   - publish
3. If the task touches tenant flows or delivery paths, validate the live object state.
4. If the task touches UI/report surfaces, run Playwright/browser smoke.

#### Phase 6: Close The Loop

Where:
- docs
- run logs
- generated reports

What to do:
1. Update `docs/todo.md`.
2. Update `docs/not-completely-best-practice-checklist.md`.
3. Refresh run logs/reports.
4. Re-read `AGENT.md`.
5. Write a compressed state snapshot before starting the next major feature.

### Minimum World-Class Standard For This Repo

Do not call the product world-class until all of these are true:

- groundedness evaluation is active, not `SKIP`
- browser/published smoke is deterministic in CI/non-interactive mode
- contracts, workflows, actions, and docs cannot drift without failing QA
- automated handoff is live-validated in tenant
- Fabric/Power BI/handoff permissions are in place for the intended production path
- every unchecked item in `docs/not-completely-best-practice-checklist.md` is closed with evidence

## Preventive Build Actions

Before every `Preview changes` or `Apply changes` run:
1. Run `scripts/Validate-SnfAiDashboardProject.ps1`.
2. Run `scripts/Invoke-SnfAiDashboardPreflight.ps1 -RequireConnection`.
3. Scan the active path for unresolved `Topic.*` references and stale action text.
4. Scan the active path for unresolved dialog targets, missing workflow folders, and orphaned `flowId` bindings.
5. Confirm the active path does not contain unfinished-state markers, stub-only runtime paths, or misleading backend claims.
6. Enforce button-only routing with `scripts/Test-ButtonOnlyQuestionRouting.ps1`.
7. If workflow folder count is unexpectedly zero or apply has failed with HTTP/service-request errors, run:
   - `powershell -ExecutionPolicy Bypass -File "scripts/Invoke-CopilotApplyResilient.ps1"`

After every bulk rename, wording change, or routing change:
1. Spot-check one representative topic, action, workflow, manifest, and doc.
2. Confirm the active runtime path still describes what is truly live.
3. Confirm any reusable scaffold copy is updated so the same issue is not reintroduced later.

## Hardening And Resilience Lessons

- Treat orchestration as a first-class implementation surface, not glue code.
- Prefer shared helpers for orchestration concerns such as:
  - step execution boundaries
  - consistent pass/warn/fail status recording
  - stale-artifact cleanup
  - run-log persistence
  - optional-step degradation
- For top-level workflows, isolate required steps from optional steps.
  - required steps should fail fast and stop the run
  - optional steps should warn, clean up their own stale outputs, and let the required path continue when safe
- Every top-level orchestration script should leave a machine-readable run log even when the run fails partway through.
- Use `try`/`finally` for run-log persistence so failure does not erase operational traceability.
- If an optional input is absent, prefer explicit cleanup of stale derived artifacts over silently reusing old outputs.
- If an optional downstream step fails, remove its dependent outputs so later stages cannot package misleading stale data.
- Prefer single-entrypoint scripts for repeatable operations, but keep them composed of smaller validated scripts underneath.
- Build quality gates in layers:
  - source-contract validation
  - project integrity validation
  - packaging validation
  - bundle/report validation
  - top-level QA sweep
- QA checks should only require artifacts that are guaranteed by the path being tested. Do not make standalone validation depend on unrelated prior orchestration state.
- Graceful degradation must be explicit in both outputs and logs. If therapy, refresh, or bundle steps are unavailable, the summary and run logs should say so directly.
- Keep runtime summaries honest:
  - do not zero-fill missing optional domains in a way that looks like true measured zero
  - do not present absent therapy or priority data as complete
- Prefer generated JSON summaries alongside human-readable markdown or HTML so downstream tools can consume the current state safely.
- Re-run the full normal path after hardening work. Do not stop at script parse success.

## Orchestration Expectations

- Use `scripts/CommandCenterRuntime.ps1` or an equivalent shared helper for new top-level orchestration work.
- Every new workflow should assume it will be automated in production:
  - define machine-readable inputs and outputs
  - define queue/owner/SLA behavior for handoffs
  - define retry and degraded behavior without losing traceability
- New top-level scripts should define:
  - required inputs
  - optional inputs
  - cleanup behavior for stale derived outputs
  - run-log output path
  - clear pass/warn/fail semantics
- New orchestration scripts should be safe to run repeatedly.
- Repeated runs must converge on current state and not accumulate stale artifacts from older partial runs.
- If a workflow can produce partial value without an optional source, design it to do so and record the degraded state explicitly.

## Run-Log Rules

- Keep run logs in machine-readable JSON.
- Record:
  - timestamp
  - step name
  - status
  - message
  - artifact path when relevant
- Write run logs to stable predictable paths under `data/processed` for implemented operational workflows.
- Preserve durable state alongside current-state outputs:
  - keep a structured current summary
  - append or refresh a longitudinal operational history artifact
  - archive timestamped executive snapshots instead of relying only on overwrite-in-place current folders
- For nested orchestration:
  - keep a local run log for the inner workflow
  - keep a separate run log for the outer orchestration entrypoint
- Validate that run-log artifacts exist in QA when they are produced by the path under test.

## Cleanup Rules

- Cleanup is part of correctness, not a cosmetic step.
- Safe cleanup only:
  - only delete generated artifacts under known output roots such as `data/processed`, `data/exports`, and other script-declared generated paths
  - never delete source-controlled authoring assets (`topics`, `actions`, `workflows`, `knowledge_sources`, manifests, docs) as part of routine cleanup
  - never delete raw landing inputs in `data/incoming` unless a task explicitly requests that deletion
  - never delete credential files or settings files (`.env`, `.env.example`, `.vscode`, `.mcs`, connection references) during automated cleanup
  - validate target paths before recursive cleanup; if a computed path is empty, root-like, or outside the project root, abort cleanup
  - prefer retention cleanup over full purge for history, checkpoints, and archives (keep recent files by count and/or age)
  - when uncertain whether an artifact is generated or source-of-truth, do not delete it automatically
  - log every cleanup deletion with path and reason in the run log
- Remove stale optional artifacts when:
  - the upstream optional input is missing
  - an optional transform fails
  - a downstream bundle should not include obsolete prior-run outputs
- Package-generation scripts should clear old generated files before writing fresh outputs, while preserving intentional static files such as local README files.
- Do not let previous-run therapy, priority, or bundle files survive into a docs-only or census-only run unless the script explicitly declares that behavior.
- History and archive generation should also be idempotent:
  - the latest summary should reconcile to the latest history row
  - the latest successful refresh should leave a timestamped archive snapshot
  - QA should verify that the current summary, history, and archive outputs agree

## Tooling Rules

- Use Playwright for browser verification.
- Use Microsoft Learn MCP for current Microsoft docs, release notes, API guidance, and implementation validation.
- Use Azure MCP for Azure resource context and Azure-side operations.
- Use the remote Power BI MCP server for semantic-model query workflows.
- Use Playwright for Fabric and Power BI UI verification, smoke tests, and regression checks.
- Use official Power BI REST APIs, Fabric REST APIs, or workflow backends for publish, deployment, refresh, item creation, and admin operations.
- Default MCP stack for this project:
  - `pac-cli`
  - `filesystem`
  - `git`
  - `github`
  - `learn-docs`
  - `azure-mcp`
  - `powerbi-remote`
  - `playwright`
- `fetch` and `memory` are not part of the default profile anymore. Only add them back if the project has a repeated, concrete need.
- Treat Dataverse MCP, FHIR MCP, Azure Health Data Services MCP, workflow MCP, and Fabric Pro-Dev MCP as preferred Microsoft-first healthcare integration patterns when available for the project.
- Use GitHub Actions or Azure DevOps for CI/CD when the component supports it.
- Use Microsoft Learn and official Microsoft guidance as the primary reference for implementation choices.
- Align agent instructions, topic descriptions, action descriptions, and knowledge-source descriptions to Microsoft Learn authoring guidance.
- Align naming and titling to Microsoft Learn authoring intent:
  - one purpose per name
  - descriptive names over abbreviations
  - avoid internal-only phrasing where the title is meant to support orchestration
  - avoid periods (`.`) in topic names
  - topic purpose text should normally start with `Use this topic when...` or `Use this topic to...`
  - action purpose text should normally start with `Use this action to...` or `Use this action when...`
  - knowledge source and file-group names should say what domain, role, or workflow they cover
- Trigger phrase quality defaults:
  - prefer short phrases instead of long sentences
  - avoid single-word trigger phrases for production topics
  - use multiple distinct intent phrases per topic where needed for robust routing
  - keep trigger phrases capability-specific to reduce overlap and false matches
- Prefer concise ordered instructions, narrow topic purpose text, explicit action-purpose text, and detailed knowledge-source descriptions that help generative orchestration choose the right asset.
- For authoring text, use these defaults unless a live export proves a different requirement:
  - agent instructions: short ordered directives with the highest-priority rules first
  - topic `description` and `modelDescription`: explain one job and preferably start with `Use this topic when...`
  - action `modelDescription`: explain the supported task and preferably start with `Use this action to...`
  - knowledge source descriptions and instructions: explicit about scope, intended use, and exclusions
- File groups:
  - treat them as named bundles of knowledge files with their own name, description, and instructions
  - use them when different user groups or workflows need different knowledge boundaries
  - give each file group a title and description that makes the intended routing decision obvious
- Do not use hidden implementation caveats, vague labels, or multi-purpose descriptions where Microsoft Learn expects names, descriptions, and instructions to help orchestration.
- Use [copilot-studio-authoring-text-standards.md](/d:/SNF%20AI%20Dashboard/docs/copilot-studio-authoring-text-standards.md) as the local standard.
- Microsoft Learn grounding for button-first authoring and conditions:
  - https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-ask-a-question
  - https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-using-conditions
  - https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/topics-code-editor

## MCP Setup Process, Boundaries, And Common Challenges

- Setup order:
  - open the workspace in VS Code
  - let the `.vscode/mcp.json` profile load
  - sign into Copilot Studio first
  - authenticate Azure before using `azure-mcp`
  - confirm the Power BI MCP tenant setting is enabled before relying on `powerbi-remote`
  - use Playwright only after the browser side is reachable and you know what surface you are validating
- Boundaries:
  - Copilot Studio extension owns attach, get, preview, and apply
  - Learn MCP owns Microsoft documentation lookup
  - Playwright owns browser and UI validation
  - Power BI MCP owns semantic-model query workflows
  - APIs and workflows own real publish, deployment, refresh, and admin operations
- Common challenges:
  - Copilot Studio cache corruption can look like source-file errors
  - Power BI MCP may be unavailable until tenant admins enable it
  - Azure MCP is not useful until authentication is healthy
- Playwright can validate UI paths but it is not the safe source of truth for deployment state
- Playwright MCP transport can die during long authenticated sessions if VS Code or the MCP child process drops. Prefer persistent profile/output directories and a clean MCP restart over ad hoc retries.
- GitHub MCP is easier if `GITHUB_PERSONAL_ACCESS_TOKEN` is already configured before VS Code starts
- `Apply changes` is still extension-owned and should not be treated as reliably automatable from the terminal
- If extension sync/apply is unavailable, use [Invoke-CopilotStudioSyncWithFallback.ps1](/d:/SNF%20AI%20Dashboard/scripts/Invoke-CopilotStudioSyncWithFallback.ps1) and follow [copilot-studio-fallback-runbook.md](/d:/SNF%20AI%20Dashboard/docs/copilot-studio-fallback-runbook.md)
- Consequences when `Get changes`, `Preview changes`, or `Apply changes` cannot run:
  - extension-managed local-vs-tenant diff confidence is reduced
  - repo/tenant drift risk increases until additional tenant validation is completed
  - publish state can appear healthy while authoring-sync mismatches still exist
  - manual/live verification load increases and must be explicitly documented in run reports
- Preventive actions:
- keep the default MCP stack small and intentional
- do not add generic or unofficial servers by default
- document any project-specific MCP additions in the local repo before using them as a normal path
- prefer official Microsoft servers and APIs whenever the capability exists
- run `scripts/Test-DeveloperToolchain.ps1` before expecting Azure or GitHub CLI-assisted workflows to work
- if Playwright MCP transport closes, run `scripts/Reset-PlaywrightMcp.ps1`, reload VS Code, and restart browser work from the report/home page instead of trying to reuse a dead transport

## Hardening and Security Standards (2026 World-Class)

1. **Layered Defense & Zero Trust**:
   - Treat every tool execution as a boundary. Verify intent before executing high-privileged actions (e.g., Dataverse updates, FHIR deletions).
   - Use Entra ID managed identities or end-user delegation for all connector calls. Never hardcode secrets or master keys in instructions.

2. **Threat Protection (UPIA/XPIA)**:
   - Proactively guard against User-Injected Prompt Attacks. Follow strict input sanitization if passing user text to downstream APIs.
   - Monitor for "jailbreak" or "system-override" patterns in conversational telemetry.

3. **Data Protection & Sensitivity**:
   - Respect Microsoft Purview sensitivity labels. Do not ingest or repeat data labeled `Highly Confidential` unless the recipient has explicit clearance.
   - Enforce PII/PHI masking in logs and automated handoff manifests by default.

4. **Gated Release Lifecycle**:
   - Every change must pass the deterministic QA sweep in the `Development` environment before being promoted to `Production`.
   - Use `pac solution` to bundle and version all agent assets (topics, actions, flows) for traceability.

5. **Monitoring & Drift Detection**:
   - Integrate with Microsoft Defender for Cloud Apps where available to detect data exfiltration or unintended tool executions.
   - Perform weekly Groundedness Evaluation using the Azure AI Evaluation SDK to detect behavioral drift in clinical context.

## Standard Validation Gates

- Produce concise, implementation-ready artifacts.
- Document assumptions and validation gaps explicitly.
- Keep file names, component names, and folder names canonical and descriptive.
- Favor architecture that is automatable, observable, and safe to operate.

## Compliance Rules

- Treat PHI as sensitive by default.
- Use least-privilege access, audit logging, encryption, DLP, and sensitivity labels where supported.
- Prefer de-identified or masked sample data in development.
- Keep a clear boundary between operational insight and clinical decision support.
- When in doubt, escalate to a clinician or compliance owner instead of guessing.

## Quality Bar

- Produce concise, implementation-ready artifacts.
- Document assumptions and validation gaps explicitly.
- Keep file names, component names, and folder names canonical and descriptive.
- Favor architecture that is automatable, observable, and safe to operate.
- For reusable healthcare projects, prefer the `SNF_Command_Center_Starter_Bundle` naming and folder convention unless a deeper local standard overrides it.

## Memory Refresh And Context Compression Loop

Run this loop after every major feature, major bugfix, orchestration change, or release-candidate job.

### Step 1: Instruction Refresh (Required)

- Re-read `AGENT.md` completely, including all rules, requirements, and quality standards.
- Re-check linked local standards referenced by `AGENT.md` that affect the completed work.
- Confirm the completed work still complies with:
  - active-path quality rules
  - automation-first rules
  - validation and QA gate rules
  - guardrail/evidence rules
- If any mismatch is found, treat the job as incomplete and fix it before moving forward.

### Step 2: Project-State Refresh (Required)

- Update project memory artifacts so current truth is explicit:
  - `docs/todo.md`
  - run logs and QA reports under `data/processed`
  - contract/docs files changed by the feature
- Ensure "completed" means implemented + validated, not implemented-only.
- Keep blocker lists concrete and action-oriented.

### Step 3: Context Compression (Required)

- Write a concise state snapshot before starting the next major task.
- Compression snapshot must include:
  - what changed
  - what passed validation
  - what failed or is blocked
  - what is next
  - any required environment/permission prerequisites
- Prefer short structured summaries over long narrative text.
- Remove or avoid stale intermediate notes once durable summaries and logs are updated.

### Step 4: Next-Task Handoff Check (Required)

- Start the next major task only after Steps 1-3 are complete.
- At the start of the next task, use the compressed snapshot as the primary working memory baseline.
- If current files, run logs, or tenant state conflict with the snapshot, resolve the conflict first and refresh the snapshot.

- Never rely on long chat history as the primary memory source for major work.
- Use `AGENT.md` + current repo state + compressed project snapshots as the authoritative memory loop.

## Handoff Contract (Cross-Agent JSON Schema)

SNF Dashboard is a **Worker Agent**. When dispatching work to or receiving from the
SNF-Agent-Command-Center, ONLY the following fields are exchanged. Raw PHI text MUST
NOT appear in any cross-agent payload.

### Inbound (what SNF-Dashboard accepts from the Command Center)

```json
{
  "patient_id":     "{{PATIENT_ID}}",
  "record_id":      "{{RECORD_ID}}",
  "document_type":  "KPIReport | QMSummary | ShiftReport | FacilitySnapshot",
  "current_stage":  "Intake | Analysis | Review | Complete",
  "user_intent":    "ViewQMDashboard | GenerateShiftReport | EscalateClinical | ReviewFacilityKPI"
}
```

### Outbound (what SNF-Dashboard returns to the Command Center)

```json
{
  "patient_id":     "{{PATIENT_ID}}",
  "record_id":      "{{RECORD_ID}}",
  "document_type":  "KPIReport | QMSummary | ShiftReport | FacilitySnapshot",
  "current_stage":  "Analysis | Review | Complete | Error",
  "status":         "success | error",
  "reason":         "Human-readable outcome or error description",
  "next_agent":     "SNF-Agent-Command-Center"
}
```

### Hard Rules

- Topics that make cross-agent calls MUST pass only the fields above.
- Aggregate metric arrays and QM scores MUST be stored in Dataverse and referenced
  via `record_id` before cross-agent handoff — never emitted as raw JSON blobs.
- Every Dataverse write action MUST logCustomTelemetry with:
  `{agent: "SNF-Dashboard", timestamp: utcNow(), record_id, operation_type}`.


## Platinum Orchestration & Security Rules (v2.0)
1. **HIPAA Guardrails (PHI Scrubbing)**: Do not pass raw strings (name, DOB, MRN). Use ecord_id pointers. Ensure cross-agent triggers utilize TheraDoc-PHIScrubAction patterns.
2. **Column-Level Security (CLS)**: The connectionreferences.mcs.yml enforces Dataverse restricted profiles (_phi_restricted).
3. **Context Efficiency**: Bloated prompt windows are avoided by keeping payloads focused on the ecord_id and standardized JSON keys.
4. **Self-Healing Error Topology**: All OnError topics return {"status":"error", "reason":"...", "next_agent":"SNF-Agent-Command-Center"}.
5. **Fleet Fallback Escalation Ticket**: Graceful failures that hit Max-Hop limits (>3) or unrecoverable exceptions escalate to human oversight via Fleet-FallbackEscalationTicket flow.

# AGENT.md

This file defines the working rules for `D:\my agents copilot studio`, including TheraDoc and future feature work unless a deeper `AGENT.md` overrides it.

## Scope

- Applies to the full workspace by default.
- Applies to feature subprojects unless they add a more specific local `AGENT.md`.
- Current primary project: `TheraDoc`.

## Project Intent

TheraDoc is a Microsoft Copilot Studio agent for skilled nursing facility therapy documentation across PT, OT, and ST. The system should reduce therapist typing, prefer structured intake, ask only the minimum clinically meaningful follow-up questions, and produce skilled, concise, defensible documentation.

## Source Of Truth

- The repo is the editable source of truth for prompts, topic drafts, knowledge assets, and design notes.
- The live Copilot Studio tenant is the validation source of truth for what the environment actually supports.
- When repo drafts and live behavior conflict, confirm against the live exported shape before declaring the work finished.

## Copilot Studio Workflow Rules

- Put core behavior in agent instructions first, then use topics, tools, and knowledge to specialize or execute that behavior.
- Automation-first is the default operating principle:
  - design every workflow for automated execution, automated routing, and automated handoff where supported
  - keep manual handling as exception-only fallback when automation is blocked
  - document why any manual fallback is required and what restores automation
- Prefer solution-aware work. Open and edit agents from the intended solution context whenever possible.
- Use the Copilot Studio extension as the first and primary authoring and sync path.
- Before major live changes, confirm the preferred solution and agent-to-solution mapping.
- Treat unmanaged solution export/import as the safe transport path between environments.
- Do not assume topic YAML is valid just because it looks plausible. Round-trip validate against export shape when possible.
- Keep the number of topics as low as practical. Reuse topics, entities, and branching before cloning near-duplicate topics.
- Keep topic scope narrow and reusable.
- Optimize names and descriptions of agents, topics, tools, and knowledge sources for generative orchestration.
- Use canonical, descriptive names that mirror the UI purpose and avoid placeholders like `Untitled`, abbreviations, or file-only labels.
- Keep action display names, topic names, and knowledge source titles aligned so Copilot Studio can infer intent from the name alone.
- Use Microsoft Learn naming and titling patterns as the default:
  - names should reflect one clear purpose
  - topic purpose text should normally start with `Use this topic when...` or `Use this topic to...`
  - action purpose text should normally start with `Use this action to...` or `Use this action when...`
  - knowledge source names should state the domain, audience, or workflow they cover
- Prefer built-in entities first, then closed lists or option sets, then custom or regex-style recognition only when the built-in patterns cannot safely represent the input.
- Make the first turn and every major branch choice-driven with closed lists or buttons whenever possible.
- Defer free-text input until the end of the flow or until a truly unstructured task requires it.
- Prefer progressive disclosure: ask the highest-value button choice first, then only ask for text when the model cannot safely infer the missing detail from a structured option.
- Preserve collected context on failures and offer a concrete recovery choice such as retry, manual continue, or start over instead of forcing the user to re-enter everything.
- Use explicit menu routing for ambiguous requests and avoid leaving the user at an open-ended prompt when a supported workflow exists.
- Prefer canvas-authored conversation objects first and YAML editing second. YAML should refine or inspect the exported shape, not replace supported authoring patterns for core routing, question, and action objects.
- Enforce button-only interaction in active workflows:
  - use closed-list or boolean question entities for user selections
  - do not add open text question nodes in active menu/recovery/operational paths
  - if user sends free text while a supported workflow exists, route back to a button menu

## Microsoft Learn Authoring Standards

- Follow current Microsoft Learn guidance for:
  - instructions
  - topics
  - entities and slot filling
  - knowledge sources
  - file groups
- Agent instructions should stay short, ordered, explicit, and prioritized.
- Topics should stay narrow, single-purpose, and reusable.
- Avoid topic sprawl. If two topics differ only by a minor variant, prefer one reusable topic with structured branching.
- Knowledge sources should be grouped intentionally. Use file groups when different audiences, regions, roles, or workflows need different knowledge scope or instructions.
- File groups are named bundles of knowledge files with their own name, description, and instructions so the agent can choose the right subset of knowledge for a specific scenario.
- Knowledge source and file-group descriptions must be specific enough that generative orchestration can distinguish them reliably.
- Do not hide caveats, draft status, or implementation notes inside user-facing purpose text when those notes belong in docs or operational comments instead.
- Use canvas-first authoring for new question, condition, routing, and tool-call patterns unless a validated exported shape proves a YAML edit is safe and necessary.

## Build And Development Path Rules

- These rules apply during the whole build and development process, not just at release time.
- Start from the automated target end state and keep implementation aligned to that path.
- Use the correct end-to-end method from the start:
  - extension-first attachment and sync
  - locally valid repo
  - resolved references
  - preview
  - apply
  - publish
  - live verification
- Do not build the normal workflow around shortcuts, temporary bypasses, or cache hacks.
- Do not use placeholder names, placeholder bind points, TODO markers, or stub-only artifacts in the active intended path and treat them as acceptable in-progress defaults.
- If something is not ready, keep it out of the active path or keep it clearly isolated as draft-only until it is real.
- Prefer correct omission over fake completion.
- Prefer correct supported workflow over faster ad hoc recovery.
- Recovery paths are allowed only when the primary extension-first path is blocked, and the goal of recovery is to return to the primary path as quickly as possible.
- Recovery is successful only when the automated path is restored; do not normalize long-term manual operation.

## Copilot Studio Sync Recovery Rules

- If `Preview changes`, `Get changes`, or `Apply changes` fails, validate the repo locally before touching the extension workflow again.
- Confirm the workspace is still attached to the intended environment and bot through `.mcs/conn.json`.
- If `Apply changes` is blocked, run `Preview changes` first, then `Get changes`, resolve remote drift, preview again, and only then retry `Apply changes`.
- If the extension reports that `.mcs/botdefinition.json` is missing or the workspace must be resynced, prefer letting the Copilot Studio extension rebuild the `.mcs` snapshot through `Open agent` and `Get changes` instead of manually editing cache files.
- Treat `.mcs` files as extension-managed cache and connection state, not as long-term authoring assets.
- Do not paste tokens, PATs, client secrets, or access keys into chat, source files, docs, or manifests. Use environment variables, secure prompts, or platform credential stores.
- If format or parsing errors appear during preview/get/apply, first check for malformed YAML, missing workflow folders, invalid dialog references, and action `flowId` values with no matching local workflow.
- Also check for invalid `DynamicClosedListEntity` condition expressions. The safe pattern is `Text(Topic.ChoiceVariable) = "OptionValue"`.
- After a successful apply, publish explicitly and then verify live status.
- If recovery is needed, use the minimum intervention that restores the extension-first workflow.
- Do not turn a rescue workaround into the new default method.
- For repeated `Apply changes` failures that loop with HTTP/service-request errors, use a resilient cleanup-and-apply loop:
  1. restore missing workflow folders so every action `flowId` resolves locally
  2. run local validation
  3. reset `.mcs` cache while preserving `conn.json`
  4. run extension commands in order: `Get changes` -> `Preview changes` -> `Apply changes`
  5. re-run validation and restore missing workflow folders again if they were removed during sync
- Standardize this as a project script (for example `Invoke-CopilotApplyResilient.ps1`) and use it instead of ad hoc retries.

## Extension Failure FAQ And Auto-Recovery

Use this section for any workspace project when the Copilot Studio extension fails on `Get changes`, `Preview changes`, or `Apply changes`.

### Standard Recovery Sequence

1. Validate local repo integrity first:
   - merge marker scan
   - YAML parse
   - dialog/action/workflow reference checks
2. Validate binding and auth:
   - `pac auth list`
   - confirm active profile is correct
   - verify `.mcs/conn.json` points to intended environment and bot
3. Reset extension sync state only if needed:
   - clear/backup `.mcs/filechangetrack.json`
   - remove/backup `.mcs/changetoken.txt`
4. Re-run extension flow in order:
   - `Get changes` -> `Preview changes` -> `Apply changes`
5. Publish and verify live:
   - `pac copilot publish --environment <dataverse-url> --bot <agent-id>`
   - `pac copilot list --environment <dataverse-url>`
6. If available, run project sync checker script after publish.

### FAQ

- Q: Why is `Apply changes` grayed out?
  - A: Usually stale sync state or unresolved drift from preview/get. Run the full recovery sequence.

- Q: Why do I suddenly see many pending changes?
  - A: After sync-state reset, extension recomputes baseline and may show many changes until `Get/Preview/Apply` completes.

- Q: Why do `404 Not Found` or flow-missing errors appear?
  - A: Environment mismatch, wrong profile, missing remote flow ID, or local/runtime contract drift.

- Q: Why does extension server crash (`Server was requested to shut down`)?
  - A: Commonly malformed YAML or unresolved merge markers. Fix repo integrity first.

- Q: `pac copilot status` fails but publish/list succeed. What should be trusted?
  - A: Trust `publish + list + direct runtime checks` when `status` has tenant/CLI metadata issues.

### Required Preconditions Before Retrying Apply

- No unresolved merge markers.
- No YAML parse failures.
- All `flowId` references resolve locally and remotely.
- No placeholder endpoint/secret patterns in active workflow payloads.
- Correct active tenant/environment profile.

### Do Not Normalize

- Manual cache hacks as a default workflow.
- Placeholder artifacts (`Untitled`, stub-only, TODO path) in active runtime path.
- Skipping publish/list verification after apply.

## Copilot Studio Bootstrap Rules

- For every new Copilot Studio project, install and sign into the Copilot Studio VS Code extension before attempting any sync workflow.
- Use the best-practice path first time and every time. Do not normalize shortcuts as part of the standard workflow.
- Extension-first is mandatory unless it is actually blocked.
- Keep the workspace `.mcs` directory minimal before the first successful `Open agent` or `Get changes`.
- Safe initial `.mcs` contents are:
  - `.gitkeep`
  - `README.md`
  - `conn.json` after attachment
- Do not pre-seed or copy extension cache files like:
  - `botdefinition.json`
  - `botdefinition.tmp.json`
  - `changetoken.txt`
  - `filechangetrack.json`
- Let the extension generate those files from the live agent.
- Treat copied or synthetic `.mcs` cache snapshots as high-risk. They may unblock one symptom and create harder parser or component errors later.
- Make validator, preflight, and status scripts part of the default project scaffold so repo integrity is checked before every preview/apply cycle.
- Keep `actions`, `topics`, and `workflows` internally consistent from day one:
  - every action `flowId` must have a matching workflow folder
  - every topic dialog reference must resolve locally
  - manifests must match actual files
- Prefer quoted closed-list `Value` strings in topic menus to reduce parser ambiguity in Copilot Studio YAML.
- When a topic question uses `DynamicClosedListEntity`, compare the selected option with `Text(Topic.ChoiceVariable)` in conditions. Do not use `Topic.ChoiceVariable.Value` and do not compare `Topic.ChoiceVariable` directly to a string.
- If the PAC CLI `publish` command throws a response-format or parser error, verify the live state with `pac copilot status` and `pac copilot list` before assuming the publish failed.
- No shortcuts:
  - do not copy `.mcs` cache files between projects
  - do not accept placeholder workflow bindings as part of the normal active build path
  - do not leave `TODO`, `TBD`, `Untitled`, or stub-only artifacts in the intended active path
  - do not use a manual cache hack as the default solution when the extension-supported path exists
- Always take the correct end state:
  - extension-managed cache
  - clean local validation
  - resolved topic/action/workflow references
  - preview
  - apply
  - publish
  - live verification
- Future project templates must include:
  - Copilot Studio setup steps
  - MCP setup steps
  - `.mcs` cache hygiene rules
  - preview/apply/publish workflow
  - recovery workflow for extension sync failures

## Preventive Checks From Lessons Learned

- Do not rely on validator success alone. A repo can validate and still contain line-level logic defects.
- During every substantial topic pass, scan for mismatches between declared topic variables and the `Topic.*` variables referenced later in the file.
- During every substantial topic pass, scan for stale descriptions, summaries, and next-step text that still describe an older action path after the topic behavior changes.
- Keep the active runtime path and the template path separate in reviews:
  - the active project path must be free of unfinished bind points
  - starter bundles and generators must use explicit starter-state labels instead of raw `TBD`, `Draft`, or placeholder language in reusable artifacts
- If a backend action or workflow is not live-validated, do not leave it on the active user path. Route the live topic to structured intake and manual review instead.
- When changing backend status language in bulk, spot-check human-facing prose, YAML descriptions, CSV manifests, and workflow response bodies afterward. Bulk replacement can leave mechanically correct but poor or misleading text.
- Treat manifest files as part of runtime integrity, not optional documentation. After topic, action, or workflow changes, update manifests in the same pass.
- Scan for unresolved dialog targets, missing workflow folders, and orphaned `flowId` references before every preview/apply cycle.
- Exclude vendored directories such as `node_modules` from defect scans so real project defects are not buried in noise.
- If a defect is found in both the live project and the reusable scaffold, fix the live path first, then update the scaffold so the same defect is not copied forward.

## Preventive Build Actions

- Before preview/apply:
  - run repo validation
  - run preflight
  - run button-only routing validation
  - scan for unresolved `Topic.*` references
  - scan for unresolved dialog and `flowId` targets
  - scan the active path for placeholder, stub-only, or unfinished-state markers
  - if apply recently failed with HTTP/service-request errors, run the resilient cleanup-and-apply loop script before manual retries
- After any bulk rename or wording change:
  - spot-check at least one topic, one action, one workflow, one manifest, and one doc affected by the change
- After moving a topic off an action backend:
  - remove the active binding
  - update the topic summary text
  - update manifests and docs so the repo describes the runtime path honestly

## Hardening And Resilience Lessons

- Treat orchestration code as product code. Do not leave top-level workflow behavior implicit.
- Use shared helpers for generalized orchestration concerns whenever a project has more than one multi-step automation path.
- Standard helper responsibilities should include:
  - step boundaries
  - pass/warn/fail status capture
  - optional-step handling
  - stale-artifact cleanup
  - run-log persistence
- Separate required steps from optional steps explicitly.
  - required steps fail fast
  - optional steps warn, clean up stale outputs, and degrade gracefully where safe
- Top-level workflows should always leave a machine-readable run log, even on failure.
- Use `try`/`finally` around run-log persistence for long orchestration flows.
- When a workflow emits current-state reports or packages, also define how durable history and timestamped snapshots are persisted so reruns do not erase the only operational record.
- Prefer idempotent orchestration:
  - reruns should converge on the current state
  - reruns should not preserve obsolete generated artifacts by accident
- Generated packages and bundles should remove old generated files before writing new ones, while preserving intentional static files.
- If an optional source is missing, downstream outputs should explicitly represent degraded state rather than pretending the domain is complete.
- Pair human-readable summary outputs with JSON outputs when the workflow may later feed tools, dashboards, or agents.
- Add QA at multiple layers:
  - parse/shape validation
  - package/bundle validation
  - top-level sweep validation
- QA should not require unrelated orchestration artifacts when validating a narrower path. Keep assertions matched to the scope being tested.
- After hardening orchestration behavior, re-run the full normal path instead of stopping at unit or parse-level success.

## Generalized Orchestration Expectations

- For new multi-step automations, define:
  - required inputs
  - optional inputs
  - expected generated artifacts
  - cleanup rules for stale outputs
  - run-log location
  - degrade-vs-fail behavior for each major step
- Include automation ownership in each new workflow:
  - who receives automated handoffs
  - what SLA applies
  - what machine-readable status closes the loop
- Prefer one top-level entrypoint for each repeated operational workflow, backed by smaller composable scripts underneath.
- If an optional step fails, remove any outputs that would otherwise misrepresent stale success.
- If a workflow supports partial operation, make the degraded state explicit in both logs and summaries.
- For reporting/export workflows, treat current-state output, longitudinal history, and archived snapshots as separate artifacts with separate validation expectations.

## Autonomous Microsoft Build Patterns

- Prefer platform-native automation in this order unless a project-specific constraint is documented:
  - source-controlled artifacts
  - CI validation gates
  - staged deployment pipeline
  - post-deploy smoke tests
  - telemetry-based promotion or rollback
- Require non-interactive preflight checks in CI before any apply/publish step:
  - schema and manifest integrity
  - unresolved references
  - environment variable presence and format
  - connection reference resolution
  - policy/compliance rule checks where available
- Use deployment rings for all production-impacting components:
  - dev ring
  - test/uat ring
  - production ring
- Promotion across rings must require:
  - successful validation in the prior ring
  - explicit artifact/version identity
  - recorded operator and timestamp
- Prefer environment variables and connection references over hard-coded IDs and URLs.
- Externalized settings should be documented in a per-project configuration contract (`required`, `optional`, `owner`, `rotation policy`).
- Any automation step that can mutate tenant state must support:
  - idempotent reruns
  - dry-run mode where feasible
  - explicit failure signaling
  - machine-readable run logs
- Add post-deploy health checks for each platform surface in use:
  - Copilot Studio topic/action invocation
  - Power Automate flow trigger and response shape
  - Dataverse table/column availability
  - Power BI dataset/report refresh or query health
  - Fabric item and pipeline status where applicable
- Use feature flags or guarded routing when introducing new topic/action paths so rollback is a configuration change, not an emergency code edit.
- Keep explicit rollback assets for every release unit:
  - previous known-good package pointer
  - previous known-good configuration pointer
  - restore script or runbook step
- Prefer API- or CLI-based automation for control-plane operations; use browser automation for validation and guided fallback, not as the primary production deployment path.
- Define autonomous failure handling for every top-level workflow:
  - retry policy
  - terminal failure condition
  - escalation target
  - human action queue format
- Establish queue-based handoff defaults for blocked steps:
  - create actionable queue item
  - include artifact paths and exact unblock action
  - include severity and SLA

## Safe Cleanup Rules

- Cleanup is allowed only for generated artifacts in script-declared output paths.
- Never clean source-authoring assets by automation:
  - `topics`
  - `actions`
  - `workflows`
  - knowledge files
  - manifests
  - docs
- Never delete landing/raw input files by default (for example `data/incoming`) unless a task explicitly asks for it.
- Never delete credentials/config/cache control files during cleanup (`.env`, `.env.example`, `.vscode`, `.mcs`, connection refs).
- Before any recursive cleanup, validate that the resolved target path:
  - is not empty
  - is not a drive root
  - is inside the intended project root
  - matches an approved generated-output directory
- Prefer retention-based cleanup for history/checkpoints/archives (keep recent by count and age) over full purge.
- If ownership of a file is ambiguous (generated vs source-of-truth), do not delete it automatically.
- Every deletion must be logged with timestamp, path, and reason in a machine-readable run log.

## MCP Defaults

- All agent projects in this workspace should assume this default MCP stack unless a deeper local `AGENT.md` explicitly overrides it:
  - Copilot Studio MCP
  - Power Platform MCP
  - Microsoft Learn MCP
  - Azure MCP
  - Power BI MCP where semantic-model querying is part of the workflow
  - Playwright MCP
- TheraDoc follows this standard immediately.
- Future agent projects and feature projects in this workspace inherit the same MCP requirement by default.
- Do not introduce a different default MCP stack for an agent project by convention alone. Any exception must be written in that project's local `AGENT.md`.
- Use Copilot Studio MCP for agent authoring, topic/tool/knowledge validation, and live Copilot Studio checks.
- Use Power Platform MCP for environment, solution, Dataverse, and broader platform-connected work where applicable.
- Use Microsoft Learn MCP for current Microsoft documentation, release notes, and official setup guidance.
- Use Azure MCP for Azure-side resource and service context.
- Use Power BI MCP for semantic-model queries and model-aware agent interactions.
- Use Playwright MCP for live browser automation, UI verification, and Copilot Studio web workflows.
- Do not use Learn MCP, Power BI MCP, or Playwright as substitutes for the Copilot Studio extension sync path.
- Do not use Playwright as the primary deployment or administration path for Fabric or Power BI when official APIs exist.
- Do not keep generic MCP servers like `fetch` or `memory` in the default global setup unless there is a repeated project need that justifies them.
- When creating a new agent project, also create or copy a reusable project checklist that includes these MCP defaults, sign-in/setup checks, apply/publish steps, and live validation steps.

## Global MCP Setup, Boundaries, And Challenges

- Global setup should live in the workspace `.vscode/mcp.json` so future projects inherit one intentional default profile.
- Default global profile should stay small:
  - Copilot Studio / PAC
  - filesystem
  - git
  - github
  - Learn MCP
  - Azure MCP
  - Power BI MCP where applicable
  - Playwright
- Boundaries:
  - Copilot Studio extension is still the first path for workspace sync
  - Learn MCP is for Microsoft docs and guidance
  - Azure MCP is for Azure resource context
  - Power BI MCP is for semantic-model query workflows
  - Playwright is for browser/UI validation
  - official APIs and workflows are for real service operations
- Common challenges to watch for:
  - tenant features not enabled yet
  - MCP server auth not completed before use
  - using browser automation where a supported API should be used instead
  - overloading the default stack with generic servers that are not part of the normal build path
- missing local CLIs such as `az` or `gh` can make a documented MCP path look broken when the real problem is local machine setup
- Copilot Studio `Apply changes` remains a UI-owned step and should not be treated as reliably headless
- Playwright MCP transport can close during long sessions or after VS Code-side MCP churn. Prefer a persistent profile/output directory and a clean MCP restart over repeated blind retries.
- Preventive actions:
- keep the global stack Microsoft-first
- document any non-default MCP addition in the local project `AGENT.md`
- remove low-value defaults instead of letting the global stack grow by inertia
- verify local toolchain prerequisites before assuming an MCP or extension workflow is broken
- if Playwright MCP transport closes, kill the stale Playwright MCP process, keep the persisted profile directory, reload VS Code, and restart from a fresh browser session

## Agent Behavior Rules

- Goal-first routing: identify whether the user wants note generation, revision, audit, parsing, handoff, or guidance.
- Prefer button-first or closed-list intake for repeatable fields.
- Use short text only where structured choices are unsafe or too lossy, especially for:
  - patient identifiers
  - dates or reporting periods
  - measurable metrics
  - unusual findings
  - custom clinical details
- Ask one focused follow-up question at a time for the highest-value missing item.
- Stop asking follow-up questions once the output can be generated safely and compliantly.
- Reuse already provided context and do not ask redundant questions.
- Do not fabricate measurements, diagnoses, precautions, responses, frequencies, durations, or unsupported clinical claims.

## Documentation Quality Rules

- Output should be SNF-appropriate, skilled, concise, and EHR-ready.
- Notes should emphasize measurable function, therapist skill, cueing, progression, patient response, barriers, safety, and medical necessity.
- Default style is concise narrative compatible with Net Health / Rehab Optima-style workflows unless the user requests another format.
- Plans of care generated from evaluations or recertifications must stay tied to documented deficits, goals, safety risks, and provided frequency or duration details.

## Knowledge And Research Rules

- Use configured knowledge for documentation guidance, compliance explanation, formatting guidance, and approved examples.
- Use tools or actions for note generation, audit, parsing, and nursing handoff.
- For current platform behavior or implementation guidance, prefer Microsoft Learn and official Microsoft Copilot Studio documentation.
- Microsoft Learn grounding for button-first and condition-safe topic authoring:
  - https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-ask-a-question
  - https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-using-conditions
  - https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/topics-code-editor
- Align agent instructions, topic descriptions, action descriptions, and knowledge-source descriptions to Microsoft Learn authoring guidance.
- Default authoring pattern:
  - agent instructions: short ordered directives with the highest-priority rules first
  - topic descriptions: one job, explicit purpose, preferably `Use this topic when...`
  - action descriptions: supported task and return shape, preferably `Use this action to...`
  - knowledge source descriptions and instructions: explicit scope, intended use, and exclusions
- Do not use vague labels, multi-purpose descriptions, hidden implementation caveats, or long mixed-priority prose where names, descriptions, and instructions are meant to support orchestration.
- For therapy/compliance guidance, prefer authoritative sources such as CMS, APTA, AOTA, and ASHA.
- If a source is uncertain, stale, or not directly authoritative, label it as supplemental rather than primary.

## Repo Maintenance Rules

- Keep design docs aligned with actual repo artifacts.
- When adding a new note type or workflow, update the related:
  - topic draft
  - orchestration logic
  - action prompt guidance
  - knowledge assets if needed
- Avoid overlapping topics unless the overlap is deliberate and documented.
- Favor modular files over large monolithic specs.

## Validation And Done Criteria

Work is not considered complete until these are true where feasible:

- Repo artifacts are internally consistent.
- Live Copilot Studio behavior has been checked for the affected area, or the exact validation gap is called out explicitly.
- Solution-context risks are called out if import/export has not been validated.
- Any assumptions about unsupported schema or controls are documented clearly.

## Communication Rules

- Be direct, concise, and implementation-focused.
- State validation limits clearly.
- Do not imply live support for a feature that was only drafted locally.
- When a risky assumption is required, say so explicitly.

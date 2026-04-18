# AGENT.md

This file overrides the parent workspace instructions for:
- `D:\my agents copilot studio\QM Agent and Coach\SimpleLTC QM Coach V2`

## Purpose

This project is currently in browser-first recovery mode for Microsoft Copilot Studio authoring.

The default execution path is:
1. Read local source files in this folder as the editable source of truth.
2. Use Microsoft Learn as the documentation source of truth for current platform behavior.
3. Use Playwright and other browser MCP tools as the primary way to inspect, create, repair, and verify agent assets in Copilot Studio.
4. Use PAC CLI, local manifests, and runtime metadata to verify environment bindings, publish state, and flow references.

## Microsoft Learn Rule

For this project, Microsoft Learn is the authoritative documentation source for:
- Copilot Studio platform behavior
- PAC CLI behavior and command usage
- Power Platform environment and publish guidance
- flow, connector, and contract troubleshooting patterns

If local assumptions, prior habits, or generated suggestions conflict with Microsoft Learn guidance, follow Microsoft Learn.

## Browser-First Override

For this project, treat manual browser execution as the primary path, not the exception path.

This overrides any broader instruction that says:
- extension-first is the default authoring workflow
- automation-first means local scripts should be preferred for active authoring work

For this project instead:
- browser-first authoring is the default
- Playwright is the primary execution tool for agent changes
- local scripts and PAC are support tools for validation, metadata inspection, and publish verification
- tenant/runtime state seen in Copilot Studio remains the live validation source of truth

## Required Authoring Order

Before rebuilding or repairing assets:
1. Confirm the target environment and agent context from local bindings and browser state.
2. Inventory the local source assets that must exist in the agent:
   - instructions
   - knowledge sources
   - topics
   - actions
   - entities
   - variables
3. Rebuild in the browser using the real target agent, not a temporary or test agent, unless explicitly directed otherwise.

## Topic Rebuild Rules

When rebuilding topics from local files:
- use local `.mcs.yml` topic files as the source of truth
- preserve topic names, trigger intent behavior, routing structure, and tool/action references
- prefer supported Copilot Studio canvas patterns and current UI flows
- do not simplify topic logic just to make browser entry easier
- if browser authoring cannot faithfully preserve a topic, record the exact gap and stop on that topic before drifting the design

## Knowledge Rules

When rebuilding knowledge:
- recreate public website knowledge sources directly in Copilot Studio using the configured URLs
- recreate uploaded file knowledge only from the original source documents, not from metadata stubs alone
- treat missing underlying files as a real blocker, not acceptable completed work

## Validation Rules

After each major browser rebuild job:
1. Refresh this file and the parent `AGENT.md`.
2. Recheck local source state.
3. Compare browser-visible assets against local manifests.
4. Record what is complete, what is blocked, and what still needs tenant verification.
5. Run `.\scripts\copilot-preflight.ps1` before any apply or publish attempt.

## Lessons Learned (Browser Rebuild)

1. Do not trust the first matching tool name in the picker; verify required inputs/outputs immediately after insert.
2. If a flow action shows a mismatched required contract (example: `ManualUploadFile` for a non-upload topic), remove it and reinsert the correct action.
3. Map all required flow inputs explicitly to topic variables before leaving the topic.
4. Prefer deterministic topic-management redirects for orchestration handoff when flow contracts are not required for that step.
5. Save after each topic-level change to avoid losing work during navigation prompts.
6. Use Topic Checker before moving to the next topic whenever structure changes.
7. Treat Copilot in-canvas bulk edits as non-authoritative; if it introduces malformed nodes/expressions, undo immediately and continue with manual canvas edits.
8. In browser recovery mode, use local YAML as design source and browser canvas as runtime truth; do not let either drift silently.

## PAC And Publish Role

PAC CLI is still required for:
- auth verification
- tenant/profile verification
- publish verification
- status and list checks

PAC CLI is not the primary editing path for this recovery unless the browser path is blocked or the user explicitly requests PAC-driven changes.

## Preventive Reminder

- Keep the repo-local preflight authoritative for this project.
- After the checks prove stable here, promote the reusable subset into the global MCP workflow.
- Do not promote project-specific IDs or one-off repairs into the global layer.

## Completion Standard For This Folder

Work is complete only when:
1. browser-visible assets match the local source files for the active scope
2. required knowledge sources are recreated or explicitly marked blocked by missing source inputs
3. action and flow bindings still match the target environment
4. publish and runtime checks are completed for changed assets when applicable

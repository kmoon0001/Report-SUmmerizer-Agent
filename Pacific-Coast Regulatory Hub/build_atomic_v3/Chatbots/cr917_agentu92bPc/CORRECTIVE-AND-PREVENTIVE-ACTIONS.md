# Corrective And Preventive Actions

Last updated: 2026-04-10

## Purpose

This runbook exists to prevent the recurring failure pattern where Copilot Studio or PAC returns vague errors such as:
- `Failed to execute Get operation: Exception during deserialization`
- `Workflow ... Does Not Exist`
- HTTP 400 or 500 during apply, get, or publish

The actual failure class is usually structural drift:
- PAC profile pointed at the wrong environment
- `.mcs/conn.json` not matching the active tenant/runtime
- actions or topics referencing stale `flowId` values
- malformed local `.mcs.yml` source
- expression-shaped output names leaking into topic bindings or flow response schemas
- topic conditions referencing deleted question nodes
- output contracts drifting from the live flow response shape

## Corrective Actions

Run these in order. Do not skip steps.

1. Confirm the local binding in [.mcs/conn.json](</d:/my agents copilot studio/QM Agent and Coach/SimpleLTC QM Coach V2/.mcs/conn.json>).
2. Verify PAC is targeting the same environment.
3. Run the repo preflight:

```powershell
.\scripts\copilot-preflight.ps1
```

4. Repair every reported issue before `apply` or `publish`.
   If the bot is already corrupted in the tenant, extract a live template backup first:

```powershell
pac copilot extract-template --environment a944fdf0-0d2e-e14d-8a73-0f5ffae23315 --bot ea52ad9c-8233-f111-88b3-6045bd09a824 --templateFileName output\copilot\SimpleLTC-QM-Coach-V2-live-template.yml --overwrite
```

5. Open the real agent in the real environment in Copilot Studio and confirm the same asset opens cleanly in the browser.
6. Publish only after local source, PAC context, and browser runtime all agree.

## Preventive Gates

Use these gates before every major apply/publish attempt.

1. Environment gate
   The active PAC environment must match `.mcs/conn.json`.
2. Bot visibility gate
   The target bot ID from `.mcs/conn.json` must be visible through `pac copilot list --environment <EnvironmentId>`.
3. Flow binding gate
   Every `flowId` referenced in `actions/` and `topics/` must exist in `workflows/*/metadata.yml`.
4. Source-shape gate
   No malformed top-level topic actions and no partial `InvokeFlowAction` blocks.
5. Schema hygiene gate
   No expression-shaped output keys such as `outputs('...')...` in topic bindings or flow response properties.
6. Topic reference gate
   No topic condition can reference a deleted question node.
7. Contract gate
   Action outputs must still match the live VirtualAgent response shape.
8. Publish verification gate
   After publish, run `pac copilot list` and the applicable verification path in the browser.

## Current Reminder

After this local preflight is stable and repeatedly catches real repo failures, promote the reusable checks into the global MCP workflow.

Promote only the reusable logic:
- PAC environment verification
- bot visibility checks
- flow reference validation
- malformed `.mcs.yml` detection
- publish gate ordering

Keep project-specific values local:
- this environment ID
- this bot ID
- any known disabled or placeholder flows

## Current Command Set

```powershell
pac auth list
pac copilot list --environment a944fdf0-0d2e-e14d-8a73-0f5ffae23315
.\scripts\copilot-preflight.ps1
```

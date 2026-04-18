# Live Drift Report

Date: 2026-04-11

## Current state

- Local repo repair is intact and passes `scripts/copilot-preflight.ps1`.
- Workspace binding in `.mcs/conn.json` points to the expected environment and bot.
- Copilot Studio language server can fetch remote changes and reattach resolves immediately.
- VS Code local sync tracking remains empty in `.mcs/filechangetrack.json`, which aligns with `Preview changes` showing only `Remote Changes`.

## Confirmed live drift

PAC template export from the live agent still shows the old broken runtime shape:

- `FacilityQMAnalysis` still invokes flow `868e2c74-ed27-f111-8341-000d3a3363af`.
- `QMDriverAnalysis` still invokes flow `868e2c74-ed27-f111-8341-000d3a3363af`.
- Both topics still bind legacy Power BI-style outputs such as `adl_score`, `falls_risk`, and the malformed expression-shaped key:
  - `outputs('run_a_query_against_a_dataset_1')['body']['firsttablerows'][0]['outlier_score']`
- `QMDataUploadDeclineDetection` is already aligned to the repaired facility lookup flow `0b930a15-2516-f111-8341-0022480b6bd9` and the simplified output contract.

## What this means

- The repo is not the current blocker.
- The live agent still contains stale topic/action state.
- Because the extension is not surfacing repo deltas as `Local Changes`, the repaired local files are not being offered as an `Apply` candidate.
- A blind `Get` remains unsafe because live state for the repaired topics is still behind the repo repair.

## Safe next repair target

Safe to remove or replace after backup:

- Broken topic-level invoke action nodes in live `FacilityQMAnalysis`
- Broken topic-level invoke action nodes in live `QMDriverAnalysis`
- Broken live wrapper that still points to flow `868e2c74-ed27-f111-8341-000d3a3363af`

Not safe to remove blindly:

- entire bot
- system topics
- unrelated knowledge assets without confirming they are the remote-only adds you intend to keep or discard

## Deterministic checks

- Local contract and flow reference check:
  - `powershell -ExecutionPolicy Bypass -File .\scripts\copilot-preflight.ps1`
- Live drift signature check:
  - `powershell -ExecutionPolicy Bypass -File .\scripts\copilot-live-drift-check.ps1`

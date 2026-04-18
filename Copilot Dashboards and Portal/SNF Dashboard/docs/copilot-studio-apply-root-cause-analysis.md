# Copilot Studio Apply Changes Root Cause Analysis

This document records the root causes, corrective actions, and preventive actions from the `SNF AI Dashboard` Copilot Studio extension troubleshooting work.

## Problem Statement

`Copilot Studio: Apply changes` was not reliably completing from the automation path, and the workspace previously showed cache-related extension failures.

## Observed Symptoms

- missing `.mcs/botdefinition.json`
- `The input string '1033>>>>>>> ' was not in a correct format`
- `Unknown bot component`
- large transient error counts in the editor Problems panel
- `Get changes` and `Preview changes` eventually worked again, but `Apply changes` did not leave a reliable push/apply signature in the language-server log

## Root Causes

### Root Cause 1: Corrupted Copilot Studio Cache State

The extension cache under `.mcs` became invalid and at one stage also coexisted with backup cache content inside the workspace. This created parser failures and bad component state.

Evidence:

- missing `botdefinition.json`
- `1033>>>>>>>` parse failure signature
- `Unknown bot component`
- backup cache folders inside the workspace polluted the extension's watched-file set

### Root Cause 2: Workspace Snapshot Ownership Was Violated

The `.mcs` snapshot is extension-owned cache, not authored source. Synthetic or copied snapshots can temporarily bypass one error and then create harder failures later.

### Root Cause 3: Real Repo Integrity Defects Did Exist At Times

At different points, the active repo also had genuine local integrity problems:

- missing workflow folders
- `flowId` references with no matching workflow folder
- stale manifest references
- stale or misleading topic/action descriptions

Those issues were fixable locally and had to be cleared before the extension path could be trusted again.

### Root Cause 4: `Apply changes` Is Still A UI-Owned Operation

`Get changes` and `Preview changes` were observable through the language-server log. `Apply changes` did not produce a trustworthy push/apply signature when invoked through command URI or focus-sensitive automation.

Practical conclusion:

- the Copilot Studio extension is the supported owner of `Apply changes`
- terminal-side automation can help reach the state where apply is possible
- terminal-side automation is not a trustworthy proof that apply actually completed

## Corrective Actions Implemented

- reset corrupted `.mcs` cache while preserving `conn.json`
- removed backup cache folders from inside the workspace
- restored a valid `.mcs` snapshot and then reattached/rebuilt through the extension path
- restored missing workflow stub folders and aligned workflow/action contracts
- revalidated the project until repo integrity returned to zero validation errors
- documented recovery rules in repo docs and both `AGENT.md` files
- standardized extension-first workflow as the only normal path

## Preventive Actions Implemented

- `.mcs` is now explicitly treated as extension-owned cache
- future projects are instructed not to copy `.mcs` cache snapshots between workspaces
- preflight and validation scripts are part of the normal workflow
- global and project MCP defaults are now documented and reduced to the Microsoft-first stack
- project rules now require:
  - validate
  - preflight
  - get
  - preview
  - apply
  - publish
  - verify

## Remaining Constraint

There is still no trustworthy headless substitute for `Copilot Studio: Apply changes` in this workflow. That final step must still be treated as a manual extension-owned action unless Microsoft exposes a supported non-UI path.

## Operational Rule

Treat `Apply changes` as:

- extension-owned
- human-verified
- not complete until the extension itself indicates success

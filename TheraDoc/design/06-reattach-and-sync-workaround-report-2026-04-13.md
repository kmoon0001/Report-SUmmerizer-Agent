# TheraDoc Reattach + Sync Workaround Report

Date: 2026-04-13
Project: `D:\my agents copilot studio\TheraDoc`

## Final Outcome

- Target environment solution is present:
  - `TheraDocTransport` version `1.0.0.1` (managed) in `Therapy AI Agents Dev` (`orgbd048f00`).
- Target environment agent is present and published:
  - `TheraDoc` bot id `855c7dda-ad19-4734-a8cd-df366c48f3d2` shown as `Published`.
- Last import cycle is closed:
  - Final import command with `--skip-lower-version` returned a clean skip (same version already installed).

## What Worked

1. Creating and using a dedicated transport solution (`TheraDocTransport`) instead of applying from a drifting VS Code sync state.
2. Importing through Power Platform solution pipeline (UI + PAC fallback).
3. Waiting for the server-side import lock to clear instead of retry-spamming.
4. Running a safe idempotent closeout command:
   - `pac solution import --skip-lower-version ...`

## What Did Not Work

1. Starting another import while one was already running:
   - Error code `80071151` (`Cannot start another [Import] because there is a previous [Import] running`).
2. Assuming a second import attempt would fix a first in-progress import.
3. Treating VS Code `Preview/Get/Apply` as a substitute for solution transport during active environment drift.

## Why Apply Kept Graying Out

- VS Code extension detected remote changes and blocked `Apply` until `Get`.
- `Get` intermittently failed while workspace/metadata was inconsistent.
- Concurrent remote operations (imports/sync) caused lock/ordering conflicts.

## Reattach Procedure (Do This Exactly)

This is the clean way to reattach VS Code to the target imported agent.

1. In VS Code, open Command Palette.
2. Run `Copilot Studio: Clone Agent` (or `Open Agent` if your extension shows that label).
3. Select environment: `Therapy AI Agents Dev` (`a944fdf0-0d2e-e14d-8a73-0f5ffae23315`).
4. Select agent: `TheraDoc` (bot id `855c7dda-ad19-4734-a8cd-df366c48f3d2`).
5. Clone into a clean folder (recommended), not over a drifted workspace.
6. Verify local `.mcs/conn.json` contains:
   - `DataverseEndpoint`: `https://orgbd048f00.crm.dynamics.com/`
   - `EnvironmentId`: `a944fdf0-0d2e-e14d-8a73-0f5ffae23315`
   - `AgentId`: `855c7dda-ad19-4734-a8cd-df366c48f3d2`
7. Use sync in this strict order:
   - `Preview changes`
   - `Get changes` only if Preview reports remote changes
   - `Apply changes`
8. Publish after apply (Copilot Studio publish flow or PAC publish command).

## Current Local Workspace State (Important)

- Current workspace `.mcs/conn.json` is still attached to source:
  - Environment: `Default-03cc92c3-986c-4cf4-ae27-1478cf99d17f`
  - Endpoint: `https://org3353a370.crm.dynamics.com/`
  - Agent: `f0a91e13-4b2f-f111-88b4-000d3a37eba2`

This means you are not yet reattached to the target imported agent in this folder.

## Recommended Next-Time Guardrails

1. Never run parallel imports for the same solution.
2. If import is active, monitor Solution History first; do not start a second import.
3. Use solution transport when VS Code sync has repeated lock/drift failures.
4. Keep source and target in separate local folders to prevent accidental cross-environment sync confusion.
5. Treat severity-8 authoring errors as blockers; severity-2 knowledge compile warnings are non-blocking unless promoted.

## Reference Commands Used

```powershell
pac solution list --environment https://orgbd048f00.crm.dynamics.com/ | findstr /I "TheraDocTransport"
pac solution import --environment https://orgbd048f00.crm.dynamics.com/ --path .\artifacts\TheraDocTransport_managed.zip --publish-changes --skip-lower-version --max-async-wait-time 60
pac copilot list --environment https://orgbd048f00.crm.dynamics.com/ | findstr /I "TheraDoc"
```

## Microsoft Learn References

- Copilot Studio VS Code synchronization (`Preview`/`Get`/`Apply`):  
  https://learn.microsoft.com/en-us/microsoft-copilot-studio/visual-studio-code-extension-synchronization
- Copilot Studio extension workflow and cloning/opening agents:  
  https://learn.microsoft.com/en-us/microsoft-copilot-studio/visual-studio-code-extension-overview
- Power Platform solution import/export guidance:  
  https://learn.microsoft.com/en-us/power-apps/maker/data-platform/import-update-export-solutions
- Solution history and troubleshooting context:  
  https://learn.microsoft.com/en-us/power-apps/maker/data-platform/solution-history

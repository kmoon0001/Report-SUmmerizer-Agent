# Copilot Studio Bootstrap And Cache Hygiene

## Purpose

Use this guide when creating a new Copilot Studio project or reusing this scaffold for a new healthcare agent.

The goal is to avoid the extension sync failures that came from stale or synthetic `.mcs` cache files, broken local workflow references, and repo state that looked valid to humans but was not safe for the Copilot Studio extension.

## Core Rules

- The repo is the authored source of truth.
- The live tenant is the runtime validation source of truth.
- The `.mcs` directory is extension-managed cache and connection state.
- Do not treat `.mcs` snapshots as portable project assets.
- The Copilot Studio extension is the first and primary workflow.
- Recovery methods exist only to get back to the extension-first workflow.
- Do not normalize shortcuts, placeholder fixes, or draft-only bind points into the main development path.

## Safe Initial `.mcs` State

Before the first healthy sync, the `.mcs` folder should contain only:

- `.gitkeep`
- `README.md`
- `conn.json` after attachment

Do not copy these from another project:

- `botdefinition.json`
- `botdefinition.tmp.json`
- `changetoken.txt`
- `filechangetrack.json`
- synthetic exported live template files used only for debugging

## Recommended Bootstrap Sequence

1. Open the workspace in VS Code.
2. Confirm the Copilot Studio extension is installed and updated.
3. Confirm PAC CLI and required MCP tooling are available.
4. Attach to the target agent with `Copilot Studio: Open agent`.
5. Let the extension build the `.mcs` cache through `Open agent` or `Get changes`.
6. Run local validation:
   - `Validate-SnfAiDashboardProject.ps1`
   - `Invoke-SnfAiDashboardPreflight.ps1 -RequireConnection`
   - `Get-CopilotStatus.ps1`
7. Run `Copilot Studio: Get changes`.
8. Run `Copilot Studio: Preview changes`.
9. Run `Copilot Studio: Apply changes`.
10. Publish and verify with `pac copilot status`.

This is the required build path first time and all the time unless the extension is actually blocked.

## Repo Hygiene Requirements Before Preview Or Apply

- every topic dialog reference resolves locally
- every action dialog reference resolves locally
- every action `flowId` has a matching workflow folder
- every workflow folder has:
  - `metadata.yml`
  - `workflow.json`
- manifests match the actual files and folders
- YAML is free of merge markers and malformed values
- closed-list menu values are quoted strings
- no placeholder names, TODO markers, or stub-only bind points remain in the active intended path

## Known Failure Patterns

### Missing `.mcs/botdefinition.json`

This usually means the extension cache is incomplete.

Use:

1. `Developer: Reload Window`
2. `Copilot Studio: Open agent`
3. `Copilot Studio: Get changes`

### `The input string '1033>>>>>>> ' was not in a correct format`

This is a corrupted cache symptom.

Use:

1. `Reset-CopilotStudioWorkspaceCache.ps1`
2. reload the VS Code window
3. `Copilot Studio: Open agent` or `Copilot Studio: Get changes`

### `Unknown bot component`

This usually means the workspace cache was rebuilt from an unsupported synthetic snapshot instead of a true extension-managed sync.

Use:

1. clear the `.mcs` cache except `conn.json`
2. let the extension rebuild it
3. rerun `Get changes`

### `Apply changes` blocked by remote changes

Use:

1. `Get changes`
2. reconcile local drift
3. `Preview changes`
4. `Apply changes`

### PAC CLI publish reports a parser error

Verify with:

- `pac copilot status`
- `pac copilot list`

If the bot is still `Published` and `Provisioned`, the issue may be CLI-side response parsing rather than a failed publish.

## Fallback Hierarchy

Use fallback only in this order:

1. local validation
2. VS Code reload
3. `Open agent`
4. `Get changes`
5. cache reset that preserves `conn.json`
6. extension rebuild of `.mcs`
7. targeted repo fixes for malformed YAML or missing references

Do not skip directly to copied cache files, synthetic snapshots, or manual `.mcs` reconstruction as a standard practice.

## What To Keep In Future Project Templates

- validator script
- preflight script
- status script
- cache reset script
- Copilot Studio bootstrap guide
- Copilot Studio sync recovery guide
- MCP config and VS Code tasks

## What Not To Normalize

- do not normalize broken `.mcs` cache files into the reusable template
- do not check in extension cache snapshots as if they were source artifacts
- do not rely on PAC export alone to recreate the exact workspace state the extension expects

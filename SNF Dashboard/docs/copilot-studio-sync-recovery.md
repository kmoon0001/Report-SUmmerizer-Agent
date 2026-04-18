# Copilot Studio Sync Recovery

## Purpose

Use this runbook when `Copilot Studio: Preview changes`, `Copilot Studio: Get changes`, or `Copilot Studio: Apply changes` stop working in the VS Code workspace.

This is the recovery path for the `SNF AI Dashboard` workspace, but the same sequence should be reused in future projects.

## Current Attached Workspace

- Workspace: `D:\my agents copilot studio\SNF Dashboard`
- Environment: `a944fdf0-0d2e-e14d-8a73-0f5ffae23315`
- Bot: `b5d87f73-c34f-4eca-9405-29f8f7e62d71`

## Supported Recovery Workflow

1. Confirm the repo is locally valid.
2. Confirm the workspace is still attached to the right environment and bot.
3. Rebuild the local cloud snapshot through the Copilot Studio extension.
4. Run `Preview changes` again.
5. Only run `Apply changes` after preview and remote sync are clean.
6. Publish only after apply succeeds.

## Lessons Learned

- The most stable path is extension-first:
  - `Open agent`
  - `Get changes`
  - `Preview changes`
  - `Apply changes`
  - publish
- The `.mcs` directory is not authored source. It is extension-managed connection state and sync cache.
- Copying or synthesizing `.mcs` cache files can temporarily bypass one error and create harder failures later.
- The repo must stay internally consistent before any extension sync:
  - topic references must resolve
  - action `flowId` values must map to local workflow folders
  - workflow manifests must match real folders
  - YAML must be clean and merge-marker free
- For `DynamicClosedListEntity` question outputs, route with `Text(Topic.ChoiceVariable) = "OptionValue"` in conditions.
  Do not use `Topic.ChoiceVariable.Value = "OptionValue"` and do not compare `Topic.ChoiceVariable` directly to a string.
- The PAC CLI can misreport publish failures. Always verify with `pac copilot status` and `pac copilot list`.
- If you see a locale-style parse error like `1033>>>>>>>`, the issue may be corrupted cache content, not the `language: 1033` setting itself.
- Recovery exists to restore the extension-first method, not to replace it.
- Do not normalize placeholder files, copied cache files, or synthetic snapshots into the ongoing build process.
- For project automation outside the extension path, use the same resilience pattern:
  - explicit step boundaries
  - pass/warn/fail run logs
  - cleanup of stale derived artifacts
  - `try`/`finally` persistence for run logs
  - graceful degradation for optional inputs instead of silent reuse of old outputs

## Local Validation First

Run these before touching the extension:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\Validate-SnfAiDashboardProject.ps1
powershell -ExecutionPolicy Bypass -File .\scripts\Invoke-SnfAiDashboardPreflight.ps1 -RequireConnection
powershell -ExecutionPolicy Bypass -File .\scripts\Get-CopilotStatus.ps1
```

Expected result:

- validator passes with `0` errors
- preflight passes
- bot status is still `Provisioned`

## If Preview Or Get Changes Fails

### Symptom: `.mcs/botdefinition.json was not found. Please resync.`

This means the workspace is attached, but the extension does not have a valid local cloud snapshot.

Do this:

1. Keep `.mcs/conn.json` intact.
2. In VS Code, run `Copilot Studio: Open agent` and open the same agent again.
3. Then run `Copilot Studio: Get changes`.
4. Confirm that `.mcs/botdefinition.json` and related sync files are recreated by the extension.
5. Run `Copilot Studio: Preview changes`.

If the workspace still does not rebuild:

1. Close VS Code for that workspace.
2. Reopen the same workspace.
3. Run `Copilot Studio: Open agent` again.
4. Run `Copilot Studio: Get changes`.

### Symptom: Apply is blocked because remote changes were not pulled

This is expected behavior. Microsoft blocks `Apply changes` until `Get changes` succeeds.

Do this:

1. Run `Copilot Studio: Preview changes`.
2. If remote changes exist, run `Copilot Studio: Get changes`.
3. Resolve any file conflicts locally.
4. Run `Copilot Studio: Preview changes` again.
5. Then run `Copilot Studio: Apply changes`.

### Symptom: Preview or Get Changes throws a parsing or format error

Do this:

1. Re-run the local validator.
2. Inspect the topic or action named in the error.
3. Check for:
   - malformed YAML
   - merge markers such as `<<<<<<<`, `=======`, `>>>>>>>`
   - unquoted values in closed-list menu items
   - invalid `DynamicClosedListEntity` comparisons such as `Topic.*.Value = "..."` or `Topic.* = "..."`
   - invalid dialog references
   - action `flowId` values with no matching workflow folder
   - missing workflow stub folders or malformed `workflow.json`
   - corrupted `.mcs` cache files
4. Fix locally.
5. Retry `Preview changes`.

### Symptom: The input string `1033>>>>>>> ` was not in a correct format

This is a cache corruption symptom, not usually a bad `language: 1033` project setting.

Do this:

1. Keep `.mcs/conn.json`.
2. Move or clear extension cache files from `.mcs`.
3. Reload VS Code.
4. Run `Copilot Studio: Open agent` or `Copilot Studio: Get changes`.
5. Let the extension regenerate the cache snapshot.

Use:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\Reset-CopilotStudioWorkspaceCache.ps1
```

Then rebuild through the extension.

### Symptom: PAC CLI publish crashes with a response-format error

Do this:

1. Run `pac copilot status`.
2. Run `pac copilot list` and confirm the bot state.
3. If the bot shows `Published` and `Provisioned`, treat it as a CLI parsing bug unless the service state says otherwise.

## If Apply Changes Fails

Do this:

1. Re-run `Preview changes`.
2. Confirm there are no unresolved remote changes.
3. Confirm validator and preflight still pass.
4. Retry `Apply changes`.
5. If it still fails, capture the exact extension message and the Copilot Studio language-server log.

## Publish Workflow

After a successful apply:

```powershell
pac copilot publish --environment a944fdf0-0d2e-e14d-8a73-0f5ffae23315 --bot b5d87f73-c34f-4eca-9405-29f8f7e62d71
pac copilot status --environment a944fdf0-0d2e-e14d-8a73-0f5ffae23315 --bot-id b5d87f73-c34f-4eca-9405-29f8f7e62d71
```

## Supported Source Of Truth

- Repo files are the editable source of truth.
- The live tenant is the runtime validation source of truth.
- The `.mcs` snapshot files are extension-managed cache files, not long-term authoring assets.

## Important Boundary

If the `.mcs` cache is broken, the supported fix is to let the Copilot Studio extension rebuild it through `Open agent` and `Get changes`.

Using `pac copilot extract-template` can help inspect live state, but it is not a full replacement for the extension-managed workspace snapshot.

## Future Projects

For future projects, use the same sequence:

1. Validate repo.
2. Confirm `.mcs/conn.json`.
3. Re-open the agent in the extension.
4. Run `Get changes`.
5. Run `Preview changes`.
6. Run `Apply changes`.
7. Publish.

If any future project loses workflow stub folders or action bindings, restore internal repo consistency before retrying the extension sync.


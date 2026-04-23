# Fleet Sync & Recovery Runbook

Last updated: 2026-04-21

This runbook provides the prioritized recovery procedure for getting each agent in the
Pacific Coast clinical swarm synced to live Copilot Studio. Based on Microsoft Learn
best practices and lessons learned from TheraDoc's successful recovery.

## References

- [Synchronize your changes](https://learn.microsoft.com/microsoft-copilot-studio/visual-studio-code-extension-synchronization)
- [Clone your agent](https://learn.microsoft.com/microsoft-copilot-studio/visual-studio-code-extension-clone-agent)
- [Export and import agents using solutions](https://learn.microsoft.com/microsoft-copilot-studio/authoring-solutions-import-export)
- [Solution management in Copilot Studio](https://learn.microsoft.com/microsoft-copilot-studio/authoring-solutions-overview)

## Environments

| Name | Dataverse Endpoint | Environment ID |
|------|-------------------|----------------|
| PCCA Package | `https://pccapackage.crm.dynamics.com/` | `077422cf-d088-e3d7-917e-5c9a9b64710c` |
| Therapy AI Agents Dev | `https://orgbd048f00.crm.dynamics.com/` | `a944fdf0-0d2e-e14d-8a73-0f5ffae23315` |
| Production (org3353a370) | `https://org3353a370.crm.dynamics.com/` | `fd140aae-4df4-11dd-bd17-0019b9312238` |

## Agent Status Matrix

| # | Agent | Environment | Live Name | Agent GUID | Cache State | Recovery Path |
|---|-------|-------------|-----------|------------|-------------|---------------|
| 1 | TheraDoc | pccapackage | AgentTheraDoc Hardened | `09b002b6-ec3c-f111-88b5-000d3a5b0d6c` | HEALTHY | Maintenance only |
| 2 | SNF Dashboard | orgbd048f00 | SNF AI Dashboard | `b5d87f73-c34f-4eca-9405-29f8f7e62d71` | CACHE RESET (ready for rebuild) | Extension recovery, then solution transport |
| 3 | Clinical Synthesis Lab | pccapackage | SNF Rehab Agent (probable) | `60a37e9b-0e3d-f111-88b5-000d3a5b0d6c` | PARTIAL (old conn.json) | Fresh clone after confirmation |
| 4 | Regulatory Hub | orgbd048f00 | SimpleLTC QM Coach V2 | `ea52ad9c-8233-f111-88b3-6045bd09a824` | NO CACHE | Clone from orgbd048f00 |
| 5 | Denial Defense Agent | NONE | Does not exist | N/A | NO CACHE | Create in Copilot Studio, then clone |
| 6 | SNF Agent Command Center | orgbd048f00 | SNF Command Center Agent | `8c9b244f-073a-f111-88b3-000d3a5b95c6` | NO CACHE | Clone from orgbd048f00 |

## Recommended Execution Order

Work from most-ready to least-ready:

### Phase 1: Maintain what works
1. **TheraDoc** — already healthy. Run `Preview Changes` to confirm no drift. No action needed unless broken.

### Phase 2: Fix broken syncs
2. **SNF Dashboard** — has `conn.json` with correct GUID. Run extension recovery (Open Agent > Get > Preview > Apply). Fallback: solution transport.

### Phase 3: Complete partial syncs
3. **Clinical Synthesis Lab** — has `conn.json` but environment mismatch needs resolution first. Confirm correct environment with `pac copilot list`, then fresh clone.

### Phase 4: First-time connections
4. **Regulatory Hub** — discover the real agent GUID, then clone. Has extensive scripts that may help.
5. **Denial Defense Agent** — discover if agent exists, clone or create. Needs recovery scripts built after sync.

### Phase 5: Architectural decisions
6. **SNF Agent Command Center** — decide if this is a live agent or design-only blueprint. Act accordingly.

## Universal Recovery Decision Tree

```
Start
  |
  v
Does .mcs/conn.json exist?
  |
  +-- NO --> Has the agent ever been cloned?
  |            |
  |            +-- NO --> Does it exist in an environment?
  |            |           |
  |            |           +-- YES --> Copilot Studio: Clone Agent
  |            |           +-- NO  --> Create in Copilot Studio web UI, then clone
  |            |
  |            +-- YES --> Copilot Studio: Reattach Agent
  |
  +-- YES --> Does .mcs/botdefinition.json exist?
               |
               +-- YES --> HEALTHY. Use standard Preview > Get > Apply cycle.
               |
               +-- NO  --> BROKEN CACHE.
                            |
                            v
                      Try: Open Agent > wait for cache rebuild > Get Changes
                            |
                            +-- Works? --> Continue with Preview > Apply > Publish
                            +-- Fails? --> Try 1 more time
                                            |
                                            +-- Works? --> Continue
                                            +-- Fails? --> Solution Transport fallback:
                                                           1. pac solution export (backup)
                                                           2. pac solution pack
                                                           3. pac solution import --publish-changes
                                                           4. pac copilot list (verify)
                                                           5. Clone Agent (fresh cache)
```

## Pre-Sync Checklist (All Agents)

Before attempting any sync operation:

- [ ] PAC CLI authenticated: `pac auth list` shows correct profile
- [ ] Correct profile selected: `pac auth select --index <n>`
- [ ] Agent exists in target environment: `pac copilot list --environment <url>`
- [ ] No YAML parse errors in repo: check VS Code Problems pane
- [ ] No unresolved merge markers in topic/action files
- [ ] No placeholder `flowId` bindings pointing to nonexistent workflows

## Post-Sync Checklist (All Agents)

After successful Apply:

- [ ] Publish: `pac copilot publish --environment <url> --bot <guid>`
- [ ] Verify: `pac copilot list --environment <url>` shows the agent
- [ ] `.mcs/botdefinition.json` exists and is non-empty
- [ ] `filechangetrack.json` is `{}` (clean state)
- [ ] Test in Copilot Studio web UI test pane

## Solution Transport Commands (Quick Reference)

```powershell
# Backup current live state
pac solution export --environment <url> --name "<AgentName>Backup" --path ./artifacts/<agent>_backup.zip

# Pack local repo
pac solution pack --zipfile ./artifacts/<agent>_transport.zip --folder . --processCanvasApps

# Import to tenant
pac solution import --environment <url> --path ./artifacts/<agent>_transport.zip --publish-changes --max-async-wait-time 120

# Verify
pac copilot list --environment <url>
```

## Lessons Learned

1. **Extension-first is correct but fragile**: The VS Code extension is Microsoft's recommended path, but cache corruption is common. Always have solution transport as a fallback.
2. **TheraDoc proved solution transport works**: After 15+ extension recovery attempts, `pac solution import` succeeded on the first try.
3. **Do not copy `.mcs` between agents**: Each agent's cache is unique to its environment/GUID binding.
4. **Reattach Agent is underused**: When a workspace exists but the cache is gone, `Copilot Studio: Reattach Agent` can rebuild it without a full clone.
5. **Older `conn.json` format**: Agents cloned with older extension versions have a short-format `conn.json`. A fresh clone will generate the full format with `DataverseEndpoint`, `AccountInfo`, and `SolutionVersions`.
6. **Environment binding mismatches**: Always verify which environment actually hosts the agent before attempting sync. AGENT.md documentation can be stale.

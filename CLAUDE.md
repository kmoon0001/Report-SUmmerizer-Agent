# CLAUDE.md - Pacific Coast Therapy Hub

## What This Is

A monorepo containing 5 Microsoft Copilot Studio agents forming a clinical AI swarm for Skilled Nursing Facility (SNF) therapy documentation. Hub-and-spoke architecture with SNF Agent Command Center as orchestrator.

## Agents

| Agent | Role | Path |
|-------|------|------|
| SNF Agent Command Center | Orchestrator/dispatcher | `SNF Agent Command Center/` |
| TheraDoc | Real-time clinical documentation (PT/OT/ST) | `TheraDoc/` |
| Denial Defense Agent | Revenue protection, 7-layer XAI audit | `Denial Defense Agent/` |
| Pacific-Coast Regulatory Hub | QM/MDS 3.0/CMS compliance coaching | `Pacific-Coast Regulatory Hub/` |
| Pacific-Coast Clinical Synthesis Lab | Longitudinal case histories/SBAR briefs | `Pacific-Coast Clinical Synthesis Lab/` |
| SNF Dashboard | KPI/QM dashboards, shift reports | `SNF Dashboard/` |

## Tech Stack

- **Authoring**: Microsoft Copilot Studio (topics, actions, knowledge)
- **Automation**: Power Automate (workflows, cross-agent orchestration)
- **Data**: Dataverse (`cr917_` schema prefix), telemetry to `cr917_snf_telemetry_logs`
- **Analytics**: Power BI Fabric (Direct Lake, OneLake)
- **EHR**: PointClickCare, NetHealth Optima via Fabric
- **Testing**: Playwright E2E
- **Compliance**: HIPAA, CMS Chapter 15, MDS 3.0, Jimmo Settlement, Five-Star

## Cross-Agent Handoff Schema

All inter-agent payloads use this exact JSON structure. No raw PHI in payloads - use `record_id` pointers to Dataverse.

```json
{
  "patient_id": "{{PATIENT_ID}}",
  "record_id": "{{RECORD_ID}}",
  "document_type": "...",
  "current_stage": "Intake | Draft | Analysis | Audit | Complete | Error",
  "user_intent": "...",
  "status": "pending | success | error",
  "reason": "Human-readable outcome",
  "next_agent": "TheraDoc | SNF-Dashboard | Regulatory-Hub | Clinical-Synthesis-Lab | Denial-Defense"
}
```

## Hardening Rules (All Agents)

1. **No PHI in payloads** - use `record_id` as Dataverse pointer
2. **Mandatory telemetry** - every handoff logged to `cr917_snf_telemetry_logs`
3. **Max-hop limit >= 3** - hard-abort and escalate to human supervisor
4. **Self-healing errors** - OnError returns structured JSON, not conversational text
5. **Fallback tickets** - unrecoverable errors create ITSM ticket for `clinical-leadership`
6. **Column-level security** - `_phi_restricted` Dataverse profiles enforced via `connectionreferences.mcs.yml`

## Source of Truth

- **Repo** = editable source for prompts, topics, actions, workflows, knowledge, docs
- **Live tenant** = validation source for what the environment actually supports
- When they conflict, confirm against live exports before marking work done

## Development Workflow

1. Edit in repo
2. Copilot Studio extension: Get changes > Preview changes > Apply changes
3. Publish: `pac copilot publish --environment <env-guid> --bot <agent-id>`
4. Verify: `pac copilot list --environment <env-guid>`

Extension-first is mandatory. Recovery paths restore the extension path, never replace it.

## Copilot Studio Authoring Rules

- Agent instructions: short, ordered, explicit, highest-priority first
- Topic descriptions: single-purpose, start with `Use this topic when...`
- Action descriptions: start with `Use this action to...`
- Knowledge sources: explicit scope, intended use, exclusions
- Button-first interaction: closed-list/boolean for all operational paths
- Free text only for: patient IDs, dates, metrics, unusual findings, custom clinical details
- Conditions on closed lists: use `Text(Topic.ChoiceVariable) = "OptionValue"` (never `.Value`)
- Prefer built-in entities > closed lists > custom/regex
- Keep topic count low - reuse with branching before cloning
- Canvas-authored first, YAML editing second

## MCP Stack (Default)

Configured in `.vscode/mcp.json`:

| Server | Purpose |
|--------|---------|
| `pac-cli` | Copilot Studio MCP |
| `filesystem` | Local file access |
| `git` | Git operations |
| `github` | GitHub integration |
| `learn-docs` | Microsoft Learn documentation |
| `azure-mcp` | Azure resource context |
| `powerbi-remote` | Semantic model queries |
| `playwright` | Browser/UI verification |

## Validation Gates (Before Apply)

1. Repo validation - YAML parse, reference checks, merge markers
2. Contract validation - topic variables match, dialogs resolve, action outputs exist
3. Runtime validation - `pac copilot list` includes target agent, correct profile
4. Packaging validation - no unresolved references, no placeholder/stub artifacts
5. Button-only routing check - no open-text nodes in operational paths
6. flowId check - every action flowId has matching `workflows/` folder

## Recovery (Extension Sync Failures)

1. Validate local repo integrity (merge markers, YAML parse, references)
2. Verify binding: `pac auth list`, `.mcs/conn.json`
3. Reset sync state if needed (clear `.mcs/filechangetrack.json`, `changetoken.txt`)
4. Re-run: Get changes > Preview changes > Apply changes
5. Publish and verify live

## Key Directories

```
SNF Agent Command Center/    # Orchestrator agent
TheraDoc/                    # Clinical documentation agent
Denial Defense Agent/        # Revenue protection agent
Pacific-Coast Regulatory Hub/  # Compliance agent
Pacific-Coast Clinical Synthesis Lab/  # Synthesis agent
SNF Dashboard/               # Dashboard agent
SharedKnowledge/             # Shared knowledge assets
docs/                        # Fleet specs, runbooks
.vscode/mcp.json             # MCP server config
playwright.config.ts         # E2E test config
```

## Do Not

- Pass raw PHI in cross-agent payloads
- Use `public` as environment target
- Copy `.mcs` cache files between projects
- Leave TODO/TBD/placeholder artifacts on active runtime paths
- Paste tokens, PATs, or secrets into source files
- Skip publish/verify after apply
- Use browser automation where supported APIs exist
- Fabricate clinical data, measurements, or diagnoses
- Normalize manual cache hacks as default workflow

## Agent-Specific Rules

Each agent has its own `AGENT.md` with local overrides. Read the relevant `AGENT.md` before working on that agent. The workspace-level `docs/FLEET_MASTER_SPEC.md` defines global rules that apply unless a deeper `AGENT.md` overrides.

## Environment

- **Dataverse endpoint**: `https://org3353a370.crm.dynamics.com/`
- **Environment ID**: `fd140aae-4df4-11dd-bd17-0019b9312238`
- **Tenant**: `org3353a370`
- **Schema prefix**: `cr917_`

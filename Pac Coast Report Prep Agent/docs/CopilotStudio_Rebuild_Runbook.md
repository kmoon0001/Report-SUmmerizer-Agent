# Copilot Studio Rebuild Runbook (Therapy_Report_Prep_Assistant)

## Scope

This runbook reconstructs missing agent capabilities (knowledge sources, tools/actions, and topic wiring) for:

- Agent display name: `Therapy_Report_Prep_Assistant`
- Schema: `pcca_agent39xn69`
- Environment: `https://org3353a370.crm.dynamics.com/`
- Agent ID: `c030a53a-4839-f111-88b4-000d3a37eba2`

## Microsoft Learn Constraints Applied

- Flows used as Copilot actions must use **When an agent calls the flow** and **Respond to the agent**.
- Flow responses must be synchronous and typically return in under 100 seconds.
- Flows must be in a solution in the same environment as the agent.
- Topic design should prefer bite-size reusable topics and avoid overlap.
- Knowledge should be grounded to trusted enterprise sources; use explicit source controls.
- If custom retrieval is needed, use `OnKnowledgeRequested` in YAML code view.

## Rebuild Inputs

- Knowledge source recommendations: `SNF Rehab Agent/rebuild/knowledge-sources.recommended.yml`
- Tool/action definitions: `SNF Rehab Agent/rebuild/action-contracts.recommended.yml`
- Existing topics: `SNF Rehab Agent/topics/*.mcs.yml`
- Existing flow candidates: `SNF Rehab Agent/workflows/*.json`

## Rebuild Sequence

1. Environment preflight
- `pac auth list`
- `pac auth select --index 1`
- Verify `SNF Rehab Agent/.mcs/conn.json` has expected `EnvironmentId` and `AgentId`.
- `pac copilot list --environment https://org3353a370.crm.dynamics.com/`

2. Recreate knowledge sources
- Add priority-1 regulated/public sources first.
- Add internal SOP/QA sources second.
- Keep source descriptions specific and scoped by discipline (PT/OT/SLP).
- Disable ungrounded behavior where strict compliance grounding is required.

3. Recreate actions/tools (contract-first)
- For each action in `action-contracts.recommended.yml`:
  - Create/modify flow with Copilot trigger + Respond action.
  - Keep output schema stable; avoid nullable shape drift.
  - Place long-running work after Respond action if needed.

4. Rebind topics to tools and knowledge
- Wire core rehab decision topics first:
  - `ClassifyAndRouteRehabRecord`
  - `EvalAnalysis`
  - `ProgressAnalysis`
  - `RecertAnalysis`
  - `DischargeAnalysis`
- Keep system topics minimal and reusable; avoid duplication.

5. Validation gates before publish
- Contract validation: every topic tool call maps to a real flow/action.
- Runtime validation: key actions execute and return schema-compliant payloads.
- Packaging validation: no unresolved merge markers, no missing references.
- QA validation: at least one PT/OT/SLP happy path and one failure path each.

6. Publish and verify
- `pac copilot publish --environment https://org3353a370.crm.dynamics.com/ --bot c030a53a-4839-f111-88b4-000d3a37eba2`
- `pac copilot list --environment https://org3353a370.crm.dynamics.com/`
- If `pac copilot status` fails with known CLI defect in this tenant, treat publish+list+live UI checks as authoritative.

## Completion Criteria

- Knowledge sources present and scoped by trust level.
- All required actions are callable with stable response contracts.
- Topic routing exercises all core therapy analysis paths.
- Publish succeeds and runtime list shows active provisioned agent.

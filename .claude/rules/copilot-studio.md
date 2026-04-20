When working on Copilot Studio agents in this repo:

- Read the agent's AGENT.md before making changes to that agent
- Use pac CLI (full path: C:\Users\kevin\AppData\Local\Microsoft\PowerAppsCLI\pac.cmd) for all Power Platform operations
- Cross-agent payloads use record_id pointers to Dataverse - never pass raw PHI
- Dataverse schema prefix is cr917_, telemetry table is cr917_snf_telemetry_logs
- Environment: Therapy AI Agents Dev (orgbd048f00.crm.dynamics.com)
- Topic conditions on closed lists must use Text(Topic.ChoiceVariable) = "Value"
- Button-first interaction is mandatory for all operational paths
- Extension-first sync: Get changes > Preview > Apply > Publish > Verify

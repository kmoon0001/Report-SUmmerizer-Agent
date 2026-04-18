# Copilot End-To-End Automation Report

Generated: 2026-04-07 03:29:21
ProjectRoot: D:\SNF AI Dashboard
EnvironmentId: a944fdf0-0d2e-e14d-8a73-0f5ffae23315
BotId: b5d87f73-c34f-4eca-9405-29f8f7e62d71

- [PASS] Validate Project (2026-04-07 03:28:21): SNF AI Dashboard validation summary Topics: 50 Actions: 6 Workflow folders: 6 Warnings: 0 Errors: 0 Validation passed.
- [PASS] Preflight (Require Connection) (2026-04-07 03:28:26): SNF AI Dashboard preflight 1. Repo validation SNF AI Dashboard validation summary Topics: 50 Actions: 6 Workflow folders: 6 Warnings: 0 Errors: 0 Validation passed. 2. Button-only routing validation Button-only question routing check passed. Topics scanned: 50 3. PAC CLI check Microsoft PowerPlatform CLI Version: 2.4.1+g3799f3e (.NET Framework 4.8.9325.0) 4. Workspace connection EnvironmentId: a944fdf0-0d2e-e14d-8a73-0f5ffae23315 AgentId: b5d87f73-c34f-4eca-9405-29f8f7e62d71 5. Recommended next step - Run Copilot Studio: Preview changes in VS Code. - If the diff is correct, run Copilot Studio: Apply changes. - Then run scripts\\Publish-Copilot.ps1 and scripts\\Get-CopilotStatus.ps1. Preflight passed.
- [PASS] Button-Only Routing Gate (2026-04-07 03:28:27): Button-only question routing check passed. Topics scanned: 50
- [PASS] Copilot Authoring Compliance (2026-04-07 03:28:28): { "TopicsScanned": 50, "ActionsScanned": 6, "WorkflowsScanned": 6, "ErrorCount": 0, "WarningCount": 1 } Warnings: Topic trigger phrase is long; prefer short phrases: Escalate.mcs.yml -> 'Can I have a call in number Or can I be called'
- [PASS] Resilient Apply (2026-04-07 03:28:41): === Resilient Apply Attempt 1 of 3 === Workflow restore complete. Restored count: 0 Already present count: 6 SNF AI Dashboard validation summary Topics: 50 Actions: 6 Workflow folders: 6 Warnings: 0 Errors: 0 Validation passed. Reset Copilot Studio workspace cache. Preserved: .gitkeep, README.md, conn.json, botdefinition.json, botdefinition.tmp.json, filechangetrack.json Backup: D:\SNF AI Dashboard\.mcs-cache-backup-20260407-032829 Moved files: Workflow restore complete. Restored count: 0 Already present count: 6 SNF AI Dashboard validation summary Topics: 50 Actions: 6 Workflow folders: 6 Warnings: 0 Errors: 0 Validation passed. Resilient apply attempt 1 finished with clean validation.
- [PASS] Publish Copilot (2026-04-07 03:29:10): Connected as 123713644@ensignservices.net Connected to... Therapy AI Agents Dev Connected to... Therapy AI Agents Dev ....Published successfully! b5d87f73-c34f-4eca-9405-29f8f7e62d71 Succeeded [4/7/2026 10:21:14 AM].
- [PASS] Verify Copilot Status (2026-04-07 03:29:16): Connected as 123713644@ensignservices.net Connected to... Therapy AI Agents Dev Copilot SNF AI Dashboard with ID b5d87f73-c34f-4eca-9405-29f8f7e62d71 has been provisioned.
- [PASS] Verify Copilot List Entry (2026-04-07 03:29:21): SNF AI Dashboard b5d87f73-c34f-4eca-9405-29f8f7e62d71 Published Unmanaged fd140aae-4df4-11dd-bd17-0019b9312238 Active Provisioned

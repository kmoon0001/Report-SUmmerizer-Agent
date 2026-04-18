# Self-Heal Execution Checklist

- Generated (UTC): 2026-04-18T05:17:16.8995900Z
- Environment: https://org3353a370.crm.dynamics.com/
- Agent: c030a53a-4839-f111-88b4-000d3a37eba2
- Drift count: 6
- Plan: D:\Report SUmmerizer Agent\exports\manual-repair\runtime-repair-plan-20260417-221716.json

## Ordered Steps
1. Open Copilot Studio Topics page for this agent.
2. For each drifted topic below, open topic code editor and apply the specified action.
3. Save topic after each update.
4. Publish agent.
5. Re-run Build-ApplyReadiness.ps1 with refreshed runtime template.

1. Topic: ClassifyAndRouteRehabRecord
   Drift: MissingDialog
   Action: Open existing topic component by RuntimeComponentId and replace code with DialogFile content.
   Dialog file: D:\Report SUmmerizer Agent\exports\manual-repair\dialogs\ClassifyAndRouteRehabRecord.dialog.yml
   Open URL: https://copilotstudio.microsoft.com/environments/Default-03cc92c3-986c-4cf4-ae27-1478cf99d17f/bots/c030a53a-4839-f111-88b4-000d3a37eba2/adaptive/42766d20-8fbe-4a36-a104-6f2edab84ae5

2. Topic: EvalAnalysis
   Drift: MissingDialog
   Action: Open existing topic component by RuntimeComponentId and replace code with DialogFile content.
   Dialog file: D:\Report SUmmerizer Agent\exports\manual-repair\dialogs\EvalAnalysis.dialog.yml
   Open URL: https://copilotstudio.microsoft.com/environments/Default-03cc92c3-986c-4cf4-ae27-1478cf99d17f/bots/c030a53a-4839-f111-88b4-000d3a37eba2/adaptive/2df0e006-0aee-4b34-84e6-53e96c8037aa

3. Topic: ProgressAnalysis
   Drift: MissingDialog
   Action: Open existing topic component by RuntimeComponentId and replace code with DialogFile content.
   Dialog file: D:\Report SUmmerizer Agent\exports\manual-repair\dialogs\ProgressAnalysis.dialog.yml
   Open URL: https://copilotstudio.microsoft.com/environments/Default-03cc92c3-986c-4cf4-ae27-1478cf99d17f/bots/c030a53a-4839-f111-88b4-000d3a37eba2/adaptive/a508c0ba-9c8d-490e-a3b7-77f299823336

4. Topic: RecertAnalysis
   Drift: MissingDialog
   Action: Open existing topic component by RuntimeComponentId and replace code with DialogFile content.
   Dialog file: D:\Report SUmmerizer Agent\exports\manual-repair\dialogs\RecertAnalysis.dialog.yml
   Open URL: https://copilotstudio.microsoft.com/environments/Default-03cc92c3-986c-4cf4-ae27-1478cf99d17f/bots/c030a53a-4839-f111-88b4-000d3a37eba2/adaptive/fb80ea18-8e91-4405-80c1-1dbfd9446faa

5. Topic: DischargeAnalysis
   Drift: MissingDialog
   Action: Open existing topic component by RuntimeComponentId and replace code with DialogFile content.
   Dialog file: D:\Report SUmmerizer Agent\exports\manual-repair\dialogs\DischargeAnalysis.dialog.yml
   Open URL: https://copilotstudio.microsoft.com/environments/Default-03cc92c3-986c-4cf4-ae27-1478cf99d17f/bots/c030a53a-4839-f111-88b4-000d3a37eba2/adaptive/b770245b-4798-4671-963b-2892fd3953e5

6. Topic: Search
   Drift: MissingComponent
   Action: Create topic component, then paste dialog YAML from DialogFile.
   Dialog file: D:\Report SUmmerizer Agent\exports\manual-repair\dialogs\Search.dialog.yml
   Open URL: https://copilotstudio.microsoft.com/environments/Default-03cc92c3-986c-4cf4-ae27-1478cf99d17f/bots/c030a53a-4839-f111-88b4-000d3a37eba2/adaptive/7e802649-3401-4000-bdf2-2685f14e5309

## Verify
- pac copilot publish --environment https://org3353a370.crm.dynamics.com/ --bot c030a53a-4839-f111-88b4-000d3a37eba2
- pac copilot list --environment https://org3353a370.crm.dynamics.com/
- pac copilot extract-template --environment https://org3353a370.crm.dynamics.com/ --bot c030a53a-4839-f111-88b4-000d3a37eba2 --templateFileName exports/runtime-template-current-check.yml --overwrite
- powershell -ExecutionPolicy Bypass -File scripts/Build-ApplyReadiness.ps1

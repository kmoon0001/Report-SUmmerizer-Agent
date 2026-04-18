# Apply And Publish Checklist

1. Confirm the workspace is attached in `.mcs/conn.json`.
2. Run `scripts/Invoke-SnfAiDashboardPreflight.ps1`.
3. Run preview in Copilot Studio.
4. Confirm the diff is expected.
5. Run `Copilot Studio: Apply changes`.
6. Run `scripts/Publish-Copilot.ps1` or `pac copilot publish`.
7. Run `scripts/Get-CopilotStatus.ps1` or `pac copilot status`.
8. Spot-check the live agent with Playwright if the UI is part of the change.

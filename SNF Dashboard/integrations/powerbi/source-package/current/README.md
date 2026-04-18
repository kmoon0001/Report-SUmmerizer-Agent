# Current Source Package

This folder is the current Power BI handoff package generated from live SNF processed outputs.

Key files:
- `source-package-manifest.json`
- `command_center_operational_summary.md`
- `command_center_executive_unit_snapshot.csv`
- `model-tables\model-table-manifest.json`

Use this package with:
- `D:\my agents copilot studio\SNF Dashboard\integrations\powerbi\executive-command-center-powerbi-implementation.md`
- `D:\my agents copilot studio\SNF Dashboard\integrations\powerbi\executive-command-center-desktop-runbook.md`

Regenerate it with:

```powershell
powershell -ExecutionPolicy Bypass -File "D:\my agents copilot studio\SNF Dashboard\scripts\Invoke-PowerBiExecutivePrep.ps1"
```


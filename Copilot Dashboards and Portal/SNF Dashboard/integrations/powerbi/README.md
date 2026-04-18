# Power BI

Current use:
- source-controlled semantic model and report contracts
- executive and operational command-center page design
- packaged processed-source handoff for PBIP/Desktop model build

Key artifacts:
- `architecture-notes.md`
- `executive-command-center-powerbi-implementation.md`
- `executive-command-center-desktop-runbook.md`
- `executive-command-center-measures.csv`
- `executive-command-center-relationships.csv`
- `source-package\`
- `source-package\current\model-tables\`
- `source-package\current\authoring-kit\`

Recommended flow:
1. Run `Invoke-PowerBiExecutivePrep.ps1`
2. Confirm `Test-PowerBiExecutivePackage.ps1` passes
3. Use `source-package\current\authoring-kit\` for the theme, measure script, relationship copy, and visual layout guidance
4. Import the generated model tables into Power BI Desktop or PBIP
5. Apply the source-controlled relationship and measure contracts

Related dashboard bundle:
- run `Invoke-ExecutiveCommandCenterRefresh.ps1` to regenerate the processed outputs, Power BI handoff package, executive HTML bundle, and machine-readable dashboard payload in one pass

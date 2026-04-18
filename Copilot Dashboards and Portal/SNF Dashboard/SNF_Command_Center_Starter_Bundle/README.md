# SNF Command Center Starter Bundle

This bundle is the reusable healthcare project scaffold for SNF Command Center implementations.

## Purpose

- Give future healthcare projects a predictable folder structure.
- Separate governance, assistant specs, workflows, and dashboard artifacts.
- Support clinical validation, audit readiness, and controlled deployment.

## Structure

- `00_ReadMe_and_Governance`
- `01_Clinical_Assistant_Specs`
- `02_Clinical_Workflows_and_Protocols`
- `03_Clinical_Dashboard_and_Visualization_Specs`

## Usage Rules

- Keep this bundle project-agnostic where possible.
- Store only approved or de-identified examples in reusable starter assets.
- Version manifests and review dates whenever a clinical artifact changes.
- Do not add PHI to the starter bundle.
- Do not normalize shortcuts into the reusable bundle.
- The bundle should encode the correct production path, not temporary rescue steps.
- No placeholders should remain in the intended final build path once a project is promoted from starter scaffold to real implementation.
- Every future project copied from this bundle should use the extension-first Copilot Studio workflow, clean `.mcs` cache hygiene, and full preview/apply/publish verification.
- Every future project copied from this bundle should also inherit the Microsoft-first MCP stack:
  - Learn MCP for docs
  - Azure MCP for Azure context
  - Power BI MCP for semantic model queries
  - Playwright MCP for UI automation
  - APIs and workflow backends for actual Fabric and Power BI operations

## Source-Controlled Equivalents

- Use `scripts/Generate-StarterBundleArtifacts.ps1` to create source-controlled `.md` and `.csv` equivalents for governed artifacts that would otherwise be PDF, DOCX, or XLSX files.
- Use [Source_Controlled_Equivalents_Index.md](/d:/SNF%20AI%20Dashboard/SNF_Command_Center_Starter_Bundle/Source_Controlled_Equivalents_Index.md) as the mapping between manifest artifact names and editable repo files.

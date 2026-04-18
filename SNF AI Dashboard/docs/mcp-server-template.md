# SNF Command Center MCP Server Template

Use this as the target server inventory for a healthcare-capable environment. It is a design template, not a guarantee that every server exists in your tenant today.

In this workspace:

- `.vscode/mcp.json` is the default runnable base profile.
- `.vscode/mcp.healthcare.template.json` is the full healthcare target profile.
- `.vscode/mcp.manifest.json` tracks which servers belong to each profile.

## Required MCP Groups

- Core engineering:
  - `filesystem`
  - `git`
  - `github`
  - `playwright`
  - `pac-cli`
- Official Microsoft guidance and cloud context:
  - `learn-docs`
  - `azure-mcp`
  - `powerbi-remote`
- Workflow and platform:
  - `workflow-engine`
  - `dataverse`
  - `fhir-api`
- Optional real-time and analytics development:
  - `fabric-pro-dev`
  - `azure-health-data-services`
  - `sql-mcp`

## Responsibility Map

- `workflow-engine`: workflow deployment, alert routing, retries, escalations
- `learn-docs`: current Microsoft Learn documentation, release notes, examples, and implementation guidance
- `azure-mcp`: Azure subscription, resource group, service, and deployment context
- `powerbi-remote`: Power BI semantic model discovery, DAX generation, and query execution
- `dataverse`: patient master data, consent flags, assignments, reference dimensions
- `fhir-api`: FHIR read and write operations, validation, terminology-aware payload checks
- `fabric-pro-dev`: local Fabric development, file-based scaffolding, and Fabric API development workflows
- `azure-health-data-services`: Azure-hosted FHIR-native healthcare operations where deployed
- `sql-mcp`: SQL data access through Data API Builder-backed MCP surfaces

## Example Naming Standard

- `workflow-engine-prod`
- `fhir-api-prod`
- `dataverse-local`
- `powerbi-remote`
- `fabric-pro-dev-local`
- `azure-health-data-services-prod`

## Operational Rules

- Separate development, validation, and production MCP endpoints.
- Require named service principals or managed identities where possible.
- Do not point Playwright or workflow automation to production unless the scenario is explicitly approved.
- Keep PHI-bearing MCP servers behind tenant-approved auth, audit, and network controls.
- Use Copilot Studio extension first for workspace sync, not MCP.
- Use Learn MCP for docs, not for runtime operations.
- Use Playwright MCP for UI and browser flows, not as a replacement for official service APIs.
- Use Power BI MCP for semantic-model querying workflows, not for publish/admin operations.
- Use Power BI REST APIs and Fabric REST APIs or workflow backends for real deployment, publish, refresh, or item-management tasks.
- Keep Microsoft Graph MCP as a documented opt-in server until the tenant provisioning path and client configuration are confirmed for the target project.

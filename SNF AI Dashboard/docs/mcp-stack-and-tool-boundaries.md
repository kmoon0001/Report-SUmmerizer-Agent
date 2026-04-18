# MCP Stack And Tool Boundaries

This document defines the recommended Microsoft-first MCP stack for SNF Command Center projects and the boundary between MCP, browser automation, and service APIs.

## Default Stack

- Copilot Studio extension
- `pac-cli`
- `filesystem`
- `git`
- `github`
- `learn-docs`
- `azure-mcp`
- `powerbi-remote`
- `playwright`

## Healthcare And Analytics Add-Ons

- `fabric-pro-dev-local`
- `dataverse-local`
- `fhir-api-prod`
- `azure-health-data-services-prod`
- `workflow-engine-prod`
- `sql-mcp`

## Use The Right Tool For The Right Job

- Copilot Studio extension:
  - attach workspace
  - get changes
  - preview changes
  - apply changes
- Learn MCP:
  - Microsoft Learn docs
  - release notes
  - official implementation guidance
  - current Microsoft platform behavior research
- Playwright MCP:
  - browser automation
  - UI regression checks
  - Copilot Studio web validation
  - Fabric and Power BI UI smoke tests
- Power BI MCP:
  - semantic model discovery
  - DAX-oriented query workflows
  - AI-agent access to model-backed answers
- Azure MCP:
  - Azure resource context
  - cloud-side Azure operations
  - environment and service validation
- Dataverse MCP:
  - Dataverse data access through the approved MCP path
- Fabric Pro-Dev MCP:
  - local Fabric development workflows
  - project scaffolding
  - file-based Fabric build automation

## Do Not Use MCP For The Wrong Layer

- Do not use Learn MCP as a deployment tool.
- Do not use Playwright as the primary control path for Fabric or Power BI administration.
- Do not use Power BI MCP as a substitute for Power BI REST APIs.
- Do not use MCP instead of the Copilot Studio extension for workspace attach, preview, or apply.

## Fabric And Power BI Boundary

Use Playwright when you need:

- page navigation checks
- filter or visual behavior verification
- published report smoke tests
- accessibility and interaction checks

Use official APIs or workflow backends when you need:

- publish
- refresh
- deployment
- item creation
- semantic model administration
- subscriptions
- tenant-level operations
- permissions management

## Official Microsoft References

- Learn MCP endpoint:
  - `https://learn.microsoft.com/api/mcp`
- Power BI remote MCP endpoint:
  - `https://api.fabric.microsoft.com/v1/mcp/powerbi`
- Azure MCP consolidated local server:
  - `npx -y @azure/mcp@latest server start --mode consolidated`
- Dataverse local proxy pattern:
  - `npx -y @microsoft/dataverse mcp https://yourorg.crm.dynamics.com`
- Fabric Pro-Dev local install pattern:
  - `npm install -g fabric-pro-dev-mcp-server`

## Project Rule

Every future SNF Command Center project should start with this stack and only add non-Microsoft or unofficial MCP servers when there is a clear gap that the official stack cannot cover.

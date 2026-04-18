# Power BI MCP Enablement

This document records the required setup for the remote Power BI MCP server used by SNF Command Center projects.

## What It Is

The remote Power BI MCP server lets an MCP client query a Power BI semantic model using Power BI's MCP endpoint.

Configured endpoint:

- `https://api.fabric.microsoft.com/v1/mcp/powerbi`

## What It Is Good For

- semantic model discovery
- schema inspection
- DAX-oriented query workflows
- model-backed agent answers

## What It Is Not For

- report publishing
- refresh orchestration
- tenant administration
- deployment or ALM
- permissions administration

Use Power BI REST APIs, Fabric REST APIs, or workflow backends for those operations.

## Required Preconditions

1. Power BI admin enables the tenant setting:
   - `Users can use the Power BI Model Context Protocol server endpoint (preview)`
2. The user has build permission on at least one semantic model.
3. VS Code MCP client supports HTTP MCP servers.
4. The MCP profile contains:
   - `powerbi-remote`
5. The user signs in when the MCP client prompts for Microsoft credentials.

## Validation Steps

1. Reload VS Code after updating MCP config.
2. Open the MCP servers panel and confirm `powerbi-remote` appears.
3. Start the MCP server from VS Code if required by the client UX.
4. Use a known semantic model ID.
5. Ask a simple validation question such as:
   - `What tables are in this semantic model?`
6. Confirm the tool prompts for auth if needed.
7. Confirm the response comes from the model, not from generic chat reasoning.

## Common Failure Patterns

- `Access token is required`
  - cause: user is not authenticated yet
- MCP server not connected
  - cause: VS Code has not reloaded or the client does not support HTTP MCP
- tool appears but returns no model data
  - cause: missing build permission on the semantic model
- endpoint works but model questions fail
  - cause: semantic model is not prepared well for AI or wrong model ID is being used

## References

- Power BI MCP remote get started:
  - https://learn.microsoft.com/en-us/power-bi/developer/mcp/remote-mcp-server-get-started
- Power BI tenant settings index:
  - https://learn.microsoft.com/en-us/power-bi/admin/service-admin-portal-about-tenant-settings

# Global VS Code MCP Configuration

- `mcp.json` is the shared Microsoft-first MCP profile for this workspace.
- `mcp.manifest.json` records the intended default profile.
- This global default intentionally keeps only the servers that are part of the normal build path:
  - `pac-cli`
  - `filesystem`
  - `git`
  - `github`
  - `learn-docs`
  - `azure-mcp`
  - `powerbi-remote`
  - `playwright`
- `fetch` and `memory` were intentionally removed from the default setup because they were not part of the repeated Microsoft-first workflow.
- Use the Copilot Studio extension first for attach, get, preview, and apply.
- Use Learn MCP for docs, Playwright for UI, and official APIs or workflows for real service operations.
- For Azure MCP, authenticate with Azure first.
- For Power BI MCP, confirm tenant enablement and semantic-model access before relying on it.

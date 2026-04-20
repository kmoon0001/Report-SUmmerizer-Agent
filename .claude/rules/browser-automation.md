When using Playwright MCP for browser automation:

- Use headless mode by default (configured in .mcp.json)
- Session persists in .playwright-mcp/profile/ - reuse auth state across sessions
- For Copilot Studio web UI: use browser automation for verification and smoke testing only
- For Power Automate: use browser for flow inspection when pac CLI cannot access flow details
- Always take screenshots after key actions for verification
- Do not use browser automation as a substitute for pac CLI publish/deploy operations
- Timeout: 90s navigation, 10s actions

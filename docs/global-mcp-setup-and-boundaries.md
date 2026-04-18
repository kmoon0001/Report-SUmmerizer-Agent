# Global MCP Setup And Boundaries

This document defines the default MCP profile for `D:\my agents copilot studio`.

## Default Global Stack

- `pac-cli`
- `filesystem`
- `git`
- `github`
- `learn-docs`
- `azure-mcp`
- `powerbi-remote`
- `playwright`

## Why This Is The Default

- It matches the Microsoft-first workflow we actually use.
- It keeps the stack small enough to stay reliable.
- It avoids generic MCP servers that add little value to the normal build path.

## What Was Removed

- `fetch`
  - removed because Learn MCP now covers the main documentation and guidance path
- `memory`
  - removed because repo docs, manifests, and local instructions are the real source of reusable project memory

## Tool Boundaries

- Copilot Studio extension:
  - attach
  - get changes
  - preview changes
  - apply changes
- Learn MCP:
  - Microsoft docs
  - release notes
  - official guidance
- Azure MCP:
  - Azure resource context
  - Azure-side operations
- Power BI MCP:
  - semantic-model query workflows
- Playwright:
  - browser checks
  - UI validation
  - smoke tests

## Challenges To Expect

- Power BI MCP may require tenant-level enablement before it works.
- Azure MCP is not useful until auth is healthy.
- Copilot Studio extension cache issues can still look like source errors.
- Browser automation should not replace official APIs for publish, deploy, or admin operations.

## Rule For Future Projects

Start with this global default. Only add more MCP servers when the project has a repeated, concrete need, and document that addition in the local project `AGENT.md`.

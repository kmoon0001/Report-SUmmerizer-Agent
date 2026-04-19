# Environment Variable Setup (SimpleLTC API Secret)

Use solution-scoped environment variables for all tenant-specific or sensitive configuration.

## Required Variables
1. `SimpleLTC_ApiBaseUrl` (Text)
2. `SimpleLTC_ApiSecret` (Secret)

## Implementation Standard
- Create variables inside the same unmanaged source solution that contains the agent and flows.
- Use environment variables in flow actions instead of hardcoded values.
- Store sensitive values in Azure Key Vault-backed secret environment variables when available.
- During solution import, set environment-specific values in target environments.

## Deployment Gate
- Do not publish flows that require SimpleLTC API credentials until these variables exist in the solution and have valid target values.

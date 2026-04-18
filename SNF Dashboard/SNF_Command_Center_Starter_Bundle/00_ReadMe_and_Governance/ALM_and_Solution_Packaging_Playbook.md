# ALM And Solution Packaging Playbook

## Purpose

Define how SNF Command Center assets move through development, validation, and production with controlled change management.

## Recommended Packaging Layers

- Core solution:
  - Copilot Studio agent
  - topic and action definitions
  - connection references
  - environment variables
- Workflow solution:
  - Power Automate or equivalent workflows
  - alert routing and retry logic
  - integration connectors
- Analytics solution:
  - semantic model assets
  - dashboard definitions
  - subscriptions and security mappings
- Governance pack:
  - validation evidence
  - release notes
  - owner approvals

## Environment Variables To Externalize

- EHR and FHIR endpoints
- Datastore table names
- Fabric or KQL endpoints
- Teams or messaging targets
- file storage locations
- feature flags for predictive rules

## Release Sequence

1. Update governed docs and specs.
2. Update agent topics and actions.
3. Update workflows and environment variables.
4. Update semantic model and dashboards.
5. Run validation suite.
6. Obtain sign-offs from required owners.
7. Promote through Dev to Test to Prod.

## Rollback Rules

- Restore prior solution version if security trimming fails.
- Restore prior workflow version if escalation or retry logic breaks.
- Keep predictive features in shadow mode if clinical validation fails.


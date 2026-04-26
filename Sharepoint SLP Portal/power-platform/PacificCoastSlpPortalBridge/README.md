# Pacific Coast SLP Portal Bridge Solution

This is the local Power Platform solution project for the SharePoint SLP Portal bridge.

Target environment for current work:

```text
Therapy AI Agents Dev
Environment ID: a944fdf0-0d2e-e14d-8a73-0f5ffae23315
Environment URL: https://orgbd048f00.crm.dynamics.com/
```

## Boundary

This solution must stay non-PHI unless a later governed production phase explicitly approves otherwise.

Blocked in this phase:

- patient tracker
- resident lists
- patient-specific session notes
- patient-specific goals
- review queues tied to patient documentation
- flows that send, post, export, or persist PHI

Allowed in this phase:

- reference navigation
- source PDF metadata
- non-PHI SharePoint health checks
- static read-only clinical references
- Copilot Studio knowledge over non-PHI SharePoint content only

## Proposed Components

1. Canvas app: `SLP Portal Companion`
   - Launches the SharePoint bridge pages.
   - Provides read-only reference navigation.
   - Optionally browses non-PHI source PDF metadata.

2. Cloud flow: `SLP Portal Health Check`
   - Checks that expected SharePoint pages exist.
   - Checks homepage and navigation expectations.
   - Does not read patient content.

3. Cloud flow: `SLP Source PDF Index Refresh`
   - Reads metadata from `SLP_Portal_Source_PDFs`.
   - Writes only non-PHI metadata if an index list is approved.

4. Copilot Studio agent: `SLP Portal Reference Assistant`
   - Knowledge sources limited to non-PHI SharePoint pages and source PDFs.
   - No patient documentation tools.

## Current PAC State

PAC is installed and authenticated. Preflight:

```bat
node scripts/check-power-platform-preflight.mjs
```

Do not switch PAC profiles unless explicitly requested. Current active profile is `Therapy AI Agents Dev`.

## Deployment Guardrails

Before importing or creating solution components:

1. Confirm active PAC environment.
2. Run SharePoint bridge validation:
   ```bat
   node scripts/validate-sharepoint-native-bridge.mjs
   ```
3. Confirm DLP policy and connector scope.
4. Confirm the action-time cloud change with the user.
5. Import/create components only in the active dev environment.

## First Build Recommendation

Create the unmanaged solution container first, then add components through Maker/PAC as they are built:

```bat
pac solution import --path <solution.zip>
```

or create the solution manually in Maker using:

```text
Display name: Pacific Coast SLP Portal Bridge
Name: PacificCoastSlpPortalBridge
Publisher prefix: pcslp
```

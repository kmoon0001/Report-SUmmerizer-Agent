# Admin Access Request: Fabric + Power BI

## Request

I need access to Fabric workspace `0b0fa563-4e46-4bbe-93de-a6b4d4711fc4` to build SNF dashboard infrastructure.

Please grant me:

- `Contributor` (or `Member`) role on that workspace
- permission to create and view:
  - `Lakehouse`
  - `Eventhouse`
  - `KQL Database`
- permission path to publish Power BI from Desktop in this workspace (role/license confirmation)

## Why This Is Needed

- Current SNF dashboard pipeline is functional in no-Fabric mode.
- Fabric IDs cannot be captured because the workspace has no visible/createable Fabric items for this account.
- Power BI publish path is also blocked by permission/license constraints.

## Current Working Fallback

- HTML dashboard export and share package:
  - `data/exports/executive-command-center/current/executive-command-center.html`
  - `data/exports/executive-command-center/share/latest-share-package.txt`

## After Access Is Granted

1. Create Lakehouse, Eventhouse, and KQL Database.
2. Capture IDs into `.env`:
   - `FABRIC_LAKEHOUSE_ID`
   - `FABRIC_EVENTHOUSE_ID`
   - `FABRIC_KQL_DATABASE`
3. Run:
   - `Invoke-FabricOneTimeConnectionPrep.ps1`
   - `Invoke-PowerBiExecutivePrep.ps1`
   - `Invoke-PowerBiPublishedSmoke.ps1`

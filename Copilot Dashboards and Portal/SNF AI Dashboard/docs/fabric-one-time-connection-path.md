# Fabric One-Time Connection Path

Use this path so you only do the tenant/manual setup once, then run the project workflow repeatedly.

## Goal

- One manual permission setup pass
- One local machine sign-in pass
- Repeatable automation afterward

## Step 1: Generate readiness report

Run:

```powershell
powershell -ExecutionPolicy Bypass -File "D:\SNF AI Dashboard\scripts\Invoke-FabricOneTimeConnectionPrep.ps1"
```

Read output:

- `data/processed/fabric_one_time_connection_prep.md`

## Step 2: Complete one-time tenant/manual actions

1. Confirm workspace role is Contributor or higher.
2. Confirm Fabric and Power BI publish/admin permissions for your account.
3. Confirm Power BI/Fabric workspace exists and is accessible.
4. Try auto-recovery of IDs first:
   - `powershell -ExecutionPolicy Bypass -File "D:\SNF AI Dashboard\scripts\Get-LocalFabricMetadata.ps1"`
5. If auto-recovery misses items, open each Fabric item in browser once and copy IDs from URL:
   - Lakehouse URL shape: `/groups/<workspace-id>/lakehouses/<lakehouse-id>`
   - Eventhouse URL shape: `/groups/<workspace-id>/eventhouses/<eventhouse-id>`
   - KQL DB URL shape: `/groups/<workspace-id>/kqldatabases/<kql-database-id>`
6. Fill missing `.env` values:
   - `FABRIC_WORKSPACE_ID`
   - `FABRIC_EVENTHOUSE_ID`
   - `FABRIC_LAKEHOUSE_ID`
   - `FABRIC_KQL_DATABASE`
   - `POWERBI_TENANT_ID`
   - `POWERBI_WORKSPACE_ID`
7. Sign in once on this machine:
   - `az login`
8. Re-run readiness script:
   - `powershell -ExecutionPolicy Bypass -File "D:\SNF AI Dashboard\scripts\Invoke-FabricOneTimeConnectionPrep.ps1"`
9. Confirm status becomes `READY_FOR_PERMISSION_CONNECT`.

## Step 3: Normal repeatable workflow after setup

1. Build package and model:
   - `Invoke-PowerBiExecutivePrep.ps1`
2. Follow Desktop publish checklist:
   - `docs/powerbi-desktop-manual-publish-checklist.md`
3. Run published smoke:
   - `Invoke-PowerBiPublishedSmoke.ps1`

## Notes

- If publish is blocked, the blocker is tenant/license/role, not this repo pipeline.
- The HTML dashboard export remains the fallback operational path:
  - `data/exports/executive-command-center/current/executive-command-center.html`

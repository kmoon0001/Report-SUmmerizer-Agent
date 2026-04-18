# Fabric One-Time Connection Prep

Generated: 2026-04-06 23:42:10

## Status

- Result: NOT_READY
- Env file: D:\SNF AI Dashboard\.env
- Azure CLI installed: True
- Azure CLI signed in: True
- Fabric workspace ID: 0b0fa563-4e46-4bbe-93de-a6b4d4711fc4
- Power BI tenant ID: 03cc92c3-986c-4cf4-ae27-1478cf99d17f

## Missing Environment Values

- FABRIC_EVENTHOUSE_ID
- FABRIC_LAKEHOUSE_ID
- FABRIC_KQL_DATABASE

## One-Time Manual Actions

1. Ensure you can open the target Fabric workspace in the browser.
2. Confirm your role is `Contributor` or higher for the workspace.
3. Ask admin to grant API/app permissions required for your org policy (Fabric + Power BI publish/admin paths).
4. Fill missing `.env` Fabric/Power BI values listed above.
5. Sign in with Azure CLI once on this machine: `az login`.
6. Re-run this script and confirm status becomes `READY_FOR_PERMISSION_CONNECT`.

## After Permissions Are Granted

1. Run: `powershell -ExecutionPolicy Bypass -File "D:\SNF AI Dashboard\scripts\Invoke-PowerBiExecutivePrep.ps1"`
2. Run Desktop publish/checklist: `docs\powerbi-desktop-manual-publish-checklist.md`
3. Run published smoke test after URL exists: `Invoke-PowerBiPublishedSmoke.ps1`

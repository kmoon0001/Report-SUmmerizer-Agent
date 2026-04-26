# SPFx App Catalog Deployment Checklist

Date: 2026-04-26
Target site: `https://ensignservices.sharepoint.com/sites/PacificCoast_SLP`

## Package

Current locally rebuilt package:

```text
D:\my agents copilot studio\Sharepoint SLP Portal\spfx-shell\sharepoint\solution\spfx-shell.sppkg
```

Latest local build result:

- command: `node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" --prefix spfx-shell run build`
- result: PASS
- generated package size: `47,724` bytes
- generated package time: `2026-04-26T09:32:40.971Z`

## Permission Prerequisites

Use the Microsoft Learn SPFx deployment path:

- SharePoint Framework overview: https://learn.microsoft.com/en-us/sharepoint/dev/spfx/sharepoint-framework-overview
- Single Part App Pages: https://learn.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/single-part-app-pages
- Tenant-scoped deployment: https://learn.microsoft.com/en-us/sharepoint/dev/spfx/tenant-scoped-deployment
- Connect to SharePoint from SPFx: https://learn.microsoft.com/en-us/sharepoint/dev/spfx/connect-to-sharepoint

Required access:

- Tenant App Catalog upload rights, or
- Site Collection App Catalog enabled for `PacificCoast_SLP` with upload rights

## Deployment Steps

1. Upload `spfx-shell.sppkg` to the App Catalog.
2. Confirm the package prompt and trust/deploy the solution only if the listed permissions match the expected SPFx package scope.
3. Add the web part to a modern SharePoint page or Single Part App Page.
4. Verify the page loads under the Pacific Coast SLP site.
5. Confirm SharePoint-native reads use site-scoped content and do not reintroduce patient tracker, resident profile, session note, goal, or review-list storage.
6. Keep the SharePoint-native bridge pages available as the fallback/reference layer.

## Post-Deployment QA

Run:

```text
npm run sharepoint:bridge:qa
```

Then verify:

- the bridge homepage still resolves to `SLP-Portal.aspx`
- no PHI-era navigation links reappear
- the SPFx page loads without blank canvas or bundle errors
- source libraries/lists remain non-PHI
- interactive SPFx workflows remain session-only for patient-specific content

## Do Not Deploy If

- the app asks for unexpected Graph or tenant-wide permissions
- the package was rebuilt from an unreviewed working tree
- App Catalog upload prompts show an unexpected publisher/package identity
- patient tracker, resident profiles, durable notes, resident-linked goals, transcripts, scores, recordings, or PHI-bearing generated assets are enabled without the approved session-only/storage design

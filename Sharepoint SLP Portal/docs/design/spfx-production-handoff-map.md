# SPFx Production Handoff Map

Date: 2026-04-26
Target site: `https://ensignservices.sharepoint.com/sites/PacificCoast_SLP`

## Purpose

Define the production path from the SharePoint-native bridge to the full SLP portal experience once App Catalog or site catalog deployment is available.

The SharePoint-native bridge now contains non-PHI reference pages, generalized workflow scaffolds, source indexes, and governance hubs. The remaining high-value parity work belongs in SPFx because it needs real interactivity without durable PHI storage.

## Microsoft Learn anchors

- SPFx overview: https://learn.microsoft.com/en-us/sharepoint/dev/spfx/sharepoint-framework-overview
- Single Part App Pages: https://learn.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/single-part-app-pages
- Connect to SharePoint from SPFx: https://learn.microsoft.com/en-us/sharepoint/dev/spfx/connect-to-sharepoint
- Microsoft Graph permissions overview: https://learn.microsoft.com/en-us/graph/permissions-overview

## Production shape

Use:

- one SPFx full-page app shell
- Single Part App Page layout
- SharePoint-native APIs for SharePoint content
- site-scoped and least-privilege access wherever possible
- SharePoint lists/libraries only for non-PHI references, metadata, reviewed source files, and sanitized reusable artifacts

Do not use durable SharePoint storage for:

- patient tracker
- resident profiles
- patient-specific notes
- patient-specific goals
- patient scores and progress timelines
- resident-linked generated assets
- uploaded medical records
- PHI-bearing chat history

## Bridge-to-SPFx module mapping

### Port first

- `SLP-Note-Template-Studio.aspx`
  - SPFx target: Documentation Studio with session-only resident adaptation and sanitized copy/export
- `SLP-Goal-and-Intervention-Studio.aspx`
  - SPFx target: Goal Generator and Treatment Ideas with reusable non-PHI template persistence only
- `SLP-Handout-Therapy-Templates.aspx`
  - SPFx target: Handout Maker and Therapy Studio with session-only sensitive inputs
- `SLP-Clinical-Calculators.aspx`
  - SPFx target: in-session calculator scoring with no SharePoint result persistence
- `SLP-Clinical-Exams.aspx`
  - SPFx target: in-session oral-mech/CN exam capture and copy-out only
- `SLP-Medicare-Audit-Candidacy.aspx`
  - SPFx target: transient upload/analyze flow with no durable patient file retention

### Keep as SharePoint-native hubs

- `SLP-Knowledge-Source-Index.aspx`
- `SLP-Clinical-Library.aspx`
- `SLP-Document-Library-Guide.aspx`
- `SLP-Quality-Evidence.aspx`
- `SLP-Clinical-Safety.aspx`

### Never port as durable SharePoint storage

- patient tracker
- resident profiles
- resident-specific progress timeline
- resident-keyed note/review/goal queues
- durable PHI-bearing AI history

## Validation gates

Before deploying SPFx:

- build validation passes
- bundle/package validation passes
- no patient/session/goal/review list reads are reintroduced
- no durable PHI write path exists
- SharePoint source-library reads use SharePoint-native APIs unless Graph is specifically required
- any Graph/Entra permission request is documented and approved

After deploying SPFx:

- package deploys through approved catalog path
- Single Part App Page loads on Pacific Coast SLP site
- navigation works across all preserved modules
- source-library and source-index reads work
- session-only modules clear sensitive state on refresh/close
- no browser local storage, IndexedDB, query string, telemetry, or SharePoint list contains PHI

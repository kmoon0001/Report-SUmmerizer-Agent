# Power Platform Safe Migration Plan

Date: 2026-04-25
Target site: `https://ensignservices.sharepoint.com/sites/PacificCoast_SLP`

## Purpose

Define what can safely move from the local SLP Portal into Power Platform while preserving the current SharePoint-first, PHI-minimized architecture.

This plan does not replace the SPFx production path. It complements the SharePoint-native bridge and SPFx shell by using Power Platform for controlled non-PHI workflows, governance, validation, and optional enterprise automation.

## Authoritative Platform Inputs

- Power Platform Well-Architected:
  - https://learn.microsoft.com/en-us/power-platform/well-architected/
- Power Platform ALM with solutions:
  - https://learn.microsoft.com/en-us/power-platform/alm/overview-alm
- Power Platform DLP policies:
  - https://learn.microsoft.com/en-us/power-platform/admin/wp-data-loss-prevention
- Power Apps canvas app performance and delegation:
  - https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/app-performance-considerations
  - https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/delegation-overview
- Power Automate SharePoint connector:
  - https://learn.microsoft.com/en-us/connectors/sharepointonline/
- Power Apps checker:
  - https://learn.microsoft.com/en-us/power-apps/maker/data-platform/use-powerapps-checker

Clinical/reference boundaries remain anchored to:

- ASHA Practice Portal: https://www.asha.org/practice-portal/
- Medicare SLP services: https://www.medicare.gov/coverage/speech-language-pathology-services
- CMS documentation/medical necessity guidance:
  - https://www.cms.gov/medicare-coverage-database/view/article.aspx?articleid=52866
  - https://www.cms.gov/Regulations-and-Guidance/Guidance/Manuals/downloads/bp102c15.pdf

## Current Tooling State

PAC CLI is not currently available on PATH in this Codex runtime:

```text
pac --version -> ENOENT
```

Implication:

- We can prepare local solution design, manifests, maker instructions, and validation scripts now.
- We should not attempt solution import/export until PAC is installed and authenticated.
- Any tenant change through Power Platform requires action-time confirmation.

## Safe Migration Principles

Allowed now:

- Non-PHI Canvas app shells that open SharePoint reference pages.
- Read-only Power Apps screens over non-PHI SharePoint libraries.
- Power Automate flows that validate non-PHI page/library health.
- Copilot Studio knowledge grounding over non-PHI SharePoint knowledge/source libraries.
- Admin/maker validation flows that produce operational status, not patient data.

Blocked for this phase:

- Patient tracker.
- Resident list UX.
- Session-note capture.
- Goal drafting with patient identifiers.
- Review queue tied to patient notes.
- Any durable Power Platform table/list containing patient-specific therapy data.
- Any flow that emails, posts, or transmits PHI.

## Recommended Solution Shape

Solution display name:

```text
Pacific Coast SLP Portal Bridge
```

Publisher:

```text
Pacific Coast SLP
```

Components to create when PAC/Power Platform maker access is ready:

1. Canvas app: `SLP Portal Companion`
   - landing dashboard
   - module launcher
   - source PDF browser
   - read-only reference views
   - direct links to SharePoint pages

2. Cloud flow: `SLP Portal Health Check`
   - checks expected SharePoint pages exist
   - checks source libraries exist
   - checks no blocked navigation links are present
   - writes non-PHI status to a controlled admin-only log or returns run output only

3. Cloud flow: `SLP Source PDF Index Refresh`
   - scans `SLP_Portal_Source_PDFs`
   - extracts metadata only
   - does not read or transmit patient data
   - optional output: non-PHI index list/library view

4. Copilot Studio agent: `SLP Portal Reference Assistant`
   - knowledge source: non-PHI SharePoint pages and source PDFs only
   - no action that writes clinical notes
   - no durable conversation export
   - answer with citations/source links where possible

## Module Candidate Matrix

| Local feature/module | Power Platform candidate | Initial implementation | PHI risk | Decision |
|---|---|---|---:|---|
| Source PDF library / `PDFLibrary` | Canvas app + flow | Browse/search metadata and open PDFs | Low if PDFs are non-PHI | Build first |
| `SLPCheatSheet` / quick reference | Canvas app screen | Static reference cards | Low | Build |
| `coding-data.ts` | Canvas app screen | Static CPT/reference table with payer-warning banner | Medium if used for claims | Build read-only |
| `pathways-data.ts` | Canvas app screen | Static pathway cards; no symptom entry | Medium | Build read-only |
| `ensign-slp-data.ts` | Canvas app screen / knowledge source | Internal training/reference cards | Medium | Build after review |
| `quiz-data.ts` | Canvas app screen | Self-check learning, no tracked scores | Low | Build |
| IDDSI guide | Canvas app screen | Static IDDSI reference and links | Medium | Build read-only |
| Instrumentals guide | Canvas app screen | MBSS/FEES reference cards | Low | Build |
| Trach/vent guide | Canvas app screen | Reference and readiness orientation | Medium | Build read-only |
| Goal generator | Canvas app/flow | Template/reference only | High if patient-specific | Do not automate yet |
| Documentation Studio | Power Apps/flow/Copilot | Drafting only with session-only strategy | High | Defer |
| Therapy Studio | Canvas app | Generic activity browser only | Medium | Build only as non-PHI library |
| Patient/Profile/Review modules | Power Apps/Dataverse/SharePoint | Patient workflow | High | Blocked this phase |

## Power Platform Hardening Gates

Before any import/deployment:

- PAC CLI installed and authenticated.
- Correct environment selected.
- Solution is created as unmanaged in development only.
- DLP policy reviewed for SharePoint, Office 365 Outlook, Teams, Dataverse, HTTP/custom connectors.
- No connector path transmits patient data.
- Environment variables and connection references documented.
- Solution checker run.
- App checker run.
- Flow checker run.
- SharePoint validation script passes.

Before production use:

- Clinician/supervisor UAT.
- Accessibility review.
- Permission review.
- DLP review.
- Data retention review.
- Owner/co-owner assignment.
- Recovery/export plan.

## Immediate Next Build Order

1. Create local Power Platform solution manifest.
2. Create PAC/preflight script.
3. Create maker instructions for manual solution creation if PAC is unavailable.
4. Build Power Apps screen spec for:
   - SLP Portal Companion landing page
   - Source PDF browser
   - Quick Reference
   - Coding Reference
   - Clinical Pathways
5. Build Power Automate flow specs:
   - portal health check
   - source PDF index refresh
6. Build Copilot Studio agent spec:
   - non-PHI knowledge only
   - no patient documentation tools

# SharePoint-Native SLP Portal Bridge Plan

Date: 2026-04-25
Target site: `https://ensignservices.sharepoint.com/sites/PacificCoast_SLP`

## Purpose

Build a temporary SharePoint-native launch portal while the SPFx package waits on App Catalog or site catalog deployment rights.

This is a bridge, not the production replacement. The production path remains:

- SPFx full-page portal package: `spfx-shell/sharepoint/solution/spfx-shell.sppkg`
- SharePoint-hosted, PHI-minimized shell
- Non-PHI SharePoint libraries for knowledge/source PDFs
- Session-only state for any workflow text that could contain PHI

## Authoritative Inputs

Platform and automation sources:

- SharePoint modern pages are created, edited, saved, and published as Site Pages with web parts.
  - https://support.microsoft.com/en-us/office/create-and-use-modern-pages-on-a-sharepoint-site-b3d46deb-27a6-4b1e-87b8-df851e503dec
- SharePoint information architecture should optimize findability and user-centered navigation.
  - https://learn.microsoft.com/en-us/sharepoint/information-architecture-principles
- Playwright automation should prefer stable user-facing locators and rely on locator auto-waiting/retry behavior.
  - https://playwright.dev/docs/best-practices
  - https://playwright.dev/docs/locators

Clinical and reimbursement sources:

- ASHA Practice Portal is the primary clinical reference landing point.
  - https://www.asha.org/practice-portal/
- ASHA AAC and Aphasia pages anchor specific module references.
  - https://www.asha.org/Practice-Portal/Professional-Issues/Augmentative-and-Alternative-Communication/
  - https://www.asha.org/practice-portal/clinical-topics/aphasia/
- Medicare.gov confirms Part B coverage for medically necessary outpatient SLP services and includes cognitive/swallowing services.
  - https://www.medicare.gov/coverage/speech-language-pathology-services
- CMS billing/coding guidance requires documentation to support medical necessity and the skilled nature of treatment.
  - https://www.cms.gov/medicare-coverage-database/view/article.aspx?articleid=52866
- CMS Medicare Benefit Policy Manual Chapter 15 defines SLP services and benefit-policy context.
  - https://www.cms.gov/Regulations-and-Guidance/Guidance/Manuals/downloads/bp102c15.pdf

## Bridge Scope

Create a small set of SharePoint-native pages under `/SitePages`:

1. `SLP-Portal.aspx` - portal launch page
2. `SLP-Dysphagia.aspx`
3. `SLP-Aphasia.aspx`
4. `SLP-Cognitive-Communication.aspx`
5. `SLP-Motor-Speech.aspx`
6. `SLP-Voice.aspx`
7. `SLP-AAC.aspx`
8. `SLP-Medicare-Compliance.aspx`
9. `SLP-Documentation-Studio.aspx`

The launch page maps back to the local template registry in:

- `spfx-shell/src/webparts/slpPortal/components/clinicalTopics.ts`
- `docs/design/slp-portal-phi-minimized-matrix.md`

## Guardrails

The bridge must not introduce patient-data behavior.

Allowed:

- Non-PHI launch pages
- Links to ASHA, CMS, Medicare.gov, and existing SharePoint knowledge/source libraries
- Module descriptions copied from the local SPFx template
- Clear status labels showing what is reference-only now and what remains SPFx pending

Not allowed:

- Patient tracker
- Resident lists
- Patient identifiers
- PHI form fields
- Durable notes or generated clinical drafts
- Browser `localStorage`, IndexedDB, telemetry, or URL parameters containing workflow text
- AI/chat interaction that persists clinical content
- Claims that the SharePoint page bridge is the final production app

## Page Content Pattern

Each page should use plain SharePoint text/content web parts only:

- page title
- short purpose statement
- source-of-truth status
- local module mapping
- authoritative reference links
- PHI/safety guardrails
- SPFx pending note for interactive workflows

This keeps the bridge supportable inside SharePoint permissions and avoids unsupported custom script.

## Validation Gates

Before applying to SharePoint:

- Dry-run page manifest exists in `output/sharepoint-native-bridge/manifest.json`
- Every generated page includes a PHI guardrail block
- Every clinical/compliance page includes authoritative source links
- No generated page contains patient-facing form fields
- Existing SharePoint pages to be overwritten are listed explicitly

After applying to SharePoint:

- Confirm each page exists in Site Pages
- Confirm each page opens without edit errors
- Confirm page text renders
- Confirm no patient/PHI entry fields were created
- Record result in `docs/runlogs/sharepoint-native-bridge-20260425.md`

## Apply Policy

Creating, overwriting, or publishing SharePoint pages modifies cloud content. The automation script defaults to dry-run mode.

Run with `--apply` only after explicit user confirmation for the exact page set.

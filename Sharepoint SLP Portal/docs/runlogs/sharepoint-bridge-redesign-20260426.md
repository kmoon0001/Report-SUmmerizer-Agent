# SharePoint Bridge Redesign Run Log

Date: 2026-04-26

## Goal

Polish the SharePoint-native SLP bridge to feel closer to the local GitHub portal while staying inside the existing non-PHI SharePoint-native boundary.

## Design Sources Used

Microsoft and platform guidance:

- SharePoint information architecture principles:
  https://learn.microsoft.com/en-us/sharepoint/information-architecture-principles
- Plan an intelligent SharePoint intranet:
  https://learn.microsoft.com/en-us/sharepoint/plan-intranet
- Planning hub sites:
  https://learn.microsoft.com/en-us/sharepoint/planning-hub-sites
- SharePoint Look Book:
  https://adoption.microsoft.com/en-us/sharepoint-look-book/
- Fluent 2 Layout:
  https://fluent2.microsoft.design/layout
- Fluent 2 Nav:
  https://fluent2.microsoft.design/components/web/react/core/nav/usage
- Fluent 2 Card:
  https://fluent2.microsoft.design/components/web/react/core/card/usage
- Fluent 2 Motion:
  https://fluent2.microsoft.design/motion

Local source-of-truth UI references:

- `src/index.css`
- `src/components/layout/Layout.tsx`
- `src/components/layout/ModuleLayout.tsx`
- `src/components/Sidebar.tsx`
- `src/components/Dashboard.tsx`

## What Changed

Updated the shared SharePoint bridge renderer in `scripts/sharepoint-native-bridge.mjs` to:

- move the homepage toward a task-first clinical dashboard structure
- group module navigation by clinician intent instead of a single flat wall
- improve card hierarchy, labels, and action density
- improve reference labeling for Microsoft Learn, ASHA, CMS, Medicare.gov, and SharePoint
- tune the Pacific Coast logo sizing on the homepage
- preserve all non-PHI guardrails and validator-required language

## SharePoint Canvas Constraint Found

The richer redesign HTML was accepted in `WikiField` but SharePoint rejected the same payload when sent as one large `CanvasContent1` text web part.

Observed behavior:

- `Title`-only update: pass
- `WikiField` update: pass
- large `CanvasContent1` update: SharePoint `500` with `Cannot complete this action`

Repair path implemented:

- keep the richer detailed HTML in `WikiField`
- publish a smaller SharePoint-safe visual shell in `CanvasContent1`
- keep required visible guardrails and workflow headings in the live rendered canvas

This keeps the live SharePoint experience polished and valid without reintroducing unsafe or brittle page-edit behavior.

## Validation

Local:

- `node scripts/sharepoint-native-bridge.mjs`
- `node scripts/sharepoint-bridge-qa.mjs --offline`
- local preview screenshot spot-check

Live:

- `node scripts/validate-sharepoint-native-bridge.mjs`
- `node scripts/sharepoint-bridge-qa.mjs`
- `node scripts/sharepoint-bridge-visual-qa.mjs`

Result:

- `46` pages validated
- homepage remained `SLP-Portal.aspx`
- `46/46` homepage images loaded
- `0` failed page checks
- `0` visual QA failures across sampled desktop/mobile pages

## Second polish pass

After the first redesign landed, the homepage still read too much like a migration inventory and not enough like a deliberate corporate portal.

Second-pass changes:

- shortened the homepage by removing the duplicated homepage-wide related-pages catalog
- rebalanced the homepage hero toward copy-first corporate presentation
- kept image-led cards for core clinical modules only
- converted workflow, knowledge, and governance groups to denser enterprise-style text tiles
- reduced homepage visual noise and image count while preserving access to the same safe destinations

Second-pass validation:

- `node scripts/validate-sharepoint-native-bridge.mjs`: pass
- `node scripts/sharepoint-bridge-qa.mjs`: pass
- `node scripts/sharepoint-bridge-visual-qa.mjs`: pass

Second-pass outcome:

- homepage live image count reduced from `46` to `16`
- live homepage remains within the non-PHI bridge boundary
- desktop/mobile visual QA still passed with `0` failures

## Third polish pass and live republish

The next pass tightened the homepage again around Microsoft-style intranet patterns: shorter hero, smaller proportional Pacific Coast logo treatment, clearer launch actions, denser service-map tiles, and more deliberate clinical-resource hierarchy.

Third-pass changes:

- reduced the homepage hero height and logo footprint
- added compact task-first launch cards while preserving the validator-required `Launch actions` anchor
- kept the service section labeled `SLP service map` for deterministic QA while changing the card treatment to a flatter corporate resource-map pattern
- retained the safe SharePoint-native bridge boundary: no PHI forms, no patient tracker, no local-only clinical assertions
- republished the updated SharePoint-native pages to the Pacific Coast SLP site

Publish notes:

- first live retry hit a transient SharePoint asset-upload `503`
- second live retry completed against the existing `46` pages
- the page labels were repaired and republished after strict QA caught the renamed anchors

Validation after live republish:

- `node scripts/validate-sharepoint-native-bridge.mjs`: pass
- `node scripts/sharepoint-bridge-qa.mjs`: pass
- `node scripts/sharepoint-bridge-visual-qa.mjs`: pass

Visual QA repair:

- updated `scripts/sharepoint-bridge-visual-qa.mjs` to scroll through pages before evaluating image readiness
- this accounts for SharePoint lazy-loading lower-page images before the image gate runs
- no portal content was changed by this validator repair

Third-pass outcome:

- `46` SharePoint pages live and validated
- homepage remains `SLP-Portal.aspx`
- `16/16` homepage migration images loaded in strict DOM validation
- `0` failed page checks
- `0` visual QA failures across sampled desktop/mobile pages

## Durable Outcome

The redesigned SharePoint-native bridge is now live. The visible SharePoint page canvas uses a compact polished shell for SharePoint compatibility, while the richer generated HTML remains stored in the page record. The production path is still the PHI-minimized SPFx shell once App Catalog deployment is available.

## Post-Publish Link and Function Assessment

A link/function audit was added after reviewing whether the live bridge behaves more like the local portal and whether buttons resolve to real destinations.

Findings:

- internal SharePoint navigation/actions resolved successfully in browser-based authenticated checks
- two ASHA wellness links returned a "Sorry! That Page Cannot Be Found" page despite HTTP `200`
- the CMS Benefit Policy Manual PDF behaves as a download, not a normal page navigation
- bridge buttons are currently functional links and launch actions, not full local-app interactive tools

Local repair prepared:

- replaced the broken ASHA wellness links with stable ASHA SLP, healthcare, and health-literacy resources
- added `scripts/sharepoint-bridge-link-audit.mjs` to verify internal SharePoint links, external authoritative links, and download-style resources

Validation:

- `node scripts/sharepoint-native-bridge.mjs`: pass
- `node scripts/sharepoint-bridge-qa.mjs --offline`: pass
- `node scripts/sharepoint-bridge-link-audit.mjs`: pass
- link audit result: `46` bridge pages, `48` internal links, `15` external links, `0` failed internal links, `0` failed external links

Live note:

- the ASHA replacement link content is prepared locally and needs a confirmed live republish before it appears on SharePoint

## Functional Resource Panel Live Publish

After user approval, the bridge was extended and republished to make the live SharePoint pages more functional and closer to the local portal while staying inside the SharePoint-native, non-PHI boundary.

Implemented:

- replaced broken ASHA wellness links with stable ASHA SLP, healthcare, and health-literacy resources
- added live resource action panels to generated pages:
  - `SLP_Source_Index`
  - `SLP_Portal_Source_PDFs`
  - `SLP_ClinicalKnowledge`
  - page-specific primary authority source
- added a "works now / SPFx pending / safety model" panel to make local-vs-live behavior explicit
- added homepage and Knowledge Source Index coverage panels generated from the clinical knowledge index:
  - clinical-area coverage
  - document-type coverage
  - review-status counts remain visible on the Knowledge Source Index page
- added `scripts/sharepoint-bridge-link-audit.mjs` as a reusable link/function gate for internal SharePoint links and external authoritative resources

Safety decisions:

- did not promote all `candidate` local knowledge items directly into clinical guidance because several require clinical/source review before being treated as SLP-ready content
- kept local knowledge items surfaced as reviewable metadata and coverage counts rather than final clinical policy
- kept patient-adjacent drafting, calculators, uploads, AI chat, generated artifacts, and resident-specific workflows as SPFx/session-only pending

Live publish result:

- `46` pages updated and published with SharePoint `200` publish responses
- homepage set to `SitePages/SLP-Portal.aspx`
- existing QuickLaunch navigation retained

Validation after live publish:

- `node scripts/build-clinical-knowledge-index.mjs --sharepoint`: pass
- `node scripts/sharepoint-native-bridge.mjs`: pass
- `node scripts/sharepoint-bridge-qa.mjs --offline`: pass
- `node scripts/sharepoint-bridge-link-audit.mjs`: pass
- `node scripts/validate-sharepoint-native-bridge.mjs`: pass
- `node scripts/sharepoint-bridge-qa.mjs`: pass
- `node scripts/sharepoint-bridge-visual-qa.mjs`: pass

Validation outcome:

- `46` live SharePoint pages validated
- `49` internal SharePoint links checked with `0` failures
- `15` external authoritative links checked with `0` failures
- `16/16` homepage migration images loaded
- `0` visual QA failures across sampled desktop/mobile pages

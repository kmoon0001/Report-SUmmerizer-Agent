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

## Durable Outcome

The redesigned SharePoint-native bridge is now live. The visible SharePoint page canvas uses a compact polished shell for SharePoint compatibility, while the richer generated HTML remains stored in the page record. The production path is still the PHI-minimized SPFx shell once App Catalog deployment is available.

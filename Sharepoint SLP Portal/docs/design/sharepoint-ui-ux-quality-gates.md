# SharePoint UI/UX Quality Gates

Date: 2026-04-26

## Design Thesis

Build the SLP portal as a calm clinical operations workspace: dense enough for skilled nursing facility use, polished enough to feel enterprise-grade, and restrained enough that clinical information remains scannable.

## Authoritative Sources

Microsoft and platform:

- SharePoint information architecture principles: https://learn.microsoft.com/en-us/sharepoint/information-architecture-principles
- SharePoint planning hub sites and site navigation: https://learn.microsoft.com/en-us/sharepoint/planning-hub-sites
- Microsoft Fluent 2 design system: https://fluent2.microsoft.design/
- Fluent accessibility: https://fluent2.microsoft.design/accessibility
- Copilot Studio SharePoint knowledge sources: https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-add-sharepoint

Clinical and reimbursement:

- ASHA Practice Portal: https://www.asha.org/practice-portal/
- Medicare speech-language pathology services: https://www.medicare.gov/coverage/speech-language-pathology-services
- CMS Medicare Benefit Policy Manual, Chapter 15: https://www.cms.gov/Regulations-and-Guidance/Guidance/Manuals/downloads/bp102c15.pdf
- CMS billing/documentation article: https://www.cms.gov/medicare-coverage-database/view/article.aspx?articleid=52866

## Information Architecture Gates

- Navigation labels must match clinician tasks, not implementation names.
- High-use domains must be one click from the homepage:
  - Dysphagia
  - Aphasia
  - Cognitive-Communication
  - Medicare/Compliance
  - Documentation boundary
  - Knowledge Source Index
- Source-library and Copilot knowledge flows must have a visible review state.
- Patient/session/goal/review-list surfaces must not appear in public portal navigation.
- Every page must include related pages and authoritative references.

## Visual Design Gates

- Use a clinical operations tone: quiet, precise, high contrast, and information-dense.
- Avoid marketing-style hero pages for routine clinical modules.
- Use cards only for repeated module items, source records, or discrete actions.
- Keep card radius at 8px or less.
- Images must preserve aspect ratio with `height:auto`.
- Images should support clinical orientation, not decoration.
- Use Microsoft-aligned neutrals, restrained blue accents, and semantic status colors.
- Typography must support scanning: short headings, compact summaries, and consistent line lengths.

## Accessibility Gates

- Links and buttons must be visually distinct.
- Text contrast must remain strong over all backgrounds.
- Headings must preserve a logical order.
- Images need meaningful alt text.
- Status badges must use text plus color, not color alone.
- Layout must stay readable on narrow SharePoint/mobile viewports.

## Clinical Safety Gates

- No patient tracker.
- No durable patient identifiers.
- No note-entry forms in SharePoint-native bridge pages.
- No AI documentation drafting in static SharePoint pages.
- Goal bank and treatment ideas are template/reference content only.
- Copilot Studio knowledge sources must be reviewed non-PHI content.
- Any item flagged for PHI review remains blocked until manually cleared.

## Knowledge Source Gates

Use `scripts/build-clinical-knowledge-index.mjs --sharepoint` before promoting content.

Promotion rules:

- `candidate`: eligible for page enrichment after clinical/source review.
- `adjacent-rehab-review`: may support rehab context but needs review before SLP promotion.
- `source-metadata-only`: keep as a library item until file content is reviewed.
- `hold`: do not publish or ground Copilot on this item.

## Verification Gates

Before SharePoint publish:

- run the clinical index
- generate bridge dry-run pages
- inspect the affected HTML previews
- run the SharePoint validator after publish
- confirm images render proportionally
- confirm blocked PHI-era navigation remains absent
- update the run log

## Durable Summary

The portal can be built out aggressively, but only along the non-PHI reference path. Rich clinical reference pages, source indexing, document-library browsing, and Copilot knowledge grounding are in scope. Patient-specific workflow persistence is out of scope until the SPFx/session-only architecture is deployed and validated.

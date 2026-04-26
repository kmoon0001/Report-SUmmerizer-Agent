# SharePoint SLP Portal Progress

Last updated: 2026-04-25

## Current Direction

This project is being rebuilt as a SharePoint-first SLP portal that preserves as many SLP Portal features as possible while enforcing a PHI-minimized operating model.

Core rules in force:
- Primary surface is SharePoint portal only
- No patient tracker
- PHI is session-only when unavoidable
- Durable storage should contain sanitized or non-PHI content only
- Preserve the feel, function, features, and information of the original SLP Portal where possible
- Replace Gemini/Google Cloud production dependencies with Microsoft enterprise Copilot-aligned architecture

## Production Path

The active implementation path is:
- SharePoint Framework (SPFx) shell first
- Single full-page app experience
- SharePoint-native access and storage first
- Microsoft Graph only when SharePoint-native paths are insufficient
- Sensitive content kept out of durable storage whenever possible
- Microsoft enterprise Copilot path for AI instead of direct Gemini production dependency

Microsoft Learn and official Microsoft guidance used for this path:
- SPFx overview: https://learn.microsoft.com/en-us/sharepoint/dev/spfx/sharepoint-framework-overview
- Single Part App Pages: https://learn.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/single-part-app-pages
- Connect to SharePoint: https://learn.microsoft.com/en-us/sharepoint/dev/spfx/connect-to-sharepoint
- Highly regulated data guidance PDF: https://learn.microsoft.com/en-us/microsoft-365/media/teams-sharepoint-online-sites-highly-regulated-data/sharepointsiteshighlyregulateddata.pdf
- Microsoft 365 Copilot extensibility overview: https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/overview
- Agents overview for Microsoft 365 Copilot: https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/agents-overview
- Microsoft 365 Copilot APIs overview: https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/copilot-apis-overview
- Microsoft 365 Copilot Chat API overview: https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/api/ai-services/chat/overview

## Completed Work

### 00. SharePoint-Native Bridge Plan

A temporary SharePoint-native bridge has been planned and generated locally while SPFx deployment is blocked by App Catalog permissions.

Completed outcomes:
- added bridge plan grounded in SharePoint modern pages, SharePoint information architecture, Playwright automation guidance, ASHA, Medicare.gov, and CMS sources
- created dry-run automation for 9 non-PHI SharePoint page previews
- generated local previews under `output/sharepoint-native-bridge/`
- validated that generated pages include PHI guardrails, authoritative links, no form fields, and SPFx-pending status
- kept production path unchanged: deploy the PHI-minimized SPFx package when App Catalog or site catalog access is available

Follow-up SharePoint polish completed:
- set `SLP-Portal.aspx` as the site homepage
- added Quick Launch links for the main portal and key modules
- enriched the SharePoint-native bridge pages with a portal map, related-page links, daily-use workflow, and clearer production/bridge/clinical-boundary labels
- removed only PHI-era navigation links from the `Recent` node; no lists or list data were deleted
- added safe read-only bridge pages for IDDSI, instrumentals, trach/vent, anatomy/neuro, goal bank, treatment ideas, and quick reference
- added live hardening validation script for the SharePoint-native bridge

Key files:
- [docs/design/sharepoint-native-bridge-plan.md](</d:/my agents copilot studio/Sharepoint SLP Portal/docs/design/sharepoint-native-bridge-plan.md:1>)
- [scripts/sharepoint-native-bridge.mjs](</d:/my agents copilot studio/Sharepoint SLP Portal/scripts/sharepoint-native-bridge.mjs:1>)
- [docs/runlogs/sharepoint-native-bridge-20260425.md](</d:/my agents copilot studio/Sharepoint SLP Portal/docs/runlogs/sharepoint-native-bridge-20260425.md:1>)

### 0. SPFx Production Shell PHI-Minimized Repair

The SPFx shell was repaired to align with the production SharePoint boundary before deployment.

Completed outcomes:
- removed `SLP_Patients`, `SLP_SessionNotes`, `SLP_Goals`, and `SLP_ReviewQueue` reads from the SPFx shell
- removed review/session-note writeback from the SPFx shell
- kept durable SharePoint reads limited to non-PHI libraries:
  - `SLP_ClinicalKnowledge`
  - `SLP_Portal_Source_PDFs`
- routed SharePoint reads through SPFx `SPHttpClient`
- preserved clinical topic and workflow modules as session-only React surfaces
- added full-page navigation for preserved modules
- updated SPFx package metadata and README away from AI Studio/Gemini scaffold language

Key files:
- [spfx-shell/src/webparts/slpPortal/components/SlpPortal.tsx](</d:/my agents copilot studio/Sharepoint SLP Portal/spfx-shell/src/webparts/slpPortal/components/SlpPortal.tsx:1>)
- [spfx-shell/src/webparts/slpPortal/components/SlpPortal.module.scss](</d:/my agents copilot studio/Sharepoint SLP Portal/spfx-shell/src/webparts/slpPortal/components/SlpPortal.module.scss:1>)
- [spfx-shell/config/package-solution.json](</d:/my agents copilot studio/Sharepoint SLP Portal/spfx-shell/config/package-solution.json:1>)
- [README.md](</d:/my agents copilot studio/Sharepoint SLP Portal/README.md:1>)

### 1. Shell Refactor

The SharePoint portal shell has been reworked to preserve the top-priority feature areas while removing patient-era routing and navigation assumptions.

Completed outcomes:
- Registry-backed shell/navigation introduced
- Dashboard rebuilt around preserved SLP features
- Blocked PHI-heavy routes guarded in the router
- Lazy loading added for large shell surfaces
- Top-level experience now centers:
  - clinical topic cards
  - clinical tools
  - SLP Corner
  - studios
  - labs

Key files:
- [src/shell/category-registry.ts](</d:/my agents copilot studio/Sharepoint SLP Portal/src/shell/category-registry.ts:69>)
- [src/shell/shell-config.ts](</d:/my agents copilot studio/Sharepoint SLP Portal/src/shell/shell-config.ts:32>)
- [src/context/DashboardContext.tsx](</d:/my agents copilot studio/Sharepoint SLP Portal/src/context/DashboardContext.tsx:26>)
- [src/components/layout/Layout.tsx](</d:/my agents copilot studio/Sharepoint SLP Portal/src/components/layout/Layout.tsx:14>)
- [src/components/Sidebar.tsx](</d:/my agents copilot studio/Sharepoint SLP Portal/src/components/Sidebar.tsx:36>)
- [src/components/CommandPalette.tsx](</d:/my agents copilot studio/Sharepoint SLP Portal/src/components/CommandPalette.tsx:30>)
- [src/components/Dashboard.tsx](</d:/my agents copilot studio/Sharepoint SLP Portal/src/components/Dashboard.tsx:127>)
- [src/components/router/ViewManager.tsx](</d:/my agents copilot studio/Sharepoint SLP Portal/src/components/router/ViewManager.tsx:155>)

### 2. Documentation Studio PHI Boundary

`DocumentationStudio` was refactored to preserve the drafting/compliance workflow without persisting patient-linked content.

Completed outcomes:
- patient selection removed
- patient-linked note save removed
- session-only PHI boundary added
- sanitized copy/export added
- phrase bank blocks PHI-bearing reusable content
- export labels changed to generic draft/session language

Key files:
- [src/components/DocumentationStudio.tsx](</d:/my agents copilot studio/Sharepoint SLP Portal/src/components/DocumentationStudio.tsx:19>)
- [src/utils/sanitizer.ts](</d:/my agents copilot studio/Sharepoint SLP Portal/src/utils/sanitizer.ts:1>)
- [src/utils/pdf-generator.ts](</d:/my agents copilot studio/Sharepoint SLP Portal/src/utils/pdf-generator.ts:47>)

### 3. Handout Studio PHI Boundary

`HandoutMaker` was refactored to preserve the handout-generation workflow while keeping sensitive input session-only and durable output sanitized.

Completed outcomes:
- session boundary added to the configuration panel
- PHI detection added for active handout sessions
- reader preview uses sanitized content when needed
- save-to-library stores sanitized handouts when PHI is present
- export path produces sanitized PDF output when PHI is present
- patient-specific labeling removed from handout header/footer
- generated asset auto-save is skipped for sensitive sessions
- persistence layer sanitizes saved handouts on write and on read/migration

Key files:
- [src/components/HandoutMaker.tsx](</d:/my agents copilot studio/Sharepoint SLP Portal/src/components/HandoutMaker.tsx:38>)
- [src/services/persistence-service.ts](</d:/my agents copilot studio/Sharepoint SLP Portal/src/services/persistence-service.ts:55>)

### 4. Enterprise Copilot Direction Added

The project direction changed: Gemini is no longer the intended production AI provider for this portal.

Completed outcomes:
- local runbook updated to make Microsoft enterprise Copilot the intended AI direction
- migration planning is now part of the source of truth
- future feature work should reduce Gemini coupling rather than deepen it

Key files:
- [AGENT.md](</d:/my agents copilot studio/Sharepoint SLP Portal/AGENT.md:1>)
- [docs/design/copilot-replacement-plan.md](</d:/my agents copilot studio/Sharepoint SLP Portal/docs/design/copilot-replacement-plan.md:1>)

### 5. Therapy Studio PHI Boundary

`TherapyStudio` now follows the same session-only PHI pattern used in Documentation Studio and Handout Studio.

Completed outcomes:
- sensitive-session detection added across builder and play state
- visible session-boundary banner added to the shell
- PHI detection moved to a deferred path to keep typing responsive
- asset auto-save is automatically disabled when identifiers are present
- prompts, roleplay history, generated game content, and saved items are sanitized before generation or persistence

Key files:
- [src/components/TherapyStudio.tsx](</d:/my agents copilot studio/Sharepoint SLP Portal/src/components/TherapyStudio.tsx:1>)

### 7. Remaining Structured-Text Provider Migration (Chunk 7)

The last 5 structured-text functions in `ai-service.ts` were migrated off the legacy Gemini path to `executeWithEnterpriseFallback`:

- `generateClinicalDocumentation` — the largest function; full clinical system prompt preserved verbatim, now routed to Copilot
- `generateDifferentialDiagnosis`
- `generateTreatmentPlan`
- `generateCaseStudy`
- `evaluateCaseStudyResponse`

Key files:
- [src/services/ai-service.ts](</d:/my agents copilot studio/Sharepoint SLP Portal/src/services/ai-service.ts:1>)

### 8. Media / Multimodal Explicit Decisions (Chunk 8)

All 5 media/multimodal functions were given explicit production decisions per Microsoft Learn (Chat API is text-only):

- `generateProImage` — Gemini path removed; Pollinations.ai fallback retained (non-PHI, no enterprise conflict)
- `generateVeoVideo` — de-scoped to null; no enterprise-approved video path
- `analyzeClinicalImage` — routed to Copilot text-description path; clear advisory returned when image not forwarded
- `generateTTS` — de-scoped to null; components use browser Web Speech API
- `analyzeDocument` — routed to Copilot text path; components must extract text client-side for binary docs

Legacy dead code stub and unused `Type`/`Modality` imports from `@google/genai` removed.

Key files:
- [src/services/ai-service.ts](</d:/my agents copilot studio/Sharepoint SLP Portal/src/services/ai-service.ts:1>)
- [docs/design/copilot-replacement-plan.md](</d:/my agents copilot studio/Sharepoint SLP Portal/docs/design/copilot-replacement-plan.md:1>)

The central AI service now routes more of the preserved portal through a Microsoft enterprise Copilot-aligned text path instead of the Gemini-first path.

Completed outcomes:
- enterprise fallback now respects the `microsoftCopilot` flag correctly
- generic text generation and assistant streaming moved to Copilot-first behavior
- SMART goals, quality analysis, therapy game generation, document chat, document summary, AAC board generation, clinical exam analysis, and deep clinical analysis now use the enterprise text path first
- user-facing AI settings/help text now reflects Microsoft Copilot as the production text provider
- provider-specific naming was reduced in the consultant wrapper

Key files:
- [src/services/ai-service.ts](</d:/my agents copilot studio/Sharepoint SLP Portal/src/services/ai-service.ts:1>)
- [src/context/AIContext.tsx](</d:/my agents copilot studio/Sharepoint SLP Portal/src/context/AIContext.tsx:1>)
- [src/components/SettingsModal.tsx](</d:/my agents copilot studio/Sharepoint SLP Portal/src/components/SettingsModal.tsx:1>)
- [src/components/HelpSupport.tsx](</d:/my agents copilot studio/Sharepoint SLP Portal/src/components/HelpSupport.tsx:1>)
- [src/services/gemini-consultant.ts](</d:/my agents copilot studio/Sharepoint SLP Portal/src/services/gemini-consultant.ts:1>)

## PHI-Minimized Rules Now Implemented

Implemented in code:
- blocked patient tracker routes in shell
- session-only PHI boundary in Documentation Studio
- sanitized copy/export in Documentation Studio
- session-only sensitive workflow in Handout Studio
- sanitized library persistence in Handout Studio
- sanitizer utility for common identifiers

Not yet fully propagated to all sensitive modules:
- AI/chat surfaces that may retain session content
- any upload/analyze modules that may produce durable artifacts
- Tier 2 PHI-boundary audit still needed for: `GoalGenerator`, `MedicareDocChecker`, `AIAssistant`, `DocumentationAssistant`, `CaseBrainstorm`, `ThreeWayEval`, `ClinicalExams`

## Validation Status

Deterministic validation completed:
- `npm --prefix spfx-shell run build` passed after SPFx shell PHI-minimized repair and produced `spfx-shell/sharepoint/solution/spfx-shell.sppkg`
- `npm run build` passed after shell work
- `npm run build` passed after Documentation Studio refactor
- `npm run build` passed after Handout Studio refactor
- `npm run build` passed after Therapy Studio PHI boundary work
- `npm run build` passed after the broader Copilot-first text workflow migration
- `npm run build` passed after Chunk 7: remaining 5 structured-text functions migrated to Copilot
- `npm run build` passed after Chunk 8: all media/multimodal functions de-scoped or re-routed; dead code and unused SDK imports removed

Current remaining technical risk:
- build still reports oversized chunks in several areas (pre-existing, not introduced by these changes)
- Tier 2 component PHI boundary audit not yet complete
- `GoalGenerator`, `MedicareDocChecker`, `AIAssistant`, `DocumentationAssistant`, `CaseBrainstorm`, `ThreeWayEval`, `ClinicalExams` still need session-boundary verification

## Recommended Next Chunk

Next highest-value chunk:
- Chunk 9: PHI boundary audit for remaining Tier 2 components:
  - `GoalGenerator.tsx` — verify no durable PHI in saved goals
  - `MedicareDocChecker.tsx` — verify note input is session-only
  - `AIAssistant.tsx` — verify chat history is not durably stored with PHI
  - `DocumentationAssistant.tsx` — verify drafts are session-only
  - `CaseBrainstorm.tsx` — verify brainstorm content is not durably patient-linked
  - `ThreeWayEval.tsx` — verify eval results are session-only
  - `ClinicalExams.tsx` — verify exam data handling

Why:
- All AI provider work is now complete in `ai-service.ts`
- The remaining risk is in components that may persist session content without going through the shared PHI boundary

## Resume Notes

When work resumes:
1. Stay only in `Sharepoint SLP Portal`
2. Keep SharePoint/SPFx as the production path
3. Prefer SharePoint-native data/storage before Graph
4. Preserve modules first, cut only what violates the PHI rules
5. Apply the existing session-boundary pattern from:
   - Documentation Studio
   - Handout Studio
   - Therapy Studio
6. Reduce remaining legacy cloud coupling before adding new AI-dependent module work
7. Use deterministic validation after each major chunk

## Related Design Docs

- [docs/design/slp-portal-phi-minimized-matrix.md](</d:/my agents copilot studio/Sharepoint SLP Portal/docs/design/slp-portal-phi-minimized-matrix.md:1>)
- [docs/design/phi-minimized-implementation-plan.md](</d:/my agents copilot studio/Sharepoint SLP Portal/docs/design/phi-minimized-implementation-plan.md:1>)
- [docs/design/copilot-replacement-plan.md](</d:/my agents copilot studio/Sharepoint SLP Portal/docs/design/copilot-replacement-plan.md:1>)

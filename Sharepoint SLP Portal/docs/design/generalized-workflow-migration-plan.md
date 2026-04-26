# Generalized Workflow Migration Plan

Date: 2026-04-26
Target site: `https://ensignservices.sharepoint.com/sites/PacificCoast_SLP`

## Purpose

Push the remaining omitted-by-design local SLP portal workflows as close to production parity as possible without turning SharePoint into a durable PHI system.

This plan follows the current portal boundary:

- SharePoint-first portal
- SPFx is the production path
- SharePoint-native bridge may contain read-only and copy-ready non-PHI workflow surfaces
- Patient-specific work belongs in the approved clinical record system

## Authoritative platform guidance

- SPFx overview: https://learn.microsoft.com/en-us/sharepoint/dev/spfx/sharepoint-framework-overview
- Single Part App Pages: https://learn.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/single-part-app-pages
- Connect to SharePoint from SPFx: https://learn.microsoft.com/en-us/sharepoint/dev/spfx/connect-to-sharepoint
- SharePoint information architecture principles: https://learn.microsoft.com/en-us/sharepoint/information-architecture-principles
- Create and use modern pages: https://support.microsoft.com/en-us/office/create-and-use-modern-pages-on-a-sharepoint-site-b3d46deb-27a6-4b1e-87b8-df851e503dec
- Highly regulated SharePoint sites guidance PDF: https://learn.microsoft.com/en-us/microsoft-365/media/teams-sharepoint-online-sites-highly-regulated-data/sharepointsiteshighlyregulateddata.pdf

Clinical/payment anchors used for generalized template logic:

- ASHA Practice Portal: https://www.asha.org/practice-portal/
- Medicare SLP services: https://www.medicare.gov/coverage/speech-language-pathology-services
- CMS Medicare Benefit Policy Manual, Chapter 15: https://www.cms.gov/Regulations-and-Guidance/Guidance/Manuals/downloads/bp102c15.pdf
- CMS billing/documentation article: https://www.cms.gov/medicare-coverage-database/view/article.aspx?articleid=52866

## Strategy

Convert patient-bound workflows into one of three modes:

1. `generalize and migrate now`
   - keep the structure, reasoning flow, and output shape
   - remove identifiers and resident-linked persistence
   - provide copy-ready templates, playbooks, and reusable shells

2. `session-only later`
   - preserve high-value interactivity
   - keep PHI, uploads, free text, transcripts, and raw patient content out of durable SharePoint storage
   - deliver later in the SPFx full-page app

3. `never persist in SharePoint`
   - workflows that would re-create a patient tracker, patient history store, or durable PHI-bearing app surface

## Module classification

### Generalize and migrate now

- `DocumentationStudio.tsx`
  - generalized daily note, progress note, recertification, discharge, and evaluation shells
- `DocumentationAssistant.tsx`
  - generalized drafting frameworks and skilled-language banks
- `ThreeWayEval.tsx`
  - generalized evaluation-summary framing and recommendation structures
- `GoalGenerator.tsx`
  - generalized SMART-goal and maintenance-language shells
- `HandoutMaker.tsx`
  - generalized handout and caregiver-education templates
- `TherapyStudio.tsx`
  - reusable task shells, cueing hierarchies, and session-plan scaffolds
- `AIAssistant.tsx`
  - generalized question-framing and evidence-check playbooks
- `CaseBrainstorm.tsx`
  - de-identified case-conference and simulation prompt structures
- `ClinicalExams.tsx`
  - exam-framework orientation and generic report shells
- `MedicareDocChecker.tsx`
  - generalized audit checklist and candidacy framing without file upload or patient history persistence
- `AssetGallery.tsx`
  - only as admin-curated visual aid references, not user-generated resident-linked asset storage

### Session-only later in SPFx

- free-text note drafting with resident-specific content
- evaluation-entry forms
- patient-history paste or upload analysis
- PDF upload audit flows
- role-play transcripts
- microphone input
- AI chat sessions that include resident details
- generated handout/image/audio/video assets from user prompts
- exact performance tracking inside therapy or exam tools

### Never persist in SharePoint

- `PatientProfiles.tsx`
- `PatientProfileBuilder.tsx`
- `ProgressTracker.tsx`
- any patient registry
- any resident-keyed note store
- any resident-keyed goal store
- any resident-keyed review queue
- durable chat history containing PHI
- durable upload retention for patient clinical records in the bridge surface

## SharePoint-native bridge implementation target

Use the bridge for:

- generalized workflow pages
- copy-ready template language
- reference cards
- policy anchors
- curated visual aids
- navigation to safe knowledge surfaces

Do not use the bridge for:

- forms
- uploads
- patient-specific save flows
- durable draft storage
- analytics keyed to people

## Expected similarity gain

With the generalized workflow pass complete:

- safe SharePoint-native scope should remain at `100%`
- local-portal functional similarity should move from roughly `55-65%` toward `70-80%`
- later SPFx deployment should be able to move similarity toward `80-90%`

The remaining gap after that is intentional and tied to PHI persistence, not missing effort.

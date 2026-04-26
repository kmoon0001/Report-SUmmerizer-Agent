# Clinical Knowledge Bridge Plan

Date: 2026-04-26
Target site: `https://ensignservices.sharepoint.com/sites/PacificCoast_SLP`

## Purpose

Bridge as much of the local SLP portal as possible into SharePoint without creating a patient tracker, note system, or durable PHI store.

The bridge uses SharePoint pages and libraries for reviewed clinical reference content. Patient-specific work remains in approved clinical systems or future SPFx session-only workflows.

## Authoritative Platform Inputs

- SharePoint information architecture principles: https://learn.microsoft.com/en-us/sharepoint/information-architecture-principles
- Copilot Studio SharePoint knowledge sources: https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-add-sharepoint
- Copilot Studio generative answers and knowledge: https://learn.microsoft.com/en-us/microsoft-copilot-studio/nlu-generative-answers
- SharePoint document library metadata/content types: https://learn.microsoft.com/en-us/sharepoint/dev/schema/content-types

Clinical and payment anchors:

- ASHA Practice Portal: https://www.asha.org/practice-portal/
- Medicare SLP services: https://www.medicare.gov/coverage/speech-language-pathology-services
- CMS Medicare Benefit Policy Manual, Chapter 15: https://www.cms.gov/Regulations-and-Guidance/Guidance/Manuals/downloads/bp102c15.pdf
- CMS billing/documentation article: https://www.cms.gov/medicare-coverage-database/view/article.aspx?articleid=52866

## What Can Be Bridged Now

- SLP clinical reference pages.
- Clinical pathway summaries.
- Medicare, CMS, coding, and documentation reference pages.
- Goal bank as template/reference content only.
- Treatment ideas as generic activity libraries only.
- Staff learning and quiz-style reference content with no tracked scores.
- Source PDF/document library browser and metadata index.
- Copilot Studio reference grounding over reviewed non-PHI pages and source files.

## What Stays Blocked

- Patient tracker.
- Resident profiles.
- Session note capture.
- Patient-specific goal generation.
- Review queues tied to patient documentation.
- Durable AI-generated clinical notes.
- Any SharePoint/Power Platform table that stores patient identifiers or patient-specific therapy data.

## Indexing Model

Script:

```text
node scripts/build-clinical-knowledge-index.mjs --sharepoint
```

Outputs:

```text
output/sharepoint-native-bridge/clinical-knowledge-index-preview.json
output/sharepoint-native-bridge/clinical-knowledge-index-preview.md
```

The index classifies items by:

- source kind
- title
- path or SharePoint URL
- clinical area
- discipline
- document type
- audience
- PHI pattern status
- review status

Review statuses:

- `candidate`: local SLP or cross-discipline item with no PHI pattern match.
- `adjacent-rehab-review`: PT/OT material that may support rehab context but should not be promoted as SLP content without review.
- `source-metadata-only`: SharePoint library item metadata only; file contents are not promoted until reviewed.
- `hold`: PHI-sensitive pattern or other reason to stop promotion.

## Recommended SharePoint Content Structure

Create or maintain these non-PHI surfaces:

- `SLP-Knowledge-Source-Index.aspx`: source index, promotion workflow, and safety guardrails.
- `SLP-Document-Library-Guide.aspx`: document-library use, source ownership, and upload boundaries.
- `SLP_Source_Index` list: optional future list for reviewed metadata only.
- `SLP_Portal_Source_PDFs`: source files, PDFs, markdown, and supporting documents.
- `SLP_ClinicalKnowledge`: curated knowledge files after review.

Recommended list fields for a future `SLP_Source_Index`:

- `Title`
- `SourceUrl`
- `FileName`
- `ClinicalArea`
- `Discipline`
- `DocumentType`
- `Audience`
- `ReviewStatus`
- `PHIReviewed`
- `LastIndexed`
- `Notes`

## Copilot Studio Readiness

Use only reviewed non-PHI content as knowledge sources:

- reviewed SharePoint site pages
- reviewed source documents from `SLP_Portal_Source_PDFs`
- reviewed curated files from `SLP_ClinicalKnowledge`
- approved public references such as ASHA, CMS, and Medicare pages

Copilot instructions should require:

- cite source links when possible
- answer as clinical reference support, not final clinical judgment
- refuse patient-identifying examples or requests to draft durable notes with PHI
- direct patient-specific documentation to approved clinical systems

## Next Build Steps

1. Generate the local and SharePoint metadata index.
2. Review `hold` and `adjacent-rehab-review` items.
3. Promote candidate SLP content into the SharePoint-native bridge pages.
4. Add a SharePoint metadata list only after explicit approval.
5. Configure Copilot Studio knowledge sources only after the source set is reviewed.

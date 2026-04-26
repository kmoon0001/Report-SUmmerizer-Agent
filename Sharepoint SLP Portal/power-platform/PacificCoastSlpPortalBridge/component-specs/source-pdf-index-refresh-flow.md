# Cloud Flow Spec: SLP Source PDF Index Refresh

## Purpose

Create or refresh non-PHI metadata for the `SLP_Portal_Source_PDFs` library so the portal can provide better browsing and filtering.

## Trigger

Manual trigger first. Scheduled trigger only after review.

## Connectors

- SharePoint only.

## Input Library

```text
SLP_Portal_Source_PDFs
```

## Metadata Fields

Use existing fields where possible. Optional future index fields:

- Title
- File name
- Clinical area
- Document type
- Source/origin
- Last modified
- Link

## Guardrails

- Do not inspect patient-specific document content.
- Do not extract clinical facts from PDFs in this flow.
- Do not transmit files to external services.
- Do not write PHI-bearing metadata.

## First Implementation

Build a metadata-only index from SharePoint file properties and controlled tags.

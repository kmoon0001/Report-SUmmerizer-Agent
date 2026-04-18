# CreateClinicalDocument

## Purpose

StarterTemplate a structured clinical or operational document using approved templates and current source data.

## Trigger

- assistant request after confirmation
- dashboard remediation queue

## Primary Owner

- Documentation_Owner

## Escalation Owner

- Clinical_Sponsor

## Inputs

- document type
- patient or unit context
- timeframe
- source references
- structured payload

## Outputs

- StarterTemplate file
- reviewer assignment
- completion target

## Logic

1. Select the correct template.
2. Pull supporting structured data.
3. Populate required sections.
4. Mark missing content instead of inventing it.
5. Route for human review and completion.

## Validation

- template rules are followed
- source references are current
- unresolved conflicts are flagged


# Power BI Executive Authoring Kit

This folder accelerates the Power BI Desktop or PBIP build from the packaged SNF executive source tables.

Included:

- executive-theme.json
- executive-measures.dax
- executive-command-center-measures.csv
- executive-command-center-relationships.csv
- executive-page-layout.json
- executive-command-center-report-spec.md
- snf-gold-standard-theme.json
- snf-gold-standard-page-layout.json
- snf-gold-standard-visual-spec.md
- snf-gold-standard-copilot-prompts.md
- snf-gold-standard-polish-checklist.md

Recommended use:

1. Import the model tables from ..\model-tables.
2. Apply relationships from executive-command-center-relationships.csv.
3. Create measures from executive-measures.dax.
4. Apply executive-theme.json.
5. Build the overview, unit operations, and resident follow-up pages using executive-page-layout.json.

Gold standard UX path:

1. Apply snf-gold-standard-theme.json.
2. Build the four core pages from snf-gold-standard-page-layout.json.
3. Use prompts from snf-gold-standard-copilot-prompts.md.
4. Validate with snf-gold-standard-visual-spec.md and snf-gold-standard-polish-checklist.md.

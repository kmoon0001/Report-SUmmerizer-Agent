# SNF Gold Standard Compliance Report

Generated: 2026-04-07 01:56 (America/Los_Angeles)

## Pipeline Status

- PASS: Copilot Studio extension-first sync + PAC publish/status/list
- PASS: Full QA sweep completed
- PASS: Gold-standard authoring kit files now persist after `Invoke-PowerBiExecutivePrep.ps1`
- BLOCKED: Non-interactive Power BI published smoke (missing `POWERBI_CLIENT_ID` and `POWERBI_CLIENT_SECRET`)
- BLOCKED: Groundedness evaluation gate (missing `AZURE_OPENAI_ENDPOINT`, `AZURE_OPENAI_API_KEY`, `AZURE_OPENAI_DEPLOYMENT`)

## Gold-Standard Assets

- PASS: `snf-gold-standard-theme.json`
- PASS: `snf-gold-standard-page-layout.json`
- PASS: `snf-gold-standard-visual-spec.md`
- PASS: `snf-gold-standard-copilot-prompts.md`
- PASS: `snf-gold-standard-polish-checklist.md`
- PASS: `authoring-kit-manifest.json` includes all gold-standard files

## Page-By-Page Build Readiness

- `01 Command Center`: PARTIAL (layout + prompt spec present, visual implementation in PBIX not auto-verified)
- `02 Resident 360`: PARTIAL (layout + prompt spec present, visual implementation in PBIX not auto-verified)
- `03 Operations`: PARTIAL (layout + prompt spec present, visual implementation in PBIX not auto-verified)
- `04 Executive`: PARTIAL (layout + prompt spec present, visual implementation in PBIX not auto-verified)

## Checklist Compliance

- Visual grid alignment: PARTIAL (requires manual PBIX visual inspection)
- Consistent KPI card sizing: PARTIAL (requires manual PBIX visual inspection)
- Green/amber/red risk semantics: PARTIAL (requires manual PBIX visual inspection)
- Decision-oriented short titles: PARTIAL (requires manual PBIX visual inspection)
- Action columns in tables: PARTIAL (requires manual PBIX visual inspection)
- Role-appropriate content density by page: PARTIAL (requires manual PBIX visual inspection)

## Critical Reviewer Notes

- The previous blocker (gold files being deleted during prep) is fixed by updating `scripts/New-PowerBiExecutiveAuthoringKit.ps1` so those assets are generated every run.
- Technical quality gates are strong and mostly green; the remaining blockers are credential gates, not implementation defects.
- UI "gold standard" conformance cannot be honestly marked PASS until you open PBIX and apply the layout/theme/prompts, then run a visual review pass against the checklist.

## Evidence Files

- `data/processed/copilot_sync_fallback_report.md`
- `data/processed/snf_qa_sweep_report.md`
- `integrations/powerbi/source-package/current/authoring-kit/snf-gold-standard-polish-checklist.md`

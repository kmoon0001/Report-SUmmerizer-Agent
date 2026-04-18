# SNF Command Center Clinical Governance Framework

## Purpose

Define how workflow, dashboard, and assistant changes are approved, tested, released, and monitored.

## Governance Roles

- Clinical sponsor: approves clinical logic, pathway alignment, and escalation content.
- Nursing leader: approves nursing workflows, alert thresholds, and operational fit.
- Therapy leader: approves therapy scoring, productivity, and discharge logic.
- Pharmacist or medication-safety owner: approves med review logic and stewardship content.
- Infection prevention owner: approves surveillance and outbreak workflows.
- Compliance and privacy owner: approves privacy, disclosure, retention, and regulatory fit.
- Data and BI owner: approves semantic model, RLS, dashboard layout, and measure definitions.
- Engineering owner: approves implementation, observability, CI/CD, rollback, and defect remediation.

## Change Control

1. Define the clinical or operational change request.
2. Document the impacted workflows, dashboards, knowledge, and data model entities.
3. Review measure definitions, thresholds, and evidence basis.
4. Test in non-production with masked or de-identified data.
5. Obtain named approval from the relevant clinical and compliance owners.
6. Release through controlled CI/CD with rollback capability.
7. Monitor post-release quality, latency, alert volume, and false-positive patterns.

## Testing Gates

- Unit and rule testing for calculations, thresholds, and data-quality checks.
- Workflow testing for successful, failed, and ambiguous scenarios.
- Dashboard testing for security trimming, performance, and drillthrough accuracy.
- Clinical review for recommendations, wording, and escalation paths.
- Privacy review for PHI exposure and export behavior.
- Synthetic monitoring for critical alerts and refresh health.

## Update Cadence

- Immediate review for any patient-safety or regulatory defect.
- Monthly review for alert quality, documentation completeness, and workflow drift.
- Quarterly review for measure definitions, benchmark logic, and model relevance.
- Annual review for policy, consent, retention, and state-regulatory alignment.

## Release Decision Rules

- No release if a workflow can silently misroute high-risk cases.
- No release if dynamic security fails least-privilege expectations.
- No release if data freshness or provenance is unclear for critical tiles.
- No release if a clinical owner has not approved patient-facing or patient-specific logic.

# SNF Command Center MCP Orchestration Blueprint

This document defines an MCP-based execution pattern for building and operating SNF Command Center with Copilot Studio, Fabric, Power BI, FHIR, Azure AI, and healthcare workflow tooling.

## Core MCP Roles

- LLM agent MCP orchestrator: routes tasks, enforces safety rules, and coordinates other MCP servers.
- Playwright MCP: validates clinical UI flows, EHR simulations, and dashboard usability.
- Filesystem MCP: manages protocols, pathways, governance documents, and audit-ready artifacts.
- Workflow-engine MCP: provisions and operates clinical workflows, alerts, and escalations.
- BI-tool MCP: manages semantic models, dashboards, report subscriptions, and RLS validation.
- Data-store MCP: manages patient master data, consent flags, care plans, assignments, and reference tables.
- FHIR MCP: exchanges resources with PCC, NetHealth, Azure Health Data Services, or other FHIR endpoints.
- Azure MCP: operates Azure Machine Learning, Azure AI services, Purview, and related governance or model assets.
- Fabric MCP: manages Eventstream, Eventhouse, Lakehouse, Activator, Reflex, KQL, and real-time dashboards.

## Cross-Cutting Rules

- No MCP action should silently bypass clinical review for high-risk scenarios.
- Every MCP action should emit structured audit output with correlation ID, actor, patient context where applicable, timestamp, and validation state.
- Rollbacks must restore the last approved version for workflows, dashboards, rules, or knowledge if validation fails.
- Clinical safety sign-off is required before activating new pathways, predictive rules, or alert routing changes.

## Pattern 1. Clinical Knowledge And Protocol Scaffolding

- Goal: prepare the clinical knowledge base, protocols, and decision-support rule inventory.
- Trigger conditions:
  - new clinical pathway approved
  - evidence source updated
  - terminology map or care standard revised
- External-tool steps:
  1. Use filesystem MCP to create or version `knowledge_sources/`, `protocols/`, `pathways/`, `terminology/`, and `governance/` directories.
  2. Use filesystem MCP to write clinical pathways, care plans, order-set references, and escalation rules.
  3. Use filesystem MCP to register image libraries for wound scales, edema scales, neuro checks, and safety references.
  4. Use data-store MCP or FHIR MCP to load terminology crosswalk metadata for SNOMED CT, ICD-10-CM, LOINC, and RxNorm references.
  5. Use Azure MCP where available to register decision-rule libraries or clinical NLP dictionaries.
  6. Use fetch or approved reference tooling to verify the content against current CDC, CMS, NIH, and specialty guidance.
- Expected output and logging:
  - `{"pattern":"clinical-knowledge-scaffolding","status":"Clinical Knowledge Ready","knowledgeVersion":"...","reviewedAt":"...","reviewOwners":["..."],"terminologyVersion":"...","validationFlags":[]}`
- Retry and rollback logic:
  - retry failed file writes up to 3 times
  - if terminology or evidence validation fails, revert to the last approved knowledge version and notify the clinical informatics lead
- Clinical validation requirements:
  - evidence review by a clinical sponsor
  - terminology review by informatics or coding owner
  - policy alignment review by compliance if patient-facing content changed
- Healthcare-specific success criteria:
  - all active pathways have review dates
  - all high-risk workflows point to an approved protocol
  - terminology maps resolve for the targeted clinical concepts
- Maximum allowable time:
  - 2 business days for incremental updates
  - 5 business days for major pathway packs
- Required sign-offs:
  - clinical sponsor
  - informatics lead
  - compliance owner when regulated content changes

## Pattern 2. Clinical Workflow And Alert Orchestration

- Goal: set up and validate clinical workflows, predictive checks, and alert routing.
- Trigger conditions:
  - new workflow request approved
  - new predictive rule added
  - alert-routing policy changed
- External-tool steps:
  1. Use workflow-engine MCP to create workflows for falls, pressure injury, medication review, infection response, pain escalation, delirium prevention, end-of-life coordination, and rehab discharge planning.
  2. Use FHIR MCP to validate data inputs, trigger resources, and EHR write-back points for each workflow.
  3. Use Azure MCP to deploy or validate predictive models for fall risk, pressure injury, delirium, sepsis, and readmission.
  4. Use Playwright MCP to simulate nurse, therapist, CNA, and family-portal scenarios end to end.
  5. Use workflow-engine MCP to validate low, medium, high, and critical alert paths and escalation timers.
- Expected output and logging:
  - `{"pattern":"clinical-workflow-alert-orchestration","status":"Clinical Workflows Ready","validatedAt":"...","workflowCount":8,"alertRouting":{"low":"secure-message","medium":"charge-nurse","high":"rapid-response","critical":"code-blue"},"validationFailures":[]}`
- Retry and rollback logic:
  - retry transient integration failures with backoff
  - if workflow creation fails, disable the unvalidated workflow, restore the previous version, and notify clinical IT plus workflow owner
  - if predictive validation fails, keep the model in shadow mode only
- Clinical validation requirements:
  - workflow-by-workflow clinical walkthrough
  - alert threshold review
  - simulation of expected and adverse paths
- Healthcare-specific success criteria:
  - fall alert sensitivity above 90 percent with false positives under 5 percent for validated scenarios
  - high-severity alert routing reaches the correct owner within target SLA
  - every active workflow has a named human escalation owner
- Maximum allowable time:
  - 2 business days for incremental workflow additions
  - 5 business days for multi-pathway packs
- Required sign-offs:
  - nursing director
  - relevant discipline owner
  - medical director for high-risk clinical pathways

## Pattern 3. Clinical Dashboard And Intelligence Activation

- Goal: activate live clinical intelligence, semantic models, and alert subscriptions.
- Trigger conditions:
  - new dashboard release candidate
  - real-time data source onboarding
  - semantic model or RLS update approved
- External-tool steps:
  1. Use Fabric MCP to create Eventstream connections, Eventhouse or KQL destinations, medallion lakehouse layers, Reflex assets, Activator rules, and real-time dashboard tiles.
  2. Use BI-tool MCP to publish the semantic model, dashboard pages, AI visuals, subscriptions, and RLS rules.
  3. Use data-store MCP to validate role, unit, consent, and patient-assignment reference tables for dynamic security.
  4. Use Playwright MCP to validate bedside usability, low-light readability, glove-friendly interactions, accessibility, and emergency scenario response.
- Expected output and logging:
  - `{"pattern":"clinical-dashboard-intelligence-activation","status":"Clinical Intelligence Active","validatedAt":"...","slaCompliance":{"liveTiles":true,"criticalAlerts":true},"securityValidation":{"rls":true,"labels":true},"openIssues":[]}`
- Retry and rollback logic:
  - revert dashboard or semantic model deployment if RLS, refresh, or tile-SLA validation fails
  - keep new alert subscriptions disabled until notification tests pass
- Clinical validation requirements:
  - page-level clinical walkthrough
  - measure-definition review
  - drillthrough and context-preservation validation
- Healthcare-specific success criteria:
  - live tiles under 30 seconds refresh for targeted real-time views
  - patient drillthrough preserves context and honors consent
  - critical dashboard alerts meet latency targets
- Maximum allowable time:
  - 3 business days for incremental releases
  - 7 business days for major dashboard packs
- Required sign-offs:
  - BI owner
  - clinical sponsor
  - privacy or compliance owner for PHI-bearing dashboards

## Pattern 4. Clinical Safety Event Response And Closed-Loop Learning

- Goal: establish automated response to safety events and feed outcomes back into learning and protocol improvement.
- Trigger conditions:
  - sentinel event
  - reportable safety event
  - safety drill cycle
- External-tool steps:
  1. Use workflow-engine MCP to create or update response workflows for falls, pressure injuries, medication errors, outbreaks, elopement, aggressive behavior, and medical emergencies.
  2. Use Playwright MCP to simulate sensor-driven or staff-reported safety events.
  3. Use FHIR MCP to validate event documentation, orders, reassessments, and response note capture in the EHR.
  4. Use Azure MCP to trigger post-event analysis, root-cause artifacts, intervention-effectiveness review, and training-gap identification.
  5. Use filesystem MCP to version corrective actions, lessons learned, and updated protocols.
- Expected output and logging:
  - `{"pattern":"clinical-safety-event-response","status":"Safety Event System Ready","lastDrillDate":"...","correctiveActionStatus":"...","eventTypesValidated":["fall","medication-error","infection-outbreak"],"openRisks":[]}`
- Retry and rollback logic:
  - if event simulation fails, quarantine the changed workflow and restore the last validated version
  - if FHIR documentation write-back fails, raise a manual documentation task immediately
- Clinical validation requirements:
  - review by patient safety, nursing, and affected discipline owners
  - drill completion with documented after-action review
  - evidence that corrective actions are traceable
- Healthcare-specific success criteria:
  - post-event workflow launches within facility-defined response windows
  - every validated event type has a closed-loop documentation path
  - after-action items are assigned and tracked
- Maximum allowable time:
  - 1 business day for high-risk corrective changes
  - 5 business days for non-urgent learning updates
- Required sign-offs:
  - patient safety officer
  - nursing director
  - affected department lead

## Pattern 5. Clinical Governance And Continuous Improvement

- Goal: operate ongoing governance, quality review, model oversight, and continuous improvement.
- Trigger conditions:
  - monthly governance cycle
  - quarterly pathway review
  - model drift or bias threshold breach
  - annual policy refresh
- External-tool steps:
  1. Use filesystem MCP to maintain governance charters, committee rosters, schedules, policies, and review packets.
  2. Use workflow-engine MCP to run recurring reviews for pathway effectiveness, model retraining, terminology refresh, feedback collection, safety audit follow-up, MUE cycles, and surveillance reporting.
  3. Use Azure MCP to run fairness checks, model performance reports, usage analytics, quality measure calculations, HAI trends, and readmission tracking.
  4. Use Playwright MCP to validate governance-facing experiences such as review queues, feedback capture, audit forms, and committee dashboards.
  5. Use BI-tool MCP to publish governance scorecards and intervention tracking dashboards.
- Expected output and logging:
  - `{"pattern":"clinical-governance-continuous-improvement","status":"Clinical Governance Active","lastReviewDate":"...","upcomingActivities":["..."],"biasAuditStatus":"...","committeePacketsPublished":true}`
- Retry and rollback logic:
  - if scheduled governance jobs fail, requeue them and preserve the last approved scorecards
  - if model governance checks fail, freeze promotion and keep the prior model active
- Clinical validation requirements:
  - documented committee review
  - change-control traceability
  - evidence of alert-fatigue and model-performance review
- Healthcare-specific success criteria:
  - all active models have current review dates
  - alert-fatigue metrics are monitored and remediation tracked
  - quality and compliance reports publish on schedule
- Maximum allowable time:
  - 5 business days for routine cycle completion
  - 10 business days for major governance refreshes
- Required sign-offs:
  - clinical governance chair
  - privacy or compliance owner
  - engineering or platform owner

## Recommended MCP Execution Order

1. Filesystem MCP and data-store MCP establish the controlled source of truth.
2. FHIR MCP and Azure Health Data Services validate clinical interoperability.
3. Workflow-engine MCP activates process automation and escalation logic.
4. Fabric MCP and BI-tool MCP activate intelligence, prediction, and dashboards.
5. Playwright MCP performs end-to-end validation against the runtime experience.
6. Azure MCP and filesystem MCP close the loop with monitoring, governance, and evidence updates.

## Minimum Structured Log Shape

```json
{
  "pattern": "clinical-workflow-alert-orchestration",
  "status": "Clinical Workflows Ready",
  "correlationId": "uuid",
  "timestampUtc": "2026-04-04T12:00:00Z",
  "environment": "prod",
  "patientContext": {
    "patientId": "optional",
    "episodeOfCare": "optional",
    "unit": "optional"
  },
  "validation": {
    "clinicalApproved": true,
    "privacyApproved": true,
    "technicalChecksPassed": true
  },
  "rollbackReference": "prior-approved-version-id",
  "notes": []
}
```

## Microsoft Guidance Basis

- Copilot Studio agent flows and automation: https://learn.microsoft.com/en-us/training/modules/use-agent-flows/
- Copilot Studio with flows: https://learn.microsoft.com/en-us/power-automate/flow-plugins-m365
- Fabric Real-Time Intelligence overview: https://learn.microsoft.com/en-us/fabric/real-time-intelligence/
- Fabric Eventstreams overview: https://learn.microsoft.com/en-us/fabric/real-time-analytics/event-streams/overview
- Eventstream destinations and Activator: https://learn.microsoft.com/en-us/fabric/real-time-intelligence/event-streams/add-manage-eventstream-destinations
- Azure Health Data Services FHIR service: https://learn.microsoft.com/en-us/azure/healthcare-apis/fhir/
- Purview healthcare EHR audit connector: https://learn.microsoft.com/en-in/purview/import-healthcare-data

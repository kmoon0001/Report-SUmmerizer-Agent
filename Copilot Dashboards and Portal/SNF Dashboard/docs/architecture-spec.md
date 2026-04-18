# SNF Command Center Architecture Spec

## 1. System Overview

SNF Command Center is a healthcare operations platform that combines:
- a conversational AI assistant
- a live event-driven analytics backbone
- a semantic dashboard layer
- a structured master-data store
- document and policy storage
- workflow automation and alerting

The design should support near-real-time operational insight for skilled nursing facility staff while preserving PHI controls, auditability, and role-based access.

## 2. Core Components

- Conversational assistant: Copilot Studio or another LLM-based agent with MCP support
- Browser automation: Playwright MCP for live UI checks and admin workflows
- Local workspace tools: filesystem MCP, git MCP, GitHub MCP
- Workflow and data tools: workflow MCP, BI-tool API MCP, data-store API MCP
- Optional platform bridge: Fabric MCP when the tenant exposes it
- Real-time pipeline: Fabric Eventstream → Eventhouse / KQL database → Lakehouse → Real-Time Dashboard
- Semantic layer: Power BI Direct Lake on OneLake
- Master data: Dataverse-equivalent structured store
- Clinical data ingestion: PCC / NetHealth via FHIR, exports, or middleware
- File storage: SharePoint / OneDrive or Google Drive for specs, policies, and approved examples
- Optional AI services: Azure AI Language for clinical NLP, Azure Machine Learning for predictive models

## 3. Data Flow

1. PCC / NetHealth data arrives via FHIR APIs, middleware, exports, or file drops.
2. Eventstream ingests the feed and routes it to Bronze storage.
3. Bronze holds raw FHIR or export payloads in Eventhouse or landing storage.
4. Cleansing and standardization move data into Silver tables or KQL databases.
5. Aggregation and scoring produce Gold datasets for KPIs, alerts, and summaries.
6. Power BI Direct Lake reads Gold and reference data for near-real-time reporting.
7. The assistant consumes curated metrics, patient summaries, and alert context.
8. Actions and alerts flow back through Power Automate or workflow services to notify staff or update systems.

## 4. Layered Storage Pattern

- Bronze: raw ingest, traceability, replay, and audit
- Silver: cleansed clinical entities, standardized terminology, and validated joins
- Gold: risk scores, KPIs, unit summaries, patient summaries, and operational metrics

## 5. Role Experiences

- Exec: census, risk, readmission, pressure injury, falls, staffing, pickup urgency
- Nursing: live patient risk, alerts, med/safety escalation, follow-through tasks
- Therapy: pickup urgency, missing documentation, plan-of-care status, overdue visits
- CNA: task priorities, safety reminders, patient handling alerts
- Maintenance: equipment, room, and environmental safety items
- Activities: engagement, participation, risk-aware scheduling

## 6. Assistant Responsibilities

- Explain metrics in plain language with clinical context
- Route requests to the right workflow or dashboard view
- Trigger alerts for high-risk conditions
- Summarize patient or unit status
- Never imply that the assistant has replaced clinician judgment

## 7. Dashboard Responsibilities

- Show live KPIs and alert tiles
- Support drillthrough to unit, room, and patient context
- Surface trends, anomalies, and priority queues
- Respect role-based access and PHI boundaries

## 8. Operational Goals

- Dashboard tiles: under 5 seconds freshness where feasible
- Assistant responses: under 2 seconds for cached or indexed queries
- Critical alert path: near-real-time, with visible acknowledgment
- Uptime target: 99.9% for critical alerting components

## 9. Microsoft Guidance Basis

- Fabric Real-Time Intelligence: https://learn.microsoft.com/en-us/fabric/real-time-intelligence/
- Fabric Activator overview: https://learn.microsoft.com/en-us/fabric/real-time-intelligence/data-activator/activator-introduction
- Direct Lake overview: https://learn.microsoft.com/en-us/power-bi/enterprise/directlake-overview
- Power BI security white paper: https://learn.microsoft.com/en-us/power-bi/guidance/whitepaper-powerbi-security
- Power BI tenant-level security planning: https://learn.microsoft.com/en-us/power-bi/guidance/powerbi-implementation-planning-security-tenant-level-planning

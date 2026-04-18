# Integration Map

## Planned Data Sources

- Power BI for dashboards and visual reporting
- Fabric for real-time ingestion, lakehouse, and KQL-backed dashboard data
- Dataverse for structured agent data and workflow state
- FHIR for PCC / NetHealth and other clinical-system exchange
- Microsoft Graph for tenant-aware identity, mail, files, and sites
- SQL / Postgres for operational data and analytics
- SharePoint / OneDrive for documents, templates, and file-based knowledge

## What Each Source Should Own

- Power BI: read-only reporting, dashboard visuals, executive summaries
- Fabric: real-time data plane, streaming transformations, lakehouse and eventhouse assets
- Dataverse: records, case state, structured app data, agent-linked tables
- FHIR: clinical observations, conditions, procedures, medications, and encounter exchange
- Microsoft Graph: tenant document access and Microsoft 365 signals
- SQL / Postgres: transactional and analytic datasets outside Dataverse
- SharePoint / OneDrive: document storage, approved examples, and working files

## Setup Inputs Needed Later

- Tenant IDs
- Client IDs
- Client secrets or certificates
- Workspace / site identifiers
- FHIR base URL and app registration details
- Fabric workspace and artifact identifiers
- Data ownership and permission boundaries

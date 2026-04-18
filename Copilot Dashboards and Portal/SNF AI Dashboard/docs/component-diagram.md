# Component Diagram

```text
PCC / NetHealth / FHIR / Exports / Middleware
        |
        v
Fabric Eventstream
        |
        +--> Bronze Eventhouse / landing
        |
        +--> Silver KQL / standardized tables
        |
        +--> Gold Lakehouse / KPIs and risk scores
        |
        v
Power BI Direct Lake + OneLake
        |
        +--> Exec dashboard
        +--> Nursing dashboard
        +--> Therapy dashboard
        +--> CNA / Ops dashboard

Conversational assistant
        |
        +--> Copilot Studio / MCP tools
        +--> Workflow engine / Power Automate
        +--> Data store / Dataverse equivalent
        +--> File storage / SharePoint / OneDrive

Alerts and actions
        |
        +--> Teams / email / SMS / task queues
        +--> EHR update paths where approved
```

## Healthcare Context

- Raw patient data should land in Bronze first.
- Curated clinical facts should move to Silver after validation.
- Summary and risk scores should move to Gold for display and routing.
- Alerts should be generated from rules plus predictive signals, then reviewed by humans when the action is clinical.


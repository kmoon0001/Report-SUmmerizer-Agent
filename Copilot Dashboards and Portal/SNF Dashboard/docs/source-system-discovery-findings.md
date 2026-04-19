# Source System Discovery Findings

## Objective

Determine whether there is enough real accessible data in Dataverse, SharePoint, Power BI, and Fabric to build the first source-to-model implementation now.

## Findings By System

### Net Health

Confirmed live in browser:
- authenticated access to `Net Health Therapy / Optima Unity`
- Sea Cliff facility workspace loaded at:
  - `https://ensg.optima-unity.nethealth.com/Sea-Cliff-Healthcare-Center/home`
- organization code:
  - `ensg`
- Net Health facility ID:
  - `333`
- external facility ID:
  - `223`
- build version:
  - `26.04.02.304`

Confirmed live API surfaces:
- `/_api/facilityapi/facility/333`
- `/_api/profileapi/person/navItems?facilityId=333`
- `/_api/authapi/appuser/facilityrights?facilityId=333`
- `/_api/workplaceapi/parts?facilityId=333`
- `/_api/facilityapi/facility/333/application`
- `/_api/facilityapi/config/facility/333`

Confirmed active facility disciplines:
- `Nursing`
- `PT`
- `OT`
- `ST`

Confirmed active applications:
- `Patient Management`
- `Rehab Optima`
- `Billing`
- `Advanced Clinical Documentation`
- `ADT Integration`
- `Electronic Signatures`
- `Appointment Book`
- `Clinical Outcomes`
- `Business Intelligence`

Confirmed role and feature surface:
- user roles include `Reports`, `Exports`, `DailyActivityLog`, `Scheduling`, `Labor`, `BI-Roles`, `OrdersManagement`
- workplace parts include `My Day`, `Messages`, `Favorites`, `My Performance`

Confirmed report and export permissions relevant to build work:
- therapy census
- clinical outcomes by diagnostic category
- functional outcome measures chart / table / patient worksheet
- Section GG assessment and outcome reports
- documentation due dates
- missing signatures
- missing visits
- daily treatment log
- daily therapy schedule
- patient encounters report
- patient details
- service log matrix
- labor activity
- billing data export review/save-as

Conclusion:
- Net Health is a real and strong source system, not just an application shell.
- It is especially strong for therapy, clinical outcomes, Section GG, documentation compliance, scheduling, labor, and productivity.
- It complements PCC rather than replacing it.

### PCC

Confirmed live in browser:
- authenticated access to PointClickCare EFS
- organization:
  - `Pacific Coast Services`
- current facility:
  - `Sea Cliff Healthcare Center`
  - PCC facility ID `223`
  - internal facility ID `58`
  - org UUID `50B2F434-D827-403C-ADA6-74F4B2D0A59B`
- facility/unit hierarchy via live API:
  - units `A`, `B`, `C`, `D`

Confirmed live APIs:
- `/app/sc/api/v1/users/authorization`
- `/app/sc/api/v1/organizations`
- `/app/sc/api/v1/accessible-locations/units`

Confirmed report surfaces:
- `Integrated Therapy Reports`
- `Therapy Clinical Documents`
- `Resident List Report *NEW*`
- `Action Summary Report`
- `Weight Summary Report`

Most important current discovery:
- `Resident List Report *NEW*` is a facility-level extract surface with:
  - unit filter
  - floor filter
  - resident status filter
  - gender filter
  - admission / discharge / deceased date range filters
  - primary physician filter
  - rate type filter
  - output formats `HTML`, `CSV`, and `EXCEL`
  - large field catalog spanning resident demographics, identifiers, dates, location, diagnoses, payer-related fields, vitals, and user-defined fields

Key implication:
- PCC now has the strongest directly proven first-source path.
- It is stronger than the previously inferred Power BI-first path because we can see the operational reporting surface, available filters, and export formats directly.

Constraint:
- `Integrated Therapy Report` requires a selected resident, so it is not the right first broad extract.
- `Resident List Report *NEW*` is the better first model-building source because it is facility-wide and export-oriented.

### Dataverse

Confirmed:
- SNF environment exists:
  - `Therapy AI Agents Dev`
  - environment ID `a944fdf0-0d2e-e14d-8a73-0f5ffae23315`
  - URL `https://orgbd048f00.crm.dynamics.com/`
- Real solutions exist in the environment:
  - `Healthcare Agents Foundation`
  - `Healthcare Agents Foundation V2`
  - `PCCA v2`

Inspected:
- Cloned solution source for `PCCAv2` into:
  - [tmp/PCCAv2-solution](D:\my agents copilot studio\SNF Dashboard\tmp\PCCAv2-solution)

What that solution contains:
- Copilot bot components
- knowledge files
- topics
- actions
- PDFs and guidance artifacts

What it does **not** contain:
- solution-scoped Dataverse entities/tables for reporting

Evidence:
- [Customizations.xml](D:\my agents copilot studio\SNF Dashboard\tmp\PCCAv2-solution\PCCAv2\src\Other\Customizations.xml) has:
  - `<Entities />`

Conclusion:
- Dataverse is real and reachable.
- The inspected SNF solution is content/agent-focused, not a reporting-table solution.
- There is not enough evidence yet that Dataverse currently holds the fact/dimension data needed for the first report.

### SharePoint / OneDrive

Confirmed:
- Tenant SharePoint URL:
  - `https://pacific coastservices.sharepoint.com/`
- Personal OneDrive path recovered from live Microsoft file-picker history:
  - `/personal/123713644_pacific coastservices_net1/Documents/SimpleLTC Reports`

What is present:
- governed file storage
- Copilot knowledge/document sources
- working document paths

What is not demonstrated:
- structured analytic tables
- patient-level fact extracts
- measure-period tables

Conclusion:
- SharePoint/OneDrive is useful for exports, governed content, and document workflows.
- It is not currently enough, by itself, to serve as the primary source for the first semantic model.

### Power BI

Confirmed from local usage traces:
- workspace ID:
  - `0b0fa563-4e46-4bbe-93de-a6b4d4711fc4`
- report ID:
  - `8eec2ba5-2491-4293-91e7-d2de52f95a32`
- dataset ID:
  - `aedcbfa3-52c6-4ccf-ac1d-0d54c042f9b3`

Observed report names:
- `Therapy Episode & Outcomes Dashboard`
- `Clinical Outcomes - Current Patient - Therapy Episode & Outcomes Dashboard`
- `Medicaid Component Reporting Tool`

Conclusion:
- Power BI definitely has real analytical content.
- The accessible evidence strongly supports a real therapy/outcomes semantic model already existing or partially existing.
- Power BI remains an important downstream validation and semantic-model target.
- It is no longer the strongest first source, because PCC now provides a directly observable operational extract surface.

Constraint:
- Direct Power BI REST access is still blocked with the current auth flow.
- To automate model inspection, we still need proper Power BI API access or a direct export from the semantic model/report.

### Fabric

Confirmed:
- Fabric workspace aligns to the same workspace ID recovered from Power BI:
  - `0b0fa563-4e46-4bbe-93de-a6b4d4711fc4`

Not yet recovered:
- `FABRIC_EVENTHOUSE_ID`
- `FABRIC_LAKEHOUSE_ID`
- `FABRIC_KQL_DATABASE`

Conclusion:
- Fabric presence is likely real.
- We do not yet have enough item-level metadata to build directly against Fabric objects.

## Overall Decision

### Is there enough data to build something real now?

Yes, but only for the right starting scope.

### Best supported first implementation

Start with:
- PCC resident-level operational extract, then model into therapy / census / outcomes layers

Reason:
- PCC now provides the most directly evidenced facility-wide source extract path.
- `Resident List Report *NEW*` can produce a broad resident-level base model with filters and export formats.
- Net Health can now serve as the first downstream therapy/outcomes enrichment source immediately after PCC.
- Power BI should still be used as a downstream comparison target and validation surface.

### Not yet supported as the first build without more source data

- patient safety / risk surveillance
- infection surveillance
- medication safety
- quality/regulatory model

Reason:
- those require fact tables or extracts that are not yet directly evidenced in the accessible systems

## Required Next Inputs

To build the first real source-to-model implementation cleanly, get one of these:

1. CSV export from PCC `Resident List Report *NEW*`
2. Net Health export from one of:
   - `therapyCensus`
   - `clinicalOutcomesByDiagnosticCategory`
   - `functionalOutcomeMeasuresTable`
   - `documentationDueDates`
3. CSV export from PCC therapy-related reports once a facility-wide therapy output is confirmed
4. Power BI semantic model export or table list for dataset `aedcbfa3-52c6-4ccf-ac1d-0d54c042f9b3`
5. CSV/XLSX export from the `Therapy Episode & Outcomes Dashboard`
6. Power BI API access with Build permission
7. Fabric item IDs if the semantic model is backed by Fabric objects

## Recommendation

Do not start the first real implementation from Dataverse.

Start from PCC `Resident List Report *NEW*`, because it is the strongest directly observed facility-wide extract surface with CSV/Excel output and a broad clinical/operational field catalog.

Use Net Health second for:
- therapy episode detail
- clinical outcomes
- Section GG
- documentation timeliness/completeness
- labor and productivity

Use Power BI next for:
- downstream validation
- semantic-model alignment
- identifying additional therapy/outcomes measures that are not present in the first PCC extract



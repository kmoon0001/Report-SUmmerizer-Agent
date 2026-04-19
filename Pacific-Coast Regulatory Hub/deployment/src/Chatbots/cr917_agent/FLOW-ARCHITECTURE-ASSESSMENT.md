# Flow Architecture Assessment

Last updated: 2026-04-10

## Flow Inventory & Wiring Status

### 1. INTERNAL - Normalize Manual QM File V2
- **Status**: ✅ WIRED & ACTIVE
- **Connector**: AI Builder (Custom Prompt)
- **Trigger**: VirtualAgent (called by QM Orchestrator)
- **What it does**: Takes an uploaded file (CSV/PDF/Excel/Image), sends it to AI Builder for OCR/normalization, returns structured text
- **Inputs**: ManualUploadFile (file), AnalysisContext (text)
- **Outputs**: normalization_status, normalized_document_type, normalized_text
- **Called by**: QM Orchestrator topic (when user uploads a file)
- **Assessment**: ESSENTIAL — this is the core file processing pipeline. Working correctly.

### 2. SNF - Quality Measure Decline Detection And Reporting
- **Status**: ✅ WIRED & ACTIVE
- **Connectors**: Dataverse (ListRecords) + Outlook (SendEmailV2)
- **Trigger**: VirtualAgent (called by QM Data Upload topic)
- **What it does**: Dual-mode flow:
  - **Lookup mode** (Mode="lookup" or no ToEmail): Queries Dataverse `tasks` table for "Facility insight submission" records, filters by facility/quarter, returns data text
  - **Email mode** (Mode="email" + ToEmail provided): Same lookup + sends QM Decline Alert email
- **Inputs**: FacilityName, Quarter, QMDataText, DecliningMetrics, ToEmail, Mode
- **Outputs**: ConfirmationMessage, FacilitySubmissionStatus, FacilityDataText, DecliningMetricsText
- **Called by**: QM Data Upload & Decline Detection topic
- **Assessment**: ESSENTIAL — this is the primary facility data retrieval AND decline alerting flow. The Dataverse query reads from your bi-weekly SimpleLTC automation output.

### 3. COPILOTV2 - Resident Insight Dataverse Lookup
- **Status**: ✅ WIRED & ACTIVE
- **Connector**: Dataverse (ListRecords)
- **Trigger**: VirtualAgent (called by Resident Outlier Analysis topic)
- **What it does**: Queries Dataverse `tasks` table for "Resident insight" records, filters by facility hint and run ID, returns the latest resident data text
- **Inputs**: facility_hint, requested_run_id
- **Outputs**: resident_data_text
- **Called by**: Resident Outlier Analysis topic
- **Assessment**: ESSENTIAL — this retrieves resident-level data from Dataverse for the secure resident workflow.

### 4. COPILOTV2 - Power BI Facility Insight Query
- **Status**: ✅ WIRED (via tool) but NEEDS VERIFICATION
- **Connector**: Power BI (ExecuteDatasetQuery)
- **Trigger**: VirtualAgent
- **What it does**: Runs a DAX query against Power BI semantic model "SM_Restricted" to get top 25 resident outliers with clinical scores (ADL, BIMS, Braden, falls, behaviors, antipsychotic, outlier_score)
- **Inputs**: facility_hint, quarter_hint, resident_reporting_period, payer_hint, query_mode, requested_run_id
- **Outputs**: 25+ fields including patient name, ID, clinical scores, outlier_score
- **Called by**: QM Driver Analysis topic (invokeFlowAction)
- **Assessment**: HIGH VALUE but needs verification:
  - The DAX query starts with "test query" — this may be a test/draft query
  - The Power BI dataset ID is hardcoded (`aedcbfa3-52c6-4ccf-ac1d-0d54c042f9b3`)
  - The group ID is hardcoded (`0b0fa563-4e46-4bbe-93de-a6b4d4711fc4`)
  - Need to verify the semantic model exists and has data
  - The outlier scoring formula is sophisticated (weighted composite of falls, injuries, skin, behaviors, antipsychotic)

### 5. SNF - Quality Measure Email Generator
- **Status**: ✅ WIRED & ACTIVE
- **Connector**: Approvals (StartAndWaitForAnApproval)
- **Trigger**: VirtualAgent (called by QM Action Plan topic)
- **What it does**: Creates an Approval request with QM data as the details, sends to the specified user email, waits for Approve/Reject, returns hitl_approval boolean
- **Inputs**: PayloadText, UserEmailAddress, RawQMData
- **Outputs**: hitl_approval (boolean)
- **Called by**: QM Action Plan topic
- **Assessment**: ESSENTIAL — this is the HITL approval mechanism via email. Well-designed with error handling (returns false on failure/timeout).

### 6. SNF - Clinical Intake Handoff Router
- **Status**: ⚠️ WIRED but STUB
- **Connector**: None
- **Trigger**: Skills (not VirtualAgent)
- **What it does**: Immediately returns hardcoded "success" with "Uploaded file received and ready for QM analysis" — no actual processing
- **Inputs**: ManualUploadFile (file), AnalysisContext (text)
- **Outputs**: normalization_status, normalized_document_type, normalized_text
- **Assessment**: REDUNDANT — this is a stub/placeholder that duplicates the Normalize flow's interface but does nothing. The real normalization happens in flow #1. This should either be:
  - **Removed** if not actively called by any topic
  - **Repurposed** as a lightweight router if you need a non-AI-Builder path

### 7. SNF - Therapy AI Resident Insight Intake
- **Status**: ✅ WIRED & ACTIVE (HTTP trigger)
- **Connector**: Dataverse (CreateRecord)
- **Trigger**: HTTP (webhook) — NOT VirtualAgent
- **What it does**: Receives a structured JSON payload from an external system (your SimpleLTC automation), creates a Dataverse `tasks` record with subject "Resident insight intake"
- **Inputs**: sourceSystem, submissionType, runId, generatedAtUtc, files (residentInterventionQueue, residentMeasureMembership, residentSummary)
- **Outputs**: HTTP 202 "Resident insight submission accepted"
- **Called by**: External automation (your bi-weekly SimpleLTC pull)
- **Assessment**: ESSENTIAL — this is the INGEST endpoint for your SimpleLTC automation. It writes to Dataverse, which flows #2 and #3 then read from. However:
  - It only writes the subject and a generic description — it doesn't store the actual file content (contentBase64) in the task record
  - The resident data files in the payload are received but not persisted to the task body/description
  - This means the Dataverse lookup flows (#2, #3) may not find useful data unless your external automation also writes the content separately

## Data Flow Diagram

```
SimpleLTC.com (bi-weekly)
    │
    ▼
[Your External Automation Flow] ──HTTP POST──▶ Flow #7 (Resident Insight Intake)
    │                                              │
    │                                              ▼
    │                                         Dataverse (tasks table)
    │                                              │
    ▼                                              ▼
[Facility Insight Submissions]              [Resident Insight Records]
    │                                              │
    ▼                                              ▼
Flow #2 (Decline Detection)              Flow #3 (Resident Lookup)
    │         │                                    │
    ▼         ▼                                    ▼
[Data]    [Email Alert]                    [Resident Data Text]
    │                                              │
    ▼                                              ▼
QM Orchestrator ◄──────────────────────── Resident Outlier Analysis
    │
    ▼
Flow #1 (Normalize) ◄── User uploads file
    │
    ▼
[Normalized QM Text] ──▶ QM Analysis / Action Plan / DoR Summary
                              │
                              ▼
                         Flow #5 (Email Generator / HITL Approval)
                              │
                              ▼
                         [Approve/Reject via Approvals]

Flow #4 (Power BI) ◄── QM Driver Analysis topic
    │
    ▼
[Resident Outlier Scores from Semantic Model]
```

## Recommendations

### Active (Essential — Keep On)
1. **Normalize Manual QM File V2** — core file processing via AI Builder
2. **QM Decline Detection** — facility data lookup from Dataverse + email alerts
3. **Resident Insight Dataverse Lookup** — resident data retrieval from Dataverse
4. **QM Email Generator** — HITL approval mechanism via Approvals connector
5. **Resident Insight Intake** — external data ingest endpoint (HTTP webhook)

### Disabled (Turned Off 2026-04-10)
6. **Power BI Facility Insight Query** — DISABLED. Semantic model `SM_Restricted` does not exist. All runs fail with 401 Unauthorized. Archived local export preserved at `archive/workflows/COPILOTV2-PowerBIFacilityInsightQuery-868e2c74-ed27-f111-8341-000d3a3363af/` for future reconnection when a therapy outcomes semantic model is built.
7. **Clinical Intake Handoff Router** — DISABLED. Stub flow that returns hardcoded success with no processing. Redundant with the Normalize flow.

## Data Intake Strategy (Dual-Path)

### Path 1: Manual Upload (ACTIVE — Primary)
```
User downloads CSV/PDF from SimpleLTC.com
    → Uploads to agent via chat
    → AI Builder normalizes (Flow #1)
    → Agent analyzes (facility or resident level)
    → Results stored in Dataverse for session persistence
```
This path works today for both facility-level and resident-level data.

### Path 2: SimpleLTC API (PLACEHOLDER — Awaiting API Credentials)
```
Scheduled trigger (bi-weekly)
    → Authenticate to SimpleLTC API
    → Pull facility QM data for all 12 facilities
    → Pull resident-level data per facility
    → Store in Dataverse tasks table
    → Agent reads from Dataverse on demand
```
Placeholder flow template at: `workflows/PLACEHOLDER-SimpleLTCApiIntake/`
Activation checklist included in the template. When SimpleLTC API access is granted, this flow replaces the manual download step. The agent's Dataverse lookup flows (#2, #3) already read from the same table — no agent-side changes needed.

### Power BI: BYPASSED
Power BI was a middleman between SimpleLTC data and the agent. With direct SimpleLTC data intake (manual or API), Power BI is unnecessary for this agent's core workflows. The Power BI flow is disabled and preserved for future use if a separate analytics layer is needed.

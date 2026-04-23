# SLP Portal -> SharePoint/Power Platform Migration Matrix (Step 2)

Date: 2026-04-23  
Repository: `https://github.com/kmoon0001/SLP-Portal`

## 1) Goal of this document

Establish a concrete source-of-truth migration map from the current app into a SharePoint-first architecture, with explicit "Dataverse-candidate" flags only where needed.

This is the execution baseline for MVP migration.

## 2) What exists today (repo-grounded)

### 2.1 Backend/API surface

- Express server with routes mounted in [server.ts](/d:/my agents copilot studio/SLP-Portal/server.ts:159)
- Patient API route mounted at [server.ts](/d:/my agents copilot studio/SLP-Portal/server.ts:190), implementation in [patients.ts](/d:/my agents copilot studio/SLP-Portal/src/server/routes/patients.ts:18)
- Library/PDF ingest route mounted at [server.ts](/d:/my agents copilot studio/SLP-Portal/server.ts:188), implementation in [library.ts](/d:/my agents copilot studio/SLP-Portal/src/server/routes/library.ts:21)
- News route mounted at [server.ts](/d:/my agents copilot studio/SLP-Portal/server.ts:189), implementation in [news.ts](/d:/my agents copilot studio/SLP-Portal/src/server/routes/news.ts:1)
- SQLite schema in [database.ts](/d:/my agents copilot studio/SLP-Portal/src/server/db/database.ts:7)

### 2.2 Data stores currently in use

- SQLite tables for server-side entities in [database.ts](/d:/my agents copilot studio/SLP-Portal/src/server/db/database.ts:8)
- Browser `localStorage` as active source for patient/note/workflow UX in [persistence-service.ts](/d:/my agents copilot studio/SLP-Portal/src/services/persistence-service.ts:191)
- IndexedDB for generated assets in [persistence-service.ts](/d:/my agents copilot studio/SLP-Portal/src/services/persistence-service.ts:455)

### 2.3 Workflow/UI breadth

- Large module surface routed via [ViewManager.tsx](/d:/my agents copilot studio/SLP-Portal/src/components/router/ViewManager.tsx:61)
- Navigation/content definitions in [slp-data.ts](/d:/my agents copilot studio/SLP-Portal/src/data/slp-data.ts:135)

## 3) Critical findings before migration

1. Current source of truth is split:
- API/SQLite exists.
- Active patient/notes UX currently uses browser persistence service.

2. Server imports middleware files that do not exist in repo snapshot:
- [server.ts](/d:/my agents copilot studio/SLP-Portal/server.ts:19)
- [server.ts](/d:/my agents copilot studio/SLP-Portal/server.ts:20)
- [server.ts](/d:/my agents copilot studio/SLP-Portal/server.ts:21)

3. If we migrate now without unifying source of truth, we'll carry data inconsistency into SharePoint.

## 4) Migration classification model

- `SP-Library`: SharePoint document libraries (knowledge assets, PDFs, SOPs).
- `SP-List`: SharePoint lists (light workflow/metadata where delegation limits are acceptable).
- `Dataverse-candidate`: use only if SharePoint-first fails governance/scale/security gates.
- `Keep local`: not system-of-record, optional personal productivity cache.

## 5) Entity-level migration matrix

| Current Entity/Feature | Current Source | Current Path | Target | Notes |
|---|---|---|---|---|
| Clinical knowledge markdown corpus | Repo files | [knowledge-base](/d:/my agents copilot studio/SLP-Portal/knowledge-base) | SP-Library | Primary candidate for SharePoint library + metadata columns. |
| Uploaded PDF documents | SQLite `documents` | [library.ts](/d:/my agents copilot studio/SLP-Portal/src/server/routes/library.ts:34) | SP-Library | Store file in library; metadata list or library columns for upload date/source. |
| PDF chunk search index | SQLite `chunks` | [library.ts](/d:/my agents copilot studio/SLP-Portal/src/server/routes/library.ts:39) | SP-List (or external search index) | For MVP, use SharePoint search + metadata filters. |
| Patients | localStorage + SQLite API exists | [persistence-service.ts](/d:/my agents copilot studio/SLP-Portal/src/services/persistence-service.ts:191), [patients.ts](/d:/my agents copilot studio/SLP-Portal/src/server/routes/patients.ts:18) | SP-List (Dataverse-candidate) | SharePoint-first possible; Dataverse if row/field security/audit depth required. |
| Progress/Daily/Recert/Discharge notes | localStorage + SQLite API exists | [persistence-service.ts](/d:/my agents copilot studio/SLP-Portal/src/services/persistence-service.ts:227), [patients.ts](/d:/my agents copilot studio/SLP-Portal/src/server/routes/patients.ts:112) | SP-List (Dataverse-candidate) | High-risk transactional data; likely first Dataverse escalation candidate. |
| Therapy sets | SQLite `therapy_sets` | [patients.ts](/d:/my agents copilot studio/SLP-Portal/src/server/routes/patients.ts:138) | SP-List | Normalize JSON config fields into columns where feasible. |
| Session results | SQLite `session_results` | [patients.ts](/d:/my agents copilot studio/SLP-Portal/src/server/routes/patients.ts:175) | SP-List (Dataverse-candidate) | If analytics depth grows, move to Dataverse. |
| Networking events feed | SQLite `networking_events` | [database.ts](/d:/my agents copilot studio/SLP-Portal/src/server/db/database.ts:58) | SP-List | Low-risk and list-friendly. |
| News feed | SQLite `news_items` | [database.ts](/d:/my agents copilot studio/SLP-Portal/src/server/db/database.ts:69) | SP-List | Low-risk and list-friendly. |
| WhatsApp-style internal messages | SQLite `whatsapp_messages` | [database.ts](/d:/my agents copilot studio/SLP-Portal/src/server/db/database.ts:78) | SP-List or Teams channel | Prefer Teams-native collaboration instead of custom list chat. |
| Generated assets (images/video) | IndexedDB | [persistence-service.ts](/d:/my agents copilot studio/SLP-Portal/src/services/persistence-service.ts:455) | SP-Library | Move to governed media library with retention. |
| Handouts/Phrase bank/user settings | localStorage | [persistence-service.ts](/d:/my agents copilot studio/SLP-Portal/src/services/persistence-service.ts:141) | Keep local or SP-List | Treat as user personalization unless operationally required. |

## 6) Module-level migration matrix (first pass)

| Module | Current Component | Data Dependency | Target Platform Pattern |
|---|---|---|---|
| Patient Profiles | [PatientProfiles.tsx](/d:/my agents copilot studio/SLP-Portal/src/components/PatientProfiles.tsx:31) | localStorage + doc tracker service | Canvas App screen backed by SP Lists. |
| Documentation tracker logic | [documentation-tracker-service.ts](/d:/my agents copilot studio/SLP-Portal/src/services/documentation-tracker-service.ts:15) | local notes + AI generation | Power Automate + Copilot action topics for note generation workflow. |
| Clinical Library | [ClinicalLibrary.tsx](/d:/my agents copilot studio/SLP-Portal/src/components/ClinicalLibrary.tsx:20) | `/api/library/*` | SharePoint libraries + Copilot grounded retrieval. |
| Progress Tracker | [ProgressTracker.tsx](/d:/my agents copilot studio/SLP-Portal/src/components/ProgressTracker.tsx:47) | mock/static currently | Power BI or Canvas charts from SharePoint/Dataverse source. |
| SLP module catalog | [slp-data.ts](/d:/my agents copilot studio/SLP-Portal/src/data/slp-data.ts:135) | static metadata | Keep in app as navigation metadata; externalize only if admin-editable required. |

## 7) MVP production path (SharePoint-first)

## 7.1 MVP scope

Single workflow:

1. Patient intake
2. Daily session note
3. Progress-note due alert
4. Supervisor review/approval

## 7.2 MVP target data model (SharePoint)

- List: `SLP_Patients`
- List: `SLP_SessionNotes`
- List: `SLP_Goals`
- List: `SLP_ReviewQueue`
- Library: `SLP_ClinicalKnowledge`

## 7.3 MVP gates

1. Contract validation:
- Power App form payloads match list columns.
- Flow response payloads are versioned and tested.

2. Runtime validation:
- Role-based access test (Clinician vs Supervisor).
- DLP policy compatibility test for all connectors used.

3. Packaging validation:
- Managed solution import to Test/UAT succeeds without manual repair.

4. Release QA:
- End-to-end scenario pass (intake -> note -> review).
- Audit trail evidence export produced.

## 8) Dataverse escalation triggers (objective)

Use Dataverse only if one or more occurs:

1. Need row-level/field-level security beyond practical SharePoint controls.
2. Delegation/performance limits affect core clinical workflow.
3. Relational complexity (patient -> episodes -> sessions -> outcomes) becomes brittle in lists.
4. Compliance asks for deeper native auditing and controlled data model behavior.

## 9) Immediate execution backlog (next 5 tasks)

1. Unify source of truth:
- Stop writing patient workflow data only to localStorage.
- Choose API-backed writes for MVP.

2. Define SharePoint list schemas and column contracts:
- `SLP_Patients`, `SLP_SessionNotes`, `SLP_Goals`, `SLP_ReviewQueue`.

3. Implement one Power App canvas workflow for intake + session note.

4. Implement one Power Automate approval flow:
- trigger on new note -> route to supervisor -> write review status.

5. Wire Copilot Studio to `SLP_ClinicalKnowledge` only:
- Entra auth required.
- DLP-approved connectors only.

## 10) Risks to track

1. Split persistence model causing data loss/inconsistency.
2. Missing middleware files referenced by server imports can block runtime hardening.
3. Scope explosion from attempting full module parity before MVP workflow stabilization.


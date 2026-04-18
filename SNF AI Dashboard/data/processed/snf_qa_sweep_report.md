# SNF QA Sweep

Generated: 2026-04-16 06:00:58

- [PASS] PowerShell Parse: Parsed 112 scripts cleanly.
- [PASS] Project Validation: Topics: 50 Actions: 5 Workflow folders: 5 Warnings: 1 Errors: 0 Warnings: Validation passed.
- [PASS] Source Schema Validation: Command center source schema validation passed. Processed root: D:\SNF AI Dashboard\data\processed
- [PASS] Button-Only Routing: Button-only question routing check passed. Topics scanned: 50
- [FAIL] Copilot Authoring Compliance: Copilot authoring compliance failed: Topic trigger phrase should avoid single-word phrases: Goodbye.mcs.yml -> 'Bye' | 
- [PASS] Action Contract Sync: { "ActionsScanned": 5, "ManifestActions": 5, "MatrixActions": 5, "WorkflowMatrixActions": 5, "ErrorCount": 0 }
- [PASS] Repository Secret Hygiene: Repository secret hygiene scan passed. Project root: D:\SNF AI Dashboard
- [PASS] Data Drift Validation: Data drift report written to: D:\SNF AI Dashboard\data\processed\command_center_data_drift_report.md
- [PASS] PCC Normalized Contract: { "FilePath": "D:\\SNF AI Dashboard\\data\\processed\\pcc_resident_list_current.normalized.csv", "RowCount": 8731, "MissingRequiredColumns": 0, "InvalidStatuses": 0, "MissingResidentIds": 0, "MissingResidentNames": 0, "InvalidCurrentFlags": 0, "ActiveWithoutLocation": 0, "ActiveWithoutAdmissionDate": 0 }
- [PASS] Documentation Normalized Contract: { "FilePath": "D:\\SNF AI Dashboard\\data\\processed\\nethealth_documentation_due_dates.normalized.csv", "RowCount": 133, "MissingRequiredColumns": 0, "MissingResidentIds": 0, "MissingClinicianIds": 0, "MissingDocumentTypes": 0, "MissingDueDates": 0, "OverdueCount": 0 }
- [PASS] Vitals Normalized Contract: { "FilePath": "D:\\SNF AI Dashboard\\data\\processed\\pcc_resident_vitals_current.csv", "RowCount": 32, "MissingRequiredColumns": 0, "MissingResidentIds": 0, "MissingResidentNames": 0, "DuplicateResidentIds": 0, "InvalidSnapshotDateKey": 0 }
- [FAIL] Power Automate Naming Standard: Flow naming report written to: D:\SNF AI Dashboard\data\processed\powerautomate_flow_naming_standard.md Status: FAIL Violations: 5
- [PASS] Power BI Executive Prep: Cross-source pipeline, package generation, and package validation completed.
- [PASS] Power BI Publish Readiness: Power BI publish readiness report written to: D:\SNF AI Dashboard\data\processed\powerbi_publish_readiness.md Status: READY
- [SKIP] Power BI Published Smoke (Non-Interactive): WARNING: Secure env import skipped: The specified module 'Microsoft.PowerShell.SecretManagement' was not loaded because no valid module file was found in any module directory. Power BI non-interactive smoke report written to: D:\SNF AI Dashboard\data\processed\powerbi_published_noninteractive_smoke.md Status: SKIP Reason: Missing required environment variables: POWERBI_CLIENT_ID, POWERBI_CLIENT_SECRET
- [PASS] Pester Hardening Suite: Describing CommandCenterRuntime hardening behaviors [+] acquires and releases a run lock 511ms [+] persists and reloads checkpoint step completion 162ms [+] cleans only old corrupt checkpoint backups 96ms Tests completed in 770ms Passed: 3 Failed: 0 Skipped: 0 Pending: 0 Inconclusive: 0 Pester hardening suite passed. Tests=3
- [PASS] Executive Report Bundle: Structured JSON summary, history, HTML bundle, and bundle validation completed.
- [PASS] SHAP Explanations Contract: { "FilePath": "D:\\SNF AI Dashboard\\data\\processed\\command_center_shap_explanations.csv", "RowCount": 162, "MissingRequiredColumns": 0, "InvalidPredictions": 0, "EmptyTopFeature1": 0 }
- [PASS] Guarded Response Evidence Contract: { "FilePath": "D:\\SNF AI Dashboard\\data\\processed\\command_center_automated_handoff_queue.csv", "ContractPath": "D:\\SNF AI Dashboard\\contracts\\guarded-response-contract.json", "RowCount": 17, "MissingRequiredColumns": 0, "InvalidGroundedness": 0, "InvalidVerification": 0, "VerifiedWithoutCitation": 0, "InvalidCitationFormat": 0, "NeedsReviewWithoutReason": 0 }
- [SKIP] Groundedness Evaluation: WARNING: Secure env import skipped: The specified module 'Microsoft.PowerShell.SecretManagement' was not loaded because no valid module file was found in any module directory. Groundedness evaluation report written to: D:\SNF AI Dashboard\data\processed\command_center_groundedness_eval.md Status: SKIP Reason: Azure OpenAI groundedness configuration is incomplete: AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_API_KEY, AZURE_OPENAI_DEPLOYMENT
- [PASS] Executive Bundle Smoke: Playwright smoke validation passed for the generated executive HTML bundle.
- [PASS] Operational History And Snapshot Archive: Operational history validation passed. Latest history row snapshot date: 20260405 Latest archive snapshot: D:\SNF AI Dashboard\data\exports\executive-command-center\history\snapshot-20260405-20260416-060040
- [PASS] Required Outputs: Core processed outputs and Power BI package manifests exist.

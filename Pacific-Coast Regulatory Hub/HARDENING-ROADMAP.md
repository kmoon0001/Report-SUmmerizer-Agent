# SimpleLTC QM Coach V2 - Hardening & Optimization Roadmap

**Date**: 2026-04-12  
**Status**: In Progress  
**Last Updated**: 2026-04-12

---

## Executive Summary

Comprehensive analysis identified 20 improvement opportunities across 4 severity levels:
- **4 CRITICAL** issues blocking core workflows
- **6 HIGH** issues affecting reliability and UX
- **5 MEDIUM** issues affecting maintainability
- **5 LOW** issues affecting discoverability and performance

This roadmap prioritizes fixes by impact and implementation complexity.

---

## CRITICAL FIXES (Must Complete Before Production)

### 1. Fix Live Drift: Stale Topic-Level Flow Bindings
**Status**: PENDING  
**Impact**: Core workflows (FacilityQMAnalysis, QMDriverAnalysis) fail at runtime  
**Effort**: 2-3 hours  

**Steps**:
1. Backup live agent: `pac copilot extract-template --environment a944fdf0-0d2e-e14d-8a73-0f5ffae23315 --bot ea52ad9c-8233-f111-88b3-6045bd09a824`
2. Open FacilityQMAnalysis topic in Copilot Studio browser
3. Delete broken invoke action nodes pointing to flow `868e2c74-ed27-f111-8341-000d3a3363af`
4. Repeat for QMDriverAnalysis topic
5. Verify no remaining references to disabled flow
6. Publish changes
7. Test both topics in chat

**Verification**:
- [ ] FacilityQMAnalysis topic loads without errors
- [ ] QMDriverAnalysis topic loads without errors
- [ ] No references to flow `868e2c74-ed27-f111-8341-000d3a3363af` remain

---

### 2. Add Error Handling to Core Workflows
**Status**: PENDING  
**Impact**: Silent failures; users don't know why analysis failed  
**Effort**: 4-5 hours  

**Affected Topics**:
- QMANALYSIS
- RESIDENTOUTLIERANALYSIS
- QMDATAUPLOADDECLINEDETECTION

**Implementation**:
1. After each `InvokeFlowAction`, add `ConditionGroup` to validate outputs
2. If outputs are empty/null, show fallback guidance
3. Log flow failures to telemetry with context
4. Add explicit error messages to OnError topic

**Verification**:
- [ ] Each flow action has output validation
- [ ] Fallback text displays when flow fails
- [ ] Telemetry logs flow failures with context

---

### 3. Enforce HITL Approval Downstream
**Status**: PENDING  
**Impact**: HITL requirement can be bypassed; outputs exported without approval  
**Effort**: 3-4 hours  

**Implementation**:
1. Add `ConditionGroup` in QMACTIONPLAN to check `Global.HITL_Approval = true`
2. Add same check in DoRSUMMARYEMAIL before sending email
3. If rejected, route to Escalate topic with rejection reason
4. Store approval metadata (approver, timestamp, decision) in Dataverse
5. Add approval status to all exported outputs

**Verification**:
- [ ] QMACTIONPLAN checks HITL_Approval before finalizing
- [ ] DoRSUMMARYEMAIL checks HITL_Approval before sending
- [ ] Rejected approvals route to Escalate
- [ ] Approval metadata stored in Dataverse

---

### 4. Enhance PHI Detection
**Status**: PENDING  
**Impact**: PHI can leak into logs despite guardrail  
**Effort**: 2-3 hours  

**Implementation**:
1. Expand HIPAAGuardrail keyword detection to include:
   - Common name patterns (e.g., "John Smith", "J.S.")
   - Date formats (e.g., "admitted last Tuesday")
   - Facility-specific resident names
2. Add semantic detection: if input contains clinical detail + identifiers, flag as PHI
3. Verify content moderation is enforced at agent settings level
4. Add explicit warning in ConversationStart about not typing identifiers
5. Log all PHI detections with user ID and timestamp

**Verification**:
- [ ] Enhanced keyword detection catches more PHI patterns
- [ ] Semantic detection works for clinical detail + identifiers
- [ ] Content moderation enforced
- [ ] PHI detections logged to audit trail

---

## HIGH PRIORITY FIXES (Complete Within 1 Week)

### 5. Add Data Validation
**Status**: PENDING  
**Effort**: 3-4 hours  

**Validation Points**:
- QM data: Check for numeric patterns, QM domain keywords
- File uploads: Validate MIME type (CSV, PDF, Excel only)
- Facility selection: Query FacilityOptions to confirm exists
- Multi-facility selection: Ensure at least one facility selected

---

### 6. Improve Conversation Recovery
**Status**: PENDING  
**Effort**: 2-3 hours  

**Implementation**:
- Show available workflows before escalating
- Pass context to Escalate topic
- Add "Start Over" button
- Implement MultipleTopicsMatched disambiguation

---

### 7. Add Timeout & Retry Logic
**Status**: PENDING  
**Effort**: 2-3 hours  

**Implementation**:
- Add "Processing..." message before long-running actions
- Implement retry logic in Power Automate flows
- Add timeout handling (60 seconds)
- Log execution time and failures

---

### 8. Deduplicate & Expand Knowledge Base
**Status**: PENDING  
**Effort**: 4-5 hours  

**Actions**:
- Remove duplicate knowledge files
- Add missing ONE Clinical Protocols
- Add CMS-specific guidance documents
- Verify all files are current
- Add version control to knowledge files

---

### 9. Expand Facility & QM Domain Coverage
**Status**: PENDING  
**Effort**: 2-3 hours  

**Actions**:
- Audit actual facility list and update FacilityOptions
- Expand QMDomains to include all CMS-tracked QMs
- Add "Other" option for custom entries
- Implement dynamic facility lookup from Dataverse

---

### 10. Complete Action Plan Output
**Status**: PENDING  
**Effort**: 2-3 hours  

**Implementation**:
- Display generated action plan before HITL approval
- Add confirmation message
- Add export/email options
- Validate flow output contains expected fields

---

## MEDIUM PRIORITY FIXES (Complete Within 2 Weeks)

### 11. Standardize Variable Naming
**Status**: PENDING  
**Effort**: 1-2 hours  

**Renames**:
- `Global.TopicVar1` → `Global.NormalizedUploadContent`
- `Global.TopicQMAnalysisResulttext` → `Global.QMAnalysisResultText`
- Remove `Global.QMDomainString`, use `Global.QMDomain` everywhere

---

### 12. Add Context Persistence
**Status**: PENDING  
**Effort**: 3-4 hours  

**Implementation**:
- Add `Global.WorkflowHistory` array
- Preserve facility, QM domain, lookback period across topics
- Add "Go Back" button
- Show workflow breadcrumb

---

### 13. Implement Escalation Routing
**Status**: PENDING  
**Effort**: 2-3 hours  

**Implementation**:
- Create Dataverse ticket on escalation
- Send email to support team
- Implement priority routing
- Add escalation tracking

---

### 14. Add Audit Logging
**Status**: PENDING  
**Effort**: 3-4 hours  

**Logging Points**:
- All major workflow steps
- User ID, timestamp, facility, QM domain
- PHI detection events
- Flow execution time and success/failure
- Create Power BI dashboard

---

### 15. Standardize Output Formatting
**Status**: PENDING  
**Effort**: 2-3 hours  

**Implementation**:
- Create output template in agent instructions
- Add SendActivity to display structured output
- Validate output contains all required sections
- Add formatting examples to knowledge base

---

## LOW PRIORITY FIXES (Complete Within 1 Month)

### 16-20. Low Priority Items
- Add conversation starters for missing workflows
- Add accessibility considerations
- Document settings configuration
- Remove/repurpose stub flows
- Optimize performance with caching

---

## Implementation Schedule

| Week | Focus | Effort |
|------|-------|--------|
| Week 1 | CRITICAL fixes (1-4) | 11-15 hours |
| Week 2 | HIGH fixes (5-10) | 18-24 hours |
| Week 3 | MEDIUM fixes (11-15) | 11-17 hours |
| Week 4 | LOW fixes (16-20) | 8-12 hours |

**Total Estimated Effort**: 48-68 hours

---

## Success Criteria

- [ ] All CRITICAL fixes deployed and tested
- [ ] All HIGH fixes deployed and tested
- [ ] Agent passes comprehensive QA sweep
- [ ] No silent failures in core workflows
- [ ] HITL approval enforced end-to-end
- [ ] PHI detection enhanced and logged
- [ ] Audit trail complete for compliance
- [ ] Knowledge base deduplicated and current
- [ ] All topics have error handling
- [ ] User experience improved with better recovery

---

## Tracking

| Fix # | Title | Status | Owner | ETA | Notes |
|-------|-------|--------|-------|-----|-------|
| 1 | Fix live drift | PENDING | - | - | - |
| 2 | Add error handling | PENDING | - | - | - |
| 3 | Enforce HITL approval | PENDING | - | - | - |
| 4 | Enhance PHI detection | PENDING | - | - | - |
| 5 | Add data validation | PENDING | - | - | - |
| 6 | Improve conversation recovery | PENDING | - | - | - |
| 7 | Add timeout & retry logic | PENDING | - | - | - |
| 8 | Deduplicate knowledge | PENDING | - | - | - |
| 9 | Expand QM domain coverage | PENDING | - | - | - |
| 10 | Complete action plan output | PENDING | - | - | - |
| 11 | Standardize variable naming | PENDING | - | - | - |
| 12 | Add context persistence | PENDING | - | - | - |
| 13 | Implement escalation routing | PENDING | - | - | - |
| 14 | Add audit logging | PENDING | - | - | - |
| 15 | Standardize output formatting | PENDING | - | - | - |


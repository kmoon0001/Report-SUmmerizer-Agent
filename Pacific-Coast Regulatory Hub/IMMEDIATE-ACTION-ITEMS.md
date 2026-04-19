# SimpleLTC QM Coach V2 - Immediate Action Items

**Date**: 2026-04-12  
**Priority**: CRITICAL  
**Status**: Ready for Implementation  

---

## What Was Accomplished

✅ **Fixed QM Driver Analysis Topic** (Previous Session)
- Deleted 2 broken condition nodes
- Deleted 1 broken flow action node
- Published successfully
- Topic now error-free

✅ **Comprehensive Agent Analysis** (This Session)
- Identified 20 improvement opportunities
- Categorized by severity (4 CRITICAL, 6 HIGH, 5 MEDIUM, 5 LOW)
- Created detailed implementation roadmaps
- Estimated effort: 48-68 hours total

---

## CRITICAL ACTION ITEMS (This Week)

### 1. Add Error Handling to Core Workflows
**Effort**: 4-5 hours  
**Topics to Update**:
- [ ] QMACTIONPLAN
- [ ] QMANALYSIS
- [ ] RESIDENTOUTLIERANALYSIS
- [ ] QMDATAUPLOADDECLINEDETECTION

**What to Do**:
1. After each `InvokeFlowAction`, add `ConditionGroup` to validate outputs
2. Check if critical output fields are populated
3. If empty/null, show fallback guidance
4. Log failures to telemetry

**Why**: Prevents silent failures; users will know when analysis fails

---

### 2. Enforce HITL Approval Downstream
**Effort**: 3-4 hours  
**Topics to Update**:
- [ ] QMACTIONPLAN - Add check before finalizing
- [ ] DoRSUMMARYEMAIL - Add check before sending
- [ ] HITLAPPROVAL - Add Dataverse logging

**What to Do**:
1. Add `ConditionGroup` to check `Global.HITL_Approval = true`
2. If rejected, route to Escalate with reason
3. Store approval metadata in Dataverse
4. Add approval status to exported outputs

**Why**: Ensures HITL requirement is actually enforced; enables compliance audit trail

---

### 3. Enhance PHI Detection
**Effort**: 2-3 hours  
**Topics to Update**:
- [ ] HIPAAGuardrail - Expand keyword detection
- [ ] ConversationStart - Add explicit warning
- [ ] OnError - Add PHI detection logging

**What to Do**:
1. Expand keyword detection to include name patterns, date formats
2. Add semantic detection for clinical detail + identifiers
3. Verify content moderation is enforced
4. Log all PHI detections with user ID and timestamp

**Why**: Prevents PHI leakage into logs; improves compliance

---

## HIGH PRIORITY ACTION ITEMS (Next Week)

### 4. Add Data Validation (3-4 hours)
- Validate QM data format
- Validate file uploads (MIME type)
- Validate facility selection exists
- Validate multi-facility selection has at least one

### 5. Improve Conversation Recovery (2-3 hours)
- Show available workflows before escalating
- Pass context to Escalate topic
- Add "Start Over" button
- Implement MultipleTopicsMatched disambiguation

### 6. Add Timeout & Retry Logic (2-3 hours)
- Add "Processing..." message before long-running actions
- Implement retry logic in Power Automate flows
- Add timeout handling (60 seconds)
- Log execution time and failures

### 7. Deduplicate & Expand Knowledge Base (4-5 hours)
- Remove duplicate knowledge files
- Add missing ONE Clinical Protocols
- Add CMS-specific guidance documents
- Verify all files are current
- Add version control to knowledge files

### 8. Expand Facility & QM Domain Coverage (2-3 hours)
- Audit actual facility list and update FacilityOptions
- Expand QMDomains to include all CMS-tracked QMs
- Add "Other" option for custom entries
- Implement dynamic facility lookup from Dataverse

### 9. Complete Action Plan Output (2-3 hours)
- Display generated action plan before HITL approval
- Add confirmation message
- Add export/email options
- Validate flow output contains expected fields

---

## MEDIUM PRIORITY ACTION ITEMS (Week 3)

### 10. Standardize Variable Naming (1-2 hours)
- Rename `Global.TopicVar1` → `Global.NormalizedUploadContent`
- Rename `Global.TopicQMAnalysisResulttext` → `Global.QMAnalysisResultText`
- Remove `Global.QMDomainString`, use `Global.QMDomain` everywhere

### 11. Add Context Persistence (3-4 hours)
- Add `Global.WorkflowHistory` array
- Preserve facility, QM domain, lookback period across topics
- Add "Go Back" button
- Show workflow breadcrumb

### 12. Implement Escalation Routing (2-3 hours)
- Create Dataverse ticket on escalation
- Send email to support team
- Implement priority routing
- Add escalation tracking

### 13. Add Audit Logging (3-4 hours)
- Log all major workflow steps
- Log user ID, timestamp, facility, QM domain
- Log PHI detection events
- Log flow execution time and success/failure
- Create Power BI dashboard

### 14. Standardize Output Formatting (2-3 hours)
- Create output template in agent instructions
- Add SendActivity to display structured output
- Validate output contains all required sections
- Add formatting examples to knowledge base

---

## LOW PRIORITY ACTION ITEMS (Week 4)

### 15. Add Conversation Starters (1 hour)
- Add starters for: Resident Outlier Analysis, QM Decline Detection, Accountability Matrix, Coaching Corner

### 16. Add Accessibility Considerations (1-2 hours)
- Add text fallback for all adaptive cards
- Test with accessibility tools

### 17. Document Settings Configuration (1 hour)
- Document what "High" content moderation includes
- Consider adding custom rules for healthcare-specific content

### 18. Remove/Repurpose Stub Flows (1 hour)
- Remove `SNF-ClinicalIntakeHandoffRouter` stub or repurpose it
- Verify no active topics call it

### 19. Optimize Performance (2-3 hours)
- Consider caching results for large documents
- Implement pagination for large result sets
- Add progress indicators

---

## Implementation Checklist

### Week 1: CRITICAL Fixes
- [ ] Issue #2: Error handling (4-5 hrs)
- [ ] Issue #3: HITL enforcement (3-4 hrs)
- [ ] Issue #4: PHI detection (2-3 hrs)
- [ ] Testing & verification (2-3 hrs)
- [ ] **Total: 11-15 hours**

### Week 2: HIGH Priority Fixes
- [ ] Issue #5: Data validation (3-4 hrs)
- [ ] Issue #6: Conversation recovery (2-3 hrs)
- [ ] Issue #7: Timeout & retry (2-3 hrs)
- [ ] Issue #8: Knowledge base (4-5 hrs)
- [ ] Issue #9: QM domain coverage (2-3 hrs)
- [ ] Issue #10: Action plan output (2-3 hrs)
- [ ] Testing & verification (2-3 hrs)
- [ ] **Total: 18-24 hours**

### Week 3: MEDIUM Priority Fixes
- [ ] Issue #11: Variable naming (1-2 hrs)
- [ ] Issue #12: Context persistence (3-4 hrs)
- [ ] Issue #13: Escalation routing (2-3 hrs)
- [ ] Issue #14: Audit logging (3-4 hrs)
- [ ] Issue #15: Output formatting (2-3 hrs)
- [ ] Testing & verification (2-3 hrs)
- [ ] **Total: 11-17 hours**

### Week 4: LOW Priority Fixes
- [ ] Issues #16-20: Low priority improvements (8-12 hrs)
- [ ] **Total: 8-12 hours**

---

## Success Metrics

After completing all fixes, the agent should have:

✅ **Reliability**
- No silent failures in core workflows
- All flow actions have output validation
- Fallback guidance when data unavailable
- Timeout handling for long-running operations

✅ **Compliance**
- HITL approval enforced end-to-end
- Rejected approvals prevent export
- Approval metadata logged to Dataverse
- PHI detection enhanced and logged
- Complete audit trail for compliance

✅ **User Experience**
- Better error messages with recovery options
- Context preserved across workflow switches
- Available workflows shown before escalation
- "Start Over" button for easy recovery
- Consistent output formatting

✅ **Maintainability**
- Standardized variable naming
- Deduplicated knowledge base
- Comprehensive audit logging
- Clear error handling patterns
- Performance optimized

---

## Resources

**Documentation**:
- HARDENING-ROADMAP.md - Complete roadmap with all 20 issues
- CRITICAL-FIXES-IMPLEMENTATION-PLAN.md - Detailed plan for CRITICAL fixes
- AGENT-HARDENING-EXECUTIVE-SUMMARY.md - Executive summary
- AGENT.md - Copilot Studio authoring rules (MUST READ)
- AGENT-REVIEW-REPORT.md - Original comprehensive review

**Key Rules to Follow**:
1. ✅ Use Playwright browser automation ONLY for all Copilot Studio authoring
2. ✅ NEVER edit local .mcs.yml files for Apply
3. ✅ Use extension ONLY for Get/sync, never Apply
4. ✅ All changes through browser UI via Playwright
5. ✅ After browser changes, use extension Get to sync to local

---

## Next Steps

1. **Today**: Review this document with team
2. **Tomorrow**: Start implementing CRITICAL fixes (Issues #2-4)
3. **This Week**: Complete CRITICAL fixes and testing
4. **Next Week**: Start HIGH priority fixes
5. **Ongoing**: Track progress and update status

---

## Questions?

Refer to the detailed implementation guides or AGENT.md for Copilot Studio authoring rules.


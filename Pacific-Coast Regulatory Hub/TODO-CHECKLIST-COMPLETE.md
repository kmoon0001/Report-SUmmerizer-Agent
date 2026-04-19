# SimpleLTC QM Coach V2 - Complete TODO Checklist

**Date**: 2026-04-12  
**Status**: EXECUTION IN PROGRESS  
**Methodology**: Microsoft Learn Best Practices + Playwright Automation  

---

## CRITICAL FIXES (Execute This Session)

### CRITICAL #1: Add Error Handling to Core Workflows
**Microsoft Learn Reference**: [Error handling in adaptive dialogs](https://learn.microsoft.com/en-us/power-virtual-agents/authoring-error-handling)

**Topics to Fix**:
- [ ] QMACTIONPLAN - Add output validation after InvokeFlowAction
- [ ] QMANALYSIS - Add output validation after InvokeFlowAction
- [ ] RESIDENTOUTLIERANALYSIS - Add output validation after InvokeFlowAction
- [ ] QMDATAUPLOADDECLINEDETECTION - Add output validation after InvokeFlowAction

**Implementation Pattern**:
```
After each InvokeFlowAction:
1. Add ConditionGroup to check if output is blank/null
2. If blank: SendActivity with fallback guidance
3. If blank: LogCustomTelemetryEvent with error context
4. If blank: GoToTopic Escalate
5. If not blank: Continue with normal flow
```

**Verification**:
- [ ] Each topic has output validation
- [ ] Fallback messages display correctly
- [ ] Telemetry logs flow failures
- [ ] Topics tested in chat

---

### CRITICAL #2: Enforce HITL Approval Downstream
**Microsoft Learn Reference**: [Approval workflows](https://learn.microsoft.com/en-us/power-virtual-agents/advanced-use-flow-actions)

**Topics to Fix**:
- [ ] QMACTIONPLAN - Add check: if Global.HITL_Approval != true, don't finalize
- [ ] DoRSUMMARYEMAIL - Add check: if Global.HITL_Approval != true, don't send
- [ ] HITLAPPROVAL - Add Dataverse logging of approval decision

**Implementation Pattern**:
```
Before finalizing/sending:
1. Add ConditionGroup: if Global.HITL_Approval = true
2. If true: Continue with finalization/send
3. If false: SendActivity "Approval required"
4. If false: GoToTopic Escalate
5. Log approval metadata to Dataverse
```

**Verification**:
- [ ] QMACTIONPLAN checks HITL_Approval before finalizing
- [ ] DoRSUMMARYEMAIL checks HITL_Approval before sending
- [ ] Rejected approvals route to Escalate
- [ ] Approval metadata stored in Dataverse
- [ ] Tested in chat

---

### CRITICAL #3: Enhance PHI Detection
**Microsoft Learn Reference**: [Content moderation](https://learn.microsoft.com/en-us/power-virtual-agents/advanced-content-moderation)

**Topics to Fix**:
- [ ] HIPAAGuardrail - Expand keyword detection
- [ ] ConversationStart - Add explicit PHI warning
- [ ] OnError - Add PHI detection logging

**Implementation Pattern**:
```
HIPAAGuardrail enhancements:
1. Add detection for: name patterns, date formats, facility-specific identifiers
2. Add semantic detection: if clinical detail + identifiers, flag as PHI
3. Set Global.PHIDetected = true
4. Log to telemetry with user ID and timestamp
5. Route to privacy guidance

ConversationStart:
1. Add SendActivity with explicit warning about not typing identifiers

OnError:
1. Add LogCustomTelemetryEvent for PHI detection events
```

**Verification**:
- [ ] Enhanced keyword detection catches more patterns
- [ ] Semantic detection works
- [ ] PHI detections logged to audit trail
- [ ] Tested in chat

---

### CRITICAL #4: Add Data Validation
**Microsoft Learn Reference**: [Input validation](https://learn.microsoft.com/en-us/power-virtual-agents/authoring-variables)

**Topics to Fix**:
- [ ] QMANALYSIS - Validate QM data format
- [ ] QMDATAUPLOADDECLINEDETECTION - Validate file upload MIME type
- [ ] FACILITYQMANALYSIS - Validate facility selection exists
- [ ] DoRSUMMARYEMAIL - Validate at least one facility selected

**Implementation Pattern**:
```
After each Question/AdaptiveCardPrompt:
1. Add ConditionGroup to validate input
2. If invalid: SendActivity with error message and example
3. If invalid: Ask question again
4. If valid: Continue with flow
5. Log validation failures to telemetry
```

**Verification**:
- [ ] Invalid inputs rejected with helpful messages
- [ ] Users can retry with correct input
- [ ] Validation failures logged
- [ ] Tested in chat

---

## HIGH PRIORITY FIXES (Execute This Session)

### HIGH #5: Improve Conversation Recovery
**Microsoft Learn Reference**: [Fallback topics](https://learn.microsoft.com/en-us/power-virtual-agents/authoring-system-topics)

**Topics to Fix**:
- [ ] Fallback - Show available workflows before escalating
- [ ] Escalate - Add "Start Over" button
- [ ] Escalate - Pass context from Fallback

**Implementation Pattern**:
```
Fallback topic:
1. After 3 unrecognized utterances, show available workflows
2. Add AdaptiveCard with buttons: "Facility QM Review", "Resident Analysis", "DoR Email", "Start Over"
3. If user selects workflow, GoToTopic that workflow
4. If user selects "Start Over", GoToTopic ConversationStart
5. If user doesn't select, then escalate

Escalate topic:
1. Add "Start Over" button
2. Add "Contact Support" button
3. Pass context about what user was trying to do
```

**Verification**:
- [ ] Fallback shows workflow options
- [ ] Users can select workflow or start over
- [ ] Escalate has clear options
- [ ] Tested in chat

---

### HIGH #6: Add Timeout & Retry Logic
**Microsoft Learn Reference**: [Flow actions best practices](https://learn.microsoft.com/en-us/power-virtual-agents/advanced-use-flow-actions)

**Topics to Fix**:
- [ ] QMANALYSIS - Add "Processing..." message before flow action
- [ ] QMACTIONPLAN - Add "Processing..." message before flow action
- [ ] RESIDENTOUTLIERANALYSIS - Add "Processing..." message before flow action
- [ ] QMDATAUPLOADDECLINEDETECTION - Add "Processing..." message before flow action

**Implementation Pattern**:
```
Before each long-running InvokeFlowAction:
1. SendActivity "Processing your request, this may take 30-60 seconds..."
2. InvokeFlowAction
3. Add ConditionGroup to check if output is populated
4. If not populated after timeout, show fallback
5. Log execution time to telemetry
```

**Verification**:
- [ ] "Processing..." messages display
- [ ] Execution time logged
- [ ] Timeouts handled gracefully
- [ ] Tested in chat

---

### HIGH #7: Expand Knowledge Base
**Microsoft Learn Reference**: [Knowledge sources](https://learn.microsoft.com/en-us/power-virtual-agents/knowledge-sources)

**Actions**:
- [ ] Remove duplicate knowledge files
- [ ] Add missing ONE Clinical Protocols (Medication, Infection, Cognitive)
- [ ] Add CMS guidance for Antipsychotic Use, Rehospitalization
- [ ] Verify all files are current (check publication dates)
- [ ] Add version control to knowledge files

**Verification**:
- [ ] No duplicate files
- [ ] All required protocols present
- [ ] Files are current
- [ ] Version control added

---

### HIGH #8: Expand Facility & QM Domain Coverage
**Microsoft Learn Reference**: [Entities and options](https://learn.microsoft.com/en-us/power-virtual-agents/advanced-entities-options)

**Actions**:
- [ ] Audit actual facility list
- [ ] Update FacilityOptions entity to match
- [ ] Expand QMDomains entity to include all CMS-tracked QMs
- [ ] Add "Other" option for custom entries
- [ ] Implement dynamic facility lookup from Dataverse

**Verification**:
- [ ] FacilityOptions matches actual facilities
- [ ] QMDomains includes all CMS QMs
- [ ] "Other" option works
- [ ] Dynamic lookup works

---

### HIGH #9: Complete Action Plan Output
**Microsoft Learn Reference**: [SendActivity best practices](https://learn.microsoft.com/en-us/power-virtual-agents/authoring-send-activity)

**Topics to Fix**:
- [ ] QMACTIONPLAN - Display generated action plan before HITL approval
- [ ] QMACTIONPLAN - Add confirmation message
- [ ] QMACTIONPLAN - Add export/email options
- [ ] QMACTIONPLAN - Validate flow output contains expected fields

**Implementation Pattern**:
```
After InvokeFlowAction in QMACTIONPLAN:
1. Validate output contains expected fields
2. SendActivity to display action plan summary
3. Add AdaptiveCard with buttons: "Approve", "Reject", "Export", "Email"
4. Route based on user selection
```

**Verification**:
- [ ] Action plan displays before approval
- [ ] Confirmation message shows
- [ ] Export/email options work
- [ ] Tested in chat

---

## MEDIUM PRIORITY FIXES (Execute This Session)

### MEDIUM #10: Standardize Variable Naming
**Microsoft Learn Reference**: [Variables best practices](https://learn.microsoft.com/en-us/power-virtual-agents/authoring-variables)

**Actions**:
- [ ] Rename `Global.TopicVar1` → `Global.NormalizedUploadContent`
- [ ] Rename `Global.TopicQMAnalysisResulttext` → `Global.QMAnalysisResultText`
- [ ] Remove `Global.QMDomainString`, use `Global.QMDomain` everywhere
- [ ] Update all topics that reference these variables

**Verification**:
- [ ] All renames complete
- [ ] All references updated
- [ ] No broken variable references
- [ ] Tested in chat

---

### MEDIUM #11: Add Context Persistence
**Microsoft Learn Reference**: [Conversation context](https://learn.microsoft.com/en-us/power-virtual-agents/authoring-variables)

**Actions**:
- [ ] Add `Global.WorkflowHistory` array
- [ ] Preserve facility, QM domain, lookback period across topics
- [ ] Add "Go Back" button to return to previous topic
- [ ] Show workflow breadcrumb in responses

**Verification**:
- [ ] Context preserved across topic switches
- [ ] "Go Back" button works
- [ ] Breadcrumb displays correctly
- [ ] Tested in chat

---

### MEDIUM #12: Add Audit Logging
**Microsoft Learn Reference**: [Telemetry and logging](https://learn.microsoft.com/en-us/power-virtual-agents/analytics-telemetry)

**Actions**:
- [ ] Add LogCustomTelemetryEvent to all major workflow steps
- [ ] Log user ID, timestamp, facility, QM domain, action taken
- [ ] Log PHI detection events
- [ ] Log flow execution time and success/failure
- [ ] Create Power BI dashboard to monitor usage

**Verification**:
- [ ] Telemetry events logged for all major steps
- [ ] Audit trail complete
- [ ] Power BI dashboard created
- [ ] Tested in chat

---

### MEDIUM #13: Standardize Output Formatting
**Microsoft Learn Reference**: [Output formatting best practices](https://learn.microsoft.com/en-us/power-virtual-agents/authoring-send-activity)

**Actions**:
- [ ] Create output template in agent instructions
- [ ] Add SendActivity to display structured output
- [ ] Validate output contains all required sections
- [ ] Add formatting examples to knowledge base

**Verification**:
- [ ] All outputs follow template
- [ ] Structured output displays correctly
- [ ] Validation works
- [ ] Tested in chat

---

## LOW PRIORITY FIXES (Execute This Session)

### LOW #14: Add Conversation Starters
**Microsoft Learn Reference**: [Conversation starters](https://learn.microsoft.com/en-us/power-virtual-agents/authoring-conversation-starters)

**Actions**:
- [ ] Add starter for Resident Outlier Analysis
- [ ] Add starter for QM Decline Detection
- [ ] Add starter for Accountability Matrix
- [ ] Add starter for Coaching Corner

**Verification**:
- [ ] All starters added
- [ ] Starters work correctly
- [ ] Tested in chat

---

### LOW #15: Add Accessibility Considerations
**Microsoft Learn Reference**: [Accessibility best practices](https://learn.microsoft.com/en-us/power-virtual-agents/accessibility)

**Actions**:
- [ ] Add text fallback for all adaptive cards
- [ ] Test with accessibility tools
- [ ] Verify screen reader compatibility

**Verification**:
- [ ] All cards have text fallback
- [ ] Accessibility tested
- [ ] Screen readers work

---

### LOW #16: Remove Stub Flows
**Actions**:
- [ ] Verify `SNF-ClinicalIntakeHandoffRouter` is not called by any topic
- [ ] Remove stub flow or repurpose it
- [ ] Update any references

**Verification**:
- [ ] No broken references
- [ ] Stub removed or repurposed
- [ ] Tested in chat

---

## EXECUTION SUMMARY

**Total Items**: 16 major fixes + sub-items = ~50 individual tasks  
**Estimated Time**: 48-68 hours  
**Methodology**: Microsoft Learn best practices + Playwright automation  
**Status**: READY FOR EXECUTION

---

## Execution Order

1. **CRITICAL Fixes** (Today) - 11-15 hours
   - Error handling
   - HITL enforcement
   - PHI detection
   - Data validation

2. **HIGH Fixes** (Today/Tomorrow) - 18-24 hours
   - Conversation recovery
   - Timeout & retry
   - Knowledge base
   - Facility/QM coverage
   - Action plan output

3. **MEDIUM Fixes** (Tomorrow) - 11-17 hours
   - Variable naming
   - Context persistence
   - Audit logging
   - Output formatting

4. **LOW Fixes** (Tomorrow) - 8-12 hours
   - Conversation starters
   - Accessibility
   - Stub flows

---

## Success Criteria

- [ ] All 16 fixes implemented
- [ ] All topics tested in chat
- [ ] No broken references
- [ ] All changes published
- [ ] Audit trail complete
- [ ] HITL enforcement working
- [ ] Error handling working
- [ ] PHI detection enhanced
- [ ] Data validation working
- [ ] User experience improved


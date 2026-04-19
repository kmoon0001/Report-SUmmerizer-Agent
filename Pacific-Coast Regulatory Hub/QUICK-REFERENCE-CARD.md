# Quick Reference Card - Critical Fix #1: Error Handling

**Print this page or keep it open while implementing**

---

## The 4 Topics & Their Conditions

### 1️⃣ QM ACTION PLAN
**Condition**: `IsBlank(Topic.hitl_approval)`  
**Error Message**: "Unable to generate action plan. Please try again or contact support."  
**Telemetry Event**: `FlowActionFailed`  
**Route To**: Escalate topic  

---

### 2️⃣ RESIDENT OUTLIER ANALYSIS
**Condition**: `IsBlank(Topic.resident_data_text)`  
**Error Message**: "No resident data found. Please try a different facility or time period."  
**Telemetry Event**: `FlowActionFailed`  
**Route To**: Escalate topic  

---

### 3️⃣ QM DATA UPLOAD & DECLINE DETECTION
**Condition**: `IsBlank(Topic.ConfirmationMessage)`  
**Error Message**: "Unable to process file. Please try uploading a different file or contact support."  
**Telemetry Event**: `FlowActionFailed`  
**Route To**: Escalate topic  

---

### 4️⃣ QM ANALYSIS
**Condition**: `IsBlank(Global.TopicQMAnalysisResulttext)`  
**Error Message**: "Unable to complete analysis. Please try uploading a facility QM export file."  
**Telemetry Event**: `SearchFailed`  
**Route To**: Escalate topic  

---

## Step-by-Step for Each Topic

### For Each Topic:

1. **Open** the topic from Topics tab
2. **Find** the InvokeFlowAction or SearchAndSummarizeContent node
3. **Click** the "+" button below it
4. **Select** "Add a node" → "Condition"
5. **Enter** the condition expression (see above)
6. **Configure TRUE branch**:
   - Add "Send a message" with error message
   - Add "Log custom telemetry event" with event name
   - Add "Go to topic" → Escalate
7. **Configure FALSE branch**:
   - Add "End conversation" (or continue with existing logic)
8. **Save** and **Publish**

---

## Condition Expression Syntax

```
IsBlank(Topic.variableName)     ← For topic variables
IsBlank(Global.variableName)    ← For global variables
```

**Important**: 
- Start with `=` sign
- Use `IsBlank()` function (not `isEmpty()`)
- Use correct variable name (case-sensitive)

---

## TRUE Branch Actions (When Output is Empty)

### 1. Send a Message
- Copy the error message from the table above
- Paste it into the message field

### 2. Log Custom Telemetry Event
- Event Name: `FlowActionFailed` or `SearchFailed` (see table)
- Properties: `{FlowId: 'xxx', Facility: Topic.selectedFacility}`

### 3. Go to Topic
- Select: **Escalate**

---

## FALSE Branch Actions (When Output Exists)

### Option A: End Conversation
- Add "End conversation" node

### Option B: Continue Existing Logic
- If there's existing logic after the flow action, keep it

---

## Verification Checklist

For each topic:
- [ ] Condition node added
- [ ] Condition expression correct
- [ ] TRUE branch has error message
- [ ] TRUE branch has telemetry logging
- [ ] TRUE branch routes to Escalate
- [ ] FALSE branch configured
- [ ] Topic saves without errors
- [ ] Topic publishes successfully

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't find the flow action node | Use tall viewport: F12 → `window.innerHeight = 5000` |
| Condition won't accept expression | Check syntax: `=IsBlank(Topic.variableName)` |
| Can't find Escalate topic | Create it: New topic → "Escalate" → Add message → End conversation |
| Topic won't publish | Check for errors in Topic checker tab |
| Can't click on canvas elements | Try using `force: true` in browser console |

---

## Time Estimates

| Topic | Time |
|-------|------|
| QM Action Plan | 5-7 min |
| Resident Outlier Analysis | 5-7 min |
| QM Data Upload & Decline Detection | 5-7 min |
| QM Analysis | 7-10 min |
| Testing & Verification | 10-15 min |
| **TOTAL** | **45-60 min** |

---

## Success Indicators

✅ All 4 topics have error handling  
✅ All topics save without errors  
✅ All topics publish successfully  
✅ Error messages display when flows fail  
✅ Telemetry logs flow failures  
✅ Valid inputs still work correctly  

---

## Next Steps After Completion

1. Test each topic with valid and invalid inputs
2. Verify telemetry logs are created
3. Proceed to Fix #2: Enforce HITL Approval Downstream
4. See STEP-BY-STEP-IMPLEMENTATION-GUIDE.md for Fix #2

---

## References

- **Full Guide**: ERROR-HANDLING-IMPLEMENTATION-GUIDE.md
- **AGENT.md**: Copilot Studio authoring rules
- **Microsoft Learn**: https://learn.microsoft.com/en-us/power-virtual-agents/authoring-error-handling


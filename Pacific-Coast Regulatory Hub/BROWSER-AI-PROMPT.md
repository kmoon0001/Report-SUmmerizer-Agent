# Browser AI Prompt - Critical Fix #1: Error Handling Implementation

**Copy and paste this entire prompt to your browser AI (Claude, ChatGPT, etc.)**

---

## TASK: Add Error Handling to 4 Copilot Studio Topics

You are helping implement error handling in Microsoft Copilot Studio. Follow these instructions exactly.

### IMPORTANT RULES
- Use ONLY the Copilot Studio UI (browser interface)
- Do NOT edit any files locally
- Do NOT use any code or scripts
- Follow Microsoft Learn best practices for error handling
- Reference: https://learn.microsoft.com/en-us/power-virtual-agents/authoring-error-handling

---

## WHAT YOU NEED TO DO

Add error handling (ConditionGroup nodes) to 4 topics. Each topic needs:
1. A Condition node that checks if the flow action output is empty
2. If empty (TRUE branch): Show error message → Log telemetry → Route to Escalate topic
3. If not empty (FALSE branch): End conversation

---

## TOPIC 1: QM ACTION PLAN

### Step 1: Open the Topic
1. Go to **Topics** tab in Copilot Studio
2. Find and click **"QM Action Plan"** topic
3. Wait for it to load

### Step 2: Add Condition Node
1. Scroll down to find the **InvokeFlowAction** node (the node that calls a Power Automate flow)
2. Click the **"+"** button below it
3. Select **"Add a node"** from the menu
4. Choose **"Condition"** from the options

### Step 3: Enter Condition Expression
1. In the condition field, enter exactly:
   ```
   =IsBlank(Topic.hitl_approval)
   ```
2. Press Enter or click outside to confirm

### Step 4: Configure TRUE Branch (Error Handling)
1. Click the **TRUE** branch (the left side)
2. Click **"+"** to add a node
3. Select **"Send a message"**
4. Enter exactly:
   ```
   Unable to generate action plan. Please try again or contact support.
   ```
5. Click outside to save

### Step 5: Add Telemetry Logging
1. Click **"+"** to add another node in the TRUE branch
2. Select **"Call an action"** → **"Log custom telemetry event"**
3. Fill in:
   - **Event Name**: `FlowActionFailed`
   - **Properties**: `{FlowId: 'fcf035ad-af0c-f111-8406-0022480b6bd9', TargetMetric: Topic.targetMetric, Facility: Topic.selectedFacility}`
4. Click outside to save

### Step 6: Add Route to Escalate
1. Click **"+"** to add another node in the TRUE branch
2. Select **"Go to topic"**
3. Select **"Escalate"** from the dropdown
4. Click outside to save

### Step 7: Configure FALSE Branch
1. Click the **FALSE** branch (the right side)
2. Click **"+"** to add a node
3. Select **"End conversation"**
4. Click outside to save

### Step 8: Save and Publish
1. Click the **"Save"** button at the top
2. Wait for save to complete
3. Click the **"Publish"** button
4. Wait for publish to complete (you'll see a confirmation message)

---

## TOPIC 2: RESIDENT OUTLIER ANALYSIS

### Step 1: Open the Topic
1. Go to **Topics** tab
2. Find and click **"Resident Outlier Analysis"** topic
3. Wait for it to load

### Step 2: Add Condition Node
1. Scroll down to find the **InvokeFlowAction** node
2. Click the **"+"** button below it
3. Select **"Add a node"**
4. Choose **"Condition"**

### Step 3: Enter Condition Expression
1. In the condition field, enter exactly:
   ```
   =IsBlank(Topic.resident_data_text)
   ```
2. Press Enter or click outside to confirm

### Step 4: Configure TRUE Branch (Error Handling)
1. Click the **TRUE** branch
2. Click **"+"** to add a node
3. Select **"Send a message"**
4. Enter exactly:
   ```
   No resident data found. Please try a different facility or time period.
   ```
5. Click outside to save

### Step 5: Add Telemetry Logging
1. Click **"+"** to add another node
2. Select **"Call an action"** → **"Log custom telemetry event"**
3. Fill in:
   - **Event Name**: `FlowActionFailed`
   - **Properties**: `{FlowId: '88ce03b7-6b25-f111-8341-000d3a33801d', Facility: Topic.selectedFacility, Pattern: Topic.outlierPattern}`
4. Click outside to save

### Step 6: Add Route to Escalate
1. Click **"+"** to add another node
2. Select **"Go to topic"**
3. Select **"Escalate"**
4. Click outside to save

### Step 7: Configure FALSE Branch
1. Click the **FALSE** branch
2. Click **"+"** to add a node
3. Select **"End conversation"**
4. Click outside to save

### Step 8: Save and Publish
1. Click **"Save"** button
2. Wait for save to complete
3. Click **"Publish"** button
4. Wait for publish to complete

---

## TOPIC 3: QM DATA UPLOAD & DECLINE DETECTION

### Step 1: Open the Topic
1. Go to **Topics** tab
2. Find and click **"QM Data Upload & Decline Detection"** topic (may be abbreviated)
3. Wait for it to load

### Step 2: Add Condition Node
1. Scroll down to find the **InvokeFlowAction** node
2. Click the **"+"** button below it
3. Select **"Add a node"**
4. Choose **"Condition"**

### Step 3: Enter Condition Expression
1. In the condition field, enter exactly:
   ```
   =IsBlank(Topic.ConfirmationMessage)
   ```
2. Press Enter or click outside to confirm

### Step 4: Configure TRUE Branch (Error Handling)
1. Click the **TRUE** branch
2. Click **"+"** to add a node
3. Select **"Send a message"**
4. Enter exactly:
   ```
   Unable to process file. Please try uploading a different file or contact support.
   ```
5. Click outside to save

### Step 5: Add Telemetry Logging
1. Click **"+"** to add another node
2. Select **"Call an action"** → **"Log custom telemetry event"**
3. Fill in:
   - **Event Name**: `FlowActionFailed`
   - **Properties**: `{FlowId: '0b930a15-2516-f111-8341-0022480b6bd9', Facility: Topic.selectedFacility, AnalysisScope: Topic.analysisScope}`
4. Click outside to save

### Step 6: Add Route to Escalate
1. Click **"+"** to add another node
2. Select **"Go to topic"**
3. Select **"Escalate"**
4. Click outside to save

### Step 7: Configure FALSE Branch
1. Click the **FALSE** branch
2. Click **"+"** to add a node
3. Select **"End conversation"**
4. Click outside to save

### Step 8: Save and Publish
1. Click **"Save"** button
2. Wait for save to complete
3. Click **"Publish"** button
4. Wait for publish to complete

---

## TOPIC 4: QM ANALYSIS

### Step 1: Open the Topic
1. Go to **Topics** tab
2. Find and click **"QM ANALYSIS"** topic
3. Wait for it to load

### Step 2: Add Condition Node
1. Scroll down to find the **SearchAndSummarizeContent** node (this is different from the others)
2. Click the **"+"** button below it
3. Select **"Add a node"**
4. Choose **"Condition"**

### Step 3: Enter Condition Expression
1. In the condition field, enter exactly:
   ```
   =IsBlank(Global.TopicQMAnalysisResulttext)
   ```
2. Press Enter or click outside to confirm

### Step 4: Configure TRUE Branch (Error Handling)
1. Click the **TRUE** branch
2. Click **"+"** to add a node
3. Select **"Send a message"**
4. Enter exactly:
   ```
   Unable to complete analysis. Please try uploading a facility QM export file.
   ```
5. Click outside to save

### Step 5: Add Telemetry Logging
1. Click **"+"** to add another node
2. Select **"Call an action"** → **"Log custom telemetry event"**
3. Fill in:
   - **Event Name**: `SearchFailed`
   - **Properties**: `{Facility: Global.SelectedFacility, Domain: Global.QMDomain, Lookback: Global.LookbackPeriod}`
4. Click outside to save

### Step 6: Add Route to Escalate
1. Click **"+"** to add another node
2. Select **"Go to topic"**
3. Select **"Escalate"**
4. Click outside to save

### Step 7: Configure FALSE Branch
1. Click the **FALSE** branch
2. Verify the existing logic continues (should have BeginDialog to HITLAPPROVAL)
3. Do NOT add anything here - just verify it's there

### Step 8: Save and Publish
1. Click **"Save"** button
2. Wait for save to complete
3. Click **"Publish"** button
4. Wait for publish to complete

---

## TESTING

For each topic, test:

### Test 1: Valid Input
1. Open the topic in test mode
2. Provide valid input
3. Verify it proceeds normally without showing error message
4. ✅ Expected: Normal flow continues

### Test 2: Invalid Input
1. Open the topic in test mode
2. Provide invalid input or simulate flow failure
3. Verify error message displays
4. Verify it routes to Escalate topic
5. ✅ Expected: Error message shows, routes to Escalate

---

## IMPORTANT NOTES

- **Save frequently** to avoid losing work
- **Publish after each topic** to ensure changes are live
- **Use exact error messages** - copy and paste them exactly
- **Use exact condition expressions** - they are case-sensitive
- **Do NOT modify any local files** - all changes through UI only
- **If Escalate topic doesn't exist**, create it:
  1. Go to Topics tab
  2. Click "Add a topic"
  3. Name it "Escalate"
  4. Add a message: "This issue requires escalation. Please contact support."
  5. Add "End conversation" node
  6. Save and publish

---

## MICROSOFT LEARN REFERENCES

All implementations follow Microsoft Learn best practices:

1. **Error Handling**: https://learn.microsoft.com/en-us/power-virtual-agents/authoring-error-handling
2. **Conditional Branching**: https://learn.microsoft.com/en-us/power-virtual-agents/authoring-conditions
3. **Telemetry & Logging**: https://learn.microsoft.com/en-us/power-virtual-agents/analytics-telemetry
4. **Flow Actions**: https://learn.microsoft.com/en-us/power-virtual-agents/authoring-flow-actions

---

## COMPLETION CHECKLIST

When done, verify:
- [ ] All 4 topics have error handling nodes
- [ ] All topics save without errors
- [ ] All topics publish successfully
- [ ] Error messages display correctly
- [ ] Telemetry events are logged
- [ ] Valid inputs still work
- [ ] Invalid inputs route to Escalate

---

## ESTIMATED TIME

- QM Action Plan: 5-10 minutes
- Resident Outlier Analysis: 5-10 minutes
- QM Data Upload & Decline Detection: 5-10 minutes
- QM Analysis: 7-10 minutes
- Testing: 10-15 minutes
- **TOTAL: 45-60 minutes**

---

## TROUBLESHOOTING

**Issue**: Can't find the flow action node
**Solution**: Scroll down in the topic canvas or use browser zoom out (Ctrl + -)

**Issue**: Condition won't accept the expression
**Solution**: Make sure you start with `=` sign and use exact spelling

**Issue**: Can't find Escalate topic
**Solution**: Create it following the instructions in the IMPORTANT NOTES section

**Issue**: Topic won't publish
**Solution**: Check Topic checker tab for errors and fix them

---

**You're ready to start! Begin with Topic 1: QM ACTION PLAN**


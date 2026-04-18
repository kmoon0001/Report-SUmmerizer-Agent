# Human-in-the-Loop (HITL) Workflow Design

## Overview
Comprehensive HITL mechanisms ensuring clinical oversight at every decision point.

## HITL Principles for Healthcare AI
1. **Clinician Authority**: AI assists, never decides
2. **Transparent Handoffs**: Clear human/AI responsibility boundaries
3. **Easy Override**: One-click rejection with reason capture
4. **Learning Loop**: Human corrections improve the system
5. **Cognitive Load**: Minimize review burden while maximizing safety

## Three-Tier HITL Architecture

### Tier 1: Pre-Generation Review (Data Validation)
**Who**: Therapist or Rehab Tech
**When**: Before AI generates recommendations
**Purpose**: Ensure input data quality

**Workflow**:
1. System displays source data summary
2. Highlights missing/unusual values
3. Clinician confirms or corrects
4. Only proceeds after explicit approval

**UI Components**:
- Data completeness scorecard
- Field-by-field validation checklist
- Quick-edit inline forms
- "Proceed to AI Analysis" button (disabled until validated)

### Tier 2: Post-Generation Review (Output Validation)
**Who**: Licensed Therapist (PT/OT/SLP)
**When**: After AI generates documentation
**Purpose**: Clinical accuracy and appropriateness

**Workflow**:
1. AI output displayed with confidence scores
2. Side-by-side with source data
3. SHAP explanations expanded by default
4. Therapist reviews, edits, or rejects
5. Approval requires explicit action

**UI Components**:
- Split-screen: AI output | Source data | Explanation
- Inline editing with track changes
- Confidence gauges per section
- "Approve", "Edit & Approve", "Reject" buttons
- Required reason field for rejections

### Tier 3: Supervisory Review (DOR Approval)
**Who**: Director of Rehab
**When**: Daily batch review before distribution
**Purpose**: Compliance and quality oversight

**Workflow**:
1. DOR receives daily briefing digest
2. Reviews high-risk cases flagged by AI
3. Spot-checks random sample
4. Approves batch or sends back for revision
5. System tracks approval patterns

**UI Components**:
- Dashboard with risk stratification
- Drill-down to individual cases
- Batch approval with exceptions
- Analytics on approval rates and edit patterns

## HITL Decision Points

### Decision Point 1: Data Sufficiency Gate
```yaml
Trigger: Before AI generation
Question: "Is the input data sufficient and accurate?"
Options:
  - Proceed: Data validated, run AI
  - Correct: Fix data issues first
  - Defer: Not enough data, skip this patient
Capture: Which fields were corrected, reason for deferral
```

### Decision Point 2: Clinical Accuracy Gate
```yaml
Trigger: After AI generation
Question: "Is the AI output clinically accurate and appropriate?"
Options:
  - Approve: Use as-is
  - Edit: Modify specific sections (track changes)
  - Reject: Discard and write manually
Capture: Edit details, rejection reason, time spent
```

### Decision Point 3: Compliance Gate
```yaml
Trigger: DOR batch review
Question: "Does this meet compliance and quality standards?"
Options:
  - Approve: Release to therapist
  - Return: Send back for revision with notes
  - Escalate: Flag for clinical leadership review
Capture: Compliance issues found, revision requests
```

## Override Mechanisms

### Quick Reject
- One-click "Not Appropriate" button
- Dropdown with common rejection reasons
- Optional free-text explanation
- Automatically logs to audit trail

### Granular Edit
- Inline editing of any AI-generated text
- Track changes mode (strikethrough + highlight)
- Section-level accept/reject
- Undo/redo capability

### Complete Override
- "Write Manually" option
- AI output saved as reference
- Comparison analysis for learning
- Flags case for model review

## Feedback Loop Architecture

### Immediate Feedback
```json
{
  "interactionId": "uuid",
  "timestamp": "ISO8601",
  "aiOutput": "original text",
  "humanEdit": "edited text",
  "editType": "Addition|Deletion|Modification|Rejection",
  "editReason": "clinician-provided reason",
  "timeToReview": "seconds",
  "confidenceAtGeneration": 0.87
}
```

### Aggregated Learning
- Weekly digest of common edits
- Pattern analysis: which prompts need tuning
- Model retraining triggers
- Prompt library updates

### Continuous Improvement
- A/B testing of prompt variations
- Clinician satisfaction surveys
- Accuracy benchmarking
- Drift detection and alerts

## Cognitive Load Optimization

### Smart Defaults
- Auto-approve low-risk, high-confidence outputs (with audit)
- Focus clinician attention on flagged items
- Progressive disclosure of explanations
- Keyboard shortcuts for power users

### Risk Stratification
```
High Risk (Always review):
- Discharge recommendations
- Recertification denials
- Significant functional decline
- Compliance flags present

Medium Risk (Spot check):
- Routine progress notes
- Stable patient status
- High confidence scores

Low Risk (Audit only):
- Administrative summaries
- Non-clinical briefings
- Data aggregations
```

### Review Time Targets
- High risk: 2-3 minutes per case
- Medium risk: 30-60 seconds per case
- Low risk: Batch approval with sampling

## UI/UX Best Practices

### Visual Hierarchy
1. Confidence score (top, prominent)
2. Key recommendation (large, clear)
3. Supporting evidence (expandable)
4. Full explanation (collapsible)
5. Source data (side panel)

### Interaction Patterns
- Hover for quick explanations
- Click to expand full details
- Drag to compare sections
- Keyboard navigation for efficiency

### Accessibility
- WCAG 2.1 AA compliance
- Screen reader optimization
- High contrast mode
- Keyboard-only operation

### Mobile Optimization
- Responsive design for tablets
- Touch-friendly controls
- Offline review capability
- Sync when connected

## Audit & Compliance

### Required Logging
- Every HITL decision point
- Time spent at each stage
- Edit history with timestamps
- Override reasons and patterns
- Clinician identity and credentials

### Reporting
- HITL effectiveness metrics
- Override rate by clinician/case type
- Time-to-review distributions
- Quality improvement trends

### Regulatory Alignment
- 21 CFR Part 11 (electronic signatures)
- HIPAA audit trail requirements
- State licensure documentation standards
- CMS documentation guidelines

# Analytics Implementation Guide
<!-- markdownlint-disable MD013 MD024 MD040 MD060 -->

## Overview

This document provides implementation guidance for analytics, conversation outcomes, CSAT surveys, and continuous improvement processes aligned with Microsoft Learn best practices for Copilot Studio.

---

## Microsoft Learn Analytics Framework

Microsoft Learn defines three key analytics areas:

1. **Engagement Rate** - Percentage of sessions that become engaged
2. **Session Outcomes** - Resolved, Escalated, or Abandoned
3. **CSAT Scores** - Customer satisfaction ratings

---

## Conversation Outcomes Implementation

### Outcome Types

Per Microsoft Learn guidance:

| Outcome | Definition | Trigger |
|---------|------------|---------|
| **Resolved** | Session ended successfully | EndDialog with conversationOutcome: "Resolved" |
| **Escalated** | User transferred to human | BeginDialog with Escalate topic |
| **Abandoned** | Session ended without resolution | User stops responding or closes chat |

### Implementation Pattern

**In Every Topic**:

```yaml
# Success path
- kind: EndDialog
  conversationOutcome: Resolved
  # User confirmed success

# Escalation path
- kind: BeginDialog
  dialog: Escalate
  # User needs human help

# Abandoned (implicit)
# User stops responding - no explicit action needed
```

### Topics with Outcomes

**ConversationStart.mcs.yml**:

```yaml
- kind: EndDialog
  conversationOutcome: Resolved
  # After user completes quick action
```

**EndOfConversation.mcs.yml**:

```yaml
- kind: EndDialog
  conversationOutcome: =if(Topic.ConfirmResolution = "yes", "Resolved", "Abandoned")
  # Based on user confirmation
```

**Escalate.mcs.yml**:

```yaml
- kind: SendActivity
  conversationOutcome: Escalated
  # When escalation confirmed
```

**HITL_PostGenerationReview.mcs.yml**:

```yaml
- kind: EndDialog
  conversationOutcome: Resolved
  # After all reviews completed
```

---

## CSAT Survey Implementation

### Survey Timing

Per Microsoft Learn: "It's recommended to design conversations to finish with the End of Conversation topic."

**Best Practice**: Ask for CSAT at natural conversation end points:

- After completing a task
- After End of Conversation topic
- After HITL review session
- After daily briefing

### Survey Design

**Simple CSAT (1-5 Scale)**:

```yaml
- kind: Question
  id: ask_csat
  variable: Topic.CSAT
  prompt:
    text: "How would you rate your experience?"
    suggestedActions:
      - title: "😊 Excellent"
        value: "5"
      - title: "🙂 Good"
        value: "4"
      - title: "😐 Average"
        value: "3"
      - title: "🙁 Poor"
        value: "2"
      - title: "😞 Very Poor"
        value: "1"
```

**Follow-up for Low Scores**:

```yaml
- kind: ConditionGroup
  id: ask_feedback_if_low_csat
  conditions:
    - id: if_low_csat
      condition: =int(Topic.CSAT) <= 3
      actions:
        - kind: Question
          id: ask_detailed_feedback
          variable: Topic.DetailedFeedback
          prompt:
            text: "I'm sorry your experience wasn't great. What could I do better?"
        
        - kind: InvokeFlowAction
          id: log_detailed_feedback
          input:
            userId: =User.Id
            csatScore: =Topic.CSAT
            feedback: =Topic.DetailedFeedback
            conversationId: =System.ConversationId
            timestamp: =utcNow()
          flowName: LogDetailedFeedback
```

### CSAT Logging Flow

**LogCSATScore.json** (Power Automate):

```json
{
  "name": "Log CSAT Score",
  "trigger": {
    "type": "manual",
    "inputs": {
      "userId": "string",
      "csatScore": "number",
      "conversationId": "string",
      "sessionOutcome": "string",
      "timestamp": "datetime"
    }
  },
  "actions": [
    {
      "type": "Microsoft.Dataverse/CreateRecord",
      "inputs": {
        "entityName": "snf_csat_response",
        "item": {
          "snf_user_id": "@triggerBody()['userId']",
          "snf_csat_score": "@triggerBody()['csatScore']",
          "snf_conversation_id": "@triggerBody()['conversationId']",
          "snf_session_outcome": "@triggerBody()['sessionOutcome']",
          "snf_timestamp": "@triggerBody()['timestamp']"
        }
      }
    }
  ]
}
```

---

## Engagement Rate Tracking

### Definition

Per Microsoft Learn: "A session becomes engaged when a custom topic is triggered, or when the conversation enters one of the following system topics: Conversational Boosting, Escalate, or Fallback."

### Tracking Implementation

**Built-in Copilot Studio Analytics**:

- Automatically tracked by Copilot Studio
- View in Analytics dashboard
- No custom implementation needed

**Custom Tracking** (Optional):

```yaml
# In ConversationStart topic
- kind: InvokeFlowAction
  id: log_session_start
  input:
    userId: =User.Id
    conversationId: =System.ConversationId
    timestamp: =utcNow()
    trigger: "ConversationStart"
  flowName: LogSessionStart
```

---

## Custom Analytics Strategy

### Dataverse Tables for Analytics

**snf_csat_response**:

```
- snf_csat_responseid (guid, PK)
- snf_user_id (string, indexed)
- snf_csat_score (number, 1-5)
- snf_conversation_id (string, indexed)
- snf_session_outcome (choice: Resolved, Escalated, Abandoned)
- snf_timestamp (datetime, indexed)
- snf_feedback (string, optional)
```

**snf_conversation_metrics**:

```
- snf_conversation_metricsid (guid, PK)
- snf_conversation_id (string, unique)
- snf_user_id (string, indexed)
- snf_start_time (datetime)
- snf_end_time (datetime)
- snf_duration_seconds (number)
- snf_turn_count (number)
- snf_outcome (choice)
- snf_csat_score (number)
- snf_topic_triggered (string)
- snf_fallback_count (number)
- snf_escalated (boolean)
```

**snf_topic_performance**:

```
- snf_topic_performanceid (guid, PK)
- snf_topic_name (string, indexed)
- snf_date (datetime, indexed)
- snf_trigger_count (number)
- snf_resolution_count (number)
- snf_escalation_count (number)
- snf_abandonment_count (number)
- snf_avg_csat (number)
- snf_avg_duration_seconds (number)
```

---

## Power BI Dashboard

### Real-Time Dashboard

**System Health Panel**:

- Engagement rate (gauge)
- Resolution rate (gauge)
- CSAT score (stars)
- Active sessions (count)

**Conversation Outcomes Panel**:

- Resolved vs Escalated vs Abandoned (pie chart)
- Outcome trend (line chart, last 7 days)
- Outcome by topic (bar chart)

**CSAT Panel**:

- Average CSAT (number)
- CSAT distribution (bar chart)
- CSAT trend (line chart)
- Low CSAT feedback (table)

**Topic Performance Panel**:

- Top 10 topics by trigger count (bar chart)
- Topics with lowest resolution rate (table)
- Topics with highest escalation rate (table)
- Fallback triggers (table)

### Dashboard Queries

**CSAT by Day**:

```dax
CSAT by Day = 
CALCULATE(
    AVERAGE(snf_csat_response[snf_csat_score]),
    FILTER(
        snf_csat_response,
        snf_csat_response[snf_timestamp] >= TODAY() - 7
    )
)
```

**Resolution Rate**:

```dax
Resolution Rate = 
DIVIDE(
    COUNTROWS(FILTER(snf_conversation_metrics, snf_conversation_metrics[snf_outcome] = "Resolved")),
    COUNTROWS(snf_conversation_metrics)
)
```

**Engagement Rate**:

```dax
Engagement Rate = 
DIVIDE(
    COUNTROWS(FILTER(snf_conversation_metrics, snf_conversation_metrics[snf_turn_count] > 1)),
    COUNTROWS(snf_conversation_metrics)
)
```

---

## Continuous Improvement Process

### Weekly Review

**Data Collection**:

1. Export analytics from Copilot Studio
2. Query Dataverse tables for custom metrics
3. Generate Power BI report

**Analysis**:

1. Review engagement rate (target: >70%)
2. Review resolution rate (target: >90%)
3. Review CSAT score (target: >4.5/5.0)
4. Identify top 3 issues

**Actions**:

1. Assign owners for each issue
2. Create improvement tasks
3. Track progress

### Monthly Review

**Trend Analysis**:

1. Compare metrics to previous month
2. Identify improvement opportunities
3. Analyze topic performance
4. Review fallback triggers

**Optimization**:

1. Update low-performing topics
2. Add new trigger phrases
3. Improve error messages
4. Enhance fallback responses

### Quarterly Review

**Strategic Analysis**:

1. Business impact assessment
2. ROI calculation
3. User adoption trends
4. Feature utilization analysis

**Planning**:

1. Prioritize feature requests
2. Plan major improvements
3. Update success criteria
4. Align with business goals

---

## A/B Testing Framework

### Implementation

**Variant Assignment**:

```yaml
- kind: Compose
  id: assign_variant
  variable: Topic.Variant
  value: =if(mod(int(replace(User.Id, '-', '')), 2) = 0, 'A', 'B')
```

**Variant Display**:

```yaml
- kind: ConditionGroup
  id: show_variant
  conditions:
    - id: variant_a
      condition: =Topic.Variant = 'A'
      actions:
        # Version A content
    
    - id: variant_b
      condition: =Topic.Variant = 'B'
      actions:
        # Version B content
```

**Logging**:

```yaml
- kind: InvokeFlowAction
  id: log_variant
  input:
    userId: =User.Id
    variant: =Topic.Variant
    outcome: =Topic.Outcome
    csat: =Topic.CSAT
    timestamp: =utcNow()
  flowName: LogABTestVariant
```

### Test Ideas

1. **Greeting Style**: Formal vs. Casual
2. **CSAT Timing**: Before vs. After task completion
3. **Error Message**: Technical vs. User-friendly
4. **Action Buttons**: Icons vs. Text only
5. **Recommendation Display**: Card vs. List

---

## Reactions and Feedback

### Microsoft Learn Guidance

"Users can give a reaction to any message sent by the agent by using the thumbs-up and thumbs-down buttons."

### Implementation

**Built-in Reactions**:

- Thumbs up/down on any message
- Automatic in Copilot Studio
- View in Analytics tab

**Custom Feedback**:

```yaml
- kind: Question
  id: ask_reaction_feedback
  variable: Topic.ReactionFeedback
  prompt:
    text: "Thanks for the feedback! What specifically did you like or dislike?"
  # Only ask if user provides reaction
```

---

## Optimization Checklist

### Monthly Review Checklist

- [ ] Review engagement rate
- [ ] Review resolution rate
- [ ] Review CSAT score
- [ ] Review escalation rate
- [ ] Review fallback rate
- [ ] Analyze unhandled utterances
- [ ] Identify low-performing topics
- [ ] Review user feedback
- [ ] Update topic content
- [ ] Add new trigger phrases
- [ ] Test improvements
- [ ] Document changes

### Topic Optimization

**Low Resolution Rate**:

1. Review conversation flow
2. Identify drop-off points
3. Simplify user choices
4. Add helpful error messages
5. Test with users

**High Escalation Rate**:

1. Review escalation reasons
2. Improve self-service options
3. Add contextual help
4. Enhance fallback responses
5. Provide better guidance

**High Fallback Rate**:

1. Review unhandled utterances
2. Add new trigger phrases
3. Create new topics
4. Improve intent recognition
5. Test with real queries

---

## Success Criteria

### 3-Month Targets

- ✅ Engagement rate: >70%
- ✅ Resolution rate: >90%
- ✅ CSAT score: >4.5/5.0
- ✅ Escalation rate: <5%
- ✅ Fallback rate: <10%

### 6-Month Targets

- ✅ Engagement rate: >80%
- ✅ Resolution rate: >95%
- ✅ CSAT score: >4.7/5.0
- ✅ Escalation rate: <3%
- ✅ Fallback rate: <5%

### 12-Month Targets

- ✅ Engagement rate: >90%
- ✅ Resolution rate: >98%
- ✅ CSAT score: >4.8/5.0
- ✅ Escalation rate: <2%
- ✅ Fallback rate: <3%

---

## Resources

- [Measure and improve agent performance](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/analytics)
- [Measuring agent outcomes](https://learn.microsoft.com/en-us/power-virtual-agents/guidance/measuring-outcomes)
- [Analyze conversational agent effectiveness](https://docs.microsoft.com/en-us/power-virtual-agents/teams/analytics-csat-teams)
- [Track agent performance with Conversation KPIs](https://learn.microsoft.com/microsoft-copilot-studio/guidance/kit-conversation-kpi)

---

**Document Version**: 1.0  
**Last Updated**: 2026-04-17  
**Status**: Final  
**Next Review**: 2026-05-17  
**Owner**: Analytics Team

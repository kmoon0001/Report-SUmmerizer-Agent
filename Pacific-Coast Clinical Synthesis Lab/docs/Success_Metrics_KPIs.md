# Success Metrics & KPIs

## Overview

This document defines the key performance indicators (KPIs) and success metrics for the SNF Rehab Agent. These metrics align with Microsoft Learn's guidance on measuring agent performance and business impact.

---

## Business KPIs

### Time Savings
**Metric**: Average time saved per therapist per day  
**Target**: 45 minutes  
**Measurement**: Compare documentation time before/after agent adoption  
**Data Source**: User analytics, time tracking integration

**Formula**:
```
Time Saved = (Avg documentation time before agent) - (Avg documentation time with agent)
```

**Tracking**:
- Daily: Individual therapist time savings
- Weekly: Department average
- Monthly: Facility-wide average

---

### Documentation Quality
**Metric**: Documentation quality score  
**Target**: >90%  
**Measurement**: QA audit of approved recommendations  
**Data Source**: QA sampling, compliance audits

**Quality Criteria**:
- Clinical accuracy (30%)
- Completeness (25%)
- Medical necessity justification (25%)
- Compliance with payer requirements (20%)

**Tracking**:
- Weekly: Random sample of 10% of approved notes
- Monthly: Full audit of rejected notes
- Quarterly: Trend analysis

---

### Compliance Flag Reduction
**Metric**: Reduction in compliance flags  
**Target**: 50% reduction  
**Measurement**: Compare compliance flags before/after agent adoption  
**Data Source**: EMR compliance reports

**Tracking**:
- Weekly: New compliance flags
- Monthly: Comparison to baseline
- Quarterly: Trend analysis

---

### User Satisfaction
**Metric**: User satisfaction score (CSAT)  
**Target**: >4.5/5.0  
**Measurement**: Post-interaction surveys  
**Data Source**: Copilot Studio analytics, in-app surveys

**Survey Questions**:
1. How satisfied are you with this interaction? (1-5 stars)
2. Did the agent save you time? (Yes/No)
3. Was the AI recommendation helpful? (Yes/No)
4. What could be improved? (Open text)

**Tracking**:
- Real-time: CSAT score
- Daily: Average rating
- Weekly: Trend analysis
- Monthly: Detailed feedback report

---

## Technical KPIs

### Recommendation Acceptance Rate
**Metric**: Percentage of AI recommendations approved without major edits  
**Target**: >80%  
**Measurement**: HITL review outcomes  
**Data Source**: Dataverse (snf_hitl_audit table)

**Formula**:
```
Acceptance Rate = (Approved recommendations / Total recommendations) × 100
```

**Tracking**:
- Daily: Acceptance rate
- Weekly: Trend by therapist
- Monthly: Trend by facility

---

### Average Confidence Score
**Metric**: Average confidence score of generated recommendations  
**Target**: >85%  
**Measurement**: Confidence score from AI model  
**Data Source**: Dataverse (snf_confidence_metric table)

**Tracking**:
- Daily: Average confidence
- Weekly: Distribution (high/medium/low)
- Monthly: Trend analysis

---

### System Availability
**Metric**: System uptime  
**Target**: 99.9%  
**Measurement**: Health check monitoring  
**Data Source**: Application Insights, health check flow

**Formula**:
```
Availability = (Total time - Downtime) / Total time × 100
```

**Tracking**:
- Real-time: Availability status
- Daily: Uptime percentage
- Monthly: SLA compliance

---

### Error Rate
**Metric**: Percentage of operations that fail  
**Target**: <0.1%  
**Measurement**: Operation logs  
**Data Source**: Dataverse (snf_operation_log table)

**Formula**:
```
Error Rate = (Failed operations / Total operations) × 100
```

**Tracking**:
- Real-time: Error rate
- Daily: Error count by type
- Weekly: Trend analysis
- Monthly: Root cause analysis

---

### Mean Time to Recovery (MTTR)
**Metric**: Average time to recover from failures  
**Target**: <5 minutes  
**Measurement**: Time from error detection to resolution  
**Data Source**: Operation logs, incident records

**Formula**:
```
MTTR = Sum of recovery times / Number of incidents
```

**Tracking**:
- Per incident: Recovery time
- Weekly: Average MTTR
- Monthly: Trend analysis

---

## Adoption KPIs

### Daily Active Users
**Metric**: Percentage of licensed therapists using agent daily  
**Target**: 80%  
**Measurement**: Unique users per day  
**Data Source**: Copilot Studio analytics

**Tracking**:
- Daily: Active user count
- Weekly: Adoption rate
- Monthly: Trend analysis

---

### Feature Utilization Rate
**Metric**: Percentage of users utilizing key features  
**Target**: >70% use HITL review  
**Measurement**: Feature usage tracking  
**Data Source**: Dataverse (snf_operation_log table)

**Key Features**:
- Daily briefing
- HITL review
- Patient selection
- Analytics dashboard
- Help system

**Tracking**:
- Weekly: Feature usage by user
- Monthly: Feature adoption rate
- Quarterly: Feature effectiveness analysis

---

### Time to Proficiency
**Metric**: Time from first use to independent usage  
**Target**: <2 weeks  
**Measurement**: Onboarding completion to first solo session  
**Data Source**: User onboarding logs

**Definition of Proficiency**:
- Completed onboarding tour
- Used agent independently for 5+ sessions
- CSAT score >4.0

**Tracking**:
- Per user: Days to proficiency
- Monthly: Average time to proficiency
- Quarterly: Onboarding effectiveness

---

### Support Ticket Volume
**Metric**: Number of support tickets related to agent  
**Target**: <5 per week  
**Measurement**: Support ticket tracking  
**Data Source**: Support ticket system

**Categories**:
- Technical issues
- Training requests
- Feature requests
- Bug reports

**Tracking**:
- Weekly: Ticket count
- Monthly: Trend analysis
- Quarterly: Root cause analysis

---

## Conversation Quality KPIs

### Topic Resolution Rate
**Metric**: Percentage of conversations resolved without escalation  
**Target**: >90%  
**Measurement**: Conversation outcomes  
**Data Source**: Copilot Studio analytics

**Formula**:
```
Resolution Rate = (Resolved conversations / Total conversations) × 100
```

**Tracking**:
- Daily: Resolution rate
- Weekly: By topic
- Monthly: Trend analysis

---

### Fallback Rate
**Metric**: Percentage of user utterances that trigger fallback  
**Target**: <10%  
**Measurement**: Fallback topic triggers  
**Data Source**: Copilot Studio analytics

**Formula**:
```
Fallback Rate = (Fallback triggers / Total utterances) × 100
```

**Tracking**:
- Daily: Fallback rate
- Weekly: Common unhandled intents
- Monthly: Topic improvement opportunities

---

### Escalation Rate
**Metric**: Percentage of conversations that escalate to human  
**Target**: <5%  
**Measurement**: Escalation topic triggers  
**Data Source**: Copilot Studio analytics

**Formula**:
```
Escalation Rate = (Escalated conversations / Total conversations) × 100
```

**Tracking**:
- Daily: Escalation rate
- Weekly: Escalation reasons
- Monthly: Trend analysis

---

### Average Conversation Length
**Metric**: Average number of turns per conversation  
**Target**: 5-10 turns (efficient but thorough)  
**Measurement**: Conversation turn count  
**Data Source**: Copilot Studio analytics

**Tracking**:
- Daily: Average turns
- Weekly: By conversation type
- Monthly: Efficiency analysis

---

## Reliability KPIs

### Circuit Breaker Open Rate
**Metric**: How often circuit breakers open  
**Target**: <1 per week per operation  
**Measurement**: Circuit breaker state transitions  
**Data Source**: Dataverse (snf_circuit_breaker_log table)

**Tracking**:
- Real-time: Circuit breaker states
- Daily: Open events
- Weekly: Trend by operation
- Monthly: Root cause analysis

---

### Bulkhead Rejection Rate
**Metric**: Percentage of requests rejected by bulkhead  
**Target**: <5%  
**Measurement**: Bulkhead rejections  
**Data Source**: Dataverse (snf_bulkhead_log table)

**Formula**:
```
Rejection Rate = (Rejected requests / Total requests) × 100
```

**Tracking**:
- Real-time: Rejection count
- Daily: Rejection rate by operation
- Weekly: Trend analysis

---

### Dead Letter Queue Processing Success
**Metric**: Percentage of DLQ items successfully retried  
**Target**: >90%  
**Measurement**: DLQ processing outcomes  
**Data Source**: Dataverse (snf_dead_letter_queue table)

**Formula**:
```
DLQ Success Rate = (Succeeded items / Total items) × 100
```

**Tracking**:
- Daily: Processing success rate
- Weekly: Abandonment analysis
- Monthly: Trend analysis

---

### Correlation ID Coverage
**Metric**: Percentage of operations with correlation IDs  
**Target**: 100%  
**Measurement**: Operation logs with correlation IDs  
**Data Source**: Dataverse (snf_operation_log table)

**Formula**:
```
Coverage = (Operations with correlation ID / Total operations) × 100
```

**Tracking**:
- Daily: Coverage percentage
- Weekly: Missing correlation IDs
- Monthly: Compliance audit

---

## Dashboard & Reporting

### Real-Time Dashboard (Power BI)

**System Health Panel**:
- System availability (green/yellow/red)
- Error rate (gauge)
- Active users (count)
- Circuit breaker states (list)
- Bulkhead utilization (gauges)

**Performance Panel**:
- Request throughput (line chart)
- P50/P95/P99 latency (line chart)
- Error rate trend (line chart)
- MTTR trend (line chart)

**Business Impact Panel**:
- Time saved today (number)
- Recommendations generated (count)
- Acceptance rate (percentage)
- User satisfaction (stars)

---

### Weekly Report

**Executive Summary**:
- System uptime: X%
- Active users: X of Y (Z%)
- Time saved: X hours
- User satisfaction: X/5.0

**Key Metrics**:
- Recommendation acceptance rate: X%
- Average confidence score: X
- Error rate: X%
- MTTR: X minutes

**Issues & Actions**:
- Top 3 errors
- Escalation summary
- Improvement actions

---

### Monthly Report

**Business Impact**:
- Total time saved: X hours
- Documentation quality: X%
- Compliance flag reduction: X%
- User satisfaction trend

**Technical Performance**:
- System availability: X%
- Error rate: X%
- MTTR: X minutes
- DLQ success rate: X%

**Adoption & Usage**:
- Active users: X%
- Feature utilization: X%
- Time to proficiency: X days
- Support tickets: X

**Conversation Quality**:
- Resolution rate: X%
- Fallback rate: X%
- Escalation rate: X%
- CSAT: X/5.0

**Recommendations**:
- Top 3 improvement opportunities
- Action items for next month
- Resource requirements

---

## Data Collection & Storage

### Dataverse Tables

**snf_operation_log**:
- All operations with success/failure
- Correlation IDs
- Duration metrics
- Error details

**snf_hitl_audit**:
- HITL review outcomes
- Edit history
- Approval/rejection reasons

**snf_confidence_metric**:
- Confidence scores
- Uncertainty factors
- Calibration metrics

**snf_user_analytics**:
- User activity
- Feature usage
- Time savings

---

### Copilot Studio Analytics

**Conversation Analytics**:
- Session count
- Conversation outcomes
- Topic performance
- Fallback triggers

**User Analytics**:
- Active users
- Engagement rate
- Satisfaction scores

---

### Application Insights (Optional)

**Custom Metrics**:
- Recommendation generation time
- AI model latency
- External API response times

**Custom Events**:
- HITL approval events
- Error events
- Feature usage events

---

## Targets & Thresholds

### Green (Healthy)
- System availability: >99.9%
- Error rate: <0.1%
- User satisfaction: >4.5/5.0
- Acceptance rate: >80%

### Yellow (Warning)
- System availability: 99-99.9%
- Error rate: 0.1-0.5%
- User satisfaction: 4.0-4.5/5.0
- Acceptance rate: 70-80%

### Red (Critical)
- System availability: <99%
- Error rate: >0.5%
- User satisfaction: <4.0/5.0
- Acceptance rate: <70%

---

## Continuous Improvement Process

### Weekly Review
1. Review key metrics dashboard
2. Identify top 3 issues
3. Assign owners for investigation
4. Track action items

### Monthly Review
1. Analyze monthly trends
2. Compare to targets
3. Identify improvement opportunities
4. Update priorities

### Quarterly Review
1. Comprehensive metric analysis
2. Business impact assessment
3. ROI calculation
4. Strategic planning

---

## Success Criteria

### 3-Month Success
- ✅ System availability >99.9%
- ✅ User satisfaction >4.5/5.0
- ✅ Time saved >30 minutes/day
- ✅ Adoption rate >70%

### 6-Month Success
- ✅ System availability >99.95%
- ✅ User satisfaction >4.7/5.0
- ✅ Time saved >45 minutes/day
- ✅ Adoption rate >80%
- ✅ Error rate <0.05%

### 12-Month Success
- ✅ System availability >99.99%
- ✅ User satisfaction >4.8/5.0
- ✅ Time saved >60 minutes/day
- ✅ Adoption rate >90%
- ✅ Error rate <0.01%
- ✅ MTTR <3 minutes

---

**Document Version**: 1.0  
**Last Updated**: 2026-04-17  
**Status**: Final  
**Next Review**: 2026-05-17

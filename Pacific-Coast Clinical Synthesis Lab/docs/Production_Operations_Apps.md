# Production Operations Apps & Flows

## Overview
This document outlines the additional Power Platform components needed for world-class production operations of the SNF Rehab Agent. These apps and flows enable monitoring, alerting, incident response, and operational excellence.

---

## Required Components

### 1. Operations Dashboard (Power BI + Model-Driven App)

#### Purpose
Real-time visibility into system health, performance, and reliability metrics

#### Components

**Power BI Dashboard** - Real-time metrics visualization
- **System Health Panel**
  - Circuit breaker states (Closed/Open/HalfOpen) by operation
  - Bulkhead utilization (active/queued/rejected) by operation
  - DLQ queue depth and abandonment rate
  - Notification queue depth and failure rate
  
- **Performance Panel**
  - P50/P95/P99 latency by operation type
  - Request throughput (requests/minute)
  - Error rate trending (last 24h, 7d, 30d)
  - MTTR trending
  
- **Reliability Panel**
  - Success rate by operation (last 1h, 24h, 7d)
  - Retry success rate
  - Idempotency hit rate (prevented duplicates)
  - Correlation ID coverage
  
- **Business Metrics Panel**
  - Recommendations generated per hour
  - HITL approval rate
  - Average confidence score
  - High-priority patient count

**Model-Driven App** - Operational management
- **Circuit Breaker Management**
  - View all circuit breaker states
  - Manual reset capability
  - State transition history
  - Alert configuration
  
- **Dead Letter Queue Management**
  - View pending/failed operations
  - Manual retry capability
  - Abandon operations
  - View error details with correlation ID
  
- **Notification Queue Management**
  - View pending notifications
  - Manual retry/cancel
  - View delivery history
  
- **Operation Log Viewer**
  - Search by correlation ID
  - Filter by operation type, success/failure
  - View error details
  - Export for analysis

#### Data Sources
- Dataverse tables: snf_operation_log, snf_circuit_breaker_state, snf_bulkhead_state, snf_dead_letter_queue, snf_notification_queue
- Application Insights (if available)
- Custom metrics from workflows

---

### 2. Automated Monitoring Flows

#### 2.1 Health Check Flow
**Trigger**: Scheduled (every 5 minutes)

**Purpose**: Proactive health monitoring and alerting

**Checks**:
- Circuit breaker states (alert if any Open)
- Bulkhead utilization (alert if >80% for >10 minutes)
- DLQ queue depth (alert if >50 items)
- DLQ abandonment rate (alert if >20% in last hour)
- Notification queue depth (alert if >100 items)
- Error rate spike detection (alert if >2x baseline)
- Correlation ID coverage (alert if <95%)

**Actions**:
- Send Teams alert to ops channel
- Create incident in incident management system
- Log health check results to Dataverse
- Trigger auto-remediation flows (if configured)

**Implementation**:
```json
{
  "name": "System Health Check",
  "trigger": {
    "type": "recurrence",
    "recurrence": {
      "frequency": "Minute",
      "interval": 5
    }
  },
  "actions": [
    "Check_Circuit_Breakers",
    "Check_Bulkhead_Utilization",
    "Check_DLQ_Depth",
    "Check_Error_Rate",
    "Evaluate_Health_Score",
    "Send_Alerts_If_Unhealthy"
  ]
}
```

---

#### 2.2 SLA Monitoring Flow
**Trigger**: Scheduled (every 15 minutes)

**Purpose**: Track and alert on SLA violations

**Metrics Tracked**:
- Recommendation generation time (SLA: <30s)
- HITL response time (SLA: <2 hours)
- Error rate (SLA: <0.1%)
- Availability (SLA: 99.9%)
- MTTR (SLA: <5 minutes)

**Actions**:
- Calculate SLA compliance percentage
- Send alerts on SLA violations
- Create SLA reports for stakeholders
- Trigger escalation for repeated violations

---

#### 2.3 Anomaly Detection Flow
**Trigger**: Scheduled (every 10 minutes)

**Purpose**: Detect unusual patterns that may indicate issues

**Detections**:
- Sudden spike in error rate (>3 standard deviations)
- Unusual drop in request volume (>50% decrease)
- Latency spike (>2x P95 baseline)
- Confidence score drop (>20% decrease in average)
- Unusual operation patterns (e.g., all requests to one facility)

**Actions**:
- Send anomaly alert with details
- Capture baseline metrics for comparison
- Suggest potential root causes
- Link to relevant runbooks

---

#### 2.4 Capacity Planning Flow
**Trigger**: Scheduled (daily at 2 AM)

**Purpose**: Proactive capacity planning and forecasting

**Analysis**:
- Request volume trending (7d, 30d, 90d)
- Bulkhead utilization trending
- DLQ growth rate
- Storage usage (Dataverse table sizes)
- Projected capacity needs (next 30/60/90 days)

**Actions**:
- Generate capacity report
- Send to operations team
- Alert if capacity threshold approaching (>70%)
- Recommend scaling actions

---

### 3. Incident Response Flows

#### 3.1 Auto-Remediation Flow
**Trigger**: Manual or automated (from health check)

**Purpose**: Automated recovery actions for common issues

**Remediation Actions**:
- **Circuit Breaker Stuck Open**: Attempt manual reset after cooldown
- **DLQ Backlog**: Increase processor frequency temporarily
- **Bulkhead Saturation**: Increase concurrent limits temporarily
- **Notification Queue Backlog**: Switch to alternative channel (email)
- **High Error Rate**: Enable additional logging, notify on-call

**Safety**:
- Require approval for production changes
- Log all remediation actions
- Rollback capability
- Rate limiting (max 3 auto-remediations per hour)

---

#### 3.2 Incident Escalation Flow
**Trigger**: Manual or automated (from health check)

**Purpose**: Structured incident escalation and communication

**Escalation Levels**:
- **Level 1** (Low): Ops team notification
- **Level 2** (Medium): On-call engineer paged
- **Level 3** (High): Engineering manager + product owner notified
- **Level 4** (Critical): Executive team notified, war room initiated

**Actions**:
- Create incident record in Dataverse
- Send notifications per escalation level
- Create Teams channel for incident
- Start incident timeline
- Notify stakeholders
- Link to relevant runbooks

---

#### 3.3 Incident Communication Flow
**Trigger**: Incident created or updated

**Purpose**: Keep stakeholders informed during incidents

**Communications**:
- Initial notification (incident detected)
- Status updates (every 15 minutes during active incident)
- Resolution notification
- Post-incident report

**Channels**:
- Teams (ops channel, incident channel)
- Email (stakeholders)
- SMS (critical incidents only)
- Status page update (if available)

---

### 4. Operational Automation Flows

#### 4.1 Log Cleanup Flow
**Trigger**: Scheduled (daily at 3 AM)

**Purpose**: Maintain Dataverse storage limits and performance

**Actions**:
- Archive operation logs >90 days to Azure Blob Storage
- Delete DLQ records with status=succeeded and >30 days old
- Delete notification queue records with status=succeeded and >7 days old
- Delete circuit breaker logs >90 days
- Delete bulkhead logs >30 days
- Generate cleanup report

---

#### 4.2 Metrics Aggregation Flow
**Trigger**: Scheduled (hourly)

**Purpose**: Pre-calculate metrics for dashboard performance

**Aggregations**:
- Hourly success rate by operation
- Hourly error count by error type
- Hourly P50/P95/P99 latency
- Hourly recommendation count
- Hourly HITL approval rate

**Storage**: snf_metrics_hourly table

---

#### 4.3 Report Generation Flow
**Trigger**: Scheduled (weekly on Monday at 8 AM)

**Purpose**: Automated operational reports for stakeholders

**Reports**:
- **Weekly Operations Report**
  - System uptime and availability
  - Error rate and top errors
  - Performance metrics (latency, throughput)
  - Reliability metrics (retry success, DLQ processing)
  - Incidents and resolutions
  
- **Weekly Business Report**
  - Recommendations generated
  - HITL approval rate
  - Average confidence score
  - User adoption metrics
  - Top facilities by usage

**Distribution**: Email to stakeholders, post to Teams channel

---

#### 4.4 Compliance Audit Flow
**Trigger**: Scheduled (monthly on 1st at 9 AM)

**Purpose**: Generate compliance audit reports

**Audit Items**:
- Correlation ID coverage (should be 100%)
- Idempotency key usage (should be 100% for writes)
- Log sanitization (PII should be stripped)
- Audit trail completeness (21 CFR Part 11)
- Data retention compliance (HIPAA)
- Error handling coverage (should be 100%)

**Output**: Compliance audit report with pass/fail status

---

### 5. Developer Support Flows

#### 5.1 Correlation ID Trace Flow
**Trigger**: Manual (from model-driven app)

**Purpose**: End-to-end request tracing for troubleshooting

**Input**: Correlation ID

**Output**:
- All operations with that correlation ID
- Timeline of operations
- Success/failure status
- Error details (if any)
- Related records (recommendation, HITL audit, etc.)
- Visualization of request flow

---

#### 5.2 Error Pattern Analysis Flow
**Trigger**: Manual or scheduled (daily)

**Purpose**: Identify recurring error patterns

**Analysis**:
- Group errors by error code
- Identify top 10 errors by frequency
- Detect error patterns (e.g., all from one facility)
- Suggest root causes
- Link to relevant documentation

**Output**: Error pattern report with recommendations

---

### 6. Testing & Validation Flows

#### 6.1 Synthetic Transaction Flow
**Trigger**: Scheduled (every 15 minutes)

**Purpose**: Proactive availability monitoring

**Actions**:
- Execute end-to-end test transaction
- Measure latency
- Verify expected results
- Alert if test fails or latency exceeds threshold

**Test Scenarios**:
- Generate recommendation for test patient
- Submit HITL approval
- Generate XAI explanation
- Calculate confidence score

---

#### 6.2 Chaos Engineering Flow
**Trigger**: Manual (scheduled during maintenance windows)

**Purpose**: Validate resilience patterns

**Chaos Experiments**:
- Simulate Azure ML timeout
- Simulate Dataverse throttling
- Simulate circuit breaker open
- Simulate bulkhead saturation
- Simulate notification failure

**Validation**:
- Verify graceful degradation
- Verify error boundaries work
- Verify DLQ captures failures
- Verify correlation IDs propagate
- Verify user experience remains acceptable

---

## Implementation Priority

### Phase 1 (Critical - Week 3)
1. ✅ Background processors (NotificationQueueProcessor, DeadLetterQueueProcessor)
2. ⏳ Health Check Flow
3. ⏳ Operations Dashboard (basic version)
4. ⏳ Incident Escalation Flow

### Phase 2 (High - Week 4)
5. ⏳ SLA Monitoring Flow
6. ⏳ Auto-Remediation Flow
7. ⏳ Log Cleanup Flow
8. ⏳ Correlation ID Trace Flow

### Phase 3 (Medium - Week 5-6)
9. ⏳ Anomaly Detection Flow
10. ⏳ Capacity Planning Flow
11. ⏳ Report Generation Flow
12. ⏳ Synthetic Transaction Flow

### Phase 4 (Nice-to-Have - Week 7-8)
13. ⏳ Incident Communication Flow
14. ⏳ Metrics Aggregation Flow
15. ⏳ Error Pattern Analysis Flow
16. ⏳ Compliance Audit Flow
17. ⏳ Chaos Engineering Flow

---

## Dataverse Tables for Operations

### snf_health_check_result
- snf_health_check_resultid (guid)
- snf_timestamp (datetime)
- snf_overall_health_score (number, 0-100)
- snf_circuit_breaker_health (choice: Healthy, Warning, Critical)
- snf_bulkhead_health (choice: Healthy, Warning, Critical)
- snf_dlq_health (choice: Healthy, Warning, Critical)
- snf_error_rate_health (choice: Healthy, Warning, Critical)
- snf_alerts_generated (number)
- snf_details (string, JSON)

### snf_incident
- snf_incidentid (guid)
- snf_title (string)
- snf_severity (choice: Low, Medium, High, Critical)
- snf_status (choice: Open, Investigating, Resolved, Closed)
- snf_detected_time (datetime)
- snf_resolved_time (datetime)
- snf_mttr_minutes (number)
- snf_root_cause (string)
- snf_resolution (string)
- snf_correlation_ids (string, comma-separated)
- snf_assigned_to (lookup: systemuser)

### snf_sla_metric
- snf_sla_metricid (guid)
- snf_metric_name (string)
- snf_target_value (number)
- snf_actual_value (number)
- snf_compliance_percentage (number)
- snf_period_start (datetime)
- snf_period_end (datetime)
- snf_status (choice: Met, Violated, AtRisk)

### snf_metrics_hourly
- snf_metrics_hourlyid (guid)
- snf_hour_timestamp (datetime)
- snf_operation (string)
- snf_request_count (number)
- snf_success_count (number)
- snf_error_count (number)
- snf_success_rate (number)
- snf_p50_latency_ms (number)
- snf_p95_latency_ms (number)
- snf_p99_latency_ms (number)

---

## Power Apps Required

### 1. Operations Center App (Model-Driven)
**Purpose**: Central hub for operations team

**Features**:
- Dashboard with key metrics
- Circuit breaker management
- DLQ management
- Notification queue management
- Incident management
- Correlation ID search
- Manual remediation actions

**Users**: Operations team, on-call engineers

---

### 2. Reliability Dashboard App (Canvas)
**Purpose**: Executive-friendly reliability metrics

**Features**:
- Real-time system health score
- SLA compliance trending
- Incident history and MTTR
- Business metrics (recommendations, approvals)
- Mobile-friendly design

**Users**: Engineering managers, product owners, executives

---

### 3. Troubleshooting Assistant App (Canvas)
**Purpose**: Self-service troubleshooting for support team

**Features**:
- Correlation ID lookup
- Error code lookup
- Common issues and solutions
- Escalation workflow
- Link to runbooks

**Users**: Support team, therapists (for self-service)

---

## Integration with Azure Services (Optional but Recommended)

### Application Insights
- Deeper performance monitoring
- Custom metrics and events
- Advanced querying with KQL
- Integration with Azure Monitor alerts

### Azure Monitor
- Unified alerting across Power Platform and Azure
- Action groups for notifications
- Alert rules for complex conditions
- Integration with PagerDuty, ServiceNow, etc.

### Azure Logic Apps (Alternative to Power Automate)
- More complex orchestration scenarios
- Better performance for high-volume scenarios
- Integration with Azure services
- Advanced error handling

### Azure Blob Storage
- Long-term log archival
- Compliance data retention
- Cost-effective storage for historical data

---

## Cost Considerations

### Power Platform Licensing
- **Power Automate**: Premium connectors for Dataverse (included in Dynamics 365 licenses)
- **Power BI**: Pro licenses for dashboard viewers, Premium for large datasets
- **Power Apps**: Per-app or per-user licenses for model-driven apps

### Dataverse Storage
- Monitor table sizes (operation logs can grow quickly)
- Implement retention policies
- Archive to Azure Blob Storage for cost savings

### Estimated Costs (for 100 users, 10K requests/day)
- Power Automate flows: ~$500/month (included in many licenses)
- Power BI Pro licenses (10 users): ~$100/month
- Dataverse storage (50GB): ~$200/month
- Azure Blob Storage (archival): ~$10/month
- **Total**: ~$810/month (excluding user licenses)

---

## Success Metrics

### Operational Excellence
- MTTR < 5 minutes (target achieved)
- Incident detection time < 2 minutes (automated)
- False positive alert rate < 5%
- SLA compliance > 99%

### Developer Productivity
- Time to troubleshoot issues reduced by 80% (correlation IDs)
- Time to identify root cause reduced by 70% (dashboards)
- Deployment confidence increased (synthetic transactions)

### Business Value
- System uptime > 99.9%
- User satisfaction > 4.5/5.0
- Support ticket volume reduced by 80%
- Compliance audit pass rate 100%

---

## Conclusion

To achieve world-class production operations, you need:

**Must-Have** (Phase 1):
1. ✅ Background processors (already created)
2. Health Check Flow
3. Operations Dashboard
4. Incident Escalation Flow

**Should-Have** (Phase 2-3):
5. SLA Monitoring
6. Auto-Remediation
7. Log Cleanup
8. Correlation ID Trace

**Nice-to-Have** (Phase 4):
9. Advanced analytics and reporting
10. Chaos engineering automation
11. Compliance automation

The reliability patterns you've already implemented (error boundaries, circuit breakers, bulkheads, DLQ) are the foundation. These operational apps and flows make that foundation visible, manageable, and continuously improving.

---

**Document Version**: 1.0  
**Last Updated**: 2026-04-17  
**Status**: Planning Document  
**Next Steps**: Prioritize Phase 1 components for implementation

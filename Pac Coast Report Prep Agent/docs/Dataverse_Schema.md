# Dataverse Schema Documentation

## Overview
This document defines the Dataverse tables required for the SNF Rehab Agent reliability hardening implementation. All tables follow Microsoft Dataverse naming conventions and include proper indexing for performance.

## Table Naming Convention
- Prefix: `snf_` (SNF Rehab Agent)
- Format: snake_case
- Primary keys: `{table_name}id` (e.g., `snf_operation_logid`)

---

## Reliability & Observability Tables

### snf_operation_log
**Purpose**: Comprehensive logging of all operations for observability and troubleshooting

| Column Name | Type | Required | Description | Indexed |
|------------|------|----------|-------------|---------|
| snf_operation_logid | guid | Yes | Primary key | Yes (PK) |
| snf_operation | string(100) | Yes | Operation identifier (e.g., "azureml_prediction") | Yes |
| snf_operation_type | choice | Yes | Type: http, dataverse_query, dataverse_write, flow_invoke | Yes |
| snf_success | boolean | Yes | Whether operation succeeded | Yes |
| snf_attempts | number | Yes | Number of attempts made | No |
| snf_correlation_id | string(50) | Yes | Correlation ID for distributed tracing | Yes |
| snf_timestamp | datetime | Yes | Operation timestamp | Yes |
| snf_duration_ms | number | No | Duration in milliseconds | No |
| snf_last_error | string(max) | No | JSON serialized error details | No |

**Indexes**:
- Primary: `snf_operation_logid`
- Composite: `(snf_operation, snf_timestamp DESC)`
- Composite: `(snf_correlation_id, snf_timestamp DESC)`
- Single: `snf_success`

**Retention**: 90 days (archive older records)

---

### snf_dead_letter_queue
**Purpose**: Capture failed operations for later retry or manual intervention

| Column Name | Type | Required | Description | Indexed |
|------------|------|----------|-------------|---------|
| snf_dead_letter_queueid | guid | Yes | Primary key | Yes (PK) |
| snf_operation | string(100) | Yes | Operation identifier | Yes |
| snf_operation_type | choice | Yes | Type: http, dataverse_query, dataverse_write, flow_invoke | Yes |
| snf_payload | string(max) | Yes | JSON serialized operation config (max 100KB) | No |
| snf_error | string(max) | Yes | JSON serialized error details | No |
| snf_correlation_id | string(50) | Yes | Correlation ID for tracing | Yes |
| snf_timestamp | datetime | Yes | When operation first failed | Yes |
| snf_retry_count | number | Yes | Current retry attempt count | No |
| snf_max_retries | number | Yes | Maximum retries allowed (default: 5) | No |
| snf_next_retry | datetime | Yes | Scheduled next retry time | Yes |
| snf_status | choice | Yes | Status: pending, processing, succeeded, failed, abandoned | Yes |

**Indexes**:
- Primary: `snf_dead_letter_queueid`
- Composite: `(snf_status, snf_next_retry ASC)` (for processor query)
- Single: `snf_correlation_id`
- Single: `snf_operation`

**Retention**: 30 days for succeeded/abandoned, indefinite for pending/failed

---

### snf_notification_queue
**Purpose**: Queue notifications for reliable delivery with retry logic

| Column Name | Type | Required | Description | Indexed |
|------------|------|----------|-------------|---------|
| snf_notification_queueid | guid | Yes | Primary key | Yes (PK) |
| snf_channel | choice | Yes | Channel: teams, email, sms | Yes |
| snf_payload | string(max) | Yes | JSON serialized notification content | No |
| snf_recipient | string(200) | Yes | Recipient identifier (email, phone, user ID) | No |
| snf_retry_count | number | Yes | Current retry attempt count | No |
| snf_max_retries | number | Yes | Maximum retries allowed (default: 5) | No |
| snf_next_retry | datetime | Yes | Scheduled next retry time | Yes |
| snf_status | choice | Yes | Status: pending, processing, succeeded, failed | Yes |
| snf_correlation_id | string(50) | Yes | Correlation ID for tracing | Yes |
| snf_timestamp | datetime | Yes | When notification was queued | Yes |

**Indexes**:
- Primary: `snf_notification_queueid`
- Composite: `(snf_status, snf_next_retry ASC)` (for processor query)
- Single: `snf_correlation_id`
- Single: `snf_channel`

**Retention**: 7 days for succeeded, 30 days for failed

---

## Circuit Breaker Tables

### snf_circuit_breaker_state
**Purpose**: Track circuit breaker state for each operation to prevent cascading failures

| Column Name | Type | Required | Description | Indexed |
|------------|------|----------|-------------|---------|
| snf_circuit_breaker_stateid | guid | Yes | Primary key | Yes (PK) |
| snf_operation | string(100) | Yes | Operation identifier (unique) | Yes (Unique) |
| snf_state | choice | Yes | State: Closed, Open, HalfOpen | Yes |
| snf_failure_count | number | Yes | Consecutive failures in current window | No |
| snf_last_failure_time | datetime | No | Timestamp of last failure | No |
| snf_last_success_time | datetime | No | Timestamp of last success | No |
| snf_opened_time | datetime | No | When circuit was opened | No |
| snf_half_open_attempts | number | Yes | Attempts made in half-open state | No |
| snf_last_state_change | datetime | Yes | When state last changed | Yes |

**Indexes**:
- Primary: `snf_circuit_breaker_stateid`
- Unique: `snf_operation`
- Single: `snf_state`

**Retention**: Indefinite (operational state)

---

### snf_circuit_breaker_log
**Purpose**: Audit log of circuit breaker state transitions and events

| Column Name | Type | Required | Description | Indexed |
|------------|------|----------|-------------|---------|
| snf_circuit_breaker_logid | guid | Yes | Primary key | Yes (PK) |
| snf_operation | string(100) | Yes | Operation identifier | Yes |
| snf_event_type | choice | Yes | Event: StateTransition, ManualReset, UnexpectedSuccess | Yes |
| snf_from_state | choice | Yes | Previous state | No |
| snf_to_state | choice | Yes | New state | No |
| snf_timestamp | datetime | Yes | Event timestamp | Yes |
| snf_reason | string(500) | No | Human-readable reason | No |
| snf_failure_count | number | No | Failure count at time of event | No |
| snf_error_details | string(max) | No | JSON serialized error details | No |

**Indexes**:
- Primary: `snf_circuit_breaker_logid`
- Composite: `(snf_operation, snf_timestamp DESC)`
- Single: `snf_event_type`

**Retention**: 90 days (archive older records)

---

## Bulkhead Tables

### snf_bulkhead_state
**Purpose**: Track active and queued requests per operation for resource isolation

| Column Name | Type | Required | Description | Indexed |
|------------|------|----------|-------------|---------|
| snf_bulkhead_stateid | guid | Yes | Primary key | Yes (PK) |
| snf_operation | string(100) | Yes | Operation identifier (unique) | Yes (Unique) |
| snf_active_count | number | Yes | Current active requests | No |
| snf_queued_count | number | Yes | Current queued requests | No |
| snf_total_rejected | number | Yes | Total rejected requests (lifetime) | No |
| snf_max_concurrent | number | Yes | Maximum concurrent requests allowed | No |
| snf_max_queued | number | Yes | Maximum queued requests allowed | No |
| snf_last_updated | datetime | Yes | Last state update timestamp | Yes |

**Indexes**:
- Primary: `snf_bulkhead_stateid`
- Unique: `snf_operation`

**Retention**: Indefinite (operational state)

---

### snf_bulkhead_request
**Purpose**: Track individual requests in bulkhead (active and queued)

| Column Name | Type | Required | Description | Indexed |
|------------|------|----------|-------------|---------|
| snf_bulkhead_requestid | guid | Yes | Primary key | Yes (PK) |
| snf_operation | string(100) | Yes | Operation identifier | Yes |
| snf_request_id | string(50) | Yes | Unique request identifier | Yes |
| snf_status | choice | Yes | Status: Active, Queued | Yes |
| snf_queued_time | datetime | No | When request was queued | No |
| snf_acquired_time | datetime | No | When slot was acquired | No |
| snf_timeout_seconds | number | Yes | Timeout for this request | No |
| snf_timeout_time | datetime | No | Calculated timeout timestamp | Yes |

**Indexes**:
- Primary: `snf_bulkhead_requestid`
- Composite: `(snf_operation, snf_status)`
- Unique: `snf_request_id`
- Single: `snf_timeout_time` (for cleanup)

**Retention**: Auto-delete after completion (transient data)

---

### snf_bulkhead_log
**Purpose**: Audit log of bulkhead events (acquisitions, rejections, timeouts)

| Column Name | Type | Required | Description | Indexed |
|------------|------|----------|-------------|---------|
| snf_bulkhead_logid | guid | Yes | Primary key | Yes (PK) |
| snf_operation | string(100) | Yes | Operation identifier | Yes |
| snf_event_type | choice | Yes | Event: RequestAcquired, RequestQueued, RequestRejected, RequestTimeout | Yes |
| snf_request_id | string(50) | Yes | Request identifier | No |
| snf_timestamp | datetime | Yes | Event timestamp | Yes |
| snf_reason | string(500) | No | Human-readable reason | No |
| snf_active_count | number | No | Active count at time of event | No |
| snf_queued_count | number | No | Queued count at time of event | No |

**Indexes**:
- Primary: `snf_bulkhead_logid`
- Composite: `(snf_operation, snf_timestamp DESC)`
- Single: `snf_event_type`

**Retention**: 30 days (archive older records)

---

## Enhanced Existing Tables

### snf_rehab_recommendation (add columns)
**Purpose**: Add idempotency and tracing to existing recommendation table

| Column Name | Type | Required | Description | Indexed |
|------------|------|----------|-------------|---------|
| snf_idempotency_key | string(50) | Yes | Unique key to prevent duplicates | Yes (Unique) |
| snf_correlation_id | string(50) | Yes | Correlation ID for distributed tracing | Yes |

**Migration**: Add columns to existing table, backfill with generated values

---

### snf_hitl_audit (add columns)
**Purpose**: Add tracing to HITL audit records

| Column Name | Type | Required | Description | Indexed |
|------------|------|----------|-------------|---------|
| snf_correlation_id | string(50) | Yes | Correlation ID for distributed tracing | Yes |

**Migration**: Add column to existing table, backfill with generated values

---

### snf_error_log (add columns)
**Purpose**: Add tracing and sanitization tracking to error logs

| Column Name | Type | Required | Description | Indexed |
|------------|------|----------|-------------|---------|
| snf_correlation_id | string(50) | Yes | Correlation ID for distributed tracing | Yes |
| snf_sanitized | boolean | Yes | Indicates PII was stripped (default: false) | No |

**Migration**: Add columns to existing table, backfill with default values

---

## Choice Field Definitions

### snf_operation_type
- `http` - HTTP API call
- `dataverse_query` - Dataverse ListRecords operation
- `dataverse_write` - Dataverse CreateRecord/UpdateRecord operation
- `flow_invoke` - Power Automate workflow invocation
- `notification` - Notification delivery

### snf_circuit_breaker_state
- `Closed` - Normal operation, requests allowed
- `Open` - Circuit open, requests blocked
- `HalfOpen` - Testing if service recovered

### snf_circuit_breaker_event_type
- `StateTransition` - State changed (Closed → Open, etc.)
- `ManualReset` - Manually reset by operator
- `UnexpectedSuccess` - Success while circuit open

### snf_bulkhead_status
- `Active` - Request currently executing
- `Queued` - Request waiting for slot

### snf_bulkhead_event_type
- `RequestAcquired` - Slot acquired immediately
- `RequestQueued` - Request added to queue
- `RequestRejected` - Request rejected (bulkhead full)
- `RequestTimeout` - Request timed out in queue

### snf_dlq_status
- `pending` - Waiting for retry
- `processing` - Currently being retried
- `succeeded` - Retry succeeded
- `failed` - Retry failed (will retry again)
- `abandoned` - Max retries exceeded

### snf_notification_status
- `pending` - Waiting for delivery
- `processing` - Currently being sent
- `succeeded` - Delivered successfully
- `failed` - Delivery failed (max retries exceeded)

### snf_notification_channel
- `teams` - Microsoft Teams
- `email` - Email
- `sms` - SMS text message

---

## Deployment Script

```powershell
# PowerShell script to create Dataverse tables
# Run with appropriate Dataverse connection

# Example for snf_operation_log
New-DataverseTable -Name "snf_operation_log" -DisplayName "Operation Log" -PluralName "Operation Logs" -Columns @(
    @{Name="snf_operation"; Type="String"; MaxLength=100; Required=$true},
    @{Name="snf_operation_type"; Type="Choice"; Required=$true; Options=@("http","dataverse_query","dataverse_write","flow_invoke","notification")},
    @{Name="snf_success"; Type="Boolean"; Required=$true},
    @{Name="snf_attempts"; Type="Number"; Required=$true},
    @{Name="snf_correlation_id"; Type="String"; MaxLength=50; Required=$true},
    @{Name="snf_timestamp"; Type="DateTime"; Required=$true},
    @{Name="snf_duration_ms"; Type="Number"; Required=$false},
    @{Name="snf_last_error"; Type="String"; MaxLength=-1; Required=$false}
)

# Create indexes
New-DataverseIndex -Table "snf_operation_log" -Columns @("snf_operation", "snf_timestamp") -Name "idx_operation_timestamp"
New-DataverseIndex -Table "snf_operation_log" -Columns @("snf_correlation_id", "snf_timestamp") -Name "idx_correlation_timestamp"
New-DataverseIndex -Table "snf_operation_log" -Columns @("snf_success") -Name "idx_success"

# Repeat for all tables...
```

---

## Performance Considerations

### Indexing Strategy
- All primary keys are clustered indexes
- Composite indexes for common query patterns (operation + timestamp)
- Correlation ID indexed for distributed tracing queries
- Status fields indexed for processor queries

### Data Retention
- **Hot data** (0-7 days): Full performance, all indexes
- **Warm data** (8-90 days): Archived to separate partition
- **Cold data** (90+ days): Moved to Azure Blob Storage for compliance

### Query Optimization
- Use `fetchXml` with `top` clause to limit results
- Filter on indexed columns first
- Avoid `SELECT *` - specify required columns
- Use pagination for large result sets

---

## Security & Compliance

### Data Classification
- **PII**: Patient tokens (tokenized, not actual PHI)
- **Sensitive**: Error messages (sanitized before logging)
- **Public**: Operation metrics, timestamps

### Access Control
- **Read**: All authenticated users (for troubleshooting)
- **Write**: System service accounts only
- **Delete**: Administrators only (for GDPR compliance)

### Audit Requirements
- All table modifications logged per 21 CFR Part 11
- Correlation IDs enable end-to-end audit trails
- Retention policies comply with HIPAA (6 years minimum)

---

---

## Clinical Accuracy Tables

### snf_clinical_validation
**Purpose**: Store individual clinical validation records for accuracy tracking

| Column Name | Type | Required | Description | Indexed |
|------------|------|----------|-------------|---------|
| snf_clinical_validationid | guid | Yes | Primary key | Yes (PK) |
| snf_recommendation_id | guid | Yes | FK to snf_rehab_recommendation | Yes |
| snf_validation_result | choice | Yes | Result: accurate, minor_issues, inaccurate | Yes |
| snf_inaccuracy_reason | choice | No | Reason: wrong_type, missing_info, wrong_reasoning, inappropriate, other | No |
| snf_validator_id | string(50) | Yes | User ID of validator | Yes |
| snf_validator_name | string(200) | Yes | Display name of validator | No |
| snf_confidence_at_validation | number | Yes | Confidence score at time of validation | No |
| snf_validation_timestamp | datetime | Yes | When validation occurred | Yes |
| snf_correlation_id | string(50) | Yes | Correlation ID for tracing | Yes |
| snf_notes | string(max) | No | Additional notes from validator | No |

**Indexes**:
- Primary: `snf_clinical_validationid`
- Composite: `(snf_validator_id, snf_validation_timestamp DESC)`
- Single: `snf_validation_result`
- Single: `snf_recommendation_id`

**Retention**: 6 years (HIPAA compliance)

---

### snf_clinical_accuracy_metric
**Purpose**: Store aggregated accuracy metrics by recommendation type

| Column Name | Type | Required | Description | Indexed |
|------------|------|----------|-------------|---------|
| snf_clinical_accuracy_metricid | guid | Yes | Primary key | Yes (PK) |
| snf_recommendation_type | choice | Yes | Type: RecertFull, RecertPartial, Discharge, ContinueTreatment, ModifyTreatment, Overall | Yes |
| snf_accuracy_score | number | Yes | Overall accuracy percentage (0-100) | No |
| snf_precision_score | number | No | Precision percentage (0-100) | No |
| snf_recall_score | number | No | Recall percentage (0-100) | No |
| snf_f1_score | number | No | F1 score (0-100) | No |
| snf_sample_size | number | Yes | Number of validations in sample | No |
| snf_time_period | string(50) | Yes | Period: last_7_days, last_30_days, last_90_days | Yes |
| snf_last_updated | datetime | Yes | When metrics were calculated | Yes |
| snf_true_positives | number | No | Count of accurate validations | No |
| snf_minor_issues | number | No | Count of minor issues validations | No |
| snf_false_positives | number | No | Count of inaccurate validations | No |
| snf_inter_rater_reliability | number | No | Cohen's Kappa score (0-1) | No |
| snf_clinical_validator_count | number | No | Number of unique validators | No |

**Indexes**:
- Primary: `snf_clinical_accuracy_metricid`
- Composite: `(snf_recommendation_type, snf_time_period)`
- Single: `snf_last_updated`

**Retention**: 2 years (trend analysis)

---

### snf_accuracy_issue
**Purpose**: Track issues identified from inaccurate recommendations

| Column Name | Type | Required | Description | Indexed |
|------------|------|----------|-------------|---------|
| snf_accuracy_issueid | guid | Yes | Primary key | Yes (PK) |
| snf_recommendation_id | guid | Yes | FK to snf_rehab_recommendation | Yes |
| snf_issue_type | choice | Yes | Type: wrong_type, missing_info, wrong_reasoning, inappropriate, other | Yes |
| snf_description | string(max) | No | Detailed description of the issue | No |
| snf_reported_by | string(200) | Yes | Name of person who reported | No |
| snf_confidence_at_issue | number | Yes | Confidence score when issue occurred | No |
| snf_reported_timestamp | datetime | Yes | When issue was reported | Yes |
| snf_status | choice | Yes | Status: open, investigating, resolved, wont_fix | Yes |
| snf_priority | choice | Yes | Priority: low, medium, high, critical | Yes |
| snf_assigned_to | string(200) | No | Person assigned to investigate | No |
| snf_resolution | string(max) | No | Resolution details | No |
| snf_resolved_timestamp | datetime | No | When issue was resolved | No |
| snf_correlation_id | string(50) | Yes | Correlation ID for tracing | Yes |

**Indexes**:
- Primary: `snf_accuracy_issueid`
- Composite: `(snf_status, snf_priority, snf_reported_timestamp DESC)`
- Single: `snf_issue_type`
- Single: `snf_recommendation_id`

**Retention**: 2 years

---

### snf_inter_rater_reliability
**Purpose**: Store inter-rater reliability calculations (Cohen's Kappa)

| Column Name | Type | Required | Description | Indexed |
|------------|------|----------|-------------|---------|
| snf_inter_rater_reliabilityid | guid | Yes | Primary key | Yes (PK) |
| snf_kappa_score | number | Yes | Cohen's Kappa score (0-1) | No |
| snf_agreement_level | string(50) | Yes | Level: Almost Perfect, Substantial, Moderate, Poor | No |
| snf_sample_size | number | Yes | Number of validations in calculation | No |
| snf_validator_count | number | Yes | Number of unique validators | No |
| snf_calculation_date | datetime | Yes | When calculation was performed | Yes |
| snf_time_period | string(50) | Yes | Period: last_30_days, last_90_days | Yes |
| snf_confidence_interval_low | number | No | Lower bound of 95% CI | No |
| snf_confidence_interval_high | number | No | Upper bound of 95% CI | No |
| snf_notes | string(max) | No | Additional analysis notes | No |

**Indexes**:
- Primary: `snf_inter_rater_reliabilityid`
- Composite: `(snf_time_period, snf_calculation_date DESC)`

**Retention**: 2 years

---

### snf_expert_review
**Purpose**: Track structured clinical expert reviews

| Column Name | Type | Required | Description | Indexed |
|------------|------|----------|-------------|---------|
| snf_expert_reviewid | guid | Yes | Primary key | Yes (PK) |
| snf_recommendation_id | guid | Yes | FK to snf_rehab_recommendation | Yes |
| snf_expert_id | string(50) | Yes | User ID of clinical expert | Yes |
| snf_expert_name | string(200) | Yes | Display name of expert | No |
| snf_accuracy_rating | choice | Yes | Rating: accurate, minor, inaccurate | Yes |
| snf_issues_identified | string(max) | No | Issues noted by expert | No |
| snf_review_timestamp | datetime | Yes | When review occurred | Yes |
| snf_review_session_id | guid | Yes | ID of review session (for grouping) | Yes |
| snf_correlation_id | string(50) | Yes | Correlation ID for tracing | Yes |

**Indexes**:
- Primary: `snf_expert_reviewid`
- Composite: `(snf_expert_id, snf_review_timestamp DESC)`
- Single: `snf_review_session_id`
- Single: `snf_recommendation_id`

**Retention**: 6 years (HIPAA compliance)

---

## Additional Choice Field Definitions

### snf_validation_result
- `accurate` - Recommendation was clinically accurate
- `minor_issues` - Minor issues but acceptable
- `inaccurate` - Recommendation was clinically inaccurate

### snf_inaccuracy_reason
- `wrong_type` - Wrong recommendation type selected
- `missing_info` - Missing critical information
- `wrong_reasoning` - Incorrect clinical reasoning
- `inappropriate` - Inappropriate for patient
- `other` - Other reason

### snf_recommendation_type
- `RecertFull` - Full recertification
- `RecertPartial` - Partial recertification
- `Discharge` - Discharge recommendation
- `ContinueTreatment` - Continue current treatment
- `ModifyTreatment` - Modify treatment plan
- `Overall` - Overall metrics (not type-specific)

### snf_issue_status
- `open` - Issue reported, not yet investigated
- `investigating` - Under investigation
- `resolved` - Issue resolved
- `wont_fix` - Will not be fixed (documented reason)

### snf_issue_priority
- `low` - Low priority
- `medium` - Medium priority
- `high` - High priority
- `critical` - Critical priority

### snf_time_period
- `last_7_days` - Last 7 days
- `last_30_days` - Last 30 days
- `last_90_days` - Last 90 days

---

**Document Version**: 1.1  
**Last Updated**: 2026-04-17  
**Status**: Phase 2 Implementation - Clinical Accuracy Added  
**Author**: Senior Reliability Engineer

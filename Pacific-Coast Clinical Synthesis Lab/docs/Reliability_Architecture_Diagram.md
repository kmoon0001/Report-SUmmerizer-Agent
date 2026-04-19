# Reliability Architecture Diagram

## System Overview with Reliability Patterns

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          SNF Rehab Agent - Reliability Architecture          │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  USER INTERFACE LAYER                                                        │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  Microsoft Teams / Copilot Studio                                     │  │
│  │  - Adaptive Cards (WCAG 2.1 AA compliant)                            │  │
│  │  - User-friendly error messages (no technical jargon)                │  │
│  │  - Graceful degradation notifications                                │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  COPILOT STUDIO TOPICS (Error Boundaries)                                   │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  ┌─────────────────────┐  ┌─────────────────────┐                    │  │
│  │  │ HITL Post-Gen Review│  │ Automated Workflow  │                    │  │
│  │  │ ✅ Error Boundaries │  │ Orchestrator        │                    │  │
│  │  │ ✅ Fallback Paths   │  │ ✅ Error Boundaries │                    │  │
│  │  │ ✅ User Messages    │  │ ✅ Cache Fallback   │                    │  │
│  │  └─────────────────────┘  └─────────────────────┘                    │  │
│  │                                                                        │  │
│  │  Pattern: Scope + ConditionGroup                                      │  │
│  │  ┌────────────────────────────────────────────────────────────────┐  │  │
│  │  │ try_operation:                                                  │  │  │
│  │  │   - InvokeFlowAction (with timeout + correlationId)            │  │  │
│  │  │ handle_result:                                                  │  │  │
│  │  │   - if_succeeded: Continue workflow                            │  │  │
│  │  │   - if_failed: Execute fallback strategy                       │  │  │
│  │  └────────────────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  SHARED UTILITY LAYER (Reusable Reliability Patterns)                       │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  SharedUtilities_WithRetry.json                                       │  │
│  │  ┌────────────────────────────────────────────────────────────────┐  │  │
│  │  │ 1. Initialize Correlation Context                              │  │  │
│  │  │    - Generate or propagate correlation ID                      │  │  │
│  │  │    - Track parent operation                                    │  │  │
│  │  │                                                                 │  │  │
│  │  │ 2. Check Circuit Breaker                                       │  │  │
│  │  │    - Query circuit breaker service                            │  │  │
│  │  │    - If OPEN: Return 503 immediately                          │  │  │
│  │  │    - If CLOSED: Proceed to retry loop                         │  │  │
│  │  │                                                                 │  │  │
│  │  │ 3. Retry Loop (Until success or max retries)                  │  │  │
│  │  │    - Calculate exponential backoff with jitter                │  │  │
│  │  │    - Wait (0s → 2s → 4s → 8s → 16s, max 45s)                 │  │  │
│  │  │    - Execute operation (HTTP, Dataverse, Flow)               │  │  │
│  │  │    - For Dataverse writes: Check idempotency key first       │  │  │
│  │  │    - If success: Notify circuit breaker, return result       │  │  │
│  │  │    - If failure: Classify error (retryable vs non-retryable) │  │  │
│  │  │                                                                 │  │  │
│  │  │ 4. Handle Final Result                                         │  │  │
│  │  │    - If success: Log to snf_operation_log, return 200        │  │  │
│  │  │    - If failure: Log error, queue to DLQ, return 503         │  │  │
│  │  └────────────────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    ▼                 ▼                 ▼
┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
│ CIRCUIT BREAKER      │  │ IDEMPOTENCY CHECK    │  │ DEAD-LETTER QUEUE    │
│ SERVICE              │  │ (Dataverse)          │  │ (Dataverse)          │
├──────────────────────┤  ├──────────────────────┤  ├──────────────────────┤
│ State: CLOSED/OPEN   │  │ Query by idempotency │  │ Failed operations    │
│ Failure count        │  │ key before create    │  │ Retry schedule       │
│ Last failure time    │  │ Return existing if   │  │ Max 5 retries        │
│ Reset timeout: 60s   │  │ found (no duplicate) │  │ Exponential backoff  │
│                      │  │ Create new if not    │  │ Manual intervention  │
│ Prevents cascading   │  │ found                │  │ possible             │
│ failures             │  │                      │  │                      │
└──────────────────────┘  └──────────────────────┘  └──────────────────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    ▼                 ▼                 ▼
┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
│ EXTERNAL SERVICES    │  │ DATAVERSE            │  │ NOTIFICATION QUEUE   │
│                      │  │                      │  │                      │
├──────────────────────┤  ├──────────────────────┤  ├──────────────────────┤
│ Azure ML             │  │ snf_operation_log    │  │ Teams notifications  │
│ - Timeout: 30s       │  │ - All operations     │  │ - Retry on failure   │
│ - Retry: 4x          │  │ - Correlation IDs    │  │ - Email fallback     │
│ - Bulkhead: 10 max   │  │ - Duration tracking  │  │ - Queue for later    │
│                      │  │                      │  │                      │
│ SHAP Calculation     │  │ snf_error_log        │  │ Background processor │
│ - Timeout: 60s       │  │ - Sanitized errors   │  │ - Runs every 5 min   │
│ - Fallback: Simple   │  │ - No PII/secrets     │  │ - Exponential backoff│
│   explanation        │  │ - Correlation IDs    │  │                      │
│                      │  │                      │  │                      │
│ Teams Webhook        │  │ snf_dead_letter_queue│  │                      │
│ - Timeout: 15s       │  │ - Failed operations  │  │                      │
│ - Retry: 2x          │  │ - Retry schedule     │  │                      │
│ - Queue on failure   │  │ - Correlation IDs    │  │                      │
└──────────────────────┘  └──────────────────────┘  └──────────────────────┘
```

## Reliability Pattern Flow

### Happy Path (No Errors)
```
User Request
    │
    ▼
Topic (with error boundary)
    │
    ▼
SharedUtilities_WithRetry
    │
    ├─> Check Circuit Breaker (CLOSED)
    │
    ├─> Execute Operation (SUCCESS on attempt 1)
    │
    ├─> Notify Circuit Breaker (success)
    │
    ├─> Log to snf_operation_log
    │
    └─> Return result to Topic
        │
        ▼
    Topic continues workflow
        │
        ▼
    User receives result
```

### Transient Error Path (Retry Success)
```
User Request
    │
    ▼
Topic (with error boundary)
    │
    ▼
SharedUtilities_WithRetry
    │
    ├─> Check Circuit Breaker (CLOSED)
    │
    ├─> Attempt 1: Execute Operation (TIMEOUT)
    │   └─> Classify: Retryable
    │
    ├─> Wait 2s + jitter
    │
    ├─> Attempt 2: Execute Operation (SUCCESS)
    │
    ├─> Notify Circuit Breaker (success)
    │
    ├─> Log to snf_operation_log (2 attempts)
    │
    └─> Return result to Topic
        │
        ▼
    Topic continues workflow
        │
        ▼
    User receives result (slight delay, but success)
```

### Persistent Error Path (Retry Exhausted)
```
User Request
    │
    ▼
Topic (with error boundary)
    │
    ▼
SharedUtilities_WithRetry
    │
    ├─> Check Circuit Breaker (CLOSED)
    │
    ├─> Attempt 1: Execute Operation (503 Service Unavailable)
    │   └─> Classify: Retryable
    │
    ├─> Wait 2s + jitter
    ├─> Attempt 2: Execute Operation (503)
    │
    ├─> Wait 4s + jitter
    ├─> Attempt 3: Execute Operation (503)
    │
    ├─> Wait 8s + jitter
    ├─> Attempt 4: Execute Operation (503)
    │
    ├─> Wait 16s + jitter
    ├─> Attempt 5: Execute Operation (503)
    │
    ├─> Notify Circuit Breaker (failure x5)
    │   └─> Circuit Breaker opens (future requests fail fast)
    │
    ├─> Log to snf_error_log
    │
    ├─> Queue to snf_dead_letter_queue
    │
    └─> Return 503 to Topic
        │
        ▼
    Topic error boundary catches failure
        │
        ├─> Send user-friendly message
        │   "I'm having trouble connecting. Let me try a different approach."
        │
        └─> Execute fallback strategy
            │
            ├─> Option A: Use cached data
            ├─> Option B: Redirect to manual workflow
            └─> Option C: Escalate to human
                │
                ▼
            User continues with degraded service
```

### Circuit Breaker Open Path (Fail Fast)
```
User Request
    │
    ▼
Topic (with error boundary)
    │
    ▼
SharedUtilities_WithRetry
    │
    ├─> Check Circuit Breaker (OPEN)
    │   └─> Last failure: 30s ago
    │   └─> Reset timeout: 60s
    │   └─> Time remaining: 30s
    │
    ├─> Return 503 immediately (no retry attempted)
    │   └─> "Service temporarily unavailable, retry after 30s"
    │
    └─> Return to Topic
        │
        ▼
    Topic error boundary catches failure
        │
        └─> Execute fallback strategy immediately
            │
            ▼
        User receives degraded service (fast failure, no waiting)
```

## Correlation ID Flow

```
User Request
    │
    ├─> Generate Correlation ID: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
    │
    ▼
Topic: AutomatedWorkflowOrchestrator
    │
    ├─> Log: "Starting workflow, correlationId=a1b2c3d4..."
    │
    ├─> InvokeFlowAction: GetUserContext
    │   └─> Pass correlationId in input
    │       │
    │       ▼
    │   Workflow: GetUserContext
    │       │
    │       ├─> Log: "Getting user context, correlationId=a1b2c3d4..."
    │       │
    │       ├─> HTTP Call to User API
    │       │   └─> Header: X-Correlation-ID: a1b2c3d4...
    │       │
    │       └─> Return result
    │
    ├─> InvokeFlowAction: AutomatedTherapistDailyWorkflow
    │   └─> Pass correlationId in input
    │       │
    │       ▼
    │   Workflow: AutomatedTherapistDailyWorkflow
    │       │
    │       ├─> Log: "Starting daily workflow, correlationId=a1b2c3d4..."
    │       │
    │       ├─> InvokeFlowAction: SharedUtilities_WithRetry
    │       │   └─> Pass correlationId in input
    │       │       │
    │       │       ▼
    │       │   Workflow: SharedUtilities_WithRetry
    │       │       │
    │       │       ├─> Log: "Retry attempt 1, correlationId=a1b2c3d4..."
    │       │       │
    │       │       ├─> HTTP Call to Azure ML
    │       │       │   └─> Header: X-Correlation-ID: a1b2c3d4...
    │       │       │
    │       │       ├─> Log: "Operation succeeded, correlationId=a1b2c3d4..."
    │       │       │
    │       │       └─> Return result
    │       │
    │       └─> Return briefing
    │
    └─> Return to user

All logs searchable by correlationId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
```

## Idempotency Flow

```
User approves AI recommendation
    │
    ▼
Topic: HITL_PostGenerationReview
    │
    ├─> Generate Idempotency Key: "rec-12345-abc"
    │
    ├─> InvokeFlowAction: SharedUtilities_WithRetry
    │   └─> operationType: "dataverse_write"
    │   └─> idempotencyKey: "rec-12345-abc"
    │       │
    │       ▼
    │   Workflow: SharedUtilities_WithRetry
    │       │
    │       ├─> Attempt 1: Create Record
    │       │   │
    │       │   ├─> Query: Check if record with idempotencyKey exists
    │       │   │   └─> Result: Not found
    │       │   │
    │       │   ├─> Create new record with idempotencyKey
    │       │   │   └─> Network timeout (operation may or may not have succeeded)
    │       │   │
    │       │   └─> Classify: Retryable (timeout)
    │       │
    │       ├─> Wait 2s + jitter
    │       │
    │       ├─> Attempt 2: Create Record
    │       │   │
    │       │   ├─> Query: Check if record with idempotencyKey exists
    │       │   │   └─> Result: FOUND (created in attempt 1)
    │       │   │
    │       │   ├─> Return existing record (no duplicate created)
    │       │   │
    │       │   └─> Mark as success
    │       │
    │       └─> Return result
    │
    └─> Continue workflow

Result: Only ONE record created, despite timeout and retry
```

## Dead-Letter Queue Processing

```
Background Job (runs every 15 minutes)
    │
    ├─> Query snf_dead_letter_queue
    │   └─> WHERE status = 'pending'
    │   └─> AND next_retry <= NOW()
    │   └─> ORDER BY timestamp ASC
    │
    ├─> For each queued operation:
    │   │
    │   ├─> Check retry_count < max_retries
    │   │   │
    │   │   ├─> If YES:
    │   │   │   │
    │   │   │   ├─> Update status = 'processing'
    │   │   │   │
    │   │   │   ├─> Invoke SharedUtilities_WithRetry
    │   │   │   │   └─> With original operation config
    │   │   │   │
    │   │   │   ├─> If SUCCESS:
    │   │   │   │   └─> Update status = 'succeeded'
    │   │   │   │   └─> Remove from queue
    │   │   │   │
    │   │   │   └─> If FAILURE:
    │   │   │       └─> Increment retry_count
    │   │   │       └─> Calculate next_retry (exponential backoff)
    │   │   │       │   └─> 15min → 30min → 1hr → 2hr → 4hr
    │   │   │       └─> Update status = 'pending'
    │   │   │
    │   │   └─> If NO (max retries exceeded):
    │   │       └─> Update status = 'abandoned'
    │   │       └─> Send alert to operations team
    │   │       └─> Requires manual intervention
    │
    └─> Log processing summary
```

## Monitoring & Alerting

```
Application Insights Dashboard
    │
    ├─> Real-Time Metrics
    │   ├─> Error rate (target: <0.1%)
    │   ├─> Response time p95 (target: <3s)
    │   ├─> Circuit breaker state
    │   └─> Active correlation IDs
    │
    ├─> Alerts (PagerDuty / Teams)
    │   ├─> Error rate > 5% (5 min window) → Critical
    │   ├─> Circuit breaker opens → High
    │   ├─> DLQ items > 100 → Medium
    │   └─> Response time p95 > 5s → Medium
    │
    └─> Logs (Log Analytics)
        ├─> snf_operation_log (all operations)
        ├─> snf_error_log (errors only)
        ├─> snf_dead_letter_queue (failed operations)
        └─> Query by correlation ID for troubleshooting
```

---

**Document Version**: 1.0  
**Last Updated**: 2026-04-17  
**Author**: Senior Reliability Engineer

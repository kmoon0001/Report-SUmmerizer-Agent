# Error Handling & Resilience Guide

## Overview
This document defines comprehensive error handling, retry logic, graceful degradation, and resilience patterns for the SNF Rehab Agent following Microsoft Learn best practices and production-grade reliability standards.

## Architecture Principles

### 1. Defense in Depth
Multiple layers of error handling:
- **Layer 1**: Input validation and sanitization
- **Layer 2**: Operation-level try-catch with retries
- **Layer 3**: Circuit breakers for failing services
- **Layer 4**: Graceful degradation with fallbacks
- **Layer 5**: User-friendly error messaging
- **Layer 6**: Comprehensive logging and alerting

### 2. Fail Fast, Recover Gracefully
- Detect errors immediately
- Classify by severity and retryability
- Apply appropriate recovery strategy
- Never leave users in ambiguous states

### 3. Transparent Failures
- Clear error messages explaining what happened
- Actionable guidance on what users can do
- No technical jargon in user-facing messages
- Complete technical details in logs

## Error Classification

### Transient Errors (Retryable)
**Characteristics**: Temporary issues that typically resolve themselves

**Examples**:
- Network timeouts
- Service temporarily unavailable (503)
- Rate limiting / throttling (429)
- Database deadlocks
- Temporary connection failures

**Strategy**: Exponential backoff with jitter, up to 4 retries

**User Message**: "I'm experiencing a temporary issue. Let me try that again for you."

### Configuration Errors (Non-Retryable, Fixable)
**Characteristics**: Missing or incorrect configuration

**Examples**:
- Unauthorized (401) - missing/invalid credentials
- Forbidden (403) - insufficient permissions
- Not Found (404) - endpoint doesn't exist
- Invalid API keys

**Strategy**: Alert technical team, provide fallback functionality

**User Message**: "I don't have access to complete that action right now. I've notified our technical team."

### User Errors (Non-Retryable, User-Fixable)
**Characteristics**: Invalid input or unsupported requests

**Examples**:
- Invalid input format
- Missing required fields
- Unsupported operation
- Validation failures

**Strategy**: Provide clear guidance on how to fix

**User Message**: "I had trouble understanding that request. Here's what you can do..."

### Critical Errors (Non-Retryable, Requires Investigation)
**Characteristics**: Unexpected failures requiring immediate attention

**Examples**:
- Unhandled exceptions
- Data corruption
- Security violations
- System crashes

**Strategy**: Save state, alert on-call team, escalate to human

**User Message**: "I've encountered an unexpected error. Our technical team has been notified."

## Retry Patterns

### Exponential Backoff with Jitter

**Formula**:
```
delay = min(initialDelay * 2^(attemptNumber - 1), maxDelay) + random(0, 1000ms)
```

**Default Configuration**:
- Initial delay: 2 seconds
- Max retries: 4
- Max delay: 45 seconds
- Jitter: 0-1000ms

**Example Sequence**:
1. Attempt 1: Immediate
2. Attempt 2: 2s + jitter
3. Attempt 3: 4s + jitter
4. Attempt 4: 8s + jitter
5. Attempt 5: 16s + jitter

**Implementation**: See `EnhancedRetryLogic.json` workflow

### Retry Policy by Operation Type

| Operation | Max Retries | Initial Delay | Max Delay | Timeout |
|-----------|-------------|---------------|-----------|---------|
| Azure ML Prediction | 4 | 2s | 45s | 30s |
| Dataverse Query | 3 | 1s | 30s | 30s |
| Dataverse Write | 3 | 2s | 30s | 30s |
| Teams Notification | 2 | 1s | 15s | 15s |
| SHAP Calculation | 4 | 3s | 60s | 60s |
| Confidence Scoring | 3 | 2s | 45s | 30s |

### When NOT to Retry
- User errors (400 Bad Request)
- Authentication failures (401 Unauthorized)
- Authorization failures (403 Forbidden)
- Resource not found (404 Not Found)
- Validation errors (422 Unprocessable Entity)
- Any error explicitly marked as non-retryable

## Circuit Breaker Pattern

### Purpose
Prevent cascading failures by stopping requests to failing services

### States

**Closed (Normal Operation)**:
- All requests pass through
- Failures are counted
- Threshold: 5 failures in 60 seconds → Open

**Open (Service Failing)**:
- All requests immediately fail
- No requests sent to failing service
- Timeout: 60 seconds → Half-Open

**Half-Open (Testing Recovery)**:
- Limited requests allowed through
- Success → Closed
- Failure → Open

### Implementation

**Circuit Breaker Service** (separate microservice):
- Tracks failure counts per operation type
- Maintains state (Closed/Open/Half-Open)
- Provides health check endpoint
- Resets after timeout period

**Integration**:
```json
{
  "Check_Circuit_Breaker": {
    "type": "HTTP",
    "inputs": {
      "method": "GET",
      "uri": "@parameters('circuitBreakerEndpoint')/status/@{operation}"
    }
  }
}
```

**Failure Notification**:
```json
{
  "Notify_Circuit_Breaker": {
    "type": "HTTP",
    "inputs": {
      "method": "POST",
      "uri": "@parameters('circuitBreakerEndpoint')/failure/@{operation}",
      "body": {
        "timestamp": "@utcNow()",
        "error": "@result('Try_Operation')[0]['error']"
      }
    }
  }
}
```

## Graceful Degradation

### Degradation Levels

**Level 0: Full Functionality**
- All services available
- AI generation, SHAP, confidence scoring
- Real-time data access
- Teams notifications

**Level 1: AI Degraded**
- Dataverse available
- Teams available
- Search available
- No AI generation (manual documentation)
- No SHAP explanations
- Historical data access only

**Level 2: Data Degraded**
- AI services available
- Teams available
- Search available
- No real-time patient data
- Cached data only
- Read-only mode

**Level 3: Minimal Functionality**
- Search available
- Static content only
- Knowledge base queries
- Documentation guidelines
- No patient-specific features

### Fallback Strategies

**AI Generation Failure**:
1. Attempt retry with exponential backoff
2. If circuit breaker open, provide template-based output
3. Offer manual documentation workflow
4. Provide documentation guidelines
5. Log for later batch processing

**Dataverse Failure**:
1. Attempt retry with exponential backoff
2. Check local cache for recent data
3. Provide read-only access to cached data
4. Queue write operations for later
5. Alert user of degraded mode

**Teams Notification Failure**:
1. Attempt retry (2 attempts max)
2. Queue notification for later delivery
3. Send email as fallback
4. Log notification for manual follow-up
5. Continue workflow (non-blocking)

**SHAP Calculation Failure**:
1. Attempt retry with longer timeout
2. Use simplified feature importance
3. Provide confidence score without SHAP
4. Show data provenance only
5. Flag for later explanation generation

## Error Boundaries

### Copilot Studio Error Boundary
**Location**: `OnError.mcs.yml` topic

**Responsibilities**:
- Catch all unhandled errors
- Classify error severity
- Apply retry logic for transient errors
- Provide user-friendly messaging
- Log to Dataverse
- Escalate critical errors

**User Experience**:
- Never show raw error messages
- Always provide next steps
- Offer alternative actions
- Maintain conversation context

### Power Automate Error Boundary
**Location**: Scope actions with error handling

**Pattern**:
```json
{
  "Try_Operation": {
    "type": "Scope",
    "actions": {
      "Risky_Operation": { }
    }
  },
  "Handle_Error": {
    "type": "ConditionGroup",
    "expression": {
      "equals": ["@result('Try_Operation')[0]['status']", "Failed"]
    },
    "actions": {
      "Log_Error": { },
      "Apply_Fallback": { }
    },
    "runAfter": {
      "Try_Operation": ["Succeeded", "Failed", "TimedOut"]
    }
  }
}
```

### Azure ML Error Boundary
**Location**: HTTP action with timeout and retry policy

**Configuration**:
```json
{
  "Call_Azure_ML": {
    "type": "HTTP",
    "inputs": {
      "method": "POST",
      "uri": "@parameters('azureMLEndpoint')",
      "timeout": "PT30S"
    },
    "retryPolicy": {
      "type": "exponential",
      "count": 4,
      "interval": "PT7.5S",
      "minimumInterval": "PT5S",
      "maximumInterval": "PT45S"
    }
  }
}
```

## Health Monitoring

### System Health Checks
**Frequency**: Every 30 seconds when degraded, every 5 minutes when healthy

**Checks**:
- Dataverse connectivity (simple query)
- Azure ML endpoint (health ping)
- Teams webhook (test message)
- Search service (test query)

**Implementation**: See `CheckSystemHealth.json` workflow

### Health Status Response
```json
{
  "dataverseHealthy": true,
  "azureMLHealthy": false,
  "teamsHealthy": true,
  "searchHealthy": true,
  "allHealthy": false,
  "lastCheckTime": "2026-04-16T10:30:00Z",
  "estimatedRestoration": "Approximately 15 minutes (85% confidence)"
}
```

### Automatic Recovery
- Health checks run continuously
- When services restore, users are notified
- Queued operations are processed
- Circuit breakers reset
- Normal operation resumes

## Logging & Alerting

### Error Logging
**Destination**: `snf_error_log` Dataverse table

**Fields**:
- Error code and message
- Stack trace (if available)
- User context (ID, name, role)
- Conversation context
- Timestamp
- Severity
- Retry attempts
- Resolution status

### Alert Thresholds

**Immediate Alerts** (PagerDuty/Teams):
- Critical errors
- Circuit breaker opens
- Security violations
- Data corruption detected
- Service completely unavailable

**Hourly Digest**:
- Configuration errors
- High error rates (>5% of requests)
- Degraded performance
- Retry exhaustion

**Daily Summary**:
- Error trends
- Most common errors
- User impact metrics
- Resolution times

### Alert Routing

| Severity | Destination | Response Time |
|----------|-------------|---------------|
| Critical | On-call engineer (PagerDuty) | 15 minutes |
| High | Technical team (Teams) | 1 hour |
| Medium | Email digest | 4 hours |
| Low | Daily report | 24 hours |

## User Experience Guidelines

### Error Message Template
```
[What Happened]
I'm experiencing a temporary issue connecting to our systems.

[What We're Doing]
Let me try that again for you.

[What You Can Do]
If this continues, you can:
- Try rephrasing your request
- Use the menu options below
- Contact IT support at [contact]

[Error Reference]
Error Code: [code] | Time: [timestamp]
```

### Progressive Disclosure
1. **Initial Message**: Simple, user-friendly explanation
2. **Details (expandable)**: Technical error code and timestamp
3. **Actions**: Clear next steps
4. **Help**: Link to support or documentation

### Conversation Recovery
- Save conversation state before errors
- Offer to resume after recovery
- Don't make users repeat themselves
- Maintain context across retries

## Testing Error Scenarios

### Chaos Engineering
**Purpose**: Validate resilience under failure conditions

**Scenarios**:
1. **Network Partition**: Simulate Dataverse unavailable
2. **Latency Injection**: Add 10s delay to Azure ML
3. **Rate Limiting**: Trigger 429 responses
4. **Partial Failure**: One service fails, others succeed
5. **Cascading Failure**: Multiple services fail sequentially

**Tools**:
- Azure Chaos Studio
- Power Automate test framework
- Copilot Studio test cases

### Error Injection
**Method**: Environment variables to force errors

**Examples**:
```
FORCE_AZUREML_TIMEOUT=true
FORCE_DATAVERSE_503=true
FORCE_CIRCUIT_BREAKER_OPEN=true
```

### Monitoring During Tests
- Error rates
- Retry success rates
- Circuit breaker state changes
- User experience (time to recovery)
- Alert accuracy

## Compliance Considerations

### Audit Requirements
- All errors logged with full context
- User actions during errors captured
- Recovery actions documented
- Alert responses tracked

### Data Integrity
- Transactional operations use rollback
- Partial writes are prevented
- Data consistency checks after recovery
- Audit trail maintained during errors

### User Notification
- Users informed of degraded service
- Estimated restoration time provided
- Alternative workflows offered
- No PHI exposed in error messages

## Performance Impact

### Retry Overhead
- Max additional latency: ~75 seconds (4 retries with backoff)
- Average additional latency: ~15 seconds (1-2 retries)
- Circuit breaker reduces wasted retries

### Caching Strategy
- Cache frequently accessed data (5-minute TTL)
- Serve from cache during degradation
- Invalidate cache on successful writes
- Reduces load on failing services

### Resource Limits
- Max concurrent retries: 10 per operation type
- Circuit breaker prevents resource exhaustion
- Timeout enforcement prevents hung operations
- Queue depth limits for fallback operations

## Continuous Improvement

### Error Analysis
- Weekly review of error patterns
- Identify systemic issues
- Update retry policies based on data
- Refine error messages based on feedback

### Metrics to Track
- Error rate by type
- Retry success rate
- Circuit breaker activations
- Mean time to recovery (MTTR)
- User impact (sessions affected)

### Optimization Opportunities
- Adjust retry delays based on observed patterns
- Tune circuit breaker thresholds
- Improve fallback strategies
- Enhance error messages

---

**Document Version**: 1.0  
**Last Updated**: 2026-04-16  
**Next Review**: 2026-07-16

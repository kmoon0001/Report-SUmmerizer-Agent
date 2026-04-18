# Reliability Hotspot Analysis

## Overview
Comprehensive analysis of all reliability hotspots in the SNF Rehab Agent codebase, identifying areas requiring error boundaries, timeouts, retries, circuit breakers, bulkheads, and other resilience patterns.

## Methodology
1. Identified all InvokeFlowAction calls (40+ instances)
2. Identified all HTTP calls in workflows
3. Identified all Dataverse operations
4. Classified by risk level and failure impact
5. Mapped to reliability patterns needed

## Critical Hotspots (High Risk, High Impact)

### 1. AI Generation Pipeline
**Location**: `AutomatedTherapistDailyWorkflow.json` - Line 89
**Operation**: `Call_AI_Generation_With_Retry`
**Current State**: Has retry logic via EnhancedRetryLogic wrapper
**Risk**: High - Core functionality, external dependency (Azure ML)
**Impact**: High - Blocks entire workflow if fails

**Missing Patterns**:
- ✅ Timeout: 30s (implemented)
- ✅ Retry: 4 attempts with exponential backoff (implemented)
- ✅ Circuit breaker: Integrated (implemented)
- ❌ Bulkhead: No resource limits per therapist
- ❌ Fallback: No template-based generation fallback
- ❌ Idempotency: No idempotency key for duplicate prevention

**Recommended Enhancements**:
```json
{
  "Call_AI_Generation_With_Bulkhead": {
    "type": "HTTP",
    "inputs": {
      "method": "POST",
      "uri": "@parameters('flowEndpoint')/enhanced-retry-logic",
      "body": {
        "operation": "azureml_prediction",
        "operationData": {
          "patientData": "@body('Query_Patient_Rehab_Data')",
          "recommendationType": "auto_detect",
          "idempotencyKey": "@guid()"
        },
        "maxRetries": 4,
        "initialDelaySeconds": 2,
        "bulkheadConfig": {
          "maxConcurrentCalls": 10,
          "maxQueuedCalls": 20,
          "timeoutSeconds": 30
        }
      }
    },
    "limit": {
      "count": 10,
      "timeout": "PT30S"
    }
  }
}
```

### 2. SHAP Calculation
**Location**: `HITL_PostGenerationReview.mcs.yml` - invoke_calculate_shap
**Operation**: `CalculateSHAPValues` workflow
**Current State**: Direct invocation, no error handling
**Risk**: Medium - Non-critical but valuable feature
**Impact**: Medium - Degrades XAI capability

**Missing Patterns**:
- ❌ Timeout: No explicit timeout
- ❌ Retry: No retry logic
- ❌ Circuit breaker: Not integrated
- ❌ Fallback: No simplified explanation fallback
- ❌ Error boundary: Failure crashes topic

**Recommended Enhancement**:
```yaml
- kind: Scope
  id: try_calculate_shap
  actions:
    - kind: InvokeFlowAction
      id: invoke_calculate_shap
      input:
        recommendationId: =Topic.OutputId
        patientFeatures: =Topic.AIOutput.sourceData
        modelOutput: =Topic.AIOutput.prediction
        timeout: 60
      output: Topic.SHAPResult
      flowName: CalculateSHAPValues

- kind: ConditionGroup
  id: handle_shap_result
  conditions:
    - id: if_shap_succeeded
      condition: =result('try_calculate_shap')[0]['status'] = "Succeeded"
      actions:
        - kind: SetVariable
          id: set_shap_summary
          variable: Topic.ShapSummary
          value: =Topic.SHAPResult.summary
    
    - id: if_shap_failed
      condition: =result('try_calculate_shap')[0]['status'] = "Failed"
      actions:
        - kind: SetVariable
          id: set_fallback_explanation
          variable: Topic.ShapSummary
          value: "Detailed explanation temporarily unavailable. Confidence score and data provenance are still shown."
        
        - kind: InvokeFlowAction
          id: log_shap_failure
          input:
            operation: "calculate_shap"
            error: =result('try_calculate_shap')[0]['error']
            severity: "Medium"
          output: Topic.LogResult
          flowName: LogErrorToDataverse
```

### 3. Dataverse Write Operations
**Location**: Multiple locations - CreateRecord actions
**Operation**: Patient data, recommendations, audit logs
**Current State**: Direct writes, no transaction management
**Risk**: High - Data integrity critical
**Impact**: High - Audit trail corruption, data loss

**Missing Patterns**:
- ❌ Idempotency: Duplicate records possible
- ❌ Transaction management: No rollback on partial failure
- ❌ Compensating actions: No cleanup on failure
- ❌ Dead-letter queue: Failed writes lost
- ❌ Retry with backoff: Uses default retry only

**Recommended Enhancement**:
```json
{
  "Create_Recommendation_With_Idempotency": {
    "type": "Microsoft.Dataverse/CreateRecord",
    "inputs": {
      "entityName": "snf_rehab_recommendation",
      "item": {
        "snf_idempotency_key": "@guid()",
        "snf_patient_token": "@variables('patientToken')",
        "snf_recommendation_text": "@variables('recommendationText')",
        "snf_created_timestamp": "@utcNow()"
      }
    },
    "retryPolicy": {
      "type": "exponential",
      "count": 3,
      "interval": "PT2S",
      "minimumInterval": "PT1S",
      "maximumInterval": "PT30S"
    },
    "runAfter": {
      "Check_Idempotency_Key": ["Succeeded"]
    }
  },
  "Handle_Create_Failure": {
    "type": "ConditionGroup",
    "expression": {
      "equals": ["@result('Create_Recommendation_With_Idempotency')[0]['status']", "Failed"]
    },
    "actions": {
      "Queue_To_Dead_Letter": {
        "type": "Microsoft.Dataverse/CreateRecord",
        "inputs": {
          "entityName": "snf_dead_letter_queue",
          "item": {
            "snf_operation": "create_recommendation",
            "snf_payload": "@string(variables('recommendationData'))",
            "snf_error": "@result('Create_Recommendation_With_Idempotency')[0]['error']",
            "snf_timestamp": "@utcNow()",
            "snf_retry_count": 0
          }
        }
      }
    },
    "runAfter": {
      "Create_Recommendation_With_Idempotency": ["Failed", "TimedOut"]
    }
  }
}
```

## Medium Hotspots (Medium Risk, Medium Impact)

### 4. User Context Retrieval
**Location**: `AutomatedWorkflowOrchestrator.mcs.yml` - invoke_get_user_context
**Operation**: `GetUserContextAndPreferences` workflow
**Current State**: Direct invocation, blocks workflow start
**Risk**: Medium - Cached data available
**Impact**: Medium - Delays workflow start

**Missing Patterns**:
- ❌ Timeout: No explicit timeout
- ❌ Cache fallback: No cached user context
- ❌ Default values: No sensible defaults

**Recommended Enhancement**:
```yaml
- kind: InvokeFlowAction
  id: invoke_get_user_context
  input:
    userId: =User.Id
    userName: =User.DisplayName
    timestamp: =utcNow()
    timeout: 10
  output: Topic.UserContext
  flowName: GetUserContextAndPreferences
  continueOnError: true

- kind: ConditionGroup
  id: handle_context_result
  conditions:
    - id: if_context_failed
      condition: =result('invoke_get_user_context')[0]['status'] != "Succeeded"
      actions:
        - kind: SetVariable
          id: use_default_context
          variable: Topic.UserContext
          value:
            role: "PT"
            facilityId: "default"
            preferences: {}
            fromCache: true
```

### 5. Teams Notifications
**Location**: Multiple workflows - Teams webhook calls
**Operation**: Send notifications to Teams channels
**Current State**: Fire-and-forget, no retry
**Risk**: Low - Non-blocking
**Impact**: Low - Notification missed but not critical

**Missing Patterns**:
- ❌ Retry: No retry on failure
- ❌ Queue: No notification queue for later delivery
- ❌ Fallback: No email fallback

**Recommended Enhancement**:
```json
{
  "Send_Teams_Notification_With_Fallback": {
    "type": "Scope",
    "actions": {
      "Try_Teams_Webhook": {
        "type": "HTTP",
        "inputs": {
          "method": "POST",
          "uri": "@parameters('teamsWebhookUrl')",
          "body": "@variables('notificationPayload')",
          "timeout": "PT15S"
        },
        "retryPolicy": {
          "type": "exponential",
          "count": 2,
          "interval": "PT1S"
        }
      }
    }
  },
  "Handle_Teams_Failure": {
    "type": "ConditionGroup",
    "expression": {
      "equals": ["@result('Send_Teams_Notification_With_Fallback')[0]['status']", "Failed"]
    },
    "actions": {
      "Queue_Notification_For_Later": {
        "type": "Microsoft.Dataverse/CreateRecord",
        "inputs": {
          "entityName": "snf_notification_queue",
          "item": {
            "snf_channel": "teams",
            "snf_payload": "@string(variables('notificationPayload'))",
            "snf_retry_count": 0,
            "snf_max_retries": 5,
            "snf_next_retry": "@addMinutes(utcNow(), 5)"
          }
        }
      },
      "Send_Email_Fallback": {
        "type": "Office365.SendEmail",
        "inputs": {
          "to": "@variables('recipientEmail')",
          "subject": "SNF Rehab Agent Notification",
          "body": "@variables('notificationPayload')['text']"
        },
        "runAfter": {
          "Queue_Notification_For_Later": ["Succeeded"]
        }
      }
    },
    "runAfter": {
      "Send_Teams_Notification_With_Fallback": ["Failed", "TimedOut"]
    }
  }
}
```

## Low Hotspots (Low Risk, Low Impact)

### 6. Search Operations
**Location**: `Search.mcs.yml` - SearchAndSummarizeContent
**Operation**: Knowledge base search
**Current State**: Built-in action, Microsoft-managed
**Risk**: Low - Microsoft handles reliability
**Impact**: Low - Graceful degradation built-in

**Current Patterns**:
- ✅ Timeout: Built-in
- ✅ Retry: Built-in
- ✅ Fallback: Returns empty results

**No changes needed** - Microsoft-managed action already reliable

## Reliability Pattern Summary

### Patterns Needed by Hotspot

| Hotspot | Timeout | Retry | Circuit Breaker | Bulkhead | Fallback | Idempotency | DLQ |
|---------|---------|-------|-----------------|----------|----------|-------------|-----|
| AI Generation | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| SHAP Calculation | ❌ | ❌ | ❌ | ❌ | ❌ | N/A | ❌ |
| Dataverse Writes | ✅ | ⚠️ | ❌ | ❌ | ❌ | ❌ | ❌ |
| User Context | ❌ | ❌ | ❌ | ❌ | ❌ | N/A | N/A |
| Teams Notifications | ✅ | ❌ | ❌ | ❌ | ❌ | N/A | ❌ |

Legend:
- ✅ Implemented
- ⚠️ Partially implemented
- ❌ Missing
- N/A Not applicable

## Implementation Priority

### Phase 1: Critical (Week 1)
1. Add error boundaries to all InvokeFlowAction calls in topics
2. Implement idempotency for all Dataverse write operations
3. Add dead-letter queue for failed operations
4. Implement bulkheads for AI generation (resource limits)

### Phase 2: Important (Week 2)
5. Add fallback strategies for SHAP calculation
6. Implement notification queue with retry
7. Add cache fallback for user context
8. Implement transaction management for multi-step workflows

### Phase 3: Enhancement (Week 3)
9. Add compensating actions for distributed transactions
10. Implement graceful shutdown handlers
11. Add correlation IDs for distributed tracing
12. Implement log sanitization for PII/secrets

## Next Steps
1. Create shared utility workflows (withRetry, withCircuitBreaker, withTimeout)
2. Update all topic files with error boundaries
3. Update all workflow files with enhanced patterns
4. Add comprehensive observability (correlation IDs, structured logging)
5. Create runbooks for common failure scenarios
6. Implement automated recovery procedures

---

**Document Version**: 1.0  
**Last Updated**: 2026-04-17  
**Author**: Senior Reliability Engineer

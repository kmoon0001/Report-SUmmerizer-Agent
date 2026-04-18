# Developer Quick Reference: Reliability Patterns

## Overview
Quick reference for implementing reliability patterns in SNF Rehab Agent. Use these patterns consistently across all new code.

## Pattern 1: Error Boundary for InvokeFlowAction

**When to use**: Every InvokeFlowAction call in topics

**Template**:
```yaml
- kind: Scope
  id: try_operation_name
  actions:
    - kind: InvokeFlowAction
      id: invoke_operation_name
      input:
        # your inputs here
        timeout: 30  # always specify timeout
        correlationId: =guid()  # always include correlation ID
      output: Topic.ResultVariable
      flowName: YourWorkflowName

- kind: ConditionGroup
  id: handle_operation_name_result
  conditions:
    - id: if_succeeded
      condition: =result('try_operation_name')[0]['status'] = "Succeeded"
      actions:
        # success path - use Topic.ResultVariable
    
    - id: if_failed
      condition: =result('try_operation_name')[0]['status'] != "Succeeded"
      actions:
        - kind: SendActivity
          id: send_error_message
          activity:
            text: |
              [User-friendly error message explaining what happened and what to do]
        
        # Choose ONE fallback strategy:
        # Option A: Retry the dialog
        - kind: RepeatDialog
          id: retry_operation
          dialog: CurrentTopicName
        
        # Option B: Redirect to fallback workflow
        - kind: BeginDialog
          id: begin_fallback
          dialog: FallbackTopicName
          options:
            errorContext: =result('try_operation_name')[0]['error']
        
        # Option C: Escalate to human
        - kind: BeginDialog
          id: begin_escalate
          dialog: Escalate
          options:
            reason: "Operation failed"
            errorReference: =result('try_operation_name')[0]['error']?['code']
  
  runAfter:
    try_operation_name: ["Succeeded", "Failed", "TimedOut"]
```

## Pattern 2: Using Shared Retry Utility

**When to use**: For HTTP calls, Dataverse operations, or flow invocations that need retry logic

**HTTP Call Example**:
```json
{
  "Call_External_API_With_Retry": {
    "type": "Workflow",
    "inputs": {
      "host": {
        "workflowReferenceName": "SharedUtilities_WithRetry"
      },
      "body": {
        "operation": "external_api_call",
        "operationType": "http",
        "operationConfig": {
          "method": "POST",
          "uri": "@parameters('externalAPIEndpoint')/resource",
          "headers": {
            "Authorization": "Bearer @{parameters('apiKey')}",
            "Content-Type": "application/json"
          },
          "body": "@variables('requestPayload')"
        },
        "retryConfig": {
          "maxRetries": 4,
          "initialDelaySeconds": 2,
          "maxDelaySeconds": 45,
          "timeoutSeconds": 30
        },
        "correlationId": "@variables('correlationId')"
      }
    }
  }
}
```

**Dataverse Write with Idempotency Example**:
```json
{
  "Create_Record_With_Idempotency": {
    "type": "Workflow",
    "inputs": {
      "host": {
        "workflowReferenceName": "SharedUtilities_WithRetry"
      },
      "body": {
        "operation": "create_recommendation",
        "operationType": "dataverse_write",
        "operationConfig": {
          "entityName": "snf_rehab_recommendation",
          "item": {
            "snf_idempotency_key": "@guid()",
            "snf_patient_token": "@variables('patientToken')",
            "snf_recommendation_text": "@variables('recommendationText')",
            "snf_correlation_id": "@variables('correlationId')",
            "snf_timestamp": "@utcNow()"
          }
        },
        "retryConfig": {
          "maxRetries": 3,
          "initialDelaySeconds": 2,
          "timeoutSeconds": 30
        },
        "correlationId": "@variables('correlationId')"
      }
    }
  }
}
```

**Dataverse Query Example**:
```json
{
  "Query_With_Retry": {
    "type": "Workflow",
    "inputs": {
      "host": {
        "workflowReferenceName": "SharedUtilities_WithRetry"
      },
      "body": {
        "operation": "query_patient_data",
        "operationType": "dataverse_query",
        "operationConfig": {
          "entityName": "snf_patient_assignment",
          "fetchXml": "@variables('fetchXmlQuery')"
        },
        "retryConfig": {
          "maxRetries": 3,
          "initialDelaySeconds": 1,
          "timeoutSeconds": 30
        },
        "correlationId": "@variables('correlationId')"
      }
    }
  }
}
```

## Pattern 3: Fallback Strategy

**When to use**: When a non-critical operation fails but workflow should continue

**Cache Fallback Example**:
```yaml
- kind: ConditionGroup
  id: handle_api_failure
  conditions:
    - id: if_api_failed
      condition: =result('try_api_call')[0]['status'] != "Succeeded"
      actions:
        - kind: SendActivity
          id: send_cache_notice
          activity:
            text: |
              I'm using cached data. Some information may be slightly outdated.
        
        - kind: Compose
          id: use_cached_data
          variable: Topic.Data
          value: =Topic.CachedData
```

**Default Value Fallback Example**:
```yaml
- kind: ConditionGroup
  id: handle_context_failure
  conditions:
    - id: if_context_failed
      condition: =result('try_get_context')[0]['status'] != "Succeeded"
      actions:
        - kind: Compose
          id: use_default_context
          variable: Topic.UserContext
          value:
            role: "PT"
            facilityId: "default"
            preferences: {}
            fromCache: true
```

**Alternative Workflow Fallback Example**:
```yaml
- kind: ConditionGroup
  id: handle_ai_failure
  conditions:
    - id: if_ai_failed
      condition: =result('try_ai_generation')[0]['status'] != "Succeeded"
      actions:
        - kind: SendActivity
          id: send_manual_workflow_message
          activity:
            text: |
              AI generation is temporarily unavailable. Let me guide you through manual documentation.
        
        - kind: BeginDialog
          id: begin_manual_workflow
          dialog: ManualDocumentationWorkflow
          options:
            patientToken: =Topic.PatientToken
            fallbackMode: true
```

## Pattern 4: Correlation ID Propagation

**When to use**: Always, for all operations

**Initialize at Entry Point**:
```yaml
- kind: Compose
  id: initialize_correlation_id
  variable: Topic.CorrelationId
  value: =guid()
```

**Pass to All Operations**:
```yaml
- kind: InvokeFlowAction
  id: invoke_operation
  input:
    # other inputs
    correlationId: =Topic.CorrelationId
  output: Topic.Result
  flowName: OperationWorkflow
```

**Include in Logs**:
```json
{
  "Log_Operation": {
    "type": "Microsoft.Dataverse/CreateRecord",
    "inputs": {
      "entityName": "snf_operation_log",
      "item": {
        "snf_operation": "operation_name",
        "snf_correlation_id": "@variables('correlationId')",
        "snf_timestamp": "@utcNow()"
      }
    }
  }
}
```

## Pattern 5: Timeout Specification

**When to use**: Always, for all external calls

**Recommended Timeouts**:
- Azure ML prediction: 30s
- SHAP calculation: 60s
- Dataverse operations: 30s
- Teams notifications: 15s
- User context: 10s
- Simple queries: 10s

**Implementation**:
```yaml
- kind: InvokeFlowAction
  id: invoke_operation
  input:
    # other inputs
    timeout: 30  # seconds
  output: Topic.Result
  flowName: OperationWorkflow
```

## Pattern 6: Dead-Letter Queue for Critical Failures

**When to use**: When operation fails after all retries and must not be lost

**Implementation**:
```json
{
  "Queue_To_Dead_Letter": {
    "type": "Microsoft.Dataverse/CreateRecord",
    "inputs": {
      "entityName": "snf_dead_letter_queue",
      "item": {
        "snf_operation": "@variables('operationName')",
        "snf_operation_type": "dataverse_write",
        "snf_payload": "@string(variables('operationPayload'))",
        "snf_error": "@string(result('Try_Operation')[0]['error'])",
        "snf_correlation_id": "@variables('correlationId')",
        "snf_timestamp": "@utcNow()",
        "snf_retry_count": 0,
        "snf_max_retries": 5,
        "snf_next_retry": "@addMinutes(utcNow(), 15)",
        "snf_status": "pending"
      }
    }
  }
}
```

## Pattern 7: Notification Queue for Non-Blocking Notifications

**When to use**: For Teams/email notifications that shouldn't block workflow

**Implementation**:
```json
{
  "Try_Send_Notification": {
    "type": "Scope",
    "actions": {
      "Send_Teams_Message": {
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
  "Handle_Notification_Failure": {
    "type": "ConditionGroup",
    "expression": {
      "equals": ["@result('Try_Send_Notification')[0]['status']", "Failed"]
    },
    "actions": {
      "Queue_For_Later": {
        "type": "Microsoft.Dataverse/CreateRecord",
        "inputs": {
          "entityName": "snf_notification_queue",
          "item": {
            "snf_channel": "teams",
            "snf_payload": "@string(variables('notificationPayload'))",
            "snf_recipient": "@variables('recipientId')",
            "snf_retry_count": 0,
            "snf_max_retries": 5,
            "snf_next_retry": "@addMinutes(utcNow(), 5)",
            "snf_status": "pending",
            "snf_correlation_id": "@variables('correlationId')"
          }
        }
      }
    },
    "runAfter": {
      "Try_Send_Notification": ["Failed", "TimedOut"]
    }
  }
}
```

## Pattern 8: Comprehensive Error Logging

**When to use**: Always, for all errors

**Implementation**:
```json
{
  "Log_Error": {
    "type": "Microsoft.Dataverse/CreateRecord",
    "inputs": {
      "entityName": "snf_error_log",
      "item": {
        "snf_error_code": "@result('Try_Operation')[0]['error']?['code']",
        "snf_error_message": "@result('Try_Operation')[0]['error']?['message']",
        "snf_operation": "@variables('operationName')",
        "snf_user_id": "@variables('userId')",
        "snf_correlation_id": "@variables('correlationId')",
        "snf_timestamp": "@utcNow()",
        "snf_severity": "@variables('errorSeverity')",
        "snf_retry_attempts": "@variables('retryCount')",
        "snf_sanitized": true
      }
    }
  }
}
```

**Note**: Always sanitize logs to remove PII and secrets before logging.

## Checklist for New Code

Before submitting code, verify:

- [ ] All InvokeFlowAction calls wrapped in Scope + ConditionGroup
- [ ] All external calls have explicit timeouts
- [ ] All operations include correlation ID
- [ ] All Dataverse writes use idempotency keys
- [ ] All critical failures queued to dead-letter queue
- [ ] All errors logged with sanitization
- [ ] User-facing error messages are clear and actionable
- [ ] Fallback strategies defined for non-critical operations
- [ ] No PII or secrets in logs
- [ ] Retry logic uses exponential backoff with jitter

## Common Mistakes to Avoid

❌ **Don't**: Call InvokeFlowAction without error boundary
```yaml
- kind: InvokeFlowAction
  id: invoke_operation
  input: {}
  output: Topic.Result
  flowName: OperationWorkflow
```

✅ **Do**: Wrap in Scope + ConditionGroup
```yaml
- kind: Scope
  id: try_operation
  actions:
    - kind: InvokeFlowAction
      id: invoke_operation
      input:
        timeout: 30
        correlationId: =guid()
      output: Topic.Result
      flowName: OperationWorkflow

- kind: ConditionGroup
  id: handle_result
  conditions:
    - id: if_failed
      condition: =result('try_operation')[0]['status'] != "Succeeded"
      actions:
        # fallback logic
  runAfter:
    try_operation: ["Succeeded", "Failed", "TimedOut"]
```

---

❌ **Don't**: Use default retry policies
```json
{
  "HTTP_Call": {
    "type": "HTTP",
    "inputs": {
      "method": "POST",
      "uri": "@parameters('endpoint')"
    }
  }
}
```

✅ **Do**: Use SharedUtilities_WithRetry
```json
{
  "HTTP_Call_With_Retry": {
    "type": "Workflow",
    "inputs": {
      "host": {
        "workflowReferenceName": "SharedUtilities_WithRetry"
      },
      "body": {
        "operation": "http_call",
        "operationType": "http",
        "operationConfig": {
          "method": "POST",
          "uri": "@parameters('endpoint')"
        },
        "correlationId": "@variables('correlationId')"
      }
    }
  }
}
```

---

❌ **Don't**: Create Dataverse records without idempotency
```json
{
  "Create_Record": {
    "type": "Microsoft.Dataverse/CreateRecord",
    "inputs": {
      "entityName": "snf_recommendation",
      "item": {
        "snf_text": "@variables('text')"
      }
    }
  }
}
```

✅ **Do**: Include idempotency key
```json
{
  "Create_Record_With_Idempotency": {
    "type": "Workflow",
    "inputs": {
      "host": {
        "workflowReferenceName": "SharedUtilities_WithRetry"
      },
      "body": {
        "operation": "create_recommendation",
        "operationType": "dataverse_write",
        "operationConfig": {
          "entityName": "snf_recommendation",
          "item": {
            "snf_idempotency_key": "@guid()",
            "snf_text": "@variables('text')",
            "snf_correlation_id": "@variables('correlationId')"
          }
        },
        "correlationId": "@variables('correlationId')"
      }
    }
  }
}
```

---

❌ **Don't**: Show technical errors to users
```yaml
- kind: SendActivity
  id: send_error
  activity:
    text: |
      Error: {result('try_operation')[0]['error']?['message']}
```

✅ **Do**: Provide user-friendly messages
```yaml
- kind: SendActivity
  id: send_error
  activity:
    text: |
      I'm having trouble connecting to our systems right now. Let me try a different approach.
      
      Error Reference: {result('try_operation')[0]['error']?['code']}
```

## Questions?

See full documentation:
- `docs/World_Class_Hardening_Implementation.md` - Complete implementation guide
- `docs/Reliability_Hotspot_Analysis.md` - Analysis of all reliability hotspots
- `docs/Error_Handling_Resilience_Guide.md` - Error handling patterns

---

**Document Version**: 1.0  
**Last Updated**: 2026-04-17  
**Author**: Senior Reliability Engineer

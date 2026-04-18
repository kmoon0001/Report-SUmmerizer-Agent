# Error Handling And Safety Playbook

## Error Types

- transient workflow failure
- missing required data
- conflicting patient or unit filters
- timeout
- permission or access denial
- unsupported file input
- safety-critical condition
- ambiguous clinical context

## Standard Response Pattern

1. Detect the failure type.
2. Preserve current context if possible.
3. Retry only if the failure is transient and policy allows it.
4. Explain the issue in short, plain language.
5. Escalate to a human when the answer could affect care or safety.
6. Emit audit and telemetry metadata.

## Safety-Critical Rule

- If the signal suggests immediate patient risk, do not wait for repeated retries before escalating.


# Clinical Data Quality Monitoring Specs

## Priority Quality Dimensions

- Completeness
- Timeliness
- Accuracy
- Consistency
- Freshness

## First Checks To Implement

- Missing vital signs by unit and shift
- Missing medication reconciliation status
- Missing patient assignment links
- Duplicate patient identity joins
- Stale dashboard source timestamps

## Escalation Rules

- Critical missing data affecting safety tiles escalates immediately.
- Repeated source freshness failures escalate to platform and clinical owners.
- Terminology mapping failures block downstream CDS activation until reviewed.

# SLA And Performance Targets

## Assistant Targets

- Routine response time: under 2 seconds
- Clarification turn: under 3 seconds
- No-action fallback: under 1 second when cached
- High-risk escalation recommendation generation: under 5 seconds

## Dashboard Targets

- Live tile freshness: under 5 seconds where practical
- Critical alert propagation: near-real-time
- Drillthrough response: under 3 seconds for common views
- Patient drillthrough context load: under 4 seconds
- Executive page full render target: under 5 seconds for common filters

## Reliability Targets

- Critical alerting uptime: 99.9%
- Data pipeline failure detection: under 5 minutes
- Automated retry / backoff for transient ingest failures
- Critical alert delivery: under 60 seconds end to end
- Dashboard semantic model availability: 99.9% for critical pages

## Data Quality Targets

- Field completeness checks on every ingest
- Duplicate detection on patient identity joins
- Schema drift alerting
- Null / outlier / stale-data checks on high-value metrics
- Observation recency checks for high-risk tiles
- Medication reconciliation freshness checks

## Clinical Safety Targets

- High-severity alerts acknowledged within facility-defined SLA, commonly 15 minutes or less
- Post-fall or change-in-condition workflow initiation under 5 minutes after signal receipt
- Workflow misrouting rate for critical alerts approaching zero and reviewed on every incident

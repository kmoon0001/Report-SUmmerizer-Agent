# RefreshHealthcareIntelligence

## Purpose

Refresh live clinical and operational intelligence so dashboards and assistant outputs use current validated data.

## Trigger

- scheduled recurrence
- source-system change event
- authorized manual refresh

## Primary Owner

- Data_Platform_Owner

## Escalation Owner

- Clinical_Sponsor

## Inputs

- facility
- unit
- date range
- refresh scope
- source systems

## Outputs

- refreshed timestamp
- record count
- data quality status
- stale data flags

## Logic

1. Identify target scope.
2. Pull incremental updates from approved sources.
3. validate timestamps, identifiers, and terminology mappings.
4. Recompute high-priority aggregates and risk summaries.
5. Publish refreshed outputs and quality warnings.

## Validation

- observation freshness windows pass
- active census and assignment joins pass
- critical data quality failures block publish


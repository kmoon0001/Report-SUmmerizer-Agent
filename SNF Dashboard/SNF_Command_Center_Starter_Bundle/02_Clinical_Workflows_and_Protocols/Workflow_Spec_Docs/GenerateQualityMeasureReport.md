# GenerateQualityMeasureReport

## Purpose

Compile a benchmarked quality and compliance report with remediation owners and trends.

## Trigger

- scheduled quality cycle
- manual quality request
- dashboard export

## Primary Owner

- Quality_Owner

## Escalation Owner

- Executive_Sponsor

## Inputs

- measure set
- benchmark set
- facility or unit scope
- date range
- export type

## Outputs

- report file
- summary
- action items
- responsible party

## Logic

1. Pull selected measures and benchmark definitions.
2. Compute trend and variance to target.
3. Identify deterioration or noncompliance.
4. Add remediation owners and deadlines.
5. Publish to approved recipients.

## Validation

- measure definition and denominator logic verified
- data completeness and freshness reviewed
- attribution inconsistencies flagged


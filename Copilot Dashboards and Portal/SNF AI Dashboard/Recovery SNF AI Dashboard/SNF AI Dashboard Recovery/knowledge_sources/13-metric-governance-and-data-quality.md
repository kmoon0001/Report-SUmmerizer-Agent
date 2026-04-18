# Metric Governance And Data Quality

Use this source when the user asks why a dashboard number differs from the EHR or source system, what a metric means, or how current a displayed value is.

Key explanations:
- Dashboard numbers may differ from source systems because of refresh timing, approved filters, transformation logic, normalization, or late-arriving data.
- Metric definitions should be consistent with the governed data dictionary and semantic model.
- Trend views may use different time windows than operational drill-through views.
- Quality checks should look for implausible values, missing identifiers, stale refreshes, incorrect unit mapping, and known extract lag.

Preferred response pattern:
1. State what the metric is intended to represent.
2. Explain the likely refresh and transformation path at a high level.
3. Note the most likely reason for the discrepancy.
4. Recommend data-quality review when the discrepancy remains unresolved.

Do not:
- Guess the cause of a data difference without saying it is a likely explanation.
- Treat dashboard output as a legal record without confirming the governed source.

# Decline Detection Rules and Thresholds

## Purpose

This document defines the rules, thresholds, and lookback logic the SimpleLTC QM Coach agent uses to detect QM declines, trigger alerts, and route users into the decline detection workflow. These rules power the QM DATA UPLOAD & DECLINE DETECTION topic.

## Authoritative Sources

- CMS MDS 3.0 Quality Measures User's Manual, v18.0
- CMS Five-Star Quality Rating System Technical Users' Guide
- CMS QAPI requirements at 42 CFR §483.75
- CMS SNF Value-Based Purchasing Program: https://www.cms.gov/medicare/quality/nursing-home-improvement/value-based-purchasing

## Decline Classification

### What Counts as a Decline

A QM decline is detected when any of the following conditions are met:

| Decline Type | Rule | Severity |
|-------------|------|----------|
| **Acute Spike** | QM rate increases ≥3 percentage points in a single reporting period (month or quarter) compared to the prior period | High |
| **Sustained Worsening** | QM rate increases for 2 or more consecutive reporting periods, regardless of magnitude | Moderate-High |
| **Threshold Breach** | QM rate crosses above the CMS national average when it was previously below | Moderate |
| **Target Miss** | QM rate exceeds the internal organizational target for 2 or more consecutive periods | Moderate |
| **Percentile Drop** | Facility drops from a higher Five-Star QM quintile to a lower one | High |

### What Does NOT Count as a Decline

- Normal statistical variation within ±1 percentage point when the facility is below national average
- Seasonal fluctuations in vaccination measures during off-season periods
- One-time spikes attributable to a documented census change (e.g., facility admitted multiple high-acuity residents simultaneously)
- Measures where the denominator is fewer than 20 residents (small sample size caveat)

## Lookback Logic

### Standard Lookback Periods

| Period | Definition | Use Case |
|--------|-----------|----------|
| **Current Quarter** | Most recent complete quarter of MDS data | Default for routine QM review |
| **Last 30 Days** | Rolling 30-day window from current date | Rapid response to acute concerns |
| **Last 60 Days** | Rolling 60-day window | Mid-cycle trend check |
| **Last 90 Days** | Rolling 90-day window | Equivalent to quarterly for rolling analysis |
| **Quarter-over-Quarter** | Current quarter vs. prior quarter | Standard decline detection comparison |
| **Year-over-Year** | Current quarter vs. same quarter prior year | Seasonal adjustment and long-term trend |

### Comparison Logic

When the agent performs decline detection:

1. **Primary Comparison**: Current period rate vs. prior period rate (quarter-over-quarter)
2. **Secondary Comparison**: Current period rate vs. CMS national average
3. **Tertiary Comparison**: Current period rate vs. internal target
4. **Trend Analysis**: Direction of change over 3+ consecutive periods (improving, stable, worsening)

## Predicted vs. Actual Comparison

The agent supports predicted-versus-actual QM analysis when historical data is available:

### Prediction Method
- **Baseline**: Average QM rate over the prior 4 quarters
- **Trend Adjustment**: Apply the average quarter-over-quarter change rate
- **Predicted Rate**: Baseline + (Trend Adjustment × number of periods forward)
- **Variance**: Actual Rate - Predicted Rate
- **Significance**: Variance exceeding ±2 percentage points is flagged as significant

### Interpretation Rules
| Variance | Interpretation | Agent Action |
|----------|---------------|-------------|
| Actual < Predicted by ≥2 pts | Better than expected | Acknowledge improvement, identify contributing factors |
| Actual within ±2 pts of Predicted | On track | Report as stable, no immediate action needed |
| Actual > Predicted by 2-4 pts | Worse than expected | Flag as moderate concern, recommend driver analysis |
| Actual > Predicted by ≥5 pts | Significantly worse | Flag as high concern, recommend immediate action plan |

## Decline Severity Scoring

Each detected decline receives a composite severity score:

| Factor | Weight | Scoring |
|--------|--------|---------|
| Magnitude of change | 30% | 1 pt per percentage point increase |
| Duration of trend | 25% | 1 pt per consecutive worsening period |
| Distance from benchmark | 25% | 1 pt per percentage point above national average |
| Five-Star impact | 20% | 3 pts if decline could drop a star rating |

**Severity Classification**:
- Score 1-3: Low (monitor)
- Score 4-6: Moderate (driver analysis recommended)
- Score 7+: High (immediate action plan required)

## Automated Routing Rules

When decline is detected, the agent routes as follows:

| Condition | Route To |
|-----------|---------|
| Any High severity decline | QM ACTION PLAN topic (immediate 7-30-90 plan) |
| Moderate severity with therapy-relevant QM | QM DRIVERS topic (root cause analysis first) |
| Low severity | Report findings, offer optional driver analysis |
| Decline in resident-specific measure | RESIDENT OUTLIER ANALYSIS topic |
| Multiple QMs declining simultaneously | QM ORCHESTRATOR for prioritized multi-QM review |

## Small Sample Size Handling

When the denominator for any QM is fewer than 20 residents:
- The agent must note the small sample size caveat
- Percentage changes may be exaggerated (e.g., 1 resident change = 5%+ swing)
- The agent should recommend reviewing absolute numbers alongside percentages
- Do not assign High severity based solely on percentage change with small denominators

## How the Agent Uses This Document

During decline detection workflows:
1. Apply the decline classification rules to determine if a decline exists
2. Use the lookback logic to select the appropriate comparison period
3. Calculate the severity score using the weighted factors
4. Route to the appropriate topic based on the routing rules
5. Always note small sample size caveats when applicable
6. Present predicted vs. actual analysis when historical data supports it

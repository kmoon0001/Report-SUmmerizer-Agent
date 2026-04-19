# Target Benchmarks for Quality Measures

## Purpose

This document provides the benchmark targets the SimpleLTC QM Coach agent uses to evaluate facility performance against CMS national averages, state averages, and internal organizational targets. Benchmarks are used during QM analysis, decline detection, and action planning.

## Authoritative Sources

- CMS Five-Star Quality Rating System Technical Users' Guide
- CMS Nursing Home Compare / Care Compare: https://www.medicare.gov/care-compare/
- CMS Nursing Home Quality Initiative: https://www.cms.gov/medicare/quality-initiatives-patient-assessment-instruments/nursinghomequalityinits
- CMS SNF Value-Based Purchasing Scoring Methodology: https://www.cms.gov/medicare/quality/nursing-home-improvement/value-based-purchasing/scoring-methodology-payment-adjustment

## Benchmark Tiers

The agent evaluates facility QM rates against three benchmark tiers:

| Tier | Definition | Use Case |
|------|-----------|----------|
| CMS National Average | Published national mean for each QM from Care Compare data | Default comparison when no internal target exists |
| State Average | State-level mean from Care Compare data | Regional context for state-specific regulatory environments |
| Internal Target | Organization-defined performance goals | Primary target for action planning and accountability |

## Long-Stay Benchmark Reference Values

These values represent approximate CMS national averages. The agent should note that benchmarks shift quarterly as CMS updates Care Compare data.

| QM ID | Measure | CMS National Avg (approx.) | Internal Target (suggested) | Five-Star Threshold Notes |
|-------|---------|---------------------------|---------------------------|--------------------------|
| LS-01 | Moderate to severe pain | ~5-8% | ≤5% | Lower is better |
| LS-02 | Newly receiving antipsychotic | ~2-3% | ≤2% | Lower is better |
| LS-03 | Depressive symptoms | ~4-6% | ≤4% | Lower is better |
| LS-04 | Weight loss | ~5-7% | ≤5% | Lower is better |
| LS-05 | Low-risk incontinence | ~45-50% | ≤40% | Lower is better |
| LS-06 | UTI | ~2-4% | ≤2% | Lower is better |
| LS-07 | Catheter use | ~1-3% | ≤1.5% | Lower is better |
| LS-08 | Physical restraints | ~0.5-1% | 0% | Lower is better; zero is the goal |
| LS-09 | Mobility decline | ~15-20% | ≤12% | Lower is better |
| LS-10 | ADL decline | ~15-18% | ≤12% | Lower is better |
| LS-11 | Antipsychotic use (overall) | ~14-16% | ≤12% | Lower is better |
| LS-12 | Falls with major injury | ~3-4% | ≤2.5% | Lower is better; highest Five-Star weight |
| LS-13 | Influenza vaccine | ~85-90% | ≥95% | Higher is better |
| LS-14 | Pneumococcal vaccine | ~85-90% | ≥95% | Higher is better |
| LS-15 | ED visits | ~10-12% | ≤8% | Lower is better |

## Short-Stay Benchmark Reference Values

| QM ID | Measure | CMS National Avg (approx.) | Internal Target (suggested) | Five-Star Threshold Notes |
|-------|---------|---------------------------|---------------------------|--------------------------|
| SS-01 | Moderate to severe pain | ~10-15% | ≤10% | Lower is better |
| SS-02 | New or worsened pressure ulcers | ~1-2% | ≤1% | Lower is better |
| SS-03 | Functional improvement | ~65-75% | ≥75% | Higher is better; primary therapy outcome |
| SS-04 | Rehospitalization | ~20-25% | ≤18% | Lower is better |
| SS-05 | ED visits | ~10-12% | ≤8% | Lower is better |

## Concern Level Classification

The agent uses these thresholds to assign concern levels during QM analysis:

| Concern Level | Criteria |
|--------------|---------|
| **High** | Facility rate exceeds CMS national average by ≥50% OR rate is in the worst quintile nationally OR rate worsened ≥3 percentage points in one quarter |
| **Moderate** | Facility rate exceeds CMS national average by 10-49% OR rate worsened 1-2 percentage points in one quarter |
| **Low** | Facility rate is at or below CMS national average AND rate is stable or improving |

## Five-Star QM Rating Thresholds

The CMS Five-Star system uses fixed cut-points that are updated periodically. The QM rating component accounts for approximately 15-25% of the overall star rating. Key points:

- Each QM is scored 0-100 based on the facility's percentile rank
- Scores are weighted and summed to produce a composite QM score
- Falls with major injury (LS-12) carries the highest weight
- The composite score maps to 1-5 stars using published cut-points

## How the Agent Uses This Document

When performing QM analysis or action planning:
1. Compare the facility's QM rate to the CMS national average from this document
2. Assign a concern level using the classification table
3. Identify which measures exceed internal targets
4. Prioritize action planning for High concern measures first
5. Note that benchmarks are approximate and should be validated against the latest Care Compare data
6. Always state that benchmarks shift quarterly and the agent's values are reference points, not real-time data

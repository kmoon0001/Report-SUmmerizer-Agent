# SNF Command Center Dashboard Spec

This document defines the dashboard pages, visuals, navigation, AI enhancements, and security expectations for a Microsoft Fabric and Power BI implementation.

## Shared Design Rules

- Use Direct Lake on OneLake for the live gold layer where possible.
- Use composite models only when reference or historical data should remain in Import mode.
- Apply role-aware perspectives, dynamic measures, and RLS.
- Keep patient context persistent across drillthrough pages.
- Use contextual help to explain why a signal matters clinically or operationally.

## 1. Executive Operations Command Center

- Clinical question: where are the highest-risk operational and clinical issues across the facility right now?
- Required visuals:
  - Predictive risk score distributions
  - Quality measure trend charts with target zones
  - Resource utilization heatmaps
  - Workflow bottleneck identification visuals
  - Alert fatigue metrics
- Navigation:
  - One-click return point for all other pages
  - Drillthrough to unit, role, and patient context
- AI enhancements:
  - Key Influencers for rising adverse events or staffing pressure
  - Smart Narrative for facility-wide summary
  - What-if parameters for staffing and throughput scenarios
- Security features:
  - Executive-only finance and compliance measures
  - Sensitive patient detail hidden unless drillthrough rights exist

## 2. Patient Safety And Risk Surveillance

- Clinical question: which patients are at the greatest risk for falls, pressure injury, sepsis, or readmission right now?
- Required visuals:
  - Risk stratification matrices
  - Patient trajectory timelines
  - Heatmaps with clinical overlay
  - Predictive risk score distributions
  - Care plan adherence gauges
- Navigation:
  - Direct links to therapy, nursing, and patient drillthrough
  - Care phase navigation from admission to discharge
- AI enhancements:
  - Decomposition tree with diagnosis, meds, falls, and therapy splits
  - Anomaly detection against patient baseline trends
  - Q&A visual with clinical ontology synonyms
- Security features:
  - Dynamic RLS by assignment and unit
  - Emergency access logging for break-glass views

## 3. Therapy Productivity And Outcomes

- Clinical question: where are therapy access, productivity, functional outcomes, or PDPM opportunities drifting?
- Required visuals:
  - Therapy progress sparklines
  - Rehabilitation potential assessments
  - Process adherence funnel charts
  - Quality trend charts for therapy outcomes
  - Cohort survival curves for decline or readmission outcomes
- Navigation:
  - Jump from patient or unit to discharge planning and pickup review
- AI enhancements:
  - Key Influencers for missed minutes or outcome decline
  - Personalized benchmarking against matched cohorts
  - Sensitivity analysis on therapy-minute assumptions
- Security features:
  - Therapy-role measure perspective
  - PHI limited for non-therapy viewers

## 4. Infection Control And Surveillance

- Clinical question: are there emerging clusters, isolation gaps, or containment failures that need immediate action?
- Required visuals:
  - Heatmaps with clinical overlay
  - Process adherence funnel charts for isolation and cleaning
  - Control charts for infection process stability
  - Patient trajectory timelines
  - Clinical pathway compliance Sankey diagrams
- Navigation:
  - Direct drillthrough to patient, unit, and environmental services context
- AI enhancements:
  - Anomaly detection for case spikes
  - Simulation visuals for outbreak spread scenarios
  - Smart Narrative summarizing containment gaps
- Security features:
  - Infection prevention and leadership views only for unit-wide PHI detail

## 5. Medication Safety And Stewardship

- Clinical question: where are medication interactions, reconciliation failures, or prescribing risks accumulating?
- Required visuals:
  - Medication timeline visuals
  - Risk stratification matrices
  - Process adherence funnels for med rec completion
  - Alert fatigue metrics
  - Influence charts for medication-related outcome relationships
- Navigation:
  - Direct path to patient overview and medication review workflow
- AI enhancements:
  - Key Influencers for med-related falls or confusion
  - Decomposition tree by drug class, diagnosis, route, and shift
  - Uncertainty visualization on predictive med-risk estimates
- Security features:
  - Pharmacist and nursing role perspectives
  - Highly sensitive medication categories masked by role

## 6. Staffing Optimization And Workload Balance

- Clinical question: where is staffing pressure highest, and what is the likely effect on care delivery?
- Required visuals:
  - Resource utilization heatmaps
  - Workflow bottleneck visuals
  - Control charts for staffing stability
  - Predictive score distributions for staffing strain
  - What-if scenario visuals
- Navigation:
  - Unit and shift drillthrough with quick return to executive overview
- AI enhancements:
  - What-if parameters for staffing mix changes
  - Monte Carlo staffing simulations
  - Key Influencers for call-offs and overload
- Security features:
  - HR-sensitive attributes hidden from non-authorized roles

## 7. Quality Measures And Regulatory Compliance

- Clinical question: which quality measures or compliance requirements are off target or at risk?
- Required visuals:
  - Quality measure trend charts
  - Regulatory compliance dashboards
  - Control charts
  - Process adherence funnels
  - Fishbone diagrams for recurring citation themes
- Navigation:
  - Drillthrough from measure to patient, unit, or plan-of-correction backlog
- AI enhancements:
  - Smart Narrative for survey-readiness summary
  - Decomposition tree for deteriorating measures
  - Benchmarking against target or peer performance
- Security features:
  - Regulatory perspective for compliance and executive users

## 8. Patient Flow And Bed Management

- Clinical question: where are admission, transfer, discharge, and bed-turnover constraints delaying care?
- Required visuals:
  - Care transition readiness assessments
  - Patient trajectory timelines
  - Workflow bottleneck visuals
  - Heatmaps by unit and time
  - Predictive readiness distributions
- Navigation:
  - Care phase navigation from admission through discharge planning
- AI enhancements:
  - Simulation visuals for bed or census scenarios
  - Key Influencers for discharge delays
  - Sensitivity analysis for resource changes
- Security features:
  - Bed and flow metrics role-filtered by operational need

## 9. Family Communication And Satisfaction

- Clinical question: where are communication gaps, dissatisfaction patterns, or unmet family needs developing?
- Required visuals:
  - Patient experience metrics
  - Trend charts for communication timeliness
  - Cohort analysis by unit or service line
  - Sentiment or category breakdown visuals
- Navigation:
  - Jump to patient overview or family communication workflow
- AI enhancements:
  - Smart Narrative for satisfaction trends
  - Decomposition tree by issue type, unit, and care phase
- Security features:
  - Family-contact data filtered by consent and role

## 10. Clinical Documentation Completeness

- Clinical question: where is documentation incomplete, late, inconsistent, or at risk of causing downstream care gaps?
- Required visuals:
  - Process adherence funnels
  - Heatmaps by unit and shift
  - Workflow bottleneck visuals
  - Quality trend charts
  - Care plan adherence gauges
- Navigation:
  - Direct links to remediation queues and patient context
- AI enhancements:
  - Key Influencers for documentation lateness
  - Smart Narrative for current gap summary
- Security features:
  - Role-based views by discipline and assignment

## 11. Individual Patient Clinical Overview

- Clinical question: what is the current whole-patient picture, and what requires attention now?
- Required visuals:
  - Patient trajectory timeline
  - Medication timeline
  - Care plan adherence gauges
  - Wound healing progress tracker when consented
  - Therapy progress sparklines
- Navigation:
  - Persistent patient banner and care phase context
  - Direct jump to related safety, infection, therapy, and discharge pages
- AI enhancements:
  - Smart Narrative for patient summary
  - Q&A visual scoped to this patient
- Security features:
  - Strict patient-level RLS and consent filtering

## 12. Population Health And Cohort Analysis

- Clinical question: what patterns are emerging across patient cohorts, and which subpopulations are responding differently?
- Required visuals:
  - Cohort survival curves
  - Predictive risk score distributions
  - SDOH impact visuals
  - Heterogeneity analysis visuals
  - Bias detection views
- Navigation:
  - Drill from cohort to unit or individual patient where allowed
- AI enhancements:
  - Decomposition tree by diagnosis, age, comorbidity, and social risk
  - Survival analysis and uncertainty visualization
  - Personalized benchmarking
- Security features:
  - De-identified or minimum-necessary views for population analysis where possible

## Semantic Model Enhancements

- Use field parameters for dynamic measure switching such as fall risk, pressure injury risk, readmission risk, and functional gain.
- Use calculation groups for time-based views such as since admission, since last vital signs, and since last therapy session.
- Implement clinical hierarchies for diagnosis, medication, unit, labor, and care phase.
- Implement clinical perspectives for nursing, therapy, medical, safety, regulatory, family, and finance views.
- Add role-based dynamic measures so each role sees the most useful default metrics first.

## Security And Compliance Features

- Use dynamic RLS and, where warranted, OLS or CLS to restrict sensitive content.
- Use sensitivity labels for reports, dashboards, semantic models, and exports.
- Use Purview-backed audit and retention processes where licensed and enabled.
- Apply just-in-time admin access and break-glass monitoring for privileged access.
- Preserve export controls, watermarking, and DLP for PHI-bearing artifacts.

## Microsoft Guidance Basis

- Real-Time Intelligence overview: https://learn.microsoft.com/en-us/fabric/real-time-intelligence/
- Eventstream overview: https://learn.microsoft.com/en-us/fabric/real-time-intelligence/event-streams/overview
- Eventhouse overview: https://learn.microsoft.com/en-us/fabric/real-time-intelligence/eventhouse
- Direct Lake overview: https://learn.microsoft.com/en-us/power-bi/enterprise/directlake-overview
- RLS with Power BI: https://learn.microsoft.com/en-us/power-bi/enterprise/service-admin-rls
- Sensitivity labels in Power BI: https://learn.microsoft.com/en-us/power-bi/enterprise/service-security-sensitivity-label-overview
- Power BI tenant auditing: https://learn.microsoft.com/en-us/power-bi/guidance/powerbi-implementation-planning-auditing-monitoring-tenant-level-auditing

# Quality Measure Definitions and Calculation Rules

## Purpose

This document defines the CMS nursing home quality measures (QMs) used by the SimpleLTC QM Coach agent to interpret facility and resident-level performance. All definitions are derived from the CMS MDS 3.0 Quality Measures User's Manual and the CMS Nursing Home Quality Initiative.

## Authoritative Sources

- CMS MDS 3.0 Quality Measures User's Manual, v18.0 (effective January 1, 2026)
- CMS Nursing Home Quality Initiative: https://www.cms.gov/medicare/quality-initiatives-patient-assessment-instruments/nursinghomequalityinits/nhqiqualitymeasures
- CMS Five-Star Quality Rating System: https://www.cms.gov/newsroom/fact-sheets/cms-five-star-quality-rating-system-nursing-homes

## Calculation Framework

Each quality measure follows a numerator/denominator structure:

- **Denominator**: The eligible population of residents who meet inclusion criteria for the measure during the reporting period
- **Numerator**: The subset of the denominator population who triggered the quality measure (i.e., experienced the outcome being measured)
- **Rate**: Numerator / Denominator × 100 = percentage
- **Risk Adjustment**: Some measures apply risk adjustment models to account for resident acuity differences across facilities

## Long-Stay Quality Measures

### LS-01: Percent of Residents Who Self-Report Moderate to Severe Pain
- **Numerator**: Long-stay residents with self-reported moderate to severe pain on the target MDS assessment (J0300A = 2 or 3, or J0400 = 2 or 3)
- **Denominator**: All long-stay residents with a valid target MDS assessment who were able to self-report pain
- **Exclusions**: Residents unable to self-report (comatose, severely cognitively impaired without valid interview)
- **Clinical Relevance**: Elevated pain rates may indicate inadequate pain management protocols, insufficient therapy intervention, or documentation gaps in pain reassessment

### LS-02: Percent of Residents Who Are Newly Receiving an Antipsychotic Medication
- **Numerator**: Long-stay residents newly receiving antipsychotic medication on the target assessment who were not receiving it on the prior assessment
- **Denominator**: All long-stay residents with valid target and prior MDS assessments
- **Exclusions**: Residents with diagnoses of schizophrenia, Tourette syndrome, or Huntington disease
- **Clinical Relevance**: New antipsychotic starts without qualifying diagnosis suggest potential overuse; therapy teams should evaluate behavioral intervention alternatives

### LS-03: Percent of Long-Stay Residents Who Have Depressive Symptoms
- **Numerator**: Long-stay residents with PHQ-9 score of 10 or greater on the target assessment (D0300 >= 10)
- **Denominator**: All long-stay residents with a valid PHQ-9 assessment
- **Exclusions**: Residents unable to complete the PHQ-9 interview
- **Clinical Relevance**: Depression screening connects to therapy engagement, ADL participation, and fall risk

### LS-04: Percent of Long-Stay Residents Who Lose Too Much Weight
- **Numerator**: Long-stay residents with weight loss of 5% or more in the last month or 10% or more in the last 6 months
- **Denominator**: All long-stay residents with valid weight data on target and prior assessments
- **Exclusions**: Residents on hospice, residents with end-stage disease with physician-documented expected weight loss
- **Clinical Relevance**: Weight loss correlates with malnutrition risk, reduced therapy tolerance, and wound healing impairment

### LS-05: Percent of Low-Risk Residents Who Lose Control of Their Bowel or Bladder
- **Numerator**: Low-risk long-stay residents who are frequently or always incontinent of bowel or bladder
- **Denominator**: Long-stay residents classified as low-risk (not severely cognitively impaired, not totally dependent in bed mobility)
- **Exclusions**: High-risk residents (severely cognitively impaired or totally dependent in bed mobility)
- **Clinical Relevance**: Bladder health programs and toileting schedules are therapy-addressable interventions per ONE Clinical Protocol for Bladder Health

### LS-06: Percent of Residents with a Urinary Tract Infection
- **Numerator**: Long-stay residents with a UTI on the target assessment (I2300 = 1)
- **Denominator**: All long-stay residents with a valid target MDS assessment
- **Exclusions**: None standard
- **Clinical Relevance**: UTI rates connect to hydration programs, mobility interventions, and catheter management protocols

### LS-07: Percent of Residents Who Have/Had a Catheter Inserted and Left in Their Bladder
- **Numerator**: Long-stay residents with an indwelling catheter on the target assessment (H0100A = 1)
- **Denominator**: All long-stay residents with a valid target MDS assessment
- **Exclusions**: None standard
- **Clinical Relevance**: Catheter reduction is a therapy-nursing collaboration target; bladder retraining programs are evidence-based alternatives

### LS-08: Percent of Residents Who Were Physically Restrained
- **Numerator**: Long-stay residents with any physical restraint use on the target assessment (P0100 items)
- **Denominator**: All long-stay residents with a valid target MDS assessment
- **Exclusions**: None standard
- **Clinical Relevance**: Restraint-free care is a CMS priority; therapy teams address fall risk through environmental modification, strengthening, and adaptive equipment rather than restraints

### LS-09: Percent of Residents Whose Ability to Move Independently Worsened
- **Numerator**: Long-stay residents whose mobility self-performance score (G0110B1) worsened between prior and target assessments
- **Denominator**: All long-stay residents with valid mobility data on both target and prior assessments
- **Exclusions**: Residents who were already totally dependent on the prior assessment
- **Clinical Relevance**: ADL decline in mobility is a primary therapy outcome measure; worsening triggers review of restorative nursing programs and therapy frequency

### LS-10: Percent of Residents Whose Need for Help with Activities of Daily Living Has Increased
- **Numerator**: Long-stay residents with increased ADL dependency (late-loss ADL score increase of 2+ points)
- **Denominator**: All long-stay residents with valid ADL data on both target and prior assessments
- **Exclusions**: Residents already at maximum dependency on prior assessment
- **Clinical Relevance**: ADL decline is the broadest therapy-relevant QM; connects to all ONE Clinical Protocols and Jimmo v. Sebelius maintenance therapy standards

### LS-11: Percent of Residents Who Received an Antipsychotic Medication
- **Numerator**: Long-stay residents receiving any antipsychotic medication on the target assessment
- **Denominator**: All long-stay residents with a valid target MDS assessment
- **Exclusions**: Residents with schizophrenia, Tourette syndrome, or Huntington disease
- **Clinical Relevance**: Antipsychotic reduction programs require therapy-nursing collaboration on behavioral management alternatives per ONE Clinical Protocol for Behavior Management

### LS-12: Percent of Residents Experiencing One or More Falls with Major Injury
- **Numerator**: Long-stay residents with one or more falls resulting in major injury (J1800 = 1 and J1900A/B/C = 1)
- **Denominator**: All long-stay residents with a valid target MDS assessment
- **Exclusions**: None standard
- **Clinical Relevance**: Falls with major injury is the highest-weighted QM in the Five-Star system; therapy teams lead fall prevention through balance training, environmental assessment, and assistive device evaluation per ONE Clinical Protocol for Fall Prevention

### LS-13: Percent of Residents Assessed and Appropriately Given the Seasonal Influenza Vaccine
- **Numerator**: Long-stay residents who received the influenza vaccine or had a documented medical contraindication
- **Denominator**: All long-stay residents during the influenza season reporting period
- **Exclusions**: Residents who declined vaccination (counted separately)
- **Clinical Relevance**: Vaccination compliance is a facility-wide metric; therapy teams support by identifying residents during treatment sessions

### LS-14: Percent of Residents Assessed and Appropriately Given the Pneumococcal Vaccine
- **Numerator**: Long-stay residents who received the pneumococcal vaccine or had a documented medical contraindication
- **Denominator**: All long-stay residents with a valid target MDS assessment
- **Exclusions**: None standard
- **Clinical Relevance**: Similar to influenza; facility-wide compliance metric

### LS-15: Percent of Residents Who Have Had an Outpatient Emergency Department Visit
- **Numerator**: Long-stay residents with one or more ED visits (claims-based measure)
- **Denominator**: All long-stay residents during the reporting period
- **Exclusions**: Planned ED visits
- **Clinical Relevance**: ED visits may indicate inadequate on-site clinical management; therapy teams contribute by maintaining functional status that prevents acute events

## Short-Stay Quality Measures

### SS-01: Percent of Short-Stay Residents Who Self-Report Moderate to Severe Pain
- **Numerator**: Short-stay residents with self-reported moderate to severe pain
- **Denominator**: All short-stay residents with a valid target MDS assessment who were able to self-report
- **Exclusions**: Residents unable to self-report
- **Clinical Relevance**: Pain management during rehabilitation directly affects therapy participation and outcomes

### SS-02: Percent of Short-Stay Residents with Pressure Ulcers/Injuries That Are New or Worsened
- **Numerator**: Short-stay residents with Stage 2-4 pressure ulcers/injuries that are new or worsened since admission
- **Denominator**: All short-stay residents with valid pressure ulcer data on target assessment
- **Exclusions**: Residents with only Stage 1 or unstageable pressure injuries present on admission
- **Clinical Relevance**: Pressure injury prevention is a therapy-nursing collaboration area; seating/positioning assessments and mobility programs are primary interventions per ONE Clinical Protocol for Wounds

### SS-03: Percent of Short-Stay Residents Who Made Improvements in Function
- **Numerator**: Short-stay residents whose discharge functional status improved compared to admission
- **Denominator**: All short-stay residents with valid functional data on both admission and discharge assessments
- **Exclusions**: Residents who died or transferred to acute care before discharge assessment
- **Clinical Relevance**: This is the primary therapy outcome measure for short-stay; directly reflects rehabilitation effectiveness

### SS-04: Percent of Short-Stay Residents Who Were Rehospitalized
- **Numerator**: Short-stay residents with one or more unplanned rehospitalizations (claims-based)
- **Denominator**: All short-stay residents during the reporting period
- **Exclusions**: Planned readmissions
- **Clinical Relevance**: Rehospitalization rates reflect care coordination quality; therapy teams contribute through early mobility, fall prevention, and functional monitoring

### SS-05: Percent of Short-Stay Residents Who Have Had an Outpatient Emergency Department Visit
- **Numerator**: Short-stay residents with one or more ED visits (claims-based)
- **Denominator**: All short-stay residents during the reporting period
- **Exclusions**: Planned ED visits
- **Clinical Relevance**: Similar to rehospitalization; reflects on-site clinical management adequacy

## How the Agent Uses This Document

When the agent performs QM analysis, it should:
1. Match the flagged measure to the definitions above
2. Identify the numerator/denominator components to explain what is being measured
3. Connect the clinical relevance to the appropriate ONE Clinical Protocol
4. Map to CMS regulatory standards (Ch. 15 §220.2 for therapy coverage, Jimmo for maintenance therapy)
5. Use the risk adjustment context to explain facility-to-facility comparison limitations

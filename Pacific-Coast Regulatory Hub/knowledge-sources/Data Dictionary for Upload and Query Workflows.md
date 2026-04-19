# Data Dictionary for Upload Workflows

## Purpose

This document defines every column and data field expected by the SimpleLTC QM Coach agent's upload, normalization, and analysis workflows. It serves as the validation reference for the UploadNormalizeManualQMFile action and the QM DATA UPLOAD & DECLINE DETECTION topic.

## Authoritative Sources

- SimpleLTC export file specifications
- CMS MDS 3.0 RAI Manual (data element definitions)
- Power BI data model for facility and resident insights

## SimpleLTC Facility QM Export (CSV/Excel)

This is the primary upload format for facility-level QM analysis.

### Required Columns

| Column Name | Data Type | Description | Example | Validation Rule |
|------------|-----------|-------------|---------|----------------|
| FacilityName | String | Name of the skilled nursing facility | Sea Cliff | Must match a known facility in the agent's facility list |
| FacilityID | String | SimpleLTC facility identifier | SCF-001 | Alphanumeric, unique per facility |
| ReportingPeriod | String | Quarter or month of the data | Q1 2026 | Format: Q[1-4] YYYY or MMM YYYY |
| MeasureID | String | Quality measure identifier | LS-12 | Must match a defined QM ID from the QM Definitions document |
| MeasureName | String | Human-readable measure name | Falls with Major Injury | Free text, used for display |
| Numerator | Integer | Count of residents triggering the measure | 4 | Non-negative integer |
| Denominator | Integer | Count of eligible residents | 120 | Positive integer, must be > 0 |
| Rate | Decimal | Calculated rate (Numerator/Denominator × 100) | 3.33 | 0.00 to 100.00, validated against Numerator/Denominator |
| NationalAverage | Decimal | CMS national average for comparison | 3.50 | 0.00 to 100.00 |
| StateAverage | Decimal | State-level average for comparison | 3.20 | 0.00 to 100.00, optional |
| PriorRate | Decimal | Rate from the prior reporting period | 2.80 | 0.00 to 100.00, optional but needed for decline detection |
| Trend | String | Direction of change | Worsening | One of: Improving, Stable, Worsening, New |

### Optional Columns

| Column Name | Data Type | Description | Example |
|------------|-----------|-------------|---------|
| InternalTarget | Decimal | Organization's target rate | 2.50 |
| FiveStarQMRating | Integer | Current Five-Star QM component rating | 3 |
| RiskAdjusted | Boolean | Whether the rate is risk-adjusted | TRUE |
| Notes | String | Free-text notes from the export | New admission surge in Feb |

## SimpleLTC Resident Export (CSV/Excel)

Used for resident-level outlier analysis. Subject to HIPAA minimum necessary requirements.

### Required Columns

| Column Name | Data Type | Description | Example | HIPAA Note |
|------------|-----------|-------------|---------|------------|
| ResidentID | String | Facility-assigned identifier (NOT MRN/SSN) | R-0042 | Facility-assigned only |
| FacilityName | String | Facility name | Sea Cliff | — |
| AssessmentDate | Date | Date of the MDS assessment | 2026-01-15 | Format: YYYY-MM-DD |
| AssessmentType | String | Type of MDS assessment | Quarterly | One of: Admission, Quarterly, Annual, Significant Change, Discharge |
| QMTriggers | String | Comma-separated list of triggered QM IDs | LS-12,LS-10 | Must match defined QM IDs |

### Clinical Context Columns (when available)

| Column Name | Data Type | Description | MDS Source |
|------------|-----------|-------------|-----------|
| PrimaryDiagnosis | String | Primary diagnosis | Section I |
| ADLScore | Integer | Late-loss ADL composite score (0-28) | Section G |
| BIMSScore | Integer | Brief Interview for Mental Status (0-15) | Section C |
| PainScore | Integer | Pain severity (0-10 or PHQ category) | Section J |
| FallCount | Integer | Number of falls in lookback period | Section J |
| FallWithInjury | Boolean | Whether any fall resulted in major injury | Section J |
| PressureUlcerStage | String | Highest stage pressure ulcer present | Section M |
| AntipsychoticUse | Boolean | Currently receiving antipsychotic | Section N |
| TherapyMinutes | Integer | Total therapy minutes in the assessment period | Section O |
| RestorativeNursing | Boolean | Currently in a restorative nursing program | Section O |
| DischargeGoal | String | Planned discharge destination | Section Q |

### Prohibited Columns (agent must reject if present)

| Column Name | Reason |
|------------|--------|
| SSN | Protected Health Information |
| MRN | Protected Health Information |
| DateOfBirth | Protected Health Information (exact date) |
| PatientName | Protected Health Information |
| Address | Protected Health Information |
| PhoneNumber | Protected Health Information |
| InsuranceID | Protected Health Information |

## Power BI Query Response Fields

When the agent retrieves data from Power BI via the PowerBIFacilityInsightQueryFlow action:

| Field | Data Type | Description |
|-------|-----------|-------------|
| facility_name | String | Facility name from the Power BI model |
| measure_id | String | QM identifier |
| measure_name | String | Human-readable measure name |
| current_rate | Decimal | Current period rate |
| prior_rate | Decimal | Prior period rate |
| national_avg | Decimal | National average |
| trend_direction | String | Improving/Stable/Worsening |
| star_rating_impact | String | Estimated Five-Star impact |
| reporting_period | String | Data period |

## Dataverse Entity Fields

When the agent retrieves data from Dataverse via the FacilityInsightDataverseLookup or ResidentInsightDataverseLookupNative actions:

### Facility Insight Entity
| Field | Data Type | Description |
|-------|-----------|-------------|
| cr917_facilityname | String | Facility name |
| cr917_measureid | String | QM identifier |
| cr917_currentrate | Decimal | Current rate |
| cr917_priorrate | Decimal | Prior period rate |
| cr917_nationalaverage | Decimal | National average |
| cr917_reportingperiod | String | Reporting period |
| cr917_trenddirection | String | Trend |

### Resident Insight Entity
| Field | Data Type | Description |
|-------|-----------|-------------|
| cr917_residentid | String | Facility-assigned resident ID |
| cr917_facilityname | String | Facility name |
| cr917_assessmentdate | Date | Assessment date |
| cr917_qmtriggers | String | Triggered QM IDs |
| cr917_adlscore | Integer | ADL composite score |
| cr917_fallcount | Integer | Fall count |

## Validation Rules

The agent applies these validation rules during upload normalization:

1. **Required columns present**: All required columns must exist in the upload
2. **Data type validation**: Each column must match its expected data type
3. **Rate calculation check**: Rate must equal Numerator/Denominator × 100 (±0.1 tolerance)
4. **Denominator > 0**: Denominator must be a positive integer
5. **Rate range**: Rate must be between 0.00 and 100.00
6. **Facility match**: FacilityName must match a known facility
7. **QM ID match**: MeasureID must match a defined QM from the QM Definitions document
8. **PHI screening**: Reject uploads containing prohibited columns (SSN, MRN, DOB, etc.)
9. **Date format**: Dates must be in YYYY-MM-DD or recognized date format
10. **Duplicate detection**: Flag duplicate rows (same Facility + Measure + Period)

## Error Messages

| Validation Failure | Agent Response |
|-------------------|---------------|
| Missing required column | "The upload is missing the required column [ColumnName]. Please add this column and re-upload." |
| PHI detected | "This upload contains a prohibited column ([ColumnName]) that may contain Protected Health Information. Please remove this column and re-upload." |
| Rate calculation mismatch | "The rate for [MeasureName] at [FacilityName] does not match the numerator/denominator calculation. Please verify the data." |
| Unknown facility | "The facility [FacilityName] is not recognized. Known facilities: [list]. Please verify the facility name." |
| Unknown QM ID | "The measure ID [MeasureID] is not recognized. Please use standard QM IDs (e.g., LS-12, SS-02)." |

## How the Agent Uses This Document

During upload and normalization workflows:
1. Validate the uploaded file against the required columns for the appropriate format
2. Apply all validation rules before proceeding with analysis
3. Screen for prohibited PHI columns and reject if found
4. Map uploaded data to the agent's internal variables
5. Use the data dictionary to interpret Power BI and Dataverse query responses
6. Provide clear error messages when validation fails

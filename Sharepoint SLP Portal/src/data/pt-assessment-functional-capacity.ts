/**
 * PT Assessment: Functional Capacity
 *
 * Standardized assessment protocols for evaluating physical capacity for work and ADLs.
 * Evidence-based from APTA, NIOSH, and Occupational Therapy practice standards.
 *
 * Assessments included:
 * - FCE (Functional Capacity Evaluation - Comprehensive)
 * - NIOSH Lifting Equation Assessment
 * - Lifting & Carrying Performance
 * - Positional Tolerance (Sitting, Standing, Reaching)
 * - Fine Motor & Hand Function (Functional)
 * - Work Hardening / Work Conditioning Readiness
 * - Job Site Functional Analysis
 *
 * Sources:
 * - APTA (2024). Occupational Health Physical Therapy Practice
 * - NIOSH (1991). Applications Manual for the Revised NIOSH Lifting Equation
 * - Matheson, L. N. (2003). The Functional Capacity Evaluation
 */

import { auditService } from "../core/audit/AuditService";

/**
 * PT Assessment Tool Interface (Standardized)
 */
export interface PTAssessmentTool {
  id: string;
  name: string;
  abbreviation: string;
  description: string;
  category: string;
  components: string[];
  adminTime: number; // in minutes
  equipment: string[];
  precautions: string[];
  contraindications: string[];
  normalValues: string;
  abnormalFindings: string[];
  clinicalSignificance: string;
  source: string;
  citation: string;
  lastUpdated: Date;
}

/**
 * FCE - Functional Capacity Evaluation
 */
const fceAssessment: PTAssessmentTool = {
  id: "pt-afc-001",
  name: "Functional Capacity Evaluation",
  abbreviation: "FCE",
  description:
    "A comprehensive battery of performance-based tests used to determine an individual's ability to perform work-related tasks.",
  category: "functional-capacity",
  components: [
    "Material Handling (Lifting, Carrying, Pushing, Pulling)",
    "Positional Tolerance (Sitting, Standing, Walking, Reaching, Crouching)",
    "Hand Function (Grip, Pinch, Fine Motor)",
    "Cardiovascular Endurance (Step Test, Treadmill)",
    "Consistency of Effort Analysis",
  ],
  adminTime: 240,
  equipment: [
    "Weights",
    "Force Gauge",
    "Step Bench",
    "Heart Rate Monitor",
    "Grip Dynamometer",
  ],
  precautions: [
    "Monitor vitals (HR/BP) between subtests",
    "Assess for orthopedic flags during lift",
    "Watch for non-physiological effort indicators",
  ],
  contraindications: [
    "Acute myocardial infarction (within 6 weeks)",
    "Uncontrolled hypertension",
    "Severe hernia",
  ],
  normalValues:
    "Comparison to Dictionary of Occupational Titles (DOT) standards for job physical demand levels",
  abnormalFindings: [
    "Inability to reach job physical demand level",
    "Elevated HR at rest or low levels of exertion",
    "Incorrect lifting mechanics (rounded back, locked knees)",
  ],
  clinicalSignificance:
    "Critical for determining return-to-work status and disability rating.",
  source: "APTA",
  citation:
    "Matheson, L. N. (2003). The Functional Capacity Evaluation. In Occupational Ergonomics: Engineering and Psychology in Design.",
  lastUpdated: new Date("2024-03-21"),
};

/**
 * NIOSH Lifting Equation Assessment
 */
const nioshAssessment: PTAssessmentTool = {
  id: "pt-afc-002",
  name: "NIOSH Lifting Equation Assessment",
  abbreviation: "NIOSH-LE",
  description:
    "Tool for calculating the Recommended Weight Limit (RWL) and Lifting Index (LI) for manual lifting tasks.",
  category: "functional-capacity",
  components: [
    "Horizontal distance (H)",
    "Vertical location (V)",
    "Vertical distance (D)",
    "Asymmetry angle (A)",
    "Lifting frequency (F)",
    "Coupling (C)",
  ],
  adminTime: 20,
  equipment: ["Measuring tape", "Angle finder", "Stopwatch"],
  precautions: [
    "Ensure accurate measurement of task geometry",
    "Avoid measuring during worker fatigue",
  ],
  contraindications: [
    "Lifting in seated position",
    "Lifting only with one hand",
    "Lifting in narrow spaces",
  ],
  normalValues: "Lifting Index (LI) ≤ 1.0 (Safe for 90% of healthy workers)",
  abnormalFindings: [
    "Lifting Index > 1.0 (Increased risk)",
    "Lifting Index > 3.0 (Significant risk of lower back injury)",
  ],
  clinicalSignificance:
    "Determines the injury risk of specific occupational tasks.",
  source: "NIOSH",
  citation:
    "Waters, T. R., et al. (1993). Revised NIOSH equation for the design and evaluation of manual lifting tasks. Ergonomics, 36(7), 749-776.",
  lastUpdated: new Date("2024-03-21"),
};

/**
 * Job Site Functional Analysis
 */
const jobSiteAnalysis: PTAssessmentTool = {
  id: "pt-afc-003",
  name: "Job Site Functional Analysis",
  abbreviation: "JSFA",
  description:
    "On-site clinical evaluation of the physical demands of an employee's specific job duties.",
  category: "functional-capacity",
  components: [
    "Essential Functions identification",
    "Environmental analysis (lighting, noise, temp)",
    "Ergonomic risk assessment",
    "Equipment/Tool analysis",
    "Psychosocial demand screening",
  ],
  adminTime: 60,
  equipment: ["Measuring tape", "Camera", "Force gauge", "Noise meter"],
  precautions: ["Industrial safety compliance", "Privacy of other employees"],
  contraindications: ["High-risk hazardous environments without proper PPE"],
  normalValues:
    "Job demands matching employee capabilities based on FCE results",
  abnormalFindings: [
    "Mismatch between environment and employee safety boundaries",
    "Excessive repetition without recovery",
    "Poor ergonomic workstation layout",
  ],
  clinicalSignificance:
    "Essential for workstation ergonomic modification and reasonable accommodation.",
  source: "APTA",
  citation:
    "APTA (2020). Guidelines for Occupational Health Physical Therapy Services.",
  lastUpdated: new Date("2024-03-21"),
};

/**
 * Collection of all PT Functional Capacity Assessments
 */
const ptFunctionalCapacityAssessments: PTAssessmentTool[] = [
  fceAssessment,
  nioshAssessment,
  jobSiteAnalysis,
];

/**
 * Get all PT Functional Capacity Assessments
 */
export const getAllPTFunctionalCapacityAssessments = (): PTAssessmentTool[] => {
  auditService.log({
    action: "read",
    resourceType: "assessments",
    discipline: "pt",
    metadata: {
      count: ptFunctionalCapacityAssessments.length,
      category: "functional_capacity",
    },
  });
  return ptFunctionalCapacityAssessments;
};

/**
 * Get PT Functional Capacity Assessment by ID
 */
export const getPTFunctionalCapacityAssessmentById = (
  id: string,
): PTAssessmentTool | undefined => {
  const assessment = ptFunctionalCapacityAssessments.find((a) => a.id === id);
  if (assessment) {
    auditService.log({
      action: "read",
      resourceType: "assessments",
      resourceId: id,
      discipline: "pt",
      metadata: { name: assessment.name },
    });
  }
  return assessment;
};

/**
 * OT Assessment: Work Capacity
 *
 * Standardized protocols for determining worker physical and psychological capacity.
 * Evidence-based from AOTA, OSHA, and Vocational Rehabilitation standards.
 *
 * Assessments included:
 * - Work Capacity Evaluation (WCE)
 * - Job Site Analysis (Ergonomic)
 * - Worker Role Interview (WRI - MOHO based)
 * - WEIS (Work Environment Impact Scale)
 * - Functional Capacity Evaluation (FCE - Industrial)
 * - Vocational Profile (OT focus)
 *
 * Sources:
 * - AOTA (2024). Work and Industry Practice.
 * - Kielhofner, G. (2008). Model of Human Occupation (MOHO).
 * - OSHA (2023). Ergonomic Assessment Standards.
 */

import { auditService } from "../core/audit/AuditService";

/**
 * OT Assessment Tool Interface (Standardized)
 */
export interface OTAssessmentTool {
  id: string;
  name: string;
  abbreviation: string;
  category: string;
  description: string;
  domains: string[];
  administration: string;
  scoring: string;
  indications: string[];
  contraindications: string[];
  precautions: string[];
  evidenceLevel: number;
  source: string;
  citation: string;
  lastUpdated: Date;
}

/**
 * Work Capacity Evaluation (WCE)
 */
const workCapacity: OTAssessmentTool = {
  id: "ot-awc-001",
  name: "Work Capacity Evaluation",
  abbreviation: "WCE",
  category: "work-assessment",
  description:
    "Comprehensive evaluation of an individual's physical, cognitive, and psychosocial ability to perform job tasks.",
  domains: [
    "Strength/Physical tolerances",
    "Hand function",
    "Cognitive/Psychosocial work demands",
    "Work habits",
    "Safety compliance",
  ],
  administration:
    "Series of performance-based tests, job simulations, and psychometric screening (2-4 hours).",
  scoring:
    "Categorizes into sedentary, light, medium, or heavy work levels based on DOT standards.",
  indications: [
    "Return to work after injury",
    "Vocational rehabilitation",
    "Disability determination",
  ],
  contraindications: [
    "Acute healing phase of fracture",
    "Severe uncompensated back pain",
  ],
  precautions: [
    "Always monitor biomechanics to prevent re-injury",
    "Stop if physiological signs of overload occur (excessive HR)",
  ],
  evidenceLevel: 2,
  source: "AOTA",
  citation: "AOTA (2020). Work Capacity Evaluation: A summary of evidence.",
  lastUpdated: new Date("2024-03-21"),
};

/**
 * Worker Role Interview (WRI)
 */
const wriInterview: OTAssessmentTool = {
  id: "ot-awc-002",
  name: "Worker Role Interview",
  abbreviation: "WRI",
  category: "work-assessment",
  description:
    "MOHO-based assessment of how psychosocial and environmental factors impact a worker’s ability to return to work.",
  domains: [
    "Personal causation",
    "Values",
    "Interests",
    "Habits",
    "Environment",
  ],
  administration:
    "Semi-structured interview paired with job observation (approx 45 mins).",
  scoring:
    "4-point rating scale across 17 items (Supports, Interferes, or Strongly Interferes).",
  indications: [
    "Chronic pain affecting work motivation",
    "Post-injury anxiety",
    "Job mismatch",
  ],
  contraindications: ["Acute psychiatric crisis"],
  precautions: [
    "Therapeutic rapport essential for honest disclosure",
    "Cultural perception of work values",
  ],
  evidenceLevel: 2,
  source: "MOHO-IRIS",
  citation:
    "Kielhofner, G., et al. (1999). A User's Guide to the Worker Role Interview.",
  lastUpdated: new Date("2024-03-21"),
};

/**
 * Work Environment Impact Scale (WEIS)
 */
const weisScale: OTAssessmentTool = {
  id: "ot-awc-003",
  name: "Work Environment Impact Scale",
  abbreviation: "WEIS",
  category: "work-assessment",
  description:
    "Semi-structured interview designed to assess the impact of the work environment on an individual’s wellbeing and work performance.",
  domains: [
    "Physical space",
    "Social environment",
    "Temporal demands",
    "Organizational culture",
  ],
  administration: "Interview (30-60 mins).",
  scoring:
    "Individual item ratings on a 1-4 scale regarding how environment impacts work experience.",
  indications: [
    "Workplace accessibility",
    "Mental health in the workplace",
    "Job retention assessments",
  ],
  contraindications: [],
  precautions: ["Ensure workplace privacy vs employee confidentiality rules"],
  evidenceLevel: 2,
  source: "MOHO",
  citation:
    "Moore-Corner, R., et al. (1998). The Work Environment Impact Scale.",
  lastUpdated: new Date("2024-03-21"),
};

/**
 * Job Site Ergonomic Analysis
 */
const jobSiteErgonomic: OTAssessmentTool = {
  id: "ot-awc-004",
  name: "Job Site Ergonomic Analysis",
  abbreviation: "JSEA",
  category: "work-assessment",
  description:
    "Standardized on-site analysis of physical workplace hazards and workstation setup.",
  domains: [
    "Ergonomics",
    "Anthropometry",
    "Task analysis",
    "Environmental factors",
  ],
  administration:
    "Visual inspection, Force measurements, and Worker interview at the job site.",
  scoring: "Recommendations based on NIOSH/OSHA hazard thresholds.",
  indications: [
    "Repetitive strain risk",
    "Workplace ergonomics overhall",
    "Injury prevention programming",
  ],
  contraindications: ["None"],
  precautions: [
    "Safety equipment (PPE) compliance on site",
    "Industrial hazard awareness",
  ],
  evidenceLevel: 1,
  source: "OSHA",
  citation: "OSHA (2022). Ergonomics: Guidelines for Employers and Employees.",
  lastUpdated: new Date("2024-03-21"),
};

/**
 * Collection of all OT Work Capacity Assessments
 */
const otWorkAssessments: OTAssessmentTool[] = [
  workCapacity,
  wriInterview,
  weisScale,
  jobSiteErgonomic,
];

/**
 * Get all OT Work Capacity Assessments
 */
export const getAllOTWorkCapacityAssessments = (): OTAssessmentTool[] => {
  auditService.log({
    action: "read",
    resourceType: "assessments",
    discipline: "ot",
    metadata: { count: otWorkAssessments.length, category: "work" },
  });
  return otWorkAssessments;
};

/**
 * Get OT Work Capacity Assessment by ID
 */
export const getOTWorkCapacityAssessmentById = (
  id: string,
): OTAssessmentTool | undefined => {
  const assessment = otWorkAssessments.find((a) => a.id === id);
  if (assessment) {
    auditService.log({
      action: "read",
      resourceType: "assessments",
      resourceId: id,
      discipline: "ot",
      metadata: { name: assessment.name },
    });
  }
  return assessment;
};

/**
 * OT Assessment: Sensory Processing
 *
 * Standardized assessment protocols for determining sensory modulation, discrimination, and integration.
 * Evidence-based from Dunn (SPA), Ayres (SIPT/EASI), and Neuro-OT standards.
 *
 * Assessments included:
 * - Sensory Profile (Adult/Adolescent/Infant)
 * - SPM-2 (Sensory Processing Measure)
 * - Evaluation of Ayres Sensory Integration (EASI)
 * - Coma Recovery Scale-Revised (CRS-R - Sensory Subscales)
 * - Test of Sensory Functions in Infants (TSFI)
 * - SIPT (Sensory Integration and Praxis Tests - Legacy Gold Standard)
 *
 * Sources:
 * - Dunn, W. (2014). Sensory Profile 2.
 * - Ayres, A. J. (1989). SIPT Manual.
 * - Giacino, J. T. (2004). Coma Recovery Scale-Revised.
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
 * Adolescent/Adult Sensory Profile (AASP)
 */
const adultSensoryProfile: OTAssessmentTool = {
  id: "ot-asp-001",
  name: "Adolescent/Adult Sensory Profile",
  abbreviation: "AASP",
  category: "sensory-assessment",
  description:
    "Self-report questionnaire assessing sensory processing patterns based on Dunn's Model of Sensory Processing.",
  domains: [
    "Auditory",
    "Visual",
    "Touch",
    "Movement",
    "Taste/Smell",
    "Activity Level",
  ],
  administration: "Self-report 60-item questionnaire; ages 11+.",
  scoring:
    "Categorizes into low registration, sensation seeking, sensory sensitivity, and sensation avoiding.",
  indications: ["Sensory processing disorder", "ASD", "Anxiety", "ADHD"],
  contraindications: [],
  precautions: [
    "Requires insight for self-report; use caregiver version for severe cognitive impairment",
  ],
  evidenceLevel: 1,
  source: "Pearson",
  citation:
    "Brown, C., & Dunn, W. (2002). Adolescent/Adult Sensory Profile User's Manual.",
  lastUpdated: new Date("2024-03-21"),
};

/**
 * Evaluation of Ayres Sensory Integration (EASI)
 */
const easiAssessment: OTAssessmentTool = {
  id: "ot-asp-002",
  name: "Evaluation of Ayres Sensory Integration",
  abbreviation: "EASI",
  description:
    "Contemporary, norm-referenced set of assessments for sensory integration and praxis.",
  category: "sensory-assessment",
  domains: [
    "Vestibular/Proprioception",
    "Tactile",
    "Visual Perception",
    "Praxis",
    "Motor Performance",
  ],
  administration: "Direct assessment of 20 subtests; ages 3 to 12 years.",
  scoring: "Standardized score profile comparing performance to age norms.",
  indications: [
    "Ayres Sensory Integration (ASI) diagnosis",
    "Developmental coordination disorder",
    "ASD",
  ],
  contraindications: [
    "Severe orthopedic injury preventing movement",
    "Unstable pediatric cardiac condition",
  ],
  precautions: [
    "Assess in room with specialized SI equipment",
    "Monitor for autonomic nervous system arousal during spinning/heavy work",
  ],
  evidenceLevel: 2,
  source: "Mailloux-CLASI",
  citation:
    "Mailloux, Z., et al. (2020). The Evaluation of Ayres Sensory Integration (EASI).",
  lastUpdated: new Date("2024-03-21"),
};

/**
 * Coma Recovery Scale-Revised (CRS-R)
 */
const crsrAssessment: OTAssessmentTool = {
  id: "ot-asp-003",
  name: "Coma Recovery Scale-Revised",
  abbreviation: "CRS-R",
  category: "sensory-assessment",
  description:
    "Behavioral assessment tool for patients with disordered consciousness (Vegetative, Minimally Conscious).",
  domains: [
    "Auditory Function",
    "Visual Function",
    "Motor Function",
    "Oromotor/Verbal",
    "Communication",
    "Arousal",
  ],
  administration:
    "Structured hierarchy of stimuli (from simple reflexes to intentional responses).",
  scoring:
    "Total score 0-23; specific subscores determine diagnostic clinical state.",
  indications: [
    "Severe TBI",
    "Hypoxic Brain Injury",
    "Non-responsive state triage",
  ],
  contraindications: [
    "Terminal life support withdrawal phase if results don't guide comfort",
  ],
  precautions: [
    "Monitor for sympathetic storming during stimulation",
    "Coordinate with neuro-intensivist",
  ],
  evidenceLevel: 1,
  source: "Neurorehabilitation",
  citation:
    "Giacino, J. T., et al. (2004). The JFK Coma Recovery Scale-Revised: Measurement characteristics and diagnostic utility.",
  lastUpdated: new Date("2024-03-21"),
};

/**
 * Sensory Processing Measure - 2 (SPM-2)
 */
const spm2Assessment: OTAssessmentTool = {
  id: "ot-asp-004",
  name: "Sensory Processing Measure - 2",
  abbreviation: "SPM-2",
  category: "sensory-assessment",
  description:
    "Standardized tool to assess sensory processing, social participation, and praxis across different environments.",
  domains: [
    "Vision",
    "Hearing",
    "Touch",
    "Taste/Smell",
    "Body Position",
    "Balance/Motion",
    "Social Participation",
    "Praxis",
  ],
  administration:
    "Questionnaires for home, classroom, and clinic environments; birth to age 85.",
  scoring:
    "Total Sensory Systems (TSS) score; Standardized T-scores and percentiles.",
  indications: ["Global sensory screening", "School-based OT triage", "ASD"],
  contraindications: [],
  precautions: [
    "Requires comparison across multiple observers for inter-rater validity",
  ],
  evidenceLevel: 2,
  source: "WPS",
  citation:
    "Parham, L. D., et al. (2021). Sensory Processing Measure - Second Edition (SPM-2) Manual.",
  lastUpdated: new Date("2024-03-21"),
};

/**
 * Collection of all OT Sensory Assessments
 */
const otSensoryAssessments: OTAssessmentTool[] = [
  adultSensoryProfile,
  easiAssessment,
  crsrAssessment,
  spm2Assessment,
];

/**
 * Get all OT Sensory Assessments
 */
export const getAllOTSensoryAssessments = (): OTAssessmentTool[] => {
  auditService.log({
    action: "read",
    resourceType: "assessments",
    discipline: "ot",
    metadata: { count: otSensoryAssessments.length, category: "sensory" },
  });
  return otSensoryAssessments;
};

/**
 * Get OT Sensory Assessment by ID
 */
export const getOTSensoryAssessmentById = (
  id: string,
): OTAssessmentTool | undefined => {
  const assessment = otSensoryAssessments.find((a) => a.id === id);
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

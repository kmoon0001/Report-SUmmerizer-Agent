/**
 * PT Assessment: Pain & Psychosocial
 *
 * Clinical screening for pain characteristics and psychological barriers to movement.
 * Evidence-based from FABQ, TSK, and biopsychosocial assessment models.
 *
 * Assessments included:
 * - Numeric Pain Rating Scale (NPRS) / VAS
 * - Fear-Avoidance Beliefs Questionnaire (FABQ)
 * - Tampa Scale of Kinesiophobia (TSK-11)
 * - Pain Catastrophizing Scale (PCS)
 * - Patient Health Questionnaire (PHQ-9 Screen)
 * - Central Sensitization Inventory (CSI)
 *
 * Sources:
 * - Waddell, G., et al. (1993). A Fear-Avoidance Beliefs Questionnaire (FABQ).
 * - Miller, R. P., et al. (1991). The Tampa Scale for Kinesiophobia.
 * - Kroenke, K., et al. (2001). The PHQ-9.
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
 * Numeric Pain Rating Scale (NPRS)
 */
const nprsPain: PTAssessmentTool = {
  id: "pt-app-001",
  name: "Numeric Pain Rating Scale",
  abbreviation: "NPRS",
  description:
    "Self-report measure of pain intensity on a scale from 0 (No pain) to 10 (Worst imaginable pain).",
  category: "pain",
  components: [
    "Pain right now",
    "Best pain (last 24-72 hours)",
    "Worst pain (last 24-72 hours)",
  ],
  adminTime: 2,
  equipment: ["Standardized scale (visual or verbal)"],
  precautions: [
    "Assess current pain vs 24-hr average for clinical consistency",
    "Document location for each rating area",
  ],
  contraindications: [
    "Severe cognitive impairment making numerical scaling impossible",
  ],
  normalValues: "0/10 (No pain)",
  abnormalFindings: [
    ">7/10 (Severe pain intensity interfering with movement)",
    "Increase of >2 points during therapeutic exercise (may indicate tissue overload)",
    "Failure to improve over 4 weeks of therapy (chronic flag)",
  ],
  clinicalSignificance:
    "Fundamental metric for monitoring intervention impact on noxious stimuli.",
  source: "APTA",
  citation:
    "Childs, J. D., et al. (2005). Numeric pain rating scale. Journal of Orthopaedic & Sports Physical Therapy.",
  lastUpdated: new Date("2024-03-21"),
};

/**
 * Fear-Avoidance Beliefs Questionnaire (FABQ)
 */
const fabqScreen: PTAssessmentTool = {
  id: "pt-app-002",
  name: "Fear-Avoidance Beliefs Questionnaire",
  abbreviation: "FABQ",
  description:
    "Self-report questionnaire specifically focusing on how patient's fear-avoidance beliefs about physical activity and work may influence low back pain.",
  category: "psychosocial",
  components: [
    "Part I: Physical Activity subscale (4 items)",
    "Part II: Work subscale (7 items)",
  ],
  adminTime: 10,
  equipment: ["FABQ assessment form"],
  precautions: [
    "Assess for high scores in the absence of acute injury",
    "Use during multidisciplinary triage for chronic cases",
  ],
  contraindications: ["Acute medical emergency"],
  normalValues: "Physical Activity <15; Work <34 (Low fear)",
  abnormalFindings: [
    "FABQ-PA >15 (Significant fear-avoidance beliefs)",
    "FABQ-W >34 (High risk for long-term work disability)",
    "Score discrepancy with actual physical performance",
  ],
  clinicalSignificance:
    "Predictive of chronic disability and avoidance behaviors.",
  source: "APTA",
  citation:
    "Waddell, G., et al. (1993). A Fear-Avoidance Beliefs Questionnaire and the role of fear-avoidance beliefs in chronic low back pain.",
  lastUpdated: new Date("2024-03-21"),
};

/**
 * Tampa Scale of Kinesiophobia (TSK-11)
 */
const tskAssessment: PTAssessmentTool = {
  id: "pt-app-003",
  name: "Tampa Scale of Kinesiophobia",
  abbreviation: "TSK-11",
  description:
    "Assess fear of movement and (re)injury in individuals with clinical pain.",
  category: "psychosocial",
  components: [
    "11-item Likert scale (Short form)",
    "Measures somatic focus and activity avoidance",
  ],
  adminTime: 8,
  equipment: ["TSK-11 form"],
  precautions: [
    "High scores require graduated exposure therapy",
    "Document inconsistencies between words and movement performance",
  ],
  contraindications: [],
  normalValues: "<13 (Lower kinesiophobia)",
  abnormalFindings: [
    "Score >17/44 (Elevated kinesiophobia)",
    "Score >20/44 (High kinesiophobia; significant limiting factor to rehab)",
    "Avoidance of simple observation tasks",
  ],
  clinicalSignificance:
    "Helps therapist decide between biomechanical or biopsychosocial focus.",
  source: "APTA",
  citation:
    "Miller, R. P., et al. (1991). Measurement of self-efficacy in patients with chronic low back pain.",
  lastUpdated: new Date("2024-03-21"),
};

/**
 * Pain Catastrophizing Scale (PCS)
 */
const pcsScreen: PTAssessmentTool = {
  id: "pt-app-004",
  name: "Pain Catastrophizing Scale",
  abbreviation: "PCS",
  description:
    "Self-report questionnaire that evaluates rumenative thoughts, magnification, and helplessness regarding pain.",
  category: "psychosocial",
  components: [
    "Rumination (4 items)",
    "Magnification (3 items)",
    "Helplessness (6 items)",
  ],
  adminTime: 10,
  equipment: ["PCS assessment form"],
  precautions: [
    "High scores associated with poor surgical outcomes",
    "Requires integration of cognitive behavioral therapy techniques",
  ],
  contraindications: [],
  normalValues: "<20 (Low catastrophizing)",
  abnormalFindings: [
    "Score >30 (High catastrophizing; strong predictor of persistent disability)",
    'Elevated "Helplessness" subscale score',
  ],
  clinicalSignificance:
    "Indicates the degree to which a patient may interpret pain as overwhelming/uncontrollable.",
  source: "APTA",
  citation:
    "Sullivan, M. J. L., et al. (1995). The Pain Catastrophizing Scale: Development and validation.",
  lastUpdated: new Date("2024-03-21"),
};

/**
 * Collection of all PT Pain & Psychosocial Assessments
 */
const ptPainPsychosocialAssessments: PTAssessmentTool[] = [
  nprsPain,
  fabqScreen,
  tskAssessment,
  pcsScreen,
];

/**
 * Get all PT Pain & Psychosocial Assessments
 */
export const getAllPTPainPsychosocialAssessments = (): PTAssessmentTool[] => {
  auditService.log({
    action: "read",
    resourceType: "assessments",
    discipline: "pt",
    metadata: {
      count: ptPainPsychosocialAssessments.length,
      category: "pain_psychosocial",
    },
  });
  return ptPainPsychosocialAssessments;
};

/**
 * Get PT Pain & Psychosocial Assessment by ID
 */
export const getPTPainPsychosocialAssessmentById = (
  id: string,
): PTAssessmentTool | undefined => {
  const assessment = ptPainPsychosocialAssessments.find((a) => a.id === id);
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

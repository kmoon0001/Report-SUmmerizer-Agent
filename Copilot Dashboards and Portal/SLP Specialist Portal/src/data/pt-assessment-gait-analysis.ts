/**
 * PT Assessment: Gait Analysis
 *
 * Clinical protocols for determining efficiency, mechanics, and safety of human locomotion.
 * Evidence-based from Perry (Rancho), APTA, and Geriatric assessment standards.
 *
 * Assessments included:
 * - Observational Gait Analysis (Rancho Los Amigos)
 * - 10-Meter Walk Test (10MWT)
 * - 6-Minute Walk Test (6MWT)
 * - Functional Gait Assessment (FGA)
 * - Dynamic Gait Index (DGI)
 * - Rivermead Mobility Index (RMI)
 *
 * Sources:
 * - Perry J, Burnfield JM (2010). Gait Analysis: Normal and Pathological Function.
 * - APTA (2024). Gait and Movement Analysis Practice Portal.
 * - Shumway-Cook (2016). Motor Control: Translating Research into Clinical Practice.
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
 * Observational Gait Analysis (Rancho)
 */
const observationalGait: PTAssessmentTool = {
  id: "pt-aga-001",
  name: "Observational Gait Analysis (Rancho Los Amigos)",
  abbreviation: "OGA-RLA",
  description:
    "A systematic approach to identifying gait deviations in each phase of the gait cycle.",
  category: "gait-analysis",
  components: [
    "Stance Phase (Initial contact, Loading response, Mid-stance, Terminal stance)",
    "Swing Phase (Pre-swing, Initial swing, Mid-swing, Terminal swing)",
    "Trunk & Hip stability",
    "Knee mechanics (Sagittal/Frontal plane)",
    "Ankle/Foot trajectory & clearance",
  ],
  adminTime: 15,
  equipment: ["Standardized walkway (at least 20 ft)", "Rancho OGA Checklist"],
  precautions: [
    "Safety belt if patient has fall risk",
    "Assess for fatigue before completion",
  ],
  contraindications: ["Non-weight bearing status"],
  normalValues:
    "Normal joint angles and temporal/spatial parameters (1.2-1.4 m/s velocity)",
  abnormalFindings: [
    "Antalgic gait (shortened stance on painful leg)",
    "Trendelenburg sign (pelvic drop)",
    "Foot drop / circumduction",
    "Vaulting or crouched gait",
  ],
  clinicalSignificance:
    "Determines underlying mechanical causes of mobility limitation and fall risk.",
  source: "Rancho Los Amigos",
  citation:
    "Perry J, Burnfield JM. Gait Analysis: Normal and Pathological Function. 2nd ed. Thorofare, NJ: Slack; 2010.",
  lastUpdated: new Date("2024-03-21"),
};

/**
 * 10-Meter Walk Test (10MWT)
 */
const tenMeterWalk: PTAssessmentTool = {
  id: "pt-aga-002",
  name: "10-Meter Walk Test",
  abbreviation: "10MWT",
  description:
    "Measure of gait speed over a short distance, used to categorize community mobility.",
  category: "gait-analysis",
  components: [
    "2-meter acceleration zone",
    "6-meter timed zone",
    "2-meter deceleration zone",
  ],
  adminTime: 5,
  equipment: ["Stopwatch", "Standardized 10-meter course", "Tape measure"],
  precautions: ["Safety supervision", "Consistent assistive device use"],
  contraindications: ["Physician-ordered activity restriction"],
  normalValues: ">1.2 m/s for community mobility independence",
  abnormalFindings: [
    "<0.4 m/s (household ambulation only)",
    "0.4-0.8 m/s (limited community mobility)",
    "0.8-1.2 m/s (community mobility ready)",
  ],
  clinicalSignificance:
    "Standardized predictor of functional outcome and mortality.",
  source: "APTA",
  citation:
    "Graham, J. E., et al. (2008). 10-Meter Walk Test. Journal of Geriatric Physical Therapy.",
  lastUpdated: new Date("2024-03-21"),
};

/**
 * 6-Minute Walk Test (6MWT)
 */
const sixMinuteWalk: PTAssessmentTool = {
  id: "pt-aga-003",
  name: "6-Minute Walk Test",
  abbreviation: "6MWT",
  description:
    "Assessment of sub-maximal level of functional capacity and aerobic endurance.",
  category: "gait-analysis",
  components: [
    "Distance measured in 6 minutes",
    "Perceived exertion (Borg Scale)",
    "Vital signs pre/post (HR/SpO2/BP)",
  ],
  adminTime: 15,
  equipment: [
    "Standardized 30-meter lap",
    "Cones",
    "Stopwatch",
    "Borg Scale",
    "Pulse Oximeter",
  ],
  precautions: [
    "Stop for chest pain, intolerable dyspnea, leg cramps, or staggering gait",
    "Monitor vital signs carefully in pulmonary/cardiac populations",
  ],
  contraindications: [
    "Unstable angina (within 1 month)",
    "Recent MI (within 1 month)",
    "Resting HR >120",
    "Resting BP >180/100",
  ],
  normalValues: "Median 400-700 meters depending on age, height, and weight",
  abnormalFindings: [
    "Distance <200m (Severe impairment)",
    "Significant SpO2 desaturation (>4%)",
    "Elevated dyspnea >6 on Borg scale",
  ],
  clinicalSignificance:
    "Predictor of survival in COPD and HF; indicator of whole-body functional response.",
  source: "ATS",
  citation:
    "American Thoracic Society (2002). ATS Statement: Guidelines for the Six-Minute Walk Test.",
  lastUpdated: new Date("2024-03-21"),
};

/**
 * Functional Gait Assessment (FGA)
 */
const fgaAssessment: PTAssessmentTool = {
  id: "pt-aga-004",
  name: "Functional Gait Assessment",
  abbreviation: "FGA",
  description:
    "Assessment of postural stability during walking and dynamic tasks.",
  category: "gait-analysis",
  components: [
    "Gait on level surface",
    "Change in gait speed",
    "Gait with head rotations (horiz/vert)",
    "Gait with pivot turn",
    "Step over obstacle",
    "Gait with narrow base of support",
    "Gait with eyes closed",
    "Ambulating backwards",
    "Steps (climbing)",
  ],
  adminTime: 15,
  equipment: [
    "Standardized walkway (20 ft)",
    "Stopwatch",
    "Shoebox obstacle",
    "Staircase",
  ],
  precautions: [
    "High fall risk during eyes-closed task",
    "Ensure physical assistance nearby",
  ],
  contraindications: ["Severe cognitive impairment affecting task following"],
  normalValues:
    "Max score 30/30; score <22/30 indicates high fall risk in community-dwelling adults",
  abnormalFindings: [
    "Loss of stability on head turns",
    "Slow velocity <0.6 m/s",
    "Difficulty with eyes-closed task",
  ],
  clinicalSignificance:
    "Highly predictive of fall risk in vestibular and geriatric populations.",
  source: "APTA",
  citation:
    "Wrisley, D. M., et al. (2004). Reliability and validity of the Functional Gait Assessment. Journal of Neurologic Physical Therapy.",
  lastUpdated: new Date("2024-03-21"),
};

/**
 * Collection of all PT Gait Analysis Assessments
 */
const ptGaitAnalysisAssessments: PTAssessmentTool[] = [
  observationalGait,
  tenMeterWalk,
  sixMinuteWalk,
  fgaAssessment,
];

/**
 * Get all PT Gait Analysis Assessments
 */
export const getAllPTGaitAnalysisAssessments = (): PTAssessmentTool[] => {
  auditService.log({
    action: "read",
    resourceType: "assessments",
    discipline: "pt",
    metadata: {
      count: ptGaitAnalysisAssessments.length,
      category: "gait_analysis",
    },
  });
  return ptGaitAnalysisAssessments;
};

/**
 * Get PT Gait Analysis Assessment by ID
 */
export const getPTGaitAnalysisAssessmentById = (
  id: string,
): PTAssessmentTool | undefined => {
  const assessment = ptGaitAnalysisAssessments.find((a) => a.id === id);
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

/**
 * PT Assessment: Balance & Proprioception
 *
 * Standardized protocols for determining static/dynamic balance and sensory integration.
 * Evidence-based from BBS, Shumway-Cook, and NIH Rehab research.
 *
 * Assessments included:
 * - Berg Balance Scale (BBS)
 * - Timed Up and Go (TUG / TUG-Cog)
 * - Clinical Test of Sensory Interaction on Balance (mCTSIB)
 * - Functional Reach Test (FRT)
 * - Four Square Step Test (FSST)
 * - Single Leg Stance (SLS)
 * - Star Excursion Balance Test (SEBT)
 *
 * Sources:
 * - Berg K, et al. (1992). Measuring balance in the elderly.
 * - Shumway-Cook A, et al. (2000). Predicting the probability of falls.
 * - Whitney, S. L., et al. (2004). Clinical assessment of balance.
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
 * Berg Balance Scale (BBS)
 */
const bergBalance: PTAssessmentTool = {
  id: "pt-abp-001",
  name: "Berg Balance Scale",
  abbreviation: "BBS",
  description:
    "14-item objective measure that assesses static balance and fall risk in older adults.",
  category: "balance",
  components: [
    "Sitting to standing",
    "Standing unsupported",
    "Sitting unsupported",
    "Standing to sitting",
    "Transfers",
    "Standing with eyes closed",
    "Standing with feet together",
    "Reaching forward with outstretched arm",
    "Retrieving object from floor",
    "Turning to look behind",
    "Turning 360 degrees",
    "Placing alternate foot on stool",
    "Standing with one foot in front (Tandem)",
    "Standing on one foot",
  ],
  adminTime: 20,
  equipment: [
    "Stopwatch",
    "Stool/Step",
    "Ruler",
    "Chair with armrests",
    "Chair without armrests",
  ],
  precautions: [
    "Always use gait belt / stand-by assistance",
    "Assess for fatigue during last 4 tasks",
    "Always guard on the impaired side",
  ],
  contraindications: [
    "Inability to follow complex multi-step instructions",
    "Medically unstable (orthostatic hypotension)",
  ],
  normalValues: "Max score 56; scores 41-56 indicate independent/low fall risk",
  abnormalFindings: [
    "Score <45/56 (High fall risk indicator)",
    "Score <40/56 (Frequent falls likely)",
    "Inability to tandem stance >10s",
  ],
  clinicalSignificance:
    "Predictive of community fall risk and requirement for assistive devices.",
  source: "Berg",
  citation:
    "Berg, K., et al. (1992). Measuring balance in the elderly: validation of an instrument. Canadian Journal of Public Health.",
  lastUpdated: new Date("2024-03-21"),
};

/**
 * Timed Up and Go (TUG)
 */
const tugTimed: PTAssessmentTool = {
  id: "pt-abp-002",
  name: "Timed Up and Go",
  abbreviation: "TUG",
  description:
    "A simple test used to assess a person's mobility and requires both static and dynamic balance.",
  category: "balance",
  components: [
    "Stand from chair",
    "Walk 3 meters",
    "Turn 180 degrees",
    "Walk back to chair",
    "Sit down",
  ],
  adminTime: 5,
  equipment: ["Chair with armrests", "Stopwatch", "3-meter tape line"],
  precautions: [
    "Monitor for loss of balance on the turn",
    "Document use of assistive device",
  ],
  contraindications: ["Non-weight bearing", "Total unsteadiness"],
  normalValues:
    "<10 seconds (Normal/Independent); 11-20 seconds (Within normal for some elderly)",
  abnormalFindings: [
    ">12 seconds (Predictive of fall risk in community-dwelling adults)",
    ">20 seconds (Significant mobility limitations)",
    ">30 seconds (High risk/Dependency)",
  ],
  clinicalSignificance:
    "Correlates with Berg Balance and gait speed; captures sit-to-stand, walk, and turn sequence.",
  source: "Shumway-Cook",
  citation:
    "Podsiadlo, D., & Richardson, S. (1991). The timed Up & Go: A test of basic functional mobility for frail elderly persons. Journal of the American Geriatrics Society.",
  lastUpdated: new Date("2024-03-21"),
};

/**
 * m-CTSIB - Modified Clinical Test of Sensory Interaction on Balance
 */
const mctsibAssessment: PTAssessmentTool = {
  id: "pt-abp-003",
  name: "Modified CTSIB",
  abbreviation: "m-CTSIB",
  description:
    "Assessment of sensory integration for postural control across four sensory conditions.",
  category: "balance",
  components: [
    "Condition 1: Eyes open, firm surface",
    "Condition 2: Eyes closed, firm surface",
    "Condition 3: Eyes open, foam surface",
    "Condition 4: Eyes closed, foam surface",
  ],
  adminTime: 10,
  equipment: ["Stopwatch", "Standardized foam pad (e.g., AIREX)"],
  precautions: [
    "Always use gait belt / stand close behind/beside",
    "Watch for rapid sway increase on foam eyes-closed",
    "Safety first during condition 4",
  ],
  contraindications: [
    "Severe vertigo preventing standing",
    "Acute ankle instability",
  ],
  normalValues: "Maintain balance for 30s in each condition",
  abnormalFindings: [
    "Early step-out in condition 2 (Visual dependence)",
    "Early step-out in condition 4 (Vestibular/Proprioceptive deficit)",
    "Excessive postural sway",
  ],
  clinicalSignificance:
    "Identifies which sensory systems (visual, somatosensory, vestibular) are impaired for balance.",
  source: "Shumway-Cook",
  citation:
    "Shumway-Cook, A., & Horak, F. B. (1986). Assessing the influence of sensory interaction on balance.",
  lastUpdated: new Date("2024-03-21"),
};

/**
 * Four Square Step Test (FSST)
 */
const fsstAssessment: PTAssessmentTool = {
  id: "pt-abp-004",
  name: "Four Square Step Test",
  abbreviation: "FSST",
  description:
    "Dynamic balance test for rapid stepping in multiple directions.",
  category: "balance",
  components: [
    "Stepping sequence forward (squares 1-4)",
    "Stepping sequence backward (squares 4-1)",
    "Repeat twice for best time",
  ],
  adminTime: 10,
  equipment: ["4 canes / PVC pipes taped into a cross", "Stopwatch"],
  precautions: [
    "Ensure canes don't move/slip",
    "Guard patient throughout the mult-directional task",
  ],
  contraindications: ["Inability to step over obstacles", "Severe ataxia"],
  normalValues: "<12 seconds (Independent community adults)",
  abnormalFindings: [
    ">15 seconds (Increased fall risk in elderly)",
    ">12 seconds (Vestibular patient fall risk)",
  ],
  clinicalSignificance:
    "Captures dynamic stability, stepping over obstacles, and coordination.",
  source: "APTA",
  citation:
    "Dite, W., & Temple, V. A. (2002). A clinical test of stepping and change of direction to identify multiple fallers.",
  lastUpdated: new Date("2024-03-21"),
};

/**
 * Collection of all PT Balance & Proprioception Assessments
 */
const ptBalanceAssessments: PTAssessmentTool[] = [
  bergBalance,
  tugTimed,
  mctsibAssessment,
  fsstAssessment,
];

/**
 * Get all PT Balance & Proprioception Assessments
 */
export const getAllPTBalanceAssessments = (): PTAssessmentTool[] => {
  auditService.log({
    action: "read",
    resourceType: "assessments",
    discipline: "pt",
    metadata: {
      count: ptBalanceAssessments.length,
      category: "balance_proprioception",
    },
  });
  return ptBalanceAssessments;
};

/**
 * Get PT Balance & Proprioception Assessment by ID
 */
export const getPTBalanceAssessmentById = (
  id: string,
): PTAssessmentTool | undefined => {
  const assessment = ptBalanceAssessments.find((a) => a.id === id);
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

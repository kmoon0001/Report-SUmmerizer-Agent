/**
 * PT Assessment: Neurological
 *
 * Standardized protocols for evaluating nervous system integrity and motor/sensory recovery.
 * Evidence-based from ASIA, NIH, and neurological rehabilitation associations.
 *
 * Assessments included:
 * - ASIA Impairment Scale (International Standard for SCI Class)
 * - Modified Ashworth Scale (MAS - Spasticity)
 * - NIH Stroke Scale (NIHSS - Screening)
 * - Lower Extremity Motor Score (LEMS)
 * - Glasgow Coma Scale (GCS - Triage)
 * - Fugl-Meyer Assessment (FMA-LE / FMA-UE)
 * - National Institutes of Health Toolbox (NIH Toolbox - Clinical)
 *
 * Sources:
 * - American Spinal Injury Association (ASIA) (2019).
 * - Bohannon RW, Smith MB. (1987). Modified Ashworth scale.
 * - NIH Stroke Scale (NIHSS).
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
 * ASIA Impairment Scale (AIS)
 */
const asiaAIS: PTAssessmentTool = {
  id: "pt-an-001",
  name: "ASIA Impairment Scale (ISNCSCI)",
  abbreviation: "AIS",
  description:
    "International protocol for classifying the level and severity of spinal cord injury (SCI).",
  category: "neurological",
  components: [
    "Sensory level (Light touch/Pinprick) (C2-S5)",
    "Motor level (Key muscles) (C5-T1, L2-S1)",
    "Neurological Level of Injury (NLI) determination",
    "Completeness (A: Complete to E: Normal)",
  ],
  adminTime: 45,
  equipment: [
    "Pin (e.g., safety pin)",
    "Cotton swab",
    "International Standards Worksheet",
  ],
  precautions: [
    "Follow exact instructions for pinprick technique",
    "Assess in supine position for standardization",
    "Accurately identify dermatomal boundaries",
  ],
  contraindications: [
    "Acute vertebral instability",
    "Severe pain preventing position",
  ],
  normalValues:
    "Sensory (2/2 all points), Motor (5/5 all key muscles) (Scale E)",
  abnormalFindings: [
    "Grade A (Complete impairment; no S4-5 function)",
    "Grade B (Incomplete; sensory present but motor absent)",
    "Grade C (Incomplete; motor present <3/5 strength)",
    "Grade D (Incomplete; motor present >3/5 strength)",
  ],
  clinicalSignificance:
    "Determines prognosis and functional recovery potential for SCI patients.",
  source: "ASIA",
  citation:
    "American Spinal Injury Association (2019). International Standards for Neurological Classification of Spinal Cord Injury.",
  lastUpdated: new Date("2024-03-21"),
};

/**
 * Modified Ashworth Scale (MAS)
 */
const modifiedAshworth: PTAssessmentTool = {
  id: "pt-an-002",
  name: "Modified Ashworth Scale",
  abbreviation: "MAS",
  description:
    "Clinical measure of muscle spasticity / resistance to passive stretch.",
  category: "neurological",
  components: [
    "Rapid passive stretch of joint",
    "Grading 0 to 4 based on catch and resistance",
  ],
  adminTime: 5,
  equipment: ["Standard treatment plinth"],
  precautions: [
    "Perform in a standardized, calm environment",
    "Move the joint as fast as possible to elicit stretch reflex",
    "Consistent patient positioning",
  ],
  contraindications: [
    "Acute fracture/instability",
    "DVT in the limb being tested",
  ],
  normalValues: "Grade 0 (No increase in muscle tone)",
  abnormalFindings: [
    "Grade 1 (Catch and release or minimal resistance)",
    "Grade 1+ (Catch followed by minimal resistance throughout ROM)",
    "Grade 2 (Marked increase in tone throughout ROM)",
    "Grade 3 (Considerable increase in tone; passive movement difficult)",
    "Grade 4 (Affected part rigid in flexion or extension)",
  ],
  clinicalSignificance:
    "Quantifies hypertonicity and spasticity to guide pharmaceutical or therapy management.",
  source: "APTA",
  citation:
    "Bohannon, R. W., & Smith, M. B. (1987). Interrater reliability of a Modified Ashworth scale of muscle spasticity.",
  lastUpdated: new Date("2024-03-21"),
};

/**
 * NIH Stroke Scale (NIHSS)
 */
const nihssScreen: PTAssessmentTool = {
  id: "pt-an-003",
  name: "NIH Stroke Scale",
  abbreviation: "NIHSS",
  description:
    "Standardized tool for assessing the severity of a stroke in the acute and chronic phases.",
  category: "neurological",
  components: [
    "Level of consciousness (LOC)",
    "Gaze & Visual field",
    "Facial palsy",
    "Motor (Arms/Legs)",
    "Limb ataxia",
    "Sensory function",
    "Best language (Aphasia)",
    "Dysarthria",
    "Extinction/Inattention",
  ],
  adminTime: 10,
  equipment: ["NIHSS assessment tool", "Item pictures for language"],
  precautions: [
    "Score exactly as observed, not what you think the patient can do",
    "Always report the score to the medical team immediately",
  ],
  contraindications: [],
  normalValues: "0 (No stroke symptoms)",
  abnormalFindings: [
    "Score 1-4 (Minor stroke)",
    "Score 5-15 (Moderate stroke)",
    "Score 16-20 (Moderate to severe)",
    "Score 21-42 (Severe stroke)",
  ],
  clinicalSignificance:
    "Directly influences medical management (tPA/EVT) and rehabilitation triage.",
  source: "NIH",
  citation:
    "Lyden, P. (2017). Using the National Institutes of Health Stroke Scale. Stroke.",
  lastUpdated: new Date("2024-03-21"),
};

/**
 * Fugl-Meyer Assessment (LE)
 */
const fuglMeyerLE: PTAssessmentTool = {
  id: "pt-an-004",
  name: "Fugl-Meyer Assessment (Lower Extremity)",
  abbreviation: "FMA-LE",
  description:
    "Stroke-specific performance-based impairment index evaluating motor functioning, sensation, and balance.",
  category: "neurological",
  components: [
    "Motor function (Volitional movements/Synergy patterns)",
    "Joint Pain",
    "Passive Joint Motion",
    "Sensory function",
  ],
  adminTime: 30,
  equipment: ["Standardized chair", "Small ball", "Goniometer"],
  precautions: [
    "Monitor for fatigue during intensive motor testing",
    "Standardize the verbal instructions precisely",
  ],
  contraindications: ["Acute medical instability post-stroke"],
  normalValues: "Max score 34 (Lower Extremity Motor Domain)",
  abnormalFindings: [
    "Presence of synergistic movement patterns",
    "Inability to move joints out of synergy",
    "Impaired reflexive vs volitional response",
  ],
  clinicalSignificance:
    "Gold standard for tracking motor recovery after hemiplegic stroke.",
  source: "APTA",
  citation:
    "Fugl-Meyer, A. R., et al. (1975). The post-stroke hemiplegic patient. I. a method for evaluation of physical performance.",
  lastUpdated: new Date("2024-03-21"),
};

/**
 * Collection of all PT Neurological Assessments
 */
const ptNeurologicalAssessments: PTAssessmentTool[] = [
  asiaAIS,
  modifiedAshworth,
  nihssScreen,
  fuglMeyerLE,
];

/**
 * Get all PT Neurological Assessments
 */
export const getAllPTNeurologicalAssessments = (): PTAssessmentTool[] => {
  auditService.log({
    action: "read",
    resourceType: "assessments",
    discipline: "pt",
    metadata: {
      count: ptNeurologicalAssessments.length,
      category: "neurological",
    },
  });
  return ptNeurologicalAssessments;
};

/**
 * Get PT Neurological Assessment by ID
 */
export const getPTNeurologicalAssessmentById = (
  id: string,
): PTAssessmentTool | undefined => {
  const assessment = ptNeurologicalAssessments.find((a) => a.id === id);
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

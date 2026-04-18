/**
 * PT Module 3: Assessment Tools
 * Comprehensive PT assessment protocols and procedures
 * Sources: APTA Standards of Practice, Clinical assessment best practices, Tanner's assessment frameworks
 */

export interface PTAssessmentTool {
  id: string;
  name: string;
  abbreviation: string;
  description: string;
  category:
    | "functional-capacity"
    | "gait-analysis"
    | "balance"
    | "pain"
    | "rom"
    | "strength"
    | "neurological"
    | "cardiovascular"
    | "respiratory"
    | "psychosocial";
  components: string[];
  adminTime: number;
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

const ptAssessmentTools: PTAssessmentTool[] = [
  {
    id: "pt-at-001",
    name: "Functional Capacity Evaluation",
    abbreviation: "FCE",
    description:
      "Comprehensive assessment of physical abilities and limitations for work or activities",
    category: "functional-capacity",
    components: [
      "Sitting tolerance",
      "Standing tolerance",
      "Walking tolerance",
      "Lifting capacity",
      "Carrying capacity",
      "Reaching and grasping",
      "Fine motor coordination",
      "Climbing stairs",
      "Balance and coordination",
    ],
    adminTime: 120,
    equipment: ["Weights", "Shelving", "Stairs", "Dynamometer", "Stopwatch"],
    precautions: [
      "Monitor vital signs",
      "Watch for pain exacerbation",
      "Ensure safety during testing",
      "Allow rest breaks as needed",
    ],
    contraindications: [
      "Acute medical instability",
      "Severe pain",
      "Recent surgery",
    ],
    normalValues: "Varies by age, gender, and occupation",
    abnormalFindings: [
      "Reduced lifting capacity",
      "Limited endurance",
      "Poor coordination",
      "Safety concerns",
    ],
    clinicalSignificance:
      "Determines work capacity and return-to-work readiness",
    source: "APTA",
    citation: "APTA Standards of Practice for Physical Therapy",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-at-002",
    name: "Gait Analysis Protocol",
    abbreviation: "GA",
    description:
      "Systematic observation and analysis of walking pattern and mechanics",
    category: "gait-analysis",
    components: [
      "Stance phase analysis",
      "Swing phase analysis",
      "Step length symmetry",
      "Cadence",
      "Velocity",
      "Base of support",
      "Trunk control",
      "Arm swing",
      "Head position",
    ],
    adminTime: 30,
    equipment: [
      "Walkway",
      "Stopwatch",
      "Measuring tape",
      "Video camera (optional)",
    ],
    precautions: [
      "Ensure safe walking environment",
      "Use gait belt if needed",
      "Monitor for fatigue",
      "Watch for balance loss",
    ],
    contraindications: [
      "Severe balance impairment",
      "Acute pain",
      "Recent surgery",
    ],
    normalValues: "Cadence 90-120 steps/min, Velocity 1.2-1.5 m/s",
    abnormalFindings: [
      "Asymmetrical gait",
      "Reduced velocity",
      "Abnormal cadence",
      "Trunk lean",
      "Reduced arm swing",
    ],
    clinicalSignificance: "Identifies gait deviations and guides intervention",
    source: "APTA",
    citation:
      "Perry J, Burnfield JM. Gait Analysis: Normal and Pathological Function. 2nd ed. Thorofare, NJ: Slack; 2010.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-at-003",
    name: "Balance Assessment Protocol",
    abbreviation: "BAP",
    description: "Comprehensive assessment of static and dynamic balance",
    category: "balance",
    components: [
      "Static standing balance",
      "Dynamic standing balance",
      "Tandem stance",
      "Single leg stance",
      "Reaching tasks",
      "Turning",
      "Stepping",
      "Postural responses",
    ],
    adminTime: 30,
    equipment: ["Parallel bars", "Balance beam", "Foam pad", "Stopwatch"],
    precautions: [
      "Use gait belt",
      "Ensure safety",
      "Monitor for dizziness",
      "Watch for falls",
    ],
    contraindications: [
      "Severe balance impairment",
      "Acute vertigo",
      "Recent surgery",
    ],
    normalValues: "Single leg stance >30 seconds, Tandem stance >30 seconds",
    abnormalFindings: [
      "Reduced stance time",
      "Loss of balance",
      "Increased sway",
      "Inability to perform task",
    ],
    clinicalSignificance: "Predicts fall risk and guides balance training",
    source: "APTA",
    citation:
      "Shumway-Cook A, Woollacott MH. Motor Control: Translating Research into Clinical Practice. 5th ed. Philadelphia: Wolters Kluwer; 2016.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-at-004",
    name: "Pain Assessment Protocol",
    abbreviation: "PAP",
    description: "Comprehensive assessment of pain characteristics and impact",
    category: "pain",
    components: [
      "Pain location",
      "Pain intensity (VAS/NPRS)",
      "Pain quality",
      "Pain duration",
      "Pain aggravating factors",
      "Pain relieving factors",
      "Functional impact",
      "Psychological impact",
    ],
    adminTime: 15,
    equipment: ["Pain scale", "Body diagram", "Questionnaire"],
    precautions: [
      "Use standardized scales",
      "Document carefully",
      "Assess regularly",
    ],
    contraindications: [],
    normalValues: "No pain (0/10)",
    abnormalFindings: [
      "Severe pain (>7/10)",
      "Widespread pain",
      "Constant pain",
      "Psychological distress",
    ],
    clinicalSignificance: "Guides pain management and tracks progress",
    source: "APTA",
    citation: "APTA Standards of Practice for Physical Therapy",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-at-005",
    name: "Range of Motion Assessment Protocol",
    abbreviation: "ROM",
    description: "Systematic measurement of joint mobility using goniometry",
    category: "rom",
    components: [
      "Active ROM",
      "Passive ROM",
      "Resistive ROM",
      "End-feel assessment",
      "Capsular pattern assessment",
      "Hypermobility assessment",
    ],
    adminTime: 20,
    equipment: ["Goniometer", "Inclinometer", "Tape measure"],
    precautions: [
      "Use proper technique",
      "Avoid pain",
      "Stabilize proximal joint",
      "Document end-feel",
    ],
    contraindications: ["Acute inflammation", "Fracture", "Recent surgery"],
    normalValues: "Varies by joint and age",
    abnormalFindings: [
      "Reduced ROM",
      "Asymmetrical ROM",
      "Abnormal end-feel",
      "Hypermobility",
    ],
    clinicalSignificance:
      "Identifies mobility limitations and guides stretching",
    source: "APTA",
    citation:
      "Norkin CC, White DJ. Measurement of Joint Motion: A Guide to Goniometry. 5th ed. Philadelphia: FA Davis; 2016.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-at-006",
    name: "Strength Assessment Protocol",
    abbreviation: "SAP",
    description:
      "Systematic assessment of muscle strength using manual muscle testing",
    category: "strength",
    components: [
      "Manual muscle testing (0-5 scale)",
      "Dynamometry",
      "Functional strength testing",
      "Endurance testing",
      "Asymmetry assessment",
    ],
    adminTime: 30,
    equipment: ["Dynamometer", "Weights", "Resistance bands"],
    precautions: [
      "Use proper technique",
      "Avoid pain",
      "Stabilize proximal joint",
      "Document grade",
    ],
    contraindications: ["Acute inflammation", "Fracture", "Recent surgery"],
    normalValues: "5/5 (Normal strength)",
    abnormalFindings: [
      "Reduced strength (<5/5)",
      "Asymmetrical strength",
      "Rapid fatigue",
      "Pain with testing",
    ],
    clinicalSignificance:
      "Identifies weakness and guides strengthening program",
    source: "APTA",
    citation:
      "Kendall FP, et al. Muscles: Testing and Function with Posture and Pain. 5th ed. Baltimore: Wolters Kluwer; 2010.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-at-007",
    name: "Neurological Assessment Protocol",
    abbreviation: "NAP",
    description:
      "Comprehensive assessment of neurological function and deficits",
    category: "neurological",
    components: [
      "Mental status",
      "Cranial nerves",
      "Motor function",
      "Sensory function",
      "Reflexes",
      "Coordination",
      "Gait and balance",
      "Cerebellar function",
    ],
    adminTime: 45,
    equipment: ["Reflex hammer", "Tuning fork", "Monofilament", "Pinwheel"],
    precautions: [
      "Use proper technique",
      "Document findings carefully",
      "Refer if abnormal",
    ],
    contraindications: [],
    normalValues: "Normal neurological examination",
    abnormalFindings: [
      "Weakness",
      "Sensory loss",
      "Abnormal reflexes",
      "Incoordination",
      "Gait abnormality",
    ],
    clinicalSignificance:
      "Identifies neurological deficits and guides intervention",
    source: "APTA",
    citation:
      "Kandel ER, et al. Principles of Neural Science. 5th ed. New York: McGraw-Hill; 2013.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-at-008",
    name: "Cardiovascular Assessment Protocol",
    abbreviation: "CAP",
    description: "Assessment of cardiovascular function and exercise tolerance",
    category: "cardiovascular",
    components: [
      "Resting heart rate",
      "Resting blood pressure",
      "Exercise heart rate response",
      "Exercise blood pressure response",
      "Recovery heart rate",
      "Perceived exertion",
      "Symptoms during exercise",
    ],
    adminTime: 30,
    equipment: [
      "Blood pressure cuff",
      "Pulse oximeter",
      "Stopwatch",
      "Exercise equipment",
    ],
    precautions: [
      "Monitor vital signs",
      "Watch for symptoms",
      "Stop if abnormal response",
      "Have emergency equipment available",
    ],
    contraindications: [
      "Acute cardiac event",
      "Uncontrolled hypertension",
      "Severe arrhythmia",
    ],
    normalValues: "HR 60-100 bpm, BP <120/80 mmHg",
    abnormalFindings: [
      "Elevated resting HR",
      "Elevated BP",
      "Excessive HR response",
      "Symptoms during exercise",
    ],
    clinicalSignificance: "Determines exercise safety and capacity",
    source: "APTA",
    citation: "APTA Standards of Practice for Physical Therapy",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-at-009",
    name: "Respiratory Assessment Protocol",
    abbreviation: "RAP",
    description: "Assessment of respiratory function and breathing patterns",
    category: "respiratory",
    components: [
      "Respiratory rate",
      "Breathing pattern",
      "Breath sounds",
      "Chest expansion",
      "Accessory muscle use",
      "Dyspnea assessment",
      "Cough assessment",
    ],
    adminTime: 15,
    equipment: ["Stethoscope", "Measuring tape", "Spirometer (optional)"],
    precautions: [
      "Use proper technique",
      "Document findings",
      "Refer if abnormal",
    ],
    contraindications: [],
    normalValues: "RR 12-20 breaths/min, Normal breath sounds",
    abnormalFindings: [
      "Tachypnea",
      "Abnormal breath sounds",
      "Reduced chest expansion",
      "Dyspnea",
    ],
    clinicalSignificance:
      "Identifies respiratory dysfunction and guides intervention",
    source: "APTA",
    citation: "APTA Standards of Practice for Physical Therapy",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-at-010",
    name: "Psychosocial Assessment Protocol",
    abbreviation: "PSA",
    description:
      "Assessment of psychological and social factors affecting rehabilitation",
    category: "psychosocial",
    components: [
      "Mood and affect",
      "Anxiety level",
      "Depression screening",
      "Motivation",
      "Social support",
      "Coping strategies",
      "Beliefs about pain",
      "Fear-avoidance beliefs",
    ],
    adminTime: 20,
    equipment: ["Questionnaires", "Interview guide"],
    precautions: [
      "Use standardized tools",
      "Document carefully",
      "Refer if needed",
    ],
    contraindications: [],
    normalValues: "Normal mood, low anxiety, good coping",
    abnormalFindings: [
      "Depression",
      "High anxiety",
      "Poor coping",
      "Fear-avoidance",
      "Lack of motivation",
    ],
    clinicalSignificance: "Identifies psychological barriers to recovery",
    source: "APTA",
    citation: "APTA Standards of Practice for Physical Therapy",
    lastUpdated: new Date("2024-01-15"),
  },
];

/**
 * Get PT assessment tool by ID
 */
export function getPTAssessmentToolById(
  id: string,
): PTAssessmentTool | undefined {
  return ptAssessmentTools.find((t) => t.id === id);
}

/**
 * Get PT assessment tools by category
 */
export function getPTAssessmentToolsByCategory(
  category: string,
): PTAssessmentTool[] {
  return ptAssessmentTools.filter((t) => t.category === category);
}

/**
 * Search PT assessment tools
 */
export function searchPTAssessmentTools(query: string): PTAssessmentTool[] {
  const lowerQuery = query.toLowerCase();
  return ptAssessmentTools.filter(
    (t) =>
      t.name.toLowerCase().includes(lowerQuery) ||
      t.abbreviation.toLowerCase().includes(lowerQuery) ||
      t.description.toLowerCase().includes(lowerQuery),
  );
}

/**
 * Get all PT assessment tools
 */
export function getAllPTAssessmentTools(): PTAssessmentTool[] {
  return ptAssessmentTools;
}

/**
 * Get quick assessment tools (< 20 minutes)
 */
export function getQuickPTAssessmentTools(): PTAssessmentTool[] {
  return ptAssessmentTools.filter((t) => t.adminTime < 20);
}

/**
 * Get PT assessment tool categories
 */
export function getPTAssessmentToolCategories(): string[] {
  const categories = new Set(ptAssessmentTools.map((t) => t.category));
  return Array.from(categories);
}

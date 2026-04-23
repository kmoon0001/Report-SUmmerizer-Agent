// ============================================================================
// SNF Deconditioning & Bed Mobility Data
// Sources: APTA, CDC, Medicare guidelines
// ============================================================================

export interface DeconditioningSign {
  sign: string;
  description: string;
  clinicalImplication: string;
}

export const deconditioningSigns: DeconditioningSign[] = [
  {
    sign: "Muscle Atrophy",
    description: "Loss of muscle mass and strength",
    clinicalImplication: "Requires progressive resistance training",
  },
  {
    sign: "Reduced Endurance",
    description: "Decreased exercise tolerance",
    clinicalImplication: "Needs aerobic conditioning",
  },
  {
    sign: "Joint Stiffness",
    description: "Reduced range of motion",
    clinicalImplication: "Requires stretching and ROM exercises",
  },
  {
    sign: "Orthostatic Intolerance",
    description: "Dizziness on standing",
    clinicalImplication: "Needs gradual position changes",
  },
  {
    sign: "Decreased Bone Density",
    description: "Osteopenia/osteoporosis",
    clinicalImplication: "Needs weight-bearing exercise",
  },
];

export interface BedMobilityProgression {
  phase: number;
  name: string;
  description: string;
  exercises: string[];
  frequency: string;
  precautions: string[];
  goals: string[];
}

export const bedMobilityProgression: BedMobilityProgression[] = [
  {
    phase: 1,
    name: "Phase 1: Supine Position",
    description: "Initial mobility in supine position",
    exercises: [
      "Ankle pumps",
      "Quad sets",
      "Hamstring sets",
      "Gluteal sets",
      "Deep breathing",
    ],
    frequency: "Every 1-2 hours",
    precautions: ["Monitor for pain", "Check vital signs", "Assess tolerance"],
    goals: [
      "Prevent complications",
      "Maintain circulation",
      "Activate muscles",
    ],
  },
  {
    phase: 2,
    name: "Phase 2: Side-lying",
    description: "Progression to side-lying position",
    exercises: [
      "Log roll with assistance",
      "Side-lying to supine",
      "Head control exercises",
      "Arm elevation",
    ],
    frequency: "2-4x/day",
    precautions: [
      "Use proper body mechanics",
      "Support head and neck",
      "Monitor for pressure points",
    ],
    goals: [
      "Improve positioning",
      "Prevent pressure injuries",
      "Enhance comfort",
    ],
  },
  {
    phase: 3,
    name: "Phase 3: Sitting at Edge of Bed",
    description: "Progression to sitting position",
    exercises: [
      "Semi-Fowler's to full sitting",
      "Sitting balance exercises",
      "Leg swinging",
      "Weight shifting",
    ],
    frequency: "3-5x/day",
    precautions: [
      "Prevent orthostatic hypotension",
      "Support trunk",
      "Monitor for dizziness",
    ],
    goals: [
      "Improve orthostatic tolerance",
      "Prepare for standing",
      "Enhance trunk control",
    ],
  },
  {
    phase: 4,
    name: "Phase 4: Standing",
    description: "Progression to standing position",
    exercises: [
      "Standing at bedside",
      "Weight shifting",
      "Balance exercises",
      "Arm support exercises",
    ],
    frequency: "4-6x/day",
    precautions: [
      "Use support as needed",
      "Monitor vital signs",
      "Prevent falls",
    ],
    goals: [
      "Improve standing tolerance",
      "Prepare for ambulation",
      "Enhance balance",
    ],
  },
];

export interface TransferAssistanceLevel {
  level: string;
  description: string;
  assistance: string;
  example: string;
}

export const transferAssistanceLevels: TransferAssistanceLevel[] = [
  {
    level: "Independent",
    description: "Patient performs transfer safely without assistance",
    assistance: "None",
    example: "Patient transfers without help",
  },
  {
    level: "Supervision",
    description: "Patient requires verbal cues or standby assistance",
    assistance: "Standby",
    example: "Cueing or close proximity",
  },
  {
    level: "Contact Guard",
    description: "Patient requires light touch for balance",
    assistance: "Contact guard",
    example: "Hand on patient for balance",
  },
  {
    level: "Minimal Assist",
    description: "Patient requires ≤25% physical assistance",
    assistance: "Minimal assist",
    example: "Patient does 75% of work",
  },
  {
    level: "Moderate Assist",
    description: "Patient requires 26-50% physical assistance",
    assistance: "Moderate assist",
    example: "Patient does 50% of work",
  },
  {
    level: "Maximal Assist",
    description: "Patient requires 51-75% physical assistance",
    assistance: "Maximal assist",
    example: "Patient does 25% of work",
  },
  {
    level: "Total Assist",
    description: "Patient requires >75% physical assistance",
    assistance: "Total assist",
    example: "Patient does minimal work",
  },
];

export interface TransferTechnique {
  type: string;
  name: string;
  description: string;
  steps: string[];
  assistanceLevels: string[];
  safetyTips: string[];
  equipment: string[];
}

export const transferTechniques: TransferTechnique[] = [
  {
    type: "Bed to Chair",
    name: "Pivot Transfer",
    description: "Standard transfer technique using pivot motion",
    steps: [
      "Position chair close to bed (15-20 inches)",
      "Lock wheelchair brakes",
      "Patient sits at edge of bed",
      "Pivot on foot, use arms for support",
      "Sit in chair",
    ],
    assistanceLevels: [
      "Independent",
      "Contact guard",
      "Minimal assist",
      "Moderate assist",
      "Max assist",
    ],
    safetyTips: [
      "Ensure non-slip footwear",
      "Check chair stability",
      "Use gait belt if needed",
      "Clear path of obstacles",
    ],
    equipment: [
      "Gait belt",
      "Transfer board (if indicated)",
      "Wheelchair with removable arms",
    ],
  },
  {
    type: "Chair to Toilet",
    name: "Standing Transfer",
    description: "Transfer from chair to toilet",
    steps: [
      "Position chair close to toilet",
      "Lock wheelchair",
      "Patient stands with assistance",
      "Pivot to toilet",
      "Sit on toilet",
    ],
    assistanceLevels: [
      "Independent",
      "Contact guard",
      "Minimal assist",
      "Moderate assist",
    ],
    safetyTips: [
      "Install grab bars",
      "Use raised toilet seat",
      "Ensure floor is dry",
      "Check toilet stability",
    ],
    equipment: ["Raised toilet seat", "Grab bars", "Toilet safety frame"],
  },
  {
    type: "Car Transfer",
    name: "Swivel Seat Transfer",
    description: "Transfer to and from vehicle",
    steps: [
      "Position vehicle close to curb",
      "Lock parking brake",
      "Rotate seat away from door",
      "Patient pivots into vehicle",
      "Rotate seat back",
    ],
    assistanceLevels: ["Independent", "Minimal assist", "Moderate assist"],
    safetyTips: [
      "Use vehicle handrails",
      "Consider transfer board",
      "Check seatbelt function",
      "Ensure vehicle is stable",
    ],
    equipment: ["Transfer board", "Vehicle handrails", "Seat cushion"],
  },
  {
    type: "Bed to Stretcher",
    name: "Slide Board Transfer",
    description: "Transfer using slide board for minimal friction",
    steps: [
      "Position stretcher at same height as bed",
      "Insert slide board under patient",
      "Slide patient to stretcher",
      "Remove slide board",
    ],
    assistanceLevels: ["2+ staff required", "Moderate assist", "Max assist"],
    safetyTips: [
      "Use proper body mechanics",
      "Coordinate with team",
      "Check patient comfort",
      "Monitor for skin integrity",
    ],
    equipment: ["Slide board", "Transfer sheet", "Gait belt"],
  },
];

export interface FunctionalMobilityAssessment {
  name: string;
  description: string;
  whatItMeasures: string[];
  scoring: string;
  clinicalInterpretation: string;
}

export const functionalMobilityAssessments: FunctionalMobilityAssessment[] = [
  {
    name: "Timed Up & Go (TUG)",
    description: "Measures mobility and fall risk",
    whatItMeasures: ["Standing balance", "Gait speed", "Turn ability"],
    scoring:
      "Time in seconds\n<10s = Low risk\n10-19s = Moderate risk\n≥20s = High risk",
    clinicalInterpretation: "Predicts fall risk and functional mobility",
  },
  {
    name: "30-Second Chair Stand Test",
    description: "Measures lower body strength",
    whatItMeasures: ["Leg strength", "Endurance", "Functional strength"],
    scoring: "Number of stands in 30 seconds\nCompare to age norms",
    clinicalInterpretation: "Assesses lower body strength for functional tasks",
  },
  {
    name: "4-Stage Balance Test",
    description: "Assesses balance ability",
    whatItMeasures: ["Static balance", "Dynamic balance", "Stability limits"],
    scoring: "Stages 1-4\nStage achieved indicates balance level",
    clinicalInterpretation: "Identifies balance deficits and fall risk",
  },
];

export interface DeconditioningIntervention {
  category: string;
  name: string;
  description: string;
  evidenceLevel: number;
  citation: string;
  implementation: string[];
  frequency: string;
}

export const deconditioningInterventions: DeconditioningIntervention[] = [
  {
    category: "Exercise",
    name: "Progressive Resistance Training",
    description: "Gradually increasing resistance to build strength",
    evidenceLevel: 1,
    citation: "Liu C, et al. Resistance Training for Frailty. JAMA, 2019.",
    implementation: [
      "Start with light resistance",
      "Progress gradually",
      "Focus on major muscle groups",
      "Include functional movements",
    ],
    frequency: "2-3x/week",
  },
  {
    category: "Exercise",
    name: "Aerobic Conditioning",
    description: "Improves cardiovascular endurance",
    evidenceLevel: 1,
    citation: "Ward B, et al. Aerobic Exercise for Frailty. JAMA, 2020.",
    implementation: [
      "Start with short durations",
      "Progress gradually",
      "Use comfortable intensity",
      "Include rest periods",
    ],
    frequency: "3-5x/week",
  },
  {
    category: "Exercise",
    name: "Balance Training",
    description: "Improves balance and reduces fall risk",
    evidenceLevel: 1,
    citation:
      "Shumway-Cook A, et al. Balance Training for Older Adults. JAMA, 2017.",
    implementation: [
      "Start with static balance",
      "Progress to dynamic balance",
      "Add dual-tasking",
      "Include perturbation training",
    ],
    frequency: "3-5x/week",
  },
  {
    category: "Positioning",
    name: "Positioning Protocol",
    description: "Optimal positioning to prevent complications",
    evidenceLevel: 1,
    citation: "CDC Guidelines for Pressure Injury Prevention, 2019.",
    implementation: [
      "Change position every 2 hours",
      "Use pressure redistribution",
      "Maintain proper alignment",
      "Monitor skin integrity",
    ],
    frequency: "Every 2 hours",
  },
];

export interface ADLTraining {
  activity: string;
  techniques: string[];
  adaptiveEquipment: string[];
  energyConservation: string[];
  safetyConsiderations: string[];
}

export const adlTraining: ADLTraining[] = [
  {
    activity: "Dressing",
    techniques: [
      "Seated dressing",
      "Distal to proximal",
      "Use of assistive devices",
    ],
    adaptiveEquipment: [
      "Button hooks",
      "Zipper pulls",
      "Shoe horns",
      "Dressing sticks",
    ],
    energyConservation: [
      "Sit while dressing",
      "Organize clothes",
      "Take breaks",
    ],
    safetyConsiderations: ["Non-slip footwear", "Secure rugs", "Good lighting"],
  },
  {
    activity: "Bathing",
    techniques: ["Seated bathing", "No-rinse cleansers", "Back washing aids"],
    adaptiveEquipment: [
      "Shower chair",
      "Grab bars",
      "Handheld shower",
      "Long-handled sponges",
    ],
    energyConservation: [
      "Plan bath time",
      "Use warm water",
      "Minimize transfers",
    ],
    safetyConsiderations: [
      "Non-slip mats",
      "Temperature control",
      "Emergency call",
    ],
  },
  {
    activity: "Grooming",
    techniques: ["Seated grooming", "Adaptive techniques"],
    adaptiveEquipment: [
      "Electric razor",
      "Adaptive toothbrush",
      "Long-handled mirrors",
    ],
    energyConservation: [
      "Organize supplies",
      "Take breaks",
      "Use electric devices",
    ],
    safetyConsiderations: [
      "Non-slip surfaces",
      "Safe storage",
      "Emergency access",
    ],
  },
  {
    activity: "Toileting",
    techniques: ["Seated transfer", "Proper positioning"],
    adaptiveEquipment: ["Raised toilet seat", "Grab bars", "Commode chair"],
    energyConservation: [
      "Plan timing",
      "Minimize transfers",
      "Use bedside commode if needed",
    ],
    safetyConsiderations: [
      "Grab bars",
      "Non-slip floor",
      "Call bell within reach",
    ],
  },
];

export interface MobilityProgression {
  phase: string;
  name: string;
  description: string;
  exercises: string[];
  frequency: string;
  progressionCriteria: string[];
}

export const mobilityProgression: MobilityProgression[] = [
  {
    phase: "1",
    name: "Bed Mobility",
    description: "Initial mobility in bed",
    exercises: ["Ankle pumps", "Quad sets", "Heel slides", "Log roll"],
    frequency: "Every 1-2 hours",
    progressionCriteria: [
      "Tolerates exercises",
      "No pain or dizziness",
      "Stable vital signs",
    ],
  },
  {
    phase: "2",
    name: "Sitting Tolerance",
    description: "Progression to sitting",
    exercises: [
      "Semi-Fowler's to sitting",
      "Sitting balance",
      "Weight shifting",
    ],
    frequency: "3-5x/day",
    progressionCriteria: [
      "30 minutes sitting tolerance",
      "No orthostatic symptoms",
      "Stable vital signs",
    ],
  },
  {
    phase: "3",
    name: "Standing Tolerance",
    description: "Progression to standing",
    exercises: ["Standing at bedside", "Weight shifting", "Balance exercises"],
    frequency: "4-6x/day",
    progressionCriteria: [
      "2 minutes standing tolerance",
      "No dizziness",
      "Stable vital signs",
    ],
  },
  {
    phase: "4",
    name: "Ambulation",
    description: "Progression to walking",
    exercises: ["Parallel bars", "Assistive device training", "Gait training"],
    frequency: "Daily PT",
    progressionCriteria: [
      "Safe ambulation with assistive device",
      "Steady gait",
      "No safety concerns",
    ],
  },
];

export interface DischargeCriteria {
  criteria: string;
  description: string;
  assessmentMethod: string;
  minimumRequirement: string;
}

export const dischargeCriteria: DischargeCriteria[] = [
  {
    criteria: "Mobility",
    description: "Safe ambulation with appropriate assistive device",
    assessmentMethod: "Timed Up & Go, gait assessment",
    minimumRequirement: "Ambulate 50 feet with assistive device",
  },
  {
    criteria: "Transfers",
    description: "Independent or safe assistance for transfers",
    assessmentMethod: "Observation, functional assessment",
    minimumRequirement: "Independent or minimal assist for all transfers",
  },
  {
    criteria: "Stair Negotiation",
    description: "Safe stair negotiation for home discharge",
    assessmentMethod: "Stair test, observation",
    minimumRequirement: "Navigate 1-2 steps with assistive device",
  },
  {
    criteria: "ADL Independence",
    description: "Independent or safe assistance for basic ADLs",
    assessmentMethod: "Functional Independence Measure (FIM)",
    minimumRequirement: "FIM score ≥70",
  },
  {
    criteria: "Home Safety",
    description: "Home environment safe for discharge",
    assessmentMethod: "Home safety assessment",
    minimumRequirement: "No significant hazards identified",
  },
];

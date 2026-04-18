// ============================================================================
// SNF Transfer Training Data
// Sources: APTA, Medicare guidelines
// ============================================================================

export interface TransferType {
  name: string;
  description: string;
  indications: string[];
  contraindications: string[];
  equipment: string[];
}

export const transferTypes: TransferType[] = [
  {
    name: "Pivot Transfer",
    description: "Patient pivots on foot to transfer between surfaces",
    indications: [
      "Most patients with adequate strength",
      "Hip precautions not required",
      "Good balance",
    ],
    contraindications: [
      "Unstable fractures",
      "Severe weakness",
      "High fall risk without assistance",
    ],
    equipment: [
      "Gait belt",
      "Transfer board (if indicated)",
      "Wheelchair with removable arms",
    ],
  },
  {
    name: "Slide Board Transfer",
    description: "Patient slides on board with minimal friction",
    indications: [
      "Patients with limited strength",
      "Bariatric patients",
      "Neurological patients",
    ],
    contraindications: [
      "Skin integrity concerns",
      "Unstable spine",
      "Inability to follow instructions",
    ],
    equipment: ["Slide board", "Transfer sheet", "Gait belt"],
  },
  {
    name: "Lift Transfer",
    description: "Mechanical lift transfers patient between surfaces",
    indications: [
      "Bariatric patients",
      "Patients with severe weakness",
      "No upper body strength",
    ],
    contraindications: [
      "Skin integrity concerns",
      "Unstable fractures",
      "Lift not available",
    ],
    equipment: ["Hoyer lift", "Sling", "Ceiling lift (if available)"],
  },
];

export interface TransferAssistanceLevel {
  level: string;
  description: string;
  assistancePercentage: string;
  example: string;
}

export const transferAssistanceLevels: TransferAssistanceLevel[] = [
  {
    level: "Independent",
    description: "Patient performs safely without assistance",
    assistancePercentage: "0%",
    example: "Patient transfers without help",
  },
  {
    level: "Supervision",
    description: "Patient requires verbal cues or standby",
    assistancePercentage: "0%",
    example: "Cueing or close proximity",
  },
  {
    level: "Contact Guard",
    description: "Patient requires light touch for balance",
    assistancePercentage: "0-10%",
    example: "Hand on patient for balance",
  },
  {
    level: "Minimal Assist",
    description: "Patient requires ≤25% physical assistance",
    assistancePercentage: "25%",
    example: "Patient does 75% of work",
  },
  {
    level: "Moderate Assist",
    description: "Patient requires 26-50% physical assistance",
    assistancePercentage: "50%",
    example: "Patient does 50% of work",
  },
  {
    level: "Maximal Assist",
    description: "Patient requires 51-75% physical assistance",
    assistancePercentage: "75%",
    example: "Patient does 25% of work",
  },
  {
    level: "Total Assist",
    description: "Patient requires >75% physical assistance",
    assistancePercentage: "100%",
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
  {
    type: "Shower Chair Transfer",
    name: "Seated Transfer",
    description: "Transfer to shower chair",
    steps: [
      "Position shower chair inside tub",
      "Lock wheelchair",
      "Patient slides to shower chair",
      "Secure position",
    ],
    assistanceLevels: [
      "Independent",
      "Contact guard",
      "Minimal assist",
      "Moderate assist",
    ],
    safetyTips: [
      "Use non-slip mat",
      "Install grab bars",
      "Check chair stability",
      "Ensure proper drainage",
    ],
    equipment: ["Shower chair", "Non-slip mat", "Grab bars"],
  },
];

export interface TransferEquipment {
  name: string;
  description: string;
  indications: string[];
  contraindications: string[];
  setup: string[];
  safetyTips: string[];
}

export const transferEquipment: TransferEquipment[] = [
  {
    name: "Gait Belt",
    description: "Safety belt for transfer assistance",
    indications: [
      "Patients needing assistance",
      "Fall risk patients",
      "Weak patients",
    ],
    contraindications: [
      "Abdominal injuries",
      "Recent abdominal surgery",
      "Skin integrity concerns",
    ],
    setup: [
      "Position around waist",
      "Secure snug but comfortable",
      "Check for proper placement",
    ],
    safetyTips: [
      "Never grab patient directly",
      "Use belt for support only",
      "Monitor for discomfort",
    ],
  },
  {
    name: "Transfer Board",
    description: "Sliding board for minimal friction transfers",
    indications: [
      "Patients with limited strength",
      "Bariatric patients",
      "Neurological patients",
    ],
    contraindications: [
      "Skin integrity concerns",
      "Unstable spine",
      "Inability to follow instructions",
    ],
    setup: [
      "Place on both surfaces",
      "Ensure stable position",
      "Check for smooth surface",
    ],
    safetyTips: [
      "Use both hands for stability",
      "Move slowly and steadily",
      "Check board stability",
    ],
  },
  {
    name: "Hoyer Lift",
    description: "Mechanical lift for patient transfers",
    indications: [
      "Bariatric patients",
      "Severe weakness",
      "No upper body strength",
    ],
    contraindications: [
      "Skin integrity concerns",
      "Unstable fractures",
      "Lift not available",
    ],
    setup: [
      "Position lift over patient",
      "Attach sling correctly",
      "Test lift mechanism",
    ],
    safetyTips: [
      "Check weight capacity",
      "Ensure proper sling placement",
      "Monitor patient during transfer",
    ],
  },
  {
    name: "Raised Toilet Seat",
    description: "Elevates toilet height for easier transfers",
    indications: [
      "Hip precautions",
      "Weak lower extremities",
      "Balance impairments",
    ],
    contraindications: ["None specific", "Check toilet stability"],
    setup: ["Install over toilet", "Ensure secure fit", "Check stability"],
    safetyTips: [
      "Use grab bars",
      "Check stability before use",
      "Monitor for slippage",
    ],
  },
  {
    name: "Grab Bars",
    description: "Handrails for support during transfers",
    indications: ["Balance impairments", "Weakness", "Fall risk"],
    contraindications: ["Inability to reach", "Weak grip strength"],
    setup: [
      "Install at appropriate height",
      "Secure to wall studs",
      "Test stability",
    ],
    safetyTips: [
      "Use for support only",
      "Check stability regularly",
      "Position for easy reach",
    ],
  },
];

export interface TransferSafetyProtocol {
  step: string;
  description: string;
  checklist: string[];
}

export const transferSafetyProtocols: TransferSafetyProtocol[] = [
  {
    step: "Pre-Transfer Assessment",
    description: "Assess patient before transfer",
    checklist: [
      "Pain level",
      "Vital signs",
      "Strength assessment",
      "Balance assessment",
      "Fall risk",
    ],
  },
  {
    step: "Environment Preparation",
    description: "Prepare environment for safe transfer",
    checklist: [
      "Clear path",
      "Lock wheelchair",
      "Remove obstacles",
      "Check lighting",
      "Ensure space",
    ],
  },
  {
    step: "Patient Preparation",
    description: "Prepare patient for transfer",
    checklist: [
      "Non-slip footwear",
      "Explain procedure",
      "Position patient",
      "Check equipment",
      "Verify assistance",
    ],
  },
  {
    step: "Transfer Execution",
    description: "Execute transfer safely",
    checklist: [
      "Use proper body mechanics",
      "Coordinate with patient",
      "Monitor for distress",
      "Support as needed",
      "Check safety",
    ],
  },
  {
    step: "Post-Transfer Care",
    description: "Care after transfer",
    checklist: [
      "Ensure comfort",
      "Check positioning",
      "Monitor vital signs",
      "Document transfer",
      "Provide education",
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
    criteria: "Transfer Independence",
    description: "Independent or safe assistance for all transfers",
    assessmentMethod: "Observation, functional assessment",
    minimumRequirement: "Independent or minimal assist for all transfers",
  },
  {
    criteria: "Transfer Safety",
    description: "Safe transfer technique without falls",
    assessmentMethod: "Observation, safety assessment",
    minimumRequirement: "No falls, safe technique",
  },
  {
    criteria: "Home Transfer Readiness",
    description: "Ability to perform home transfers",
    assessmentMethod: "Home simulation, observation",
    minimumRequirement: "Perform home transfers safely",
  },
  {
    criteria: "Caregiver Training",
    description: "Caregiver trained in transfer techniques",
    assessmentMethod: "Demonstration, return demonstration",
    minimumRequirement: "Caregiver demonstrates safe technique",
  },
];

export interface ComplicationPrevention {
  complication: string;
  signsSymptoms: string[];
  prevention: string[];
  management: string[];
}

export const complicationPrevention: ComplicationPrevention[] = [
  {
    complication: "Skin Breakdown",
    signsSymptoms: ["Redness", "Blistering", "Bruising", "Skin tears"],
    prevention: [
      "Inspect skin before/after",
      "Use proper equipment",
      "Check for pressure points",
      "Moisturize skin",
    ],
    management: [
      "Relieve pressure",
      "Clean wound",
      "Monitor for infection",
      "Document",
    ],
  },
  {
    complication: "Orthostatic Hypotension",
    signsSymptoms: [
      "Dizziness",
      "Lightheadedness",
      "Nausea",
      "Blurred vision",
      "Fainting",
    ],
    prevention: [
      "Progress position changes slowly",
      "Hydrate adequately",
      "Monitor vital signs",
      "Use compression stockings",
    ],
    management: [
      "Return to previous position",
      "Elevate legs",
      "Monitor vital signs",
      "Hydrate",
    ],
  },
  {
    complication: "Falls",
    signsSymptoms: [
      "Loss of balance",
      "Inability to recover",
      "Impact with ground",
    ],
    prevention: [
      "Assess fall risk",
      "Use assistive devices",
      "Clear environment",
      "Supervise transfers",
    ],
    management: [
      "Assess injuries",
      "Call for help",
      "Document incident",
      "Review transfer technique",
    ],
  },
];

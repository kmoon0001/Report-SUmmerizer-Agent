// ============================================================================
// SNF ADL Training Data
// Sources: APTA, Medicare guidelines
// ============================================================================

export interface ADLActivity {
  name: string;
  description: string;
  techniques: string[];
  adaptiveEquipment: string[];
  energyConservation: string[];
  safetyConsiderations: string[];
}

export const adlActivities: ADLActivity[] = [
  {
    name: "Dressing",
    description: "Putting on and taking off clothing",
    techniques: [
      "Seated dressing",
      "Distal to proximal",
      "Use of assistive devices",
      "Lay flat for lower body",
    ],
    adaptiveEquipment: [
      "Button hooks",
      "Zipper pulls",
      "Shoe horns",
      "Dressing sticks",
      "Elastic shoelaces",
    ],
    energyConservation: [
      "Sit while dressing",
      "Organize clothes",
      "Take breaks",
      "Do one area at a time",
    ],
    safetyConsiderations: [
      "Non-slip footwear",
      "Secure rugs",
      "Good lighting",
      "Clear path",
    ],
  },
  {
    name: "Bathing",
    description: "Personal hygiene and cleaning",
    techniques: [
      "Seated bathing",
      "No-rinse cleansers",
      "Back washing aids",
      "Long-handled sponges",
    ],
    adaptiveEquipment: [
      "Shower chair",
      "Grab bars",
      "Handheld shower",
      "Long-handled sponges",
      "Bath bench",
    ],
    energyConservation: [
      "Plan bath time",
      "Use warm water",
      "Minimize transfers",
      "Batch similar tasks",
    ],
    safetyConsiderations: [
      "Non-slip mats",
      "Temperature control",
      "Emergency call",
      "Non-slip floor",
    ],
  },
  {
    name: "Grooming",
    description: "Personal appearance and hygiene",
    techniques: [
      "Seated grooming",
      "Adaptive techniques",
      "Two-handed techniques",
    ],
    adaptiveEquipment: [
      "Electric razor",
      "Adaptive toothbrush",
      "Long-handled mirrors",
      "Adaptive combs",
    ],
    energyConservation: [
      "Organize supplies",
      "Take breaks",
      "Use electric devices",
      "Sit while grooming",
    ],
    safetyConsiderations: [
      "Non-slip surfaces",
      "Safe storage",
      "Emergency access",
      "Fire safety",
    ],
  },
  {
    name: "Toileting",
    description: "Using the toilet and managing incontinence",
    techniques: [
      "Seated transfer",
      "Proper positioning",
      "Assistance as needed",
    ],
    adaptiveEquipment: [
      "Raised toilet seat",
      "Grab bars",
      "Commode chair",
      "Toilet safety frame",
      "Bedside commode",
    ],
    energyConservation: [
      "Plan timing",
      "Minimize transfers",
      "Use bedside commode if needed",
      "Organize supplies",
    ],
    safetyConsiderations: [
      "Grab bars",
      "Non-slip floor",
      "Call bell within reach",
      "Emergency response",
    ],
  },
  {
    name: "Feeding",
    description: "Eating and drinking",
    techniques: ["Seated feeding", "Adaptive utensils", "Modified diets"],
    adaptiveEquipment: [
      "Adaptive utensils",
      "Non-slip mats",
      "Cup holders",
      "Straw clips",
    ],
    energyConservation: [
      "Sit comfortably",
      "Take breaks",
      "Small frequent meals",
      "Rest before meals",
    ],
    safetyConsiderations: [
      "Upright position",
      "Check food temperature",
      "Monitor for choking",
      "Proper positioning",
    ],
  },
];

export interface AdaptiveEquipment {
  name: string;
  description: string;
  indications: string[];
  contraindications: string[];
  setup: string[];
  safetyTips: string[];
}

export const adaptiveEquipment: AdaptiveEquipment[] = [
  {
    name: "Button Hooks",
    description: "Assist with buttoning clothes",
    indications: ["Weak hand grip", "Arthritis", "Limited dexterity"],
    contraindications: ["Severe cognitive impairment", "Inability to use"],
    setup: [
      "Hook through buttonhole",
      "Pull through button",
      "Secure in place",
    ],
    safetyTips: [
      "Practice with supervision",
      "Check for proper fit",
      "Monitor for skin irritation",
    ],
  },
  {
    name: "Zipper Pulls",
    description: "Assist with zipping clothes",
    indications: ["Weak hand grip", "Arthritis", "Limited dexterity"],
    contraindications: ["Severe cognitive impairment", "Inability to use"],
    setup: ["Attach to zipper pull", "Use loop for pulling", "Secure in place"],
    safetyTips: [
      "Practice with supervision",
      "Check for proper fit",
      "Monitor for skin irritation",
    ],
  },
  {
    name: "Shoe Horns",
    description: "Assist with putting on shoes",
    indications: ["Limited bending", "Hip precautions", "Weak lower body"],
    contraindications: ["Severe cognitive impairment", "Inability to use"],
    setup: ["Insert into shoe", "Slide foot in", "Remove horn"],
    safetyTips: [
      "Use long-handled for standing",
      "Check for proper fit",
      "Monitor for balance",
    ],
  },
  {
    name: "Dressing Sticks",
    description: "Assist with putting on pants and socks",
    indications: ["Limited bending", "Hip precautions", "Weak lower body"],
    contraindications: ["Severe cognitive impairment", "Inability to use"],
    setup: ["Attach to clothing", "Pull up", "Remove stick"],
    safetyTips: [
      "Use with supervision",
      "Check for proper fit",
      "Monitor for balance",
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

export interface EnergyConservation {
  strategy: string;
  description: string;
  implementation: string[];
  examples: string[];
}

export const energyConservationStrategies: EnergyConservation[] = [
  {
    strategy: "Prioritize Tasks",
    description: "Focus on essential activities first",
    implementation: [
      "Identify must-do vs nice-to-do",
      "Schedule high-energy tasks first",
      "Delegate when possible",
    ],
    examples: [
      "Do laundry in morning when energy is highest",
      "Save socializing for afternoon",
      "Prepare meals in batches",
    ],
  },
  {
    strategy: "Pace Yourself",
    description: "Balance activity with rest",
    implementation: [
      "Take breaks every 15-20 minutes",
      "Alternate active and rest periods",
      "Stop before exhaustion",
    ],
    examples: [
      "Sit while brushing teeth",
      "Rest after dressing",
      "Take breaks during meal prep",
    ],
  },
  {
    strategy: "Use Energy-Saving Techniques",
    description: "Optimize movement efficiency",
    implementation: [
      "Sit for tasks when possible",
      "Use assistive devices",
      "Organize workspace",
    ],
    examples: [
      "Use rolling cart for cleaning",
      "Sit to cook",
      "Use long-handled tools",
    ],
  },
  {
    strategy: "Plan Ahead",
    description: "Anticipate energy needs",
    implementation: [
      "Schedule rest before activities",
      "Prepare supplies in advance",
      "Consider energy cost",
    ],
    examples: [
      "Rest before shower",
      "Organize clothes the night before",
      "Batch similar tasks",
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
    criteria: "ADL Independence",
    description: "Independent or safe assistance for basic ADLs",
    assessmentMethod: "Functional Independence Measure (FIM)",
    minimumRequirement: "FIM score ≥70",
  },
  {
    criteria: "Home Readiness",
    description: "Ability to perform ADLs at home",
    assessmentMethod: "Home simulation, observation",
    minimumRequirement: "Perform home ADLs safely",
  },
  {
    criteria: "Caregiver Training",
    description: "Caregiver trained in ADL assistance",
    assessmentMethod: "Demonstration, return demonstration",
    minimumRequirement: "Caregiver demonstrates safe technique",
  },
  {
    criteria: "Adaptive Equipment Use",
    description: "Proper use of adaptive equipment",
    assessmentMethod: "Observation, return demonstration",
    minimumRequirement: "Patient demonstrates proper use",
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
    complication: "Fatigue",
    signsSymptoms: [
      "Exhaustion",
      "Decreased performance",
      "Irritability",
      "Decreased concentration",
    ],
    prevention: [
      "Pace activities",
      "Take breaks",
      "Prioritize tasks",
      "Rest before/after",
    ],
    management: ["Rest", "Hydrate", "Reduce activity", "Monitor for signs"],
  },
  {
    complication: "Falls",
    signsSymptoms: [
      "Loss of balance",
      "Inability to recover",
      "Impact with ground",
    ],
    prevention: [
      "Use assistive devices",
      "Clear environment",
      "Supervise transfers",
      "Assess fall risk",
    ],
    management: [
      "Assess injuries",
      "Call for help",
      "Document incident",
      "Review technique",
    ],
  },
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
];

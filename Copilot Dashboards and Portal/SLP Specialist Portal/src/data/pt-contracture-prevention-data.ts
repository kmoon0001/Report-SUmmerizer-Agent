// ============================================================================
// SNF Contracture Prevention Data
// Sources: APTA, Medicare guidelines
// ============================================================================

export interface ContracturePrevention {
  area: string;
  stretches: string[];
  frequency: string;
  positioning: string[];
  equipment: string[];
  evidenceLevel: number;
  citation: string;
}

export const contracturePreventionProtocols: ContracturePrevention[] = [
  {
    area: "Ankle",
    stretches: [
      "Ankle circles",
      "Dorsiflexion/plantarflexion",
      "Inversion/eversion",
    ],
    frequency: "2-4x/day",
    positioning: ["Heel support", "Footboard use", "Neutral alignment"],
    equipment: ["Ankle weights (if indicated)", "Splints (if indicated)"],
    evidenceLevel: 1,
    citation: "APTA Guidelines for Contracture Prevention, 2020",
  },
  {
    area: "Knee",
    stretches: ["Heel slides", "Straight leg raises", "Quad sets"],
    frequency: "2-4x/day",
    positioning: ["Knee extension", "Avoid prolonged flexion"],
    equipment: [
      "Knee immobilizer (if indicated)",
      "Continuous passive motion (if indicated)",
    ],
    evidenceLevel: 1,
    citation: "APTA Guidelines for Contracture Prevention, 2020",
  },
  {
    area: "Hip",
    stretches: ["Glute sets", "Heel slides", "Abduction/adduction"],
    frequency: "2-4x/day",
    positioning: [
      "Neutral alignment",
      "Avoid excessive flexion",
      "Abduction pillow (if indicated)",
    ],
    equipment: ["Abduction pillow", "Leg lifter (if indicated)"],
    evidenceLevel: 1,
    citation: "APTA Guidelines for Contracture Prevention, 2020",
  },
  {
    area: "Shoulder",
    stretches: ["Pendulum exercises", "Passive ROM", "Scapular retraction"],
    frequency: "2-4x/day",
    positioning: ["Arm support", "Avoid internal rotation"],
    equipment: ["Sling (if indicated)", "Pulley system (if indicated)"],
    evidenceLevel: 1,
    citation: "APTA Guidelines for Contracture Prevention, 2020",
  },
  {
    area: "Elbow",
    stretches: ["Wrist flexion/extension", "Forearm pronation/supination"],
    frequency: "2-4x/day",
    positioning: ["Neutral alignment", "Avoid prolonged flexion"],
    equipment: ["Splint (if indicated)"],
    evidenceLevel: 1,
    citation: "APTA Guidelines for Contracture Prevention, 2020",
  },
  {
    area: "Wrist/Hand",
    stretches: [
      "Finger extensions",
      "Wrist flexion/extension",
      "Thumb opposition",
    ],
    frequency: "2-4x/day",
    positioning: ["Hand in functional position", "Splinting (if indicated)"],
    equipment: ["Hand splint", "Therapy putty", "Tennis ball (for grip)"],
    evidenceLevel: 1,
    citation: "APTA Guidelines for Contracture Prevention, 2020",
  },
];

export interface StretchingTechnique {
  name: string;
  description: string;
  procedure: string[];
  frequency: string;
  duration: string;
  precautions: string[];
}

export const stretchingTechniques: StretchingTechnique[] = [
  {
    name: "Passive ROM",
    description: "Therapist moves joint through range",
    procedure: [
      "Support joint",
      "Move slowly through range",
      "Stop at resistance",
      "Return to start",
    ],
    frequency: "2-4x/day",
    duration: "5-10 minutes",
    precautions: [
      "Monitor for pain",
      "Avoid forced movement",
      "Check for contraindications",
    ],
  },
  {
    name: "Active ROM",
    description: "Patient moves joint through range",
    procedure: [
      "Instruct patient",
      "Guide movement",
      "Support as needed",
      "Encourage full range",
    ],
    frequency: "2-4x/day",
    duration: "5-10 minutes",
    precautions: [
      "Monitor for fatigue",
      "Encourage proper form",
      "Adjust for limitations",
    ],
  },
  {
    name: "Static Stretch",
    description: "Hold stretch for extended period",
    procedure: [
      "Position joint",
      "Apply gentle stretch",
      "Hold 30-60 seconds",
      "Release slowly",
    ],
    frequency: "2-4x/day",
    duration: "30-60 seconds per stretch",
    precautions: ["No bouncing", "Monitor for pain", "Avoid overstretching"],
  },
  {
    name: "Dynamic Stretch",
    description: "Move through range repeatedly",
    procedure: [
      "Start at beginning",
      "Move through range",
      "Return to start",
      "Repeat",
    ],
    frequency: "2-4x/day",
    duration: "10-15 repetitions",
    precautions: ["Controlled movement", "Monitor for pain", "Avoid jerking"],
  },
];

export interface PositioningProtocol {
  position: string;
  purpose: string;
  technique: string[];
  duration: string;
  precautions: string[];
}

export const positioningProtocols: PositioningProtocol[] = [
  {
    position: "High Fowler's",
    purpose: "Improve breathing, prevent aspiration",
    technique: [
      "Head elevated 60-90 degrees",
      "Support back and arms",
      "Feet flat or on footrest",
    ],
    duration: "As needed for breathing",
    precautions: [
      "Monitor for pressure points",
      "Ensure comfort",
      "Check circulation",
    ],
  },
  {
    position: "Semi-Fowler's",
    purpose: "Comfort, breathing, digestion",
    technique: [
      "Head elevated 30-45 degrees",
      "Support back",
      "Knees slightly elevated",
    ],
    duration: "Extended periods",
    precautions: ["Prevent sliding", "Check skin integrity", "Ensure comfort"],
  },
  {
    position: "Side-lying",
    purpose: "Pressure relief, comfort",
    technique: [
      "30-degree angle",
      "Support head and neck",
      "Place pillow between legs",
      "Support arms",
    ],
    duration: "2 hours max, then reposition",
    precautions: [
      "Check skin on hips and ankles",
      "Ensure proper alignment",
      "Monitor for discomfort",
    ],
  },
  {
    position: "Supine",
    purpose: "Rest, recovery",
    technique: [
      "Head supported",
      "Arms at sides or on pillow",
      "Knees slightly bent",
    ],
    duration: "As needed",
    precautions: [
      "Turn every 2 hours",
      "Check skin integrity",
      "Prevent pressure ulcers",
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
    criteria: "ROM Preservation",
    description: "Maintained range of motion",
    assessmentMethod: "ROM assessment",
    minimumRequirement: "Full or functional ROM maintained",
  },
  {
    criteria: "Stretching Independence",
    description: "Patient/caregiver can perform stretching",
    assessmentMethod: "Demonstration, return demonstration",
    minimumRequirement: "Demonstrates proper stretching technique",
  },
  {
    criteria: "Positioning Independence",
    description: "Patient/caregiver can position properly",
    assessmentMethod: "Demonstration, return demonstration",
    minimumRequirement: "Demonstrates proper positioning technique",
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
    complication: "Contracture",
    signsSymptoms: ["Reduced ROM", "Stiffness", "Pain", "Deformity"],
    prevention: [
      "Regular stretching",
      "Proper positioning",
      "ROM exercises",
      "Splinting if needed",
    ],
    management: [
      "Physical therapy",
      "Stretching program",
      "Splinting",
      "Medical evaluation",
    ],
  },
  {
    complication: "Pressure Injury",
    signsSymptoms: ["Redness", "Blistering", "Open wound", "Drainage"],
    prevention: [
      "Reposition every 2 hours",
      "Use pressure-relieving surface",
      "Skin inspection",
    ],
    management: ["Relieve pressure", "Wound care", "Infection monitoring"],
  },
  {
    complication: "Deep Vein Thrombosis",
    signsSymptoms: ["Swelling", "Pain", "Redness", "Warmth"],
    prevention: [
      "Ankle pumps",
      "Compression stockings",
      "Early mobilization",
      "Hydration",
    ],
    management: ["Medical evaluation", "Ultrasound", "Anticoagulation therapy"],
  },
];

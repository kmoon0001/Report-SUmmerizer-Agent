// ============================================================================
// SNF Positioning & Pressure Relief Data
// Sources: APTA, CDC, Medicare guidelines
// ============================================================================

export interface PositioningTechnique {
  position: string;
  purpose: string;
  technique: string[];
  duration: string;
  precautions: string[];
  equipment: string[];
}

export const positioningTechniques: PositioningTechnique[] = [
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
    equipment: ["Head of bed elevation", "Back support", "Arm supports"],
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
    equipment: ["Head of bed elevation", "Back support", "Knee roll"],
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
    equipment: ["Body pillows", "Leg pillows", "Head pillow"],
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
    equipment: ["Head support", "Arm support", "Knee roll"],
  },
  {
    position: "Sims' Position",
    purpose: "Pressure relief, rectal exams",
    technique: [
      "Side-lying with forward lean",
      "Top leg flexed",
      "Bottom leg extended",
    ],
    duration: "Limited duration",
    precautions: [
      "Monitor for discomfort",
      "Check skin integrity",
      "Ensure stability",
    ],
    equipment: ["Body pillows", "Head pillow"],
  },
];

export interface PressureRelief {
  technique: string;
  description: string;
  indications: string[];
  contraindications: string[];
  procedure: string[];
  frequency: string;
}

export const pressureReliefTechniques: PressureRelief[] = [
  {
    technique: "Repositioning",
    description: "Regular position changes to prevent pressure injuries",
    indications: [
      "Immobility",
      "Reduced sensation",
      "Poor nutrition",
      "Incontinence",
    ],
    contraindications: ["Specific medical restrictions", "Unstable fractures"],
    procedure: [
      "Turn every 2 hours",
      "Use 30-degree angle for side-lying",
      "Check skin during repositioning",
    ],
    frequency: "Every 2 hours",
  },
  {
    technique: "Pressure-Relieving Surfaces",
    description: "Specialized surfaces to distribute pressure",
    indications: [
      "High risk for pressure injuries",
      "Existing pressure injuries",
      "Immobility",
    ],
    contraindications: [
      "Specific medical restrictions",
      "Surface not compatible",
    ],
    procedure: [
      "Select appropriate surface",
      "Ensure proper setup",
      "Check for proper fit",
    ],
    frequency: "Continuous use",
  },
  {
    technique: "Skin Inspection",
    description: "Regular skin checks to detect early signs of breakdown",
    indications: [
      "All immobile patients",
      "High risk patients",
      "Post-operative",
    ],
    contraindications: ["None specific"],
    procedure: [
      "Inspect pressure points",
      "Check for redness",
      "Document findings",
    ],
    frequency: "Every shift, with repositioning",
  },
  {
    technique: "Pressure Redistribution",
    description:
      "Techniques to redistribute pressure away from high-risk areas",
    indications: [
      "High risk for pressure injuries",
      "Existing pressure injuries",
    ],
    contraindications: ["Specific medical restrictions"],
    procedure: [
      "Use pressure-relieving devices",
      "Avoid direct pressure on bony prominences",
      "Maintain proper alignment",
    ],
    frequency: "Continuous",
  },
];

export interface SkinAssessment {
  area: string;
  riskFactors: string[];
  inspectionPoints: string[];
  prevention: string[];
}

export const skinAssessmentAreas: SkinAssessment[] = [
  {
    area: "Sacrum",
    riskFactors: ["Prolonged sitting", "Incontinence", "Poor nutrition"],
    inspectionPoints: ["Color", "Temperature", "Moisture", "Integrity"],
    prevention: [
      "Reposition every 2 hours",
      "Use pressure-relieving surface",
      "Keep clean and dry",
    ],
  },
  {
    area: "Heels",
    riskFactors: ["Prolonged supine", "Edema", "Poor circulation"],
    inspectionPoints: ["Color", "Temperature", "Swelling", "Integrity"],
    prevention: [
      "Heel suspension",
      "Reposition frequently",
      "Keep dry and clean",
    ],
  },
  {
    area: "Hips",
    riskFactors: ["Side-lying", "Bony prominence", "Poor nutrition"],
    inspectionPoints: ["Color", "Temperature", "Moisture", "Integrity"],
    prevention: [
      "Use pressure-relieving surface",
      "Reposition every 2 hours",
      "Check alignment",
    ],
  },
  {
    area: "Elbows",
    riskFactors: ["Prolonged supine", "Bony prominence"],
    inspectionPoints: ["Color", "Temperature", "Integrity"],
    prevention: [
      "Elbow protectors",
      "Reposition frequently",
      "Check alignment",
    ],
  },
  {
    area: "Back of Head",
    riskFactors: ["Prolonged supine", "Cervical spine precautions"],
    inspectionPoints: ["Color", "Temperature", "Integrity"],
    prevention: [
      "Head repositioning",
      "Use pressure-relieving surface",
      "Check alignment",
    ],
  },
];

export interface PressureInjuryStage {
  stage: string;
  name: string;
  description: string;
  characteristics: string[];
  treatment: string[];
}

export const pressureInjuryStages: PressureInjuryStage[] = [
  {
    stage: "Stage 1",
    name: "Non-Blanchable Redness",
    description: "Intact skin with non-blanchable redness",
    characteristics: [
      "Redness that doesn't blanch",
      "May be painful",
      "May be warm or cool",
      "May be firm or soft",
    ],
    treatment: [
      "Relieve pressure",
      "Keep clean and dry",
      "Monitor for progression",
    ],
  },
  {
    stage: "Stage 2",
    name: "Partial-Thickness Loss",
    description: "Partial-thickness skin loss",
    characteristics: [
      "Shallow open ulcer",
      "Intact or ruptured blister",
      "Pink or red wound bed",
      "No slough",
    ],
    treatment: [
      "Clean wound",
      "Moist wound healing",
      "Protect from infection",
      "Relieve pressure",
    ],
  },
  {
    stage: "Stage 3",
    name: "Full-Thickness Loss",
    description: "Full-thickness skin loss",
    characteristics: [
      "Deep open ulcer",
      "Visible subcutaneous fat",
      "May have slough",
      "May have tunneling",
    ],
    treatment: [
      "Debridement if needed",
      "Wound care",
      "Infection monitoring",
      "Pressure relief",
    ],
  },
  {
    stage: "Stage 4",
    name: "Full-Thickness with Extensive Damage",
    description: "Full-thickness with extensive damage",
    characteristics: [
      "Deep open ulcer",
      "Exposed muscle/bone",
      "Slough or eschar",
      "Tunneling/undermining",
    ],
    treatment: [
      "Advanced wound care",
      "Debridement",
      "Infection management",
      "Multidisciplinary approach",
    ],
  },
];

export interface RepositioningProtocol {
  schedule: string;
  positions: string[];
  duration: string;
  checks: string[];
}

export const repositioningProtocols: RepositioningProtocol[] = [
  {
    schedule: "Every 2 Hours",
    positions: ["Supine", "Left side-lying", "Supine", "Right side-lying"],
    duration: "2 hours per position",
    checks: ["Skin inspection", "Comfort assessment", "Position verification"],
  },
  {
    schedule: "Every 4 Hours (Low Risk)",
    positions: ["Supine", "Left side-lying", "Supine", "Right side-lying"],
    duration: "4 hours per position",
    checks: ["Skin inspection", "Comfort assessment"],
  },
  {
    schedule: "Every 1 Hour (High Risk)",
    positions: ["Supine", "Left side-lying", "Supine", "Right side-lying"],
    duration: "1 hour per position",
    checks: ["Skin inspection", "Comfort assessment", "Pressure device check"],
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
    criteria: "Skin Integrity",
    description: "No pressure injuries or early signs",
    assessmentMethod: "Skin assessment",
    minimumRequirement: "No Stage 1 or higher pressure injuries",
  },
  {
    criteria: "Repositioning Independence",
    description: "Patient/caregiver can reposition safely",
    assessmentMethod: "Demonstration, return demonstration",
    minimumRequirement: "Demonstrates proper repositioning technique",
  },
  {
    criteria: "Pressure-Relieving Equipment",
    description: "Proper use of pressure-relieving equipment",
    assessmentMethod: "Demonstration, return demonstration",
    minimumRequirement: "Demonstrates proper equipment use",
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
    complication: "Pressure Injury",
    signsSymptoms: ["Redness", "Blistering", "Open wound", "Drainage", "Odor"],
    prevention: [
      "Reposition every 2 hours",
      "Use pressure-relieving surface",
      "Skin inspection",
      "Keep clean and dry",
    ],
    management: [
      "Relieve pressure",
      "Wound care",
      "Infection monitoring",
      "Multidisciplinary approach",
    ],
  },
  {
    complication: "Contracture",
    signsSymptoms: ["Reduced ROM", "Stiffness", "Pain", "Deformity"],
    prevention: [
      "Regular ROM exercises",
      "Proper positioning",
      "Stretching",
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
    complication: "Deep Vein Thrombosis",
    signsSymptoms: ["Swelling", "Pain", "Redness", "Warmth", "Tenderness"],
    prevention: [
      "Ankle pumps",
      "Compression stockings",
      "Early mobilization",
      "Hydration",
    ],
    management: ["Medical evaluation", "Ultrasound", "Anticoagulation therapy"],
  },
];

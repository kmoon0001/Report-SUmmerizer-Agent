// ============================================================================
// SNF Stair Negotiation Data
// Sources: APTA, Medicare guidelines
// ============================================================================

export interface StairAssessment {
  name: string;
  description: string;
  whatItMeasures: string[];
  procedure: string[];
  scoring: string;
  clinicalInterpretation: string;
}

export const stairAssessments: StairAssessment[] = [
  {
    name: "Stair Negotiation Test",
    description: "Assesses ability to navigate stairs safely",
    whatItMeasures: ["Leg strength", "Balance", "Coordination", "Endurance"],
    procedure: [
      "Patient ascends stairs",
      "Patient descends stairs",
      "Observe technique",
      "Assess safety",
    ],
    scoring: "Safe/Unsafe, Assistive device needed, Assistance level required",
    clinicalInterpretation: "Predicts home discharge readiness and fall risk",
  },
  {
    name: "Timed Up & Go with Stairs",
    description: "TUG test with stair component",
    whatItMeasures: ["Mobility", "Stair ability", "Balance"],
    procedure: [
      "Perform TUG",
      "Add stair component",
      "Time completion",
      "Assess technique",
    ],
    scoring: "Time in seconds, Safety observed",
    clinicalInterpretation:
      "Comprehensive mobility assessment including stairs",
  },
];

export interface StairTechnique {
  direction: string;
  name: string;
  description: string;
  steps: string[];
  assistiveDevice: string;
  safetyTips: string[];
}

export const stairTechniques: StairTechnique[] = [
  {
    direction: "Ascending",
    name: "Up Stairs - Good Lead",
    description: "Lead with stronger leg when going up",
    steps: [
      "Stand at bottom of stairs",
      "Hold railing with dominant hand",
      "Step up with stronger leg first",
      "Bring weaker leg to same step",
      "Repeat for each step",
    ],
    assistiveDevice: "Handrail, cane, or walker",
    safetyTips: [
      "Hold railing with both hands if possible",
      "Take one step at a time",
      "Ensure foot is fully on step",
      "Don't rush",
      "Use assistive device as needed",
    ],
  },
  {
    direction: "Descending",
    name: "Down Stairs - Bad Lead",
    description: "Lead with weaker leg when going down",
    steps: [
      "Stand at top of stairs",
      "Hold railing with dominant hand",
      "Step down with weaker leg first",
      "Bring stronger leg to same step",
      "Repeat for each step",
    ],
    assistiveDevice: "Handrail, cane, or walker",
    safetyTips: [
      "Hold railing with both hands if possible",
      "Take one step at a time",
      "Ensure foot is fully on step",
      "Don't rush",
      "Use assistive device as needed",
    ],
  },
  {
    direction: "Carrying Items",
    name: "Stairs with Carrying",
    description: "Technique for carrying items up/down stairs",
    steps: [
      "Clear path of obstacles",
      "Use elevator if available",
      "If stairs, carry items in one hand",
      "Hold railing with other hand",
      "Take extra care with balance",
    ],
    assistiveDevice: "Handrail, backpack for weight distribution",
    safetyTips: [
      "Avoid carrying too much at once",
      "Use backpack to distribute weight",
      "Take breaks if needed",
      "Ask for help with heavy items",
      "Don't carry items while learning",
    ],
  },
];

export interface AssistiveDevice {
  name: string;
  description: string;
  indications: string[];
  contraindications: string[];
  setup: string[];
  stairTechnique: string;
}

export const assistiveDevices: AssistiveDevice[] = [
  {
    name: "Cane",
    description: "Single-point cane for balance support",
    indications: [
      "Mild balance impairment",
      "Unilateral weakness",
      "Mild instability",
    ],
    contraindications: [
      "Severe balance impairment",
      "Bilateral weakness",
      "Inability to bear weight",
    ],
    setup: [
      "Hold in hand opposite weaker leg",
      "Tip 6 inches from foot",
      "Handle at wrist crease",
    ],
    stairTechnique: "Cane up with good leg, cane down with bad leg",
  },
  {
    name: "Walker",
    description: "Four-point walker for maximum stability",
    indications: [
      "Moderate balance impairment",
      "Bilateral weakness",
      "High fall risk",
    ],
    contraindications: [
      "Inability to lift walker",
      "Cognitive impairment",
      "Space limitations",
    ],
    setup: [
      "Adjust height to wrist crease",
      "Feet flat on ground",
      "Lock brakes if wheeled",
    ],
    stairTechnique: "Walker up with good leg, walker down with bad leg",
  },
  {
    name: "Rolling Walker",
    description: "Wheeled walker for easier mobility",
    indications: [
      "Moderate weakness",
      "Endurance limitations",
      "Need rest breaks",
    ],
    contraindications: [
      "Poor balance",
      "Inability to control brakes",
      "Cognitive impairment",
    ],
    setup: [
      "Lock brakes before standing",
      "Unlock before moving",
      "Check brakes regularly",
    ],
    stairTechnique: "Not recommended for stairs without assistance",
  },
  {
    name: "Handrail",
    description: "Fixed handrail for stair support",
    indications: ["All stair users", "Balance support", "Safety"],
    contraindications: ["None"],
    setup: [
      "Ensure secure installation",
      "Check for loose bolts",
      "Verify height",
    ],
    stairTechnique: "Hold with one or both hands for support",
  },
];

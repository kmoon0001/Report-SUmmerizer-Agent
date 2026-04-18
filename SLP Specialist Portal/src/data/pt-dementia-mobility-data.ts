// ============================================================================
// SNF Dementia-Related Mobility Data
// Sources: APTA, Alzheimer's Association, Medicare guidelines
// ============================================================================

export interface DementiaMobilityStrategy {
  name: string;
  description: string;
  implementation: string[];
  communicationTips: string[];
  environmentalModifications: string[];
  evidenceLevel: number;
  citation: string;
}

export const dementiaMobilityStrategies: DementiaMobilityStrategy[] = [
  {
    name: "Simplified Instructions",
    description: "Break down mobility tasks into simple steps",
    implementation: [
      "Use short, clear commands",
      "Demonstrate each step",
      "Allow time for processing",
      "Use visual cues",
    ],
    communicationTips: [
      "Speak slowly and clearly",
      "Use simple words",
      "Repeat instructions as needed",
      "Avoid complex explanations",
    ],
    environmentalModifications: [
      "Clear path to bathroom",
      "Install night lights",
      "Use contrasting colors",
      "Remove clutter",
    ],
    evidenceLevel: 1,
    citation: "Alzheimer's Association Guidelines, 2021",
  },
  {
    name: "Routine-Based Mobility",
    description: "Establish consistent mobility routines",
    implementation: [
      "Same times for activities",
      "Same caregivers when possible",
      "Consistent environment",
      "Predictable sequence",
    ],
    communicationTips: [
      "Explain what will happen",
      "Use familiar phrases",
      "Reassure throughout",
      "Validate feelings",
    ],
    environmentalModifications: [
      "Consistent room layout",
      "Familiar objects nearby",
      "Minimize changes",
      "Calming environment",
    ],
    evidenceLevel: 1,
    citation: "Alzheimer's Association Guidelines, 2021",
  },
  {
    name: "Positive Reinforcement",
    description: "Encourage mobility through positive feedback",
    implementation: [
      "Praise effort, not just success",
      "Use encouraging language",
      "Celebrate small achievements",
      "Avoid criticism",
    ],
    communicationTips: [
      "Use positive language",
      "Focus on abilities",
      "Be patient",
      "Maintain eye contact",
    ],
    environmentalModifications: [
      "Comfortable environment",
      "Familiar music",
      "Personal items nearby",
      "Calming colors",
    ],
    evidenceLevel: 1,
    citation: "Alzheimer's Association Guidelines, 2021",
  },
  {
    name: "Visual Cues",
    description: "Use visual cues to guide mobility",
    implementation: [
      "Floor markers",
      "Signage",
      "Color coding",
      "Picture cues",
    ],
    communicationTips: [
      "Point to destinations",
      "Use gestures",
      "Demonstrate",
      "Use simple signs",
    ],
    environmentalModifications: [
      "Contrasting colors",
      "Clear signage",
      "Floor markers",
      "Lighting",
    ],
    evidenceLevel: 1,
    citation: "Alzheimer's Association Guidelines, 2021",
  },
];

export interface CommunicationTechnique {
  technique: string;
  description: string;
  implementation: string[];
  examples: string[];
  whatToAvoid: string[];
}

export const communicationTechniques: CommunicationTechnique[] = [
  {
    technique: "Simple Commands",
    description: "Use short, clear commands",
    implementation: [
      "One step at a time",
      "Use simple words",
      "Speak slowly",
      "Use gestures",
    ],
    examples: ['"Stand up"', '"Walk to chair"', '"Sit down"'],
    whatToAvoid: [
      "Complex sentences",
      "Multiple instructions",
      "Rapid speech",
      "Abstract concepts",
    ],
  },
  {
    technique: "Positive Reinforcement",
    description: "Encourage through positive feedback",
    implementation: [
      "Praise effort",
      "Use encouraging language",
      "Celebrate success",
      "Be patient",
    ],
    examples: ['"Good job!"', '"You\'re doing great!"', '"Almost there!"'],
    whatToAvoid: ["Criticism", "Negative language", "Rushing", "Arguing"],
  },
  {
    technique: "Validation",
    description: "Validate feelings and concerns",
    implementation: [
      "Acknowledge feelings",
      "Use empathetic language",
      "Reassure",
      "Redirect if needed",
    ],
    examples: [
      '"I understand you\'re uncomfortable"',
      '"Let\'s make this easier"',
    ],
    whatToAvoid: ["Arguing", "Correcting", "Dismissing feelings", "Rushing"],
  },
];

export interface EnvironmentalModification {
  modification: string;
  description: string;
  implementation: string[];
  benefits: string[];
}

export const environmentalModifications: EnvironmentalModification[] = [
  {
    modification: "Clear Pathways",
    description: "Remove obstacles from walking paths",
    implementation: [
      "Remove throw rugs",
      "Clear clutter",
      "Secure cords",
      "Organize furniture",
    ],
    benefits: [
      "Reduce fall risk",
      "Improve navigation",
      "Enhance independence",
    ],
  },
  {
    modification: "Contrasting Colors",
    description: "Use contrasting colors for important features",
    implementation: [
      "Dark toilet seat",
      "Contrasting door frames",
      "Different floor colors",
    ],
    benefits: ["Improve visibility", "Enhance navigation", "Reduce confusion"],
  },
  {
    modification: "Night Lights",
    description: "Provide adequate lighting at night",
    implementation: [
      "Install night lights",
      "Use motion sensors",
      "Ensure path lighting",
    ],
    benefits: ["Reduce falls", "Improve safety", "Enhance independence"],
  },
  {
    modification: "Familiar Objects",
    description: "Keep familiar objects nearby",
    implementation: [
      "Personal items",
      "Furniture from home",
      "Familiar decorations",
    ],
    benefits: ["Reduce anxiety", "Enhance comfort", "Improve orientation"],
  },
];

export interface MobilityAssessment {
  name: string;
  description: string;
  whatItMeasures: string[];
  procedure: string[];
  scoring: string;
  clinicalInterpretation: string;
}

export const dementiaMobilityAssessments: MobilityAssessment[] = [
  {
    name: "Timed Up & Go",
    description: "Measures mobility and fall risk",
    whatItMeasures: ["Standing balance", "Gait speed", "Turn ability"],
    procedure: [
      "Sit in chair",
      "Stand up",
      "Walk 3 meters",
      "Turn around",
      "Walk back",
      "Sit down",
    ],
    scoring:
      "Time in seconds\n<10s = Low risk\n10-19s = Moderate risk\n≥20s = High risk",
    clinicalInterpretation: "Predicts fall risk and functional mobility",
  },
  {
    name: "Functional Reach",
    description: "Measures dynamic balance",
    whatItMeasures: ["Stability limits", "Dynamic balance", "Trunk control"],
    procedure: ["Stand against wall", "Reach forward", "Measure distance"],
    scoring:
      "Distance in cm\n<10cm = High fall risk\n10-25cm = Moderate risk\n>25cm = Low risk",
    clinicalInterpretation: "Assesses balance and stability",
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
    criteria: "Mobility Safety",
    description: "Safe mobility with supervision",
    assessmentMethod: "Observation, functional assessment",
    minimumRequirement: "Safe with supervision, no falls",
  },
  {
    criteria: "Environmental Adaptation",
    description: "Environment adapted for dementia",
    assessmentMethod: "Home assessment, observation",
    minimumRequirement: "Home modifications implemented",
  },
  {
    criteria: "Caregiver Training",
    description: "Caregiver trained in dementia mobility",
    assessmentMethod: "Demonstration, return demonstration",
    minimumRequirement: "Caregiver demonstrates proper technique",
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
    complication: "Falls",
    signsSymptoms: [
      "Loss of balance",
      "Inability to recover",
      "Impact with ground",
    ],
    prevention: [
      "Clear environment",
      "Supervise transfers",
      "Assess fall risk",
      "Use assistive devices",
    ],
    management: [
      "Assess injuries",
      "Call for help",
      "Document incident",
      "Review technique",
    ],
  },
  {
    complication: "Anxiety",
    signsSymptoms: [
      "Agitation",
      "Restlessness",
      "Verbal outbursts",
      "Physical aggression",
    ],
    prevention: [
      "Calming environment",
      "Familiar routines",
      "Positive reinforcement",
      "Validate feelings",
    ],
    management: [
      "Calming techniques",
      "Redirection",
      "Validate feelings",
      "Medical evaluation",
    ],
  },
  {
    complication: "Confusion",
    signsSymptoms: [
      "Disorientation",
      "Memory lapses",
      "Confused speech",
      "Poor judgment",
    ],
    prevention: [
      "Familiar environment",
      "Consistent routines",
      "Simple instructions",
      "Visual cues",
    ],
    management: [
      "Reassure",
      "Redirect",
      "Simplify environment",
      "Medical evaluation",
    ],
  },
];

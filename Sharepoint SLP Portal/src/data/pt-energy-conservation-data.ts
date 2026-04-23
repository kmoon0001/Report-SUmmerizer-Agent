// ============================================================================
// SNF Energy Conservation Data
// Sources: APTA, Medicare guidelines
// ============================================================================

export interface EnergyConservationStrategy {
  name: string;
  description: string;
  implementation: string[];
  examples: string[];
  evidenceLevel: number;
  citation: string;
}

export const energyConservationStrategies: EnergyConservationStrategy[] = [
  {
    name: "Prioritize Tasks",
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
    evidenceLevel: 1,
    citation: "APTA Guidelines for Energy Conservation, 2020",
  },
  {
    name: "Pace Yourself",
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
    evidenceLevel: 1,
    citation: "CDC Guidelines for Fatigue Management, 2019",
  },
  {
    name: "Use Energy-Saving Techniques",
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
    evidenceLevel: 1,
    citation: "APTA Guidelines for Energy Conservation, 2020",
  },
  {
    name: "Plan Ahead",
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
    evidenceLevel: 1,
    citation: "Medicare Guidelines for Patient Education, 2021",
  },
];

export interface FatigueManagement {
  technique: string;
  description: string;
  indications: string[];
  contraindications: string[];
  implementation: string[];
  frequency: string;
}

export const fatigueManagementTechniques: FatigueManagement[] = [
  {
    technique: "Rest Periods",
    description: "Scheduled rest to prevent fatigue",
    indications: ["Fatigue, Weakness, Endurance limitations"],
    contraindications: ["None specific"],
    implementation: [
      "Take 5-10 minute breaks",
      "Rest before fatigue sets in",
      "Use rest positions",
    ],
    frequency: "Every 15-20 minutes during activity",
  },
  {
    technique: "Positioning",
    description: "Optimal positioning to reduce fatigue",
    indications: ["Weakness, Endurance limitations", "Orthostatic intolerance"],
    contraindications: ["Specific medical restrictions"],
    implementation: [
      "Sit for tasks",
      "Elevate legs when resting",
      "Use supportive surfaces",
    ],
    frequency: "As needed, with position changes every 2 hours",
  },
  {
    technique: "Activity Pacing",
    description: "Balancing activity and rest",
    indications: ["Fatigue, Weakness, Endurance limitations"],
    contraindications: ["None specific"],
    implementation: [
      "Break tasks into smaller steps",
      "Alternate active and rest periods",
      "Monitor fatigue levels",
    ],
    frequency: "During all activities",
  },
  {
    technique: "Energy Conservation",
    description: "Optimizing energy expenditure",
    indications: ["Fatigue, Weakness, Endurance limitations"],
    contraindications: ["None specific"],
    implementation: [
      "Sit for tasks",
      "Use assistive devices",
      "Organize workspace",
    ],
    frequency: "During all activities",
  },
];

export interface ActivityPacing {
  phase: string;
  description: string;
  activities: string[];
  restPeriods: string[];
  monitoring: string[];
}

export const activityPacing: ActivityPacing[] = [
  {
    phase: "Pre-Activity",
    description: "Prepare for activity",
    activities: [
      "Assess energy level",
      "Plan activity",
      "Gather supplies",
      "Position comfortably",
    ],
    restPeriods: ["Rest before starting", "5-10 minutes"],
    monitoring: ["Energy level assessment", "Fatigue signs"],
  },
  {
    phase: "During Activity",
    description: "Perform activity with pacing",
    activities: [
      "Start with easier tasks",
      "Take breaks as needed",
      "Alternate active and rest periods",
    ],
    restPeriods: ["Every 15-20 minutes", "Before fatigue sets in"],
    monitoring: ["Fatigue signs", "Pain level", "Vital signs"],
  },
  {
    phase: "Post-Activity",
    description: "Recover after activity",
    activities: ["Cool down gradually", "Rest and recover", "Hydrate"],
    restPeriods: ["15-30 minutes minimum", "Until recovered"],
    monitoring: ["Recovery signs", "Fatigue persistence", "Pain level"],
  },
];

export interface EnergyExpenditure {
  activity: string;
  energyLevel: "Low" | "Medium" | "High";
  duration: string;
  restRequired: string;
}

export const energyExpenditure: EnergyExpenditure[] = [
  {
    activity: "Dressing",
    energyLevel: "Medium",
    duration: "15-20 minutes",
    restRequired: "5-10 minutes",
  },
  {
    activity: "Bathing",
    energyLevel: "High",
    duration: "20-30 minutes",
    restRequired: "15-20 minutes",
  },
  {
    activity: "Grooming",
    energyLevel: "Low",
    duration: "10-15 minutes",
    restRequired: "5 minutes",
  },
  {
    activity: "Toileting",
    energyLevel: "Medium",
    duration: "10-15 minutes",
    restRequired: "5-10 minutes",
  },
  {
    activity: "Feeding",
    energyLevel: "Low",
    duration: "20-30 minutes",
    restRequired: "5-10 minutes",
  },
  {
    activity: "Transfers",
    energyLevel: "Medium",
    duration: "5-10 minutes",
    restRequired: "5 minutes",
  },
  {
    activity: "Ambulation 50 feet",
    energyLevel: "High",
    duration: "5-10 minutes",
    restRequired: "10-15 minutes",
  },
  {
    activity: "Stair negotiation",
    energyLevel: "High",
    duration: "5-10 minutes",
    restRequired: "15-20 minutes",
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
    criteria: "Energy Management",
    description: "Patient understands and applies energy conservation",
    assessmentMethod: "Demonstration, return demonstration",
    minimumRequirement: "Patient demonstrates proper technique",
  },
  {
    criteria: "Activity Tolerance",
    description: "Patient can complete ADLs with pacing",
    assessmentMethod: "Observation, functional assessment",
    minimumRequirement: "Complete ADLs with pacing, no excessive fatigue",
  },
  {
    criteria: "Home Readiness",
    description: "Patient can manage energy at home",
    assessmentMethod: "Home simulation, observation",
    minimumRequirement: "Manage home ADLs with pacing",
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
    complication: "Overexertion",
    signsSymptoms: [
      "Extreme fatigue",
      "Muscle soreness",
      "Decreased performance",
      "Irritability",
    ],
    prevention: [
      "Follow pacing guidelines",
      "Listen to body",
      "Take breaks",
      "Don't push through fatigue",
    ],
    management: ["Stop activity", "Rest", "Hydrate", "Monitor for signs"],
  },
  {
    complication: "Deconditioning",
    signsSymptoms: [
      "Weakness",
      "Fatigue",
      "Reduced endurance",
      "Joint stiffness",
    ],
    prevention: [
      "Gradual progression",
      "Regular activity",
      "Proper rest",
      "Balanced approach",
    ],
    management: [
      "Gradual progression",
      "Regular activity",
      "Proper rest",
      "Balanced approach",
    ],
  },
];

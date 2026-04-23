/**
 * OT Module 6: Exercise Progressions
 * Comprehensive exercise progression protocols for occupational therapy
 * Evidence-based from AOTA and clinical best practices
 */

export interface OTExerciseProgression {
  id: string;
  name: string;
  abbreviation: string;
  category: string;
  description: string;
  phases: {
    phase: number;
    name: string;
    exercises: string[];
    duration: string;
    frequency: string;
    progressionCriteria: string[];
  }[];
  indications: string[];
  contraindications: string[];
  precautions: string[];
  expectedOutcomes: string[];
  source: string;
  citation: string;
  lastUpdated: Date;
}

const otExerciseProgressionsData: OTExerciseProgression[] = [
  {
    id: "ot-ep-001",
    name: "Upper Extremity Strengthening Progression",
    abbreviation: "UESP",
    category: "strengthening",
    description:
      "Progressive strengthening from isometric to functional activities",
    phases: [
      {
        phase: 1,
        name: "Isometric Phase",
        exercises: [
          "Muscle setting",
          "Shoulder sets",
          "Elbow sets",
          "Wrist sets",
          "Hand sets",
        ],
        duration: "5-10 seconds per contraction",
        frequency: "10-15 repetitions, 2-3 times daily",
        progressionCriteria: [
          "No pain increase",
          "Able to maintain contraction",
          "Improved muscle activation",
        ],
      },
      {
        phase: 2,
        name: "Isotonic Phase",
        exercises: [
          "Shoulder flexion",
          "Elbow extension",
          "Wrist extension",
          "Grip strengthening",
          "Pinch strengthening",
        ],
        duration: "2-3 sets of 10-15 repetitions",
        frequency: "3-4 times per week",
        progressionCriteria: [
          "Able to complete all repetitions",
          "Proper form maintained",
          "No pain increase",
        ],
      },
      {
        phase: 3,
        name: "Functional Phase",
        exercises: [
          "Reaching activities",
          "Lifting activities",
          "Carrying activities",
          "Functional tasks",
          "ADL simulation",
        ],
        duration: "3 sets of 8-12 repetitions",
        frequency: "3-4 times per week",
        progressionCriteria: [
          "Increased strength",
          "Improved endurance",
          "Functional improvement",
        ],
      },
    ],
    indications: [
      "Upper extremity weakness",
      "Post-operative rehabilitation",
      "Deconditioning",
      "Injury prevention",
    ],
    contraindications: ["Acute inflammation", "Severe pain", "Fracture"],
    precautions: [
      "Monitor pain response",
      "Maintain proper form",
      "Avoid overtraining",
    ],
    expectedOutcomes: [
      "Increased muscle strength",
      "Improved endurance",
      "Improved function",
      "Injury prevention",
    ],
    source: "AOTA",
    citation: "AOTA Exercise Guidelines for Upper Extremity Strengthening",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-ep-002",
    name: "Fine Motor Coordination Progression",
    abbreviation: "FMCP",
    category: "fine-motor",
    description:
      "Progressive fine motor training from gross to precise movements",
    phases: [
      {
        phase: 1,
        name: "Gross Grasp Phase",
        exercises: [
          "Cylinder grasp",
          "Spherical grasp",
          "Palmar grasp",
          "Raking grasp",
        ],
        duration: "30 seconds per grasp",
        frequency: "2-3 times daily",
        progressionCriteria: [
          "Able to maintain grasp",
          "Reduced tremor",
          "Improved control",
        ],
      },
      {
        phase: 2,
        name: "Pinch Phase",
        exercises: [
          "Tip pinch",
          "Key pinch",
          "Lateral pinch",
          "Three-jaw chuck pinch",
        ],
        duration: "10-15 repetitions",
        frequency: "3-4 times per week",
        progressionCriteria: [
          "Improved pinch strength",
          "Better control",
          "Reduced fatigue",
        ],
      },
      {
        phase: 3,
        name: "Precision Phase",
        exercises: [
          "Peg placement",
          "Bead threading",
          "Button manipulation",
          "Coin manipulation",
        ],
        duration: "5-10 minutes",
        frequency: "3-4 times per week",
        progressionCriteria: [
          "Improved accuracy",
          "Increased speed",
          "Better coordination",
        ],
      },
    ],
    indications: [
      "Fine motor deficit",
      "Coordination impairment",
      "Dexterity limitation",
      "Functional limitation",
    ],
    contraindications: ["Severe tremor", "Severe pain", "Severe spasticity"],
    precautions: [
      "Monitor fatigue",
      "Maintain proper positioning",
      "Avoid frustration",
    ],
    expectedOutcomes: [
      "Improved fine motor control",
      "Enhanced dexterity",
      "Better ADL performance",
      "Increased independence",
    ],
    source: "AOTA",
    citation: "AOTA Fine Motor Coordination Guidelines",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-ep-003",
    name: "Hand Function Progression",
    abbreviation: "HFP",
    category: "hand-function",
    description: "Progressive hand function training for ADL tasks",
    phases: [
      {
        phase: 1,
        name: "Basic Hand Function",
        exercises: [
          "Grasp and release",
          "Finger isolation",
          "Thumb opposition",
          "Hand opening",
        ],
        duration: "10-15 repetitions",
        frequency: "2-3 times daily",
        progressionCriteria: ["Improved ROM", "Better control", "Reduced pain"],
      },
      {
        phase: 2,
        name: "Functional Hand Tasks",
        exercises: [
          "Picking up objects",
          "Manipulating objects",
          "Bilateral hand use",
          "Tool use",
        ],
        duration: "10-15 minutes",
        frequency: "3-4 times per week",
        progressionCriteria: [
          "Improved function",
          "Better coordination",
          "Increased confidence",
        ],
      },
      {
        phase: 3,
        name: "ADL Integration",
        exercises: [
          "Eating simulation",
          "Dressing simulation",
          "Grooming simulation",
          "Writing simulation",
        ],
        duration: "15-20 minutes",
        frequency: "3-4 times per week",
        progressionCriteria: [
          "Improved ADL performance",
          "Better independence",
          "Functional improvement",
        ],
      },
    ],
    indications: [
      "Hand dysfunction",
      "ADL limitation",
      "Functional impairment",
      "Post-operative rehabilitation",
    ],
    contraindications: ["Acute infection", "Unhealed wound", "Severe pain"],
    precautions: ["Wound care", "Edema management", "Pain monitoring"],
    expectedOutcomes: [
      "Improved hand function",
      "Enhanced ADL independence",
      "Better quality of life",
      "Functional improvement",
    ],
    source: "AOTA",
    citation: "AOTA Hand Function Progression Guidelines",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-ep-004",
    name: "Bilateral Coordination Progression",
    abbreviation: "BCP",
    category: "coordination",
    description:
      "Progressive bilateral coordination training for symmetrical and asymmetrical tasks",
    phases: [
      {
        phase: 1,
        name: "Symmetrical Bilateral",
        exercises: [
          "Bilateral reaching",
          "Bilateral grasping",
          "Bilateral manipulation",
          "Symmetrical movements",
        ],
        duration: "10-15 repetitions",
        frequency: "2-3 times daily",
        progressionCriteria: [
          "Improved symmetry",
          "Better coordination",
          "Reduced asymmetry",
        ],
      },
      {
        phase: 2,
        name: "Asymmetrical Bilateral",
        exercises: [
          "Stabilizing with one hand",
          "Manipulating with other",
          "Coordinated movements",
          "Functional tasks",
        ],
        duration: "10-15 minutes",
        frequency: "3-4 times per week",
        progressionCriteria: [
          "Improved coordination",
          "Better function",
          "Increased independence",
        ],
      },
      {
        phase: 3,
        name: "Complex Bilateral Tasks",
        exercises: [
          "Bilateral ADL tasks",
          "Bilateral fine motor",
          "Bilateral gross motor",
          "Functional activities",
        ],
        duration: "15-20 minutes",
        frequency: "3-4 times per week",
        progressionCriteria: [
          "Improved bilateral coordination",
          "Better ADL performance",
          "Functional improvement",
        ],
      },
    ],
    indications: [
      "Bilateral coordination deficit",
      "Asymmetrical movement",
      "Functional limitation",
      "Neurological disorder",
    ],
    contraindications: [
      "Severe spasticity",
      "Severe pain",
      "Uncontrolled movement",
    ],
    precautions: [
      "Monitor symmetry",
      "Avoid compensation",
      "Maintain proper positioning",
    ],
    expectedOutcomes: [
      "Improved bilateral coordination",
      "Better symmetry",
      "Enhanced function",
      "Increased independence",
    ],
    source: "AOTA",
    citation: "AOTA Bilateral Coordination Guidelines",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-ep-005",
    name: "Sensorimotor Integration Progression",
    abbreviation: "SMIP",
    category: "sensorimotor",
    description:
      "Progressive sensorimotor integration training for improved motor planning",
    phases: [
      {
        phase: 1,
        name: "Sensory Awareness",
        exercises: [
          "Tactile discrimination",
          "Proprioceptive awareness",
          "Visual tracking",
          "Auditory awareness",
        ],
        duration: "10-15 minutes",
        frequency: "2-3 times daily",
        progressionCriteria: [
          "Improved awareness",
          "Better discrimination",
          "Increased sensitivity",
        ],
      },
      {
        phase: 2,
        name: "Sensorimotor Integration",
        exercises: [
          "Coordinated movements",
          "Motor planning tasks",
          "Integrated activities",
          "Functional movements",
        ],
        duration: "15-20 minutes",
        frequency: "3-4 times per week",
        progressionCriteria: [
          "Improved motor planning",
          "Better coordination",
          "Increased function",
        ],
      },
      {
        phase: 3,
        name: "Complex Sensorimotor Tasks",
        exercises: [
          "Complex ADL tasks",
          "Bilateral coordination",
          "Fine motor precision",
          "Functional activities",
        ],
        duration: "20-30 minutes",
        frequency: "3-4 times per week",
        progressionCriteria: [
          "Improved sensorimotor integration",
          "Better function",
          "Increased independence",
        ],
      },
    ],
    indications: [
      "Sensorimotor deficit",
      "Motor planning impairment",
      "Coordination disorder",
      "Neurological condition",
    ],
    contraindications: [
      "Severe sensory loss",
      "Severe motor impairment",
      "Uncontrolled behavior",
    ],
    precautions: [
      "Sensory stimulation tolerance",
      "Environmental control",
      "Behavioral monitoring",
    ],
    expectedOutcomes: [
      "Improved sensorimotor integration",
      "Better motor planning",
      "Enhanced coordination",
      "Increased function",
    ],
    source: "AOTA",
    citation: "AOTA Sensorimotor Integration Guidelines",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-ep-006",
    name: "Endurance and Fatigue Management Progression",
    abbreviation: "EFMP",
    category: "endurance",
    description:
      "Progressive endurance training with fatigue management strategies",
    phases: [
      {
        phase: 1,
        name: "Short Duration Activities",
        exercises: [
          "5-10 minute activities",
          "Low intensity tasks",
          "Frequent rest breaks",
          "Energy conservation",
        ],
        duration: "5-10 minutes",
        frequency: "2-3 times daily",
        progressionCriteria: [
          "Improved tolerance",
          "Reduced fatigue",
          "Better energy management",
        ],
      },
      {
        phase: 2,
        name: "Moderate Duration Activities",
        exercises: [
          "15-20 minute activities",
          "Moderate intensity tasks",
          "Scheduled rest breaks",
          "Pacing strategies",
        ],
        duration: "15-20 minutes",
        frequency: "3-4 times per week",
        progressionCriteria: [
          "Increased endurance",
          "Better fatigue management",
          "Improved function",
        ],
      },
      {
        phase: 3,
        name: "Extended Duration Activities",
        exercises: [
          "30+ minute activities",
          "Higher intensity tasks",
          "Minimal rest breaks",
          "Functional activities",
        ],
        duration: "30+ minutes",
        frequency: "3-4 times per week",
        progressionCriteria: [
          "Improved endurance",
          "Better fatigue management",
          "Increased independence",
        ],
      },
    ],
    indications: [
      "Fatigue",
      "Low endurance",
      "Chronic illness",
      "Deconditioning",
    ],
    contraindications: [
      "Acute illness",
      "Severe fatigue",
      "Medical instability",
    ],
    precautions: [
      "Monitor fatigue levels",
      "Pace activities",
      "Provide rest breaks",
    ],
    expectedOutcomes: [
      "Improved endurance",
      "Better fatigue management",
      "Enhanced function",
      "Increased independence",
    ],
    source: "AOTA",
    citation: "AOTA Endurance and Fatigue Management Guidelines",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-ep-007",
    name: "Postural Control Progression",
    abbreviation: "PCP",
    category: "postural-control",
    description:
      "Progressive postural control training for improved stability and alignment",
    phases: [
      {
        phase: 1,
        name: "Static Posture",
        exercises: [
          "Seated posture",
          "Standing posture",
          "Postural awareness",
          "Alignment training",
        ],
        duration: "10-15 minutes",
        frequency: "2-3 times daily",
        progressionCriteria: [
          "Improved awareness",
          "Better alignment",
          "Reduced pain",
        ],
      },
      {
        phase: 2,
        name: "Dynamic Posture",
        exercises: [
          "Postural transitions",
          "Movement with posture",
          "Functional activities",
          "Coordinated movements",
        ],
        duration: "15-20 minutes",
        frequency: "3-4 times per week",
        progressionCriteria: [
          "Improved control",
          "Better alignment",
          "Increased function",
        ],
      },
      {
        phase: 3,
        name: "Functional Posture",
        exercises: [
          "ADL with posture",
          "Work activities",
          "Leisure activities",
          "Community activities",
        ],
        duration: "20-30 minutes",
        frequency: "3-4 times per week",
        progressionCriteria: [
          "Improved postural control",
          "Better function",
          "Increased independence",
        ],
      },
    ],
    indications: [
      "Postural dysfunction",
      "Poor alignment",
      "Stability deficit",
      "Functional limitation",
    ],
    contraindications: ["Severe pain", "Severe spasticity", "Severe weakness"],
    precautions: [
      "Monitor alignment",
      "Avoid compensation",
      "Maintain proper positioning",
    ],
    expectedOutcomes: [
      "Improved postural control",
      "Better alignment",
      "Reduced pain",
      "Increased function",
    ],
    source: "AOTA",
    citation: "AOTA Postural Control Guidelines",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-ep-008",
    name: "Flexibility and ROM Progression",
    abbreviation: "FRP",
    category: "flexibility",
    description: "Progressive flexibility and range of motion training",
    phases: [
      {
        phase: 1,
        name: "Passive ROM",
        exercises: [
          "Passive stretching",
          "Gentle mobilization",
          "Supported movements",
          "Gravity-assisted movements",
        ],
        duration: "30 seconds per stretch",
        frequency: "2-3 times daily",
        progressionCriteria: [
          "Increased ROM",
          "Reduced stiffness",
          "Improved comfort",
        ],
      },
      {
        phase: 2,
        name: "Active-Assisted ROM",
        exercises: [
          "Assisted stretching",
          "Supported movements",
          "Gravity-reduced movements",
          "Controlled movements",
        ],
        duration: "10-15 repetitions",
        frequency: "3-4 times per week",
        progressionCriteria: [
          "Improved ROM",
          "Better control",
          "Increased strength",
        ],
      },
      {
        phase: 3,
        name: "Active ROM",
        exercises: [
          "Active stretching",
          "Functional movements",
          "Strengthening with ROM",
          "Integrated activities",
        ],
        duration: "10-15 minutes",
        frequency: "3-4 times per week",
        progressionCriteria: [
          "Improved ROM",
          "Better function",
          "Increased independence",
        ],
      },
    ],
    indications: [
      "Reduced ROM",
      "Stiffness",
      "Contracture risk",
      "Functional limitation",
    ],
    contraindications: ["Acute inflammation", "Severe pain", "Fracture"],
    precautions: ["Avoid bouncing", "Stretch to mild tension", "Avoid pain"],
    expectedOutcomes: [
      "Improved ROM",
      "Reduced stiffness",
      "Better function",
      "Increased independence",
    ],
    source: "AOTA",
    citation: "AOTA Flexibility and ROM Guidelines",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-ep-009",
    name: "Proprioceptive Training Progression",
    abbreviation: "PTP",
    category: "proprioception",
    description:
      "Progressive proprioceptive training for improved body awareness and control",
    phases: [
      {
        phase: 1,
        name: "Static Proprioception",
        exercises: [
          "Joint position sense",
          "Weight distribution",
          "Postural awareness",
          "Body positioning",
        ],
        duration: "10-15 minutes",
        frequency: "2-3 times daily",
        progressionCriteria: [
          "Improved awareness",
          "Better positioning",
          "Increased control",
        ],
      },
      {
        phase: 2,
        name: "Dynamic Proprioception",
        exercises: [
          "Movement awareness",
          "Coordinated movements",
          "Functional movements",
          "Integrated activities",
        ],
        duration: "15-20 minutes",
        frequency: "3-4 times per week",
        progressionCriteria: [
          "Improved proprioception",
          "Better coordination",
          "Increased function",
        ],
      },
      {
        phase: 3,
        name: "Complex Proprioceptive Tasks",
        exercises: [
          "Complex movements",
          "Bilateral coordination",
          "Functional activities",
          "Community activities",
        ],
        duration: "20-30 minutes",
        frequency: "3-4 times per week",
        progressionCriteria: [
          "Improved proprioception",
          "Better function",
          "Increased independence",
        ],
      },
    ],
    indications: [
      "Proprioceptive deficit",
      "Body awareness impairment",
      "Coordination disorder",
      "Neurological condition",
    ],
    contraindications: [
      "Severe proprioceptive loss",
      "Severe motor impairment",
      "Uncontrolled movement",
    ],
    precautions: ["Monitor safety", "Provide support", "Avoid compensation"],
    expectedOutcomes: [
      "Improved proprioception",
      "Better body awareness",
      "Enhanced coordination",
      "Increased function",
    ],
    source: "AOTA",
    citation: "AOTA Proprioceptive Training Guidelines",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-ep-010",
    name: "Functional Activity Progression",
    abbreviation: "FAP",
    category: "functional-activity",
    description:
      "Progressive functional activity training for ADL and IADL independence",
    phases: [
      {
        phase: 1,
        name: "Basic ADL Training",
        exercises: ["Grooming", "Hygiene", "Dressing", "Feeding", "Toileting"],
        duration: "15-20 minutes",
        frequency: "2-3 times daily",
        progressionCriteria: [
          "Improved independence",
          "Better technique",
          "Reduced assistance",
        ],
      },
      {
        phase: 2,
        name: "Complex ADL Training",
        exercises: [
          "Bathing",
          "Showering",
          "Dressing complex items",
          "Grooming complex tasks",
          "Feeding complex foods",
        ],
        duration: "20-30 minutes",
        frequency: "3-4 times per week",
        progressionCriteria: [
          "Improved independence",
          "Better function",
          "Reduced assistance",
        ],
      },
      {
        phase: 3,
        name: "IADL Training",
        exercises: [
          "Meal preparation",
          "Medication management",
          "Money management",
          "Shopping",
          "Housekeeping",
        ],
        duration: "30-45 minutes",
        frequency: "3-4 times per week",
        progressionCriteria: [
          "Improved independence",
          "Better community function",
          "Increased confidence",
        ],
      },
    ],
    indications: [
      "ADL limitation",
      "IADL limitation",
      "Functional impairment",
      "Disability",
    ],
    contraindications: [
      "Acute medical condition",
      "Severe cognitive impairment",
      "Safety risk",
    ],
    precautions: [
      "Safety monitoring",
      "Cognitive demands",
      "Environmental factors",
    ],
    expectedOutcomes: [
      "Improved ADL independence",
      "Better IADL function",
      "Enhanced quality of life",
      "Increased independence",
    ],
    source: "AOTA",
    citation: "AOTA Functional Activity Progression Guidelines",
    lastUpdated: new Date("2024-01-15"),
  },
];

/**
 * Get OT exercise progression by ID
 */
export function getOTExerciseProgressionById(
  id: string,
): OTExerciseProgression | undefined {
  return otExerciseProgressionsData.find((ep) => ep.id === id);
}

/**
 * Get OT exercise progressions by category
 */
export function getOTExerciseProgressionsByCategory(
  category: string,
): OTExerciseProgression[] {
  return otExerciseProgressionsData.filter((ep) => ep.category === category);
}

/**
 * Search OT exercise progressions
 */
export function searchOTExerciseProgressions(
  query: string,
): OTExerciseProgression[] {
  const lowerQuery = query.toLowerCase();
  return otExerciseProgressionsData.filter(
    (ep) =>
      ep.name.toLowerCase().includes(lowerQuery) ||
      ep.abbreviation.toLowerCase().includes(lowerQuery) ||
      ep.description.toLowerCase().includes(lowerQuery),
  );
}

/**
 * Get all OT exercise progressions
 */
export function getAllOTExerciseProgressions(): OTExerciseProgression[] {
  return otExerciseProgressionsData;
}

/**
 * Get OT exercise progression categories
 */
export function getOTExerciseProgressionCategories(): string[] {
  return Array.from(
    new Set(otExerciseProgressionsData.map((ep) => ep.category)),
  );
}

/**
 * Get OT exercise progressions for indication
 */
export function getOTExerciseProgressionsForIndication(
  indication: string,
): OTExerciseProgression[] {
  return otExerciseProgressionsData.filter((ep) =>
    ep.indications.some((ind) =>
      ind.toLowerCase().includes(indication.toLowerCase()),
    ),
  );
}

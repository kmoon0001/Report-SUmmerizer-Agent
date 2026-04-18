/**
 * PT Module 6: Exercise Progressions
 * Comprehensive exercise progression protocols from basic to advanced
 * Sources: APTA Exercise Guidelines, Evidence-based exercise research, Tanner's progression frameworks
 */

export interface PTExerciseProgression {
  id: string;
  name: string;
  category:
    | "strengthening"
    | "balance"
    | "flexibility"
    | "endurance"
    | "coordination"
    | "proprioception"
    | "functional"
    | "sport"
    | "work"
    | "community";
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

const ptExerciseProgressions: PTExerciseProgression[] = [
  {
    id: "pt-ep-001",
    name: "Strengthening Progression",
    category: "strengthening",
    description:
      "Progressive strengthening from isometric to isotonic to isokinetic exercises",
    phases: [
      {
        phase: 1,
        name: "Isometric Phase",
        exercises: [
          "Muscle setting",
          "Quadriceps sets",
          "Glute sets",
          "Core bracing",
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
          "Straight leg raises",
          "Seated knee extensions",
          "Resistance band exercises",
          "Light weights",
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
        name: "Isokinetic Phase",
        exercises: [
          "Controlled speed exercises",
          "Functional strengthening",
          "Sport-specific strengthening",
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
      "Muscle weakness",
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
    source: "APTA",
    citation: "APTA Exercise Guidelines for Strengthening",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-ep-002",
    name: "Balance Progression",
    category: "balance",
    description:
      "Progressive balance training from static to dynamic to community balance",
    phases: [
      {
        phase: 1,
        name: "Static Balance",
        exercises: [
          "Seated balance",
          "Standing with support",
          "Tandem stance with support",
        ],
        duration: "30-60 seconds",
        frequency: "2-3 times daily",
        progressionCriteria: [
          "Able to maintain position",
          "Reduced sway",
          "Improved confidence",
        ],
      },
      {
        phase: 2,
        name: "Dynamic Balance",
        exercises: [
          "Standing without support",
          "Weight shifting",
          "Reaching tasks",
          "Stepping",
        ],
        duration: "1-2 minutes",
        frequency: "3-4 times per week",
        progressionCriteria: [
          "Able to maintain balance",
          "Smooth movements",
          "Improved coordination",
        ],
      },
      {
        phase: 3,
        name: "Community Balance",
        exercises: [
          "Walking on uneven surfaces",
          "Obstacle course",
          "Dual-task activities",
        ],
        duration: "5-10 minutes",
        frequency: "3-4 times per week",
        progressionCriteria: [
          "Improved safety",
          "Increased confidence",
          "Functional improvement",
        ],
      },
    ],
    indications: [
      "Fall risk",
      "Balance disorder",
      "Neurological condition",
      "Post-operative rehabilitation",
    ],
    contraindications: [
      "Severe balance impairment",
      "Acute vertigo",
      "Recent surgery",
    ],
    precautions: ["Use gait belt", "Ensure safety", "Monitor for dizziness"],
    expectedOutcomes: [
      "Improved balance",
      "Reduced fall risk",
      "Improved confidence",
      "Improved function",
    ],
    source: "APTA",
    citation: "APTA Balance Training Guidelines",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-ep-003",
    name: "Flexibility Progression",
    category: "flexibility",
    description:
      "Progressive flexibility training from static to dynamic to PNF stretching",
    phases: [
      {
        phase: 1,
        name: "Static Stretching",
        exercises: [
          "Hamstring stretch",
          "Quadriceps stretch",
          "Calf stretch",
          "Hip flexor stretch",
        ],
        duration: "30 seconds per stretch",
        frequency: "2-3 times daily",
        progressionCriteria: [
          "Increased range of motion",
          "Reduced stiffness",
          "Improved comfort",
        ],
      },
      {
        phase: 2,
        name: "Dynamic Stretching",
        exercises: [
          "Leg swings",
          "Arm circles",
          "Walking lunges",
          "Controlled movements",
        ],
        duration: "10-15 repetitions",
        frequency: "3-4 times per week",
        progressionCriteria: [
          "Improved mobility",
          "Smooth movements",
          "Increased range",
        ],
      },
      {
        phase: 3,
        name: "PNF Stretching",
        exercises: [
          "Contract-relax stretching",
          "Hold-relax stretching",
          "Agonist contract stretching",
        ],
        duration: "5-10 repetitions",
        frequency: "2-3 times per week",
        progressionCriteria: [
          "Significant ROM improvement",
          "Improved flexibility",
          "Functional improvement",
        ],
      },
    ],
    indications: [
      "Reduced flexibility",
      "Muscle tightness",
      "Post-operative rehabilitation",
      "Injury prevention",
    ],
    contraindications: ["Acute inflammation", "Severe pain", "Fracture"],
    precautions: ["Avoid bouncing", "Stretch to mild tension", "Avoid pain"],
    expectedOutcomes: [
      "Improved flexibility",
      "Increased range of motion",
      "Reduced muscle tension",
      "Improved function",
    ],
    source: "APTA",
    citation: "APTA Flexibility Training Guidelines",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-ep-004",
    name: "Endurance Progression",
    category: "endurance",
    description:
      "Progressive endurance training from low to moderate to high intensity",
    phases: [
      {
        phase: 1,
        name: "Low Intensity",
        exercises: [
          "Walking",
          "Stationary cycling",
          "Swimming",
          "Water aerobics",
        ],
        duration: "10-15 minutes",
        frequency: "3-4 times per week",
        progressionCriteria: [
          "Able to complete duration",
          "Minimal fatigue",
          "Improved tolerance",
        ],
      },
      {
        phase: 2,
        name: "Moderate Intensity",
        exercises: ["Brisk walking", "Cycling", "Elliptical", "Rowing"],
        duration: "20-30 minutes",
        frequency: "3-4 times per week",
        progressionCriteria: [
          "Able to sustain activity",
          "Improved cardiovascular response",
          "Increased endurance",
        ],
      },
      {
        phase: 3,
        name: "High Intensity",
        exercises: [
          "Running",
          "High-intensity interval training",
          "Sport-specific training",
        ],
        duration: "30-45 minutes",
        frequency: "3-4 times per week",
        progressionCriteria: [
          "Improved cardiovascular fitness",
          "Increased endurance",
          "Functional improvement",
        ],
      },
    ],
    indications: [
      "Deconditioning",
      "Cardiovascular rehabilitation",
      "Chronic disease management",
      "Fitness improvement",
    ],
    contraindications: [
      "Acute cardiac event",
      "Uncontrolled hypertension",
      "Severe arrhythmia",
    ],
    precautions: [
      "Monitor vital signs",
      "Watch for symptoms",
      "Gradual progression",
    ],
    expectedOutcomes: [
      "Improved cardiovascular fitness",
      "Increased endurance",
      "Improved function",
      "Improved health",
    ],
    source: "APTA",
    citation: "APTA Endurance Training Guidelines",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-ep-005",
    name: "Coordination Progression",
    category: "coordination",
    description:
      "Progressive coordination training from simple to complex movements",
    phases: [
      {
        phase: 1,
        name: "Simple Coordination",
        exercises: [
          "Single-limb movements",
          "Bilateral symmetrical movements",
          "Basic patterns",
        ],
        duration: "10-15 repetitions",
        frequency: "3-4 times per week",
        progressionCriteria: [
          "Able to perform movement",
          "Improved smoothness",
          "Reduced hesitation",
        ],
      },
      {
        phase: 2,
        name: "Complex Coordination",
        exercises: [
          "Bilateral asymmetrical movements",
          "Crossing midline",
          "Alternating patterns",
        ],
        duration: "15-20 repetitions",
        frequency: "3-4 times per week",
        progressionCriteria: [
          "Improved coordination",
          "Smoother transitions",
          "Increased speed",
        ],
      },
      {
        phase: 3,
        name: "Advanced Coordination",
        exercises: [
          "Sport-specific movements",
          "Complex patterns",
          "Dual-task activities",
        ],
        duration: "20-30 repetitions",
        frequency: "3-4 times per week",
        progressionCriteria: [
          "Excellent coordination",
          "Automatic movements",
          "Functional improvement",
        ],
      },
    ],
    indications: [
      "Neurological condition",
      "Coordination impairment",
      "Post-operative rehabilitation",
      "Sport training",
    ],
    contraindications: [
      "Severe neurological impairment",
      "Severe pain",
      "Acute condition",
    ],
    precautions: ["Monitor safety", "Ensure proper form", "Avoid frustration"],
    expectedOutcomes: [
      "Improved coordination",
      "Improved motor control",
      "Improved function",
      "Improved confidence",
    ],
    source: "APTA",
    citation: "APTA Coordination Training Guidelines",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-ep-006",
    name: "Proprioception Progression",
    category: "proprioception",
    description:
      "Progressive proprioceptive training from stable to unstable surfaces",
    phases: [
      {
        phase: 1,
        name: "Stable Surface",
        exercises: [
          "Standing on firm surface",
          "Weight shifting",
          "Single-leg stance",
        ],
        duration: "30-60 seconds",
        frequency: "3-4 times per week",
        progressionCriteria: [
          "Able to maintain position",
          "Improved balance",
          "Reduced sway",
        ],
      },
      {
        phase: 2,
        name: "Unstable Surface",
        exercises: ["Balance board", "Foam pad", "BOSU ball", "Wobble cushion"],
        duration: "30-60 seconds",
        frequency: "3-4 times per week",
        progressionCriteria: [
          "Improved stability",
          "Better balance",
          "Increased confidence",
        ],
      },
      {
        phase: 3,
        name: "Dynamic Unstable",
        exercises: [
          "Moving on unstable surface",
          "Reaching on unstable surface",
          "Sport-specific on unstable",
        ],
        duration: "1-2 minutes",
        frequency: "3-4 times per week",
        progressionCriteria: [
          "Excellent proprioception",
          "Improved function",
          "Injury prevention",
        ],
      },
    ],
    indications: [
      "Proprioceptive deficit",
      "Ankle instability",
      "Injury prevention",
      "Sport training",
    ],
    contraindications: [
      "Severe balance impairment",
      "Acute injury",
      "Recent surgery",
    ],
    precautions: ["Ensure safety", "Use gait belt", "Monitor for falls"],
    expectedOutcomes: [
      "Improved proprioception",
      "Improved balance",
      "Improved stability",
      "Injury prevention",
    ],
    source: "APTA",
    citation: "APTA Proprioception Training Guidelines",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-ep-007",
    name: "Functional Progression",
    category: "functional",
    description:
      "Progressive functional training from bed to transfers to ambulation",
    phases: [
      {
        phase: 1,
        name: "Bed Mobility",
        exercises: ["Rolling", "Scooting", "Bridging", "Sit-ups"],
        duration: "5-10 repetitions",
        frequency: "3-4 times daily",
        progressionCriteria: [
          "Able to perform movement",
          "Improved independence",
          "Reduced assistance",
        ],
      },
      {
        phase: 2,
        name: "Transfers",
        exercises: [
          "Sit-to-stand",
          "Bed-to-chair",
          "Chair-to-toilet",
          "Tub transfers",
        ],
        duration: "5-10 repetitions",
        frequency: "3-4 times daily",
        progressionCriteria: [
          "Able to perform transfer",
          "Improved safety",
          "Reduced assistance",
        ],
      },
      {
        phase: 3,
        name: "Ambulation",
        exercises: [
          "Walking",
          "Stairs",
          "Community ambulation",
          "Return to activities",
        ],
        duration: "10-30 minutes",
        frequency: "3-4 times daily",
        progressionCriteria: [
          "Improved independence",
          "Improved safety",
          "Return to function",
        ],
      },
    ],
    indications: [
      "Post-operative rehabilitation",
      "Neurological condition",
      "Deconditioning",
      "Mobility limitation",
    ],
    contraindications: [
      "Acute condition",
      "Severe pain",
      "Medical instability",
    ],
    precautions: [
      "Ensure safety",
      "Use assistive devices",
      "Monitor vital signs",
    ],
    expectedOutcomes: [
      "Improved functional independence",
      "Improved mobility",
      "Return to activities",
      "Improved quality of life",
    ],
    source: "APTA",
    citation: "APTA Functional Training Guidelines",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-ep-008",
    name: "Sport-Specific Progression",
    category: "sport",
    description:
      "Progressive sport-specific training from basic to sport-specific movements",
    phases: [
      {
        phase: 1,
        name: "Basic Sport Skills",
        exercises: [
          "Basic movement patterns",
          "Sport-specific stretching",
          "Sport-specific strengthening",
        ],
        duration: "15-20 minutes",
        frequency: "3-4 times per week",
        progressionCriteria: [
          "Able to perform basic skills",
          "Improved technique",
          "Increased confidence",
        ],
      },
      {
        phase: 2,
        name: "Sport-Specific Training",
        exercises: [
          "Sport-specific drills",
          "Sport-specific conditioning",
          "Sport-specific agility",
        ],
        duration: "30-45 minutes",
        frequency: "3-4 times per week",
        progressionCriteria: [
          "Improved sport skills",
          "Improved conditioning",
          "Increased intensity",
        ],
      },
      {
        phase: 3,
        name: "Return to Sport",
        exercises: [
          "Full sport participation",
          "Sport-specific competition",
          "Sport-specific intensity",
        ],
        duration: "45-60 minutes",
        frequency: "3-4 times per week",
        progressionCriteria: [
          "Full sport participation",
          "Improved performance",
          "Injury prevention",
        ],
      },
    ],
    indications: [
      "Sport injury",
      "Return to sport",
      "Sport training",
      "Performance improvement",
    ],
    contraindications: [
      "Acute injury",
      "Severe pain",
      "Medical clearance not obtained",
    ],
    precautions: [
      "Gradual progression",
      "Monitor pain",
      "Ensure proper technique",
    ],
    expectedOutcomes: [
      "Return to sport",
      "Improved performance",
      "Injury prevention",
      "Improved confidence",
    ],
    source: "APTA",
    citation: "APTA Sport-Specific Training Guidelines",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-ep-009",
    name: "Work-Specific Progression",
    category: "work",
    description:
      "Progressive work-specific training from basic to full work duties",
    phases: [
      {
        phase: 1,
        name: "Basic Work Conditioning",
        exercises: [
          "Work-specific stretching",
          "Work-specific strengthening",
          "Work-specific endurance",
        ],
        duration: "15-20 minutes",
        frequency: "3-4 times per week",
        progressionCriteria: [
          "Able to perform basic work tasks",
          "Improved tolerance",
          "Increased confidence",
        ],
      },
      {
        phase: 2,
        name: "Work Hardening",
        exercises: [
          "Simulated work tasks",
          "Work-specific conditioning",
          "Work-specific endurance",
        ],
        duration: "30-45 minutes",
        frequency: "3-4 times per week",
        progressionCriteria: [
          "Improved work capacity",
          "Improved tolerance",
          "Increased intensity",
        ],
      },
      {
        phase: 3,
        name: "Return to Work",
        exercises: [
          "Full work duties",
          "Work-specific intensity",
          "Work-specific demands",
        ],
        duration: "45-60 minutes",
        frequency: "3-4 times per week",
        progressionCriteria: [
          "Full work participation",
          "Improved function",
          "Injury prevention",
        ],
      },
    ],
    indications: [
      "Work injury",
      "Return to work",
      "Work conditioning",
      "Occupational rehabilitation",
    ],
    contraindications: [
      "Acute injury",
      "Severe pain",
      "Medical clearance not obtained",
    ],
    precautions: [
      "Gradual progression",
      "Monitor pain",
      "Ensure proper ergonomics",
    ],
    expectedOutcomes: [
      "Return to work",
      "Improved work capacity",
      "Injury prevention",
      "Improved function",
    ],
    source: "APTA",
    citation: "APTA Work-Specific Training Guidelines",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-ep-010",
    name: "Community Reintegration Progression",
    category: "community",
    description:
      "Progressive community reintegration from home to community to independent living",
    phases: [
      {
        phase: 1,
        name: "Home-Based Activities",
        exercises: ["Home mobility", "Home safety", "Home-based exercises"],
        duration: "15-20 minutes",
        frequency: "3-4 times daily",
        progressionCriteria: [
          "Able to perform home activities",
          "Improved independence",
          "Improved safety",
        ],
      },
      {
        phase: 2,
        name: "Community Activities",
        exercises: [
          "Community ambulation",
          "Community transportation",
          "Community shopping",
        ],
        duration: "30-45 minutes",
        frequency: "3-4 times per week",
        progressionCriteria: [
          "Able to perform community activities",
          "Improved confidence",
          "Increased independence",
        ],
      },
      {
        phase: 3,
        name: "Independent Living",
        exercises: [
          "Full community participation",
          "Independent activities",
          "Social participation",
        ],
        duration: "45-60 minutes",
        frequency: "3-4 times per week",
        progressionCriteria: [
          "Full community participation",
          "Improved quality of life",
          "Improved independence",
        ],
      },
    ],
    indications: [
      "Post-operative rehabilitation",
      "Neurological condition",
      "Deconditioning",
      "Mobility limitation",
    ],
    contraindications: [
      "Acute condition",
      "Severe pain",
      "Medical instability",
    ],
    precautions: [
      "Ensure safety",
      "Use assistive devices",
      "Monitor vital signs",
    ],
    expectedOutcomes: [
      "Improved community participation",
      "Improved independence",
      "Improved quality of life",
      "Return to community",
    ],
    source: "APTA",
    citation: "APTA Community Reintegration Guidelines",
    lastUpdated: new Date("2024-01-15"),
  },
];

/**
 * Get PT exercise progression by ID
 */
export function getPTExerciseProgressionById(
  id: string,
): PTExerciseProgression | undefined {
  return ptExerciseProgressions.find((p) => p.id === id);
}

/**
 * Get PT exercise progressions by category
 */
export function getPTExerciseProgressionsByCategory(
  category: string,
): PTExerciseProgression[] {
  return ptExerciseProgressions.filter((p) => p.category === category);
}

/**
 * Search PT exercise progressions
 */
export function searchPTExerciseProgressions(
  query: string,
): PTExerciseProgression[] {
  const lowerQuery = query.toLowerCase();
  return ptExerciseProgressions.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery),
  );
}

/**
 * Get all PT exercise progressions
 */
export function getAllPTExerciseProgressions(): PTExerciseProgression[] {
  return ptExerciseProgressions;
}

/**
 * Get PT exercise progression categories
 */
export function getPTExerciseProgressionCategories(): string[] {
  const categories = new Set(ptExerciseProgressions.map((p) => p.category));
  return Array.from(categories);
}

/**
 * Get PT exercise progressions for indication
 */
export function getPTExerciseProgressionsForIndication(
  indication: string,
): PTExerciseProgression[] {
  return ptExerciseProgressions.filter((p) =>
    p.indications.includes(indication),
  );
}

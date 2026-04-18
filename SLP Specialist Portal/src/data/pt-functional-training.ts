/**
 * PT Module 7: Functional Training
 * Comprehensive functional training protocols for physical therapy
 * Evidence-based protocols from APTA and clinical best practices
 */

export interface PTFunctionalTraining {
  id: string;
  name: string;
  abbreviation: string;
  category: string;
  description: string;
  indications: string[];
  contraindications: string[];
  precautions: string[];
  progressionStages: {
    stage: string;
    duration: string;
    exercises: string[];
    parameters: Record<string, string>;
  }[];
  expectedOutcomes: string[];
  evidenceLevel: number;
  source: string;
  citation: string;
  lastUpdated: Date;
}

const ptFunctionalTrainingData: PTFunctionalTraining[] = [
  {
    id: "pt-ft-001",
    name: "Sit-to-Stand Training",
    abbreviation: "STS",
    category: "mobility",
    description:
      "Progressive training for safe and efficient sit-to-stand transfers",
    indications: [
      "Lower extremity weakness",
      "Balance impairment",
      "Fall risk",
      "Mobility limitation",
      "Post-operative rehabilitation",
    ],
    contraindications: [
      "Acute fracture",
      "Severe pain",
      "Uncontrolled hypertension",
    ],
    precautions: [
      "Monitor blood pressure",
      "Ensure proper chair height",
      "Provide safety support",
    ],
    progressionStages: [
      {
        stage: "Stage 1: Seated Preparation",
        duration: "1-2 weeks",
        exercises: [
          "Seated marching",
          "Seated weight shifts",
          "Seated hip flexion",
        ],
        parameters: { sets: "3", reps: "10-15", frequency: "Daily" },
      },
      {
        stage: "Stage 2: Assisted Stand",
        duration: "2-3 weeks",
        exercises: [
          "Assisted sit-to-stand",
          "Stand with support",
          "Weight distribution",
        ],
        parameters: { sets: "3", reps: "8-12", frequency: "Daily" },
      },
      {
        stage: "Stage 3: Independent Stand",
        duration: "3-4 weeks",
        exercises: [
          "Independent sit-to-stand",
          "Repeated transfers",
          "Timed transfers",
        ],
        parameters: { sets: "3", reps: "10-15", frequency: "Daily" },
      },
    ],
    expectedOutcomes: [
      "Improved transfer independence",
      "Reduced fall risk",
      "Increased lower extremity strength",
      "Enhanced functional mobility",
    ],
    evidenceLevel: 2,
    source: "APTA Guidelines for Mobility Training",
    citation:
      "American Physical Therapy Association (2023). Functional Mobility Training Protocols.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-ft-002",
    name: "Gait Training",
    abbreviation: "GT",
    category: "mobility",
    description:
      "Systematic gait training to improve walking patterns and efficiency",
    indications: [
      "Gait abnormality",
      "Post-stroke",
      "Neurological disorder",
      "Lower extremity injury",
      "Balance disorder",
    ],
    contraindications: [
      "Acute pain",
      "Severe cardiovascular disease",
      "Uncontrolled diabetes",
    ],
    precautions: [
      "Monitor vital signs",
      "Provide assistive device",
      "Ensure safe environment",
    ],
    progressionStages: [
      {
        stage: "Stage 1: Parallel Bar Training",
        duration: "1-2 weeks",
        exercises: [
          "Weight shifting",
          "Step initiation",
          "Stance phase training",
        ],
        parameters: {
          distance: "20-30 feet",
          frequency: "3x daily",
          duration: "10-15 minutes",
        },
      },
      {
        stage: "Stage 2: Walker Training",
        duration: "2-3 weeks",
        exercises: [
          "Walker ambulation",
          "Cadence training",
          "Step length normalization",
        ],
        parameters: {
          distance: "50-100 feet",
          frequency: "2x daily",
          duration: "15-20 minutes",
        },
      },
      {
        stage: "Stage 3: Cane/Independent",
        duration: "3-4 weeks",
        exercises: ["Cane ambulation", "Outdoor walking", "Stairs and ramps"],
        parameters: {
          distance: "200+ feet",
          frequency: "Daily",
          duration: "20-30 minutes",
        },
      },
    ],
    expectedOutcomes: [
      "Normalized gait pattern",
      "Improved walking speed",
      "Increased endurance",
      "Reduced assistive device dependence",
    ],
    evidenceLevel: 2,
    source: "APTA Neurological Physical Therapy Guidelines",
    citation:
      "American Physical Therapy Association (2023). Gait Training Protocols.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-ft-003",
    name: "Stair Training",
    abbreviation: "ST",
    category: "mobility",
    description: "Progressive training for safe stair negotiation",
    indications: [
      "Lower extremity weakness",
      "Balance impairment",
      "Functional limitation",
      "Post-operative rehabilitation",
    ],
    contraindications: [
      "Acute fracture",
      "Severe pain",
      "Uncontrolled vertigo",
    ],
    precautions: [
      "Provide rail support",
      "Monitor balance",
      "Use step-over-step pattern",
    ],
    progressionStages: [
      {
        stage: "Stage 1: Step-Over-Step Ascending",
        duration: "1-2 weeks",
        exercises: [
          "Ascending with rail",
          "Weight transfer",
          "Step initiation",
        ],
        parameters: { steps: "4-6", sets: "3", frequency: "3x weekly" },
      },
      {
        stage: "Stage 2: Step-Over-Step Descending",
        duration: "2-3 weeks",
        exercises: [
          "Descending with rail",
          "Controlled descent",
          "Balance maintenance",
        ],
        parameters: { steps: "6-8", sets: "3", frequency: "3x weekly" },
      },
      {
        stage: "Stage 3: Independent Stairs",
        duration: "3-4 weeks",
        exercises: [
          "Full flight ascending",
          "Full flight descending",
          "Alternating pattern",
        ],
        parameters: { steps: "12+", sets: "2", frequency: "3x weekly" },
      },
    ],
    expectedOutcomes: [
      "Safe stair negotiation",
      "Improved lower extremity strength",
      "Enhanced balance",
      "Increased functional independence",
    ],
    evidenceLevel: 2,
    source: "APTA Mobility Training Guidelines",
    citation:
      "American Physical Therapy Association (2023). Stair Training Protocols.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-ft-004",
    name: "Balance and Proprioception Training",
    abbreviation: "BPT",
    category: "balance",
    description:
      "Systematic training to improve balance and proprioceptive awareness",
    indications: [
      "Balance disorder",
      "Fall risk",
      "Proprioceptive deficit",
      "Vestibular dysfunction",
      "Neurological disorder",
    ],
    contraindications: [
      "Acute vertigo",
      "Uncontrolled hypertension",
      "Severe cardiovascular disease",
    ],
    precautions: [
      "Provide safety support",
      "Monitor for dizziness",
      "Ensure clear environment",
    ],
    progressionStages: [
      {
        stage: "Stage 1: Static Balance",
        duration: "1-2 weeks",
        exercises: [
          "Supported standing",
          "Weight shifting",
          "Narrow base of support",
        ],
        parameters: {
          duration: "30-60 seconds",
          sets: "3",
          frequency: "Daily",
        },
      },
      {
        stage: "Stage 2: Dynamic Balance",
        duration: "2-3 weeks",
        exercises: ["Reaching activities", "Head turns", "Weight transfers"],
        parameters: { duration: "1-2 minutes", sets: "3", frequency: "Daily" },
      },
      {
        stage: "Stage 3: Challenging Balance",
        duration: "3-4 weeks",
        exercises: [
          "Tandem stance",
          "Single leg stance",
          "Perturbation training",
        ],
        parameters: { duration: "2-3 minutes", sets: "3", frequency: "Daily" },
      },
    ],
    expectedOutcomes: [
      "Improved balance",
      "Reduced fall risk",
      "Enhanced proprioception",
      "Increased confidence in mobility",
    ],
    evidenceLevel: 2,
    source: "APTA Balance Training Guidelines",
    citation:
      "American Physical Therapy Association (2023). Balance and Proprioception Training.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-ft-005",
    name: "Functional Reaching Training",
    abbreviation: "FRT",
    category: "upper-extremity",
    description:
      "Training to improve functional reaching and upper extremity coordination",
    indications: [
      "Upper extremity weakness",
      "Coordination deficit",
      "Functional limitation",
      "Post-stroke",
      "Neurological disorder",
    ],
    contraindications: ["Acute pain", "Severe spasticity", "Unstable shoulder"],
    precautions: [
      "Monitor shoulder mechanics",
      "Avoid excessive range",
      "Provide support as needed",
    ],
    progressionStages: [
      {
        stage: "Stage 1: Supported Reaching",
        duration: "1-2 weeks",
        exercises: [
          "Seated reaching",
          "Supported arm movement",
          "Bilateral reaching",
        ],
        parameters: { reps: "10-15", sets: "3", frequency: "Daily" },
      },
      {
        stage: "Stage 2: Functional Reaching",
        duration: "2-3 weeks",
        exercises: [
          "Reaching to objects",
          "Crossing midline",
          "Overhead reaching",
        ],
        parameters: { reps: "12-15", sets: "3", frequency: "Daily" },
      },
      {
        stage: "Stage 3: Advanced Reaching",
        duration: "3-4 weeks",
        exercises: [
          "Rapid reaching",
          "Precision reaching",
          "Functional activities",
        ],
        parameters: { reps: "15-20", sets: "3", frequency: "Daily" },
      },
    ],
    expectedOutcomes: [
      "Improved reaching ability",
      "Enhanced upper extremity coordination",
      "Increased functional independence",
      "Better motor control",
    ],
    evidenceLevel: 2,
    source: "APTA Upper Extremity Guidelines",
    citation:
      "American Physical Therapy Association (2023). Functional Reaching Training.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-ft-006",
    name: "Functional Ambulation Training",
    abbreviation: "FAT",
    category: "mobility",
    description:
      "Training for functional walking in various environments and conditions",
    indications: [
      "Mobility limitation",
      "Gait disorder",
      "Endurance deficit",
      "Environmental adaptation needed",
      "Community reintegration",
    ],
    contraindications: [
      "Acute cardiovascular event",
      "Severe pain",
      "Uncontrolled diabetes",
    ],
    precautions: [
      "Monitor vital signs",
      "Provide assistive device",
      "Ensure safe environment",
    ],
    progressionStages: [
      {
        stage: "Stage 1: Indoor Walking",
        duration: "1-2 weeks",
        exercises: [
          "Hallway walking",
          "Flat surface ambulation",
          "Consistent pace",
        ],
        parameters: {
          distance: "100-200 feet",
          frequency: "2x daily",
          duration: "10-15 minutes",
        },
      },
      {
        stage: "Stage 2: Environmental Challenges",
        duration: "2-3 weeks",
        exercises: ["Uneven surfaces", "Obstacles", "Turns and corners"],
        parameters: {
          distance: "300-500 feet",
          frequency: "2x daily",
          duration: "15-20 minutes",
        },
      },
      {
        stage: "Stage 3: Community Walking",
        duration: "3-4 weeks",
        exercises: [
          "Outdoor walking",
          "Varied terrain",
          "Community navigation",
        ],
        parameters: {
          distance: "500+ feet",
          frequency: "Daily",
          duration: "20-30 minutes",
        },
      },
    ],
    expectedOutcomes: [
      "Improved walking endurance",
      "Safe community ambulation",
      "Increased independence",
      "Enhanced quality of life",
    ],
    evidenceLevel: 2,
    source: "APTA Community Mobility Guidelines",
    citation:
      "American Physical Therapy Association (2023). Functional Ambulation Training.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-ft-007",
    name: "Work Conditioning",
    abbreviation: "WC",
    category: "work-related",
    description:
      "Systematic conditioning to prepare for return to work activities",
    indications: [
      "Work-related injury",
      "Functional capacity deficit",
      "Return to work preparation",
      "Occupational limitation",
    ],
    contraindications: ["Acute injury", "Unhealed fracture", "Severe pain"],
    precautions: [
      "Monitor pain levels",
      "Gradual progression",
      "Job-specific simulation",
    ],
    progressionStages: [
      {
        stage: "Stage 1: Basic Conditioning",
        duration: "2-3 weeks",
        exercises: [
          "Cardiovascular conditioning",
          "General strengthening",
          "Flexibility training",
        ],
        parameters: {
          duration: "30-45 minutes",
          frequency: "3x weekly",
          intensity: "Moderate",
        },
      },
      {
        stage: "Stage 2: Job-Specific Training",
        duration: "3-4 weeks",
        exercises: [
          "Job simulation",
          "Task-specific exercises",
          "Endurance building",
        ],
        parameters: {
          duration: "45-60 minutes",
          frequency: "3x weekly",
          intensity: "Moderate-High",
        },
      },
      {
        stage: "Stage 3: Return to Work",
        duration: "2-3 weeks",
        exercises: [
          "Full job simulation",
          "Sustained activity",
          "Graduated return",
        ],
        parameters: {
          duration: "60+ minutes",
          frequency: "3x weekly",
          intensity: "High",
        },
      },
    ],
    expectedOutcomes: [
      "Improved work capacity",
      "Safe return to work",
      "Reduced re-injury risk",
      "Improved job performance",
    ],
    evidenceLevel: 2,
    source: "APTA Work Conditioning Guidelines",
    citation:
      "American Physical Therapy Association (2023). Work Conditioning Protocols.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-ft-008",
    name: "Sport-Specific Training",
    abbreviation: "SST",
    category: "sports",
    description:
      "Training for return to sport activities with sport-specific movements",
    indications: [
      "Sport injury",
      "Return to sport preparation",
      "Athletic performance",
      "Sport-specific limitation",
    ],
    contraindications: ["Acute injury", "Incomplete healing", "Severe pain"],
    precautions: [
      "Progressive intensity",
      "Sport-specific mechanics",
      "Injury prevention",
    ],
    progressionStages: [
      {
        stage: "Stage 1: Sport-Specific Conditioning",
        duration: "2-3 weeks",
        exercises: [
          "Sport-specific strengthening",
          "Agility drills",
          "Sport movement patterns",
        ],
        parameters: {
          duration: "45-60 minutes",
          frequency: "3x weekly",
          intensity: "Moderate",
        },
      },
      {
        stage: "Stage 2: Sport-Specific Skills",
        duration: "3-4 weeks",
        exercises: [
          "Sport technique training",
          "Competitive drills",
          "Sport simulation",
        ],
        parameters: {
          duration: "60-90 minutes",
          frequency: "3x weekly",
          intensity: "Moderate-High",
        },
      },
      {
        stage: "Stage 3: Return to Sport",
        duration: "2-3 weeks",
        exercises: [
          "Full sport participation",
          "Competitive play",
          "Performance optimization",
        ],
        parameters: {
          duration: "90+ minutes",
          frequency: "3-4x weekly",
          intensity: "High",
        },
      },
    ],
    expectedOutcomes: [
      "Safe return to sport",
      "Improved athletic performance",
      "Reduced re-injury risk",
      "Sport-specific confidence",
    ],
    evidenceLevel: 2,
    source: "APTA Sports Physical Therapy Guidelines",
    citation:
      "American Physical Therapy Association (2023). Sport-Specific Training Protocols.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-ft-009",
    name: "Community Reintegration Training",
    abbreviation: "CRT",
    category: "community",
    description:
      "Training for safe participation in community activities and social engagement",
    indications: [
      "Social isolation",
      "Community participation limitation",
      "Functional independence goal",
      "Quality of life improvement",
    ],
    contraindications: [
      "Acute medical condition",
      "Severe cognitive impairment",
      "Uncontrolled behavior",
    ],
    precautions: [
      "Gradual exposure",
      "Safety planning",
      "Caregiver involvement",
    ],
    progressionStages: [
      {
        stage: "Stage 1: Home-Based Activities",
        duration: "2-3 weeks",
        exercises: ["Home management", "Self-care activities", "Home safety"],
        parameters: {
          duration: "30-45 minutes",
          frequency: "3x weekly",
          setting: "Home",
        },
      },
      {
        stage: "Stage 2: Community Exploration",
        duration: "3-4 weeks",
        exercises: [
          "Community navigation",
          "Public transportation",
          "Shopping activities",
        ],
        parameters: {
          duration: "45-60 minutes",
          frequency: "2-3x weekly",
          setting: "Community",
        },
      },
      {
        stage: "Stage 3: Community Participation",
        duration: "2-3 weeks",
        exercises: [
          "Social activities",
          "Volunteer work",
          "Leisure activities",
        ],
        parameters: {
          duration: "60+ minutes",
          frequency: "3-4x weekly",
          setting: "Community",
        },
      },
    ],
    expectedOutcomes: [
      "Improved community participation",
      "Enhanced social engagement",
      "Increased independence",
      "Better quality of life",
    ],
    evidenceLevel: 2,
    source: "APTA Community Reintegration Guidelines",
    citation:
      "American Physical Therapy Association (2023). Community Reintegration Training.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-ft-010",
    name: "Fall Prevention Training",
    abbreviation: "FPT",
    category: "safety",
    description:
      "Comprehensive training program to reduce fall risk and improve safety awareness",
    indications: [
      "Fall risk",
      "History of falls",
      "Balance impairment",
      "Mobility limitation",
      "Elderly population",
    ],
    contraindications: [
      "Acute illness",
      "Severe pain",
      "Uncontrolled medical condition",
    ],
    precautions: [
      "Environmental assessment",
      "Safety equipment",
      "Caregiver education",
    ],
    progressionStages: [
      {
        stage: "Stage 1: Fall Risk Assessment",
        duration: "1 week",
        exercises: [
          "Balance testing",
          "Strength assessment",
          "Environmental evaluation",
        ],
        parameters: {
          duration: "30-45 minutes",
          frequency: "1x",
          setting: "Clinic/Home",
        },
      },
      {
        stage: "Stage 2: Intervention Training",
        duration: "4-6 weeks",
        exercises: [
          "Balance training",
          "Strength training",
          "Gait training",
          "Environmental modification",
        ],
        parameters: {
          duration: "45-60 minutes",
          frequency: "2-3x weekly",
          setting: "Clinic/Home",
        },
      },
      {
        stage: "Stage 3: Maintenance Program",
        duration: "Ongoing",
        exercises: [
          "Home exercise program",
          "Community activities",
          "Ongoing monitoring",
        ],
        parameters: {
          duration: "30-45 minutes",
          frequency: "3-4x weekly",
          setting: "Home",
        },
      },
    ],
    expectedOutcomes: [
      "Reduced fall risk",
      "Improved balance and strength",
      "Enhanced safety awareness",
      "Maintained independence",
    ],
    evidenceLevel: 2,
    source: "APTA Fall Prevention Guidelines",
    citation:
      "American Physical Therapy Association (2023). Fall Prevention Training Protocols.",
    lastUpdated: new Date("2024-01-15"),
  },
];

/**
 * Get functional training protocol by ID
 */
export function getPTFunctionalTrainingById(
  id: string,
): PTFunctionalTraining | undefined {
  return ptFunctionalTrainingData.find((ft) => ft.id === id);
}

/**
 * Get functional training protocols by category
 */
export function getPTFunctionalTrainingByCategory(
  category: string,
): PTFunctionalTraining[] {
  return ptFunctionalTrainingData.filter((ft) => ft.category === category);
}

/**
 * Search functional training protocols
 */
export function searchPTFunctionalTraining(
  query: string,
): PTFunctionalTraining[] {
  const lowerQuery = query.toLowerCase();
  return ptFunctionalTrainingData.filter(
    (ft) =>
      ft.name.toLowerCase().includes(lowerQuery) ||
      ft.abbreviation.toLowerCase().includes(lowerQuery) ||
      ft.description.toLowerCase().includes(lowerQuery),
  );
}

/**
 * Get all functional training protocols
 */
export function getAllPTFunctionalTraining(): PTFunctionalTraining[] {
  return ptFunctionalTrainingData;
}

/**
 * Get functional training categories
 */
export function getPTFunctionalTrainingCategories(): string[] {
  return Array.from(new Set(ptFunctionalTrainingData.map((ft) => ft.category)));
}

/**
 * Get functional training protocols for indication
 */
export function getPTFunctionalTrainingForIndication(
  indication: string,
): PTFunctionalTraining[] {
  return ptFunctionalTrainingData.filter((ft) =>
    ft.indications.some((ind) =>
      ind.toLowerCase().includes(indication.toLowerCase()),
    ),
  );
}

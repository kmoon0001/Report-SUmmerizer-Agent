/**
 * OT Module 7: Functional Training
 * Comprehensive functional training protocols for occupational therapy
 * Evidence-based from AOTA and clinical best practices
 */

export interface OTFunctionalTraining {
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

const otFunctionalTrainingData: OTFunctionalTraining[] = [
  {
    id: "ot-ft-001",
    name: "Self-Care Functional Training",
    abbreviation: "SCFT",
    category: "self-care",
    description: "Systematic training for independence in self-care activities",
    indications: [
      "Self-care limitation",
      "ADL deficit",
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
    progressionStages: [
      {
        stage: "Stage 1: Grooming and Hygiene",
        duration: "1-2 weeks",
        exercises: ["Toothbrushing", "Face washing", "Hair combing", "Shaving"],
        parameters: { sets: "1", reps: "Daily", frequency: "Daily" },
      },
      {
        stage: "Stage 2: Dressing",
        duration: "2-3 weeks",
        exercises: [
          "Shirt dressing",
          "Pants dressing",
          "Shoe dressing",
          "Fastener management",
        ],
        parameters: { sets: "1", reps: "Daily", frequency: "Daily" },
      },
      {
        stage: "Stage 3: Bathing and Toileting",
        duration: "3-4 weeks",
        exercises: [
          "Shower transfer",
          "Bathing",
          "Toileting",
          "Hygiene management",
        ],
        parameters: { sets: "1", reps: "Daily", frequency: "Daily" },
      },
    ],
    expectedOutcomes: [
      "Improved self-care independence",
      "Better hygiene",
      "Enhanced dignity",
      "Increased confidence",
    ],
    evidenceLevel: 2,
    source: "AOTA Functional Training Guidelines",
    citation: "AOTA (2023). Self-Care Functional Training Protocols.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-ft-002",
    name: "Meal Preparation Functional Training",
    abbreviation: "MPFT",
    category: "meal-preparation",
    description: "Training for safe and independent meal preparation",
    indications: [
      "Meal preparation limitation",
      "IADL deficit",
      "Functional impairment",
      "Community living",
    ],
    contraindications: [
      "Severe cognitive impairment",
      "Safety risk",
      "Severe motor impairment",
    ],
    precautions: [
      "Kitchen safety",
      "Burn prevention",
      "Cut prevention",
      "Cognitive demands",
    ],
    progressionStages: [
      {
        stage: "Stage 1: Simple Meal Preparation",
        duration: "1-2 weeks",
        exercises: [
          "Sandwich making",
          "Beverage preparation",
          "Simple cooking",
          "Food handling",
        ],
        parameters: {
          sets: "1",
          reps: "2-3 times weekly",
          frequency: "2-3 times weekly",
        },
      },
      {
        stage: "Stage 2: Moderate Meal Preparation",
        duration: "2-3 weeks",
        exercises: [
          "Stovetop cooking",
          "Oven use",
          "Recipe following",
          "Meal planning",
        ],
        parameters: {
          sets: "1",
          reps: "2-3 times weekly",
          frequency: "2-3 times weekly",
        },
      },
      {
        stage: "Stage 3: Complex Meal Preparation",
        duration: "3-4 weeks",
        exercises: [
          "Multi-step recipes",
          "Timing management",
          "Cleanup",
          "Meal management",
        ],
        parameters: {
          sets: "1",
          reps: "2-3 times weekly",
          frequency: "2-3 times weekly",
        },
      },
    ],
    expectedOutcomes: [
      "Improved meal preparation independence",
      "Better nutrition",
      "Enhanced community living",
      "Increased confidence",
    ],
    evidenceLevel: 2,
    source: "AOTA Functional Training Guidelines",
    citation: "AOTA (2023). Meal Preparation Functional Training Protocols.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-ft-003",
    name: "Household Management Functional Training",
    abbreviation: "HMFT",
    category: "household-management",
    description:
      "Training for independent household management and maintenance",
    indications: [
      "Household management limitation",
      "IADL deficit",
      "Functional impairment",
      "Community living",
    ],
    contraindications: [
      "Severe cognitive impairment",
      "Safety risk",
      "Severe motor impairment",
    ],
    precautions: [
      "Safety awareness",
      "Physical demands",
      "Cognitive demands",
      "Environmental factors",
    ],
    progressionStages: [
      {
        stage: "Stage 1: Basic Housekeeping",
        duration: "1-2 weeks",
        exercises: ["Dusting", "Sweeping", "Vacuuming", "Organizing"],
        parameters: {
          sets: "1",
          reps: "2-3 times weekly",
          frequency: "2-3 times weekly",
        },
      },
      {
        stage: "Stage 2: Laundry Management",
        duration: "2-3 weeks",
        exercises: [
          "Sorting laundry",
          "Washing",
          "Drying",
          "Folding",
          "Ironing",
        ],
        parameters: {
          sets: "1",
          reps: "1-2 times weekly",
          frequency: "1-2 times weekly",
        },
      },
      {
        stage: "Stage 3: Complex Household Tasks",
        duration: "3-4 weeks",
        exercises: [
          "Bathroom cleaning",
          "Kitchen cleaning",
          "Bed making",
          "Maintenance tasks",
        ],
        parameters: {
          sets: "1",
          reps: "1-2 times weekly",
          frequency: "1-2 times weekly",
        },
      },
    ],
    expectedOutcomes: [
      "Improved household independence",
      "Better home maintenance",
      "Enhanced community living",
      "Increased confidence",
    ],
    evidenceLevel: 2,
    source: "AOTA Functional Training Guidelines",
    citation:
      "AOTA (2023). Household Management Functional Training Protocols.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-ft-004",
    name: "Money Management Functional Training",
    abbreviation: "MMFT",
    category: "money-management",
    description: "Training for safe and independent money management",
    indications: [
      "Money management limitation",
      "Cognitive impairment",
      "Financial vulnerability",
      "Community living",
    ],
    contraindications: [
      "Severe cognitive impairment",
      "Severe judgment impairment",
      "Safety risk",
    ],
    precautions: [
      "Cognitive demands",
      "Financial safety",
      "Fraud prevention",
      "Realistic expectations",
    ],
    progressionStages: [
      {
        stage: "Stage 1: Basic Money Skills",
        duration: "1-2 weeks",
        exercises: [
          "Coin recognition",
          "Bill recognition",
          "Counting money",
          "Making change",
        ],
        parameters: {
          sets: "1",
          reps: "2-3 times weekly",
          frequency: "2-3 times weekly",
        },
      },
      {
        stage: "Stage 2: Shopping and Budgeting",
        duration: "2-3 weeks",
        exercises: [
          "Shopping simulation",
          "Price comparison",
          "Budget planning",
          "Receipt management",
        ],
        parameters: {
          sets: "1",
          reps: "2-3 times weekly",
          frequency: "2-3 times weekly",
        },
      },
      {
        stage: "Stage 3: Financial Management",
        duration: "3-4 weeks",
        exercises: [
          "Bill payment",
          "Banking",
          "Financial planning",
          "Fraud prevention",
        ],
        parameters: {
          sets: "1",
          reps: "1-2 times weekly",
          frequency: "1-2 times weekly",
        },
      },
    ],
    expectedOutcomes: [
      "Improved money management independence",
      "Better financial safety",
      "Enhanced community living",
      "Increased confidence",
    ],
    evidenceLevel: 2,
    source: "AOTA Functional Training Guidelines",
    citation: "AOTA (2023). Money Management Functional Training Protocols.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-ft-005",
    name: "Medication Management Functional Training",
    abbreviation: "MEDFT",
    category: "medication-management",
    description: "Training for safe and independent medication management",
    indications: [
      "Medication management limitation",
      "Cognitive impairment",
      "Medication errors",
      "Community living",
    ],
    contraindications: [
      "Severe cognitive impairment",
      "Severe judgment impairment",
      "Safety risk",
    ],
    precautions: [
      "Cognitive demands",
      "Safety awareness",
      "Medication safety",
      "Realistic expectations",
    ],
    progressionStages: [
      {
        stage: "Stage 1: Medication Recognition",
        duration: "1-2 weeks",
        exercises: [
          "Medication identification",
          "Label reading",
          "Dosage understanding",
          "Timing awareness",
        ],
        parameters: { sets: "1", reps: "Daily", frequency: "Daily" },
      },
      {
        stage: "Stage 2: Medication Organization",
        duration: "2-3 weeks",
        exercises: [
          "Pill organizer use",
          "Schedule management",
          "Reminder systems",
          "Organization strategies",
        ],
        parameters: { sets: "1", reps: "Daily", frequency: "Daily" },
      },
      {
        stage: "Stage 3: Independent Medication Management",
        duration: "3-4 weeks",
        exercises: [
          "Self-administration",
          "Refill management",
          "Side effect awareness",
          "Safety monitoring",
        ],
        parameters: { sets: "1", reps: "Daily", frequency: "Daily" },
      },
    ],
    expectedOutcomes: [
      "Improved medication management independence",
      "Better medication safety",
      "Reduced medication errors",
      "Increased confidence",
    ],
    evidenceLevel: 2,
    source: "AOTA Functional Training Guidelines",
    citation:
      "AOTA (2023). Medication Management Functional Training Protocols.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-ft-006",
    name: "Community Mobility Functional Training",
    abbreviation: "CMFT",
    category: "community-mobility",
    description: "Training for safe community mobility and transportation use",
    indications: [
      "Community mobility limitation",
      "Transportation limitation",
      "Functional impairment",
      "Community living",
    ],
    contraindications: [
      "Severe cognitive impairment",
      "Safety risk",
      "Severe motor impairment",
    ],
    precautions: [
      "Safety awareness",
      "Environmental factors",
      "Realistic expectations",
      "Caregiver involvement",
    ],
    progressionStages: [
      {
        stage: "Stage 1: Local Community Navigation",
        duration: "1-2 weeks",
        exercises: [
          "Neighborhood walking",
          "Local shopping",
          "Familiar routes",
          "Safety awareness",
        ],
        parameters: {
          sets: "1",
          reps: "2-3 times weekly",
          frequency: "2-3 times weekly",
        },
      },
      {
        stage: "Stage 2: Public Transportation",
        duration: "2-3 weeks",
        exercises: ["Bus use", "Train use", "Taxi use", "Route planning"],
        parameters: {
          sets: "1",
          reps: "2-3 times weekly",
          frequency: "2-3 times weekly",
        },
      },
      {
        stage: "Stage 3: Extended Community Access",
        duration: "3-4 weeks",
        exercises: [
          "Distant destinations",
          "Complex routes",
          "Multi-step trips",
          "Independent navigation",
        ],
        parameters: {
          sets: "1",
          reps: "2-3 times weekly",
          frequency: "2-3 times weekly",
        },
      },
    ],
    expectedOutcomes: [
      "Improved community mobility independence",
      "Better transportation use",
      "Enhanced community participation",
      "Increased confidence",
    ],
    evidenceLevel: 2,
    source: "AOTA Functional Training Guidelines",
    citation: "AOTA (2023). Community Mobility Functional Training Protocols.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-ft-007",
    name: "Work Simulation Functional Training",
    abbreviation: "WSFT",
    category: "work-simulation",
    description: "Training for work-related tasks and job simulation",
    indications: [
      "Work-related limitation",
      "Return to work preparation",
      "Job placement",
      "Vocational goal",
    ],
    contraindications: ["Acute injury", "Medical instability", "Severe pain"],
    precautions: [
      "Job-specific demands",
      "Safety monitoring",
      "Realistic expectations",
      "Employer coordination",
    ],
    progressionStages: [
      {
        stage: "Stage 1: Basic Work Skills",
        duration: "1-2 weeks",
        exercises: [
          "Work tolerance",
          "Task completion",
          "Quality standards",
          "Time management",
        ],
        parameters: {
          sets: "1",
          reps: "3-4 hours daily",
          frequency: "3-4 times weekly",
        },
      },
      {
        stage: "Stage 2: Job-Specific Simulation",
        duration: "2-3 weeks",
        exercises: [
          "Job tasks",
          "Work pace",
          "Work environment",
          "Coworker interaction",
        ],
        parameters: {
          sets: "1",
          reps: "4-6 hours daily",
          frequency: "3-4 times weekly",
        },
      },
      {
        stage: "Stage 3: Graduated Return to Work",
        duration: "3-4 weeks",
        exercises: [
          "Full job duties",
          "Full work schedule",
          "Independent performance",
          "Workplace integration",
        ],
        parameters: { sets: "1", reps: "Full schedule", frequency: "Daily" },
      },
    ],
    expectedOutcomes: [
      "Improved work capacity",
      "Safe return to work",
      "Better job performance",
      "Increased employment stability",
    ],
    evidenceLevel: 2,
    source: "AOTA Functional Training Guidelines",
    citation: "AOTA (2023). Work Simulation Functional Training Protocols.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-ft-008",
    name: "Leisure and Recreation Functional Training",
    abbreviation: "LRFT",
    category: "leisure-recreation",
    description: "Training for leisure and recreational activity participation",
    indications: [
      "Leisure limitation",
      "Social isolation",
      "Quality of life concern",
      "Retirement planning",
    ],
    contraindications: [
      "Acute medical condition",
      "Severe depression",
      "Suicidal ideation",
    ],
    precautions: [
      "Realistic expectations",
      "Accessibility considerations",
      "Financial constraints",
      "Safety awareness",
    ],
    progressionStages: [
      {
        stage: "Stage 1: Leisure Exploration",
        duration: "1-2 weeks",
        exercises: [
          "Interest identification",
          "Activity exploration",
          "Accessibility assessment",
          "Resource identification",
        ],
        parameters: {
          sets: "1",
          reps: "2-3 times weekly",
          frequency: "2-3 times weekly",
        },
      },
      {
        stage: "Stage 2: Leisure Skill Development",
        duration: "2-3 weeks",
        exercises: [
          "Skill practice",
          "Technique development",
          "Equipment use",
          "Social participation",
        ],
        parameters: {
          sets: "1",
          reps: "2-3 times weekly",
          frequency: "2-3 times weekly",
        },
      },
      {
        stage: "Stage 3: Leisure Integration",
        duration: "3-4 weeks",
        exercises: [
          "Regular participation",
          "Social engagement",
          "Community involvement",
          "Sustained activity",
        ],
        parameters: {
          sets: "1",
          reps: "2-3 times weekly",
          frequency: "2-3 times weekly",
        },
      },
    ],
    expectedOutcomes: [
      "Improved leisure participation",
      "Better social engagement",
      "Enhanced quality of life",
      "Increased life satisfaction",
    ],
    evidenceLevel: 2,
    source: "AOTA Functional Training Guidelines",
    citation:
      "AOTA (2023). Leisure and Recreation Functional Training Protocols.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-ft-009",
    name: "Social Participation Functional Training",
    abbreviation: "SPFT",
    category: "social-participation",
    description: "Training for social participation and community engagement",
    indications: [
      "Social isolation",
      "Social skill deficit",
      "Community participation limitation",
      "Quality of life concern",
    ],
    contraindications: [
      "Acute psychiatric crisis",
      "Severe social anxiety",
      "Severe behavioral issues",
    ],
    precautions: [
      "Anxiety management",
      "Realistic expectations",
      "Gradual exposure",
      "Support system involvement",
    ],
    progressionStages: [
      {
        stage: "Stage 1: Social Skill Development",
        duration: "1-2 weeks",
        exercises: [
          "Communication skills",
          "Social awareness",
          "Interaction practice",
          "Confidence building",
        ],
        parameters: {
          sets: "1",
          reps: "2-3 times weekly",
          frequency: "2-3 times weekly",
        },
      },
      {
        stage: "Stage 2: Small Group Participation",
        duration: "2-3 weeks",
        exercises: [
          "Group activities",
          "Peer interaction",
          "Shared interests",
          "Collaborative activities",
        ],
        parameters: {
          sets: "1",
          reps: "2-3 times weekly",
          frequency: "2-3 times weekly",
        },
      },
      {
        stage: "Stage 3: Community Integration",
        duration: "3-4 weeks",
        exercises: [
          "Community groups",
          "Social events",
          "Volunteer activities",
          "Sustained participation",
        ],
        parameters: {
          sets: "1",
          reps: "2-3 times weekly",
          frequency: "2-3 times weekly",
        },
      },
    ],
    expectedOutcomes: [
      "Improved social participation",
      "Better community engagement",
      "Enhanced quality of life",
      "Reduced social isolation",
    ],
    evidenceLevel: 2,
    source: "AOTA Functional Training Guidelines",
    citation:
      "AOTA (2023). Social Participation Functional Training Protocols.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-ft-010",
    name: "Cognitive Functional Training",
    abbreviation: "CFT",
    category: "cognitive-function",
    description:
      "Training for cognitive function and executive function skills",
    indications: [
      "Cognitive impairment",
      "Executive function deficit",
      "Memory limitation",
      "Attention deficit",
    ],
    contraindications: [
      "Severe cognitive impairment",
      "Acute confusion",
      "Uncontrolled behavior",
    ],
    precautions: [
      "Cognitive demands",
      "Fatigue monitoring",
      "Frustration tolerance",
      "Realistic expectations",
    ],
    progressionStages: [
      {
        stage: "Stage 1: Cognitive Awareness",
        duration: "1-2 weeks",
        exercises: [
          "Cognitive assessment",
          "Strength identification",
          "Deficit awareness",
          "Strategy introduction",
        ],
        parameters: {
          sets: "1",
          reps: "2-3 times weekly",
          frequency: "2-3 times weekly",
        },
      },
      {
        stage: "Stage 2: Cognitive Strategy Development",
        duration: "2-3 weeks",
        exercises: [
          "Memory strategies",
          "Organization techniques",
          "Problem-solving",
          "Attention training",
        ],
        parameters: {
          sets: "1",
          reps: "2-3 times weekly",
          frequency: "2-3 times weekly",
        },
      },
      {
        stage: "Stage 3: Functional Cognitive Integration",
        duration: "3-4 weeks",
        exercises: [
          "ADL application",
          "IADL application",
          "Work application",
          "Community application",
        ],
        parameters: {
          sets: "1",
          reps: "2-3 times weekly",
          frequency: "2-3 times weekly",
        },
      },
    ],
    expectedOutcomes: [
      "Improved cognitive function",
      "Better executive function",
      "Enhanced independence",
      "Increased quality of life",
    ],
    evidenceLevel: 2,
    source: "AOTA Functional Training Guidelines",
    citation: "AOTA (2023). Cognitive Functional Training Protocols.",
    lastUpdated: new Date("2024-01-15"),
  },
];

/**
 * Get OT functional training by ID
 */
export function getOTFunctionalTrainingById(
  id: string,
): OTFunctionalTraining | undefined {
  return otFunctionalTrainingData.find((ft) => ft.id === id);
}

/**
 * Get OT functional training by category
 */
export function getOTFunctionalTrainingByCategory(
  category: string,
): OTFunctionalTraining[] {
  return otFunctionalTrainingData.filter((ft) => ft.category === category);
}

/**
 * Search OT functional training
 */
export function searchOTFunctionalTraining(
  query: string,
): OTFunctionalTraining[] {
  const lowerQuery = query.toLowerCase();
  return otFunctionalTrainingData.filter(
    (ft) =>
      ft.name.toLowerCase().includes(lowerQuery) ||
      ft.abbreviation.toLowerCase().includes(lowerQuery) ||
      ft.description.toLowerCase().includes(lowerQuery),
  );
}

/**
 * Get all OT functional training
 */
export function getAllOTFunctionalTraining(): OTFunctionalTraining[] {
  return otFunctionalTrainingData;
}

/**
 * Get OT functional training categories
 */
export function getOTFunctionalTrainingCategories(): string[] {
  return Array.from(new Set(otFunctionalTrainingData.map((ft) => ft.category)));
}

/**
 * Get OT functional training for indication
 */
export function getOTFunctionalTrainingForIndication(
  indication: string,
): OTFunctionalTraining[] {
  return otFunctionalTrainingData.filter((ft) =>
    ft.indications.some((ind) =>
      ind.toLowerCase().includes(indication.toLowerCase()),
    ),
  );
}

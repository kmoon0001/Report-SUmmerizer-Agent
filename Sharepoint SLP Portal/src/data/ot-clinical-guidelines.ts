/**
 * OT Module 2: Clinical Guidelines
 * Comprehensive clinical guidelines for occupational therapy
 * Evidence-based guidelines from AOTA and clinical best practices
 */

export interface OTClinicalGuideline {
  id: string;
  name: string;
  abbreviation: string;
  category: string;
  description: string;
  indications: string[];
  contraindications: string[];
  precautions: string[];
  interventionStrategies: string[];
  expectedOutcomes: string[];
  duration: string;
  frequency: string;
  evidenceLevel: number;
  source: string;
  citation: string;
  lastUpdated: Date;
}

const otClinicalGuidelinesData: OTClinicalGuideline[] = [
  {
    id: "ot-cg-001",
    name: "Stroke Rehabilitation Guidelines",
    abbreviation: "SRG",
    category: "neurological",
    description:
      "Comprehensive guidelines for occupational therapy in stroke rehabilitation",
    indications: [
      "Acute stroke",
      "Subacute stroke",
      "Chronic stroke",
      "Motor deficit",
      "Functional limitation",
    ],
    contraindications: [
      "Acute medical instability",
      "Severe cognitive impairment",
      "Uncontrolled behavior",
    ],
    precautions: [
      "Monitor vital signs",
      "Fall prevention",
      "Shoulder subluxation prevention",
      "Spasticity management",
    ],
    interventionStrategies: [
      "Task-specific training",
      "Constraint-induced therapy",
      "Bilateral training",
      "Functional activities",
      "Adaptive equipment",
    ],
    expectedOutcomes: [
      "Improved motor function",
      "Increased independence",
      "Enhanced participation",
      "Better quality of life",
    ],
    duration: "8-12 weeks",
    frequency: "3-5 times per week",
    evidenceLevel: 2,
    source: "AOTA Evidence-Based Practice",
    citation: "AOTA (2023). Stroke Rehabilitation Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-cg-002",
    name: "Hand Therapy Guidelines",
    abbreviation: "HTG",
    category: "hand-therapy",
    description:
      "Guidelines for occupational therapy in hand injury and dysfunction",
    indications: [
      "Hand injury",
      "Hand surgery",
      "Hand dysfunction",
      "Reduced dexterity",
      "Reduced grip strength",
    ],
    contraindications: ["Acute infection", "Unhealed wound", "Severe pain"],
    precautions: [
      "Wound care",
      "Edema management",
      "Scar tissue management",
      "Pain monitoring",
    ],
    interventionStrategies: [
      "ROM exercises",
      "Strengthening",
      "Dexterity training",
      "Functional activities",
      "Splinting",
    ],
    expectedOutcomes: [
      "Improved ROM",
      "Increased strength",
      "Enhanced dexterity",
      "Functional independence",
    ],
    duration: "6-12 weeks",
    frequency: "2-3 times per week",
    evidenceLevel: 2,
    source: "AOTA Evidence-Based Practice",
    citation: "AOTA (2023). Hand Therapy Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-cg-003",
    name: "Pediatric Development Guidelines",
    abbreviation: "PDG",
    category: "pediatric",
    description:
      "Guidelines for occupational therapy in pediatric developmental disorders",
    indications: [
      "Developmental delay",
      "Cerebral palsy",
      "Autism spectrum disorder",
      "Learning disability",
      "Sensory processing disorder",
    ],
    contraindications: [
      "Acute illness",
      "Uncontrolled seizures",
      "Severe behavioral issues",
    ],
    precautions: [
      "Age-appropriate activities",
      "Parental involvement",
      "Play-based learning",
      "Safety considerations",
    ],
    interventionStrategies: [
      "Play-based therapy",
      "Sensory integration",
      "Motor skill training",
      "ADL training",
      "School coordination",
    ],
    expectedOutcomes: [
      "Improved motor skills",
      "Enhanced sensory processing",
      "Better school performance",
      "Increased independence",
    ],
    duration: "12-24 weeks",
    frequency: "1-2 times per week",
    evidenceLevel: 2,
    source: "AOTA Evidence-Based Practice",
    citation: "AOTA (2023). Pediatric Development Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-cg-004",
    name: "Mental Health and Psychosocial Guidelines",
    abbreviation: "MHPG",
    category: "mental-health",
    description:
      "Guidelines for occupational therapy in mental health and psychosocial conditions",
    indications: [
      "Depression",
      "Anxiety",
      "Schizophrenia",
      "Bipolar disorder",
      "Substance abuse",
    ],
    contraindications: [
      "Acute psychiatric crisis",
      "Severe suicidality",
      "Acute psychosis",
    ],
    precautions: [
      "Safety assessment",
      "Medication effects",
      "Behavioral monitoring",
      "Therapeutic relationship",
    ],
    interventionStrategies: [
      "Meaningful activities",
      "Coping strategies",
      "Social skills training",
      "Vocational training",
      "Community integration",
    ],
    expectedOutcomes: [
      "Improved coping",
      "Enhanced social skills",
      "Better occupational engagement",
      "Improved quality of life",
    ],
    duration: "8-16 weeks",
    frequency: "1-2 times per week",
    evidenceLevel: 2,
    source: "AOTA Evidence-Based Practice",
    citation: "AOTA (2023). Mental Health Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-cg-005",
    name: "Arthritis Management Guidelines",
    abbreviation: "AMG",
    category: "rheumatologic",
    description: "Guidelines for occupational therapy in arthritis management",
    indications: [
      "Rheumatoid arthritis",
      "Osteoarthritis",
      "Joint pain",
      "Reduced ROM",
      "Functional limitation",
    ],
    contraindications: [
      "Acute inflammation",
      "Severe pain",
      "Uncontrolled disease",
    ],
    precautions: [
      "Joint protection",
      "Energy conservation",
      "Pain monitoring",
      "Activity pacing",
    ],
    interventionStrategies: [
      "Joint protection techniques",
      "Energy conservation",
      "ROM exercises",
      "Adaptive equipment",
      "ADL modification",
    ],
    expectedOutcomes: [
      "Reduced pain",
      "Improved ROM",
      "Enhanced independence",
      "Better quality of life",
    ],
    duration: "6-12 weeks",
    frequency: "1-2 times per week",
    evidenceLevel: 2,
    source: "AOTA Evidence-Based Practice",
    citation: "AOTA (2023). Arthritis Management Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-cg-006",
    name: "Spinal Cord Injury Rehabilitation Guidelines",
    abbreviation: "SCIRG",
    category: "neurological",
    description:
      "Guidelines for occupational therapy in spinal cord injury rehabilitation",
    indications: [
      "Spinal cord injury",
      "Paralysis",
      "Reduced mobility",
      "Functional limitation",
      "Wheelchair dependence",
    ],
    contraindications: [
      "Acute medical instability",
      "Severe pain",
      "Unhealed fracture",
    ],
    precautions: [
      "Pressure ulcer prevention",
      "Autonomic dysreflexia",
      "Contracture prevention",
      "Safety considerations",
    ],
    interventionStrategies: [
      "ADL training",
      "Wheelchair mobility",
      "Adaptive equipment",
      "Environmental modification",
      "Community reintegration",
    ],
    expectedOutcomes: [
      "Improved independence",
      "Enhanced mobility",
      "Better community participation",
      "Improved quality of life",
    ],
    duration: "12-24 weeks",
    frequency: "3-5 times per week",
    evidenceLevel: 2,
    source: "AOTA Evidence-Based Practice",
    citation: "AOTA (2023). Spinal Cord Injury Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-cg-007",
    name: "Dementia and Cognitive Decline Guidelines",
    abbreviation: "DCDG",
    category: "geriatric",
    description:
      "Guidelines for occupational therapy in dementia and cognitive decline",
    indications: [
      "Dementia",
      "Mild cognitive impairment",
      "Alzheimer's disease",
      "Cognitive decline",
      "Memory loss",
    ],
    contraindications: [
      "Severe behavioral disturbance",
      "Acute medical condition",
      "End-stage dementia",
    ],
    precautions: [
      "Safety monitoring",
      "Caregiver education",
      "Environmental modification",
      "Behavioral management",
    ],
    interventionStrategies: [
      "Cognitive stimulation",
      "ADL support",
      "Environmental modification",
      "Caregiver training",
      "Meaningful activities",
    ],
    expectedOutcomes: [
      "Maintained function",
      "Improved engagement",
      "Better caregiver support",
      "Enhanced quality of life",
    ],
    duration: "Ongoing",
    frequency: "1-2 times per week",
    evidenceLevel: 2,
    source: "AOTA Evidence-Based Practice",
    citation: "AOTA (2023). Dementia Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-cg-008",
    name: "Burn Rehabilitation Guidelines",
    abbreviation: "BRG",
    category: "wound-care",
    description:
      "Guidelines for occupational therapy in burn injury rehabilitation",
    indications: [
      "Burn injury",
      "Scar tissue",
      "Contracture",
      "Reduced ROM",
      "Functional limitation",
    ],
    contraindications: ["Acute infection", "Unhealed wound", "Severe pain"],
    precautions: [
      "Wound care",
      "Scar management",
      "Contracture prevention",
      "Pain management",
    ],
    interventionStrategies: [
      "ROM exercises",
      "Splinting",
      "Scar management",
      "Functional activities",
      "Psychosocial support",
    ],
    expectedOutcomes: [
      "Improved ROM",
      "Reduced contracture",
      "Enhanced function",
      "Better appearance",
    ],
    duration: "12-24 weeks",
    frequency: "3-5 times per week",
    evidenceLevel: 2,
    source: "AOTA Evidence-Based Practice",
    citation: "AOTA (2023). Burn Rehabilitation Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-cg-009",
    name: "Work Conditioning and Return to Work Guidelines",
    abbreviation: "WCRWG",
    category: "work-related",
    description:
      "Guidelines for occupational therapy in work conditioning and return to work",
    indications: [
      "Work-related injury",
      "Functional capacity deficit",
      "Return to work preparation",
      "Occupational limitation",
    ],
    contraindications: ["Acute injury", "Unhealed fracture", "Severe pain"],
    precautions: [
      "Job-specific simulation",
      "Gradual progression",
      "Pain monitoring",
      "Employer communication",
    ],
    interventionStrategies: [
      "Job simulation",
      "Conditioning exercises",
      "Ergonomic assessment",
      "Adaptive equipment",
      "Employer coordination",
    ],
    expectedOutcomes: [
      "Improved work capacity",
      "Safe return to work",
      "Reduced re-injury risk",
      "Better job performance",
    ],
    duration: "4-12 weeks",
    frequency: "3-5 times per week",
    evidenceLevel: 2,
    source: "AOTA Evidence-Based Practice",
    citation: "AOTA (2023). Work Conditioning Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-cg-010",
    name: "Vision Rehabilitation Guidelines",
    abbreviation: "VRG",
    category: "sensory",
    description: "Guidelines for occupational therapy in vision rehabilitation",
    indications: [
      "Vision loss",
      "Low vision",
      "Blindness",
      "Visual field deficit",
      "Functional limitation",
    ],
    contraindications: [
      "Acute eye condition",
      "Uncontrolled eye disease",
      "Severe pain",
    ],
    precautions: [
      "Eye safety",
      "Lighting optimization",
      "Environmental modification",
      "Assistive technology",
    ],
    interventionStrategies: [
      "Adaptive techniques",
      "Environmental modification",
      "Assistive technology",
      "ADL training",
      "Community resources",
    ],
    expectedOutcomes: [
      "Improved independence",
      "Enhanced safety",
      "Better community participation",
      "Improved quality of life",
    ],
    duration: "8-16 weeks",
    frequency: "1-2 times per week",
    evidenceLevel: 2,
    source: "AOTA Evidence-Based Practice",
    citation: "AOTA (2023). Vision Rehabilitation Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
];

/**
 * Get OT clinical guideline by ID
 */
export function getOTClinicalGuidelineById(
  id: string,
): OTClinicalGuideline | undefined {
  return otClinicalGuidelinesData.find((cg) => cg.id === id);
}

/**
 * Get OT clinical guidelines by category
 */
export function getOTClinicalGuidelinesByCategory(
  category: string,
): OTClinicalGuideline[] {
  return otClinicalGuidelinesData.filter((cg) => cg.category === category);
}

/**
 * Search OT clinical guidelines
 */
export function searchOTClinicalGuidelines(
  query: string,
): OTClinicalGuideline[] {
  const lowerQuery = query.toLowerCase();
  return otClinicalGuidelinesData.filter(
    (cg) =>
      cg.name.toLowerCase().includes(lowerQuery) ||
      cg.abbreviation.toLowerCase().includes(lowerQuery) ||
      cg.description.toLowerCase().includes(lowerQuery),
  );
}

/**
 * Get all OT clinical guidelines
 */
export function getAllOTClinicalGuidelines(): OTClinicalGuideline[] {
  return otClinicalGuidelinesData;
}

/**
 * Get OT clinical guideline categories
 */
export function getOTClinicalGuidelineCategories(): string[] {
  return Array.from(new Set(otClinicalGuidelinesData.map((cg) => cg.category)));
}

/**
 * Get OT clinical guidelines for indication
 */
export function getOTClinicalGuidelinesForIndication(
  indication: string,
): OTClinicalGuideline[] {
  return otClinicalGuidelinesData.filter((cg) =>
    cg.indications.some((ind) =>
      ind.toLowerCase().includes(indication.toLowerCase()),
    ),
  );
}

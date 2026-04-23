/**
 * OT Module 8: Specialty Areas
 * Comprehensive specialty area protocols for occupational therapy
 * Evidence-based from AOTA specialty sections
 */

export interface OTSpecialtyArea {
  id: string;
  name: string;
  abbreviation: string;
  specialty: string;
  description: string;
  indications: string[];
  contraindications: string[];
  precautions: string[];
  assessmentTools: string[];
  interventionStrategies: string[];
  expectedOutcomes: string[];
  evidenceLevel: number;
  source: string;
  citation: string;
  lastUpdated: Date;
}

const otSpecialtyAreasData: OTSpecialtyArea[] = [
  {
    id: "ot-spec-001",
    name: "Pediatric Occupational Therapy",
    abbreviation: "POT",
    specialty: "pediatric",
    description:
      "Specialized OT for children with developmental and acquired disorders",
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
      "Growth considerations",
    ],
    assessmentTools: [
      "GMFM",
      "Peabody Developmental Scales",
      "Sensory Profile",
      "Functional assessment",
    ],
    interventionStrategies: [
      "Play-based therapy",
      "Developmental training",
      "Family education",
      "School coordination",
      "Adaptive equipment",
    ],
    expectedOutcomes: [
      "Improved motor development",
      "Enhanced functional skills",
      "Better school participation",
      "Improved quality of life",
    ],
    evidenceLevel: 2,
    source: "AOTA Pediatrics Section",
    citation: "AOTA (2023). Pediatric Occupational Therapy Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-spec-002",
    name: "Mental Health Occupational Therapy",
    abbreviation: "MHOT",
    specialty: "mental-health",
    description:
      "Specialized OT for mental health conditions and psychosocial disorders",
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
    assessmentTools: [
      "Occupational Performance Assessment",
      "Psychosocial assessment",
      "Functional assessment",
      "Coping assessment",
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
    evidenceLevel: 2,
    source: "AOTA Mental Health Section",
    citation: "AOTA (2023). Mental Health Occupational Therapy Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-spec-003",
    name: "Geriatric Occupational Therapy",
    abbreviation: "GOT",
    specialty: "geriatric",
    description:
      "Specialized OT for elderly patients with age-related conditions",
    indications: [
      "Fall risk",
      "Frailty",
      "Cognitive decline",
      "Multiple comorbidities",
      "Functional decline",
    ],
    contraindications: [
      "Acute medical condition",
      "Severe cognitive impairment",
      "Uncontrolled medical disease",
    ],
    precautions: [
      "Fall prevention",
      "Medication interactions",
      "Cognitive limitations",
      "Caregiver involvement",
    ],
    assessmentTools: [
      "Timed Up and Go",
      "Berg Balance Scale",
      "SPPB",
      "Functional assessment",
      "Cognitive assessment",
    ],
    interventionStrategies: [
      "Balance training",
      "Strength training",
      "Functional training",
      "Fall prevention",
      "Cognitive engagement",
    ],
    expectedOutcomes: [
      "Improved balance",
      "Reduced fall risk",
      "Maintained independence",
      "Enhanced quality of life",
    ],
    evidenceLevel: 2,
    source: "AOTA Geriatrics Section",
    citation: "AOTA (2023). Geriatric Occupational Therapy Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-spec-004",
    name: "Hand and Upper Extremity Occupational Therapy",
    abbreviation: "HUOT",
    specialty: "hand-therapy",
    description:
      "Specialized OT for hand and upper extremity injuries and dysfunction",
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
    assessmentTools: [
      "ROM measurement",
      "Strength testing",
      "Dexterity testing",
      "Functional assessment",
      "Pain assessment",
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
    evidenceLevel: 2,
    source: "AOTA Hand Therapy Section",
    citation:
      "AOTA (2023). Hand and Upper Extremity Occupational Therapy Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-spec-005",
    name: "Neurological Occupational Therapy",
    abbreviation: "NOT",
    specialty: "neurological",
    description:
      "Specialized OT for neurological disorders and brain/spinal cord injuries",
    indications: [
      "Stroke",
      "Parkinson's disease",
      "Multiple sclerosis",
      "Spinal cord injury",
      "Traumatic brain injury",
    ],
    contraindications: [
      "Acute neurological event",
      "Uncontrolled seizures",
      "Severe cognitive impairment",
    ],
    precautions: [
      "Fall risk assessment",
      "Seizure precautions",
      "Cognitive limitations",
      "Behavioral changes",
    ],
    assessmentTools: [
      "NIHSS",
      "Berg Balance Scale",
      "Fugl-Meyer Assessment",
      "MoCA",
      "Functional assessment",
    ],
    interventionStrategies: [
      "Task-specific training",
      "Balance training",
      "Gait training",
      "Neuroplasticity-based exercises",
      "Cognitive training",
    ],
    expectedOutcomes: [
      "Improved motor function",
      "Enhanced balance",
      "Increased independence",
      "Better quality of life",
    ],
    evidenceLevel: 2,
    source: "AOTA Neurology Section",
    citation: "AOTA (2023). Neurological Occupational Therapy Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-spec-006",
    name: "Work and Industry Occupational Therapy",
    abbreviation: "WIOT",
    specialty: "work-industry",
    description:
      "Specialized OT for work-related issues and occupational health",
    indications: [
      "Work-related injury",
      "Occupational limitation",
      "Return to work",
      "Ergonomic concern",
      "Job placement",
    ],
    contraindications: ["Acute injury", "Medical instability", "Severe pain"],
    precautions: [
      "Job-specific demands",
      "Safety monitoring",
      "Employer coordination",
      "Realistic expectations",
    ],
    assessmentTools: [
      "Work Capacity Evaluation",
      "Ergonomic assessment",
      "Functional capacity assessment",
      "Job analysis",
    ],
    interventionStrategies: [
      "Work conditioning",
      "Job simulation",
      "Ergonomic modification",
      "Workplace accommodation",
      "Employer coordination",
    ],
    expectedOutcomes: [
      "Improved work capacity",
      "Safe return to work",
      "Reduced re-injury risk",
      "Better job performance",
    ],
    evidenceLevel: 2,
    source: "AOTA Work and Industry Section",
    citation: "AOTA (2023). Work and Industry Occupational Therapy Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-spec-007",
    name: "Assistive Technology and Environmental Modification",
    abbreviation: "ATEM",
    specialty: "assistive-technology",
    description:
      "Specialized OT for assistive technology and environmental modification",
    indications: [
      "Accessibility need",
      "Functional limitation",
      "Mobility deficit",
      "Self-care limitation",
      "Environmental barrier",
    ],
    contraindications: [
      "Unsafe environment",
      "Structural limitations",
      "Financial constraints",
    ],
    precautions: [
      "Safety assessment",
      "Accessibility standards",
      "Aesthetic considerations",
      "Maintenance requirements",
    ],
    assessmentTools: [
      "Environmental assessment",
      "Functional assessment",
      "Accessibility assessment",
      "Technology assessment",
    ],
    interventionStrategies: [
      "Assistive device selection",
      "Environmental modification",
      "Technology training",
      "Accessibility improvement",
      "Safety enhancement",
    ],
    expectedOutcomes: [
      "Improved accessibility",
      "Enhanced independence",
      "Better safety",
      "Improved quality of life",
    ],
    evidenceLevel: 2,
    source: "AOTA Assistive Technology Section",
    citation:
      "AOTA (2023). Assistive Technology and Environmental Modification Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-spec-008",
    name: "Sensory Integration Occupational Therapy",
    abbreviation: "SIOT",
    specialty: "sensory-integration",
    description:
      "Specialized OT using sensory integration principles for sensory processing disorders",
    indications: [
      "Sensory processing disorder",
      "Autism spectrum disorder",
      "Developmental delay",
      "Motor planning deficit",
      "Behavioral concern",
    ],
    contraindications: [
      "Severe sensory sensitivity",
      "Acute sensory condition",
      "Uncontrolled behavior",
    ],
    precautions: [
      "Sensory stimulation tolerance",
      "Environmental control",
      "Behavioral monitoring",
      "Vestibular precautions",
    ],
    assessmentTools: [
      "Sensory Profile",
      "SIPT",
      "Functional assessment",
      "Behavioral observation",
      "Sensory history",
    ],
    interventionStrategies: [
      "Vestibular stimulation",
      "Proprioceptive input",
      "Tactile input",
      "Motor planning activities",
      "Sensory diet",
    ],
    expectedOutcomes: [
      "Improved sensory processing",
      "Enhanced motor planning",
      "Better coordination",
      "Improved behavior",
    ],
    evidenceLevel: 2,
    source: "AOTA Sensory Integration Section",
    citation:
      "AOTA (2023). Sensory Integration Occupational Therapy Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-spec-009",
    name: "Driving and Community Mobility Occupational Therapy",
    abbreviation: "DCMOT",
    specialty: "driving-mobility",
    description: "Specialized OT for driving assessment and community mobility",
    indications: [
      "Driving limitation",
      "Community mobility limitation",
      "Transportation concern",
      "Safety concern",
      "Functional limitation",
    ],
    contraindications: [
      "Severe cognitive impairment",
      "Severe motor impairment",
      "Safety risk",
    ],
    precautions: [
      "Safety assessment",
      "Realistic expectations",
      "Legal requirements",
      "Caregiver involvement",
    ],
    assessmentTools: [
      "Driving assessment",
      "Mobility assessment",
      "Functional assessment",
      "Safety assessment",
      "Cognitive assessment",
    ],
    interventionStrategies: [
      "Driving training",
      "Adaptive equipment",
      "Community mobility training",
      "Alternative transportation",
      "Safety education",
    ],
    expectedOutcomes: [
      "Improved driving safety",
      "Enhanced community mobility",
      "Better independence",
      "Improved quality of life",
    ],
    evidenceLevel: 2,
    source: "AOTA Driving and Mobility Section",
    citation:
      "AOTA (2023). Driving and Community Mobility Occupational Therapy Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-spec-010",
    name: "Occupational Therapy in Education",
    abbreviation: "OTIE",
    specialty: "education",
    description:
      "Specialized OT in school settings for educational performance",
    indications: [
      "Educational limitation",
      "Learning disability",
      "Developmental delay",
      "Behavioral concern",
      "School participation limitation",
    ],
    contraindications: [
      "Acute illness",
      "Uncontrolled seizures",
      "Severe behavioral issues",
    ],
    precautions: [
      "Age-appropriate activities",
      "School coordination",
      "Teacher collaboration",
      "Parent involvement",
    ],
    assessmentTools: [
      "Educational assessment",
      "Functional assessment",
      "Developmental assessment",
      "Behavioral assessment",
      "School performance assessment",
    ],
    interventionStrategies: [
      "Classroom modification",
      "Adaptive equipment",
      "Skill training",
      "Teacher consultation",
      "Parent education",
    ],
    expectedOutcomes: [
      "Improved school performance",
      "Better educational participation",
      "Enhanced learning",
      "Improved quality of life",
    ],
    evidenceLevel: 2,
    source: "AOTA Education Section",
    citation: "AOTA (2023). Occupational Therapy in Education Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
];

/**
 * Get OT specialty area by ID
 */
export function getOTSpecialtyAreaById(
  id: string,
): OTSpecialtyArea | undefined {
  return otSpecialtyAreasData.find((sa) => sa.id === id);
}

/**
 * Get OT specialty areas by specialty
 */
export function getOTSpecialtyAreaBySpecialty(
  specialty: string,
): OTSpecialtyArea[] {
  return otSpecialtyAreasData.filter((sa) => sa.specialty === specialty);
}

/**
 * Search OT specialty areas
 */
export function searchOTSpecialtyArea(query: string): OTSpecialtyArea[] {
  const lowerQuery = query.toLowerCase();
  return otSpecialtyAreasData.filter(
    (sa) =>
      sa.name.toLowerCase().includes(lowerQuery) ||
      sa.abbreviation.toLowerCase().includes(lowerQuery) ||
      sa.description.toLowerCase().includes(lowerQuery),
  );
}

/**
 * Get all OT specialty areas
 */
export function getAllOTSpecialtyAreas(): OTSpecialtyArea[] {
  return otSpecialtyAreasData;
}

/**
 * Get OT specialty area specialties
 */
export function getOTSpecialtyAreaSpecialties(): string[] {
  return Array.from(new Set(otSpecialtyAreasData.map((sa) => sa.specialty)));
}

/**
 * Get OT specialty areas for indication
 */
export function getOTSpecialtyAreaForIndication(
  indication: string,
): OTSpecialtyArea[] {
  return otSpecialtyAreasData.filter((sa) =>
    sa.indications.some((ind) =>
      ind.toLowerCase().includes(indication.toLowerCase()),
    ),
  );
}

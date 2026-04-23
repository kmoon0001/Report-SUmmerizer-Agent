/**
 * OT Module 4: Interventions
 * Comprehensive intervention strategies and techniques for occupational therapy
 * Evidence-based interventions from AOTA and clinical best practices
 */

export interface OTIntervention {
  id: string;
  name: string;
  abbreviation: string;
  category: string;
  description: string;
  indications: string[];
  contraindications: string[];
  precautions: string[];
  techniques: string[];
  expectedOutcomes: string[];
  duration: string;
  frequency: string;
  evidenceLevel: number;
  source: string;
  citation: string;
  lastUpdated: Date;
}

const otInterventionsData: OTIntervention[] = [
  {
    id: "ot-int-001",
    name: "Constraint-Induced Movement Therapy",
    abbreviation: "CIMT",
    category: "motor-recovery",
    description:
      "Intensive therapy constraining unaffected limb to promote affected limb use",
    indications: [
      "Stroke",
      "Hemiparesis",
      "Upper extremity weakness",
      "Motor deficit",
      "Learned non-use",
    ],
    contraindications: [
      "Severe pain",
      "Severe spasticity",
      "Cognitive impairment preventing participation",
    ],
    precautions: [
      "Safety monitoring",
      "Pain management",
      "Fatigue monitoring",
      "Motivation maintenance",
    ],
    techniques: [
      "Constraint application",
      "Intensive practice",
      "Task-specific training",
      "Repetitive practice",
    ],
    expectedOutcomes: [
      "Improved motor function",
      "Increased affected limb use",
      "Enhanced independence",
      "Better functional outcomes",
    ],
    duration: "2-3 weeks intensive",
    frequency: "5-6 hours daily",
    evidenceLevel: 2,
    source: "AOTA Evidence-Based Practice",
    citation: "Taub, E., et al. (2023). CIMT Manual.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-int-002",
    name: "Sensory Integration Therapy",
    abbreviation: "SIT",
    category: "sensory-motor",
    description:
      "Therapy using sensory input to improve sensory processing and motor planning",
    indications: [
      "Sensory processing disorder",
      "Autism spectrum disorder",
      "Developmental delay",
      "Motor planning deficit",
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
    techniques: [
      "Vestibular stimulation",
      "Proprioceptive input",
      "Tactile input",
      "Motor planning activities",
    ],
    expectedOutcomes: [
      "Improved sensory processing",
      "Enhanced motor planning",
      "Better coordination",
      "Improved behavior",
    ],
    duration: "8-12 weeks",
    frequency: "1-2 times per week",
    evidenceLevel: 2,
    source: "AOTA Evidence-Based Practice",
    citation: "Ayres, A. J. (2023). Sensory Integration Therapy Manual.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-int-003",
    name: "Cognitive Rehabilitation",
    abbreviation: "CR",
    category: "cognitive-intervention",
    description:
      "Therapy targeting cognitive deficits affecting occupational performance",
    indications: [
      "Cognitive impairment",
      "Brain injury",
      "Stroke",
      "Dementia",
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
    techniques: [
      "Cognitive exercises",
      "Compensatory strategies",
      "Environmental modification",
      "Errorless learning",
    ],
    expectedOutcomes: [
      "Improved cognitive function",
      "Enhanced independence",
      "Better occupational performance",
      "Improved quality of life",
    ],
    duration: "8-16 weeks",
    frequency: "2-3 times per week",
    evidenceLevel: 2,
    source: "AOTA Evidence-Based Practice",
    citation: "AOTA (2023). Cognitive Rehabilitation Manual.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-int-004",
    name: "Adaptive Equipment Training",
    abbreviation: "AET",
    category: "adaptive-equipment",
    description: "Training in use of adaptive equipment and assistive devices",
    indications: [
      "Functional limitation",
      "Mobility deficit",
      "Self-care limitation",
      "Accessibility need",
    ],
    contraindications: [
      "Cognitive impairment preventing learning",
      "Severe pain",
      "Uncontrolled behavior",
    ],
    precautions: [
      "Safety training",
      "Proper fit verification",
      "Maintenance education",
      "Follow-up monitoring",
    ],
    techniques: [
      "Equipment demonstration",
      "Hands-on practice",
      "Problem-solving",
      "Environmental adaptation",
    ],
    expectedOutcomes: [
      "Improved independence",
      "Enhanced safety",
      "Better functional performance",
      "Increased confidence",
    ],
    duration: "2-4 weeks",
    frequency: "1-2 times per week",
    evidenceLevel: 2,
    source: "AOTA Evidence-Based Practice",
    citation: "AOTA (2023). Adaptive Equipment Training Manual.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-int-005",
    name: "Splinting and Orthotic Intervention",
    abbreviation: "SOI",
    category: "orthotic-intervention",
    description:
      "Design and application of splints and orthotics for functional improvement",
    indications: [
      "Joint protection",
      "Contracture prevention",
      "Deformity correction",
      "Functional limitation",
      "Pain management",
    ],
    contraindications: [
      "Skin breakdown",
      "Severe edema",
      "Unhealed wound",
      "Severe pain",
    ],
    precautions: [
      "Skin integrity monitoring",
      "Circulation assessment",
      "Comfort evaluation",
      "Compliance monitoring",
    ],
    techniques: [
      "Splint fabrication",
      "Orthotic fitting",
      "Adjustment and modification",
      "Wear schedule education",
    ],
    expectedOutcomes: [
      "Improved ROM",
      "Reduced pain",
      "Prevented deformity",
      "Enhanced function",
    ],
    duration: "2-6 weeks",
    frequency: "1-2 times per week",
    evidenceLevel: 2,
    source: "AOTA Evidence-Based Practice",
    citation: "AOTA (2023). Splinting and Orthotic Manual.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-int-006",
    name: "Occupational Therapy for Mental Health",
    abbreviation: "OTMH",
    category: "mental-health-intervention",
    description:
      "Therapy using meaningful occupations to promote mental health and recovery",
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
    techniques: [
      "Meaningful activities",
      "Coping strategies",
      "Social skills training",
      "Vocational training",
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
    citation: "AOTA (2023). Mental Health Intervention Manual.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-int-007",
    name: "Pediatric Play-Based Intervention",
    abbreviation: "PBI",
    category: "pediatric-intervention",
    description:
      "Play-based therapy to promote development and learning in children",
    indications: [
      "Developmental delay",
      "Motor deficit",
      "Sensory processing disorder",
      "Behavioral concern",
      "Learning disability",
    ],
    contraindications: [
      "Acute illness",
      "Uncontrolled seizures",
      "Severe behavioral issues",
    ],
    precautions: [
      "Age-appropriate activities",
      "Safety considerations",
      "Parental involvement",
      "Play preferences",
    ],
    techniques: [
      "Play activities",
      "Sensory play",
      "Motor play",
      "Social play",
      "Cognitive play",
    ],
    expectedOutcomes: [
      "Improved motor skills",
      "Enhanced sensory processing",
      "Better social skills",
      "Increased learning",
    ],
    duration: "12-24 weeks",
    frequency: "1-2 times per week",
    evidenceLevel: 2,
    source: "AOTA Evidence-Based Practice",
    citation: "AOTA (2023). Pediatric Play-Based Intervention Manual.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-int-008",
    name: "Environmental Modification and Home Modification",
    abbreviation: "EMM",
    category: "environmental-intervention",
    description:
      "Modification of physical environment to promote independence and safety",
    indications: [
      "Accessibility need",
      "Fall risk",
      "Mobility limitation",
      "Safety concern",
      "Aging in place",
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
    techniques: [
      "Hazard removal",
      "Accessibility modification",
      "Lighting improvement",
      "Equipment installation",
    ],
    expectedOutcomes: [
      "Improved safety",
      "Enhanced independence",
      "Better accessibility",
      "Improved quality of life",
    ],
    duration: "2-4 weeks",
    frequency: "1-2 visits",
    evidenceLevel: 2,
    source: "AOTA Evidence-Based Practice",
    citation: "AOTA (2023). Environmental Modification Manual.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-int-009",
    name: "Vocational Rehabilitation and Job Training",
    abbreviation: "VRJT",
    category: "vocational-intervention",
    description:
      "Training and support for return to work and vocational success",
    indications: [
      "Work-related injury",
      "Functional capacity deficit",
      "Return to work preparation",
      "Job placement",
    ],
    contraindications: ["Acute injury", "Medical instability", "Severe pain"],
    precautions: [
      "Job-specific demands",
      "Employer coordination",
      "Safety monitoring",
      "Realistic expectations",
    ],
    techniques: [
      "Job simulation",
      "Skills training",
      "Employer communication",
      "Workplace accommodation",
    ],
    expectedOutcomes: [
      "Successful return to work",
      "Improved job performance",
      "Reduced re-injury risk",
      "Better employment stability",
    ],
    duration: "4-12 weeks",
    frequency: "2-3 times per week",
    evidenceLevel: 2,
    source: "AOTA Evidence-Based Practice",
    citation: "AOTA (2023). Vocational Rehabilitation Manual.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-int-010",
    name: "Caregiver Training and Education",
    abbreviation: "CTE",
    category: "caregiver-intervention",
    description:
      "Training and education for caregivers to support client independence",
    indications: [
      "Caregiver support needed",
      "Complex care requirements",
      "Dementia care",
      "Disability management",
    ],
    contraindications: [
      "Caregiver refusal",
      "Unsafe situation",
      "Abuse concern",
    ],
    precautions: [
      "Caregiver stress assessment",
      "Realistic expectations",
      "Respite care consideration",
      "Support resources",
    ],
    techniques: [
      "Education provision",
      "Hands-on training",
      "Problem-solving",
      "Resource connection",
    ],
    expectedOutcomes: [
      "Improved caregiver competence",
      "Better client outcomes",
      "Reduced caregiver stress",
      "Enhanced support system",
    ],
    duration: "4-8 weeks",
    frequency: "1-2 times per week",
    evidenceLevel: 2,
    source: "AOTA Evidence-Based Practice",
    citation: "AOTA (2023). Caregiver Training Manual.",
    lastUpdated: new Date("2024-01-15"),
  },
];

/**
 * Get OT intervention by ID
 */
export function getOTInterventionById(id: string): OTIntervention | undefined {
  return otInterventionsData.find((int) => int.id === id);
}

/**
 * Get OT interventions by category
 */
export function getOTInterventionsByCategory(
  category: string,
): OTIntervention[] {
  return otInterventionsData.filter((int) => int.category === category);
}

/**
 * Search OT interventions
 */
export function searchOTInterventions(query: string): OTIntervention[] {
  const lowerQuery = query.toLowerCase();
  return otInterventionsData.filter(
    (int) =>
      int.name.toLowerCase().includes(lowerQuery) ||
      int.abbreviation.toLowerCase().includes(lowerQuery) ||
      int.description.toLowerCase().includes(lowerQuery),
  );
}

/**
 * Get all OT interventions
 */
export function getAllOTInterventions(): OTIntervention[] {
  return otInterventionsData;
}

/**
 * Get OT intervention categories
 */
export function getOTInterventionCategories(): string[] {
  return Array.from(new Set(otInterventionsData.map((int) => int.category)));
}

/**
 * Get OT interventions for indication
 */
export function getOTInterventionsForIndication(
  indication: string,
): OTIntervention[] {
  return otInterventionsData.filter((int) =>
    int.indications.some((ind) =>
      ind.toLowerCase().includes(indication.toLowerCase()),
    ),
  );
}

/**
 * OT Module 11: Advanced Techniques
 * Advanced occupational therapy techniques and specialized interventions
 * Evidence-based from AOTA and clinical best practices
 */

export interface OTAdvancedTechnique {
  id: string;
  name: string;
  abbreviation: string;
  category: string;
  description: string;
  indications: string[];
  contraindications: string[];
  precautions: string[];
  procedures: string[];
  expectedOutcomes: string[];
  evidenceLevel: number;
  source: string;
  citation: string;
  lastUpdated: Date;
}

const otAdvancedTechniquesData: OTAdvancedTechnique[] = [
  {
    id: "ot-at-001",
    name: "Constraint-Induced Movement Therapy",
    abbreviation: "CIMT",
    category: "constraint-induced-therapy",
    description:
      "Intensive therapy with constraint of unaffected limb to promote use of affected limb",
    indications: [
      "Stroke",
      "Neurological disorder",
      "Upper extremity weakness",
      "Motor control deficit",
    ],
    contraindications: [
      "Severe cognitive impairment",
      "Severe behavioral issues",
      "Severe pain",
    ],
    precautions: [
      "Monitor fatigue",
      "Proper constraint application",
      "Safety monitoring",
    ],
    procedures: [
      "Baseline assessment",
      "Constraint application",
      "Intensive practice",
      "Task-specific training",
      "Functional activities",
      "Progress monitoring",
    ],
    expectedOutcomes: [
      "Improved upper extremity function",
      "Increased use of affected limb",
      "Better motor control",
      "Functional improvement",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2023). Constraint-Induced Movement Therapy Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-at-002",
    name: "Sensory Integration Therapy",
    abbreviation: "SIT",
    category: "sensory-integration",
    description:
      "Therapeutic approach using sensory input to improve sensorimotor integration and function",
    indications: [
      "Sensory processing disorder",
      "Autism spectrum disorder",
      "Developmental delay",
      "Sensory dysfunction",
    ],
    contraindications: [
      "Severe anxiety",
      "Severe behavioral issues",
      "Severe vestibular dysfunction",
    ],
    precautions: [
      "Monitor sensory tolerance",
      "Gradual progression",
      "Safety monitoring",
    ],
    procedures: [
      "Sensory assessment",
      "Sensory profile development",
      "Activity selection",
      "Sensory input provision",
      "Response monitoring",
      "Adaptation planning",
    ],
    expectedOutcomes: [
      "Improved sensory processing",
      "Better motor planning",
      "Increased functional skills",
      "Improved behavior",
    ],
    evidenceLevel: 2,
    source: "AOTA",
    citation: "AOTA (2023). Sensory Integration Therapy Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-at-003",
    name: "Cognitive Rehabilitation",
    abbreviation: "CR",
    category: "cognitive-rehabilitation",
    description:
      "Systematic intervention to improve cognitive function and compensatory strategies",
    indications: [
      "Cognitive impairment",
      "Traumatic brain injury",
      "Dementia",
      "Attention deficit",
    ],
    contraindications: [
      "Severe behavioral crisis",
      "Severe agitation",
      "Severe confusion",
    ],
    precautions: [
      "Monitor cognitive load",
      "Appropriate pacing",
      "Realistic expectations",
    ],
    procedures: [
      "Cognitive assessment",
      "Deficit identification",
      "Strategy development",
      "Systematic practice",
      "Generalization activities",
      "Progress monitoring",
    ],
    expectedOutcomes: [
      "Improved cognitive function",
      "Better compensatory strategies",
      "Increased independence",
      "Improved quality of life",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2023). Cognitive Rehabilitation Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-at-004",
    name: "Adaptive Equipment and Technology",
    abbreviation: "AET",
    category: "adaptive-technology",
    description:
      "Selection and training in adaptive equipment and assistive technology for independence",
    indications: [
      "Functional limitation",
      "Disability",
      "Mobility restriction",
      "Independence concern",
    ],
    contraindications: [
      "Severe cognitive impairment",
      "Severe behavioral issues",
      "Technology rejection",
    ],
    precautions: ["Proper fitting", "Safety training", "Maintenance education"],
    procedures: [
      "Needs assessment",
      "Equipment evaluation",
      "Selection and ordering",
      "Fitting and adjustment",
      "Training provision",
      "Follow-up monitoring",
    ],
    expectedOutcomes: [
      "Improved independence",
      "Better function",
      "Increased safety",
      "Enhanced quality of life",
    ],
    evidenceLevel: 2,
    source: "AOTA",
    citation: "AOTA (2023). Adaptive Equipment and Technology Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-at-005",
    name: "Vocational Rehabilitation",
    abbreviation: "VR",
    category: "vocational-rehabilitation",
    description:
      "Comprehensive intervention to support return to work and vocational goals",
    indications: [
      "Work limitation",
      "Return to work need",
      "Vocational goal",
      "Job placement",
    ],
    contraindications: [
      "Acute medical instability",
      "Severe behavioral issues",
      "Severe cognitive impairment",
    ],
    precautions: [
      "Realistic expectations",
      "Employer coordination",
      "Safety monitoring",
    ],
    procedures: [
      "Work capacity evaluation",
      "Job analysis",
      "Skills assessment",
      "Work simulation",
      "Job coaching",
      "Employer coordination",
    ],
    expectedOutcomes: [
      "Successful return to work",
      "Job placement",
      "Maintained employment",
      "Improved quality of life",
    ],
    evidenceLevel: 2,
    source: "AOTA",
    citation: "AOTA (2023). Vocational Rehabilitation Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-at-006",
    name: "Home Modification and Safety",
    abbreviation: "HMS",
    category: "home-modification",
    description:
      "Assessment and modification of home environment for safety and accessibility",
    indications: [
      "Fall risk",
      "Mobility limitation",
      "Safety concern",
      "Accessibility need",
    ],
    contraindications: [
      "Severe behavioral issues",
      "Severe cognitive impairment",
      "Landlord restriction",
    ],
    precautions: [
      "Budget consideration",
      "Feasibility assessment",
      "Maintenance planning",
    ],
    procedures: [
      "Home assessment",
      "Safety evaluation",
      "Modification planning",
      "Contractor coordination",
      "Installation oversight",
      "Follow-up assessment",
    ],
    expectedOutcomes: [
      "Improved safety",
      "Better accessibility",
      "Reduced fall risk",
      "Increased independence",
    ],
    evidenceLevel: 2,
    source: "AOTA",
    citation: "AOTA (2023). Home Modification and Safety Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-at-007",
    name: "Mental Health and Wellness",
    abbreviation: "MHW",
    category: "mental-health-wellness",
    description:
      "Occupational therapy intervention for mental health and wellness promotion",
    indications: [
      "Mental health disorder",
      "Stress management",
      "Wellness goal",
      "Quality of life concern",
    ],
    contraindications: [
      "Acute psychiatric crisis",
      "Severe suicidality",
      "Acute psychosis",
    ],
    precautions: [
      "Mental health monitoring",
      "Crisis planning",
      "Medication awareness",
    ],
    procedures: [
      "Mental health assessment",
      "Occupational profile development",
      "Goal setting",
      "Wellness activities",
      "Coping strategies",
      "Progress monitoring",
    ],
    expectedOutcomes: [
      "Improved mental health",
      "Better coping skills",
      "Increased wellness",
      "Improved quality of life",
    ],
    evidenceLevel: 2,
    source: "AOTA",
    citation: "AOTA (2023). Mental Health and Wellness Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-at-008",
    name: "Community Integration and Participation",
    abbreviation: "CIP",
    category: "community-integration",
    description:
      "Intervention to support community participation and social integration",
    indications: [
      "Social isolation",
      "Community participation limitation",
      "Integration concern",
      "Quality of life goal",
    ],
    contraindications: [
      "Severe behavioral issues",
      "Severe anxiety",
      "Severe social phobia",
    ],
    precautions: [
      "Gradual exposure",
      "Support system involvement",
      "Realistic expectations",
    ],
    procedures: [
      "Community assessment",
      "Resource identification",
      "Goal development",
      "Community exploration",
      "Skill building",
      "Sustained participation",
    ],
    expectedOutcomes: [
      "Improved community participation",
      "Better social integration",
      "Increased independence",
      "Enhanced quality of life",
    ],
    evidenceLevel: 2,
    source: "AOTA",
    citation:
      "AOTA (2023). Community Integration and Participation Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-at-009",
    name: "Telehealth Occupational Therapy",
    abbreviation: "TOT",
    category: "telehealth-delivery",
    description:
      "Remote delivery of occupational therapy services using technology platforms",
    indications: [
      "Distance limitation",
      "Mobility restriction",
      "Convenience need",
      "Follow-up care",
    ],
    contraindications: [
      "Acute injury requiring hands-on care",
      "Severe cognitive impairment",
      "Technology limitation",
    ],
    precautions: [
      "Technology reliability",
      "Privacy and security",
      "Proper setup",
    ],
    procedures: [
      "Technology setup",
      "Assessment via video",
      "Activity instruction",
      "Real-time feedback",
      "Documentation",
      "Follow-up planning",
    ],
    expectedOutcomes: [
      "Improved access to care",
      "Maintained function",
      "Better compliance",
      "Cost reduction",
    ],
    evidenceLevel: 2,
    source: "AOTA",
    citation: "AOTA (2023). Telehealth Occupational Therapy Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-at-010",
    name: "Occupational Justice and Advocacy",
    abbreviation: "OJA",
    category: "occupational-justice",
    description:
      "Advocacy and intervention to promote occupational justice and equity",
    indications: [
      "Occupational deprivation",
      "Health disparity",
      "Social injustice",
      "Access limitation",
    ],
    contraindications: ["None specific"],
    precautions: [
      "Cultural sensitivity",
      "Systemic awareness",
      "Ethical practice",
    ],
    procedures: [
      "Needs assessment",
      "Barrier identification",
      "Advocacy planning",
      "Community engagement",
      "Resource development",
      "Outcome monitoring",
    ],
    expectedOutcomes: [
      "Improved occupational access",
      "Reduced health disparity",
      "Better equity",
      "Enhanced community health",
    ],
    evidenceLevel: 3,
    source: "AOTA",
    citation: "AOTA (2023). Occupational Justice and Advocacy Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
];

/**
 * Get OT advanced technique by ID
 */
export function getOTAdvancedTechniqueById(
  id: string,
): OTAdvancedTechnique | undefined {
  return otAdvancedTechniquesData.find((at) => at.id === id);
}

/**
 * Get OT advanced techniques by category
 */
export function getOTAdvancedTechniquesByCategory(
  category: string,
): OTAdvancedTechnique[] {
  return otAdvancedTechniquesData.filter((at) => at.category === category);
}

/**
 * Search OT advanced techniques
 */
export function searchOTAdvancedTechniques(
  query: string,
): OTAdvancedTechnique[] {
  const lowerQuery = query.toLowerCase();
  return otAdvancedTechniquesData.filter(
    (at) =>
      at.name.toLowerCase().includes(lowerQuery) ||
      at.abbreviation.toLowerCase().includes(lowerQuery) ||
      at.description.toLowerCase().includes(lowerQuery),
  );
}

/**
 * Get all OT advanced techniques
 */
export function getAllOTAdvancedTechniques(): OTAdvancedTechnique[] {
  return otAdvancedTechniquesData;
}

/**
 * Get OT advanced technique categories
 */
export function getOTAdvancedTechniqueCategories(): string[] {
  return Array.from(new Set(otAdvancedTechniquesData.map((at) => at.category)));
}

/**
 * Get OT advanced techniques for indication
 */
export function getOTAdvancedTechniquesForIndication(
  indication: string,
): OTAdvancedTechnique[] {
  return otAdvancedTechniquesData.filter((at) =>
    at.indications.some((ind) =>
      ind.toLowerCase().includes(indication.toLowerCase()),
    ),
  );
}

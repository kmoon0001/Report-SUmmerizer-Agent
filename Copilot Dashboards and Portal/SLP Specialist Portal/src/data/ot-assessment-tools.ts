/**
 * OT Module 3: Assessment Tools
 * Comprehensive assessment tools and protocols for occupational therapy
 * Evidence-based tools from AOTA and clinical best practices
 */

export interface OTAssessmentTool {
  id: string;
  name: string;
  abbreviation: string;
  category: string;
  description: string;
  domains: string[];
  administration: string;
  scoring: string;
  indications: string[];
  contraindications: string[];
  precautions: string[];
  evidenceLevel: number;
  source: string;
  citation: string;
  lastUpdated: Date;
}

const otAssessmentToolsData: OTAssessmentTool[] = [
  {
    id: "ot-at-001",
    name: "Activities of Daily Living Assessment",
    abbreviation: "ADL-A",
    category: "functional-assessment",
    description:
      "Comprehensive assessment of self-care and personal care activities",
    domains: [
      "Grooming",
      "Hygiene",
      "Dressing",
      "Toileting",
      "Feeding",
      "Bathing",
    ],
    administration: "Observation and interview",
    scoring: "Independence levels 0-7",
    indications: [
      "Functional limitation",
      "Disability assessment",
      "Rehabilitation planning",
    ],
    contraindications: [
      "Acute medical condition",
      "Severe pain",
      "Uncontrolled behavior",
    ],
    precautions: [
      "Safety monitoring",
      "Privacy considerations",
      "Dignity maintenance",
    ],
    evidenceLevel: 2,
    source: "AOTA Evidence-Based Practice",
    citation: "AOTA (2023). ADL Assessment Tool.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-at-002",
    name: "Instrumental Activities of Daily Living Assessment",
    abbreviation: "IADL-A",
    category: "functional-assessment",
    description:
      "Assessment of complex activities needed for independent living",
    domains: [
      "Meal preparation",
      "Medication management",
      "Money management",
      "Shopping",
      "Housekeeping",
      "Laundry",
      "Transportation",
    ],
    administration: "Observation and interview",
    scoring: "Independence levels 0-7",
    indications: [
      "Community living assessment",
      "Discharge planning",
      "Functional limitation",
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
    evidenceLevel: 2,
    source: "AOTA Evidence-Based Practice",
    citation: "AOTA (2023). IADL Assessment Tool.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-at-003",
    name: "Sensory Profile Assessment",
    abbreviation: "SPA",
    category: "sensory-assessment",
    description:
      "Comprehensive assessment of sensory processing and responsiveness",
    domains: [
      "Auditory",
      "Visual",
      "Vestibular",
      "Touch",
      "Taste",
      "Smell",
      "Proprioception",
    ],
    administration: "Questionnaire and observation",
    scoring: "Quadrant analysis",
    indications: [
      "Sensory processing disorder",
      "Autism spectrum disorder",
      "Developmental delay",
    ],
    contraindications: [
      "Acute sensory condition",
      "Severe pain",
      "Uncontrolled behavior",
    ],
    precautions: [
      "Sensory stimulation",
      "Environmental control",
      "Behavioral monitoring",
    ],
    evidenceLevel: 2,
    source: "AOTA Evidence-Based Practice",
    citation: "Dunn, W. (2023). Sensory Profile Manual.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-at-004",
    name: "Cognitive Assessment Tool",
    abbreviation: "CAT",
    category: "cognitive-assessment",
    description:
      "Assessment of cognitive function affecting occupational performance",
    domains: [
      "Attention",
      "Memory",
      "Executive function",
      "Problem-solving",
      "Judgment",
      "Safety awareness",
    ],
    administration: "Structured tasks and observation",
    scoring: "Criterion-referenced",
    indications: [
      "Cognitive impairment",
      "Neurological assessment",
      "Functional limitation",
    ],
    contraindications: [
      "Acute confusion",
      "Severe agitation",
      "Uncontrolled behavior",
    ],
    precautions: [
      "Cognitive demands",
      "Fatigue monitoring",
      "Frustration tolerance",
    ],
    evidenceLevel: 2,
    source: "AOTA Evidence-Based Practice",
    citation: "AOTA (2023). Cognitive Assessment Tool.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-at-005",
    name: "Psychosocial Assessment Tool",
    abbreviation: "PAT",
    category: "psychosocial-assessment",
    description:
      "Assessment of psychosocial factors affecting occupational performance",
    domains: [
      "Emotional regulation",
      "Social skills",
      "Coping strategies",
      "Motivation",
      "Self-esteem",
      "Stress management",
    ],
    administration: "Interview and observation",
    scoring: "Criterion-referenced",
    indications: [
      "Mental health condition",
      "Psychosocial adjustment",
      "Behavioral concern",
    ],
    contraindications: [
      "Acute psychiatric crisis",
      "Severe suicidality",
      "Acute psychosis",
    ],
    precautions: [
      "Therapeutic relationship",
      "Safety assessment",
      "Confidentiality",
    ],
    evidenceLevel: 2,
    source: "AOTA Evidence-Based Practice",
    citation: "AOTA (2023). Psychosocial Assessment Tool.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-at-006",
    name: "Work Capacity Evaluation",
    abbreviation: "WCE",
    category: "work-assessment",
    description: "Comprehensive assessment of work capacity and job readiness",
    domains: [
      "Physical capacity",
      "Cognitive capacity",
      "Psychosocial capacity",
      "Job-specific skills",
      "Safety awareness",
    ],
    administration: "Job simulation and standardized tasks",
    scoring: "Functional capacity levels",
    indications: [
      "Work-related injury",
      "Return to work assessment",
      "Job placement",
      "Disability determination",
    ],
    contraindications: ["Acute injury", "Severe pain", "Medical instability"],
    precautions: [
      "Job-specific demands",
      "Safety monitoring",
      "Pain management",
    ],
    evidenceLevel: 2,
    source: "AOTA Evidence-Based Practice",
    citation: "AOTA (2023). Work Capacity Evaluation.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-at-007",
    name: "Home Safety Assessment",
    abbreviation: "HSA",
    category: "environmental-assessment",
    description: "Assessment of home environment for safety and accessibility",
    domains: [
      "Fall hazards",
      "Accessibility",
      "Lighting",
      "Bathroom safety",
      "Kitchen safety",
      "Bedroom safety",
      "Stair safety",
    ],
    administration: "Home visit and observation",
    scoring: "Hazard identification and recommendations",
    indications: [
      "Fall risk",
      "Mobility limitation",
      "Discharge planning",
      "Aging in place",
    ],
    contraindications: [
      "Unsafe environment",
      "Hostile situation",
      "Trespassing concern",
    ],
    precautions: [
      "Personal safety",
      "Privacy respect",
      "Professional boundaries",
    ],
    evidenceLevel: 2,
    source: "AOTA Evidence-Based Practice",
    citation: "AOTA (2023). Home Safety Assessment.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-at-008",
    name: "Ergonomic Assessment Tool",
    abbreviation: "EAT",
    category: "work-assessment",
    description: "Assessment of workplace ergonomics and workstation setup",
    domains: [
      "Desk setup",
      "Chair height",
      "Monitor position",
      "Keyboard placement",
      "Lighting",
      "Posture",
      "Work habits",
    ],
    administration: "Workstation observation and measurement",
    scoring: "Ergonomic recommendations",
    indications: [
      "Work-related pain",
      "Repetitive strain injury",
      "Workstation modification",
      "Injury prevention",
    ],
    contraindications: ["Acute injury", "Severe pain", "Medical instability"],
    precautions: [
      "Workplace safety",
      "Employer coordination",
      "Employee education",
    ],
    evidenceLevel: 2,
    source: "AOTA Evidence-Based Practice",
    citation: "AOTA (2023). Ergonomic Assessment Tool.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-at-009",
    name: "Leisure and Recreation Assessment",
    abbreviation: "LRA",
    category: "leisure-assessment",
    description: "Assessment of leisure interests and participation",
    domains: [
      "Leisure interests",
      "Recreation participation",
      "Social engagement",
      "Hobby involvement",
      "Community participation",
    ],
    administration: "Interview and observation",
    scoring: "Participation levels and satisfaction",
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
    ],
    evidenceLevel: 2,
    source: "AOTA Evidence-Based Practice",
    citation: "AOTA (2023). Leisure Assessment Tool.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-at-010",
    name: "Occupational Performance Assessment",
    abbreviation: "OPA",
    category: "occupational-assessment",
    description:
      "Comprehensive assessment of occupational performance across life roles",
    domains: [
      "Self-care",
      "Productivity",
      "Leisure",
      "Social participation",
      "Work",
      "Education",
      "Family roles",
    ],
    administration: "Interview and observation",
    scoring: "Performance and satisfaction ratings",
    indications: [
      "Occupational limitation",
      "Role change",
      "Functional assessment",
      "Treatment planning",
    ],
    contraindications: [
      "Acute medical condition",
      "Severe cognitive impairment",
      "Uncontrolled behavior",
    ],
    precautions: [
      "Client-centered approach",
      "Cultural sensitivity",
      "Realistic goal-setting",
    ],
    evidenceLevel: 2,
    source: "AOTA Evidence-Based Practice",
    citation: "AOTA (2023). Occupational Performance Assessment.",
    lastUpdated: new Date("2024-01-15"),
  },
];

/**
 * Get OT assessment tool by ID
 */
export function getOTAssessmentToolById(
  id: string,
): OTAssessmentTool | undefined {
  return otAssessmentToolsData.find((at) => at.id === id);
}

/**
 * Get OT assessment tools by category
 */
export function getOTAssessmentToolsByCategory(
  category: string,
): OTAssessmentTool[] {
  return otAssessmentToolsData.filter((at) => at.category === category);
}

/**
 * Search OT assessment tools
 */
export function searchOTAssessmentTools(query: string): OTAssessmentTool[] {
  const lowerQuery = query.toLowerCase();
  return otAssessmentToolsData.filter(
    (at) =>
      at.name.toLowerCase().includes(lowerQuery) ||
      at.abbreviation.toLowerCase().includes(lowerQuery) ||
      at.description.toLowerCase().includes(lowerQuery),
  );
}

/**
 * Get all OT assessment tools
 */
export function getAllOTAssessmentTools(): OTAssessmentTool[] {
  return otAssessmentToolsData;
}

/**
 * Get OT assessment tool categories
 */
export function getOTAssessmentToolCategories(): string[] {
  return Array.from(new Set(otAssessmentToolsData.map((at) => at.category)));
}

/**
 * Get OT assessment tools for indication
 */
export function getOTAssessmentToolsForIndication(
  indication: string,
): OTAssessmentTool[] {
  return otAssessmentToolsData.filter((at) =>
    at.indications.some((ind) =>
      ind.toLowerCase().includes(indication.toLowerCase()),
    ),
  );
}

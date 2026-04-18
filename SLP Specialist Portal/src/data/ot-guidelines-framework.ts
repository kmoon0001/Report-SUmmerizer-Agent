/**
 * OT Evidence-Based Guidelines - Framework & Standards
 * AOTA Practice Framework and Standards of Practice
 */



export interface OTFrameworkGuideline {
  id: string;
  name: string;
  category: string;
  description: string;
  keyElements: string[];
  principles: string[];
  standards: string[];
  evidenceLevel: 1 | 2 | 3;
  source: string;
  citation: string;
  lastUpdated: Date;
}

const guidelines: OTFrameworkGuideline[] = [
  {
    id: "gl-ot-061",
    name: "AOTA Practice Framework (OTPF-4)",
    category: "Framework",
    description:
      "Occupational Therapy Practice Framework: Domain and Process (4th Edition)",
    keyElements: [
      "Occupations",
      "Client factors",
      "Performance skills",
      "Performance patterns",
      "Context and environment",
    ],
    principles: [
      "Client-centered practice",
      "Holistic approach",
      "Occupation-focused",
    ],
    standards: [
      "Assessment of occupational performance",
      "Intervention planning",
      "Outcome measurement",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation:
      "AOTA (2020). Occupational Therapy Practice Framework: Domain and Process (4th ed.).",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-ot-062",
    name: "AOTA Standards of Practice",
    category: "Standards",
    description:
      "Minimum standards for the delivery of occupational therapy services",
    keyElements: [
      "Professional standing",
      "Screening/Evaluation",
      "Intervention",
      "Outcomes",
    ],
    principles: ["Competence", "Professional ethics", "Safety"],
    standards: [
      "Adherence to state/federal laws",
      "Continuous professional development",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Standards of Practice for Occupational Therapy.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-ot-063",
    name: "AOTA Code of Ethics",
    category: "Ethics",
    description:
      "Ethical principles and standards guiding professional conduct",
    keyElements: [
      "Beneficence",
      "Nonmaleficence",
      "Autonomy",
      "Justice",
      "Veracity",
      "Fidelity",
    ],
    principles: [
      "Professional integrity",
      "Respect for persons",
      "Accountability",
    ],
    standards: ["Conflict resolution", "Professional boundaries"],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Occupational Therapy Code of Ethics.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-ot-064",
    name: "AOTA Scope of Practice",
    category: "Standards",
    description:
      "Definition and scope of occupational therapy services and practitioner qualifications",
    keyElements: [
      "Domain of OT",
      "Process of OT",
      "Educational requirements",
      "Site-specific practice",
    ],
    principles: ["Professional identity", "Interdisciplinary collaboration"],
    standards: [
      "Practitioner competence",
      "Defining roles in clinical practice",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2021). Scope of Practice for Occupational Therapy.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-ot-065",
    name: "AOTA Documentation Guidelines",
    category: "Standards",
    description:
      "Best practices and requirements for clinical documentation in OT",
    keyElements: [
      "Reason for referral",
      "Summary of evaluation",
      "Goals (SMART)",
      "Discharge summary",
    ],
    principles: [
      "Accurate representation",
      "Timeliness",
      "Clinical reasoning visibility",
    ],
    standards: ["HIPAA compliance", "Use of standardized abbreviations"],
    evidenceLevel: 1,
    source: "AOTA",
    citation:
      "AOTA (2018). Guidelines for Documentation of Occupational Therapy.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-ot-066",
    name: "AOTA Supervision Guidelines",
    category: "Standards",
    description: "Standards for supervision of OT personnel and students",
    keyElements: [
      "Direct supervision",
      "Indirect supervision",
      "OTA roles",
      "Aide responsibilities",
    ],
    principles: [
      "Safe delivery of service",
      "Professional growth",
      "Compliance with state laws",
    ],
    standards: [
      "Developing a supervision plan",
      "Evidence of supervision frequency",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation:
      "AOTA (2020). Guidelines for Supervision, Roles, and Responsibilities.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-ot-067",
    name: "AOTA Continuing Competence",
    category: "Standards",
    description:
      "Requirements for maintaining professional proficiency and skill set",
    keyElements: [
      "Professional development plan",
      "Lifelong learning",
      "Competency assessment",
    ],
    principles: ["Quality care maintenance", "Advancing knowledge"],
    standards: ["Ethics in continuing education", "Self-reflective practice"],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2015). Advisory Opinion on Continuing Competence.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-ot-068",
    name: "AOTA Occupational Therapy Assistant (OTA) Role",
    category: "Standards",
    description: "Defining the partnership and collaborative role of the OTA",
    keyElements: [
      "Service competency",
      "Joint intervention planning",
      "Contribution to evaluation",
    ],
    principles: ["Collaborative relationship", "Role clarification"],
    standards: ["OTA scope limits", "Mentorship and guidance"],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Roles and Responsibilities of the OTA.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-ot-069",
    name: "AOTA Specialized Knowledge and Skills",
    category: "Standards",
    description:
      "Guidance on attaining advanced or specialty certifications in OT",
    keyElements: [
      "Board certification",
      "Specialty certification",
      "Advanced practice credentials",
    ],
    principles: ["Knowledge translation", "Expertise in specific populations"],
    standards: [
      "Maintaining specialty credentials",
      "Ethical marketing of expertise",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation:
      "AOTA (2019). Standards for Continuing Competence in OT Specialty Areas.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "gl-ot-070",
    name: "Cultural Humility and Equity in OT",
    category: "Ethics",
    description:
      "Standard for ensuring equitable and culturally responsive OT services",
    keyElements: [
      "Implicit bias awareness",
      "Culturally sensitive assessment",
      "Equitable access to occupations",
    ],
    principles: [
      "Social justice",
      "Respect for diversity",
      "Occupational equity",
    ],
    standards: [
      "Inclusive practice environment",
      "Addressing health disparities",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2021). Ethics and Cultural Humility in Practice.",
    lastUpdated: new Date("2024-03-21"),
  },
];

export function getAllOTFrameworkGuidelines(): OTFrameworkGuideline[] {
  return [...guidelines];
}

export function getOTFrameworkGuidelineById(
  id: string,
): OTFrameworkGuideline | undefined {
  return guidelines.find((g) => g.id === id);
}

export function searchOTFrameworkGuidelines(
  query: string,
): OTFrameworkGuideline[] {
  if (!query) return [];
  const lowerQuery = query.toLowerCase();
  return guidelines.filter(
    (g) =>
      g.name.toLowerCase().includes(lowerQuery) ||
      g.category.toLowerCase().includes(lowerQuery) ||
      g.description.toLowerCase().includes(lowerQuery),
  );
}

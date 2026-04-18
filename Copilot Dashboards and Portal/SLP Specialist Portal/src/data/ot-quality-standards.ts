/**
 * OT Module 10: Quality Standards and Best Practices
 * Comprehensive quality standards and best practices for occupational therapy
 * Evidence-based from AOTA and regulatory guidelines
 */

export interface OTQualityStandard {
  id: string;
  name: string;
  category: string;
  description: string;
  standards: string[];
  implementation: string[];
  measurement: string[];
  benchmarks: string[];
  source: string;
  citation: string;
  lastUpdated: Date;
}

const otQualityStandardsData: OTQualityStandard[] = [
  {
    id: "ot-qs-001",
    name: "Client-Centered Practice",
    category: "practice-standards",
    description: "Standards for client-centered occupational therapy practice",
    standards: [
      "Respect client values and preferences",
      "Involve clients in goal-setting",
      "Incorporate client priorities",
      "Adapt interventions to client needs",
      "Measure client satisfaction",
    ],
    implementation: [
      "Conduct thorough client interviews",
      "Document client goals and preferences",
      "Involve clients in treatment planning",
      "Regularly review client satisfaction",
      "Adjust interventions based on feedback",
    ],
    measurement: [
      "Client satisfaction surveys",
      "Goal attainment scaling",
      "Client feedback documentation",
      "Outcome measurement",
      "Progress toward client goals",
    ],
    benchmarks: [
      "90% client satisfaction",
      "80% goal attainment",
      "Regular client feedback",
      "Documented client preferences",
      "Individualized interventions",
    ],
    source: "AOTA Standards of Practice",
    citation: "AOTA (2023). Client-Centered Practice Standards.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-qs-002",
    name: "Evidence-Based Practice",
    category: "practice-standards",
    description: "Standards for evidence-based occupational therapy practice",
    standards: [
      "Use current research evidence",
      "Apply best practices",
      "Document evidence basis",
      "Evaluate intervention effectiveness",
      "Contribute to evidence base",
    ],
    implementation: [
      "Review current literature",
      "Select evidence-based interventions",
      "Document evidence citations",
      "Measure intervention outcomes",
      "Participate in research",
    ],
    measurement: [
      "Evidence-based intervention selection",
      "Outcome measurement",
      "Literature review documentation",
      "Research participation",
      "Intervention effectiveness",
    ],
    benchmarks: [
      "100% evidence-based interventions",
      "Current literature review",
      "Documented evidence basis",
      "Measurable outcomes",
      "Continuous improvement",
    ],
    source: "AOTA Standards of Practice",
    citation: "AOTA (2023). Evidence-Based Practice Standards.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-qs-003",
    name: "Outcome Measurement",
    category: "measurement-standards",
    description: "Standards for measuring occupational therapy outcomes",
    standards: [
      "Use standardized outcome measures",
      "Measure functional improvement",
      "Track client progress",
      "Document outcomes",
      "Report results",
    ],
    implementation: [
      "Select appropriate outcome measures",
      "Administer measures consistently",
      "Document baseline and progress",
      "Calculate outcome statistics",
      "Report outcomes to stakeholders",
    ],
    measurement: [
      "Standardized outcome measures",
      "Functional improvement scores",
      "Progress documentation",
      "Outcome statistics",
      "Client satisfaction",
    ],
    benchmarks: [
      "100% outcome measurement",
      "Baseline and discharge measures",
      "Documented progress",
      "Positive functional outcomes",
      "Client goal achievement",
    ],
    source: "AOTA Standards of Practice",
    citation: "AOTA (2023). Outcome Measurement Standards.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-qs-004",
    name: "Professional Competence",
    category: "professional-standards",
    description:
      "Standards for professional competence and continuing education",
    standards: [
      "Maintain current knowledge",
      "Develop professional skills",
      "Pursue continuing education",
      "Seek supervision and consultation",
      "Engage in professional development",
    ],
    implementation: [
      "Complete required CE hours",
      "Attend professional conferences",
      "Participate in professional organizations",
      "Seek mentorship",
      "Document professional development",
    ],
    measurement: [
      "CE hour completion",
      "Professional certifications",
      "Continuing education documentation",
      "Professional involvement",
      "Competency assessments",
    ],
    benchmarks: [
      "Annual CE requirements met",
      "Current professional certifications",
      "Active professional involvement",
      "Regular competency assessment",
      "Documented professional development",
    ],
    source: "AOTA Standards of Practice",
    citation: "AOTA (2023). Professional Competence Standards.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-qs-005",
    name: "Ethical Practice",
    category: "ethical-standards",
    description: "Standards for ethical occupational therapy practice",
    standards: [
      "Maintain professional integrity",
      "Respect client autonomy",
      "Ensure confidentiality",
      "Avoid conflicts of interest",
      "Practice within scope",
    ],
    implementation: [
      "Follow AOTA Code of Ethics",
      "Maintain client confidentiality",
      "Disclose conflicts of interest",
      "Practice within competence",
      "Document ethical decisions",
    ],
    measurement: [
      "Ethics training completion",
      "Confidentiality compliance",
      "Scope of practice adherence",
      "Ethical decision documentation",
      "Complaint resolution",
    ],
    benchmarks: [
      "100% ethics training",
      "Zero confidentiality breaches",
      "Scope of practice compliance",
      "Ethical decision documentation",
      "Zero ethics violations",
    ],
    source: "AOTA Code of Ethics",
    citation: "AOTA (2023). Ethical Practice Standards.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-qs-006",
    name: "Documentation Quality",
    category: "documentation-standards",
    description: "Standards for quality occupational therapy documentation",
    standards: [
      "Document timely and accurately",
      "Include required elements",
      "Maintain legibility",
      "Ensure confidentiality",
      "Support billing and outcomes",
    ],
    implementation: [
      "Use standardized documentation forms",
      "Document within 24 hours",
      "Include all required elements",
      "Use clear, professional language",
      "Maintain secure records",
    ],
    measurement: [
      "Documentation timeliness",
      "Completeness audit",
      "Legibility assessment",
      "Confidentiality compliance",
      "Billing accuracy",
    ],
    benchmarks: [
      "100% timely documentation",
      "100% complete documentation",
      "100% legible documentation",
      "100% confidentiality compliance",
      "100% billing accuracy",
    ],
    source: "AOTA Standards of Practice",
    citation: "AOTA (2023). Documentation Quality Standards.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-qs-007",
    name: "Safety and Risk Management",
    category: "safety-standards",
    description:
      "Standards for safety and risk management in occupational therapy",
    standards: [
      "Identify and manage risks",
      "Implement safety protocols",
      "Prevent adverse events",
      "Report incidents",
      "Maintain safe environment",
    ],
    implementation: [
      "Conduct risk assessments",
      "Implement safety measures",
      "Train staff on safety",
      "Report incidents promptly",
      "Maintain safe facilities",
    ],
    measurement: [
      "Risk assessment completion",
      "Safety protocol compliance",
      "Incident reporting",
      "Safety training completion",
      "Adverse event tracking",
    ],
    benchmarks: [
      "100% risk assessment",
      "100% safety protocol compliance",
      "Zero preventable incidents",
      "100% incident reporting",
      "Continuous safety improvement",
    ],
    source: "AOTA Standards of Practice",
    citation: "AOTA (2023). Safety and Risk Management Standards.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-qs-008",
    name: "Cultural Competence",
    category: "cultural-standards",
    description: "Standards for cultural competence in occupational therapy",
    standards: [
      "Respect cultural diversity",
      "Adapt interventions culturally",
      "Avoid stereotyping",
      "Seek cultural knowledge",
      "Provide culturally appropriate care",
    ],
    implementation: [
      "Conduct cultural assessments",
      "Adapt interventions culturally",
      "Seek cultural consultation",
      "Provide culturally appropriate materials",
      "Document cultural considerations",
    ],
    measurement: [
      "Cultural competence training",
      "Cultural adaptation documentation",
      "Client satisfaction by culture",
      "Cultural consultation usage",
      "Culturally appropriate outcomes",
    ],
    benchmarks: [
      "Annual cultural competence training",
      "Culturally adapted interventions",
      "High client satisfaction across cultures",
      "Regular cultural consultation",
      "Culturally appropriate outcomes",
    ],
    source: "AOTA Standards of Practice",
    citation: "AOTA (2023). Cultural Competence Standards.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-qs-009",
    name: "Collaboration and Communication",
    category: "collaboration-standards",
    description:
      "Standards for collaboration and communication in occupational therapy",
    standards: [
      "Collaborate with team members",
      "Communicate effectively",
      "Share information appropriately",
      "Coordinate care",
      "Involve stakeholders",
    ],
    implementation: [
      "Participate in team meetings",
      "Document communication",
      "Share progress with team",
      "Coordinate with other providers",
      "Involve clients and families",
    ],
    measurement: [
      "Team meeting participation",
      "Communication documentation",
      "Care coordination effectiveness",
      "Stakeholder involvement",
      "Collaborative outcome achievement",
    ],
    benchmarks: [
      "100% team meeting participation",
      "Regular communication documentation",
      "Effective care coordination",
      "High stakeholder involvement",
      "Collaborative goal achievement",
    ],
    source: "AOTA Standards of Practice",
    citation: "AOTA (2023). Collaboration and Communication Standards.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-qs-010",
    name: "Continuous Quality Improvement",
    category: "quality-improvement",
    description:
      "Standards for continuous quality improvement in occupational therapy",
    standards: [
      "Monitor quality metrics",
      "Identify improvement opportunities",
      "Implement improvements",
      "Evaluate effectiveness",
      "Sustain improvements",
    ],
    implementation: [
      "Collect quality data",
      "Analyze performance metrics",
      "Develop improvement plans",
      "Implement changes",
      "Monitor improvement effectiveness",
    ],
    measurement: [
      "Quality metric tracking",
      "Performance analysis",
      "Improvement plan documentation",
      "Change implementation",
      "Outcome improvement",
    ],
    benchmarks: [
      "Monthly quality review",
      "Identified improvement opportunities",
      "Implemented improvements",
      "Measured improvement outcomes",
      "Sustained quality improvements",
    ],
    source: "AOTA Standards of Practice",
    citation: "AOTA (2023). Continuous Quality Improvement Standards.",
    lastUpdated: new Date("2024-01-15"),
  },
];

/**
 * Get OT quality standard by ID
 */
export function getOTQualityStandardById(
  id: string,
): OTQualityStandard | undefined {
  return otQualityStandardsData.find((qs) => qs.id === id);
}

/**
 * Get OT quality standards by category
 */
export function getOTQualityStandardsByCategory(
  category: string,
): OTQualityStandard[] {
  return otQualityStandardsData.filter((qs) => qs.category === category);
}

/**
 * Search OT quality standards
 */
export function searchOTQualityStandards(query: string): OTQualityStandard[] {
  const lowerQuery = query.toLowerCase();
  return otQualityStandardsData.filter(
    (qs) =>
      qs.name.toLowerCase().includes(lowerQuery) ||
      qs.description.toLowerCase().includes(lowerQuery),
  );
}

/**
 * Get all OT quality standards
 */
export function getAllOTQualityStandards(): OTQualityStandard[] {
  return otQualityStandardsData;
}

/**
 * Get OT quality standard categories
 */
export function getOTQualityStandardCategories(): string[] {
  return Array.from(new Set(otQualityStandardsData.map((qs) => qs.category)));
}

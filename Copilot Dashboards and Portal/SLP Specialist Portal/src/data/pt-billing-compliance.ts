/**
 * PT Module 10: Billing & Compliance
 * Comprehensive billing codes, compliance standards, and regulatory requirements for PT
 * Evidence-based from CMS, APTA, and regulatory guidelines
 */

export interface PTBillingCode {
  code: string;
  description: string;
  category: string;
  unitValue: number;
  timeRequired: string;
  indications: string[];
  documentation: string[];
  complianceNotes: string[];
}

export interface PTComplianceStandard {
  id: string;
  name: string;
  category: string;
  description: string;
  requirements: string[];
  documentation: string[];
  penalties: string[];
  source: string;
  citation: string;
  lastUpdated: Date;
}

const ptBillingCodesData: PTBillingCode[] = [
  {
    code: "97161",
    description: "PT Evaluation - Low Complexity",
    category: "evaluation",
    unitValue: 1,
    timeRequired: "20-30 minutes",
    indications: [
      "Simple musculoskeletal condition",
      "Straightforward history",
      "Limited comorbidities",
    ],
    documentation: [
      "History and systems review",
      "Baseline measurements",
      "Treatment plan",
    ],
    complianceNotes: [
      "Must document complexity level",
      "Include functional limitations",
      "Establish baseline",
    ],
  },
  {
    code: "97162",
    description: "PT Evaluation - Moderate Complexity",
    category: "evaluation",
    unitValue: 1,
    timeRequired: "30-45 minutes",
    indications: [
      "Moderate musculoskeletal condition",
      "Multiple systems involved",
      "Some comorbidities",
    ],
    documentation: [
      "Comprehensive history",
      "Multiple measurements",
      "Detailed treatment plan",
    ],
    complianceNotes: [
      "Document complexity justification",
      "Multiple body areas",
      "Comorbidity impact",
    ],
  },
  {
    code: "97163",
    description: "PT Evaluation - High Complexity",
    category: "evaluation",
    unitValue: 1,
    timeRequired: "45-60 minutes",
    indications: [
      "Complex condition",
      "Multiple systems",
      "Significant comorbidities",
    ],
    documentation: [
      "Detailed history",
      "Comprehensive measurements",
      "Complex treatment plan",
    ],
    complianceNotes: [
      "Justify high complexity",
      "Multiple comorbidities documented",
      "Complex interventions",
    ],
  },
  {
    code: "97164",
    description: "PT Re-evaluation",
    category: "evaluation",
    unitValue: 1,
    timeRequired: "20-30 minutes",
    indications: [
      "Significant change in status",
      "New problem area",
      "Treatment modification needed",
    ],
    documentation: [
      "Current status assessment",
      "Progress measurements",
      "Updated treatment plan",
    ],
    complianceNotes: [
      "Document reason for re-evaluation",
      "Compare to baseline",
      "Justify frequency",
    ],
  },
  {
    code: "97165",
    description: "PT Evaluation - Low Complexity (Established Patient)",
    category: "evaluation",
    unitValue: 1,
    timeRequired: "15-20 minutes",
    indications: [
      "Follow-up evaluation",
      "Established patient",
      "Simple condition",
    ],
    documentation: [
      "Status update",
      "Progress measurements",
      "Plan modification",
    ],
    complianceNotes: [
      "Document established patient status",
      "Reference prior evaluation",
      "Show progress",
    ],
  },
  {
    code: "97166",
    description: "PT Evaluation - Moderate Complexity (Established Patient)",
    category: "evaluation",
    unitValue: 1,
    timeRequired: "20-30 minutes",
    indications: [
      "Follow-up evaluation",
      "Established patient",
      "Moderate complexity",
    ],
    documentation: [
      "Comprehensive status update",
      "Multiple measurements",
      "Plan modification",
    ],
    complianceNotes: [
      "Document established patient status",
      "Justify complexity",
      "Show progress",
    ],
  },
  {
    code: "97167",
    description: "PT Evaluation - High Complexity (Established Patient)",
    category: "evaluation",
    unitValue: 1,
    timeRequired: "30-45 minutes",
    indications: [
      "Follow-up evaluation",
      "Established patient",
      "High complexity",
    ],
    documentation: [
      "Detailed status update",
      "Comprehensive measurements",
      "Complex plan modification",
    ],
    complianceNotes: [
      "Document established patient status",
      "Justify high complexity",
      "Show progress",
    ],
  },
  {
    code: "97168",
    description: "PT Treatment - Manual Therapy",
    category: "treatment",
    unitValue: 1,
    timeRequired: "15 minutes",
    indications: [
      "Joint mobilization",
      "Soft tissue mobilization",
      "Manual techniques",
    ],
    documentation: ["Technique used", "Body area treated", "Patient response"],
    complianceNotes: [
      "Document specific technique",
      "Justify medical necessity",
      "Show functional improvement",
    ],
  },
  {
    code: "97169",
    description: "PT Treatment - Therapeutic Exercises",
    category: "treatment",
    unitValue: 1,
    timeRequired: "15 minutes",
    indications: ["Strengthening", "Flexibility", "Functional training"],
    documentation: ["Exercise type", "Sets and reps", "Patient tolerance"],
    complianceNotes: [
      "Document exercise specificity",
      "Show progression",
      "Justify frequency",
    ],
  },
  {
    code: "97170",
    description: "PT Treatment - Neuromuscular Re-education",
    category: "treatment",
    unitValue: 1,
    timeRequired: "15 minutes",
    indications: ["Gait training", "Balance training", "Coordination training"],
    documentation: ["Training focus", "Techniques used", "Progress noted"],
    complianceNotes: [
      "Document neurological basis",
      "Show functional improvement",
      "Justify frequency",
    ],
  },
];

const ptComplianceStandardsData: PTComplianceStandard[] = [
  {
    id: "pt-comp-001",
    name: "Documentation Standards",
    category: "documentation",
    description:
      "Requirements for PT clinical documentation and medical records",
    requirements: [
      "Initial evaluation within 48 hours of referral",
      "Treatment notes for each visit",
      "Re-evaluation at appropriate intervals",
      "Discharge summary with outcomes",
      "Legible and timely documentation",
    ],
    documentation: [
      "Patient demographics",
      "Diagnosis and precautions",
      "Functional limitations",
      "Treatment provided",
      "Patient response and progress",
    ],
    penalties: [
      "Claim denial",
      "Audit findings",
      "Compliance violations",
      "Potential fraud investigation",
    ],
    source: "CMS Documentation Guidelines",
    citation:
      "Centers for Medicare & Medicaid Services (2023). PT Documentation Requirements.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-comp-002",
    name: "Medical Necessity",
    category: "billing",
    description:
      "Requirements for establishing and documenting medical necessity for PT services",
    requirements: [
      "Diagnosis supports PT intervention",
      "Functional limitations documented",
      "Treatment plan addresses limitations",
      "Measurable goals established",
      "Progress toward goals demonstrated",
    ],
    documentation: [
      "Physician referral",
      "Baseline functional status",
      "Specific treatment goals",
      "Progress measurements",
      "Justification for continued care",
    ],
    penalties: [
      "Claim denial",
      "Refund of payments",
      "Compliance audit",
      "Potential fraud charges",
    ],
    source: "CMS Medical Necessity Guidelines",
    citation:
      "Centers for Medicare & Medicaid Services (2023). Medical Necessity Requirements.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-comp-003",
    name: "Supervision Requirements",
    category: "staffing",
    description: "Requirements for PT supervision of support personnel",
    requirements: [
      "PT must supervise PTAs",
      "Direct supervision for initial evaluation",
      "General supervision for treatment",
      "Regular communication required",
      "PT responsible for plan of care",
    ],
    documentation: [
      "Supervision logs",
      "Communication records",
      "PT oversight documentation",
      "Plan of care updates",
      "Competency assessments",
    ],
    penalties: [
      "Claim denial",
      "Licensing violations",
      "Compliance audit",
      "Potential disciplinary action",
    ],
    source: "State PT Licensing Boards",
    citation:
      "State Physical Therapy Practice Acts (2023). Supervision Requirements.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-comp-004",
    name: "Billing Compliance",
    category: "billing",
    description: "Requirements for accurate and compliant PT billing practices",
    requirements: [
      "Accurate code selection",
      "Appropriate time documentation",
      "Correct modifier usage",
      "Timely claim submission",
      "Accurate patient information",
    ],
    documentation: [
      "Time tracking records",
      "Service documentation",
      "Modifier justification",
      "Claim submission records",
      "Denial tracking",
    ],
    penalties: [
      "Claim denial",
      "Refund of overpayments",
      "Compliance audit",
      "Potential fraud investigation",
    ],
    source: "CMS Billing Guidelines",
    citation:
      "Centers for Medicare & Medicaid Services (2023). PT Billing Compliance.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-comp-005",
    name: "Patient Privacy and Confidentiality",
    category: "privacy",
    description:
      "HIPAA requirements for patient privacy and confidential information protection",
    requirements: [
      "Secure patient records",
      "Limited access to information",
      "Patient consent for disclosure",
      "Breach notification procedures",
      "Privacy policy communication",
    ],
    documentation: [
      "Privacy notices",
      "Consent forms",
      "Access logs",
      "Breach reports",
      "Training records",
    ],
    penalties: [
      "HIPAA violations",
      "Civil penalties",
      "Criminal charges",
      "Loss of license",
    ],
    source: "HIPAA Privacy Rule",
    citation:
      "U.S. Department of Health and Human Services (2023). HIPAA Privacy Requirements.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-comp-006",
    name: "Infection Control",
    category: "safety",
    description:
      "Requirements for infection control and prevention in PT settings",
    requirements: [
      "Hand hygiene protocols",
      "Equipment disinfection",
      "Personal protective equipment",
      "Exposure control plan",
      "Staff training and vaccination",
    ],
    documentation: [
      "Infection control policy",
      "Training records",
      "Vaccination records",
      "Disinfection logs",
      "Incident reports",
    ],
    penalties: [
      "OSHA violations",
      "Fines and citations",
      "Facility closure",
      "Loss of accreditation",
    ],
    source: "OSHA Bloodborne Pathogens Standard",
    citation:
      "Occupational Safety and Health Administration (2023). Infection Control Requirements.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-comp-007",
    name: "Informed Consent",
    category: "patient-rights",
    description: "Requirements for obtaining and documenting informed consent",
    requirements: [
      "Explain treatment plan",
      "Discuss risks and benefits",
      "Discuss alternatives",
      "Obtain written consent",
      "Document consent process",
    ],
    documentation: [
      "Consent forms",
      "Treatment plan explanation",
      "Risk/benefit discussion",
      "Patient questions documented",
      "Signature and date",
    ],
    penalties: [
      "Malpractice liability",
      "Licensing violations",
      "Disciplinary action",
      "Legal liability",
    ],
    source: "State PT Practice Acts",
    citation:
      "State Physical Therapy Practice Acts (2023). Informed Consent Requirements.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-comp-008",
    name: "Continuing Education",
    category: "professional-development",
    description:
      "Requirements for PT continuing education and professional development",
    requirements: [
      "Annual CE hours required",
      "Approved CE providers",
      "Relevant to PT practice",
      "Documentation of completion",
      "Renewal requirements",
    ],
    documentation: [
      "CE certificates",
      "Course descriptions",
      "Provider approval documentation",
      "Renewal applications",
      "Compliance records",
    ],
    penalties: [
      "License suspension",
      "License revocation",
      "Fines",
      "Disciplinary action",
    ],
    source: "State PT Licensing Boards",
    citation: "State Physical Therapy Practice Acts (2023). CE Requirements.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-comp-009",
    name: "Quality Assurance",
    category: "quality",
    description:
      "Requirements for PT quality assurance and performance monitoring",
    requirements: [
      "Outcome measurement",
      "Patient satisfaction assessment",
      "Peer review process",
      "Incident reporting",
      "Continuous improvement",
    ],
    documentation: [
      "Outcome data",
      "Patient surveys",
      "Peer review records",
      "Incident reports",
      "Improvement plans",
    ],
    penalties: [
      "Accreditation loss",
      "Compliance violations",
      "Reputational damage",
      "Potential legal liability",
    ],
    source: "APTA Quality Standards",
    citation:
      "American Physical Therapy Association (2023). Quality Assurance Standards.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-comp-010",
    name: "Fraud and Abuse Prevention",
    category: "compliance",
    description:
      "Requirements for preventing fraud and abuse in PT billing and practice",
    requirements: [
      "Accurate billing practices",
      "No unnecessary services",
      "Proper documentation",
      "Compliance training",
      "Reporting mechanisms",
    ],
    documentation: [
      "Compliance policies",
      "Training records",
      "Billing audits",
      "Incident reports",
      "Corrective actions",
    ],
    penalties: [
      "Criminal charges",
      "Civil penalties",
      "Exclusion from programs",
      "Loss of license",
    ],
    source: "False Claims Act",
    citation: "U.S. Department of Justice (2023). Fraud and Abuse Prevention.",
    lastUpdated: new Date("2024-01-15"),
  },
];

/**
 * Get billing code by code
 */
export function getPTBillingCodeByCode(
  code: string,
): PTBillingCode | undefined {
  return ptBillingCodesData.find((bc) => bc.code === code);
}

/**
 * Get billing codes by category
 */
export function getPTBillingCodesByCategory(category: string): PTBillingCode[] {
  return ptBillingCodesData.filter((bc) => bc.category === category);
}

/**
 * Search billing codes
 */
export function searchPTBillingCodes(query: string): PTBillingCode[] {
  const lowerQuery = query.toLowerCase();
  return ptBillingCodesData.filter(
    (bc) =>
      bc.code.toLowerCase().includes(lowerQuery) ||
      bc.description.toLowerCase().includes(lowerQuery),
  );
}

/**
 * Get all billing codes
 */
export function getAllPTBillingCodes(): PTBillingCode[] {
  return ptBillingCodesData;
}

/**
 * Get billing code categories
 */
export function getPTBillingCodeCategories(): string[] {
  return Array.from(new Set(ptBillingCodesData.map((bc) => bc.category)));
}

/**
 * Get compliance standard by ID
 */
export function getPTComplianceStandardById(
  id: string,
): PTComplianceStandard | undefined {
  return ptComplianceStandardsData.find((cs) => cs.id === id);
}

/**
 * Get compliance standards by category
 */
export function getPTComplianceStandardsByCategory(
  category: string,
): PTComplianceStandard[] {
  return ptComplianceStandardsData.filter((cs) => cs.category === category);
}

/**
 * Search compliance standards
 */
export function searchPTComplianceStandards(
  query: string,
): PTComplianceStandard[] {
  const lowerQuery = query.toLowerCase();
  return ptComplianceStandardsData.filter(
    (cs) =>
      cs.name.toLowerCase().includes(lowerQuery) ||
      cs.description.toLowerCase().includes(lowerQuery),
  );
}

/**
 * Get all compliance standards
 */
export function getAllPTComplianceStandards(): PTComplianceStandard[] {
  return ptComplianceStandardsData;
}

/**
 * Get compliance standard categories
 */
export function getPTComplianceStandardCategories(): string[] {
  return Array.from(
    new Set(ptComplianceStandardsData.map((cs) => cs.category)),
  );
}

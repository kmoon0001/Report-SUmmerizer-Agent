/**
 * OT Compliance Rules Data
 *
 * Defines OT-specific compliance rules based on Medicare Part B and AOTA standards
 * Requirements: 2.5, 2.6, 2.7, 2.8
 */

import type {
  OTComplianceRule,
  MedicareOTRequirement,
  OTCPTCodeCompliance,
  OTDocumentationRequirement,
} from "../types/ot-compliance";

// ============================================================================
// OT Compliance Rules
// ============================================================================

export const OT_COMPLIANCE_RULES: OTComplianceRule[] = [
  // Documentation Rules
  {
    id: "ot-comp-001",
    code: "OT_DOC_001",
    name: "SOAP Format Required",
    description:
      "All OT documentation must follow SOAP format (Subjective, Objective, Assessment, Plan)",
    type: "documentation",
    severity: "critical",
    requirement: "All clinical notes must include S, O, A, P sections",
    rationale:
      "Medicare Part B requires structured documentation for billing and compliance",
    source: "medicare",
    applicableTo: ["evaluation", "treatment", "re-evaluation"],
    validationCriteria: [
      "Subjective section present",
      "Objective section present",
      "Assessment section present",
      "Plan section present",
    ],
    examples: [
      "S: Client reports difficulty with dressing due to limited shoulder ROM",
      "O: Shoulder flexion 90 degrees, unable to reach behind back",
      "A: Functional limitation affecting ADL independence",
      "P: ADL training and therapeutic exercise 2x/week",
    ],
    counterexamples: [
      "Missing subjective section",
      "No objective measurements",
      "Assessment without functional focus",
      "Plan without skilled justification",
    ],
    references: [
      "Medicare Part B Billing Guidelines",
      "AOTA Standards of Practice",
    ],
    effectiveDate: new Date("2024-01-01"),
    active: true,
  },

  {
    id: "ot-comp-002",
    code: "OT_DOC_002",
    name: "Occupational Performance Focus",
    description:
      "Documentation must focus on occupational performance and functional limitations",
    type: "documentation",
    severity: "high",
    requirement:
      "Assessment must clearly document impact on ADLs, IADLs, work, or leisure",
    rationale:
      "OT is defined by focus on occupational performance; Medicare requires functional limitation documentation",
    source: "medicare",
    applicableTo: ["evaluation", "treatment", "re-evaluation"],
    validationCriteria: [
      "Occupational performance issues identified",
      "Functional limitations documented",
      "Impact on ADLs/IADLs described",
      "Client goals related to occupations",
    ],
    examples: [
      "Client unable to don shirt due to limited shoulder ROM",
      "Difficulty with meal preparation due to cognitive deficits",
      "Unable to manage medications independently",
    ],
    counterexamples: [
      "Documentation focused only on impairments",
      "No mention of functional impact",
      "Goals not related to occupational performance",
    ],
    references: [
      "AOTA Practice Framework",
      "Medicare Documentation Requirements",
    ],
    effectiveDate: new Date("2024-01-01"),
    active: true,
  },

  {
    id: "ot-comp-003",
    code: "OT_DOC_003",
    name: "Skilled Need Justification",
    description: "Plan must justify why skilled OT services are needed",
    type: "documentation",
    severity: "high",
    requirement:
      "Plan section must explain why skilled OT (not aide) is required",
    rationale:
      "Medicare requires justification for skilled services to ensure medical necessity",
    source: "medicare",
    applicableTo: ["evaluation", "treatment", "re-evaluation"],
    validationCriteria: [
      "Skilled services clearly identified",
      "Rationale for skilled need provided",
      "Clinical decision-making documented",
      "Professional judgment explained",
    ],
    examples: [
      "Skilled assessment and ADL training required due to cognitive deficits",
      "Skilled intervention needed for adaptive equipment training",
      "Professional judgment required for safety assessment",
    ],
    counterexamples: [
      'Plan states "continue current routine"',
      "No explanation of skilled need",
      "Could be performed by aide",
    ],
    references: [
      "Medicare Part B Billing Guidelines",
      "AOTA Standards of Practice",
    ],
    effectiveDate: new Date("2024-01-01"),
    active: true,
  },

  // Billing Rules
  {
    id: "ot-comp-004",
    code: "OT_BILL_001",
    name: "8-Minute Rule",
    description:
      "Minimum 8 minutes of direct service required to bill one unit",
    type: "billing",
    severity: "critical",
    requirement:
      "Direct service time must be at least 8 minutes to bill; 15-minute increments for billing",
    rationale: "Medicare Part B 8-minute rule for therapy billing",
    source: "medicare",
    applicableTo: ["treatment"],
    validationCriteria: [
      "Time spent documented",
      "Minimum 8 minutes for billing",
      "Correct unit calculation (8-22 min = 1 unit)",
    ],
    examples: [
      "8-22 minutes = 1 unit",
      "23-37 minutes = 2 units",
      "38-52 minutes = 3 units",
      "53-67 minutes = 4 units",
    ],
    counterexamples: [
      "Billing 1 unit for 5 minutes",
      "Incorrect unit calculation",
      "No time documentation",
    ],
    references: ["Medicare Part B 8-Minute Rule", "CMS Billing Guidelines"],
    effectiveDate: new Date("2024-01-01"),
    active: true,
  },

  {
    id: "ot-comp-005",
    code: "OT_BILL_002",
    name: "Valid CPT Code",
    description: "CPT code must be valid for OT services",
    type: "billing",
    severity: "high",
    requirement:
      "Use only OT-specific CPT codes (97165-97168, 97110, 97535, 97129)",
    rationale: "Medicare requires correct CPT codes for billing and compliance",
    source: "medicare",
    applicableTo: ["treatment", "evaluation"],
    validationCriteria: [
      "CPT code is OT-specific",
      "Code matches service provided",
      "Code is current and active",
    ],
    examples: [
      "97165: OT Evaluation - Low Complexity",
      "97166: OT Evaluation - Moderate Complexity",
      "97110: Therapeutic Exercise",
      "97535: Self-Care/ADL Training",
    ],
    counterexamples: [
      "Using PT-specific codes",
      "Invalid or inactive codes",
      "Code mismatch with service",
    ],
    references: ["Medicare CPT Code Guidelines", "CMS Billing Guidelines"],
    effectiveDate: new Date("2024-01-01"),
    active: true,
  },

  // Clinical Practice Rules
  {
    id: "ot-comp-006",
    code: "OT_CLIN_001",
    name: "Client-Centered Approach",
    description:
      "OT services must be client-centered with client input on goals",
    type: "clinical-practice",
    severity: "high",
    requirement:
      "Client must be involved in goal-setting and intervention planning",
    rationale: "AOTA standards require client-centered practice",
    source: "aota",
    applicableTo: ["evaluation", "treatment", "re-evaluation"],
    validationCriteria: [
      "Client goals documented",
      "Client priorities identified",
      "Client input on interventions",
      "Client satisfaction assessed",
    ],
    examples: [
      "Client identified dressing as priority goal",
      "Client chose ADL training over other interventions",
      "Client satisfaction score documented",
    ],
    counterexamples: [
      "Goals set without client input",
      "No documentation of client priorities",
      "Interventions imposed without client agreement",
    ],
    references: ["AOTA Practice Framework", "AOTA Standards of Practice"],
    effectiveDate: new Date("2024-01-01"),
    active: true,
  },

  {
    id: "ot-comp-007",
    code: "OT_CLIN_002",
    name: "Evidence-Based Practice",
    description:
      "Interventions must be based on evidence and documented with evidence level",
    type: "clinical-practice",
    severity: "medium",
    requirement: "Interventions should be supported by research evidence",
    rationale: "AOTA standards require evidence-based practice",
    source: "aota",
    applicableTo: ["treatment", "re-evaluation"],
    validationCriteria: [
      "Interventions have evidence support",
      "Evidence level documented",
      "Research citations provided",
      "Outcomes measured",
    ],
    examples: [
      "COPM used for outcome measurement (Level 1 evidence)",
      "ADL training based on randomized controlled trials",
      "Sensory integration interventions with evidence support",
    ],
    counterexamples: [
      "Interventions without evidence support",
      "No outcome measurement",
      "No evidence level documented",
    ],
    references: ["AOTA Evidence-Based Practice Resources", "Cochrane Reviews"],
    effectiveDate: new Date("2024-01-01"),
    active: true,
  },

  // Ethical Rules
  {
    id: "ot-comp-008",
    code: "OT_ETH_001",
    name: "Confidentiality and Privacy",
    description: "All client information must be kept confidential and secure",
    type: "ethical",
    severity: "critical",
    requirement: "HIPAA compliance and client privacy protection",
    rationale: "HIPAA requirements and AOTA Code of Ethics",
    source: "hipaa",
    applicableTo: ["evaluation", "treatment", "re-evaluation"],
    validationCriteria: [
      "PHI encrypted",
      "Access controls implemented",
      "Audit trails maintained",
      "Client consent obtained",
    ],
    examples: [
      "Client information stored securely",
      "Access limited to authorized personnel",
      "Audit logs maintained",
    ],
    counterexamples: [
      "Unencrypted PHI",
      "Unauthorized access",
      "No audit trails",
    ],
    references: ["HIPAA Privacy Rule", "AOTA Code of Ethics"],
    effectiveDate: new Date("2024-01-01"),
    active: true,
  },

  // Safety Rules
  {
    id: "ot-comp-009",
    code: "OT_SAFE_001",
    name: "Safety Assessment",
    description:
      "Safety considerations must be documented in all interventions",
    type: "safety",
    severity: "high",
    requirement: "Identify and document safety risks and precautions",
    rationale: "Professional responsibility to ensure client safety",
    source: "aota",
    applicableTo: ["evaluation", "treatment", "re-evaluation"],
    validationCriteria: [
      "Safety risks identified",
      "Precautions documented",
      "Contraindications noted",
      "Emergency procedures in place",
    ],
    examples: [
      "Fall risk identified and precautions implemented",
      "Cognitive deficits noted with supervision requirements",
      "Contraindications documented",
    ],
    counterexamples: [
      "No safety assessment",
      "Risks not documented",
      "No precautions implemented",
    ],
    references: [
      "AOTA Standards of Practice",
      "Professional Liability Guidelines",
    ],
    effectiveDate: new Date("2024-01-01"),
    active: true,
  },
];

// ============================================================================
// Medicare OT Requirements
// ============================================================================

export const MEDICARE_OT_REQUIREMENTS: MedicareOTRequirement[] = [
  {
    id: "medicare-ot-001",
    code: "MED_OT_001",
    requirement: "Physician Referral Required",
    description: "OT services must be prescribed by a physician",
    applicableSettings: ["outpatient", "home health", "rehabilitation"],
    documentation: ["Physician order", "Referral date", "Diagnosis"],
    billing: ["Referral must be on file", "Referral must be current"],
    penalties: "Denial of payment, potential fraud investigation",
    references: ["Medicare Part B Coverage Rules", "CMS Guidelines"],
  },

  {
    id: "medicare-ot-002",
    code: "MED_OT_002",
    requirement: "Medically Necessary Services",
    description:
      "Services must address functional limitations and have reasonable expectation of improvement",
    applicableSettings: ["all"],
    documentation: [
      "Functional limitations documented",
      "Medical necessity justified",
      "Prognosis documented",
    ],
    billing: [
      "Medical necessity must be clear",
      "Progress must be demonstrated",
    ],
    penalties: "Denial of payment, recoupment of payments",
    references: ["Medicare Coverage Determinations", "CMS Billing Guidelines"],
  },

  {
    id: "medicare-ot-003",
    code: "MED_OT_003",
    requirement: "Plan of Care (POC)",
    description: "Physician must sign POC within 30 days of evaluation",
    applicableSettings: ["all"],
    documentation: [
      "POC signed by physician",
      "Type, amount, frequency, duration specified",
      "Functional goals identified",
    ],
    billing: ["POC must be on file", "Services must match POC"],
    penalties: "Denial of payment, recoupment of payments",
    references: ["Medicare Part B Requirements", "CMS Guidelines"],
  },

  {
    id: "medicare-ot-004",
    code: "MED_OT_004",
    requirement: "Progress Reports",
    description:
      "Progress reports required every 10 visits or 30 days, whichever comes first",
    applicableSettings: ["all"],
    documentation: [
      "Objective measures of progress",
      "Functional improvement documented",
      "Justification for continued services",
    ],
    billing: [
      "Progress reports must be submitted",
      "Continued medical necessity must be justified",
    ],
    penalties: "Denial of payment, recoupment of payments",
    references: ["Medicare Part B Requirements", "CMS Guidelines"],
  },

  {
    id: "medicare-ot-005",
    code: "MED_OT_005",
    requirement: "8-Minute Rule",
    description:
      "Minimum 8 minutes of direct service required to bill one unit",
    applicableSettings: ["all"],
    documentation: ["Time spent documented", "Direct service time recorded"],
    billing: [
      "8-22 minutes = 1 unit",
      "23-37 minutes = 2 units",
      "38-52 minutes = 3 units",
      "53-67 minutes = 4 units",
    ],
    penalties:
      "Denial of payment, recoupment of payments, potential fraud investigation",
    references: ["Medicare 8-Minute Rule", "CMS Billing Guidelines"],
  },
];

// ============================================================================
// OT CPT Code Compliance
// ============================================================================

export const OT_CPT_CODES: OTCPTCodeCompliance[] = [
  {
    code: "97165",
    name: "OT Evaluation - Low Complexity",
    complexity: "low",
    timeRequirement: 30,
    minTime: 30,
    billingUnit: 15,
    applicableSettings: ["outpatient", "home health", "rehabilitation"],
    documentation: ["Brief history", "1-3 deficits", "Occupational profile"],
    validationRules: [
      "Time >= 30 minutes",
      "Low complexity presentation",
      "Brief history",
    ],
  },

  {
    code: "97166",
    name: "OT Evaluation - Moderate Complexity",
    complexity: "moderate",
    timeRequirement: 45,
    minTime: 45,
    billingUnit: 15,
    applicableSettings: ["outpatient", "home health", "rehabilitation"],
    documentation: [
      "Moderate history",
      "4-5 deficits",
      "Occupational profile",
      "Multiple assessments",
    ],
    validationRules: [
      "Time >= 45 minutes",
      "Moderate complexity presentation",
      "Moderate history",
    ],
  },

  {
    code: "97167",
    name: "OT Evaluation - High Complexity",
    complexity: "high",
    timeRequirement: 60,
    minTime: 60,
    billingUnit: 15,
    applicableSettings: ["outpatient", "home health", "rehabilitation"],
    documentation: [
      "Extensive history",
      "6+ deficits",
      "Occupational profile",
      "Multiple specialized assessments",
    ],
    validationRules: [
      "Time >= 60 minutes",
      "High complexity presentation",
      "Extensive history",
    ],
  },

  {
    code: "97168",
    name: "OT Re-evaluation",
    timeRequirement: 30,
    minTime: 30,
    billingUnit: 15,
    applicableSettings: ["outpatient", "home health", "rehabilitation"],
    documentation: [
      "Progress assessment",
      "Updated goals",
      "Functional changes",
    ],
    validationRules: [
      "Time >= 30 minutes",
      "Re-evaluation documentation",
      "Progress measured",
    ],
  },

  {
    code: "97110",
    name: "Therapeutic Exercise",
    timeRequirement: 15,
    minTime: 8,
    billingUnit: 15,
    applicableSettings: ["outpatient", "home health", "rehabilitation"],
    documentation: ["Exercise type", "Sets/reps", "Functional goal"],
    validationRules: [
      "Time >= 8 minutes",
      "Exercise documented",
      "Functional purpose",
    ],
  },

  {
    code: "97535",
    name: "Self-Care/ADL Training",
    timeRequirement: 15,
    minTime: 8,
    billingUnit: 15,
    applicableSettings: ["outpatient", "home health", "rehabilitation"],
    documentation: ["ADL activity", "Training method", "Functional goal"],
    validationRules: [
      "Time >= 8 minutes",
      "ADL training documented",
      "Functional purpose",
    ],
  },

  {
    code: "97129",
    name: "Cognitive Function Interventions",
    timeRequirement: 15,
    minTime: 8,
    billingUnit: 15,
    applicableSettings: ["outpatient", "home health", "rehabilitation"],
    documentation: ["Cognitive domain", "Intervention type", "Functional goal"],
    validationRules: [
      "Time >= 8 minutes",
      "Cognitive intervention documented",
      "Functional purpose",
    ],
  },
];

// ============================================================================
// OT Documentation Requirements
// ============================================================================

export const OT_DOCUMENTATION_REQUIREMENTS: OTDocumentationRequirement[] = [
  {
    id: "ot-doc-req-001",
    section: "subjective",
    requirement: "Client report of occupational performance concerns",
    description:
      "Subjective section must include client's perspective on functional limitations and goals",
    requiredElements: [
      "Chief complaint or reason for referral",
      "Occupational performance concerns",
      "Client goals and priorities",
      "Relevant history",
      "Barriers and facilitators",
    ],
    examples: [
      "Client reports difficulty with dressing due to limited shoulder ROM",
      "Client wants to return to cooking meals independently",
      "Family reports safety concerns with medication management",
    ],
    commonMistakes: [
      "Missing client perspective",
      "No mention of occupational performance",
      "Goals not related to occupations",
      "No client priorities documented",
    ],
    complianceChecklist: [
      "Client perspective documented",
      "Occupational performance concerns identified",
      "Client goals stated",
      "Relevant history included",
    ],
  },

  {
    id: "ot-doc-req-002",
    section: "objective",
    requirement: "Measurable assessment findings",
    description:
      "Objective section must include standardized assessments and measurable findings",
    requiredElements: [
      "Standardized assessment tools used",
      "Specific measurements (ROM, strength, etc.)",
      "Functional observations",
      "Performance data",
      "Assessment scores",
    ],
    examples: [
      "COPM: Performance 4/10, Satisfaction 3/10 for dressing",
      "FIM: Self-care score 4 (minimal assistance)",
      "Shoulder flexion ROM: 90 degrees (normal 180 degrees)",
    ],
    commonMistakes: [
      "No standardized assessments",
      "Vague descriptions without measurements",
      "No objective data",
      "Missing assessment scores",
    ],
    complianceChecklist: [
      "Standardized assessments documented",
      "Specific measurements included",
      "Functional observations noted",
      "Assessment scores recorded",
    ],
  },

  {
    id: "ot-doc-req-003",
    section: "assessment",
    requirement: "Analysis of occupational performance issues",
    description:
      "Assessment section must analyze findings and identify occupational performance limitations",
    requiredElements: [
      "Occupational performance issues identified",
      "Functional limitations documented",
      "Impact on ADLs/IADLs described",
      "Skilled need justified",
      "Prognosis stated",
    ],
    examples: [
      "Client unable to don shirt due to limited shoulder ROM, affecting ADL independence",
      "Cognitive deficits impacting meal preparation safety",
      "Skilled OT assessment and training required",
    ],
    commonMistakes: [
      "Focus on impairments only, not occupational performance",
      "No functional limitation documentation",
      "No skilled need justification",
      "No prognosis stated",
    ],
    complianceChecklist: [
      "Occupational performance issues identified",
      "Functional limitations documented",
      "Skilled need justified",
      "Prognosis included",
    ],
  },

  {
    id: "ot-doc-req-004",
    section: "plan",
    requirement: "Intervention plan with skilled services justified",
    description:
      "Plan section must outline interventions and justify why skilled OT is needed",
    requiredElements: [
      "Specific interventions identified",
      "Frequency and duration",
      "Skilled services justified",
      "Client education plan",
      "Home program prescribed",
      "Discharge planning initiated",
    ],
    examples: [
      "ADL training 2x/week for 4 weeks, skilled assessment and training required",
      "Home program: dressing practice daily with adaptive equipment",
      "Discharge plan: independent with adaptive equipment",
    ],
    commonMistakes: [
      "No skilled need justification",
      "Vague intervention descriptions",
      "No frequency/duration specified",
      "No home program",
    ],
    complianceChecklist: [
      "Interventions specified",
      "Frequency and duration documented",
      "Skilled need justified",
      "Home program included",
    ],
  },
];

// ============================================================================
// Lookup Functions
// ============================================================================

export function getComplianceRule(
  ruleId: string,
): OTComplianceRule | undefined {
  return OT_COMPLIANCE_RULES.find((r) => r.id === ruleId);
}

export function getComplianceRuleByCode(
  code: string,
): OTComplianceRule | undefined {
  return OT_COMPLIANCE_RULES.find((r) => r.code === code);
}

export function getComplianceRulesBySeverity(
  severity: string,
): OTComplianceRule[] {
  return OT_COMPLIANCE_RULES.filter((r) => r.severity === severity);
}

export function getComplianceRulesByType(type: string): OTComplianceRule[] {
  return OT_COMPLIANCE_RULES.filter((r) => r.type === type);
}

export function getCPTCode(code: string): OTCPTCodeCompliance | undefined {
  return OT_CPT_CODES.find((c) => c.code === code);
}

export function getDocumentationRequirement(
  sectionId: string,
): OTDocumentationRequirement | undefined {
  return OT_DOCUMENTATION_REQUIREMENTS.find((r) => r.id === sectionId);
}

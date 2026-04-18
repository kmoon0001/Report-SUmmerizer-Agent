/**
 * Billing & Coding Standards Library
 * Medicare, ICD-10, CPT code reference for PT and OT
 * Sources: CMS, APTA, AOTA, Medicare guidelines
 */

export type CodeType = "cpt" | "icd10" | "modifier" | "hcpcs";
export type Discipline = "pt" | "ot" | "shared";
export type BillingRuleType =
  | "8-minute-rule"
  | "medical-necessity"
  | "skilled-service"
  | "functional-limitation"
  | "documentation-requirement";

export interface BillingCode {
  id: string;
  code: string;
  codeType: CodeType;
  discipline: Discipline;
  description: string;
  longDescription: string;
  unitValue: number; // 15-minute units for PT/OT
  billingUnit: number; // minutes
  applicableTo: string[];
  restrictions?: string[];
  source: string;
  citation: string;
  lastUpdated: Date;
}

export interface BillingRule {
  id: string;
  name: string;
  rule: BillingRuleType;
  discipline: Discipline;
  description: string;
  requirements: string[];
  examples: string[];
  commonErrors: string[];
  source: string;
  citation: string;
  lastUpdated: Date;
}

// PT CPT Codes
const ptCPTCodes: BillingCode[] = [
  {
    id: "cpt-pt-001",
    code: "97110",
    codeType: "cpt",
    discipline: "pt",
    description: "Therapeutic exercises",
    longDescription:
      "Therapeutic exercises to develop strength, endurance, flexibility, balance, coordination, and motor control",
    unitValue: 1,
    billingUnit: 15,
    applicableTo: [
      "strengthening",
      "flexibility",
      "balance",
      "coordination",
      "motor-control",
    ],
    source: "CMS",
    citation: "Medicare Part B PT Billing Guidelines",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "cpt-pt-002",
    code: "97112",
    codeType: "cpt",
    discipline: "pt",
    description: "Neuromuscular reeducation",
    longDescription:
      "Neuromuscular reeducation of movement, balance, coordination, kinesthetic sense, posture, and proprioception",
    unitValue: 1,
    billingUnit: 15,
    applicableTo: [
      "neurological",
      "balance",
      "coordination",
      "proprioception",
      "stroke",
    ],
    source: "CMS",
    citation: "Medicare Part B PT Billing Guidelines",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "cpt-pt-003",
    code: "97161",
    codeType: "cpt",
    discipline: "pt",
    description: "PT evaluation - low complexity",
    longDescription:
      "Physical therapy evaluation - low complexity, typically 20-30 minutes",
    unitValue: 1,
    billingUnit: 30,
    applicableTo: ["evaluation", "initial-assessment"],
    source: "CMS",
    citation: "Medicare Part B PT Billing Guidelines",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "cpt-pt-004",
    code: "97162",
    codeType: "cpt",
    discipline: "pt",
    description: "PT evaluation - moderate complexity",
    longDescription:
      "Physical therapy evaluation - moderate complexity, typically 30-45 minutes",
    unitValue: 1,
    billingUnit: 45,
    applicableTo: ["evaluation", "initial-assessment"],
    source: "CMS",
    citation: "Medicare Part B PT Billing Guidelines",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "cpt-pt-005",
    code: "97163",
    codeType: "cpt",
    discipline: "pt",
    description: "PT evaluation - high complexity",
    longDescription:
      "Physical therapy evaluation - high complexity, typically 45-60 minutes",
    unitValue: 1,
    billingUnit: 60,
    applicableTo: ["evaluation", "initial-assessment"],
    source: "CMS",
    citation: "Medicare Part B PT Billing Guidelines",
    lastUpdated: new Date("2024-01-15"),
  },
];

// OT CPT Codes
const otCPTCodes: BillingCode[] = [
  {
    id: "cpt-ot-001",
    code: "97165",
    codeType: "cpt",
    discipline: "ot",
    description: "OT evaluation - low complexity",
    longDescription:
      "Occupational therapy evaluation - low complexity, typically 20-30 minutes",
    unitValue: 1,
    billingUnit: 30,
    applicableTo: ["evaluation", "initial-assessment"],
    source: "CMS",
    citation: "Medicare Part B OT Billing Guidelines",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "cpt-ot-002",
    code: "97166",
    codeType: "cpt",
    discipline: "ot",
    description: "OT evaluation - moderate complexity",
    longDescription:
      "Occupational therapy evaluation - moderate complexity, typically 30-45 minutes",
    unitValue: 1,
    billingUnit: 45,
    applicableTo: ["evaluation", "initial-assessment"],
    source: "CMS",
    citation: "Medicare Part B OT Billing Guidelines",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "cpt-ot-003",
    code: "97167",
    codeType: "cpt",
    discipline: "ot",
    description: "OT evaluation - high complexity",
    longDescription:
      "Occupational therapy evaluation - high complexity, typically 45-60 minutes",
    unitValue: 1,
    billingUnit: 60,
    applicableTo: ["evaluation", "initial-assessment"],
    source: "CMS",
    citation: "Medicare Part B OT Billing Guidelines",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "cpt-ot-004",
    code: "97535",
    codeType: "cpt",
    discipline: "ot",
    description: "Self-care/home management training",
    longDescription:
      "Self-care/home management training including ADL, IADL, energy conservation, and adaptive equipment",
    unitValue: 1,
    billingUnit: 15,
    applicableTo: ["self-care", "ADL", "IADL", "home-management"],
    source: "CMS",
    citation: "Medicare Part B OT Billing Guidelines",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "cpt-ot-005",
    code: "97129",
    codeType: "cpt",
    discipline: "ot",
    description: "Therapeutic activities",
    longDescription:
      "Therapeutic activities to develop functional performance, including work hardening and work conditioning",
    unitValue: 1,
    billingUnit: 15,
    applicableTo: [
      "therapeutic-activities",
      "work-conditioning",
      "functional-training",
    ],
    source: "CMS",
    citation: "Medicare Part B OT Billing Guidelines",
    lastUpdated: new Date("2024-01-15"),
  },
];

// Shared ICD-10 Codes
const icd10Codes: BillingCode[] = [
  {
    id: "icd10-001",
    code: "I63.9",
    codeType: "icd10",
    discipline: "shared",
    description: "Cerebral infarction, unspecified",
    longDescription: "Unspecified cerebral infarction (stroke)",
    unitValue: 0,
    billingUnit: 0,
    applicableTo: ["stroke", "cerebrovascular-accident"],
    source: "CMS",
    citation: "ICD-10-CM Coding Guidelines",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "icd10-002",
    code: "M54.5",
    codeType: "icd10",
    discipline: "shared",
    description: "Low back pain",
    longDescription: "Low back pain (lumbago)",
    unitValue: 0,
    billingUnit: 0,
    applicableTo: ["low-back-pain", "lumbar-spine"],
    source: "CMS",
    citation: "ICD-10-CM Coding Guidelines",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "icd10-003",
    code: "M25.51",
    codeType: "icd10",
    discipline: "shared",
    description: "Pain in shoulder",
    longDescription: "Pain in right shoulder",
    unitValue: 0,
    billingUnit: 0,
    applicableTo: ["shoulder-pain", "rotator-cuff"],
    source: "CMS",
    citation: "ICD-10-CM Coding Guidelines",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "icd10-004",
    code: "M17.11",
    codeType: "icd10",
    discipline: "shared",
    description: "Primary osteoarthritis, right knee",
    longDescription: "Primary osteoarthritis of right knee",
    unitValue: 0,
    billingUnit: 0,
    applicableTo: ["knee-osteoarthritis", "knee-pain"],
    source: "CMS",
    citation: "ICD-10-CM Coding Guidelines",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "icd10-005",
    code: "Z50.89",
    codeType: "icd10",
    discipline: "shared",
    description: "Encounter for other specified rehabilitation",
    longDescription: "Encounter for other specified rehabilitation procedures",
    unitValue: 0,
    billingUnit: 0,
    applicableTo: ["rehabilitation", "therapy"],
    source: "CMS",
    citation: "ICD-10-CM Coding Guidelines",
    lastUpdated: new Date("2024-01-15"),
  },
];

// Modifiers
const modifiers: BillingCode[] = [
  {
    id: "mod-001",
    code: "59",
    codeType: "modifier",
    discipline: "shared",
    description: "Distinct procedural service",
    longDescription:
      "Distinct procedural service - used when multiple services are provided on same day",
    unitValue: 0,
    billingUnit: 0,
    applicableTo: ["multiple-services", "same-day-billing"],
    source: "CMS",
    citation: "Medicare Modifier Guidelines",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "mod-002",
    code: "LT",
    codeType: "modifier",
    discipline: "shared",
    description: "Left side",
    longDescription: "Left side - used to specify left side of body",
    unitValue: 0,
    billingUnit: 0,
    applicableTo: ["laterality", "left-side"],
    source: "CMS",
    citation: "Medicare Modifier Guidelines",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "mod-003",
    code: "RT",
    codeType: "modifier",
    discipline: "shared",
    description: "Right side",
    longDescription: "Right side - used to specify right side of body",
    unitValue: 0,
    billingUnit: 0,
    applicableTo: ["laterality", "right-side"],
    source: "CMS",
    citation: "Medicare Modifier Guidelines",
    lastUpdated: new Date("2024-01-15"),
  },
];

// Combined code library
const allCodes: BillingCode[] = [
  ...ptCPTCodes,
  ...otCPTCodes,
  ...icd10Codes,
  ...modifiers,
];

// Billing Rules
const billingRules: BillingRule[] = [
  {
    id: "rule-001",
    name: "8-Minute Rule",
    rule: "8-minute-rule",
    discipline: "shared",
    description:
      "Medicare billing rule for time-based codes. One unit billed for 8-22 minutes, two units for 23-37 minutes, etc.",
    requirements: [
      "Accurate time tracking required",
      "Documentation must support time billed",
      "Time must be direct patient care",
      "Rounding rules must be followed",
    ],
    examples: [
      "8-22 minutes = 1 unit",
      "23-37 minutes = 2 units",
      "38-52 minutes = 3 units",
      "53-67 minutes = 4 units",
    ],
    commonErrors: [
      "Billing time not documented",
      "Rounding incorrectly",
      "Including non-billable time",
      "Billing more units than time supports",
    ],
    source: "CMS",
    citation: "Medicare 8-Minute Rule Guidelines",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "rule-002",
    name: "Medical Necessity",
    rule: "medical-necessity",
    discipline: "shared",
    description:
      "Services must be medically necessary and supported by documentation",
    requirements: [
      "Diagnosis supports need for therapy",
      "Functional limitations documented",
      "Treatment plan addresses limitations",
      "Progress toward goals documented",
      "Skilled service justification provided",
    ],
    examples: [
      "Stroke patient with weakness requires PT",
      "Post-surgical patient needs ROM exercises",
      "Patient with cognitive impairment needs OT",
    ],
    commonErrors: [
      "No functional limitation documented",
      "Treatment not addressing diagnosis",
      "No progress documentation",
      "Maintenance therapy billed as skilled",
    ],
    source: "CMS",
    citation: "Medicare Medical Necessity Guidelines",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "rule-003",
    name: "Skilled Service Justification",
    rule: "skilled-service",
    discipline: "shared",
    description:
      "Services must require skilled therapist, not just aide or family member",
    requirements: [
      "Service requires therapist judgment",
      "Service requires specialized knowledge",
      "Service cannot be safely performed by non-skilled person",
      "Documentation supports skilled need",
    ],
    examples: [
      "Assessment and treatment planning",
      "Complex exercise progression",
      "Neurological assessment",
      "Safety training for high-risk patients",
    ],
    commonErrors: [
      "Routine exercises billed as skilled",
      "Maintenance activities billed as skilled",
      "No documentation of skilled need",
      "Aide services billed as therapist",
    ],
    source: "CMS",
    citation: "Medicare Skilled Service Guidelines",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "rule-004",
    name: "Functional Limitation Reporting",
    rule: "functional-limitation",
    discipline: "shared",
    description:
      "Documentation must clearly link diagnosis to functional limitations",
    requirements: [
      "Specific functional limitations identified",
      "Limitations impact ADL/IADL/work",
      "Treatment addresses limitations",
      "Progress measured against limitations",
    ],
    examples: [
      "Patient unable to walk due to weakness",
      "Patient unable to dress due to ROM limitation",
      "Patient unable to perform job duties due to pain",
    ],
    commonErrors: [
      "Vague functional descriptions",
      "No link between diagnosis and function",
      "No measurement of functional improvement",
      "Treatment not addressing functional goals",
    ],
    source: "CMS",
    citation: "Medicare Functional Limitation Guidelines",
    lastUpdated: new Date("2024-01-15"),
  },
];

/**
 * Get billing code by ID
 */
export function getBillingCodeById(id: string): BillingCode | undefined {
  return allCodes.find((c) => c.id === id);
}

/**
 * Get billing code by code value
 */
export function getBillingCodeByCode(code: string): BillingCode | undefined {
  return allCodes.find((c) => c.code === code);
}

/**
 * Get codes by type
 */
export function getCodesByType(type: CodeType): BillingCode[] {
  return allCodes.filter((c) => c.codeType === type);
}

/**
 * Get codes by discipline
 */
export function getCodesByDiscipline(discipline: Discipline): BillingCode[] {
  return allCodes.filter(
    (c) => c.discipline === discipline || c.discipline === "shared",
  );
}

/**
 * Get codes applicable to condition
 */
export function getCodesForCondition(condition: string): BillingCode[] {
  return allCodes.filter((c) => c.applicableTo.includes(condition));
}

/**
 * Search codes
 */
export function searchCodes(query: string): BillingCode[] {
  const lowerQuery = query.toLowerCase();
  return allCodes.filter(
    (c) =>
      c.code.toLowerCase().includes(lowerQuery) ||
      c.description.toLowerCase().includes(lowerQuery) ||
      c.longDescription.toLowerCase().includes(lowerQuery),
  );
}

/**
 * Get all CPT codes
 */
export function getAllCPTCodes(): BillingCode[] {
  return allCodes.filter((c) => c.codeType === "cpt");
}

/**
 * Get all ICD-10 codes
 */
export function getAllICD10Codes(): BillingCode[] {
  return allCodes.filter((c) => c.codeType === "icd10");
}

/**
 * Get all modifiers
 */
export function getAllModifiers(): BillingCode[] {
  return allCodes.filter((c) => c.codeType === "modifier");
}

/**
 * Get billing rule by ID
 */
export function getBillingRuleById(id: string): BillingRule | undefined {
  return billingRules.find((r) => r.id === id);
}

/**
 * Get billing rules by type
 */
export function getBillingRulesByType(rule: BillingRuleType): BillingRule[] {
  return billingRules.filter((r) => r.rule === rule);
}

/**
 * Get all billing rules
 */
export function getAllBillingRules(): BillingRule[] {
  return billingRules;
}

/**
 * Get all codes
 */
export function getAllCodes(): BillingCode[] {
  return allCodes;
}

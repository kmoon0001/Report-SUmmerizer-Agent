/**
 * OT Advanced Clinical Reasoning & Case Management
 * Complex multi-system cases with clinical decision-making frameworks
 */

import { auditService } from "../core/audit/AuditService";

export interface OTClinicalCase {
  id: string;
  name: string;
  category: string;
  description: string;
  patientProfile: string[];
  clinicalPresentation: string[];
  assessmentStrategy: string[];
  differentialDiagnosis: string[];
  interventionPlan: string[];
  expectedOutcomes: string[];
  redFlags: string[];
  evidenceLevel: 1 | 2 | 3;
  source: string;
  citation: string;
  lastUpdated: Date;
}

const cases: OTClinicalCase[] = [
  {
    id: "ot-cr-001",
    name: "Complex Stroke with Cognitive-Perceptual Deficits",
    category: "Neurological Complexity",
    description:
      "Multi-system case: 68-year-old post-stroke with right hemiparesis, neglect, apraxia, and ADL dependence",
    patientProfile: [
      "Age 68",
      "Post-stroke 2 months",
      "Right hemiparesis",
      "Left neglect",
      "Apraxia",
      "ADL dependent",
    ],
    clinicalPresentation: [
      "Weakness right side",
      "Ignores left side",
      "Difficulty with sequencing",
      "ADL dependence",
      "Safety concerns",
      "Reduced participation",
    ],
    assessmentStrategy: [
      "Comprehensive neurological screening",
      "Perceptual assessment",
      "ADL evaluation",
      "Cognitive screening",
      "Safety assessment",
      "Participation assessment",
    ],
    differentialDiagnosis: [
      "Post-stroke motor recovery",
      "Unilateral neglect",
      "Ideomotor apraxia",
      "Cognitive-perceptual integration deficit",
      "Learned non-use",
      "Participation restriction",
    ],
    interventionPlan: [
      "Compensatory strategies",
      "Neglect remediation",
      "ADL retraining",
      "Cognitive-perceptual training",
      "Environmental modification",
      "Community reintegration",
    ],
    expectedOutcomes: [
      "Improved ADL independence",
      "Reduced neglect",
      "Improved sequencing",
      "Enhanced safety",
      "Increased participation",
      "Return to meaningful roles",
    ],
    redFlags: [
      "Severe neglect with safety risk",
      "Severe cognitive decline",
      "Aspiration risk",
      "Severe depression",
      "Caregiver burnout",
      "Seizure activity",
    ],
    evidenceLevel: 1,
    source: "AOTA Stroke Guidelines & Cognitive-Perceptual Research",
    citation: "AOTA (2024). Complex Stroke Management.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-cr-002",
    name: "Autism Spectrum Disorder with Sensory Dysregulation",
    category: "Developmental Complexity",
    description:
      "Multi-system case: 14-year-old with ASD, severe sensory sensitivities, social anxiety, and school participation challenges",
    patientProfile: [
      "Age 14",
      "ASD diagnosis",
      "Severe sensory sensitivities",
      "Social anxiety",
      "School avoidance",
      "Limited peer interaction",
    ],
    clinicalPresentation: [
      "Sensory overload responses",
      "Social withdrawal",
      "Anxiety in transitions",
      "Restricted interests",
      "Difficulty with unstructured time",
      "School refusal",
    ],
    assessmentStrategy: [
      "Sensory profile assessment",
      "Social-emotional screening",
      "School participation evaluation",
      "Anxiety assessment",
      "Occupational performance analysis",
      "Environmental assessment",
    ],
    differentialDiagnosis: [
      "Sensory processing disorder",
      "Social anxiety",
      "School-related anxiety",
      "Restricted interests",
      "Transition difficulty",
      "Peer relationship challenges",
    ],
    interventionPlan: [
      "Sensory diet development",
      "Social skills training",
      "Anxiety management",
      "School accommodation planning",
      "Structured activity programming",
      "Peer interaction facilitation",
    ],
    expectedOutcomes: [
      "Improved sensory regulation",
      "Reduced anxiety",
      "Increased school participation",
      "Improved peer interaction",
      "Enhanced occupational engagement",
      "Better transition management",
    ],
    redFlags: [
      "Severe anxiety",
      "School refusal escalation",
      "Self-injurious behavior",
      "Aggression",
      "Suicidal ideation",
      "Severe social isolation",
    ],
    evidenceLevel: 1,
    source: "AOTA Autism Guidelines & Sensory Integration Research",
    citation: "AOTA (2024). Autism Spectrum Disorder Management.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-cr-003",
    name: "Cancer Survivorship with Fatigue & Functional Decline",
    category: "Oncology Complexity",
    description:
      "Multi-system case: 56-year-old post-chemotherapy with cancer-related fatigue, neuropathy, and occupational role loss",
    patientProfile: [
      "Age 56",
      "Post-chemotherapy 6 months",
      "Cancer-related fatigue",
      "Peripheral neuropathy",
      "Work disability",
      "Role loss",
    ],
    clinicalPresentation: [
      "Severe fatigue",
      "Hand/foot numbness",
      "Reduced activity tolerance",
      "Occupational role loss",
      "Identity crisis",
      "Reduced participation",
    ],
    assessmentStrategy: [
      "Fatigue assessment",
      "Functional capacity evaluation",
      "Neuropathy screening",
      "Occupational role assessment",
      "Psychosocial screening",
      "Participation evaluation",
    ],
    differentialDiagnosis: [
      "Cancer-related fatigue",
      "Chemotherapy-induced peripheral neuropathy",
      "Deconditioning",
      "Occupational role loss",
      "Identity disruption",
      "Psychosocial adjustment",
    ],
    interventionPlan: [
      "Energy conservation training",
      "Graded activity progression",
      "Occupational role exploration",
      "Adaptive equipment prescription",
      "Psychosocial support",
      "Return-to-work planning",
    ],
    expectedOutcomes: [
      "Improved energy management",
      "Increased activity tolerance",
      "Occupational role reestablishment",
      "Improved function",
      "Return to work",
      "Enhanced quality of life",
    ],
    redFlags: [
      "Severe fatigue limiting safety",
      "Severe neuropathy with safety risk",
      "Severe depression",
      "Suicidal ideation",
      "Severe role loss",
      "Caregiver stress",
    ],
    evidenceLevel: 1,
    source: "AOTA Cancer Survivorship Guidelines & Occupational Rehabilitation",
    citation: "AOTA (2024). Cancer Survivorship Management.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-cr-004",
    name: "Dementia with Behavioral Challenges & Caregiver Burden",
    category: "Geriatric Complexity",
    description:
      "Multi-system case: 79-year-old with moderate dementia, behavioral disturbances, ADL dependence, and caregiver stress",
    patientProfile: [
      "Age 79",
      "Moderate dementia",
      "Behavioral disturbances",
      "ADL dependent",
      "Caregiver stress",
      "Safety concerns",
    ],
    clinicalPresentation: [
      "Memory loss",
      "Behavioral outbursts",
      "ADL dependence",
      "Wandering",
      "Sleep disturbance",
      "Caregiver frustration",
    ],
    assessmentStrategy: [
      "Cognitive screening",
      "Behavioral assessment",
      "ADL evaluation",
      "Environmental assessment",
      "Caregiver stress assessment",
      "Safety evaluation",
    ],
    differentialDiagnosis: [
      "Dementia progression",
      "Behavioral disturbance",
      "ADL decline",
      "Environmental mismatch",
      "Caregiver burnout",
      "Safety risk",
    ],
    interventionPlan: [
      "Environmental modification",
      "Behavioral management strategies",
      "ADL simplification",
      "Caregiver education",
      "Structured activity programming",
      "Safety planning",
    ],
    expectedOutcomes: [
      "Improved behavioral management",
      "Maintained ADL function",
      "Reduced caregiver stress",
      "Enhanced safety",
      "Improved quality of life",
      "Maintained dignity",
    ],
    redFlags: [
      "Severe behavioral disturbance",
      "Severe ADL decline",
      "Severe caregiver burnout",
      "Safety risk",
      "Wandering with injury risk",
      "Severe sleep disturbance",
    ],
    evidenceLevel: 1,
    source: "AOTA Dementia Guidelines & Behavioral Management Research",
    citation: "AOTA (2024). Dementia Management.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-cr-005",
    name: "Mental Health Crisis with Occupational Dysfunction",
    category: "Mental Health Complexity",
    description:
      "Multi-system case: 31-year-old with bipolar disorder, occupational role loss, social isolation, and medication non-compliance",
    patientProfile: [
      "Age 31",
      "Bipolar disorder",
      "Recent hospitalization",
      "Work loss",
      "Social isolation",
      "Medication non-compliance",
    ],
    clinicalPresentation: [
      "Mood instability",
      "Occupational dysfunction",
      "Social withdrawal",
      "Sleep disturbance",
      "Reduced motivation",
      "Medication resistance",
    ],
    assessmentStrategy: [
      "Mental health screening",
      "Occupational role assessment",
      "Social participation evaluation",
      "Medication compliance assessment",
      "Functional capacity evaluation",
      "Psychosocial assessment",
    ],
    differentialDiagnosis: [
      "Bipolar disorder",
      "Occupational role loss",
      "Social isolation",
      "Medication non-compliance",
      "Demoralization",
      "Functional decline",
    ],
    interventionPlan: [
      "Occupational role exploration",
      "Structured activity programming",
      "Social engagement facilitation",
      "Medication compliance support",
      "Vocational rehabilitation",
      "Peer support connection",
    ],
    expectedOutcomes: [
      "Improved mood stability",
      "Occupational role reestablishment",
      "Increased social engagement",
      "Improved medication compliance",
      "Return to work",
      "Enhanced quality of life",
    ],
    redFlags: [
      "Suicidal ideation",
      "Severe mood instability",
      "Severe medication non-compliance",
      "Severe social isolation",
      "Severe occupational dysfunction",
      "Substance abuse",
    ],
    evidenceLevel: 1,
    source: "AOTA Mental Health Guidelines & Occupational Recovery Research",
    citation: "AOTA (2024). Mental Health Management.",
    lastUpdated: new Date("2024-01-15"),
  },
];

export function getOTClinicalCaseById(id: string): OTClinicalCase | undefined {
  try {
    if (!id || typeof id !== "string") {
      auditService.logWarning("INVALID_OT_CR_ID", { id });
      return undefined;
    }
    const caseData = cases.find((c) => c.id === id);
    if (!caseData) {
      auditService.logWarning("OT_CR_NOT_FOUND", { id });
    }
    return caseData;
  } catch (error) {
    auditService.logError("GET_OT_CR_ERROR", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

export function getAllOTClinicalCases(): OTClinicalCase[] {
  try {
    return [...cases];
  } catch (error) {
    auditService.logError("GET_ALL_OT_CR_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTClinicalCasesByCategory(
  category: string,
): OTClinicalCase[] {
  try {
    if (!category || typeof category !== "string") {
      auditService.logWarning("INVALID_OT_CR_CATEGORY", { category });
      return [];
    }
    return cases.filter((c) =>
      c.category.toLowerCase().includes(category.toLowerCase()),
    );
  } catch (error) {
    auditService.logError("GET_OT_CR_BY_CATEGORY_ERROR", {
      category,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function searchOTClinicalCases(query: string): OTClinicalCase[] {
  try {
    if (!query || typeof query !== "string") {
      auditService.logWarning("INVALID_OT_CR_SEARCH", { query });
      return [];
    }
    const lowerQuery = query.toLowerCase();
    return cases.filter(
      (c) =>
        c.name.toLowerCase().includes(lowerQuery) ||
        c.category.toLowerCase().includes(lowerQuery) ||
        c.description.toLowerCase().includes(lowerQuery),
    );
  } catch (error) {
    auditService.logError("SEARCH_OT_CR_ERROR", {
      query,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTClinicalCasesByEvidenceLevel(
  level: 1 | 2 | 3,
): OTClinicalCase[] {
  try {
    if (![1, 2, 3].includes(level)) {
      auditService.logWarning("INVALID_OT_CR_EVIDENCE_LEVEL", { level });
      return [];
    }
    return cases.filter((c) => c.evidenceLevel === level);
  } catch (error) {
    auditService.logError("GET_OT_CR_BY_EVIDENCE_ERROR", {
      level,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getRedFlags(): string[] {
  try {
    const flags = new Set<string>();
    cases.forEach((c) => c.redFlags.forEach((f) => flags.add(f)));
    return Array.from(flags).sort();
  } catch (error) {
    auditService.logError("GET_RED_FLAGS_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function validateClinicalReasoning(
  caseId: string,
  reasoning: string,
): { valid: boolean; message: string } {
  try {
    const caseData = getOTClinicalCaseById(caseId);
    if (!caseData) return { valid: false, message: "Case not found" };
    if (!reasoning || typeof reasoning !== "string")
      return { valid: false, message: "Reasoning must be a string" };
    const hasReasoning = caseData.differentialDiagnosis.some((d) =>
      d.toLowerCase().includes(reasoning.toLowerCase()),
    );
    return {
      valid: hasReasoning,
      message: hasReasoning ? "Reasoning found" : "Reasoning not found",
    };
  } catch (error) {
    auditService.logError("VALIDATE_CLINICAL_REASONING_ERROR", {
      caseId,
      reasoning,
      error: error instanceof Error ? error.message : String(error),
    });
    return { valid: false, message: "Validation error" };
  }
}

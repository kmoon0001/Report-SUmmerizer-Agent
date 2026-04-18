/**
 * PT Advanced Clinical Reasoning & Case Management
 * Complex multi-system cases with clinical decision-making frameworks
 */

import { auditService } from "../core/audit/AuditService";

export interface PTClinicalCase {
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

const cases: PTClinicalCase[] = [
  {
    id: "pt-cr-001",
    name: "Complex Stroke with Cognitive Impairment & Aphasia",
    category: "Neurological Complexity",
    description:
      "Multi-system case: 65-year-old post-stroke with left hemiparesis, cognitive deficits, expressive aphasia, and depression",
    patientProfile: [
      "Age 65",
      "Post-stroke 3 months",
      "Left hemiparesis",
      "Cognitive impairment",
      "Expressive aphasia",
      "Depression",
    ],
    clinicalPresentation: [
      "Weakness left side",
      "Difficulty with complex tasks",
      "Speech difficulties",
      "Mood changes",
      "Reduced motivation",
      "Balance deficits",
    ],
    assessmentStrategy: [
      "Comprehensive neurological exam",
      "Cognitive screening",
      "Functional mobility assessment",
      "Psychological screening",
      "Communication assessment",
      "Fall risk evaluation",
    ],
    differentialDiagnosis: [
      "Post-stroke motor recovery",
      "Cognitive-motor integration deficit",
      "Learned non-use",
      "Depression-related deconditioning",
      "Aphasia-related participation restriction",
    ],
    interventionPlan: [
      "Task-specific motor training",
      "Cognitive-motor integration",
      "Constraint-induced therapy",
      "Psychosocial support",
      "Communication-integrated therapy",
      "Community reintegration",
    ],
    expectedOutcomes: [
      "Improved motor control",
      "Enhanced cognitive function",
      "Increased participation",
      "Improved mood",
      "Return to community activities",
      "Reduced fall risk",
    ],
    redFlags: [
      "Sudden neurological change",
      "Severe depression",
      "Suicidal ideation",
      "Aspiration risk",
      "Severe cognitive decline",
      "Seizure activity",
    ],
    evidenceLevel: 1,
    source: "APTA Stroke Guidelines & Clinical Experience",
    citation: "APTA (2024). Complex Stroke Management.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-cr-002",
    name: "Chronic Pain Syndrome with Psychosocial Factors",
    category: "Pain & Psychosocial Complexity",
    description:
      "Multi-system case: 52-year-old with chronic low back pain, central sensitization, anxiety, and opioid dependency",
    patientProfile: [
      "Age 52",
      "Chronic LBP 5+ years",
      "Central sensitization",
      "Anxiety disorder",
      "Opioid use",
      "Work disability",
    ],
    clinicalPresentation: [
      "Widespread pain",
      "Hypervigilance",
      "Sleep disturbance",
      "Catastrophizing",
      "Reduced activity tolerance",
      "Medication dependency",
    ],
    assessmentStrategy: [
      "Pain neuroscience assessment",
      "Psychological screening",
      "Functional capacity evaluation",
      "Sleep assessment",
      "Medication review",
      "Psychosocial factors",
    ],
    differentialDiagnosis: [
      "Central sensitization",
      "Neuropathic pain",
      "Psychogenic pain",
      "Medication-related dysfunction",
      "Deconditioning",
      "Anxiety-related pain amplification",
    ],
    interventionPlan: [
      "Pain neuroscience education",
      "Graded exercise therapy",
      "Cognitive-behavioral strategies",
      "Sleep hygiene",
      "Mindfulness-based approaches",
      "Interdisciplinary pain management",
    ],
    expectedOutcomes: [
      "Reduced pain perception",
      "Improved function",
      "Reduced anxiety",
      "Better sleep",
      "Medication reduction",
      "Return to work",
    ],
    redFlags: [
      "Suicidal ideation",
      "Severe medication dependency",
      "Untreated mental health",
      "Substance abuse escalation",
      "Severe deconditioning",
      "Medication toxicity",
    ],
    evidenceLevel: 1,
    source: "APTA Pain Management Guidelines & Biopsychosocial Model",
    citation: "APTA (2024). Chronic Pain Management.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-cr-003",
    name: "Post-Surgical Orthopedic with Complications",
    category: "Orthopedic Complexity",
    description:
      "Multi-system case: 45-year-old post-ACL reconstruction with stiffness, infection risk, and psychological fear-avoidance",
    patientProfile: [
      "Age 45",
      "Post-ACL reconstruction 6 weeks",
      "Stiffness developing",
      "Infection concerns",
      "Fear-avoidance",
      "Athlete",
    ],
    clinicalPresentation: [
      "Limited ROM",
      "Swelling",
      "Pain with movement",
      "Guarding behavior",
      "Reduced confidence",
      "Functional limitations",
    ],
    assessmentStrategy: [
      "ROM assessment",
      "Swelling measurement",
      "Infection screening",
      "Psychological assessment",
      "Functional testing",
      "Proprioception evaluation",
    ],
    differentialDiagnosis: [
      "Post-surgical stiffness",
      "Infection",
      "Arthrofibrosis",
      "Fear-avoidance behavior",
      "Deconditioning",
      "Proprioceptive deficit",
    ],
    interventionPlan: [
      "Aggressive ROM restoration",
      "Infection prevention",
      "Fear-avoidance reduction",
      "Proprioceptive training",
      "Strength progression",
      "Sport-specific training",
    ],
    expectedOutcomes: [
      "Full ROM restoration",
      "Infection prevention",
      "Reduced fear-avoidance",
      "Proprioceptive restoration",
      "Return to sport",
      "Psychological confidence",
    ],
    redFlags: [
      "Signs of infection",
      "Excessive swelling",
      "Severe pain",
      "Neurological changes",
      "Vascular compromise",
      "Severe psychological distress",
    ],
    evidenceLevel: 1,
    source: "APTA Orthopedic Guidelines & ACL Rehabilitation Protocols",
    citation: "APTA (2024). Post-Surgical Orthopedic Management.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-cr-004",
    name: "Geriatric Fall Risk with Multiple Comorbidities",
    category: "Geriatric Complexity",
    description:
      "Multi-system case: 82-year-old with fall history, Parkinson's, osteoporosis, polypharmacy, and cognitive decline",
    patientProfile: [
      "Age 82",
      "Fall history",
      "Parkinson's disease",
      "Osteoporosis",
      "Polypharmacy",
      "Mild cognitive impairment",
    ],
    clinicalPresentation: [
      "Gait instability",
      "Tremor",
      "Postural hypotension",
      "Medication side effects",
      "Cognitive slowing",
      "Fear of falling",
    ],
    assessmentStrategy: [
      "Comprehensive fall risk assessment",
      "Gait analysis",
      "Balance testing",
      "Medication review",
      "Cognitive screening",
      "Home safety evaluation",
    ],
    differentialDiagnosis: [
      "Parkinson's-related gait dysfunction",
      "Medication-induced orthostasis",
      "Osteoporosis-related fragility",
      "Cognitive-motor integration deficit",
      "Deconditioning",
      "Environmental hazards",
    ],
    interventionPlan: [
      "Balance and gait training",
      "Strength training",
      "Medication optimization",
      "Home modification",
      "Assistive device prescription",
      "Cognitive-motor training",
    ],
    expectedOutcomes: [
      "Improved balance",
      "Safer gait",
      "Reduced fall risk",
      "Maintained independence",
      "Improved confidence",
      "Fracture prevention",
    ],
    redFlags: [
      "Recent fall with injury",
      "Severe osteoporosis",
      "Syncope",
      "Severe cognitive decline",
      "Medication toxicity",
      "Severe deconditioning",
    ],
    evidenceLevel: 1,
    source: "APTA Geriatrics Guidelines & Fall Prevention Research",
    citation: "APTA (2024). Geriatric Fall Prevention.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-cr-005",
    name: "Cardiopulmonary Dysfunction with Deconditioning",
    category: "Cardiopulmonary Complexity",
    description:
      "Multi-system case: 58-year-old post-MI with reduced ejection fraction, dyspnea, anxiety, and severe deconditioning",
    patientProfile: [
      "Age 58",
      "Post-MI 3 months",
      "Reduced EF 35%",
      "Dyspnea on exertion",
      "Anxiety",
      "Sedentary",
    ],
    clinicalPresentation: [
      "Shortness of breath",
      "Fatigue",
      "Chest discomfort",
      "Anxiety",
      "Reduced exercise tolerance",
      "Orthopnea",
    ],
    assessmentStrategy: [
      "Cardiac assessment",
      "Pulmonary function testing",
      "Exercise tolerance evaluation",
      "Psychological screening",
      "Functional capacity assessment",
      "Vital sign monitoring",
    ],
    differentialDiagnosis: [
      "Cardiac dysfunction",
      "Pulmonary deconditioning",
      "Anxiety-related dyspnea",
      "Medication side effects",
      "Deconditioning",
      "Cardiac anxiety",
    ],
    interventionPlan: [
      "Graded aerobic training",
      "Breathing strategies",
      "Anxiety management",
      "Energy conservation",
      "Cardiac rehabilitation",
      "Psychosocial support",
    ],
    expectedOutcomes: [
      "Improved exercise tolerance",
      "Reduced dyspnea",
      "Improved cardiac function",
      "Reduced anxiety",
      "Return to activities",
      "Improved quality of life",
    ],
    redFlags: [
      "Chest pain",
      "Severe dyspnea",
      "Arrhythmias",
      "Syncope",
      "Severe anxiety",
      "Acute decompensation",
    ],
    evidenceLevel: 1,
    source: "APTA Cardiopulmonary Guidelines & Cardiac Rehabilitation",
    citation: "APTA (2024). Cardiopulmonary Rehabilitation.",
    lastUpdated: new Date("2024-01-15"),
  },
];

export function getPTClinicalCaseById(id: string): PTClinicalCase | undefined {
  try {
    if (!id || typeof id !== "string") {
      auditService.logWarning("INVALID_PT_CR_ID", { id });
      return undefined;
    }
    const caseData = cases.find((c) => c.id === id);
    if (!caseData) {
      auditService.logWarning("PT_CR_NOT_FOUND", { id });
    }
    return caseData;
  } catch (error) {
    auditService.logError("GET_PT_CR_ERROR", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

export function getAllPTClinicalCases(): PTClinicalCase[] {
  try {
    return [...cases];
  } catch (error) {
    auditService.logError("GET_ALL_PT_CR_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getPTClinicalCasesByCategory(
  category: string,
): PTClinicalCase[] {
  try {
    if (!category || typeof category !== "string") {
      auditService.logWarning("INVALID_PT_CR_CATEGORY", { category });
      return [];
    }
    return cases.filter((c) =>
      c.category.toLowerCase().includes(category.toLowerCase()),
    );
  } catch (error) {
    auditService.logError("GET_PT_CR_BY_CATEGORY_ERROR", {
      category,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function searchPTClinicalCases(query: string): PTClinicalCase[] {
  try {
    if (!query || typeof query !== "string") {
      auditService.logWarning("INVALID_PT_CR_SEARCH", { query });
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
    auditService.logError("SEARCH_PT_CR_ERROR", {
      query,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getPTClinicalCasesByEvidenceLevel(
  level: 1 | 2 | 3,
): PTClinicalCase[] {
  try {
    if (![1, 2, 3].includes(level)) {
      auditService.logWarning("INVALID_PT_CR_EVIDENCE_LEVEL", { level });
      return [];
    }
    return cases.filter((c) => c.evidenceLevel === level);
  } catch (error) {
    auditService.logError("GET_PT_CR_BY_EVIDENCE_ERROR", {
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
    const caseData = getPTClinicalCaseById(caseId);
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

/**
 * OT Evidence-Based Resources & Clinical Depth
 * Based on AOTA Practice Guidelines, Systematic Reviews, and Current Evidence
 */

import { auditService } from "../core/audit/AuditService";

export interface OTEvidenceResource {
  id: string;
  name: string;
  category: string;
  description: string;
  clinicalApplication: string[];
  evidenceBase: string[];
  keyFindings: string[];
  recommendedAssessments: string[];
  citationAuthors: string[];
  publicationYear: number;
  evidenceLevel: 1 | 2 | 3;
  source: string;
  doi?: string;
  lastUpdated: Date;
}

const resources: OTEvidenceResource[] = [
  {
    id: "ot-ebr-001",
    name: "Occupational Therapy Practice Guidelines for Adults Living With and Beyond Cancer",
    category: "Oncology & Survivorship",
    description:
      "AOTA evidence-based guidelines addressing psychosocial function, fatigue, cognition, pain, sleep, and physical activity in cancer survivors",
    clinicalApplication: [
      "Fatigue management",
      "Cognitive rehabilitation",
      "Pain management",
      "Sleep optimization",
      "Activity engagement",
      "Psychosocial support",
    ],
    evidenceBase: [
      "Systematic reviews",
      "Clinical trials",
      "Qualitative research",
      "Patient-reported outcomes",
      "AOTA guidelines",
    ],
    keyFindings: [
      "OT improves quality of life significantly",
      "Fatigue management through occupation-based interventions",
      "Cognitive strategies enhance function",
      "Psychosocial support reduces anxiety/depression",
      "Meaningful activity engagement promotes recovery",
    ],
    recommendedAssessments: [
      "Fatigue Impact Scale",
      "Montreal Cognitive Assessment",
      "Pain scales",
      "Sleep quality measures",
      "Occupational performance assessments",
    ],
    citationAuthors: ["AOTA", "American Occupational Therapy Association"],
    publicationYear: 2024,
    evidenceLevel: 1,
    source: "AOTA Practice Guidelines",
    doi: "10.5014/ajot.2024.078501",
    lastUpdated: new Date("2024-08-15"),
  },
  {
    id: "ot-ebr-002",
    name: "Occupational Therapy Practice Guidelines for Autistic People Across the Lifespan",
    category: "Neurodevelopmental & Autism",
    description:
      "AOTA evidence-based guidelines promoting access, inclusion, engagement, and optimal participation in meaningful occupations for autistic individuals",
    clinicalApplication: [
      "Sensory integration",
      "Social participation",
      "Occupational engagement",
      "Environmental modification",
      "Strengths-based approaches",
      "Self-advocacy",
    ],
    evidenceBase: [
      "Systematic reviews",
      "Qualitative research",
      "Participatory research",
      "Lived experience",
      "AOTA guidelines",
    ],
    keyFindings: [
      "Strengths-based approaches most effective",
      "Sensory considerations essential",
      "Environmental modifications improve participation",
      "Self-advocacy skills enhance independence",
      "Meaningful occupation drives engagement",
    ],
    recommendedAssessments: [
      "Sensory Profile",
      "Social participation measures",
      "Occupational performance assessments",
      "Environmental assessments",
      "Quality of life measures",
    ],
    citationAuthors: ["AOTA", "American Occupational Therapy Association"],
    publicationYear: 2024,
    evidenceLevel: 1,
    source: "AOTA Practice Guidelines",
    doi: "10.5014/ajot.2024.078339",
    lastUpdated: new Date("2024-05-15"),
  },
  {
    id: "ot-ebr-003",
    name: "Occupation-Based Interventions in Hospital Settings: Critical Review",
    category: "Hospital & Acute Care",
    description:
      "Evidence review on occupation-based interventions for improving occupational performance and participation outcomes in hospital settings",
    clinicalApplication: [
      "ADL/IADL training",
      "Functional mobility",
      "Cognitive engagement",
      "Psychosocial support",
      "Discharge planning",
      "Community reintegration",
    ],
    evidenceBase: [
      "Systematic reviews",
      "Clinical trials",
      "Observational studies",
      "Outcome data",
      "Implementation research",
    ],
    keyFindings: [
      "Occupation-based interventions improve outcomes",
      "Early engagement prevents deconditioning",
      "Meaningful activity enhances motivation",
      "Functional training accelerates recovery",
      "Discharge planning improves transitions",
    ],
    recommendedAssessments: [
      "FIM",
      "KATZ ADL Scale",
      "Occupational performance measures",
      "Functional mobility tests",
      "Discharge readiness assessments",
    ],
    citationAuthors: ["OT Researchers", "Hospital-Based OT Specialists"],
    publicationYear: 2023,
    evidenceLevel: 1,
    source: "Systematic Review",
    lastUpdated: new Date("2023-08-15"),
  },
  {
    id: "ot-ebr-004",
    name: "Occupational Therapy in Delirium Prevention: Systematic Review & Meta-Analysis",
    category: "Critical Care & Prevention",
    description:
      "Evidence on OT effectiveness in preventing delirium in critically ill patients through cognitive training and ADL engagement",
    clinicalApplication: [
      "Cognitive stimulation",
      "ADL engagement",
      "Environmental modification",
      "Orientation strategies",
      "Meaningful activity",
      "Family involvement",
    ],
    evidenceBase: [
      "Systematic reviews",
      "Meta-analyses",
      "Clinical trials",
      "ICU research",
      "Prevention studies",
    ],
    keyFindings: [
      "OT reduces delirium incidence significantly",
      "Cognitive training and ADL engagement most effective",
      "Early intervention prevents complications",
      "Family involvement enhances outcomes",
      "Cost-effective prevention strategy",
    ],
    recommendedAssessments: [
      "Confusion Assessment Method",
      "Cognitive assessments",
      "ADL performance measures",
      "Delirium severity scales",
      "Functional status measures",
    ],
    citationAuthors: ["OT Researchers", "Critical Care Specialists"],
    publicationYear: 2024,
    evidenceLevel: 1,
    source: "Systematic Review & Meta-Analysis",
    lastUpdated: new Date("2024-06-15"),
  },
  {
    id: "ot-ebr-005",
    name: "Community-Engaged Implementation Strategies in Occupational Therapy: Scoping Review",
    category: "Community Practice & Implementation",
    description:
      "Evidence on community-engaged implementation strategies for translating OT research into practice and improving population health",
    clinicalApplication: [
      "Community partnerships",
      "Implementation science",
      "Health equity",
      "Population health",
      "Participatory research",
      "Sustainability",
    ],
    evidenceBase: [
      "Scoping reviews",
      "Implementation research",
      "Community-based participatory research",
      "Qualitative studies",
      "Outcome data",
    ],
    keyFindings: [
      "Community engagement improves implementation success",
      "Partnerships enhance sustainability",
      "Health equity focus essential",
      "Participatory approaches increase adoption",
      "Long-term outcomes improved with engagement",
    ],
    recommendedAssessments: [
      "Implementation readiness",
      "Community partnership assessments",
      "Health equity measures",
      "Sustainability indicators",
      "Population health outcomes",
    ],
    citationAuthors: ["AOTA", "Community OT Researchers"],
    publicationYear: 2024,
    evidenceLevel: 1,
    source: "AOTA Scoping Review",
    doi: "10.5014/ajot.2024.050526",
    lastUpdated: new Date("2024-09-15"),
  },
];

export function getOTEvidenceResourceById(
  id: string,
): OTEvidenceResource | undefined {
  try {
    if (!id || typeof id !== "string") {
      auditService.logWarning("INVALID_OT_EBR_ID", { id });
      return undefined;
    }
    const resource = resources.find((r) => r.id === id);
    if (!resource) {
      auditService.logWarning("OT_EBR_NOT_FOUND", { id });
    }
    return resource;
  } catch (error) {
    auditService.logError("GET_OT_EBR_ERROR", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

export function getAllOTEvidenceResources(): OTEvidenceResource[] {
  try {
    return [...resources];
  } catch (error) {
    auditService.logError("GET_ALL_OT_EBR_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTEvidenceResourcesByCategory(
  category: string,
): OTEvidenceResource[] {
  try {
    if (!category || typeof category !== "string") {
      auditService.logWarning("INVALID_OT_EBR_CATEGORY", { category });
      return [];
    }
    return resources.filter((r) =>
      r.category.toLowerCase().includes(category.toLowerCase()),
    );
  } catch (error) {
    auditService.logError("GET_OT_EBR_BY_CATEGORY_ERROR", {
      category,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function searchOTEvidenceResources(query: string): OTEvidenceResource[] {
  try {
    if (!query || typeof query !== "string") {
      auditService.logWarning("INVALID_OT_EBR_SEARCH", { query });
      return [];
    }
    const lowerQuery = query.toLowerCase();
    return resources.filter(
      (r) =>
        r.name.toLowerCase().includes(lowerQuery) ||
        r.category.toLowerCase().includes(lowerQuery) ||
        r.description.toLowerCase().includes(lowerQuery),
    );
  } catch (error) {
    auditService.logError("SEARCH_OT_EBR_ERROR", {
      query,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTEvidenceResourcesByEvidenceLevel(
  level: 1 | 2 | 3,
): OTEvidenceResource[] {
  try {
    if (![1, 2, 3].includes(level)) {
      auditService.logWarning("INVALID_OT_EBR_EVIDENCE_LEVEL", { level });
      return [];
    }
    return resources.filter((r) => r.evidenceLevel === level);
  } catch (error) {
    auditService.logError("GET_OT_EBR_BY_EVIDENCE_ERROR", {
      level,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getKeyFindings(): string[] {
  try {
    const findings = new Set<string>();
    resources.forEach((r) => r.keyFindings.forEach((f) => findings.add(f)));
    return Array.from(findings).sort();
  } catch (error) {
    auditService.logError("GET_KEY_FINDINGS_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function validateClinicalApplication(
  resourceId: string,
  application: string,
): { valid: boolean; message: string } {
  try {
    const resource = getOTEvidenceResourceById(resourceId);
    if (!resource) return { valid: false, message: "Resource not found" };
    if (!application || typeof application !== "string")
      return { valid: false, message: "Application must be a string" };
    const hasApplication = resource.clinicalApplication.some((a) =>
      a.toLowerCase().includes(application.toLowerCase()),
    );
    return {
      valid: hasApplication,
      message: hasApplication ? "Application found" : "Application not found",
    };
  } catch (error) {
    auditService.logError("VALIDATE_CLINICAL_APPLICATION_ERROR", {
      resourceId,
      application,
      error: error instanceof Error ? error.message : String(error),
    });
    return { valid: false, message: "Validation error" };
  }
}

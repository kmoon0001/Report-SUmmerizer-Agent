/**
 * PT-OT Integration - Clinical Pathways
 */

import { auditService } from "../core/audit/AuditService";

export interface IntegratedClinicalPathway {
  id: string;
  name: string;
  category: string;
  description: string;
  ptRole: string[];
  otRole: string[];
  collaborationPoints: string[];
  sharedAssessments: string[];
  integratedInterventions: string[];
  evidenceLevel: 1 | 2 | 3;
  source: string;
  citation: string;
  lastUpdated: Date;
}

const pathways: IntegratedClinicalPathway[] = [
  {
    id: "path-001",
    name: "Stroke Rehabilitation",
    category: "Neurological Integration",
    description:
      "Integrated PT-OT management of stroke survivors addressing motor recovery, ADL/IADL, and community reintegration",
    ptRole: [
      "Motor recovery",
      "Gait training",
      "Balance training",
      "Strength training",
      "Functional mobility",
    ],
    otRole: [
      "ADL/IADL training",
      "Upper extremity function",
      "Cognitive strategies",
      "Adaptive equipment",
      "Community participation",
    ],
    collaborationPoints: [
      "Initial assessment",
      "Goal setting",
      "Weekly team meetings",
      "Discharge planning",
      "Home program coordination",
    ],
    sharedAssessments: [
      "Functional mobility",
      "Cognitive status",
      "Psychosocial adjustment",
      "Safety awareness",
      "Quality of life",
    ],
    integratedInterventions: [
      "Task-specific training",
      "Constraint-induced therapy",
      "Functional training",
      "Environmental modification",
      "Caregiver education",
    ],
    evidenceLevel: 1,
    source: "APTA/AOTA",
    citation: "APTA/AOTA (2020). Stroke Rehabilitation Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "path-002",
    name: "Spinal Cord Injury Rehabilitation",
    category: "Neurological Integration",
    description:
      "Integrated PT-OT management of SCI addressing mobility, ADL/IADL, and community reintegration",
    ptRole: [
      "Mobility training",
      "Wheelchair skills",
      "Transfer training",
      "Strength training",
      "Cardiovascular conditioning",
    ],
    otRole: [
      "ADL/IADL training",
      "Upper extremity function",
      "Adaptive equipment",
      "Environmental modification",
      "Vocational training",
    ],
    collaborationPoints: [
      "Initial assessment",
      "Goal setting",
      "Weekly team meetings",
      "Discharge planning",
      "Follow-up coordination",
    ],
    sharedAssessments: [
      "Functional mobility",
      "ADL/IADL performance",
      "Psychosocial adjustment",
      "Safety awareness",
      "Community participation",
    ],
    integratedInterventions: [
      "Functional training",
      "Adaptive equipment prescription",
      "Environmental modification",
      "Caregiver education",
      "Community reintegration",
    ],
    evidenceLevel: 1,
    source: "APTA/AOTA",
    citation: "APTA/AOTA (2020). SCI Rehabilitation Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "path-003",
    name: "Orthopedic Surgery Recovery",
    category: "Musculoskeletal Integration",
    description:
      "Integrated PT-OT management of post-surgical orthopedic patients addressing ROM, strength, and functional recovery",
    ptRole: [
      "ROM restoration",
      "Strength training",
      "Gait training",
      "Balance training",
      "Functional mobility",
    ],
    otRole: [
      "ADL/IADL training",
      "Upper extremity function",
      "Adaptive equipment",
      "Work conditioning",
      "Functional training",
    ],
    collaborationPoints: [
      "Post-operative assessment",
      "Phase progression",
      "Weekly team meetings",
      "Return to work planning",
      "Discharge coordination",
    ],
    sharedAssessments: [
      "ROM assessment",
      "Strength testing",
      "Functional mobility",
      "Pain assessment",
      "Psychosocial status",
    ],
    integratedInterventions: [
      "Progressive functional training",
      "Adaptive equipment prescription",
      "Work conditioning",
      "Home program coordination",
      "Return to activity planning",
    ],
    evidenceLevel: 1,
    source: "APTA/AOTA",
    citation: "APTA/AOTA (2020). Orthopedic Surgery Recovery Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "path-004",
    name: "Geriatric Fall Prevention & Management",
    category: "Geriatric Integration",
    description:
      "Integrated PT-OT management of fall risk and fall recovery in older adults",
    ptRole: [
      "Balance training",
      "Strength training",
      "Gait training",
      "Fall recovery",
      "Functional mobility",
    ],
    otRole: [
      "Home safety assessment",
      "ADL/IADL modification",
      "Adaptive equipment",
      "Environmental modification",
      "Caregiver education",
    ],
    collaborationPoints: [
      "Initial assessment",
      "Home safety evaluation",
      "Weekly team meetings",
      "Discharge planning",
      "Follow-up coordination",
    ],
    sharedAssessments: [
      "Fall risk assessment",
      "Functional mobility",
      "ADL/IADL performance",
      "Safety awareness",
      "Psychosocial status",
    ],
    integratedInterventions: [
      "Balance and strength training",
      "Home modification",
      "Adaptive equipment prescription",
      "Caregiver education",
      "Community resources",
    ],
    evidenceLevel: 1,
    source: "APTA/AOTA",
    citation: "APTA/AOTA (2020). Fall Prevention Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "path-005",
    name: "Cancer Rehabilitation",
    category: "Oncology Integration",
    description:
      "Integrated PT-OT management of cancer survivors addressing functional recovery and quality of life",
    ptRole: [
      "Strength training",
      "Aerobic conditioning",
      "Lymphedema management",
      "Functional mobility",
      "Fatigue management",
    ],
    otRole: [
      "ADL/IADL training",
      "Energy conservation",
      "Adaptive equipment",
      "Work conditioning",
      "Psychosocial support",
    ],
    collaborationPoints: [
      "Initial assessment",
      "Goal setting",
      "Weekly team meetings",
      "Return to work planning",
      "Discharge coordination",
    ],
    sharedAssessments: [
      "Functional status",
      "Fatigue assessment",
      "ADL/IADL performance",
      "Psychosocial adjustment",
      "Quality of life",
    ],
    integratedInterventions: [
      "Functional training",
      "Energy conservation strategies",
      "Adaptive equipment prescription",
      "Work conditioning",
      "Psychosocial support",
    ],
    evidenceLevel: 1,
    source: "APTA/AOTA",
    citation: "APTA/AOTA (2020). Cancer Rehabilitation Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
];

export function getIntegratedPathwayById(
  id: string,
): IntegratedClinicalPathway | undefined {
  try {
    if (!id || typeof id !== "string") {
      auditService.logWarning("INVALID_PATHWAY_ID", { id });
      return undefined;
    }
    const pathway = pathways.find((p) => p.id === id);
    if (!pathway) {
      auditService.logWarning("PATHWAY_NOT_FOUND", { id });
    }
    return pathway;
  } catch (error) {
    auditService.logError("GET_PATHWAY_ERROR", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

export function getAllIntegratedPathways(): IntegratedClinicalPathway[] {
  try {
    return [...pathways];
  } catch (error) {
    auditService.logError("GET_ALL_PATHWAYS_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getIntegratedPathwaysByCategory(
  category: string,
): IntegratedClinicalPathway[] {
  try {
    if (!category || typeof category !== "string") {
      auditService.logWarning("INVALID_PATHWAY_CATEGORY", { category });
      return [];
    }
    return pathways.filter((p) =>
      p.category.toLowerCase().includes(category.toLowerCase()),
    );
  } catch (error) {
    auditService.logError("GET_PATHWAYS_BY_CATEGORY_ERROR", {
      category,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function searchIntegratedPathways(
  query: string,
): IntegratedClinicalPathway[] {
  try {
    if (!query || typeof query !== "string") {
      auditService.logWarning("INVALID_PATHWAY_SEARCH", { query });
      return [];
    }
    const lowerQuery = query.toLowerCase();
    return pathways.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery),
    );
  } catch (error) {
    auditService.logError("SEARCH_PATHWAYS_ERROR", {
      query,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getIntegratedPathwaysByEvidenceLevel(
  level: 1 | 2 | 3,
): IntegratedClinicalPathway[] {
  try {
    if (![1, 2, 3].includes(level)) {
      auditService.logWarning("INVALID_PATHWAY_EVIDENCE_LEVEL", { level });
      return [];
    }
    return pathways.filter((p) => p.evidenceLevel === level);
  } catch (error) {
    auditService.logError("GET_PATHWAYS_BY_EVIDENCE_ERROR", {
      level,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getCollaborationPoints(): string[] {
  try {
    const points = new Set<string>();
    pathways.forEach((p) =>
      p.collaborationPoints.forEach((c) => points.add(c)),
    );
    return Array.from(points).sort();
  } catch (error) {
    auditService.logError("GET_COLLABORATION_POINTS_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function validateIntegratedIntervention(
  pathwayId: string,
  intervention: string,
): { valid: boolean; message: string } {
  try {
    const pathway = getIntegratedPathwayById(pathwayId);
    if (!pathway) return { valid: false, message: "Pathway not found" };
    if (!intervention || typeof intervention !== "string")
      return { valid: false, message: "Intervention must be a string" };
    const hasIntervention = pathway.integratedInterventions.some((i) =>
      i.toLowerCase().includes(intervention.toLowerCase()),
    );
    return {
      valid: hasIntervention,
      message: hasIntervention
        ? "Intervention found"
        : "Intervention not found",
    };
  } catch (error) {
    auditService.logError("VALIDATE_INTEGRATED_INTERVENTION_ERROR", {
      pathwayId,
      intervention,
      error: error instanceof Error ? error.message : String(error),
    });
    return { valid: false, message: "Validation error" };
  }
}

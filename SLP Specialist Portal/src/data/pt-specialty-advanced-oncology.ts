/**
 * PT Advanced Specialty - Oncology Rehabilitation
 */

import { auditService } from "../core/audit/AuditService";

export interface PTOncologyModule {
  id: string;
  name: string;
  category: string;
  description: string;
  cancerTypes: string[];
  assessmentFocus: string[];
  interventionStrategies: string[];
  precautions: string[];
  evidenceLevel: 1 | 2 | 3;
  source: string;
  citation: string;
  lastUpdated: Date;
}

const modules: PTOncologyModule[] = [
  {
    id: "pt-onc-001",
    name: "Breast Cancer Rehabilitation",
    category: "Oncology Rehabilitation",
    description:
      "PT management for breast cancer survivors addressing lymphedema, ROM, strength, and functional limitations",
    cancerTypes: [
      "Breast cancer",
      "Metastatic breast cancer",
      "Recurrent breast cancer",
    ],
    assessmentFocus: [
      "Lymphedema screening",
      "Shoulder ROM",
      "Strength assessment",
      "Functional mobility",
      "Pain assessment",
      "Psychosocial factors",
    ],
    interventionStrategies: [
      "Lymphedema management",
      "Shoulder rehabilitation",
      "Chest wall mobility",
      "Postural training",
      "Aerobic conditioning",
      "Strength training",
    ],
    precautions: [
      "Lymphedema risk",
      "Infection risk",
      "Radiation effects",
      "Chemotherapy side effects",
      "Cardiac toxicity",
      "Bone health",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Oncology Rehabilitation Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-onc-002",
    name: "Prostate Cancer Rehabilitation",
    category: "Oncology Rehabilitation",
    description:
      "PT management for prostate cancer survivors addressing incontinence, sexual dysfunction, and functional limitations",
    cancerTypes: ["Prostate cancer", "Metastatic prostate cancer"],
    assessmentFocus: [
      "Pelvic floor function",
      "Continence status",
      "Sexual function",
      "Strength assessment",
      "Functional mobility",
      "Pain assessment",
    ],
    interventionStrategies: [
      "Pelvic floor rehabilitation",
      "Continence training",
      "Strength training",
      "Aerobic conditioning",
      "Functional training",
      "Psychosocial support",
    ],
    precautions: [
      "Incontinence",
      "Sexual dysfunction",
      "Bone health",
      "Cardiovascular effects",
      "Hormonal effects",
      "Fatigue",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Prostate Cancer Rehabilitation Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-onc-003",
    name: "Lung Cancer Rehabilitation",
    category: "Oncology Rehabilitation",
    description:
      "PT management for lung cancer survivors addressing pulmonary function, aerobic capacity, and functional limitations",
    cancerTypes: ["Lung cancer", "Metastatic lung cancer"],
    assessmentFocus: [
      "Pulmonary function",
      "Aerobic capacity",
      "Dyspnea assessment",
      "Strength assessment",
      "Functional mobility",
      "Pain assessment",
    ],
    interventionStrategies: [
      "Pulmonary rehabilitation",
      "Aerobic conditioning",
      "Breathing techniques",
      "Strength training",
      "Functional training",
      "Energy conservation",
    ],
    precautions: [
      "Pulmonary toxicity",
      "Cardiac toxicity",
      "Chemotherapy effects",
      "Radiation effects",
      "Fatigue",
      "Bone health",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Lung Cancer Rehabilitation Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-onc-004",
    name: "Lymphoma & Leukemia Rehabilitation",
    category: "Oncology Rehabilitation",
    description:
      "PT management for hematologic cancer survivors addressing fatigue, bone health, and functional limitations",
    cancerTypes: ["Lymphoma", "Leukemia", "Multiple myeloma"],
    assessmentFocus: [
      "Fatigue assessment",
      "Bone health",
      "Strength assessment",
      "Aerobic capacity",
      "Functional mobility",
      "Pain assessment",
    ],
    interventionStrategies: [
      "Fatigue management",
      "Bone health optimization",
      "Strength training",
      "Aerobic conditioning",
      "Functional training",
      "Psychosocial support",
    ],
    precautions: [
      "Bone health",
      "Infection risk",
      "Chemotherapy effects",
      "Radiation effects",
      "Fatigue",
      "Cardiac effects",
    ],
    evidenceLevel: 2,
    source: "APTA",
    citation: "APTA (2020). Hematologic Cancer Rehabilitation Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-onc-005",
    name: "Cancer-Related Fatigue Management",
    category: "Oncology Rehabilitation",
    description:
      "PT management of cancer-related fatigue through exercise and rehabilitation strategies",
    cancerTypes: ["All cancer types"],
    assessmentFocus: [
      "Fatigue severity",
      "Aerobic capacity",
      "Strength assessment",
      "Functional mobility",
      "Sleep quality",
      "Psychosocial factors",
    ],
    interventionStrategies: [
      "Aerobic conditioning",
      "Strength training",
      "Energy conservation",
      "Sleep hygiene",
      "Stress management",
      "Psychosocial support",
    ],
    precautions: [
      "Overexertion",
      "Cardiac effects",
      "Bone health",
      "Infection risk",
      "Chemotherapy effects",
      "Radiation effects",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Cancer-Related Fatigue Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
];

export function getPTOncologyModuleById(
  id: string,
): PTOncologyModule | undefined {
  try {
    if (!id || typeof id !== "string") {
      auditService.logWarning("INVALID_PT_ONC_ID", { id });
      return undefined;
    }
    const module = modules.find((m) => m.id === id);
    if (!module) {
      auditService.logWarning("PT_ONC_NOT_FOUND", { id });
    }
    return module;
  } catch (error) {
    auditService.logError("GET_PT_ONC_ERROR", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

export function getAllPTOncologyModules(): PTOncologyModule[] {
  try {
    return [...modules];
  } catch (error) {
    auditService.logError("GET_ALL_PT_ONC_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getPTOncologyModulesByCategory(
  category: string,
): PTOncologyModule[] {
  try {
    if (!category || typeof category !== "string") {
      auditService.logWarning("INVALID_PT_ONC_CATEGORY", { category });
      return [];
    }
    return modules.filter((m) =>
      m.category.toLowerCase().includes(category.toLowerCase()),
    );
  } catch (error) {
    auditService.logError("GET_PT_ONC_BY_CATEGORY_ERROR", {
      category,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function searchPTOncologyModules(query: string): PTOncologyModule[] {
  try {
    if (!query || typeof query !== "string") {
      auditService.logWarning("INVALID_PT_ONC_SEARCH", { query });
      return [];
    }
    const lowerQuery = query.toLowerCase();
    return modules.filter(
      (m) =>
        m.name.toLowerCase().includes(lowerQuery) ||
        m.category.toLowerCase().includes(lowerQuery) ||
        m.description.toLowerCase().includes(lowerQuery),
    );
  } catch (error) {
    auditService.logError("SEARCH_PT_ONC_ERROR", {
      query,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getPTOncologyModulesByEvidenceLevel(
  level: 1 | 2 | 3,
): PTOncologyModule[] {
  try {
    if (![1, 2, 3].includes(level)) {
      auditService.logWarning("INVALID_PT_ONC_EVIDENCE_LEVEL", { level });
      return [];
    }
    return modules.filter((m) => m.evidenceLevel === level);
  } catch (error) {
    auditService.logError("GET_PT_ONC_BY_EVIDENCE_ERROR", {
      level,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getPTOncologyInterventionStrategies(): string[] {
  try {
    const strategies = new Set<string>();
    modules.forEach((m) =>
      m.interventionStrategies.forEach((s) => strategies.add(s)),
    );
    return Array.from(strategies).sort();
  } catch (error) {
    auditService.logError("GET_PT_ONC_STRATEGIES_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function validatePTOncologyPrecaution(
  moduleId: string,
  precaution: string,
): { valid: boolean; message: string } {
  try {
    const module = getPTOncologyModuleById(moduleId);
    if (!module) return { valid: false, message: "Module not found" };
    if (!precaution || typeof precaution !== "string")
      return { valid: false, message: "Precaution must be a string" };
    const hasPrecaution = module.precautions.some((p) =>
      p.toLowerCase().includes(precaution.toLowerCase()),
    );
    return {
      valid: hasPrecaution,
      message: hasPrecaution ? "Precaution found" : "Precaution not found",
    };
  } catch (error) {
    auditService.logError("VALIDATE_PT_ONC_PRECAUTION_ERROR", {
      moduleId,
      precaution,
      error: error instanceof Error ? error.message : String(error),
    });
    return { valid: false, message: "Validation error" };
  }
}

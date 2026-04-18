/**
 * OT Advanced Specialty - Oncology Rehabilitation
 */

import { auditService } from "../core/audit/AuditService";

export interface OTOncologyModule {
  id: string;
  name: string;
  category: string;
  description: string;
  cancerTypes: string[];
  assessmentFocus: string[];
  interventionStrategies: string[];
  adaptiveEquipment: string[];
  evidenceLevel: 1 | 2 | 3;
  source: string;
  citation: string;
  lastUpdated: Date;
}

const modules: OTOncologyModule[] = [
  {
    id: "ot-onc-001",
    name: "Breast Cancer Rehabilitation",
    category: "Oncology Rehabilitation",
    description:
      "OT management for breast cancer survivors addressing ADL/IADL, upper extremity function, and psychosocial adjustment",
    cancerTypes: [
      "Breast cancer",
      "Metastatic breast cancer",
      "Recurrent breast cancer",
    ],
    assessmentFocus: [
      "ADL/IADL performance",
      "Upper extremity function",
      "Lymphedema impact",
      "Psychosocial adjustment",
      "Work capacity",
      "Quality of life",
    ],
    interventionStrategies: [
      "ADL/IADL training",
      "Upper extremity rehabilitation",
      "Lymphedema management",
      "Psychosocial support",
      "Work conditioning",
      "Leisure activities",
    ],
    adaptiveEquipment: [
      "Compression garments",
      "Adaptive clothing",
      "Ergonomic equipment",
      "Assistive devices",
      "Mobility aids",
      "Leisure equipment",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Oncology Rehabilitation Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-onc-002",
    name: "Prostate Cancer Rehabilitation",
    category: "Oncology Rehabilitation",
    description:
      "OT management for prostate cancer survivors addressing ADL/IADL, sexual function, and psychosocial adjustment",
    cancerTypes: ["Prostate cancer", "Metastatic prostate cancer"],
    assessmentFocus: [
      "ADL/IADL performance",
      "Sexual function",
      "Psychosocial adjustment",
      "Work capacity",
      "Leisure participation",
      "Quality of life",
    ],
    interventionStrategies: [
      "ADL/IADL training",
      "Sexual function counseling",
      "Psychosocial support",
      "Work conditioning",
      "Leisure activities",
      "Community integration",
    ],
    adaptiveEquipment: [
      "Assistive devices",
      "Ergonomic equipment",
      "Mobility aids",
      "Leisure equipment",
      "Communication devices",
      "Environmental modifications",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Prostate Cancer Rehabilitation Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-onc-003",
    name: "Lung Cancer Rehabilitation",
    category: "Oncology Rehabilitation",
    description:
      "OT management for lung cancer survivors addressing ADL/IADL, energy conservation, and functional independence",
    cancerTypes: ["Lung cancer", "Metastatic lung cancer"],
    assessmentFocus: [
      "ADL/IADL performance",
      "Energy conservation",
      "Dyspnea impact",
      "Work capacity",
      "Leisure participation",
      "Quality of life",
    ],
    interventionStrategies: [
      "ADL/IADL training",
      "Energy conservation techniques",
      "Breathing strategies",
      "Work conditioning",
      "Leisure activities",
      "Community integration",
    ],
    adaptiveEquipment: [
      "Assistive devices",
      "Ergonomic equipment",
      "Mobility aids",
      "Oxygen equipment",
      "Environmental modifications",
      "Communication devices",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Lung Cancer Rehabilitation Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-onc-004",
    name: "Lymphoma & Leukemia Rehabilitation",
    category: "Oncology Rehabilitation",
    description:
      "OT management for hematologic cancer survivors addressing fatigue, ADL/IADL, and functional independence",
    cancerTypes: ["Lymphoma", "Leukemia", "Multiple myeloma"],
    assessmentFocus: [
      "ADL/IADL performance",
      "Fatigue impact",
      "Cognitive function",
      "Work capacity",
      "Leisure participation",
      "Quality of life",
    ],
    interventionStrategies: [
      "ADL/IADL training",
      "Fatigue management",
      "Cognitive strategies",
      "Work conditioning",
      "Leisure activities",
      "Psychosocial support",
    ],
    adaptiveEquipment: [
      "Assistive devices",
      "Ergonomic equipment",
      "Mobility aids",
      "Cognitive aids",
      "Environmental modifications",
      "Leisure equipment",
    ],
    evidenceLevel: 2,
    source: "AOTA",
    citation: "AOTA (2020). Hematologic Cancer Rehabilitation Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-onc-005",
    name: "Cancer-Related Fatigue Management",
    category: "Oncology Rehabilitation",
    description:
      "OT management of cancer-related fatigue through activity modification and energy conservation",
    cancerTypes: ["All cancer types"],
    assessmentFocus: [
      "Fatigue severity",
      "ADL/IADL performance",
      "Activity tolerance",
      "Work capacity",
      "Leisure participation",
      "Quality of life",
    ],
    interventionStrategies: [
      "Energy conservation",
      "Activity pacing",
      "ADL/IADL modification",
      "Work conditioning",
      "Leisure activities",
      "Psychosocial support",
    ],
    adaptiveEquipment: [
      "Assistive devices",
      "Ergonomic equipment",
      "Mobility aids",
      "Environmental modifications",
      "Leisure equipment",
      "Communication devices",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Cancer-Related Fatigue Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
];

export function getOTOncologyModuleById(
  id: string,
): OTOncologyModule | undefined {
  try {
    if (!id || typeof id !== "string") {
      auditService.logWarning("INVALID_OT_ONC_ID", { id });
      return undefined;
    }
    const module = modules.find((m) => m.id === id);
    if (!module) {
      auditService.logWarning("OT_ONC_NOT_FOUND", { id });
    }
    return module;
  } catch (error) {
    auditService.logError("GET_OT_ONC_ERROR", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

export function getAllOTOncologyModules(): OTOncologyModule[] {
  try {
    return [...modules];
  } catch (error) {
    auditService.logError("GET_ALL_OT_ONC_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTOncologyModulesByCategory(
  category: string,
): OTOncologyModule[] {
  try {
    if (!category || typeof category !== "string") {
      auditService.logWarning("INVALID_OT_ONC_CATEGORY", { category });
      return [];
    }
    return modules.filter((m) =>
      m.category.toLowerCase().includes(category.toLowerCase()),
    );
  } catch (error) {
    auditService.logError("GET_OT_ONC_BY_CATEGORY_ERROR", {
      category,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function searchOTOncologyModules(query: string): OTOncologyModule[] {
  try {
    if (!query || typeof query !== "string") {
      auditService.logWarning("INVALID_OT_ONC_SEARCH", { query });
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
    auditService.logError("SEARCH_OT_ONC_ERROR", {
      query,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTOncologyModulesByEvidenceLevel(
  level: 1 | 2 | 3,
): OTOncologyModule[] {
  try {
    if (![1, 2, 3].includes(level)) {
      auditService.logWarning("INVALID_OT_ONC_EVIDENCE_LEVEL", { level });
      return [];
    }
    return modules.filter((m) => m.evidenceLevel === level);
  } catch (error) {
    auditService.logError("GET_OT_ONC_BY_EVIDENCE_ERROR", {
      level,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTOncologyInterventionStrategies(): string[] {
  try {
    const strategies = new Set<string>();
    modules.forEach((m) =>
      m.interventionStrategies.forEach((s) => strategies.add(s)),
    );
    return Array.from(strategies).sort();
  } catch (error) {
    auditService.logError("GET_OT_ONC_STRATEGIES_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function validateOTOncologyAdaptiveEquipment(
  moduleId: string,
  equipment: string,
): { valid: boolean; message: string } {
  try {
    const module = getOTOncologyModuleById(moduleId);
    if (!module) return { valid: false, message: "Module not found" };
    if (!equipment || typeof equipment !== "string")
      return { valid: false, message: "Equipment must be a string" };
    const hasEquipment = module.adaptiveEquipment.some((e) =>
      e.toLowerCase().includes(equipment.toLowerCase()),
    );
    return {
      valid: hasEquipment,
      message: hasEquipment ? "Equipment found" : "Equipment not found",
    };
  } catch (error) {
    auditService.logError("VALIDATE_OT_ONC_EQUIPMENT_ERROR", {
      moduleId,
      equipment,
      error: error instanceof Error ? error.message : String(error),
    });
    return { valid: false, message: "Validation error" };
  }
}

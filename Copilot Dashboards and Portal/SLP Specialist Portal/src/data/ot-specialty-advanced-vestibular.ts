/**
 * OT Advanced Specialty - Vestibular Rehabilitation
 */

import { auditService } from "../core/audit/AuditService";

export interface OTVestibularModule {
  id: string;
  name: string;
  category: string;
  description: string;
  conditionTypes: string[];
  assessmentFocus: string[];
  interventionStrategies: string[];
  adaptiveEquipment: string[];
  evidenceLevel: 1 | 2 | 3;
  source: string;
  citation: string;
  lastUpdated: Date;
}

const modules: OTVestibularModule[] = [
  {
    id: "ot-vb-001",
    name: "Benign Paroxysmal Positional Vertigo (BPPV) Management",
    category: "Vestibular Rehabilitation",
    description:
      "OT management of BPPV addressing ADL/IADL, balance, and functional independence",
    conditionTypes: [
      "Posterior canal BPPV",
      "Anterior canal BPPV",
      "Horizontal canal BPPV",
      "Recurrent BPPV",
    ],
    assessmentFocus: [
      "ADL/IADL performance",
      "Balance assessment",
      "Vertigo triggers",
      "Functional mobility",
      "Safety awareness",
    ],
    interventionStrategies: [
      "ADL/IADL modification",
      "Environmental modification",
      "Balance training",
      "Habituation strategies",
      "Home exercise program",
    ],
    adaptiveEquipment: [
      "Balance aids",
      "Mobility aids",
      "Adaptive clothing",
      "Environmental modifications",
      "Safety equipment",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). BPPV Management Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-vb-002",
    name: "Vestibular Neuritis & Labyrinthitis Management",
    category: "Vestibular Rehabilitation",
    description:
      "OT management of vestibular neuritis and labyrinthitis addressing ADL/IADL, balance, and functional recovery",
    conditionTypes: [
      "Vestibular neuritis",
      "Labyrinthitis",
      "Viral labyrinthitis",
      "Bacterial labyrinthitis",
    ],
    assessmentFocus: [
      "ADL/IADL performance",
      "Balance assessment",
      "Vertigo severity",
      "Functional mobility",
      "Safety awareness",
    ],
    interventionStrategies: [
      "ADL/IADL modification",
      "Environmental modification",
      "Balance training",
      "Habituation strategies",
      "Home exercise program",
    ],
    adaptiveEquipment: [
      "Balance aids",
      "Mobility aids",
      "Adaptive clothing",
      "Environmental modifications",
      "Safety equipment",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Vestibular Neuritis Management Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-vb-003",
    name: "Meniere's Disease Management",
    category: "Vestibular Rehabilitation",
    description:
      "OT management of Meniere's disease addressing ADL/IADL, balance, and functional independence",
    conditionTypes: [
      "Meniere's disease",
      "Recurrent vertigo",
      "Fluctuating hearing loss",
      "Tinnitus",
    ],
    assessmentFocus: [
      "ADL/IADL performance",
      "Balance assessment",
      "Hearing impact",
      "Functional mobility",
      "Safety awareness",
    ],
    interventionStrategies: [
      "ADL/IADL modification",
      "Environmental modification",
      "Balance training",
      "Communication strategies",
      "Home exercise program",
    ],
    adaptiveEquipment: [
      "Balance aids",
      "Mobility aids",
      "Hearing aids",
      "Communication devices",
      "Safety equipment",
    ],
    evidenceLevel: 2,
    source: "AOTA",
    citation: "AOTA (2020). Meniere's Disease Management Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-vb-004",
    name: "Central Vestibular Disorders Management",
    category: "Vestibular Rehabilitation",
    description:
      "OT management of central vestibular disorders addressing ADL/IADL, balance, and functional mobility",
    conditionTypes: [
      "Stroke",
      "Cerebellar dysfunction",
      "Brainstem lesions",
      "Multiple sclerosis",
    ],
    assessmentFocus: [
      "ADL/IADL performance",
      "Balance assessment",
      "Coordination assessment",
      "Functional mobility",
      "Cognitive function",
    ],
    interventionStrategies: [
      "ADL/IADL training",
      "Environmental modification",
      "Balance training",
      "Coordination training",
      "Functional training",
    ],
    adaptiveEquipment: [
      "Balance aids",
      "Mobility aids",
      "Adaptive clothing",
      "Cognitive aids",
      "Safety equipment",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Central Vestibular Disorder Management Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-vb-005",
    name: "Vestibular Migraine Management",
    category: "Vestibular Rehabilitation",
    description:
      "OT management of vestibular migraine addressing ADL/IADL, balance, and functional independence",
    conditionTypes: [
      "Vestibular migraine",
      "Migraine-associated vertigo",
      "Recurrent vertigo",
    ],
    assessmentFocus: [
      "ADL/IADL performance",
      "Migraine triggers",
      "Balance assessment",
      "Functional mobility",
      "Safety awareness",
    ],
    interventionStrategies: [
      "ADL/IADL modification",
      "Trigger identification",
      "Environmental modification",
      "Balance training",
      "Home exercise program",
    ],
    adaptiveEquipment: [
      "Balance aids",
      "Mobility aids",
      "Adaptive clothing",
      "Environmental modifications",
      "Safety equipment",
    ],
    evidenceLevel: 2,
    source: "AOTA",
    citation: "AOTA (2020). Vestibular Migraine Management Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
];

export function getOTVestibularModuleById(
  id: string,
): OTVestibularModule | undefined {
  try {
    if (!id || typeof id !== "string") {
      auditService.logWarning("INVALID_OT_VB_ID", { id });
      return undefined;
    }
    const module = modules.find((m) => m.id === id);
    if (!module) {
      auditService.logWarning("OT_VB_NOT_FOUND", { id });
    }
    return module;
  } catch (error) {
    auditService.logError("GET_OT_VB_ERROR", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

export function getAllOTVestibularModules(): OTVestibularModule[] {
  try {
    return [...modules];
  } catch (error) {
    auditService.logError("GET_ALL_OT_VB_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTVestibularModulesByCategory(
  category: string,
): OTVestibularModule[] {
  try {
    if (!category || typeof category !== "string") {
      auditService.logWarning("INVALID_OT_VB_CATEGORY", { category });
      return [];
    }
    return modules.filter((m) =>
      m.category.toLowerCase().includes(category.toLowerCase()),
    );
  } catch (error) {
    auditService.logError("GET_OT_VB_BY_CATEGORY_ERROR", {
      category,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function searchOTVestibularModules(query: string): OTVestibularModule[] {
  try {
    if (!query || typeof query !== "string") {
      auditService.logWarning("INVALID_OT_VB_SEARCH", { query });
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
    auditService.logError("SEARCH_OT_VB_ERROR", {
      query,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTVestibularModulesByEvidenceLevel(
  level: 1 | 2 | 3,
): OTVestibularModule[] {
  try {
    if (![1, 2, 3].includes(level)) {
      auditService.logWarning("INVALID_OT_VB_EVIDENCE_LEVEL", { level });
      return [];
    }
    return modules.filter((m) => m.evidenceLevel === level);
  } catch (error) {
    auditService.logError("GET_OT_VB_BY_EVIDENCE_ERROR", {
      level,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTVestibularInterventionStrategies(): string[] {
  try {
    const strategies = new Set<string>();
    modules.forEach((m) =>
      m.interventionStrategies.forEach((s) => strategies.add(s)),
    );
    return Array.from(strategies).sort();
  } catch (error) {
    auditService.logError("GET_OT_VB_STRATEGIES_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function validateOTVestibularAdaptiveEquipment(
  moduleId: string,
  equipment: string,
): { valid: boolean; message: string } {
  try {
    const module = getOTVestibularModuleById(moduleId);
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
    auditService.logError("VALIDATE_OT_VB_EQUIPMENT_ERROR", {
      moduleId,
      equipment,
      error: error instanceof Error ? error.message : String(error),
    });
    return { valid: false, message: "Validation error" };
  }
}

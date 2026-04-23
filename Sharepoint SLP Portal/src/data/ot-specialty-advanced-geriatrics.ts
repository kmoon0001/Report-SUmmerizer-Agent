/**
 * OT Advanced Specialty - Geriatric Rehabilitation
 */

import { auditService } from "../core/audit/AuditService";

export interface OTGeriatricsModule {
  id: string;
  name: string;
  category: string;
  description: string;
  ageGroups: string[];
  clinicalFocus: string[];
  interventionStrategies: string[];
  adaptiveEquipment: string[];
  evidenceLevel: 1 | 2 | 3;
  source: string;
  citation: string;
  lastUpdated: Date;
}

const modules: OTGeriatricsModule[] = [
  {
    id: "ot-ger-001",
    name: "Fall Prevention & Safety",
    category: "Geriatric Rehabilitation",
    description:
      "OT management of fall risk addressing home safety, ADL modifications, and environmental adaptations",
    ageGroups: ["65-74 years", "75-84 years", "85+ years"],
    clinicalFocus: [
      "Home safety assessment",
      "Fall risk assessment",
      "ADL modification",
      "Environmental assessment",
      "Assistive device prescription",
    ],
    interventionStrategies: [
      "Home safety assessment",
      "Environmental modification",
      "Assistive device training",
      "ADL adaptation",
      "Caregiver education",
    ],
    adaptiveEquipment: [
      "Grab bars",
      "Raised toilet seats",
      "Shower chairs",
      "Walkers",
      "Canes",
      "Lighting modifications",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Fall Prevention Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-ger-002",
    name: "Cognitive Decline & Dementia Management",
    category: "Geriatric Rehabilitation",
    description:
      "OT management of cognitive decline and dementia addressing ADL/IADL, safety, and quality of life",
    ageGroups: ["65-74 years", "75-84 years", "85+ years"],
    clinicalFocus: [
      "Cognitive assessment",
      "ADL/IADL performance",
      "Safety awareness",
      "Behavioral management",
      "Quality of life",
    ],
    interventionStrategies: [
      "Cognitive retraining",
      "ADL/IADL training",
      "Environmental modification",
      "Caregiver support",
      "Behavioral strategies",
    ],
    adaptiveEquipment: [
      "Cognitive aids",
      "Simplified tools",
      "Visual cues",
      "Memory aids",
      "Safety devices",
      "Communication aids",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Dementia Management Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-ger-003",
    name: "Post-Stroke Rehabilitation",
    category: "Geriatric Rehabilitation",
    description:
      "OT management of stroke survivors addressing ADL/IADL, upper extremity function, and community integration",
    ageGroups: ["65-74 years", "75-84 years", "85+ years"],
    clinicalFocus: [
      "ADL/IADL performance",
      "Upper extremity function",
      "Cognitive-motor integration",
      "Psychosocial adjustment",
      "Community participation",
    ],
    interventionStrategies: [
      "ADL/IADL training",
      "Upper extremity rehabilitation",
      "Constraint-induced therapy",
      "Cognitive strategies",
      "Community reintegration",
    ],
    adaptiveEquipment: [
      "One-handed aids",
      "Adaptive clothing",
      "Ergonomic equipment",
      "Mobility aids",
      "Communication devices",
      "Leisure equipment",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Stroke Rehabilitation Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-ger-004",
    name: "Arthritis & Joint Protection",
    category: "Geriatric Rehabilitation",
    description:
      "OT management of arthritis addressing pain management, joint protection, and functional independence",
    ageGroups: ["65-74 years", "75-84 years", "85+ years"],
    clinicalFocus: [
      "Pain management",
      "Joint protection",
      "ADL/IADL performance",
      "Strength maintenance",
      "Activity modification",
    ],
    interventionStrategies: [
      "Joint protection education",
      "Energy conservation",
      "ADL/IADL modification",
      "Splinting",
      "Activity adaptation",
    ],
    adaptiveEquipment: [
      "Splints",
      "Adaptive utensils",
      "Ergonomic equipment",
      "Assistive devices",
      "Joint protection aids",
      "Compression garments",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Arthritis Management Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-ger-005",
    name: "Vision & Hearing Loss Management",
    category: "Geriatric Rehabilitation",
    description:
      "OT management of sensory loss addressing ADL/IADL, safety, and communication strategies",
    ageGroups: ["65-74 years", "75-84 years", "85+ years"],
    clinicalFocus: [
      "Vision assessment",
      "Hearing assessment",
      "ADL/IADL adaptation",
      "Safety awareness",
      "Communication strategies",
    ],
    interventionStrategies: [
      "Environmental modification",
      "Lighting optimization",
      "Communication strategies",
      "ADL/IADL adaptation",
      "Assistive device training",
    ],
    adaptiveEquipment: [
      "Magnification aids",
      "Lighting devices",
      "Hearing aids",
      "Communication devices",
      "Visual cues",
      "Tactile aids",
    ],
    evidenceLevel: 2,
    source: "AOTA",
    citation: "AOTA (2020). Sensory Loss Management Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
];

export function getOTGeriatricsModuleById(
  id: string,
): OTGeriatricsModule | undefined {
  try {
    if (!id || typeof id !== "string") {
      auditService.logWarning("INVALID_OT_GER_ID", { id });
      return undefined;
    }
    const module = modules.find((m) => m.id === id);
    if (!module) {
      auditService.logWarning("OT_GER_NOT_FOUND", { id });
    }
    return module;
  } catch (error) {
    auditService.logError("GET_OT_GER_ERROR", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

export function getAllOTGeriatricsModules(): OTGeriatricsModule[] {
  try {
    return [...modules];
  } catch (error) {
    auditService.logError("GET_ALL_OT_GER_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTGeriatricsModulesByCategory(
  category: string,
): OTGeriatricsModule[] {
  try {
    if (!category || typeof category !== "string") {
      auditService.logWarning("INVALID_OT_GER_CATEGORY", { category });
      return [];
    }
    return modules.filter((m) =>
      m.category.toLowerCase().includes(category.toLowerCase()),
    );
  } catch (error) {
    auditService.logError("GET_OT_GER_BY_CATEGORY_ERROR", {
      category,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function searchOTGeriatricsModules(query: string): OTGeriatricsModule[] {
  try {
    if (!query || typeof query !== "string") {
      auditService.logWarning("INVALID_OT_GER_SEARCH", { query });
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
    auditService.logError("SEARCH_OT_GER_ERROR", {
      query,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTGeriatricsModulesByEvidenceLevel(
  level: 1 | 2 | 3,
): OTGeriatricsModule[] {
  try {
    if (![1, 2, 3].includes(level)) {
      auditService.logWarning("INVALID_OT_GER_EVIDENCE_LEVEL", { level });
      return [];
    }
    return modules.filter((m) => m.evidenceLevel === level);
  } catch (error) {
    auditService.logError("GET_OT_GER_BY_EVIDENCE_ERROR", {
      level,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTGeriatricsInterventionStrategies(): string[] {
  try {
    const strategies = new Set<string>();
    modules.forEach((m) =>
      m.interventionStrategies.forEach((s) => strategies.add(s)),
    );
    return Array.from(strategies).sort();
  } catch (error) {
    auditService.logError("GET_OT_GER_STRATEGIES_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function validateOTGeriatricsAdaptiveEquipment(
  moduleId: string,
  equipment: string,
): { valid: boolean; message: string } {
  try {
    const module = getOTGeriatricsModuleById(moduleId);
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
    auditService.logError("VALIDATE_OT_GER_EQUIPMENT_ERROR", {
      moduleId,
      equipment,
      error: error instanceof Error ? error.message : String(error),
    });
    return { valid: false, message: "Validation error" };
  }
}

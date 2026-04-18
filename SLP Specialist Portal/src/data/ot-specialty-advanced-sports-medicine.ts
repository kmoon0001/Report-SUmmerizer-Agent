/**
 * OT Advanced Specialty - Sports Medicine Rehabilitation
 */

import { auditService } from "../core/audit/AuditService";

export interface OTSportsMedicineModule {
  id: string;
  name: string;
  category: string;
  description: string;
  injuryTypes: string[];
  assessmentFocus: string[];
  interventionStrategies: string[];
  adaptiveEquipment: string[];
  evidenceLevel: 1 | 2 | 3;
  source: string;
  citation: string;
  lastUpdated: Date;
}

const modules: OTSportsMedicineModule[] = [
  {
    id: "ot-sm-001",
    name: "Hand & Wrist Injury Management",
    category: "Sports Medicine Rehabilitation",
    description:
      "OT management of hand and wrist injuries addressing fine motor function, grip strength, and return to sport",
    injuryTypes: [
      "Fractures",
      "Sprains",
      "Tendon injuries",
      "Nerve injuries",
      "Soft tissue injuries",
    ],
    assessmentFocus: [
      "Hand function",
      "Grip strength",
      "Fine motor skills",
      "Sensory function",
      "Sport-specific demands",
    ],
    interventionStrategies: [
      "ROM restoration",
      "Strength training",
      "Fine motor training",
      "Splinting",
      "Sport-specific training",
    ],
    adaptiveEquipment: [
      "Splints",
      "Grips",
      "Adaptive tools",
      "Compression garments",
      "Sport-specific equipment",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Hand Injury Rehabilitation Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-sm-002",
    name: "Upper Extremity Injury Management",
    category: "Sports Medicine Rehabilitation",
    description:
      "OT management of upper extremity injuries addressing ADL/IADL, functional mobility, and return to sport",
    injuryTypes: [
      "Shoulder injuries",
      "Elbow injuries",
      "Arm injuries",
      "Nerve injuries",
      "Soft tissue injuries",
    ],
    assessmentFocus: [
      "ADL/IADL performance",
      "Upper extremity function",
      "Strength assessment",
      "Functional movement",
      "Sport-specific demands",
    ],
    interventionStrategies: [
      "ROM restoration",
      "Strength training",
      "Functional training",
      "Adaptive strategies",
      "Sport-specific training",
    ],
    adaptiveEquipment: [
      "Slings",
      "Splints",
      "Adaptive tools",
      "Ergonomic equipment",
      "Sport-specific equipment",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Upper Extremity Injury Rehabilitation Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-sm-003",
    name: "Concussion & Cognitive Management",
    category: "Sports Medicine Rehabilitation",
    description:
      "OT management of concussions addressing cognitive function, visual processing, and return to sport",
    injuryTypes: [
      "Concussion",
      "Mild traumatic brain injury",
      "Post-concussion syndrome",
    ],
    assessmentFocus: [
      "Cognitive function",
      "Visual processing",
      "Balance",
      "Sensory processing",
      "Sport-specific demands",
    ],
    interventionStrategies: [
      "Cognitive rehabilitation",
      "Visual processing training",
      "Sensory integration",
      "Gradual return to activity",
      "Sport-specific training",
    ],
    adaptiveEquipment: [
      "Cognitive aids",
      "Visual aids",
      "Sensory tools",
      "Communication devices",
      "Sport-specific equipment",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Concussion Management Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-sm-004",
    name: "Ergonomic Assessment & Prevention",
    category: "Sports Medicine Rehabilitation",
    description:
      "OT ergonomic assessment and injury prevention for athletes addressing posture, positioning, and equipment setup",
    injuryTypes: [
      "Overuse injuries",
      "Postural injuries",
      "Repetitive strain",
      "Prevention focus",
    ],
    assessmentFocus: [
      "Posture assessment",
      "Equipment setup",
      "Ergonomic factors",
      "Sport-specific demands",
      "Injury prevention",
    ],
    interventionStrategies: [
      "Ergonomic modification",
      "Postural training",
      "Equipment optimization",
      "Injury prevention education",
      "Sport-specific training",
    ],
    adaptiveEquipment: [
      "Ergonomic equipment",
      "Postural aids",
      "Sport-specific equipment",
      "Protective equipment",
      "Positioning devices",
    ],
    evidenceLevel: 2,
    source: "AOTA",
    citation: "AOTA (2020). Ergonomic Prevention Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-sm-005",
    name: "Psychological & Psychosocial Support",
    category: "Sports Medicine Rehabilitation",
    description:
      "OT psychological and psychosocial support for injured athletes addressing coping, motivation, and return to sport",
    injuryTypes: [
      "All injury types",
      "Psychological impact",
      "Motivation issues",
      "Anxiety/depression",
    ],
    assessmentFocus: [
      "Psychological status",
      "Coping strategies",
      "Motivation level",
      "Psychosocial factors",
      "Sport-specific demands",
    ],
    interventionStrategies: [
      "Coping strategies",
      "Motivational interviewing",
      "Stress management",
      "Goal setting",
      "Psychosocial support",
    ],
    adaptiveEquipment: [
      "Communication devices",
      "Relaxation tools",
      "Goal-setting aids",
      "Support resources",
      "Sport-specific equipment",
    ],
    evidenceLevel: 2,
    source: "AOTA",
    citation: "AOTA (2020). Psychological Support Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
];

export function getOTSportsMedicineModuleById(
  id: string,
): OTSportsMedicineModule | undefined {
  try {
    if (!id || typeof id !== "string") {
      auditService.logWarning("INVALID_OT_SM_ID", { id });
      return undefined;
    }
    const module = modules.find((m) => m.id === id);
    if (!module) {
      auditService.logWarning("OT_SM_NOT_FOUND", { id });
    }
    return module;
  } catch (error) {
    auditService.logError("GET_OT_SM_ERROR", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

export function getAllOTSportsMedicineModules(): OTSportsMedicineModule[] {
  try {
    return [...modules];
  } catch (error) {
    auditService.logError("GET_ALL_OT_SM_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTSportsMedicineModulesByCategory(
  category: string,
): OTSportsMedicineModule[] {
  try {
    if (!category || typeof category !== "string") {
      auditService.logWarning("INVALID_OT_SM_CATEGORY", { category });
      return [];
    }
    return modules.filter((m) =>
      m.category.toLowerCase().includes(category.toLowerCase()),
    );
  } catch (error) {
    auditService.logError("GET_OT_SM_BY_CATEGORY_ERROR", {
      category,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function searchOTSportsMedicineModules(
  query: string,
): OTSportsMedicineModule[] {
  try {
    if (!query || typeof query !== "string") {
      auditService.logWarning("INVALID_OT_SM_SEARCH", { query });
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
    auditService.logError("SEARCH_OT_SM_ERROR", {
      query,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTSportsMedicineModulesByEvidenceLevel(
  level: 1 | 2 | 3,
): OTSportsMedicineModule[] {
  try {
    if (![1, 2, 3].includes(level)) {
      auditService.logWarning("INVALID_OT_SM_EVIDENCE_LEVEL", { level });
      return [];
    }
    return modules.filter((m) => m.evidenceLevel === level);
  } catch (error) {
    auditService.logError("GET_OT_SM_BY_EVIDENCE_ERROR", {
      level,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTSportsMedicineInterventionStrategies(): string[] {
  try {
    const strategies = new Set<string>();
    modules.forEach((m) =>
      m.interventionStrategies.forEach((s) => strategies.add(s)),
    );
    return Array.from(strategies).sort();
  } catch (error) {
    auditService.logError("GET_OT_SM_STRATEGIES_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function validateOTSportsMedicineAdaptiveEquipment(
  moduleId: string,
  equipment: string,
): { valid: boolean; message: string } {
  try {
    const module = getOTSportsMedicineModuleById(moduleId);
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
    auditService.logError("VALIDATE_OT_SM_EQUIPMENT_ERROR", {
      moduleId,
      equipment,
      error: error instanceof Error ? error.message : String(error),
    });
    return { valid: false, message: "Validation error" };
  }
}

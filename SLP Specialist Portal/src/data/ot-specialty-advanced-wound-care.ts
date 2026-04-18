/**
 * OT Advanced Specialty - Wound Care Rehabilitation
 */

import { auditService } from "../core/audit/AuditService";

export interface OTWoundCareModule {
  id: string;
  name: string;
  category: string;
  description: string;
  woundTypes: string[];
  assessmentFocus: string[];
  interventionStrategies: string[];
  adaptiveEquipment: string[];
  evidenceLevel: 1 | 2 | 3;
  source: string;
  citation: string;
  lastUpdated: Date;
}

const modules: OTWoundCareModule[] = [
  {
    id: "ot-wc-001",
    name: "Pressure Ulcer Prevention & Management",
    category: "Wound Care Rehabilitation",
    description:
      "OT management of pressure ulcers addressing positioning, ADL/IADL, and wound healing",
    woundTypes: ["Stage I", "Stage II", "Stage III", "Stage IV", "Unstageable"],
    assessmentFocus: [
      "Wound assessment",
      "ADL/IADL performance",
      "Positioning tolerance",
      "Skin integrity",
      "Nutritional status",
    ],
    interventionStrategies: [
      "Positioning strategies",
      "ADL/IADL modification",
      "Pressure relief",
      "Skin care education",
      "Environmental modification",
    ],
    adaptiveEquipment: [
      "Pressure relief cushions",
      "Positioning aids",
      "Adaptive clothing",
      "Skin care products",
      "Mobility aids",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Pressure Ulcer Management Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-wc-002",
    name: "Diabetic Foot Ulcer Prevention & Management",
    category: "Wound Care Rehabilitation",
    description:
      "OT management of diabetic foot ulcers addressing ADL/IADL, footwear, and wound healing",
    woundTypes: [
      "Neuropathic ulcers",
      "Ischemic ulcers",
      "Mixed ulcers",
      "Plantar ulcers",
    ],
    assessmentFocus: [
      "Wound assessment",
      "ADL/IADL performance",
      "Footwear assessment",
      "Neuropathy impact",
      "Self-care ability",
    ],
    interventionStrategies: [
      "Footwear prescription",
      "ADL/IADL modification",
      "Skin care education",
      "Self-monitoring training",
      "Environmental modification",
    ],
    adaptiveEquipment: [
      "Therapeutic footwear",
      "Pressure relief insoles",
      "Adaptive clothing",
      "Skin care products",
      "Mobility aids",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Diabetic Foot Ulcer Management Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-wc-003",
    name: "Venous Insufficiency & Ulcer Management",
    category: "Wound Care Rehabilitation",
    description:
      "OT management of venous insufficiency and ulcers addressing ADL/IADL, compression, and wound healing",
    woundTypes: ["Venous ulcers", "Mixed ulcers", "Venous insufficiency"],
    assessmentFocus: [
      "Wound assessment",
      "ADL/IADL performance",
      "Edema management",
      "Compression tolerance",
      "Mobility status",
    ],
    interventionStrategies: [
      "Compression garment training",
      "ADL/IADL modification",
      "Elevation strategies",
      "Skin care education",
      "Environmental modification",
    ],
    adaptiveEquipment: [
      "Compression garments",
      "Elevation aids",
      "Adaptive clothing",
      "Skin care products",
      "Mobility aids",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Venous Ulcer Management Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-wc-004",
    name: "Burn Wound Management & Scar Prevention",
    category: "Wound Care Rehabilitation",
    description:
      "OT management of burn wounds addressing ADL/IADL, scar management, and functional recovery",
    woundTypes: [
      "Superficial burns",
      "Partial thickness burns",
      "Full thickness burns",
      "Mixed burns",
    ],
    assessmentFocus: [
      "Wound assessment",
      "ADL/IADL performance",
      "Scar assessment",
      "ROM assessment",
      "Functional status",
    ],
    interventionStrategies: [
      "Scar management",
      "ADL/IADL training",
      "Positioning strategies",
      "Compression therapy",
      "Functional training",
    ],
    adaptiveEquipment: [
      "Compression garments",
      "Splints",
      "Positioning aids",
      "Adaptive clothing",
      "Skin care products",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Burn Wound Management Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-wc-005",
    name: "Surgical Wound & Post-Operative Management",
    category: "Wound Care Rehabilitation",
    description:
      "OT management of surgical wounds addressing ADL/IADL, scar management, and functional recovery",
    woundTypes: [
      "Surgical incisions",
      "Dehiscence",
      "Infection",
      "Complications",
    ],
    assessmentFocus: [
      "Wound assessment",
      "ADL/IADL performance",
      "Healing status",
      "Scar assessment",
      "Functional status",
    ],
    interventionStrategies: [
      "Progressive ADL/IADL training",
      "Scar management",
      "Positioning strategies",
      "Functional training",
      "Pain management",
    ],
    adaptiveEquipment: [
      "Compression garments",
      "Positioning aids",
      "Adaptive clothing",
      "Skin care products",
      "Mobility aids",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Post-Operative Wound Management Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
];

export function getOTWoundCareModuleById(
  id: string,
): OTWoundCareModule | undefined {
  try {
    if (!id || typeof id !== "string") {
      auditService.logWarning("INVALID_OT_WC_ID", { id });
      return undefined;
    }
    const module = modules.find((m) => m.id === id);
    if (!module) {
      auditService.logWarning("OT_WC_NOT_FOUND", { id });
    }
    return module;
  } catch (error) {
    auditService.logError("GET_OT_WC_ERROR", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

export function getAllOTWoundCareModules(): OTWoundCareModule[] {
  try {
    return [...modules];
  } catch (error) {
    auditService.logError("GET_ALL_OT_WC_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTWoundCareModulesByCategory(
  category: string,
): OTWoundCareModule[] {
  try {
    if (!category || typeof category !== "string") {
      auditService.logWarning("INVALID_OT_WC_CATEGORY", { category });
      return [];
    }
    return modules.filter((m) =>
      m.category.toLowerCase().includes(category.toLowerCase()),
    );
  } catch (error) {
    auditService.logError("GET_OT_WC_BY_CATEGORY_ERROR", {
      category,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function searchOTWoundCareModules(query: string): OTWoundCareModule[] {
  try {
    if (!query || typeof query !== "string") {
      auditService.logWarning("INVALID_OT_WC_SEARCH", { query });
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
    auditService.logError("SEARCH_OT_WC_ERROR", {
      query,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTWoundCareModulesByEvidenceLevel(
  level: 1 | 2 | 3,
): OTWoundCareModule[] {
  try {
    if (![1, 2, 3].includes(level)) {
      auditService.logWarning("INVALID_OT_WC_EVIDENCE_LEVEL", { level });
      return [];
    }
    return modules.filter((m) => m.evidenceLevel === level);
  } catch (error) {
    auditService.logError("GET_OT_WC_BY_EVIDENCE_ERROR", {
      level,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTWoundCareInterventionStrategies(): string[] {
  try {
    const strategies = new Set<string>();
    modules.forEach((m) =>
      m.interventionStrategies.forEach((s) => strategies.add(s)),
    );
    return Array.from(strategies).sort();
  } catch (error) {
    auditService.logError("GET_OT_WC_STRATEGIES_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function validateOTWoundCareAdaptiveEquipment(
  moduleId: string,
  equipment: string,
): { valid: boolean; message: string } {
  try {
    const module = getOTWoundCareModuleById(moduleId);
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
    auditService.logError("VALIDATE_OT_WC_EQUIPMENT_ERROR", {
      moduleId,
      equipment,
      error: error instanceof Error ? error.message : String(error),
    });
    return { valid: false, message: "Validation error" };
  }
}

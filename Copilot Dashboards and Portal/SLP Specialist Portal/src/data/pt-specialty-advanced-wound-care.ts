/**
 * PT Advanced Specialty - Wound Care Rehabilitation
 */

import { auditService } from "../core/audit/AuditService";

export interface PTWoundCareModule {
  id: string;
  name: string;
  category: string;
  description: string;
  woundTypes: string[];
  assessmentFocus: string[];
  interventionStrategies: string[];
  precautions: string[];
  evidenceLevel: 1 | 2 | 3;
  source: string;
  citation: string;
  lastUpdated: Date;
}

const modules: PTWoundCareModule[] = [
  {
    id: "pt-wc-001",
    name: "Pressure Ulcer Management",
    category: "Wound Care Rehabilitation",
    description:
      "PT management of pressure ulcers addressing positioning, mobility, and wound healing",
    woundTypes: ["Stage I", "Stage II", "Stage III", "Stage IV", "Unstageable"],
    assessmentFocus: [
      "Wound assessment",
      "Tissue viability",
      "Mobility status",
      "Positioning tolerance",
      "Nutritional status",
    ],
    interventionStrategies: [
      "Positioning strategies",
      "Mobility training",
      "Pressure relief",
      "Wound care coordination",
      "Functional training",
    ],
    precautions: [
      "Infection risk",
      "Tissue fragility",
      "Pain management",
      "Nutritional support",
      "Skin integrity",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Pressure Ulcer Management Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-wc-002",
    name: "Diabetic Foot Ulcer Management",
    category: "Wound Care Rehabilitation",
    description:
      "PT management of diabetic foot ulcers addressing offloading, gait training, and wound healing",
    woundTypes: [
      "Neuropathic ulcers",
      "Ischemic ulcers",
      "Mixed ulcers",
      "Plantar ulcers",
    ],
    assessmentFocus: [
      "Wound assessment",
      "Vascular status",
      "Neuropathy assessment",
      "Gait analysis",
      "Footwear assessment",
    ],
    interventionStrategies: [
      "Offloading strategies",
      "Gait training",
      "Footwear prescription",
      "Wound care coordination",
      "Functional training",
    ],
    precautions: [
      "Infection risk",
      "Vascular compromise",
      "Neuropathy",
      "Tissue fragility",
      "Amputation risk",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Diabetic Foot Ulcer Management Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-wc-003",
    name: "Venous Insufficiency & Ulcer Management",
    category: "Wound Care Rehabilitation",
    description:
      "PT management of venous insufficiency and ulcers addressing compression, mobility, and wound healing",
    woundTypes: ["Venous ulcers", "Mixed ulcers", "Venous insufficiency"],
    assessmentFocus: [
      "Wound assessment",
      "Vascular status",
      "Edema assessment",
      "Mobility status",
      "Compression tolerance",
    ],
    interventionStrategies: [
      "Compression therapy",
      "Elevation strategies",
      "Mobility training",
      "Wound care coordination",
      "Functional training",
    ],
    precautions: [
      "Arterial insufficiency",
      "Infection risk",
      "Tissue fragility",
      "Compression intolerance",
      "Pain management",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Venous Ulcer Management Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-wc-004",
    name: "Burn Wound Management",
    category: "Wound Care Rehabilitation",
    description:
      "PT management of burn wounds addressing ROM, strength, scar management, and functional recovery",
    woundTypes: [
      "Superficial burns",
      "Partial thickness burns",
      "Full thickness burns",
      "Mixed burns",
    ],
    assessmentFocus: [
      "Wound assessment",
      "ROM assessment",
      "Strength assessment",
      "Scar assessment",
      "Functional status",
    ],
    interventionStrategies: [
      "ROM restoration",
      "Strength training",
      "Scar management",
      "Positioning",
      "Functional training",
    ],
    precautions: [
      "Infection risk",
      "Tissue fragility",
      "Pain management",
      "Contracture prevention",
      "Psychological support",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Burn Wound Management Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-wc-005",
    name: "Surgical Wound & Post-Operative Management",
    category: "Wound Care Rehabilitation",
    description:
      "PT management of surgical wounds addressing mobility, strength, and functional recovery",
    woundTypes: [
      "Surgical incisions",
      "Dehiscence",
      "Infection",
      "Complications",
    ],
    assessmentFocus: [
      "Wound assessment",
      "Healing status",
      "ROM assessment",
      "Strength assessment",
      "Functional status",
    ],
    interventionStrategies: [
      "Progressive mobility",
      "Strength training",
      "Scar management",
      "Functional training",
      "Pain management",
    ],
    precautions: [
      "Infection risk",
      "Tissue fragility",
      "Healing complications",
      "Pain management",
      "Activity restrictions",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Post-Operative Wound Management Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
];

export function getPTWoundCareModuleById(
  id: string,
): PTWoundCareModule | undefined {
  try {
    if (!id || typeof id !== "string") {
      auditService.logWarning("INVALID_PT_WC_ID", { id });
      return undefined;
    }
    const module = modules.find((m) => m.id === id);
    if (!module) {
      auditService.logWarning("PT_WC_NOT_FOUND", { id });
    }
    return module;
  } catch (error) {
    auditService.logError("GET_PT_WC_ERROR", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

export function getAllPTWoundCareModules(): PTWoundCareModule[] {
  try {
    return [...modules];
  } catch (error) {
    auditService.logError("GET_ALL_PT_WC_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getPTWoundCareModulesByCategory(
  category: string,
): PTWoundCareModule[] {
  try {
    if (!category || typeof category !== "string") {
      auditService.logWarning("INVALID_PT_WC_CATEGORY", { category });
      return [];
    }
    return modules.filter((m) =>
      m.category.toLowerCase().includes(category.toLowerCase()),
    );
  } catch (error) {
    auditService.logError("GET_PT_WC_BY_CATEGORY_ERROR", {
      category,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function searchPTWoundCareModules(query: string): PTWoundCareModule[] {
  try {
    if (!query || typeof query !== "string") {
      auditService.logWarning("INVALID_PT_WC_SEARCH", { query });
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
    auditService.logError("SEARCH_PT_WC_ERROR", {
      query,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getPTWoundCareModulesByEvidenceLevel(
  level: 1 | 2 | 3,
): PTWoundCareModule[] {
  try {
    if (![1, 2, 3].includes(level)) {
      auditService.logWarning("INVALID_PT_WC_EVIDENCE_LEVEL", { level });
      return [];
    }
    return modules.filter((m) => m.evidenceLevel === level);
  } catch (error) {
    auditService.logError("GET_PT_WC_BY_EVIDENCE_ERROR", {
      level,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getPTWoundCareInterventionStrategies(): string[] {
  try {
    const strategies = new Set<string>();
    modules.forEach((m) =>
      m.interventionStrategies.forEach((s) => strategies.add(s)),
    );
    return Array.from(strategies).sort();
  } catch (error) {
    auditService.logError("GET_PT_WC_STRATEGIES_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function validatePTWoundCarePrecaution(
  moduleId: string,
  precaution: string,
): { valid: boolean; message: string } {
  try {
    const module = getPTWoundCareModuleById(moduleId);
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
    auditService.logError("VALIDATE_PT_WC_PRECAUTION_ERROR", {
      moduleId,
      precaution,
      error: error instanceof Error ? error.message : String(error),
    });
    return { valid: false, message: "Validation error" };
  }
}

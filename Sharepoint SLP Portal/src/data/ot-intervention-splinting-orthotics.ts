/**
 * OT Intervention Strategies - Splinting & Orthotics
 */

import { auditService } from "../core/audit/AuditService";

export interface OTSplintingOrthoticsStrategy {
  id: string;
  name: string;
  category: string;
  description: string;
  types: string[];
  indications: string[];
  contraindications: string[];
  fabricationConsiderations: string[];
  evidenceLevel: 1 | 2 | 3;
  source: string;
  citation: string;
  lastUpdated: Date;
}

const strategies: OTSplintingOrthoticsStrategy[] = [
  {
    id: "strat-ot-so-001",
    name: "Hand Splinting",
    category: "Splinting & Orthotics",
    description: "Custom-made splints to support and protect hand structures",
    types: [
      "Static splints",
      "Dynamic splints",
      "Serial splints",
      "Functional splints",
      "Protective splints",
    ],
    indications: [
      "Hand injury",
      "Joint instability",
      "Postural dysfunction",
      "Pain management",
    ],
    contraindications: [
      "Severe pain",
      "Skin conditions",
      "Severe cognitive impairment",
    ],
    fabricationConsiderations: [
      "Material selection",
      "Fit and comfort",
      "Functional positioning",
      "Aesthetic appeal",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Hand Splinting Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-so-002",
    name: "Wrist Splinting",
    category: "Splinting & Orthotics",
    description: "Custom-made splints to support and protect wrist structures",
    types: [
      "Static splints",
      "Dynamic splints",
      "Serial splints",
      "Functional splints",
      "Protective splints",
    ],
    indications: [
      "Wrist injury",
      "Joint instability",
      "Postural dysfunction",
      "Pain management",
    ],
    contraindications: [
      "Severe pain",
      "Skin conditions",
      "Severe cognitive impairment",
    ],
    fabricationConsiderations: [
      "Material selection",
      "Fit and comfort",
      "Functional positioning",
      "Aesthetic appeal",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Wrist Splinting Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-so-003",
    name: "Elbow Splinting",
    category: "Splinting & Orthotics",
    description: "Custom-made splints to support and protect elbow structures",
    types: [
      "Static splints",
      "Dynamic splints",
      "Serial splints",
      "Functional splints",
      "Protective splints",
    ],
    indications: [
      "Elbow injury",
      "Joint instability",
      "Postural dysfunction",
      "Pain management",
    ],
    contraindications: [
      "Severe pain",
      "Skin conditions",
      "Severe cognitive impairment",
    ],
    fabricationConsiderations: [
      "Material selection",
      "Fit and comfort",
      "Functional positioning",
      "Aesthetic appeal",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Elbow Splinting Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-so-004",
    name: "Shoulder Splinting",
    category: "Splinting & Orthotics",
    description:
      "Custom-made splints to support and protect shoulder structures",
    types: [
      "Static splints",
      "Dynamic splints",
      "Serial splints",
      "Functional splints",
      "Protective splints",
    ],
    indications: [
      "Shoulder injury",
      "Joint instability",
      "Postural dysfunction",
      "Pain management",
    ],
    contraindications: [
      "Severe pain",
      "Skin conditions",
      "Severe cognitive impairment",
    ],
    fabricationConsiderations: [
      "Material selection",
      "Fit and comfort",
      "Functional positioning",
      "Aesthetic appeal",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Shoulder Splinting Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-so-005",
    name: "Finger Splinting",
    category: "Splinting & Orthotics",
    description:
      "Custom-made splints to support and protect individual fingers",
    types: [
      "Static splints",
      "Dynamic splints",
      "Serial splints",
      "Functional splints",
      "Protective splints",
    ],
    indications: [
      "Finger injury",
      "Joint instability",
      "Postural dysfunction",
      "Pain management",
    ],
    contraindications: [
      "Severe pain",
      "Skin conditions",
      "Severe cognitive impairment",
    ],
    fabricationConsiderations: [
      "Material selection",
      "Fit and comfort",
      "Functional positioning",
      "Aesthetic appeal",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Finger Splinting Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-so-006",
    name: "Thumb Splinting",
    category: "Splinting & Orthotics",
    description: "Custom-made splints to support and protect thumb structures",
    types: [
      "Static splints",
      "Dynamic splints",
      "Serial splints",
      "Functional splints",
      "Protective splints",
    ],
    indications: [
      "Thumb injury",
      "Joint instability",
      "Postural dysfunction",
      "Pain management",
    ],
    contraindications: [
      "Severe pain",
      "Skin conditions",
      "Severe cognitive impairment",
    ],
    fabricationConsiderations: [
      "Material selection",
      "Fit and comfort",
      "Functional positioning",
      "Aesthetic appeal",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Thumb Splinting Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-so-007",
    name: "Ankle Orthotics",
    category: "Splinting & Orthotics",
    description:
      "Custom-made orthotics to support and protect ankle structures",
    types: [
      "Static orthotics",
      "Dynamic orthotics",
      "Functional orthotics",
      "Protective orthotics",
      "Corrective orthotics",
    ],
    indications: [
      "Ankle injury",
      "Joint instability",
      "Postural dysfunction",
      "Pain management",
    ],
    contraindications: [
      "Severe pain",
      "Skin conditions",
      "Severe cognitive impairment",
    ],
    fabricationConsiderations: [
      "Material selection",
      "Fit and comfort",
      "Functional positioning",
      "Aesthetic appeal",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Ankle Orthotics Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-so-008",
    name: "Foot Orthotics",
    category: "Splinting & Orthotics",
    description: "Custom-made orthotics to support and protect foot structures",
    types: [
      "Static orthotics",
      "Dynamic orthotics",
      "Functional orthotics",
      "Protective orthotics",
      "Corrective orthotics",
    ],
    indications: [
      "Foot injury",
      "Joint instability",
      "Postural dysfunction",
      "Pain management",
    ],
    contraindications: [
      "Severe pain",
      "Skin conditions",
      "Severe cognitive impairment",
    ],
    fabricationConsiderations: [
      "Material selection",
      "Fit and comfort",
      "Functional positioning",
      "Aesthetic appeal",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Foot Orthotics Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-so-009",
    name: "Knee Orthotics",
    category: "Splinting & Orthotics",
    description: "Custom-made orthotics to support and protect knee structures",
    types: [
      "Static orthotics",
      "Dynamic orthotics",
      "Functional orthotics",
      "Protective orthotics",
      "Corrective orthotics",
    ],
    indications: [
      "Knee injury",
      "Joint instability",
      "Postural dysfunction",
      "Pain management",
    ],
    contraindications: [
      "Severe pain",
      "Skin conditions",
      "Severe cognitive impairment",
    ],
    fabricationConsiderations: [
      "Material selection",
      "Fit and comfort",
      "Functional positioning",
      "Aesthetic appeal",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Knee Orthotics Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-so-010",
    name: "Hip Orthotics",
    category: "Splinting & Orthotics",
    description: "Custom-made orthotics to support and protect hip structures",
    types: [
      "Static orthotics",
      "Dynamic orthotics",
      "Functional orthotics",
      "Protective orthotics",
      "Corrective orthotics",
    ],
    indications: [
      "Hip injury",
      "Joint instability",
      "Postural dysfunction",
      "Pain management",
    ],
    contraindications: [
      "Severe pain",
      "Skin conditions",
      "Severe cognitive impairment",
    ],
    fabricationConsiderations: [
      "Material selection",
      "Fit and comfort",
      "Functional positioning",
      "Aesthetic appeal",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Hip Orthotics Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-so-011",
    name: "Spinal Orthotics",
    category: "Splinting & Orthotics",
    description:
      "Custom-made orthotics to support and protect spinal structures",
    types: [
      "Static orthotics",
      "Dynamic orthotics",
      "Functional orthotics",
      "Protective orthotics",
      "Corrective orthotics",
    ],
    indications: [
      "Spinal injury",
      "Joint instability",
      "Postural dysfunction",
      "Pain management",
    ],
    contraindications: [
      "Severe pain",
      "Skin conditions",
      "Severe cognitive impairment",
    ],
    fabricationConsiderations: [
      "Material selection",
      "Fit and comfort",
      "Functional positioning",
      "Aesthetic appeal",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Spinal Orthotics Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-so-012",
    name: "Compression Garments",
    category: "Splinting & Orthotics",
    description:
      "Custom-made compression garments to manage edema and provide support",
    types: ["Sleeves", "Gloves", "Stockings", "Wraps", "Garments"],
    indications: [
      "Edema",
      "Lymphedema",
      "Circulation impairment",
      "Scar management",
    ],
    contraindications: [
      "Severe pain",
      "Skin conditions",
      "Vascular compromise",
    ],
    fabricationConsiderations: [
      "Compression level",
      "Material selection",
      "Fit and comfort",
      "Aesthetic appeal",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Compression Garments Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-so-013",
    name: "Scar Management Devices",
    category: "Splinting & Orthotics",
    description:
      "Custom-made devices to manage scar tissue and improve appearance",
    types: [
      "Pressure garments",
      "Silicone products",
      "Splints",
      "Wraps",
      "Devices",
    ],
    indications: [
      "Scar tissue",
      "Hypertrophic scars",
      "Contractures",
      "Functional limitation",
    ],
    contraindications: [
      "Severe pain",
      "Skin conditions",
      "Severe cognitive impairment",
    ],
    fabricationConsiderations: [
      "Material selection",
      "Fit and comfort",
      "Pressure level",
      "Aesthetic appeal",
    ],
    evidenceLevel: 2,
    source: "AOTA",
    citation: "AOTA (2020). Scar Management Devices Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-so-014",
    name: "Positioning Devices",
    category: "Splinting & Orthotics",
    description:
      "Custom-made devices to maintain proper positioning and prevent deformity",
    types: ["Pillows", "Rolls", "Wedges", "Supports", "Devices"],
    indications: [
      "Postural dysfunction",
      "Deformity prevention",
      "Comfort need",
      "Positioning limitation",
    ],
    contraindications: [
      "Severe pain",
      "Skin conditions",
      "Severe cognitive impairment",
    ],
    fabricationConsiderations: [
      "Material selection",
      "Fit and comfort",
      "Durability",
      "Aesthetic appeal",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Positioning Devices Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-so-015",
    name: "Functional Orthotics",
    category: "Splinting & Orthotics",
    description:
      "Custom-made orthotics designed to improve functional performance",
    types: [
      "Work orthotics",
      "Sport orthotics",
      "Activity-specific orthotics",
      "Functional devices",
    ],
    indications: [
      "Functional limitation",
      "Work limitation",
      "Activity limitation",
      "Performance enhancement",
    ],
    contraindications: [
      "Severe pain",
      "Skin conditions",
      "Severe cognitive impairment",
    ],
    fabricationConsiderations: [
      "Material selection",
      "Fit and comfort",
      "Functional design",
      "Aesthetic appeal",
    ],
    evidenceLevel: 2,
    source: "AOTA",
    citation: "AOTA (2020). Functional Orthotics Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
];

export function getOTSplintingOrthoticsStrategyById(
  id: string,
): OTSplintingOrthoticsStrategy | undefined {
  try {
    if (!id || typeof id !== "string") {
      auditService.logWarning("INVALID_OT_SO_ID", { id });
      return undefined;
    }
    const strategy = strategies.find((s) => s.id === id);
    if (!strategy) {
      auditService.logWarning("OT_SO_NOT_FOUND", { id });
    }
    return strategy;
  } catch (error) {
    auditService.logError("GET_OT_SO_ERROR", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

export function getAllOTSplintingOrthoticsStrategies(): OTSplintingOrthoticsStrategy[] {
  try {
    return [...strategies];
  } catch (error) {
    auditService.logError("GET_ALL_OT_SO_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTSplintingOrthoticsStrategiesByCategory(
  category: string,
): OTSplintingOrthoticsStrategy[] {
  try {
    if (!category || typeof category !== "string") {
      auditService.logWarning("INVALID_OT_SO_CATEGORY", { category });
      return [];
    }
    return strategies.filter((s) =>
      s.category.toLowerCase().includes(category.toLowerCase()),
    );
  } catch (error) {
    auditService.logError("GET_OT_SO_BY_CATEGORY_ERROR", {
      category,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function searchOTSplintingOrthoticsStrategies(
  query: string,
): OTSplintingOrthoticsStrategy[] {
  try {
    if (!query || typeof query !== "string") {
      auditService.logWarning("INVALID_OT_SO_SEARCH", { query });
      return [];
    }
    const lowerQuery = query.toLowerCase();
    return strategies.filter(
      (s) =>
        s.name.toLowerCase().includes(lowerQuery) ||
        s.category.toLowerCase().includes(lowerQuery) ||
        s.description.toLowerCase().includes(lowerQuery),
    );
  } catch (error) {
    auditService.logError("SEARCH_OT_SO_ERROR", {
      query,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTSplintingOrthoticsStrategiesByEvidenceLevel(
  level: 1 | 2 | 3,
): OTSplintingOrthoticsStrategy[] {
  try {
    if (![1, 2, 3].includes(level)) {
      auditService.logWarning("INVALID_OT_SO_EVIDENCE_LEVEL", { level });
      return [];
    }
    return strategies.filter((s) => s.evidenceLevel === level);
  } catch (error) {
    auditService.logError("GET_OT_SO_BY_EVIDENCE_ERROR", {
      level,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTSplintingOrthoticsTypes(): string[] {
  try {
    const types = new Set<string>();
    strategies.forEach((s) => s.types.forEach((t) => types.add(t)));
    return Array.from(types).sort();
  } catch (error) {
    auditService.logError("GET_OT_SO_TYPES_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function validateOTSplintingOrthoticsFabrication(
  strategyId: string,
  consideration: string,
): { valid: boolean; message: string } {
  try {
    const strategy = getOTSplintingOrthoticsStrategyById(strategyId);
    if (!strategy) return { valid: false, message: "Strategy not found" };
    if (!consideration || typeof consideration !== "string")
      return { valid: false, message: "Consideration must be a string" };
    const hasConsideration = strategy.fabricationConsiderations.some((c) =>
      c.toLowerCase().includes(consideration.toLowerCase()),
    );
    return {
      valid: hasConsideration,
      message: hasConsideration
        ? "Consideration found"
        : "Consideration not found",
    };
  } catch (error) {
    auditService.logError("VALIDATE_OT_SO_FABRICATION_ERROR", {
      strategyId,
      consideration,
      error: error instanceof Error ? error.message : String(error),
    });
    return { valid: false, message: "Validation error" };
  }
}

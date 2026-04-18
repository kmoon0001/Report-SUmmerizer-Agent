/**
 * OT Positioning & Pressure Relief Data
 * Occupational therapy positioning strategies and pressure relief techniques
 */

import { auditService } from "../core/audit/AuditService";

export interface OTPositioningStrategy {
  id: string;
  name: string;
  category: string;
  description: string;
  occupationalGoals: string[];
  positioningTechniques: string[];
  supportingEquipment: string[];
  pressureRelievingStrategies: string[];
  skinMonitoringGuidelines: string[];
  contraindications: string[];
  evidenceLevel: 1 | 2 | 3;
  source: string;
  lastUpdated: Date;
}

const strategies: OTPositioningStrategy[] = [
  {
    id: "ot-pos-001",
    name: "Supine Positioning",
    category: "Bed Positioning",
    description:
      "Occupational strategies for safe supine positioning to prevent pressure ulcers and maintain comfort",
    occupationalGoals: [
      "Prevent pressure ulcers",
      "Maintain comfort",
      "Preserve skin integrity",
      "Support occupational participation",
      "Enhance quality of life",
    ],
    positioningTechniques: [
      "Neutral spine alignment",
      "Head support",
      "Arm positioning",
      "Hip positioning",
      "Leg positioning",
      "Foot support",
    ],
    supportingEquipment: [
      "Pillows",
      "Wedges",
      "Rolls",
      "Heel protectors",
      "Pressure-relieving mattress",
      "Footboard",
    ],
    pressureRelievingStrategies: [
      "Pressure-relieving mattress",
      "Frequent repositioning",
      "Skin inspection",
      "Moisture management",
      "Nutritional support",
    ],
    skinMonitoringGuidelines: [
      "Inspect bony prominences",
      "Check for redness",
      "Monitor for breakdown",
      "Document findings",
      "Report changes",
    ],
    contraindications: [
      "Severe pain",
      "Recent surgery",
      "Spinal precautions",
      "Respiratory compromise",
      "Cardiac instability",
    ],
    evidenceLevel: 1,
    source: "AOTA Positioning Guidelines & Pressure Ulcer Prevention Research",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-pos-002",
    name: "Prone Positioning",
    category: "Bed Positioning",
    description:
      "Occupational strategies for safe prone positioning to prevent pressure ulcers and support respiratory function",
    occupationalGoals: [
      "Prevent pressure ulcers",
      "Support respiratory function",
      "Maintain comfort",
      "Preserve skin integrity",
      "Enhance occupational participation",
    ],
    positioningTechniques: [
      "Head positioning",
      "Arm positioning",
      "Chest support",
      "Hip positioning",
      "Leg positioning",
      "Foot support",
    ],
    supportingEquipment: [
      "Pillows",
      "Wedges",
      "Rolls",
      "Chest support",
      "Pressure-relieving mattress",
      "Footboard",
    ],
    pressureRelievingStrategies: [
      "Pressure-relieving mattress",
      "Frequent repositioning",
      "Skin inspection",
      "Moisture management",
      "Nutritional support",
    ],
    skinMonitoringGuidelines: [
      "Inspect bony prominences",
      "Check for redness",
      "Monitor for breakdown",
      "Document findings",
      "Report changes",
    ],
    contraindications: [
      "Respiratory compromise",
      "Cardiac instability",
      "Recent abdominal surgery",
      "Severe pain",
      "Spinal precautions",
    ],
    evidenceLevel: 1,
    source: "AOTA Positioning Guidelines & Pressure Ulcer Prevention Research",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-pos-003",
    name: "Side-Lying Positioning",
    category: "Bed Positioning",
    description:
      "Occupational strategies for safe side-lying positioning to prevent pressure ulcers and maintain comfort",
    occupationalGoals: [
      "Prevent pressure ulcers",
      "Maintain comfort",
      "Preserve skin integrity",
      "Support occupational participation",
      "Enhance quality of life",
    ],
    positioningTechniques: [
      "Head support",
      "Arm positioning",
      "Trunk alignment",
      "Hip positioning",
      "Leg positioning",
      "Foot support",
    ],
    supportingEquipment: [
      "Pillows",
      "Wedges",
      "Rolls",
      "Pressure-relieving mattress",
      "Heel protectors",
      "Footboard",
    ],
    pressureRelievingStrategies: [
      "Pressure-relieving mattress",
      "Frequent repositioning",
      "Skin inspection",
      "Moisture management",
      "Nutritional support",
    ],
    skinMonitoringGuidelines: [
      "Inspect bony prominences",
      "Check for redness",
      "Monitor for breakdown",
      "Document findings",
      "Report changes",
    ],
    contraindications: [
      "Severe pain",
      "Recent surgery",
      "Spinal precautions",
      "Respiratory compromise",
      "Cardiac instability",
    ],
    evidenceLevel: 1,
    source: "AOTA Positioning Guidelines & Pressure Ulcer Prevention Research",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-pos-004",
    name: "Seated Positioning",
    category: "Chair Positioning",
    description:
      "Occupational strategies for safe seated positioning to prevent pressure ulcers and maintain comfort during activities",
    occupationalGoals: [
      "Prevent pressure ulcers",
      "Maintain comfort",
      "Support occupational participation",
      "Preserve skin integrity",
      "Enhance quality of life",
    ],
    positioningTechniques: [
      "Trunk alignment",
      "Hip positioning",
      "Knee positioning",
      "Foot support",
      "Arm support",
      "Head support",
    ],
    supportingEquipment: [
      "Pressure-relieving cushion",
      "Back support",
      "Armrests",
      "Footrest",
      "Lumbar support",
      "Headrest",
    ],
    pressureRelievingStrategies: [
      "Pressure-relieving cushion",
      "Frequent repositioning",
      "Skin inspection",
      "Moisture management",
      "Nutritional support",
    ],
    skinMonitoringGuidelines: [
      "Inspect bony prominences",
      "Check for redness",
      "Monitor for breakdown",
      "Document findings",
      "Report changes",
    ],
    contraindications: [
      "Severe pain",
      "Recent surgery",
      "Spinal precautions",
      "Respiratory compromise",
      "Cardiac instability",
    ],
    evidenceLevel: 1,
    source: "AOTA Positioning Guidelines & Pressure Ulcer Prevention Research",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-pos-005",
    name: "Wheelchair Positioning & Pressure Relief",
    category: "Mobility Positioning",
    description:
      "Occupational strategies for safe wheelchair positioning and pressure relief for community mobility and participation",
    occupationalGoals: [
      "Prevent pressure ulcers",
      "Maintain comfort",
      "Support community participation",
      "Preserve skin integrity",
      "Enhance quality of life",
    ],
    positioningTechniques: [
      "Trunk alignment",
      "Hip positioning",
      "Knee positioning",
      "Foot support",
      "Arm support",
      "Head support",
    ],
    supportingEquipment: [
      "Pressure-relieving cushion",
      "Back support",
      "Armrests",
      "Footrest",
      "Lumbar support",
      "Headrest",
    ],
    pressureRelievingStrategies: [
      "Pressure-relieving cushion",
      "Frequent repositioning",
      "Pressure relief techniques",
      "Skin inspection",
      "Nutritional support",
    ],
    skinMonitoringGuidelines: [
      "Inspect bony prominences",
      "Check for redness",
      "Monitor for breakdown",
      "Document findings",
      "Report changes",
    ],
    contraindications: [
      "Severe pain",
      "Recent surgery",
      "Spinal precautions",
      "Respiratory compromise",
      "Cardiac instability",
    ],
    evidenceLevel: 1,
    source: "AOTA Positioning Guidelines & Pressure Ulcer Prevention Research",
    lastUpdated: new Date("2024-01-15"),
  },
];

export function getOTPositioningStrategyById(
  id: string,
): OTPositioningStrategy | undefined {
  try {
    if (!id || typeof id !== "string") {
      auditService.logWarning("INVALID_OT_POS_ID", { id });
      return undefined;
    }
    const strategy = strategies.find((s) => s.id === id);
    if (!strategy) {
      auditService.logWarning("OT_POS_NOT_FOUND", { id });
    }
    return strategy;
  } catch (error) {
    auditService.logError("GET_OT_POS_ERROR", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

export function getAllOTPositioningStrategies(): OTPositioningStrategy[] {
  try {
    return [...strategies];
  } catch (error) {
    auditService.logError("GET_ALL_OT_POS_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTPositioningStrategiesByCategory(
  category: string,
): OTPositioningStrategy[] {
  try {
    if (!category || typeof category !== "string") {
      auditService.logWarning("INVALID_OT_POS_CATEGORY", { category });
      return [];
    }
    return strategies.filter((s) =>
      s.category.toLowerCase().includes(category.toLowerCase()),
    );
  } catch (error) {
    auditService.logError("GET_OT_POS_BY_CATEGORY_ERROR", {
      category,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function searchOTPositioningStrategies(
  query: string,
): OTPositioningStrategy[] {
  try {
    if (!query || typeof query !== "string") {
      auditService.logWarning("INVALID_OT_POS_SEARCH", { query });
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
    auditService.logError("SEARCH_OT_POS_ERROR", {
      query,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTPositioningStrategiesByEvidenceLevel(
  level: 1 | 2 | 3,
): OTPositioningStrategy[] {
  try {
    if (![1, 2, 3].includes(level)) {
      auditService.logWarning("INVALID_OT_POS_EVIDENCE_LEVEL", { level });
      return [];
    }
    return strategies.filter((s) => s.evidenceLevel === level);
  } catch (error) {
    auditService.logError("GET_OT_POS_BY_EVIDENCE_ERROR", {
      level,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getPositioningEquipmentList(): string[] {
  try {
    const equipment = new Set<string>();
    strategies.forEach((s) =>
      s.supportingEquipment.forEach((e) => equipment.add(e)),
    );
    return Array.from(equipment).sort();
  } catch (error) {
    auditService.logError("GET_POSITIONING_EQUIPMENT_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function validatePositioningStrategy(
  strategyId: string,
  technique: string,
): { valid: boolean; message: string } {
  try {
    const strategy = getOTPositioningStrategyById(strategyId);
    if (!strategy) return { valid: false, message: "Strategy not found" };
    if (!technique || typeof technique !== "string")
      return { valid: false, message: "Technique must be a string" };
    const hasTechnique = strategy.positioningTechniques.some((t) =>
      t.toLowerCase().includes(technique.toLowerCase()),
    );
    return {
      valid: hasTechnique,
      message: hasTechnique ? "Technique found" : "Technique not found",
    };
  } catch (error) {
    auditService.logError("VALIDATE_POSITIONING_STRATEGY_ERROR", {
      strategyId,
      technique,
      error: error instanceof Error ? error.message : String(error),
    });
    return { valid: false, message: "Validation error" };
  }
}

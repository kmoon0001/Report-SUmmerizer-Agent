/**
 * OT Wound Care & Occupational Participation Data
 * Occupational therapy strategies for maintaining occupational engagement with wound care needs
 */

import { auditService } from "../core/audit/AuditService";

export interface OTWoundCareStrategy {
  id: string;
  name: string;
  category: string;
  description: string;
  woundTypes: string[];
  occupationalGoals: string[];
  adaptationStrategies: string[];
  precautions: string[];
  environmentalModifications: string[];
  activityRestrictions: string[];
  evidenceLevel: 1 | 2 | 3;
  source: string;
  lastUpdated: Date;
}

const strategies: OTWoundCareStrategy[] = [
  {
    id: "ot-wc-001",
    name: "Pressure Injury Prevention & Occupational Engagement",
    category: "Occupational",
    description:
      "Occupational strategies to prevent pressure injuries while maintaining occupational engagement and independence",
    woundTypes: [
      "Pressure injuries",
      "Pressure ulcers",
      "Decubitus ulcers",
      "Skin breakdown",
      "At-risk skin",
    ],
    occupationalGoals: [
      "Maintain independence in ADLs",
      "Prevent pressure injuries",
      "Preserve occupational roles",
      "Enhance quality of life",
      "Promote self-efficacy",
    ],
    adaptationStrategies: [
      "Positioning techniques",
      "Pressure relief strategies",
      "Adaptive equipment use",
      "Activity modification",
      "Environmental adaptation",
    ],
    precautions: [
      "Avoid prolonged pressure",
      "Monitor skin integrity",
      "Maintain hygiene",
      "Ensure proper nutrition",
      "Regular repositioning",
    ],
    environmentalModifications: [
      "Pressure-relieving surfaces",
      "Accessible seating",
      "Proper bed setup",
      "Accessible bathroom",
      "Safe flooring",
    ],
    activityRestrictions: [
      "Limit prolonged sitting",
      "Avoid friction and shear",
      "Monitor activity tolerance",
      "Frequent position changes",
      "Supervised activities",
    ],
    evidenceLevel: 1,
    source: "AOTA Wound Care Guidelines & Pressure Injury Prevention Research",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-wc-002",
    name: "Diabetic Foot Care & Community Participation",
    category: "Occupational",
    description:
      "Occupational strategies for diabetic foot care while maintaining community participation and occupational roles",
    woundTypes: [
      "Diabetic foot ulcers",
      "Neuropathic ulcers",
      "Ischemic ulcers",
      "Mixed ulcers",
      "Diabetic complications",
    ],
    occupationalGoals: [
      "Maintain foot health",
      "Preserve community participation",
      "Enhance independence",
      "Reduce complications",
      "Promote quality of life",
    ],
    adaptationStrategies: [
      "Foot care routines",
      "Appropriate footwear",
      "Activity modification",
      "Environmental adaptation",
      "Caregiver support",
    ],
    precautions: [
      "Daily foot inspection",
      "Proper footwear",
      "Avoid barefoot walking",
      "Monitor blood glucose",
      "Seek early treatment",
    ],
    environmentalModifications: [
      "Safe flooring",
      "Accessible bathroom",
      "Adequate lighting",
      "Accessible seating",
      "Climate control",
    ],
    activityRestrictions: [
      "Limit standing time",
      "Avoid high-impact activities",
      "Monitor activity tolerance",
      "Frequent rest breaks",
      "Supervised activities",
    ],
    evidenceLevel: 1,
    source:
      "AOTA Diabetic Foot Care Guidelines & Community Participation Research",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-wc-003",
    name: "Venous & Arterial Ulcer Management & ADL Adaptation",
    category: "Occupational",
    description:
      "Occupational strategies for managing venous and arterial ulcers while maintaining independence in ADLs",
    woundTypes: [
      "Venous ulcers",
      "Arterial ulcers",
      "Mixed ulcers",
      "Leg ulcers",
      "Chronic wounds",
    ],
    occupationalGoals: [
      "Maintain independence in ADLs",
      "Promote wound healing",
      "Preserve occupational roles",
      "Enhance quality of life",
      "Reduce complications",
    ],
    adaptationStrategies: [
      "Positioning techniques",
      "Compression therapy",
      "Activity modification",
      "Adaptive equipment",
      "Environmental adaptation",
    ],
    precautions: [
      "Proper positioning",
      "Compression management",
      "Avoid prolonged standing",
      "Monitor circulation",
      "Seek early treatment",
    ],
    environmentalModifications: [
      "Accessible seating",
      "Proper bed setup",
      "Accessible bathroom",
      "Safe flooring",
      "Climate control",
    ],
    activityRestrictions: [
      "Limit standing time",
      "Avoid prolonged sitting",
      "Monitor activity tolerance",
      "Frequent position changes",
      "Supervised activities",
    ],
    evidenceLevel: 1,
    source: "AOTA Ulcer Management Guidelines & ADL Adaptation Research",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-wc-004",
    name: "Burn Wound Care & Occupational Rehabilitation",
    category: "Occupational",
    description:
      "Occupational strategies for burn wound care and rehabilitation while maintaining occupational engagement",
    woundTypes: [
      "Burn wounds",
      "Thermal burns",
      "Chemical burns",
      "Electrical burns",
      "Burn complications",
    ],
    occupationalGoals: [
      "Promote wound healing",
      "Maintain independence in ADLs",
      "Preserve occupational roles",
      "Enhance quality of life",
      "Reduce contractures",
    ],
    adaptationStrategies: [
      "Positioning techniques",
      "Splinting and orthotics",
      "Activity modification",
      "Scar management",
      "Gradual activity progression",
    ],
    precautions: [
      "Protect healing wounds",
      "Avoid infection",
      "Monitor circulation",
      "Manage pain",
      "Prevent contractures",
    ],
    environmentalModifications: [
      "Accessible seating",
      "Proper bed setup",
      "Accessible bathroom",
      "Safe temperature control",
      "Accessible equipment",
    ],
    activityRestrictions: [
      "Limit activity initially",
      "Gradual progression",
      "Monitor wound status",
      "Avoid trauma",
      "Supervised activities",
    ],
    evidenceLevel: 1,
    source: "AOTA Burn Care Guidelines & Occupational Rehabilitation Research",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-wc-005",
    name: "Post-Surgical Wound Care & Return to Occupations",
    category: "Occupational",
    description:
      "Occupational strategies for post-surgical wound care and return to occupational roles",
    woundTypes: [
      "Surgical wounds",
      "Incisions",
      "Surgical complications",
      "Infection prevention",
      "Healing promotion",
    ],
    occupationalGoals: [
      "Promote wound healing",
      "Return to occupational roles",
      "Maintain independence",
      "Enhance quality of life",
      "Prevent complications",
    ],
    adaptationStrategies: [
      "Activity modification",
      "Gradual progression",
      "Adaptive techniques",
      "Environmental adaptation",
      "Caregiver support",
    ],
    precautions: [
      "Protect incision",
      "Avoid infection",
      "Monitor healing",
      "Follow precautions",
      "Seek early treatment",
    ],
    environmentalModifications: [
      "Accessible seating",
      "Proper bed setup",
      "Accessible bathroom",
      "Safe flooring",
      "Climate control",
    ],
    activityRestrictions: [
      "Limit activity initially",
      "Gradual progression",
      "Avoid heavy lifting",
      "Monitor wound status",
      "Supervised activities",
    ],
    evidenceLevel: 1,
    source: "AOTA Post-Surgical Care Guidelines & Return to Work Research",
    lastUpdated: new Date("2024-01-15"),
  },
];

export function getOTWoundCareStrategyById(
  id: string,
): OTWoundCareStrategy | undefined {
  try {
    if (!id || typeof id !== "string") {
      auditService.logWarning("INVALID_OT_WC_ID", { id });
      return undefined;
    }
    const strategy = strategies.find((s) => s.id === id);
    if (!strategy) {
      auditService.logWarning("OT_WC_NOT_FOUND", { id });
    }
    return strategy;
  } catch (error) {
    auditService.logError("GET_OT_WC_ERROR", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

export function getAllOTWoundCareStrategies(): OTWoundCareStrategy[] {
  try {
    return [...strategies];
  } catch (error) {
    auditService.logError("GET_ALL_OT_WC_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTWoundCareStrategiesByCategory(
  category: string,
): OTWoundCareStrategy[] {
  try {
    if (!category || typeof category !== "string") {
      auditService.logWarning("INVALID_OT_WC_CATEGORY", { category });
      return [];
    }
    return strategies.filter((s) =>
      s.category.toLowerCase().includes(category.toLowerCase()),
    );
  } catch (error) {
    auditService.logError("GET_OT_WC_BY_CATEGORY_ERROR", {
      category,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function searchOTWoundCareStrategies(
  query: string,
): OTWoundCareStrategy[] {
  try {
    if (!query || typeof query !== "string") {
      auditService.logWarning("INVALID_OT_WC_SEARCH", { query });
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
    auditService.logError("SEARCH_OT_WC_ERROR", {
      query,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTWoundCareStrategiesByEvidenceLevel(
  level: 1 | 2 | 3,
): OTWoundCareStrategy[] {
  try {
    if (![1, 2, 3].includes(level)) {
      auditService.logWarning("INVALID_OT_WC_EVIDENCE_LEVEL", { level });
      return [];
    }
    return strategies.filter((s) => s.evidenceLevel === level);
  } catch (error) {
    auditService.logError("GET_OT_WC_BY_EVIDENCE_ERROR", {
      level,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getWoundTypes(): string[] {
  try {
    const types = new Set<string>();
    strategies.forEach((s) => s.woundTypes.forEach((t) => types.add(t)));
    return Array.from(types).sort();
  } catch (error) {
    auditService.logError("GET_WOUND_TYPES_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function validateWoundCareStrategy(
  strategyId: string,
  woundType: string,
): { valid: boolean; message: string } {
  try {
    const strategy = getOTWoundCareStrategyById(strategyId);
    if (!strategy) return { valid: false, message: "Strategy not found" };
    if (!woundType || typeof woundType !== "string")
      return { valid: false, message: "Wound type must be a string" };
    const hasWoundType = strategy.woundTypes.some((t) =>
      t.toLowerCase().includes(woundType.toLowerCase()),
    );
    return {
      valid: hasWoundType,
      message: hasWoundType
        ? "Wound type supported"
        : "Wound type not supported",
    };
  } catch (error) {
    auditService.logError("VALIDATE_WOUND_CARE_STRATEGY_ERROR", {
      strategyId,
      woundType,
      error: error instanceof Error ? error.message : String(error),
    });
    return { valid: false, message: "Validation error" };
  }
}

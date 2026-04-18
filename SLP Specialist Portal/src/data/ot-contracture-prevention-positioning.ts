/**
 * OT Contracture Prevention & Positioning Data
 * Occupational therapy strategies for contracture prevention and positioning
 */

import { auditService } from "../core/audit/AuditService";

export interface OTContractureStrategy {
  id: string;
  name: string;
  category: string;
  description: string;
  riskFactors: string[];
  occupationalGoals: string[];
  positioningTechniques: string[];
  splintingOrthotic: string[];
  environmentalModifications: string[];
  activityProgression: string[];
  evidenceLevel: 1 | 2 | 3;
  source: string;
  lastUpdated: Date;
}

const strategies: OTContractureStrategy[] = [
  {
    id: "ot-cp-001",
    name: "Upper Extremity Contracture Prevention",
    category: "Occupational",
    description:
      "Occupational strategies for preventing upper extremity contractures through positioning, splinting, and activity",
    riskFactors: [
      "Immobility",
      "Spasticity",
      "Weakness",
      "Pain",
      "Neurological conditions",
      "Trauma",
    ],
    occupationalGoals: [
      "Prevent contractures",
      "Maintain ROM",
      "Preserve function",
      "Enable occupational engagement",
      "Promote independence",
    ],
    positioningTechniques: [
      "Neutral positioning",
      "Functional positioning",
      "Anti-spasticity positioning",
      "Gravity-assisted positioning",
      "Frequent repositioning",
    ],
    splintingOrthotic: [
      "Resting hand splints",
      "Functional hand splints",
      "Elbow extension splints",
      "Shoulder abduction splints",
      "Dynamic splints",
    ],
    environmentalModifications: [
      "Accessible activity setup",
      "Proper seating",
      "Accessible equipment",
      "Organized workspace",
      "Safe environment",
    ],
    activityProgression: [
      "Passive ROM",
      "Active-assisted ROM",
      "Active ROM",
      "Functional activities",
      "Occupational engagement",
    ],
    evidenceLevel: 1,
    source: "AOTA Contracture Prevention Guidelines & Positioning Research",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-cp-002",
    name: "Lower Extremity Contracture Prevention",
    category: "Occupational",
    description:
      "Occupational strategies for preventing lower extremity contractures through positioning, splinting, and activity",
    riskFactors: [
      "Immobility",
      "Spasticity",
      "Weakness",
      "Pain",
      "Neurological conditions",
      "Trauma",
    ],
    occupationalGoals: [
      "Prevent contractures",
      "Maintain ROM",
      "Preserve mobility",
      "Enable community participation",
      "Promote independence",
    ],
    positioningTechniques: [
      "Hip extension positioning",
      "Knee extension positioning",
      "Ankle neutral positioning",
      "Frequent repositioning",
      "Gravity-assisted positioning",
    ],
    splintingOrthotic: [
      "Ankle-foot orthoses",
      "Knee extension splints",
      "Hip abduction splints",
      "Dynamic splints",
      "Serial splints",
    ],
    environmentalModifications: [
      "Accessible bed setup",
      "Proper seating",
      "Accessible flooring",
      "Safe environment",
      "Accessible equipment",
    ],
    activityProgression: [
      "Passive ROM",
      "Active-assisted ROM",
      "Active ROM",
      "Functional mobility",
      "Community participation",
    ],
    evidenceLevel: 1,
    source: "AOTA Lower Extremity Contracture Prevention Guidelines & Research",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-cp-003",
    name: "Spasticity Management & Positioning",
    category: "Occupational",
    description:
      "Occupational strategies for managing spasticity through positioning, splinting, and activity to prevent contractures",
    riskFactors: [
      "Spasticity",
      "Neurological conditions",
      "Stroke",
      "Spinal cord injury",
      "Traumatic brain injury",
      "Cerebral palsy",
    ],
    occupationalGoals: [
      "Reduce spasticity",
      "Prevent contractures",
      "Maintain ROM",
      "Enable function",
      "Promote occupational engagement",
    ],
    positioningTechniques: [
      "Anti-spasticity positioning",
      "Prolonged stretching",
      "Gravity-assisted positioning",
      "Frequent repositioning",
      "Functional positioning",
    ],
    splintingOrthotic: [
      "Anti-spasticity splints",
      "Resting splints",
      "Dynamic splints",
      "Serial splints",
      "Functional orthoses",
    ],
    environmentalModifications: [
      "Accessible activity setup",
      "Proper seating",
      "Accessible equipment",
      "Organized workspace",
      "Safe environment",
    ],
    activityProgression: [
      "Passive ROM",
      "Active-assisted ROM",
      "Active ROM",
      "Functional activities",
      "Occupational engagement",
    ],
    evidenceLevel: 1,
    source: "AOTA Spasticity Management Guidelines & Positioning Research",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-cp-004",
    name: "Post-Immobilization Contracture Prevention",
    category: "Occupational",
    description:
      "Occupational strategies for preventing contractures after immobilization through positioning, splinting, and progressive activity",
    riskFactors: [
      "Prolonged immobilization",
      "Fractures",
      "Surgery",
      "Trauma",
      "Weakness",
      "Pain",
    ],
    occupationalGoals: [
      "Prevent contractures",
      "Restore ROM",
      "Return to function",
      "Enable occupational roles",
      "Promote independence",
    ],
    positioningTechniques: [
      "Neutral positioning",
      "Functional positioning",
      "Gravity-assisted positioning",
      "Frequent repositioning",
      "Progressive stretching",
    ],
    splintingOrthotic: [
      "Resting splints",
      "Dynamic splints",
      "Serial splints",
      "Functional orthoses",
      "Progressive splints",
    ],
    environmentalModifications: [
      "Accessible activity setup",
      "Proper seating",
      "Accessible equipment",
      "Organized workspace",
      "Safe environment",
    ],
    activityProgression: [
      "Passive ROM",
      "Active-assisted ROM",
      "Active ROM",
      "Functional activities",
      "Return to occupations",
    ],
    evidenceLevel: 1,
    source:
      "AOTA Post-Immobilization Guidelines & Contracture Prevention Research",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-cp-005",
    name: "Positioning for Comfort & Function",
    category: "Occupational",
    description:
      "Occupational strategies for positioning to promote comfort, function, and contracture prevention during occupational engagement",
    riskFactors: [
      "Pain",
      "Immobility",
      "Weakness",
      "Neurological conditions",
      "Chronic conditions",
      "Aging",
    ],
    occupationalGoals: [
      "Promote comfort",
      "Enable function",
      "Prevent contractures",
      "Support occupational engagement",
      "Enhance quality of life",
    ],
    positioningTechniques: [
      "Functional positioning",
      "Comfort positioning",
      "Gravity-assisted positioning",
      "Frequent repositioning",
      "Activity-specific positioning",
    ],
    splintingOrthotic: [
      "Comfort splints",
      "Functional splints",
      "Positioning aids",
      "Adaptive equipment",
      "Supportive devices",
    ],
    environmentalModifications: [
      "Accessible activity setup",
      "Proper seating",
      "Accessible equipment",
      "Organized workspace",
      "Safe environment",
    ],
    activityProgression: [
      "Supported activities",
      "Assisted activities",
      "Independent activities",
      "Occupational engagement",
      "Community participation",
    ],
    evidenceLevel: 1,
    source: "AOTA Positioning for Comfort & Function Guidelines & Research",
    lastUpdated: new Date("2024-01-15"),
  },
];

export function getOTContractureStrategyById(
  id: string,
): OTContractureStrategy | undefined {
  try {
    if (!id || typeof id !== "string") {
      auditService.logWarning("INVALID_OT_CP_ID", { id });
      return undefined;
    }
    const strategy = strategies.find((s) => s.id === id);
    if (!strategy) {
      auditService.logWarning("OT_CP_NOT_FOUND", { id });
    }
    return strategy;
  } catch (error) {
    auditService.logError("GET_OT_CP_ERROR", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

export function getAllOTContractureStrategies(): OTContractureStrategy[] {
  try {
    return [...strategies];
  } catch (error) {
    auditService.logError("GET_ALL_OT_CP_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTContractureStrategiesByCategory(
  category: string,
): OTContractureStrategy[] {
  try {
    if (!category || typeof category !== "string") {
      auditService.logWarning("INVALID_OT_CP_CATEGORY", { category });
      return [];
    }
    return strategies.filter((s) =>
      s.category.toLowerCase().includes(category.toLowerCase()),
    );
  } catch (error) {
    auditService.logError("GET_OT_CP_BY_CATEGORY_ERROR", {
      category,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function searchOTContractureStrategies(
  query: string,
): OTContractureStrategy[] {
  try {
    if (!query || typeof query !== "string") {
      auditService.logWarning("INVALID_OT_CP_SEARCH", { query });
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
    auditService.logError("SEARCH_OT_CP_ERROR", {
      query,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTContractureStrategiesByEvidenceLevel(
  level: 1 | 2 | 3,
): OTContractureStrategy[] {
  try {
    if (![1, 2, 3].includes(level)) {
      auditService.logWarning("INVALID_OT_CP_EVIDENCE_LEVEL", { level });
      return [];
    }
    return strategies.filter((s) => s.evidenceLevel === level);
  } catch (error) {
    auditService.logError("GET_OT_CP_BY_EVIDENCE_ERROR", {
      level,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getRiskFactors(): string[] {
  try {
    const factors = new Set<string>();
    strategies.forEach((s) => s.riskFactors.forEach((f) => factors.add(f)));
    return Array.from(factors).sort();
  } catch (error) {
    auditService.logError("GET_RISK_FACTORS_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function validateContractureStrategy(
  strategyId: string,
  riskFactor: string,
): { valid: boolean; message: string } {
  try {
    const strategy = getOTContractureStrategyById(strategyId);
    if (!strategy) return { valid: false, message: "Strategy not found" };
    if (!riskFactor || typeof riskFactor !== "string")
      return { valid: false, message: "Risk factor must be a string" };
    const hasRiskFactor = strategy.riskFactors.some((f) =>
      f.toLowerCase().includes(riskFactor.toLowerCase()),
    );
    return {
      valid: hasRiskFactor,
      message: hasRiskFactor
        ? "Risk factor supported"
        : "Risk factor not supported",
    };
  } catch (error) {
    auditService.logError("VALIDATE_CONTRACTURE_STRATEGY_ERROR", {
      strategyId,
      riskFactor,
      error: error instanceof Error ? error.message : String(error),
    });
    return { valid: false, message: "Validation error" };
  }
}

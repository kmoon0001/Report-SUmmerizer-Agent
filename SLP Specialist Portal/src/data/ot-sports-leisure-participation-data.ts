/**
 * OT Sports & Leisure Participation Data
 * Occupational therapy strategies for sports and leisure participation
 */

import { auditService } from "../core/audit/AuditService";

export interface OTSportsLeisureStrategy {
  id: string;
  name: string;
  category: string;
  description: string;
  targetPopulations: string[];
  occupationalGoals: string[];
  adaptationStrategies: string[];
  adaptiveEquipment: string[];
  accessibilityConsiderations: string[];
  progressionOptions: string[];
  evidenceLevel: 1 | 2 | 3;
  source: string;
  lastUpdated: Date;
}

const strategies: OTSportsLeisureStrategy[] = [
  {
    id: "ot-sl-001",
    name: "Adaptive Sports Participation",
    category: "Sports Participation",
    description:
      "Occupational strategies for adaptive sports participation and athletic engagement",
    targetPopulations: [
      "Physical disability",
      "Spinal cord injury",
      "Amputation",
      "Cerebral palsy",
      "Stroke",
      "Arthritis",
    ],
    occupationalGoals: [
      "Maintain athletic participation",
      "Enhance physical fitness",
      "Promote social engagement",
      "Improve quality of life",
      "Build confidence",
    ],
    adaptationStrategies: [
      "Sport modification",
      "Equipment adaptation",
      "Rule modification",
      "Technique adaptation",
      "Positioning adaptation",
      "Pacing strategies",
    ],
    adaptiveEquipment: [
      "Wheelchairs",
      "Prosthetics",
      "Orthotics",
      "Adaptive grips",
      "Specialized equipment",
      "Assistive devices",
    ],
    accessibilityConsiderations: [
      "Facility accessibility",
      "Transportation",
      "Equipment availability",
      "Coaching support",
      "Peer support",
      "Community resources",
    ],
    progressionOptions: [
      "Recreational participation",
      "Competitive participation",
      "Team participation",
      "Individual participation",
      "Advanced competition",
    ],
    evidenceLevel: 1,
    source: "AOTA Sports Participation Guidelines & Adaptive Sports Research",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-sl-002",
    name: "Leisure Activity Engagement",
    category: "Leisure Activities",
    description:
      "Occupational strategies for leisure activity engagement and recreational participation",
    targetPopulations: [
      "Chronic illness",
      "Mental health",
      "Aging",
      "Disability",
      "Recovery",
      "Wellness",
    ],
    occupationalGoals: [
      "Maintain leisure engagement",
      "Enhance quality of life",
      "Promote social connection",
      "Reduce stress",
      "Build meaning and purpose",
    ],
    adaptationStrategies: [
      "Activity modification",
      "Simplification",
      "Grading",
      "Substitution",
      "Adaptation",
      "Environmental modification",
    ],
    adaptiveEquipment: [
      "Adaptive tools",
      "Assistive devices",
      "Specialized equipment",
      "Accessibility aids",
      "Communication aids",
      "Comfort items",
    ],
    accessibilityConsiderations: [
      "Physical accessibility",
      "Cognitive accessibility",
      "Sensory accessibility",
      "Transportation",
      "Cost",
      "Scheduling",
    ],
    progressionOptions: [
      "Passive participation",
      "Assisted participation",
      "Active participation",
      "Independent participation",
      "Leadership participation",
    ],
    evidenceLevel: 1,
    source: "AOTA Leisure Engagement Guidelines & Recreation Research",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-sl-003",
    name: "Hobby & Creative Pursuits",
    category: "Creative Activities",
    description:
      "Occupational strategies for hobby and creative pursuit engagement",
    targetPopulations: [
      "All ages",
      "All abilities",
      "Mental health",
      "Cognitive impairment",
      "Physical disability",
      "Recovery",
    ],
    occupationalGoals: [
      "Maintain creative engagement",
      "Express identity",
      "Build confidence",
      "Enhance quality of life",
      "Promote meaning and purpose",
    ],
    adaptationStrategies: [
      "Tool adaptation",
      "Technique modification",
      "Material substitution",
      "Positioning adaptation",
      "Pacing strategies",
      "Simplification",
    ],
    adaptiveEquipment: [
      "Adaptive tools",
      "Specialized equipment",
      "Assistive devices",
      "Accessibility aids",
      "Comfort items",
      "Communication aids",
    ],
    accessibilityConsiderations: [
      "Physical accessibility",
      "Cognitive accessibility",
      "Sensory accessibility",
      "Cost",
      "Scheduling",
      "Space requirements",
    ],
    progressionOptions: [
      "Exploration",
      "Skill development",
      "Mastery",
      "Teaching others",
      "Community sharing",
      "Professional pursuit",
    ],
    evidenceLevel: 1,
    source: "AOTA Creative Pursuits Guidelines & Hobby Engagement Research",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-sl-004",
    name: "Social & Community Recreation",
    category: "Social Recreation",
    description:
      "Occupational strategies for social and community recreation participation",
    targetPopulations: [
      "Social isolation",
      "Mental health",
      "Aging",
      "Disability",
      "Recovery",
      "Wellness",
    ],
    occupationalGoals: [
      "Enhance social connection",
      "Reduce isolation",
      "Build community",
      "Improve quality of life",
      "Promote belonging",
    ],
    adaptationStrategies: [
      "Group adaptation",
      "Activity modification",
      "Communication support",
      "Transportation support",
      "Accessibility modification",
      "Peer support",
    ],
    adaptiveEquipment: [
      "Communication aids",
      "Mobility aids",
      "Accessibility equipment",
      "Comfort items",
      "Assistive devices",
      "Support tools",
    ],
    accessibilityConsiderations: [
      "Physical accessibility",
      "Cognitive accessibility",
      "Sensory accessibility",
      "Transportation",
      "Cost",
      "Scheduling",
    ],
    progressionOptions: [
      "Observation",
      "Assisted participation",
      "Active participation",
      "Leadership",
      "Mentoring",
      "Community organizing",
    ],
    evidenceLevel: 1,
    source: "AOTA Social Recreation Guidelines & Community Engagement Research",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-sl-005",
    name: "Wellness & Fitness Activities",
    category: "Wellness Activities",
    description:
      "Occupational strategies for wellness and fitness activity participation",
    targetPopulations: [
      "Chronic illness",
      "Mental health",
      "Aging",
      "Disability",
      "Recovery",
      "Wellness",
    ],
    occupationalGoals: [
      "Maintain physical fitness",
      "Promote mental health",
      "Enhance quality of life",
      "Build confidence",
      "Prevent decline",
    ],
    adaptationStrategies: [
      "Exercise modification",
      "Intensity grading",
      "Pacing strategies",
      "Environmental adaptation",
      "Equipment adaptation",
      "Technique modification",
    ],
    adaptiveEquipment: [
      "Adaptive equipment",
      "Assistive devices",
      "Mobility aids",
      "Comfort items",
      "Monitoring devices",
      "Safety equipment",
    ],
    accessibilityConsiderations: [
      "Physical accessibility",
      "Cognitive accessibility",
      "Sensory accessibility",
      "Transportation",
      "Cost",
      "Scheduling",
    ],
    progressionOptions: [
      "Gentle activity",
      "Moderate activity",
      "Vigorous activity",
      "Competitive activity",
      "Teaching others",
      "Community leadership",
    ],
    evidenceLevel: 1,
    source: "AOTA Wellness Guidelines & Fitness Research",
    lastUpdated: new Date("2024-01-15"),
  },
];

export function getOTSportsLeisureStrategyById(
  id: string,
): OTSportsLeisureStrategy | undefined {
  try {
    if (!id || typeof id !== "string") {
      auditService.logWarning("INVALID_OT_SL_ID", { id });
      return undefined;
    }
    const strategy = strategies.find((s) => s.id === id);
    if (!strategy) {
      auditService.logWarning("OT_SL_NOT_FOUND", { id });
    }
    return strategy;
  } catch (error) {
    auditService.logError("GET_OT_SL_ERROR", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

export function getAllOTSportsLeisureStrategies(): OTSportsLeisureStrategy[] {
  try {
    return [...strategies];
  } catch (error) {
    auditService.logError("GET_ALL_OT_SL_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTSportsLeisureStrategiesByCategory(
  category: string,
): OTSportsLeisureStrategy[] {
  try {
    if (!category || typeof category !== "string") {
      auditService.logWarning("INVALID_OT_SL_CATEGORY", { category });
      return [];
    }
    return strategies.filter((s) =>
      s.category.toLowerCase().includes(category.toLowerCase()),
    );
  } catch (error) {
    auditService.logError("GET_OT_SL_BY_CATEGORY_ERROR", {
      category,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function searchOTSportsLeisureStrategies(
  query: string,
): OTSportsLeisureStrategy[] {
  try {
    if (!query || typeof query !== "string") {
      auditService.logWarning("INVALID_OT_SL_SEARCH", { query });
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
    auditService.logError("SEARCH_OT_SL_ERROR", {
      query,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTSportsLeisureStrategiesByEvidenceLevel(
  level: 1 | 2 | 3,
): OTSportsLeisureStrategy[] {
  try {
    if (![1, 2, 3].includes(level)) {
      auditService.logWarning("INVALID_OT_SL_EVIDENCE_LEVEL", { level });
      return [];
    }
    return strategies.filter((s) => s.evidenceLevel === level);
  } catch (error) {
    auditService.logError("GET_OT_SL_BY_EVIDENCE_ERROR", {
      level,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getAdaptiveEquipmentList(): string[] {
  try {
    const equipment = new Set<string>();
    strategies.forEach((s) =>
      s.adaptiveEquipment.forEach((e) => equipment.add(e)),
    );
    return Array.from(equipment).sort();
  } catch (error) {
    auditService.logError("GET_ADAPTIVE_EQUIPMENT_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function validateSportsLeisureStrategy(
  strategyId: string,
  population: string,
): { valid: boolean; message: string } {
  try {
    const strategy = getOTSportsLeisureStrategyById(strategyId);
    if (!strategy) return { valid: false, message: "Strategy not found" };
    if (!population || typeof population !== "string")
      return { valid: false, message: "Population must be a string" };
    const hasPopulation = strategy.targetPopulations.some((p) =>
      p.toLowerCase().includes(population.toLowerCase()),
    );
    return {
      valid: hasPopulation,
      message: hasPopulation ? "Population found" : "Population not found",
    };
  } catch (error) {
    auditService.logError("VALIDATE_SPORTS_LEISURE_ERROR", {
      strategyId,
      population,
      error: error instanceof Error ? error.message : String(error),
    });
    return { valid: false, message: "Validation error" };
  }
}

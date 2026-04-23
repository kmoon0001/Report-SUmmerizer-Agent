/**
 * OT Energy Conservation Data
 * Occupational therapy energy conservation and fatigue management strategies
 */

import { auditService } from "../core/audit/AuditService";

export interface OTEnergyConservationStrategy {
  id: string;
  name: string;
  category: string;
  description: string;
  targetConditions: string[];
  conservationPrinciples: string[];
  practicalStrategies: string[];
  adaptiveEquipment: string[];
  environmentalModifications: string[];
  occupationalApplications: string[];
  evidenceLevel: 1 | 2 | 3;
  source: string;
  lastUpdated: Date;
}

const strategies: OTEnergyConservationStrategy[] = [
  {
    id: "ot-ec-001",
    name: "Activity Pacing & Scheduling",
    category: "Fatigue Management",
    description:
      "Occupational strategies for pacing activities and scheduling rest periods to manage fatigue and energy levels",
    targetConditions: [
      "Cancer-related fatigue",
      "Chronic fatigue syndrome",
      "Post-COVID-19 fatigue",
      "Cardiac dysfunction",
      "Pulmonary dysfunction",
    ],
    conservationPrinciples: [
      "Balance activity with rest",
      "Prioritize meaningful activities",
      "Avoid overexertion",
      "Monitor energy levels",
      "Plan ahead",
    ],
    practicalStrategies: [
      "Activity scheduling",
      "Rest breaks",
      "Pacing techniques",
      "Energy tracking",
      "Prioritization methods",
    ],
    adaptiveEquipment: [
      "Activity logs",
      "Timers",
      "Reminders",
      "Simplified tools",
      "Lightweight equipment",
    ],
    environmentalModifications: [
      "Accessible storage",
      "Organized workspace",
      "Reduced clutter",
      "Adequate lighting",
      "Comfortable seating",
    ],
    occupationalApplications: [
      "Work participation",
      "Self-care independence",
      "Leisure engagement",
      "Community participation",
      "Role maintenance",
    ],
    evidenceLevel: 1,
    source: "AOTA Energy Conservation Guidelines & Fatigue Management Research",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-ec-002",
    name: "Work Simplification & Task Modification",
    category: "Activity Modification",
    description:
      "Occupational strategies for simplifying tasks and modifying activities to reduce energy expenditure",
    targetConditions: [
      "Arthritis",
      "Chronic pain",
      "Cardiac dysfunction",
      "Pulmonary dysfunction",
      "Deconditioning",
    ],
    conservationPrinciples: [
      "Eliminate unnecessary steps",
      "Use gravity to assist",
      "Reduce repetition",
      "Combine similar tasks",
      "Use proper body mechanics",
    ],
    practicalStrategies: [
      "Task analysis",
      "Step elimination",
      "Batch similar tasks",
      "Combine activities",
      "Delegate when possible",
    ],
    adaptiveEquipment: [
      "Labor-saving devices",
      "Lightweight tools",
      "Adaptive equipment",
      "Mechanical aids",
      "Assistive devices",
    ],
    environmentalModifications: [
      "Accessible storage",
      "Organized workspace",
      "Reduced clutter",
      "Adequate lighting",
      "Ergonomic setup",
    ],
    occupationalApplications: [
      "Cooking",
      "Cleaning",
      "Laundry",
      "Shopping",
      "Meal preparation",
    ],
    evidenceLevel: 1,
    source:
      "AOTA Work Simplification Guidelines & Activity Modification Research",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-ec-003",
    name: "Proper Body Mechanics & Positioning",
    category: "Biomechanics",
    description:
      "Occupational strategies for using proper body mechanics and positioning to reduce energy expenditure and prevent injury",
    targetConditions: [
      "Arthritis",
      "Chronic pain",
      "Cardiac dysfunction",
      "Pulmonary dysfunction",
      "Musculoskeletal dysfunction",
    ],
    conservationPrinciples: [
      "Use large muscle groups",
      "Maintain neutral spine",
      "Avoid twisting",
      "Keep load close",
      "Use gravity to assist",
    ],
    practicalStrategies: [
      "Proper lifting techniques",
      "Sitting posture",
      "Standing posture",
      "Reaching techniques",
      "Carrying techniques",
    ],
    adaptiveEquipment: [
      "Ergonomic furniture",
      "Lumbar support",
      "Footrests",
      "Reaching aids",
      "Carrying devices",
    ],
    environmentalModifications: [
      "Accessible storage",
      "Appropriate counter height",
      "Adequate lighting",
      "Non-slip surfaces",
      "Organized workspace",
    ],
    occupationalApplications: [
      "Work tasks",
      "Self-care activities",
      "Household tasks",
      "Leisure activities",
      "Community participation",
    ],
    evidenceLevel: 1,
    source: "AOTA Body Mechanics Guidelines & Ergonomic Research",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-ec-004",
    name: "Breathing Techniques & Relaxation",
    category: "Stress Management",
    description:
      "Occupational strategies for breathing techniques and relaxation to manage stress and conserve energy",
    targetConditions: [
      "Anxiety",
      "Stress",
      "Cardiac dysfunction",
      "Pulmonary dysfunction",
      "Chronic pain",
    ],
    conservationPrinciples: [
      "Reduce stress response",
      "Improve oxygen utilization",
      "Promote relaxation",
      "Enhance coping",
      "Improve focus",
    ],
    practicalStrategies: [
      "Diaphragmatic breathing",
      "Pursed-lip breathing",
      "Progressive relaxation",
      "Mindfulness",
      "Meditation",
    ],
    adaptiveEquipment: [
      "Relaxation recordings",
      "Breathing guides",
      "Meditation apps",
      "Timers",
      "Comfortable seating",
    ],
    environmentalModifications: [
      "Quiet space",
      "Comfortable temperature",
      "Reduced lighting",
      "Minimal distractions",
      "Comfortable seating",
    ],
    occupationalApplications: [
      "Stress management",
      "Pain management",
      "Anxiety reduction",
      "Sleep improvement",
      "Occupational engagement",
    ],
    evidenceLevel: 1,
    source: "AOTA Stress Management Guidelines & Relaxation Research",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-ec-005",
    name: "Occupational Role Adaptation & Delegation",
    category: "Role Management",
    description:
      "Occupational strategies for adapting roles and delegating tasks to manage energy and maintain meaningful participation",
    targetConditions: [
      "Cancer-related fatigue",
      "Chronic fatigue syndrome",
      "Cardiac dysfunction",
      "Pulmonary dysfunction",
      "Chronic illness",
    ],
    conservationPrinciples: [
      "Prioritize meaningful roles",
      "Delegate non-essential tasks",
      "Adapt role expectations",
      "Maintain identity",
      "Preserve participation",
    ],
    practicalStrategies: [
      "Role prioritization",
      "Task delegation",
      "Role modification",
      "Family communication",
      "Caregiver coordination",
    ],
    adaptiveEquipment: [
      "Communication aids",
      "Planning tools",
      "Reminder systems",
      "Organizational tools",
      "Tracking systems",
    ],
    environmentalModifications: [
      "Family support",
      "Community resources",
      "Workplace accommodations",
      "Social support",
      "Professional support",
    ],
    occupationalApplications: [
      "Work role",
      "Family role",
      "Caregiver role",
      "Leisure role",
      "Community role",
    ],
    evidenceLevel: 1,
    source:
      "AOTA Role Adaptation Guidelines & Occupational Participation Research",
    lastUpdated: new Date("2024-01-15"),
  },
];

export function getOTEnergyConservationStrategyById(
  id: string,
): OTEnergyConservationStrategy | undefined {
  try {
    if (!id || typeof id !== "string") {
      auditService.logWarning("INVALID_OT_EC_ID", { id });
      return undefined;
    }
    const strategy = strategies.find((s) => s.id === id);
    if (!strategy) {
      auditService.logWarning("OT_EC_NOT_FOUND", { id });
    }
    return strategy;
  } catch (error) {
    auditService.logError("GET_OT_EC_ERROR", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

export function getAllOTEnergyConservationStrategies(): OTEnergyConservationStrategy[] {
  try {
    return [...strategies];
  } catch (error) {
    auditService.logError("GET_ALL_OT_EC_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTEnergyConservationStrategiesByCategory(
  category: string,
): OTEnergyConservationStrategy[] {
  try {
    if (!category || typeof category !== "string") {
      auditService.logWarning("INVALID_OT_EC_CATEGORY", { category });
      return [];
    }
    return strategies.filter((s) =>
      s.category.toLowerCase().includes(category.toLowerCase()),
    );
  } catch (error) {
    auditService.logError("GET_OT_EC_BY_CATEGORY_ERROR", {
      category,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function searchOTEnergyConservationStrategies(
  query: string,
): OTEnergyConservationStrategy[] {
  try {
    if (!query || typeof query !== "string") {
      auditService.logWarning("INVALID_OT_EC_SEARCH", { query });
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
    auditService.logError("SEARCH_OT_EC_ERROR", {
      query,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTEnergyConservationStrategiesByEvidenceLevel(
  level: 1 | 2 | 3,
): OTEnergyConservationStrategy[] {
  try {
    if (![1, 2, 3].includes(level)) {
      auditService.logWarning("INVALID_OT_EC_EVIDENCE_LEVEL", { level });
      return [];
    }
    return strategies.filter((s) => s.evidenceLevel === level);
  } catch (error) {
    auditService.logError("GET_OT_EC_BY_EVIDENCE_ERROR", {
      level,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getEnergyConservationPrinciples(): string[] {
  try {
    const principles = new Set<string>();
    strategies.forEach((s) =>
      s.conservationPrinciples.forEach((p) => principles.add(p)),
    );
    return Array.from(principles).sort();
  } catch (error) {
    auditService.logError("GET_CONSERVATION_PRINCIPLES_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function validateEnergyConservationStrategy(
  strategyId: string,
  condition: string,
): { valid: boolean; message: string } {
  try {
    const strategy = getOTEnergyConservationStrategyById(strategyId);
    if (!strategy) return { valid: false, message: "Strategy not found" };
    if (!condition || typeof condition !== "string")
      return { valid: false, message: "Condition must be a string" };
    const hasCondition = strategy.targetConditions.some((c) =>
      c.toLowerCase().includes(condition.toLowerCase()),
    );
    return {
      valid: hasCondition,
      message: hasCondition ? "Condition found" : "Condition not found",
    };
  } catch (error) {
    auditService.logError("VALIDATE_ENERGY_CONSERVATION_ERROR", {
      strategyId,
      condition,
      error: error instanceof Error ? error.message : String(error),
    });
    return { valid: false, message: "Validation error" };
  }
}

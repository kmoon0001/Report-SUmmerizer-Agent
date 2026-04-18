/**
 * OT Deconditioning & Bed Mobility Data
 * Occupational therapy strategies for deconditioning and bed mobility
 */

import { auditService } from "../core/audit/AuditService";

export interface OTDeconditioningStrategy {
  id: string;
  name: string;
  category: string;
  description: string;
  targetConditions: string[];
  occupationalGoals: string[];
  mobilityTechniques: string[];
  adaptiveEquipment: string[];
  progressionStages: string[];
  safetyConsiderations: string[];
  evidenceLevel: 1 | 2 | 3;
  source: string;
  lastUpdated: Date;
}

const strategies: OTDeconditioningStrategy[] = [
  {
    id: "ot-decon-001",
    name: "Bed Mobility & Positioning",
    category: "Bed Mobility",
    description:
      "Occupational strategies for improving bed mobility and positioning to support occupational participation",
    targetConditions: [
      "Deconditioning",
      "Prolonged bed rest",
      "Cardiac dysfunction",
      "Pulmonary dysfunction",
      "Neurological dysfunction",
    ],
    occupationalGoals: [
      "Improve bed mobility",
      "Increase independence",
      "Support occupational participation",
      "Enhance quality of life",
      "Reduce caregiver burden",
    ],
    mobilityTechniques: [
      "Scooting techniques",
      "Rolling techniques",
      "Bridging techniques",
      "Sitting up techniques",
      "Repositioning techniques",
    ],
    adaptiveEquipment: [
      "Bed rails",
      "Trapeze bar",
      "Slide sheets",
      "Pillows",
      "Wedges",
      "Bed ladder",
    ],
    progressionStages: [
      "Passive range of motion",
      "Active-assisted range of motion",
      "Active range of motion",
      "Resistive exercises",
      "Functional mobility",
    ],
    safetyConsiderations: [
      "Fall prevention",
      "Skin integrity monitoring",
      "Vital sign monitoring",
      "Pain management",
      "Caregiver safety",
    ],
    evidenceLevel: 1,
    source: "AOTA Deconditioning Guidelines & Bed Mobility Research",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-decon-002",
    name: "Graded Activity Progression",
    category: "Activity Progression",
    description:
      "Occupational strategies for graded activity progression to address deconditioning and build tolerance",
    targetConditions: [
      "Deconditioning",
      "Prolonged bed rest",
      "Cardiac dysfunction",
      "Pulmonary dysfunction",
      "Chronic illness",
    ],
    occupationalGoals: [
      "Improve activity tolerance",
      "Increase independence",
      "Support occupational participation",
      "Enhance quality of life",
      "Build confidence",
    ],
    mobilityTechniques: [
      "Graded sitting",
      "Graded standing",
      "Graded walking",
      "Graded ADL activities",
      "Graded IADL activities",
    ],
    adaptiveEquipment: [
      "Walker",
      "Cane",
      "Wheelchair",
      "Adaptive equipment",
      "Assistive devices",
    ],
    progressionStages: [
      "Bed exercises",
      "Sitting activities",
      "Standing activities",
      "Ambulation",
      "Community activities",
    ],
    safetyConsiderations: [
      "Vital sign monitoring",
      "Symptom monitoring",
      "Fall prevention",
      "Fatigue management",
      "Caregiver safety",
    ],
    evidenceLevel: 1,
    source: "AOTA Activity Progression Guidelines & Deconditioning Research",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-decon-003",
    name: "Occupational Engagement & Participation",
    category: "Occupational Participation",
    description:
      "Occupational strategies for engaging in meaningful activities despite deconditioning",
    targetConditions: [
      "Deconditioning",
      "Prolonged bed rest",
      "Cardiac dysfunction",
      "Pulmonary dysfunction",
      "Chronic illness",
    ],
    occupationalGoals: [
      "Maintain occupational engagement",
      "Preserve roles",
      "Support participation",
      "Enhance quality of life",
      "Promote recovery",
    ],
    mobilityTechniques: [
      "Bedside activities",
      "Seated activities",
      "Modified activities",
      "Adaptive techniques",
      "Energy conservation",
    ],
    adaptiveEquipment: [
      "Bed table",
      "Lap tray",
      "Adaptive equipment",
      "Assistive devices",
      "Communication aids",
    ],
    progressionStages: [
      "Passive participation",
      "Assisted participation",
      "Active participation",
      "Independent participation",
      "Community participation",
    ],
    safetyConsiderations: [
      "Vital sign monitoring",
      "Symptom monitoring",
      "Fall prevention",
      "Fatigue management",
      "Psychological support",
    ],
    evidenceLevel: 1,
    source: "AOTA Occupational Engagement Guidelines & Participation Research",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-decon-004",
    name: "Self-Care & ADL Retraining",
    category: "ADL Retraining",
    description:
      "Occupational strategies for retraining self-care and ADL skills during deconditioning recovery",
    targetConditions: [
      "Deconditioning",
      "Prolonged bed rest",
      "Cardiac dysfunction",
      "Pulmonary dysfunction",
      "Neurological dysfunction",
    ],
    occupationalGoals: [
      "Restore ADL independence",
      "Improve self-care skills",
      "Increase confidence",
      "Support participation",
      "Enhance quality of life",
    ],
    mobilityTechniques: [
      "Bedside grooming",
      "Seated bathing",
      "Seated dressing",
      "Seated feeding",
      "Toilet transfers",
    ],
    adaptiveEquipment: [
      "Adaptive equipment",
      "Assistive devices",
      "Grab bars",
      "Raised seats",
      "Long-handled tools",
    ],
    progressionStages: [
      "Dependent care",
      "Assisted care",
      "Supervised care",
      "Independent care",
      "Community care",
    ],
    safetyConsiderations: [
      "Fall prevention",
      "Skin integrity monitoring",
      "Vital sign monitoring",
      "Pain management",
      "Caregiver safety",
    ],
    evidenceLevel: 1,
    source: "AOTA ADL Retraining Guidelines & Deconditioning Research",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-decon-005",
    name: "Psychosocial Support & Motivation",
    category: "Psychosocial Support",
    description:
      "Occupational strategies for psychosocial support and motivation during deconditioning recovery",
    targetConditions: [
      "Deconditioning",
      "Prolonged bed rest",
      "Depression",
      "Anxiety",
      "Chronic illness",
    ],
    occupationalGoals: [
      "Improve mood",
      "Increase motivation",
      "Support participation",
      "Enhance quality of life",
      "Promote recovery",
    ],
    mobilityTechniques: [
      "Meaningful activity engagement",
      "Goal setting",
      "Progress monitoring",
      "Peer support",
      "Family involvement",
    ],
    adaptiveEquipment: [
      "Communication aids",
      "Activity materials",
      "Entertainment",
      "Relaxation tools",
      "Motivational aids",
    ],
    progressionStages: [
      "Awareness",
      "Engagement",
      "Participation",
      "Independence",
      "Community participation",
    ],
    safetyConsiderations: [
      "Psychological support",
      "Suicide risk assessment",
      "Caregiver support",
      "Social support",
      "Professional support",
    ],
    evidenceLevel: 1,
    source: "AOTA Psychosocial Support Guidelines & Deconditioning Research",
    lastUpdated: new Date("2024-01-15"),
  },
];

export function getOTDeconditioningStrategyById(
  id: string,
): OTDeconditioningStrategy | undefined {
  try {
    if (!id || typeof id !== "string") {
      auditService.logWarning("INVALID_OT_DECON_ID", { id });
      return undefined;
    }
    const strategy = strategies.find((s) => s.id === id);
    if (!strategy) {
      auditService.logWarning("OT_DECON_NOT_FOUND", { id });
    }
    return strategy;
  } catch (error) {
    auditService.logError("GET_OT_DECON_ERROR", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

export function getAllOTDeconditioningStrategies(): OTDeconditioningStrategy[] {
  try {
    return [...strategies];
  } catch (error) {
    auditService.logError("GET_ALL_OT_DECON_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTDeconditioningStrategiesByCategory(
  category: string,
): OTDeconditioningStrategy[] {
  try {
    if (!category || typeof category !== "string") {
      auditService.logWarning("INVALID_OT_DECON_CATEGORY", { category });
      return [];
    }
    return strategies.filter((s) =>
      s.category.toLowerCase().includes(category.toLowerCase()),
    );
  } catch (error) {
    auditService.logError("GET_OT_DECON_BY_CATEGORY_ERROR", {
      category,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function searchOTDeconditioningStrategies(
  query: string,
): OTDeconditioningStrategy[] {
  try {
    if (!query || typeof query !== "string") {
      auditService.logWarning("INVALID_OT_DECON_SEARCH", { query });
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
    auditService.logError("SEARCH_OT_DECON_ERROR", {
      query,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTDeconditioningStrategiesByEvidenceLevel(
  level: 1 | 2 | 3,
): OTDeconditioningStrategy[] {
  try {
    if (![1, 2, 3].includes(level)) {
      auditService.logWarning("INVALID_OT_DECON_EVIDENCE_LEVEL", { level });
      return [];
    }
    return strategies.filter((s) => s.evidenceLevel === level);
  } catch (error) {
    auditService.logError("GET_OT_DECON_BY_EVIDENCE_ERROR", {
      level,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getProgressionStages(): string[] {
  try {
    const stages = new Set<string>();
    strategies.forEach((s) =>
      s.progressionStages.forEach((p) => stages.add(p)),
    );
    return Array.from(stages).sort();
  } catch (error) {
    auditService.logError("GET_PROGRESSION_STAGES_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function validateDeconditioningStrategy(
  strategyId: string,
  condition: string,
): { valid: boolean; message: string } {
  try {
    const strategy = getOTDeconditioningStrategyById(strategyId);
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
    auditService.logError("VALIDATE_DECONDITIONING_STRATEGY_ERROR", {
      strategyId,
      condition,
      error: error instanceof Error ? error.message : String(error),
    });
    return { valid: false, message: "Validation error" };
  }
}

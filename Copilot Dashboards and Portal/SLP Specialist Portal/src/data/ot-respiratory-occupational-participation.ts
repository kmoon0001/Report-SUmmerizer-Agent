/**
 * OT Respiratory & Occupational Participation Data
 * Occupational therapy strategies for maintaining occupational engagement with respiratory conditions
 */

import { auditService } from "../core/audit/AuditService";

export interface OTRespiratoryStrategy {
  id: string;
  name: string;
  category: string;
  description: string;
  respiratoryConditions: string[];
  occupationalGoals: string[];
  adaptationStrategies: string[];
  energyConservationTechniques: string[];
  environmentalModifications: string[];
  activityGradation: string[];
  evidenceLevel: 1 | 2 | 3;
  source: string;
  lastUpdated: Date;
}

const strategies: OTRespiratoryStrategy[] = [
  {
    id: "ot-resp-001",
    name: "Energy Conservation & Activity Pacing",
    category: "Occupational",
    description:
      "Occupational strategies to conserve energy and pace activities for individuals with respiratory conditions",
    respiratoryConditions: [
      "COPD",
      "Asthma",
      "Pulmonary fibrosis",
      "Post-operative respiratory complications",
      "Chronic respiratory disease",
    ],
    occupationalGoals: [
      "Maintain independence in ADLs",
      "Preserve occupational roles",
      "Enhance quality of life",
      "Reduce dyspnea during activities",
      "Promote self-efficacy",
    ],
    adaptationStrategies: [
      "Activity pacing",
      "Work simplification",
      "Prioritization techniques",
      "Breathing coordination",
      "Rest breaks",
    ],
    energyConservationTechniques: [
      "Diaphragmatic breathing",
      "Pursed-lip breathing",
      "Paced exertion",
      "Fatigue monitoring",
      "Activity modification",
    ],
    environmentalModifications: [
      "Accessible storage",
      "Reduced clutter",
      "Adequate seating",
      "Accessible work surfaces",
      "Climate control",
    ],
    activityGradation: [
      "Seated activities",
      "Light standing activities",
      "Moderate standing activities",
      "Walking activities",
      "Community activities",
    ],
    evidenceLevel: 1,
    source: "AOTA Respiratory Guidelines & Occupational Participation Research",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-resp-002",
    name: "Occupational Role Maintenance & Adaptation",
    category: "Occupational",
    description:
      "Occupational strategies to maintain meaningful roles and responsibilities with respiratory limitations",
    respiratoryConditions: [
      "COPD",
      "Asthma",
      "Pulmonary fibrosis",
      "Chronic respiratory disease",
      "Post-operative respiratory complications",
    ],
    occupationalGoals: [
      "Maintain work participation",
      "Preserve family roles",
      "Sustain leisure activities",
      "Enhance dignity and purpose",
      "Reduce role loss",
    ],
    adaptationStrategies: [
      "Role modification",
      "Task delegation",
      "Adaptive techniques",
      "Environmental adaptation",
      "Caregiver involvement",
    ],
    energyConservationTechniques: [
      "Activity pacing",
      "Breathing coordination",
      "Fatigue management",
      "Strategic rest",
      "Simplified routines",
    ],
    environmentalModifications: [
      "Accessible workspace",
      "Reduced environmental triggers",
      "Climate control",
      "Accessible equipment",
      "Supportive seating",
    ],
    activityGradation: [
      "Modified roles",
      "Supported participation",
      "Independent participation with modifications",
      "Full role participation",
      "Leadership roles",
    ],
    evidenceLevel: 1,
    source:
      "AOTA Role Maintenance Guidelines & Occupational Adaptation Research",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-resp-003",
    name: "Self-Care & ADL Adaptation",
    category: "Occupational",
    description:
      "Occupational strategies to maintain independence in self-care and ADLs with respiratory limitations",
    respiratoryConditions: [
      "COPD",
      "Asthma",
      "Pulmonary fibrosis",
      "Chronic respiratory disease",
      "Post-operative respiratory complications",
    ],
    occupationalGoals: [
      "Maintain independence in ADLs",
      "Preserve dignity and self-image",
      "Reduce dyspnea during self-care",
      "Enhance self-efficacy",
      "Promote health and safety",
    ],
    adaptationStrategies: [
      "Seated self-care",
      "Simplified routines",
      "Adaptive equipment use",
      "Breathing coordination",
      "Activity modification",
    ],
    energyConservationTechniques: [
      "Diaphragmatic breathing",
      "Paced exertion",
      "Strategic rest",
      "Simplified procedures",
      "Caregiver assistance",
    ],
    environmentalModifications: [
      "Accessible bathroom",
      "Grab bars and safety equipment",
      "Organized storage",
      "Adequate lighting",
      "Climate control",
    ],
    activityGradation: [
      "Assisted self-care",
      "Supervised self-care",
      "Independent self-care with equipment",
      "Independent self-care",
      "Efficient self-care",
    ],
    evidenceLevel: 1,
    source: "AOTA ADL Guidelines & Respiratory Adaptation Research",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-resp-004",
    name: "Leisure & Social Participation",
    category: "Occupational",
    description:
      "Occupational strategies to maintain leisure activities and social participation with respiratory limitations",
    respiratoryConditions: [
      "COPD",
      "Asthma",
      "Pulmonary fibrosis",
      "Chronic respiratory disease",
      "Post-operative respiratory complications",
    ],
    occupationalGoals: [
      "Maintain leisure activities",
      "Preserve social connections",
      "Enhance quality of life",
      "Reduce isolation",
      "Promote well-being",
    ],
    adaptationStrategies: [
      "Activity modification",
      "Pacing strategies",
      "Breathing coordination",
      "Environmental adaptation",
      "Social support",
    ],
    energyConservationTechniques: [
      "Activity pacing",
      "Strategic rest",
      "Breathing exercises",
      "Fatigue monitoring",
      "Simplified activities",
    ],
    environmentalModifications: [
      "Accessible venues",
      "Climate control",
      "Seating availability",
      "Reduced environmental triggers",
      "Accessible facilities",
    ],
    activityGradation: [
      "Seated leisure activities",
      "Light standing activities",
      "Moderate activities",
      "Active participation",
      "Advanced participation",
    ],
    evidenceLevel: 1,
    source: "AOTA Leisure & Social Participation Guidelines & Research",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-resp-005",
    name: "Instrumental ADL & Community Participation",
    category: "Occupational",
    description:
      "Occupational strategies to maintain instrumental ADLs and community participation with respiratory limitations",
    respiratoryConditions: [
      "COPD",
      "Asthma",
      "Pulmonary fibrosis",
      "Chronic respiratory disease",
      "Post-operative respiratory complications",
    ],
    occupationalGoals: [
      "Maintain independence in IADLs",
      "Preserve community participation",
      "Enhance autonomy",
      "Reduce caregiver burden",
      "Promote quality of life",
    ],
    adaptationStrategies: [
      "Task simplification",
      "Activity pacing",
      "Adaptive equipment",
      "Environmental modification",
      "Caregiver support",
    ],
    energyConservationTechniques: [
      "Work simplification",
      "Paced exertion",
      "Strategic rest",
      "Breathing coordination",
      "Simplified routines",
    ],
    environmentalModifications: [
      "Accessible community spaces",
      "Reduced environmental triggers",
      "Seating availability",
      "Climate control",
      "Accessible transportation",
    ],
    activityGradation: [
      "Assisted IADLs",
      "Supervised IADLs",
      "Independent IADLs with modifications",
      "Independent IADLs",
      "Advanced community participation",
    ],
    evidenceLevel: 1,
    source: "AOTA IADL Guidelines & Community Participation Research",
    lastUpdated: new Date("2024-01-15"),
  },
];

export function getOTRespiratoryStrategyById(
  id: string,
): OTRespiratoryStrategy | undefined {
  try {
    if (!id || typeof id !== "string") {
      auditService.logWarning("INVALID_OT_RESP_ID", { id });
      return undefined;
    }
    const strategy = strategies.find((s) => s.id === id);
    if (!strategy) {
      auditService.logWarning("OT_RESP_NOT_FOUND", { id });
    }
    return strategy;
  } catch (error) {
    auditService.logError("GET_OT_RESP_ERROR", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

export function getAllOTRespiratoryStrategies(): OTRespiratoryStrategy[] {
  try {
    return [...strategies];
  } catch (error) {
    auditService.logError("GET_ALL_OT_RESP_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTRespiratoryStrategiesByCategory(
  category: string,
): OTRespiratoryStrategy[] {
  try {
    if (!category || typeof category !== "string") {
      auditService.logWarning("INVALID_OT_RESP_CATEGORY", { category });
      return [];
    }
    return strategies.filter((s) =>
      s.category.toLowerCase().includes(category.toLowerCase()),
    );
  } catch (error) {
    auditService.logError("GET_OT_RESP_BY_CATEGORY_ERROR", {
      category,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function searchOTRespiratoryStrategies(
  query: string,
): OTRespiratoryStrategy[] {
  try {
    if (!query || typeof query !== "string") {
      auditService.logWarning("INVALID_OT_RESP_SEARCH", { query });
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
    auditService.logError("SEARCH_OT_RESP_ERROR", {
      query,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTRespiratoryStrategiesByEvidenceLevel(
  level: 1 | 2 | 3,
): OTRespiratoryStrategy[] {
  try {
    if (![1, 2, 3].includes(level)) {
      auditService.logWarning("INVALID_OT_RESP_EVIDENCE_LEVEL", { level });
      return [];
    }
    return strategies.filter((s) => s.evidenceLevel === level);
  } catch (error) {
    auditService.logError("GET_OT_RESP_BY_EVIDENCE_ERROR", {
      level,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getRespiratoryConditions(): string[] {
  try {
    const conditions = new Set<string>();
    strategies.forEach((s) =>
      s.respiratoryConditions.forEach((c) => conditions.add(c)),
    );
    return Array.from(conditions).sort();
  } catch (error) {
    auditService.logError("GET_RESPIRATORY_CONDITIONS_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function validateRespiratoryStrategy(
  strategyId: string,
  condition: string,
): { valid: boolean; message: string } {
  try {
    const strategy = getOTRespiratoryStrategyById(strategyId);
    if (!strategy) return { valid: false, message: "Strategy not found" };
    if (!condition || typeof condition !== "string")
      return { valid: false, message: "Condition must be a string" };
    const hasCondition = strategy.respiratoryConditions.some((c) =>
      c.toLowerCase().includes(condition.toLowerCase()),
    );
    return {
      valid: hasCondition,
      message: hasCondition ? "Condition supported" : "Condition not supported",
    };
  } catch (error) {
    auditService.logError("VALIDATE_RESPIRATORY_STRATEGY_ERROR", {
      strategyId,
      condition,
      error: error instanceof Error ? error.message : String(error),
    });
    return { valid: false, message: "Validation error" };
  }
}

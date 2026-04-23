/**
 * OT Dementia Occupational Engagement Data
 * Occupational therapy strategies for meaningful engagement across dementia stages
 */

import { auditService } from "../core/audit/AuditService";

export interface OTDementiaEngagementStrategy {
  id: string;
  name: string;
  category: string;
  description: string;
  dementiaStages: string[];
  occupationalGoals: string[];
  engagementStrategies: string[];
  adaptiveApproaches: string[];
  environmentalModifications: string[];
  caregiverStrategies: string[];
  evidenceLevel: 1 | 2 | 3;
  source: string;
  lastUpdated: Date;
}

const strategies: OTDementiaEngagementStrategy[] = [
  {
    id: "ot-dem-001",
    name: "Meaningful Activity Engagement",
    category: "Occupational",
    description:
      "Structured occupational engagement using life history, preferences, and meaningful activities to maintain identity and purpose across dementia stages",
    dementiaStages: ["Early stage", "Middle stage", "Late stage"],
    occupationalGoals: [
      "Maintain sense of identity",
      "Preserve meaningful roles",
      "Enhance quality of life",
      "Reduce behavioral symptoms",
      "Promote social connection",
    ],
    engagementStrategies: [
      "Life history review",
      "Preferred activity engagement",
      "Reminiscence activities",
      "Creative expression",
      "Sensory engagement",
    ],
    adaptiveApproaches: [
      "Simplified instructions",
      "Visual cuing",
      "Hand-over-hand guidance",
      "Environmental supports",
      "Caregiver facilitation",
    ],
    environmentalModifications: [
      "Familiar objects and photos",
      "Reduced distractions",
      "Adequate lighting",
      "Accessible activity spaces",
      "Safe exploration areas",
    ],
    caregiverStrategies: [
      "Activity planning",
      "Behavioral observation",
      "Flexibility and patience",
      "Positive reinforcement",
      "Documentation of preferences",
    ],
    evidenceLevel: 1,
    source: "AOTA Dementia Care Guidelines & Occupational Engagement Research",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-dem-002",
    name: "Cognitive Stimulation & Mental Engagement",
    category: "Occupational",
    description:
      "Cognitive stimulation through occupational activities designed to maintain mental engagement and slow cognitive decline",
    dementiaStages: ["Early stage", "Middle stage"],
    occupationalGoals: [
      "Maintain cognitive function",
      "Preserve mental engagement",
      "Enhance self-efficacy",
      "Reduce depression and anxiety",
      "Promote independence",
    ],
    engagementStrategies: [
      "Puzzle activities",
      "Games and challenges",
      "Learning new skills",
      "Problem-solving tasks",
      "Memory exercises",
    ],
    adaptiveApproaches: [
      "Graded difficulty",
      "Immediate feedback",
      "Success-oriented tasks",
      "Repetition and practice",
      "Errorless learning",
    ],
    environmentalModifications: [
      "Organized activity space",
      "Adequate lighting",
      "Minimal distractions",
      "Accessible materials",
      "Comfortable seating",
    ],
    caregiverStrategies: [
      "Activity selection",
      "Encouragement and support",
      "Patience with errors",
      "Celebration of successes",
      "Regular engagement",
    ],
    evidenceLevel: 1,
    source: "AOTA Cognitive Stimulation Guidelines & Dementia Research",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-dem-003",
    name: "Social Connection & Community Participation",
    category: "Occupational",
    description:
      "Occupational strategies to maintain social connections, community participation, and meaningful relationships across dementia progression",
    dementiaStages: ["Early stage", "Middle stage", "Late stage"],
    occupationalGoals: [
      "Maintain social relationships",
      "Preserve community roles",
      "Reduce isolation and loneliness",
      "Enhance quality of life",
      "Support dignity and respect",
    ],
    engagementStrategies: [
      "Group activities",
      "Social outings",
      "Volunteer opportunities",
      "Family involvement",
      "Peer interaction",
    ],
    adaptiveApproaches: [
      "Structured social activities",
      "Familiar companions",
      "Simplified communication",
      "Environmental supports",
      "Flexible participation",
    ],
    environmentalModifications: [
      "Accessible community spaces",
      "Familiar social settings",
      "Reduced sensory overload",
      "Safe exploration areas",
      "Comfortable gathering spaces",
    ],
    caregiverStrategies: [
      "Activity planning",
      "Companion support",
      "Communication facilitation",
      "Behavioral management",
      "Relationship preservation",
    ],
    evidenceLevel: 1,
    source:
      "AOTA Social Engagement Guidelines & Community Participation Research",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-dem-004",
    name: "Self-Care & ADL Maintenance",
    category: "Occupational",
    description:
      "Occupational strategies to maintain independence in self-care and activities of daily living with adaptive techniques and environmental supports",
    dementiaStages: ["Early stage", "Middle stage", "Late stage"],
    occupationalGoals: [
      "Maintain independence in ADLs",
      "Preserve dignity and self-image",
      "Reduce caregiver burden",
      "Enhance self-efficacy",
      "Promote health and safety",
    ],
    engagementStrategies: [
      "Routine establishment",
      "Adaptive techniques",
      "Environmental cuing",
      "Caregiver assistance",
      "Habit formation",
    ],
    adaptiveApproaches: [
      "Step-by-step guidance",
      "Visual cuing systems",
      "Hand-over-hand assistance",
      "Simplified routines",
      "Consistent scheduling",
    ],
    environmentalModifications: [
      "Accessible bathroom layout",
      "Grab bars and safety equipment",
      "Organized storage",
      "Adequate lighting",
      "Non-slip surfaces",
    ],
    caregiverStrategies: [
      "Routine support",
      "Patience and encouragement",
      "Adaptive equipment use",
      "Safety monitoring",
      "Dignity preservation",
    ],
    evidenceLevel: 1,
    source: "AOTA ADL Guidelines & Dementia Care Research",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-dem-005",
    name: "Behavioral Management & Emotional Regulation",
    category: "Occupational",
    description:
      "Occupational strategies to manage behavioral symptoms and support emotional regulation through meaningful engagement and environmental modification",
    dementiaStages: ["Middle stage", "Late stage"],
    occupationalGoals: [
      "Reduce behavioral symptoms",
      "Support emotional regulation",
      "Enhance quality of life",
      "Reduce caregiver stress",
      "Promote safety and comfort",
    ],
    engagementStrategies: [
      "Sensory activities",
      "Calming occupations",
      "Structured routines",
      "Meaningful engagement",
      "Environmental modification",
    ],
    adaptiveApproaches: [
      "Sensory stimulation",
      "Distraction techniques",
      "Validation approach",
      "Environmental modification",
      "Caregiver de-escalation",
    ],
    environmentalModifications: [
      "Reduced stimulation",
      "Calming colors and lighting",
      "Familiar objects",
      "Safe spaces",
      "Accessible outdoor areas",
    ],
    caregiverStrategies: [
      "Behavioral observation",
      "Trigger identification",
      "De-escalation techniques",
      "Consistent routines",
      "Emotional support",
    ],
    evidenceLevel: 1,
    source: "AOTA Behavioral Management Guidelines & Dementia Care Research",
    lastUpdated: new Date("2024-01-15"),
  },
];

export function getOTDementiaEngagementStrategyById(
  id: string,
): OTDementiaEngagementStrategy | undefined {
  try {
    if (!id || typeof id !== "string") {
      auditService.logWarning("INVALID_OT_DEMENTIA_ID", { id });
      return undefined;
    }
    const strategy = strategies.find((s) => s.id === id);
    if (!strategy) {
      auditService.logWarning("OT_DEMENTIA_NOT_FOUND", { id });
    }
    return strategy;
  } catch (error) {
    auditService.logError("GET_OT_DEMENTIA_ERROR", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

export function getAllOTDementiaEngagementStrategies(): OTDementiaEngagementStrategy[] {
  try {
    return [...strategies];
  } catch (error) {
    auditService.logError("GET_ALL_OT_DEMENTIA_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTDementiaEngagementStrategiesByCategory(
  category: string,
): OTDementiaEngagementStrategy[] {
  try {
    if (!category || typeof category !== "string") {
      auditService.logWarning("INVALID_OT_DEMENTIA_CATEGORY", { category });
      return [];
    }
    return strategies.filter((s) =>
      s.category.toLowerCase().includes(category.toLowerCase()),
    );
  } catch (error) {
    auditService.logError("GET_OT_DEMENTIA_BY_CATEGORY_ERROR", {
      category,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function searchOTDementiaEngagementStrategies(
  query: string,
): OTDementiaEngagementStrategy[] {
  try {
    if (!query || typeof query !== "string") {
      auditService.logWarning("INVALID_OT_DEMENTIA_SEARCH", { query });
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
    auditService.logError("SEARCH_OT_DEMENTIA_ERROR", {
      query,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTDementiaEngagementStrategiesByEvidenceLevel(
  level: 1 | 2 | 3,
): OTDementiaEngagementStrategy[] {
  try {
    if (![1, 2, 3].includes(level)) {
      auditService.logWarning("INVALID_OT_DEMENTIA_EVIDENCE_LEVEL", { level });
      return [];
    }
    return strategies.filter((s) => s.evidenceLevel === level);
  } catch (error) {
    auditService.logError("GET_OT_DEMENTIA_BY_EVIDENCE_ERROR", {
      level,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getDementiaStages(): string[] {
  try {
    const stages = new Set<string>();
    strategies.forEach((s) =>
      s.dementiaStages.forEach((stage) => stages.add(stage)),
    );
    return Array.from(stages).sort();
  } catch (error) {
    auditService.logError("GET_DEMENTIA_STAGES_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function validateDementiaEngagementStrategy(
  strategyId: string,
  stage: string,
): { valid: boolean; message: string } {
  try {
    const strategy = getOTDementiaEngagementStrategyById(strategyId);
    if (!strategy) return { valid: false, message: "Strategy not found" };
    if (!stage || typeof stage !== "string")
      return { valid: false, message: "Stage must be a string" };
    const hasStage = strategy.dementiaStages.some((s) =>
      s.toLowerCase().includes(stage.toLowerCase()),
    );
    return {
      valid: hasStage,
      message: hasStage ? "Stage supported" : "Stage not supported",
    };
  } catch (error) {
    auditService.logError("VALIDATE_DEMENTIA_STRATEGY_ERROR", {
      strategyId,
      stage,
      error: error instanceof Error ? error.message : String(error),
    });
    return { valid: false, message: "Validation error" };
  }
}

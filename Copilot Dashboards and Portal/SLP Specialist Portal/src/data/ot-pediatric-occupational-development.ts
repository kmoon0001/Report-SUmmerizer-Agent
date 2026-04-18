/**
 * OT Pediatric Occupational Development Data
 * Occupational therapy strategies for pediatric occupational development and skill building
 */

import { auditService } from "../core/audit/AuditService";

export interface OTPediatricStrategy {
  id: string;
  name: string;
  category: string;
  description: string;
  ageGroups: string[];
  developmentalGoals: string[];
  playActivities: string[];
  adaptationStrategies: string[];
  environmentalSetup: string[];
  parentCoachingStrategies: string[];
  evidenceLevel: 1 | 2 | 3;
  source: string;
  lastUpdated: Date;
}

const strategies: OTPediatricStrategy[] = [
  {
    id: "ot-ped-001",
    name: "Fine Motor Skill Development",
    category: "Occupational",
    description:
      "Occupational strategies for developing fine motor skills through play and functional activities",
    ageGroups: [
      "Infants (0-12 months)",
      "Toddlers (1-3 years)",
      "Preschool (3-5 years)",
      "School-age (5-12 years)",
    ],
    developmentalGoals: [
      "Develop grasp patterns",
      "Improve hand-eye coordination",
      "Build finger dexterity",
      "Enhance bilateral coordination",
      "Promote independence in ADLs",
    ],
    playActivities: [
      "Grasping toys",
      "Stacking blocks",
      "Drawing and coloring",
      "Puzzles",
      "Bead stringing",
      "Scissor activities",
      "Writing activities",
    ],
    adaptationStrategies: [
      "Graded difficulty",
      "Hand-over-hand guidance",
      "Adaptive equipment",
      "Environmental modification",
      "Positive reinforcement",
    ],
    environmentalSetup: [
      "Accessible play space",
      "Organized materials",
      "Appropriate seating",
      "Good lighting",
      "Safe environment",
    ],
    parentCoachingStrategies: [
      "Activity demonstration",
      "Guided practice",
      "Positive feedback",
      "Home program instruction",
      "Problem-solving support",
    ],
    evidenceLevel: 1,
    source:
      "AOTA Pediatric Development Guidelines & Play-Based Intervention Research",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-ped-002",
    name: "Gross Motor & Play-Based Development",
    category: "Occupational",
    description:
      "Occupational strategies for developing gross motor skills through play and functional activities",
    ageGroups: [
      "Infants (0-12 months)",
      "Toddlers (1-3 years)",
      "Preschool (3-5 years)",
      "School-age (5-12 years)",
    ],
    developmentalGoals: [
      "Develop postural control",
      "Improve balance and coordination",
      "Build strength and endurance",
      "Enhance motor planning",
      "Promote active play",
    ],
    playActivities: [
      "Rolling and crawling",
      "Climbing",
      "Running and jumping",
      "Ball activities",
      "Obstacle courses",
      "Dance and movement",
      "Sports activities",
    ],
    adaptationStrategies: [
      "Graded difficulty",
      "Environmental modification",
      "Adaptive equipment",
      "Peer support",
      "Positive reinforcement",
    ],
    environmentalSetup: [
      "Safe play space",
      "Accessible equipment",
      "Appropriate surfaces",
      "Clear pathways",
      "Organized materials",
    ],
    parentCoachingStrategies: [
      "Activity demonstration",
      "Guided practice",
      "Safety instruction",
      "Home program design",
      "Community resource connection",
    ],
    evidenceLevel: 1,
    source: "AOTA Pediatric Gross Motor Development Guidelines & Play Research",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-ped-003",
    name: "Self-Care & ADL Development",
    category: "Occupational",
    description:
      "Occupational strategies for developing self-care and ADL skills in children",
    ageGroups: [
      "Toddlers (1-3 years)",
      "Preschool (3-5 years)",
      "School-age (5-12 years)",
    ],
    developmentalGoals: [
      "Develop independence in dressing",
      "Build feeding skills",
      "Promote toileting independence",
      "Enhance hygiene habits",
      "Support self-care routines",
    ],
    playActivities: [
      "Dressing dolls",
      "Pretend play",
      "Cooking activities",
      "Bathroom routines",
      "Grooming activities",
      "Laundry activities",
      "Meal preparation",
    ],
    adaptationStrategies: [
      "Task breakdown",
      "Visual cuing",
      "Adaptive equipment",
      "Positive reinforcement",
      "Gradual independence",
    ],
    environmentalSetup: [
      "Accessible bathroom",
      "Accessible kitchen",
      "Organized storage",
      "Appropriate furniture height",
      "Safe environment",
    ],
    parentCoachingStrategies: [
      "Routine establishment",
      "Positive reinforcement",
      "Problem-solving",
      "Independence building",
      "Consistency strategies",
    ],
    evidenceLevel: 1,
    source: "AOTA Pediatric ADL Development Guidelines & Self-Care Research",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-ped-004",
    name: "Social & Play Skills Development",
    category: "Occupational",
    description:
      "Occupational strategies for developing social and play skills in children",
    ageGroups: [
      "Toddlers (1-3 years)",
      "Preschool (3-5 years)",
      "School-age (5-12 years)",
    ],
    developmentalGoals: [
      "Develop peer interaction skills",
      "Build cooperative play",
      "Enhance communication",
      "Promote turn-taking",
      "Support friendship development",
    ],
    playActivities: [
      "Parallel play",
      "Cooperative games",
      "Group activities",
      "Role-playing",
      "Team sports",
      "Social clubs",
      "Community activities",
    ],
    adaptationStrategies: [
      "Social coaching",
      "Peer support",
      "Environmental modification",
      "Visual supports",
      "Positive reinforcement",
    ],
    environmentalSetup: [
      "Accessible play space",
      "Organized materials",
      "Peer-friendly setup",
      "Clear communication",
      "Safe environment",
    ],
    parentCoachingStrategies: [
      "Social skill coaching",
      "Peer facilitation",
      "Problem-solving",
      "Communication support",
      "Community connection",
    ],
    evidenceLevel: 1,
    source: "AOTA Pediatric Social Development Guidelines & Play Research",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-ped-005",
    name: "School Readiness & Academic Skill Development",
    category: "Occupational",
    description:
      "Occupational strategies for developing school readiness and academic skills",
    ageGroups: ["Preschool (3-5 years)", "School-age (5-12 years)"],
    developmentalGoals: [
      "Develop pre-academic skills",
      "Build attention and focus",
      "Enhance organization skills",
      "Promote independence",
      "Support academic success",
    ],
    playActivities: [
      "Letter and number activities",
      "Reading activities",
      "Writing activities",
      "Organizational games",
      "Problem-solving activities",
      "Learning games",
      "Project-based activities",
    ],
    adaptationStrategies: [
      "Task breakdown",
      "Visual supports",
      "Adaptive equipment",
      "Environmental modification",
      "Positive reinforcement",
    ],
    environmentalSetup: [
      "Organized workspace",
      "Appropriate seating",
      "Good lighting",
      "Minimal distractions",
      "Accessible materials",
    ],
    parentCoachingStrategies: [
      "Home learning support",
      "Organization strategies",
      "Attention building",
      "Positive reinforcement",
      "School collaboration",
    ],
    evidenceLevel: 1,
    source: "AOTA School Readiness Guidelines & Academic Development Research",
    lastUpdated: new Date("2024-01-15"),
  },
];

export function getOTPediatricStrategyById(
  id: string,
): OTPediatricStrategy | undefined {
  try {
    if (!id || typeof id !== "string") {
      auditService.logWarning("INVALID_OT_PED_ID", { id });
      return undefined;
    }
    const strategy = strategies.find((s) => s.id === id);
    if (!strategy) {
      auditService.logWarning("OT_PED_NOT_FOUND", { id });
    }
    return strategy;
  } catch (error) {
    auditService.logError("GET_OT_PED_ERROR", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

export function getAllOTPediatricStrategies(): OTPediatricStrategy[] {
  try {
    return [...strategies];
  } catch (error) {
    auditService.logError("GET_ALL_OT_PED_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTPediatricStrategiesByCategory(
  category: string,
): OTPediatricStrategy[] {
  try {
    if (!category || typeof category !== "string") {
      auditService.logWarning("INVALID_OT_PED_CATEGORY", { category });
      return [];
    }
    return strategies.filter((s) =>
      s.category.toLowerCase().includes(category.toLowerCase()),
    );
  } catch (error) {
    auditService.logError("GET_OT_PED_BY_CATEGORY_ERROR", {
      category,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function searchOTPediatricStrategies(
  query: string,
): OTPediatricStrategy[] {
  try {
    if (!query || typeof query !== "string") {
      auditService.logWarning("INVALID_OT_PED_SEARCH", { query });
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
    auditService.logError("SEARCH_OT_PED_ERROR", {
      query,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTPediatricStrategiesByEvidenceLevel(
  level: 1 | 2 | 3,
): OTPediatricStrategy[] {
  try {
    if (![1, 2, 3].includes(level)) {
      auditService.logWarning("INVALID_OT_PED_EVIDENCE_LEVEL", { level });
      return [];
    }
    return strategies.filter((s) => s.evidenceLevel === level);
  } catch (error) {
    auditService.logError("GET_OT_PED_BY_EVIDENCE_ERROR", {
      level,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getAgeGroups(): string[] {
  try {
    const groups = new Set<string>();
    strategies.forEach((s) => s.ageGroups.forEach((g) => groups.add(g)));
    return Array.from(groups).sort();
  } catch (error) {
    auditService.logError("GET_AGE_GROUPS_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function validatePediatricStrategy(
  strategyId: string,
  ageGroup: string,
): { valid: boolean; message: string } {
  try {
    const strategy = getOTPediatricStrategyById(strategyId);
    if (!strategy) return { valid: false, message: "Strategy not found" };
    if (!ageGroup || typeof ageGroup !== "string")
      return { valid: false, message: "Age group must be a string" };
    const hasAgeGroup = strategy.ageGroups.some((g) =>
      g.toLowerCase().includes(ageGroup.toLowerCase()),
    );
    return {
      valid: hasAgeGroup,
      message: hasAgeGroup ? "Age group supported" : "Age group not supported",
    };
  } catch (error) {
    auditService.logError("VALIDATE_PEDIATRIC_STRATEGY_ERROR", {
      strategyId,
      ageGroup,
      error: error instanceof Error ? error.message : String(error),
    });
    return { valid: false, message: "Validation error" };
  }
}

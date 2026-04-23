/**
 * PT Advanced Specialty - Pediatric Rehabilitation
 */

import { auditService } from "../core/audit/AuditService";

export interface PTPediatricsModule {
  id: string;
  name: string;
  category: string;
  description: string;
  ageGroups: string[];
  developmentalFocus: string[];
  interventionApproaches: string[];
  parentTraining: string[];
  evidenceLevel: 1 | 2 | 3;
  source: string;
  citation: string;
  lastUpdated: Date;
}

const modules: PTPediatricsModule[] = [
  {
    id: "pt-ped-001",
    name: "Cerebral Palsy Management",
    category: "Pediatric Rehabilitation",
    description:
      "PT management of cerebral palsy addressing motor control, tone, and functional mobility",
    ageGroups: [
      "Infants",
      "Toddlers",
      "Preschool",
      "School-age",
      "Adolescents",
    ],
    developmentalFocus: [
      "Gross motor development",
      "Postural control",
      "Tone management",
      "Functional mobility",
      "Gait training",
    ],
    interventionApproaches: [
      "Neurodevelopmental treatment",
      "Constraint-induced therapy",
      "Task-specific training",
      "Robotic therapy",
      "Functional training",
    ],
    parentTraining: [
      "Home exercise program",
      "Positioning strategies",
      "Handling techniques",
      "Activity modification",
      "Community integration",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Cerebral Palsy Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-ped-002",
    name: "Developmental Delay Management",
    category: "Pediatric Rehabilitation",
    description:
      "PT management of developmental delays addressing motor milestones and functional skills",
    ageGroups: ["Infants", "Toddlers", "Preschool"],
    developmentalFocus: [
      "Gross motor milestones",
      "Fine motor skills",
      "Postural control",
      "Functional mobility",
      "Play-based learning",
    ],
    interventionApproaches: [
      "Developmental therapy",
      "Play-based intervention",
      "Task-specific training",
      "Environmental modification",
      "Family-centered care",
    ],
    parentTraining: [
      "Home exercise program",
      "Activity modification",
      "Play strategies",
      "Developmental expectations",
      "Community resources",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Developmental Delay Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-ped-003",
    name: "Spina Bifida Management",
    category: "Pediatric Rehabilitation",
    description:
      "PT management of spina bifida addressing mobility, independence, and functional skills",
    ageGroups: [
      "Infants",
      "Toddlers",
      "Preschool",
      "School-age",
      "Adolescents",
    ],
    developmentalFocus: [
      "Gross motor development",
      "Mobility training",
      "Wheelchair skills",
      "Functional independence",
      "Community mobility",
    ],
    interventionApproaches: [
      "Mobility training",
      "Wheelchair prescription",
      "Orthotic management",
      "Functional training",
      "Community integration",
    ],
    parentTraining: [
      "Mobility assistance",
      "Wheelchair management",
      "Orthotic care",
      "Activity modification",
      "Community access",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Spina Bifida Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-ped-004",
    name: "Juvenile Idiopathic Arthritis Management",
    category: "Pediatric Rehabilitation",
    description:
      "PT management of JIA addressing joint protection, ROM, strength, and functional mobility",
    ageGroups: ["Toddlers", "Preschool", "School-age", "Adolescents"],
    developmentalFocus: [
      "Joint protection",
      "Range of motion",
      "Strength maintenance",
      "Functional mobility",
      "Pain management",
    ],
    interventionApproaches: [
      "Joint protection strategies",
      "ROM exercises",
      "Strengthening",
      "Aquatic therapy",
      "Functional training",
    ],
    parentTraining: [
      "Home exercise program",
      "Joint protection",
      "Activity modification",
      "Pain management",
      "School accommodation",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Juvenile Idiopathic Arthritis Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-ped-005",
    name: "Sports Injury Prevention & Rehabilitation",
    category: "Pediatric Rehabilitation",
    description:
      "PT management of sports injuries addressing prevention, rehabilitation, and return to sport",
    ageGroups: ["School-age", "Adolescents"],
    developmentalFocus: [
      "Injury prevention",
      "Strength training",
      "Proprioceptive training",
      "Sport-specific skills",
      "Return to play",
    ],
    interventionApproaches: [
      "Injury prevention programs",
      "Rehabilitation protocols",
      "Sport-specific training",
      "Psychological support",
      "Gradual return to play",
    ],
    parentTraining: [
      "Injury prevention",
      "Activity modification",
      "Return to play guidelines",
      "Sport-specific training",
      "Psychological support",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Sports Injury Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
];

export function getPTPediatricsModuleById(
  id: string,
): PTPediatricsModule | undefined {
  try {
    if (!id || typeof id !== "string") {
      auditService.logWarning("INVALID_PT_PED_ID", { id });
      return undefined;
    }
    const module = modules.find((m) => m.id === id);
    if (!module) {
      auditService.logWarning("PT_PED_NOT_FOUND", { id });
    }
    return module;
  } catch (error) {
    auditService.logError("GET_PT_PED_ERROR", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

export function getAllPTPediatricsModules(): PTPediatricsModule[] {
  try {
    return [...modules];
  } catch (error) {
    auditService.logError("GET_ALL_PT_PED_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getPTPediatricsModulesByCategory(
  category: string,
): PTPediatricsModule[] {
  try {
    if (!category || typeof category !== "string") {
      auditService.logWarning("INVALID_PT_PED_CATEGORY", { category });
      return [];
    }
    return modules.filter((m) =>
      m.category.toLowerCase().includes(category.toLowerCase()),
    );
  } catch (error) {
    auditService.logError("GET_PT_PED_BY_CATEGORY_ERROR", {
      category,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function searchPTPediatricsModules(query: string): PTPediatricsModule[] {
  try {
    if (!query || typeof query !== "string") {
      auditService.logWarning("INVALID_PT_PED_SEARCH", { query });
      return [];
    }
    const lowerQuery = query.toLowerCase();
    return modules.filter(
      (m) =>
        m.name.toLowerCase().includes(lowerQuery) ||
        m.category.toLowerCase().includes(lowerQuery) ||
        m.description.toLowerCase().includes(lowerQuery),
    );
  } catch (error) {
    auditService.logError("SEARCH_PT_PED_ERROR", {
      query,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getPTPediatricsModulesByEvidenceLevel(
  level: 1 | 2 | 3,
): PTPediatricsModule[] {
  try {
    if (![1, 2, 3].includes(level)) {
      auditService.logWarning("INVALID_PT_PED_EVIDENCE_LEVEL", { level });
      return [];
    }
    return modules.filter((m) => m.evidenceLevel === level);
  } catch (error) {
    auditService.logError("GET_PT_PED_BY_EVIDENCE_ERROR", {
      level,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getPTPediatricsInterventionApproaches(): string[] {
  try {
    const approaches = new Set<string>();
    modules.forEach((m) =>
      m.interventionApproaches.forEach((a) => approaches.add(a)),
    );
    return Array.from(approaches).sort();
  } catch (error) {
    auditService.logError("GET_PT_PED_APPROACHES_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function validatePTPediatricsParentTraining(
  moduleId: string,
  training: string,
): { valid: boolean; message: string } {
  try {
    const module = getPTPediatricsModuleById(moduleId);
    if (!module) return { valid: false, message: "Module not found" };
    if (!training || typeof training !== "string")
      return { valid: false, message: "Training must be a string" };
    const hasTraining = module.parentTraining.some((t) =>
      t.toLowerCase().includes(training.toLowerCase()),
    );
    return {
      valid: hasTraining,
      message: hasTraining ? "Training found" : "Training not found",
    };
  } catch (error) {
    auditService.logError("VALIDATE_PT_PED_TRAINING_ERROR", {
      moduleId,
      training,
      error: error instanceof Error ? error.message : String(error),
    });
    return { valid: false, message: "Validation error" };
  }
}

/**
 * PT Advanced Specialty - Geriatric Rehabilitation
 */

import { auditService } from "../core/audit/AuditService";

export interface PTGeriatricsModule {
  id: string;
  name: string;
  category: string;
  description: string;
  ageGroups: string[];
  clinicalFocus: string[];
  interventionApproaches: string[];
  fallPrevention: string[];
  evidenceLevel: 1 | 2 | 3;
  source: string;
  citation: string;
  lastUpdated: Date;
}

const modules: PTGeriatricsModule[] = [
  {
    id: "pt-ger-001",
    name: "Fall Prevention & Balance Training",
    category: "Geriatric Rehabilitation",
    description:
      "PT management of fall risk addressing balance, strength, and environmental factors",
    ageGroups: ["65-74 years", "75-84 years", "85+ years"],
    clinicalFocus: [
      "Balance assessment",
      "Fall risk assessment",
      "Strength evaluation",
      "Gait analysis",
      "Environmental assessment",
    ],
    interventionApproaches: [
      "Balance training",
      "Strength training",
      "Gait training",
      "Environmental modification",
      "Assistive device prescription",
    ],
    fallPrevention: [
      "Home safety assessment",
      "Assistive device training",
      "Balance exercises",
      "Strength training",
      "Vision/hearing screening",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Fall Prevention Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-ger-002",
    name: "Post-Stroke Rehabilitation",
    category: "Geriatric Rehabilitation",
    description:
      "PT management of stroke survivors addressing motor recovery, functional mobility, and community integration",
    ageGroups: ["65-74 years", "75-84 years", "85+ years"],
    clinicalFocus: [
      "Motor recovery",
      "Functional mobility",
      "Gait training",
      "Balance training",
      "Cognitive-motor integration",
    ],
    interventionApproaches: [
      "Neuromotor training",
      "Task-specific training",
      "Constraint-induced therapy",
      "Robotic therapy",
      "Functional training",
    ],
    fallPrevention: [
      "Balance training",
      "Gait training",
      "Strength training",
      "Environmental modification",
      "Assistive device prescription",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Stroke Rehabilitation Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-ger-003",
    name: "Osteoarthritis Management",
    category: "Geriatric Rehabilitation",
    description:
      "PT management of osteoarthritis addressing pain, ROM, strength, and functional mobility",
    ageGroups: ["65-74 years", "75-84 years", "85+ years"],
    clinicalFocus: [
      "Pain management",
      "ROM improvement",
      "Strength training",
      "Functional mobility",
      "Activity modification",
    ],
    interventionApproaches: [
      "Joint protection",
      "ROM exercises",
      "Strengthening",
      "Aquatic therapy",
      "Functional training",
    ],
    fallPrevention: [
      "Strength training",
      "Balance training",
      "Gait training",
      "Assistive device prescription",
      "Environmental modification",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Osteoarthritis Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-ger-004",
    name: "Parkinson's Disease Management",
    category: "Geriatric Rehabilitation",
    description:
      "PT management of Parkinson's disease addressing motor control, balance, and functional mobility",
    ageGroups: ["65-74 years", "75-84 years", "85+ years"],
    clinicalFocus: [
      "Motor control",
      "Balance training",
      "Gait training",
      "Postural stability",
      "Functional mobility",
    ],
    interventionApproaches: [
      "Cueing strategies",
      "Balance training",
      "Gait training",
      "Strength training",
      "Functional training",
    ],
    fallPrevention: [
      "Balance training",
      "Gait training",
      "Strength training",
      "Environmental modification",
      "Assistive device prescription",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Parkinson's Disease Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-ger-005",
    name: "Deconditioning & Frailty Management",
    category: "Geriatric Rehabilitation",
    description:
      "PT management of deconditioning and frailty addressing strength, endurance, and functional independence",
    ageGroups: ["75-84 years", "85+ years"],
    clinicalFocus: [
      "Strength assessment",
      "Endurance assessment",
      "Functional mobility",
      "Activity tolerance",
      "Nutritional status",
    ],
    interventionApproaches: [
      "Strength training",
      "Aerobic conditioning",
      "Functional training",
      "Balance training",
      "Nutritional counseling",
    ],
    fallPrevention: [
      "Strength training",
      "Balance training",
      "Gait training",
      "Environmental modification",
      "Assistive device prescription",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Frailty Management Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
];

export function getPTGeriatricsModuleById(
  id: string,
): PTGeriatricsModule | undefined {
  try {
    if (!id || typeof id !== "string") {
      auditService.logWarning("INVALID_PT_GER_ID", { id });
      return undefined;
    }
    const module = modules.find((m) => m.id === id);
    if (!module) {
      auditService.logWarning("PT_GER_NOT_FOUND", { id });
    }
    return module;
  } catch (error) {
    auditService.logError("GET_PT_GER_ERROR", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

export function getAllPTGeriatricsModules(): PTGeriatricsModule[] {
  try {
    return [...modules];
  } catch (error) {
    auditService.logError("GET_ALL_PT_GER_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getPTGeriatricsModulesByCategory(
  category: string,
): PTGeriatricsModule[] {
  try {
    if (!category || typeof category !== "string") {
      auditService.logWarning("INVALID_PT_GER_CATEGORY", { category });
      return [];
    }
    return modules.filter((m) =>
      m.category.toLowerCase().includes(category.toLowerCase()),
    );
  } catch (error) {
    auditService.logError("GET_PT_GER_BY_CATEGORY_ERROR", {
      category,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function searchPTGeriatricsModules(query: string): PTGeriatricsModule[] {
  try {
    if (!query || typeof query !== "string") {
      auditService.logWarning("INVALID_PT_GER_SEARCH", { query });
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
    auditService.logError("SEARCH_PT_GER_ERROR", {
      query,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getPTGeriatricsModulesByEvidenceLevel(
  level: 1 | 2 | 3,
): PTGeriatricsModule[] {
  try {
    if (![1, 2, 3].includes(level)) {
      auditService.logWarning("INVALID_PT_GER_EVIDENCE_LEVEL", { level });
      return [];
    }
    return modules.filter((m) => m.evidenceLevel === level);
  } catch (error) {
    auditService.logError("GET_PT_GER_BY_EVIDENCE_ERROR", {
      level,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getPTGeriatricsFallPreventionStrategies(): string[] {
  try {
    const strategies = new Set<string>();
    modules.forEach((m) => m.fallPrevention.forEach((s) => strategies.add(s)));
    return Array.from(strategies).sort();
  } catch (error) {
    auditService.logError("GET_PT_GER_STRATEGIES_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function validatePTGeriatricsIntervention(
  moduleId: string,
  intervention: string,
): { valid: boolean; message: string } {
  try {
    const module = getPTGeriatricsModuleById(moduleId);
    if (!module) return { valid: false, message: "Module not found" };
    if (!intervention || typeof intervention !== "string")
      return { valid: false, message: "Intervention must be a string" };
    const hasIntervention = module.interventionApproaches.some((i) =>
      i.toLowerCase().includes(intervention.toLowerCase()),
    );
    return {
      valid: hasIntervention,
      message: hasIntervention
        ? "Intervention found"
        : "Intervention not found",
    };
  } catch (error) {
    auditService.logError("VALIDATE_PT_GER_INTERVENTION_ERROR", {
      moduleId,
      intervention,
      error: error instanceof Error ? error.message : String(error),
    });
    return { valid: false, message: "Validation error" };
  }
}

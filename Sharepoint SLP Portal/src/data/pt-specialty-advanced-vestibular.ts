/**
 * PT Advanced Specialty - Vestibular Rehabilitation
 */

import { auditService } from "../core/audit/AuditService";

export interface PTVestibularModule {
  id: string;
  name: string;
  category: string;
  description: string;
  conditionTypes: string[];
  assessmentFocus: string[];
  interventionStrategies: string[];
  precautions: string[];
  evidenceLevel: 1 | 2 | 3;
  source: string;
  citation: string;
  lastUpdated: Date;
}

const modules: PTVestibularModule[] = [
  {
    id: "pt-vb-001",
    name: "Benign Paroxysmal Positional Vertigo (BPPV)",
    category: "Vestibular Rehabilitation",
    description:
      "PT management of BPPV addressing positional vertigo, balance, and functional mobility",
    conditionTypes: [
      "Posterior canal BPPV",
      "Anterior canal BPPV",
      "Horizontal canal BPPV",
      "Recurrent BPPV",
    ],
    assessmentFocus: [
      "Dix-Hallpike test",
      "Supine roll test",
      "Balance assessment",
      "Gait analysis",
      "Functional mobility",
    ],
    interventionStrategies: [
      "Canalith repositioning",
      "Habituation exercises",
      "Balance training",
      "Gait training",
      "Home exercise program",
    ],
    precautions: [
      "Vertigo triggers",
      "Fall risk",
      "Nausea management",
      "Anxiety management",
      "Activity restrictions",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). BPPV Management Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-vb-002",
    name: "Vestibular Neuritis & Labyrinthitis",
    category: "Vestibular Rehabilitation",
    description:
      "PT management of vestibular neuritis and labyrinthitis addressing vertigo, balance, and functional recovery",
    conditionTypes: [
      "Vestibular neuritis",
      "Labyrinthitis",
      "Viral labyrinthitis",
      "Bacterial labyrinthitis",
    ],
    assessmentFocus: [
      "Vertigo severity",
      "Balance assessment",
      "Gait analysis",
      "Functional mobility",
      "Nystagmus assessment",
    ],
    interventionStrategies: [
      "Vestibular habituation",
      "Balance training",
      "Gait training",
      "Proprioceptive training",
      "Home exercise program",
    ],
    precautions: [
      "Vertigo triggers",
      "Fall risk",
      "Nausea management",
      "Anxiety management",
      "Activity restrictions",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Vestibular Neuritis Management Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-vb-003",
    name: "Meniere's Disease Management",
    category: "Vestibular Rehabilitation",
    description:
      "PT management of Meniere's disease addressing vertigo, balance, and functional independence",
    conditionTypes: [
      "Meniere's disease",
      "Recurrent vertigo",
      "Fluctuating hearing loss",
      "Tinnitus",
    ],
    assessmentFocus: [
      "Vertigo severity",
      "Balance assessment",
      "Gait analysis",
      "Functional mobility",
      "Hearing assessment",
    ],
    interventionStrategies: [
      "Vestibular habituation",
      "Balance training",
      "Gait training",
      "Proprioceptive training",
      "Home exercise program",
    ],
    precautions: [
      "Vertigo triggers",
      "Fall risk",
      "Nausea management",
      "Anxiety management",
      "Activity restrictions",
    ],
    evidenceLevel: 2,
    source: "APTA",
    citation: "APTA (2020). Meniere's Disease Management Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-vb-004",
    name: "Central Vestibular Disorders",
    category: "Vestibular Rehabilitation",
    description:
      "PT management of central vestibular disorders addressing balance, coordination, and functional mobility",
    conditionTypes: [
      "Stroke",
      "Cerebellar dysfunction",
      "Brainstem lesions",
      "Multiple sclerosis",
    ],
    assessmentFocus: [
      "Balance assessment",
      "Coordination assessment",
      "Gait analysis",
      "Functional mobility",
      "Cognitive function",
    ],
    interventionStrategies: [
      "Balance training",
      "Coordination training",
      "Gait training",
      "Proprioceptive training",
      "Functional training",
    ],
    precautions: [
      "Fall risk",
      "Cognitive impairment",
      "Motor deficits",
      "Sensory deficits",
      "Activity restrictions",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Central Vestibular Disorder Management Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-vb-005",
    name: "Vestibular Migraine Management",
    category: "Vestibular Rehabilitation",
    description:
      "PT management of vestibular migraine addressing vertigo, balance, and functional independence",
    conditionTypes: [
      "Vestibular migraine",
      "Migraine-associated vertigo",
      "Recurrent vertigo",
    ],
    assessmentFocus: [
      "Vertigo severity",
      "Migraine triggers",
      "Balance assessment",
      "Gait analysis",
      "Functional mobility",
    ],
    interventionStrategies: [
      "Vestibular habituation",
      "Balance training",
      "Gait training",
      "Trigger identification",
      "Home exercise program",
    ],
    precautions: [
      "Vertigo triggers",
      "Fall risk",
      "Migraine triggers",
      "Anxiety management",
      "Activity restrictions",
    ],
    evidenceLevel: 2,
    source: "APTA",
    citation: "APTA (2020). Vestibular Migraine Management Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
];

export function getPTVestibularModuleById(
  id: string,
): PTVestibularModule | undefined {
  try {
    if (!id || typeof id !== "string") {
      auditService.logWarning("INVALID_PT_VB_ID", { id });
      return undefined;
    }
    const module = modules.find((m) => m.id === id);
    if (!module) {
      auditService.logWarning("PT_VB_NOT_FOUND", { id });
    }
    return module;
  } catch (error) {
    auditService.logError("GET_PT_VB_ERROR", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

export function getAllPTVestibularModules(): PTVestibularModule[] {
  try {
    return [...modules];
  } catch (error) {
    auditService.logError("GET_ALL_PT_VB_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getPTVestibularModulesByCategory(
  category: string,
): PTVestibularModule[] {
  try {
    if (!category || typeof category !== "string") {
      auditService.logWarning("INVALID_PT_VB_CATEGORY", { category });
      return [];
    }
    return modules.filter((m) =>
      m.category.toLowerCase().includes(category.toLowerCase()),
    );
  } catch (error) {
    auditService.logError("GET_PT_VB_BY_CATEGORY_ERROR", {
      category,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function searchPTVestibularModules(query: string): PTVestibularModule[] {
  try {
    if (!query || typeof query !== "string") {
      auditService.logWarning("INVALID_PT_VB_SEARCH", { query });
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
    auditService.logError("SEARCH_PT_VB_ERROR", {
      query,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getPTVestibularModulesByEvidenceLevel(
  level: 1 | 2 | 3,
): PTVestibularModule[] {
  try {
    if (![1, 2, 3].includes(level)) {
      auditService.logWarning("INVALID_PT_VB_EVIDENCE_LEVEL", { level });
      return [];
    }
    return modules.filter((m) => m.evidenceLevel === level);
  } catch (error) {
    auditService.logError("GET_PT_VB_BY_EVIDENCE_ERROR", {
      level,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getPTVestibularInterventionStrategies(): string[] {
  try {
    const strategies = new Set<string>();
    modules.forEach((m) =>
      m.interventionStrategies.forEach((s) => strategies.add(s)),
    );
    return Array.from(strategies).sort();
  } catch (error) {
    auditService.logError("GET_PT_VB_STRATEGIES_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function validatePTVestibularPrecaution(
  moduleId: string,
  precaution: string,
): { valid: boolean; message: string } {
  try {
    const module = getPTVestibularModuleById(moduleId);
    if (!module) return { valid: false, message: "Module not found" };
    if (!precaution || typeof precaution !== "string")
      return { valid: false, message: "Precaution must be a string" };
    const hasPrecaution = module.precautions.some((p) =>
      p.toLowerCase().includes(precaution.toLowerCase()),
    );
    return {
      valid: hasPrecaution,
      message: hasPrecaution ? "Precaution found" : "Precaution not found",
    };
  } catch (error) {
    auditService.logError("VALIDATE_PT_VB_PRECAUTION_ERROR", {
      moduleId,
      precaution,
      error: error instanceof Error ? error.message : String(error),
    });
    return { valid: false, message: "Validation error" };
  }
}

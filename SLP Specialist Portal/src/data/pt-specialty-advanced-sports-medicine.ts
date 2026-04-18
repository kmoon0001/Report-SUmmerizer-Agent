/**
 * PT Advanced Specialty - Sports Medicine Rehabilitation
 */

import { auditService } from "../core/audit/AuditService";

export interface PTSportsMedicineModule {
  id: string;
  name: string;
  category: string;
  description: string;
  injuryTypes: string[];
  assessmentFocus: string[];
  interventionStrategies: string[];
  returnToPlayCriteria: string[];
  evidenceLevel: 1 | 2 | 3;
  source: string;
  citation: string;
  lastUpdated: Date;
}

const modules: PTSportsMedicineModule[] = [
  {
    id: "pt-sm-001",
    name: "Anterior Cruciate Ligament (ACL) Injury",
    category: "Sports Medicine Rehabilitation",
    description:
      "PT management of ACL injuries addressing ROM, strength, proprioception, and return to sport",
    injuryTypes: ["ACL tear", "ACL reconstruction", "ACL partial tear"],
    assessmentFocus: [
      "ROM assessment",
      "Strength testing",
      "Proprioception testing",
      "Functional movement",
      "Psychological readiness",
    ],
    interventionStrategies: [
      "ROM restoration",
      "Strength training",
      "Proprioceptive training",
      "Agility training",
      "Sport-specific training",
    ],
    returnToPlayCriteria: [
      "Strength symmetry >90%",
      "Hop test symmetry >90%",
      "Proprioception restoration",
      "Psychological readiness",
      "Sport-specific skills",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). ACL Rehabilitation Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-sm-002",
    name: "Rotator Cuff Injury",
    category: "Sports Medicine Rehabilitation",
    description:
      "PT management of rotator cuff injuries addressing ROM, strength, scapular stability, and return to sport",
    injuryTypes: [
      "Rotator cuff tear",
      "Rotator cuff strain",
      "Rotator cuff tendinopathy",
    ],
    assessmentFocus: [
      "ROM assessment",
      "Strength testing",
      "Scapular function",
      "Functional movement",
      "Sport-specific demands",
    ],
    interventionStrategies: [
      "ROM restoration",
      "Rotator cuff strengthening",
      "Scapular stabilization",
      "Proprioceptive training",
      "Sport-specific training",
    ],
    returnToPlayCriteria: [
      "Full ROM",
      "Strength symmetry >90%",
      "Scapular stability",
      "Pain-free movement",
      "Sport-specific skills",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Rotator Cuff Rehabilitation Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-sm-003",
    name: "Ankle Sprain",
    category: "Sports Medicine Rehabilitation",
    description:
      "PT management of ankle sprains addressing ROM, strength, proprioception, and return to sport",
    injuryTypes: [
      "Lateral ankle sprain",
      "Medial ankle sprain",
      "High ankle sprain",
    ],
    assessmentFocus: [
      "ROM assessment",
      "Strength testing",
      "Proprioception testing",
      "Functional movement",
      "Sport-specific demands",
    ],
    interventionStrategies: [
      "ROM restoration",
      "Strength training",
      "Proprioceptive training",
      "Balance training",
      "Sport-specific training",
    ],
    returnToPlayCriteria: [
      "Full ROM",
      "Strength symmetry >90%",
      "Balance restoration",
      "Proprioception restoration",
      "Sport-specific skills",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Ankle Sprain Rehabilitation Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-sm-004",
    name: "Hamstring Strain",
    category: "Sports Medicine Rehabilitation",
    description:
      "PT management of hamstring strains addressing ROM, strength, flexibility, and return to sport",
    injuryTypes: [
      "Hamstring strain Grade I",
      "Hamstring strain Grade II",
      "Hamstring strain Grade III",
    ],
    assessmentFocus: [
      "ROM assessment",
      "Strength testing",
      "Flexibility assessment",
      "Functional movement",
      "Sport-specific demands",
    ],
    interventionStrategies: [
      "ROM restoration",
      "Strength training",
      "Flexibility training",
      "Eccentric training",
      "Sport-specific training",
    ],
    returnToPlayCriteria: [
      "Full ROM",
      "Strength symmetry >90%",
      "Flexibility restoration",
      "Pain-free movement",
      "Sport-specific skills",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Hamstring Strain Rehabilitation Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-sm-005",
    name: "Concussion Management",
    category: "Sports Medicine Rehabilitation",
    description:
      "PT management of concussions addressing vestibular function, balance, and return to sport",
    injuryTypes: [
      "Concussion",
      "Mild traumatic brain injury",
      "Post-concussion syndrome",
    ],
    assessmentFocus: [
      "Vestibular function",
      "Balance assessment",
      "Cognitive function",
      "Symptom severity",
      "Sport-specific demands",
    ],
    interventionStrategies: [
      "Vestibular rehabilitation",
      "Balance training",
      "Cognitive strategies",
      "Gradual return to activity",
      "Sport-specific training",
    ],
    returnToPlayCriteria: [
      "Symptom resolution",
      "Vestibular function restoration",
      "Balance restoration",
      "Cognitive clearance",
      "Sport-specific skills",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Concussion Management Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
];

export function getPTSportsMedicineModuleById(
  id: string,
): PTSportsMedicineModule | undefined {
  try {
    if (!id || typeof id !== "string") {
      auditService.logWarning("INVALID_PT_SM_ID", { id });
      return undefined;
    }
    const module = modules.find((m) => m.id === id);
    if (!module) {
      auditService.logWarning("PT_SM_NOT_FOUND", { id });
    }
    return module;
  } catch (error) {
    auditService.logError("GET_PT_SM_ERROR", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

export function getAllPTSportsMedicineModules(): PTSportsMedicineModule[] {
  try {
    return [...modules];
  } catch (error) {
    auditService.logError("GET_ALL_PT_SM_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getPTSportsMedicineModulesByCategory(
  category: string,
): PTSportsMedicineModule[] {
  try {
    if (!category || typeof category !== "string") {
      auditService.logWarning("INVALID_PT_SM_CATEGORY", { category });
      return [];
    }
    return modules.filter((m) =>
      m.category.toLowerCase().includes(category.toLowerCase()),
    );
  } catch (error) {
    auditService.logError("GET_PT_SM_BY_CATEGORY_ERROR", {
      category,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function searchPTSportsMedicineModules(
  query: string,
): PTSportsMedicineModule[] {
  try {
    if (!query || typeof query !== "string") {
      auditService.logWarning("INVALID_PT_SM_SEARCH", { query });
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
    auditService.logError("SEARCH_PT_SM_ERROR", {
      query,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getPTSportsMedicineModulesByEvidenceLevel(
  level: 1 | 2 | 3,
): PTSportsMedicineModule[] {
  try {
    if (![1, 2, 3].includes(level)) {
      auditService.logWarning("INVALID_PT_SM_EVIDENCE_LEVEL", { level });
      return [];
    }
    return modules.filter((m) => m.evidenceLevel === level);
  } catch (error) {
    auditService.logError("GET_PT_SM_BY_EVIDENCE_ERROR", {
      level,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getPTSportsMedicineReturnToPlayCriteria(): string[] {
  try {
    const criteria = new Set<string>();
    modules.forEach((m) =>
      m.returnToPlayCriteria.forEach((c) => criteria.add(c)),
    );
    return Array.from(criteria).sort();
  } catch (error) {
    auditService.logError("GET_PT_SM_CRITERIA_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function validatePTSportsMedicineIntervention(
  moduleId: string,
  intervention: string,
): { valid: boolean; message: string } {
  try {
    const module = getPTSportsMedicineModuleById(moduleId);
    if (!module) return { valid: false, message: "Module not found" };
    if (!intervention || typeof intervention !== "string")
      return { valid: false, message: "Intervention must be a string" };
    const hasIntervention = module.interventionStrategies.some((i) =>
      i.toLowerCase().includes(intervention.toLowerCase()),
    );
    return {
      valid: hasIntervention,
      message: hasIntervention
        ? "Intervention found"
        : "Intervention not found",
    };
  } catch (error) {
    auditService.logError("VALIDATE_PT_SM_INTERVENTION_ERROR", {
      moduleId,
      intervention,
      error: error instanceof Error ? error.message : String(error),
    });
    return { valid: false, message: "Validation error" };
  }
}

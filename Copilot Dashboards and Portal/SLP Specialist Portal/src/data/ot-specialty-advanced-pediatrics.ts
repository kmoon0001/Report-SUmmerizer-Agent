/**
 * OT Advanced Specialty - Pediatric Rehabilitation
 */

import { auditService } from "../core/audit/AuditService";

export interface OTPediatricsModule {
  id: string;
  name: string;
  category: string;
  description: string;
  ageGroups: string[];
  developmentalFocus: string[];
  interventionStrategies: string[];
  schoolAccommodations: string[];
  evidenceLevel: 1 | 2 | 3;
  source: string;
  citation: string;
  lastUpdated: Date;
}

const modules: OTPediatricsModule[] = [
  {
    id: "ot-ped-001",
    name: "Autism Spectrum Disorder Management",
    category: "Pediatric Rehabilitation",
    description:
      "OT management of ASD addressing sensory processing, motor skills, and social participation",
    ageGroups: ["Toddlers", "Preschool", "School-age", "Adolescents"],
    developmentalFocus: [
      "Sensory processing",
      "Motor skills",
      "Social skills",
      "Self-care skills",
      "Play skills",
    ],
    interventionStrategies: [
      "Sensory integration",
      "Social skills training",
      "Motor skill development",
      "Self-care training",
      "Behavioral strategies",
    ],
    schoolAccommodations: [
      "Sensory breaks",
      "Modified assignments",
      "Assistive technology",
      "Visual supports",
      "Structured routines",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Autism Spectrum Disorder Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-ped-002",
    name: "Developmental Coordination Disorder Management",
    category: "Pediatric Rehabilitation",
    description:
      "OT management of DCD addressing motor coordination, fine motor skills, and functional independence",
    ageGroups: ["Preschool", "School-age", "Adolescents"],
    developmentalFocus: [
      "Gross motor coordination",
      "Fine motor skills",
      "Motor planning",
      "Self-care skills",
      "Academic skills",
    ],
    interventionStrategies: [
      "Motor skill training",
      "Task-specific practice",
      "Compensatory strategies",
      "Environmental modification",
      "Assistive technology",
    ],
    schoolAccommodations: [
      "Extended time",
      "Modified assignments",
      "Assistive technology",
      "Preferential seating",
      "Occupational therapy services",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Developmental Coordination Disorder Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-ped-003",
    name: "Cerebral Palsy Management",
    category: "Pediatric Rehabilitation",
    description:
      "OT management of cerebral palsy addressing fine motor skills, self-care, and functional independence",
    ageGroups: [
      "Infants",
      "Toddlers",
      "Preschool",
      "School-age",
      "Adolescents",
    ],
    developmentalFocus: [
      "Fine motor skills",
      "Self-care skills",
      "Functional independence",
      "Adaptive equipment",
      "Community participation",
    ],
    interventionStrategies: [
      "Fine motor training",
      "Self-care training",
      "Adaptive equipment prescription",
      "Compensatory strategies",
      "Functional training",
    ],
    schoolAccommodations: [
      "Assistive technology",
      "Modified assignments",
      "Occupational therapy services",
      "Adaptive equipment",
      "Environmental modification",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Cerebral Palsy Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-ped-004",
    name: "Sensory Processing Disorder Management",
    category: "Pediatric Rehabilitation",
    description:
      "OT management of sensory processing disorders addressing sensory modulation and functional participation",
    ageGroups: ["Toddlers", "Preschool", "School-age", "Adolescents"],
    developmentalFocus: [
      "Sensory modulation",
      "Sensory discrimination",
      "Motor planning",
      "Self-regulation",
      "Functional participation",
    ],
    interventionStrategies: [
      "Sensory integration therapy",
      "Sensory diet",
      "Environmental modification",
      "Behavioral strategies",
      "Coping skills",
    ],
    schoolAccommodations: [
      "Sensory breaks",
      "Quiet space",
      "Fidget tools",
      "Movement breaks",
      "Sensory-friendly environment",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Sensory Processing Disorder Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-ped-005",
    name: "Fine Motor & Handwriting Development",
    category: "Pediatric Rehabilitation",
    description:
      "OT management of fine motor and handwriting difficulties addressing academic performance and independence",
    ageGroups: ["Preschool", "School-age", "Adolescents"],
    developmentalFocus: [
      "Fine motor skills",
      "Handwriting",
      "Pencil grip",
      "Hand strength",
      "Functional independence",
    ],
    interventionStrategies: [
      "Fine motor exercises",
      "Handwriting training",
      "Adaptive equipment",
      "Compensatory strategies",
      "Assistive technology",
    ],
    schoolAccommodations: [
      "Assistive technology",
      "Modified assignments",
      "Extended time",
      "Occupational therapy services",
      "Adaptive equipment",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Fine Motor Development Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
];

export function getOTPediatricsModuleById(
  id: string,
): OTPediatricsModule | undefined {
  try {
    if (!id || typeof id !== "string") {
      auditService.logWarning("INVALID_OT_PED_ID", { id });
      return undefined;
    }
    const module = modules.find((m) => m.id === id);
    if (!module) {
      auditService.logWarning("OT_PED_NOT_FOUND", { id });
    }
    return module;
  } catch (error) {
    auditService.logError("GET_OT_PED_ERROR", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

export function getAllOTPediatricsModules(): OTPediatricsModule[] {
  try {
    return [...modules];
  } catch (error) {
    auditService.logError("GET_ALL_OT_PED_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTPediatricsModulesByCategory(
  category: string,
): OTPediatricsModule[] {
  try {
    if (!category || typeof category !== "string") {
      auditService.logWarning("INVALID_OT_PED_CATEGORY", { category });
      return [];
    }
    return modules.filter((m) =>
      m.category.toLowerCase().includes(category.toLowerCase()),
    );
  } catch (error) {
    auditService.logError("GET_OT_PED_BY_CATEGORY_ERROR", {
      category,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function searchOTPediatricsModules(query: string): OTPediatricsModule[] {
  try {
    if (!query || typeof query !== "string") {
      auditService.logWarning("INVALID_OT_PED_SEARCH", { query });
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
    auditService.logError("SEARCH_OT_PED_ERROR", {
      query,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTPediatricsModulesByEvidenceLevel(
  level: 1 | 2 | 3,
): OTPediatricsModule[] {
  try {
    if (![1, 2, 3].includes(level)) {
      auditService.logWarning("INVALID_OT_PED_EVIDENCE_LEVEL", { level });
      return [];
    }
    return modules.filter((m) => m.evidenceLevel === level);
  } catch (error) {
    auditService.logError("GET_OT_PED_BY_EVIDENCE_ERROR", {
      level,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTPediatricsInterventionStrategies(): string[] {
  try {
    const strategies = new Set<string>();
    modules.forEach((m) =>
      m.interventionStrategies.forEach((s) => strategies.add(s)),
    );
    return Array.from(strategies).sort();
  } catch (error) {
    auditService.logError("GET_OT_PED_STRATEGIES_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function validateOTPediatricsSchoolAccommodation(
  moduleId: string,
  accommodation: string,
): { valid: boolean; message: string } {
  try {
    const module = getOTPediatricsModuleById(moduleId);
    if (!module) return { valid: false, message: "Module not found" };
    if (!accommodation || typeof accommodation !== "string")
      return { valid: false, message: "Accommodation must be a string" };
    const hasAccommodation = module.schoolAccommodations.some((a) =>
      a.toLowerCase().includes(accommodation.toLowerCase()),
    );
    return {
      valid: hasAccommodation,
      message: hasAccommodation
        ? "Accommodation found"
        : "Accommodation not found",
    };
  } catch (error) {
    auditService.logError("VALIDATE_OT_PED_ACCOMMODATION_ERROR", {
      moduleId,
      accommodation,
      error: error instanceof Error ? error.message : String(error),
    });
    return { valid: false, message: "Validation error" };
  }
}

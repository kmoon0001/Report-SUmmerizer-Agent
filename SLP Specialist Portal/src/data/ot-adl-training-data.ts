/**
 * OT ADL Training Data
 * Occupational therapy activities of daily living training and adaptive strategies
 */

import { auditService } from "../core/audit/AuditService";

export interface OTADLActivity {
  id: string;
  name: string;
  category: string;
  description: string;
  occupationalGoals: string[];
  adaptiveStrategies: string[];
  adaptiveEquipment: string[];
  environmentalModifications: string[];
  cognitiveConsiderations: string[];
  safetyConsiderations: string[];
  evidenceLevel: 1 | 2 | 3;
  source: string;
  lastUpdated: Date;
}

const activities: OTADLActivity[] = [
  {
    id: "ot-adl-001",
    name: "Dressing & Grooming",
    category: "Self-Care",
    description:
      "Occupational training for clothing selection, dressing, and personal grooming with adaptive techniques",
    occupationalGoals: [
      "Maintain independence in self-care",
      "Preserve dignity and self-image",
      "Maximize occupational engagement",
      "Reduce caregiver burden",
      "Enhance participation in meaningful roles",
    ],
    adaptiveStrategies: [
      "Seated dressing",
      "Distal to proximal sequencing",
      "One-handed techniques",
      "Clothing organization",
      "Grooming routine establishment",
    ],
    adaptiveEquipment: [
      "Button hooks",
      "Zipper pulls",
      "Sock aids",
      "Dressing sticks",
      "Long-handled mirrors",
      "Adaptive combs",
      "Electric razors",
    ],
    environmentalModifications: [
      "Accessible closet organization",
      "Adequate lighting",
      "Accessible mirrors",
      "Non-slip flooring",
      "Accessible storage",
    ],
    cognitiveConsiderations: [
      "Visual cuing systems",
      "Sequencing aids",
      "Memory supports",
      "Simplified routines",
      "Habit formation",
    ],
    safetyConsiderations: [
      "Non-slip footwear",
      "Fall prevention",
      "Skin integrity monitoring",
      "Temperature awareness",
      "Clothing appropriateness",
    ],
    evidenceLevel: 1,
    source: "AOTA ADL Guidelines & Occupational Performance Research",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-adl-002",
    name: "Bathing & Hygiene",
    category: "Self-Care",
    description:
      "Occupational training for bathing, showering, and personal hygiene with adaptive techniques and equipment",
    occupationalGoals: [
      "Maintain hygiene and health",
      "Preserve independence",
      "Maximize occupational engagement",
      "Reduce caregiver burden",
      "Enhance self-efficacy",
    ],
    adaptiveStrategies: [
      "Seated bathing",
      "Adaptive washing techniques",
      "Water temperature management",
      "Bathing routine establishment",
      "Energy conservation",
    ],
    adaptiveEquipment: [
      "Shower chairs",
      "Grab bars",
      "Handheld showers",
      "Long-handled sponges",
      "Bath benches",
      "Non-slip mats",
      "Soap dispensers",
    ],
    environmentalModifications: [
      "Accessible bathroom layout",
      "Adequate lighting",
      "Temperature control",
      "Non-slip surfaces",
      "Accessible storage",
    ],
    cognitiveConsiderations: [
      "Visual cuing systems",
      "Sequencing aids",
      "Memory supports",
      "Simplified routines",
      "Safety awareness",
    ],
    safetyConsiderations: [
      "Fall prevention",
      "Water temperature control",
      "Skin integrity monitoring",
      "Aspiration prevention",
      "Emergency access",
    ],
    evidenceLevel: 1,
    source: "AOTA ADL Guidelines & Occupational Performance Research",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-adl-003",
    name: "Toileting & Continence Management",
    category: "Self-Care",
    description:
      "Occupational training for toileting, continence management, and adaptive techniques for independence",
    occupationalGoals: [
      "Maintain continence and dignity",
      "Maximize independence",
      "Reduce caregiver burden",
      "Enhance participation",
      "Preserve self-image",
    ],
    adaptiveStrategies: [
      "Toilet transfer techniques",
      "Continence management strategies",
      "Timing and scheduling",
      "Adaptive positioning",
      "Hygiene techniques",
    ],
    adaptiveEquipment: [
      "Raised toilet seats",
      "Grab bars",
      "Commode chairs",
      "Toilet safety frames",
      "Bedside commodes",
      "Adaptive wiping aids",
    ],
    environmentalModifications: [
      "Accessible bathroom layout",
      "Adequate lighting",
      "Non-slip surfaces",
      "Grab bar placement",
      "Accessible storage",
    ],
    cognitiveConsiderations: [
      "Visual cuing systems",
      "Routine establishment",
      "Memory supports",
      "Behavioral strategies",
      "Caregiver communication",
    ],
    safetyConsiderations: [
      "Fall prevention",
      "Skin integrity monitoring",
      "Infection prevention",
      "Emergency access",
      "Dignity preservation",
    ],
    evidenceLevel: 1,
    source: "AOTA ADL Guidelines & Occupational Performance Research",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-adl-004",
    name: "Feeding & Eating",
    category: "Self-Care",
    description:
      "Occupational training for feeding, eating, and adaptive techniques for nutritional independence",
    occupationalGoals: [
      "Maintain nutritional intake",
      "Maximize independence",
      "Enhance occupational engagement",
      "Preserve dignity",
      "Reduce caregiver burden",
    ],
    adaptiveStrategies: [
      "Adaptive utensil use",
      "One-handed eating techniques",
      "Positioning for safety",
      "Pacing strategies",
      "Sensory awareness",
    ],
    adaptiveEquipment: [
      "Adaptive utensils",
      "Non-slip mats",
      "Cup holders",
      "Plate guards",
      "Scoop dishes",
      "Weighted utensils",
      "Straw clips",
    ],
    environmentalModifications: [
      "Accessible table height",
      "Adequate lighting",
      "Non-slip surfaces",
      "Accessible storage",
      "Comfortable seating",
    ],
    cognitiveConsiderations: [
      "Visual cuing systems",
      "Sequencing aids",
      "Memory supports",
      "Safety awareness",
      "Swallowing precautions",
    ],
    safetyConsiderations: [
      "Upright positioning",
      "Aspiration prevention",
      "Choking prevention",
      "Food temperature awareness",
      "Nutritional monitoring",
    ],
    evidenceLevel: 1,
    source: "AOTA ADL Guidelines & Occupational Performance Research",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-adl-005",
    name: "Medication Management & Health Maintenance",
    category: "Instrumental ADL",
    description:
      "Occupational training for medication management, health maintenance, and adaptive strategies for independence",
    occupationalGoals: [
      "Maintain medication compliance",
      "Maximize independence",
      "Enhance health outcomes",
      "Reduce caregiver burden",
      "Preserve autonomy",
    ],
    adaptiveStrategies: [
      "Medication organization systems",
      "Reminder systems",
      "Simplified routines",
      "Visual cuing",
      "Caregiver coordination",
    ],
    adaptiveEquipment: [
      "Pill organizers",
      "Medication reminders",
      "Large-print labels",
      "Adaptive containers",
      "Magnifying glasses",
    ],
    environmentalModifications: [
      "Accessible storage",
      "Adequate lighting",
      "Organized workspace",
      "Emergency access",
      "Temperature control",
    ],
    cognitiveConsiderations: [
      "Memory supports",
      "Visual cuing systems",
      "Routine establishment",
      "Simplified instructions",
      "Caregiver involvement",
    ],
    safetyConsiderations: [
      "Medication accuracy",
      "Overdose prevention",
      "Drug interactions",
      "Storage safety",
      "Emergency protocols",
    ],
    evidenceLevel: 1,
    source: "AOTA IADL Guidelines & Health Management Research",
    lastUpdated: new Date("2024-01-15"),
  },
];

export function getOTADLActivityById(id: string): OTADLActivity | undefined {
  try {
    if (!id || typeof id !== "string") {
      auditService.logWarning("INVALID_OT_ADL_ID", { id });
      return undefined;
    }
    const activity = activities.find((a) => a.id === id);
    if (!activity) {
      auditService.logWarning("OT_ADL_NOT_FOUND", { id });
    }
    return activity;
  } catch (error) {
    auditService.logError("GET_OT_ADL_ERROR", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

export function getAllOTADLActivities(): OTADLActivity[] {
  try {
    return [...activities];
  } catch (error) {
    auditService.logError("GET_ALL_OT_ADL_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTADLActivitiesByCategory(
  category: string,
): OTADLActivity[] {
  try {
    if (!category || typeof category !== "string") {
      auditService.logWarning("INVALID_OT_ADL_CATEGORY", { category });
      return [];
    }
    return activities.filter((a) =>
      a.category.toLowerCase().includes(category.toLowerCase()),
    );
  } catch (error) {
    auditService.logError("GET_OT_ADL_BY_CATEGORY_ERROR", {
      category,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function searchOTADLActivities(query: string): OTADLActivity[] {
  try {
    if (!query || typeof query !== "string") {
      auditService.logWarning("INVALID_OT_ADL_SEARCH", { query });
      return [];
    }
    const lowerQuery = query.toLowerCase();
    return activities.filter(
      (a) =>
        a.name.toLowerCase().includes(lowerQuery) ||
        a.category.toLowerCase().includes(lowerQuery) ||
        a.description.toLowerCase().includes(lowerQuery),
    );
  } catch (error) {
    auditService.logError("SEARCH_OT_ADL_ERROR", {
      query,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTADLActivitiesByEvidenceLevel(
  level: 1 | 2 | 3,
): OTADLActivity[] {
  try {
    if (![1, 2, 3].includes(level)) {
      auditService.logWarning("INVALID_OT_ADL_EVIDENCE_LEVEL", { level });
      return [];
    }
    return activities.filter((a) => a.evidenceLevel === level);
  } catch (error) {
    auditService.logError("GET_OT_ADL_BY_EVIDENCE_ERROR", {
      level,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getAdaptiveEquipmentList(): string[] {
  try {
    const equipment = new Set<string>();
    activities.forEach((a) =>
      a.adaptiveEquipment.forEach((e) => equipment.add(e)),
    );
    return Array.from(equipment).sort();
  } catch (error) {
    auditService.logError("GET_ADAPTIVE_EQUIPMENT_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function validateADLActivity(
  activityId: string,
  strategy: string,
): { valid: boolean; message: string } {
  try {
    const activity = getOTADLActivityById(activityId);
    if (!activity) return { valid: false, message: "Activity not found" };
    if (!strategy || typeof strategy !== "string")
      return { valid: false, message: "Strategy must be a string" };
    const hasStrategy = activity.adaptiveStrategies.some((s) =>
      s.toLowerCase().includes(strategy.toLowerCase()),
    );
    return {
      valid: hasStrategy,
      message: hasStrategy ? "Strategy found" : "Strategy not found",
    };
  } catch (error) {
    auditService.logError("VALIDATE_ADL_ACTIVITY_ERROR", {
      activityId,
      strategy,
      error: error instanceof Error ? error.message : String(error),
    });
    return { valid: false, message: "Validation error" };
  }
}

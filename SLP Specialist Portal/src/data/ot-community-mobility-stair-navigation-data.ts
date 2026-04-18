/**
 * OT Community Mobility & Stair Navigation Data
 * Occupational therapy strategies for community mobility and stair navigation
 */

import { auditService } from "../core/audit/AuditService";

export interface OTCommunityMobilityStrategy {
  id: string;
  name: string;
  category: string;
  description: string;
  occupationalApplications: string[];
  mobilityTechniques: string[];
  adaptiveEquipment: string[];
  environmentalConsiderations: string[];
  safetyStrategies: string[];
  progressionStages: string[];
  evidenceLevel: 1 | 2 | 3;
  source: string;
  lastUpdated: Date;
}

const strategies: OTCommunityMobilityStrategy[] = [
  {
    id: "ot-cm-001",
    name: "Stair Navigation & Climbing",
    category: "Stair Mobility",
    description:
      "Occupational strategies for safe stair navigation and climbing for community participation",
    occupationalApplications: [
      "Community access",
      "Home access",
      "Work participation",
      "Leisure activities",
      "Social participation",
    ],
    mobilityTechniques: [
      "Step-over-step climbing",
      "Step-to climbing",
      "Handrail use",
      "Rhythm and pacing",
      "Weight shifting",
      "Balance maintenance",
    ],
    adaptiveEquipment: [
      "Handrails",
      "Grab bars",
      "Stair lifts",
      "Ramps",
      "Canes",
      "Walkers",
    ],
    environmentalConsiderations: [
      "Stair height and depth",
      "Handrail placement",
      "Lighting",
      "Surface texture",
      "Slope angle",
      "Accessibility",
    ],
    safetyStrategies: [
      "Fall prevention",
      "Proper footwear",
      "Adequate lighting",
      "Handrail use",
      "Pace control",
      "Caregiver supervision",
    ],
    progressionStages: [
      "Assisted climbing",
      "Supervised climbing",
      "Independent climbing with equipment",
      "Independent climbing",
      "Community stair navigation",
    ],
    evidenceLevel: 1,
    source: "AOTA Community Mobility Guidelines & Stair Navigation Research",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-cm-002",
    name: "Outdoor Mobility & Terrain Navigation",
    category: "Community Mobility",
    description:
      "Occupational strategies for outdoor mobility and terrain navigation for community participation",
    occupationalApplications: [
      "Community access",
      "Shopping",
      "Recreation",
      "Social participation",
      "Work participation",
      "Leisure activities",
    ],
    mobilityTechniques: [
      "Uneven surface navigation",
      "Curb negotiation",
      "Slope navigation",
      "Obstacle avoidance",
      "Weather adaptation",
      "Distance management",
    ],
    adaptiveEquipment: [
      "Canes",
      "Walkers",
      "Wheelchairs",
      "Scooters",
      "Orthotics",
      "Appropriate footwear",
    ],
    environmentalConsiderations: [
      "Surface conditions",
      "Weather",
      "Lighting",
      "Accessibility",
      "Obstacles",
      "Distance and terrain",
    ],
    safetyStrategies: [
      "Fall prevention",
      "Appropriate footwear",
      "Adequate lighting",
      "Weather awareness",
      "Pace control",
      "Caregiver support",
    ],
    progressionStages: [
      "Assisted outdoor mobility",
      "Supervised outdoor mobility",
      "Independent mobility with equipment",
      "Independent community mobility",
      "Advanced community navigation",
    ],
    evidenceLevel: 1,
    source: "AOTA Community Mobility Guidelines & Outdoor Navigation Research",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-cm-003",
    name: "Public Transportation Navigation",
    category: "Community Mobility",
    description:
      "Occupational strategies for using public transportation for community participation",
    occupationalApplications: [
      "Work participation",
      "Shopping",
      "Medical appointments",
      "Social participation",
      "Leisure activities",
      "Community engagement",
    ],
    mobilityTechniques: [
      "Bus boarding",
      "Train navigation",
      "Taxi use",
      "Accessible vehicle use",
      "Payment systems",
      "Route planning",
    ],
    adaptiveEquipment: [
      "Mobility aids",
      "Accessible passes",
      "Communication aids",
      "Adaptive equipment",
      "Assistive technology",
      "Mobility devices",
    ],
    environmentalConsiderations: [
      "Accessibility features",
      "Crowding",
      "Noise levels",
      "Lighting",
      "Schedule reliability",
      "Safety features",
    ],
    safetyStrategies: [
      "Fall prevention",
      "Awareness of surroundings",
      "Proper boarding techniques",
      "Seating safety",
      "Emergency procedures",
      "Caregiver support",
    ],
    progressionStages: [
      "Assisted transportation",
      "Supervised transportation",
      "Independent transportation with support",
      "Independent transportation",
      "Advanced community navigation",
    ],
    evidenceLevel: 1,
    source: "AOTA Community Mobility Guidelines & Transportation Research",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-cm-004",
    name: "Vehicle Transfer & Driving Participation",
    category: "Vehicle Mobility",
    description:
      "Occupational strategies for vehicle transfers and driving participation for community mobility",
    occupationalApplications: [
      "Community access",
      "Work participation",
      "Shopping",
      "Medical appointments",
      "Social participation",
      "Leisure activities",
    ],
    mobilityTechniques: [
      "Vehicle entry",
      "Vehicle exit",
      "Seating positioning",
      "Seatbelt use",
      "Door management",
      "Adaptive driving techniques",
    ],
    adaptiveEquipment: [
      "Transfer boards",
      "Grab handles",
      "Seat cushions",
      "Adaptive seats",
      "Hand controls",
      "Steering adaptations",
    ],
    environmentalConsiderations: [
      "Vehicle height",
      "Door width",
      "Seating comfort",
      "Accessibility",
      "Parking access",
      "Weather conditions",
    ],
    safetyStrategies: [
      "Fall prevention",
      "Proper transfer techniques",
      "Seatbelt use",
      "Traffic awareness",
      "Driving safety",
      "Caregiver support",
    ],
    progressionStages: [
      "Assisted vehicle transfer",
      "Supervised vehicle transfer",
      "Independent transfer with equipment",
      "Independent vehicle use",
      "Advanced driving participation",
    ],
    evidenceLevel: 1,
    source: "AOTA Community Mobility Guidelines & Vehicle Navigation Research",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-cm-005",
    name: "Community Participation & Social Engagement",
    category: "Community Engagement",
    description:
      "Occupational strategies for community participation and social engagement through mobility",
    occupationalApplications: [
      "Social participation",
      "Leisure activities",
      "Community engagement",
      "Work participation",
      "Shopping",
      "Recreation",
    ],
    mobilityTechniques: [
      "Route planning",
      "Distance management",
      "Pace control",
      "Rest breaks",
      "Fatigue management",
      "Accessibility navigation",
    ],
    adaptiveEquipment: [
      "Mobility aids",
      "Communication aids",
      "Assistive technology",
      "Adaptive equipment",
      "Comfort items",
      "Safety devices",
    ],
    environmentalConsiderations: [
      "Accessibility",
      "Crowding",
      "Noise levels",
      "Lighting",
      "Temperature",
      "Comfort facilities",
    ],
    safetyStrategies: [
      "Fall prevention",
      "Fatigue management",
      "Awareness of surroundings",
      "Emergency procedures",
      "Caregiver support",
      "Health monitoring",
    ],
    progressionStages: [
      "Assisted community participation",
      "Supervised participation",
      "Independent participation with support",
      "Independent community participation",
      "Advanced community engagement",
    ],
    evidenceLevel: 1,
    source:
      "AOTA Community Participation Guidelines & Social Engagement Research",
    lastUpdated: new Date("2024-01-15"),
  },
];

export function getOTCommunityMobilityStrategyById(
  id: string,
): OTCommunityMobilityStrategy | undefined {
  try {
    if (!id || typeof id !== "string") {
      auditService.logWarning("INVALID_OT_CM_ID", { id });
      return undefined;
    }
    const strategy = strategies.find((s) => s.id === id);
    if (!strategy) {
      auditService.logWarning("OT_CM_NOT_FOUND", { id });
    }
    return strategy;
  } catch (error) {
    auditService.logError("GET_OT_CM_ERROR", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

export function getAllOTCommunityMobilityStrategies(): OTCommunityMobilityStrategy[] {
  try {
    return [...strategies];
  } catch (error) {
    auditService.logError("GET_ALL_OT_CM_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTCommunityMobilityStrategiesByCategory(
  category: string,
): OTCommunityMobilityStrategy[] {
  try {
    if (!category || typeof category !== "string") {
      auditService.logWarning("INVALID_OT_CM_CATEGORY", { category });
      return [];
    }
    return strategies.filter((s) =>
      s.category.toLowerCase().includes(category.toLowerCase()),
    );
  } catch (error) {
    auditService.logError("GET_OT_CM_BY_CATEGORY_ERROR", {
      category,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function searchOTCommunityMobilityStrategies(
  query: string,
): OTCommunityMobilityStrategy[] {
  try {
    if (!query || typeof query !== "string") {
      auditService.logWarning("INVALID_OT_CM_SEARCH", { query });
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
    auditService.logError("SEARCH_OT_CM_ERROR", {
      query,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTCommunityMobilityStrategiesByEvidenceLevel(
  level: 1 | 2 | 3,
): OTCommunityMobilityStrategy[] {
  try {
    if (![1, 2, 3].includes(level)) {
      auditService.logWarning("INVALID_OT_CM_EVIDENCE_LEVEL", { level });
      return [];
    }
    return strategies.filter((s) => s.evidenceLevel === level);
  } catch (error) {
    auditService.logError("GET_OT_CM_BY_EVIDENCE_ERROR", {
      level,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getMobilityEquipmentList(): string[] {
  try {
    const equipment = new Set<string>();
    strategies.forEach((s) =>
      s.adaptiveEquipment.forEach((e) => equipment.add(e)),
    );
    return Array.from(equipment).sort();
  } catch (error) {
    auditService.logError("GET_MOBILITY_EQUIPMENT_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function validateCommunityMobilityStrategy(
  strategyId: string,
  application: string,
): { valid: boolean; message: string } {
  try {
    const strategy = getOTCommunityMobilityStrategyById(strategyId);
    if (!strategy) return { valid: false, message: "Strategy not found" };
    if (!application || typeof application !== "string")
      return { valid: false, message: "Application must be a string" };
    const hasApplication = strategy.occupationalApplications.some((a) =>
      a.toLowerCase().includes(application.toLowerCase()),
    );
    return {
      valid: hasApplication,
      message: hasApplication ? "Application found" : "Application not found",
    };
  } catch (error) {
    auditService.logError("VALIDATE_COMMUNITY_MOBILITY_ERROR", {
      strategyId,
      application,
      error: error instanceof Error ? error.message : String(error),
    });
    return { valid: false, message: "Validation error" };
  }
}

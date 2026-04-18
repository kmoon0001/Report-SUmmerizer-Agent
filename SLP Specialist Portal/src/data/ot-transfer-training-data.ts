/**
 * OT Transfer Training Data
 * Occupational therapy transfer training and mobility techniques
 */

import { auditService } from "../core/audit/AuditService";

export interface OTTransferTechnique {
  id: string;
  name: string;
  category: string;
  description: string;
  occupationalApplications: string[];
  transferSteps: string[];
  adaptiveEquipment: string[];
  safetyPrecautions: string[];
  contraindications: string[];
  cognitiveRequirements: string[];
  evidenceLevel: 1 | 2 | 3;
  source: string;
  lastUpdated: Date;
}

const techniques: OTTransferTechnique[] = [
  {
    id: "ot-transfer-001",
    name: "Sit-to-Stand Transfer",
    category: "Bed & Chair Transfers",
    description:
      "Occupational training for transitioning from sitting to standing position with adaptive techniques",
    occupationalApplications: [
      "Bed mobility",
      "Chair transfers",
      "Toilet transfers",
      "Shower transfers",
      "Community mobility",
    ],
    transferSteps: [
      "Scoot to edge of surface",
      "Feet flat on floor",
      "Lean forward",
      "Push through legs",
      "Stand with support",
      "Maintain balance",
    ],
    adaptiveEquipment: [
      "Grab bars",
      "Transfer belts",
      "Raised seats",
      "Armrests",
      "Walker",
      "Cane",
    ],
    safetyPrecautions: [
      "Assess fall risk",
      "Use transfer belt",
      "Clear environment",
      "Adequate lighting",
      "Non-slip footwear",
      "Caregiver present",
    ],
    contraindications: [
      "Severe weakness",
      "Severe pain",
      "Severe balance deficit",
      "Severe cognitive impairment",
      "Acute medical condition",
    ],
    cognitiveRequirements: [
      "Ability to follow commands",
      "Sequencing ability",
      "Safety awareness",
      "Problem-solving",
      "Memory for technique",
    ],
    evidenceLevel: 1,
    source: "AOTA Transfer Training Guidelines & Mobility Research",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-transfer-002",
    name: "Bed-to-Chair Transfer",
    category: "Bed & Chair Transfers",
    description:
      "Occupational training for transferring from bed to chair with adaptive techniques and equipment",
    occupationalApplications: [
      "Bed mobility",
      "Chair transfers",
      "Participation in activities",
      "Community reintegration",
      "Occupational engagement",
    ],
    transferSteps: [
      "Scoot to edge of bed",
      "Feet on floor",
      "Lean forward",
      "Push to standing",
      "Pivot to chair",
      "Sit down controlled",
    ],
    adaptiveEquipment: [
      "Grab bars",
      "Transfer belts",
      "Bed rails",
      "Transfer boards",
      "Mechanical lifts",
      "Slide sheets",
    ],
    safetyPrecautions: [
      "Assess fall risk",
      "Use transfer belt",
      "Clear environment",
      "Adequate lighting",
      "Non-slip footwear",
      "Caregiver present",
    ],
    contraindications: [
      "Severe weakness",
      "Severe pain",
      "Severe balance deficit",
      "Severe cognitive impairment",
      "Acute medical condition",
    ],
    cognitiveRequirements: [
      "Ability to follow commands",
      "Sequencing ability",
      "Safety awareness",
      "Problem-solving",
      "Memory for technique",
    ],
    evidenceLevel: 1,
    source: "AOTA Transfer Training Guidelines & Mobility Research",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-transfer-003",
    name: "Toilet Transfer",
    category: "Bathroom Transfers",
    description:
      "Occupational training for safe toilet transfers with adaptive techniques and equipment",
    occupationalApplications: [
      "Toileting independence",
      "Dignity preservation",
      "Continence management",
      "Occupational engagement",
      "Community participation",
    ],
    transferSteps: [
      "Approach toilet",
      "Position body",
      "Lower to seat",
      "Maintain balance",
      "Rise to standing",
      "Manage clothing",
    ],
    adaptiveEquipment: [
      "Raised toilet seat",
      "Grab bars",
      "Toilet safety frame",
      "Transfer belt",
      "Commode chair",
      "Adaptive wiping aids",
    ],
    safetyPrecautions: [
      "Assess fall risk",
      "Use grab bars",
      "Clear environment",
      "Adequate lighting",
      "Non-slip footwear",
      "Caregiver present",
    ],
    contraindications: [
      "Severe weakness",
      "Severe pain",
      "Severe balance deficit",
      "Severe cognitive impairment",
      "Acute medical condition",
    ],
    cognitiveRequirements: [
      "Ability to follow commands",
      "Sequencing ability",
      "Safety awareness",
      "Privacy awareness",
      "Memory for technique",
    ],
    evidenceLevel: 1,
    source: "AOTA Transfer Training Guidelines & Mobility Research",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-transfer-004",
    name: "Shower/Tub Transfer",
    category: "Bathroom Transfers",
    description:
      "Occupational training for safe shower and tub transfers with adaptive techniques and equipment",
    occupationalApplications: [
      "Bathing independence",
      "Hygiene maintenance",
      "Occupational engagement",
      "Community participation",
      "Self-care independence",
    ],
    transferSteps: [
      "Approach shower/tub",
      "Position body",
      "Step over edge",
      "Lower to seat",
      "Maintain balance",
      "Rise to standing",
    ],
    adaptiveEquipment: [
      "Shower chair",
      "Grab bars",
      "Bath bench",
      "Transfer belt",
      "Non-slip mats",
      "Handheld shower",
    ],
    safetyPrecautions: [
      "Assess fall risk",
      "Use grab bars",
      "Non-slip surfaces",
      "Water temperature control",
      "Adequate lighting",
      "Caregiver present",
    ],
    contraindications: [
      "Severe weakness",
      "Severe pain",
      "Severe balance deficit",
      "Severe cognitive impairment",
      "Acute medical condition",
    ],
    cognitiveRequirements: [
      "Ability to follow commands",
      "Sequencing ability",
      "Safety awareness",
      "Temperature awareness",
      "Memory for technique",
    ],
    evidenceLevel: 1,
    source: "AOTA Transfer Training Guidelines & Mobility Research",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-transfer-005",
    name: "Vehicle Transfer",
    category: "Community Transfers",
    description:
      "Occupational training for safe vehicle transfers for community mobility and participation",
    occupationalApplications: [
      "Community mobility",
      "Driving participation",
      "Passenger independence",
      "Community reintegration",
      "Occupational engagement",
    ],
    transferSteps: [
      "Approach vehicle",
      "Open door",
      "Position body",
      "Lower to seat",
      "Manage legs",
      "Close door safely",
    ],
    adaptiveEquipment: [
      "Transfer belt",
      "Grab handles",
      "Seat cushions",
      "Adaptive seats",
      "Transfer boards",
      "Mechanical lifts",
    ],
    safetyPrecautions: [
      "Assess fall risk",
      "Clear environment",
      "Adequate lighting",
      "Traffic awareness",
      "Non-slip footwear",
      "Caregiver present",
    ],
    contraindications: [
      "Severe weakness",
      "Severe pain",
      "Severe balance deficit",
      "Severe cognitive impairment",
      "Acute medical condition",
    ],
    cognitiveRequirements: [
      "Ability to follow commands",
      "Sequencing ability",
      "Safety awareness",
      "Environmental awareness",
      "Memory for technique",
    ],
    evidenceLevel: 1,
    source: "AOTA Transfer Training Guidelines & Community Mobility Research",
    lastUpdated: new Date("2024-01-15"),
  },
];

export function getOTTransferTechniqueById(
  id: string,
): OTTransferTechnique | undefined {
  try {
    if (!id || typeof id !== "string") {
      auditService.logWarning("INVALID_OT_TRANSFER_ID", { id });
      return undefined;
    }
    const technique = techniques.find((t) => t.id === id);
    if (!technique) {
      auditService.logWarning("OT_TRANSFER_NOT_FOUND", { id });
    }
    return technique;
  } catch (error) {
    auditService.logError("GET_OT_TRANSFER_ERROR", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

export function getAllOTTransferTechniques(): OTTransferTechnique[] {
  try {
    return [...techniques];
  } catch (error) {
    auditService.logError("GET_ALL_OT_TRANSFER_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTTransferTechniquesByCategory(
  category: string,
): OTTransferTechnique[] {
  try {
    if (!category || typeof category !== "string") {
      auditService.logWarning("INVALID_OT_TRANSFER_CATEGORY", { category });
      return [];
    }
    return techniques.filter((t) =>
      t.category.toLowerCase().includes(category.toLowerCase()),
    );
  } catch (error) {
    auditService.logError("GET_OT_TRANSFER_BY_CATEGORY_ERROR", {
      category,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function searchOTTransferTechniques(
  query: string,
): OTTransferTechnique[] {
  try {
    if (!query || typeof query !== "string") {
      auditService.logWarning("INVALID_OT_TRANSFER_SEARCH", { query });
      return [];
    }
    const lowerQuery = query.toLowerCase();
    return techniques.filter(
      (t) =>
        t.name.toLowerCase().includes(lowerQuery) ||
        t.category.toLowerCase().includes(lowerQuery) ||
        t.description.toLowerCase().includes(lowerQuery),
    );
  } catch (error) {
    auditService.logError("SEARCH_OT_TRANSFER_ERROR", {
      query,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTTransferTechniquesByEvidenceLevel(
  level: 1 | 2 | 3,
): OTTransferTechnique[] {
  try {
    if (![1, 2, 3].includes(level)) {
      auditService.logWarning("INVALID_OT_TRANSFER_EVIDENCE_LEVEL", { level });
      return [];
    }
    return techniques.filter((t) => t.evidenceLevel === level);
  } catch (error) {
    auditService.logError("GET_OT_TRANSFER_BY_EVIDENCE_ERROR", {
      level,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getTransferEquipmentList(): string[] {
  try {
    const equipment = new Set<string>();
    techniques.forEach((t) =>
      t.adaptiveEquipment.forEach((e) => equipment.add(e)),
    );
    return Array.from(equipment).sort();
  } catch (error) {
    auditService.logError("GET_TRANSFER_EQUIPMENT_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function validateTransferTechnique(
  techniqueId: string,
  step: string,
): { valid: boolean; message: string } {
  try {
    const technique = getOTTransferTechniqueById(techniqueId);
    if (!technique) return { valid: false, message: "Technique not found" };
    if (!step || typeof step !== "string")
      return { valid: false, message: "Step must be a string" };
    const hasStep = technique.transferSteps.some((s) =>
      s.toLowerCase().includes(step.toLowerCase()),
    );
    return {
      valid: hasStep,
      message: hasStep ? "Step found" : "Step not found",
    };
  } catch (error) {
    auditService.logError("VALIDATE_TRANSFER_TECHNIQUE_ERROR", {
      techniqueId,
      step,
      error: error instanceof Error ? error.message : String(error),
    });
    return { valid: false, message: "Validation error" };
  }
}

/**
 * OT Intervention Strategies - Adaptive Equipment & Assistive Technology
 */

import { auditService } from "../core/audit/AuditService";

export interface OTAdaptiveEquipmentStrategy {
  id: string;
  name: string;
  category: string;
  description: string;
  applications: string[];
  indications: string[];
  contraindications: string[];
  trainingRequired: string[];
  evidenceLevel: 1 | 2 | 3;
  source: string;
  citation: string;
  lastUpdated: Date;
}

const strategies: OTAdaptiveEquipmentStrategy[] = [
  {
    id: "strat-ot-ae-001",
    name: "Mobility Aids",
    category: "Adaptive Equipment & Assistive Technology",
    description: "Equipment to enhance mobility and reduce fall risk",
    applications: ["Walkers", "Canes", "Crutches", "Wheelchairs", "Scooters"],
    indications: [
      "Mobility limitation",
      "Balance dysfunction",
      "Fall risk",
      "Weakness",
    ],
    contraindications: [
      "Severe cognitive impairment",
      "Severe pain",
      "Neurological compromise",
    ],
    trainingRequired: [
      "Proper use",
      "Safety awareness",
      "Maintenance",
      "Adjustment",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Mobility Aids Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-ae-002",
    name: "Self-Care Aids",
    category: "Adaptive Equipment & Assistive Technology",
    description: "Equipment to enhance independence in self-care activities",
    applications: [
      "Dressing aids",
      "Grooming aids",
      "Bathing aids",
      "Toileting aids",
      "Feeding aids",
    ],
    indications: [
      "Limited ROM",
      "Weakness",
      "Coordination deficit",
      "Functional limitation",
    ],
    contraindications: [
      "Severe cognitive impairment",
      "Severe pain",
      "Neurological compromise",
    ],
    trainingRequired: [
      "Proper use",
      "Safety awareness",
      "Maintenance",
      "Problem-solving",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Self-Care Aids Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-ae-003",
    name: "Home Modification",
    category: "Adaptive Equipment & Assistive Technology",
    description:
      "Environmental modifications to enhance safety and accessibility",
    applications: [
      "Grab bars",
      "Ramps",
      "Lighting",
      "Flooring",
      "Furniture arrangement",
    ],
    indications: [
      "Mobility limitation",
      "Balance dysfunction",
      "Fall risk",
      "Accessibility need",
    ],
    contraindications: [
      "Temporary housing",
      "Rental restrictions",
      "Financial limitation",
    ],
    trainingRequired: [
      "Safety awareness",
      "Maintenance",
      "Problem-solving",
      "Adaptation",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Home Modification Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-ae-004",
    name: "Communication Devices",
    category: "Adaptive Equipment & Assistive Technology",
    description: "Technology to enhance communication abilities",
    applications: [
      "Speech-generating devices",
      "AAC devices",
      "Text-to-speech",
      "Eye-gaze systems",
      "Switch-activated devices",
    ],
    indications: [
      "Speech impairment",
      "Communication limitation",
      "Neurological disorder",
      "Cognitive impairment",
    ],
    contraindications: [
      "Severe cognitive impairment",
      "Severe pain",
      "Neurological compromise",
    ],
    trainingRequired: [
      "Device operation",
      "Vocabulary selection",
      "Troubleshooting",
      "Maintenance",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Communication Devices Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-ae-005",
    name: "Computer Access Technology",
    category: "Adaptive Equipment & Assistive Technology",
    description: "Technology to enhance computer and digital device access",
    applications: [
      "Ergonomic keyboards",
      "Mouse alternatives",
      "Voice control",
      "Eye-tracking",
      "Switch access",
    ],
    indications: [
      "Limited dexterity",
      "Mobility limitation",
      "Coordination deficit",
      "Functional limitation",
    ],
    contraindications: [
      "Severe cognitive impairment",
      "Severe pain",
      "Neurological compromise",
    ],
    trainingRequired: [
      "Device operation",
      "Software setup",
      "Troubleshooting",
      "Maintenance",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Computer Access Technology Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-ae-006",
    name: "Cognitive Aids",
    category: "Adaptive Equipment & Assistive Technology",
    description: "Equipment and strategies to enhance cognitive function",
    applications: [
      "Calendars",
      "Reminders",
      "Organizers",
      "Timers",
      "Digital assistants",
    ],
    indications: [
      "Memory impairment",
      "Cognitive deficit",
      "Executive function deficit",
      "Attention deficit",
    ],
    contraindications: [
      "Severe cognitive impairment",
      "Severe pain",
      "Neurological compromise",
    ],
    trainingRequired: [
      "Device operation",
      "Strategy use",
      "Problem-solving",
      "Adaptation",
    ],
    evidenceLevel: 2,
    source: "AOTA",
    citation: "AOTA (2020). Cognitive Aids Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-ae-007",
    name: "Sensory Aids",
    category: "Adaptive Equipment & Assistive Technology",
    description: "Equipment to enhance sensory perception and awareness",
    applications: [
      "Hearing aids",
      "Visual aids",
      "Tactile devices",
      "Vibration alerts",
      "Sensory stimulation",
    ],
    indications: [
      "Sensory impairment",
      "Hearing loss",
      "Vision loss",
      "Sensory deficit",
    ],
    contraindications: [
      "Severe pain",
      "Neurological compromise",
      "Severe cognitive impairment",
    ],
    trainingRequired: [
      "Device operation",
      "Maintenance",
      "Troubleshooting",
      "Adaptation",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Sensory Aids Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-ae-008",
    name: "Work-Related Assistive Technology",
    category: "Adaptive Equipment & Assistive Technology",
    description: "Technology to enhance work performance and productivity",
    applications: [
      "Ergonomic equipment",
      "Adaptive tools",
      "Software modifications",
      "Environmental controls",
      "Job accommodations",
    ],
    indications: [
      "Work limitation",
      "Functional limitation",
      "Occupational dysfunction",
      "Disability accommodation",
    ],
    contraindications: [
      "Severe cognitive impairment",
      "Severe pain",
      "Neurological compromise",
    ],
    trainingRequired: [
      "Device operation",
      "Workplace adaptation",
      "Problem-solving",
      "Maintenance",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Work-Related Assistive Technology Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-ae-009",
    name: "Recreation and Leisure Aids",
    category: "Adaptive Equipment & Assistive Technology",
    description:
      "Equipment to enhance participation in recreation and leisure activities",
    applications: [
      "Adaptive sports equipment",
      "Gaming adaptations",
      "Art supplies",
      "Music devices",
      "Hobby modifications",
    ],
    indications: [
      "Functional limitation",
      "Participation limitation",
      "Leisure deficit",
      "Social isolation",
    ],
    contraindications: [
      "Severe cognitive impairment",
      "Severe pain",
      "Neurological compromise",
    ],
    trainingRequired: [
      "Device operation",
      "Activity adaptation",
      "Problem-solving",
      "Safety awareness",
    ],
    evidenceLevel: 2,
    source: "AOTA",
    citation: "AOTA (2020). Recreation and Leisure Aids Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-ae-010",
    name: "Environmental Control Systems",
    category: "Adaptive Equipment & Assistive Technology",
    description: "Technology to control environmental features remotely",
    applications: [
      "Smart home systems",
      "Lighting control",
      "Temperature control",
      "Door openers",
      "Entertainment systems",
    ],
    indications: [
      "Mobility limitation",
      "Functional limitation",
      "Neurological disorder",
      "Disability accommodation",
    ],
    contraindications: [
      "Severe cognitive impairment",
      "Severe pain",
      "Neurological compromise",
    ],
    trainingRequired: [
      "System operation",
      "Troubleshooting",
      "Maintenance",
      "Safety awareness",
    ],
    evidenceLevel: 2,
    source: "AOTA",
    citation: "AOTA (2020). Environmental Control Systems Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-ae-011",
    name: "Positioning and Seating Systems",
    category: "Adaptive Equipment & Assistive Technology",
    description: "Equipment to provide proper positioning and support",
    applications: [
      "Cushions",
      "Backrests",
      "Footrests",
      "Armrests",
      "Specialized seating",
    ],
    indications: [
      "Postural dysfunction",
      "Pressure ulcer risk",
      "Comfort need",
      "Positioning limitation",
    ],
    contraindications: [
      "Severe pain",
      "Neurological compromise",
      "Severe cognitive impairment",
    ],
    trainingRequired: [
      "Proper use",
      "Maintenance",
      "Adjustment",
      "Safety awareness",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Positioning and Seating Systems Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-ae-012",
    name: "Transfer Aids",
    category: "Adaptive Equipment & Assistive Technology",
    description: "Equipment to facilitate safe transfers between surfaces",
    applications: [
      "Transfer boards",
      "Lift systems",
      "Slide sheets",
      "Grab bars",
      "Transfer benches",
    ],
    indications: [
      "Mobility limitation",
      "Weakness",
      "Balance dysfunction",
      "Transfer limitation",
    ],
    contraindications: [
      "Severe pain",
      "Neurological compromise",
      "Severe cognitive impairment",
    ],
    trainingRequired: [
      "Proper use",
      "Safety awareness",
      "Maintenance",
      "Caregiver training",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Transfer Aids Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-ae-013",
    name: "Orthotic Devices",
    category: "Adaptive Equipment & Assistive Technology",
    description: "Custom-made devices to support and align body parts",
    applications: [
      "Hand splints",
      "Wrist supports",
      "Ankle supports",
      "Back supports",
      "Custom orthotics",
    ],
    indications: [
      "Joint instability",
      "Postural dysfunction",
      "Pain management",
      "Functional limitation",
    ],
    contraindications: [
      "Severe pain",
      "Skin conditions",
      "Severe cognitive impairment",
    ],
    trainingRequired: [
      "Proper use",
      "Maintenance",
      "Adjustment",
      "Safety awareness",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Orthotic Devices Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-ae-014",
    name: "Prosthetic Devices",
    category: "Adaptive Equipment & Assistive Technology",
    description: "Artificial devices to replace missing body parts",
    applications: [
      "Limb prosthetics",
      "Finger prosthetics",
      "Functional prosthetics",
      "Cosmetic prosthetics",
    ],
    indications: [
      "Limb loss",
      "Amputation",
      "Functional limitation",
      "Participation limitation",
    ],
    contraindications: [
      "Severe pain",
      "Severe cognitive impairment",
      "Severe neurological compromise",
    ],
    trainingRequired: [
      "Device operation",
      "Maintenance",
      "Adjustment",
      "Functional training",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Prosthetic Devices Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-ae-015",
    name: "Wearable Technology",
    category: "Adaptive Equipment & Assistive Technology",
    description: "Wearable devices to monitor health and enhance function",
    applications: [
      "Activity trackers",
      "Health monitors",
      "Fall detection",
      "GPS tracking",
      "Biofeedback devices",
    ],
    indications: [
      "Health monitoring need",
      "Fall risk",
      "Functional limitation",
      "Participation limitation",
    ],
    contraindications: [
      "Severe cognitive impairment",
      "Severe pain",
      "Neurological compromise",
    ],
    trainingRequired: [
      "Device operation",
      "Data interpretation",
      "Troubleshooting",
      "Maintenance",
    ],
    evidenceLevel: 2,
    source: "AOTA",
    citation: "AOTA (2020). Wearable Technology Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
];

export function getOTAdaptiveEquipmentStrategyById(
  id: string,
): OTAdaptiveEquipmentStrategy | undefined {
  try {
    if (!id || typeof id !== "string") {
      auditService.logWarning("INVALID_OT_AE_ID", { id });
      return undefined;
    }
    const strategy = strategies.find((s) => s.id === id);
    if (!strategy) {
      auditService.logWarning("OT_AE_NOT_FOUND", { id });
    }
    return strategy;
  } catch (error) {
    auditService.logError("GET_OT_AE_ERROR", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

export function getAllOTAdaptiveEquipmentStrategies(): OTAdaptiveEquipmentStrategy[] {
  try {
    return [...strategies];
  } catch (error) {
    auditService.logError("GET_ALL_OT_AE_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTAdaptiveEquipmentStrategiesByCategory(
  category: string,
): OTAdaptiveEquipmentStrategy[] {
  try {
    if (!category || typeof category !== "string") {
      auditService.logWarning("INVALID_OT_AE_CATEGORY", { category });
      return [];
    }
    return strategies.filter((s) =>
      s.category.toLowerCase().includes(category.toLowerCase()),
    );
  } catch (error) {
    auditService.logError("GET_OT_AE_BY_CATEGORY_ERROR", {
      category,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function searchOTAdaptiveEquipmentStrategies(
  query: string,
): OTAdaptiveEquipmentStrategy[] {
  try {
    if (!query || typeof query !== "string") {
      auditService.logWarning("INVALID_OT_AE_SEARCH", { query });
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
    auditService.logError("SEARCH_OT_AE_ERROR", {
      query,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTAdaptiveEquipmentStrategiesByEvidenceLevel(
  level: 1 | 2 | 3,
): OTAdaptiveEquipmentStrategy[] {
  try {
    if (![1, 2, 3].includes(level)) {
      auditService.logWarning("INVALID_OT_AE_EVIDENCE_LEVEL", { level });
      return [];
    }
    return strategies.filter((s) => s.evidenceLevel === level);
  } catch (error) {
    auditService.logError("GET_OT_AE_BY_EVIDENCE_ERROR", {
      level,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTAdaptiveEquipmentApplications(): string[] {
  try {
    const applications = new Set<string>();
    strategies.forEach((s) =>
      s.applications.forEach((a) => applications.add(a)),
    );
    return Array.from(applications).sort();
  } catch (error) {
    auditService.logError("GET_OT_AE_APPLICATIONS_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function validateOTAdaptiveEquipmentTraining(
  strategyId: string,
  training: string,
): { valid: boolean; message: string } {
  try {
    const strategy = getOTAdaptiveEquipmentStrategyById(strategyId);
    if (!strategy) return { valid: false, message: "Strategy not found" };
    if (!training || typeof training !== "string")
      return { valid: false, message: "Training must be a string" };
    const hasTraining = strategy.trainingRequired.some((t) =>
      t.toLowerCase().includes(training.toLowerCase()),
    );
    return {
      valid: hasTraining,
      message: hasTraining ? "Training found" : "Training not found",
    };
  } catch (error) {
    auditService.logError("VALIDATE_OT_AE_TRAINING_ERROR", {
      strategyId,
      training,
      error: error instanceof Error ? error.message : String(error),
    });
    return { valid: false, message: "Validation error" };
  }
}

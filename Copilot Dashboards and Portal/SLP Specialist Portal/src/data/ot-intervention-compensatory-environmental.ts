/**
 * OT Intervention Strategies - Compensatory & Environmental Strategies
 */

import { auditService } from "../core/audit/AuditService";

export interface OTCompensatoryEnvironmentalStrategy {
  id: string;
  name: string;
  category: string;
  description: string;
  techniques: string[];
  indications: string[];
  contraindications: string[];
  implementationSteps: string[];
  evidenceLevel: 1 | 2 | 3;
  source: string;
  citation: string;
  lastUpdated: Date;
}

const strategies: OTCompensatoryEnvironmentalStrategy[] = [
  {
    id: "strat-ot-ce-001",
    name: "One-Handed Techniques",
    category: "Compensatory & Environmental Strategies",
    description: "Strategies to perform activities using one hand",
    techniques: [
      "Stabilization",
      "Adaptive positioning",
      "Task modification",
      "Equipment use",
      "Sequencing",
    ],
    indications: [
      "Unilateral weakness",
      "Limb loss",
      "Hemiplegia",
      "Functional limitation",
    ],
    contraindications: [
      "Severe cognitive impairment",
      "Severe pain",
      "Neurological compromise",
    ],
    implementationSteps: [
      "Assess function",
      "Teach techniques",
      "Practice activities",
      "Problem-solve",
      "Reinforce learning",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). One-Handed Techniques Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-ce-002",
    name: "Energy Conservation Techniques",
    category: "Compensatory & Environmental Strategies",
    description: "Strategies to reduce energy expenditure during activities",
    techniques: [
      "Pacing",
      "Prioritization",
      "Simplification",
      "Delegation",
      "Rest periods",
    ],
    indications: [
      "Fatigue",
      "Deconditioning",
      "Chronic illness",
      "Endurance limitation",
    ],
    contraindications: [
      "Severe cognitive impairment",
      "Severe pain",
      "Neurological compromise",
    ],
    implementationSteps: [
      "Assess activities",
      "Identify energy demands",
      "Teach techniques",
      "Practice activities",
      "Monitor progress",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Energy Conservation Techniques Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-ce-003",
    name: "Joint Protection Techniques",
    category: "Compensatory & Environmental Strategies",
    description: "Strategies to protect joints during activities",
    techniques: [
      "Proper positioning",
      "Controlled movements",
      "Pacing",
      "Assistive devices",
      "Activity modification",
    ],
    indications: [
      "Arthritis",
      "Joint pain",
      "Joint instability",
      "Degenerative joint disease",
    ],
    contraindications: [
      "Severe cognitive impairment",
      "Severe pain",
      "Neurological compromise",
    ],
    implementationSteps: [
      "Assess activities",
      "Identify joint stress",
      "Teach techniques",
      "Practice activities",
      "Monitor progress",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Joint Protection Techniques Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-ce-004",
    name: "Environmental Modification",
    category: "Compensatory & Environmental Strategies",
    description: "Modifications to the environment to enhance function",
    techniques: [
      "Lighting adjustment",
      "Noise reduction",
      "Organization",
      "Accessibility",
      "Safety features",
    ],
    indications: [
      "Sensory impairment",
      "Cognitive impairment",
      "Mobility limitation",
      "Functional limitation",
    ],
    contraindications: [
      "Temporary housing",
      "Rental restrictions",
      "Financial limitation",
    ],
    implementationSteps: [
      "Assess environment",
      "Identify barriers",
      "Plan modifications",
      "Implement changes",
      "Evaluate effectiveness",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Environmental Modification Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-ce-005",
    name: "Activity Simplification",
    category: "Compensatory & Environmental Strategies",
    description: "Strategies to simplify complex activities",
    techniques: [
      "Breaking down steps",
      "Reducing complexity",
      "Eliminating non-essentials",
      "Sequencing",
      "Cueing",
    ],
    indications: [
      "Cognitive impairment",
      "Functional limitation",
      "Complexity limitation",
      "Learning difficulty",
    ],
    contraindications: [
      "Severe cognitive impairment",
      "Severe pain",
      "Neurological compromise",
    ],
    implementationSteps: [
      "Analyze activity",
      "Identify steps",
      "Simplify process",
      "Teach sequence",
      "Practice activity",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Activity Simplification Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-ce-006",
    name: "Ergonomic Modification",
    category: "Compensatory & Environmental Strategies",
    description: "Modifications to workstations and work environments",
    techniques: [
      "Desk adjustment",
      "Chair positioning",
      "Monitor placement",
      "Keyboard positioning",
      "Lighting adjustment",
    ],
    indications: [
      "Occupational strain",
      "Postural dysfunction",
      "Work limitation",
      "Functional limitation",
    ],
    contraindications: [
      "Temporary workspace",
      "Rental restrictions",
      "Financial limitation",
    ],
    implementationSteps: [
      "Assess workspace",
      "Identify ergonomic issues",
      "Plan modifications",
      "Implement changes",
      "Evaluate effectiveness",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Ergonomic Modification Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-ce-007",
    name: "Adaptive Clothing Strategies",
    category: "Compensatory & Environmental Strategies",
    description: "Strategies for selecting and using adaptive clothing",
    techniques: [
      "Velcro closures",
      "Magnetic buttons",
      "Loose-fitting clothes",
      "Front closures",
      "Slip-on styles",
    ],
    indications: [
      "Limited dexterity",
      "Limited ROM",
      "Functional limitation",
      "Dressing difficulty",
    ],
    contraindications: [
      "Severe cognitive impairment",
      "Severe pain",
      "Neurological compromise",
    ],
    implementationSteps: [
      "Assess dressing ability",
      "Identify barriers",
      "Select adaptive clothing",
      "Teach use",
      "Practice dressing",
    ],
    evidenceLevel: 2,
    source: "AOTA",
    citation: "AOTA (2020). Adaptive Clothing Strategies Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-ce-008",
    name: "Bathroom Modification",
    category: "Compensatory & Environmental Strategies",
    description:
      "Modifications to bathrooms to enhance safety and accessibility",
    techniques: [
      "Grab bars",
      "Shower chairs",
      "Raised toilet seats",
      "Non-slip mats",
      "Accessible storage",
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
    implementationSteps: [
      "Assess bathroom",
      "Identify barriers",
      "Plan modifications",
      "Implement changes",
      "Evaluate effectiveness",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Bathroom Modification Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-ce-009",
    name: "Kitchen Modification",
    category: "Compensatory & Environmental Strategies",
    description:
      "Modifications to kitchens to enhance safety and accessibility",
    techniques: [
      "Accessible storage",
      "Lowered counters",
      "Lever handles",
      "Non-slip surfaces",
      "Adaptive equipment",
    ],
    indications: [
      "Mobility limitation",
      "Limited ROM",
      "Functional limitation",
      "Accessibility need",
    ],
    contraindications: [
      "Temporary housing",
      "Rental restrictions",
      "Financial limitation",
    ],
    implementationSteps: [
      "Assess kitchen",
      "Identify barriers",
      "Plan modifications",
      "Implement changes",
      "Evaluate effectiveness",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Kitchen Modification Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-ce-010",
    name: "Bedroom Modification",
    category: "Compensatory & Environmental Strategies",
    description:
      "Modifications to bedrooms to enhance safety and accessibility",
    techniques: [
      "Bed rails",
      "Accessible storage",
      "Lighting",
      "Non-slip surfaces",
      "Accessible furniture",
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
    implementationSteps: [
      "Assess bedroom",
      "Identify barriers",
      "Plan modifications",
      "Implement changes",
      "Evaluate effectiveness",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Bedroom Modification Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-ce-011",
    name: "Lighting Modification",
    category: "Compensatory & Environmental Strategies",
    description: "Modifications to lighting to enhance visibility and safety",
    techniques: [
      "Increased lighting",
      "Task lighting",
      "Reduced glare",
      "Color contrast",
      "Motion sensors",
    ],
    indications: [
      "Vision impairment",
      "Sensory impairment",
      "Safety concern",
      "Accessibility need",
    ],
    contraindications: [
      "Temporary housing",
      "Rental restrictions",
      "Financial limitation",
    ],
    implementationSteps: [
      "Assess lighting",
      "Identify deficiencies",
      "Plan modifications",
      "Implement changes",
      "Evaluate effectiveness",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Lighting Modification Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-ce-012",
    name: "Noise Reduction Strategies",
    category: "Compensatory & Environmental Strategies",
    description: "Strategies to reduce environmental noise",
    techniques: [
      "Sound dampening",
      "Quiet zones",
      "Noise-canceling",
      "Scheduling",
      "Communication strategies",
    ],
    indications: [
      "Sensory sensitivity",
      "Cognitive impairment",
      "Attention deficit",
      "Stress management",
    ],
    contraindications: [
      "Temporary housing",
      "Rental restrictions",
      "Financial limitation",
    ],
    implementationSteps: [
      "Assess noise",
      "Identify sources",
      "Plan strategies",
      "Implement changes",
      "Evaluate effectiveness",
    ],
    evidenceLevel: 2,
    source: "AOTA",
    citation: "AOTA (2020). Noise Reduction Strategies Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-ce-013",
    name: "Organization Strategies",
    category: "Compensatory & Environmental Strategies",
    description: "Strategies to organize spaces and materials",
    techniques: [
      "Labeling",
      "Color coding",
      "Designated spaces",
      "Accessible storage",
      "Visual cues",
    ],
    indications: [
      "Cognitive impairment",
      "Memory deficit",
      "Organization difficulty",
      "Functional limitation",
    ],
    contraindications: [
      "Severe cognitive impairment",
      "Severe pain",
      "Neurological compromise",
    ],
    implementationSteps: [
      "Assess organization",
      "Identify needs",
      "Plan system",
      "Implement changes",
      "Teach system",
    ],
    evidenceLevel: 2,
    source: "AOTA",
    citation: "AOTA (2020). Organization Strategies Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-ce-014",
    name: "Safety Modification",
    category: "Compensatory & Environmental Strategies",
    description: "Modifications to enhance safety in the environment",
    techniques: [
      "Grab bars",
      "Non-slip surfaces",
      "Lighting",
      "Accessible exits",
      "Emergency systems",
    ],
    indications: [
      "Fall risk",
      "Safety concern",
      "Mobility limitation",
      "Accessibility need",
    ],
    contraindications: [
      "Temporary housing",
      "Rental restrictions",
      "Financial limitation",
    ],
    implementationSteps: [
      "Assess safety",
      "Identify hazards",
      "Plan modifications",
      "Implement changes",
      "Evaluate effectiveness",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Safety Modification Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-ce-015",
    name: "Accessibility Modification",
    category: "Compensatory & Environmental Strategies",
    description:
      "Modifications to enhance accessibility throughout the environment",
    techniques: [
      "Ramps",
      "Widened doorways",
      "Accessible parking",
      "Accessible entrances",
      "Accessible pathways",
    ],
    indications: [
      "Mobility limitation",
      "Wheelchair use",
      "Accessibility need",
      "Functional limitation",
    ],
    contraindications: [
      "Temporary housing",
      "Rental restrictions",
      "Financial limitation",
    ],
    implementationSteps: [
      "Assess accessibility",
      "Identify barriers",
      "Plan modifications",
      "Implement changes",
      "Evaluate effectiveness",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Accessibility Modification Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
];

export function getOTCompensatoryEnvironmentalStrategyById(
  id: string,
): OTCompensatoryEnvironmentalStrategy | undefined {
  try {
    if (!id || typeof id !== "string") {
      auditService.logWarning("INVALID_OT_CE_ID", { id });
      return undefined;
    }
    const strategy = strategies.find((s) => s.id === id);
    if (!strategy) {
      auditService.logWarning("OT_CE_NOT_FOUND", { id });
    }
    return strategy;
  } catch (error) {
    auditService.logError("GET_OT_CE_ERROR", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

export function getAllOTCompensatoryEnvironmentalStrategies(): OTCompensatoryEnvironmentalStrategy[] {
  try {
    return [...strategies];
  } catch (error) {
    auditService.logError("GET_ALL_OT_CE_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTCompensatoryEnvironmentalStrategiesByCategory(
  category: string,
): OTCompensatoryEnvironmentalStrategy[] {
  try {
    if (!category || typeof category !== "string") {
      auditService.logWarning("INVALID_OT_CE_CATEGORY", { category });
      return [];
    }
    return strategies.filter((s) =>
      s.category.toLowerCase().includes(category.toLowerCase()),
    );
  } catch (error) {
    auditService.logError("GET_OT_CE_BY_CATEGORY_ERROR", {
      category,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function searchOTCompensatoryEnvironmentalStrategies(
  query: string,
): OTCompensatoryEnvironmentalStrategy[] {
  try {
    if (!query || typeof query !== "string") {
      auditService.logWarning("INVALID_OT_CE_SEARCH", { query });
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
    auditService.logError("SEARCH_OT_CE_ERROR", {
      query,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTCompensatoryEnvironmentalStrategiesByEvidenceLevel(
  level: 1 | 2 | 3,
): OTCompensatoryEnvironmentalStrategy[] {
  try {
    if (![1, 2, 3].includes(level)) {
      auditService.logWarning("INVALID_OT_CE_EVIDENCE_LEVEL", { level });
      return [];
    }
    return strategies.filter((s) => s.evidenceLevel === level);
  } catch (error) {
    auditService.logError("GET_OT_CE_BY_EVIDENCE_ERROR", {
      level,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTCompensatoryEnvironmentalTechniques(): string[] {
  try {
    const techniques = new Set<string>();
    strategies.forEach((s) => s.techniques.forEach((t) => techniques.add(t)));
    return Array.from(techniques).sort();
  } catch (error) {
    auditService.logError("GET_OT_CE_TECHNIQUES_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function validateOTCompensatoryEnvironmentalImplementation(
  strategyId: string,
  step: string,
): { valid: boolean; message: string } {
  try {
    const strategy = getOTCompensatoryEnvironmentalStrategyById(strategyId);
    if (!strategy) return { valid: false, message: "Strategy not found" };
    if (!step || typeof step !== "string")
      return { valid: false, message: "Step must be a string" };
    const hasStep = strategy.implementationSteps.some((s) =>
      s.toLowerCase().includes(step.toLowerCase()),
    );
    return {
      valid: hasStep,
      message: hasStep ? "Step found" : "Step not found",
    };
  } catch (error) {
    auditService.logError("VALIDATE_OT_CE_IMPLEMENTATION_ERROR", {
      strategyId,
      step,
      error: error instanceof Error ? error.message : String(error),
    });
    return { valid: false, message: "Validation error" };
  }
}

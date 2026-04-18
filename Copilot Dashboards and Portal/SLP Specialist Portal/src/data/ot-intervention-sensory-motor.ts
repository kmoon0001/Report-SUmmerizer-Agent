/**
 * OT Intervention Strategies - Sensory & Motor Strategies
 */

import { auditService } from "../core/audit/AuditService";

export interface OTSensoryMotorStrategy {
  id: string;
  name: string;
  category: string;
  description: string;
  techniques: string[];
  indications: string[];
  contraindications: string[];
  applicationMethods: string[];
  evidenceLevel: 1 | 2 | 3;
  source: string;
  citation: string;
  lastUpdated: Date;
}

const strategies: OTSensoryMotorStrategy[] = [
  {
    id: "strat-ot-sm-001",
    name: "Proprioceptive Input Strategies",
    category: "Sensory & Motor Strategies",
    description:
      "Techniques to provide proprioceptive input and enhance body awareness",
    techniques: [
      "Joint compression",
      "Resistance activities",
      "Weight-bearing",
      "Heavy work",
      "Pushing/pulling",
    ],
    indications: [
      "Proprioceptive deficit",
      "Body awareness deficit",
      "Motor planning deficit",
      "Coordination deficit",
    ],
    contraindications: [
      "Severe pain",
      "Joint instability",
      "Neurological compromise",
    ],
    applicationMethods: [
      "Structured activities",
      "Functional tasks",
      "Play-based",
      "Therapeutic exercises",
      "Environmental setup",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Proprioceptive Input Strategies Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-sm-002",
    name: "Vestibular Input Strategies",
    category: "Sensory & Motor Strategies",
    description: "Techniques to provide vestibular input and improve balance",
    techniques: [
      "Rocking",
      "Swinging",
      "Spinning",
      "Linear movement",
      "Tilting",
    ],
    indications: [
      "Vestibular deficit",
      "Balance dysfunction",
      "Dizziness",
      "Coordination deficit",
    ],
    contraindications: [
      "Severe pain",
      "Neurological compromise",
      "Cardiovascular compromise",
    ],
    applicationMethods: [
      "Structured activities",
      "Equipment use",
      "Play-based",
      "Therapeutic exercises",
      "Environmental setup",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Vestibular Input Strategies Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-sm-003",
    name: "Tactile Input Strategies",
    category: "Sensory & Motor Strategies",
    description:
      "Techniques to provide tactile input and enhance sensory awareness",
    techniques: [
      "Brushing",
      "Rubbing",
      "Tapping",
      "Texture exploration",
      "Temperature variation",
    ],
    indications: [
      "Tactile defensiveness",
      "Sensory seeking",
      "Tactile discrimination deficit",
      "Sensory processing deficit",
    ],
    contraindications: [
      "Severe pain",
      "Skin conditions",
      "Neurological compromise",
    ],
    applicationMethods: [
      "Structured activities",
      "Functional tasks",
      "Play-based",
      "Therapeutic exercises",
      "Environmental setup",
    ],
    evidenceLevel: 2,
    source: "AOTA",
    citation: "AOTA (2020). Tactile Input Strategies Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-sm-004",
    name: "Visual Motor Integration Training",
    category: "Sensory & Motor Strategies",
    description:
      "Training to improve coordination between visual and motor systems",
    techniques: [
      "Eye-hand coordination",
      "Visual tracking",
      "Visual-motor tasks",
      "Bilateral coordination",
      "Crossing midline",
    ],
    indications: [
      "Visual-motor deficit",
      "Coordination deficit",
      "Motor planning deficit",
      "Functional limitation",
    ],
    contraindications: [
      "Severe pain",
      "Vision impairment",
      "Neurological compromise",
    ],
    applicationMethods: [
      "Structured activities",
      "Functional tasks",
      "Play-based",
      "Therapeutic exercises",
      "Environmental setup",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Visual Motor Integration Training Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-sm-005",
    name: "Fine Motor Skill Training",
    category: "Sensory & Motor Strategies",
    description:
      "Training to improve precision and control of small hand movements",
    techniques: [
      "Pinch activities",
      "Grasp activities",
      "Manipulation tasks",
      "Dexterity exercises",
      "Precision activities",
    ],
    indications: [
      "Fine motor deficit",
      "Dexterity limitation",
      "Grasp dysfunction",
      "Functional limitation",
    ],
    contraindications: [
      "Severe pain",
      "Joint instability",
      "Neurological compromise",
    ],
    applicationMethods: [
      "Structured activities",
      "Functional tasks",
      "Play-based",
      "Therapeutic exercises",
      "Environmental setup",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Fine Motor Skill Training Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-sm-006",
    name: "Gross Motor Skill Training",
    category: "Sensory & Motor Strategies",
    description: "Training to improve large muscle movement and coordination",
    techniques: [
      "Locomotion",
      "Balance activities",
      "Coordination exercises",
      "Strength activities",
      "Endurance training",
    ],
    indications: [
      "Gross motor deficit",
      "Balance dysfunction",
      "Coordination deficit",
      "Functional limitation",
    ],
    contraindications: [
      "Severe pain",
      "Neurological compromise",
      "Cardiovascular compromise",
    ],
    applicationMethods: [
      "Structured activities",
      "Functional tasks",
      "Play-based",
      "Therapeutic exercises",
      "Environmental setup",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Gross Motor Skill Training Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-sm-007",
    name: "Bilateral Coordination Training",
    category: "Sensory & Motor Strategies",
    description:
      "Training to improve coordination between both sides of the body",
    techniques: [
      "Bilateral activities",
      "Crossing midline",
      "Alternating movements",
      "Synchronized movements",
      "Asymmetrical movements",
    ],
    indications: [
      "Bilateral coordination deficit",
      "Motor planning deficit",
      "Coordination deficit",
      "Functional limitation",
    ],
    contraindications: [
      "Severe pain",
      "Neurological compromise",
      "Severe weakness",
    ],
    applicationMethods: [
      "Structured activities",
      "Functional tasks",
      "Play-based",
      "Therapeutic exercises",
      "Environmental setup",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Bilateral Coordination Training Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-sm-008",
    name: "Motor Planning Training",
    category: "Sensory & Motor Strategies",
    description:
      "Training to improve ability to plan and execute motor movements",
    techniques: [
      "Sequencing",
      "Timing",
      "Grading",
      "Coordination",
      "Problem-solving",
    ],
    indications: [
      "Motor planning deficit",
      "Dyspraxia",
      "Coordination deficit",
      "Functional limitation",
    ],
    contraindications: [
      "Severe pain",
      "Neurological compromise",
      "Severe cognitive impairment",
    ],
    applicationMethods: [
      "Structured activities",
      "Functional tasks",
      "Play-based",
      "Therapeutic exercises",
      "Environmental setup",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Motor Planning Training Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-sm-009",
    name: "Sensory Modulation Strategies",
    category: "Sensory & Motor Strategies",
    description: "Strategies to help regulate sensory input and responses",
    techniques: [
      "Sensory diet",
      "Environmental modification",
      "Activity selection",
      "Timing adjustment",
      "Intensity grading",
    ],
    indications: [
      "Sensory modulation disorder",
      "Sensory seeking",
      "Sensory defensiveness",
      "Sensory processing deficit",
    ],
    contraindications: [
      "Severe pain",
      "Neurological compromise",
      "Severe cognitive impairment",
    ],
    applicationMethods: [
      "Structured activities",
      "Functional tasks",
      "Play-based",
      "Environmental setup",
      "Caregiver training",
    ],
    evidenceLevel: 2,
    source: "AOTA",
    citation: "AOTA (2020). Sensory Modulation Strategies Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-sm-010",
    name: "Postural Control Training",
    category: "Sensory & Motor Strategies",
    description: "Training to improve postural stability and control",
    techniques: [
      "Core strengthening",
      "Balance activities",
      "Weight shifting",
      "Postural awareness",
      "Stability exercises",
    ],
    indications: [
      "Postural dysfunction",
      "Balance deficit",
      "Core weakness",
      "Functional limitation",
    ],
    contraindications: [
      "Severe pain",
      "Neurological compromise",
      "Severe weakness",
    ],
    applicationMethods: [
      "Structured activities",
      "Functional tasks",
      "Therapeutic exercises",
      "Environmental setup",
      "Equipment use",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Postural Control Training Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-sm-011",
    name: "Sensory Discrimination Training",
    category: "Sensory & Motor Strategies",
    description:
      "Training to improve ability to discriminate between sensory stimuli",
    techniques: [
      "Texture discrimination",
      "Temperature discrimination",
      "Proprioceptive discrimination",
      "Auditory discrimination",
      "Visual discrimination",
    ],
    indications: [
      "Sensory discrimination deficit",
      "Sensory processing deficit",
      "Functional limitation",
      "Learning difficulty",
    ],
    contraindications: [
      "Severe pain",
      "Neurological compromise",
      "Severe cognitive impairment",
    ],
    applicationMethods: [
      "Structured activities",
      "Functional tasks",
      "Play-based",
      "Therapeutic exercises",
      "Environmental setup",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Sensory Discrimination Training Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-sm-012",
    name: "Adaptive Motor Control Training",
    category: "Sensory & Motor Strategies",
    description:
      "Training to improve ability to adapt motor responses to changing demands",
    techniques: [
      "Variable practice",
      "Contextual practice",
      "Perturbation training",
      "Feedback training",
      "Problem-solving",
    ],
    indications: [
      "Motor control deficit",
      "Adaptation difficulty",
      "Functional limitation",
      "Learning difficulty",
    ],
    contraindications: [
      "Severe pain",
      "Neurological compromise",
      "Severe cognitive impairment",
    ],
    applicationMethods: [
      "Structured activities",
      "Functional tasks",
      "Therapeutic exercises",
      "Environmental setup",
      "Feedback training",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Adaptive Motor Control Training Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-sm-013",
    name: "Sensory Integration Therapy",
    category: "Sensory & Motor Strategies",
    description:
      "Comprehensive approach to improve sensory processing and motor response",
    techniques: [
      "Proprioceptive input",
      "Vestibular input",
      "Tactile input",
      "Motor planning",
      "Adaptive response",
    ],
    indications: [
      "Sensory processing disorder",
      "Motor planning deficit",
      "Coordination deficit",
      "Functional limitation",
    ],
    contraindications: [
      "Severe pain",
      "Neurological compromise",
      "Severe cognitive impairment",
    ],
    applicationMethods: [
      "Structured activities",
      "Play-based",
      "Therapeutic exercises",
      "Environmental setup",
      "Equipment use",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Sensory Integration Therapy Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-sm-014",
    name: "Neuromuscular Re-education",
    category: "Sensory & Motor Strategies",
    description:
      "Training to restore neuromuscular control after injury or dysfunction",
    techniques: [
      "Muscle activation",
      "Muscle strengthening",
      "Coordination training",
      "Motor control training",
      "Functional training",
    ],
    indications: [
      "Neuromuscular dysfunction",
      "Weakness",
      "Motor control deficit",
      "Functional limitation",
    ],
    contraindications: [
      "Severe pain",
      "Neurological compromise",
      "Severe weakness",
    ],
    applicationMethods: [
      "Structured activities",
      "Functional tasks",
      "Therapeutic exercises",
      "Equipment use",
      "Feedback training",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Neuromuscular Re-education Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "strat-ot-sm-015",
    name: "Constraint-Induced Movement Therapy",
    category: "Sensory & Motor Strategies",
    description:
      "Intensive training with constraint to promote use of affected limb",
    techniques: [
      "Constraint application",
      "Intensive practice",
      "Repetitive tasks",
      "Functional training",
      "Progressive challenge",
    ],
    indications: [
      "Hemiplegia",
      "Limb disuse",
      "Motor deficit",
      "Functional limitation",
    ],
    contraindications: [
      "Severe pain",
      "Severe neurological compromise",
      "Severe cognitive impairment",
    ],
    applicationMethods: [
      "Structured activities",
      "Functional tasks",
      "Intensive practice",
      "Therapeutic exercises",
      "Progressive challenge",
    ],
    evidenceLevel: 1,
    source: "AOTA",
    citation: "AOTA (2020). Constraint-Induced Movement Therapy Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
];

export function getOTSensoryMotorStrategyById(
  id: string,
): OTSensoryMotorStrategy | undefined {
  try {
    if (!id || typeof id !== "string") {
      auditService.logWarning("INVALID_OT_SM_ID", { id });
      return undefined;
    }
    const strategy = strategies.find((s) => s.id === id);
    if (!strategy) {
      auditService.logWarning("OT_SM_NOT_FOUND", { id });
    }
    return strategy;
  } catch (error) {
    auditService.logError("GET_OT_SM_ERROR", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

export function getAllOTSensoryMotorStrategies(): OTSensoryMotorStrategy[] {
  try {
    return [...strategies];
  } catch (error) {
    auditService.logError("GET_ALL_OT_SM_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTSensoryMotorStrategiesByCategory(
  category: string,
): OTSensoryMotorStrategy[] {
  try {
    if (!category || typeof category !== "string") {
      auditService.logWarning("INVALID_OT_SM_CATEGORY", { category });
      return [];
    }
    return strategies.filter((s) =>
      s.category.toLowerCase().includes(category.toLowerCase()),
    );
  } catch (error) {
    auditService.logError("GET_OT_SM_BY_CATEGORY_ERROR", {
      category,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function searchOTSensoryMotorStrategies(
  query: string,
): OTSensoryMotorStrategy[] {
  try {
    if (!query || typeof query !== "string") {
      auditService.logWarning("INVALID_OT_SM_SEARCH", { query });
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
    auditService.logError("SEARCH_OT_SM_ERROR", {
      query,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTSensoryMotorStrategiesByEvidenceLevel(
  level: 1 | 2 | 3,
): OTSensoryMotorStrategy[] {
  try {
    if (![1, 2, 3].includes(level)) {
      auditService.logWarning("INVALID_OT_SM_EVIDENCE_LEVEL", { level });
      return [];
    }
    return strategies.filter((s) => s.evidenceLevel === level);
  } catch (error) {
    auditService.logError("GET_OT_SM_BY_EVIDENCE_ERROR", {
      level,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTSensoryMotorTechniques(): string[] {
  try {
    const techniques = new Set<string>();
    strategies.forEach((s) => s.techniques.forEach((t) => techniques.add(t)));
    return Array.from(techniques).sort();
  } catch (error) {
    auditService.logError("GET_OT_SM_TECHNIQUES_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function validateOTSensoryMotorApplication(
  strategyId: string,
  method: string,
): { valid: boolean; message: string } {
  try {
    const strategy = getOTSensoryMotorStrategyById(strategyId);
    if (!strategy) return { valid: false, message: "Strategy not found" };
    if (!method || typeof method !== "string")
      return { valid: false, message: "Method must be a string" };
    const hasMethod = strategy.applicationMethods.some((m) =>
      m.toLowerCase().includes(method.toLowerCase()),
    );
    return {
      valid: hasMethod,
      message: hasMethod ? "Method found" : "Method not found",
    };
  } catch (error) {
    auditService.logError("VALIDATE_OT_SM_APPLICATION_ERROR", {
      strategyId,
      method,
      error: error instanceof Error ? error.message : String(error),
    });
    return { valid: false, message: "Validation error" };
  }
}

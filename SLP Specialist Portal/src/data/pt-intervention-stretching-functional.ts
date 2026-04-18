/**
 * PT Intervention Techniques - Stretching & Functional Training
 */

import { auditService } from "../core/audit/AuditService";

export interface PTStretchingFunctionalProtocol {
  id: string;
  name: string;
  category: string;
  description: string;
  techniques: string[];
  indications: string[];
  contraindications: string[];
  parameters: string[];
  evidenceLevel: 1 | 2 | 3;
  source: string;
  citation: string;
  lastUpdated: Date;
}

const protocols: PTStretchingFunctionalProtocol[] = [
  {
    id: "tech-pt-sf-001",
    name: "Static Stretching Protocol",
    category: "Stretching & Functional Training",
    description:
      "Sustained stretching to improve flexibility and reduce muscle tension",
    techniques: [
      "Hold stretch",
      "Maintain position",
      "Breathe deeply",
      "Relax into stretch",
      "Avoid bouncing",
    ],
    indications: [
      "Muscle tightness",
      "Limited flexibility",
      "Postural dysfunction",
      "Muscle imbalance",
    ],
    contraindications: [
      "Acute pain",
      "Fractures",
      "Severe weakness",
      "Hypermobility",
    ],
    parameters: [
      "Duration: 30-60 seconds",
      "Repetitions: 2-3 times",
      "Frequency: Daily",
      "Intensity: Mild tension",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Static Stretching Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "tech-pt-sf-002",
    name: "Dynamic Stretching Protocol",
    category: "Stretching & Functional Training",
    description:
      "Active movement through range of motion to improve flexibility and prepare for activity",
    techniques: [
      "Controlled movement",
      "Gradual increase",
      "Rhythmic motion",
      "Active participation",
      "Progressive range",
    ],
    indications: [
      "Pre-activity preparation",
      "Limited flexibility",
      "Motor control deficit",
      "Functional limitation",
    ],
    contraindications: [
      "Acute pain",
      "Fractures",
      "Severe weakness",
      "Neurological compromise",
    ],
    parameters: [
      "Duration: 30-60 seconds",
      "Repetitions: 8-10 times",
      "Frequency: Pre-activity",
      "Intensity: Moderate",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Dynamic Stretching Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "tech-pt-sf-003",
    name: "PNF Stretching Protocol",
    category: "Stretching & Functional Training",
    description:
      "Advanced stretching using proprioceptive neuromuscular facilitation techniques",
    techniques: [
      "Contract-relax",
      "Hold-relax",
      "Agonist contraction",
      "Reciprocal inhibition",
      "Progressive stretch",
    ],
    indications: [
      "Severe tightness",
      "Limited flexibility",
      "Muscle imbalance",
      "Motor control deficit",
    ],
    contraindications: [
      "Acute pain",
      "Fractures",
      "Severe weakness",
      "Neurological compromise",
    ],
    parameters: [
      "Duration: 30-60 seconds",
      "Repetitions: 3-5 times",
      "Frequency: 2-3 times per week",
      "Intensity: Moderate to high",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). PNF Stretching Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "tech-pt-sf-004",
    name: "Functional Movement Training Protocol",
    category: "Stretching & Functional Training",
    description:
      "Training to improve functional movement patterns and daily activities",
    techniques: [
      "Sit to stand",
      "Gait training",
      "Stair climbing",
      "Balance training",
      "Reaching activities",
    ],
    indications: [
      "Functional limitation",
      "Mobility deficit",
      "Balance dysfunction",
      "Activity limitation",
    ],
    contraindications: [
      "Acute pain",
      "Severe weakness",
      "Neurological compromise",
      "Vascular compromise",
    ],
    parameters: [
      "Duration: 20-30 minutes",
      "Repetitions: As tolerated",
      "Frequency: 3-5 times per week",
      "Intensity: Moderate",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Functional Movement Training Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "tech-pt-sf-005",
    name: "Balance and Proprioception Training Protocol",
    category: "Stretching & Functional Training",
    description:
      "Training to improve balance, proprioception, and postural control",
    techniques: [
      "Single leg stance",
      "Tandem stance",
      "Perturbation training",
      "Visual feedback",
      "Proprioceptive input",
    ],
    indications: [
      "Balance dysfunction",
      "Fall risk",
      "Proprioceptive deficit",
      "Postural instability",
    ],
    contraindications: [
      "Acute pain",
      "Severe weakness",
      "Neurological compromise",
      "Vascular compromise",
    ],
    parameters: [
      "Duration: 15-20 minutes",
      "Repetitions: As tolerated",
      "Frequency: 3-5 times per week",
      "Intensity: Progressive",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Balance and Proprioception Training Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "tech-pt-sf-006",
    name: "Gait Training Protocol",
    category: "Stretching & Functional Training",
    description: "Training to improve walking patterns and gait mechanics",
    techniques: [
      "Overground walking",
      "Treadmill walking",
      "Obstacle negotiation",
      "Stair climbing",
      "Incline walking",
    ],
    indications: [
      "Gait dysfunction",
      "Mobility limitation",
      "Neurological deficit",
      "Orthopedic limitation",
    ],
    contraindications: [
      "Acute pain",
      "Severe weakness",
      "Neurological compromise",
      "Vascular compromise",
    ],
    parameters: [
      "Duration: 20-30 minutes",
      "Distance: As tolerated",
      "Frequency: 3-5 times per week",
      "Intensity: Moderate",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Gait Training Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "tech-pt-sf-007",
    name: "Postural Training Protocol",
    category: "Stretching & Functional Training",
    description: "Training to improve posture and postural awareness",
    techniques: [
      "Postural assessment",
      "Postural correction",
      "Ergonomic training",
      "Postural exercises",
      "Awareness training",
    ],
    indications: [
      "Postural dysfunction",
      "Postural pain",
      "Muscle imbalance",
      "Occupational strain",
    ],
    contraindications: [
      "Acute pain",
      "Severe weakness",
      "Neurological compromise",
      "Vascular compromise",
    ],
    parameters: [
      "Duration: 15-20 minutes",
      "Repetitions: As tolerated",
      "Frequency: 3-5 times per week",
      "Intensity: Moderate",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Postural Training Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "tech-pt-sf-008",
    name: "Coordination and Motor Control Training Protocol",
    category: "Stretching & Functional Training",
    description: "Training to improve coordination and motor control",
    techniques: [
      "Fine motor tasks",
      "Gross motor tasks",
      "Bilateral coordination",
      "Sequencing",
      "Timing",
    ],
    indications: [
      "Coordination deficit",
      "Motor control deficit",
      "Neurological dysfunction",
      "Functional limitation",
    ],
    contraindications: [
      "Acute pain",
      "Severe weakness",
      "Severe neurological compromise",
      "Vascular compromise",
    ],
    parameters: [
      "Duration: 15-20 minutes",
      "Repetitions: As tolerated",
      "Frequency: 3-5 times per week",
      "Intensity: Progressive",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation:
      "APTA (2020). Coordination and Motor Control Training Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "tech-pt-sf-009",
    name: "Endurance Training Protocol",
    category: "Stretching & Functional Training",
    description: "Training to improve cardiovascular and muscular endurance",
    techniques: [
      "Aerobic exercise",
      "Interval training",
      "Circuit training",
      "Progressive loading",
      "Sustained activity",
    ],
    indications: [
      "Deconditioning",
      "Endurance deficit",
      "Cardiovascular limitation",
      "Functional limitation",
    ],
    contraindications: [
      "Acute cardiac event",
      "Unstable angina",
      "Severe arrhythmia",
      "Unstable vital signs",
    ],
    parameters: [
      "Duration: 20-30 minutes",
      "Intensity: 60-80% max HR",
      "Frequency: 3-5 times per week",
      "Progression: Gradual",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Endurance Training Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "tech-pt-sf-010",
    name: "Flexibility and Mobility Training Protocol",
    category: "Stretching & Functional Training",
    description:
      "Comprehensive training to improve flexibility and joint mobility",
    techniques: [
      "Static stretching",
      "Dynamic stretching",
      "Joint mobilization",
      "Soft tissue work",
      "Active ROM",
    ],
    indications: [
      "Limited flexibility",
      "Limited mobility",
      "Muscle tightness",
      "Joint stiffness",
    ],
    contraindications: [
      "Acute pain",
      "Fractures",
      "Severe weakness",
      "Hypermobility",
    ],
    parameters: [
      "Duration: 20-30 minutes",
      "Repetitions: 2-3 times",
      "Frequency: Daily",
      "Intensity: Mild to moderate",
    ],
    evidenceLevel: 1,
    source: "APTA",
    citation: "APTA (2020). Flexibility and Mobility Training Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
];

export function getPTStretchingFunctionalProtocolById(
  id: string,
): PTStretchingFunctionalProtocol | undefined {
  try {
    if (!id || typeof id !== "string") {
      auditService.logWarning("INVALID_PT_SF_ID", { id });
      return undefined;
    }
    const protocol = protocols.find((p) => p.id === id);
    if (!protocol) {
      auditService.logWarning("PT_SF_NOT_FOUND", { id });
    }
    return protocol;
  } catch (error) {
    auditService.logError("GET_PT_SF_ERROR", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

export function getAllPTStretchingFunctionalProtocols(): PTStretchingFunctionalProtocol[] {
  try {
    return [...protocols];
  } catch (error) {
    auditService.logError("GET_ALL_PT_SF_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getPTStretchingFunctionalProtocolsByCategory(
  category: string,
): PTStretchingFunctionalProtocol[] {
  try {
    if (!category || typeof category !== "string") {
      auditService.logWarning("INVALID_PT_SF_CATEGORY", { category });
      return [];
    }
    return protocols.filter((p) =>
      p.category.toLowerCase().includes(category.toLowerCase()),
    );
  } catch (error) {
    auditService.logError("GET_PT_SF_BY_CATEGORY_ERROR", {
      category,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function searchPTStretchingFunctionalProtocols(
  query: string,
): PTStretchingFunctionalProtocol[] {
  try {
    if (!query || typeof query !== "string") {
      auditService.logWarning("INVALID_PT_SF_SEARCH", { query });
      return [];
    }
    const lowerQuery = query.toLowerCase();
    return protocols.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery),
    );
  } catch (error) {
    auditService.logError("SEARCH_PT_SF_ERROR", {
      query,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getPTStretchingFunctionalProtocolsByEvidenceLevel(
  level: 1 | 2 | 3,
): PTStretchingFunctionalProtocol[] {
  try {
    if (![1, 2, 3].includes(level)) {
      auditService.logWarning("INVALID_PT_SF_EVIDENCE_LEVEL", { level });
      return [];
    }
    return protocols.filter((p) => p.evidenceLevel === level);
  } catch (error) {
    auditService.logError("GET_PT_SF_BY_EVIDENCE_ERROR", {
      level,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getPTStretchingFunctionalTechniques(): string[] {
  try {
    const techniques = new Set<string>();
    protocols.forEach((p) => p.techniques.forEach((t) => techniques.add(t)));
    return Array.from(techniques).sort();
  } catch (error) {
    auditService.logError("GET_PT_SF_TECHNIQUES_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function validatePTStretchingFunctionalParameter(
  protocolId: string,
  parameter: string,
): { valid: boolean; message: string } {
  try {
    const protocol = getPTStretchingFunctionalProtocolById(protocolId);
    if (!protocol) return { valid: false, message: "Protocol not found" };
    if (!parameter || typeof parameter !== "string")
      return { valid: false, message: "Parameter must be a string" };
    const hasParameter = protocol.parameters.some((p) =>
      p.toLowerCase().includes(parameter.toLowerCase()),
    );
    return {
      valid: hasParameter,
      message: hasParameter ? "Parameter found" : "Parameter not found",
    };
  } catch (error) {
    auditService.logError("VALIDATE_PT_SF_PARAMETER_ERROR", {
      protocolId,
      parameter,
      error: error instanceof Error ? error.message : String(error),
    });
    return { valid: false, message: "Validation error" };
  }
}

/**
 * PT Specialized Intervention Frameworks
 * Advanced intervention protocols for complex clinical conditions
 */

import { auditService } from "../core/audit/AuditService";

export interface PTInterventionFramework {
  id: string;
  name: string;
  category: string;
  description: string;
  targetConditions: string[];
  interventionComponents: string[];
  progressionCriteria: string[];
  dosageGuidelines: string[];
  expectedOutcomes: string[];
  contraindications: string[];
  evidenceLevel: 1 | 2 | 3;
  source: string;
  citation: string;
  lastUpdated: Date;
}

const frameworks: PTInterventionFramework[] = [
  {
    id: "pt-if-001",
    name: "Constraint-Induced Movement Therapy Framework",
    category: "Neurological Intervention",
    description:
      "Intensive motor training with constraint of non-affected limb for stroke and brain injury recovery",
    targetConditions: [
      "Stroke",
      "Traumatic brain injury",
      "Cerebral palsy",
      "Brachial plexus injury",
      "Learned non-use",
    ],
    interventionComponents: [
      "Intensive repetitive practice",
      "Constraint of non-affected limb",
      "Task-specific training",
      "Behavioral shaping",
      "Progressive challenge",
    ],
    progressionCriteria: [
      "Improved motor control",
      "Increased ROM",
      "Enhanced strength",
      "Improved coordination",
      "Functional task mastery",
    ],
    dosageGuidelines: [
      "3-4 hours daily",
      "2-3 weeks intensive",
      "Constraint 90% of waking hours",
      "Task-specific practice",
      "Progressive difficulty",
    ],
    expectedOutcomes: [
      "Improved motor function",
      "Reduced learned non-use",
      "Enhanced functional use",
      "Improved participation",
      "Neuroplastic changes",
    ],
    contraindications: [
      "Severe pain",
      "Severe spasticity",
      "Severe cognitive impairment",
      "Severe behavioral disturbance",
      "Severe safety concerns",
    ],
    evidenceLevel: 1,
    source: "APTA Neurological Guidelines & CIMT Research",
    citation: "APTA (2024). Constraint-Induced Movement Therapy.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-if-002",
    name: "Pain Neuroscience Education & Graded Exposure Framework",
    category: "Pain Management Intervention",
    description:
      "Comprehensive pain management combining education, graded exercise, and cognitive-behavioral strategies",
    targetConditions: [
      "Chronic pain",
      "Central sensitization",
      "Chronic low back pain",
      "Fibromyalgia",
      "Complex regional pain syndrome",
    ],
    interventionComponents: [
      "Pain neuroscience education",
      "Graded exercise therapy",
      "Cognitive-behavioral strategies",
      "Mindfulness-based approaches",
      "Sleep optimization",
    ],
    progressionCriteria: [
      "Improved pain understanding",
      "Increased activity tolerance",
      "Reduced catastrophizing",
      "Improved sleep",
      "Enhanced function",
    ],
    dosageGuidelines: [
      "2-3 sessions weekly",
      "8-12 week program",
      "Progressive exercise increase",
      "Behavioral practice daily",
      "Home program adherence",
    ],
    expectedOutcomes: [
      "Reduced pain perception",
      "Improved function",
      "Reduced anxiety",
      "Better sleep",
      "Return to activities",
      "Improved quality of life",
    ],
    contraindications: [
      "Untreated mental health",
      "Active substance abuse",
      "Severe depression",
      "Suicidal ideation",
      "Severe medication dependency",
    ],
    evidenceLevel: 1,
    source: "APTA Pain Management Guidelines & Biopsychosocial Research",
    citation: "APTA (2024). Pain Neuroscience Education Framework.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-if-003",
    name: "Task-Specific Training & Motor Learning Framework",
    category: "Motor Learning Intervention",
    description:
      "Evidence-based motor learning principles applied to functional task training and skill acquisition",
    targetConditions: [
      "Motor dysfunction",
      "Coordination deficit",
      "Movement pattern dysfunction",
      "Skill deficit",
      "Functional limitation",
    ],
    interventionComponents: [
      "Task analysis",
      "Progressive task practice",
      "Feedback optimization",
      "Contextual variation",
      "Skill transfer training",
    ],
    progressionCriteria: [
      "Improved task performance",
      "Increased accuracy",
      "Improved speed",
      "Reduced errors",
      "Skill transfer",
    ],
    dosageGuidelines: [
      "2-3 sessions weekly",
      "High repetition practice",
      "Varied practice conditions",
      "Feedback adjustment",
      "Progressive challenge",
    ],
    expectedOutcomes: [
      "Improved motor skill",
      "Enhanced functional performance",
      "Improved coordination",
      "Increased confidence",
      "Skill retention",
    ],
    contraindications: [
      "Severe cognitive impairment",
      "Severe pain",
      "Severe behavioral disturbance",
      "Severe safety concerns",
      "Severe motivation deficit",
    ],
    evidenceLevel: 1,
    source: "APTA Motor Learning Guidelines & Motor Control Research",
    citation: "APTA (2024). Task-Specific Training Framework.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-if-004",
    name: "Proprioceptive Neuromuscular Facilitation Framework",
    category: "Neuromuscular Intervention",
    description:
      "Advanced PNF techniques for enhancing neuromuscular control, strength, and functional movement",
    targetConditions: [
      "Weakness",
      "Coordination deficit",
      "Movement dysfunction",
      "Proprioceptive deficit",
      "Functional limitation",
    ],
    interventionComponents: [
      "Diagonal patterns",
      "Resistance techniques",
      "Proprioceptive input",
      "Neuromuscular facilitation",
      "Functional integration",
    ],
    progressionCriteria: [
      "Improved strength",
      "Enhanced coordination",
      "Improved proprioception",
      "Improved functional movement",
      "Increased independence",
    ],
    dosageGuidelines: [
      "2-3 sessions weekly",
      "Progressive resistance",
      "Skilled manual techniques",
      "Functional integration",
      "Home program",
    ],
    expectedOutcomes: [
      "Improved strength",
      "Enhanced coordination",
      "Improved proprioception",
      "Improved functional movement",
      "Increased independence",
    ],
    contraindications: [
      "Severe pain",
      "Severe spasticity",
      "Severe weakness",
      "Severe behavioral disturbance",
      "Severe safety concerns",
    ],
    evidenceLevel: 1,
    source: "APTA Neuromuscular Guidelines & PNF Research",
    citation:
      "APTA (2024). Proprioceptive Neuromuscular Facilitation Framework.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-if-005",
    name: "Cardiac Rehabilitation & Exercise Prescription Framework",
    category: "Cardiopulmonary Intervention",
    description:
      "Comprehensive cardiac rehabilitation with progressive exercise prescription and psychosocial support",
    targetConditions: [
      "Post-MI",
      "Heart failure",
      "Cardiac surgery",
      "Arrhythmia",
      "Cardiac anxiety",
    ],
    interventionComponents: [
      "Aerobic training",
      "Resistance training",
      "Breathing strategies",
      "Anxiety management",
      "Psychosocial support",
    ],
    progressionCriteria: [
      "Improved exercise tolerance",
      "Improved cardiac function",
      "Reduced dyspnea",
      "Reduced anxiety",
      "Return to activities",
    ],
    dosageGuidelines: [
      "3-5 sessions weekly",
      "Progressive intensity",
      "Vital sign monitoring",
      "Symptom-limited progression",
      "Long-term maintenance",
    ],
    expectedOutcomes: [
      "Improved exercise tolerance",
      "Improved cardiac function",
      "Reduced dyspnea",
      "Reduced anxiety",
      "Return to activities",
      "Improved quality of life",
    ],
    contraindications: [
      "Unstable angina",
      "Uncontrolled arrhythmia",
      "Severe dyspnea",
      "Acute decompensation",
      "Severe anxiety",
    ],
    evidenceLevel: 1,
    source: "APTA Cardiopulmonary Guidelines & Cardiac Rehabilitation Research",
    citation: "APTA (2024). Cardiac Rehabilitation Framework.",
    lastUpdated: new Date("2024-01-15"),
  },
];

export function getPTInterventionFrameworkById(
  id: string,
): PTInterventionFramework | undefined {
  try {
    if (!id || typeof id !== "string") {
      auditService.logWarning("INVALID_PT_IF_ID", { id });
      return undefined;
    }
    const framework = frameworks.find((f) => f.id === id);
    if (!framework) {
      auditService.logWarning("PT_IF_NOT_FOUND", { id });
    }
    return framework;
  } catch (error) {
    auditService.logError("GET_PT_IF_ERROR", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

export function getAllPTInterventionFrameworks(): PTInterventionFramework[] {
  try {
    return [...frameworks];
  } catch (error) {
    auditService.logError("GET_ALL_PT_IF_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getPTInterventionFrameworksByCategory(
  category: string,
): PTInterventionFramework[] {
  try {
    if (!category || typeof category !== "string") {
      auditService.logWarning("INVALID_PT_IF_CATEGORY", { category });
      return [];
    }
    return frameworks.filter((f) =>
      f.category.toLowerCase().includes(category.toLowerCase()),
    );
  } catch (error) {
    auditService.logError("GET_PT_IF_BY_CATEGORY_ERROR", {
      category,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function searchPTInterventionFrameworks(
  query: string,
): PTInterventionFramework[] {
  try {
    if (!query || typeof query !== "string") {
      auditService.logWarning("INVALID_PT_IF_SEARCH", { query });
      return [];
    }
    const lowerQuery = query.toLowerCase();
    return frameworks.filter(
      (f) =>
        f.name.toLowerCase().includes(lowerQuery) ||
        f.category.toLowerCase().includes(lowerQuery) ||
        f.description.toLowerCase().includes(lowerQuery),
    );
  } catch (error) {
    auditService.logError("SEARCH_PT_IF_ERROR", {
      query,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getPTInterventionFrameworksByEvidenceLevel(
  level: 1 | 2 | 3,
): PTInterventionFramework[] {
  try {
    if (![1, 2, 3].includes(level)) {
      auditService.logWarning("INVALID_PT_IF_EVIDENCE_LEVEL", { level });
      return [];
    }
    return frameworks.filter((f) => f.evidenceLevel === level);
  } catch (error) {
    auditService.logError("GET_PT_IF_BY_EVIDENCE_ERROR", {
      level,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getInterventionComponents(): string[] {
  try {
    const components = new Set<string>();
    frameworks.forEach((f) =>
      f.interventionComponents.forEach((c) => components.add(c)),
    );
    return Array.from(components).sort();
  } catch (error) {
    auditService.logError("GET_INTERVENTION_COMPONENTS_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function validateInterventionFramework(
  frameworkId: string,
  condition: string,
): { valid: boolean; message: string } {
  try {
    const framework = getPTInterventionFrameworkById(frameworkId);
    if (!framework) return { valid: false, message: "Framework not found" };
    if (!condition || typeof condition !== "string")
      return { valid: false, message: "Condition must be a string" };
    const hasCondition = framework.targetConditions.some((c) =>
      c.toLowerCase().includes(condition.toLowerCase()),
    );
    return {
      valid: hasCondition,
      message: hasCondition ? "Condition found" : "Condition not found",
    };
  } catch (error) {
    auditService.logError("VALIDATE_INTERVENTION_FRAMEWORK_ERROR", {
      frameworkId,
      condition,
      error: error instanceof Error ? error.message : String(error),
    });
    return { valid: false, message: "Validation error" };
  }
}

/**
 * OT Specialized Intervention Frameworks
 * Advanced intervention protocols for complex occupational conditions
 */

import { auditService } from "../core/audit/AuditService";

export interface OTInterventionFramework {
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

const frameworks: OTInterventionFramework[] = [
  {
    id: "ot-if-001",
    name: "Sensory Integration & Occupational Engagement Framework",
    category: "Sensory Intervention",
    description:
      "Comprehensive sensory integration approach for improving occupational engagement and functional performance",
    targetConditions: [
      "Autism spectrum disorder",
      "Sensory processing disorder",
      "Developmental delay",
      "Cerebral palsy",
      "ADHD",
    ],
    interventionComponents: [
      "Sensory diet",
      "Vestibular training",
      "Proprioceptive input",
      "Tactile desensitization",
      "Occupational engagement",
    ],
    progressionCriteria: [
      "Improved sensory regulation",
      "Increased occupational engagement",
      "Reduced behavioral issues",
      "Improved participation",
      "Enhanced learning",
    ],
    dosageGuidelines: [
      "2-3 sessions weekly",
      "Individualized sensory diet",
      "Home program daily",
      "Progressive challenge",
      "Behavioral monitoring",
    ],
    expectedOutcomes: [
      "Improved sensory regulation",
      "Increased occupational engagement",
      "Reduced behavioral disturbance",
      "Improved participation",
      "Enhanced learning",
    ],
    contraindications: [
      "Severe behavioral disturbance",
      "Self-injurious behavior",
      "Severe aggression",
      "Severe anxiety",
      "Severe safety concerns",
    ],
    evidenceLevel: 1,
    source:
      "AOTA Sensory Integration Guidelines & Occupational Engagement Research",
    citation: "AOTA (2024). Sensory Integration Framework.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-if-002",
    name: "Cognitive-Behavioral Intervention & Occupational Adaptation Framework",
    category: "Psychosocial Intervention",
    description:
      "Integrated cognitive-behavioral and occupational adaptation approach for mental health and occupational dysfunction",
    targetConditions: [
      "Depression",
      "Anxiety",
      "Bipolar disorder",
      "Occupational dysfunction",
      "Role loss",
    ],
    interventionComponents: [
      "Cognitive-behavioral strategies",
      "Occupational role exploration",
      "Structured activity programming",
      "Skill development",
      "Psychosocial support",
    ],
    progressionCriteria: [
      "Improved mood",
      "Reduced anxiety",
      "Occupational role reestablishment",
      "Increased engagement",
      "Improved function",
    ],
    dosageGuidelines: [
      "2-3 sessions weekly",
      "Structured programming",
      "Home practice daily",
      "Progressive challenge",
      "Peer support integration",
    ],
    expectedOutcomes: [
      "Improved mood",
      "Reduced anxiety",
      "Occupational role reestablishment",
      "Increased engagement",
      "Improved quality of life",
    ],
    contraindications: [
      "Suicidal ideation",
      "Severe depression",
      "Severe anxiety",
      "Substance abuse",
      "Severe occupational dysfunction",
    ],
    evidenceLevel: 1,
    source: "AOTA Mental Health Guidelines & Occupational Adaptation Research",
    citation: "AOTA (2024). Cognitive-Behavioral Intervention Framework.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-if-003",
    name: "Adaptive Equipment & Environmental Modification Framework",
    category: "Functional Adaptation Intervention",
    description:
      "Comprehensive approach to adaptive equipment prescription and environmental modification for functional independence",
    targetConditions: [
      "ADL dependence",
      "Mobility limitation",
      "Upper extremity dysfunction",
      "Cognitive impairment",
      "Safety concerns",
    ],
    interventionComponents: [
      "Adaptive equipment prescription",
      "Environmental modification",
      "ADL retraining",
      "Caregiver training",
      "Safety planning",
    ],
    progressionCriteria: [
      "Improved independence",
      "Enhanced safety",
      "Reduced caregiver burden",
      "Improved participation",
      "Maintained function",
    ],
    dosageGuidelines: [
      "Assessment & prescription",
      "Equipment trial period",
      "Caregiver training sessions",
      "Home modification",
      "Follow-up monitoring",
    ],
    expectedOutcomes: [
      "Improved independence",
      "Enhanced safety",
      "Reduced caregiver burden",
      "Improved participation",
      "Maintained quality of life",
    ],
    contraindications: [
      "Severe cognitive impairment",
      "Severe safety risk",
      "Severe caregiver stress",
      "Severe dependence",
      "Severe behavioral disturbance",
    ],
    evidenceLevel: 1,
    source:
      "AOTA Functional Assessment Guidelines & Adaptive Equipment Research",
    citation: "AOTA (2024). Adaptive Equipment Framework.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-if-004",
    name: "Occupation-Based Activity & Meaningful Engagement Framework",
    category: "Occupational Engagement Intervention",
    description:
      "Client-centered approach using meaningful occupations and activities for therapeutic change and engagement",
    targetConditions: [
      "Occupational dysfunction",
      "Participation restriction",
      "Meaning loss",
      "Engagement deficit",
      "Role loss",
    ],
    interventionComponents: [
      "Occupation-based activity",
      "Meaningful engagement",
      "Skill development",
      "Role exploration",
      "Community integration",
    ],
    progressionCriteria: [
      "Increased engagement",
      "Improved occupational performance",
      "Enhanced meaning",
      "Improved participation",
      "Role reestablishment",
    ],
    dosageGuidelines: [
      "2-3 sessions weekly",
      "Individualized activities",
      "Progressive challenge",
      "Community integration",
      "Peer support",
    ],
    expectedOutcomes: [
      "Increased engagement",
      "Improved occupational performance",
      "Enhanced meaning",
      "Improved participation",
      "Role reestablishment",
    ],
    contraindications: [
      "Severe depression",
      "Severe anxiety",
      "Severe occupational dysfunction",
      "Severe motivation deficit",
      "Severe social isolation",
    ],
    evidenceLevel: 1,
    source:
      "AOTA Occupational Engagement Guidelines & Meaningful Activity Research",
    citation: "AOTA (2024). Occupation-Based Activity Framework.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-if-005",
    name: "Work Conditioning & Vocational Rehabilitation Framework",
    category: "Vocational Intervention",
    description:
      "Comprehensive work conditioning and vocational rehabilitation for return-to-work and occupational reintegration",
    targetConditions: [
      "Work disability",
      "Occupational injury",
      "Chronic illness",
      "Functional limitation",
      "Vocational change",
    ],
    interventionComponents: [
      "Work conditioning",
      "Job simulation",
      "Skill development",
      "Accommodation planning",
      "Employer coordination",
    ],
    progressionCriteria: [
      "Improved work capacity",
      "Increased work tolerance",
      "Improved job performance",
      "Successful return-to-work",
      "Job retention",
    ],
    dosageGuidelines: [
      "3-5 sessions weekly",
      "Progressive intensity",
      "Job-specific training",
      "Employer coordination",
      "Long-term follow-up",
    ],
    expectedOutcomes: [
      "Improved work capacity",
      "Successful return-to-work",
      "Job retention",
      "Improved occupational function",
      "Enhanced quality of life",
    ],
    contraindications: [
      "Severe work incapacity",
      "Severe pain",
      "Severe cognitive impairment",
      "Severe psychological distress",
      "Employer resistance",
    ],
    evidenceLevel: 1,
    source: "AOTA Vocational Guidelines & Work Rehabilitation Research",
    citation: "AOTA (2024). Work Conditioning Framework.",
    lastUpdated: new Date("2024-01-15"),
  },
];

export function getOTInterventionFrameworkById(
  id: string,
): OTInterventionFramework | undefined {
  try {
    if (!id || typeof id !== "string") {
      auditService.logWarning("INVALID_OT_IF_ID", { id });
      return undefined;
    }
    const framework = frameworks.find((f) => f.id === id);
    if (!framework) {
      auditService.logWarning("OT_IF_NOT_FOUND", { id });
    }
    return framework;
  } catch (error) {
    auditService.logError("GET_OT_IF_ERROR", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

export function getAllOTInterventionFrameworks(): OTInterventionFramework[] {
  try {
    return [...frameworks];
  } catch (error) {
    auditService.logError("GET_ALL_OT_IF_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTInterventionFrameworksByCategory(
  category: string,
): OTInterventionFramework[] {
  try {
    if (!category || typeof category !== "string") {
      auditService.logWarning("INVALID_OT_IF_CATEGORY", { category });
      return [];
    }
    return frameworks.filter((f) =>
      f.category.toLowerCase().includes(category.toLowerCase()),
    );
  } catch (error) {
    auditService.logError("GET_OT_IF_BY_CATEGORY_ERROR", {
      category,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function searchOTInterventionFrameworks(
  query: string,
): OTInterventionFramework[] {
  try {
    if (!query || typeof query !== "string") {
      auditService.logWarning("INVALID_OT_IF_SEARCH", { query });
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
    auditService.logError("SEARCH_OT_IF_ERROR", {
      query,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTInterventionFrameworksByEvidenceLevel(
  level: 1 | 2 | 3,
): OTInterventionFramework[] {
  try {
    if (![1, 2, 3].includes(level)) {
      auditService.logWarning("INVALID_OT_IF_EVIDENCE_LEVEL", { level });
      return [];
    }
    return frameworks.filter((f) => f.evidenceLevel === level);
  } catch (error) {
    auditService.logError("GET_OT_IF_BY_EVIDENCE_ERROR", {
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
    const framework = getOTInterventionFrameworkById(frameworkId);
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

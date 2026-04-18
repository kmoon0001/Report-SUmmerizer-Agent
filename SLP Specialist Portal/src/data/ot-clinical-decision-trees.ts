/**
 * OT Clinical Decision Trees
 * Evidence-based decision-making frameworks for complex occupational scenarios
 */

import { auditService } from "../core/audit/AuditService";

export interface OTDecisionTree {
  id: string;
  name: string;
  category: string;
  description: string;
  clinicalScenario: string[];
  decisionPoints: string[];
  diagnosticConsiderations: string[];
  interventionOptions: string[];
  outcomeIndicators: string[];
  redFlags: string[];
  evidenceLevel: 1 | 2 | 3;
  source: string;
  citation: string;
  lastUpdated: Date;
}

const trees: OTDecisionTree[] = [
  {
    id: "ot-dt-001",
    name: "ADL Dependence & Adaptation Decision Tree",
    category: "Functional Decision-Making",
    description:
      "Decision framework for ADL assessment and adaptation including self-care, mobility, and community participation",
    clinicalScenario: [
      "Mild ADL dependence",
      "Moderate ADL dependence",
      "Severe ADL dependence",
      "Safety concerns",
      "Caregiver burden",
    ],
    decisionPoints: [
      "Functional level",
      "Safety status",
      "Cognitive status",
      "Caregiver availability",
      "Environmental factors",
    ],
    diagnosticConsiderations: [
      "Physical vs cognitive barriers",
      "Safety vs independence",
      "Adaptation vs training",
      "Caregiver capacity",
      "Environmental modification",
    ],
    interventionOptions: [
      "ADL retraining",
      "Adaptive equipment",
      "Environmental modification",
      "Caregiver training",
      "Assistive technology",
    ],
    outcomeIndicators: [
      "Improved independence",
      "Enhanced safety",
      "Reduced caregiver burden",
      "Improved participation",
      "Quality of life",
    ],
    redFlags: [
      "Severe safety risk",
      "Severe cognitive decline",
      "Caregiver burnout",
      "Aspiration risk",
      "Severe dependence",
    ],
    evidenceLevel: 1,
    source: "AOTA Functional Assessment Guidelines & ADL Research",
    citation: "AOTA (2024). ADL Decision-Making.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-dt-002",
    name: "Sensory Processing & Occupational Engagement Decision Tree",
    category: "Sensory Decision-Making",
    description:
      "Decision framework for sensory processing issues and occupational engagement including sensory diet and environmental modification",
    clinicalScenario: [
      "Sensory hypersensitivity",
      "Sensory hyposensitivity",
      "Sensory seeking",
      "Sensory avoidance",
      "Mixed sensory patterns",
    ],
    decisionPoints: [
      "Sensory profile",
      "Occupational impact",
      "Environmental factors",
      "Behavioral response",
      "Functional outcome",
    ],
    diagnosticConsiderations: [
      "Sensory processing disorder",
      "Autism spectrum",
      "ADHD",
      "Anxiety",
      "Environmental mismatch",
    ],
    interventionOptions: [
      "Sensory diet",
      "Environmental modification",
      "Sensory integration",
      "Behavioral strategies",
      "Occupational adaptation",
    ],
    outcomeIndicators: [
      "Improved sensory regulation",
      "Increased occupational engagement",
      "Reduced behavioral issues",
      "Improved participation",
      "Enhanced learning",
    ],
    redFlags: [
      "Severe sensory defensiveness",
      "Severe behavioral disturbance",
      "Self-injurious behavior",
      "Aggression",
      "School refusal",
    ],
    evidenceLevel: 1,
    source: "AOTA Sensory Processing Guidelines & Sensory Integration Research",
    citation: "AOTA (2024). Sensory Decision-Making.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-dt-003",
    name: "Occupational Role & Identity Decision Tree",
    category: "Psychosocial Decision-Making",
    description:
      "Decision framework for occupational role loss and identity disruption including role exploration and reestablishment",
    clinicalScenario: [
      "Role loss",
      "Identity disruption",
      "Occupational dysfunction",
      "Participation restriction",
      "Meaning loss",
    ],
    decisionPoints: [
      "Role status",
      "Identity impact",
      "Occupational capacity",
      "Psychosocial readiness",
      "Environmental support",
    ],
    diagnosticConsiderations: [
      "Role loss vs role change",
      "Identity disruption",
      "Occupational dysfunction",
      "Psychosocial adjustment",
      "Meaning and purpose",
    ],
    interventionOptions: [
      "Role exploration",
      "Occupational adaptation",
      "Skill development",
      "Psychosocial support",
      "Community reintegration",
    ],
    outcomeIndicators: [
      "Role reestablishment",
      "Identity reconstruction",
      "Occupational engagement",
      "Improved participation",
      "Enhanced meaning",
    ],
    redFlags: [
      "Severe depression",
      "Suicidal ideation",
      "Severe occupational dysfunction",
      "Complete social isolation",
      "Severe identity loss",
    ],
    evidenceLevel: 1,
    source: "AOTA Psychosocial Guidelines & Occupational Identity Research",
    citation: "AOTA (2024). Occupational Role Decision-Making.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-dt-004",
    name: "Cognitive-Perceptual Deficit & Compensation Decision Tree",
    category: "Cognitive Decision-Making",
    description:
      "Decision framework for cognitive-perceptual deficits including assessment, remediation, and compensation strategies",
    clinicalScenario: [
      "Attention deficit",
      "Memory deficit",
      "Executive dysfunction",
      "Perceptual deficit",
      "Mixed cognitive deficits",
    ],
    decisionPoints: [
      "Cognitive domain",
      "Severity level",
      "Functional impact",
      "Remediation potential",
      "Compensation feasibility",
    ],
    diagnosticConsiderations: [
      "Specific cognitive deficit",
      "Functional impact",
      "Remediation vs compensation",
      "Environmental factors",
      "Psychosocial factors",
    ],
    interventionOptions: [
      "Cognitive remediation",
      "Compensatory strategies",
      "Environmental modification",
      "Assistive technology",
      "Occupational adaptation",
    ],
    outcomeIndicators: [
      "Improved cognitive function",
      "Enhanced occupational performance",
      "Increased independence",
      "Improved participation",
      "Quality of life",
    ],
    redFlags: [
      "Severe cognitive decline",
      "Safety risk",
      "Severe functional impairment",
      "Severe behavioral disturbance",
      "Severe depression",
    ],
    evidenceLevel: 1,
    source:
      "AOTA Cognitive-Perceptual Guidelines & Cognitive Rehabilitation Research",
    citation: "AOTA (2024). Cognitive-Perceptual Decision-Making.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "ot-dt-005",
    name: "Work Capacity & Return-to-Work Decision Tree",
    category: "Vocational Decision-Making",
    description:
      "Decision framework for work capacity assessment and return-to-work planning including job analysis and accommodation",
    clinicalScenario: [
      "Early return-to-work",
      "Modified duty",
      "Transitional work",
      "Job accommodation",
      "Vocational change",
    ],
    decisionPoints: [
      "Work capacity",
      "Job demands",
      "Accommodation feasibility",
      "Employer support",
      "Worker readiness",
    ],
    diagnosticConsiderations: [
      "Physical capacity",
      "Cognitive capacity",
      "Psychosocial readiness",
      "Job match",
      "Accommodation needs",
    ],
    interventionOptions: [
      "Work conditioning",
      "Job modification",
      "Accommodation planning",
      "Skill development",
      "Vocational counseling",
    ],
    outcomeIndicators: [
      "Successful return-to-work",
      "Job retention",
      "Improved work performance",
      "Reduced disability",
      "Enhanced quality of life",
    ],
    redFlags: [
      "Severe work incapacity",
      "Severe pain",
      "Severe cognitive impairment",
      "Severe psychological distress",
      "Employer resistance",
    ],
    evidenceLevel: 1,
    source: "AOTA Vocational Guidelines & Work Rehabilitation Research",
    citation: "AOTA (2024). Work Capacity Decision-Making.",
    lastUpdated: new Date("2024-01-15"),
  },
];

export function getOTDecisionTreeById(id: string): OTDecisionTree | undefined {
  try {
    if (!id || typeof id !== "string") {
      auditService.logWarning("INVALID_OT_DT_ID", { id });
      return undefined;
    }
    const tree = trees.find((t) => t.id === id);
    if (!tree) {
      auditService.logWarning("OT_DT_NOT_FOUND", { id });
    }
    return tree;
  } catch (error) {
    auditService.logError("GET_OT_DT_ERROR", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

export function getAllOTDecisionTrees(): OTDecisionTree[] {
  try {
    return [...trees];
  } catch (error) {
    auditService.logError("GET_ALL_OT_DT_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTDecisionTreesByCategory(
  category: string,
): OTDecisionTree[] {
  try {
    if (!category || typeof category !== "string") {
      auditService.logWarning("INVALID_OT_DT_CATEGORY", { category });
      return [];
    }
    return trees.filter((t) =>
      t.category.toLowerCase().includes(category.toLowerCase()),
    );
  } catch (error) {
    auditService.logError("GET_OT_DT_BY_CATEGORY_ERROR", {
      category,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function searchOTDecisionTrees(query: string): OTDecisionTree[] {
  try {
    if (!query || typeof query !== "string") {
      auditService.logWarning("INVALID_OT_DT_SEARCH", { query });
      return [];
    }
    const lowerQuery = query.toLowerCase();
    return trees.filter(
      (t) =>
        t.name.toLowerCase().includes(lowerQuery) ||
        t.category.toLowerCase().includes(lowerQuery) ||
        t.description.toLowerCase().includes(lowerQuery),
    );
  } catch (error) {
    auditService.logError("SEARCH_OT_DT_ERROR", {
      query,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTDecisionTreesByEvidenceLevel(
  level: 1 | 2 | 3,
): OTDecisionTree[] {
  try {
    if (![1, 2, 3].includes(level)) {
      auditService.logWarning("INVALID_OT_DT_EVIDENCE_LEVEL", { level });
      return [];
    }
    return trees.filter((t) => t.evidenceLevel === level);
  } catch (error) {
    auditService.logError("GET_OT_DT_BY_EVIDENCE_ERROR", {
      level,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getDecisionPoints(): string[] {
  try {
    const points = new Set<string>();
    trees.forEach((t) => t.decisionPoints.forEach((p) => points.add(p)));
    return Array.from(points).sort();
  } catch (error) {
    auditService.logError("GET_DECISION_POINTS_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function validateDecisionPath(
  treeId: string,
  scenario: string,
): { valid: boolean; message: string } {
  try {
    const tree = getOTDecisionTreeById(treeId);
    if (!tree) return { valid: false, message: "Tree not found" };
    if (!scenario || typeof scenario !== "string")
      return { valid: false, message: "Scenario must be a string" };
    const hasScenario = tree.clinicalScenario.some((s) =>
      s.toLowerCase().includes(scenario.toLowerCase()),
    );
    return {
      valid: hasScenario,
      message: hasScenario ? "Scenario found" : "Scenario not found",
    };
  } catch (error) {
    auditService.logError("VALIDATE_DECISION_PATH_ERROR", {
      treeId,
      scenario,
      error: error instanceof Error ? error.message : String(error),
    });
    return { valid: false, message: "Validation error" };
  }
}

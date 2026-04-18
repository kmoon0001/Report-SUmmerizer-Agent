/**
 * PT Clinical Decision Trees
 * Evidence-based decision-making frameworks for complex clinical scenarios
 */

import { auditService } from "../core/audit/AuditService";

export interface PTDecisionTree {
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

const trees: PTDecisionTree[] = [
  {
    id: "pt-dt-001",
    name: "Acute Neurological Presentation Decision Tree",
    category: "Neurological Decision-Making",
    description:
      "Decision framework for acute neurological presentations including stroke, TBI, and spinal cord injury",
    clinicalScenario: [
      "Acute onset weakness",
      "Acute onset sensory changes",
      "Acute onset balance loss",
      "Acute onset speech changes",
      "Acute onset cognitive changes",
    ],
    decisionPoints: [
      "Onset timing",
      "Symptom distribution",
      "Associated symptoms",
      "Vital sign changes",
      "Consciousness level",
    ],
    diagnosticConsiderations: [
      "Stroke vs TBI vs SCI",
      "Central vs peripheral",
      "Upper vs lower motor neuron",
      "Acute vs chronic",
      "Medical emergency vs rehabilitation",
    ],
    interventionOptions: [
      "Acute medical management",
      "Acute rehabilitation",
      "Subacute rehabilitation",
      "Chronic rehabilitation",
      "Preventive strategies",
    ],
    outcomeIndicators: [
      "Neurological recovery",
      "Functional improvement",
      "Safety achievement",
      "Participation restoration",
      "Quality of life",
    ],
    redFlags: [
      "Deteriorating consciousness",
      "Respiratory compromise",
      "Cardiovascular instability",
      "Severe pain",
      "Acute medical change",
    ],
    evidenceLevel: 1,
    source: "APTA Neurological Guidelines & Acute Care Protocols",
    citation: "APTA (2024). Acute Neurological Decision-Making.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-dt-002",
    name: "Chronic Pain Management Decision Tree",
    category: "Pain Management Decision-Making",
    description:
      "Decision framework for chronic pain including assessment, classification, and management strategy selection",
    clinicalScenario: [
      "Localized pain",
      "Widespread pain",
      "Neuropathic pain",
      "Psychogenic pain",
      "Mixed pain",
    ],
    decisionPoints: [
      "Pain duration",
      "Pain distribution",
      "Pain quality",
      "Psychosocial factors",
      "Functional impact",
    ],
    diagnosticConsiderations: [
      "Nociceptive vs neuropathic",
      "Central sensitization",
      "Psychosocial contribution",
      "Medication effects",
      "Deconditioning",
    ],
    interventionOptions: [
      "Pain neuroscience education",
      "Graded exercise",
      "Cognitive-behavioral therapy",
      "Mindfulness-based approaches",
      "Interdisciplinary management",
    ],
    outcomeIndicators: [
      "Pain reduction",
      "Functional improvement",
      "Psychological adjustment",
      "Activity tolerance",
      "Quality of life",
    ],
    redFlags: [
      "Suicidal ideation",
      "Severe medication dependency",
      "Untreated mental health",
      "Substance abuse",
      "Severe deconditioning",
    ],
    evidenceLevel: 1,
    source: "APTA Pain Management Guidelines & Biopsychosocial Research",
    citation: "APTA (2024). Chronic Pain Decision-Making.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-dt-003",
    name: "Post-Surgical Rehabilitation Decision Tree",
    category: "Orthopedic Decision-Making",
    description:
      "Decision framework for post-surgical rehabilitation including timing, progression, and complication management",
    clinicalScenario: [
      "Early post-operative",
      "Mid-stage rehabilitation",
      "Late-stage rehabilitation",
      "Complications present",
      "Delayed recovery",
    ],
    decisionPoints: [
      "Time since surgery",
      "Tissue healing stage",
      "Pain level",
      "ROM status",
      "Strength status",
    ],
    diagnosticConsiderations: [
      "Tissue healing timeline",
      "Infection risk",
      "Stiffness risk",
      "Weakness risk",
      "Psychological factors",
    ],
    interventionOptions: [
      "Protection & rest",
      "Gentle ROM",
      "Progressive strengthening",
      "Functional training",
      "Sport-specific training",
    ],
    outcomeIndicators: [
      "ROM restoration",
      "Strength recovery",
      "Functional return",
      "Sport return",
      "Psychological confidence",
    ],
    redFlags: [
      "Signs of infection",
      "Excessive swelling",
      "Severe pain",
      "Neurological changes",
      "Vascular compromise",
    ],
    evidenceLevel: 1,
    source: "APTA Orthopedic Guidelines & Post-Surgical Protocols",
    citation: "APTA (2024). Post-Surgical Decision-Making.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-dt-004",
    name: "Fall Risk Management Decision Tree",
    category: "Geriatric Decision-Making",
    description:
      "Decision framework for fall risk assessment and management in older adults",
    clinicalScenario: [
      "Recent fall",
      "Fall risk factors present",
      "Fear of falling",
      "Recurrent falls",
      "Fall with injury",
    ],
    decisionPoints: [
      "Fall history",
      "Balance status",
      "Gait quality",
      "Medication effects",
      "Environmental factors",
    ],
    diagnosticConsiderations: [
      "Intrinsic vs extrinsic factors",
      "Medical causes",
      "Medication effects",
      "Environmental hazards",
      "Psychological factors",
    ],
    interventionOptions: [
      "Balance training",
      "Strength training",
      "Gait training",
      "Home modification",
      "Assistive device prescription",
    ],
    outcomeIndicators: [
      "Improved balance",
      "Safer gait",
      "Reduced fall risk",
      "Maintained independence",
      "Improved confidence",
    ],
    redFlags: [
      "Recent fall with injury",
      "Severe osteoporosis",
      "Syncope",
      "Severe cognitive decline",
      "Severe deconditioning",
    ],
    evidenceLevel: 1,
    source: "APTA Geriatrics Guidelines & Fall Prevention Research",
    citation: "APTA (2024). Fall Risk Decision-Making.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-dt-005",
    name: "Cardiopulmonary Exercise Progression Decision Tree",
    category: "Cardiopulmonary Decision-Making",
    description:
      "Decision framework for exercise progression in cardiac and pulmonary rehabilitation",
    clinicalScenario: [
      "Early cardiac rehab",
      "Mid-stage cardiac rehab",
      "Late-stage cardiac rehab",
      "Pulmonary dysfunction",
      "Combined dysfunction",
    ],
    decisionPoints: [
      "Cardiac status",
      "Exercise tolerance",
      "Vital sign response",
      "Symptom response",
      "Psychological readiness",
    ],
    diagnosticConsiderations: [
      "Cardiac function",
      "Pulmonary function",
      "Deconditioning",
      "Anxiety",
      "Medication effects",
    ],
    interventionOptions: [
      "Aerobic training",
      "Resistance training",
      "Breathing strategies",
      "Anxiety management",
      "Psychosocial support",
    ],
    outcomeIndicators: [
      "Improved exercise tolerance",
      "Improved cardiac function",
      "Reduced dyspnea",
      "Reduced anxiety",
      "Return to activities",
    ],
    redFlags: [
      "Chest pain",
      "Severe dyspnea",
      "Arrhythmias",
      "Syncope",
      "Severe anxiety",
    ],
    evidenceLevel: 1,
    source: "APTA Cardiopulmonary Guidelines & Cardiac Rehabilitation Research",
    citation: "APTA (2024). Cardiopulmonary Decision-Making.",
    lastUpdated: new Date("2024-01-15"),
  },
];

export function getPTDecisionTreeById(id: string): PTDecisionTree | undefined {
  try {
    if (!id || typeof id !== "string") {
      auditService.logWarning("INVALID_PT_DT_ID", { id });
      return undefined;
    }
    const tree = trees.find((t) => t.id === id);
    if (!tree) {
      auditService.logWarning("PT_DT_NOT_FOUND", { id });
    }
    return tree;
  } catch (error) {
    auditService.logError("GET_PT_DT_ERROR", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

export function getAllPTDecisionTrees(): PTDecisionTree[] {
  try {
    return [...trees];
  } catch (error) {
    auditService.logError("GET_ALL_PT_DT_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getPTDecisionTreesByCategory(
  category: string,
): PTDecisionTree[] {
  try {
    if (!category || typeof category !== "string") {
      auditService.logWarning("INVALID_PT_DT_CATEGORY", { category });
      return [];
    }
    return trees.filter((t) =>
      t.category.toLowerCase().includes(category.toLowerCase()),
    );
  } catch (error) {
    auditService.logError("GET_PT_DT_BY_CATEGORY_ERROR", {
      category,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function searchPTDecisionTrees(query: string): PTDecisionTree[] {
  try {
    if (!query || typeof query !== "string") {
      auditService.logWarning("INVALID_PT_DT_SEARCH", { query });
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
    auditService.logError("SEARCH_PT_DT_ERROR", {
      query,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getPTDecisionTreesByEvidenceLevel(
  level: 1 | 2 | 3,
): PTDecisionTree[] {
  try {
    if (![1, 2, 3].includes(level)) {
      auditService.logWarning("INVALID_PT_DT_EVIDENCE_LEVEL", { level });
      return [];
    }
    return trees.filter((t) => t.evidenceLevel === level);
  } catch (error) {
    auditService.logError("GET_PT_DT_BY_EVIDENCE_ERROR", {
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
    const tree = getPTDecisionTreeById(treeId);
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

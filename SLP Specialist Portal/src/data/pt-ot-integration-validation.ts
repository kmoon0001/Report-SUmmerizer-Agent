/**
 * PT-OT Integration - Validation & Quality Assurance
 */

import { auditService } from "../core/audit/AuditService";

export interface ValidationCriteria {
  id: string;
  name: string;
  category: string;
  description: string;
  validationPoints: string[];
  qualityMetrics: string[];
  outcomeIndicators: string[];
  complianceRequirements: string[];
  evidenceLevel: 1 | 2 | 3;
  source: string;
  citation: string;
  lastUpdated: Date;
}

const criteria: ValidationCriteria[] = [
  {
    id: "val-001",
    name: "Clinical Outcome Validation",
    category: "Outcome Measurement",
    description:
      "Validation of clinical outcomes using standardized measures and functional assessments",
    validationPoints: [
      "Baseline assessment",
      "Mid-point evaluation",
      "Discharge assessment",
      "Follow-up assessment",
      "Long-term outcomes",
    ],
    qualityMetrics: [
      "Functional improvement",
      "Patient satisfaction",
      "Goal achievement",
      "Return to activity",
      "Quality of life",
    ],
    outcomeIndicators: [
      "ROM improvement",
      "Strength gains",
      "Functional mobility",
      "ADL/IADL independence",
      "Community participation",
    ],
    complianceRequirements: [
      "Documentation standards",
      "Measurement reliability",
      "Validity evidence",
      "Normative data",
      "Sensitivity/specificity",
    ],
    evidenceLevel: 1,
    source: "APTA/AOTA",
    citation: "APTA/AOTA (2020). Outcome Measurement Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "val-002",
    name: "Patient Safety Validation",
    category: "Safety & Risk Management",
    description:
      "Validation of patient safety protocols and adverse event prevention",
    validationPoints: [
      "Pre-treatment screening",
      "Contraindication assessment",
      "Vital sign monitoring",
      "Adverse event tracking",
      "Incident reporting",
    ],
    qualityMetrics: [
      "Adverse event rate",
      "Near-miss incidents",
      "Patient safety culture",
      "Compliance rate",
      "Risk mitigation effectiveness",
    ],
    outcomeIndicators: [
      "Zero serious adverse events",
      "Reduced minor incidents",
      "Improved safety awareness",
      "Enhanced communication",
      "Proactive risk management",
    ],
    complianceRequirements: [
      "Safety protocols",
      "Incident documentation",
      "Risk assessment",
      "Staff training",
      "Regulatory compliance",
    ],
    evidenceLevel: 1,
    source: "APTA/AOTA",
    citation: "APTA/AOTA (2020). Patient Safety Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "val-003",
    name: "Evidence-Based Practice Validation",
    category: "Evidence & Research",
    description:
      "Validation of evidence-based practice implementation and research integration",
    validationPoints: [
      "Literature review",
      "Evidence appraisal",
      "Practice guideline adherence",
      "Outcome tracking",
      "Research dissemination",
    ],
    qualityMetrics: [
      "Guideline compliance",
      "Evidence utilization",
      "Research integration",
      "Best practice adoption",
      "Continuous improvement",
    ],
    outcomeIndicators: [
      "Improved outcomes",
      "Reduced variation",
      "Enhanced efficiency",
      "Cost-effectiveness",
      "Patient satisfaction",
    ],
    complianceRequirements: [
      "Evidence standards",
      "Guideline adherence",
      "Documentation",
      "Staff competency",
      "Quality improvement",
    ],
    evidenceLevel: 1,
    source: "APTA/AOTA",
    citation: "APTA/AOTA (2020). Evidence-Based Practice Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "val-004",
    name: "Interdisciplinary Collaboration Validation",
    category: "Team & Communication",
    description:
      "Validation of effective interdisciplinary collaboration and communication",
    validationPoints: [
      "Team communication",
      "Goal alignment",
      "Care coordination",
      "Conflict resolution",
      "Shared decision-making",
    ],
    qualityMetrics: [
      "Communication effectiveness",
      "Goal congruence",
      "Care continuity",
      "Team satisfaction",
      "Patient engagement",
    ],
    outcomeIndicators: [
      "Improved outcomes",
      "Reduced duplication",
      "Enhanced efficiency",
      "Patient satisfaction",
      "Team cohesion",
    ],
    complianceRequirements: [
      "Communication protocols",
      "Documentation standards",
      "Team meetings",
      "Conflict resolution",
      "Patient involvement",
    ],
    evidenceLevel: 1,
    source: "APTA/AOTA",
    citation: "APTA/AOTA (2020). Interdisciplinary Collaboration Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "val-005",
    name: "Patient-Centered Care Validation",
    category: "Patient Experience",
    description:
      "Validation of patient-centered care principles and patient satisfaction",
    validationPoints: [
      "Patient preferences",
      "Shared decision-making",
      "Patient education",
      "Satisfaction assessment",
      "Experience feedback",
    ],
    qualityMetrics: [
      "Patient satisfaction",
      "Goal achievement",
      "Adherence rate",
      "Patient engagement",
      "Experience scores",
    ],
    outcomeIndicators: [
      "High satisfaction",
      "Goal attainment",
      "Improved adherence",
      "Enhanced engagement",
      "Positive outcomes",
    ],
    complianceRequirements: [
      "Patient involvement",
      "Preference documentation",
      "Education standards",
      "Feedback collection",
      "Continuous improvement",
    ],
    evidenceLevel: 1,
    source: "APTA/AOTA",
    citation: "APTA/AOTA (2020). Patient-Centered Care Guidelines.",
    lastUpdated: new Date("2024-01-15"),
  },
];

export function getValidationCriteriaById(
  id: string,
): ValidationCriteria | undefined {
  try {
    if (!id || typeof id !== "string") {
      auditService.logWarning("INVALID_VALIDATION_ID", { id });
      return undefined;
    }
    const criterion = criteria.find((c) => c.id === id);
    if (!criterion) {
      auditService.logWarning("VALIDATION_NOT_FOUND", { id });
    }
    return criterion;
  } catch (error) {
    auditService.logError("GET_VALIDATION_ERROR", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

export function getAllValidationCriteria(): ValidationCriteria[] {
  try {
    return [...criteria];
  } catch (error) {
    auditService.logError("GET_ALL_VALIDATION_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getValidationCriteriaByCategory(
  category: string,
): ValidationCriteria[] {
  try {
    if (!category || typeof category !== "string") {
      auditService.logWarning("INVALID_VALIDATION_CATEGORY", { category });
      return [];
    }
    return criteria.filter((c) =>
      c.category.toLowerCase().includes(category.toLowerCase()),
    );
  } catch (error) {
    auditService.logError("GET_VALIDATION_BY_CATEGORY_ERROR", {
      category,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function searchValidationCriteria(query: string): ValidationCriteria[] {
  try {
    if (!query || typeof query !== "string") {
      auditService.logWarning("INVALID_VALIDATION_SEARCH", { query });
      return [];
    }
    const lowerQuery = query.toLowerCase();
    return criteria.filter(
      (c) =>
        c.name.toLowerCase().includes(lowerQuery) ||
        c.category.toLowerCase().includes(lowerQuery) ||
        c.description.toLowerCase().includes(lowerQuery),
    );
  } catch (error) {
    auditService.logError("SEARCH_VALIDATION_ERROR", {
      query,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getValidationCriteriaByEvidenceLevel(
  level: 1 | 2 | 3,
): ValidationCriteria[] {
  try {
    if (![1, 2, 3].includes(level)) {
      auditService.logWarning("INVALID_VALIDATION_EVIDENCE_LEVEL", { level });
      return [];
    }
    return criteria.filter((c) => c.evidenceLevel === level);
  } catch (error) {
    auditService.logError("GET_VALIDATION_BY_EVIDENCE_ERROR", {
      level,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getQualityMetrics(): string[] {
  try {
    const metrics = new Set<string>();
    criteria.forEach((c) => c.qualityMetrics.forEach((m) => metrics.add(m)));
    return Array.from(metrics).sort();
  } catch (error) {
    auditService.logError("GET_QUALITY_METRICS_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function validateOutcomeIndicator(
  criteriaId: string,
  indicator: string,
): { valid: boolean; message: string } {
  try {
    const criterion = getValidationCriteriaById(criteriaId);
    if (!criterion) return { valid: false, message: "Criteria not found" };
    if (!indicator || typeof indicator !== "string")
      return { valid: false, message: "Indicator must be a string" };
    const hasIndicator = criterion.outcomeIndicators.some((i) =>
      i.toLowerCase().includes(indicator.toLowerCase()),
    );
    return {
      valid: hasIndicator,
      message: hasIndicator ? "Indicator found" : "Indicator not found",
    };
  } catch (error) {
    auditService.logError("VALIDATE_OUTCOME_INDICATOR_ERROR", {
      criteriaId,
      indicator,
      error: error instanceof Error ? error.message : String(error),
    });
    return { valid: false, message: "Validation error" };
  }
}

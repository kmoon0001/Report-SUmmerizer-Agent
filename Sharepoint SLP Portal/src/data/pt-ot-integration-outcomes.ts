/**
 * PT-OT Integration - Comprehensive Outcomes Framework
 */

import { auditService } from "../core/audit/AuditService";

export interface OutcomeFramework {
  id: string;
  name: string;
  category: string;
  description: string;
  measurementTools: string[];
  timepoints: string[];
  successCriteria: string[];
  reportingMetrics: string[];
  evidenceLevel: 1 | 2 | 3;
  source: string;
  citation: string;
  lastUpdated: Date;
}

const frameworks: OutcomeFramework[] = [
  {
    id: "out-001",
    name: "Functional Independence Outcomes",
    category: "Functional Status",
    description:
      "Comprehensive measurement of functional independence across ADL/IADL and mobility domains",
    measurementTools: [
      "FIM",
      "KATZ ADL Scale",
      "Lawton IADL Scale",
      "Functional Mobility Assessment",
      "Timed Up and Go",
    ],
    timepoints: [
      "Baseline",
      "2 weeks",
      "4 weeks",
      "8 weeks",
      "Discharge",
      "3-month follow-up",
    ],
    successCriteria: [
      "Improved FIM scores",
      "Increased independence",
      "Reduced assistance needs",
      "Enhanced safety",
      "Community participation",
    ],
    reportingMetrics: [
      "FIM gain",
      "Efficiency rate",
      "Discharge disposition",
      "Goal achievement",
      "Patient satisfaction",
    ],
    evidenceLevel: 1,
    source: "APTA/AOTA",
    citation: "APTA/AOTA (2020). Functional Outcomes Framework.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "out-002",
    name: "Quality of Life Outcomes",
    category: "Patient Experience",
    description:
      "Comprehensive measurement of quality of life and patient satisfaction",
    measurementTools: [
      "SF-36",
      "EQ-5D",
      "WHOQOL",
      "Patient Satisfaction Survey",
      "Goal Attainment Scaling",
    ],
    timepoints: [
      "Baseline",
      "4 weeks",
      "8 weeks",
      "Discharge",
      "3-month follow-up",
      "6-month follow-up",
    ],
    successCriteria: [
      "Improved QOL scores",
      "High satisfaction",
      "Goal achievement",
      "Enhanced well-being",
      "Positive experience",
    ],
    reportingMetrics: [
      "QOL improvement",
      "Satisfaction score",
      "Goal attainment",
      "Experience rating",
      "Recommendation rate",
    ],
    evidenceLevel: 1,
    source: "APTA/AOTA",
    citation: "APTA/AOTA (2020). Quality of Life Outcomes Framework.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "out-003",
    name: "Return to Activity Outcomes",
    category: "Functional Recovery",
    description:
      "Comprehensive measurement of return to work, leisure, and community activities",
    measurementTools: [
      "Work Capacity Evaluation",
      "Leisure Activity Assessment",
      "Community Participation Scale",
      "Return to Work Questionnaire",
      "Activity Tolerance Test",
    ],
    timepoints: [
      "Baseline",
      "4 weeks",
      "8 weeks",
      "Discharge",
      "3-month follow-up",
      "6-month follow-up",
    ],
    successCriteria: [
      "Return to work",
      "Leisure participation",
      "Community engagement",
      "Activity tolerance",
      "Sustained participation",
    ],
    reportingMetrics: [
      "Return to work rate",
      "Activity participation",
      "Community engagement",
      "Sustained outcomes",
      "Long-term success",
    ],
    evidenceLevel: 1,
    source: "APTA/AOTA",
    citation: "APTA/AOTA (2020). Return to Activity Outcomes Framework.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "out-004",
    name: "Clinical Efficiency Outcomes",
    category: "Healthcare Delivery",
    description:
      "Comprehensive measurement of clinical efficiency and resource utilization",
    measurementTools: [
      "Length of Stay",
      "Visit Frequency",
      "Cost Analysis",
      "Readmission Rate",
      "Complication Rate",
    ],
    timepoints: [
      "Admission",
      "Mid-point",
      "Discharge",
      "30-day follow-up",
      "90-day follow-up",
    ],
    successCriteria: [
      "Optimal LOS",
      "Efficient visits",
      "Cost-effectiveness",
      "Low readmission",
      "Minimal complications",
    ],
    reportingMetrics: [
      "LOS comparison",
      "Visit efficiency",
      "Cost per outcome",
      "Readmission rate",
      "Complication rate",
    ],
    evidenceLevel: 1,
    source: "APTA/AOTA",
    citation: "APTA/AOTA (2020). Clinical Efficiency Outcomes Framework.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "out-005",
    name: "Safety & Adverse Event Outcomes",
    category: "Patient Safety",
    description:
      "Comprehensive measurement of patient safety and adverse event prevention",
    measurementTools: [
      "Adverse Event Log",
      "Near-Miss Report",
      "Safety Culture Survey",
      "Incident Analysis",
      "Risk Assessment",
    ],
    timepoints: [
      "Ongoing monitoring",
      "Weekly review",
      "Monthly analysis",
      "Quarterly report",
      "Annual summary",
    ],
    successCriteria: [
      "Zero serious events",
      "Reduced incidents",
      "Improved safety culture",
      "Proactive prevention",
      "Continuous improvement",
    ],
    reportingMetrics: [
      "Adverse event rate",
      "Near-miss rate",
      "Safety culture score",
      "Prevention effectiveness",
      "Improvement trends",
    ],
    evidenceLevel: 1,
    source: "APTA/AOTA",
    citation: "APTA/AOTA (2020). Safety & Adverse Event Outcomes Framework.",
    lastUpdated: new Date("2024-01-15"),
  },
];

export function getOutcomeFrameworkById(
  id: string,
): OutcomeFramework | undefined {
  try {
    if (!id || typeof id !== "string") {
      auditService.logWarning("INVALID_OUTCOME_ID", { id });
      return undefined;
    }
    const framework = frameworks.find((f) => f.id === id);
    if (!framework) {
      auditService.logWarning("OUTCOME_NOT_FOUND", { id });
    }
    return framework;
  } catch (error) {
    auditService.logError("GET_OUTCOME_ERROR", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

export function getAllOutcomeFrameworks(): OutcomeFramework[] {
  try {
    return [...frameworks];
  } catch (error) {
    auditService.logError("GET_ALL_OUTCOME_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOutcomeFrameworksByCategory(
  category: string,
): OutcomeFramework[] {
  try {
    if (!category || typeof category !== "string") {
      auditService.logWarning("INVALID_OUTCOME_CATEGORY", { category });
      return [];
    }
    return frameworks.filter((f) =>
      f.category.toLowerCase().includes(category.toLowerCase()),
    );
  } catch (error) {
    auditService.logError("GET_OUTCOME_BY_CATEGORY_ERROR", {
      category,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function searchOutcomeFrameworks(query: string): OutcomeFramework[] {
  try {
    if (!query || typeof query !== "string") {
      auditService.logWarning("INVALID_OUTCOME_SEARCH", { query });
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
    auditService.logError("SEARCH_OUTCOME_ERROR", {
      query,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOutcomeFrameworksByEvidenceLevel(
  level: 1 | 2 | 3,
): OutcomeFramework[] {
  try {
    if (![1, 2, 3].includes(level)) {
      auditService.logWarning("INVALID_OUTCOME_EVIDENCE_LEVEL", { level });
      return [];
    }
    return frameworks.filter((f) => f.evidenceLevel === level);
  } catch (error) {
    auditService.logError("GET_OUTCOME_BY_EVIDENCE_ERROR", {
      level,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getMeasurementTools(): string[] {
  try {
    const tools = new Set<string>();
    frameworks.forEach((f) => f.measurementTools.forEach((t) => tools.add(t)));
    return Array.from(tools).sort();
  } catch (error) {
    auditService.logError("GET_MEASUREMENT_TOOLS_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function validateSuccessCriteria(
  frameworkId: string,
  criteria: string,
): { valid: boolean; message: string } {
  try {
    const framework = getOutcomeFrameworkById(frameworkId);
    if (!framework) return { valid: false, message: "Framework not found" };
    if (!criteria || typeof criteria !== "string")
      return { valid: false, message: "Criteria must be a string" };
    const hasCriteria = framework.successCriteria.some((c) =>
      c.toLowerCase().includes(criteria.toLowerCase()),
    );
    return {
      valid: hasCriteria,
      message: hasCriteria ? "Criteria found" : "Criteria not found",
    };
  } catch (error) {
    auditService.logError("VALIDATE_SUCCESS_CRITERIA_ERROR", {
      frameworkId,
      criteria,
      error: error instanceof Error ? error.message : String(error),
    });
    return { valid: false, message: "Validation error" };
  }
}

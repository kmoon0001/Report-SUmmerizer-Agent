/**
 * OT Outcome Measures - Occupational Performance
 * Evidence-based from AOTA and peer-reviewed literature
 */

import { auditService } from "../core/audit/AuditService";

export interface OTOccupationalOutcomeMeasure {
  id: string;
  name: string;
  abbreviation: string;
  description: string;
  itemCount: number;
  scoreRange: { min: number; max: number };
  scoringMethod: string;
  mcid: number;
  mciUnit: string;
  conditions: string[];
  adminTime: string;
  evidenceLevel: 1 | 2 | 3;
  source: string;
  citation: string;
  lastUpdated: Date;
}

const measures: OTOccupationalOutcomeMeasure[] = [
  {
    id: "om-ot-001",
    name: "Canadian Occupational Performance Measure",
    abbreviation: "COPM",
    description:
      "Client-centered measure of occupational performance and satisfaction",
    itemCount: 5,
    scoreRange: { min: 1, max: 10 },
    scoringMethod:
      "Performance and satisfaction scores 1-10; higher scores indicate better performance",
    mcid: 2,
    mciUnit: "points",
    conditions: [
      "Occupational dysfunction",
      "Functional limitation",
      "Rehabilitation outcome",
    ],
    adminTime: "30-40 minutes",
    evidenceLevel: 1,
    source: "AOTA",
    citation:
      "Law, M., et al. (2014). Canadian Occupational Performance Measure (5th ed.). CAOT Publications.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "om-ot-002",
    name: "Assessment of Motor and Process Skills",
    abbreviation: "AMPS",
    description:
      "Observational assessment of motor and process skills during ADL tasks",
    itemCount: 16,
    scoreRange: { min: 0, max: 4 },
    scoringMethod:
      "Logit scores; higher scores indicate better motor and process skills",
    mcid: 0.5,
    mciUnit: "logits",
    conditions: [
      "Motor dysfunction",
      "Process skills deficit",
      "ADL impairment",
    ],
    adminTime: "45-60 minutes",
    evidenceLevel: 1,
    source: "AOTA",
    citation:
      "Fisher, A. G. (2003). AMPS: Assessment of Motor and Process Skills (5th ed.). Three Star Press.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "om-ot-003",
    name: "Kohlman Evaluation of Living Skills",
    abbreviation: "KELS",
    description:
      "Assesses functional living skills in community-dwelling adults",
    itemCount: 17,
    scoreRange: { min: 0, max: 68 },
    scoringMethod: "Sum of items; higher scores indicate better living skills",
    mcid: 5,
    mciUnit: "points",
    conditions: [
      "Living skills deficit",
      "Community integration",
      "Independent living",
    ],
    adminTime: "30-45 minutes",
    evidenceLevel: 2,
    source: "AOTA",
    citation:
      "Kohlman Thomson, L. (1992). The Kohlman Evaluation of Living Skills (3rd ed.). AOTA.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "om-ot-004",
    name: "Katz Adjustment Scale",
    abbreviation: "KTA",
    description:
      "Measures adjustment and social functioning in community settings",
    itemCount: 127,
    scoreRange: { min: 0, max: 127 },
    scoringMethod: "Sum of items; higher scores indicate better adjustment",
    mcid: 10,
    mciUnit: "points",
    conditions: [
      "Social functioning",
      "Community adjustment",
      "Psychosocial outcome",
    ],
    adminTime: "20-30 minutes",
    evidenceLevel: 2,
    source: "AOTA",
    citation:
      "Katz, M. M., & Lyerly, S. B. (1963). Methods for measuring adjustment and social behavior in the community. Psychological Reports, 13(2), 503-535.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "om-ot-005",
    name: "Role Checklist",
    abbreviation: "RC",
    description:
      "Assesses patient participation in various life roles and the value placed on those roles",
    itemCount: 10,
    scoreRange: { min: 0, max: 10 },
    scoringMethod: "Categorical marking of past, present, and future roles",
    mcid: 1,
    mciUnit: "role change",
    conditions: [
      "Role performance",
      "Social participation",
      "Psychosocial rehabilitation",
    ],
    adminTime: "15 minutes",
    evidenceLevel: 2,
    source: "AOTA",
    citation:
      "Oakley, F., et al. (1986). The Role Checklist: development and empirical assessment of reliability. Occupational Therapy Journal of Research, 6, 157-170.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "om-ot-006",
    name: "Occupational Questionnaire",
    abbreviation: "OQ",
    description:
      "Measures activities throughout the day and the individual experience of those activities",
    itemCount: 24,
    scoreRange: { min: 0, max: 100 },
    scoringMethod: "Self-report of 24 hours of activity engagement",
    mcid: 5,
    mciUnit: "percentage",
    conditions: ["Time use", "Occupational balance", "Life satisfaction"],
    adminTime: "20 minutes",
    evidenceLevel: 2,
    source: "MOHO",
    citation:
      "Riopel, N. (1982). Developmental of the Occupational Questionnaire. American Journal of Occupational Therapy, 36, 457-463.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "om-ot-007",
    name: "Assessment of Occupational Functioning",
    abbreviation: "AOF",
    description:
      "Screening tool used to collect personal and environmental information related to occupational therapy",
    itemCount: 10,
    scoreRange: { min: 10, max: 50 },
    scoringMethod: "Sum of items; higher scores indicate better function",
    mcid: 4,
    mciUnit: "points",
    conditions: [
      "Occupational function",
      "Life skills screening",
      "Geriatric assessment",
    ],
    adminTime: "30 minutes",
    evidenceLevel: 2,
    source: "MOHO",
    citation:
      "Watts, J. H., et al. (1986). Assessment of Occupational Functioning: a screening tool for use in long-term care. American Journal of Occupational Therapy, 40, 231-240.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "om-ot-008",
    name: "Model of Human Occupation Screening Tool",
    abbreviation: "MOHOST",
    description:
      "Provides a broad overview of a client's occupational participation",
    itemCount: 24,
    scoreRange: { min: 24, max: 96 },
    scoringMethod:
      "F-A-I-R rating for 24 items; higher scores indicate better participation",
    mcid: 6,
    mciUnit: "points",
    conditions: [
      "Occupational participation",
      "Mental health",
      "Physical disability",
    ],
    adminTime: "20-40 minutes",
    evidenceLevel: 1,
    source: "MOHO",
    citation:
      "Parkinson, S., et al. (2006). User's Manual for Model of Human Occupation Screening Tool (MOHOST). MOHO Clearinghouse.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "om-ot-009",
    name: "Occupational Case Analysis Interview and Rating Scale",
    abbreviation: "OCAIRS",
    description:
      "Semi-structured interview for assessing the extent of occupational participation",
    itemCount: 12,
    scoreRange: { min: 12, max: 48 },
    scoringMethod:
      "Rating of 12 items (1-4 scale); higher scores indicate better participation",
    mcid: 4,
    mciUnit: "points",
    conditions: [
      "Occupational identity",
      "Social environment",
      "Psychosocial assessment",
    ],
    adminTime: "45-60 minutes",
    evidenceLevel: 2,
    source: "MOHO",
    citation:
      "Kaplan, K., & Kielhofner, G. (1989). Occupational Case Analysis Interview and Rating Scale. Slack Inc.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "om-ot-010",
    name: "Occupational Performance History Interview - II",
    abbreviation: "OPHI-II",
    description:
      "Comprehensive historical interview of occupational life history",
    itemCount: 3,
    scoreRange: { min: 1, max: 4 },
    scoringMethod: "Three scales (Identity, Competence, Settings) rated 1-4",
    mcid: 0.5,
    mciUnit: "scale point",
    conditions: ["Occupational life history", "Identity", "Competence"],
    adminTime: "60 minutes",
    evidenceLevel: 1,
    source: "MOHO",
    citation:
      "Kielhofner, G., et al. (1998). A User's Manual for the Occupational Performance History Interview-II (OPHI-II). MOHO Clearinghouse.",
    lastUpdated: new Date("2024-03-21"),
  },
];

export function getOTOccupationalOutcomeMeasureById(
  id: string,
): OTOccupationalOutcomeMeasure | undefined {
  try {
    if (!id || typeof id !== "string") {
      auditService.logWarning("INVALID_OT_OCC_MEASURE_ID", { id });
      return undefined;
    }
    const measure = measures.find((m) => m.id === id);
    if (!measure) {
      auditService.logWarning("OT_OCC_MEASURE_NOT_FOUND", { id });
    }
    return measure;
  } catch (error) {
    auditService.logError("GET_OT_OCC_MEASURE_ERROR", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

export function getAllOTOccupationalOutcomeMeasures(): OTOccupationalOutcomeMeasure[] {
  try {
    return [...measures];
  } catch (error) {
    auditService.logError("GET_ALL_OT_OCC_MEASURES_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTOccupationalOutcomeMeasuresByCondition(
  condition: string,
): OTOccupationalOutcomeMeasure[] {
  try {
    if (!condition || typeof condition !== "string") {
      auditService.logWarning("INVALID_OT_OCC_CONDITION", { condition });
      return [];
    }
    return measures.filter((m) =>
      m.conditions.some((c) =>
        c.toLowerCase().includes(condition.toLowerCase()),
      ),
    );
  } catch (error) {
    auditService.logError("GET_OT_OCC_MEASURES_BY_CONDITION_ERROR", {
      condition,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function searchOTOccupationalOutcomeMeasures(
  query: string,
): OTOccupationalOutcomeMeasure[] {
  try {
    if (!query || typeof query !== "string") {
      auditService.logWarning("INVALID_OT_OCC_SEARCH_QUERY", { query });
      return [];
    }
    const lowerQuery = query.toLowerCase();
    return measures.filter(
      (m) =>
        m.name.toLowerCase().includes(lowerQuery) ||
        m.abbreviation.toLowerCase().includes(lowerQuery) ||
        m.description.toLowerCase().includes(lowerQuery),
    );
  } catch (error) {
    auditService.logError("SEARCH_OT_OCC_MEASURES_ERROR", {
      query,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getOTOccupationalOutcomeMeasuresByEvidenceLevel(
  level: 1 | 2 | 3,
): OTOccupationalOutcomeMeasure[] {
  try {
    if (![1, 2, 3].includes(level)) {
      auditService.logWarning("INVALID_OT_OCC_EVIDENCE_LEVEL", { level });
      return [];
    }
    return measures.filter((m) => m.evidenceLevel === level);
  } catch (error) {
    auditService.logError("GET_OT_OCC_MEASURES_BY_EVIDENCE_ERROR", {
      level,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function calculateOTOccupationalMCIDImprovement(
  baselineScore: number,
  followupScore: number,
  measureId: string,
): { achieved: boolean; improvement: number; mcid: number } | null {
  try {
    const measure = getOTOccupationalOutcomeMeasureById(measureId);
    if (!measure) {
      auditService.logWarning("OT_OCC_MCID_CALCULATION_MEASURE_NOT_FOUND", {
        measureId,
      });
      return null;
    }
    if (
      typeof baselineScore !== "number" ||
      typeof followupScore !== "number"
    ) {
      auditService.logWarning("INVALID_OT_OCC_SCORE_VALUES", {
        baselineScore,
        followupScore,
        measureId,
      });
      return null;
    }
    const improvement = followupScore - baselineScore;
    const achieved = improvement >= measure.mcid;
    auditService.logInfo("OT_OCC_MCID_CALCULATED", {
      measureId,
      improvement,
      mcid: measure.mcid,
      achieved,
    });
    return { achieved, improvement, mcid: measure.mcid };
  } catch (error) {
    auditService.logError("OT_OCC_MCID_CALCULATION_ERROR", {
      baselineScore,
      followupScore,
      measureId,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

export function getOTOccupationalOutcomeMeasureCategories(): string[] {
  try {
    const categories = new Set<string>();
    measures.forEach((m) => m.conditions.forEach((c) => categories.add(c)));
    return Array.from(categories).sort();
  } catch (error) {
    auditService.logError("GET_OT_OCC_CATEGORIES_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function validateOTOccupationalOutcomeMeasureScore(
  measureId: string,
  score: number,
): { valid: boolean; message: string } {
  try {
    const measure = getOTOccupationalOutcomeMeasureById(measureId);
    if (!measure) return { valid: false, message: "Measure not found" };
    if (typeof score !== "number")
      return { valid: false, message: "Score must be a number" };
    if (score < measure.scoreRange.min || score > measure.scoreRange.max) {
      return {
        valid: false,
        message: `Score must be between ${measure.scoreRange.min} and ${measure.scoreRange.max}`,
      };
    }
    return { valid: true, message: "Score is valid" };
  } catch (error) {
    auditService.logError("VALIDATE_OT_OCC_SCORE_ERROR", {
      measureId,
      score,
      error: error instanceof Error ? error.message : String(error),
    });
    return { valid: false, message: "Validation error" };
  }
}

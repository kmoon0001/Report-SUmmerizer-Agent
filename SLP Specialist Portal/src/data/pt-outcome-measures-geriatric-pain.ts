/**
 * PT Outcome Measures - Geriatric & Pain
 *
 * Standardized outcome measures for geriatric and pain-related conditions
 * Evidence-based from APTA Clinical Practice Guidelines and peer-reviewed literature
 *
 * Measures included:
 * - Barthel Index
 * - Katz Index
 * - Tinetti Balance & Gait Assessment
 * - VAS (Visual Analog Scale)
 * - NPRS (Numeric Pain Rating Scale)
 * - PCS (Pain Catastrophizing Scale)
 * - SF-36 (Short Form 36)
 * - EQ-5D (EuroQol 5 Dimensions)
 * - GDS-15 (Geriatric Depression Scale)
 * - TUG (Timed Up and Go)
 * - 6MWT (6-Minute Walk Test)
 * - BBS (Berg Balance Scale)
 * - ABC Scale (Activities-specific Balance Confidence)
 * - DGI (Dynamic Gait Index)
 * - PROMIS (Patient-Reported Outcomes Measurement Information System) - Physical Function
 */

import { auditService } from "../core/audit/AuditService";

export interface GeriatricPainOutcomeMeasure {
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

const barthelMeasure: GeriatricPainOutcomeMeasure = {
  id: "om-pt-016",
  name: "Barthel Index",
  abbreviation: "BI",
  description:
    "Measures independence in activities of daily living for geriatric patients",
  itemCount: 10,
  scoreRange: { min: 0, max: 100 },
  scoringMethod:
    "Sum of weighted items; higher scores indicate greater independence",
  mcid: 5,
  mciUnit: "points",
  conditions: [
    "ADL dysfunction",
    "Geriatric assessment",
    "Post-stroke recovery",
    "Mobility limitation",
  ],
  adminTime: "5-10 minutes",
  evidenceLevel: 1,
  source: "APTA",
  citation:
    "Mahoney, F. I., & Barthel, D. W. (1965). Functional evaluation: the Barthel Index. Maryland State Medical Journal, 14, 61-65.",
  lastUpdated: new Date("2024-03-21"),
};

const katzMeasure: GeriatricPainOutcomeMeasure = {
  id: "om-pt-017",
  name: "Katz Index of Independence in Activities of Daily Living",
  abbreviation: "Katz",
  description:
    "Ordinal scale measuring independence in basic ADLs for geriatric assessment",
  itemCount: 6,
  scoreRange: { min: 0, max: 6 },
  scoringMethod:
    "Ordinal scale (A-G); A indicates independence, G indicates dependence",
  mcid: 1,
  mciUnit: "level",
  conditions: [
    "ADL independence",
    "Geriatric assessment",
    "Functional decline",
    "Rehabilitation outcome",
  ],
  adminTime: "5 minutes",
  evidenceLevel: 1,
  source: "APTA",
  citation:
    "Katz, S., et al. (1963). Studies of illness in the aged. The Index of ADL: a standardized measure of biological and psychosocial function. JAMA, 185(12), 914-919.",
  lastUpdated: new Date("2024-03-21"),
};

const tinettiMeasure: GeriatricPainOutcomeMeasure = {
  id: "om-pt-018",
  name: "Tinetti Balance and Gait Assessment",
  abbreviation: "Tinetti",
  description:
    "Assesses balance and gait to predict fall risk in elderly patients",
  itemCount: 16,
  scoreRange: { min: 0, max: 28 },
  scoringMethod:
    "Sum of balance (0-16) and gait (0-12) subscales; higher scores indicate better balance/gait",
  mcid: 4,
  mciUnit: "points",
  conditions: [
    "Fall risk",
    "Balance disorder",
    "Gait dysfunction",
    "Geriatric assessment",
    "Mobility impairment",
  ],
  adminTime: "10-15 minutes",
  evidenceLevel: 1,
  source: "APTA",
  citation:
    "Tinetti, M. E. (1986). Performance-oriented assessment of mobility problems in elderly patients. Journal of the American Geriatrics Society, 34(2), 119-126.",
  lastUpdated: new Date("2024-03-21"),
};

const vasMeasure: GeriatricPainOutcomeMeasure = {
  id: "om-pt-019",
  name: "Visual Analog Scale",
  abbreviation: "VAS",
  description: "Single-item measure of pain intensity using a 10cm line",
  itemCount: 1,
  scoreRange: { min: 0, max: 10 },
  scoringMethod:
    "Distance from left end in cm; higher scores indicate greater pain",
  mcid: 1.3,
  mciUnit: "cm",
  conditions: [
    "Pain intensity",
    "Acute pain",
    "Chronic pain",
    "Post-operative pain",
  ],
  adminTime: "1 minute",
  evidenceLevel: 1,
  source: "APTA",
  citation:
    "Huskisson, E. C. (1974). Measurement of pain. Lancet, 2(7889), 1127-1131.",
  lastUpdated: new Date("2024-03-21"),
};

const nprsMeasure: GeriatricPainOutcomeMeasure = {
  id: "om-pt-020",
  name: "Numeric Pain Rating Scale",
  abbreviation: "NPRS",
  description: "Single-item measure of pain intensity using 0-10 numeric scale",
  itemCount: 1,
  scoreRange: { min: 0, max: 10 },
  scoringMethod: "Numeric rating 0-10; higher scores indicate greater pain",
  mcid: 2,
  mciUnit: "points",
  conditions: [
    "Pain intensity",
    "Acute pain",
    "Chronic pain",
    "Post-operative pain",
  ],
  adminTime: "1 minute",
  evidenceLevel: 1,
  source: "APTA",
  citation:
    "Castarlenas, E., et al. (2016). Agreement between verbal and electronic versions of the Numeric Pain Rating Scale. Clinical Journal of Pain, 32(12), 1038-1046.",
  lastUpdated: new Date("2024-03-21"),
};

const pcsMeasure: GeriatricPainOutcomeMeasure = {
  id: "om-pt-021",
  name: "Pain Catastrophizing Scale",
  abbreviation: "PCS",
  description: "Measures catastrophic thinking about pain with 13 items",
  itemCount: 13,
  scoreRange: { min: 0, max: 52 },
  scoringMethod:
    "Sum of all items (0-4 scale per item); higher scores indicate greater catastrophizing",
  mcid: 10,
  mciUnit: "points",
  conditions: [
    "Pain-related cognitions",
    "Chronic pain",
    "Psychological distress",
    "Pain anxiety",
  ],
  adminTime: "5 minutes",
  evidenceLevel: 1,
  source: "APTA",
  citation:
    "Sullivan, M. J., et al. (1995). The Pain Catastrophizing Scale: development and validation. Psychological Assessment, 7(4), 524-532.",
  lastUpdated: new Date("2024-03-21"),
};

const sf36Measure: GeriatricPainOutcomeMeasure = {
  id: "om-pt-022",
  name: "Short Form 36 Health Survey",
  abbreviation: "SF-36",
  description:
    "Comprehensive 36-item measure of health-related quality of life",
  itemCount: 36,
  scoreRange: { min: 0, max: 100 },
  scoringMethod:
    "Eight subscales (0-100 each); higher scores indicate better health status",
  mcid: 5,
  mciUnit: "points",
  conditions: [
    "Quality of life",
    "General health",
    "Functional status",
    "Health outcomes",
  ],
  adminTime: "10 minutes",
  evidenceLevel: 1,
  source: "APTA",
  citation:
    "Ware, J. E., & Sherbourne, C. D. (1992). The MOS 36-item Short-Form Health Survey (SF-36). Medical Care, 30(6), 473-483.",
  lastUpdated: new Date("2024-03-21"),
};

const eq5dMeasure: GeriatricPainOutcomeMeasure = {
  id: "om-pt-023",
  name: "EuroQol 5 Dimensions",
  abbreviation: "EQ-5D",
  description:
    "Brief 5-item measure of health-related quality of life with visual analog scale",
  itemCount: 5,
  scoreRange: { min: 0, max: 1 },
  scoringMethod:
    "Weighted index score 0-1; higher scores indicate better health status",
  mcid: 0.05,
  mciUnit: "points",
  conditions: [
    "Quality of life",
    "General health",
    "Health outcomes",
    "Cost-effectiveness analysis",
  ],
  adminTime: "2-3 minutes",
  evidenceLevel: 1,
  source: "APTA",
  citation:
    "EuroQol Group (1990). EuroQol: a new facility for the measurement of health-related quality of life. Health Policy, 16(3), 199-208.",
  lastUpdated: new Date("2024-03-21"),
};

const gds15Measure: GeriatricPainOutcomeMeasure = {
  id: "om-pt-024",
  name: "Geriatric Depression Scale - 15",
  abbreviation: "GDS-15",
  description: "Short form screening tool for depression in older adults",
  itemCount: 15,
  scoreRange: { min: 0, max: 15 },
  scoringMethod:
    'Sum of "yes" answers; higher scores indicate greater depressive symptoms',
  mcid: 2,
  mciUnit: "points",
  conditions: ["Geriatric depression", "Mood disorder", "Dementia screening"],
  adminTime: "5 minutes",
  evidenceLevel: 1,
  source: "Journal of Psychiatric Research",
  citation:
    "Sheikh, J. I., & Yesavage, J. A. (1986). Geriatric Depression Scale (GDS): recent evidence and development of a shorter version. Clinical Gerontologist, June, 165-173.",
  lastUpdated: new Date("2024-03-21"),
};

const tugMeasure: GeriatricPainOutcomeMeasure = {
  id: "om-pt-025",
  name: "Timed Up and Go",
  abbreviation: "TUG",
  description:
    "Assesses mobility, balance, and fall risk by timing a 3-meter walk",
  itemCount: 1,
  scoreRange: { min: 0, max: 60 },
  scoringMethod: "Time in seconds; higher values indicate poorer mobility",
  mcid: 3.4,
  mciUnit: "seconds",
  conditions: [
    "Fall risk",
    "Balance disorder",
    "Mobility limitation",
    "Geriatric assessment",
  ],
  adminTime: "2-5 minutes",
  evidenceLevel: 1,
  source: "APTA",
  citation:
    'Podsiadlo, D., & Richardson, S. (1991). The timed "Up & Go": a test of basic functional mobility for frail elderly persons. Journal of the American Geriatrics Society, 39(2), 142-148.',
  lastUpdated: new Date("2024-03-21"),
};

const walk6minMeasure: GeriatricPainOutcomeMeasure = {
  id: "om-pt-026",
  name: "6-Minute Walk Test",
  abbreviation: "6MWT",
  description:
    "Sub-maximal exercise test used to assess aerobic capacity and endurance",
  itemCount: 1,
  scoreRange: { min: 0, max: 1000 },
  scoringMethod: "Total distance walked in meters",
  mcid: 30,
  mciUnit: "meters",
  conditions: [
    "Aerobic capacity",
    "Endurance",
    "Congestive heart failure",
    "COPD",
    "Gait assessment",
  ],
  adminTime: "10 minutes",
  evidenceLevel: 1,
  source: "APTA",
  citation:
    "ATS Committee on Proficiency Standards for Clinical Pulmonary Function Laboratories. (2002). ATS statement: guidelines for the six-minute walk test. Am J Respir Crit Care Med, 166, 111-117.",
  lastUpdated: new Date("2024-03-21"),
};

const bbsMeasure: GeriatricPainOutcomeMeasure = {
  id: "om-pt-027",
  name: "Berg Balance Scale",
  abbreviation: "BBS",
  description:
    "14-item scale designed to measure balance of the older adult in a clinical setting",
  itemCount: 14,
  scoreRange: { min: 0, max: 56 },
  scoringMethod:
    "Sum of items (0-4 scale per item); higher scores indicate better balance",
  mcid: 8,
  mciUnit: "points",
  conditions: [
    "Fall risk",
    "Balance disorder",
    "Stroke",
    "Geriatric assessment",
  ],
  adminTime: "15-20 minutes",
  evidenceLevel: 1,
  source: "APTA",
  citation:
    "Berg, K., et al. (1989). Measuring balance in the elderly: preliminary development of an instrument. Physiotherapy Canada, 41(6), 304-311.",
  lastUpdated: new Date("2024-03-21"),
};

const abcScaleMeasure: GeriatricPainOutcomeMeasure = {
  id: "om-pt-028",
  name: "Activities-specific Balance Confidence Scale",
  abbreviation: "ABC Scale",
  description:
    "Measure of self-efficacy or confidence in performing ADLs without falling",
  itemCount: 16,
  scoreRange: { min: 0, max: 100 },
  scoringMethod:
    "Sum of items divided by 16; higher scores indicate greater confidence",
  mcid: 13,
  mciUnit: "percentage",
  conditions: [
    "Fall self-efficacy",
    "Balance confidence",
    "Dizziness",
    "Geriatric assessment",
  ],
  adminTime: "5-10 minutes",
  evidenceLevel: 1,
  source: "APTA",
  citation:
    "Powell, L. E., & Myers, A. M. (1995). The Activities-specific Balance Confidence (ABC) Scale. The Journals of Gerontology Series A, 50(1), M28-M34.",
  lastUpdated: new Date("2024-03-21"),
};

const dgiMeasure: GeriatricPainOutcomeMeasure = {
  id: "om-pt-029",
  name: "Dynamic Gait Index",
  abbreviation: "DGI",
  description:
    "Assesses the ability to modify gait in response to changing task demands",
  itemCount: 8,
  scoreRange: { min: 0, max: 24 },
  scoringMethod:
    "Sum of items (0-3 scale); higher scores indicate better gait stability",
  mcid: 1.9,
  mciUnit: "points",
  conditions: [
    "Gait stability",
    "Fall risk",
    "Vestibular disorder",
    "Geriatric mobility",
  ],
  adminTime: "10 minutes",
  evidenceLevel: 1,
  source: "APTA",
  citation:
    "Shumway-Cook, A., et al. (1997). Predicting the probability for falls in community-dwelling older adults using the Timed Up & Go Test. Physical Therapy, 80(9), 896-903.",
  lastUpdated: new Date("2024-03-21"),
};

const promisMeasure: GeriatricPainOutcomeMeasure = {
  id: "om-pt-030",
  name: "PROMIS Physical Function",
  abbreviation: "PROMIS-PF",
  description:
    "Patient-reported measure of physical function for ADLs and mobility",
  itemCount: 8,
  scoreRange: { min: 8, max: 40 },
  scoringMethod:
    "Raw sum converted to T-score; higher scores indicate better physical function",
  mcid: 3,
  mciUnit: "points",
  conditions: [
    "Chronic pain",
    "General mobility",
    "ADL independence",
    "Functional recovery",
  ],
  adminTime: "2-5 minutes",
  evidenceLevel: 1,
  source: "APTA",
  citation:
    "Cella, D., et al. (2010). The Patient-Reported Outcomes Measurement Information System (PROMIS). Medical Care, 48(5 Suppl), S5-S11.",
  lastUpdated: new Date("2024-03-21"),
};

const ptOutcomeMeasuresGeriatricPain: GeriatricPainOutcomeMeasure[] = [
  barthelMeasure,
  katzMeasure,
  tinettiMeasure,
  vasMeasure,
  nprsMeasure,
  pcsMeasure,
  sf36Measure,
  eq5dMeasure,
  gds15Measure,
  tugMeasure,
  walk6minMeasure,
  bbsMeasure,
  abcScaleMeasure,
  dgiMeasure,
  promisMeasure,
];

export function getPTGeriatricPainOutcomeMeasureById(
  id: string,
): GeriatricPainOutcomeMeasure | undefined {
  try {
    if (!id || typeof id !== "string") {
      auditService.logWarning("INVALID_GP_MEASURE_ID", { id });
      return undefined;
    }
    const measure = ptOutcomeMeasuresGeriatricPain.find((m) => m.id === id);
    if (!measure) {
      auditService.logWarning("GP_MEASURE_NOT_FOUND", { id });
    }
    return measure;
  } catch (error) {
    auditService.logError("GET_GP_MEASURE_ERROR", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

export function getAllPTGeriatricPainOutcomeMeasures(): GeriatricPainOutcomeMeasure[] {
  try {
    return [...ptOutcomeMeasuresGeriatricPain];
  } catch (error) {
    auditService.logError("GET_ALL_GP_MEASURES_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getPTGeriatricPainOutcomeMeasuresByCondition(
  condition: string,
): GeriatricPainOutcomeMeasure[] {
  try {
    if (!condition || typeof condition !== "string") {
      auditService.logWarning("INVALID_GP_CONDITION", { condition });
      return [];
    }
    return ptOutcomeMeasuresGeriatricPain.filter((m) =>
      m.conditions.some((c) =>
        c.toLowerCase().includes(condition.toLowerCase()),
      ),
    );
  } catch (error) {
    auditService.logError("GET_GP_MEASURES_BY_CONDITION_ERROR", {
      condition,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function searchPTGeriatricPainOutcomeMeasures(
  query: string,
): GeriatricPainOutcomeMeasure[] {
  try {
    if (!query || typeof query !== "string") {
      auditService.logWarning("INVALID_GP_SEARCH_QUERY", { query });
      return [];
    }
    const lowerQuery = query.toLowerCase();
    return ptOutcomeMeasuresGeriatricPain.filter(
      (m) =>
        m.name.toLowerCase().includes(lowerQuery) ||
        m.abbreviation.toLowerCase().includes(lowerQuery) ||
        m.description.toLowerCase().includes(lowerQuery),
    );
  } catch (error) {
    auditService.logError("SEARCH_GP_MEASURES_ERROR", {
      query,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getPTGeriatricPainOutcomeMeasuresByEvidenceLevel(
  level: 1 | 2 | 3,
): GeriatricPainOutcomeMeasure[] {
  try {
    if (![1, 2, 3].includes(level)) {
      auditService.logWarning("INVALID_GP_EVIDENCE_LEVEL", { level });
      return [];
    }
    return ptOutcomeMeasuresGeriatricPain.filter(
      (m) => m.evidenceLevel === level,
    );
  } catch (error) {
    auditService.logError("GET_GP_MEASURES_BY_EVIDENCE_ERROR", {
      level,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function calculateGeriatricPainMCIDImprovement(
  baselineScore: number,
  followupScore: number,
  measureId: string,
): { achieved: boolean; improvement: number; mcid: number } | null {
  try {
    const measure = getPTGeriatricPainOutcomeMeasureById(measureId);
    if (!measure) {
      auditService.logWarning("GP_MCID_CALCULATION_MEASURE_NOT_FOUND", {
        measureId,
      });
      return null;
    }
    if (
      typeof baselineScore !== "number" ||
      typeof followupScore !== "number"
    ) {
      auditService.logWarning("INVALID_GP_SCORE_VALUES", {
        baselineScore,
        followupScore,
        measureId,
      });
      return null;
    }

    // Lower is better for pain scales and TUG
    const lowerIsBetterIds = [
      "om-pt-019", // VAS
      "om-pt-020", // NPRS
      "om-pt-021", // PCS
      "om-pt-025", // TUG
    ];
    const isLowerBetter = lowerIsBetterIds.includes(measureId);
    const improvement = isLowerBetter
      ? baselineScore - followupScore
      : followupScore - baselineScore;
    const achieved = improvement >= measure.mcid;
    auditService.logInfo("GP_MCID_CALCULATED", {
      measureId,
      improvement,
      mcid: measure.mcid,
      achieved,
    });
    return { achieved, improvement, mcid: measure.mcid };
  } catch (error) {
    auditService.logError("GP_MCID_CALCULATION_ERROR", {
      baselineScore,
      followupScore,
      measureId,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

export function getPTGeriatricPainOutcomeMeasureCategories(): string[] {
  try {
    const categories = new Set<string>();
    ptOutcomeMeasuresGeriatricPain.forEach((m) =>
      m.conditions.forEach((c) => categories.add(c)),
    );
    return Array.from(categories).sort();
  } catch (error) {
    auditService.logError("GET_GP_CATEGORIES_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function validatePTGeriatricPainOutcomeMeasureScore(
  measureId: string,
  score: number,
): { valid: boolean; message: string } {
  try {
    const measure = getPTGeriatricPainOutcomeMeasureById(measureId);
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
    auditService.logError("VALIDATE_GP_SCORE_ERROR", {
      measureId,
      score,
      error: error instanceof Error ? error.message : String(error),
    });
    return { valid: false, message: "Validation error" };
  }
}

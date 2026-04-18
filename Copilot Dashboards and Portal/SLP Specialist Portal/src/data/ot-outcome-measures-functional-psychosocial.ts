/**
 * OT Outcome Measures - Functional & Psychosocial
 * Evidence-based from AOTA and peer-reviewed literature
 */

import { auditService } from "../core/audit/AuditService";

export interface OTFunctionalPsychosocialOutcomeMeasure {
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

const measures: OTFunctionalPsychosocialOutcomeMeasure[] = [
  {
    id: "om-ot-021",
    name: "Functional Independence Measure",
    abbreviation: "FIM",
    description:
      "Assesses physical and cognitive disability in daily life tasks",
    itemCount: 18,
    scoreRange: { min: 18, max: 126 },
    scoringMethod:
      "Sum of 18 items (1-7 scale); higher scores indicate better function",
    mcid: 13,
    mciUnit: "points",
    conditions: [
      "ADL dysfunction",
      "Inpatient rehabilitation",
      "Stroke",
      "Spinal cord injury",
    ],
    adminTime: "30-45 minutes",
    evidenceLevel: 1,
    source: "AOTA",
    citation:
      "Keith, R. A., et al. (1987). The Functional Independence Measure: a new tool for rehabilitation. Advances in Clinical Rehabilitation, 1, 6-18.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "om-ot-022",
    name: "Barthel Index",
    abbreviation: "BI",
    description: "Measures performance in activities of daily living",
    itemCount: 10,
    scoreRange: { min: 0, max: 100 },
    scoringMethod: "Sum of 10 items; higher scores indicate better performance",
    mcid: 5,
    mciUnit: "points",
    conditions: ["ADL performance", "Geriatric assessment", "Stroke"],
    adminTime: "5-10 minutes",
    evidenceLevel: 1,
    source: "AOTA",
    citation:
      "Mahoney, F. I., & Barthel, D. W. (1965). Functional evaluation: the Barthel Index. Maryland State Medical Journal, 14, 61-65.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "om-ot-023",
    name: "Katz Index of ADL",
    abbreviation: "Katz",
    description: "Ordinal scale for measuring independence in ADLs",
    itemCount: 6,
    scoreRange: { min: 0, max: 6 },
    scoringMethod: "Categorization (0-6); higher indicates more independence",
    mcid: 1,
    mciUnit: "point",
    conditions: ["ADL independence", "Geriatric assessment"],
    adminTime: "5 minutes",
    evidenceLevel: 1,
    source: "AOTA",
    citation:
      "Katz, S., et al. (1963). Studies of illness in the aged. The Index of ADL: a standardized measure of biological and psychosocial function. JAMA, 185(12), 914-919.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "om-ot-024",
    name: "Interest Checklist - Modified",
    abbreviation: "ICL",
    description:
      "Assesses presence of interests and the value of those interests across the lifespan",
    itemCount: 80,
    scoreRange: { min: 0, max: 80 },
    scoringMethod:
      "Checklist of interests (none to strong); categorical analysis",
    mcid: 1,
    mciUnit: "category change",
    conditions: [
      "Occupational interests",
      "Meaningful activity",
      "Psychosocial rehabilitation",
    ],
    adminTime: "15-20 minutes",
    evidenceLevel: 2,
    source: "MOHO",
    citation:
      "Kielhofner, G., & Neville, A. (1983). The Modified Interest Checklist. MOHO Clearinghouse.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "om-ot-025",
    name: "Occupational Self Assessment",
    abbreviation: "OSA",
    description:
      "Self-report of occupational competence and the environmental impact on that competence",
    itemCount: 21,
    scoreRange: { min: 21, max: 84 },
    scoringMethod: "Rating of competence and importance; compared over time",
    mcid: 4,
    mciUnit: "points",
    conditions: [
      "Occupational identity",
      "Occupational competence",
      "Psychosocial health",
    ],
    adminTime: "20-30 minutes",
    evidenceLevel: 2,
    source: "MOHO",
    citation:
      "Baron, K., et al. (2006). A User's Manual for the Occupational Self Assessment (OSA). MOHO Clearinghouse.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "om-ot-026",
    name: "Beck Depression Inventory - II",
    abbreviation: "BDI-II",
    description: "21-item self-report for measuring the severity of depression",
    itemCount: 21,
    scoreRange: { min: 0, max: 63 },
    scoringMethod:
      "Sum of items; scores 0-63; higher scores indicate greater depression",
    mcid: 5,
    mciUnit: "points",
    conditions: ["Depression", "Mood disorder", "Psychosocial assessment"],
    adminTime: "10 minutes",
    evidenceLevel: 1,
    source: "PsychCorp",
    citation:
      "Beck, A. T., et al. (1996). Manual for the Beck Depression Inventory-II. Psychological Corporation.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "om-ot-027",
    name: "Generalized Anxiety Disorder - 7",
    abbreviation: "GAD-7",
    description:
      "Brief self-report for measuring the severity of generalized anxiety",
    itemCount: 7,
    scoreRange: { min: 0, max: 21 },
    scoringMethod: "Sum of 7 items; higher scores indicate greater anxiety",
    mcid: 4,
    mciUnit: "points",
    conditions: ["Anxiety", "Psychosocial assessment", "Post-injury distress"],
    adminTime: "2-5 minutes",
    evidenceLevel: 1,
    source: "AOTA",
    citation:
      "Spitzer, R. L., et al. (2006). A brief measure for assessing generalized anxiety disorder: the GAD-7. Archives of Internal Medicine, 166(10), 1092-1097.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "om-ot-028",
    name: "Hospital Anxiety and Depression Scale",
    abbreviation: "HADS",
    description:
      "Measures levels of anxiety and depression in patients in general hospital clinics",
    itemCount: 14,
    scoreRange: { min: 0, max: 42 },
    scoringMethod:
      "Sum of subscales (0-21 each); higher scores indicate greater distress",
    mcid: 2,
    mciUnit: "points",
    conditions: ["Anxiety", "Depression", "Medical rehabilitation"],
    adminTime: "5 minutes",
    evidenceLevel: 1,
    source: "AOTA",
    citation:
      "Zigmond, A. S., & Snaith, R. P. (1983). The hospital anxiety and depression scale. Acta Psychiatrica Scandinavica, 67(6), 361-370.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "om-ot-029",
    name: "Social Support Questionnaire - Short Form",
    abbreviation: "SSQ-6",
    description:
      "Assesses number of available social supports and the satisfaction with that support",
    itemCount: 6,
    scoreRange: { min: 0, max: 54 },
    scoringMethod: "Number of people and satisfaction rating (1-6)",
    mcid: 1,
    mciUnit: "unitChange",
    conditions: [
      "Social environment",
      "Resource assessment",
      "Psychosocial outcomes",
    ],
    adminTime: "10-15 minutes",
    evidenceLevel: 2,
    source: "AOTA",
    citation:
      "Sarason, I. G., et al. (1987). A short form of the Social Support Questionnaire: psychometric properties and suggestions for aid. Journal of Social and Personal Relationships, 4, 497-510.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "om-ot-030",
    name: "Modified Ashworth Scale",
    abbreviation: "MAS",
    description: "Assesses the intensity of muscle spasticity and muscle tone",
    itemCount: 1,
    scoreRange: { min: 0, max: 5 },
    scoringMethod:
      "Ordinal scale 0 to 4 (including 1+); lower scores indicate less spasticity",
    mcid: 1,
    mciUnit: "grade",
    conditions: [
      "Spasticity",
      "Hypertonia",
      "Stroke",
      "Multiple Sclerosis",
      "Neurorehabilitation",
    ],
    adminTime: "5 minutes",
    evidenceLevel: 1,
    source: "AOTA",
    citation:
      "Bohannon, R. W., & Smith, M. B. (1987). Interrater reliability of a modified Ashworth scale of muscle spasticity. Physical Therapy, 67(2), 206-207.",
    lastUpdated: new Date("2024-03-21"),
  },
];

export function getOTFunctionalPsychosocialOutcomeMeasureById(
  id: string,
): OTFunctionalPsychosocialOutcomeMeasure | undefined {
  try {
    if (!id || typeof id !== "string") {
      auditService.logWarning("INVALID_OT_FUN_MEASURE_ID", { id });
      return undefined;
    }
    const measure = measures.find((m) => m.id === id);
    return measure;
  } catch (error) {
    auditService.logError("GET_OT_FUN_MEASURE_ERROR", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

export function getAllOTFunctionalPsychosocialOutcomeMeasures(): OTFunctionalPsychosocialOutcomeMeasure[] {
  try {
    return [...measures];
  } catch (error) {
    auditService.logError("GET_ALL_OT_FUN_MEASURES_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function searchOTFunctionalPsychosocialOutcomeMeasures(
  query: string,
): OTFunctionalPsychosocialOutcomeMeasure[] {
  try {
    if (!query || typeof query !== "string") {
      auditService.logWarning("INVALID_OT_FUN_SEARCH_QUERY", { query });
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
    auditService.logError("SEARCH_OT_FUN_MEASURES_ERROR", {
      query,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function calculateOTFunctionalPsychosocialMCIDImprovement(
  baselineScore: number,
  followupScore: number,
  measureId: string,
): { achieved: boolean; improvement: number; mcid: number } | null {
  try {
    const measure = getOTFunctionalPsychosocialOutcomeMeasureById(measureId);
    if (!measure) return null;

    // Lower is better for Depression, Anxiety, and Spasticity
    const lowerIsBetterIds = [
      "om-ot-026",
      "om-ot-027",
      "om-ot-028",
      "om-ot-030",
    ];
    const isLowerBetter = lowerIsBetterIds.includes(measureId);
    const improvement = isLowerBetter
      ? baselineScore - followupScore
      : followupScore - baselineScore;
    const achieved = improvement >= measure.mcid;
    auditService.logInfo("OT_FUN_MCID_CALCULATED", {
      measureId,
      improvement,
      mcid: measure.mcid,
      achieved,
    });
    return { achieved, improvement, mcid: measure.mcid };
  } catch (error) {
    auditService.logError("OT_FUN_MCID_CALCULATION_ERROR", {
      baselineScore,
      followupScore,
      measureId,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

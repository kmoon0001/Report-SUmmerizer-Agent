/**
 * OT Outcome Measures - Cognitive & Sensory
 * Evidence-based from AOTA and peer-reviewed literature
 */

import { auditService } from "../core/audit/AuditService";

export interface OTCognitiveSensoryOutcomeMeasure {
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

const measures: OTCognitiveSensoryOutcomeMeasure[] = [
  {
    id: "om-ot-011",
    name: "Montreal Cognitive Assessment",
    abbreviation: "MoCA",
    description:
      "Rapid screening tool for mild cognitive impairment assessing multiple domains",
    itemCount: 30,
    scoreRange: { min: 0, max: 30 },
    scoringMethod:
      "Sum of items; higher scores indicate better cognitive function",
    mcid: 3,
    mciUnit: "points",
    conditions: [
      "Cognitive impairment",
      "Stroke",
      "Dementia",
      "Geriatric assessment",
    ],
    adminTime: "10-15 minutes",
    evidenceLevel: 1,
    source: "AOTA",
    citation:
      "Nasreddine, Z. S., et al. (2005). The Montreal Cognitive Assessment, MoCA: a brief screening tool for mild cognitive impairment. Journal of the American Geriatrics Society, 53(4), 695-699.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "om-ot-012",
    name: "Mini-Cog",
    abbreviation: "Mini-Cog",
    description:
      "3-item recall and clock drawing test for rapid dementia screening",
    itemCount: 2,
    scoreRange: { min: 0, max: 5 },
    scoringMethod:
      "Sum of recall (0-3) and clock (0 or 2); higher scores indicate better function",
    mcid: 1,
    mciUnit: "point",
    conditions: [
      "Dementia screening",
      "Cognitive deficit",
      "Geriatric assessment",
    ],
    adminTime: "3-5 minutes",
    evidenceLevel: 1,
    source: "AOTA",
    citation:
      'Borson, S., et al. (2000). The Mini-Cog: a cognitive "vital signs" measure for dementia screening in multi-lingual elderly. International Journal of Geriatric Psychiatry, 15(11), 1021-1027.',
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "om-ot-013",
    name: "Trail Making Test",
    abbreviation: "TMT",
    description:
      "Assesses visual search, scanning, speed of processing, mental flexibility, and executive function",
    itemCount: 2,
    scoreRange: { min: 0, max: 300 },
    scoringMethod:
      "Time in seconds to complete Part A and Part B; lower scores indicate better function",
    mcid: 10,
    mciUnit: "seconds",
    conditions: [
      "Executive function",
      "Attention deficit",
      "Driving assessment",
      "Stroke",
    ],
    adminTime: "5-10 minutes",
    evidenceLevel: 1,
    source: "AOTA",
    citation:
      "Reitan, R. M. (1958). Validity of the Trail Making Test as an indicator of organic brain damage. Perceptual and Motor Skills, 8, 271-276.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "om-ot-014",
    name: "Sensory Profile - 2",
    abbreviation: "SP-2",
    description: "Evaluates sensory processing patterns in everyday life",
    itemCount: 86,
    scoreRange: { min: 86, max: 430 },
    scoringMethod: "Sum of items scored 1-5; comparisons to normative groups",
    mcid: 5,
    mciUnit: "points",
    conditions: [
      "Sensory processing disorder",
      "Autism Spectrum Disorder",
      "Developmental delay",
    ],
    adminTime: "15-20 minutes",
    evidenceLevel: 1,
    source: "Pearson",
    citation: "Dunn, W. (2014). Sensory Profile 2 User's Manual. Pearson.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "om-ot-015",
    name: "Sensory Integration and Praxis Tests",
    abbreviation: "SIPT",
    description:
      "Comprehensive assessment of sensory integration and praxis in children",
    itemCount: 17,
    scoreRange: { min: -3, max: 3 },
    scoringMethod: "Standard scores for 17 subtests",
    mcid: 0.5,
    mciUnit: "SD",
    conditions: [
      "Sensory integration deficit",
      "Dyspraxia",
      "Learning disability",
    ],
    adminTime: "90-120 minutes",
    evidenceLevel: 1,
    source: "WPS",
    citation:
      "Ayres, A. J. (1989). Sensory Integration and Praxis Tests. Western Psychological Services.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "om-ot-016",
    name: "Lowenstein Occupational Therapy Cognitive Assessment",
    abbreviation: "LOTCA",
    description: "Measures basic cognitive skills for functional performance",
    itemCount: 20,
    scoreRange: { min: 20, max: 80 },
    scoringMethod:
      "Sum of 20 items in 6 areas; higher scores indicate better function",
    mcid: 5,
    mciUnit: "points",
    conditions: [
      "Stroke",
      "Traumatic Brain Injury",
      "Geriatric cognitive assessment",
    ],
    adminTime: "30-45 minutes",
    evidenceLevel: 2,
    source: "AOTA",
    citation:
      "Itzkovich, M., et al. (1990). Lowenstein Occupational Therapy Cognitive Assessment (LOTCA) manual. Maddak.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "om-ot-017",
    name: "Allen Cognitive Level Screen - 5",
    abbreviation: "ACLS-5",
    description: "Assesses global cognitive processing and learning potential",
    itemCount: 3,
    scoreRange: { min: 3, max: 6 },
    scoringMethod: "Leather lacing tasks rated on scale 3.0 to 5.8",
    mcid: 0.2,
    mciUnit: "level",
    conditions: ["Cognitive disability", "Mental health", "Dementia recovery"],
    adminTime: "15-20 minutes",
    evidenceLevel: 2,
    source: "ACL",
    citation:
      "Allen, C. K., et al. (2014). The Allen Cognitive Level Screen-5 (ACLS-5). ACLS and Lacing Information Center.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "om-ot-018",
    name: "Contextual Memory Test",
    abbreviation: "CMT",
    description:
      "Evaluates awareness of memory capacity and strategies used to remember",
    itemCount: 20,
    scoreRange: { min: 0, max: 40 },
    scoringMethod:
      "Score for immediate and delayed recall with self-awareness component",
    mcid: 4,
    mciUnit: "points",
    conditions: ["Memory impairment", "Brain injury", "Metacognition"],
    adminTime: "20-30 minutes",
    evidenceLevel: 2,
    source: "AOTA",
    citation:
      "Toglia, J. B. (1993). Contextual Memory Test. Psychological Corporation.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "om-ot-019",
    name: "Cognitive Assessment of Minnesota",
    abbreviation: "CAM",
    description:
      "Standardized hierarchical screening instrument for adults with TBI or stroke",
    itemCount: 17,
    scoreRange: { min: 0, max: 80 },
    scoringMethod:
      "Sum of items; scores classified as no impairment to severe impairment",
    mcid: 5,
    mciUnit: "points",
    conditions: [
      "Traumatic Brain Injury",
      "Stroke",
      "Cognitive rehabilitation",
    ],
    adminTime: "40-60 minutes",
    evidenceLevel: 2,
    source: "AOTA",
    citation:
      "Rustad, R. A., et al. (1993). Cognitive Assessment of Minnesota (CAM). Psychological Corporation.",
    lastUpdated: new Date("2024-03-21"),
  },
  {
    id: "om-ot-020",
    name: "Behavioral Inattention Test",
    abbreviation: "BIT",
    description: "Battery for assessing unilateral neglect after brain damage",
    itemCount: 15,
    scoreRange: { min: 0, max: 227 },
    scoringMethod:
      "Sum of traditional and behavioral subtests; higher scores indicate less neglect",
    mcid: 8,
    mciUnit: "points",
    conditions: ["Unilateral neglect", "Stroke", "Parietal lobe damage"],
    adminTime: "40-60 minutes",
    evidenceLevel: 1,
    source: "AOTA",
    citation:
      "Wilson, B., et al. (1987). Behavioral Inattention Test. Thames Valley Test Co.",
    lastUpdated: new Date("2024-03-21"),
  },
];

export function getOTCognitiveSensoryOutcomeMeasureById(
  id: string,
): OTCognitiveSensoryOutcomeMeasure | undefined {
  try {
    if (!id || typeof id !== "string") {
      auditService.logWarning("INVALID_OT_COG_MEASURE_ID", { id });
      return undefined;
    }
    const measure = measures.find((m) => m.id === id);
    if (!measure) {
      auditService.logWarning("OT_COG_MEASURE_NOT_FOUND", { id });
    }
    return measure;
  } catch (error) {
    auditService.logError("GET_OT_COG_MEASURE_ERROR", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

export function getAllOTCognitiveSensoryOutcomeMeasures(): OTCognitiveSensoryOutcomeMeasure[] {
  try {
    return [...measures];
  } catch (error) {
    auditService.logError("GET_ALL_OT_COG_MEASURES_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function searchOTCognitiveSensoryOutcomeMeasures(
  query: string,
): OTCognitiveSensoryOutcomeMeasure[] {
  try {
    if (!query || typeof query !== "string") {
      auditService.logWarning("INVALID_OT_COG_SEARCH_QUERY", { query });
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
    auditService.logError("SEARCH_OT_COG_MEASURES_ERROR", {
      query,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function calculateOTCognitiveSensoryMCIDImprovement(
  baselineScore: number,
  followupScore: number,
  measureId: string,
): { achieved: boolean; improvement: number; mcid: number } | null {
  try {
    const measure = getOTCognitiveSensoryOutcomeMeasureById(measureId);
    if (!measure) {
      auditService.logWarning("OT_COG_MCID_CALCULATION_MEASURE_NOT_FOUND", {
        measureId,
      });
      return null;
    }
    // TMT is "lower is better"
    const isLowerBetter = measureId === "om-ot-013";
    const improvement = isLowerBetter
      ? baselineScore - followupScore
      : followupScore - baselineScore;
    const achieved = improvement >= measure.mcid;
    auditService.logInfo("OT_COG_MCID_CALCULATED", {
      measureId,
      improvement,
      mcid: measure.mcid,
      achieved,
    });
    return { achieved, improvement, mcid: measure.mcid };
  } catch (error) {
    auditService.logError("OT_COG_MCID_CALCULATION_ERROR", {
      baselineScore,
      followupScore,
      measureId,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

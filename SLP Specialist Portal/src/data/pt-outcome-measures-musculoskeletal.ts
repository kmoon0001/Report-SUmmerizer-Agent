/**
 * PT Outcome Measures - Musculoskeletal
 *
 * Standardized outcome measures for musculoskeletal conditions
 * Evidence-based from APTA Clinical Practice Guidelines and peer-reviewed literature
 *
 * Measures included:
 * - LEFS (Lower Extremity Functional Scale)
 * - DASH (Disabilities of Arm, Shoulder and Hand)
 * - ODI (Oswestry Disability Index)
 * - KOOS (Knee Injury and Osteoarthritis Outcome Score)
 * - HOOS (Hip Disability and Osteoarthritis Outcome Score)
 * - NDI (Neck Disability Index)
 * - FABQ (Fear-Avoidance Beliefs Questionnaire - Work & PA)
 * - FAAM (Foot and Ankle Ability Measure - ADL & Sport)
 * - WOMAC (Western Ontario and McMaster Osteoarthritis Index)
 * - SPADI (Shoulder Pain and Disability Index)
 * - ASES (American Shoulder and Elbow Surgeons Score)
 * - TMD (TMJ Disability Index)
 * - TSK-11 (Tampa Scale of Kinesiophobia)
 *
 * Sources:
 * - APTA (2023). Outcome Measures in Physical Therapy Practice
 * - Stratford, P. W., et al. (1995). Assessing disability and change on individual patients
 * - Roos, E. M., et al. (1998). Knee Injury and Osteoarthritis Outcome Score (KOOS)
 * - Cleland, J. A., et al. (2008). The Neck Disability Index: state of the art
 */

import { auditService } from "../core/audit/AuditService";

/**
 * Outcome measure interface
 */
export interface OutcomeMeasure {
  id: string;
  name: string;
  abbreviation: string;
  description: string;
  itemCount: number;
  scoreRange: {
    min: number;
    max: number;
  };
  scoringMethod: string;
  mcid: number; // Minimal Clinically Important Difference
  mciUnit: string;
  conditions: string[];
  adminTime: string;
  evidenceLevel: 1 | 2 | 3;
  source: string;
  citation: string;
  lastUpdated: Date;
}

/**
 * LEFS - Lower Extremity Functional Scale
 * 20-item scale for lower extremity dysfunction
 * MCID: 9 points (Stratford et al., 1995)
 */
const lefsMeasure: OutcomeMeasure = {
  id: "om-pt-001",
  name: "Lower Extremity Functional Scale",
  abbreviation: "LEFS",
  description:
    "Self-report measure of lower extremity function for patients with musculoskeletal disorders",
  itemCount: 20,
  scoreRange: { min: 0, max: 80 },
  scoringMethod: "Sum of all items; higher scores indicate better function",
  mcid: 9,
  mciUnit: "points",
  conditions: [
    "Ankle dysfunction",
    "Knee dysfunction",
    "Hip dysfunction",
    "Lower back pain",
    "Foot pain",
  ],
  adminTime: "5 minutes",
  evidenceLevel: 1,
  source: "APTA",
  citation:
    "Stratford, P. W., et al. (1995). Assessing disability and change on individual patients: a report of a patient specific measure. Physiotherapy Canada, 47(4), 258-263.",
  lastUpdated: new Date("2024-01-15"),
};

/**
 * DASH - Disabilities of Arm, Shoulder and Hand
 * 30-item scale for upper extremity dysfunction
 * MCID: 10-15 points (Gummesson et al., 2006)
 */
const dashMeasure: OutcomeMeasure = {
  id: "om-pt-002",
  name: "Disabilities of Arm, Shoulder and Hand",
  abbreviation: "DASH",
  description: "Self-report measure of upper extremity function and disability",
  itemCount: 30,
  scoreRange: { min: 0, max: 100 },
  scoringMethod:
    "Average of items converted to 0-100 scale; lower scores indicate better function",
  mcid: 12.5,
  mciUnit: "points",
  conditions: [
    "Shoulder pain",
    "Elbow dysfunction",
    "Wrist dysfunction",
    "Hand dysfunction",
    "Upper extremity trauma",
  ],
  adminTime: "5-10 minutes",
  evidenceLevel: 1,
  source: "APTA",
  citation:
    "Hudak, P. L., et al. (1996). Development of an upper extremity outcome measure: the DASH (Disabilities of Arm, Shoulder and Hand). American Journal of Industrial Medicine, 29(6), 602-608.",
  lastUpdated: new Date("2024-01-15"),
};

/**
 * ODI - Oswestry Disability Index
 * 10-item scale for low back pain disability
 * MCID: 10-15 points (Fairbank & Pynsent, 2000)
 */
const odiMeasure: OutcomeMeasure = {
  id: "om-pt-003",
  name: "Oswestry Disability Index",
  abbreviation: "ODI",
  description: "Self-report measure of disability related to low back pain",
  itemCount: 10,
  scoreRange: { min: 0, max: 100 },
  scoringMethod:
    "Sum of items divided by total possible score, multiplied by 100; lower scores indicate less disability",
  mcid: 12.5,
  mciUnit: "points",
  conditions: [
    "Low back pain",
    "Lumbar radiculopathy",
    "Lumbar stenosis",
    "Disc herniation",
  ],
  adminTime: "5 minutes",
  evidenceLevel: 1,
  source: "APTA",
  citation:
    "Fairbank, J. C., & Pynsent, P. B. (2000). The Oswestry Disability Index. Spine, 25(22), 2940-2952.",
  lastUpdated: new Date("2024-01-15"),
};

/**
 * KOOS - Knee Injury and Osteoarthritis Outcome Score
 * 42-item scale for knee dysfunction
 * MCID: 8-10 points (Roos et al., 2003)
 */
const koosMeasure: OutcomeMeasure = {
  id: "om-pt-004",
  name: "Knee Injury and Osteoarthritis Outcome Score",
  abbreviation: "KOOS",
  description:
    "Self-report measure of knee function for injury and osteoarthritis",
  itemCount: 42,
  scoreRange: { min: 0, max: 100 },
  scoringMethod:
    "Five subscales (pain, symptoms, ADL, sport/recreation, QOL) each scored 0-100; higher scores indicate better outcomes",
  mcid: 9,
  mciUnit: "points",
  conditions: [
    "Knee osteoarthritis",
    "Knee injury",
    "ACL injury",
    "Meniscal injury",
    "Patellofemoral pain",
  ],
  adminTime: "10 minutes",
  evidenceLevel: 1,
  source: "APTA",
  citation:
    "Roos, E. M., et al. (1998). Knee Injury and Osteoarthritis Outcome Score (KOOS): development of a self-administered outcome measure. Journal of Orthopaedic & Sports Physical Therapy, 28(2), 88-96.",
  lastUpdated: new Date("2024-01-15"),
};

/**
 * HOOS - Hip Disability and Osteoarthritis Outcome Score
 * 40-item scale for hip dysfunction
 * MCID: 10 points (Nilsdotter et al., 2003)
 */
const hoosMeasure: OutcomeMeasure = {
  id: "om-pt-005",
  name: "Hip Disability and Osteoarthritis Outcome Score",
  abbreviation: "HOOS",
  description:
    "Self-report measure of hip function for injury and osteoarthritis",
  itemCount: 40,
  scoreRange: { min: 0, max: 100 },
  scoringMethod:
    "Five subscales (pain, symptoms, ADL, sport/recreation, QOL) each scored 0-100; higher scores indicate better outcomes",
  mcid: 10,
  mciUnit: "points",
  conditions: [
    "Hip osteoarthritis",
    "Hip labral tear",
    "Hip impingement",
    "Hip pain",
    "Post-hip surgery",
  ],
  adminTime: "10 minutes",
  evidenceLevel: 1,
  source: "APTA",
  citation:
    "Nilsdotter, A., et al. (2003). Hip disability and osteoarthritis outcome score (HOOS): development and validation of a self-administered outcome measure. Arthritis & Rheumatism, 48(11), 3391-3395.",
  lastUpdated: new Date("2024-01-15"),
};

/**
 * NDI - Neck Disability Index
 * 10-item scale for neck pain disability
 * MCID: 10 points (0-50 scale) or 20% (Cleland et al., 2008)
 */
const ndiMeasure: OutcomeMeasure = {
  id: "om-pt-006",
  name: "Neck Disability Index",
  abbreviation: "NDI",
  description: "Self-report measure of disability related to neck pain",
  itemCount: 10,
  scoreRange: { min: 0, max: 50 },
  scoringMethod:
    "Sum of items (0-5 scale per item); higher scores indicate greater disability",
  mcid: 10,
  mciUnit: "points",
  conditions: [
    "Cervical radiculopathy",
    "Mechanical neck pain",
    "Whiplash associated disorders",
  ],
  adminTime: "5 minutes",
  evidenceLevel: 1,
  source: "APTA",
  citation:
    "Cleland, J. A., et al. (2008). The Neck Disability Index: State of the art, 2008. Journal of Orthopaedic & Sports Physical Therapy, 38(9), 576-584.",
  lastUpdated: new Date("2024-03-21"),
};

/**
 * FABQ-PA - Fear-Avoidance Beliefs Questionnaire (Physical Activity)
 * 4-item subscale for physical activity fear-avoidance
 * MCID: 4 points (George et al., 2003)
 */
const fabqPaMeasure: OutcomeMeasure = {
  id: "om-pt-007",
  name: "Fear-Avoidance Beliefs Questionnaire - Physical Activity",
  abbreviation: "FABQ-PA",
  description:
    "Measure of fear-avoidance beliefs related to physical activity in low back pain",
  itemCount: 4,
  scoreRange: { min: 0, max: 24 },
  scoringMethod:
    "Sum of items 2, 3, 4, 5; higher scores indicate stronger fear-avoidance beliefs",
  mcid: 4,
  mciUnit: "points",
  conditions: ["Low back pain", "Lumbar radiculopathy", "Chronic pain"],
  adminTime: "3 minutes",
  evidenceLevel: 1,
  source: "APTA",
  citation:
    "George, S. Z., et al. (2003). A modified fear-avoidance beliefs questionnaire (FABQ) for patients with low back pain. Clinical Journal of Pain, 19(2), 91-97.",
  lastUpdated: new Date("2024-03-21"),
};

/**
 * FABQ-W - Fear-Avoidance Beliefs Questionnaire (Work)
 * 7-item subscale for work-related fear-avoidance
 * MCID: 7 points (Fritz & George, 2002)
 */
const fabqWMeasure: OutcomeMeasure = {
  id: "om-pt-008",
  name: "Fear-Avoidance Beliefs Questionnaire - Work",
  abbreviation: "FABQ-W",
  description:
    "Measure of fear-avoidance beliefs related to work in low back pain",
  itemCount: 7,
  scoreRange: { min: 0, max: 42 },
  scoringMethod:
    "Sum of items 6, 7, 9, 10, 11, 12, 15; higher scores indicate stronger fear-avoidance beliefs",
  mcid: 7,
  mciUnit: "points",
  conditions: ["Occupational low back pain", "Lumbar injury"],
  adminTime: "3 minutes",
  evidenceLevel: 1,
  source: "APTA",
  citation:
    "Fritz, J. M., & George, S. Z. (2002). Identifying psychosocial variables in patients with low back pain. Physical Therapy, 82(10), 1041-1051.",
  lastUpdated: new Date("2024-03-21"),
};

/**
 * FAAM-ADL - Foot and Ankle Ability Measure (ADL)
 * 21-item scale for foot/ankle function during ADLs
 * MCID: 8 points (Martin et al., 2005)
 */
const faamAdlMeasure: OutcomeMeasure = {
  id: "om-pt-009",
  name: "Foot and Ankle Ability Measure - ADL",
  abbreviation: "FAAM-ADL",
  description:
    "Measure of physical function for individuals with foot and ankle related impairments during ADLs",
  itemCount: 21,
  scoreRange: { min: 0, max: 84 },
  scoringMethod:
    "Sum of items; higher scores indicate higher levels of function",
  mcid: 8,
  mciUnit: "points",
  conditions: [
    "Ankle sprain",
    "Plantar fasciitis",
    "Achilles tendinopathy",
    "Foot fracture",
  ],
  adminTime: "7 minutes",
  evidenceLevel: 1,
  source: "APTA",
  citation:
    "Martin, R. L., et al. (2005). Evidence of validity for the Foot and Ankle Ability Measure (FAAM). Foot & Ankle International, 26(11), 968-983.",
  lastUpdated: new Date("2024-03-21"),
};

/**
 * FAAM-Sport - Foot and Ankle Ability Measure (Sport)
 * 8-item scale for foot/ankle function during sport
 * MCID: 9 points (Martin et al., 2005)
 */
const faamSportMeasure: OutcomeMeasure = {
  id: "om-pt-010",
  name: "Foot and Ankle Ability Measure - Sport",
  abbreviation: "FAAM-Sport",
  description:
    "Measure of physical function for individuals with foot and ankle related impairments during sport activities",
  itemCount: 8,
  scoreRange: { min: 0, max: 32 },
  scoringMethod:
    "Sum of items; higher scores indicate higher levels of function",
  mcid: 9,
  mciUnit: "points",
  conditions: ["Athletic foot injury", "Ankle instability", "Stress fracture"],
  adminTime: "3 minutes",
  evidenceLevel: 1,
  source: "APTA",
  citation:
    "Martin, R. L., et al. (2005). Evidence of validity for the Foot and Ankle Ability Measure (FAAM). Foot & Ankle International, 26(11), 968-983.",
  lastUpdated: new Date("2024-03-21"),
};

/**
 * WOMAC - Western Ontario and McMaster Universities Osteoarthritis Index
 * 24-item scale for osteoarthritis symptoms
 * MCID: 10 points (Angst et al., 2001)
 */
const womacMeasure: OutcomeMeasure = {
  id: "om-pt-011",
  name: "Western Ontario and McMaster Universities Osteoarthritis Index",
  abbreviation: "WOMAC",
  description:
    "Measure of pain, stiffness, and physical function in patients with hip or knee osteoarthritis",
  itemCount: 24,
  scoreRange: { min: 0, max: 96 },
  scoringMethod:
    "Sum of three subscales (pain, stiffness, function); higher scores indicate worse symptoms",
  mcid: 10,
  mciUnit: "points",
  conditions: ["Knee osteoarthritis", "Hip osteoarthritis"],
  adminTime: "5-10 minutes",
  evidenceLevel: 1,
  source: "APTA",
  citation:
    "Angst, F., et al. (2001). Responsiveness of the WOMAC osteoarthritis index as compared with the SF-36 in patients with osteoarthritis of the lever or hip that undergo a total joint arthroplasty. Annals of the Rheumatic Diseases, 60(6), 587-594.",
  lastUpdated: new Date("2024-03-21"),
};

/**
 * SPADI - Shoulder Pain and Disability Index
 * 13-item scale for shoulder pathology
 * MCID: 10 points (Williams et al., 1995)
 */
const spadiMeasure: OutcomeMeasure = {
  id: "om-pt-012",
  name: "Shoulder Pain and Disability Index",
  abbreviation: "SPADI",
  description:
    "Measure of shoulder pain and disability in patients with shoulder pathology",
  itemCount: 13,
  scoreRange: { min: 0, max: 100 },
  scoringMethod:
    "Average of pain and disability subscales; higher scores indicate greater disability",
  mcid: 10,
  mciUnit: "points",
  conditions: [
    "Rotator cuff disease",
    "Adhesive capsulitis",
    "Shoulder impingement",
  ],
  adminTime: "5 minutes",
  evidenceLevel: 1,
  source: "APTA",
  citation:
    "Williams, J. W., et al. (1995). The Shoulder Pain and Disability Index: validity and responsiveness of a self-report measure. Medical Care, 33(11), 1157-1161.",
  lastUpdated: new Date("2024-03-21"),
};

/**
 * ASES - American Shoulder and Elbow Surgeons Score
 * 10-item scale for shoulder function
 * MCID: 15 points (Michener et al., 2002)
 */
const asesMeasure: OutcomeMeasure = {
  id: "om-pt-013",
  name: "American Shoulder and Elbow Surgeons Shoulder Score",
  abbreviation: "ASES",
  description: "Measure of shoulder pain and activities of daily living",
  itemCount: 10,
  scoreRange: { min: 0, max: 100 },
  scoringMethod:
    "Pain level (50%) and 10 ADL items (50%); higher scores indicate better outcomes",
  mcid: 15,
  mciUnit: "points",
  conditions: [
    "Shoulder arthroplasty",
    "Rotator cuff repair",
    "Shoulder instability",
  ],
  adminTime: "5 minutes",
  evidenceLevel: 1,
  source: "APTA",
  citation:
    "Michener, L. A., et al. (2002). American Shoulder and Elbow Surgeons Shoulder Score: reliability, validity, and responsiveness. Journal of Shoulder and Elbow Surgery, 11(6), 587-594.",
  lastUpdated: new Date("2024-03-21"),
};

/**
 * TMD - TMJ Disability Index
 * 10-item scale for jaw dysfunction
 * MCID: 2.5 points (Stegenga et al., 1993)
 */
const tmdMeasure: OutcomeMeasure = {
  id: "om-pt-014",
  name: "TMJ Disability Index",
  abbreviation: "TMD",
  description:
    "Measure of jaw function and disability in patients with temporomandibular disorders",
  itemCount: 10,
  scoreRange: { min: 0, max: 10 },
  scoringMethod:
    "Sum of items divided by 10; higher scores indicate greater disability",
  mcid: 2.5,
  mciUnit: "points",
  conditions: ["TMJ disorder", "Mandibular pain", "Jaw dysfunction"],
  adminTime: "5 minutes",
  evidenceLevel: 2,
  source: "Journal of Oral Rehabilitation",
  citation:
    "Stegenga, B., et al. (1993). Assessment of mandibular function impairment and Jaw disability. Journal of Oral Rehabilitation, 20(3), 263-271.",
  lastUpdated: new Date("2024-03-21"),
};

/**
 * TSK-11 - Tampa Scale of Kinesiophobia (Short Form)
 * 11-item scale for fear of movement
 * MCID: 6 points (Woby et al., 2005)
 */
const tsk11Measure: OutcomeMeasure = {
  id: "om-pt-015",
  name: "Tampa Scale of Kinesiophobia - 11",
  abbreviation: "TSK-11",
  description:
    "Measure of fear of movement or re-injury in patients with chronic pain",
  itemCount: 11,
  scoreRange: { min: 11, max: 44 },
  scoringMethod:
    "Sum of items (1-4 scale); higher scores indicate greater kinesiophobia",
  mcid: 6,
  mciUnit: "points",
  conditions: ["Chronic pain", "Post-surgical fear", "Low back pain"],
  adminTime: "4 minutes",
  evidenceLevel: 1,
  source: "APTA",
  citation:
    "Woby, S. R., et al. (2005). Psychometric properties of the TSK-11: a shortened version of the Tampa Scale for Kinesiophobia. Pain, 117(1-2), 137-144.",
  lastUpdated: new Date("2024-03-21"),
};

/**
 * Data array with all musculoskeletal outcome measures
 */
const ptOutcomeMeasuresMusculoskeletal: OutcomeMeasure[] = [
  lefsMeasure,
  dashMeasure,
  odiMeasure,
  koosMeasure,
  hoosMeasure,
  ndiMeasure,
  fabqPaMeasure,
  fabqWMeasure,
  faamAdlMeasure,
  faamSportMeasure,
  womacMeasure,
  spadiMeasure,
  asesMeasure,
  tmdMeasure,
  tsk11Measure,
];

/**
 * Get outcome measure by ID with error handling
 */
export function getPTOutcomeMeasureById(
  id: string,
): OutcomeMeasure | undefined {
  try {
    if (!id || typeof id !== "string") {
      auditService.logWarning("INVALID_MEASURE_ID", { id, type: typeof id });
      return undefined;
    }

    const measure = ptOutcomeMeasuresMusculoskeletal.find((m) => m.id === id);

    if (!measure) {
      auditService.logWarning("MEASURE_NOT_FOUND", { id });
      return undefined;
    }

    return measure;
  } catch (error) {
    auditService.logError("GET_MEASURE_ERROR", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

/**
 * Get all musculoskeletal outcome measures
 */
export function getAllPTOutcomeMeasuresMusculoskeletal(): OutcomeMeasure[] {
  try {
    return [...ptOutcomeMeasuresMusculoskeletal];
  } catch (error) {
    auditService.logError("GET_ALL_MEASURES_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

/**
 * Get measures by condition with filtering
 */
export function getPTOutcomeMeasuresByCondition(
  condition: string,
): OutcomeMeasure[] {
  try {
    if (!condition || typeof condition !== "string") {
      auditService.logWarning("INVALID_CONDITION", {
        condition,
        type: typeof condition,
      });
      return [];
    }

    const measures = ptOutcomeMeasuresMusculoskeletal.filter((m) =>
      m.conditions.some((c) =>
        c.toLowerCase().includes(condition.toLowerCase()),
      ),
    );

    if (measures.length === 0) {
      auditService.logWarning("NO_MEASURES_FOR_CONDITION", { condition });
    }

    return measures;
  } catch (error) {
    auditService.logError("GET_MEASURES_BY_CONDITION_ERROR", {
      condition,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

/**
 * Search measures by name or abbreviation
 */
export function searchPTOutcomeMeasures(query: string): OutcomeMeasure[] {
  try {
    if (!query || typeof query !== "string") {
      auditService.logWarning("INVALID_SEARCH_QUERY", {
        query,
        type: typeof query,
      });
      return [];
    }

    const lowerQuery = query.toLowerCase();
    return ptOutcomeMeasuresMusculoskeletal.filter(
      (m) =>
        m.name.toLowerCase().includes(lowerQuery) ||
        m.abbreviation.toLowerCase().includes(lowerQuery) ||
        m.description.toLowerCase().includes(lowerQuery),
    );
  } catch (error) {
    auditService.logError("SEARCH_MEASURES_ERROR", {
      query,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

/**
 * Get measures by evidence level
 */
export function getPTOutcomeMeasuresByEvidenceLevel(
  level: 1 | 2 | 3,
): OutcomeMeasure[] {
  try {
    if (![1, 2, 3].includes(level)) {
      auditService.logWarning("INVALID_EVIDENCE_LEVEL", { level });
      return [];
    }

    return ptOutcomeMeasuresMusculoskeletal.filter(
      (m) => m.evidenceLevel === level,
    );
  } catch (error) {
    auditService.logError("GET_MEASURES_BY_EVIDENCE_ERROR", {
      level,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

/**
 * Calculate MCID achievement
 */
export function calculateMCIDImprovement(
  baselineScore: number,
  followupScore: number,
  measureId: string,
): { achieved: boolean; improvement: number; mcid: number } | null {
  try {
    const measure = getPTOutcomeMeasureById(measureId);
    if (!measure) {
      auditService.logWarning("MCID_CALCULATION_MEASURE_NOT_FOUND", {
        measureId,
      });
      return null;
    }

    if (
      typeof baselineScore !== "number" ||
      typeof followupScore !== "number"
    ) {
      auditService.logWarning("INVALID_SCORE_VALUES", {
        baselineScore,
        followupScore,
        measureId,
      });
      return null;
    }

    // For measures where lower is better (DASH, ODI, NDI, FABQ, WOMAC, SPADI, TMD, TSK)
    const lowerIsBetterIds = [
      "om-pt-002", // DASH
      "om-pt-003", // ODI
      "om-pt-006", // NDI
      "om-pt-007", // FABQ-PA
      "om-pt-008", // FABQ-W
      "om-pt-011", // WOMAC
      "om-pt-012", // SPADI
      "om-pt-014", // TMD
      "om-pt-015", // TSK-11
    ];
    const isLowerBetter = lowerIsBetterIds.includes(measureId);
    const improvement = isLowerBetter
      ? baselineScore - followupScore
      : followupScore - baselineScore;

    const achieved = improvement >= measure.mcid;

    auditService.logInfo("MCID_CALCULATED", {
      measureId,
      improvement,
      mcid: measure.mcid,
      achieved,
    });

    return {
      achieved,
      improvement,
      mcid: measure.mcid,
    };
  } catch (error) {
    auditService.logError("MCID_CALCULATION_ERROR", {
      baselineScore,
      followupScore,
      measureId,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

/**
 * Get measure categories
 */
export function getPTOutcomeMeasureCategories(): string[] {
  try {
    const categories = new Set<string>();
    ptOutcomeMeasuresMusculoskeletal.forEach((m) => {
      m.conditions.forEach((c) => categories.add(c));
    });
    return Array.from(categories).sort();
  } catch (error) {
    auditService.logError("GET_CATEGORIES_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

/**
 * Validate measure score
 */
export function validatePTOutcomeMeasureScore(
  measureId: string,
  score: number,
): { valid: boolean; message: string } {
  try {
    const measure = getPTOutcomeMeasureById(measureId);
    if (!measure) {
      return { valid: false, message: "Measure not found" };
    }

    if (typeof score !== "number") {
      return { valid: false, message: "Score must be a number" };
    }

    if (score < measure.scoreRange.min || score > measure.scoreRange.max) {
      return {
        valid: false,
        message: `Score must be between ${measure.scoreRange.min} and ${measure.scoreRange.max}`,
      };
    }

    return { valid: true, message: "Score is valid" };
  } catch (error) {
    auditService.logError("VALIDATE_SCORE_ERROR", {
      measureId,
      score,
      error: error instanceof Error ? error.message : String(error),
    });
    return { valid: false, message: "Validation error" };
  }
}

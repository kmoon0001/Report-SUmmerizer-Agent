/**
 * PT Outcome Measures - Neurological
 *
 * Standardized outcome measures for neurological conditions
 * Evidence-based from APTA Clinical Practice Guidelines and peer-reviewed literature
 *
 * Measures included:
 * - FIM (Functional Independence Measure)
 * - NIHSS (National Institutes of Health Stroke Scale)
 * - Berg Balance Scale
 * - TUG (Timed Up and Go)
 * - MoCA (Montreal Cognitive Assessment)
 * - Modified Rankin Scale
 * - Postural Assessment Scale for Stroke Patients (PASS)
 * - Fugl-Meyer Assessment - LE (FMA-LE)
 * - MSWS-12 (12-item Multiple Sclerosis Walking Scale)
 * - PDQ-39 (Parkinson's Disease Questionnaire)
 * - UPDRS III (Unified Parkinson's Disease Rating Scale - Motor)
 * - HiMAT (High-Level Mobility Assessment Tool)
 * - Rivermead Mobility Index
 * - Action Research Arm Test (ARAT)
 * - 9-Hole Peg Test
 */

import { auditService } from "../core/audit/AuditService";

/**
 * Neurological outcome measure interface
 */
export interface NeurologicalOutcomeMeasure {
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
  mcid: number;
  mciUnit: string;
  conditions: string[];
  adminTime: string;
  evidenceLevel: 1 | 2 | 3;
  source: string;
  citation: string;
  lastUpdated: Date;
}

const fimMeasure: NeurologicalOutcomeMeasure = {
  id: "om-pt-031",
  name: "Functional Independence Measure",
  abbreviation: "FIM",
  description:
    "Measures level of independence in self-care, sphincter control, mobility, locomotion, communication, and social cognition",
  itemCount: 18,
  scoreRange: { min: 18, max: 126 },
  scoringMethod:
    "Sum of all items (1-7 scale per item); higher scores indicate greater independence",
  mcid: 13,
  mciUnit: "points",
  conditions: [
    "Stroke",
    "Spinal cord injury",
    "Traumatic brain injury",
    "Neurological dysfunction",
    "Post-acute rehabilitation",
  ],
  adminTime: "30-45 minutes",
  evidenceLevel: 1,
  source: "APTA",
  citation:
    "Uniform Data System for Medical Rehabilitation (1997). Guide for the Uniform Data Set for Medical Rehabilitation (Adult FIM). Buffalo, NY: UDSMR.",
  lastUpdated: new Date("2024-03-21"),
};

const nihssMeasure: NeurologicalOutcomeMeasure = {
  id: "om-pt-032",
  name: "National Institutes of Health Stroke Scale",
  abbreviation: "NIHSS",
  description:
    "Quantifies stroke severity by assessing level of consciousness, language, neglect, visual fields, motor strength, ataxia, dysarthria, and extinction",
  itemCount: 11,
  scoreRange: { min: 0, max: 42 },
  scoringMethod:
    "Sum of all items; higher scores indicate greater stroke severity",
  mcid: 4,
  mciUnit: "points",
  conditions: [
    "Acute stroke",
    "Ischemic stroke",
    "Hemorrhagic stroke",
    "Stroke recovery",
    "Neurological assessment",
  ],
  adminTime: "5-10 minutes",
  evidenceLevel: 1,
  source: "APTA",
  citation:
    "Brott, T., et al. (1989). Measurements of acute cerebral infarction: a clinical examination scale. Stroke, 20(7), 864-870.",
  lastUpdated: new Date("2024-03-21"),
};

const bergMeasure: NeurologicalOutcomeMeasure = {
  id: "om-pt-033",
  name: "Berg Balance Scale",
  abbreviation: "BBS",
  description:
    "Assesses static and dynamic balance through 14 functional tasks; predicts fall risk",
  itemCount: 14,
  scoreRange: { min: 0, max: 56 },
  scoringMethod:
    "Sum of all items (0-4 scale per item); higher scores indicate better balance",
  mcid: 6,
  mciUnit: "points",
  conditions: [
    "Balance disorder",
    "Fall risk",
    "Stroke",
    "Neurological disorder",
    "Geriatric assessment",
  ],
  adminTime: "15-20 minutes",
  evidenceLevel: 1,
  source: "APTA",
  citation:
    "Berg, K., et al. (1992). Measuring balance in the elderly: validation of an instrument. Canadian Journal of Public Health, 83(Suppl 2), S7-S11.",
  lastUpdated: new Date("2024-03-21"),
};

const tugMeasure: NeurologicalOutcomeMeasure = {
  id: "om-pt-034",
  name: "Timed Up and Go",
  abbreviation: "TUG",
  description:
    "Measures time to rise from chair, walk 3 meters, turn around, walk back, and sit down; predicts fall risk",
  itemCount: 1,
  scoreRange: { min: 0, max: 300 },
  scoringMethod: "Time in seconds; lower scores indicate better mobility",
  mcid: 1.3,
  mciUnit: "seconds",
  conditions: [
    "Mobility dysfunction",
    "Fall risk",
    "Neurological disorder",
    "Parkinson disease",
    "Balance impairment",
  ],
  adminTime: "5 minutes",
  evidenceLevel: 1,
  source: "APTA",
  citation:
    "Podsiadlo, D., & Richardson, S. (1991). The Timed Up and Go: a test of basic functional mobility for frail elderly persons. Journal of the American Geriatrics Society, 39(2), 142-148.",
  lastUpdated: new Date("2024-03-21"),
};

const mocaMeasure: NeurologicalOutcomeMeasure = {
  id: "om-pt-035",
  name: "Montreal Cognitive Assessment",
  abbreviation: "MoCA",
  description:
    "Screens for mild cognitive impairment through intensive cognitive assessment",
  itemCount: 30,
  scoreRange: { min: 0, max: 30 },
  scoringMethod:
    "Sum of all items; higher scores indicate better cognitive function",
  mcid: 3,
  mciUnit: "points",
  conditions: [
    "Cognitive impairment",
    "Dementia screening",
    "Stroke recovery",
    "Neurological assessment",
  ],
  adminTime: "10 minutes",
  evidenceLevel: 1,
  source: "APTA",
  citation:
    "Nasreddine, Z. S., et al. (2005). The Montreal Cognitive Assessment, MoCA: a brief screening tool for mild cognitive impairment. Journal of the American Geriatrics Society, 53(4), 695-699.",
  lastUpdated: new Date("2024-03-21"),
};

const modifiedRankinMeasure: NeurologicalOutcomeMeasure = {
  id: "om-pt-036",
  name: "Modified Rankin Scale",
  abbreviation: "mRS",
  description:
    "Commonly used scale for measuring the degree of disability or dependence in patients after stroke",
  itemCount: 1,
  scoreRange: { min: 0, max: 6 },
  scoringMethod: "Ordinal scale 0 (no symptoms) to 6 (dead)",
  mcid: 1,
  mciUnit: "level",
  conditions: ["Stroke", "Post-stroke disability", "Vascular disease"],
  adminTime: "2 minutes",
  evidenceLevel: 1,
  source: "APTA",
  citation:
    "Van Swieten, J. C., et al. (1988). Interobserver agreement for the assessment of handicap in stroke patients. Stroke, 19(5), 604-607.",
  lastUpdated: new Date("2024-03-21"),
};

const passMeasure: NeurologicalOutcomeMeasure = {
  id: "om-pt-037",
  name: "Postural Assessment Scale for Stroke Patients",
  abbreviation: "PASS",
  description: "Assesses postural control and balance in patients after stroke",
  itemCount: 12,
  scoreRange: { min: 0, max: 36 },
  scoringMethod:
    "Sum of items (0-3 scale); higher scores indicate better postural control",
  mcid: 2.2,
  mciUnit: "points",
  conditions: ["Stroke", "Postural instability", "Balance impairment"],
  adminTime: "10 minutes",
  evidenceLevel: 1,
  source: "APTA",
  citation:
    "Benaim, C., et al. (1999). Postural Assessment Scale for Stroke Patients (PASS): description and psychometric properties. Archives of Physical Medicine and Rehabilitation, 80(11), 1415-1422.",
  lastUpdated: new Date("2024-03-21"),
};

const fmaLeMeasure: NeurologicalOutcomeMeasure = {
  id: "om-pt-038",
  name: "Fugl-Meyer Assessment - Lower Extremity",
  abbreviation: "FMA-LE",
  description:
    "Measure of physical performance in the lower extremity after stroke",
  itemCount: 17,
  scoreRange: { min: 0, max: 34 },
  scoringMethod:
    "Sum of lower extremity motor items; higher scores indicate better motor function",
  mcid: 6,
  mciUnit: "points",
  conditions: ["Stroke", "Hemiplegia", "Motor recovery"],
  adminTime: "15-20 minutes",
  evidenceLevel: 1,
  source: "APTA",
  citation:
    "Fugl-Meyer, A. R., et al. (1975). The post-stroke hemiplegic patient. 1. a method for evaluation of physical performance. Scandinavian Journal of Rehabilitation Medicine, 7(1), 13-31.",
  lastUpdated: new Date("2024-03-21"),
};

const msws12Measure: NeurologicalOutcomeMeasure = {
  id: "om-pt-039",
  name: "12-item Multiple Sclerosis Walking Scale",
  abbreviation: "MSWS-12",
  description: "Self-report measure of the impact of MS on walking",
  itemCount: 12,
  scoreRange: { min: 0, max: 100 },
  scoringMethod:
    "Transformed sum of items; lower scores indicate less impact on walking",
  mcid: 8,
  mciUnit: "points",
  conditions: ["Multiple Sclerosis", "Walking difficulty"],
  adminTime: "5 minutes",
  evidenceLevel: 1,
  source: "APTA",
  citation:
    "Hobart, J. C., et al. (2003). Measuring the impact of MS on walking: ability of the 12-Item MS Walking Scale (MSWS-12) to detect change. Multiple Sclerosis Journal, 9(3), 226-244.",
  lastUpdated: new Date("2024-03-21"),
};

const pdq39Measure: NeurologicalOutcomeMeasure = {
  id: "om-pt-040",
  name: "Parkinson's Disease Questionnaire - 39",
  abbreviation: "PDQ-39",
  description:
    "Measure of health status and quality of life for people with Parkinson disease",
  itemCount: 39,
  scoreRange: { min: 0, max: 100 },
  scoringMethod: "Weighted index; lower scores indicate better quality of life",
  mcid: 4.7,
  mciUnit: "points",
  conditions: ["Parkinson disease", "Quality of life"],
  adminTime: "15 minutes",
  evidenceLevel: 1,
  source: "APTA",
  citation:
    "Peto, V., et al. (1995). The development and validation of a short measure of functioning and well being for individuals with Parkinson's disease. Quality of Life Research, 4(3), 241-248.",
  lastUpdated: new Date("2024-03-21"),
};

const updrs3Measure: NeurologicalOutcomeMeasure = {
  id: "om-pt-041",
  name: "Unified Parkinson's Disease Rating Scale - Motor Examination",
  abbreviation: "UPDRS III",
  description:
    "Clinical evaluation of motor function in patients with Parkinson disease",
  itemCount: 27,
  scoreRange: { min: 0, max: 108 },
  scoringMethod:
    "Sum of clinician-rated items; lower scores indicate better motor function",
  mcid: 5,
  mciUnit: "points",
  conditions: ["Parkinson disease", "Motor impairment"],
  adminTime: "15-20 minutes",
  evidenceLevel: 1,
  source: "APTA",
  citation:
    "Goetz, C. G., et al. (2008). Movement Disorder Society-sponsored revision of the Unified Parkinson's Disease Rating Scale (MDS-UPDRS). Movement Disorders, 23(15), 2129-2170.",
  lastUpdated: new Date("2024-03-21"),
};

const himatMeasure: NeurologicalOutcomeMeasure = {
  id: "om-pt-042",
  name: "High-Level Mobility Assessment Tool",
  abbreviation: "HiMAT",
  description:
    "Measure for assessing people with high-level balance and mobility problems after TBI",
  itemCount: 13,
  scoreRange: { min: 0, max: 54 },
  scoringMethod:
    "Sum of performance-based items; higher scores indicate better high-level mobility",
  mcid: 4,
  mciUnit: "points",
  conditions: [
    "Traumatic brain injury",
    "High-level mobility",
    "Balance impairment",
  ],
  adminTime: "15 minutes",
  evidenceLevel: 1,
  source: "APTA",
  citation:
    "Williams, G., et al. (2005). The High-Level Mobility Assessment Tool (HiMAT) for people with traumatic brain injury. Brain Injury, 19(11), 833-842.",
  lastUpdated: new Date("2024-03-21"),
};

const rivermeadMeasure: NeurologicalOutcomeMeasure = {
  id: "om-pt-043",
  name: "Rivermead Mobility Index",
  abbreviation: "RMI",
  description: "Simple measure of mobility in stroke patients",
  itemCount: 15,
  scoreRange: { min: 0, max: 15 },
  scoringMethod: 'Sum of "yes" answers; higher scores indicate better mobility',
  mcid: 2,
  mciUnit: "points",
  conditions: ["Stroke", "Mobility limitation", "Neurological assessment"],
  adminTime: "5 minutes",
  evidenceLevel: 2,
  source: "APTA",
  citation:
    "Collen, F. M., et al. (1991). The Rivermead Mobility Index: a further development of the Rivermead Motor Assessment. International Disability Studies, 13(2), 50-54.",
  lastUpdated: new Date("2024-03-21"),
};

const aratMeasure: NeurologicalOutcomeMeasure = {
  id: "om-pt-044",
  name: "Action Research Arm Test",
  abbreviation: "ARAT",
  description:
    "19-item observational measure used to assess upper extremity performance",
  itemCount: 19,
  scoreRange: { min: 0, max: 57 },
  scoringMethod:
    "Sum of items (0-3 scale); higher scores indicate better motor function",
  mcid: 5.7,
  mciUnit: "points",
  conditions: ["Stroke", "Upper extremity motor impairment", "TBI"],
  adminTime: "10-15 minutes",
  evidenceLevel: 1,
  source: "APTA",
  citation:
    "Lyle, R. C. (1981). A performance test for assessment of upper limb function in physical rehabilitation treatment. International Journal of Rehabilitation Research, 4(4), 483-492.",
  lastUpdated: new Date("2024-03-21"),
};

const peg9Measure: NeurologicalOutcomeMeasure = {
  id: "om-pt-045",
  name: "9-Hole Peg Test",
  abbreviation: "9HPT",
  description: "Assesses finger dexterity and upper extremity coordinate",
  itemCount: 1,
  scoreRange: { min: 0, max: 300 },
  scoringMethod: "Time in seconds to place and remove 9 pegs",
  mcid: 0.2,
  mciUnit: "percentage change",
  conditions: ["Multiple Sclerosis", "Stroke", "Fine motor coordination"],
  adminTime: "5 minutes",
  evidenceLevel: 1,
  source: "APTA",
  citation:
    "Mathiowetz, V., et al. (1985). Adult norms for the Nine-Hole Peg Test of finger dexterity. Occupational Therapy Journal of Research, 5(1), 24-38.",
  lastUpdated: new Date("2024-03-21"),
};

const ptOutcomeMeasuresNeurological: NeurologicalOutcomeMeasure[] = [
  fimMeasure,
  nihssMeasure,
  bergMeasure,
  tugMeasure,
  mocaMeasure,
  modifiedRankinMeasure,
  passMeasure,
  fmaLeMeasure,
  msws12Measure,
  pdq39Measure,
  updrs3Measure,
  himatMeasure,
  rivermeadMeasure,
  aratMeasure,
  peg9Measure,
];

export function getPTNeurologicalOutcomeMeasureById(
  id: string,
): NeurologicalOutcomeMeasure | undefined {
  try {
    if (!id || typeof id !== "string") {
      auditService.logWarning("INVALID_NEURO_MEASURE_ID", {
        id,
        type: typeof id,
      });
      return undefined;
    }
    const measure = ptOutcomeMeasuresNeurological.find((m) => m.id === id);
    if (!measure) {
      auditService.logWarning("NEURO_MEASURE_NOT_FOUND", { id });
      return undefined;
    }
    return measure;
  } catch (error) {
    auditService.logError("GET_NEURO_MEASURE_ERROR", {
      id,
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

export function getAllPTNeurologicalOutcomeMeasures(): NeurologicalOutcomeMeasure[] {
  try {
    return [...ptOutcomeMeasuresNeurological];
  } catch (error) {
    auditService.logError("GET_ALL_NEURO_MEASURES_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getPTNeurologicalOutcomeMeasuresByCondition(
  condition: string,
): NeurologicalOutcomeMeasure[] {
  try {
    if (!condition || typeof condition !== "string") {
      auditService.logWarning("INVALID_NEURO_CONDITION", {
        condition,
        type: typeof condition,
      });
      return [];
    }
    return ptOutcomeMeasuresNeurological.filter((m) =>
      m.conditions.some((c) =>
        c.toLowerCase().includes(condition.toLowerCase()),
      ),
    );
  } catch (error) {
    auditService.logError("GET_NEURO_MEASURES_BY_CONDITION_ERROR", {
      condition,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function searchPTNeurologicalOutcomeMeasures(
  query: string,
): NeurologicalOutcomeMeasure[] {
  try {
    if (!query || typeof query !== "string") {
      auditService.logWarning("INVALID_NEURO_SEARCH_QUERY", {
        query,
        type: typeof query,
      });
      return [];
    }
    const lowerQuery = query.toLowerCase();
    return ptOutcomeMeasuresNeurological.filter(
      (m) =>
        m.name.toLowerCase().includes(lowerQuery) ||
        m.abbreviation.toLowerCase().includes(lowerQuery) ||
        m.description.toLowerCase().includes(lowerQuery),
    );
  } catch (error) {
    auditService.logError("SEARCH_NEURO_MEASURES_ERROR", {
      query,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function getPTNeurologicalOutcomeMeasuresByEvidenceLevel(
  level: 1 | 2 | 3,
): NeurologicalOutcomeMeasure[] {
  try {
    if (![1, 2, 3].includes(level)) {
      auditService.logWarning("INVALID_NEURO_EVIDENCE_LEVEL", { level });
      return [];
    }
    return ptOutcomeMeasuresNeurological.filter(
      (m) => m.evidenceLevel === level,
    );
  } catch (error) {
    auditService.logError("GET_NEURO_MEASURES_BY_EVIDENCE_ERROR", {
      level,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function calculateNeurologicalMCIDImprovement(
  baselineScore: number,
  followupScore: number,
  measureId: string,
): { achieved: boolean; improvement: number; mcid: number } | null {
  try {
    const measure = getPTNeurologicalOutcomeMeasureById(measureId);
    if (!measure) {
      auditService.logWarning("NEURO_MCID_CALCULATION_MEASURE_NOT_FOUND", {
        measureId,
      });
      return null;
    }
    if (
      typeof baselineScore !== "number" ||
      typeof followupScore !== "number"
    ) {
      auditService.logWarning("INVALID_NEURO_SCORE_VALUES", {
        baselineScore,
        followupScore,
        measureId,
      });
      return null;
    }

    // Lower is better for NIHSS, TUG, mRS, MSWS-12, PDQ-39, UPDRS III, 9HPT
    const lowerIsBetterIds = [
      "om-pt-032", // NIHSS
      "om-pt-034", // TUG
      "om-pt-036", // mRS
      "om-pt-039", // MSWS-12
      "om-pt-040", // PDQ-39
      "om-pt-041", // UPDRS III
      "om-pt-045", // 9HPT
    ];
    const isLowerBetter = lowerIsBetterIds.includes(measureId);
    const improvement = isLowerBetter
      ? baselineScore - followupScore
      : followupScore - baselineScore;
    const achieved = improvement >= measure.mcid;
    auditService.logInfo("NEURO_MCID_CALCULATED", {
      measureId,
      improvement,
      mcid: measure.mcid,
      achieved,
    });
    return { achieved, improvement, mcid: measure.mcid };
  } catch (error) {
    auditService.logError("NEURO_MCID_CALCULATION_ERROR", {
      baselineScore,
      followupScore,
      measureId,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

export function getPTNeurologicalOutcomeMeasureCategories(): string[] {
  try {
    const categories = new Set<string>();
    ptOutcomeMeasuresNeurological.forEach((m) =>
      m.conditions.forEach((c) => categories.add(c)),
    );
    return Array.from(categories).sort();
  } catch (error) {
    auditService.logError("GET_NEURO_CATEGORIES_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export function validatePTNeurologicalOutcomeMeasureScore(
  measureId: string,
  score: number,
): { valid: boolean; message: string } {
  try {
    const measure = getPTNeurologicalOutcomeMeasureById(measureId);
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
    auditService.logError("VALIDATE_NEURO_SCORE_ERROR", {
      measureId,
      score,
      error: error instanceof Error ? error.message : String(error),
    });
    return { valid: false, message: "Validation error" };
  }
}

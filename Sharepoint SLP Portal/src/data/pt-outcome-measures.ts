/**
 * PT Module 1: Outcome Measures
 * Comprehensive PT-specific outcome measures with scoring, interpretation, and clinical utility
 * Sources: APTA, peer-reviewed literature, Outcome Measures in Rehabilitation (Tanner)
 */

export interface PTOutcomeMeasure {
  id: string;
  name: string;
  abbreviation: string;
  description: string;
  minScore: number;
  maxScore: number;
  scoringDirection: "higher-better" | "lower-better";
  mcid: number;
  adminTime: number;
  category:
    | "lower-extremity"
    | "upper-extremity"
    | "spine"
    | "balance"
    | "neurological"
    | "pain"
    | "functional";
  applicableConditions: string[];
  scoringMethod: string;
  interpretation: {
    excellent: string;
    good: string;
    fair: string;
    poor: string;
  };
  clinicalUtility: string;
  source: string;
  citation: string;
  lastUpdated: Date;
}

const ptOutcomeMeasures: PTOutcomeMeasure[] = [
  {
    id: "pt-om-001",
    name: "Lower Extremity Functional Scale",
    abbreviation: "LEFS",
    description:
      "Measures lower extremity function across 20 items related to daily activities and mobility",
    minScore: 0,
    maxScore: 80,
    scoringDirection: "higher-better",
    mcid: 9,
    adminTime: 10,
    category: "lower-extremity",
    applicableConditions: [
      "lower-extremity-injury",
      "orthopedic-rehabilitation",
      "sports-medicine",
      "post-surgical",
    ],
    scoringMethod:
      "Each item scored 0-4 based on difficulty level. Total score = sum of all items.",
    interpretation: {
      excellent: "70-80: Minimal disability, high function",
      good: "56-69: Mild disability, good function",
      fair: "41-55: Moderate disability, fair function",
      poor: "0-40: Severe disability, limited function",
    },
    clinicalUtility:
      "Excellent for tracking progress in lower extremity rehabilitation. Responsive to change and clinically meaningful.",
    source: "APTA",
    citation:
      "Binkley JM, et al. The Lower Extremity Functional Scale (LEFS): scale development, measurement properties, and clinical application. Phys Ther. 1999;79(4):371-383.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-om-002",
    name: "Disabilities of Arm, Shoulder and Hand",
    abbreviation: "DASH",
    description:
      "Measures upper extremity function across 30 items related to arm, shoulder, and hand disability",
    minScore: 0,
    maxScore: 100,
    scoringDirection: "lower-better",
    mcid: 15,
    adminTime: 10,
    category: "upper-extremity",
    applicableConditions: [
      "upper-extremity-injury",
      "shoulder-pain",
      "hand-therapy",
      "rotator-cuff",
      "post-surgical",
    ],
    scoringMethod:
      "Raw score converted to 0-100 scale. Lower scores indicate better function.",
    interpretation: {
      excellent: "0-20: Minimal disability, high function",
      good: "21-40: Mild disability, good function",
      fair: "41-60: Moderate disability, fair function",
      poor: "61-100: Severe disability, limited function",
    },
    clinicalUtility:
      "Gold standard for upper extremity assessment. Highly responsive and clinically meaningful.",
    source: "APTA",
    citation:
      "Hudak PL, et al. Development of an upper extremity outcome measure: the DASH. Am J Ind Med. 1996;29(6):602-608.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-om-003",
    name: "Oswestry Disability Index",
    abbreviation: "ODI",
    description:
      "Measures low back pain disability across 10 items related to pain intensity and functional limitations",
    minScore: 0,
    maxScore: 100,
    scoringDirection: "lower-better",
    mcid: 10,
    adminTime: 5,
    category: "spine",
    applicableConditions: [
      "low-back-pain",
      "lumbar-spine",
      "orthopedic-rehabilitation",
      "post-surgical",
    ],
    scoringMethod:
      "Raw score converted to percentage disability. Lower scores indicate better function.",
    interpretation: {
      excellent: "0-20: Minimal disability",
      good: "21-40: Mild disability",
      fair: "41-60: Moderate disability",
      poor: "61-100: Severe disability",
    },
    clinicalUtility:
      "Most widely used low back pain measure. Excellent for tracking progress and outcomes.",
    source: "APTA",
    citation:
      "Fairbank JC, Pynsent PB. The Oswestry Disability Index. Spine. 2000;25(22):2940-2952.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-om-004",
    name: "Knee Injury and Osteoarthritis Outcome Score",
    abbreviation: "KOOS",
    description:
      "Measures knee function across 42 items in 5 subscales: pain, symptoms, ADL, sport/recreation, quality of life",
    minScore: 0,
    maxScore: 100,
    scoringDirection: "higher-better",
    mcid: 8,
    adminTime: 15,
    category: "lower-extremity",
    applicableConditions: [
      "knee-osteoarthritis",
      "knee-injury",
      "post-surgical",
      "sports-medicine",
    ],
    scoringMethod:
      "Each subscale scored 0-100. Average of subscales = total score.",
    interpretation: {
      excellent: "80-100: Minimal symptoms, high function",
      good: "60-79: Mild symptoms, good function",
      fair: "40-59: Moderate symptoms, fair function",
      poor: "0-39: Severe symptoms, limited function",
    },
    clinicalUtility:
      "Comprehensive knee assessment with multiple subscales. Excellent for tracking specific domains.",
    source: "APTA",
    citation:
      "Roos EM, et al. The Knee Injury and Osteoarthritis Outcome Score (KOOS): from joint injury to osteoarthritis. Health Qual Life Outcomes. 2003;1:64.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-om-005",
    name: "Hip Disability and Osteoarthritis Outcome Score",
    abbreviation: "HOOS",
    description:
      "Measures hip function across 40 items in 5 subscales: pain, symptoms, ADL, sport/recreation, quality of life",
    minScore: 0,
    maxScore: 100,
    scoringDirection: "higher-better",
    mcid: 10,
    adminTime: 15,
    category: "lower-extremity",
    applicableConditions: [
      "hip-osteoarthritis",
      "hip-injury",
      "post-surgical",
      "sports-medicine",
    ],
    scoringMethod:
      "Each subscale scored 0-100. Average of subscales = total score.",
    interpretation: {
      excellent: "80-100: Minimal symptoms, high function",
      good: "60-79: Mild symptoms, good function",
      fair: "40-59: Moderate symptoms, fair function",
      poor: "0-39: Severe symptoms, limited function",
    },
    clinicalUtility:
      "Parallel to KOOS for hip assessment. Comprehensive and responsive to change.",
    source: "APTA",
    citation:
      "Nilsdotter AK, et al. Hip disability and osteoarthritis outcome score (HOOS)--validity and responsiveness in total hip replacement. BMC Musculoskelet Disord. 2005;6:3.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-om-006",
    name: "National Institutes of Health Stroke Scale",
    abbreviation: "NIHSS",
    description:
      "Measures stroke severity across 11 items assessing neurological deficits",
    minScore: 0,
    maxScore: 42,
    scoringDirection: "lower-better",
    mcid: 4,
    adminTime: 10,
    category: "neurological",
    applicableConditions: [
      "stroke",
      "cerebrovascular-accident",
      "neurological-rehabilitation",
    ],
    scoringMethod:
      "Each item scored based on severity. Total score = sum of all items.",
    interpretation: {
      excellent: "0-4: No stroke symptoms",
      good: "5-15: Mild stroke",
      fair: "16-20: Moderate stroke",
      poor: "21-42: Severe stroke",
    },
    clinicalUtility:
      "Gold standard for acute stroke assessment. Predicts outcomes and guides treatment.",
    source: "APTA",
    citation:
      "Brott T, et al. Measurements of acute cerebral infarction: a clinical examination scale. Stroke. 1989;20(7):864-870.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-om-007",
    name: "Berg Balance Scale",
    abbreviation: "BBS",
    description:
      "Measures static and dynamic balance across 14 items including sitting, standing, transfers, and reaching",
    minScore: 0,
    maxScore: 56,
    scoringDirection: "higher-better",
    mcid: 4,
    adminTime: 20,
    category: "balance",
    applicableConditions: [
      "fall-prevention",
      "balance-disorder",
      "geriatric",
      "neurological",
      "post-surgical",
    ],
    scoringMethod:
      "Each item scored 0-4 based on ability to perform task. Total score = sum of all items.",
    interpretation: {
      excellent: "46-56: Low fall risk",
      good: "40-45: Medium fall risk",
      fair: "21-39: High fall risk",
      poor: "0-20: Very high fall risk",
    },
    clinicalUtility:
      "Most widely used balance assessment. Excellent predictor of fall risk.",
    source: "APTA",
    citation:
      "Berg KO, et al. Measuring balance in the elderly: validation of an instrument. Can J Public Health. 1992;83 Suppl 2:S7-11.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-om-008",
    name: "Timed Up and Go",
    abbreviation: "TUG",
    description:
      "Measures mobility and fall risk by timing how long it takes to stand from chair, walk 3 meters, turn, and return",
    minScore: 0,
    maxScore: 300,
    scoringDirection: "lower-better",
    mcid: 4,
    adminTime: 5,
    category: "functional",
    applicableConditions: [
      "fall-prevention",
      "mobility",
      "geriatric",
      "neurological",
      "post-surgical",
    ],
    scoringMethod:
      "Time in seconds to complete task. Lower times indicate better function.",
    interpretation: {
      excellent: "0-12 seconds: Low fall risk",
      good: "13-20 seconds: Medium fall risk",
      fair: "21-30 seconds: High fall risk",
      poor: ">30 seconds: Very high fall risk",
    },
    clinicalUtility:
      "Quick, practical assessment. Excellent for identifying fall risk in community settings.",
    source: "APTA",
    citation:
      'Podsiadlo D, Richardson S. The timed "Up & Go": a test of basic functional mobility for frail elderly persons. J Am Geriatr Soc. 1991;39(2):142-148.',
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-om-009",
    name: "Montreal Cognitive Assessment",
    abbreviation: "MoCA",
    description:
      "Measures cognitive function across 8 domains: visuospatial, naming, memory, attention, language, abstraction, delayed recall, orientation",
    minScore: 0,
    maxScore: 30,
    scoringDirection: "higher-better",
    mcid: 3,
    adminTime: 10,
    category: "neurological",
    applicableConditions: [
      "cognitive-impairment",
      "stroke",
      "neurological-rehabilitation",
      "dementia",
    ],
    scoringMethod:
      "Each domain scored based on performance. Total score = sum of all domains.",
    interpretation: {
      excellent: "26-30: Normal cognition",
      good: "18-25: Mild cognitive impairment",
      fair: "11-17: Moderate cognitive impairment",
      poor: "0-10: Severe cognitive impairment",
    },
    clinicalUtility:
      "Comprehensive cognitive screening. Sensitive to mild cognitive impairment.",
    source: "APTA",
    citation:
      "Nasreddine ZS, et al. The Montreal Cognitive Assessment, MoCA: a brief screening tool for mild cognitive impairment. J Am Geriatr Soc. 2005;53(4):695-699.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-om-010",
    name: "Tinetti Balance and Gait Assessment",
    abbreviation: "Tinetti",
    description:
      "Measures balance and gait across 16 items in 2 subscales: balance (9 items) and gait (7 items)",
    minScore: 0,
    maxScore: 28,
    scoringDirection: "higher-better",
    mcid: 4,
    adminTime: 10,
    category: "balance",
    applicableConditions: [
      "fall-prevention",
      "balance-disorder",
      "gait-disorder",
      "geriatric",
      "neurological",
    ],
    scoringMethod:
      "Each item scored 0-2 based on performance. Total score = sum of all items.",
    interpretation: {
      excellent: "24-28: Low fall risk",
      good: "19-23: Medium fall risk",
      fair: "10-18: High fall risk",
      poor: "0-9: Very high fall risk",
    },
    clinicalUtility:
      "Comprehensive balance and gait assessment. Excellent for identifying specific deficits.",
    source: "APTA",
    citation:
      "Tinetti ME. Performance-oriented assessment of mobility problems in elderly patients. J Am Geriatr Soc. 1986;34(2):119-126.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-om-011",
    name: "Visual Analog Scale",
    abbreviation: "VAS",
    description:
      "Measures pain intensity on a 10-cm scale from no pain to worst pain imaginable",
    minScore: 0,
    maxScore: 10,
    scoringDirection: "lower-better",
    mcid: 1.5,
    adminTime: 1,
    category: "pain",
    applicableConditions: [
      "pain",
      "acute-pain",
      "chronic-pain",
      "post-surgical",
      "all-conditions",
    ],
    scoringMethod:
      "Patient marks position on 10-cm line. Distance from left edge = score.",
    interpretation: {
      excellent: "0-2: No to minimal pain",
      good: "3-4: Mild pain",
      fair: "5-6: Moderate pain",
      poor: "7-10: Severe pain",
    },
    clinicalUtility:
      "Simple, quick pain assessment. Highly responsive to change.",
    source: "APTA",
    citation:
      "Huskisson EC. Measurement of pain. Lancet. 1974;2(7889):1127-1131.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-om-012",
    name: "Numeric Pain Rating Scale",
    abbreviation: "NPRS",
    description:
      "Measures pain intensity on an 11-point scale from 0 (no pain) to 10 (worst pain imaginable)",
    minScore: 0,
    maxScore: 10,
    scoringDirection: "lower-better",
    mcid: 2,
    adminTime: 1,
    category: "pain",
    applicableConditions: [
      "pain",
      "acute-pain",
      "chronic-pain",
      "post-surgical",
      "all-conditions",
    ],
    scoringMethod: "Patient selects number 0-10 representing pain intensity.",
    interpretation: {
      excellent: "0-2: No to minimal pain",
      good: "3-4: Mild pain",
      fair: "5-6: Moderate pain",
      poor: "7-10: Severe pain",
    },
    clinicalUtility:
      "Simple, quick pain assessment. Easier to administer than VAS.",
    source: "APTA",
    citation:
      "Downie WW, et al. Studies with pain rating scales. Ann Rheum Dis. 1978;37(4):378-381.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-om-013",
    name: "Functional Reach Test",
    abbreviation: "FRT",
    description:
      "Measures dynamic balance by measuring how far forward a person can reach while standing",
    minScore: 0,
    maxScore: 50,
    scoringDirection: "higher-better",
    mcid: 2,
    adminTime: 5,
    category: "balance",
    applicableConditions: [
      "fall-prevention",
      "balance-disorder",
      "geriatric",
      "neurological",
    ],
    scoringMethod:
      "Distance reached forward from starting position measured in centimeters.",
    interpretation: {
      excellent: "25-50 cm: Low fall risk",
      good: "15-24 cm: Medium fall risk",
      fair: "6-14 cm: High fall risk",
      poor: "0-5 cm: Very high fall risk",
    },
    clinicalUtility: "Quick assessment of dynamic balance and fall risk.",
    source: "APTA",
    citation:
      "Duncan PW, et al. Functional reach: a new clinical measure of balance. J Gerontol. 1990;45(6):M192-197.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-om-014",
    name: "Short Physical Performance Battery",
    abbreviation: "SPPB",
    description:
      "Measures lower extremity function across 3 components: balance, gait speed, and chair stand",
    minScore: 0,
    maxScore: 12,
    scoringDirection: "higher-better",
    mcid: 1,
    adminTime: 10,
    category: "lower-extremity",
    applicableConditions: [
      "geriatric",
      "functional-limitation",
      "post-surgical",
      "neurological",
    ],
    scoringMethod:
      "Each component scored 0-4. Total score = sum of 3 components.",
    interpretation: {
      excellent: "10-12: High function",
      good: "7-9: Moderate function",
      fair: "4-6: Low function",
      poor: "0-3: Very low function",
    },
    clinicalUtility:
      "Comprehensive lower extremity assessment. Predicts disability and mortality.",
    source: "APTA",
    citation:
      "Guralnik JM, et al. A short physical performance battery assessing lower extremity function: association with self-reported disability and prediction of mortality and nursing home admission. J Gerontol. 1994;49(2):M85-94.",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "pt-om-015",
    name: "Six-Minute Walk Test",
    abbreviation: "6MWT",
    description:
      "Measures functional exercise capacity by measuring distance walked in 6 minutes",
    minScore: 0,
    maxScore: 1000,
    scoringDirection: "higher-better",
    mcid: 50,
    adminTime: 10,
    category: "functional",
    applicableConditions: [
      "cardiopulmonary",
      "endurance",
      "post-surgical",
      "geriatric",
      "neurological",
    ],
    scoringMethod: "Distance walked in 6 minutes measured in meters.",
    interpretation: {
      excellent: "600+ meters: High functional capacity",
      good: "400-599 meters: Good functional capacity",
      fair: "200-399 meters: Fair functional capacity",
      poor: "0-199 meters: Limited functional capacity",
    },
    clinicalUtility:
      "Excellent for assessing functional exercise capacity and predicting outcomes.",
    source: "APTA",
    citation:
      "Guyatt GH, et al. The 6-minute walk test: a new measure of exercise capacity in patients with chronic heart failure. Can Med Assoc J. 1985;132(8):919-923.",
    lastUpdated: new Date("2024-01-15"),
  },
];

/**
 * Get PT outcome measure by ID
 */
export function getPTOutcomeMeasureById(
  id: string,
): PTOutcomeMeasure | undefined {
  return ptOutcomeMeasures.find((m) => m.id === id);
}

/**
 * Get PT outcome measures by category
 */
export function getPTOutcomeMeasuresByCategory(
  category: string,
): PTOutcomeMeasure[] {
  return ptOutcomeMeasures.filter((m) => m.category === category);
}

/**
 * Get PT outcome measures for condition
 */
export function getPTOutcomeMeasuresForCondition(
  condition: string,
): PTOutcomeMeasure[] {
  return ptOutcomeMeasures.filter((m) =>
    m.applicableConditions.includes(condition),
  );
}

/**
 * Search PT outcome measures
 */
export function searchPTOutcomeMeasures(query: string): PTOutcomeMeasure[] {
  const lowerQuery = query.toLowerCase();
  return ptOutcomeMeasures.filter(
    (m) =>
      m.name.toLowerCase().includes(lowerQuery) ||
      m.abbreviation.toLowerCase().includes(lowerQuery) ||
      m.description.toLowerCase().includes(lowerQuery),
  );
}

/**
 * Get all PT outcome measures
 */
export function getAllPTOutcomeMeasures(): PTOutcomeMeasure[] {
  return ptOutcomeMeasures;
}

/**
 * Get PT outcome measures by scoring direction
 */
export function getPTOutcomeMeasuresByScoringDirection(
  direction: "higher-better" | "lower-better",
): PTOutcomeMeasure[] {
  return ptOutcomeMeasures.filter((m) => m.scoringDirection === direction);
}

/**
 * Get PT outcome measures by admin time (quick measures < 10 minutes)
 */
export function getQuickPTOutcomeMeasures(): PTOutcomeMeasure[] {
  return ptOutcomeMeasures.filter((m) => m.adminTime < 10);
}

/**
 * Get PT outcome measures by category count
 */
export function getPTOutcomeMeasureCategories(): string[] {
  const categories = new Set(ptOutcomeMeasures.map((m) => m.category));
  return Array.from(categories);
}

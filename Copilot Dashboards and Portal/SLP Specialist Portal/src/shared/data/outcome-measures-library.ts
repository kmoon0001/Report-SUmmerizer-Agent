/**
 * Shared Outcome Measures Library
 * Centralized repository of standardized outcome measures used across PT and OT
 * Includes scoring, interpretation, MCID (Minimal Clinically Important Difference)
 * Sources: APTA, AOTA, Cochrane, PubMed, clinical practice standards
 */

export type MeasureType =
  | "functional"
  | "pain"
  | "balance"
  | "cognitive"
  | "quality-of-life"
  | "sensory"
  | "motor"
  | "occupational";
export type Discipline = "pt" | "ot" | "shared";
export type ScoringDirection = "higher-better" | "lower-better";

export interface OutcomeMeasure {
  id: string;
  name: string;
  abbreviation: string;
  discipline: Discipline;
  type: MeasureType;
  description: string;
  minScore: number;
  maxScore: number;
  scoringDirection: ScoringDirection;
  mcid: number; // Minimal Clinically Important Difference
  adminTime: number; // minutes
  source: string;
  citation: string;
  url?: string;
  scoringRules: string;
  interpretation: {
    excellent: string;
    good: string;
    fair: string;
    poor: string;
  };
  applicableTo: string[];
  lastUpdated: Date;
}

// Shared Measures (Used by both PT and OT)
const sharedMeasures: OutcomeMeasure[] = [
  {
    id: "fim-001",
    name: "Functional Independence Measure",
    abbreviation: "FIM",
    discipline: "shared",
    type: "functional",
    description:
      "Measures functional independence across 18 items in self-care, sphincter control, mobility, locomotion, communication, and social cognition",
    minScore: 18,
    maxScore: 126,
    scoringDirection: "higher-better",
    mcid: 13,
    adminTime: 30,
    source: "Uniform Data System for Medical Rehabilitation",
    citation:
      "Linacre JM, et al. The structure and stability of the Functional Independence Measure. Arch Phys Med Rehabil. 1994;75(2):127-132.",
    url: "https://www.udsmr.org/",
    scoringRules:
      "Each item scored 1-7: 1=Total Assist, 2=Maximal Assist, 3=Moderate Assist, 4=Minimal Assist, 5=Supervision, 6=Modified Independence, 7=Complete Independence",
    interpretation: {
      excellent: "105-126: Complete or modified independence",
      good: "84-104: Minimal to moderate assistance",
      fair: "63-83: Moderate to maximal assistance",
      poor: "18-62: Maximal to total assistance",
    },
    applicableTo: [
      "stroke",
      "spinal-cord-injury",
      "traumatic-brain-injury",
      "general-rehabilitation",
    ],
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "barthel-001",
    name: "Barthel Index",
    abbreviation: "BI",
    discipline: "shared",
    type: "functional",
    description:
      "Measures independence in ADL across 10 items: feeding, bathing, grooming, dressing, bowel control, bladder control, toilet use, transfers, mobility, stairs",
    minScore: 0,
    maxScore: 100,
    scoringDirection: "higher-better",
    mcid: 15,
    adminTime: 15,
    source: "Mahoney FI, Barthel DW",
    citation:
      "Mahoney FI, Barthel DW. Functional evaluation: the Barthel Index. Md State Med J. 1965;14:61-65.",
    scoringRules:
      "Items scored 0, 5, 10, or 15 points depending on independence level",
    interpretation: {
      excellent: "91-100: Minimal disability",
      good: "61-90: Mild disability",
      fair: "21-60: Moderate disability",
      poor: "0-20: Severe disability",
    },
    applicableTo: [
      "stroke",
      "spinal-cord-injury",
      "general-rehabilitation",
      "geriatric",
    ],
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "katz-001",
    name: "Katz Index of Independence in Activities of Daily Living",
    abbreviation: "Katz ADL",
    discipline: "shared",
    type: "functional",
    description:
      "Measures independence in 6 basic ADLs: bathing, dressing, toileting, transferring, continence, feeding",
    minScore: 0,
    maxScore: 6,
    scoringDirection: "higher-better",
    mcid: 1,
    adminTime: 10,
    source: "Katz S, et al.",
    citation:
      "Katz S, Ford AB, Moskowitz RW, et al. Studies of illness in the aged. The index of ADL: a standardized measure of biological and psychosocial function. JAMA. 1963;185(12):914-919.",
    scoringRules: "Each item scored as Independent (1) or Dependent (0)",
    interpretation: {
      excellent: "6: Independent in all ADLs",
      good: "4-5: Independent in most ADLs",
      fair: "2-3: Dependent in several ADLs",
      poor: "0-1: Dependent in most ADLs",
    },
    applicableTo: ["geriatric", "general-rehabilitation", "stroke"],
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "sf36-001",
    name: "SF-36 Health Survey",
    abbreviation: "SF-36",
    discipline: "shared",
    type: "quality-of-life",
    description:
      "Measures health-related quality of life across 8 domains: physical functioning, role limitations (physical), bodily pain, general health, vitality, social functioning, role limitations (emotional), mental health",
    minScore: 0,
    maxScore: 100,
    scoringDirection: "higher-better",
    mcid: 5,
    adminTime: 10,
    source: "RAND Corporation",
    citation:
      "Ware JE Jr, Sherbourne CD. The MOS 36-item short-form health survey (SF-36). I. Conceptual framework and item selection. Med Care. 1992;30(6):473-483.",
    url: "https://www.rand.org/health-care/surveys_tools/mos/36-item-short-form.html",
    scoringRules: "Raw scores transformed to 0-100 scale for each domain",
    interpretation: {
      excellent: "75-100: Excellent health status",
      good: "50-74: Good health status",
      fair: "25-49: Fair health status",
      poor: "0-24: Poor health status",
    },
    applicableTo: [
      "general-population",
      "chronic-disease",
      "post-rehabilitation",
    ],
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "eq5d-001",
    name: "EQ-5D Quality of Life Measure",
    abbreviation: "EQ-5D",
    discipline: "shared",
    type: "quality-of-life",
    description:
      "Measures health-related quality of life across 5 dimensions: mobility, self-care, usual activities, pain/discomfort, anxiety/depression",
    minScore: -0.594,
    maxScore: 1.0,
    scoringDirection: "higher-better",
    mcid: 0.074,
    adminTime: 5,
    source: "EuroQol Group",
    citation:
      "EuroQol Group. EuroQol--a new facility for the measurement of health-related quality of life. Health Policy. 1990;16(3):199-208.",
    url: "https://euroqol.org/",
    scoringRules:
      "Responses converted to utility index score using country-specific value sets",
    interpretation: {
      excellent: "0.85-1.0: Excellent quality of life",
      good: "0.65-0.84: Good quality of life",
      fair: "0.40-0.64: Fair quality of life",
      poor: "-0.594-0.39: Poor quality of life",
    },
    applicableTo: [
      "general-population",
      "chronic-disease",
      "cost-effectiveness-analysis",
    ],
    lastUpdated: new Date("2024-01-15"),
  },
];

// PT-Specific Measures
const ptMeasures: OutcomeMeasure[] = [
  {
    id: "lefs-001",
    name: "Lower Extremity Functional Scale",
    abbreviation: "LEFS",
    discipline: "pt",
    type: "functional",
    description:
      "Measures lower extremity function across 20 items related to daily activities and mobility",
    minScore: 0,
    maxScore: 80,
    scoringDirection: "higher-better",
    mcid: 9,
    adminTime: 10,
    source: "APTA",
    citation:
      "Binkley JM, et al. The Lower Extremity Functional Scale (LEFS): scale development, measurement properties, and clinical application. Phys Ther. 1999;79(4):371-383.",
    scoringRules: "Each item scored 0-4 based on difficulty level",
    interpretation: {
      excellent: "70-80: Minimal disability",
      good: "56-69: Mild disability",
      fair: "41-55: Moderate disability",
      poor: "0-40: Severe disability",
    },
    applicableTo: [
      "lower-extremity-injury",
      "orthopedic-rehabilitation",
      "sports-medicine",
    ],
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "dash-001",
    name: "Disabilities of Arm, Shoulder and Hand",
    abbreviation: "DASH",
    discipline: "pt",
    type: "functional",
    description:
      "Measures upper extremity function across 30 items related to arm, shoulder, and hand disability",
    minScore: 0,
    maxScore: 100,
    scoringDirection: "lower-better",
    mcid: 15,
    adminTime: 10,
    source: "APTA",
    citation:
      "Hudak PL, et al. Development of an upper extremity outcome measure: the DASH (disabilities of the arm, shoulder and hand). Am J Ind Med. 1996;29(6):602-608.",
    scoringRules: "Raw score converted to 0-100 scale",
    interpretation: {
      excellent: "0-20: Minimal disability",
      good: "21-40: Mild disability",
      fair: "41-60: Moderate disability",
      poor: "61-100: Severe disability",
    },
    applicableTo: ["upper-extremity-injury", "shoulder-pain", "hand-therapy"],
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "odi-001",
    name: "Oswestry Disability Index",
    abbreviation: "ODI",
    discipline: "pt",
    type: "functional",
    description:
      "Measures low back pain disability across 10 items related to pain intensity and functional limitations",
    minScore: 0,
    maxScore: 100,
    scoringDirection: "lower-better",
    mcid: 10,
    adminTime: 5,
    source: "APTA",
    citation:
      "Fairbank JC, Pynsent PB. The Oswestry Disability Index. Spine (Phila Pa 1976). 2000;25(22):2940-2952.",
    scoringRules: "Raw score converted to percentage disability",
    interpretation: {
      excellent: "0-20: Minimal disability",
      good: "21-40: Mild disability",
      fair: "41-60: Moderate disability",
      poor: "61-100: Severe disability",
    },
    applicableTo: [
      "low-back-pain",
      "lumbar-spine",
      "orthopedic-rehabilitation",
    ],
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "berg-001",
    name: "Berg Balance Scale",
    abbreviation: "BBS",
    discipline: "pt",
    type: "balance",
    description:
      "Measures static and dynamic balance across 14 items including sitting, standing, transfers, and reaching",
    minScore: 0,
    maxScore: 56,
    scoringDirection: "higher-better",
    mcid: 4,
    adminTime: 20,
    source: "APTA",
    citation:
      "Berg KO, et al. Measuring balance in the elderly: validation of an instrument. Can J Public Health. 1992;83 Suppl 2:S7-11.",
    scoringRules: "Each item scored 0-4 based on ability to perform task",
    interpretation: {
      excellent: "46-56: Low fall risk",
      good: "40-45: Medium fall risk",
      fair: "21-39: High fall risk",
      poor: "0-20: Very high fall risk",
    },
    applicableTo: [
      "fall-prevention",
      "balance-disorder",
      "geriatric",
      "neurological",
    ],
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "tug-001",
    name: "Timed Up and Go",
    abbreviation: "TUG",
    discipline: "pt",
    type: "functional",
    description:
      "Measures mobility and fall risk by timing how long it takes to stand from chair, walk 3 meters, turn, and return",
    minScore: 0,
    maxScore: 300,
    scoringDirection: "lower-better",
    mcid: 4,
    adminTime: 5,
    source: "APTA",
    citation:
      'Podsiadlo D, Richardson S. The timed "Up & Go": a test of basic functional mobility for frail elderly persons. J Am Geriatr Soc. 1991;39(2):142-148.',
    scoringRules: "Time in seconds to complete task",
    interpretation: {
      excellent: "0-12: Low fall risk",
      good: "13-20: Medium fall risk",
      fair: "21-30: High fall risk",
      poor: ">30: Very high fall risk",
    },
    applicableTo: ["fall-prevention", "mobility", "geriatric", "neurological"],
    lastUpdated: new Date("2024-01-15"),
  },
];

// OT-Specific Measures
const otMeasures: OutcomeMeasure[] = [
  {
    id: "copm-001",
    name: "Canadian Occupational Performance Measure",
    abbreviation: "COPM",
    discipline: "ot",
    type: "occupational",
    description:
      "Measures client-identified occupational performance and satisfaction across self-care, productivity, and leisure",
    minScore: 1,
    maxScore: 10,
    scoringDirection: "higher-better",
    mcid: 2,
    adminTime: 30,
    source: "AOTA",
    citation:
      "Law M, et al. The Canadian Occupational Performance Measure: an outcome measure for occupational therapy. Can J Occup Ther. 1990;57(2):82-87.",
    url: "https://www.thecopm.com/",
    scoringRules:
      "Client rates performance and satisfaction on 1-10 scale for identified occupations",
    interpretation: {
      excellent: "8-10: High performance and satisfaction",
      good: "6-7: Moderate performance and satisfaction",
      fair: "4-5: Low performance and satisfaction",
      poor: "1-3: Very low performance and satisfaction",
    },
    applicableTo: [
      "occupational-performance",
      "client-centered-care",
      "all-diagnoses",
    ],
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "amps-001",
    name: "Assessment of Motor and Process Skills",
    abbreviation: "AMPS",
    discipline: "ot",
    type: "motor",
    description:
      "Measures motor and process skills during performance of ADL tasks",
    minScore: 0,
    maxScore: 4,
    scoringDirection: "higher-better",
    mcid: 0.5,
    adminTime: 45,
    source: "AOTA",
    citation:
      "Fisher AG. Assessment of Motor and Process Skills. 3rd ed. Fort Collins, CO: Three Star Press; 1999.",
    scoringRules:
      "Motor and process skills rated on 4-point scale during task performance",
    interpretation: {
      excellent: "3.0-4.0: Competent skill performance",
      good: "2.0-2.9: Adequate skill performance",
      fair: "1.0-1.9: Ineffective skill performance",
      poor: "0-0.9: Markedly ineffective skill performance",
    },
    applicableTo: [
      "motor-skills",
      "process-skills",
      "cognitive-assessment",
      "functional-capacity",
    ],
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "sensory-profile-001",
    name: "Sensory Profile",
    abbreviation: "SP",
    discipline: "ot",
    type: "sensory",
    description:
      "Measures sensory processing patterns across auditory, visual, vestibular, touch, taste/smell, and activity level",
    minScore: 125,
    maxScore: 625,
    scoringDirection: "higher-better",
    mcid: 50,
    adminTime: 15,
    source: "AOTA",
    citation:
      "Dunn W. The Sensory Profile: User's Manual. San Antonio, TX: The Psychological Corporation; 1999.",
    scoringRules: "Items scored 1-5 based on frequency of sensory response",
    interpretation: {
      excellent: "500-625: Typical sensory processing",
      good: "375-499: Probable difference in sensory processing",
      fair: "250-374: Definite difference in sensory processing",
      poor: "125-249: Significant sensory processing disorder",
    },
    applicableTo: [
      "sensory-processing",
      "autism-spectrum-disorder",
      "developmental-delay",
      "sensory-integration",
    ],
    lastUpdated: new Date("2024-01-15"),
  },
];

// Combined library
const allMeasures: OutcomeMeasure[] = [
  ...sharedMeasures,
  ...ptMeasures,
  ...otMeasures,
];

/**
 * Get measure by ID
 */
export function getMeasureById(id: string): OutcomeMeasure | undefined {
  return allMeasures.find((m) => m.id === id);
}

/**
 * Get all measures for a discipline
 */
export function getMeasuresByDiscipline(
  discipline: Discipline,
): OutcomeMeasure[] {
  if (discipline === "shared") {
    return sharedMeasures;
  }
  return allMeasures.filter(
    (m) => m.discipline === discipline || m.discipline === "shared",
  );
}

/**
 * Get measures by type
 */
export function getMeasuresByType(type: MeasureType): OutcomeMeasure[] {
  return allMeasures.filter((m) => m.type === type);
}

/**
 * Get measures applicable to a condition
 */
export function getMeasuresForCondition(condition: string): OutcomeMeasure[] {
  return allMeasures.filter((m) => m.applicableTo.includes(condition));
}

/**
 * Search measures by name or abbreviation
 */
export function searchMeasures(query: string): OutcomeMeasure[] {
  const lowerQuery = query.toLowerCase();
  return allMeasures.filter(
    (m) =>
      m.name.toLowerCase().includes(lowerQuery) ||
      m.abbreviation.toLowerCase().includes(lowerQuery),
  );
}

/**
 * Get all shared measures
 */
export function getSharedMeasures(): OutcomeMeasure[] {
  return sharedMeasures;
}

/**
 * Get all PT measures
 */
export function getPTMeasures(): OutcomeMeasure[] {
  return ptMeasures;
}

/**
 * Get all OT measures
 */
export function getOTMeasures(): OutcomeMeasure[] {
  return otMeasures;
}

/**
 * Get all measures
 */
export function getAllMeasures(): OutcomeMeasure[] {
  return allMeasures;
}

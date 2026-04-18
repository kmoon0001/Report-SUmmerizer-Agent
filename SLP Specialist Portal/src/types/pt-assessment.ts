/**
 * PT Assessment Data Structures
 *
 * Defines TypeScript interfaces for Physical Therapy assessment data
 * Requirements: 1.4, 6.1, 6.2
 *
 * Includes:
 * - ROM (Range of Motion) assessments
 * - Strength assessments (Manual Muscle Testing)
 * - Gait assessments
 * - Balance assessments
 * - Outcome measures
 */

// ============================================================================
// Body Region Types
// ============================================================================

export type BodyRegion =
  | "cervical-spine"
  | "thoracic-spine"
  | "lumbar-spine"
  | "shoulder"
  | "elbow"
  | "wrist"
  | "hand"
  | "hip"
  | "knee"
  | "ankle"
  | "foot";

export type JointMovement =
  | "flexion"
  | "extension"
  | "abduction"
  | "adduction"
  | "internal-rotation"
  | "external-rotation"
  | "pronation"
  | "supination"
  | "dorsiflexion"
  | "plantarflexion"
  | "inversion"
  | "eversion"
  | "lateral-flexion"
  | "rotation";

// ============================================================================
// ROM Assessment
// ============================================================================

export interface ROMAssessment {
  bodyRegion: BodyRegion;
  movement: JointMovement;
  activeDegrees: number;
  passiveDegrees: number;
  normalRange: {
    min: number;
    max: number;
  };
  painLevel?: number | undefined; // 0-10 scale
  endFeel?: "normal" | "hard" | "soft" | "firm" | "empty" | "springy" | undefined;
  limitations?: string | undefined;
  measuredBy: "goniometer" | "inclinometer" | "visual-estimate";
  assessmentDate: string;
}

// ============================================================================
// Strength Assessment (Manual Muscle Testing)
// ============================================================================

export type MMTGrade = 0 | 1 | 2 | 3 | 4 | 5;

export interface StrengthAssessment {
  bodyRegion: BodyRegion;
  muscle: string;
  grade: MMTGrade;
  gradeDescription: string; // e.g., "5/5 - Normal strength"
  side: "left" | "right" | "bilateral";
  painDuringTest: boolean;
  compensations?: string | undefined;
  assessmentDate: string;
}

// ============================================================================
// Gait Assessment
// ============================================================================

export type GaitDeviation =
  | "antalgic"
  | "trendelenburg"
  | "steppage"
  | "circumduction"
  | "scissoring"
  | "ataxic"
  | "parkinsonian"
  | "hemiplegic";

export type AssistiveDevice =
  | "none"
  | "cane"
  | "quad-cane"
  | "walker"
  | "rolling-walker"
  | "crutches"
  | "wheelchair";

export interface GaitAssessment {
  speed: number; // meters per second
  cadence: number; // steps per minute
  strideLength: number; // centimeters
  deviations: GaitDeviation[];
  assistiveDevice: AssistiveDevice;
  weightBearingStatus?:
    | "full"
    | "partial"
    | "non-weight-bearing"
    | "touch-down"
    | undefined;
  balance: "good" | "fair" | "poor";
  endurance: string; // e.g., "50 feet with rest breaks"
  assessmentDate: string;
}

// ============================================================================
// Balance Assessment
// ============================================================================

export interface BalanceAssessment {
  testName: string; // e.g., "Berg Balance Scale", "Timed Up and Go"
  score: number;
  maxScore: number;
  interpretation: string;
  fallRisk: "low" | "moderate" | "high";
  recommendations: string[];
  assessmentDate: string;
}

// ============================================================================
// Specialized Clinical Assessments
// ============================================================================

export interface STEADIAssessment {
  // Key Screening Questions
  hasFallen: boolean;
  feelsUnsteady: boolean;
  worriesAboutFalling: boolean;

  // Gait, Strength & Balance Tests
  tugScore?: number | undefined; // Timed Up and Go (seconds)
  thirtySecondChairStand?: number | undefined; // Number of stands
  fourStageBalance?: {
    feetTogether: boolean;
    semiTandem: boolean;
    tandem: boolean;
    singleLeg: number; // seconds
  } | undefined;

  // Additional Risk Factors
  age: number;
  historyOfFalls: number; // Number of falls in past year
  medications: string[];
  visionProblems: boolean;
  footProblems: boolean;
  homeHazards: boolean;
  fearOfFalling: boolean;

  // Optional: Berg Balance Scale score
  bergBalanceScore?: number | undefined; // 0-56
}

export interface BergBalanceScale {
  sittingToStanding: number;
  standingUnsupported: number;
  sittingUnsupported: number;
  standingToSitting: number;
  transfers: number;
  standingEyesClosed: number;
  standingFeetTogether: number;
  reachingForward: number;
  pickUpFromFloor: number;
  turningToLookBehind: number;
  turning360: number;
  placingFootOnStool: number;
  standingTandem: number;
  standingOneFoot: number;
}

export interface FuglMeyerAssessment {
  upperExtremity: {
    shoulderElbowForearm: number;
    wrist: number;
    hand: number;
    coordination: number;
  };
  lowerExtremity: {
    hipKneeAnkle: number;
    coordination: number;
  };
  balance: number;
  sensation: number;
  passiveROM: number;
  pain: number;
}

export interface FunctionalMobilityAssessment {
  transferBedToChair:
    | "independent"
    | "supervision"
    | "minimal-assist"
    | "moderate-assist"
    | "maximal-assist"
    | "dependent";
  ambulation:
    | "independent"
    | "supervision"
    | "minimal-assist"
    | "moderate-assist"
    | "maximal-assist"
    | "dependent";
  stairs:
    | "independent"
    | "supervision"
    | "minimal-assist"
    | "moderate-assist"
    | "maximal-assist"
    | "dependent";
  toileting:
    | "independent"
    | "supervision"
    | "minimal-assist"
    | "moderate-assist"
    | "maximal-assist"
    | "dependent";
  bathing:
    | "independent"
    | "supervision"
    | "minimal-assist"
    | "moderate-assist"
    | "maximal-assist"
    | "dependent";
}

// ============================================================================
// Outcome Measures
// ============================================================================

export type OutcomeMeasureType =
  | "DASH" // Disabilities of the Arm, Shoulder and Hand
  | "LEFS" // Lower Extremity Functional Scale
  | "ODI" // Oswestry Disability Index
  | "NDI" // Neck Disability Index
  | "PSFS" // Patient-Specific Functional Scale
  | "BBS" // Berg Balance Scale
  | "TUG" // Timed Up and Go
  | "FMA" // Fugl-Meyer Assessment
  | "FIM" // Functional Independence Measure
  | "GMFM"; // Gross Motor Function Measure

export interface OutcomeMeasure {
  type: OutcomeMeasureType;
  score: number;
  maxScore: number;
  percentageScore: number;
  interpretation: string;
  mcid?: number | undefined; // Minimal Clinically Important Difference
  assessmentDate: string;
  previousScore?: number | undefined;
  changeFromPrevious?: number | undefined;
}

// ============================================================================
// Comprehensive PT Assessment
// ============================================================================

export interface PTAssessmentFindings {
  patientId: string;
  assessmentDate: string;
  chiefComplaint: string;
  subjective: {
    painLevel: number; // 0-10 scale
    painLocation: string[];
    functionalLimitations: string[];
    goals: string[];
  };
  objective: {
    rom: ROMAssessment[];
    strength: StrengthAssessment[];
    gait?: GaitAssessment | undefined;
    balance?: BalanceAssessment | undefined;
    outcomeMeasures: OutcomeMeasure[];
    specialTests?: {
      testName: string;
      result: "positive" | "negative" | "inconclusive";
      interpretation: string;
    }[] | undefined;
  };
  assessment: {
    diagnosis: string;
    icdCode?: string | undefined;
    prognosis: string;
    rehabilitationPotential: "excellent" | "good" | "fair" | "poor";
  };
  plan: {
    frequency: string; // e.g., "3x/week for 6 weeks"
    duration: string; // e.g., "6 weeks"
    interventions: string[];
    goals: string[];
  };
}

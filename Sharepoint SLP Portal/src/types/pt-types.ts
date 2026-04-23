/**
 * Physical Therapy Specific Types
 *
 * TypeScript interfaces and types for PT clinical domains, assessments,
 * exercises, documentation, and compliance.
 *
 * All types follow strict TypeScript standards and reference authoritative
 * PT sources: APTA, CMS, Medicare, Noridian, state PT boards, ABPTS.
 */

// ============================================================================
// PT Clinical Domains
// ============================================================================

export type PTDomain =
  | "orthopedic"
  | "neurological"
  | "geriatric"
  | "cardiopulmonary"
  | "vestibular"
  | "sports"
  | "pelvic-health"
  | "wound-care"
  | "pediatric";

export type FunctionalLevel =
  | "independent"
  | "modified-independent"
  | "supervision"
  | "minimal-assist"
  | "moderate-assist"
  | "maximal-assist"
  | "dependent";

export type BodyRegion =
  | "cervical-spine"
  | "thoracic-spine"
  | "lumbar-spine"
  | "shoulder"
  | "elbow"
  | "wrist-hand"
  | "hip"
  | "knee"
  | "ankle-foot";

// ============================================================================
// PT Assessment Data Structures
// ============================================================================

export interface PTAssessmentFindings {
  // Subjective
  chiefComplaint: string;
  painLevel: number; // 0-10 NPRS
  painLocation: BodyRegion[];
  functionalLimitations: string[];
  priorLevelOfFunction: string;
  patientGoals: string[];

  // Objective
  vitals?: VitalSigns;
  posture?: PosturalAssessment;
  rom?: ROMAssessment[];
  strength?: StrengthAssessment[];
  gait?: GaitAssessment;
  balance?: BalanceAssessment;
  specialTests?: SpecialTest[];
  palpation?: PalpationFindings;

  // Outcome Measures
  outcomeMeasures?: OutcomeMeasure[];
}

export interface VitalSigns {
  heartRate?: number; // bpm
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  respiratoryRate?: number; // breaths/min
  oxygenSaturation?: number; // %
  temperature?: number; // °F
}

export interface PosturalAssessment {
  head: string;
  shoulders: string;
  spine: string;
  pelvis: string;
  knees: string;
  feet: string;
}

export interface ROMAssessment {
  joint: string; // "Right Shoulder"
  motion: string; // "Flexion", "Abduction", etc.
  activeDegrees: number;
  passiveDegrees: number;
  painWithMotion: boolean;
  endFeel?: "normal" | "hard" | "soft" | "firm" | "empty";
}

export interface StrengthAssessment {
  muscle: string; // "Right Deltoid"
  grade: 0 | 1 | 2 | 3 | 4 | 5; // Manual Muscle Testing 0-5 scale
  painWithResistance: boolean;
}

export interface GaitAssessment {
  assistiveDevice?: "none" | "cane" | "walker" | "crutches" | "wheelchair";
  gaitSpeed?: number; // meters/second
  cadence?: number; // steps/minute
  strideLength?: number; // meters
  deviations: GaitDeviation[];
  tugScore?: number; // Timed Up and Go (seconds)
  sixMinuteWalkDistance?: number; // meters
}

export interface GaitDeviation {
  phase:
    | "initial-contact"
    | "loading-response"
    | "mid-stance"
    | "terminal-stance"
    | "pre-swing"
    | "initial-swing"
    | "mid-swing"
    | "terminal-swing";
  deviation: string;
  side: "left" | "right" | "bilateral";
}

export interface BalanceAssessment {
  bergBalanceScore?: number; // 0-56
  functionalReachDistance?: number; // inches
  singleLegStance?: {
    left: number; // seconds
    right: number; // seconds
  };
  rombergTest?: "negative" | "positive";
}

export interface SpecialTest {
  name: string; // "Neer's Test", "Lachman Test"
  result: "positive" | "negative" | "inconclusive";
  side: "left" | "right" | "bilateral";
  notes?: string;
}

export interface PalpationFindings {
  location: string;
  findings: string; // "Tenderness", "Swelling", "Heat"
  severity?: "mild" | "moderate" | "severe";
}

export interface OutcomeMeasure {
  name: string; // "DASH", "LEFS", "ODI", etc.
  score: number;
  maxScore: number;
  interpretation: string;
  date: Date;
  mcid?: number; // Minimal Clinically Important Difference
}

// ============================================================================
// Exercise Prescription
// ============================================================================

export type ExerciseCategory =
  | "strengthening"
  | "stretching"
  | "balance"
  | "coordination"
  | "cardiovascular"
  | "functional"
  | "plyometric"
  | "aquatic";

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  bodyRegion: BodyRegion;
  description: string;
  sets: number;
  reps: number | string; // "10" or "2 minutes"
  hold?: number; // seconds
  frequency: string; // "3x/day", "Daily", etc.
  videoUrl?: string;
  imageUrl?: string;
  modifications?: string[];
  progressions?: string[];
  evidenceLevel?: 1 | 2 | 3 | 4 | 5;
}

export interface ExercisePrescription {
  exercises: Exercise[];
  homeExerciseProgram: HomeExerciseProgram;
  progressionCriteria: string[];
  precautions: string[];
  contraindications: string[];
}

export interface HomeExerciseProgram {
  exercises: Exercise[];
  frequency: string;
  duration: string; // "4 weeks"
  complianceTracking: boolean;
  patientHandoutUrl?: string;
}

// ============================================================================
// Clinical Pathways
// ============================================================================

export interface ClinicalPathway {
  id: string;
  condition: string; // "Post-Total Knee Arthroplasty"
  phases: PathwayPhase[];
  expectedOutcomes: ExpectedOutcome[];
  redFlags: RedFlag[];
  evidenceSources: AICitation[];
}

export interface PathwayPhase {
  name: string; // "Acute Phase (0-2 weeks)"
  timeframe: string;
  goals: string[];
  interventions: Intervention[];
  progressionCriteria: string[];
  dischargeCriteria?: string[];
}

export interface Intervention {
  type:
    | "manual-therapy"
    | "therapeutic-exercise"
    | "modality"
    | "education"
    | "gait-training"
    | "neuromuscular-reeducation";
  description: string;
  frequency: string;
  duration: string;
  cptCode?: string; // "97110", "97140", etc.
}

export interface ExpectedOutcome {
  outcome: string;
  timeframe: string;
  evidenceLevel: 1 | 2 | 3 | 4 | 5;
}

export interface RedFlag {
  symptom: string;
  action: string;
  urgency: "immediate" | "urgent" | "routine";
}

export interface AICitation {
  source: string;
  citation?: string;
  url?: string;
  relevance: string;
  evidenceLevel?: 1 | 2 | 3 | 4 | 5;
}

// ============================================================================
// Documentation & Compliance
// ============================================================================

export interface PTDocumentationNote {
  type: "initial-eval" | "progress-note" | "discharge-summary" | "daily-note";
  date: Date;

  // Subjective
  subjective: {
    chiefComplaint: string;
    painLevel: number;
    functionalStatus: string;
    patientGoals: string[];
  };

  // Objective
  objective: {
    vitals?: VitalSigns;
    assessmentFindings: PTAssessmentFindings;
    interventionsProvided: Intervention[];
    response: string;
  };

  // Assessment
  assessment: {
    clinicalImpression: string;
    progressTowardGoals: string;
    barriers: string[];
    prognosis: string;
  };

  // Plan
  plan: {
    frequency: string;
    duration: string;
    interventions: string[];
    homeExerciseProgram: boolean;
    nextVisitFocus: string[];
    anticipatedDischarge: string;
  };

  // Compliance
  skilledNeedJustification: string;
  medicalNecessity: string;
  cptCodes: string[];

  // Metadata
  therapistSignature: string;
  supervisionType?: "PT" | "PTA-supervised";
  coSignatureRequired: boolean;
}

export interface MedicareComplianceCheck {
  passed: boolean;
  flags: ComplianceFlag[];
  skilledNeedJustification: SkilledNeedAnalysis;
  documentationQuality: DocumentationQualityScore;
  cptCodeRecommendations: CPTCodeRecommendation[];
}

export interface ComplianceFlag {
  id: string;
  severity: "critical" | "warning" | "info";
  category: "skilled-need" | "medical-necessity" | "documentation" | "billing";
  message: string;
  evidence: string[];
  suggestedAction: string;
  regulation: string; // "Medicare Benefit Policy Manual Chapter 15"
}

export interface SkilledNeedAnalysis {
  hasSkillLanguage: boolean;
  skillIndicators: string[];
  missingElements: string[];
  recommendations: string[];
}

export interface DocumentationQualityScore {
  overallScore: number; // 0-100
  objectiveDataPresent: boolean;
  functionalOutcomesDocumented: boolean;
  clinicalReasoningEvident: boolean;
  progressTowardGoals: boolean;
  flaggedPhrases: FlaggedPhrase[];
}

export interface FlaggedPhrase {
  phrase: string;
  reason: string;
  suggestion: string;
  severity: "critical" | "warning" | "suggestion";
}

export interface CPTCodeRecommendation {
  code: string;
  description: string;
  rationale: string;
  timeUnits?: number;
  confidence: number; // 0-1
}

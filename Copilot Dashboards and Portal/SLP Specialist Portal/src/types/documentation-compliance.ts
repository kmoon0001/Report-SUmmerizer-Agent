/**
 * Documentation and Compliance Interfaces
 *
 * Defines TypeScript interfaces for PT documentation and Medicare compliance
 * Requirements: 3.1, 3.2, 8.1, 8.2
 *
 * Includes:
 * - SOAP note structure
 * - Medicare compliance checking
 * - CPT code recommendations
 * - Documentation quality metrics
 */

// ============================================================================
// Note Types
// ============================================================================

export type NoteType =
  | "initial-evaluation"
  | "progress-note"
  | "daily-note"
  | "discharge-summary"
  | "recertification";

// ============================================================================
// SOAP Note Structure
// ============================================================================

export interface SOAPNote {
  subjective: {
    chiefComplaint: string;
    painLevel: number; // 0-10
    painLocation: string[];
    functionalLimitations: string[];
    patientGoals: string[];
    priorLevelOfFunction: string;
    medicalHistory?: string;
  };
  objective: {
    vitalSigns?: {
      bloodPressure?: string;
      heartRate?: number;
      respiratoryRate?: number;
    };
    observation: string;
    palpation?: string;
    rom?: string;
    strength?: string;
    gait?: string;
    balance?: string;
    specialTests?: string;
    functionalTests?: string;
    outcomeMeasures?: string;
    timeSpent?: number;
  };
  assessment: {
    clinicalImpression: string;
    diagnosis: string;
    icdCode: string;
    prognosis: string;
    rehabilitationPotential: "excellent" | "good" | "fair" | "poor";
    progressTowardGoals: string;
    clinicalReasoning: string;
  };
  plan: {
    interventions: string[];
    frequency: string;
    duration: string;
    shortTermGoals: string[];
    longTermGoals: string[];
    patientEducation: string;
    homeExerciseProgram?: string;
    nextVisit?: string;
  };
}

// ============================================================================
// PT Documentation Note
// ============================================================================

export interface PTDocumentationNote {
  noteId: string;
  patientId: string;
  noteType: NoteType;
  dateOfService: string;
  therapistId: string;
  therapistName: string;
  soap: SOAPNote;
  cptCodes: CPTCodeRecommendation[];
  totalUnits: number;
  totalMinutes: number;
  skilledNeedJustification: string;
  complianceFlags: ComplianceFlag[];
  qualityScore: number; // 0-100
  status: "draft" | "finalized" | "signed";
  signedDate?: string;
  signedBy?: string;
}

// ============================================================================
// CPT Code Recommendation
// ============================================================================

export interface CPTCodeRecommendation {
  code: string;
  description: string;
  units: number;
  minutes: number;
  intervention: string;
  rationale: string;
  medicareAllowed: boolean;
  requiresModifier?: string;
}

// ============================================================================
// Medicare Compliance
// ============================================================================

export type ComplianceSeverity = "critical" | "warning" | "info";

export interface ComplianceFlag {
  severity: ComplianceSeverity;
  category:
    | "skilled-need"
    | "objective-data"
    | "vague-language"
    | "medical-necessity"
    | "documentation-quality";
  message: string;
  regulation: string; // e.g., "CMS Chapter 15, Section 220.2"
  suggestion: string;
  location: "subjective" | "objective" | "assessment" | "plan";
}

export interface MedicareComplianceCheck {
  noteId: string;
  checkDate: string;
  overallCompliance: "compliant" | "needs-review" | "non-compliant";
  flags: ComplianceFlag[];
  skilledNeedPresent: boolean;
  objectiveDataPresent: boolean;
  vagueLanguageDetected: string[]; // e.g., ["continue", "tolerated well"]
  medicalNecessityJustified: boolean;
  recommendations: string[];
}

// ============================================================================
// Documentation Quality Metrics
// ============================================================================

export interface DocumentationQualityMetrics {
  noteId: string;
  overallScore: number; // 0-100
  shapValues: Record<string, number>; // Contribution of each component/check to the final score
  components: {
    subjectiveQuality: number; // 0-100
    objectiveQuality: number; // 0-100
    assessmentQuality: number; // 0-100
    planQuality: number; // 0-100
  };
  strengths: string[];
  areasForImprovement: string[];
  missingElements: string[];
  complianceScore: number; // 0-100
}

// ============================================================================
// Vague Language Detection
// ============================================================================

export const VAGUE_LANGUAGE_PATTERNS = [
  "continue",
  "tolerated well",
  "as tolerated",
  "patient did well",
  "good session",
  "progressing",
  "improving",
  "maintain",
  "same as last time",
] as const;

export type VagueLanguagePattern = (typeof VAGUE_LANGUAGE_PATTERNS)[number];

export interface VagueLanguageDetection {
  pattern: VagueLanguagePattern;
  location: string;
  context: string;
  suggestion: string;
}

// ============================================================================
// Skilled Need Justification
// ============================================================================

export interface SkilledNeedJustification {
  intervention: string;
  skilledRationale: string;
  complexity: string;
  clinicalJudgment: string;
  patientResponse: string;
  progressionPlan: string;
}

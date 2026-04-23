/**
 * OT Assessment Data Structures
 *
 * Defines TypeScript interfaces for Occupational Therapy assessments
 * Based on AOTA standards and Medicare Part B requirements
 * Requirements: 3.1, 3.2, 3.3
 */

// ============================================================================
// OT-Specific Types
// ============================================================================

export type OTDomain =
  | "hand-therapy"
  | "adl-training"
  | "cognitive-rehab"
  | "work-conditioning"
  | "mental-health"
  | "pediatric-dev"
  | "sensory-integration"
  | "community-reintegration"
  | "leisure";

export type FunctionalLevel =
  | "independent"
  | "modified-independent"
  | "supervision"
  | "minimal-assist"
  | "moderate-assist"
  | "maximal-assist"
  | "dependent";

export type ADLCategory =
  | "self-care"
  | "mobility"
  | "communication"
  | "social-cognition";

export type ADLActivity =
  | "eating"
  | "grooming"
  | "bathing"
  | "dressing"
  | "toileting"
  | "bladder-management"
  | "bowel-management"
  | "transfers"
  | "locomotion"
  | "comprehension"
  | "expression"
  | "social-interaction"
  | "problem-solving"
  | "memory";

export type COMPMPerformanceArea = "self-care" | "productivity" | "leisure";

export type COMPMScore = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type FIMScore = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type EvidenceLevel = 1 | 2 | 3 | 4 | 5;

// ============================================================================
// Occupational Profile
// ============================================================================

export interface OccupationalProfile {
  occupationalHistory: string;
  occupationalPatterns: string[];
  occupationalRoles: string[];
  occupationalRoutines: string[];
  clientGoals: string[];
  priorities: string[];
  barriers: string[];
  facilitators: string[];
  contextualFactors: string[];
}

// ============================================================================
// COPM Assessment (Canadian Occupational Performance Measure)
// ============================================================================

export interface COMPMIssue {
  id: string;
  description: string;
  performanceArea: COMPMPerformanceArea;
  performanceScore: COMPMScore;
  satisfactionScore: COMPMScore;
  priority: number;
}

export interface COMPMAssessment {
  id: string;
  clientId: string;
  assessmentDate: Date;
  issues: COMPMIssue[];
  totalPerformanceScore: number;
  totalSatisfactionScore: number;
  notes: string;
  evidenceLevel: EvidenceLevel;
  citation: string;
}

// ============================================================================
// FIM Assessment (Functional Independence Measure)
// ============================================================================

export interface FIMItem {
  activity: ADLActivity;
  category: ADLCategory;
  score: FIMScore;
  scoreDescription: string;
}

export interface FIMAssessment {
  id: string;
  clientId: string;
  assessmentDate: Date;
  items: FIMItem[];
  selfCareTotal: number;
  mobilityTotal: number;
  communicationTotal: number;
  socialCognitionTotal: number;
  grandTotal: number;
  notes: string;
  evidenceLevel: EvidenceLevel;
  citation: string;
}

// ============================================================================
// Functional Independence Assessment
// ============================================================================

export interface ADLIndependenceItem {
  activity: ADLActivity;
  functionalLevel: FunctionalLevel;
  adaptiveEquipmentNeeded: string[];
  assistanceRequired: string;
  safetyConsiderations: string;
}

export interface ADLIndependenceAssessment {
  id: string;
  clientId: string;
  assessmentDate: Date;
  items: ADLIndependenceItem[];
  overallFunctionalLevel: FunctionalLevel;
  adaptiveEquipmentRecommendations: string[];
  environmentalModifications: string[];
  trainingNeeds: string[];
  notes: string;
  evidenceLevel: EvidenceLevel;
}

// ============================================================================
// Cognitive Assessment
// ============================================================================

export interface CognitiveScreeningItem {
  domain: string;
  test: string;
  score: number;
  maxScore: number;
  interpretation: string;
}

export interface CognitiveScreeningAssessment {
  id: string;
  clientId: string;
  assessmentDate: Date;
  items: CognitiveScreeningItem[];
  overallCognitiveStatus: string;
  areasOfStrength: string[];
  areasOfConcern: string[];
  recommendations: string[];
  notes: string;
  evidenceLevel: EvidenceLevel;
}

// ============================================================================
// Hand Function Assessment
// ============================================================================

export interface HandFunctionItem {
  test: string;
  leftHand: number;
  rightHand: number;
  normalRange: {
    min: number;
    max: number;
  };
  interpretation: string;
}

export interface HandFunctionAssessment {
  id: string;
  clientId: string;
  assessmentDate: Date;
  items: HandFunctionItem[];
  dominantHand: "left" | "right";
  overallHandFunction: string;
  limitations: string[];
  recommendations: string[];
  notes: string;
  evidenceLevel: EvidenceLevel;
}

// ============================================================================
// Sensory Processing Assessment
// ============================================================================

export interface SensoryProcessingItem {
  sensorySystem: string;
  response: string;
  score: number;
  interpretation: string;
}

export interface SensoryProcessingAssessment {
  id: string;
  clientId: string;
  assessmentDate: Date;
  items: SensoryProcessingItem[];
  sensoryProfile: string;
  sensoryDiet: string[];
  environmentalModifications: string[];
  recommendations: string[];
  notes: string;
  evidenceLevel: EvidenceLevel;
}

// ============================================================================
// Work Capacity Assessment
// ============================================================================

export interface WorkCapacityItem {
  domain: string;
  assessment: string;
  result: string;
  interpretation: string;
}

export interface WorkCapacityAssessment {
  id: string;
  clientId: string;
  assessmentDate: Date;
  items: WorkCapacityItem[];
  workCapacityLevel: string;
  jobDemands: string[];
  clientCapabilities: string[];
  gaps: string[];
  accommodations: string[];
  recommendations: string[];
  notes: string;
  evidenceLevel: EvidenceLevel;
}

// ============================================================================
// Comprehensive OT Assessment
// ============================================================================

export interface OTAssessmentFindings {
  id: string;
  clientId: string;
  discipline: "ot";
  assessmentDate: Date;

  // Core assessments
  occupationalProfile: OccupationalProfile;
  copm?: COMPMAssessment;
  fim?: FIMAssessment;
  adlIndependence?: ADLIndependenceAssessment;

  // Specialized assessments
  cognitive?: CognitiveScreeningAssessment;
  handFunction?: HandFunctionAssessment;
  sensoryProcessing?: SensoryProcessingAssessment;
  workCapacity?: WorkCapacityAssessment;

  // Summary
  primaryConcerns: string[];
  strengths: string[];
  functionalLimitations: string[];
  occupationalPerformanceIssues: string[];

  // Recommendations
  interventionRecommendations: string[];
  adaptiveEquipmentNeeds: string[];
  environmentalModifications: string[];
  trainingNeeds: string[];

  // Clinical notes
  clinicalImpression: string;
  prognosis: string;
  estimatedDurationOfServices: string;

  // Metadata
  assessedBy: string;
  supervisedBy?: string;
  nextReviewDate: Date;
  evidenceLevel: EvidenceLevel;
}

// ============================================================================
// Assessment Tool Definitions
// ============================================================================

export interface OTAssessmentTool {
  id: string;
  name: string;
  acronym: string;
  domain: OTDomain[];
  description: string;
  scoringRange: {
    min: number;
    max: number;
  };
  mcid: number; // Minimal Clinically Important Difference
  interpretation: (score: number) => string;
  evidenceLevel: EvidenceLevel;
  citation: string;
  adminTime: number; // minutes
  costPerAdmin: number; // dollars
}

// ============================================================================
// OT Outcome Measures
// ============================================================================

export interface OTOutcomeMeasure {
  id: string;
  name: string;
  acronym: string;
  domain: OTDomain[];
  description: string;
  scoringRange: {
    min: number;
    max: number;
  };
  mcid: number;
  interpretation: (score: number) => string;
  evidenceLevel: EvidenceLevel;
  citation: string;
}

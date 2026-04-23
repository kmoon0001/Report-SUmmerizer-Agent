/**
 * OT Intervention Type Definitions
 *
 * Defines TypeScript interfaces for Occupational Therapy interventions
 * Based on AOTA standards and evidence-based practice
 * Requirements: 3.4, 3.5, 3.6
 */

import type { OTDomain, EvidenceLevel } from "./ot-assessment";

// ============================================================================
// OT Intervention Types
// ============================================================================

export type InterventionCategory =
  | "therapeutic-exercise"
  | "adl-training"
  | "adaptive-equipment"
  | "cognitive-training"
  | "sensory-integration"
  | "work-conditioning"
  | "psychosocial-support"
  | "environmental-modification"
  | "splinting-orthotics"
  | "energy-conservation";

export type InterventionApproach =
  | "remedial"
  | "compensatory"
  | "preventive"
  | "maintenance"
  | "health-promotion";

export type ClientPopulation = "adult" | "pediatric" | "geriatric" | "all-ages";

// ============================================================================
// Intervention Definition
// ============================================================================

export interface OTIntervention {
  id: string;
  name: string;
  description: string;
  domain: OTDomain[];
  category: InterventionCategory;
  approach: InterventionApproach;
  clientPopulation: ClientPopulation[];
  indications: string[];
  contraindications: string[];
  precautions: string[];
  cptCode?: string;
  estimatedDuration: number; // minutes
  frequency: string; // e.g., "2-3x per week"
  duration?: string; // e.g., "4-8 weeks"
  expectedOutcomes: string[];
  materials: string[];
  instructions: string;
  modifications: string[];
  progressionCriteria: string[];
  evidenceLevel: EvidenceLevel;
  citation: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Intervention Plan
// ============================================================================

export interface InterventionGoal {
  id: string;
  description: string;
  measurable: boolean;
  timeframe: string;
  successCriteria: string[];
  priority: "high" | "medium" | "low";
}

export interface InterventionSession {
  id: string;
  interventionId: string;
  clientId: string;
  date: Date;
  duration: number; // minutes
  goals: InterventionGoal[];
  activitiesPerformed: string[];
  clientResponse: string;
  progressNotes: string;
  modifications: string[];
  homeProgram: string;
  nextSession: string;
  therapistNotes: string;
}

export interface InterventionPlan {
  id: string;
  clientId: string;
  discipline: "ot";
  startDate: Date;
  endDate?: Date;
  interventions: OTIntervention[];
  goals: InterventionGoal[];
  frequency: string;
  duration: string;
  expectedOutcomes: string[];
  homeProgram: string;
  familyEducation: string;
  progressMeasures: string[];
  reviewDate: Date;
  therapistId: string;
  status: "active" | "completed" | "on-hold" | "discontinued";
}

// ============================================================================
// Intervention Outcome Tracking
// ============================================================================

export interface InterventionOutcome {
  id: string;
  interventionPlanId: string;
  measureName: string;
  baselineScore: number;
  currentScore: number;
  targetScore: number;
  unit: string;
  measurementDate: Date;
  progress: "improved" | "stable" | "declined";
  percentageImprovement: number;
}

export interface InterventionProgress {
  id: string;
  interventionPlanId: string;
  sessionNumber: number;
  date: Date;
  goalsAchieved: string[];
  goalsInProgress: string[];
  goalsNotMet: string[];
  overallProgress: "excellent" | "good" | "fair" | "poor";
  recommendations: string[];
  nextSteps: string[];
}

// ============================================================================
// Home Program
// ============================================================================

export interface HomeProgramExercise {
  id: string;
  name: string;
  description: string;
  frequency: string; // e.g., "2x daily"
  duration: number; // minutes
  sets?: number;
  reps?: number;
  instructions: string;
  precautions: string[];
  progressionCriteria: string[];
  images?: string[];
  videos?: string[];
}

export interface HomeProgram {
  id: string;
  clientId: string;
  interventionPlanId: string;
  exercises: HomeProgramExercise[];
  schedule: string;
  adherenceTracking: boolean;
  educationMaterials: string[];
  familyInvolvement: string;
  modificationCriteria: string[];
  reviewDate: Date;
}

// ============================================================================
// Intervention Library Entry
// ============================================================================

export interface InterventionLibraryEntry {
  id: string;
  intervention: OTIntervention;
  tags: string[];
  relatedInterventions: string[];
  commonCombinations: string[];
  successRate: number; // percentage
  averageOutcome: string;
  clientFeedback: string;
  therapistNotes: string;
  lastUpdated: Date;
}

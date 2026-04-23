/**
 * Exercise Prescription Interfaces
 *
 * Defines TypeScript interfaces for exercise prescriptions and home exercise programs
 * Requirements: 4.1, 4.2, 4.3
 *
 * Includes:
 * - Exercise definitions with evidence levels
 * - Exercise prescriptions with dosage parameters
 * - Home Exercise Programs (HEP)
 * - Contraindications and precautions
 */

import { BodyRegion } from "./pt-assessment";

// ============================================================================
// Exercise Categories
// ============================================================================

export type ExerciseCategory =
  | "therapeutic-exercise" // CPT 97110
  | "manual-therapy" // CPT 97140
  | "gait-training" // CPT 97116
  | "neuromuscular-reeducation" // CPT 97112
  | "balance-training"
  | "strengthening"
  | "stretching"
  | "cardiovascular"
  | "functional-training"
  | "proprioception";

export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

export type EvidenceLevel = 1 | 2 | 3 | 4 | 5;

// ============================================================================
// Exercise Definition
// ============================================================================

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  bodyRegion: BodyRegion[];
  description: string;
  instructions: string[];
  videoUrl?: string;
  imageUrl?: string;
  difficulty: DifficultyLevel;
  evidenceLevel: EvidenceLevel; // 1 = highest, 5 = lowest (must be ≥3)
  evidenceSources: string[]; // Citations to APTA CPGs, research
  contraindications: string[];
  precautions: string[];
  modifications: {
    easier: string;
    harder: string;
  };
  equipment?: string[];
}

// ============================================================================
// Exercise Dosage Parameters
// ============================================================================

export interface ExerciseDosage {
  sets: number;
  repetitions: number;
  holdTime?: number; // seconds
  frequency: string; // e.g., "3x/day", "daily"
  duration?: string; // e.g., "6 weeks"
  progressionCriteria?: string;
}

// ============================================================================
// Prescribed Exercise
// ============================================================================

export interface PrescribedExercise {
  exercise: Exercise;
  dosage: ExerciseDosage;
  rationale: string;
  goals: string[];
  startDate: string;
  endDate?: string;
  patientInstructions: string;
}

// ============================================================================
// Exercise Prescription
// ============================================================================

export interface ExercisePrescription {
  patientId: string;
  prescribedBy: string;
  prescriptionDate: string;
  diagnosis: string;
  functionalLimitations: string[];
  exercises: PrescribedExercise[]; // 5-10 exercises
  overallGoals: string[];
  safetyPrecautions: string[];
  redFlags: string[]; // When to stop and contact PT
  followUpDate?: string;
}

// ============================================================================
// Home Exercise Program (HEP)
// ============================================================================

export interface HomeExerciseProgram {
  patientId: string;
  programName: string;
  createdDate: string;
  exercises: PrescribedExercise[]; // Max 5 exercises for HEP
  totalDuration: string; // e.g., "6 weeks"
  frequency: string; // e.g., "Daily"
  complianceTracking: {
    expectedSessions: number;
    completedSessions: number;
    adherenceRate: number; // percentage
  };
  progressionPlan: {
    week: number;
    modifications: string;
  }[];
  patientEducation: {
    painManagement: string;
    whenToProgress: string;
    whenToStop: string;
    contactInfo: string;
  };
}

// ============================================================================
// Exercise Prescription Generator Input
// ============================================================================

export interface ExercisePrescriptionInput {
  diagnosis: string;
  bodyRegion: BodyRegion[];
  functionalLimitations: string[];
  patientGoals: string[];
  contraindications: string[];
  difficultyLevel: DifficultyLevel;
  availableEquipment: string[];
}

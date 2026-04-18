/**
 * Clinical Pathway Interfaces
 *
 * Defines TypeScript interfaces for evidence-based clinical pathways
 * Requirements: 17.1, 17.2, 17.4
 *
 * Includes:
 * - Clinical pathway definitions
 * - Phase-based protocols
 * - Interventions with CPT codes
 * - Red flags and safety warnings
 */

import { BodyRegion } from "./pt-assessment";
import { ExerciseCategory } from "./exercise-prescription";

// ============================================================================
// Red Flags (Safety Warnings)
// ============================================================================

export interface RedFlag {
  symptom: string;
  severity: "critical" | "serious" | "caution";
  action: string;
  referralNeeded: boolean;
  referralSpecialty?: string;
}

// ============================================================================
// Intervention Definition
// ============================================================================

export interface PathwayIntervention {
  name: string;
  category: ExerciseCategory;
  cptCode: string; // e.g., "97110", "97140"
  description: string;
  duration: number; // minutes
  frequency: string; // e.g., "3x/week"
  evidenceLevel: number; // 1-5
  evidenceSources: string[];
  contraindications: string[];
  expectedOutcomes: string[];
}

// ============================================================================
// Pathway Phase
// ============================================================================

export interface PathwayPhase {
  phaseNumber: number;
  phaseName: string;
  timeframe: string; // e.g., "Weeks 1-2", "Days 1-7"
  goals: string[];
  interventions: PathwayIntervention[];
  progressionCriteria: string[];
  expectedOutcomes: {
    outcome: string;
    measure: string;
    target: string;
  }[];
  redFlags: RedFlag[];
}

// ============================================================================
// Clinical Pathway
// ============================================================================

export interface ClinicalPathway {
  id: string;
  name: string;
  diagnosis: string;
  icdCodes: string[];
  bodyRegion: BodyRegion[];
  description: string;
  phases: PathwayPhase[];
  overallDuration: string; // e.g., "6-8 weeks"
  evidenceLevel: number; // 1-5
  evidenceSources: string[]; // APTA CPGs, research citations
  inclusionCriteria: string[];
  exclusionCriteria: string[];
  redFlags: RedFlag[];
  expectedOutcomes: {
    shortTerm: string[]; // 2-4 weeks
    longTerm: string[]; // 6-12 weeks
  };
  dischargeCriteria: string[];
}

// ============================================================================
// Pathway Progress Tracking
// ============================================================================

export interface PathwayProgress {
  patientId: string;
  pathwayId: string;
  startDate: string;
  currentPhase: number;
  completedPhases: number[];
  progressNotes: {
    date: string;
    phase: number;
    note: string;
    outcomesAchieved: string[];
    barriers: string[];
  }[];
  adherence: {
    scheduledVisits: number;
    completedVisits: number;
    adherenceRate: number; // percentage
  };
  modifications: {
    date: string;
    reason: string;
    modification: string;
  }[];
}

// ============================================================================
// Common Clinical Pathways
// ============================================================================

export type PathwayType =
  | "post-tka" // Total Knee Arthroplasty
  | "post-tha" // Total Hip Arthroplasty
  | "low-back-pain"
  | "stroke-rehab"
  | "rotator-cuff-repair"
  | "acl-reconstruction"
  | "ankle-sprain"
  | "cervical-radiculopathy"
  | "lumbar-radiculopathy"
  | "frozen-shoulder";

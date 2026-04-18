/**
 * OT Intervention Service
 *
 * Manages OT interventions and intervention planning
 * Requirements: 3.4, 3.5, 3.6
 */

import type {
  OTIntervention,
  InterventionPlan,
  InterventionSession,
  HomeProgram,
} from "../types/ot-intervention";
import {
  getIntervention,
  getInterventionsByDomain,
  getInterventionsByCPTCode,
} from "../data/ot-interventions";

// ============================================================================
// OT Intervention Service
// ============================================================================

class OTInterventionServiceClass {
  /**
   * Get intervention by ID
   */
  public getIntervention(interventionId: string): OTIntervention | undefined {
    return getIntervention(interventionId);
  }

  /**
   * Get interventions for a domain
   */
  public getInterventionsByDomain(domain: string): OTIntervention[] {
    return getInterventionsByDomain(domain);
  }

  /**
   * Get interventions by CPT code
   */
  public getInterventionsByCPTCode(cptCode: string): OTIntervention[] {
    return getInterventionsByCPTCode(cptCode);
  }

  /**
   * Validate intervention plan
   */
  public validateInterventionPlan(plan: InterventionPlan): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Check required fields
    if (!plan.clientId) {
      errors.push("Client ID is required");
    }

    if (!plan.startDate) {
      errors.push("Start date is required");
    }

    if (!plan.interventions || plan.interventions.length === 0) {
      errors.push("At least one intervention must be specified");
    }

    if (!plan.goals || plan.goals.length === 0) {
      errors.push("At least one goal must be specified");
    }

    if (!plan.frequency) {
      errors.push("Frequency must be specified");
    }

    if (!plan.duration) {
      errors.push("Duration must be specified");
    }

    if (!plan.therapistId) {
      errors.push("Therapist ID is required");
    }

    // Check goal validity
    if (plan.goals) {
      plan.goals.forEach((goal, index) => {
        if (!goal.description) {
          errors.push(`Goal ${index + 1}: Description is required`);
        }
        if (!goal.timeframe) {
          errors.push(`Goal ${index + 1}: Timeframe is required`);
        }
        if (!goal.successCriteria || goal.successCriteria.length === 0) {
          errors.push(`Goal ${index + 1}: Success criteria must be specified`);
        }
      });
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Generate intervention plan summary
   */
  public generateInterventionPlanSummary(plan: InterventionPlan): string {
    const lines: string[] = [];

    lines.push("=== INTERVENTION PLAN SUMMARY ===");
    lines.push("");

    // Plan info
    lines.push(`Client ID: ${plan.clientId}`);
    lines.push(`Start Date: ${plan.startDate.toLocaleDateString()}`);
    if (plan.endDate) {
      lines.push(`End Date: ${plan.endDate.toLocaleDateString()}`);
    }
    lines.push(`Status: ${plan.status}`);
    lines.push("");

    // Frequency and duration
    lines.push(`Frequency: ${plan.frequency}`);
    lines.push(`Duration: ${plan.duration}`);
    lines.push("");

    // Interventions
    if (plan.interventions.length > 0) {
      lines.push("INTERVENTIONS:");
      plan.interventions.forEach((intervention) => {
        lines.push(`  • ${intervention.name}`);
        lines.push(`    Category: ${intervention.category}`);
        lines.push(`    Approach: ${intervention.approach}`);
        if (intervention.cptCode) {
          lines.push(`    CPT Code: ${intervention.cptCode}`);
        }
      });
      lines.push("");
    }

    // Goals
    if (plan.goals.length > 0) {
      lines.push("GOALS:");
      plan.goals.forEach((goal, index) => {
        lines.push(`  ${index + 1}. ${goal.description}`);
        lines.push(`     Timeframe: ${goal.timeframe}`);
        lines.push(`     Priority: ${goal.priority}`);
        if (goal.successCriteria.length > 0) {
          lines.push(`     Success Criteria:`);
          goal.successCriteria.forEach((criterion) => {
            lines.push(`       - ${criterion}`);
          });
        }
      });
      lines.push("");
    }

    // Expected outcomes
    if (plan.expectedOutcomes.length > 0) {
      lines.push("EXPECTED OUTCOMES:");
      plan.expectedOutcomes.forEach((outcome) => {
        lines.push(`  • ${outcome}`);
      });
      lines.push("");
    }

    // Home program
    if (plan.homeProgram) {
      lines.push("HOME PROGRAM:");
      lines.push(plan.homeProgram);
      lines.push("");
    }

    // Family education
    if (plan.familyEducation) {
      lines.push("FAMILY EDUCATION:");
      lines.push(plan.familyEducation);
      lines.push("");
    }

    // Progress measures
    if (plan.progressMeasures.length > 0) {
      lines.push("PROGRESS MEASURES:");
      plan.progressMeasures.forEach((measure) => {
        lines.push(`  • ${measure}`);
      });
      lines.push("");
    }

    lines.push(`Review Date: ${plan.reviewDate.toLocaleDateString()}`);

    return lines.join("\n");
  }

  /**
   * Calculate session duration
   */
  public calculateSessionDuration(interventions: OTIntervention[]): number {
    return interventions.reduce(
      (total, intervention) => total + intervention.estimatedDuration,
      0,
    );
  }

  /**
   * Validate intervention session
   */
  public validateInterventionSession(session: InterventionSession): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!session.interventionId) {
      errors.push("Intervention ID is required");
    }

    if (!session.clientId) {
      errors.push("Client ID is required");
    }

    if (!session.date) {
      errors.push("Session date is required");
    }

    if (!session.duration || session.duration < 8) {
      errors.push("Session duration must be at least 8 minutes");
    }

    if (!session.goals || session.goals.length === 0) {
      errors.push("At least one goal must be specified");
    }

    if (
      !session.activitiesPerformed ||
      session.activitiesPerformed.length === 0
    ) {
      errors.push("Activities performed must be documented");
    }

    if (!session.clientResponse) {
      errors.push("Client response must be documented");
    }

    if (!session.progressNotes) {
      errors.push("Progress notes must be documented");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Generate session note
   */
  public generateSessionNote(session: InterventionSession): string {
    const lines: string[] = [];

    lines.push("=== INTERVENTION SESSION NOTE ===");
    lines.push("");

    // Session info
    lines.push(`Date: ${session.date.toLocaleDateString()}`);
    lines.push(`Duration: ${session.duration} minutes`);
    lines.push("");

    // Goals
    if (session.goals.length > 0) {
      lines.push("SESSION GOALS:");
      session.goals.forEach((goal) => {
        lines.push(`  • ${goal.description}`);
      });
      lines.push("");
    }

    // Activities
    if (session.activitiesPerformed.length > 0) {
      lines.push("ACTIVITIES PERFORMED:");
      session.activitiesPerformed.forEach((activity) => {
        lines.push(`  • ${activity}`);
      });
      lines.push("");
    }

    // Client response
    lines.push("CLIENT RESPONSE:");
    lines.push(session.clientResponse);
    lines.push("");

    // Progress notes
    lines.push("PROGRESS NOTES:");
    lines.push(session.progressNotes);
    lines.push("");

    // Modifications
    if (session.modifications.length > 0) {
      lines.push("MODIFICATIONS:");
      session.modifications.forEach((modification) => {
        lines.push(`  • ${modification}`);
      });
      lines.push("");
    }

    // Home program
    if (session.homeProgram) {
      lines.push("HOME PROGRAM:");
      lines.push(session.homeProgram);
      lines.push("");
    }

    // Next session
    if (session.nextSession) {
      lines.push("NEXT SESSION:");
      lines.push(session.nextSession);
    }

    return lines.join("\n");
  }

  /**
   * Validate home program
   */
  public validateHomeProgram(program: HomeProgram): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!program.clientId) {
      errors.push("Client ID is required");
    }

    if (!program.exercises || program.exercises.length === 0) {
      errors.push("At least one exercise must be specified");
    }

    if (!program.schedule) {
      errors.push("Schedule must be specified");
    }

    // Validate exercises
    if (program.exercises) {
      program.exercises.forEach((exercise, index) => {
        if (!exercise.name) {
          errors.push(`Exercise ${index + 1}: Name is required`);
        }
        if (!exercise.description) {
          errors.push(`Exercise ${index + 1}: Description is required`);
        }
        if (!exercise.frequency) {
          errors.push(`Exercise ${index + 1}: Frequency is required`);
        }
        if (!exercise.duration) {
          errors.push(`Exercise ${index + 1}: Duration is required`);
        }
        if (!exercise.instructions) {
          errors.push(`Exercise ${index + 1}: Instructions are required`);
        }
      });
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Generate home program instructions
   */
  public generateHomeProgramInstructions(program: HomeProgram): string {
    const lines: string[] = [];

    lines.push("=== HOME PROGRAM INSTRUCTIONS ===");
    lines.push("");

    lines.push("SCHEDULE:");
    lines.push(program.schedule);
    lines.push("");

    if (program.exercises.length > 0) {
      lines.push("EXERCISES:");
      lines.push("");

      program.exercises.forEach((exercise, index) => {
        lines.push(`${index + 1}. ${exercise.name}`);
        lines.push(`   Frequency: ${exercise.frequency}`);
        lines.push(`   Duration: ${exercise.duration} minutes`);
        if (exercise.sets) {
          lines.push(`   Sets: ${exercise.sets}`);
        }
        if (exercise.reps) {
          lines.push(`   Reps: ${exercise.reps}`);
        }
        lines.push("");
        lines.push("   INSTRUCTIONS:");
        lines.push(`   ${exercise.instructions}`);
        lines.push("");

        if (exercise.precautions.length > 0) {
          lines.push("   PRECAUTIONS:");
          exercise.precautions.forEach((precaution) => {
            lines.push(`   • ${precaution}`);
          });
          lines.push("");
        }

        if (exercise.progressionCriteria.length > 0) {
          lines.push("   PROGRESSION CRITERIA:");
          exercise.progressionCriteria.forEach((criterion) => {
            lines.push(`   • ${criterion}`);
          });
          lines.push("");
        }
      });
    }

    if (program.educationMaterials.length > 0) {
      lines.push("EDUCATION MATERIALS:");
      program.educationMaterials.forEach((material) => {
        lines.push(`  • ${material}`);
      });
      lines.push("");
    }

    if (program.familyInvolvement) {
      lines.push("FAMILY INVOLVEMENT:");
      lines.push(program.familyInvolvement);
      lines.push("");
    }

    lines.push(`Review Date: ${program.reviewDate.toLocaleDateString()}`);

    return lines.join("\n");
  }
}

export const OTInterventionService = new OTInterventionServiceClass();

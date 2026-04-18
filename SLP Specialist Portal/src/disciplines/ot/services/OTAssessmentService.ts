/**
 * OT Assessment Service
 *
 * Manages OT assessments and outcome measures
 * Requirements: 3.1, 3.2, 3.3
 */

import type {
  OTAssessmentTool,
  OTOutcomeMeasure,
  OTAssessmentFindings,
} from "../types/ot-assessment";
import {
  getAssessmentTool,
  getOutcomeMeasure,
  getAssessmentToolsByDomain,
  getOutcomeMeasuresByDomain,
} from "../data/ot-assessments";

// ============================================================================
// OT Assessment Service
// ============================================================================

class OTAssessmentServiceClass {
  /**
   * Get assessment tool by ID
   */
  public getAssessmentTool(toolId: string): OTAssessmentTool | undefined {
    return getAssessmentTool(toolId);
  }

  /**
   * Get outcome measure by ID
   */
  public getOutcomeMeasure(measureId: string): OTOutcomeMeasure | undefined {
    return getOutcomeMeasure(measureId);
  }

  /**
   * Get assessment tools for a domain
   */
  public getAssessmentToolsByDomain(domain: string): OTAssessmentTool[] {
    return getAssessmentToolsByDomain(domain);
  }

  /**
   * Get outcome measures for a domain
   */
  public getOutcomeMeasuresByDomain(domain: string): OTOutcomeMeasure[] {
    return getOutcomeMeasuresByDomain(domain);
  }

  /**
   * Calculate MCID (Minimal Clinically Important Difference)
   */
  public calculateMCID(
    baselineScore: number,
    currentScore: number,
    mcid: number,
  ): number {
    return Math.abs(currentScore - baselineScore) / mcid;
  }

  /**
   * Determine if change is clinically significant
   */
  public isClinicallySIgnificant(
    baselineScore: number,
    currentScore: number,
    mcid: number,
  ): boolean {
    const change = Math.abs(currentScore - baselineScore);
    return change >= mcid;
  }

  /**
   * Calculate percentage improvement
   */
  public calculatePercentageImprovement(
    baselineScore: number,
    currentScore: number,
    maxScore: number,
  ): number {
    if (maxScore === 0) return 0;
    const improvement = currentScore - baselineScore;
    const possibleImprovement = maxScore - baselineScore;
    if (possibleImprovement === 0) return 0;
    return (improvement / possibleImprovement) * 100;
  }

  /**
   * Interpret assessment score
   */
  public interpretScore(toolId: string, score: number): string {
    const tool = this.getAssessmentTool(toolId);
    if (!tool) return "Unknown tool";
    return tool.interpretation(score);
  }

  /**
   * Validate assessment findings
   */
  public validateAssessmentFindings(findings: OTAssessmentFindings): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Check required fields
    if (!findings.clientId) {
      errors.push("Client ID is required");
    }

    if (!findings.assessmentDate) {
      errors.push("Assessment date is required");
    }

    if (!findings.occupationalProfile) {
      errors.push("Occupational profile is required");
    }

    if (!findings.primaryConcerns || findings.primaryConcerns.length === 0) {
      errors.push("Primary concerns must be documented");
    }

    if (
      !findings.functionalLimitations ||
      findings.functionalLimitations.length === 0
    ) {
      errors.push("Functional limitations must be documented");
    }

    if (
      !findings.interventionRecommendations ||
      findings.interventionRecommendations.length === 0
    ) {
      errors.push("Intervention recommendations must be provided");
    }

    // Check assessment consistency
    if (findings.copm && findings.copm.issues.length === 0) {
      errors.push("COPM assessment should include identified issues");
    }

    if (findings.fim && findings.fim.items.length === 0) {
      errors.push("FIM assessment should include scored items");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Generate assessment summary
   */
  public generateAssessmentSummary(findings: OTAssessmentFindings): string {
    const lines: string[] = [];

    lines.push("=== OT ASSESSMENT SUMMARY ===");
    lines.push("");

    // Client info
    lines.push(`Client ID: ${findings.clientId}`);
    lines.push(
      `Assessment Date: ${findings.assessmentDate.toLocaleDateString()}`,
    );
    lines.push("");

    // Primary concerns
    if (findings.primaryConcerns.length > 0) {
      lines.push("PRIMARY CONCERNS:");
      findings.primaryConcerns.forEach((concern) => {
        lines.push(`  • ${concern}`);
      });
      lines.push("");
    }

    // Functional limitations
    if (findings.functionalLimitations.length > 0) {
      lines.push("FUNCTIONAL LIMITATIONS:");
      findings.functionalLimitations.forEach((limitation) => {
        lines.push(`  • ${limitation}`);
      });
      lines.push("");
    }

    // Occupational performance issues
    if (findings.occupationalPerformanceIssues.length > 0) {
      lines.push("OCCUPATIONAL PERFORMANCE ISSUES:");
      findings.occupationalPerformanceIssues.forEach((issue) => {
        lines.push(`  • ${issue}`);
      });
      lines.push("");
    }

    // Strengths
    if (findings.strengths.length > 0) {
      lines.push("STRENGTHS:");
      findings.strengths.forEach((strength) => {
        lines.push(`  • ${strength}`);
      });
      lines.push("");
    }

    // Recommendations
    if (findings.interventionRecommendations.length > 0) {
      lines.push("INTERVENTION RECOMMENDATIONS:");
      findings.interventionRecommendations.forEach((rec) => {
        lines.push(`  • ${rec}`);
      });
      lines.push("");
    }

    // Adaptive equipment needs
    if (findings.adaptiveEquipmentNeeds.length > 0) {
      lines.push("ADAPTIVE EQUIPMENT NEEDS:");
      findings.adaptiveEquipmentNeeds.forEach((equipment) => {
        lines.push(`  • ${equipment}`);
      });
      lines.push("");
    }

    // Clinical impression
    if (findings.clinicalImpression) {
      lines.push("CLINICAL IMPRESSION:");
      lines.push(findings.clinicalImpression);
      lines.push("");
    }

    // Prognosis
    if (findings.prognosis) {
      lines.push("PROGNOSIS:");
      lines.push(findings.prognosis);
      lines.push("");
    }

    // Estimated duration
    if (findings.estimatedDurationOfServices) {
      lines.push("ESTIMATED DURATION OF SERVICES:");
      lines.push(findings.estimatedDurationOfServices);
      lines.push("");
    }

    // Next review
    lines.push(
      `NEXT REVIEW DATE: ${findings.nextReviewDate.toLocaleDateString()}`,
    );

    return lines.join("\n");
  }

  /**
   * Compare assessments over time
   */
  public compareAssessments(
    baseline: OTAssessmentFindings,
    current: OTAssessmentFindings,
  ): {
    improved: string[];
    stable: string[];
    declined: string[];
    summary: string;
  } {
    const improved: string[] = [];
    const stable: string[] = [];
    const declined: string[] = [];

    // Compare COPM scores if available
    if (baseline.copm && current.copm) {
      const baselineAvg =
        baseline.copm.totalPerformanceScore / baseline.copm.issues.length;
      const currentAvg =
        current.copm.totalPerformanceScore / current.copm.issues.length;

      if (currentAvg > baselineAvg + 1) {
        improved.push(
          `COPM Performance improved from ${baselineAvg.toFixed(1)} to ${currentAvg.toFixed(1)}`,
        );
      } else if (currentAvg < baselineAvg - 1) {
        declined.push(
          `COPM Performance declined from ${baselineAvg.toFixed(1)} to ${currentAvg.toFixed(1)}`,
        );
      } else {
        stable.push(`COPM Performance stable at ${currentAvg.toFixed(1)}`);
      }
    }

    // Compare FIM scores if available
    if (baseline.fim && current.fim) {
      if (current.fim.grandTotal > baseline.fim.grandTotal) {
        improved.push(
          `FIM Total improved from ${baseline.fim.grandTotal} to ${current.fim.grandTotal}`,
        );
      } else if (current.fim.grandTotal < baseline.fim.grandTotal) {
        declined.push(
          `FIM Total declined from ${baseline.fim.grandTotal} to ${current.fim.grandTotal}`,
        );
      } else {
        stable.push(`FIM Total stable at ${current.fim.grandTotal}`);
      }
    }

    // Generate summary
    const summary = [
      improved.length > 0 ? `Improved: ${improved.length} areas` : "",
      stable.length > 0 ? `Stable: ${stable.length} areas` : "",
      declined.length > 0 ? `Declined: ${declined.length} areas` : "",
    ]
      .filter((s) => s)
      .join("; ");

    return {
      improved,
      stable,
      declined,
      summary: summary || "No significant changes",
    };
  }
}

export const OTAssessmentService = new OTAssessmentServiceClass();

/**
 * OT Compliance Validator Service
 *
 * Validates OT clinical content against compliance rules
 * Requirements: 2.5, 2.6, 2.7, 2.8
 */

import type {
  OTDocumentationCompliance,
  ComplianceIssue,
  ComplianceStatus,
  DocumentationContent,
} from "../types/ot-compliance";
import {
  OT_COMPLIANCE_RULES,
  OT_CPT_CODES,
  OT_DOCUMENTATION_REQUIREMENTS,
} from "../data/ot-compliance-rules";

// ============================================================================
// OT Compliance Validator
// ============================================================================

class OTComplianceValidatorClass {
  /**
   * Validate OT documentation for compliance
   */
  public validateDocumentation(
    content: DocumentationContent,
  ): OTDocumentationCompliance {
    const issues: ComplianceIssue[] = [];
    let status: ComplianceStatus = "compliant";

    // Validate SOAP components
    const subjectiveCompliant = this.validateSubjective(
      content.subjective,
      issues,
    );
    const objectiveCompliant = this.validateObjective(
      content.objective,
      issues,
    );
    const assessmentCompliant = this.validateAssessment(
      content.assessment,
      issues,
    );
    const planCompliant = this.validatePlan(content.plan, issues);

    // Validate content
    const occupationalFocusPresent = this.checkOccupationalFocus(
      content.assessment,
    );
    const functionalLimitationsDocumented = this.checkFunctionalLimitations(
      content.assessment,
    );
    const skilledNeedJustified = this.checkSkilledNeed(content.plan);
    const medicalNecessityDocumented = this.checkMedicalNecessity(
      content.assessment,
    );

    // Validate billing
    const cptCodeValid = this.validateCPTCode(content.cptCode, issues);
    const timeDocumented = content.timeSpent !== undefined;
    const timeCompliant = this.validateTime(content.timeSpent, issues);

    // Determine overall status
    if (issues.some((i) => i.severity === "critical")) {
      status = "non-compliant";
    } else if (issues.some((i) => i.severity === "high")) {
      status = "warning";
    } else if (
      !occupationalFocusPresent ||
      !functionalLimitationsDocumented ||
      !skilledNeedJustified
    ) {
      status = "needs-review";
    }

    return {
      id: `compliance-${Date.now()}`,
      documentationId: content.patientId || "unknown",
      discipline: "ot",
      evaluationDate: new Date(),
      subjectiveCompliant,
      objectiveCompliant,
      assessmentCompliant,
      planCompliant,
      occupationalFocusPresent,
      functionalLimitationsDocumented,
      skilledNeedJustified,
      medicalNecessityDocumented,
      cptCodeValid,
      timeDocumented,
      timeCompliant,
      status,
      issues,
      recommendations: this.generateRecommendations(issues, status),
      reviewedBy: "system",
      reviewDate: new Date(),
    };
  }

  /**
   * Validate subjective section
   */
  private validateSubjective(
    subjective: string | undefined,
    issues: ComplianceIssue[],
  ): boolean {
    if (!subjective) {
      issues.push({
        id: `issue-${Date.now()}-1`,
        code: "OT_DOC_001",
        severity: "critical",
        message: "Subjective section is required",
        field: "subjective",
        suggestion:
          "Add subjective section with client report of occupational performance concerns",
        reference: "AOTA Standards of Practice",
      });
      return false;
    }

    if (subjective.length < 10) {
      issues.push({
        id: `issue-${Date.now()}-2`,
        code: "OT_DOC_001",
        severity: "high",
        message: "Subjective section is too brief",
        field: "subjective",
        suggestion:
          "Expand subjective section to include client perspective and goals",
        reference: "AOTA Standards of Practice",
      });
      return false;
    }

    return true;
  }

  /**
   * Validate objective section
   */
  private validateObjective(
    objective: string | undefined,
    issues: ComplianceIssue[],
  ): boolean {
    if (!objective) {
      issues.push({
        id: `issue-${Date.now()}-3`,
        code: "OT_DOC_002",
        severity: "critical",
        message: "Objective section is required",
        field: "objective",
        suggestion:
          "Add objective section with standardized assessments and measurements",
        reference: "AOTA Standards of Practice",
      });
      return false;
    }

    if (objective.length < 10) {
      issues.push({
        id: `issue-${Date.now()}-4`,
        code: "OT_DOC_002",
        severity: "high",
        message: "Objective section is too brief",
        field: "objective",
        suggestion:
          "Include specific measurements and standardized assessment scores",
        reference: "AOTA Standards of Practice",
      });
      return false;
    }

    return true;
  }

  /**
   * Validate assessment section
   */
  private validateAssessment(
    assessment: string | undefined,
    issues: ComplianceIssue[],
  ): boolean {
    if (!assessment) {
      issues.push({
        id: `issue-${Date.now()}-5`,
        code: "OT_DOC_003",
        severity: "critical",
        message: "Assessment section is required",
        field: "assessment",
        suggestion:
          "Add assessment section with analysis of occupational performance issues",
        reference: "AOTA Standards of Practice",
      });
      return false;
    }

    if (assessment.length < 10) {
      issues.push({
        id: `issue-${Date.now()}-6`,
        code: "OT_DOC_003",
        severity: "high",
        message: "Assessment section is too brief",
        field: "assessment",
        suggestion:
          "Expand assessment to include functional limitations and skilled need",
        reference: "AOTA Standards of Practice",
      });
      return false;
    }

    return true;
  }

  /**
   * Validate plan section
   */
  private validatePlan(
    plan: string | undefined,
    issues: ComplianceIssue[],
  ): boolean {
    if (!plan) {
      issues.push({
        id: `issue-${Date.now()}-7`,
        code: "OT_DOC_004",
        severity: "critical",
        message: "Plan section is required",
        field: "plan",
        suggestion:
          "Add plan section with interventions and skilled need justification",
        reference: "AOTA Standards of Practice",
      });
      return false;
    }

    if (plan.length < 10) {
      issues.push({
        id: `issue-${Date.now()}-8`,
        code: "OT_DOC_004",
        severity: "high",
        message: "Plan section is too brief",
        field: "plan",
        suggestion:
          "Expand plan to include specific interventions and skilled need justification",
        reference: "AOTA Standards of Practice",
      });
      return false;
    }

    return true;
  }

  /**
   * Check for occupational focus
   */
  private checkOccupationalFocus(assessment: string | undefined): boolean {
    if (!assessment) return false;

    const occupationalKeywords = [
      "occupational",
      "adl",
      "iadl",
      "self-care",
      "dressing",
      "bathing",
      "grooming",
      "feeding",
      "meal preparation",
      "work",
      "leisure",
      "participation",
      "performance",
    ];

    const lowerAssessment = assessment.toLowerCase();
    return occupationalKeywords.some((keyword) =>
      lowerAssessment.includes(keyword),
    );
  }

  /**
   * Check for functional limitations documentation
   */
  private checkFunctionalLimitations(assessment: string | undefined): boolean {
    if (!assessment) return false;

    const functionalKeywords = [
      "unable",
      "difficulty",
      "limitation",
      "deficit",
      "cannot",
      "functional",
    ];

    const lowerAssessment = assessment.toLowerCase();
    return functionalKeywords.some((keyword) =>
      lowerAssessment.includes(keyword),
    );
  }
  /**
   * Check for skilled need justification
   */
  private checkSkilledNeed(plan: string | undefined): boolean {
    if (!plan) return false;

    const skilledKeywords = [
      "skilled",
      "assessment",
      "evaluation",
      "training",
      "intervention",
      "treatment",
      "clinical decision",
      "professional judgment",
    ];

    const lowerPlan = plan.toLowerCase();
    return skilledKeywords.some((keyword) => lowerPlan.includes(keyword));
  }

  /**
   * Check for medical necessity documentation
   */
  private checkMedicalNecessity(assessment: string | undefined): boolean {
    if (!assessment) return false;

    const necessityKeywords = [
      "medical necessity",
      "medically necessary",
      "functional limitation",
      "skilled",
      "improvement",
      "prognosis",
    ];

    const lowerAssessment = assessment.toLowerCase();
    return necessityKeywords.some((keyword) =>
      lowerAssessment.includes(keyword),
    );
  }

  /**
   * Validate CPT code
   */
  private validateCPTCode(
    cptCode: string | undefined,
    issues: ComplianceIssue[],
  ): boolean {
    if (!cptCode) {
      return true; // CPT code is optional
    }

    const validCode = OT_CPT_CODES.find((c) => c.code === cptCode);
    if (!validCode) {
      issues.push({
        id: `issue-${Date.now()}-9`,
        code: "OT_BILL_002",
        severity: "high",
        message: `CPT code ${cptCode} is not valid for OT`,
        field: "cptCode",
        suggestion:
          "Use valid OT CPT codes: 97165, 97166, 97167, 97168, 97110, 97535, 97129",
        reference: "Medicare CPT Code Guidelines",
      });
      return false;
    }

    return true;
  }

  /**
   * Validate time documentation
   */
  private validateTime(
    timeSpent: number | undefined,
    issues: ComplianceIssue[],
  ): boolean {
    if (timeSpent === undefined) {
      issues.push({
        id: `issue-${Date.now()}-10`,
        code: "OT_BILL_001",
        severity: "high",
        message: "Time spent is not documented",
        field: "timeSpent",
        suggestion: "Document time spent in minutes for billing purposes",
        reference: "Medicare 8-Minute Rule",
      });
      return false;
    }

    if (timeSpent < 8) {
      issues.push({
        id: `issue-${Date.now()}-11`,
        code: "OT_BILL_001",
        severity: "critical",
        message: `Time spent (${timeSpent} minutes) is less than 8-minute minimum`,
        field: "timeSpent",
        suggestion:
          "Minimum 8 minutes of direct service required to bill (Medicare 8-minute rule)",
        reference: "Medicare 8-Minute Rule",
      });
      return false;
    }

    return true;
  }

  /**
   * Generate recommendations based on issues
   */
  private generateRecommendations(
    issues: ComplianceIssue[],
    status: ComplianceStatus,
  ): string[] {
    const recommendations: string[] = [];

    if (status === "non-compliant") {
      recommendations.push(
        "Critical issues must be resolved before documentation can be submitted",
      );
    }

    if (status === "warning") {
      recommendations.push(
        "High-severity issues should be addressed to ensure compliance",
      );
    }

    if (status === "needs-review") {
      recommendations.push(
        "Documentation should be reviewed for occupational focus and functional limitations",
      );
    }

    // Add specific recommendations based on issues
    issues.forEach((issue) => {
      if (issue.code === "OT_DOC_001") {
        recommendations.push(
          "Ensure subjective section includes client perspective and goals",
        );
      }
      if (issue.code === "OT_DOC_002") {
        recommendations.push(
          "Include standardized assessments and specific measurements in objective section",
        );
      }
      if (issue.code === "OT_DOC_003") {
        recommendations.push(
          "Focus assessment on occupational performance and functional limitations",
        );
      }
      if (issue.code === "OT_DOC_004") {
        recommendations.push("Justify skilled OT services in plan section");
      }
      if (issue.code === "OT_BILL_001") {
        recommendations.push(
          "Ensure time documentation meets 8-minute minimum for billing",
        );
      }
      if (issue.code === "OT_BILL_002") {
        recommendations.push("Use valid OT-specific CPT codes");
      }
    });

    return [...new Set(recommendations)]; // Remove duplicates
  }

  /**
   * Get compliance rules
   */
  public getComplianceRules() {
    return OT_COMPLIANCE_RULES;
  }

  /**
   * Get CPT codes
   */
  public getCPTCodes() {
    return OT_CPT_CODES;
  }

  /**
   * Get documentation requirements
   */
  public getDocumentationRequirements() {
    return OT_DOCUMENTATION_REQUIREMENTS;
  }
}

export const OTComplianceValidator = new OTComplianceValidatorClass();

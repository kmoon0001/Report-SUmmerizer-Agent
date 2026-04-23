/**
 * OT Compliance Tests
 *
 * Tests for OT-specific compliance validation
 * Requirements: 2.5, 2.6, 2.7, 2.8
 */

import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { OTComplianceValidator } from "../../disciplines/ot/services/OTComplianceValidator";
import type { DocumentationContent } from "../../core/compliance/ComplianceEngine";

describe("OT Compliance Validator", () => {
  describe("Documentation Validation", () => {
    it("should require all SOAP components", () => {
      const content: DocumentationContent = {
        subjective: "Client reports difficulty with ADLs",
        // Missing objective, assessment, plan
      };

      const result = OTComplianceValidator.validateDocumentation(content);
      expect(result.status).not.toBe("compliant");
      expect(result.issues.length).toBeGreaterThan(0);
    });

    it("should pass validation with complete SOAP", () => {
      const content: DocumentationContent = {
        subjective:
          "Client reports difficulty with dressing due to limited shoulder ROM",
        objective:
          "Shoulder flexion 90 degrees, unable to reach behind back. COPM: Performance 4/10",
        assessment:
          "Functional limitation affecting ADL independence. Skilled OT assessment and training required",
        plan: "ADL training 2x/week for 4 weeks. Home program: dressing practice daily",
        cptCode: "97535",
        timeSpent: 30,
        patientId: "PT001",
      };

      const result = OTComplianceValidator.validateDocumentation(content);
      expect(result.subjectiveCompliant).toBe(true);
      expect(result.objectiveCompliant).toBe(true);
      expect(result.assessmentCompliant).toBe(true);
      expect(result.planCompliant).toBe(true);
    });

    it("should check for occupational focus", () => {
      const content: DocumentationContent = {
        subjective: "Client reports pain",
        objective: "ROM limited",
        assessment: "Patient has pain and limited ROM", // No occupational focus
        plan: "Therapeutic exercise",
      };

      const result = OTComplianceValidator.validateDocumentation(content);
      expect(result.occupationalFocusPresent).toBe(false);
    });

    it("should detect occupational focus when present", () => {
      const content: DocumentationContent = {
        subjective: "Client reports difficulty with ADLs",
        objective: "COPM: Performance 4/10 for dressing",
        assessment: "Functional limitation affecting ADL independence",
        plan: "ADL training",
      };

      const result = OTComplianceValidator.validateDocumentation(content);
      expect(result.occupationalFocusPresent).toBe(true);
    });

    it("should check for functional limitations documentation", () => {
      const content: DocumentationContent = {
        subjective: "Client reports issues",
        objective: "Assessment completed",
        assessment: "Client has impairments", // No functional language
        plan: "Intervention",
      };

      const result = OTComplianceValidator.validateDocumentation(content);
      expect(result.functionalLimitationsDocumented).toBe(false);
    });

    it("should detect functional limitations when present", () => {
      const content: DocumentationContent = {
        subjective: "Client reports difficulty",
        objective: "Unable to perform task",
        assessment: "Client unable to don shirt due to limited ROM",
        plan: "Training",
      };

      const result = OTComplianceValidator.validateDocumentation(content);
      expect(result.functionalLimitationsDocumented).toBe(true);
    });

    it("should check for skilled need justification", () => {
      const content: DocumentationContent = {
        subjective: "Client reports issues",
        objective: "Assessment completed",
        assessment: "Functional limitation",
        plan: "Continue current routine", // No skilled language
      };

      const result = OTComplianceValidator.validateDocumentation(content);
      expect(result.skilledNeedJustified).toBe(false);
    });

    it("should detect skilled need when present", () => {
      const content: DocumentationContent = {
        subjective: "Client reports issues",
        objective: "Assessment completed",
        assessment: "Functional limitation",
        plan: "Skilled OT assessment and ADL training required",
      };

      const result = OTComplianceValidator.validateDocumentation(content);
      expect(result.skilledNeedJustified).toBe(true);
    });
  });

  describe("CPT Code Validation", () => {
    it("should validate OT CPT codes", () => {
      const validCodes = [
        "97165",
        "97166",
        "97167",
        "97168",
        "97110",
        "97535",
        "97129",
      ];

      validCodes.forEach((code) => {
        const content: DocumentationContent = {
          subjective: "Client reports issues",
          objective: "Assessment completed",
          assessment: "Functional limitation",
          plan: "Skilled intervention",
          cptCode: code,
        };

        const result = OTComplianceValidator.validateDocumentation(content);
        expect(result.cptCodeValid).toBe(true);
      });
    });

    it("should reject invalid CPT codes", () => {
      const content: DocumentationContent = {
        subjective: "Client reports issues",
        objective: "Assessment completed",
        assessment: "Functional limitation",
        plan: "Skilled intervention",
        cptCode: "99999", // Invalid code
      };

      const result = OTComplianceValidator.validateDocumentation(content);
      expect(result.cptCodeValid).toBe(false);
      expect(result.issues.some((i) => i.code === "OT_BILL_002")).toBe(true);
    });
  });

  describe("Time Validation (8-Minute Rule)", () => {
    it("should enforce 8-minute minimum", () => {
      const content: DocumentationContent = {
        subjective: "Client reports issues",
        objective: "Assessment completed",
        assessment: "Functional limitation",
        plan: "Skilled intervention",
        timeSpent: 5, // Less than 8 minutes
      };

      const result = OTComplianceValidator.validateDocumentation(content);
      expect(result.timeCompliant).toBe(false);
      expect(result.issues.some((i) => i.code === "OT_BILL_001")).toBe(true);
    });

    it("should accept time >= 8 minutes", () => {
      const content: DocumentationContent = {
        subjective: "Client reports issues",
        objective: "Assessment completed",
        assessment: "Functional limitation",
        plan: "Skilled intervention",
        timeSpent: 30,
      };

      const result = OTComplianceValidator.validateDocumentation(content);
      expect(result.timeCompliant).toBe(true);
    });

    it("should flag missing time documentation", () => {
      const content: DocumentationContent = {
        subjective: "Client reports issues",
        objective: "Assessment completed",
        assessment: "Functional limitation",
        plan: "Skilled intervention",
        // timeSpent not provided
      };

      const result = OTComplianceValidator.validateDocumentation(content);
      expect(result.timeDocumented).toBe(false);
    });
  });

  describe("Compliance Status Determination", () => {
    it("should mark as non-compliant with critical issues", () => {
      const content: DocumentationContent = {
        // Missing all SOAP components
      };

      const result = OTComplianceValidator.validateDocumentation(content);
      expect(result.status).toBe("non-compliant");
    });

    it("should mark as warning with high-severity issues", () => {
      const content: DocumentationContent = {
        subjective: "Client reports issues",
        objective: "Assessment completed",
        assessment: "Functional limitation",
        plan: "Skilled intervention",
        cptCode: "99999", // Invalid code (high severity)
      };

      const result = OTComplianceValidator.validateDocumentation(content);
      expect(result.status).toBe("warning");
    });

    it("should mark as needs-review when occupational focus missing", () => {
      const content: DocumentationContent = {
        subjective: "Client reports pain",
        objective: "ROM limited",
        assessment: "Patient has pain", // No occupational focus
        plan: "Therapeutic exercise",
        timeSpent: 30,
      };

      const result = OTComplianceValidator.validateDocumentation(content);
      expect(result.status).toBe("needs-review");
    });

    it("should mark as compliant with all requirements met", () => {
      const content: DocumentationContent = {
        subjective: "Client reports difficulty with ADLs",
        objective: "COPM: Performance 4/10 for dressing",
        assessment: "Functional limitation affecting ADL independence",
        plan: "Skilled ADL training required",
        cptCode: "97535",
        timeSpent: 30,
      };

      const result = OTComplianceValidator.validateDocumentation(content);
      expect(result.status).toBe("compliant");
    });
  });

  describe("Property-Based Tests", () => {
    it("should handle any valid documentation content", () => {
      fc.assert(
        fc.property(
          fc.record({
            subjective: fc.option(fc.string({ minLength: 50 })),
            objective: fc.option(fc.string({ minLength: 50 })),
            assessment: fc.option(fc.string({ minLength: 50 })),
            plan: fc.option(fc.string({ minLength: 50 })),
            cptCode: fc.option(
              fc.oneof(fc.constant("97165"), fc.constant("97535")),
            ),
            timeSpent: fc.option(fc.integer({ min: 8, max: 120 })),
          }),
          (content) => {
            const result = OTComplianceValidator.validateDocumentation(content);
            expect(result).toBeDefined();
            expect(result.discipline).toBe("ot");
            expect(result.evaluationDate).toBeInstanceOf(Date);
          },
        ),
      );
    });

    it("should always have valid status", () => {
      fc.assert(
        fc.property(
          fc.record({
            subjective: fc.option(fc.string()),
            objective: fc.option(fc.string()),
            assessment: fc.option(fc.string()),
            plan: fc.option(fc.string()),
          }),
          (content) => {
            const result = OTComplianceValidator.validateDocumentation(content);
            const validStatuses = [
              "compliant",
              "non-compliant",
              "warning",
              "needs-review",
            ];
            expect(validStatuses).toContain(result.status);
          },
        ),
      );
    });

    it("should have consistent issue severity", () => {
      fc.assert(
        fc.property(
          fc.record({
            subjective: fc.option(fc.string()),
            objective: fc.option(fc.string()),
            assessment: fc.option(fc.string()),
            plan: fc.option(fc.string()),
          }),
          (content) => {
            const result = OTComplianceValidator.validateDocumentation(content);
            result.issues.forEach((issue) => {
              expect(["critical", "high"]).toContain(issue.severity);
            });
          },
        ),
      );
    });
  });

  describe("Compliance Rules Access", () => {
    it("should provide access to compliance rules", () => {
      const rules = OTComplianceValidator.getComplianceRules();
      expect(rules.length).toBeGreaterThan(0);
      expect(rules[0]).toHaveProperty("code");
      expect(rules[0]).toHaveProperty("name");
      expect(rules[0]).toHaveProperty("description");
    });

    it("should provide access to CPT codes", () => {
      const codes = OTComplianceValidator.getCPTCodes();
      expect(codes.length).toBeGreaterThan(0);
      expect(codes[0]).toHaveProperty("code");
      expect(codes[0]).toHaveProperty("name");
    });

    it("should provide access to documentation requirements", () => {
      const requirements = OTComplianceValidator.getDocumentationRequirements();
      expect(requirements.length).toBeGreaterThan(0);
      expect(requirements[0]).toHaveProperty("section");
      expect(requirements[0]).toHaveProperty("requirement");
    });
  });
});

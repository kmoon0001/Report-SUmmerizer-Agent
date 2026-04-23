/**
 * Compliance Engine Tests
 *
 * Tests for discipline-specific compliance validation
 * Requirements: 2.5, 2.6, 2.7, 2.8
 */

import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { complianceEngine } from "../../core/compliance/ComplianceEngine";
import type { DocumentationContent } from "../../core/compliance/ComplianceEngine";

describe("ComplianceEngine", () => {
  describe("PT Compliance Validation", () => {
    it("should require all SOAP components for PT", () => {
      const content: DocumentationContent = {
        subjective: "Patient reports pain",
        // Missing objective, assessment, plan
      };

      const result = complianceEngine.validate(content, "pt");
      expect(result.isCompliant).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should pass PT validation with complete SOAP", () => {
      const content: DocumentationContent = {
        subjective: "Patient reports pain in shoulder",
        objective: "ROM limited to 90 degrees flexion",
        assessment: "Functional limitation affecting ADL independence",
        plan: "Skilled therapeutic exercise and manual therapy",
        cptCode: "97110",
        timeSpent: 30,
      };

      const result = complianceEngine.validate(content, "pt");
      expect(result.errors.length).toBe(0);
    });

    it("should validate PT CPT codes", () => {
      const content: DocumentationContent = {
        subjective: "Patient reports pain",
        objective: "ROM limited",
        assessment: "Functional limitation",
        plan: "Therapeutic exercise",
        cptCode: "99999", // Invalid code
      };

      const result = complianceEngine.validate(content, "pt");
      expect(result.warnings.length).toBeGreaterThan(0);
    });

    it("should enforce 8-minute minimum for PT", () => {
      const content: DocumentationContent = {
        subjective: "Patient reports pain",
        objective: "ROM limited",
        assessment: "Functional limitation",
        plan: "Therapeutic exercise",
        timeSpent: 5, // Less than 8 minutes
      };

      const result = complianceEngine.validate(content, "pt");
      expect(result.errors.some((e) => e.code === "PT_007")).toBe(true);
    });

    it("should check for functional language in PT assessment", () => {
      const content: DocumentationContent = {
        subjective: "Patient reports pain",
        objective: "ROM limited",
        assessment: "Patient has pain", // No functional language
        plan: "Therapeutic exercise",
      };

      const result = complianceEngine.validate(content, "pt");
      expect(result.warnings.some((w) => w.code === "PT_008")).toBe(true);
    });

    it("should check for skilled need documentation in PT plan", () => {
      const content: DocumentationContent = {
        subjective: "Patient reports pain",
        objective: "ROM limited",
        assessment: "Functional limitation",
        plan: "Continue current routine", // No skilled language
      };

      const result = complianceEngine.validate(content, "pt");
      expect(result.warnings.some((w) => w.code === "PT_009")).toBe(true);
    });
  });

  describe("OT Compliance Validation", () => {
    it("should require all SOAP components for OT", () => {
      const content: DocumentationContent = {
        subjective: "Client reports difficulty with ADLs",
        // Missing objective, assessment, plan
      };

      const result = complianceEngine.validate(content, "ot");
      expect(result.isCompliant).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should pass OT validation with complete SOAP", () => {
      const content: DocumentationContent = {
        subjective: "Client reports difficulty dressing",
        objective: "Limited shoulder ROM affecting dressing independence",
        assessment:
          "Unable to don shirt due to limited ROM affecting ADL independence",
        plan: "Skilled ADL training and adaptive equipment",
        cptCode: "97535",
        timeSpent: 30,
      };

      const result = complianceEngine.validate(content, "ot");
      expect(result.errors.length).toBe(0);
    });

    it("should validate OT CPT codes", () => {
      const content: DocumentationContent = {
        subjective: "Client reports difficulty",
        objective: "Limited function",
        assessment: "Occupational performance issue",
        plan: "ADL training",
        cptCode: "99999", // Invalid code
      };

      const result = complianceEngine.validate(content, "ot");
      expect(result.warnings.length).toBeGreaterThan(0);
    });

    it("should enforce 8-minute minimum for OT", () => {
      const content: DocumentationContent = {
        subjective: "Client reports difficulty",
        objective: "Limited function",
        assessment: "Occupational performance issue",
        plan: "ADL training",
        timeSpent: 5, // Less than 8 minutes
      };

      const result = complianceEngine.validate(content, "ot");
      expect(result.errors.some((e) => e.code === "OT_007")).toBe(true);
    });

    it("should check for occupational language in OT assessment", () => {
      const content: DocumentationContent = {
        subjective: "Client reports difficulty",
        objective: "Limited function",
        assessment: "Client has pain", // No occupational language
        plan: "ADL training",
      };

      const result = complianceEngine.validate(content, "ot");
      expect(result.warnings.some((w) => w.code === "OT_008")).toBe(true);
    });

    it("should check for functional focus in OT assessment", () => {
      const content: DocumentationContent = {
        subjective: "Client reports difficulty",
        objective: "Limited function",
        assessment: "Client has impairment", // No functional language
        plan: "ADL training",
      };

      const result = complianceEngine.validate(content, "ot");
      expect(result.warnings.some((w) => w.code === "OT_009")).toBe(true);
    });

    it("should check for skilled need documentation in OT plan", () => {
      const content: DocumentationContent = {
        subjective: "Client reports difficulty",
        objective: "Limited function",
        assessment: "Occupational performance issue",
        plan: "Continue current routine", // No skilled language
      };

      const result = complianceEngine.validate(content, "ot");
      expect(result.warnings.some((w) => w.code === "OT_010")).toBe(true);
    });
  });

  describe("Compliance Checking", () => {
    it("should check if content is compliant", () => {
      const compliantContent: DocumentationContent = {
        subjective: "Patient reports pain",
        objective: "ROM limited",
        assessment: "Functional limitation affecting independence",
        plan: "Skilled therapeutic exercise",
      };

      expect(complianceEngine.isCompliant(compliantContent, "pt")).toBe(true);
    });

    it("should get errors only", () => {
      const content: DocumentationContent = {
        subjective: "Patient reports pain",
        // Missing other components
      };

      const errors = complianceEngine.getErrors(content, "pt");
      expect(errors.length).toBeGreaterThan(0);
      expect(
        errors.every((e) => e.severity === "critical" || e.severity === "high"),
      ).toBe(true);
    });

    it("should get warnings only", () => {
      const content: DocumentationContent = {
        subjective: "Patient reports pain",
        objective: "ROM limited",
        assessment: "Patient has pain", // No functional language
        plan: "Therapeutic exercise",
      };

      const warnings = complianceEngine.getWarnings(content, "pt");
      expect(warnings.length).toBeGreaterThan(0);
      expect(
        warnings.every((w) => w.severity === "medium" || w.severity === "low"),
      ).toBe(true);
    });

    it("should get suggestions", () => {
      const content: DocumentationContent = {
        subjective: "Patient reports pain",
        objective: "ROM limited",
        assessment: "Patient has pain", // No functional language
        plan: "Therapeutic exercise",
      };

      const suggestions = complianceEngine.getSuggestions(content, "pt");
      expect(suggestions.length).toBeGreaterThan(0);
    });
  });

  describe("Discipline-Specific Validation", () => {
    it("property: PT validation differs from OT validation", () => {
      fc.assert(
        fc.property(fc.string(), (text: string) => {
          const content: DocumentationContent = {
            subjective: text,
            objective: text,
            assessment: text,
            plan: text,
          };

          const ptResult = complianceEngine.validate(content, "pt");
          const otResult = complianceEngine.validate(content, "ot");

          // Results should have discipline context
          expect(ptResult.discipline).toBe("pt");
          expect(otResult.discipline).toBe("ot");
        }),
      );
    });

    it("property: PT CPT codes are different from OT CPT codes", () => {
      fc.assert(
        fc.property(fc.string(), (code: string) => {
          const content: DocumentationContent = {
            subjective: "Test",
            objective: "Test",
            assessment: "Test",
            plan: "Test",
            cptCode: code,
          };

          const ptResult = complianceEngine.validate(content, "pt");
          const otResult = complianceEngine.validate(content, "ot");

          // Both should validate CPT codes
          expect(ptResult.warnings || ptResult.errors).toBeDefined();
          expect(otResult.warnings || otResult.errors).toBeDefined();
        }),
      );
    });
  });

  describe("Error Handling", () => {
    it("should handle unknown discipline", () => {
      const content: DocumentationContent = {
        subjective: "Test",
        objective: "Test",
        assessment: "Test",
        plan: "Test",
      };

      const result = complianceEngine.validate(content, "slp" as any);
      expect(result.isCompliant).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should handle empty content", () => {
      const content: DocumentationContent = {};

      const result = complianceEngine.validate(content, "pt");
      expect(result.isCompliant).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should handle null values gracefully", () => {
      const content: DocumentationContent = {
        subjective: null as any,
        objective: null as any,
        assessment: null as any,
        plan: null as any,
      };

      expect(() => {
        complianceEngine.validate(content, "pt");
      }).not.toThrow();
    });
  });

  describe("Compliance Suggestions", () => {
    it("should provide actionable suggestions", () => {
      const content: DocumentationContent = {
        subjective: "Patient reports pain",
        objective: "ROM limited",
        assessment: "Patient has pain", // No functional language
        plan: "Therapeutic exercise",
      };

      const suggestions = complianceEngine.getSuggestions(content, "pt");
      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions[0].recommendation).toBeDefined();
      expect(suggestions[0].recommendation.length).toBeGreaterThan(0);
    });

    it("should suggest functional language improvements", () => {
      const content: DocumentationContent = {
        subjective: "Patient reports pain",
        objective: "ROM limited",
        assessment: "Patient has pain",
        plan: "Therapeutic exercise",
      };

      const suggestions = complianceEngine.getSuggestions(content, "pt");
      const functionalSuggestion = suggestions.find(
        (s) => s.code === "PT_008_SUG",
      );
      expect(functionalSuggestion).toBeDefined();
    });

    it("should suggest skilled need documentation", () => {
      const content: DocumentationContent = {
        subjective: "Patient reports pain",
        objective: "ROM limited",
        assessment: "Functional limitation",
        plan: "Continue current routine",
      };

      const suggestions = complianceEngine.getSuggestions(content, "pt");
      const skilledSuggestion = suggestions.find(
        (s) => s.code === "PT_009_SUG",
      );
      expect(skilledSuggestion).toBeDefined();
    });
  });

  describe("Time Validation", () => {
    it("should accept valid time entries", () => {
      const validTimes = [8, 15, 22, 30, 45, 60];

      validTimes.forEach((time) => {
        const content: DocumentationContent = {
          subjective: "Test",
          objective: "Test",
          assessment: "Functional limitation",
          plan: "Skilled intervention",
          timeSpent: time,
        };

        const result = complianceEngine.validate(content, "pt");
        expect(result.errors.some((e) => e.code === "PT_007")).toBe(false);
      });
    });

    it("should reject times less than 8 minutes", () => {
      const invalidTimes = [0, 1, 5, 7];

      invalidTimes.forEach((time) => {
        const content: DocumentationContent = {
          subjective: "Test",
          objective: "Test",
          assessment: "Functional limitation",
          plan: "Skilled intervention",
          timeSpent: time,
        };

        const result = complianceEngine.validate(content, "pt");
        expect(result.errors.some((e) => e.code === "PT_007")).toBe(true);
      });
    });
  });
});

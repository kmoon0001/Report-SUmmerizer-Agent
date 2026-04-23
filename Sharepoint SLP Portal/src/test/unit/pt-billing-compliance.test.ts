import { describe, it, expect } from "vitest";
import {
  getPTBillingCodeByCode,
  getPTBillingCodesByCategory,
  searchPTBillingCodes,
  getAllPTBillingCodes,
  getPTBillingCodeCategories,
  getPTComplianceStandardById,
  getPTComplianceStandardsByCategory,
  searchPTComplianceStandards,
  getAllPTComplianceStandards,
  getPTComplianceStandardCategories,
} from "../../data/pt-billing-compliance";

describe("PT Module 10: Billing & Compliance", () => {
  describe("Billing Codes", () => {
    describe("getPTBillingCodeByCode", () => {
      it("should return billing code by valid code", () => {
        const code = getPTBillingCodeByCode("97161");
        expect(code).toBeDefined();
        expect(code?.description).toBe("PT Evaluation - Low Complexity");
      });

      it("should return undefined for invalid code", () => {
        const code = getPTBillingCodeByCode("invalid-code");
        expect(code).toBeUndefined();
      });

      it("should return correct code properties", () => {
        const code = getPTBillingCodeByCode("97161");
        expect(code?.category).toBe("evaluation");
        expect(code?.unitValue).toBeGreaterThan(0);
        expect(code?.indications.length).toBeGreaterThan(0);
      });
    });

    describe("getPTBillingCodesByCategory", () => {
      it("should return evaluation codes", () => {
        const codes = getPTBillingCodesByCategory("evaluation");
        expect(codes.length).toBeGreaterThan(0);
        expect(codes.every((c) => c.category === "evaluation")).toBe(true);
      });

      it("should return treatment codes", () => {
        const codes = getPTBillingCodesByCategory("treatment");
        expect(codes.length).toBeGreaterThan(0);
        expect(codes.every((c) => c.category === "treatment")).toBe(true);
      });

      it("should return empty array for non-existent category", () => {
        const codes = getPTBillingCodesByCategory("non-existent");
        expect(codes.length).toBe(0);
      });
    });

    describe("searchPTBillingCodes", () => {
      it("should find code by code number", () => {
        const results = searchPTBillingCodes("97161");
        expect(results.length).toBeGreaterThan(0);
        expect(results.some((c) => c.code === "97161")).toBe(true);
      });

      it("should find code by description", () => {
        const results = searchPTBillingCodes("Evaluation");
        expect(results.length).toBeGreaterThan(0);
      });

      it("should be case-insensitive", () => {
        const results1 = searchPTBillingCodes("evaluation");
        const results2 = searchPTBillingCodes("EVALUATION");
        expect(results1.length).toBe(results2.length);
      });

      it("should return empty array for non-matching query", () => {
        const results = searchPTBillingCodes("xyz123nonexistent");
        expect(results.length).toBe(0);
      });
    });

    describe("getAllPTBillingCodes", () => {
      it("should return all PT billing codes", () => {
        const codes = getAllPTBillingCodes();
        expect(codes.length).toBe(10);
      });

      it("should have valid code structure", () => {
        const codes = getAllPTBillingCodes();
        codes.forEach((code) => {
          expect(code.code).toBeDefined();
          expect(code.description).toBeDefined();
          expect(code.category).toBeDefined();
          expect(code.unitValue).toBeGreaterThan(0);
        });
      });

      it("should have all required properties", () => {
        const codes = getAllPTBillingCodes();
        codes.forEach((c) => {
          expect(c.timeRequired).toBeDefined();
          expect(c.indications.length).toBeGreaterThan(0);
          expect(c.documentation.length).toBeGreaterThan(0);
          expect(c.complianceNotes.length).toBeGreaterThan(0);
        });
      });
    });

    describe("getPTBillingCodeCategories", () => {
      it("should return all categories", () => {
        const categories = getPTBillingCodeCategories();
        expect(categories.length).toBeGreaterThan(0);
      });

      it("should include expected categories", () => {
        const categories = getPTBillingCodeCategories();
        expect(categories).toContain("evaluation");
        expect(categories).toContain("treatment");
      });

      it("should not have duplicates", () => {
        const categories = getPTBillingCodeCategories();
        const uniqueCategories = new Set(categories);
        expect(categories.length).toBe(uniqueCategories.size);
      });
    });

    describe("Billing Code Properties", () => {
      it("should have meaningful indications", () => {
        const codes = getAllPTBillingCodes();
        codes.forEach((c) => {
          expect(c.indications.length).toBeGreaterThan(0);
          expect(c.indications.every((i) => i.length > 0)).toBe(true);
        });
      });

      it("should have documentation requirements", () => {
        const codes = getAllPTBillingCodes();
        codes.forEach((c) => {
          expect(c.documentation.length).toBeGreaterThan(0);
          expect(c.documentation.every((d) => d.length > 0)).toBe(true);
        });
      });

      it("should have compliance notes", () => {
        const codes = getAllPTBillingCodes();
        codes.forEach((c) => {
          expect(c.complianceNotes.length).toBeGreaterThan(0);
          expect(c.complianceNotes.every((n) => n.length > 0)).toBe(true);
        });
      });
    });
  });

  describe("Compliance Standards", () => {
    describe("getPTComplianceStandardById", () => {
      it("should return compliance standard by valid ID", () => {
        const standard = getPTComplianceStandardById("pt-comp-001");
        expect(standard).toBeDefined();
        expect(standard?.name).toBe("Documentation Standards");
      });

      it("should return undefined for invalid ID", () => {
        const standard = getPTComplianceStandardById("invalid-id");
        expect(standard).toBeUndefined();
      });

      it("should return correct standard properties", () => {
        const standard = getPTComplianceStandardById("pt-comp-001");
        expect(standard?.category).toBe("documentation");
        expect(standard?.requirements.length).toBeGreaterThan(0);
        expect(standard?.penalties.length).toBeGreaterThan(0);
      });
    });

    describe("getPTComplianceStandardsByCategory", () => {
      it("should return documentation standards", () => {
        const standards = getPTComplianceStandardsByCategory("documentation");
        expect(standards.length).toBeGreaterThan(0);
        expect(standards.every((s) => s.category === "documentation")).toBe(
          true,
        );
      });

      it("should return billing standards", () => {
        const standards = getPTComplianceStandardsByCategory("billing");
        expect(standards.length).toBeGreaterThan(0);
        expect(standards.every((s) => s.category === "billing")).toBe(true);
      });

      it("should return privacy standards", () => {
        const standards = getPTComplianceStandardsByCategory("privacy");
        expect(standards.length).toBeGreaterThan(0);
        expect(standards.every((s) => s.category === "privacy")).toBe(true);
      });

      it("should return empty array for non-existent category", () => {
        const standards = getPTComplianceStandardsByCategory("non-existent");
        expect(standards.length).toBe(0);
      });
    });

    describe("searchPTComplianceStandards", () => {
      it("should find standard by name", () => {
        const results = searchPTComplianceStandards("Documentation");
        expect(results.length).toBeGreaterThan(0);
        expect(results.some((s) => s.name.includes("Documentation"))).toBe(
          true,
        );
      });

      it("should find standard by description", () => {
        const results = searchPTComplianceStandards("HIPAA");
        expect(results.length).toBeGreaterThan(0);
      });

      it("should be case-insensitive", () => {
        const results1 = searchPTComplianceStandards("documentation");
        const results2 = searchPTComplianceStandards("DOCUMENTATION");
        expect(results1.length).toBe(results2.length);
      });

      it("should return empty array for non-matching query", () => {
        const results = searchPTComplianceStandards("xyz123nonexistent");
        expect(results.length).toBe(0);
      });
    });

    describe("getAllPTComplianceStandards", () => {
      it("should return all PT compliance standards", () => {
        const standards = getAllPTComplianceStandards();
        expect(standards.length).toBe(10);
      });

      it("should have valid standard structure", () => {
        const standards = getAllPTComplianceStandards();
        standards.forEach((standard) => {
          expect(standard.id).toBeDefined();
          expect(standard.name).toBeDefined();
          expect(standard.category).toBeDefined();
          expect(standard.description).toBeDefined();
        });
      });

      it("should have all required properties", () => {
        const standards = getAllPTComplianceStandards();
        standards.forEach((s) => {
          expect(s.requirements.length).toBeGreaterThan(0);
          expect(s.documentation.length).toBeGreaterThan(0);
          expect(s.penalties.length).toBeGreaterThan(0);
          expect(s.source).toBeDefined();
          expect(s.citation).toBeDefined();
          expect(s.lastUpdated).toBeInstanceOf(Date);
        });
      });
    });

    describe("getPTComplianceStandardCategories", () => {
      it("should return all categories", () => {
        const categories = getPTComplianceStandardCategories();
        expect(categories.length).toBeGreaterThan(0);
      });

      it("should include expected categories", () => {
        const categories = getPTComplianceStandardCategories();
        expect(categories).toContain("documentation");
        expect(categories).toContain("billing");
        expect(categories).toContain("privacy");
      });

      it("should not have duplicates", () => {
        const categories = getPTComplianceStandardCategories();
        const uniqueCategories = new Set(categories);
        expect(categories.length).toBe(uniqueCategories.size);
      });
    });

    describe("Compliance Standard Properties", () => {
      it("should have meaningful requirements", () => {
        const standards = getAllPTComplianceStandards();
        standards.forEach((s) => {
          expect(s.requirements.length).toBeGreaterThan(0);
          expect(s.requirements.every((r) => r.length > 0)).toBe(true);
        });
      });

      it("should have documentation requirements", () => {
        const standards = getAllPTComplianceStandards();
        standards.forEach((s) => {
          expect(s.documentation.length).toBeGreaterThan(0);
          expect(s.documentation.every((d) => d.length > 0)).toBe(true);
        });
      });

      it("should have penalties", () => {
        const standards = getAllPTComplianceStandards();
        standards.forEach((s) => {
          expect(s.penalties.length).toBeGreaterThan(0);
          expect(s.penalties.every((p) => p.length > 0)).toBe(true);
        });
      });

      it("should have source attribution", () => {
        const standards = getAllPTComplianceStandards();
        standards.forEach((s) => {
          expect(s.source).toBeDefined();
          expect(s.source.length).toBeGreaterThan(0);
          expect(s.citation).toBeDefined();
          expect(s.citation.length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe("Module Coverage", () => {
    it("should have 10 billing codes", () => {
      const codes = getAllPTBillingCodes();
      expect(codes.length).toBe(10);
    });

    it("should have 10 compliance standards", () => {
      const standards = getAllPTComplianceStandards();
      expect(standards.length).toBe(10);
    });

    it("should cover major billing categories", () => {
      const codes = getAllPTBillingCodes();
      const categories = codes.map((c) => c.category);
      expect(categories).toContain("evaluation");
      expect(categories).toContain("treatment");
    });

    it("should cover major compliance categories", () => {
      const standards = getAllPTComplianceStandards();
      const categories = standards.map((s) => s.category);
      expect(categories).toContain("documentation");
      expect(categories).toContain("billing");
      expect(categories).toContain("privacy");
    });
  });
});

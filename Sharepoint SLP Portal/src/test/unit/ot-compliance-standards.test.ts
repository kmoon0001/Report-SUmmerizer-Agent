import { describe, it, expect } from "vitest";
import {
  getOTBillingCodeByCode,
  getOTBillingCodesByCategory,
  searchOTBillingCodes,
  getAllOTBillingCodes,
  getOTBillingCodeCategories,
  getOTComplianceStandardById,
  getOTComplianceStandardsByCategory,
  searchOTComplianceStandards,
  getAllOTComplianceStandards,
  getOTComplianceStandardCategories,
} from "../../data/ot-compliance-standards";

describe("OT Module 5: Compliance and Standards", () => {
  describe("Billing Codes", () => {
    describe("getOTBillingCodeByCode", () => {
      it("should return billing code by valid code", () => {
        const code = getOTBillingCodeByCode("97161");
        expect(code).toBeDefined();
        expect(code?.description).toBe("OT Evaluation - Low Complexity");
      });

      it("should return undefined for invalid code", () => {
        const code = getOTBillingCodeByCode("invalid-code");
        expect(code).toBeUndefined();
      });

      it("should return correct code properties", () => {
        const code = getOTBillingCodeByCode("97161");
        expect(code?.category).toBe("evaluation");
        expect(code?.unitValue).toBeGreaterThan(0);
        expect(code?.indications.length).toBeGreaterThan(0);
      });
    });

    describe("getOTBillingCodesByCategory", () => {
      it("should return evaluation codes", () => {
        const codes = getOTBillingCodesByCategory("evaluation");
        expect(codes.length).toBeGreaterThan(0);
        expect(codes.every((c) => c.category === "evaluation")).toBe(true);
      });

      it("should return treatment codes", () => {
        const codes = getOTBillingCodesByCategory("treatment");
        expect(codes.length).toBeGreaterThan(0);
        expect(codes.every((c) => c.category === "treatment")).toBe(true);
      });

      it("should return empty array for non-existent category", () => {
        const codes = getOTBillingCodesByCategory("non-existent");
        expect(codes.length).toBe(0);
      });
    });

    describe("searchOTBillingCodes", () => {
      it("should find code by code number", () => {
        const results = searchOTBillingCodes("97161");
        expect(results.length).toBeGreaterThan(0);
        expect(results.some((c) => c.code === "97161")).toBe(true);
      });

      it("should find code by description", () => {
        const results = searchOTBillingCodes("Evaluation");
        expect(results.length).toBeGreaterThan(0);
      });

      it("should be case-insensitive", () => {
        const results1 = searchOTBillingCodes("evaluation");
        const results2 = searchOTBillingCodes("EVALUATION");
        expect(results1.length).toBe(results2.length);
      });

      it("should return empty array for non-matching query", () => {
        const results = searchOTBillingCodes("xyz123nonexistent");
        expect(results.length).toBe(0);
      });
    });

    describe("getAllOTBillingCodes", () => {
      it("should return all OT billing codes", () => {
        const codes = getAllOTBillingCodes();
        expect(codes.length).toBe(10);
      });

      it("should have valid code structure", () => {
        const codes = getAllOTBillingCodes();
        codes.forEach((code) => {
          expect(code.code).toBeDefined();
          expect(code.description).toBeDefined();
          expect(code.category).toBeDefined();
          expect(code.unitValue).toBeGreaterThan(0);
        });
      });

      it("should have all required properties", () => {
        const codes = getAllOTBillingCodes();
        codes.forEach((c) => {
          expect(c.timeRequired).toBeDefined();
          expect(c.indications.length).toBeGreaterThan(0);
          expect(c.documentation.length).toBeGreaterThan(0);
          expect(c.complianceNotes.length).toBeGreaterThan(0);
        });
      });
    });

    describe("getOTBillingCodeCategories", () => {
      it("should return all categories", () => {
        const categories = getOTBillingCodeCategories();
        expect(categories.length).toBeGreaterThan(0);
      });

      it("should include expected categories", () => {
        const categories = getOTBillingCodeCategories();
        expect(categories).toContain("evaluation");
        expect(categories).toContain("treatment");
      });

      it("should not have duplicates", () => {
        const categories = getOTBillingCodeCategories();
        const uniqueCategories = new Set(categories);
        expect(categories.length).toBe(uniqueCategories.size);
      });
    });

    describe("Billing Code Properties", () => {
      it("should have meaningful indications", () => {
        const codes = getAllOTBillingCodes();
        codes.forEach((c) => {
          expect(c.indications.length).toBeGreaterThan(0);
          expect(c.indications.every((i) => i.length > 0)).toBe(true);
        });
      });

      it("should have documentation requirements", () => {
        const codes = getAllOTBillingCodes();
        codes.forEach((c) => {
          expect(c.documentation.length).toBeGreaterThan(0);
          expect(c.documentation.every((d) => d.length > 0)).toBe(true);
        });
      });

      it("should have compliance notes", () => {
        const codes = getAllOTBillingCodes();
        codes.forEach((c) => {
          expect(c.complianceNotes.length).toBeGreaterThan(0);
          expect(c.complianceNotes.every((n) => n.length > 0)).toBe(true);
        });
      });
    });
  });

  describe("Compliance Standards", () => {
    describe("getOTComplianceStandardById", () => {
      it("should return compliance standard by valid ID", () => {
        const standard = getOTComplianceStandardById("ot-comp-001");
        expect(standard).toBeDefined();
        expect(standard?.name).toBe("Documentation Standards");
      });

      it("should return undefined for invalid ID", () => {
        const standard = getOTComplianceStandardById("invalid-id");
        expect(standard).toBeUndefined();
      });

      it("should return correct standard properties", () => {
        const standard = getOTComplianceStandardById("ot-comp-001");
        expect(standard?.category).toBe("documentation");
        expect(standard?.requirements.length).toBeGreaterThan(0);
        expect(standard?.penalties.length).toBeGreaterThan(0);
      });
    });

    describe("getOTComplianceStandardsByCategory", () => {
      it("should return documentation standards", () => {
        const standards = getOTComplianceStandardsByCategory("documentation");
        expect(standards.length).toBeGreaterThan(0);
        expect(standards.every((s) => s.category === "documentation")).toBe(
          true,
        );
      });

      it("should return billing standards", () => {
        const standards = getOTComplianceStandardsByCategory("billing");
        expect(standards.length).toBeGreaterThan(0);
        expect(standards.every((s) => s.category === "billing")).toBe(true);
      });

      it("should return privacy standards", () => {
        const standards = getOTComplianceStandardsByCategory("privacy");
        expect(standards.length).toBeGreaterThan(0);
        expect(standards.every((s) => s.category === "privacy")).toBe(true);
      });

      it("should return empty array for non-existent category", () => {
        const standards = getOTComplianceStandardsByCategory("non-existent");
        expect(standards.length).toBe(0);
      });
    });

    describe("searchOTComplianceStandards", () => {
      it("should find standard by name", () => {
        const results = searchOTComplianceStandards("Documentation");
        expect(results.length).toBeGreaterThan(0);
        expect(results.some((s) => s.name.includes("Documentation"))).toBe(
          true,
        );
      });

      it("should find standard by description", () => {
        const results = searchOTComplianceStandards("HIPAA");
        expect(results.length).toBeGreaterThan(0);
      });

      it("should be case-insensitive", () => {
        const results1 = searchOTComplianceStandards("documentation");
        const results2 = searchOTComplianceStandards("DOCUMENTATION");
        expect(results1.length).toBe(results2.length);
      });

      it("should return empty array for non-matching query", () => {
        const results = searchOTComplianceStandards("xyz123nonexistent");
        expect(results.length).toBe(0);
      });
    });

    describe("getAllOTComplianceStandards", () => {
      it("should return all OT compliance standards", () => {
        const standards = getAllOTComplianceStandards();
        expect(standards.length).toBe(10);
      });

      it("should have valid standard structure", () => {
        const standards = getAllOTComplianceStandards();
        standards.forEach((standard) => {
          expect(standard.id).toBeDefined();
          expect(standard.name).toBeDefined();
          expect(standard.category).toBeDefined();
          expect(standard.description).toBeDefined();
        });
      });

      it("should have all required properties", () => {
        const standards = getAllOTComplianceStandards();
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

    describe("getOTComplianceStandardCategories", () => {
      it("should return all categories", () => {
        const categories = getOTComplianceStandardCategories();
        expect(categories.length).toBeGreaterThan(0);
      });

      it("should include expected categories", () => {
        const categories = getOTComplianceStandardCategories();
        expect(categories).toContain("documentation");
        expect(categories).toContain("billing");
        expect(categories).toContain("privacy");
      });

      it("should not have duplicates", () => {
        const categories = getOTComplianceStandardCategories();
        const uniqueCategories = new Set(categories);
        expect(categories.length).toBe(uniqueCategories.size);
      });
    });

    describe("Compliance Standard Properties", () => {
      it("should have meaningful requirements", () => {
        const standards = getAllOTComplianceStandards();
        standards.forEach((s) => {
          expect(s.requirements.length).toBeGreaterThan(0);
          expect(s.requirements.every((r) => r.length > 0)).toBe(true);
        });
      });

      it("should have documentation requirements", () => {
        const standards = getAllOTComplianceStandards();
        standards.forEach((s) => {
          expect(s.documentation.length).toBeGreaterThan(0);
          expect(s.documentation.every((d) => d.length > 0)).toBe(true);
        });
      });

      it("should have penalties", () => {
        const standards = getAllOTComplianceStandards();
        standards.forEach((s) => {
          expect(s.penalties.length).toBeGreaterThan(0);
          expect(s.penalties.every((p) => p.length > 0)).toBe(true);
        });
      });

      it("should have source attribution", () => {
        const standards = getAllOTComplianceStandards();
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
      const codes = getAllOTBillingCodes();
      expect(codes.length).toBe(10);
    });

    it("should have 10 compliance standards", () => {
      const standards = getAllOTComplianceStandards();
      expect(standards.length).toBe(10);
    });

    it("should cover major billing categories", () => {
      const codes = getAllOTBillingCodes();
      const categories = codes.map((c) => c.category);
      expect(categories).toContain("evaluation");
      expect(categories).toContain("treatment");
    });

    it("should cover major compliance categories", () => {
      const standards = getAllOTComplianceStandards();
      const categories = standards.map((s) => s.category);
      expect(categories).toContain("documentation");
      expect(categories).toContain("billing");
      expect(categories).toContain("privacy");
    });
  });
});

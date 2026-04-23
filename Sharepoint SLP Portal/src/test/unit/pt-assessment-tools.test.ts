import { describe, it, expect } from "vitest";
import {
  getPTAssessmentToolById,
  getPTAssessmentToolsByCategory,
  searchPTAssessmentTools,
  getAllPTAssessmentTools,
  getQuickPTAssessmentTools,
  getPTAssessmentToolCategories,
  type PTAssessmentTool,
} from "../../data/pt-assessment-tools";

describe("PT Module 3: Assessment Tools", () => {
  describe("getPTAssessmentToolById", () => {
    it("should return tool by valid ID", () => {
      const tool = getPTAssessmentToolById("pt-at-001");
      expect(tool).toBeDefined();
      expect(tool?.name).toBe("Functional Capacity Evaluation");
    });

    it("should return undefined for invalid ID", () => {
      const tool = getPTAssessmentToolById("invalid-id");
      expect(tool).toBeUndefined();
    });

    it("should return correct tool properties", () => {
      const tool = getPTAssessmentToolById("pt-at-001");
      expect(tool?.category).toBe("functional-capacity");
      expect(tool?.components.length).toBeGreaterThan(0);
      expect(tool?.adminTime).toBeGreaterThan(0);
    });
  });

  describe("getPTAssessmentToolsByCategory", () => {
    it("should return functional-capacity tools", () => {
      const tools = getPTAssessmentToolsByCategory("functional-capacity");
      expect(tools.length).toBeGreaterThan(0);
      expect(tools.every((t) => t.category === "functional-capacity")).toBe(
        true,
      );
    });

    it("should return gait-analysis tools", () => {
      const tools = getPTAssessmentToolsByCategory("gait-analysis");
      expect(tools.length).toBeGreaterThan(0);
      expect(tools.every((t) => t.category === "gait-analysis")).toBe(true);
    });

    it("should return balance tools", () => {
      const tools = getPTAssessmentToolsByCategory("balance");
      expect(tools.length).toBeGreaterThan(0);
      expect(tools.every((t) => t.category === "balance")).toBe(true);
    });

    it("should return neurological tools", () => {
      const tools = getPTAssessmentToolsByCategory("neurological");
      expect(tools.length).toBeGreaterThan(0);
      expect(tools.every((t) => t.category === "neurological")).toBe(true);
    });
  });

  describe("searchPTAssessmentTools", () => {
    it("should find tool by name", () => {
      const results = searchPTAssessmentTools("Functional Capacity");
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((t) => t.name.includes("Functional Capacity"))).toBe(
        true,
      );
    });

    it("should find tool by abbreviation", () => {
      const results = searchPTAssessmentTools("FCE");
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((t) => t.abbreviation === "FCE")).toBe(true);
    });

    it("should be case-insensitive", () => {
      const results1 = searchPTAssessmentTools("gait");
      const results2 = searchPTAssessmentTools("GAIT");
      expect(results1.length).toBe(results2.length);
    });

    it("should return empty array for non-matching query", () => {
      const results = searchPTAssessmentTools("xyz123nonexistent");
      expect(results.length).toBe(0);
    });
  });

  describe("getAllPTAssessmentTools", () => {
    it("should return all PT assessment tools", () => {
      const tools = getAllPTAssessmentTools();
      expect(tools.length).toBe(10);
    });

    it("should have valid tool structure", () => {
      const tools = getAllPTAssessmentTools();
      tools.forEach((tool) => {
        expect(tool.id).toBeDefined();
        expect(tool.name).toBeDefined();
        expect(tool.abbreviation).toBeDefined();
        expect(tool.category).toBeDefined();
        expect(tool.components.length).toBeGreaterThan(0);
        expect(tool.adminTime).toBeGreaterThan(0);
        expect(tool.equipment.length).toBeGreaterThan(0);
        expect(tool.precautions.length).toBeGreaterThan(0);
      });
    });

    it("should have all required properties", () => {
      const tools = getAllPTAssessmentTools();
      tools.forEach((t) => {
        expect(t.normalValues).toBeDefined();
        expect(t.abnormalFindings.length).toBeGreaterThan(0);
        expect(t.clinicalSignificance).toBeDefined();
        expect(t.source).toBeDefined();
        expect(t.citation).toBeDefined();
        expect(t.lastUpdated).toBeInstanceOf(Date);
      });
    });
  });

  describe("getQuickPTAssessmentTools", () => {
    it("should return tools with admin time < 20 minutes", () => {
      const tools = getQuickPTAssessmentTools();
      expect(tools.length).toBeGreaterThan(0);
      expect(tools.every((t) => t.adminTime < 20)).toBe(true);
    });

    it("should include pain assessment", () => {
      const tools = getQuickPTAssessmentTools();
      expect(tools.some((t) => t.abbreviation === "PAP")).toBe(true);
    });
  });

  describe("getPTAssessmentToolCategories", () => {
    it("should return all categories", () => {
      const categories = getPTAssessmentToolCategories();
      expect(categories.length).toBeGreaterThan(0);
    });

    it("should include expected categories", () => {
      const categories = getPTAssessmentToolCategories();
      expect(categories).toContain("functional-capacity");
      expect(categories).toContain("gait-analysis");
      expect(categories).toContain("balance");
      expect(categories).toContain("neurological");
    });
  });

  describe("Components", () => {
    it("should have meaningful components", () => {
      const tools = getAllPTAssessmentTools();
      tools.forEach((t) => {
        expect(t.components.length).toBeGreaterThan(0);
        expect(t.components.every((c) => c.length > 0)).toBe(true);
      });
    });
  });

  describe("Equipment", () => {
    it("should list required equipment", () => {
      const tools = getAllPTAssessmentTools();
      tools.forEach((t) => {
        expect(t.equipment.length).toBeGreaterThan(0);
        expect(t.equipment.every((e) => e.length > 0)).toBe(true);
      });
    });
  });

  describe("Precautions", () => {
    it("should have precautions", () => {
      const tools = getAllPTAssessmentTools();
      tools.forEach((t) => {
        expect(t.precautions.length).toBeGreaterThan(0);
        expect(t.precautions.every((p) => p.length > 0)).toBe(true);
      });
    });
  });

  describe("Contraindications", () => {
    it("should have contraindications where applicable", () => {
      const tools = getAllPTAssessmentTools();
      tools.forEach((t) => {
        expect(Array.isArray(t.contraindications)).toBe(true);
      });
    });
  });

  describe("Normal Values", () => {
    it("should define normal values", () => {
      const tools = getAllPTAssessmentTools();
      tools.forEach((t) => {
        expect(t.normalValues).toBeDefined();
        expect(t.normalValues.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Abnormal Findings", () => {
    it("should list abnormal findings", () => {
      const tools = getAllPTAssessmentTools();
      tools.forEach((t) => {
        expect(t.abnormalFindings.length).toBeGreaterThan(0);
        expect(t.abnormalFindings.every((f) => f.length > 0)).toBe(true);
      });
    });
  });

  describe("Clinical Significance", () => {
    it("should explain clinical significance", () => {
      const tools = getAllPTAssessmentTools();
      tools.forEach((t) => {
        expect(t.clinicalSignificance).toBeDefined();
        expect(t.clinicalSignificance.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Source Attribution", () => {
    it("should have source for each tool", () => {
      const tools = getAllPTAssessmentTools();
      tools.forEach((t) => {
        expect(t.source).toBeDefined();
        expect(t.source.length).toBeGreaterThan(0);
      });
    });

    it("should have citation for each tool", () => {
      const tools = getAllPTAssessmentTools();
      tools.forEach((t) => {
        expect(t.citation).toBeDefined();
        expect(t.citation.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Admin Time", () => {
    it("should have reasonable admin times", () => {
      const tools = getAllPTAssessmentTools();
      tools.forEach((t) => {
        expect(t.adminTime).toBeGreaterThan(0);
        expect(t.adminTime).toBeLessThan(180);
      });
    });
  });

  describe("Tool Coverage", () => {
    it("should cover major assessment categories", () => {
      const tools = getAllPTAssessmentTools();
      const categories = tools.map((t) => t.category);
      expect(categories).toContain("functional-capacity");
      expect(categories).toContain("gait-analysis");
      expect(categories).toContain("balance");
      expect(categories).toContain("neurological");
      expect(categories).toContain("cardiovascular");
    });
  });
});
